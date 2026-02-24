# PostgreSQL Timezone Error in Spring Boot with Hibernate

## Error Message

```
Unable to obtain isolated JDBC connection
FATAL: invalid value for parameter "TimeZone": "Asia/Calcutta"
```

This error appeared when starting a Spring Boot application using Hibernate ORM and PostgreSQL.

---

## What This Error Means

PostgreSQL validates timezone names strictly using the IANA timezone database.

Java, Hibernate, Docker images, operating systems, and PostgreSQL do not always use identical timezone aliases.

The application was trying to set the session timezone during connection creation:

```
options=-c TimeZone=Asia/Calcutta
```

PostgreSQL 16 does not recognize `Asia/Calcutta` anymore because it has been deprecated and replaced with:

```
Asia/Kolkata
```

So PostgreSQL rejected the connection before Hibernate could even start.

---

## Why It Happened

### 1. Timezone Alias Mismatch

Older systems and some Java environments still map Indian Standard Time as `Asia/Calcutta`.
PostgreSQL only accepts canonical IANA names.

Result

Java accepted it
PostgreSQL rejected it
Connection failed

---

### 2. How Hibernate Sends Timezone

Hibernate automatically sends timezone when this property is present:

```
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata
```

The PostgreSQL driver internally converts it to a connection parameter:

```
options=-c TimeZone=...
```

If the value is invalid for PostgreSQL, the database refuses the connection immediately.

---

## Step by Step Debugging Process

### Step 1: Initial Failure

Application startup failed with JDBC connection error.

We verified:

* Database container was running
* Credentials were correct
* Port mapping worked

This confirmed it was not a networking issue.

---

### Step 2: Inspect Full Exception

Full stacktrace revealed:

```
invalid value for parameter "TimeZone"
```

This indicated PostgreSQL rejected a startup parameter, not authentication.

---

### Step 3: Identify Deprecated Timezone

Detected value being used:

```
Asia/Calcutta
```

Checked PostgreSQL supported timezone list using:

```
SELECT * FROM pg_timezone_names;
```

`Asia/Calcutta` was not present
`Asia/Kolkata` was present

---

### Step 4: Fix Application Configuration

Updated Spring configuration

```
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata
```

And ensured JDBC URL used the same timezone

```
jdbc:postgresql://localhost:5433/appdb?options=-c%20TimeZone=Asia/Kolkata
```

---

### Step 5: Restart Application

Connection succeeded and Hibernate created tables successfully.

---

## Additional Issues Discovered During Debugging

While resolving the timezone error, two unrelated configuration problems appeared and were fixed.

### pgAdmin Connection Issue

pgAdmin host field incorrectly used full JDBC URL instead of hostname.

Incorrect

```
jdbc:postgresql://localhost:5433/appdb
```

Correct

```
Host: localhost
Port: 5433
Database: appdb
```

---

### SQL Initialization Schema Issue

`data.sql` used wrong schema name:

```
INSERT INTO test.product_table
```

Hibernate created table in `public` schema

Corrected to

```
INSERT INTO product_table
```

---

## Final Working Configuration

### application.properties

```
spring.datasource.url=jdbc:postgresql://localhost:5433/appdb?options=-c%20TimeZone=Asia/Kolkata
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata

spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
```

---

## Key Learning

Databases validate configuration more strictly than application frameworks.

Java timezone aliases are not always valid PostgreSQL timezone names.

Always verify timezone compatibility when:

* Using Docker images
* Upgrading PostgreSQL versions
* Setting Hibernate jdbc timezone

---

## Takeaway

The error was not a connection problem, not a password problem, and not a Docker problem.

It was a strict timezone validation mismatch between Java and PostgreSQL.

Correct timezone name solved the connection failure completely.

---
