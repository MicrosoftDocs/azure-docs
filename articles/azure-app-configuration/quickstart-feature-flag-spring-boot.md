---
title: Quickstart for adding feature flags to Spring Boot with Azure App Configuration
description: Add feature flags to Spring Boot apps and manage them using Azure App Configuration.
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: quickstart
ms.date: 05/06/2026
ms.author: mametcal
ms.custom: devx-track-java, mode-other
#Customer intent: As an Spring Boot developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to a Spring Boot app

In this quickstart, you'll create a feature flag in Azure App Configuration and use it to dynamically control Spring Boot apps to create an end-to-end implementation of feature management.

The Spring Boot Feature Management libraries do **not** have a dependency on any Azure libraries. They seamlessly integrate with App Configuration through its Spring Boot configuration provider.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store, as shown in the [tutorial for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A supported [Java Development Kit SDK](/java/azure/jdk) with version 17.
- [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag). At this stage the Enable feature flag check box should be unchecked.

> [!div class="mx-imgBorder"]
> ![Screenshot of enable feature flag named Beta.](media/add-beta-feature-flag.png)

## Create a console app

1. Create a new Spring Boot project:

    1. Browse to the [Spring Initializr](https://start.spring.io).

    1. Specify the following options:

       * Generate a **Maven** project with **Java**.
       * Specify a **Spring Boot** version that's equal to or greater than 3.0.
       * Specify the **Group** and **Artifact** names for your application. This article uses `com.example` and `demo`.

    1. After you specify the previous options, select **Generate Project**. Download and extract the project to your local computer.

1. Locate *pom.xml* in the root directory of your app and open it in a text editor.

1. Add the following to the list of `<dependencies>`:

    ```xml
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-feature-management</artifactId>
    </dependency>
    ```

1. Add the following `<dependencyManagement>` section to manage the Spring Cloud Azure library versions:

    ```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.azure.spring</groupId>
                <artifactId>spring-cloud-azure-dependencies</artifactId>
                <version>7.2.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    ```

1. Navigate to the `resources` directory of your app and open the `application.properties` or `application.yaml` file.

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. For authorization to work, you need to grant the **App Configuration Data Reader** role to the credential that your app uses. For instructions, see [Authentication with token credentials](./concept-enable-rbac.md#authentication-with-token-credentials).Be sure to allow sufficient time for the permission to propagate before running your application.

    ### [Properties](#tab/properties)

    ```properties
    spring.config.import=azureAppConfiguration
    spring.cloud.azure.appconfiguration.stores[0].endpoint= ${AZURE_APPCONFIG_ENDPOINT}
    spring.cloud.azure.appconfiguration.stores[0].feature-flags.enabled=true
    ```

    ### [YAML](#tab/yaml)

    ```yaml
    spring:
      config:
        import: azureAppConfiguration
      cloud:
        azure:
          appconfiguration:
            stores:
              - endpoint: ${AZURE_APPCONFIG_ENDPOINT}
                feature-flags:
                  enabled: true
    ```

    ---

1. Update the `DemoApplication.java` file in the package directory of your app with the following code:

    ```java
    import org.springframework.boot.CommandLineRunner;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.context.annotation.Bean;

    import com.azure.spring.cloud.feature.management.FeatureManager;

    @SpringBootApplication
    public class DemoApplication {

        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }

        @Bean
        public CommandLineRunner runner(FeatureManager featureManager) {
            return args -> {
                System.out.println("Beta is enabled: " + featureManager.isEnabled("Beta"));
            };
        }
    }
    ```

1. Set an environment variable named **AZURE_APPCONFIG_ENDPOINT**, and set it to the endpoint of your App Configuration store. At the command line, run the following command and restart the command prompt to allow the change to take effect:

    ### [Windows command prompt](#tab/windowscommandprompt)

    ```console
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ### [PowerShell](#tab/powershell)

    ```azurepowershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    ### [macOS](#tab/unix)

    ```console
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ### [Linux](#tab/linux)

    ```console
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ---

1. Build and run your Spring Boot application with Maven.

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. In the App Configuration portal select **Feature Manager**, and change the state of the **Beta** feature flag to **On**, using the toggle in the **Enabled** column.

    | Key | State |
    |---|---|
    | Beta | On |

1. Restart the application. The application will print the following:

    ```console
    Beta is enabled: true
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it to manage features in a Spring Boot app via the [Feature Management libraries](https://azure.github.io/azure-sdk-for-java/springboot.html).

- Learn more about [feature management](./concept-feature-management.md).
- [Manage feature flags](./manage-feature-flags.md).
