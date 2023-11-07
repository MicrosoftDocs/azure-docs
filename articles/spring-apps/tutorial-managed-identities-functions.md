---
title:  "Tutorial: Managed identity to invoke Azure Functions"
description: Learn how to use a managed identity to invoke Azure Functions from an Azure Spring Apps app.
author: KarlErickson
ms.author: margard
ms.service: spring-apps
ms.custom: event-tier1-build-2022, devx-track-java, devx-track-extended-java, devx-track-azurecli
ms.topic: tutorial
ms.date: 05/07/2023
---

# Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Apps app

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to create a managed identity for an app hosted in Azure Spring Apps and use it to invoke HTTP triggered Functions.

Both Azure Functions and App Services have built in support for Microsoft Entra authentication. By using this built-in authentication capability along with Managed Identities for Azure Spring Apps, you can invoke RESTful services using modern OAuth semantics. This method doesn't require storing secrets in code and provides more granular controls for controlling access to external resources.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
- [Git](https://git-scm.com/downloads).
- [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or higher.
- [Install the Azure Functions Core Tools](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools) version 4.x.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Use the following command to create a resource group to contain a Function app:

```azurecli
az group create --name <resource-group-name> --location <location>
```

For more information, see the [az group create](/cli/azure/group#az-group-create) command.

## Create a Function app

To create a Function app, you must first create a backing storage account. You can use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command.

> [!IMPORTANT]
> Each Function app and storage account must have a unique name.

Use the following command to create the storage account. Replace *\<function-app-name>* with the name of your Function app and *\<storage-account-name>* with the name of your storage account.

```azurecli
az storage account create \
    --resource-group <resource-group-name> \
    --name <storage-account-name> \
    --location <location> \
    --sku Standard_LRS
```

After the storage account is created, use the following command to create the Function app:

```azurecli
az functionapp create \
    --resource-group <resource-group-name> \
    --name <function-app-name> \
    --consumption-plan-location <location> \
    --os-type windows \
    --runtime node \
    --storage-account <storage-account-name> \
    --functions-version 4
```

Make a note of the returned `hostNames` value, which is in the format `https://<your-functionapp-name>.azurewebsites.net`. Use this value in the Function app's root URL for testing the Function app.

<a name='enable-azure-active-directory-authentication'></a>

## Enable Microsoft Entra authentication

Use the following steps to enable Microsoft Entra authentication to access your Function app.

1. In the Azure portal, navigate to your resource group and then open the Function app you created.
1. In the navigation pane, select **Authentication** and then select **Add identity provider** on the main pane.
1. On the **Add an identity provider** page, select **Microsoft** from the **Identity provider** dropdown menu.

   :::image type="content" source="media/tutorial-managed-identities-functions/add-identity-provider.png" alt-text="Screenshot of the Azure portal showing the Add an identity provider page with Microsoft highlighted in the identity provider dropdown menu." lightbox="media/tutorial-managed-identities-functions/add-identity-provider.png":::

1. Select **Add**.
1. For the **Basics** settings on the **Add an identity provider** page, set **Supported account types** to **Any Microsoft Entra directory - Multi-tenant**.
1. Set **Unauthenticated requests** to **HTTP 401 Unauthorized: recommended for APIs**. This setting ensures that all unauthenticated requests are denied (401 response).

   :::image type="content" source="media/tutorial-managed-identities-functions/identity-provider-settings.png" alt-text="Screenshot of the Azure portal showing the Add an identity provider page with Support account types and Unauthenticated requests highlighted." lightbox="media/tutorial-managed-identities-functions/identity-provider-settings.png":::

1. Select **Add**.

After you add the settings, the Function app restarts and all subsequent requests are prompted to sign in through Microsoft Entra ID. You can test that unauthenticated requests are currently being rejected with the Function app's root URL (returned in the `hostNames` output of the `az functionapp create` command). You should then be redirected to your organization's Microsoft Entra sign-in screen.

You need the Application ID and the Application ID URI for later use. In the Azure portal, navigate to the Function app you created.

To get the Application ID, select **Authentication** in the navigation pane, and then copy the **App (client) ID** value for the identity provider that includes the name of the Function app.

:::image type="content" source="media/tutorial-managed-identities-functions/function-authentication.png" alt-text="Screenshot of the Azure portal showing the Authentication page for a Function app, with the Function app name highlighted in the Identity provider." lightbox="media/tutorial-managed-identities-functions/function-authentication.png":::

To get the Application ID URI, select **Expose an API** in the navigation pane, and then copy the **Application ID URI** value.

:::image type="content" source="media/tutorial-managed-identities-functions/function-expose-api.png" alt-text="Screenshot of the Azure portal showing the Expose an API page for a Function app with the Application ID URI highlighted." lightbox="media/tutorial-managed-identities-functions/function-expose-api.png":::

## Create an HTTP triggered function

In an empty local directory, use the following commands to create a new function app and add an HTTP triggered function:

```console
func init --worker-runtime node
func new --template HttpTrigger --name HttpTrigger
```

By default, functions use key-based authentication to secure HTTP endpoints. To enable Microsoft Entra authentication to secure access to the functions, set the `authLevel` key to `anonymous` in the *function.json* file, as shown in the following example:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      ...
    }
  ]
}
```

For more information, see the [Secure an HTTP endpoint in production](../azure-functions/functions-bindings-http-webhook-trigger.md#secure-an-http-endpoint-in-production) section of [Azure Functions HTTP trigger](../azure-functions/functions-bindings-http-webhook-trigger.md).

Use the following command to publish the app to the instance created in the previous step:

```console
func azure functionapp publish <function-app-name>
```

The output from the publish command should list the URL to your newly created function, as shown in the following output:

```output
Deployment completed successfully.
Syncing triggers...
Functions in <your-functionapp-name>:
    HttpTrigger - [httpTrigger]
        Invoke url: https://<function-app-name>.azurewebsites.net/api/httptrigger
