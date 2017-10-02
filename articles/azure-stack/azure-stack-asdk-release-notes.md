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
ms.date: 09/25/2017
ms.author: helaw

---

# Azure Stack Development Kit release notes

*Applies to: Azure Stack Development Kit*

These release notes provide information on new features and known issues.

## Release Build 20170627.1
Starting with the [20170627.1](azure-stack-updates.md#determine-the-current-version) release, Azure Stack Proof of Concept has been renamed to Azure Stack Development Kit.  Like the Azure Stack POC, Azure Stack Development Kit is intended to be a development and evaluation environment used to explore Azure Stack features, and provide a development platform for Azure Stack.

### What's new
- You can now use CLI 2.0 to manage Azure Stack resources from a commandline on popular operating systems.
- DSV2 virtual machine sizes enable template portability between Azure and Azure Stack.
- Cloud operators can preview the capacity management experience within the capacity management blade.
- You can now use the Azure Diagnostics extension to gather diagnostic data from your virtual machines.  Capturing this data is useful when analyzing workload performance and for investigating issues.
- A new [deployment experience](azure-stack-run-powershell-script.md) replaces previous scripted steps for deployment.  The new deployment experience provides a common graphical interface through the entire deployment lifecycle.
- Microsoft Accounts (MSA) are now supported during deployment.
- Multi-Factor Authentication (MFA) is now supported during deployment.  Previously, MFA must be disabled during deployment.

### Known issues
#### Deployment
* You may notice deployment taking longer than previous releases. 
* Get-AzureStackLogs generates diagnostic logs, however, does not log progress to the console.
* You must use the new [deployment experience](azure-stack-run-powershell-script.md) to deploy Azure Stack, or deployment may fail.
* Deployments using the *PublicVLANID* parameter will fail.

#### Portal
* You may see a blank dashboard in the portal.  You can recover the dashboard by selecting the gear in the upper right of the portal, and selecting "Restore default settings".
* Tenants are able to browse the full marketplace without a subscription, and will see administrative items like plans and offers.  These items are non-functional to tenants.
* When selecting an infrastructure role instance,  you see an error showing a reference error. Use the browser’s refresh functionality to refresh the Admin Portal.
* The "move" button is disabled on the Resource Group blade.  This is expected behavior, because moving resource groups between subscriptions is not currently supported.
* You will receive repeated notifications for syndicated marketplace items that have completed downloading.
* You are not able to view permissions to your subscription using the Azure Stack portals.  As a work-around, you can verify permissions using Powershell.
* You must add `-TenantID` as a flag when exporting a completed deployment as an automation script from the portal.

#### Services
* Key Vault services must be created from the tenant portal or tenant API.  If you are logged in as an administrator, make sure to use the tenant portal to create new Key Vault vaults, secrets, and keys.
* There is no marketplace experience for creating virtual machine scale sets, though they can be created via template.
* You cannot associate a load balancer with a backend network via the portal.  This task can be completed with PowerShell or with a template.
* VM Availability sets can only be configured with a fault domain of one and an update domain of one.  
* A tenant must have an existing storage account before creating a new Azure Function.
* VM may fail and report "Cannot bind argument to parameter 'VM Network Adapter' because it is null."  Redeployment of the virtual machine succeeds.  
* Deleting tenant subscriptions results in orphaned resources.  As a workaround, first delete tenant resources or entire resource group, and then delete tenant subscriptions. 
* You must create a NAT rule when creating a network load balancer, or you will receive an error when you attempt to add a NAT rule after the load balancer is created.
* Tenants can create virtual machines larger than quota allows.  This behavior is because compute quotas are not enforced.
* Tenants are given the option to create a virtual machine with geo-redundant storage.  This configuration causes virtual machine creation to fail.
* It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
* Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in mismatched state.
* AzureRM PowerShell 1.2.10 requires extra configuration steps:
    * Run this after running Add-AzureRMEnvironment for Azure AD deployments.  Provide the Name and GraphAudience values using the output from `Add-AzureRMEnvironment`.
      
      ```PowerShell
      Set-AzureRmEnvironment -Name <Environment Name> -GraphAudience <Graph Endpoint URL>
      ```
    * Run this after running Add-AzureRMEnvironment for AD FS deployments.  Provide the Name and GraphAudience values using the output of `Add-AzureRMEnvironment`.
      
      ```PowerShell
      Set-AzureRmEnvironment <Environment Name> -GraphAudience <Graph Endpoint URL> -EnableAdfsAuthentication:$true
      ```
    
    As an example, the following is used for an Azure AD environment:

    ```PowerShell
      Set-AzureRmEnvironment AzureStack -GraphAudience https://graph.local.azurestack.external/
    ```

#### Fabric
* The compute resource provider displays an unknown state.
* The BMC IP address & model are not shown in the essential information of a Scale Unit Node.  This behavior is expected in Azure Stack development kit.
* The restart action on Compute controller infrastructure role (AzS-XRP01 instance) should not be used.
* The Infrastructure backup blade should not be used.
