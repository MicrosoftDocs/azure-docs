---
title: Tutorial for using Azure App Configuration Key Vault references in a Java Spring Boot app | Microsoft Docs
description: In this tutorial, you learn how to use Azure App Configuration's Key Vault references from a Java Spring Boot app
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: tutorial
ms.date: 03/16/2026
ms.author: mametcal
ms.custom: mvc, devx-track-java, devx-track-azurecli, devx-track-extended-java
#Customer intent: I want to update my Spring Boot application to reference values stored in Key Vault through App Configuration.
---
# Tutorial: Use Key Vault references in a Java Spring app

In this tutorial, you learn how to use the Azure App Configuration service together with Azure Key Vault. App Configuration and Key Vault are complementary services used side by side in most application deployments.

App Configuration helps you use the services together by creating keys that reference values stored in Key Vault. When App Configuration creates such keys, it stores the URIs of Key Vault values rather than the values themselves.

Your application uses the App Configuration client provider to retrieve Key Vault references, just as it does for any other keys stored in App Configuration. In this case, the values stored in App Configuration are URIs that reference the values in the Key Vault. They aren't Key Vault values or credentials. Because the client provider recognizes the keys as Key Vault references, it uses Key Vault to retrieve their values.

Your application is responsible for authenticating properly to both App Configuration and Key Vault. The two services don't communicate directly.

This tutorial shows you how to implement Key Vault references in your code. It builds on the web app introduced in the quickstart. Before you continue, complete [Create a Java Spring app with App Configuration](./quickstart-java-spring-app.md) first.

You can use any code editor to do the steps in this tutorial. For example, [Visual Studio Code](https://code.visualstudio.com/) is a cross-platform code editor that's available for the Windows, macOS, and Linux operating systems.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an App Configuration key that references a value stored in Key Vault.
> * Access the value of this key from a Java Spring application.

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
* A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 17.
* [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.
* Finish the [Create a Java Spring app with App Configuration](./quickstart-java-spring-app.md) quickstart.

## Create a key vault

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Create a resource**.

1. In the search box, enter **Key Vault**. In the result list, select **Key Vault**.

1. On the **Key Vault** page, select **Create**.

1. On the **Create a key vault** page, enter the following information:
   - For **Subscription**: Select a subscription.
   - For **Resource group**: Enter the name of an existing resource group or select **Create new** and enter a resource group name.
   - For **Key vault name**: Enter a unique name.
   - For **Region**: Select a location.

1. For the other options, use the default values.

1. Select **Review + create**.

1. After the system validates and displays your inputs, select **Create**.

At this point, your Azure account is the only one authorized to access this new vault.

## Add a secret to Key Vault

Add a secret to the vault to test Key Vault retrieval. The secret is called **Message**, and its value is "Hello from Key Vault."

1. On the Key Vault resource menu, select **Objects** > **Secrets**.

1. Select **Generate/Import**.

1. In the **Create a secret** dialog, enter the following values:
   - For **Upload options**: Enter **Manual**.
   - For **Name**: Enter **Message**.
   - For **Secret value**: Enter **Hello from Key Vault**.

1. For the other options, use the default values.

1. Select **Create**.

## Add a Key Vault reference to App Configuration

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select your App Configuration store.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    * **Key**: Enter **/application/config.keyVaultMessage**.
    * **Label**: Leave this value blank.
    * **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to the key vault you created in the previous section.
    * **Secret**: Select the secret named **Message** that you created in the previous section.

## Grant your app access to Key Vault

Your application uses `DefaultAzureCredential` to authenticate to both App Configuration and Key Vault. This credential automatically works with managed identities in Azure, and with your developer credentials locally.

1. Grant your identity access to Key Vault. Assign the **Key Vault Secrets User** role to your user account or managed identity:

    ```azurecli
    az role assignment create --role "Key Vault Secrets User" --scope /subscriptions/<subscriptionId>/resourceGroups/<group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name> --assignee <your-azure-ad-user-or-managed-identity>
    ```

1. Grant your identity access to App Configuration. Assign the **App Configuration Data Reader** role:

    ```azurecli
    az role assignment create --role "App Configuration Data Reader" --scope /subscriptions/<subscriptionId>/resourceGroups/<group-name>/providers/Microsoft.AppConfiguration/configurationStores/<your-app-configuration-store> --assignee <your-azure-ad-user-or-managed-identity>
    ```

## Update your code to use a Key Vault reference

1. Create an environment variable called **APP_CONFIGURATION_ENDPOINT**. Set its value to the endpoint of your App Configuration store. You can find the endpoint on the **Access Keys** blade in the Azure portal. Restart the command prompt to allow the change to take effect.

1. Open your configuration file in the *resources* folder. Update this file to use the **APP_CONFIGURATION_ENDPOINT** value. Remove any references to a connection string in this file.

### [yaml](#tab/yaml)

```yaml
spring:
    config:
        import: azureAppConfiguration
    cloud:
        azure:
            appconfiguration:
                stores:
                    - endpoint: ${APP_CONFIGURATION_ENDPOINT}
```

### [properties](#tab/properties)

```properties
spring.config.import=azureAppConfiguration
spring.cloud.azure.appconfiguration.stores[0].endpoint=${APP_CONFIGURATION_ENDPOINT}
```

---

> [!NOTE]
> You can also use the [Spring Cloud Azure global configurations](/azure/developer/java/spring-framework/authentication) to connect to Key Vault.

1. Open *MyProperties.java*. Add a new variable called *keyVaultMessage*:

    ```java
    private String keyVaultMessage;

    public String getKeyVaultMessage() {
        return keyVaultMessage;
    }

    public void setKeyVaultMessage(String keyVaultMessage) {
        this.keyVaultMessage = keyVaultMessage;
    }
    ```

1. Open *HelloController.java*. Update the *getMessage* method to include the message retrieved from Key Vault.

    ```java
    @GetMapping
    public String getMessage() {
        return "Message: " + properties.getMessage() + "\nKey Vault message: " + properties.getKeyVaultMessage();
    }
    ```

1. Build your Spring Boot application with Maven and run it, for example:

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. After your application is running, use *curl* to test your application, for example:

      ```shell
      curl -X GET http://localhost:8080/
      ```

    You see the message that you entered in the App Configuration store. You also see the message that you entered in Key Vault.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you created an App Configuration key that references a value stored in Key Vault. For further questions see the [reference documentation](https://go.microsoft.com/fwlink/?linkid=2180917), it has all of the details on how the Spring Cloud Azure App Configuration library works. To learn how to use feature flags in your Java Spring application, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./quickstart-feature-flag-spring-boot.md)
