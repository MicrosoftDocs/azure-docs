---
title: Connect blob access points privately (preview)
titleSuffix: Azure Blob Storage
description: Use a Private Link service or an Application Gateway so that blob access points reach your data source without using the public internet.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/09/2026
# Customer intent: As a network administrator, I want blob access points to reach my data source over a private connection, so that data doesn't travel over the public internet.
---

# Connect blob access points to a data source privately (preview)

[!INCLUDE [Blob access points private connection preview](../../../includes/storage-blob-access-points-preview.md)]

A private connection lets Azure Storage reach your data source without using the public internet. Azure Storage creates a managed private endpoint that connects to a Private Link-enabled resource in front of your data source. You approve the private endpoint connection on your resource, and then Azure Storage reads your data over it. You don't manage the private endpoint yourself.

## Prerequisites

- A storage account in a [supported region](blob-access-points-overview.md#supported-regions), with blob access point creation allowed. For steps, see [Allow blob access point creation](blob-access-points-create.md#allow-blob-access-point-creation). The Azure portal steps work only in regions where the Azure portal experience for blob access points is available. In other supported regions, use the REST API.

- Network access to the storage account from the clients that read data. The network rules of the storage account apply to blob access points the same way that they apply to other containers, whether the connection to your data source is public or private. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations).

- The [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) role, or Storage Blob Access Point Contributor (preview), on the storage account. For details, see [Authorize access to blob access points](blob-access-points-authorize.md).

