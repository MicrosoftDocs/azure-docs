---
title: Secure outbound traffic to Private Link Service through shared private endpoints
titleSuffix: Azure Web PubSub
description: Learn how to secure Azure Web PubSub outbound traffic to Azure Private Link Service by using shared private endpoints.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 09/23/2025
ms.author: dayshen
---

# Secure outbound traffic to Azure Private Link service through shared private endpoints

If you're using an [event handler](concept-service-internals.md#event-handler) in Azure Web PubSub, you might have outbound traffic to upstream endpoints backed by a [private link service](../private-link/private-link-service-overview.md). To secure such outbound traffic, you can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) in your Web PubSub services to reach these endpoints in a private way.

:::image type="content" alt-text="Diagram showing architecture of shared private endpoint." source="media\howto-secure-shared-private-endpoints-private-link-service\shared-private-endpoint-overview.png" border="false" :::

Azure Private Link Service can be backed by any application running behind Azure Standard Load Balancer. That means you can host your event handler in Virtual Machine, Virtual Machine Scale Set or Azure Kubernetes Service.

This outbound method is subject to the following requirements:

- The Private Link Service visibility must be configured ["visible to anyone"](../private-link/private-link-service-overview.md#control-service-exposure)
- The Web PubSub resource must be on the Standard tier or the Premium tier.

Private endpoints of secured resources that are created by using Azure Web PubSub APIs are called *shared private link resources*. You're "sharing" access to the Private Link Service. These private endpoints are created inside the Web PubSub service execution environment and aren't directly visible to you.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Web PubSub instance.
- An Azure Private Link Service. [Create a Private Link Service](../private-link/create-private-link-service-portal.md).

> [!NOTE]
> The examples in this article use the following values:
>
> - The resource ID of this Azure Web PubSub resource is `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub`.
> - The resource ID of the Azure Private Link Service resource is `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Network/privateLinkServices/contoso-pls`.
> - We'd like to use the domain `pls.contoso.com` to call the Private Link Service endpoint.
>
> To use the steps in the following examples, replace these values with your own subscription ID, the name of your Web PubSub resource, and the name of your Private Link Service.
>
> If you plan to use HTTPS for `pls.contoso.com` in event handler settings, make sure the application behind Azure Private Link Service is configured with correct certificate.

## Create a shared private link resource to a Private Link Service

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Web PubSub resource.
1. On the left menu, select **Networking**.
1. Select **Private access**.
1. Select **Add shared private endpoint**.

   :::image type="content" alt-text="Screenshot that shows managing shared private endpoints." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-management.png" lightbox="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-management.png" :::

1. Enter a name for the shared private endpoint.
1. To set your target linked sources, either choose **Select from your resources** or enter your resource ID in **Specify resource ID**.

    Optionally, you can enter text in **Request message** to send a request to the target resource owner.
1. Enter **FQDN** as `pls.contoso.com`.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a shared private endpoint." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-add.png" :::

The value for **Provisioning state** in the shared private endpoint resource is **Succeeded**. **Connection state** is **Pending** until the endpoint is approved at the target resource.

:::image type="content" alt-text="Screenshot that shows an added shared private endpoint pending approval." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-added.png" lightbox="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-added.png" :::

### [Azure CLI](#tab/azure-cli)

Use the following API call with the [Azure CLI](/cli/azure/) to create a shared private link resource. Replace the values in the following example with the values from your scenario.

```bash
az rest --method put --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/pls-pe?api-version=2024-08-01-preview --body @create-pe.json --debug
```

The *create-pe.json* file contains the request body to the API. It's similar to the following example:

```json
{
      "name": "pls-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Network/privateLinkServices/contoso-pls",
        "fqdns": [
            "pls.contoso.com"
        ],
        "requestMessage": "please approve"
      }
}
```

The process of creating an outbound private endpoint is a long-running (asynchronous) operation. As in all asynchronous Azure operations, the PUT call returns an `Azure-AsyncOperation` header value that's similar to the following example:

```plaintext
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2024-08-01-preview"
```

To poll this URI periodically to get the status of the operation, manually query the `Azure-AsyncOperationHeader` value. Here's an example:

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2024-08-01-preview
```

Wait until the status changes to "Succeeded" before you go to the next step.

-----

## Approve the private endpoint connection

When the shared private endpoint connection has a **Pending** status, the connection request must be approved at the target resource.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Private Link Service.
1. On the left menu, select **Settings - Private endpoint connections**.
1. Select the pending connection that you created in your Web PubSub resource.
1. Select **Approve**, and then select **Yes** to confirm.

:::image type="content" alt-text="Screenshot of approving a private endpoint connection." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-private-link-service-approve-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints-private-link-service\portal-private-link-service-approve-private-endpoint.png" :::

You can select **Refresh** to check the status. It might take a few minutes for the status **Connection state** to update to **Approved**.  

:::image type="content" alt-text="Screenshot of the Azure portal, showing an Approved status on the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-private-link-service-approved-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints-private-link-service\portal-private-link-service-approved-private-endpoint.png" :::

### [Azure CLI](#tab/azure-cli)

1. List private endpoint connections:

    ```bash
    az network private-endpoint-connection list -n <private-link-service-resource-name>  -g <private-link-service-resource-group-name> --type 'Microsoft.Network/privateLinkServices'
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

:::image type="content" alt-text="Screenshot of an approved shared private endpoint." source="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-approved.png" lightbox="media\howto-secure-shared-private-endpoints-private-link-service\portal-shared-private-endpoints-approved.png" :::

### [Azure CLI](#tab/azure-cli)

```bash
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/pls-pe?api-version=2024-08-01-preview
```

This command returns JSON. The connection state is indicated in `status` under `properties`.

```json
{
      "name": "pls-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Network/privateLinkServices/contoso-pls",
        "fqdns": [
            "pls.contoso.com"
        ],
        "requestMessage": "please approve",
        "status": "Approved",
        "provisioningState": "Succeeded"
      }
}

```

When `properties.provisioningState` is `Succeeded` and `properties.status` (connection state) is `Approved`, the shared private link resource is functional, and Web PubSub can communicate over the private endpoint.

-----

At this point, the private endpoint between Azure Web PubSub and Azure Private Link Service is established. You can use URL like `http://pls.contoso.com/eventhandler` in event handler settings. When Azure Web PubSub sends event handler requests, `pls.contoso.com` is internally resolved to a private address and traffic go through private network.

## Related content

- [What is a private endpoint?](../private-link/private-endpoint-overview.md)
- [What is a private link service?](../private-link/private-link-service-overview.md)
