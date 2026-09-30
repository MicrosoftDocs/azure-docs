---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

<!-- Used by: migrate-spring-boot.md, migrate-spring-cloud-to-azure-container-apps.md -->

Examine the dependencies of each application you're migrating to determine its Spring Boot version.

In **Maven** projects, find the Spring Boot version in the `<parent>` element of the POM file:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.3</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

In **Gradle** projects, find the Spring Boot version in the `plugins` section:

```gradle
plugins {
  id 'org.springframework.boot' version '3.3.3'
  id 'io.spring.dependency-management' version '1.1.6'
  id 'java'
}
```

For applications that use Spring Boot versions before 3.x, follow the [Spring Boot 3.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide) to update to a supported version. For supported versions, see [Spring Boot and Spring Cloud versions](https://spring.io/projects/spring-cloud#overview).