- A Private Link-enabled resource in front of your data source, in the **same region** as the storage account. For the options, see [Choose a private connection](#choose-a-private-connection).

- Permission to approve private endpoint connections on that resource.

- For a data source in your own datacenter, an Azure ExpressRoute circuit or a site-to-site VPN between your network and Azure.

- The details of your data source, such as its source endpoint and credentials. For the complete list, see [Data source requirements for blob access points](blob-access-points-data-sources.md).

## Choose a private connection

Choose the Private Link-enabled resource that fits your data source.

| Option | Use it when | Learn more |
|---|---|---|
| Private Link service | Your data source is behind an Azure Standard Load Balancer. | [What is Azure Private Link service?](/azure/private-link/private-link-service-overview) |
| Private Link service Direct Connect (preview) | You want the Private Link service to connect directly to the private IP address of your data source, without a load balancer. Suited to high data transfer, and to data sources in your own datacenter. Available in limited regions. | [Configure Private Link service Direct Connect](/azure/private-link/configure-private-link-service-direct-connect) |
| Application Gateway | Your data source is behind an Application Gateway that uses a TCP/TLS proxy (Layer 4) listener, with Private Link configured on the listener's frontend IP configuration. Suited to a proof of concept at lower cost, and to data sources in your own datacenter when Private Link service Direct Connect isn't available in your region. | [Application Gateway TCP/TLS proxy overview](/azure/application-gateway/tcp-tls-proxy-overview) and [Application Gateway Private Link](/azure/application-gateway/private-link) |

For a data source in your own datacenter, connect your network to Azure with ExpressRoute or a site-to-site VPN through Azure VPN Gateway. Then use one of the following options to reach the private IP address of the data source:

- **Private Link service Direct Connect**, if it's available in the region of your storage account.
- **Application Gateway**, if Direct Connect isn't available in your region. Use a TCP/TLS proxy listener, and add the private IP address of your data source to the backend pool. The Application Gateway must be able to reach the data source through your ExpressRoute or VPN connection. For network requirements, see [Application Gateway infrastructure configuration](/azure/application-gateway/configuration-infrastructure).

Before you choose Private Link service Direct Connect, check its limitations:

- Confirm that it's available in the region of your storage account. It's in preview and is available in limited regions. If it isn't available, use an Application Gateway instead.
- With ExpressRoute, the Private Link service and the ExpressRoute gateway must be in the same virtual network. You can't route through the ExpressRoute gateway of a peered virtual network.

For the current region list and other limitations, see [Configure Private Link service Direct Connect](/azure/private-link/configure-private-link-service-direct-connect#limitations).

:::image type="content" source="media/blob-access-points-private-connectivity/private-paths.svg" alt-text="Diagram that shows private connections from Azure Storage to data sources in Azure and in an on-premises datacenter." lightbox="media/blob-access-points-private-connectivity/private-paths.svg" border="false":::

## Prepare the private resource

1. Create the Private Link-enabled resource in the same region as your storage account. For steps, see the article for your option:

   - Private Link service: [Create a Private Link service by using the Azure portal](/azure/private-link/create-private-link-service-portal)
   - Private Link service Direct Connect: [Configure Private Link service Direct Connect](/azure/private-link/configure-private-link-service-direct-connect)
   - Application Gateway: [Application Gateway TCP/TLS proxy overview](/azure/application-gateway/tcp-tls-proxy-overview) and [Configure Application Gateway Private Link](/azure/application-gateway/private-link-configure)

1. If you use an Application Gateway, configure Private Link on the gateway, and associate it with the frontend IP configuration that your TCP/TLS listener uses. Without this association, Private Link isn't enabled on the gateway. For steps, see [Configure Application Gateway Private Link](/azure/application-gateway/private-link-configure).

1. Confirm that the resource can reach your data source on the port that the data source uses.

1. Note the URL that reaches your data source through the resource. Use it as the source endpoint of the configuration.

1. Note the full resource ID of the Private Link service or Application Gateway. For example:

   - `/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/privateLinkServices/<name>`
   - `/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/applicationGateways/<name>`

## Create a configuration that uses a private connection

### [Portal](#tab/azure-portal)

Follow the steps in [Create a configuration](blob-access-points-create.md#create-a-configuration), and make these changes on the **Basics** tab:

1. For **Source endpoint**, enter the URL that reaches your data source through the private resource.

1. Under **Networking**, select **Private (Preview)**.

1. For **Resource type**, select **Microsoft.Network/privateLinkServices** or **Microsoft.Network/applicationGateways**. To enter a resource ID instead, select **Custom: Specify resource ID**.

1. For **Resource**, select your Private Link service or Application Gateway. If you selected **Custom: Specify resource ID**, enter the full resource ID in **Resource ID** instead.

1. Review the **Request message**. The portal fills it in with a message that includes the configuration name. You can change it, but keep the configuration name so the owner of the resource can find the connection request.

   :::image type="content" source="media/blob-access-points-private-connectivity/private-connection-type.png" alt-text="Screenshot of the Basics tab of a new blob access point configuration, with the Private (Preview) connection type highlighted.":::

### [REST API](#tab/rest-api)

Use the request in [Create a configuration](blob-access-points-create.md#create-a-configuration), but replace the `connection` object with the following object.

```json
"connection": {
  "connectionType": "PrivateLink",
  "privateLinkIdType": "ResourceId",
  "privateLinkId": "<private-link-resource-id>",
  "privateLinkLocation": "<private-link-resource-region>",
  "requestMessage": "Blob access point configuration <configuration-name> connection requested",
  "endpoint": "https://<private-endpoint-address>/<bucket>",
  "tlsVerification": "Perform"
}
```

The example uses a Private Link service. For an Application Gateway, also add `"privateLinkGroupId": "<frontend-ip-configuration-name>"` to the `connection` object.

| Property | Description |
|---|---|
| `privateLinkIdType` | Must be `ResourceId`. Aliases aren't supported. |
| `privateLinkId` | The full resource ID of the Private Link service or Application Gateway. |
| `privateLinkLocation` | The region of the resource. It must match the region of the storage account. |
| `privateLinkGroupId` | Required for an Application Gateway. Set it to the name of the frontend IP configuration that has the Private Link configuration. Not needed for a Private Link service. |
| `requestMessage` | Required. The message that the owner of the resource sees with the connection request. Include the configuration name so the owner can match the request to the configuration. |
| `endpoint` | The URL that reaches your data source through the private resource. |

---

> [!NOTE]
> Creating a configuration that uses a private connection takes about five to six minutes. By using the REST API, keep checking `properties.provisioningState` until it's `Succeeded`, `Failed`, or `Canceled`.

Azure Storage creates the managed private endpoint in the region of the storage account. If it can't create the managed private endpoint, configuration creation fails.

## Approve the private endpoint connection

After you create the configuration, approve the pending private endpoint connection on your resource.

1. In the Azure portal, go to your Private Link service or Application Gateway.

1. Open the list of private endpoint connections. Find the pending connection whose description shows your request message, select it, and then select **Approve**.

   The list doesn't show which configuration a connection belongs to. On a Private Link service, the **Description** column shows the request message, so use it to match the connection to your configuration.

   :::image type="content" source="media/blob-access-points-private-connectivity/approve-connection.png" alt-text="Screenshot of a pending private endpoint connection on a Private Link service, with the Approve button and the request message highlighted." lightbox="media/blob-access-points-private-connectivity/approve-connection.png":::

For more information, see [Manage Azure private endpoints](/azure/private-link/manage-private-endpoint).

After you approve the connection, [test the connection](blob-access-points-create.md#test-the-connection) and [create the blob access point](blob-access-points-create.md#create-a-blob-access-point).

## Deactivate and reactivate a private configuration

Deactivating a configuration that uses a private connection releases its managed private endpoint. When you activate the configuration again, Azure Storage creates a new managed private endpoint. Approve the new connection, and then test the connection again.

## Troubleshoot private connections

| Symptom | What to check |
|---|---|
| The private endpoint connection stays pending | Approve the connection on your resource. See [Troubleshoot a private endpoint connection stuck in the Pending state](/troubleshoot/azure/private-link/troubleshoot-private-endpoint-pending-approval). |
| Configuration creation doesn't complete and eventually fails | The Private Link resource must be in the same region as the storage account. A request for a resource in another region is accepted, but it never completes. Creating a private configuration normally takes about five to six minutes. |
| The connection test passes, but reads through the blob access point fail | The network rules of the storage account block the client. Allow the client, as you would for any container. See [Networking considerations](blob-access-points-overview.md#networking-considerations). |
| The connection test fails on the network | Check that the resource routes traffic to your data source, that firewall rules on the data source allow it, and, for an on-premises data source, that the ExpressRoute or VPN connection is up. |
| The connection test fails on TLS | Install a certificate from a trusted certificate authority on your data source. For testing only, allow self-signed certificates. |

For other errors, see [Troubleshoot blob access points](blob-access-points-troubleshoot.md).

## Related content

- [What is Azure Private Link service?](/azure/private-link/private-link-service-overview)
- [Create a Private Link service by using the Azure portal](/azure/private-link/create-private-link-service-portal)
- [Configure Private Link service Direct Connect](/azure/private-link/configure-private-link-service-direct-connect)
- [Application Gateway TCP/TLS proxy overview](/azure/application-gateway/tcp-tls-proxy-overview)
- [Manage Azure private endpoints](/azure/private-link/manage-private-endpoint)
- [What is Azure ExpressRoute?](/azure/expressroute/expressroute-introduction)
- [What is Azure VPN Gateway?](/azure/vpn-gateway/vpn-gateway-about-vpngateways)
