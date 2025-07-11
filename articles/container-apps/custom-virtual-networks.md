---
title: Configuring virtual networks Azure Container Apps environments
description: Learn how to configure virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  conceptual
ms.date: 05/01/2025
ms.author: cshoe
---

# Virtual network configuration

A virtual network creates a secure boundary around your Azure Container Apps [environment](environment.md). By default, environments are created with a VNet that is automatically generated. However, using an existing VNet provides more Azure networking features such as integration with Application Gateway, Network Security Groups, and communication with resources behind private endpoints. This configuration is important for enterprise customers who need to isolate internal, mission-critical applications from the public internet.

As you create a virtual network, keep in mind the following situations:

- If you want your container app to restrict all outside access, create an [internal Container Apps environment](networking.md#accessibility-level).

- If you use your own VNet, you need to provide a subnet dedicated exclusively to your container app. This subnet isn't available to other services.

- Network addresses are assigned from a subnet range you define as the environment is created.

  - You can define the subnet range used by the Container Apps environment.

  - You can restrict inbound requests to the environment exclusively to the VNet by deploying the environment as [internal](vnet-custom.md).

> [!NOTE]
> When you provide your own virtual network, additional [managed resources](custom-virtual-networks.md#managed-resources) are created. These resources incur costs at their associated rates.

As you begin to design the network around your container app, refer to [Plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md).

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Diagram of how Azure Container Apps environments use an existing V NET, or you can provide your own.":::

> [!NOTE]
> Moving VNets among different resource groups or subscriptions isn't allowed if the VNet is in use by a Container Apps environment.

## Subnet

Virtual network integration depends on a dedicated subnet. The allocation of IP addresses in a subnet and the supported subnet sizes depend on the [plan](plans.md) you're using in Azure Container Apps.

Select your subnet size carefully. Subnet sizes can't be modified after you create a Container Apps environment.

Different environment types have different subnet requirements:

# [Workload profiles environment](#tab/workload-profiles-env)

- `/27` is the minimum subnet size required for virtual network integration.

- You must delegate your subnet to `Microsoft.App/environments`.

- When using an external environment with external ingress, inbound traffic routes through the infrastructure’s public IP rather than through your subnet.

- Container Apps automatically reserves 12 IP addresses for integration with the subnet. The number of IP addresses required for infrastructure integration doesn't vary based on the scale demands of the environment. Additional IP addresses are allocated according to the following rules depending on the type of workload profile you're using more IP addresses are allocated depending on your environment's workload profile:

  - [Dedicated workload profile](workload-profiles-overview.md#profile-types): As your container app scales out, each node has one IP address assigned.

  - [Consumption workload profile](workload-profiles-overview.md#profile-types): Each IP address may be shared among multiple replicas. When planning for how many IP addresses are required for your app, plan for 1 IP address per 10 replicas. 

- When you make a [change to a revision](revisions.md#revision-scope-changes) in single revision mode, the required address space is doubled for a short period of time in order to support zero downtime deployments. This affects the real, available supported replicas or nodes for a given subnet size. The following table shows both the maximum available addresses per CIDR block and the effect on horizontal scale.

    | Subnet Size | Available IP Addresses<sup>1</sup> | Max nodes (Dedicated workload profile)<sup>2</sup>| Max replicas (Consumption workload profile)<sup>2</sup> |
    |--|--|--|--|
    | /23 | 498 | 249 | 2,490 |
    | /24 | 242 | 121 | 1,210 |
    | /25 | 114 | 57 | 570 |
    | /26 | 50 | 25 | 250 |
    | /27 | 18 | 9 | 90 |

    <sup>1</sup> The available IP addresses is the size of the subnet minus the 14 IP addresses required for Azure Container Apps infrastructure which includes 5 IP addresses reserved by the subnet.
    <sup>2</sup> This is accounting for apps in single revision mode.  

# [Consumption-only environment](#tab/consumption-only-env)

- `/23` is the minimum subnet size required for virtual network integration.

- Your subnet must not be delegated to any services.

- The Container Apps runtime reserves a minimum of 60 IPs for infrastructure in your VNet. The reserved amount may increase up to 256 addresses as apps in your environment scale.

- As your apps scale, a new IP address is allocated for each new replica.

- When you make a [change to a revision](revisions.md#revision-scope-changes) in single revision mode, the required address space is doubled for a short period of time in order to support zero downtime deployments. This affects the real, available supported replicas for a given subnet size.

---

### Subnet address range restrictions

# [Workload profiles environment](#tab/workload-profiles-env)

Subnet address ranges can't overlap with the following ranges reserved by Azure Kubernetes Services:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

In addition, a workload profiles environment reserves the following addresses:

- 100.100.0.0/17
- 100.100.128.0/19
- 100.100.160.0/19
- 100.100.192.0/19

# [Consumption-only environment](#tab/consumption-only-env)

Subnet address ranges can't overlap with the following ranges reserved by Azure Kubernetes Services:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

If you created your container apps environment with a custom service CIDR, make sure your container app's subnet (or any peered subnet) doesn't conflict with your custom service CIDR range.

---

### Subnet configuration with CLI

As a Container Apps environment is created, you provide resource IDs for a single subnet.

If you're using the CLI, the parameter to define the subnet resource ID is `infrastructure-subnet-resource-id`. The subnet hosts infrastructure components and user app containers.

If you're using the Azure CLI with a Consumption only environment and the [platformReservedCidr](vnet-custom-internal.md#networking-parameters) range is defined, both subnets must not overlap with the IP range defined in `platformReservedCidr`.

## NAT gateway integration

You can use NAT Gateway to simplify outbound connectivity for your outbound internet traffic in your virtual network in a workload profiles environment.

When you configure a NAT Gateway on your subnet, the NAT Gateway provides a static public IP address for your environment. All outbound traffic from your container app is routed through the NAT Gateway's static public IP address.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform. Don't modify the services in this group or the resource group itself.

> [!NOTE]
> User-defined tags assigned to your Container Apps environment are replicated to all resources within the resource group, including the resource group itself.

# [Workload profiles environment](#tab/workload-profiles-env)

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `ME_` by default, and the resource group name *can* be customized as you create your container app environment.

For external environments, the resource group contains a public IP address used specifically for inbound connectivity to your external environment and a load balancer. For internal environments, the resource group only contains a [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress if using an internal or external environment, plus one standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for ingress if using an external environment. If you need more public IPs for egress due to SNAT issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- One standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

- The cost of data processed (in GBs) includes both ingress and egress for management operations.

# [Consumption only environment](#tab/consumption-only-env)

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `MC_` by default, and the resource group name *can't* be customized when you create a container app. The resource group contains public IP addresses used specifically for outbound connectivity from your environment and a load balancer.

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress. If you need more IPs for egress due to Source Network Address Translation (SNAT) issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- Two standard [load balancers](https://azure.microsoft.com/pricing/details/load-balancer/) if using an internal environment, or one standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/) if using an external environment. Each load balancer has fewer than six rules. The cost of data processed (in GBs) includes both ingress and egress for management operations.

---

## Next steps

> [!div class="nextstepaction"]
> [Managing outbound connections with Azure Firewall](use-azure-firewall.md)
