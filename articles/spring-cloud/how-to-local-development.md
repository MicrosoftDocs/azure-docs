---
title: How to run Spring Boot apps locally using local Config Server and local Eureka
description: Learn how to run Spring Boot apps locally using local Config Server and local Eureka.
author: karlerickson
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/30/2022
ms.author: xiading
ms.custom: devx-track-java
---

# How to run Spring Boot apps locally using local Config Server and local Eureka

This article describes how to run Spring Boot apps locally using local Config Server and local Eureka.

## Using local Config Server

The section describes how to setup a local Config Server environment with both server side and client side services.

### Set up the local Config Server service

1. Pull the official Config Server code from Github.

``` shell
git clone https://github.com/spring-cloud/spring-cloud-config.git
```

1. Build the source code and pull configurations from your own git repository.

Find the `configserver.yml` file under `spring-cloud-config-server/src/main/resources`.

```
spring:
  cloud:
    config:
      server:
        git:
          uri: <your-own-git-repo-uri>
```

1. Use maven to build and run the Config Server code.

``` shell
mvn package -DskipTests
cd spring-cloud-config-server
../mvnw spring-boot:run
```
After building the code, Config Server will start at localhost:8888.

### Client side preparation

Include the Config Server starter in your spring boot app.

``` xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

Run your application locally and it will connect to localhost:8888 to fetch the configurations.

## Using local Eureka

The section describes how to setup a local Eureka environment with both server side and client side.

### Set up a local Eureka service

1. Pull the official Eureka code from Github.

``` shell
git clone https://github.com/spring-cloud/spring-cloud-netflix.git
```

1. Build from source code and start the Eureka server service.

   ``` shell
   mvn package -DskipTests
   cd spring-cloud-netflix-Eureka-server
   ../mvnw spring-boot:run
   ```

The Eureka server will start at localhost:8761.

### Client side preparation

1. Include the Eureka client starter in your Spring Boot app.

   ``` xml
   <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-Eureka-client</artifactId>
   </dependency>
   ```

1. Add the following annotation to the application source code.

   ``` Java
   @EnableDiscoveryClient
   ```

Run your application locally and it will connect to localhost:8761 for the service discovery.

## Next Steps
* [Prepare a Java Spring app for deployment](how-to-prepare-app-deployment.md)
* [Enable Service Registration](how-to-service-registration.md)
