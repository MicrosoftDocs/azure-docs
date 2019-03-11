---
title: Quickstart to learn how to use Azure App Configuration | Microsoft Docs
description: A quickstart for using Azure App Configuration with Java Spring apps.
services: azure-app-configuration
documentationcenter: ''
author: yidon
manager: jeffya
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: quickstart
ms.tgt_pltfrm: Spring
ms.workload: tbd
ms.date: 01/08/2019
ms.author: yidon

#Customer intent: As a Java Spring developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Java Spring app with App Configuration

Azure App Configuration is a managed configuration service in Azure. It lets you easily store and manage all your application settings in one place that is separated from your code. This quickstart shows you how to incorporate the service into a Java Spring app.

You can use any code editor to complete the steps in this quickstart. However, [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

## Prerequisites

To complete this quickstart, install a supported [Java Development Kit (JDK)](https://aka.ms/azure-jdks) with version 8 and [Apache Maven](http://maven.apache.org/) with version 3.0 or above.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an app configuration store

1. To create a new app configuration store, first sign in to the [Azure portal](https://aka.ms/azconfig/portal). In the upper left side of the page, click **+ Create a resource**. In the **Search the Marketplace** textbox, type **App Configuration** and press **Enter**.

    ![Search for App Configuration](./media/quickstarts/azure-app-configuration-new.png)

2. Click **App Configuration** from the search results and then **Create**.

3. In the **App Configuration** > **Create** page, enter the following settings:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the app configuration store resource. The name must be a string between 1 and 63 characters and contain only numbers, letters, and the `-` character. The name cannot start or end with the `-` character, and consecutive `-` characters are not valid.  |
    | **Subscription** | Your subscription | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it is automatically selected and the **Subscription** drop-down isn't displayed. |
    | **Resource Group** | *AppConfigTestResources* | Select or create a resource group for your app configuration store resource. This group is useful for organizing multiple resources that you may want to delete at the same time by deleting the resource group. For more information, see [Using Resource groups to manage your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). |
    | **Location** | *Central US* | Use **Location** to specify the geographic location in which your SignalR resource is hosted. For the best performance, we recommend that you create the resource in the same region as other components of your application. |

    ![Create an app configuration store](./media/quickstarts/azure-app-configuration-create.png)

4. Click **Create**. The deployment may take a few minutes to complete.

5. Once the deployment is complete, click **Settings** > **Access Keys**. Make a note of either primary read-only or primary read-write key connection string. You will use this later to configure your application to communicate with the app configuration store you have just created. The connection string has the following form:

        Endpoint=<your_endpoint>;Id=<your_id>;Secret=<your_secret>

    You will need to use the entire string in your application.

6. Click **Key/Value Explorer** and **+ Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello |

    You will leave **Label** and **Content Type** empty for now.

## Create a Spring Boot app

You will use the [Spring Initializr](https://start.spring.io/) to create a new Spring Boot project.

1. Browse to <https://start.spring.io/>.

2. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify a **Spring Boot** version that is equal to or greater than 2.0.
   * Specify the **Group** and **Artifact** names for your application.
   * Add the **Web** dependency.

3. When you have specified the options listed above, click **Generate Project**. When prompted, download the project to a path on your local computer.

## Connect to app configuration store

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready for editing. Locate the *pom.xml* file in the root directory of your app.

2. Open the *pom.xml* file in a text editor, and add the Spring Cloud Azure Config starter to the list of `<dependencies>`:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>spring-cloud-starter-azure-appconfiguration-config</artifactId>
        <version>1.1.0.M1</version>
    </dependency>
    ```

3. Create a new Java file named *MessageProperties.java* in the package directory of your app. Add following lines.

    ```java
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

4. Create a new Java file named *HelloController.java* in the package directory of your app. Add following lines.

    ```java
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

5. Open the main application Java file, and add `@EnableConfigurationProperties` to enable this feature.

    ```java
    @SpringBootApplication
    @EnableConfigurationProperties(MessageProperties.class)
    public class AzureConfigApplication {
        public static void main(String[] args) {
            SpringApplication.run(AzureConfigApplication.class, args);
        }
    }
    ```

6. Create a new file named `bootstrap.properties` under the resources directory of your app, and add the following lines to the file, and replace the sample values with the appropriate properties for your app configuration store.

    ```properties
    spring.cloud.azure.appconfiguration.stores[0].connection-string=[your-connection-string]
    ```

## Build and run the app locally

1. Build your Spring Boot application with Maven and run it; for example:

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```
2. Once your application is running, you can use *curl* to test your application; for example:

      ```shell
      curl -X GET http://localhost:8080/
      ```
    You should see the message that you entered into the app configuration store.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you've created a new app configuration store and used it with a Java Spring app. Visit [Spring on Azure homepage](https://docs.microsoft.com/java/azure/spring-framework/) to for more information.

To learn more about using App Configuration, continue to the next tutorial that demonstrates authentication.

> [!div class="nextstepaction"]
> [Managed Identities for Azure Resources Integration](./integrate-azure-managed-service-identity.md)