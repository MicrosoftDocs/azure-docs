---
title: 
description: 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 2/18/2022
ms.author: cshoe
---

# Networking architecture in Azure Container Apps

As you create an Azure Container Apps [environment](environment.md), a virtual network (VNET) is created for you, or you can provide your own. Network addresses are assigned from a subnet range you define as the environment is created.

- You control the subnet range used by the Container Apps environment.
- Once the environment is created, the subnet range is immutable.
- A single load balancer and single Kubernetes service are associated with each container apps environment.
- Each [revision](revisions.md) is assigned an IP address in the subnet.
- You can restrict inbound requests to the environment exclusively to the VNET by deploying the environment as [internal](vnet-custom-internal.md).

When you create an environment, a VNET is required. You have the option to provide your own VNET, or a VNET is generated for you in the background.

Automatically generated VNETs are inaccessible to you as they are registered to Microsoft's tenant, therefore provide your own if you want full control over your VNET.

If provide a custom VNET, the network needs a [control plane subnet and an app subnet](#subnet-types). The control plane subnet provides IP addresses from your internal network to the Azure Container Apps control plane infrastructure components as well as your application containers.

The following articles feature step-by-step instructions for creating Container Apps environments with different accessibility levels.

- [Deploy with an external environment](vnet-custom.md)
- [Deploy with an internal environment](vnet-custom-internal.md)

Refer to the virtual network support section in [Introduction to App Service Environment v2](/azure/app-service/environment/intro) for details on what's supported in a Container Apps VNET.

As you begin to design the network around your container app, refer to [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm) for important concerns surrounding running virtual networks on Azure.

<!--
https://docs.microsoft.com/en-us/azure/azure-functions/functions-networking-options

https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-container-apps-virtual-network-integration/ba-p/3096932
-->

## Use cases

What do you want to achieve?

ensure you have private connections to databases and all Azure resources

Lock down application

API management or App Gateway which talks to a BYO VNET configured as internal only

<!-- 👆🏼 tomer to provide samples  -->

## Access restrictions

if you want to lock down your environment to your vent and restrict outside access, then to byo vnet configured as internal only. Then its not reachable from the outside

<!-- Verify with Ahmed -->
### Envoy behavior

### ingress configuration

## Scenarios

different for internal vs external configuration

## Ports

The VNET associated with a Container Apps environment uses a single subnet with 255 addresses.

The following ports are exposed for inbound connections.

| Use | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |
| Log streaming | **TODO: @torosent** |

## Bring your own VNET

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Azure Container Apps environments use an existing VNET, or you can provide your own.":::

## Restrictions

Subnet address ranges can't overlap with the following reserved ranges:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

## Subnet types

As a Container Apps environment is created, you provide resource IDs for two different subnets. Both subnets must be defined in the same container apps.

- **App subnet**: Subnet for user app containers. Subnet that contains IP ranges mapped to applications deployed as containers.
- **Control plane subnet**: Subnet for [control plane infrastructure](../azure-resource-manager/management/control-plane-and-data-plane.md) components and user app containers.

If you are using the Azure CLI and the [platformReservedCidr](vnet-custom-internal.md#networking-parameters) range is defined, both subnets must not overlap with the IP range defined in `platformReservedCidr`.

## Accessibility levels

You can deploy your Container Apps environment with an internet-accessible endpoint or with an IP address in your VNET. The accessibility level determines the type of load balancer used with your Container Apps instance.

### External

Container Apps environments deployed as external resources are available for public requests. External environments are deployed with a virtual IP on an external, public facing IP address.

### Internal

When set to internal, the environment has no public endpoint. Internal environments are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the custom VNET's list of private IP addresses.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group prefixed with `MC_` is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform, and shouldn't be modified. The resource group contains Public IP addresses used specifically for outbound connectivity from your environment as well as a load balancer. As the load balancer is created in your subscription, there are additional costs associated with deploying the service to a custom virtual network.
