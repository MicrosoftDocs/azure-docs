---
title: Networking architecture in Azure Container Apps
description: Learn how to configure virtual networks in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 4/07/2022
ms.author: cshoe
---

# Networking architecture in Azure Container Apps

Azure Container Apps run in the context of an [environment](environment.md), which is supported by a virtual network (VNET). When you create an environment, you have the option to provide a custom VNET, otherwise a VNET is automatically generated for you. Generated VNETs are inaccessible to you as they are created in Microsoft's tenent. To take full control over your VNET provide an existing VNET to Container Apps as you create your environment.

The following articles feature step-by-step instructions for creating Container Apps environments with different accessibility levels.

| Accessibility level | Description |
|--|--|
| [External](vnet-custom.md) | Container Apps environments deployed as external resources are available for public requests. External environments are deployed with a virtual IP on an external, public facing IP address. |
| [Internal](vnet-custom-internal.md) | When set to internal, the environment has no public endpoint. Internal environments are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the custom VNET's list of private IP addresses. |

## Custom VNET configuration

As you create a custom VNET keep in mind the following:

- If you want your container app to restrict all outside access, create an [internal Container Apps environment](vnet-custom-internal.md).

- When you provide your own VNET, the network needs a single subnet.

- Network addresses are assigned from a subnet range you define as the environment is created.

  - You can define the subnet range used by the Container Apps environment.
  - Once the environment is created, the subnet range is immutable.
  - A single load balancer and single Kubernetes service are associated with each container apps environment.
  - Each [revision](revisions.md) is assigned an IP address in the subnet.
  - You can restrict inbound requests to the environment exclusively to the VNET by deploying the environment as [internal](vnet-custom-internal.md).

As you begin to design the network around your container app, refer to [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm) for important concerns surrounding running virtual networks on Azure.

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Azure Container Apps environments use an existing VNET, or you can provide your own.":::

<!--
https://docs.microsoft.com/en-us/azure/azure-functions/functions-networking-options

https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-container-apps-virtual-network-integration/ba-p/3096932
-->

### Envoy behavior

TODO: Ahmed ElSayed to provide details

### Ingress configuration

## Scenarios

**TODO: PMs & Tomer to provide details**

## Portal dependencies

**TODO: Tomer to provide details**

For every app in Azure Container Apps, there are two URLs. The first URL is used to access your app. The second URL grants access to the log streaming service and the console.

allow list 

**TODO: Need input from Tomer**

## Ports and IP addresses

The VNET associated with a Container Apps environment uses a single subnet with 255 addresses.

The following ports are exposed for inbound connections.

| Use | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |
| Log streaming | TODO: Tomer to verify |

Container Apps reserves 60 IPs in your VNET, and the amount may grow as your container environment scales.

IP addresses are broken down into the following types:

| Type | Description |
|--|--|
| Public inbound IP address | Used for app traffic in an external deployment, and management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. |
| Internal load balancer IP address | This address only exists in an internal deployment. |
| App-assigned IP-based TLS/SSL addresses | These addresses are only possible with an external deployment, and when IP-based TLS/SSL binding is configured. |

## Restrictions

Subnet address ranges can't overlap with the following reserved ranges:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

## Subnet

As a Container Apps environment is created, you provide resource IDs for a single subnet.

When using the CLI, the parameter to define the subnet resource ID is `infrastructure-subnet-resource-id`. The subnet hosts infrastructure components and user app containers.

If you are using the Azure CLI and the [platformReservedCidr](vnet-custom-internal.md#networking-parameters) range is defined, both subnets must not overlap with the IP range defined in `platformReservedCidr`.

## Routes

There is no forced tunneling in Container Apps routes.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group prefixed with `MC_` is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform, and shouldn't be modified. The resource group contains Public IP addresses used specifically for outbound connectivity from your environment as well as a load balancer. As the load balancer is created in your subscription, there are additional costs associated with deploying the service to a custom virtual network.

## Next steps

- [Deploy with an external environment](vnet-custom.md)
- [Deploy with an internal environment](vnet-custom-internal.md)
