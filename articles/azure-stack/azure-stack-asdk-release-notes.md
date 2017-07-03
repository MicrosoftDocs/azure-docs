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
ms.date: 07/10/2017
ms.author: helaw

---

# Azure Stack Development Kit release notes
These release notes provide information on new features and known issues.

## Release Build 20170627.1
Starting with the [20170627.1](azure-stack-updates.md#determine-the-current-version) release, Azure Stack Proof of Concept has been renamed to Azure Stack Development Kit.  Like the Azure Stack POC, Azure Stack Development Kit is intended to be a development and evaluation environment used to explore Azure Stack features, and provide a development platform for Azure Stack.

### What's new
- You can now use CLI 2.0 to manage Azure Stack resources from a commandline on popular operating systems.
- DSV2 virtual machine sizes enable template portability between Azure and Azure Stack.
- Cloud operators can preview the capacity management experience with the capacity management blade.
- You can now use Azure Diagnostics extension to gather diagnostic data from your virtual machines.  Capturing this data is useful when analyzing workload performance, and for investigating issues.
- A new deployment experience replaces previous scripted steps for deployment.  The new deployment experience provides a common graphical interface through the entire deployment lifecycle.
- Microsoft Accounts (MSA) are now supported during deployment.
- Multi-Factor Authentication (MFA) is now supported during deployment.  Previously, MFA must be disabled during deployment.

### Known issues
#### Deployment
* You may notice deployment taking longer than previous releases. 
* Get-AzureStackLogs generates diagnostic logs, however, does not log progress to the console.
* You must run this tool to modify network adapter configuration before deploying Azure Stack development kit, or deployment may fail.

#### Portal
* You may see a blank dashboard in the portal.  You can recover the dashboard by selecting the gear in the upper right of the portal, and selecting "Restore default settings".
* Tenants are able to browse the full marketplace without a subscription, and will see administrative items like plans and offers.  These items are non-functional to tenants.
* When selecting an infrastructure role instance,  you see an error showing a reference error. Use the browser’s refresh functionality to refresh the Admin Portal 

#### Services
* Key Vault services must be created from the tenant portal or tenant API.  If you are logged in as an administrator, make sure to use the tenant portal to create new Key Vault vaults, secrets, and keys.
* There is no marketplace experience for creating virtual machine scale sets, though they can be created via template.
* You cannot associate a load balancer with a backend network via the portal.  This task can be completed with PowerShell or with a template.
* VM Availability sets can only be configured with a fault domain of one and an update domain of one.  
* A tenant must have an existing storage account before creating a new Azure function.
* VM may fail and report "Cannot bind argument to parameter 'VM Network Adapter' because it is null".  Redeployment of the virtual machine will succeed.  
* Deleting tenant subscriptions will result in orphaned resources.  As a workaround, first delete tenant resources/resource group, then delete tenant subscriptions.  
* You must create a NAT rule when creating a network load balancer, or you will receive an error trying to add a NAT rule once the load balancer is created.
* Tenants can create virtual machines larger than quota allows.  This behavior is because compute quotas are not enforced.
* Tenants are given the option to create a virtual machine with geo-redundant storage.  This configuration will cause virtual machine creation to fail.

#### Fabric
* All Infrastructure Roles display a known health state, however the health state is not accurate for roles outside of Compute controller and Health controller.
* Compute resource provider will show an unknown state.
* The BMC IP address & model are not shown in the essential information of a Scale Unit Node.  This is expected behavior in the Azure Stack development kit.
