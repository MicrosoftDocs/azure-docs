---
title: Management addresses
description: Find the management addresses used to control an App Service Environment. Configured them in a route table to avoid asymmetric routing problems.
author: madsd

ms.assetid: a7738a24-89ef-43d3-bff1-77f43d5a3952
ms.topic: article
ms.date: 10/24/2022
ms.author: madsd
ms.custom: seodec18, references_regions, devx-track-azurecli
---
# App Service Environment management addresses
> [!NOTE]
> This article is about the App Service Environment v2 which is used with Isolated App Service plans
> 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Summary

The App Service Environment (ASE) is a single tenant deployment of the Azure App Service that runs in your Azure Virtual Network. While the ASE does run in your virtual network, it must still be accessible from a number of dedicated IP addresses that are used by the Azure App Service to manage the service. In the case of an ASE, the management traffic traverses the user-controlled network. If this traffic is blocked or misrouted, the ASE will become suspended. For details on the ASE networking dependencies, read [Networking considerations and the App Service Environment][networking]. For general information on the ASE, you can start with [Introduction to the App Service Environment][intro].

All ASEs have a public VIP which management traffic comes into. The incoming management traffic from these addresses comes in from to ports 454 and 455 on the public VIP of your ASE. This document lists the App Service source addresses for management traffic to the ASE. These addresses are also in the IP Service Tag named AppServiceManagement.

The addresses noted below can be configured in a route table to avoid asymmetric routing problems with the management traffic. The address are also maintained in a service tag, that can be used as well. Routes act on traffic at the IP level and do not have an awareness of traffic direction or that the traffic is a part of a TCP reply message. If the reply address for a TCP request is different than the address it was sent to, you have an asymmetric routing problem. To avoid asymmetric routing problems with your ASE management traffic, you need to ensure that replies are sent back from the same address they were sent to. For details on how to configure your ASE to operate in an environment where outbound traffic is sent on premises, read [Configure your ASE with forced tunneling][forcedtunnel]

## List of management addresses ##

| Region | Addresses |
|--------|-----------|
| All public regions | 13.66.140.0, 13.67.8.128, 13.69.64.128, 13.69.227.128, 13.70.73.128, 13.71.170.64, 13.71.194.129, 13.75.34.192, 13.75.127.117, 13.77.50.128, 13.78.109.0, 13.89.171.0, 13.94.141.115, 13.94.143.126, 13.94.149.179, 20.36.106.128, 20.36.114.64, 20.37.74.128, 23.96.195.3, 23.102.188.65, 40.69.106.128, 40.70.146.128, 40.71.13.64, 40.74.100.64, 40.78.194.128, 40.79.130.64, 40.79.178.128, 40.83.120.64, 40.83.121.56, 40.83.125.161, 40.112.242.192, 51.107.58.192, 51.107.154.192, 51.116.58.192, 51.116.155.0, 51.120.99.0, 51.120.219.0, 51.140.146.64, 51.140.210.128, 52.151.25.45, 52.162.106.192, 52.165.152.214, 52.165.153.122, 52.165.154.193, 52.165.158.140, 52.174.22.21, 52.178.177.147, 52.178.184.149, 52.178.190.65, 52.178.195.197, 52.187.56.50, 52.187.59.251, 52.187.63.19, 52.187.63.37, 52.224.105.172, 52.225.177.153, 52.231.18.64, 52.231.146.128, 65.52.172.237, 65.52.250.128, 70.37.57.58, 104.44.129.141, 104.44.129.243, 104.44.129.255, 104.44.134.255, 104.208.54.11, 104.211.81.64, 104.211.146.128, 157.55.208.185, 191.233.50.128, 191.233.203.64, 191.236.154.88 |
| Microsoft Azure Government | 13.72.53.37, 13.72.180.105, 23.97.29.209, 52.181.183.11, 52.182.93.40, 52.227.64.26, 52.227.80.100, 52.227.182.254, 52.238.74.16, 52.244.79.34 |
| Microsoft Azure operated by 21Vianet | 42.159.4.236, 42.159.80.125 |

## Configuring a Network Security Group

With Network Security Groups, you do not need to worry about the individual addresses or maintaining your own configuration. There is an IP service tag named AppServiceManagement that is kept up-to-date with all of the addresses. To use this IP service tag in your NSG, go to the portal, open your Network Security Groups UI, and select Inbound security rules. If you have a pre-existing rule for the inbound management traffic, edit it. If this NSG was not created with your ASE, or if it is all new, then select **Add**. Under the Source drop down, select **Service Tag**.  Under the Source service tag, select **AppServiceManagement**. Set the source port ranges to \*, Destination to **Any**, Destination port ranges to **454-455**, Protocol to **TCP**, and Action to **Allow**. If you are making the rule, then you need to set the Priority. 

![creating an NSG with the service tag][1]

## Configuring a route table

The management addresses can be placed in a route table with a next hop of internet to ensure that all inbound management traffic is able to go back through the same path. These routes are needed when configuring forced tunneling. To create the route table, you can use the portal, PowerShell or Azure CLI.  The commands to create a route table using Azure CLI from a PowerShell prompt are below. 

```azurecli
$rg = "resource group name"
$rt = "route table name"
$location = "azure location"
$managementAddresses = "13.66.140.0", "13.67.8.128", "13.69.64.128", "13.69.227.128", "13.70.73.128", "13.71.170.64", "13.71.194.129", "13.75.34.192", "13.75.127.117", "13.77.50.128", "13.78.109.0", "13.89.171.0", "13.94.141.115", "13.94.143.126", "13.94.149.179", "20.36.106.128", "20.36.114.64", "20.37.74.128", "23.96.195.3", "23.102.188.65", "40.69.106.128", "40.70.146.128", "40.71.13.64", "40.74.100.64", "40.78.194.128", "40.79.130.64", "40.79.178.128", "40.83.120.64", "40.83.121.56", "40.83.125.161", "40.112.242.192", "51.107.58.192", "51.107.154.192", "51.116.58.192", "51.116.155.0", "51.120.99.0", "51.120.219.0", "51.140.146.64", "51.140.210.128", "52.151.25.45", "52.162.106.192", "52.165.152.214", "52.165.153.122", "52.165.154.193", "52.165.158.140", "52.174.22.21", "52.178.177.147", "52.178.184.149", "52.178.190.65", "52.178.195.197", "52.187.56.50", "52.187.59.251", "52.187.63.19", "52.187.63.37", "52.224.105.172", "52.225.177.153", "52.231.18.64", "52.231.146.128", "65.52.172.237", "65.52.250.128", "70.37.57.58", "104.44.129.141", "104.44.129.243", "104.44.129.255", "104.44.134.255", "104.208.54.11", "104.211.81.64", "104.211.146.128", "157.55.208.185", "191.233.50.128", "191.233.203.64", "191.236.154.88"

az network route-table create --name $rt --resource-group $rg --location $location
foreach ($ip in $managementAddresses) {
    az network route-table route create -g $rg --route-table-name $rt -n $ip --next-hop-type Internet --address-prefix ($ip + "/32")
}
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
