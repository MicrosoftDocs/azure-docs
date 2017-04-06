---
title: Microsoft Azure Stack troubleshooting | Microsoft Docs
description: Azure Stack troubleshooting.
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: a20bea32-3705-45e8-9168-f198cfac51af
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/3/2017
ms.author: helaw

---
# Microsoft Azure Stack troubleshooting
This document provides common troubleshooting information for Azure Stack.

For the best experience, make sure that your deployment environment meets all [requirements](azure-stack-deploy.md) and [preparations](azure-stack-run-powershell-script.md) before installing. 

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. If you are experiencing an issue not documented, make sure to check the [Azure Stack MSDN Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack) for further support and additional information.

Code examples are provided as is and expected results cannot be guaranteed. This section is subject to frequent edits and updates as improvements to the product are implemented.

## Known Issues
* You may notice deployment taking longer than previous releases.   
* You will see an error when signing in to a deployment with ADFS.  The text will read "Sorry, we had some trouble signing you in.  Click 'Try again' to try again."  This is a known error, and clicking Try Again will take you to the portal.  You can also add *https://*.local.azurestack.external* to the "Local Intranet" trusted sites in Internet Explorer. 
* Logging out of portal in AD FS deployment will result in an error message.
* You may see incorrect cores/minute usage information for Windows and Linux VMs.
* The "Get started" tile on the dashboard references Azure specific information.
* The reclaim storage procedure may take time to complete.
* Opening Storage Explorer from the storage account blade will result in an error.  This is expected behavior for TP3.
* Attempting to delegate or assign a offer to a user will result in an error due to a blank Azure AD tenant field.  To work around, make the offer public. 
* Using the Marketplace Item to create a VM with guest OS diagnostics enabled will receive an error that the VM extension failed.  To workaround, enable the Guest OS diagnostics after VM deployment. 
* There are known issues with VM resizing and this scenario shouldn't be validated at this time.
* You will see virtual machines reboot after configuration changes.
* You may see an error after applying a change to an existing VM, like VM extensions or adding additional resources such as data disks. 
* Deploying Azure Stack with ADFS and without internet access will result in licensing error messages and the host will expire after 10 days.  We advise having internet connectivity during deployment, and then testing disconnected scenarios once deployment is complete.
* Key Vault services must be created from the tenant portal or tenant API.  If you are logged in as an administrator, make sure to use the tenant portal to create new Key Vault vaults, secrets, and keys.
* There is no marketplace experience for creating VM Scale Sets, though they can be created via template.
* You will see the "Get subscription" tile is missing from the tenant dashboard.  To sign-up for a subscription, use the subscription list to select a subscription.
* You will see the DNS namespaces have changed for Azure Stack, and also now include the region name.  Example:  *https://portal.local.azurestack.external*  
* As a result of the Azure Stack deployment processes several alerts are generated and remain active.  These can be viewed by the Azure Stack administrator and can be closed manually.  If the issue persists the alert will reactivate. The titles of these alerts are:
    * Service Fabric Application fabric:/(appname)
    * Service Fabric Cluster is unhealthy
    * Additional alerts that may generate and automatically close during deployment are the following:
        * A health system component is not operating correctly
        * Template for FaultType Microsoft.Health.FaultType.VirtualDisks.NeedsRepair is missing
* All Infrastructure Roles will display with a known health state, however the health state is not accurate for roles outside of Compute Controller and Health Controller
* Some alerts may recommend a “Restart” action on a specific infrastructure role.  The restart action for infrastructure roles is not available in Azure Stack TP3.
* You will see an HSM option when creating Key Vault vaults through the portal.  HSM backed vaults are not supported in Azure Stack TP3.
 
 

   

## Deployment
### Deployment failure
If you experience a failure during installation, you can use the -rerun parameter of the Azure Stack install script to try again from the failed step.  Run the following from the PowerShell session where you noticed the failure:

```PowerShell
cd C:\CloudDeployment\Setup
.\InstallAzureStackPOC.ps1 -rerun
```


### At the end of the deployment, the PowerShell session is still open and doesn’t show any output
This behavior is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The POC deployment has actually succeeded but the script was paused when selecting the window. You can verify this is the case by looking for the word "select" in the titlebar of the command window.  Press the ESC key to unselect it, and the completion message should be shown after it.

## Templates
### Azure template won't deploy to Azure Stack
Make sure that:

* The template must be using a Microsoft Azure service that is already available or in preview in Azure Stack.
* The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack Technical Preview 3, vs the “East US” or “South India” in Azure).
* You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in Azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.

## Virtual machines
### Default image and gallery item
You must first add a Windows Server image and gallery item before deploying VMs in Azure Stack TP3.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this behavior expected?
Yes, this is behavior expected. It was designed this way because:

* When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
* When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold and on-demand reclamation in [manage storage accounts](azure-stack-manage-storage-accounts.md).

## Storage
### Storage reclamation
It may take up to two hours for reclaimed capacity to show up in the portal. Space reclamation depends on various factors including usage percentage of internal container files in block blob store. Therefore, depending on how much data is deleted, there is no guarantee on the amount of space that could be reclaimed when garbage collector runs.

## PowerShell
### Resource Providers not registered
When connecting to tenant subscriptions with PowerShell, you will notice that the resource providers are not automatically registered. Use the [Connect module](https://github.com/Azure/AzureStack-Tools/tree/master/Connect), or run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
  
       Get-AzureRMResourceProvider | Register-AzureRmResourceProvider

## Next steps
[Frequently asked questions](azure-stack-faq.md)

