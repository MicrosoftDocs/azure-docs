---
title: Secure outbound traffic through shared private endpoints
titleSuffix: Azure Web PubSub
description: Learn how to secure Azure Web PubSub outbound traffic by using shared private endpoints.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 08/16/2024
ms.author: dayshen
---

# Secure outbound traffic through shared private endpoints

If you're using an [event handler](concept-service-internals.md#event-handler) in Azure Web PubSub, you might have outbound traffic to upstream endpoints to a static web app that you created by using the Web Apps feature of Azure App Service or to a function that you created by using Azure Functions. You can configure Web Apps and Functions to use endpoints that accept connections from a list of virtual networks and refuse outside connections that originate in a public network. You can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) in your Web PubSub services to reach these endpoints.

:::image type="content" alt-text="Diagram showing architecture of shared private endpoint." source="media\howto-secure-shared-private-endpoints\shared-private-endpoint-overview.png" border="false" :::

This article shows you how to configure your Web PubSub resource to send upstream calls to a function in Azure Functions through a shared private endpoint instead of through a public network.

This outbound method is subject to the following requirements:

- The upstream endpoint must be deployed by using Azure App Service or Azure Functions.
- The Web PubSub resource must be on the Standard tier or the Premium tier.
- An Azure App Service or an Azure Functions resource must be created by choosing a specific tier to create the resource. For more information, see [Use private endpoints for Azure Web App](../app-service/networking/private-endpoint.md).

Private endpoints of secured resources that are created by using Azure Web PubSub APIs are called *shared private link resources*. You're "sharing" access to a resource, such as an Azure Functions resource, that is integrated with [Azure Private Link](https://azure.microsoft.com/services/private-link/). These private endpoints are created inside the Web PubSub service execution environment and aren't directly visible to you.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Web PubSub instance.
- An Azure Functions resource.

> [!NOTE]
> The examples in this article uses the following values:
>
> - The resource ID of this Azure Web PubSub resource is `_/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub`.
> - The resource ID of the Azure Functions network resource is `_/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Web/sites/contoso-func`.
>
> To use the steps in the following examples, replace these values with your own subscription ID, the name of your Web PubSub resource, and the name of your Azure Functions resource.

## Create a shared private link resource to a function

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Web PubSub resource.
1. On the left menu, select **Networking**.
1. Select **Private access**.
1. Select **Add shared private endpoint**.

   :::image type="content" alt-text="Screenshot that shows managing shared private endpoints." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" :::

1. Enter a name for the shared private endpoint.
1. To set your target linked sources, either choose **Select from your resources** or enter your resource ID in **Specify resource ID**.

    Optionally, you can enter text in **Request message** to send a request to the target resource owner.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-add.png" :::

The value for **Provisioning state** in the shared private endpoint resource is **Succeeded**. **Connection state** is **Pending** until the endpoint is approved at the target resource.

:::image type="content" alt-text="Screenshot that shows an added shared private endpoint pending approval." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" :::

### [Azure CLI](#tab/azure-cli)

Use the following API call with the [Azure CLI](/cli/azure/) to create a shared private link resource. Replace the values in the following example with the values from your scenario.

```bash:

```bash
az rest --method put --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2021-06-01-preview --body @create-pe.json --debug
```

The *create-pe.json* file contains the request body to the API. It's similar to the following example:

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

The process of creating an outbound private endpoint is a long-running (asynchronous) operation. As in all asynchronous Azure operations, the PUT call returns an `Azure-AsyncOperation` header value that's similar to the following example:

```plaintext
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview"
```

To poll this URI periodically to get the status of the operation, manually query the `Azure-AsyncOperationHeader` value. Here's an example:

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview
```

Wait until the status changes to "Succeeded" before you go to the next step.

-----

## Approve the private endpoint connection for the function

When the shared private endpoint connection has a **Pending** status, the connection request must be approved at the target resource.

> [!IMPORTANT]
> After the private endpoint connection is approved, the function is no longer accessible from a public network. You might need to create other private endpoints in your own virtual network to access the function endpoint.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Functions app.
1. On the left menu, select **Networking**.
1. Under **Inbound Traffic**, select **Private endpoints**.
1. Select the pending connection that you created in your Web PubSub resource.
1. Select **Approve**, and then select **Yes** to confirm.

:::image type="content" alt-text="Screenshot of approving a private endpoint connection." source="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" :::

You can select **Refresh** to check the status. It might take a few minutes for the status **Connection state** to update to **Approved**.  

:::image type="content" alt-text="Screenshot of the Azure portal, showing an Approved status on the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" :::

### [Azure CLI](#tab/azure-cli)

1. List private endpoint connections:

    ```bash
    az network private-endpoint-connection list -n <function-resource-name>  -g <function-resource-group-name> --type 'Microsoft.Web/sites'
    ```

    Check for a pending private endpoint connection. Note the connection ID.

    ```json
    [
        {
            "id": "<ID>",
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

1. Approve the private endpoint connection:

    ```bash
    az network private-endpoint-connection approve --id <private-endpoint-connection-ID>
    ```

-----

## Query the status of the shared private link resource

It takes a few minutes for the approval to be reflected in Web PubSub. You can check the state by using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/azure-portal)

:::image type="content" alt-text="Screenshot of an approved shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" :::

### [Azure CLI](#tab/azure-cli)

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2021-06-01-preview
```

This command returns JSON. The connection state is indicated in `status` under `properties`.

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

When `properties.provisioningState` is `Succeeded` and `properties.status` (connection state) is `Approved`, the shared private link resource is functional, and Web PubSub can communicate over the private endpoint.

-----

At this point, the private endpoint between Azure Web PubSub and Azure Functions is established.

## Verify that upstream calls are from a private IP address

When the private endpoint is set up, you can verify that incoming calls are from a private IP address by checking the `X-Forwarded-For` header for upstream calls.

:::image type="content" alt-text="Screenshot of the Azure portal, showing that incoming requests are from a private IP." source="media\howto-secure-shared-private-endpoints\portal-function-log.png" :::

## Related content

- [What is a private endpoint?](../private-link/private-endpoint-overview.md)
