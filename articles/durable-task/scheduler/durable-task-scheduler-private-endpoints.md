---
author: berndverst
ms.author: beverst
title: Private endpoints for Durable Task Scheduler
titleSuffix: Durable Task
description: Learn how to use private endpoints to secure connectivity between your apps and Durable Task Scheduler.
ms.topic: concept-article
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.date: 03/24/2026

#customer intent: As a developer or cloud architect, I want to understand how private endpoints work with Durable Task Scheduler so that I can secure my orchestration traffic within a virtual network.
---

# Private endpoints for Durable Task Scheduler (preview)

> [!IMPORTANT]
> Private endpoints for Durable Task Scheduler are currently in **limited preview**. To gain access to this feature, contact us at [dtspe@microsoft.com](mailto:dtspe@microsoft.com). General availability is expected in late May 2026.

A [private endpoint](/azure/private-link/private-endpoint-overview) is a network interface that connects you privately and securely to a service powered by Azure Private Link. You can use private endpoints with Durable Task Scheduler to allow apps in your virtual network to connect to the scheduler over a private connection, without exposing traffic to the public internet.

## Private endpoint connections

By default, apps connect to the Durable Task Scheduler over a public endpoint address in the format `{scheduler-name}-{suffix}.{region}.durabletask.io`. When you create a private endpoint for your scheduler resource, the endpoint is mapped to a private IP address in your virtual network. This configuration allows your apps to communicate with the scheduler over the private network link instead of the public internet.

A private endpoint for Durable Task Scheduler targets the `scheduler` subresource on the `Microsoft.DurableTask/schedulers` resource type.

Clients connecting through the private endpoint use the same endpoint address and authentication mechanism as clients connecting to the public endpoint. DNS resolution automatically resolves the scheduler endpoint to the private IP address when the request originates from within the virtual network.

## Benefits

Private endpoints for Durable Task Scheduler enable you to:

- **Secure your scheduler** by configuring the firewall to block all connections on the public endpoint.
- **Increase security** for the virtual network by enabling you to block exfiltration of data from the virtual network.
- **Connect securely** from on-premises networks that connect to the virtual network using [VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](/azure/expressroute/expressroute-introduction) with private peering.

## Network architecture

With a private endpoint, connectivity between the apps in the virtual network and the scheduler flows over the Microsoft backbone network. Traffic never traverses the public internet.

The following diagram illustrates the difference between public and private endpoint connectivity:

- **Without a private endpoint**, your app sends gRPC traffic over the public internet to the scheduler's public endpoint.
- **With a private endpoint**, your app sends gRPC traffic through the virtual network's private IP address, which routes through the Azure Private Link to the scheduler.

Both connection methods use TLS encryption and identity-based authentication via [managed identity](./durable-task-scheduler-identity.md).

## DNS configuration

When you create a private endpoint for a Durable Task Scheduler resource, the DNS resolution of the scheduler's endpoint must resolve to the private IP address assigned to the private endpoint. You can use one of the following approaches:

- **Azure Private DNS zones (recommended)**: Azure automatically configures a [private DNS zone](/azure/dns/private-dns-overview) linked to your virtual network. DNS queries for the scheduler endpoint resolve to the private IP address from within the virtual network.
- **Custom DNS server**: If you use a custom DNS server, add a DNS record for the scheduler endpoint that points to the private IP address of the private endpoint.
- **Host file (for testing)**: You can modify the host file on a virtual machine to point the scheduler endpoint to the private IP address of the private endpoint.

> [!IMPORTANT]
> Without proper DNS configuration, your apps aren't able to resolve the scheduler endpoint to the private IP address, and the private endpoint connection fails.

## Public network access

After you set up a private endpoint, you can optionally disable public network access on the Durable Task Scheduler resource. When public access is disabled, *only* connections through private endpoints are allowed. This configuration ensures all traffic between your apps and the scheduler stays within the virtual network.

> [!NOTE]
> Disabling public network access also affects access to the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). To continue using the dashboard with private endpoints, ensure the dashboard is accessed from within the virtual network or through a network path that routes to the private endpoint.

## Considerations

Keep the following considerations in mind when using private endpoints with Durable Task Scheduler:

- **Region**: The private endpoint must be deployed in the same region as the virtual network. The scheduler resource can be in a different region, though placing them in the same region is recommended for optimal latency.
- **SKU availability**: Private endpoints are supported on schedulers using both the [Dedicated SKU](./durable-task-scheduler-billing.md#dedicated-sku) and [Consumption SKU](./durable-task-scheduler-billing.md#consumption-sku).
- **Multiple private endpoints**: You can create multiple private endpoints for the same scheduler resource in different virtual networks to enable access from multiple networks.
- **Identity and RBAC**: Private endpoints secure the *network path* to the scheduler. You still need to configure [identity-based access control](./durable-task-scheduler-identity.md) to authenticate and authorize your apps.
- **Task hubs**: A private endpoint connection on the scheduler applies to all task hubs within that scheduler. You can't create private endpoint connections for individual task hubs.
- **Emulator**: The [Durable Task Scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-the-durable-task-emulator) runs locally and doesn't support private endpoints. Private endpoints apply only to scheduler resources deployed in Azure.

## Next steps

> [!div class="nextstepaction"]
> [Configure managed identity for Durable Task Scheduler](./durable-task-scheduler-identity.md)

- [Learn more about Azure Private Link](/azure/private-link/private-link-overview)
- [Learn more about Azure Private Endpoints](/azure/private-link/private-endpoint-overview)
- [About Durable Task Scheduler](./durable-task-scheduler.md)
