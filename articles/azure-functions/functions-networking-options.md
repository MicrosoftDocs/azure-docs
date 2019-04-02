---
title: Azure Functions Networking Options
description: An overview of all networking options available in Azure Functions
services: functions
author: alexkarcher-msft
manager: jehollan
ms.service: azure-functions
ms.topic: article
ms.date: 1/14/2019
ms.author: alkarche

---
# Azure Functions Networking Options

This document describes the suite of networking features available across the Azure Functions hosting options. All of the following networking options provide some ability to access resources without using internet routable addresses, or restrict internet access to a Function App. The hosting models all have different levels of network isolation available, and choosing the correct one will allow you to meet your network isolation requirements.

Function Apps can be hosted in several different ways.

1. There are a set of plan options that run on multi-tenant infrastructure, with various levels of VNET connectivity and scaling options.
    1. The Consumption plan, which scales dynamically in response to load and offers minimal network isolation options.
    1. The Premium Plan, which also scales dynamically, while offering more comprehensive network isolation.
    1. The App Service Plan, which operates at a fixed scale, and offers similar network isolation to the Premium plan.
1. Functions can also be run on an App Service Environment (ASE) which deploys your function into your VNet and offers full network control and isolation.

## Networking Feature Matrix

|                |Consumption Plan|⚠ Premium Plan|App Service Plan|App Service Environment|
|----------------|-----------|----------------|---------|-----------------------|  
|[**Inbound IP Restrictions**](#inbound-ip-restrictions)|✅Yes|✅Yes|✅Yes|✅Yes|
|[**VNET Integration**](#vnet-integration)|❌No|⚠ Yes|✅Yes|✅Yes|
|[**Preview VNET Integration (Express Route & Service Endpoints)**](#preview-vnet-integration)|❌No|⚠ Yes|⚠ Yes|✅Yes|
|[**Hybrid Connections**](#hybrid-connections)|❌No|❌No|✅Yes|✅Yes|
|[**Private Site Access**](#private-site-access)|❌No| ❌No|❌No|✅Yes|

⚠ Preview feature, not for production use

## Inbound IP Restrictions

IP Restrictions allow you to define a priority ordered allow/deny list of IP addresses that are allowed to access your app. The allow list can include IPv4 and IPv6 addresses. When there are one or more entries, there is then an implicit deny all that exists at the end of the list. The IP Restrictions capability works with all function hosting options.

Keep in mind that the Azure portal editor requires direct access to your running Function to use. Any code changes through the Azure portal will require the device you're using to browse the portal to have its IP whitelisted. You can still, however, use anything under the platform features tab with network restrictions in place.

[Learn more here](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)

## VNET Integration

VNET integration allows your function app to access resources inside a VNET. VNET integration is available in both the Premium plan and App Service plan. If your app is in an App Service Environment, then it's already in a VNet and doesn't require use of the VNet Integration feature to reach resources in the same VNet.

VNet Integration gives your function app access to resources in your virtual network but doesn't grant [private site access](#private-site-access) to your function app from the virtual network.

VNet Integration is often used to enable access from apps to a databases and web services running in your VNet. With VNet Integration, you don't need to expose a public endpoint for applications on your VM but can use the private non-internet routable addresses instead.

The generally available version of VNET integration relies on a VPN gateway to connect Function Apps to a virtual network. It is available in Functions hosted in an app service plan. To learn how to configure this feature, [see the App Service document for the same feature.](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet#enabling-vnet-integration)

### Preview VNET Integration

There is a new version of the VNet Integration feature that is in preview. It doesn't depend on point-to-site VPN and also supports accessing resources across ExpressRoute or Service Endpoints. This feature is available in the Premium plan, and in App Service plans scaled to PremiumV2.

The new version is in Preview and has the following characteristics.

* No gateway is required to use the new VNet Integration feature
* You can access resources across ExpressRoute connections without any additional configuration beyond integrating with the ExpressRoute connected VNet.
* You can consume Service Endpoint secured resources from running Functions. To do so, enable service endpoints on the subnet used for VNet Integration.
* You cannot configure triggers to use Service Endpoint secured resources using the new VNet Integration capability. 
* The app and the VNet must be in the same region
* The new feature requires an unused subnet in your Resource Manager VNet.
* Production workloads are not supported on the new feature while it is in Preview
* Route tables and global peering are not yet available with the new VNet Integration.
* One address is used for each potential function instance. Since subnet size cannot be changed after assignment, use a subnet that can more than cover your maximum scale size. A /25 with 126 addresses is the recommended size as that would accommodate a Premium plan that is scaled to 80 instances.

[Follow this tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-vnet#topology) to learn how to use the preview VNET integration.

## Hybrid Connections

Hybrid Connections is both [a service in Azure](https://docs.microsoft.com/azure/service-bus-relay/relay-hybrid-connections-protocol/) and a feature in Azure Functions. Within Functions, Hybrid Connections can be used to access application resources in other networks. It provides access from your app to an application endpoint. It does not enable the reverse capability, to access your application. Hybrid Connections are available to functions running in an App Service plan and App Service Environment.

As used in Functions, each Hybrid Connection correlates to a single TCP host and port combination. This means that the Hybrid Connection endpoint can be on any operating system and any application, provided you are accessing a TCP listening port. The Hybrid Connections feature does not know or care what the application protocol is, or what you are accessing. It is simply providing network access.

To learn more, [read the App Service documentation for Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections), which is shared between both services.

## Private Site Access

Private site access refers to making your app only accessible from a private network such as from within an Azure virtual network. Private site access is only available with an ASE configured with an Internal Load Balancer (ILB). For details on using an ILB ASE, start with the article here: [Creating and using an ILB ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase).

There are many ways to access VNET resources in other hosting options, but an ASE is the only way to allow triggers for a function to occur over a VNET.