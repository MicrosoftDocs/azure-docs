---
title: Azure App Service Environment management addresses
description: Lists the management addresses used to command an App Service Environment 
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: a7738a24-89ef-43d3-bff1-77f43d5a3952
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/29/2018
ms.author: ccompy
---
# App Service Environment management addresses

The App Service Environment (ASE) is a deployment of the Azure App Service into a subnet in your Azure Virtual Network (VNet).  The ASE must be accessible from the management plane used by the Azure App Service.  This ASE management traffic traverses the user-controlled network. If this traffic is blocked or misrouted, the ASE will become suspended. For details on the ASE networking dependencies, read [Networking considerations and the App Service Environment][networking]. For general information on the ASE, you can start with [Introduction to the App Service Environment][intro].

This document lists the App Service source addresses for management traffic to the ASE and serves two important purposes.  

1. You can use these addresses to create Network Security Groups to lock down incoming traffic.  
2. You can create routes with these addresses to support forced tunnel deployments. For details on how to configure your ASE to operate in an environment where outbound traffic is sent on premises, read [Configure your ASE with forced tunneling][forcedtunnel]

All ASEs have a public VIP which management traffic comes into. The incoming management traffic from these addresses comes in from to ports 454 and 455 on the public VIP of your ASE.  

## List of management addresses ##

| Region | Addresses |
|--------|-----------|
| All public regions | 70.37.57.58, 157.55.208.185, 52.174.22.21, 13.94.149.179, 13.94.143.126, 13.94.141.115, 52.178.195.197, 52.178.190.65, 52.178.184.149, 52.178.177.147, 13.75.127.117, 40.83.125.161, 40.83.121.56, 40.83.120.64, 52.187.56.50, 52.187.63.37, 52.187.59.251, 52.187.63.19, 52.165.158.140, 52.165.152.214, 52.165.154.193, 52.165.153.122, 104.44.129.255, 104.44.134.255, 104.44.129.243, 104.44.129.141, 23.102.188.65, 191.236.154.88, 13.64.115.203, 65.52.193.203, 70.37.89.222, 52.224.105.172, 23.102.135.246 |
| Microsoft Azure Government (Fairfax or MAG) | 23.97.29.209, 13.72.53.37, 13.72.180.105, 23.97.0.17, 23.97.16.184 |

## Get your management addresses from API ##

You can list the management addresses that match to your ASE with the following API call.

    get /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Web/hostingEnvironments/<ASE Name>/inboundnetworkdependenciesendpoints?api-version=2016-09-01

The API returns a JSON document that includes all of the inbound addresses for your ASE. The list of addresses includes the management addresses, the VIP used by your ASE and the ASE subnet address range itself.  

To call the API with the [armclient](http://github.com/projectkudu/ARMClient) use the following commands but substitute in your subscription ID, resource group and ASE name.  

    armclient login
    armclient get /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Web/hostingEnvironments/<ASE Name>/inboundnetworkdependenciesendpoints?api-version=2016-09-01


<!-- LINKS -->
[networking]: ./network-info.md
[intro]: ./intro.md
[forcedtunnel]: ./forced-tunnel-support.md