```

## Create an Azure Spring Apps service instance and application

Use the following commands to add the spring extension and to create a new instance of Azure Spring Apps:

```azurecli
az extension add --upgrade --name spring
az spring create \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name> \
    --location <location>
```

Use the following command to create an application named `msiapp` with a system-assigned managed identity, as requested by the `--assign-identity` parameter:

```azurecli
az spring app create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name "msiapp" \
    --assign-endpoint true \
    --assign-identity
```

## Build a sample Spring Boot app to invoke the Function

This sample invokes the HTTP triggered function by first requesting an access token from the MSI endpoint and using that token to authenticate the function HTTP request. For more information, see the [Get a token using HTTP](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http) section of [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

1. Use the following command clone the sample project:

   ```bash
   git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
   ```

1. Use the following command to specify your function URI and the trigger name in your app properties:

   ```bash
   cd Azure-Spring-Cloud-Samples/managed-identity-function
   vim src/main/resources/application.properties
   ```

1. To use managed identity for Azure Spring Apps apps, add the following properties with these values to *src/main/resources/application.properties*.

   ```text
   azure.function.uri=https://<function-app-name>.azurewebsites.net
   azure.function.triggerPath=httptrigger
   azure.function.application-id.uri=<function-app-application-ID-uri>
   ```

1. Use the following command to package your sample app:

   ```bash
   mvn clean package
   ```

1. Use the following command to deploy the app to Azure Spring Apps:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name "msiapp" \
       --jar-path target/asc-managed-identity-function-sample-0.1.0.jar
   ```

1. Use the following command to access the public endpoint or test endpoint to test your app:

   ```bash
   curl https://<Azure-Spring-Apps-instance-name>-msiapp.azuremicroservices.io/func/springcloud
   ```

   The following message is returned in the response body.

   ```output
   Function Response: Hello, springcloud. This HTTP triggered function executed successfully.
   ```

## Next steps

- [How to enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
- [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
- [Configure client apps to access your App Service](../app-service/configure-authentication-provider-aad.md#configure-client-apps-to-access-your-app-service)
