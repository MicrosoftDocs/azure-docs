---
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle # external contributor: gm2552
ms.author: mbullwin
ms.date: 11/27/2023
---

[Source code](https://github.com/spring-projects-experimental/spring-ai) | [Artifacts (Maven)](https://repo.spring.io/ui/native/snapshot/org/springframework/experimental/ai/spring-ai-openai-spring-boot-starter/0.7.0-SNAPSHOT) | [Sample](https://github.com/rd-1-2022/ai-azure-openai-prompt-roles)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
- The [Spring Boot CLI tool](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.installing.cli)
- An Azure OpenAI Service resource with the `gpt-35-turbo` model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md). This example assumes that your deployment name matches the model name `gpt-35-turbo`

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

## Set up

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](spring-environment-variables.md)]

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up-the-environment)

## Create a new Spring application

Create a new Spring project.

In a Bash window, create a new directory for your app, and navigate to it.

```bash
mkdir ai-chat-demo && cd ai-chat-demo
```

Run the `spring init` command from your working directory. This command creates a standard directory structure for your Spring project including the main Java class source file and the *pom.xml* file used for managing Maven based projects.

```bash
spring init -a ai-chat-demo -n AIChat --force --build maven -x
```

The generated files and folders resemble the following structure:

```
ai-chat-demo/
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
    |               |-- aichatdemo/
    |                   |-- AiChatApplication.java
    |-- test/
        |-- java/
            |-- com/
                |-- example/
                    |-- aichatdemo/
                        |-- AiChatApplicationTests.java
```

## Edit Spring application

1. Edit the *pom.xml* file.

   From the root of the project directory, open the *pom.xml* file in your preferred editor or IDE and overwrite the file with the following content:

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
       <artifactId>ai-chat-demo</artifactId>
       <version>0.0.1-SNAPSHOT</version>
       <name>AIChat</name>
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

1. From the *src/main/java/com/example/aichatdemo* folder, open *AiChatApplication.java* in your preferred editor or IDE and paste in the following code:

   ```java
   package com.example.aichatdemo;

   import java.util.ArrayList;
   import java.util.List;

   import org.springframework.ai.client.AiClient;
   import org.springframework.ai.prompt.Prompt;
   import org.springframework.ai.prompt.messages.ChatMessage;
   import org.springframework.ai.prompt.messages.Message;
   import org.springframework.ai.prompt.messages.MessageType;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class AiChatApplication implements CommandLineRunner
   {
       private static final String ROLE_INFO_KEY = "role";

       @Autowired
       private AiClient aiClient;

       public static void main(String[] args) {
           SpringApplication.run(AiChatApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception
       {
           System.out.println(String.format("Sending chat prompts to AI service. One moment please...\r\n"));

           final List<Message> msgs = new ArrayList<>();

           msgs.add(new ChatMessage(MessageType.SYSTEM, "You are a helpful assistant"));
           msgs.add(new ChatMessage(MessageType.USER, "Does Azure OpenAI support customer managed keys?"));
           msgs.add(new ChatMessage(MessageType.ASSISTANT, "Yes, customer managed keys are supported by Azure OpenAI?"));
           msgs.add(new ChatMessage(MessageType.USER, "Do other Azure AI services support this too?"));

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
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Navigate back to the project root folder, and run the app by using the following command:

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

2023-11-07T13:31:10.884-06:00  INFO 6248 --- [           main] c.example.aichatdemo.AiChatApplication   : No active profile set, falling back to 1 default profile: "default"
2023-11-07T13:31:11.595-06:00  INFO 6248 --- [           main] c.example.aichatdemo.AiChatApplication   : Started AiChatApplication in 0.994 seconds (process running for 1.28)
Sending chat prompts to AI service. One moment please...

Prompt created 1 generated response(s).
Generated respose from "assistant": Yes, other Azure AI services also support customer managed keys. Azure AI Services, Azure Machine Learning, and other AI services in Azure provide options for customers to manage and control their encryption keys. This allows customers to have greater control over their data and security.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=SPRING&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
