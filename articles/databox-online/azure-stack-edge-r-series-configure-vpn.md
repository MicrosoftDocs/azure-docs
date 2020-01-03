---
title: Configure VPN on your Azure Stack Edge device
description: Describes how to configure VPN on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 01/03/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to configure VPN on my Azure Stack Edge device so that I can have a second layer of encryption for my data-in-flight.
---

# Configure VPN on your Azure Stack Edge device

The VPN option provides a second layer of encryption for the data-in-motion over https from your Azure Stack Edge device to Azure. 

This article describes the steps required to configure VPN on your Azure Stack Edge device including the configuration in the cloud and the configuration on the device.

## About VPN setup

The VPN setup requires you to:

- Set up necessary resources on Azure.
    - Create a virtual network in Azure.
    - Create a virtual network gateway.
    - Create a local network gateway per node of your Azure Stack Edge device.
    - Create a VPN connection object.
    - Create firewall.
    - Create a routing table and add routes.
- Set up VPN in the local web UI of the device.


## VPN configuration in the cloud  

The configuration in Azure requires the following steps:
    - Create a virtual network in Azure.
    - Create a virtual network gateway.
    - Create a local network gateway per node of your Azure Stack Edge device.
    - Create a VPN connection object.
    - Create firewall.

Each of these steps is described in the following sections.

## Create virtual network

First, you'll create a virtual network resource under your resource group.

1. Create a virtual network resource. Select **+ Create a resource**, search for virtual network and then select **Create**.

2. In the **Basics** tab, provide the subscription, create new or choose from an existing resource group, enter a name for the virtual network, and select the same region as that associated with your Azure Stack Edge device (when creating the resource).

3. In the **IP addresses** tab, assign a valid address space. Accept the default settings for tabs for **Security** and **Tags**. Finally in **Review + Create** tab, review the settings for your virtual network and select **Create**. 


The virtual network is created immediately.

After the virtual network is created, create a subnet.

In the virtual network, go to **Settings > Subnets**. Select **+ Subnet** to create a subnet. Provide the address range and accept the default settings for other parameters.

For more information, go to [](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).

## Create virtual network gateway

Create a new virtual network gateway resource and select the virtual network created previously. Once the  VPN gateway is created, you need to configure a site-to-site connection in it. 

For more information, go to [](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#VNetGateway).

## Create local network gateway

For more information, go to [](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).

## Create a VPN connection object

For more information, go to [](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).

## Create firewall

Add Firewall and select the Virtual Network from drop down list. 

For more information, go to [](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal#CreatVNet).

Download the service tags from the azure: 
https://www.microsoft.com/en-us/download/details.aspx?id=56519 
 
Network rules: 
Execute the following script to add network rule collection. 
 
Install-Module -Name Az -AllowClobber -Scope CurrentUser 
Import-Module Az.Accounts 
Connect-AzAccount 
Set-AzContext -Subscription "DataBox_Edge_Test" 
Script can be located at \\hcsfs\scratch\kanagara\tzl\vpnConfigFile\Add-AzFirewallRoutes.ps1 
.\Add-AzFirewallRoutes.ps1 -ServiceTagAndRegionList AzureCloud.eastus -AzureIPRangesFilePath .\ServiceTags_Public_20191209.json -ResourceGroupName vpndemo1RG -FirewallName vpndemo2firewall -NetworkRuleCollectionName MyNetworkRuleCollection1 -Priority 100 
Note: Make sure only one region is selected 
  
Application rules   
Following application rules to be added for Https and Http: 
Protocol should be: http:80, https:443 

## Create a routing table and add routes

Create route table. 
Associate the subnet with the route table (default and GatewaySubnet) 
 
Create a route table on Azure portal first and then invoke the script to add all our required routes : 
 
Scripts can be located at \\hcsfs\scratch\kanagara\tzl\vpnConfigFile\Add-AseAzRoutes.ps1 
Install-Module -Name Az -AllowClobber -Scope CurrentUser 
Import-Module Az.Accounts 
Connect-AzAccount 
Set-AzContext -Subscription "DataBox_Edge_Test" 
    To add routes in Azure Route table: 
.\ Add-AseAzRoutes.ps1 -ServiceTagAndRegionList azurecloud.centraluseuap,AzureActiveDirectory,AzureActiveDirectoryDomainServices,Dynamics365ForMarketingEmail.WestUS2 -IntendedAction ApplyAzureRoutes -AzureIPRangesFilePath .\ServiceTags_Public_20191209.json -ResourceGroupName vivvpnrg2 -RouteTableName vivvpnroutetable2 -FirewallIPv4 172.26.2.4 -RouteNamePrefix "DemoRoutes_" 
 
 
Add the following routes manually in the route table 



## VPN configuration on the device

Along with the below configuration values, upload the vpn route configuration file. 
 
Client specific routes can be added here. You can specify the values as comma separated strings arrays. 

Note: For public azure, make sure the following values are set during vpn confiugration. 
PFS group: None 
DH group: Group2 
IPsec integrity method: SHA256 
IPsec cipher transform constants: GCMAES256 
IPsec authentication transform constants: GCMAES256 
IKE encryption method: AES256 
 



## Next steps

[Deploy your Azure Stack Edge device](azure-stack-edge-r-series-deploy-prep.md).