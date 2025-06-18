---
title: Azure API Management workspace gateways - virtual network integration - network resources
description: Learn about requirements for network resources when you integrate or inject your API Management workspace gateway in an Azure virtual network.
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 06/18/2025
ms.author: danlep
---

# Network resource requirements to integrate or inject a workspace gateway into a virtual network

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

Network isolation is an optional feature of an API Management [workspace gateway](workspaces-overview.md#workspace-gateway). This article provides network resource requirements when you integrate or inject your gateway in an Azure virtual network. Some requirements differ depending on the desired inbound and outbound access mode. The following modes are supported:

* **Virtual network integration**: public inbound access, private outbound access 
* **Virtual network injection**: private inbound access, private outbound access

For background about networking options in API Management, see [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md).

[!INCLUDE [api-management-virtual-network-workspaces-alert](../../includes/api-management-virtual-network-workspaces-alert.md)]

## Network location

The virtual network must be in the same region and Azure subscription as the API Management instance.

### Dedicated subnet

* The subnet used for virtual network integration or injection can only be used by a single workspace gateway. It can't be shared with another Azure resource.

## Subnet size 

* Minimum: /27 (32 addresses)
* Maximum: /24 (256 addresses) - recommended

## Subnet delegation

The subnet must be delegated as follows to enable the desired inbound and outbound access. 

For information about configuring subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

#### [Virtual network integration](#tab/external)


For virtual network integration, the subnet needs to be delegated to the **Microsoft.Web/serverFarms** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-external.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/serverFarms in the portal.":::

> [!NOTE]
> You might need to register the `Microsoft.Web/serverFarms` resource provider in the subscription so that you can delegate the subnet to the service.

#### [Virtual network injection](#tab/internal)

For virtual network injection, the subnet needs to be delegated to the **Microsoft.Web/hostingEnvironments** service.

:::image type="content" source="media/virtual-network-injection-workspaces-resources/delegate-internal.png" alt-text="Screenshot showing subnet delegation to Microsoft.Web/hostingEnvironments in the portal.":::


> [!NOTE]
> You might need to register the `Microsoft.Web/hostingEnvironments` resource provider in the subscription so that you can delegate the subnet to the service.

---


## Network security group (NSG) rules

A network security group (NSG) must be attached to the subnet to explicitly allow certain inbound or outbound connectivity. Configure the following rules in the NSG. Set the priority of these rules higher than that of the default rules.

Configure other NSG rules to meet your organization's network access requirements.

#### [Virtual network integration](#tab/external)

| Direction | Source  | Source port ranges | Destination | Destination port ranges | Protocol |  Action | Purpose | 
|-------|--------------|----------|---------|------------|-----------|-----|--------|
| Inbound | AzureLoadBalancer | * | Workspace gateway subnet range  | 80 | TCP | Allow | Allow internal health ping traffic |
| Inbound | Internet | * | Workspace gateway subnet range  | 80,443 | TCP | Allow | Allow inbound traffic |

#### [Virtual network injection](#tab/internal)

| Direction | Source  | Source port ranges | Destination | Destination port ranges | Protocol |  Action | Purpose | 
|-------|--------------|----------|---------|------------|-----------|-----|--------|
| Inbound | AzureLoadBalancer | * | Workspace gateway subnet range  | 80 | TCP | Allow | Allow internal health ping traffic |
| Inbound | VirtualNetwork | * | Workspace gateway subnet range  | 80,443 | TCP | Allow | Allow inbound traffic |
| Outbound | VirtualNetwork | * | Storage | 443 | TCP | Allow | Dependency on Azure Storage |

---

## DNS settings for virtual network injection

For virtual network injection, you have to manage your own DNS to enable inbound access to your workspace gateway. 

While you have the option to use your a private or custom DNS server, we recommend:

1. Configure an Azure [DNS private zone](../dns/private-dns-overview.md).
1. Link the Azure DNS private zone to the virtual network into which you've deployed your workspace gateway. 

Learn how to [set up a private zone in Azure DNS](../dns/private-dns-getstarted-portal.md).

> [!NOTE]
> When the workspace gateway is injected into a virtual network with a private or custom DNS resolver, you must ensure name resolution for Azure Key Vault endpoints (`*.vault.azure.net`). We recommend configuring an Azure private DNS zone, which doesn't require this additional configuration.

### Access on default hostname

When you create an API Management workspace, the workspace gateway is assigned a default hostname. The hostname is visible in the Azure portal on the workspace gateway's **Overview** page, along with its private virtual IP address. The default hostname is in the format `<gateway-name>-<random hash>.gateway.<region>-<number>.azure-api.net`. Example: `team-workspace-123456abcdef.gateway.uksouth-01.azure-api.net`.

> [!NOTE]
> The workspace gateway only responds to requests to the hostname configured on its endpoint, not its private VIP address. 

### Configure DNS record

Create an A record in your DNS server to access the workspace from within your virtual network. Map the endpoint record to the private VIP address of your workspace gateway.

For testing purposes, you might update the hosts file on a virtual machine in a subnet connected to the virtual network in which API Management is deployed. Assuming the private virtual IP address for your workspace gateway is 10.1.0.5, you can map the hosts file as shown in the following example. The hosts mapping file is at  `%SystemDrive%\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux, macOS). 

| Internal virtual IP address | Gateway hostname |
| ----- | ----- |
| 10.1.0.5 | `teamworkspace.gateway.westus.azure-api.net` |


## Related content

* [Use a virtual network to secure inbound or outbound traffic for Azure API Management](virtual-network-concepts.md)
* [Workspaces in Azure API Management](workspaces-overview.md)





