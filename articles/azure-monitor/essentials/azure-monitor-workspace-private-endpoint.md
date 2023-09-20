---
title: Use private endpoints for Managed Prometheus and Azure Monitor workspaces
description: Overview of private endpoints for secure query access to Azure Monitor workspace from virtual networks.
author: EdB-MSFT
ms.author: edbaynash 
ms.reviewer: tbd
ms.topic: conceptual
ms.date: 05/03/2023
---

# Use private endpoints for Managed Prometheus and Azure Monitor workspace

Use [private endpoints](../../private-link/private-endpoint-overview.md) for Managed Prometheus and your Azure Monitor workspace to allow clients on a virtual network (VNet) to securely query data over a [Private Link](../../private-link/private-link-overview.md). The private endpoint uses a separate IP address within the VNet address space of your Azure Monitor workspace resource. Network traffic between the clients on the VNet and the workspace resource traverses the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

> [!NOTE]
> If you are using Azure Managed Grafana to query your data, please configure a [Managed Private Endpoint](https://aka.ms/ags/mpe) to ensure the queries from Managed Grafana into your Azure Monitor workspace use the Microsoft backbone network without going through the internet.  


Using private endpoints for your workspace enables you to:

- Secure your workspace by configuring the public access network setting to block all connections on the public query endpoint for the workspace.
- Increase security for the VNet, by enabling you to block exfiltration of data from the VNet.
- Securely connect to workspaces from on-premises networks that connect to the VNet using [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../../expressroute/expressroute-locations.md) with private-peering.

## Conceptual overview

:::image type="content" source="./media/azure-monitor-workspace-private-endpoint/azure-monitor-workspace-private-endpoints-overview.png" alt-text="A diagram showing an overview of private endpoints for Azure Monitor workspace."  lightbox="./media/azure-monitor-workspace-private-endpoint/azure-monitor-workspace-private-endpoints-overview.png" :::

A private endpoint is a special network interface for an Azure service in your [Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet). When you create a private endpoint for your workspace, it provides secure connectivity between clients on your VNet and your workspace. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and the workspace uses a secure private link.

Applications in the VNet can connect to the workspace over the private endpoint seamlessly, **using the same connection strings and authorization mechanisms that they would use otherwise**.

Private endpoints can be created in subnets that use [Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md). Clients in the subnet can then connect to a workspace using a private endpoint, while using service endpoints to access other services.

When you create a private endpoint for a workspace in your VNet, a consent request is sent for approval to the workspace account owner. If the user requesting the creation of the private endpoint is also an owner of the workspace, this consent request is automatically approved.

Azure Monitor workspace owners can manage consent requests and the private endpoints through the '*Private Access*' tab on the Networking page for the workspace in the [Azure portal](https://portal.azure.com).


> [!TIP]
> If you want to restrict access to your workspace through the private endpoint only, select 'Disable public access and use private access' on the '*Public Access*' tab on the Networking page for the workspace in the [Azure portal](https://portal.azure.com).

## Create a private endpoint

To create a private endpoint by using the Azure portal, PowerShell, or the Azure CLI, see the following articles. The articles feature an Azure web app as the target service, but the steps to create a private link are the same for an Azure Monitor workspace.

When you create a private endpoint, select the **Resource type**  `Microsoft.Monitor/accounts` and specify the Azure Monitor workspace to which it connects. Select `prometheusMetrics` as the Target sub-resource.

- [Create a private endpoint using Azure portal](../../private-link/create-private-endpoint-portal.md#create-a-private-endpoint)

- [Create a private endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md#create-a-private-endpoint)

- [Create a private endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md#create-a-private-endpoint)


## Connect to a private endpoint

Clients on a VNet using the private endpoint should use the same query endpoint for the Azure monitor workspace as clients connecting to the public endpoint. We rely upon DNS resolution to automatically route the connections from the VNet to the workspace over a private link.

By default, We create a [private DNS zone](../../dns/private-dns-overview.md) attached to the VNet with the necessary updates for the private endpoints. However, if you're using your own DNS server, you may need to make additional changes to your DNS configuration. The section on [DNS changes](#dns-changes-for-private-endpoints) below describes the updates required for private endpoints.

## DNS changes for private endpoints

> [!NOTE]
> For details on how to configure your DNS settings for private endpoints, see [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md).

When you create a private endpoint, the DNS CNAME resource record for the workspace is updated to an alias in a subdomain with the prefix `privatelink`. By default, we also create a [private DNS zone](../../dns/private-dns-overview.md), corresponding to the `privatelink` subdomain, with the DNS A resource records for the private endpoints.

When you resolve the query endpoint URL from outside the VNet with the private endpoint, it resolves to the public endpoint of the workspace. When resolved from the VNet hosting the private endpoint, the query endpoint URL resolves to the private endpoint's IP address.

For the example below we're using `k8s02-workspace` located in the East US region. The resource name is not guaranteed to be unique, which requires us to add a few characters after the name to make the URL path unique; for example, `k8s02-workspace-<key>`. This unique query endpoint is shown on the Azure Monitor workspace Overview page.

:::image type="content" source="./media/azure-monitor-workspace-private-endpoint/azure-monitor-workspace-overview.png" alt-text="A screenshot showing an Azure Monitor workspace overview page." lightbox="./media/azure-monitor-workspace-private-endpoint/azure-monitor-workspace-overview.png":::

The DNS resource records for the Azure Monitor workspace when resolved from outside the VNet hosting the private endpoint, are:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| `k8s02-workspace-<key>.<region>.prometheus.monitor.azure.com`             | CNAME | `k8s02-workspace-<key>.privatelink.<region>.prometheus.monitor.azure.com` |
| `k8s02-workspace-<key>.privatelink.<region>.prometheus.monitor.azure.com` | CNAME | \<AMW regional service public endpoint\>                   |
| <AMW regional service public endpoint\> | A | \<AMW regional service public IP address\>                   |

As previously mentioned, you can deny or control access for clients outside the VNet through the public endpoint using the '*Public Access*' tab on the Networking page of your workspace.

The DNS resource records for 'k8s02-workspace', when resolved by a client in the VNet hosting the private endpoint, are:

| Name  | Type | Value |
| :--- | :---: | :--- |
| `k8s02-workspace-<key>.<region>.prometheus.monitor.azure.com` | CNAME | `k8s02-workspace-<key>.privatelink.<region>.prometheus.monitor.azure.com` |
| `k8s02-workspace-<key>.privatelink.<region>.prometheus.monitor.azure.com` | A | \<Private endpoint IP address\> |

This approach enables access to the workspace **using the same query endpoint** for clients on the VNet hosting the private endpoints, as well as clients outside the VNet.

If you're using a custom DNS server on your network, clients must be able to resolve the FQDN for the workspace query endpoint to the private endpoint IP address. You should configure your DNS server to delegate your private link subdomain to the private DNS zone for the VNet, or configure the A records for `k8s02-workspace` with the private endpoint IP address.

> [!TIP]
> When using a custom or on-premises DNS server, you should configure your DNS server to resolve the workspace query endpoint name in the `privatelink` subdomain to the private endpoint IP address. You can do this by delegating the `privatelink` subdomain to the private DNS zone of the VNet or by configuring the DNS zone on your DNS server and adding the DNS A records.

The recommended DNS zone names for private endpoints for an Azure Monitor workspace are:

| Resource               | Target sub-resource | Zone name                                            |
| :--------------------- | :------------------ | :--------------------------------------------------- |
| Azure Monitor workspace| prometheusMetrics   | `privatelink.<region>.prometheus.monitor.azure.com`  |

For more information on configuring your own DNS server to support private endpoints, see the following articles:

- [Name resolution for resources in Azure virtual networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](../../private-link/private-endpoint-overview.md#dns-configuration)

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Known issues

Keep in mind the following known issues about private endpoints for Azure Monitor workspace.

### Workspace query access constraints for clients in VNets with private endpoints

Clients in VNets with existing private endpoints face constraints when accessing other Azure Monitor workspaces that have private endpoints. For example, suppose a VNet N1 has a private endpoint for a workspace A1. If workspace A2 has a private endpoint in a VNet N2, then clients in VNet N1 must also query workspace data in account A2 using a private endpoint. If workspace A2 does not have any private endpoints configured, then clients in VNet N1 can query data from that workspace without a private endpoint.

This constraint is a result of the DNS changes made when workspace A2 creates a private endpoint.

## Next steps

- [Managed Grafana network settings](https://aka.ms/ags/mpe)
- [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md)
