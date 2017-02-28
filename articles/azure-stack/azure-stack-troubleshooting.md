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
ms.date: 3/1/2017
ms.author: helaw

---
# Microsoft Azure Stack troubleshooting
This document provides common troubleshooting information for Azure Stack.

For the best experience, make sure that your deployment environment meets all [requirements](azure-stack-deploy.md) and [preparations](azure-stack-run-powershell-script.md) before installing. 

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. If you are experiencing an issue not documented, make sure to check the [Azure Stack MSDN Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack) for further support and additional information.

Code examples are provided as is and expected results cannot be guaranteed. This section is subject to frequent edits and updates as improvements to the product are implemented.

## Known Issues
* You may see non-terminating errors during deployment, which do not affect deployment success.
* You may notice deployment taking longer than previous releases. 
* You will see AzureRM PowerShell modules are no longer installed by default on the MAS-CON01 VM. This behavior is by design, because there is an alternate method to [install these modules and connect](azure-stack-connect-powershell.md).  
* You will see that the  resource providers are not automatically registered for tenant subscriptions. Use the [Connect module](https://github.com/Azure/AzureStack-Tools/tree/master/Connect), or run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
  
       Get-AzureRMResourceProvider | Register-AzureRmResourceProvider
* You will see export functionality in the portal for Resource Groups, however no text is displayed and available for export.      
* When you delete a plan, offer, or subscription, VMs may not be deleted.
* When installing TP3, you should not activate the host OS in the VHD provided where you run the Azure Stack setup script, or you may receive an error messaging stating Windows will expire soon.
* Logging out of ADFS will result in an error message.
* You may not see usage information for Windows and Linux VMs.
* The reclaim storage procedure may not immediately complete.
* Opening Storage Explorer from the storage account blade will result in an error.  This is expected behavior for TP3.
* You may see an error when signing in to a deployment with ADFS.  The text will read "Sorry, we had some trouble signing you in.  Click 'Try again' to try again."  This is a known error, and clicking Try Again will take you to the portal.
* Attempting to delegate a private offer to a user will result in an error due to a blank Azure AD tenant.  To work around, make the offer public. 
* Running Add-AzureRmEnvironment twice makes may result in error.


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
* The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack Technical Preview (TP) 2, vs the “East US” or “South India” in Azure).
* You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in Azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.

## Virtual machines
### After starting my Azure Stack TP3 host, some VMs may not automatically start.
After rebooting your host, you may notice Azure Stack services are not immediately available.  This is because Azure Stack [infrastructure VMs](azure-stack-architecture.md#virtual-machine-roles) and RPs take a little bit to check consistency, but will eventually start automatically.

You may also notice that tenant VMs don't automatically start after a reboot of the POC host.  This is a known issue in TP3, and just requires a few manual steps to bring them online:

1.  On the POC host, start **Failover Cluster Manager** from the Start Menu.
2.  Select the cluster **S-Cluster.azurestack.local**.
3.  Select **Roles**.
4.  Tenant VMs will appear in a *saved* state.  Once all Infrastructure VMs are running, right-click the tenant VMs and select **Start** to resume the VM.


### I have deleted some virtual machines, but still see the VHD files on disk. Is this behavior expected?
Yes, this is behavior expected. It was designed this way because:

* When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
* When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold in [manage storage accounts](azure-stack-manage-storage-accounts.md).


## Next steps
[Frequently asked questions](azure-stack-faq.md)

