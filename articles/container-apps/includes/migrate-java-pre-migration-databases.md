---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

For a Spring Boot application, connection strings typically appear in configuration files when it depends on an external database. Here's an example from an *application.properties* file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mysql_db
spring.datasource.username=dbuser
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

Here's an example from an *application.yaml* file:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://mongouser:deepsecret@mongoserver.contoso.com:27017
```

See Spring Data documentation for more possible configuration scenarios:

- [JPA Repositories](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.repositories)
- [JDBC Repositories](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.repositories)
- [Cassandra Repositories](https://docs.spring.io/spring-data/cassandra/docs/current/reference/html/#cassandra.repositories)
- [MongoDB Repositories](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#mongodb.repositories)
