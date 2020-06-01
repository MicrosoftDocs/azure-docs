---
title: Quickstart to learn how to use Azure App Configuration
description: A quickstart for using Azure App Configuration with Java Spring apps.
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''
ms.service: azure-app-configuration
ms.topic: quickstart
ms.date: 04/18/2020
ms.author: lcozzens

#Customer intent: As a Java Spring developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Java Spring app with Azure App Configuration

In this quickstart, you incorporate Azure App Configuration into a Java Spring app to centralize storage and management of application settings separate from your code.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- A supported [Java Development Kit (JDK)](https://docs.microsoft.com/java/azure/jdk) with version 8.
- [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

6. Select **Configuration Explorer** > **+ Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello |

    Leave **Label** and **Content Type** empty for now.

7. Select **Apply**.

## Create a Spring Boot app

Use the [Spring Initializr](https://start.spring.io/) to create a new Spring Boot project.

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   - Generate a **Maven** project with **Java**.
   - Specify a **Spring Boot** version that's equal to or greater than 2.0.
   - Specify the **Group** and **Artifact** names for your application.
   - Add the **Spring Web** dependency.

1. After you specify the previous options, select **Generate Project**. When prompted, download the project to a path on your local computer.

## Connect to an App Configuration store

1. After you extract the files on your local system, your simple Spring Boot application is ready for editing. Locate the *pom.xml* file in the root directory of your app.

1. Open the *pom.xml* file in a text editor, and add the Spring Cloud Azure Config starter to the list of `<dependencies>`:

    **Spring Cloud 1.1.x**

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
        <version>1.1.2</version>
    </dependency>
    ```

    **Spring Cloud 1.2.x**

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
        <version>1.2.2</version>
    </dependency>
    ```

1. Create a new Java file named *MessageProperties.java* in the package directory of your app. Add the following lines:

    ```java
    package com.example.demo;

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

1. Create a new Java file named *HelloController.java* in the package directory of your app. Add the following lines:

    ```java
    package com.example.demo;

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

1. Open the main application Java file, and add `@EnableConfigurationProperties` to enable this feature.

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

1. Create a new file named `bootstrap.properties` under the resources directory of your app, and add the following lines to the file. Replace the sample values with the appropriate properties for your App Configuration store.

    ```CLI
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

## Build and run the app locally

1. Build your Spring Boot application with Maven and run it, for example:

    ```cmd
    mvn clean package
    mvn spring-boot:run
    ```

2. After your application is running, use *curl* to test your application, for example:

      ```cmd
      curl -X GET http://localhost:8080/
      ```

    You see the message that you entered in the App Configuration store.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it with a Java Spring app. For more information, see [Spring on Azure](https://docs.microsoft.com/java/azure/spring-framework/). To learn how to enable your Java Spring app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-java-spring-app.md)
