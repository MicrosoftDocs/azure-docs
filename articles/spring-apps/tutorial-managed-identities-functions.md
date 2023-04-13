---
title:  "Tutorial: Managed identity to invoke Azure Functions"
description: Use managed identity to invoke Azure Functions from an Azure Spring Apps app
author: karlerickson
ms.author: margard
ms.service: spring-apps
ms.custom: event-tier1-build-2022, devx-track-java, devx-track-azurecli
ms.topic: tutorial
ms.date: 07/10/2020
---

# Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Apps app

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to create a managed identity for an Azure Spring Apps app and use it to invoke HTTP triggered Functions.

Both Azure Functions and App Services have built in support for Azure Active Directory (Azure AD) authentication. By using this built-in authentication capability along with Managed Identities for Azure Spring Apps, we can invoke RESTful services using modern OAuth semantics. This method doesn't require storing secrets in code and provides more granular controls for controlling access to external resources.

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install the Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli)
* [Install Maven 3.0 or higher](https://maven.apache.org/download.cgi)
* [Install the Azure Functions Core Tools version 3.0.2009 or higher](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Function app and Spring Cloud using the command [az group create](/cli/azure/group#az-group-create):

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create a Function App

To create a Function app you must first create a backing storage account, use the command [az storage account create](/cli/azure/storage/account#az-storage-account-create):

> [!IMPORTANT]
> Each Function app and Storage Account must have a unique name. Replace *\<your-functionapp-name>* with the name of your Function app and *\<your-storageaccount-name>* with the name of your Storage Account in the following examples.

```azurecli
az storage account create \
    --resource-group myResourceGroup \
    --name <your-storageaccount-name> \
    --location eastus \
    --sku Standard_LRS
```

After the Storage Account is created, you can create the Function app.

```azurecli
az functionapp create \
    --resource-group myResourceGroup \
    --name <your-functionapp-name> \
    --consumption-plan-location eastus \
    --os-type windows \
    --runtime node \
    --storage-account <your-storageaccount-name> \
    --functions-version 3
```

Make a note of the returned `hostNames` value, which is in the format *https://\<your-functionapp-name>.azurewebsites.net*. You use this value in a following step.

## Enable Azure Active Directory Authentication

Access the newly created Function app from the [Azure portal](https://portal.azure.com) and select **Authentication / Authorization** from the settings menu. Enable App Service Authentication and set the **Action to take when request is not authenticated** to **Log in with Azure Active Directory**. This setting ensures that all unauthenticated requests are denied (401 response).

:::image type="content" source="media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-1.jpg" alt-text="Screenshot of the Azure portal showing Authentication / Authorization page with Azure Active Directory set as the default provider." lightbox="media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-1.jpg":::

Under **Authentication Providers**, select **Azure Active Directory** to configure the application registration. Selecting **Express Management Mode** automatically creates an application registration in your Azure AD tenant with the correct configuration.

:::image type="content" source="media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-2.jpg" alt-text="Screenshot of the Azure portal showing the Azure Active Directory provider set to Express Management Mode." lightbox="media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-2.jpg":::

After you save the settings, the function app restarts and all subsequent requests are prompted to log in via Azure AD. You can test that unauthenticated requests are now being rejected by navigating to the function apps root URL (returned in the `hostNames` output in a previous step). You should be redirected to your organizations Azure AD login screen.

## Create an HTTP Triggered Function

In an empty local directory, create a new function app and add an HTTP triggered function.

```console
func init --worker-runtime node
func new --template HttpTrigger --name HttpTrigger
```

By default, Functions use key-based authentication to secure HTTP endpoints. Since we're enabling Azure AD authentication to secure access to the Functions, we want to [set the function auth level to anonymous](../azure-functions/functions-bindings-http-webhook-trigger.md#secure-an-http-endpoint-in-production) in the *function.json* file.

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

You can now publish the app to the [Function app](#create-a-function-app) instance created in the previous step.

```console
func azure functionapp publish <your-functionapp-name>
```

The output from the publish command should list the URL to your newly created function.

```output
Deployment completed successfully.
Syncing triggers...
Functions in <your-functionapp-name>:
    HttpTrigger - [httpTrigger]
        Invoke url: https://<your-functionapp-name>.azurewebsites.net/api/httptrigger
```

## Create Azure Spring Apps service and app

After installing the spring extension, create an Azure Spring Apps instance with the Azure CLI command `az spring create`.

```azurecli
az extension add --upgrade --name spring
az spring create \
    --resource-group myResourceGroup \
    --name mymsispringcloud \
    --location eastus
```

The following example creates an app named `msiapp` with a system-assigned managed identity, as requested by the `--assign-identity` parameter.

```azurecli
az spring app create \
    --resource-group "myResourceGroup" \
    --service "mymsispringcloud" \
    --name "msiapp" \
    --assign-endpoint true \
    --assign-identity
```

## Build sample Spring Boot app to invoke the Function

This sample invokes the HTTP triggered function by first requesting an access token from the [MSI endpoint](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http) and using that token to authenticate the Function http request.

1. Clone the sample project.

   ```bash
   git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
   ```

1. Specify your function URI and the trigger name in your app properties.

   ```bash
   cd Azure-Spring-Cloud-Samples/managed-identity-function
   vim src/main/resources/application.properties
   ```

   To use managed identity for Azure Spring Apps apps, add properties with the following content to *src/main/resources/application.properties*.

   ```properties
   azure.function.uri=https://<your-functionapp-name>.azurewebsites.net
   azure.function.triggerPath=httptrigger
   ```

1. Package your sample app.

   ```bash
   mvn clean package
   ```

1. Now deploy the app to Azure with the Azure CLI command `az spring app deploy`.

   ```azurecli
   az spring app deploy \
       --resource-group "myResourceGroup" \
       --service "mymsispringcloud" \
       --name "msiapp" \
       --jar-path target/sc-managed-identity-function-sample-0.1.0.jar
   ```

1. Access the public endpoint or test endpoint to test your app.

   ```bash
   curl https://mymsispringcloud-msiapp.azuremicroservices.io/func/springcloud
   ```

   You see the following message returned in the response body.

   ```output
   Function Response: Hello, springcloud. This HTTP triggered function executed successfully.
   ```

## Next steps

* [How to enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
* [Configure client apps to access your App Service](../app-service/configure-authentication-provider-aad.md#configure-client-apps-to-access-your-app-service)
