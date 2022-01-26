---
title: How to run Spring Boot apps locally using local Config Server and local eureka
description: Learn how to run Spring Boot apps locally using local Config Server and local eureka.
author: karlerickson
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/18/2022
ms.author: xiading
ms.custom: devx-track-java
---

# How to run Spring Boot apps locally using local Config Server and local eureka

This article describes how to run Spring Boot apps locally using local Config Server and local eureka.

## Using local Config Server

The section describes how to setup local Config Server environment with both server side and client side.

### Set up local Config Server service
Pull the official Config Server code from Github.
```
git clone https://github.com/spring-cloud/spring-cloud-config.git
```

Build the source code and pull configurations from your own git repository.
Please find the `configserver.yml` under `spring-cloud-config-server/src/main/resources`.
```
spring:
  cloud:
    config:
      server:
        git:
          uri: <your-own-git-repo-uri>
```

Using maven to build and run it.
```
mvn package -DskipTests
cd spring-cloud-config-server
../mvnw spring-boot:run
```
The Config Server will start at localhost:8888 now.

### Client side preparation 
Please include the Config Server starter in your spring boot app.
``` xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

Run your application locally and it will by default connect to localhost:8888 to fetch the configurations.

## Using local eureka

The section describes how to setup local eureka environment with both server side and client side.

### Set up local eureka service
Pull the official eureka code from Github.
```
git clone https://github.com/spring-cloud/spring-cloud-netflix.git
```

Build from source code and start the eureka server service.
```
mvn package -DskipTests
cd spring-cloud-netflix-eureka-server
../mvnw spring-boot:run
```

The eureka server should start at localhost:8761 now.

### Client side preparation 
Please include the eureka client starter in your spring boot app.
``` xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

Add the following annotation to the application source code.
``` Java
@EnableDiscoveryClient
```

Run your application locally and it will by default connect to localhost:8761 for the service discovery.
