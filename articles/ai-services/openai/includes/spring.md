---
title: 'Quickstart: Use Azure OpenAI Service with Spring AI'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with Spring AI.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle # external contributor: gm2552
ms.author: mbullwin
ms.date: 11/27/2023
---

[Source code](https://github.com/spring-projects-experimental/spring-ai) | [Artifacts (Maven)](https://repo.spring.io/ui/native/snapshot/org/springframework/experimental/ai/spring-ai-openai-spring-boot-starter/0.7.0-SNAPSHOT) | [Sample](https://github.com/rd-1-2022/ai-azure-openai-helloworld)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* The [Spring Boot CLI tool](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.installing.cli)
- An Azure OpenAI Service resource with the `gpt-35-turbo-instruct` model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Prerequisites)

## Set up

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](spring-environment-variables.md)]

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Set-up-the-environment)

## Create a new Spring application

Create a new Spring project.

In a Bash window, create a new directory for your app, and navigate to it.

```bash
mkdir ai-completion-demo && cd ai-completion-demo
```

Run the `spring init` command from your working directory. This command creates a standard directory structure for your Spring project including the main Java class source file and the *pom.xml*
file used for managing Maven based projects.

```bash
mkdir ai-completion-demo && cd ai-completion-demo
```

The generated files and folders resemble the following structure:

```
ai-completion-demo/
|-- pom.xml
|-- mvn
|-- mvn.cmd
|-- HELP.md
|-- src/
    |-- main/
    |   |-- resources/
    |   |   |-- application.properties
    |   |-- java/
    |       |-- com/
    |           |-- example/
    |               |-- aicompletiondemo/
    |                   |-- AiCompletionApplication.java
    |-- test/
        |-- java/
            |-- com/
                |-- example/
                    |-- aicompletiondemo/
                        |-- AiCompletionApplicationTests.java
```

## Edit Spring application

1. Edit pom.xml file.

   From the root of the project directory, open the *pom.xml* file in your preferred editor or IDE and overwrite the file with following content:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <parent>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-parent</artifactId>
           <version>3.2.0</version>
           <relativePath/> <!-- lookup parent from repository -->
       </parent>
       <groupId>com.example</groupId>
       <artifactId>ai-completion-demo</artifactId>
       <version>0.0.1-SNAPSHOT</version>
       <name>AICompletion</name>
       <description>Demo project for Spring Boot</description>
       <properties>
           <java.version>17</java.version>
       </properties>
       <dependencies>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter</artifactId>
           </dependency>
           <dependency>
               <groupId>org.springframework.experimental.ai</groupId>
               <artifactId>spring-ai-azure-openai-spring-boot-starter</artifactId>
               <version>0.7.0-SNAPSHOT</version>
           </dependency>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-test</artifactId>
               <scope>test</scope>
           </dependency>
       </dependencies>
       <build>
           <plugins>
               <plugin>
                   <groupId>org.springframework.boot</groupId>
                   <artifactId>spring-boot-maven-plugin</artifactId>
               </plugin>
           </plugins>
       </build>
       <repositories>
           <repository>
               <id>spring-snapshots</id>
               <name>Spring Snapshots</name>
               <url>https://repo.spring.io/snapshot</url>
               <releases>
                   <enabled>false</enabled>
               </releases>
           </repository>
       </repositories>
   </project>
   ```

1. From the *src/main/java/com/example/aicompletiondemo* folder, open *AiCompletionApplication.java* in your preferred editor or IDE and paste in the following code.

   ```java
   package com.example.aicompletiondemo;

   import java.util.Collections;
   import java.util.List;

   import org.springframework.ai.client.AiClient;
   import org.springframework.ai.prompt.Prompt;
   import org.springframework.ai.prompt.messages.Message;
   import org.springframework.ai.prompt.messages.MessageType;
   import org.springframework.ai.prompt.messages.UserMessage;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class AiCompletionApplication implements CommandLineRunner
   {
       private static final String ROLE_INFO_KEY = "role";

       @Autowired
       private AiClient aiClient;

       public static void main(String[] args) {
           SpringApplication.run(AiCompletionApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception
       {
           System.out.println(String.format("Sending completion prompt to AI service. One moment please...\r\n"));

           final List<Message> msgs =
                   Collections.singletonList(new UserMessage("When was Microsoft founded?"));

           final var resps = aiClient.generate(new Prompt(msgs));

           System.out.println(String.format("Prompt created %d generated response(s).", resps.getGenerations().size()));

           resps.getGenerations().stream()
             .forEach(gen -> {
                 final var role = gen.getInfo().getOrDefault(ROLE_INFO_KEY, MessageType.ASSISTANT.getValue());

                 System.out.println(String.format("Generated respose from \"%s\": %s", role, gen.getText()));
             });
       }

   }
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Navigate back to the project root folder, and run the app with:

   ```bash
   ./mvnw spring-boot:run
   ```

## Output

```output
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

2023-11-07T12:47:46.126-06:00  INFO 98687 --- [           main] c.e.a.AiCompletionApplication            : No active profile set, falling back to 1 default profile: "default"
2023-11-07T12:47:46.823-06:00  INFO 98687 --- [           main] c.e.a.AiCompletionApplication            : Started AiCompletionApplication in 0.925 seconds (process running for 1.238)
Sending completion prompt to AI service. One moment please...

Prompt created 1 generated response(s).
Generated respose from "assistant": Microsoft was founded on April 4, 1975.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Create-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
