---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/26/2022
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [generate-spring-project](../../includes/quickstart/generate-spring-project.md)]

-->

Use the following steps to create the project:

1. Use the following command to generate a sample project from `start.spring.io` with recommended dependencies for Azure Spring Apps.

   ```bash
   curl https://start.spring.io/starter.tgz -d dependencies=web -d baseDir=app -d bootVersion=3.0.0 -d javaVersion=17 -d type=maven-project -d groupId=com.example -d artifactId=demo -d name=demo -d packageName=com.example.hellospring -d packaging=jar | tar -xzvf -
   ```

1. Create a web controller for your web application by adding the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

   ```java
   package com.example.hellospring;

   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.bind.annotation.RequestMapping;

   @RestController
   public class HelloController {

       @RequestMapping("/")
       public String index() {
           return "Greetings from Azure Spring Apps!";
        }
   }
   ```