---
title: Access Key Vault in private network through Shared Private Endpoints
titleSuffix: Azure Web PubSub Service
description: How to access key vault in private network through Shared Private Endpoints
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/27/2023
ms.author: dayshen
---

# Access Key Vault in private network through shared private endpoints

Azure Web PubSub Service can access your Key Vault in a private network through shared private endpoints connections. This article shows you how to configure your Web PubSub service instance to route outbound calls to a key vault through a shared private endpoint rather than public network.  

   :::image type="content" alt-text="Diagram showing architecture of shared private endpoint." source="media\howto-secure-shared-private-endpoints-key-vault\shared-private-endpoint-overview.png" :::

Private endpoints of secured resources created through Azure Web PubSub Service APIs are referred to as *shared private-link resources*.  This is because you're "sharing" access to a resource, such as an Azure Key Vault, that has been integrated with the [Azure Private Link service](../private-link/private-link-overview.md). These private endpoints are created inside the Azure Web PubSub Service execution environment and aren't directly visible to you.

> [!NOTE]
> The examples in this article use the following resource IDs:
>
> * The resource ID of this Azure Web PubSub Service is _/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webpubsub/contoso-webpubsub .
> * The resource ID of Azure Key Vault is */subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.KeyVault/vaults/contoso-kv*.
>
> When following the steps, substitute the resource IDs of your Azure Web PubSub Service and Azure Key Vault.

## Prerequisites

* An Azure subscription, if you don't have one, create a [free account].(<https://azure.microsoft.com/free/?WT.mc_id=A261C142F>).
* [Azure CLI](/cli/azure/install-azure-cli) 2.25.0 or later (if using Azure CLI)._
* An Azure Web PubSub Service instance in a **Standard** pricing tier or higher
* An Azure Key Vault resource.

### 1. Create a shared private endpoint resource to the Key Vault

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Web PubSub Service resource page.
1. Select **Networking** from the menu.
1. Select the **Private access** tab.
1. Select **Add shared private endpoint**.

   :::image type="content" alt-text="Screenshot of shared private endpoints management." source="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-management.png" lightbox="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-management.png" :::

1. Enter a **Name** for the shared private endpoint.
1. Enter your key vault resource by choosing **Select from your resources** and selecting your resource from the lists, or by choosing **Specify resource ID** and entering your key vault resource ID.
1. Enter *please approve* for the **Request message**.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a shared private endpoint." source="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-add.png" :::

The shared private endpoint resource provisioning state is **Succeeded**. The connection state is **Pending** approval at target resource side.

   :::image type="content" alt-text="Screenshot of an added shared private endpoint." source="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-added.png" lightbox="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-added.png" :::

#### [Azure CLI](#tab/azure-cli)

You can make the following API call with the [Azure CLI](/cli/azure/) to create a shared private link resource.  Replace the `uri` with your own value.

```azurecli
az rest --method put --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webpubsub/contoso-webpubsub/sharedPrivateLinkResources/kv-pe?api-version=2022-08-01-preview --body @create-pe.json
```

The contents of the *create-pe.json* file, which represents the request body to the API, are as follows:

```json
{
      "name": "contoso-kv",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.KeyVault/vaults/contoso-kv",
        "groupId": "vault",
        "requestMessage": "please approve"
      }
}
```

The process of creating an outbound private endpoint is a long-running (asynchronous) operation. As in all asynchronous Azure operations, the `PUT` call returns an `Azure-AsyncOperation` header value that looks like the following output:

```output
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webpubsub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2022-08-01-preview"
```

You can poll this URI periodically to obtain the status of the operation. Wait for the status to change to "Succeeded" before proceeding to the next steps.

You can poll for the status by manually querying the `Azure-AsyncOperationHeader` value:

```azurecli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webpubsub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2022-08-01-preview
```

-----

### 2. Approve the private endpoint connection for the Key Vault

After the private endpoint connection has been created, you need to approve the connection request from the Azure Web PubSub Service in your key vault resource.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your key vault resource page.
1. Select **Networking** from the menu.
1. Select **Private endpoint connections**.

   :::image type="content" alt-text="Screenshot of the Azure portal, showing the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints-key-vault\portal-key-vault-approve-private-endpoint.png" :::

1. Select the private endpoint that Azure Web PubSub Service created.
1. Select **Approve** and **Yes** to confirm.
1. Wait for the private endpoint connection to be approved.

   :::image type="content" alt-text="Screenshot of the Azure portal, showing an Approved status on the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints-key-vault\portal-key-vault-approved-private-endpoint.png" :::

#### [Azure CLI](#tab/azure-cli)

1. List private endpoint connections.

    ```azurecli
    az network private-endpoint-connection list --name <key-vault-resource-name>  --resource-group <key-vault-resource-group-name> --type 'Microsoft.KeyVault/vaults'
    ```

    There should be a pending private endpoint connection. Note its `id`.

    ```json
    [
        {
            "id": "<id>",
            "location": "",
            "name": "",
            "properties": {
                "privateLinkServiceConnectionState": {
                    "actionRequired": "None",
                    "description": "Please approve",
                    "status": "Pending"
               }
            }
        }
    ]
    ```

1. Approve the private endpoint connection.

    ```azurecli
    az network private-endpoint-connection approve --id <private-endpoint-connection-id>
    ```

-----

### 3. Query the status of the shared private link resource

It takes a few minutes for the approval to be propagated to Azure Web PubSub Service. You can check the state using either Azure portal or Azure CLI.  The shared private endpoint between Azure Web PubSub Service and Azure Key Vault is active when the container state is approved.

#### [Azure portal](#tab/azure-portal)

1. Go to the Azure Web PubSub Service resource in the Azure portal.
1. Select **Networking** from the menu.
1. Select **Shared private link resources**.

   :::image type="content" alt-text="Screenshot of an approved shared private endpoint." source="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-approved.png" lightbox="media\howto-secure-shared-private-endpoints-key-vault\portal-shared-private-endpoints-approved.png" :::

#### [Azure CLI](#tab/azure-cli)

```azurecli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webpubsub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2022-08-01-preview
```

This command would return a JSON, where the connection state would show up as "status" under the "properties" section.

```json
{
      "name": "contoso-kv",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.KeyVault/vaults/contoso-kv",
        "groupId": "vaults",
        "requestMessage": "please approve",
        "status": "Approved",
        "provisioningState": "Succeeded"
      }
}

```

When the "Provisioning State" (`properties.provisioningState`) of the resource is `Succeeded` and "Connection State" (`properties.status`) is `Approved`, the shared private link resource is functional, and Azure Web PubSub Service can communicate over the private endpoint.

-----

Now you can configure features like a custom domain as usual. You don't have to use a special domain for Key Vault. The Azure Web PubSub Service automatically handles DNS resolution.

## Next steps

Learn more:

* [What are private endpoints?](../private-link/private-endpoint-overview.md)
* [Configure a custom domain](howto-custom-domain.md)
