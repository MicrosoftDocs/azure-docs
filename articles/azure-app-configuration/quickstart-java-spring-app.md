---
title: Quickstart to learn how to use Azure App Configuration
description: In this quickstart, create a Java Spring app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: quickstart
ms.date: 04/11/2023
ms.custom: devx-track-java, mode-api, devx-track-extended-java
ms.author: mametcal
#Customer intent: As a Java Spring developer, I want to manage all my app settings in one place.
---

# Quickstart: Create a Java Spring app with Azure App Configuration

In this quickstart, you incorporate Azure App Configuration into a Java Spring app to centralize storage and management of application settings separate from your code.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 11.
- [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.
- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, and then select Java version 8 or higher.

## Add a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key | Value |
|---|---|
| /application/config.message | Hello |

## Connect to an App Configuration store

Now that you have an App Configuration store, you can use the Spring Cloud Azure Config starter to have your application communicate with the App Configuration store that you create.

To install the Spring Cloud Azure Config starter module, add the following dependency to your *pom.xml* file:

### [Spring Boot 3](#tab/spring-boot-3)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
    <version>5.4.0</version>
</dependency>
```

### [Spring Boot 2](#tab/spring-boot-2)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
    <version>4.10.0</version>
</dependency>
```

---

### Code the application

To use the Spring Cloud Azure Config starter to have your application communicate with the App Configuration store that you create, configure the application by using the following steps.

1. Create a new Java file named *MessageProperties.java*, and add the following lines:

   ```java
   import org.springframework.boot.context.properties.ConfigurationProperties;

   @ConfigurationProperties(prefix = "config")
   public class MessageProperties {
       private String message;

       public String getMessage() {
           return message;
       }

       public void setMessage(String message) {
           this.message = message;
       }
   }
   ```

1. Create a new Java file named *HelloController.java*, and add the following lines:

   ```java
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;

   @RestController
   public class HelloController {
       private final MessageProperties properties;

       public HelloController(MessageProperties properties) {
           this.properties = properties;
       }

       @GetMapping
       public String getMessage() {
           return "Message: " + properties.getMessage();
       }
   }
   ```

1. In the main application Java file, add `@EnableConfigurationProperties` to enable the *MessageProperties.java* configuration properties class to take effect and register it with the Spring container.

   ```java
   import org.springframework.boot.context.properties.EnableConfigurationProperties;

   @SpringBootApplication
   @EnableConfigurationProperties(MessageProperties.class)
   public class DemoApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }
   }
   ```

1. Open the auto-generated unit test and update to disable Azure App Configuration, or it will try to load from the service when running unit tests.

   ```java
   import org.junit.jupiter.api.Test;
   import org.springframework.boot.test.context.SpringBootTest;

   @SpringBootTest(properties = "spring.cloud.azure.appconfiguration.enabled=false")
   class DemoApplicationTests {

       @Test
       void contextLoads() {
       }

   }
   ```

1. Create a new file named *bootstrap.properties* under the resources directory of your app, and add the following line to the file.

   ```properties
   spring.cloud.azure.appconfiguration.stores[0].connection-string= ${APP_CONFIGURATION_CONNECTION_STRING}
   ```

1. Set an environment variable named **APP_CONFIGURATION_CONNECTION_STRING**, and set it to the access key to your App Configuration store. At the command line, run the following command and restart the command prompt to allow the change to take effect:

   ```cmd
   setx APP_CONFIGURATION_CONNECTION_STRING "connection-string-of-your-app-configuration-store"
   ```

   If you use Windows PowerShell, run the following command:

   ```azurepowershell
   $Env:APP_CONFIGURATION_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
   ```

   If you use macOS or Linux, run the following command:

   ```cmd
   export APP_CONFIGURATION_CONNECTION_STRING='connection-string-of-your-app-configuration-store'
   ```

### Build and run the app locally

1. Open command prompt to the root directory and run the following commands to build your Spring Boot application with Maven and run it.

   ```cmd
   mvn clean package
   mvn spring-boot:run
   ```

1. After your application is running, use *curl* to test your application, for example:

   ```cmd
   curl -X GET http://localhost:8080/
   ```

   You see the message that you entered in the App Configuration store.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a Java Spring app. For more information, see [Spring on Azure](/java/azure/spring-framework/). For further questions see the [reference documentation](https://go.microsoft.com/fwlink/?linkid=2180917), it has all of the details on how the Spring Cloud Azure App Configuration library works. To learn how to enable your Java Spring app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-java-spring-app.md)
