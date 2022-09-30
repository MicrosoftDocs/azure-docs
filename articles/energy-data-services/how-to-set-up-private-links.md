---
title: Microsoft Energy Data Services - how to set up private links #Required; page title is displayed in search results. Include the brand.
description: Guide to set up private links on Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: sandeepchads #Required; your GitHub user alias, with correct capitalization.
ms.author: sancha #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 09/29/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
#Customer intent: As a developer, I want to set up private links on Microsoft Energy Data Services
---

# Private Links in Microsoft Energy Data Services
[Azure Private Link](https://azure.microsoft.com/services/private-link/) provides private connectivity from a virtual network to Azure platform as a service (PaaS). It simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet.
By using Azure Private Link, you can connect to a Microsoft Energy Data Services Preview instance from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network.
You can then limit access to your Microsoft Energy Data Services Preview instance over these private IP addresses. 
You can connect to a Microsoft Energy Data Services configured with Private Link by using the automatic or manual approval method. To [learn more](https://learn.microsoft.com/azure/private-link/private-endpoint-overview#access-to-a-private-link-resource-using-approval-workflow), see the Approval workflow section of the Private Link documentation.
This article describes how to set up private endpoints for Microsoft Energy Data Services preview. 

## Pre-requisites
1.	Create a virtual network in the same subscription as the Microsoft Energy Data Services instance. [Learn more](https://learn.microsoft.com/azure/virtual-network/quick-create-portal). This will allow auto-approval of the private link end point.

## Create a private endpoint by using the Azure portal
Use the following steps to create a private endpoint for an existing Microsoft Energy Data Services instance by using the Azure portal:
1.	From the **All resources** pane, choose a Microsoft Energy Data Services Preview instance.
2.	Select **Networking** from the list of settings.
 
3.	Select **Public Access** and select **Enabled from all networks** to allow traffic from all networks.
4.	To block traffic from all networks, select **Disabled**.
5.	Select **Private access** tab and select **Create a private endpoint**, to create a Private Endpoint Connection.
 
6.	In the Create a private endpoint - **Basics pane**, enter or select the following details:


|Setting|	Value|
|--------|-----|
|Project details|
|Subscription|	Select your subscription.|
|Resource group|	Select a resource group.|
|Instance details|	
|Name|	Enter any name for your private endpoint. If this name is taken, create a unique one.|
|Region|	Select the region where you want to deploy Private Link. |
	
> NOTE: Auto-approval only happens when the Microsoft Energy Data Services Preview instance and the vnet for the private link are in the same subscription.
 
7.	Select **Next: Resource.**
8.	In **Create a private endpoint - Resource**, following information should be selected or available:

|Setting |	Value |
|--------|--------|
|Subscription|	Your subscription.|
|Resource type|	Microsoft.OpenEnergyPlatform/energyServices|
|Resource	|Your Microsoft Energy Data Services instance.|
|Target sub-resource|	This defaults to MEDS. |
	

 
9.	Select **Next: Virtual Network.**
10.	In Virtual Network screen, you can:
* Configure Networking and Private IP Configuration settings. [Learn more](https://learn.microsoft.com/azure/private-link/create-private-endpoint-portal?tabs=dynamic-ip#create-a-private-endpoint)
* Configure private endpoint with ASG. [Learn more](https://learn.microsoft.com/azure/private-link/configure-asg-private-endpoint?tabs=portal#create-private-endpoint-with-an-asg)
 
11.	Select **Next: DNS**. You can leave the default settings or learn more about DNS configuration. [Learn more](https://learn.microsoft.com/azure/private-link/private-endpoint-overview#dns-configuration)
 
12.	Select **Next: Tags** and add tags to categorize resources.
13.	Select **Review + create**. On the Review + create page, Azure validates your configuration.
14.	When you see the Validation passed message, select **Create**.

 
15.	 Once the deployment is complete, select **Go to resource**. 
 
16.	The Private Endpoint created is **Auto-approved**.
 
17.	Select the **Microsoft Energy Data Services** instance and navigate to the **Networking** tab to see the Private Endpoint created.
 

18.	When the Microsoft Energy Data Services and vnet are in different tenants or subscriptions, you will be required to **Approve** or **Reject** the **Private Endpoint** creation request. 
