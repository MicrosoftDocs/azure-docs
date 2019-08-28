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
|[Inbound IP restrictions & private site access](#inbound-ip-restrictions)|✅Yes|✅Yes|✅Yes|✅Yes|
|[Virtual network integration](#virtual-network-integration)|❌No|✅Yes (Regional)|✅Yes (Regional and Gateway)|✅Yes|
|[Virtual network triggers (non-HTTP)](#virtual-network-triggers-non-http)|❌No| ❌No|✅Yes|✅Yes|
|[Hybrid Connections](#hybrid-connections)|❌No|❌No|✅Yes|✅Yes|
|[Outbound IP Restrictions](#outbound-ip-restrictions)|❌No| ❌No|❌No|✅Yes|


## Inbound IP restrictions

You can use IP restrictions to define a priority-ordered list of IP addresses that are allowed/denied access to your app. The list can include IPv4 and IPv6 addresses. When there's one or more entries, an implicit "deny all" exists at the end of the list. IP restrictions work with all function-hosting options.

> [!NOTE]
> With network restrictions in place, you can only use the portal editor from within your virtual network or when you have whitelisted the IP of the machine you are using to access the Azure portal. However, you can still access any features on the **Platform features** tab from any machine.

To learn more, see [Azure App Service static access restrictions](../app-service/app-service-ip-restrictions.md).

## Private site access

Private site access refers to making your app accessible only from a private network such as from within an Azure virtual network. 
* Private site access is available in the [Premium](./functions-premium-plan.md) and [App Service plan](functions-scale.md#app-service-plan) when **Service Endpoints** are configured. For more information, see [virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)
    * Keep in mind that with Service Endpoints, your function still has full outbound access to the internet, even with virtual network integration configured.
* Private site access is also available with an App Service Environment configured with an internal load balancer (ILB). For more information, see [Create and use an internal load balancer with an App Service Environment](../app-service/environment/create-ilb-ase.md).

## Virtual network integration

Virtual network integration allows your function app to access resources inside a virtual network. This feature is available in both the Premium plan and the App Service plan. If your app is in an App Service Environment, it's already in a virtual network and doesn't require the use of virtual network integration to reach resources in the same virtual network.

You can use virtual network integration to enable access from apps to databases and web services running in your virtual network. With virtual network integration, you don't need to expose a public endpoint for applications on your VM. You can use the private, non-internet routable addresses instead.

There are two forms to the virtual network Integration feature

1. Regional virtual network integration enables integration with virtual networks in the same region. This form of the feature requires a subnet in a virtual network in the same region. This feature is still in preview but is supported for Windows app production workloads with some caveats noted below.
2. Gateway required virtual network integration enables integration with virtual networks in remote regions, or with Classic virtual networks. This version of the feature requires deployment of a Virtual Network Gateway into your VNet. This is the point-to-site VPN-based feature and is only supported with Windows apps.

An app can only use one form of the VNet Integration feature at a time. The question then is which feature should you use. You can use either for many things. The clear differentiators though are:

| Problem  | Solution | 
|----------|----------|
| Want to reach an RFC 1918 address (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) in the same region | regional VNet Integration |
| Want to reach resources in a Classic VNet or a VNet in another region | gateway required VNet Integration |
| Want to reach RFC 1918 endpoints across ExpressRoute | regional VNet Integration |
| Want to reach resources across service endpoints | regional VNet Integration |

Neither feature will enable you to reach non-RFC 1918 addresses across ExpressRoute. To do that you need to use an ASE for now.

Using the regional VNet Integration does not connect your VNet to on-premises or configure service endpoints. That is separate networking configuration. The regional VNet Integration simply enables your app to make calls across those connection types.

Regardless of the version used, VNet Integration gives your function app access to resources in your virtual network but doesn't grant private site access to your function app from the virtual network. Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. VNet Integration is only for making outbound calls from your app into your VNet. 

The VNet Integration feature:

* Requires a Standard, Premium, or PremiumV2 App Service plan
* Supports TCP and UDP
* Works with App Service apps, and Function apps

There are some things that VNet Integration doesn't support including:

* Mounting a drive
* AD integration 
* NetBios

Virtual network integration in Functions uses shared infrastructure with App Service web apps. To read more about the two types of virtual network integration see:
* [Regional VNET Integration](../app-service/web-sites-integrate-with-vnet.md#regional-vnet-integration)
* [Gateway required VNet Integration](../app-service/web-sites-integrate-with-vnet.md#gateway-required-vnet-integration)

To learn more about using virtual network integration, see [Integrate a function app with an Azure virtual network](functions-create-vnet.md).

## Virtual network triggers (non-HTTP)

Currently, to be able to use Function triggers other than HTTP from within a virtual network, you must run your function app in an App Service plan or in an App Service Environment.

To give an example, if you were to configure Azure Cosmos DB to only accept traffic from a virtual network, you would need to deploy your function app in an app service plan with virtual network integration with that virtual network to configure Azure Cosmos DB triggers from that resource. While in preview, configuring VNET integration will not allow the Premium plan to trigger off of that Azure Cosmos DB resource.

Check [this list for all non-HTTP triggers](./functions-triggers-bindings.md#supported-bindings) to double check what is supported.

## Hybrid Connections

[Hybrid Connections](../service-bus-relay/relay-hybrid-connections-protocol.md) is a feature of Azure Relay that you can use to access application resources in other networks. It provides access from your app to an application endpoint. You can't use it to access your application. Hybrid Connections is available to functions running in an [App Service plan](functions-scale.md#app-service-plan) and an [App Service Environment](../app-service/environment/intro.md).

As used in Azure Functions, each hybrid connection correlates to a single TCP host and port combination. This means that the hybrid connection's endpoint can be on any operating system and any application, as long as you're accessing a TCP listening port. The Hybrid Connections feature does not know or care what the application protocol is, or what you're accessing. It simply provides network access.

To learn more, see the [App Service documentation for Hybrid Connections](../app-service/app-service-hybrid-connections.md), which supports Functions in an App Service plan.

## Outbound IP restrictions

Outbound IP restrictions are only available for functions deployed to an App Service Environment. You can configure outbound restrictions for the virtual network where your App Service Environment is deployed.

When integrating a Function app in a Premium plan or App Service plan with a virtual network, the app is still able to make outbound calls to the internet.

## Next steps
To learn more about networking and Azure Functions: 

* [Follow the tutorial about getting started with virtual network integration](./functions-create-vnet.md)
* [Read the Functions networking FAQ](./functions-networking-faq.md)
* [Learn more about virtual network integration with App Service/Functions](../app-service/web-sites-integrate-with-vnet.md)
* [Learn more about virtual networks in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
* [Connect to individual on-premises resources without firewall changes by using Hybrid Connections](../app-service/app-service-hybrid-connections.md)
