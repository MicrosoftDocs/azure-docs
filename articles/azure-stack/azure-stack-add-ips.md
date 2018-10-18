---
title: Add public IP addresses in Azure Stack | Microsoft Docs
description: Learn how to add more Public IP Addresses to Azure Stack.  
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: jeffgilb
ms.reviewer: scottnap

---
# Add Public IP Addresses
*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*  

Learn how to add more Public IP Addresses to Azure Stack.  In this article, we refer to the External Addresses as Public IP Addresses, but in Azure Stack this is meant to refer to adding IP Address blocks to your External network.  Whether that External network is Public Internet routable or is on an Intranet and uses private address space doesn’t really matter for the purposes of this article.  The steps are the same. 

## Add a Public IP Address Pool
You can add Public IP Addresses to your Azure Stack system at any time after the initial deployment of the Azure Stack system. Check out how to [View Public IP address consumption](azure-stack-viewing-public-ip-address-consumption.md) to see what the current usage and Public IP Address availability is on your Azure Stack.

At a high level, the process of adding a new Public IP Address block to Azure Stack looks like this:

 ![Add IP flow](media/azure-stack-add-ips/flow.PNG)

## Obtain the address block from your provider
The first thing you’ll need to do is to obtain the address block you want to add to Azure Stack.  Depending on where you obtain your address block from, you’ll need to consider what the lead time is and manage this against the rate at which you are consuming public IP addresses in Azure Stack.  

> [!IMPORTANT]
> Azure Stack will accept any Address block that you provide, so long as it is a valid address block and does not overlap with an existing address range in Azure Stack.  Please make sure you obtain a valid address block that is routable and non-overlapping with the external network to which Azure Stack is connected.  Once you add the range to Azure Stack, you cannot remove it.

## Add the IP address range to Azure Stack

1. In an Internet browser, navigate to your admin portal dashboard.  For this example, we’ll use https://adminportal.local.azurestack.external.  
2.	Sign in to the Azure Stack administration portal as a cloud operator.
3.	On the default dashboard – find the Region management list and select the region you want to manage, for this example, local.
4.	Find the Resource providers tile and click on the Network Resource Provider.
5.	Click on the Public IP pools usage tile.
6.	Click on the Add IP pool button.
7.	Provide a Name for the IP Pool.  The name you choose is just to allow you to easily identify the IP pool so you can call it whatever you like.  It’s a good practice to make the name the same as the address range, but that isn’t required.
8.	 Enter the Address block you want to add in CIDR notation.  For example: 192.168.203.0/24
9.	When you provide a valid CIDR range in the Address range (CIDR block) field the Start IP address, End IP address and Available IP addresses fields will automatically be populated.  They are read only and automatically generated so you can’t change these without modifying the value in the Address range field.
10.	After reviewing the information on the blade and confirming everything looks correct, Click Ok to commit the change and add the address range to Azure Stack.

## Update the ACLs on your Top-of-Rack switches
The last thing you need to do in order to enable the newly added IP range to work is to update the Access Control Lists (ACLs) on your Top-of-Rack (ToR) switches.  The ACLs on the ToR switches are locked down in such a way that connectivity from outside of Azure Stack to the newly added IP range will not work until the new range is added to the ACLs on the switch.  

You need to contact your OEM and work with them to update the ACLs on ToR switches.  They have the tools needed to do this in a supported fashion.


## Next steps 
[Review scale unit node actions](azure-stack-node-actions.md) 
