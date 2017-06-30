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

## Release Build 1708
Starting with the 1708 release, Azure Stack Proof of Concept has been renamed to Azure Stack Development Kit.  Like the Azure Stack POC, Azure Stack Development Kit is intended to be a development and evaluation environment used to explore Azure Stack features, and provide a development platform for Azure Stack.

### What's new
- You can now use CLI 2.0 to manage Azure Stack resources from a commandline on popular operating systems.
- DSV2 virtual machine sizes enable template portability between Azure and Azure Stack.
- Cloud operators can preview the capacity management experience with the capacity management blade.    

### Known issues
* You may notice deployment taking longer than previous releases. 
* Logging out of portal in AD FS deployment results in an error message.
* You may see incorrect cores/minute usage information for Windows and Linux VMs.
* Opening Storage Explorer from the storage account blade results in an error.
* Deploying Azure Stack with ADFS and without internet access will result in licensing error messages and the host will expire after 10 days.  We advise having internet connectivity during deployment, and then testing disconnected scenarios once deployment is complete.
* Key Vault services must be created from the tenant portal or tenant API.  If you are logged in as an administrator, make sure to use the tenant portal to create new Key Vault vaults, secrets, and keys.
* There is no marketplace experience for creating virtual machine scale sets, though they can be created via template.
* All Infrastructure Roles display a known health state, however the health state is not accurate for roles outside of Compute controller and Health controller.
* The restart action on Compute controller infrastructure role (MAS-XRP01 instance) should not be used.  
* You will see an HSM option when creating Key Vault vaults through the portal.  HSM backed vaults are not supported in Azure Stack TP3.
* VM Availability sets can only be configured with a fault domain of one and an update domain of one.  
* You should avoid restarting the one-node environment because Azure Stack infrastructure services do not start in the proper order.
* You cannot associate a load balancer with a backend network via the portal.  This task can be completed with PowerShell or with a template.
* Virtual machine scale set scale-in operations may fail.
* Virtual machine resize operations fail to complete. As an example, scaling out a virtual machine scale set and resizing from A1 to D2 VMs fail.
* You may notice the *Total Memory* in **Region Management**>**Scale** Units is expressed in MB instead of GB.
* You may see a blank dashboard in the portal.  You can recover the dashboard by selecting the gear in the upper right of the portal, and selecting "Restore default settings".
 




