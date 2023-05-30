---
title: Secure Azure Web PubSub outbound traffic through shared private endpoints
titleSuffix: Azure Web PubSub Service
description: How to secure Azure Web PubSub outbound traffic through shared private endpoints
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 03/27/2023
ms.author: dayshen
---

# Secure Azure Web PubSub outbound traffic through shared private endpoints

If you're using an [event handler](concept-service-internals.md#event-handler) in Azure Web PubSub Service, you might have outbound traffic to upstream endpoints to an Azure Static Web App or an Azure Function. Azure Static Web Apps and Azure Functions can be configured with endpoints to accept connections from a list of virtual networks and refuse outside connections that originate from a public network. You can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) in your Web PubSub services to reach these endpoints.

   :::image type="content" alt-text="Diagram showing architecture of shared private endpoint." source="media\howto-secure-shared-private-endpoints\shared-private-endpoint-overview.png" border="false" :::

This article shows you how to configure your Web PubSub service to send upstream calls to an Azure Function through a shared private endpoint rather than public network.

This outbound method is subject to the following requirements:

- The upstream endpoint must be Azure Web App or Azure Function.
- The Azure Static Web PubSub Service service must be on the Standard or Premium tier.
- The Azure Static Web App or Azure Function must be on certain SKUs. See [Use Private Endpoints for Azure Web App](../app-service/networking/private-endpoint.md).

Private endpoints of secured resources created through Azure Web PubSub Service APIs are referred to as *shared private link resources*.  This term is used because you're "sharing" access to a resource, such as an Azure Function that has been integrated with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/). These private endpoints are created inside Azure Web PubSub service execution environment and aren't directly visible to you.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Web PubSub Service instance. 
- An Azure Functions resource.

> [!NOTE]
> The examples in this article uses the following values:
>
> - The resource ID of this Azure Web PubSub Service is _/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub.
> - The resource ID of upstream Azure Function is _/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Web/sites/contoso-func.
> You will need to replace these values with your own subscription id, Web PubSub Service name, and Function name.


## Step 1: Create a shared private link resource to the function

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Web PubSub Service resource.
1. Select **Networking** from the menu.
1. Select the **Private access** tab.
1. Select **Add shared private endpoint**.

   :::image type="content" alt-text="Screenshot of shared private endpoints management." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" :::

1. Enter a name for the shared private endpoint.
1. Choose your target linked sources by selecting **Select from your resources** or enter your resource ID by selecting **Specify resource ID**.
1. Optionally, you may enter a **Request message** to be sent to the target resource owner.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-add.png" :::

The shared private endpoint resource is **Provisioning state** is *Succeeded*. The **Connection state** is *Pending* until the endpoint is approved at the target resource.

   :::image type="content" alt-text="Screenshot of an added shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" :::

### [Azure CLI](#tab/azure-cli)

You use the following API call with the [Azure CLI](/cli/azure/) to create a shared private link resource.  Replace the values in the following example with your own values.

```bash:

```bash
az rest --method put --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2021-06-01-preview --body @create-pe.json --debug
```

The *create-pe.json* file contains the request body to the API.  It is similar to the following example:

```json
{
      "name": "func-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Web/sites/contoso-func",
        "groupId": "sites",
        "requestMessage": "please approve"
      }
}
```

The process of creating an outbound private endpoint is a long-running (asynchronous) operation. As in all asynchronous Azure operations, the `PUT` call returns an `Azure-AsyncOperation` header value similar to the following example.

```plaintext
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview"
```

You can poll this URI periodically to obtain the status of the operation by manually querying the `Azure-AsyncOperationHeader` value.

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview
```

Wait until the status changes to "Succeeded" before proceeding to the next step.

-----

## Step 2: Approve the private endpoint connection for the function

When the shared private endpoint connection is in *Pending* state, you need to approve the connection request at the target resource.

> [!IMPORTANT]
> After you approved the private endpoint connection, the Function is no longer accessible from public network. You may need to create other private endpoints in your own virtual network to access the Function endpoint.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Function App.
1. Select the **Networking** from the menu
1. Select the **Private endpoints** in the **Inbound Traffic** section.
1. Select the pending connection that you created in your Web PubSub resource.
1. Select **Approve** and **Yes** to confirm.

:::image type="content" alt-text="Screenshot of approving a private endpoint connection." source="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" :::

You can select **Refresh** to check the status.  It could take a few minutes for the status **Connection state** to update to *Approved*.  

   :::image type="content" alt-text="Screenshot of the Azure portal, showing an Approved status on the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" :::

### [Azure CLI](#tab/azure-cli)

1. List private endpoint connections.

    ```bash
    az network private-endpoint-connection list -n <function-resource-name>  -g <function-resource-group-name> --type 'Microsoft.Web/sites'
    ```

    There should be a pending private endpoint connection. Note down its ID.

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

    ```bash
    az network private-endpoint-connection approve --id <private-endpoint-connection-id>
    ```

-----

## Step 3: Query the status of the shared private link resource

It takes a few minutes for the approval to be propagated to Azure Web PubSub Service. You can check the state using either Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

   :::image type="content" alt-text="Screenshot of an approved shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" :::

### [Azure CLI](#tab/azure-cli)

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2021-06-01-preview
```

This command would return JSON, where the connection state would show up as "status" under the "properties" section.

```json
{
      "name": "func-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Web/sites/contoso-func",
        "groupId": "sites",
        "requestMessage": "please approve",
        "status": "Approved",
        "provisioningState": "Succeeded"
      }
}

```

When the `properties.provisioningState` is `Succeeded` and `properties.status` (connection state) is `Approved`, the shared private link resource is functional, and Azure Web PubSub Service can communicate over the private endpoint.

-----

At this point, the private endpoint between Azure Web PubSub Service and Azure Function is established.

### Step 4: Verify upstream calls are from a private IP

Once the private endpoint is set up, you can verify incoming calls are from a private IP by checking the `X-Forwarded-For` header at upstream side.

:::image type="content" alt-text="Screenshot of the Azure portal, showing incoming requests are from a private IP." source="media\howto-secure-shared-private-endpoints\portal-function-log.png" :::

## Next steps

Learn more about private endpoints:

[What are private endpoints?](../private-link/private-endpoint-overview.md)
