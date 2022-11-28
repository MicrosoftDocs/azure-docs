---
title: Secure Azure Web PubSub outbound traffic through Shared Private Endpoints
titleSuffix: Azure Web PubSub Service
description: How to secure Azure Web PubSub outbound traffic through Shared Private Endpoints to avoid traffic go to public network
author: ArchangelSDY

ms.service: azure-web-pubsub
ms.topic: article
ms.date: 11/08/2021
ms.author: dayshen
---

# Secure Azure Web PubSub outbound traffic through Shared Private Endpoints

If you're using an [event handler](concept-service-internals.md#event-handler) in Azure Web PubSub Service, you might have outbound traffic to an upstream. Upstream such as
Azure Web App and Azure Functions, can be configured to accept connections from a list of virtual networks and refuse outside connections that originate from a public network. You can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) to reach these endpoints.

   :::image type="content" alt-text="Diagram showing architecture of shared private endpoint." source="media\howto-secure-shared-private-endpoints\shared-private-endpoint-overview.png" border="false" :::

This outbound method is subject to the following requirements:

+ The upstream must be Azure Web App or Azure Function.

+ The Azure Web PubSub Service service must be on the Standard tier.

+ The Azure Web App or Azure Function must be on certain SKUs. See [Use Private Endpoints for Azure Web App](../app-service/networking/private-endpoint.md).

## Shared Private Link Resources Management

Private endpoints of secured resources that are created through Azure Web PubSub Service APIs are referred to as *shared private link resources*.  This term is used because you're "sharing" access to a resource, such as an Azure Function that has been integrated with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/). These private endpoints are created inside Azure Web PubSub Service execution environment and aren't directly visible to you.

> [!NOTE]
> The examples in this article are based on the following assumptions:
> * The resource ID of this Azure Web PubSub Service is _/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub.
> * The resource ID of upstream Azure Function is _/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Web/sites/contoso-func.

The rest of the examples show how the _contoso-webpubsub_ service can be configured so that its upstream calls to function go through a private endpoint rather than public network.

### Step 1: Create a shared private link resource to the function

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Web PubSub Service resource.
1. In the menu pane, select **Networking**. Switch to **Private access** tab.
1. Select **Add shared private endpoint**.

   :::image type="content" alt-text="Screenshot of shared private endpoints management." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-management.png" :::

1. Fill in a name for the shared private endpoint.
1. Select the target linked resource either by selecting from your owned resources or by filling a resource ID.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-add.png" :::

1. The shared private endpoint resource will be in **Succeeded** provisioning state. The connection state is **Pending** approval at target resource side.

   :::image type="content" alt-text="Screenshot of an added shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-added.png" :::

#### [Azure CLI](#tab/azure-cli)

You can make the following API call with the [Azure CLI](/cli/azure/) to create a shared private link resource:

```dotnetcli
az rest --method put --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/sharedPrivateLinkResources/func-pe?api-version=2021-06-01-preview --body @create-pe.json --debug
```

The contents of the *create-pe.json* file, which represent the request body to the API, are as follows:

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

The process of creating an outbound private endpoint is a long-running (asynchronous) operation. As in all asynchronous Azure operations, the `PUT` call returns an `Azure-AsyncOperation` header value that looks like the following example.

```plaintext
"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview"
```

You can poll this URI periodically to obtain the status of the operation.

If you're using the CLI, you can poll for the status by manually querying the `Azure-AsyncOperationHeader` value,

```dotnetcli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.SignalRService/webPubSub/contoso-webpubsub/operationStatuses/c0786383-8d5f-4554-8d17-f16fcf482fb2?api-version=2021-06-01-preview
```

Wait until the status changes to "Succeeded" before proceeding to the next steps.

-----

### Step 2a: Approve the private endpoint connection for the function

> [!IMPORTANT]
> After you approved the private endpoint connection, the Function is no longer accessible from public network. You may need to create other private endpoints in your own virtual network to access the Function endpoint.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, select the **Networking** tab of your Function App and navigate to **Private endpoint connections**. Select **Configure your private endpoint connections**. After the asynchronous operation has succeeded, there should be a request for a private endpoint connection with the request message from the previous API call.

   :::image type="content" alt-text="Screenshot of the Azure portal, showing the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approve-private-endpoint.png" :::

1. Select the private endpoint that Azure Web PubSub Service created. In the **Private endpoint** column, identify the private endpoint connection by the name that's specified in the previous API, select **Approve**.

   Make sure that the private endpoint connection appears as shown in the following screenshot. It could take one to two minutes for the status to be updated in the portal.

   :::image type="content" alt-text="Screenshot of the Azure portal, showing an Approved status on the Private endpoint connections pane." source="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" lightbox="media\howto-secure-shared-private-endpoints\portal-function-approved-private-endpoint.png" :::

#### [Azure CLI](#tab/azure-cli)

1. List private endpoint connections.

    ```dotnetcli
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

    ```dotnetcli
    az network private-endpoint-connection approve --id <private-endpoint-connection-id>
    ```

-----

### Step 2b: Query the status of the shared private link resource

It takes minutes for the approval to be propagated to Azure Web PubSub Service. You can check the state using either Azure portal or Azure CLI.

#### [Azure portal](#tab/azure-portal)
   
   :::image type="content" alt-text="Screenshot of an approved shared private endpoint." source="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" lightbox="media\howto-secure-shared-private-endpoints\portal-shared-private-endpoints-approved.png" :::

#### [Azure CLI](#tab/azure-cli)

```dotnetcli
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

If the "Provisioning State" (`properties.provisioningState`) of the resource is `Succeeded` and "Connection State" (`properties.status`) is `Approved`, it means that the shared private link resource is functional, and Azure Web PubSub Service can communicate over the private endpoint.

-----

At this point, the private endpoint between Azure SignalR Service and Azure Function is established.

### Step 3: Verify upstream calls are from a private IP

Once the private endpoint is set up, you can verify incoming calls are from a private IP by checking the `X-Forwarded-For` header at upstream side.

:::image type="content" alt-text="Screenshot of the Azure portal, showing incoming requests are from a private IP." source="media\howto-secure-shared-private-endpoints\portal-function-log.png" :::

## Next steps

Learn more about private endpoints:

+ [What are private endpoints?](../private-link/private-endpoint-overview.md)
