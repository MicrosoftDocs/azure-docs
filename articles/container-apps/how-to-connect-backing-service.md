---
title: How to connect a Container Apps instance to a backing service
description: Quickstart showing how to connect a container app to a target Azure service using the Azure portal or the CLI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 05/24/2022
# Customer intent: As an app developer, I want to connect a containerized app to a storage account in the Azure portal using Service Connector.
---

# How to connect a Container Apps instance to a backing service

Azure Container Apps now supports Service Connector. Service Connector is an Azure solution that helps you connect Azure compute services to backing services in just a few steps. Service Connector manages the configuration of the network settings and connection information between compute and target backing services, so you don't have to think about it. To view all supported target services, [learn more about Service Connector](../service-connector/overview.md).

In the guide below, learn how to connect your container app to a target service using the Azure portal or the CLI. In this article, we're connecting Container Apps to Azure Blob Storage.

> [!IMPORTANT]
> This feature in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An application deployed to Container Apps in a [region supported by Service Connector](../service-connector/concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](quickstart-portal.md)
- A resource in a target service, such as Azure Blob Storage


## Sign in to Azure

First, sign in to the Azure portal.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to the Azure portal using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```
This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a new service connection in Container Apps

Use Service Connector to create a new service connection in Container Apps using the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. Select **All resources** on the left of the Azure portal. Type **Container Apps** in the filter and select the name of the container app you want to use in the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
1. Select or enter the following settings.

| Setting      | Suggested value  | Description                                        |
| ------------ |  ------- | -------------------------------------------------- |
| **Container** | Your container | Select your Container Apps. |
| **Service type** | Blob Storage | Target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
| **Subscription** | One of your subscriptions | The subscription containing your target service. The default value is the subscription for your Container App instance. |
| **Connection name** | Generated unique name | The connection name that identifies the connection between your container app and target service  |
| **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |
| **Client type** | The app stack in your selected container | Your application stack that works with the target service you selected. The default value is **none**, which will generate a list of configurations. If you know about the app stack or the client SDK in the container you selected, select the same app stack for the client type. |

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use access key to connect your Blob Storage account.

1. Select **Next: Network** to select the network configuration. Then select **Enable firewall settings** to update firewall allowlist in Blob Storage so that your container apps can reach the Blob Storage.

1. Then select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take one minute to complete the operation.

### [Azure CLI](#tab/azure-cli)

Go through the steps below to create a service connection using an access key or a system-assigned managed identity.

1. Use the Azure CLI command `az containerapp connection list-support-types` to view all supported target services.

    ```azurecli-interactive
    az provider register -n Microsoft.ServiceLinker
    az containerapp connection list-support-types --output table
    ```

1. Use the Azure CLI command `az containerapp connection connection create` to create a service connection to an Azure Blob Storage, providing the following information.

    | Setting      | Description  | Suggested value                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Source compute service resource group name** | The name of the resource group containing the container app. | MyResourceGroup. |
    | **Container app name** | The name of the container app | MyContainerApp |
    | **Container name** | The name of the container that connects to the target service | MyContainer |
    | **Target service resource group name** | The name of the resource group that contains the Blob Storage. | MyBlobStorage  |
    | **Storage account name** | The name of the target storage account you want to connect to. If you choose a different type of service, select the corresponding target service instance. | Your storage account| 

    If you're connecting with an access key, run the code below:

    ```azurecli-interactive
    az containerapp connection create storage-blob --secret
    ```

    If you're connecting with a system-assigned managed identity, run the code below:

    ```azurecli-interactive
    az containerapp connection create storage-blob --system-identity
    ```
    > [!IMPORTANT]
    > To use Managed Identity, you must have the permission to manage [Azure Active Directory role assignments](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have this permission, you won't be able to create a connection. You can ask your subscription owner to grant you this permission or use an access key instead to create the connection.

    > [!NOTE]
    > If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --secret` to provision a new one.

---

## View service connections in Container Apps

View your existing service connections using the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. In **Service Connector**, select **Refresh** and you'll see a Container Apps connection displayed.

1. Select **>** to expand the list. You can see the environment variables required by your application code.

1. Select **...** and then **Validate**. You can see the connection validation details in the pop-up panel on the right.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI command `az containerapp connection` to list the connections that belong to your container app. Provide the following information:

| Setting      | Description  | Suggested value                                        |
| ------------ |  ------- | -------------------------------------------------- |
| **Source compute service resource group name** | The name of the resource group containing the container app. | MyResourceGroup. |
| **Container app name** | The name of the container app | MyContainerApp |
| **Container name** | The name of the container that connects to the target service | MyContainer|

Run the code below:

```azurecli-interactive
az containerapp connection list -g "<your-container-app-resource-group>" --name "<your-container-app-name>" 
```

---

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
