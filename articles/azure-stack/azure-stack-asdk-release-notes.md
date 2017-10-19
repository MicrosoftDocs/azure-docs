---
title: Microsoft Azure Stack Development Kit release notes | Microsoft Docs
description: 
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: a7e61ea4-be2f-4e55-9beb-7a079f348e05
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/13/2017
ms.author: helaw

---

# Azure Stack Development Kit release notes

*Applies to: Azure Stack Development Kit*

These release notes provide information on new features and known issues in Azure Stack Development Kit. If you're not sure which version you're running, you can use the [portal to check](azure-stack-updates.md#determine-the-current-version).

## Release Build 20170928.3

### Known issues

#### PowerShell

- The release of the AzureRM 1.2.11 PowerShell module comes with a list of breaking changes. For information about upgrading from the 1.2.10 version, see the migration guide at [https://aka.ms/azspowershellmigration](https://aka.ms/azspowershellmigration).


#### Deployment
* You must specify a time server by IP address during deployment.  


#### Portal
* You may see a blank dashboard in the portal.  You can recover the dashboard by selecting the gear in the upper right of the portal, and selecting "Restore default settings".
* Tenants are able to browse the full marketplace without a subscription, and can see administrative items like plans and offers.  These items are non-functional to tenants.
* The "move" button is disabled under Resource Group.  This disabled button is expected behavior, because moving resource groups between subscriptions is not currently supported.
* You are not able to view permissions to your subscription using the Azure Stack portals.  As a work-around, you can verify permissions using Powershell.
* You will see an alert advising you to register your Azure Stack Development Kit.  This alert is expected behavior.  
  

#### Services
* There is no marketplace experience for creating virtual machine scale sets, though they can be created via template.
* You are unable to create a load balancer with a public IP address using the portal.  As a workaround, you can use PowerShell to create the load balancer.
* VM Availability sets can only be configured with a fault domain of one and an update domain of one.  
* A tenant must register the storage resource provider before creating their first Azure Function in the subscription.
* Deleting tenant subscriptions results in orphaned resources.  As a workaround, first delete tenant resources or entire resource group, and then delete tenant subscriptions. 
* You must create a NAT rule when you create a network load balancer. If you don't, you will receive an error when you attempt to add a NAT rule after the load balancer is created.
* Tenants are given the option to create a virtual machine with geo-redundant storage.  This configuration causes virtual machine creation to fail.
* It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
* Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in mismatched state.
* The Infrastructure backup blade must not be used.


#### Fabric
* The compute resource provider displays an unknown state.
* The BMC IP address & model are not shown in the essential information of a Scale Unit node.  This behavior is expected in Azure Stack development kit.

