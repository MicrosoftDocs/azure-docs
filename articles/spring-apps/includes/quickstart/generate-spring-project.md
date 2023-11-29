---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/09/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [generate-spring-project](generate-spring-project.md)]

-->

Use the following steps to create the project:

1. Use the following command to generate a sample project from `start.spring.io` with the recommended dependencies for Azure Spring Apps:

   ```bash
   curl https://start.spring.io/starter.tgz -d dependencies=web -d baseDir=demo -d bootVersion=3.0.0 -d javaVersion=17 -d type=maven-project -d groupId=com.example -d artifactId=demo -d name=demo -d packageName=com.example.demo -d packaging=jar | tar -xzvf -
   ```

1. Create a web controller for your web application by adding the file *src/main/java/com/example/demo/HelloController.java* with the following contents:

   ```java
   package com.example.demo;

   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.bind.annotation.RequestMapping;

   @RestController
   public class HelloController {

       @RequestMapping("/")
       public String index() {
           return "Hello World";
        }
   }
   ```

1. Use the following [Maven](https://maven.apache.org/what-is-maven.html) command to build the project:

   ```azurecli-interactive
   ./mvnw clean package
   ```

1. Run the sample project locally by using the following command:

   ```azurecli-interactive
   ./mvnw spring-boot:run
   ```