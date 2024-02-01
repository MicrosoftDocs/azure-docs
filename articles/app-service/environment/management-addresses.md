---
title: Management addresses
description: Find the management addresses used to control an App Service Environment. Configured them in a route table to avoid asymmetric routing problems.
author: madsd

ms.assetid: a7738a24-89ef-43d3-bff1-77f43d5a3952
ms.topic: article
ms.date: 11/20/2023
ms.author: madsd
ms.custom: seodec18, references_regions, devx-track-azurecli
---
# App Service Environment management addresses

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024-2/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](upgrade-to-asev3.md) to migrate to the new version.

As of 15 January 2024, you can no longer create new App Service Environment v2 resources using any of the available methods including ARM/Bicep templates, Azure Portal, Azure CLI, or REST API. You must [migrate to App Service Environment v3](upgrade-to-asev3.md) before 31 August 2024 to prevent resource deletion and data loss.
>

[!INCLUDE [azure-CLI-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Summary

The App Service Environment (ASE) is a single tenant deployment of the Azure App Service that runs in your Azure Virtual Network. While the ASE does run in your virtual network, it must still be accessible from a number of dedicated IP addresses that are used by the Azure App Service to manage the service. In the case of an ASE, the management traffic traverses the user-controlled network. If this traffic is blocked or misrouted, the ASE will become suspended. For details on the ASE networking dependencies, read [Networking considerations and the App Service Environment][networking]. For general information on the ASE, you can start with [Introduction to the App Service Environment][intro].

All ASEs have a public VIP which management traffic comes into. The incoming management traffic from these addresses comes in from to ports 454 and 455 on the public VIP of your ASE. This document lists the App Service source addresses for management traffic to the ASE. These addresses are also in the IP Service Tag named AppServiceManagement.

The addresses in the AppServiceManagement service tag can be configured in a route table to avoid asymmetric routing problems with the management traffic. Where possible, you should use the service tag instead of the individual addresses. Routes act on traffic at the IP level and don't have an awareness of traffic direction or that the traffic is a part of a TCP reply message. If the reply address for a TCP request is different than the address it was sent to, you have an asymmetric routing problem. To avoid asymmetric routing problems with your ASE management traffic, you need to ensure that replies are sent back from the same address they were sent to. For details on how to configure your ASE to operate in an environment where outbound traffic is sent on premises, read [Configure your ASE with forced tunneling][forcedtunnel].

## List of management addresses ##

If you need to see the IPs for the management addresses, download the service tag reference for your region to get the most up-to-date list of addresses. The App Service Environment management addresses are listed in the AppServiceManagement service tag.

| Region | Service tag reference |
|--------|-----------|
| All public regions | [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) |
| Microsoft Azure Government | [Azure IP Ranges and Service Tags – US Government Cloud](https://www.microsoft.com/download/details.aspx?id=57063) |
| Microsoft Azure operated by 21Vianet | [Azure IP Ranges and Service Tags – China Cloud](https://www.microsoft.com/download/details.aspx?id=57062) |

## Configuring a Network Security Group

With Network Security Groups, you do not need to worry about the individual addresses or maintaining your own configuration. There is an IP service tag named AppServiceManagement that is kept up-to-date with all of the addresses. To use this IP service tag in your NSG, go to the portal, open your Network Security Groups UI, and select Inbound security rules. If you have a pre-existing rule for the inbound management traffic, edit it. If this NSG was not created with your ASE, or if it is all new, then select **Add**. Under the Source drop down, select **Service Tag**.  Under the Source service tag, select **AppServiceManagement**. Set the source port ranges to \*, Destination to **Any**, Destination port ranges to **454-455**, Protocol to **TCP**, and Action to **Allow**. If you are making the rule, then you need to set the Priority. 

![creating an NSG with the service tag][1]

## Configuring a route table

The management addresses can be placed in a route table with a next hop of internet to ensure that all inbound management traffic is able to go back through the same path. These routes are needed when configuring forced tunneling. When possible, use the AppServiceManagement service tag instead of the individual addresses. To create the route table, you can use the portal, PowerShell or Azure CLI.  The commands to create a route table using Azure CLI from a PowerShell prompt are below. 

```azurecli
$sub = "subscription ID"
$rg = "resource group name"
$rt = "route table name"
$location = "azure location"

az network route-table route create --subscription $sub -g $rg --route-table-name $rt  -n 'AppServiceManagement' --address-prefix 'AppServiceManagement' --next-hop-type 'Internet'
```

After your route table is created, you need to set it on your ASE subnet.  

## Get your management addresses from API ##

You can list the management addresses that match to your ASE with the following API call.

```http
get /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Web/hostingEnvironments/<ASE Name>/inboundnetworkdependenciesendpoints?api-version=2016-09-01
```

The API returns a JSON document that includes all of the inbound addresses for your ASE. The list of addresses includes the management addresses, the VIP used by your ASE and the ASE subnet address range itself.  

To call the API with the [armclient](https://github.com/projectkudu/ARMClient) use the following commands but substitute in your subscription ID, resource group and ASE name.  

```azurepowershell-interactive
armclient login
armclient get /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Web/hostingEnvironments/<ASE Name>/inboundnetworkdependenciesendpoints?api-version=2016-09-01
```

<!--IMAGES-->
[1]: ./media/management-addresses/managementaddr-nsg.png

<!-- LINKS -->
[networking]: ./network-info.md
[intro]: ./intro.md
[forcedtunnel]: ./forced-tunnel-support.md
