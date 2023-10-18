---
title: Connect a container app to a cloud service with Service Connector
description: Learn to connect a container app to an Azure service using the Azure portal or the CLI.
author: maud-lv
ms.author: malev
ms.service: container-apps
ms.topic: how-to
ms.date: 06/16/2022
ms.custom: service-connector, devx-track-azurecli
# Customer intent: As an app developer, I want to connect a containerized app to a storage account in the Azure portal using Service Connector.
---

# Connect a container app to a cloud service with Service Connector

Azure Container Apps allows you to use Service Connector to connect to cloud services in just a few steps. Service Connector manages the configuration of the network settings and connection information between different services. To view all supported services, [learn more about Service Connector](../service-connector/overview.md#what-services-are-supported-in-service-connector).

In this article, you learn to connect a container app to Azure Blob Storage.

> [!IMPORTANT]
> This feature in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An application deployed to Container Apps in a [region supported by Service Connector](../service-connector/concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](quickstart-portal.md)
- An Azure Blob Storage account

## Sign in to Azure

First, sign in to Azure.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az login
```

This command prompts your web browser to launch and load an Azure sign in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a new service connection

Use Service Connector to create a new service connection in Container Apps using the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. Navigate to the Azure portal.
1. Select **All resources** on the left of the Azure portal.
1. Enter **Container Apps** in the filter and select the name of the container app you want to use in the list.
1. Select **Service Connector** from the left table of contents.
1. Select **Create**.

    :::image type="content" source="media/service-connector/connect-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector within a container app." lightbox="media/service-connector/connect-service-connector-expanded.png":::

1. Select or enter the following settings.

    | Setting | Suggested value | Description |
    | --- | --- | --- |
    | **Container** | Your container name | Select your Container Apps. |
    | **Service type** | Blob Storage | This is the target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Subscription** | One of your subscriptions | The subscription containing your target service. The default value is the subscription for your container app. |
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your container app and target service. |
    | **Storage account** | Your storage account name | The target storage account to which you want to connect. If you choose a different service type, select the corresponding target service instance. |
    | **Client type** | The app stack in your selected container | Your application stack that works with the target service you selected. The default value is **none**, which generates a list of configurations. If you know about the app stack or the client SDK in the container you selected, select the same app stack for the client type. |

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use access key to connect your Blob Storage account.

1. Select **Next: Network** to select the network configuration. Then select **Enable firewall settings** to update firewall allowlist in Blob Storage so that your container apps can reach the Blob Storage.

1. Then select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take a minute or so to complete the operation.

### [Azure CLI](#tab/azure-cli)

The following steps create a service connection using an access key or a system-assigned managed identity.

1. Use the Azure CLI command `az containerapp connection list-support-types` to view all supported target services.

    ```azurecli-interactive
    az provider register -n Microsoft.ServiceLinker
    az containerapp connection list-support-types --output table
    ```

1. Use the Azure CLI command `az containerapp connection connection create` to create a service connection from a container app.

    If you're connecting with an access key, run the code below:

    ```azurecli-interactive
    az containerapp connection create storage-blob --secret
    ```

    If you're connecting with a system-assigned managed identity, run the code below:

    ```azurecli-interactive
    az containerapp connection create storage-blob --system-identity
    ```

1. Provide the following information at the Azure CLI's request:

    - **The resource group which contains the container app**: the name of the resource group with the container app.
    - **Name of the container app**: the name of your container app.
    - **The container where the connection information will be saved**: the name of the container, in your container app, that connects to the target service
    - **The resource group which contains the storage account:** the name of the resource group name with the storage account. In this guide, we're using a Blob Storage.
    - **Name of the storage account**: the name of the storage account that contains your blob.

    > [!IMPORTANT]
    > To use Managed Identity, you must have the permission to manage [Microsoft Entra role assignments](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have this permission, you won't be able to create a connection. You can ask your subscription owner to grant you this permission or use an access key instead to create the connection.

    > [!NOTE]
    > If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --secret` to provision a new one.

---

## View service connections in Container Apps

View your existing service connections using the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. In **Service Connector**, select **Refresh** and you'll see a Container Apps connection displayed.

1. Select **>** to expand the list. You can see the environment variables required by your application code.

1. Select **...** and then **Validate**. You can see the connection validation details in the pop-up panel on the right.

    :::image type="content" source="media/service-connector/connect-service-connector-refresh.png" alt-text="Screenshot of the Azure portal, viewing connection validation details.":::

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI command `az containerapp connection list` to list all your container app's provisioned connections. Provide the following information:

- **Source compute service resource group name**: the resource group name of the container app.
- **Container app name**: the name of your container app.

```azurecli-interactive
az containerapp connection list -g "<your-container-app-resource-group>" --name "<your-container-app-name>" --output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

---

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
