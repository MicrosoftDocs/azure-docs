---
title: Azure Functions networking options
description: An overview of all networking options available in Azure Functions
services: functions
author: alexkarcher-msft
manager: jeconnoc
ms.service: azure-functions
ms.topic: conceptual
ms.date: 4/11/2019
ms.author: alkarche

---
# Azure Functions networking options

This article describes the networking features available across the hosting options for Azure Functions. All of the following networking options provide some ability to access resources without using internet routable addresses, or restrict internet access to a function app. 

The hosting models have different levels of network isolation available. Choosing the correct one will help you meet your network isolation requirements.

You can host function apps in a couple of ways:

* There's a set of plan options that run on a multitenant infrastructure, with various levels of virtual network connectivity and scaling options:
    * The [Consumption plan](functions-scale.md#consumption-plan), which scales dynamically in response to load and offers minimal network isolation options.
    * The [Premium plan](functions-scale.md#premium-plan), which also scales dynamically, while offering more comprehensive network isolation.
    * The Azure [App Service plan](functions-scale.md#app-service-plan), which operates at a fixed scale and offers similar network isolation to the Premium plan.
* You can run functions in an [App Service Environment](../app-service/environment/intro.md). This method deploys your function into your virtual network and offers full network control and isolation.

## Matrix of networking features

|                |[Consumption plan](functions-scale.md#consumption-plan)|[Premium plan (preview)](functions-scale.md#premium-plan)|[App Service plan](functions-scale.md#app-service-plan)|[App Service Environment](../app-service/environment/intro.md)|
|----------------|-----------|----------------|---------|-----------------------|  
|[Inbound IP restrictions](#inbound-ip-restrictions)|✅Yes|✅Yes|✅Yes|✅Yes|
|[Outbound IP Restrictions](#private-site-access)|❌No| ❌No|❌No|✅Yes|
|[Virtual network integration](#virtual-network-integration)|❌No|❌No|✅Yes|✅Yes|
|[Preview virtual network integration (Azure ExpressRoute and service endpoints outbound)](#preview-version-of-virtual-network-integration)|❌No|✅Yes|✅Yes|✅Yes|
|[Hybrid Connections](#hybrid-connections)|❌No|❌No|✅Yes|✅Yes|
|[Private site access](#private-site-access)|❌No| ✅Yes|✅Yes|✅Yes|

## Inbound IP restrictions

You can use IP restrictions to define a priority-ordered list of IP addresses that are allowed/denied access to your app. The list can include IPv4 and IPv6 addresses. When there's one or more entries, an implicit "deny all" exists at the end of the list. IP restrictions work with all function-hosting options.

> [!NOTE]
> To use the Azure portal editor, the portal must be able to directly access your running function app. Also, the device that you're using to access the portal must have its IP whitelisted. With network restrictions in place, you can still access any features on the **Platform features** tab.

To learn more, see [Azure App Service static access restrictions](../app-service/app-service-ip-restrictions.md).

## Outbound IP restrictions

Outbound IP restrictions are only available for functions deployed to an App Service Environment. You can configure outbound restrictions for the virtual network where your App Service Environment is deployed.

## Virtual network integration

Virtual network integration allows your function app to access resources inside a virtual network. This feature is available in both the Premium plan and the App Service plan. If your app is in an App Service Environment, it's already in a virtual network and doesn't require the use of virtual network integration to reach resources in the same virtual network.

Virtual network integration gives your function app access to resources in your virtual network but doesn't grant [private site access](#private-site-access) to your function app from the virtual network.

You can use virtual network integration to enable access from apps to databases and web services running in your virtual network. With virtual network integration, you don't need to expose a public endpoint for applications on your VM. You can use the private, non-internet routable addresses instead.

The generally available version of virtual network integration relies on a VPN gateway to connect function apps to a virtual network. It's available in functions hosted in an App Service plan. To learn how to configure this feature, see [Integrate your app with an Azure virtual network](../app-service/web-sites-integrate-with-vnet.md).

### Preview version of virtual network integration

A new version of the virtual network integration feature is in preview. It doesn't depend on point-to-site VPN. It supports accessing resources across ExpressRoute or service endpoints. It's available in the Premium plan and in App Service plans scaled to PremiumV2.

Here are some characteristics of this version:

* You don't need a gateway to use it.
* You can access resources across ExpressRoute connections without any additional configuration beyond integrating with the ExpressRoute-connected virtual network.
* You can consume service-endpoint-secured resources from running functions. To do so, enable service endpoints on the subnet used for virtual network integration.
* You can't configure triggers to use service-endpoint-secured resources. 
* Both the function app and the virtual network must be in the same region.
* The new feature requires an unused subnet in the virtual network that you deployed through Azure Resource Manager.
* Production workloads are not supported while the feature is in preview.
* Route tables and global peering are not yet available with the feature.
* One address is used for each potential instance of a function app. Because you can't change subnet size after assignment, use a subnet that can easily support your maximum scale size. For example, to support a Premium plan that can be scaled to 80 instances, we recommend a `/25` subnet that provides 126 host addresses.

To learn more about using the preview version of virtual network integration, see [Integrate a function app with an Azure virtual network](functions-create-vnet.md).

## Hybrid Connections

[Hybrid Connections](../service-bus-relay/relay-hybrid-connections-protocol.md) is a feature of Azure Relay that you can use to access application resources in other networks. It provides access from your app to an application endpoint. You can't use it to access your application. Hybrid Connections is available to functions running in an [App Service plan](functions-scale.md#app-service-plan) and an [App Service Environment](../app-service/environment/intro.md).

As used in Azure Functions, each hybrid connection correlates to a single TCP host and port combination. This means that the hybrid connection's endpoint can be on any operating system and any application, as long as you're accessing a TCP listening port. The Hybrid Connections feature does not know or care what the application protocol is, or what you're accessing. It simply provides network access.

To learn more, see the [App Service documentation for Hybrid Connections](../app-service/app-service-hybrid-connections.md), which supports Functions in an App Service plan.

## Private site access

Private site access refers to making your app accessible only from a private network such as from within an Azure virtual network. 
* Private site access is available in the Premium and App Service plan when **Service Endpoints** are configured. For more information, see [virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)
    * Keep in mind that with Service Endpoints, your function still has full outbound access to the internet, even with VNET integration configured.
* Private site access is available only with an App Service Environment configured with an internal load balancer (ILB). For more information, see [Create and use an internal load balancer with an App Service Environment](../app-service/environment/create-ilb-ase.md).

There are many ways to access virtual network resources in other hosting options. But an App Service Environment is the only way to allow triggers for a function to occur over a virtual network.

## Next steps
To learn more about networking and Azure Functions: 

* [Follow the tutorial about getting started with virtual network integration](./functions-create-vnet.md)
* [Read the Functions networking FAQ](./functions-networking-faq.md)
* [Learn more about virtual network integration with App Service/Functions](../app-service/web-sites-integrate-with-vnet.md)
* [Learn more about virtual networks in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
* [Connect to individual on-premises resources without firewall changes by using Hybrid Connections](../app-service/app-service-hybrid-connections.md)
