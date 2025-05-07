---
title: Tutorial for using Azure App Configuration Key Vault references in a Java Spring Boot app | Microsoft Docs
description: In this tutorial, you learn how to use Azure App Configuration's Key Vault references from a Java Spring Boot app
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: tutorial
ms.date: 12/04/2024
ms.author: mametcal
ms.custom: mvc, devx-track-java, devx-track-azurecli, devx-track-extended-java
#Customer intent: I want to update my Spring Boot application to reference values stored in Key Vault through App Configuration.
---
# Tutorial: Use Key Vault references in a Java Spring app

In this tutorial, you learn how to use the Azure App Configuration service together with Azure Key Vault. App Configuration and Key Vault are complementary services used side by side in most application deployments.

App Configuration helps you use the services together by creating keys that reference values stored in Key Vault. When App Configuration creates such keys, it stores the URIs of Key Vault values rather than the values themselves.

Your application uses the App Configuration client provider to retrieve Key Vault references, just as it does for any other keys stored in App Configuration. In this case, the values stored in App Configuration are URIs that reference the values in the Key Vault. They aren't Key Vault values or credentials. Because the client provider recognizes the keys as Key Vault references, it uses Key Vault to retrieve their values.

Your application is responsible for authenticating properly to both App Configuration and Key Vault. The two services don't communicate directly.

This tutorial shows you how to implement Key Vault references in your code. It builds on the web app introduced in the quickstarts. Before you continue, complete [Create a Java Spring app with App Configuration](./quickstart-java-spring-app.md) first.

You can use any code editor to do the steps in this tutorial. For example, [Visual Studio Code](https://code.visualstudio.com/) is a cross-platform code editor that's available for the Windows, macOS, and Linux operating systems.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an App Configuration key that references a value stored in Key Vault.
> * Access the value of this key from a Java Spring application.

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 11.
* [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or above.

## Create a vault

1. Select the **Create a resource** option in the upper-left corner of the Azure portal:

    ![Screenshot shows the Create a resource option in the Azure portal.](./media/quickstarts/search-services.png)
1. In the search box, enter **Key Vault**.
1. From the results list, select **Key vaults**.
1. In **Key vaults**, select **Add**.
1. On the right in **Create key vault**, provide the following information:
    * Select **Subscription** to choose a subscription.
    * In **Resource Group**, select **Create new** and enter a resource group name.
    * In **Key vault name**, a unique name is required. For this tutorial, enter **Contoso-vault2**.
    * In the **Region** drop-down list, choose a location.
1. Leave the other **Create key vault** options with their default values.
1. Select **Create**.

At this point, your Azure account is the only one authorized to access this new vault.

![Screenshot shows your key vault.](./media/quickstarts/vault-properties.png)

## Add a secret to Key Vault

To add a secret to the vault, you need to take just a few more steps. In this case, add a message that you can use to test Key Vault retrieval. The message is called **Message**, and you store the value "Hello from Key Vault" in it.

1. From the Key Vault properties pages, select **Secrets**.
1. Select **Generate/Import**.
1. In the **Create a secret** pane, enter the following values:
    * **Upload options**: Enter **Manual**.
    * **Name**: Enter **Message**.
    * **Value**: Enter **Hello from Key Vault**.
1. Leave the other **Create a secret** properties with their default values.
1. Select **Create**.

## Add a Key Vault reference to App Configuration

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    * **Key**: Select **/application/config.keyvaultmessage**
    * **Label**: Leave this value blank.
    * **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to the values in the key vault you created in the previous section.
    * **Secret**: Select the secret named **Message** that you created in the previous section.

## Connect to Key Vault

1. In this tutorial, you use a service principal for authentication to Key Vault. To create this service principal, use the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command:

    ```azurecli
    az ad sp create-for-rbac -n "http://mySP" --role Contributor --scopes /subscriptions/{subscription-id} --sdk-auth
    ```

    This operation returns a series of key/value pairs:

    ```json
    {
    "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
    "clientSecret": "aaaaaaaa-0b0b-1c1c-2d2d-333333333333",
    "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
    "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
    "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
    "resourceManagerEndpointUrl": "https://management.azure.com/",
    "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
    "galleryEndpointUrl": "https://gallery.azure.com/",
    "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

1. Run the following command to let the service principal access your key vault:

    ```azurecli
    az keyvault set-policy -n <your-unique-keyvault-name> --spn <clientId-of-your-service-principal> --secret-permissions delete get
    ```

1. Run the following command to get your object-id, then add it to App Configuration.

    ```azurecli
    az ad sp show --id <clientId-of-your-service-principal>
    az role assignment create --role "App Configuration Data Reader" --scope /subscriptions/<subscriptionId>/resourceGroups/<group-name> --assignee-principal-type --assignee-object-id <objectId-of-your-service-principal> --resource-group <your-resource-group>
    ```

1. Create the environment variables **AZURE_CLIENT_ID**, **AZURE_CLIENT_SECRET**, and **AZURE_TENANT_ID**. Use the values for the service principal that were displayed in the previous steps. At the command line, run the following commands and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_CLIENT_ID "clientId"
    setx AZURE_CLIENT_SECRET "clientSecret"
    setx AZURE_TENANT_ID "tenantId"
    ```

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:AZURE_CLIENT_ID = "clientId"
    $Env:AZURE_CLIENT_SECRET = "clientSecret"
    $Env:AZURE_TENANT_ID = "tenantId"
    ```

    If you use macOS or Linux, run the following command:

    ```cmd
    export AZURE_CLIENT_ID ='clientId'
    export AZURE_CLIENT_SECRET ='clientSecret'
    export AZURE_TENANT_ID ='tenantId'
    ```

> [!NOTE]
> These Key Vault credentials are only used within your application.  Your application authenticates directly with Key Vault using these credentials without involving the App Configuration service.  The Key Vault provides authentication for both your application and your App Configuration service without sharing or exposing keys.

## Update your code to use a Key Vault reference

1. Create an environment variable called **APP_CONFIGURATION_ENDPOINT**. Set its value to the endpoint of your App Configuration store. You can find the endpoint on the **Access Keys** blade in the Azure portal. Restart the command prompt to allow the change to take effect.

1. Open your configuration file in the *resources* folder. Update this file to use the **APP_CONFIGURATION_ENDPOINT** value. Remove any references to a connection string in this file.

### [yaml](#tab/yaml)

```yaml
spring:
    cloud:
        azure:
            appconfiguration:
                stores:
                    - endpoint: ${APP_CONFIGURATION_ENDPOINT}
```

### [properties](#tab/properties)

```properties
spring.cloud.azure.appconfiguration.stores[0].endpoint= ${APP_CONFIGURATION_ENDPOINT}
```

---

> [!NOTE]
> You can also use the [Spring Cloud Azure global configurations](/azure/developer/java/spring-framework/authentication) to connect to Key Vault.

1. Open *MessageProperties.java*. Add a new variable called *keyVaultMessage*:

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
