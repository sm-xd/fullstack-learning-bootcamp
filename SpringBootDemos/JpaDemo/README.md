# JpaDemo

A Spring Boot project demonstrating Spring Data JPA fundamentals with PostgreSQL.

## Learning Objectives

### Entity Mapping
- Define entities using `@Entity` and `@Table` annotations
- Configure column constraints with `@Column` (nullable, length, name)
- Set up auto-generated primary keys with `@Id` and `@GeneratedValue`
- Create unique constraints and indexes at table level
- Use Hibernate `@CreationTimestamp` and `@UpdateTimestamp` for audit fields

### Lombok Integration
- Reduce boilerplate with `@Data`, `@Builder`, `@AllArgsConstructor`, `@NoArgsConstructor`

### Repository Layer
- Extend `JpaRepository` for CRUD operations
- Create derived query methods from method names
- Filter with conditions: `findByTitle`, `findByQuantityGreaterThanOrPriceLessThan`
- Pattern matching with `findByTitleLike`, `findByTitleContainingIgnoreCase`
- Date filtering with `findByCreatedAtAfterOrderByTitle`

### Pagination and Sorting
- Use `Pageable` and `PageRequest` for pagination
- Apply `Sort` for ordering results
- Combine pagination with custom filters

### Database Configuration
- Configure PostgreSQL datasource in `application.properties`
- Enable SQL logging with `spring.jpa.show-sql`
- Seed initial data using `data.sql`
- Use `spring.jpa.hibernate.ddl-auto=create` for schema generation

### REST API
- Build endpoints with `@RestController`
- Accept query parameters for filtering, sorting, and pagination

## Tech Stack
- Spring Boot 4.0.2
- Spring Data JPA
- PostgreSQL
- Lombok
- Java 21
