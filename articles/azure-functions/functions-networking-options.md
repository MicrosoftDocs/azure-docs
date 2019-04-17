---
title: Azure Functions Networking Options
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

This document describes the suite of networking features available across the Azure Functions hosting options. All of the following networking options provide some ability to access resources without using internet routable addresses, or restrict internet access to a Function App. The hosting models all have different levels of network isolation available, and choosing the correct one will allow you to meet your network isolation requirements.

Function Apps can be hosted in several different ways.

* There are a set of plan options that run on multi-tenant infrastructure, with various levels of VNET connectivity and scaling options.
    1. The Consumption plan, which scales dynamically in response to load and offers minimal network isolation options.
    1. The Premium Plan, which also scales dynamically, while offering more comprehensive network isolation.
    1. The App Service Plan, which operates at a fixed scale, and offers similar network isolation to the Premium plan.
* Functions can also be run on an App Service Environment (ASE) which deploys your function into your VNet and offers full network control and isolation.

## Networking feature matrix

|                |[Consumption Plan](functions-scale.md#consumption-plan)|⚠ [Premium Plan](functions-scale.md##premium-plan-public-preview)|[App Service Plan](functions-scale.md#app-service-plan)|[App Service Environment](../app-service/environment/intro.md)|
|----------------|-----------|----------------|---------|-----------------------|  
|[**Inbound IP Restrictions**](#inbound-ip-restrictions)|✅Yes|✅Yes|✅Yes|✅Yes|
|[**VNET Integration**](#virtual-network-integration)|❌No|❌No|✅Yes|✅Yes|
|[**Preview VNET Integration (Express Route & Service Endpoints)**](#preview-version-of-virtual-network-integration)|❌No|⚠Yes|⚠Yes|✅Yes|
|[**Hybrid Connections**](#hybrid-connections)|❌No|❌No|✅Yes|✅Yes|
|[**Private Site Access**](#private-site-access)|❌No| ❌No|❌No|✅Yes|

⚠ Preview feature, not for production use

## Inbound IP restrictions

IP Restrictions allow you to define a priority ordered allow/deny list of IP addresses that are allowed to access your app. The allow list can include IPv4 and IPv6 addresses. When there are one or more entries, there is then an implicit deny all that exists at the end of the list. The IP Restrictions capability works with all function hosting options.

> [!NOTE]
> To be able to use the Azure portal editor, the portal must be able to directly access your running function app, and the device you're using to access the portal must have its IP whitelisted. With network restrictions in place, you can still access any features in the **Platform features** tab.

[Learn more here](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

## Virtual network integration

VNET integration allows your function app to access resources inside a VNET. VNET integration is available in both the Premium plan and App Service plan. If your app is in an App Service Environment, then it's already in a VNet and doesn't require use of the VNet Integration feature to reach resources in the same VNet.

VNet Integration gives your function app access to resources in your virtual network but doesn't grant [private site access](#private-site-access) to your function app from the virtual network.

VNet Integration is often used to enable access from apps to a databases and web services running in your VNet. With VNet Integration, you don't need to expose a public endpoint for applications on your VM but can use the private non-internet routable addresses instead.

The generally available version of VNET integration relies on a VPN gateway to connect Function Apps to a virtual network. It is available in Functions hosted in an app service plan. To learn how to configure this feature, see the [App Service document for the same feature](../app-service/web-sites-integrate-with-vnet.md#enabling-vnet-integration).

### Preview version of virtual network integration

There is a new version of the VNet Integration feature that is in preview. It doesn't depend on point-to-site VPN and also supports accessing resources across ExpressRoute or Service Endpoints. This feature is available in the Premium plan, and in App Service plans scaled to PremiumV2.

The new version of VNet Integration, which is currently in preview, provides the following benefits:

* No gateway is required to use the new VNet Integration feature
* You can access resources across ExpressRoute connections without any additional configuration beyond integrating with the ExpressRoute connected VNet.
* You can consume Service Endpoint secured resources from running Functions. To do so, enable service endpoints on the subnet used for VNet Integration.
* You cannot configure triggers to use Service Endpoint secured resources using the new VNet Integration capability. 
* Both the function app and the VNet must be in the same region.
* The new feature requires an unused subnet in your Resource Manager VNet.
* Production workloads are not supported on the new version of VNet Integration while it is in preview.
* Route tables and global peering are not yet available with the new VNet Integration.
* One address is used for each potential function app instance. Because subnet size cannot be changed after assignment, use a subnet that can easily support your maximum scale size. For example, to support a Premium plan that can be scaled to 80 instances, we recommend a `/25` subnet that provides 126 host addresses.

To learn more about using preview VNET integration, see [Integrate a function app with an Azure Virtual Network](functions-create-vnet.md).

## Hybrid connections

[Hybrid Connections](../service-bus-relay/relay-hybrid-connections-protocol.md) is a feature of Azure Relay that can be used to access application resources in other networks. It provides access from your app to an application endpoint. It cannot be used to access your application. Hybrid Connections is available to functions running in an [App Service plan](functions-scale.md#app-service-plan) and an [App Service Environment](../app-service/environment/intro.md).

As used in Functions, each Hybrid Connection correlates to a single TCP host and port combination. This means that the Hybrid Connection endpoint can be on any operating system and any application, provided you are accessing a TCP listening port. The Hybrid Connections feature does not know or care what the application protocol is, or what you are accessing. It is simply providing network access.

To learn more, see the [App Service documentation for Hybrid Connections](../app-service/app-service-hybrid-connections.md), which supports both Functions and Web Apps.

## Private site access

Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. Private site access is only available with an ASE configured with an Internal Load Balancer (ILB). For details on using an ILB ASE, see [Creating and using an ILB ASE](../app-service/environment/create-ilb-ase.md).

There are many ways to access VNET resources in other hosting options, but an ASE is the only way to allow triggers for a function to occur over a VNET.

## Next steps
To learn more about networking and Functions: 

* [Follow our getting started VNET integration tutorial](./functions-create-vnet.md)
* [Read the Functions networking FAQ here](./functions-networking-faq.md)
* [Learn more about VNET integration with App Service / Functions here](../app-service/web-sites-integrate-with-vnet.md)
* [Learn more about VNETs in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
* [Connect to individual on-premises resources without firewall changes using Hybrid Connections](../app-service/app-service-hybrid-connections.md)
