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
ms.date: 07/10/2017
ms.author: helaw

---
# Microsoft Azure Stack troubleshooting
This document provides common troubleshooting information for Azure Stack. 

Because the Azure Stack Technical Development Kit is offered as an evaluation environment, there is no official support from Microsoft Customer Support Services.  If you are experiencing an issue not documented, make sure to check the [Azure Stack MSDN Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack) for further assistance and information.  

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. Code examples are provided as is and expected results cannot be guaranteed. This section is subject to frequent edits and updates as improvements to the product are implemented.

## Deployment
### Deployment failure
If you experience a failure during installation, you can use use the rerun option of the deployment script to restart the deployment from the failed step.  


### At the end of the deployment, the PowerShell session is still open and doesn’t show any output
This behavior is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The development kit deployment has actually succeeded but the script was paused when selecting the window. You can verify this is the case by looking for the word "select" in the titlebar of the command window.  Press the ESC key to unselect it, and the completion message should be shown after it.

## Templates
### Azure template won't deploy to Azure Stack
Make sure that:

* The template must be using a Microsoft Azure service that is already available or in preview in Azure Stack.
* The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack development kit, vs the “East US” or “South India” in Azure).
* You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in Azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.

## Virtual machines
### Default image and gallery item
You must first add a Windows Server image and gallery item before deploying VMs in Azure Stack.

### After restarting my Azure Stack host, some VMs may not automatically start.
After rebooting your host, you may notice Azure Stack services are not immediately available.  This is because Azure Stack [infrastructure VMs](azure-stack-architecture.md#virtual-machine-roles) and RPs take a little bit to check consistency, but will eventually start automatically.

You may also notice that tenant VMs don't automatically start after a reboot of the Azure Stack development kit host.  This is a known issue, and just requires a few manual steps to bring them online:

1.  On the Azure Stack development kit host, start **Failover Cluster Manager** from the Start Menu.
2.  Select the cluster **S-Cluster.azurestack.local**.
3.  Select **Roles**.
4.  Tenant VMs will appear in a *saved* state.  Once all Infrastructure VMs are running, right-click the tenant VMs and select **Start** to resume the VM.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this behavior expected?
Yes, this is behavior expected. It was designed this way because:

* When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
* When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold and on-demand reclamation in [manage storage accounts](azure-stack-manage-storage-accounts.md).

## Storage
### Storage reclamation
It may take up to fourteen hours for reclaimed capacity to show up in the portal. Space reclamation depends on various factors including usage percentage of internal container files in block blob store. Therefore, depending on how much data is deleted, there is no guarantee on the amount of space that could be reclaimed when garbage collector runs.

## PowerShell
### Resource Providers not registered
When connecting to tenant subscriptions with PowerShell, you will notice that the resource providers are not automatically registered. Use the [Connect module](https://github.com/Azure/AzureStack-Tools/tree/master/Connect), or run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
  
       Get-AzureRMResourceProvider | Register-AzureRmResourceProvider

## CLI

* The CLI interactive mode i.e the `az interactive` command is not yet supported in Azure Stack.
* To get the list of virtual machine images available in Azure Stack, use the `az vm images list --all` command instead of the `az vm image list` command. Specifying the `--all` option makes sure that response returns only the images that are available in your Azure Stack environment. 
* Virtual machine image aliases that are available in Azure may not be applicable to Azure Stack. When using virtual machine images, you must use the entire URN parameter (Canonical:UbuntuServer:14.04.3-LTS:1.0.0) instead of the image alias. And this URNmust match the image specifications as derived from the `az vm images list` command.
* By default, CLI 2.0 uses “Standard_DS1_v2” as the default virtual machine image size. However, this size is not yet available in Azure Stack, so, you need to specify the `--size` parameter explicitly when creating a virtual machine. You can get the list of virtual machine sizes that are available in Azure Stack by using the `az vm list-sizes --location <locationName>` command.


## Windows Azure Pack Connector
* If you change the password of the azurestackadmin account after you deploy Azure Stack development kit, you can no longer configure multi-cloud mode. Therefore, it won't be possible to connect to the target Windows Azure Pack environment.
* After you set up multi-cloud mode:
    * A user can see the dashboard only after they reset the portal settings. (In the user portal, click the portal settings icon (gear icon in the top-right corner). Under **Restore default settings**, click **Apply**.)
    * The dashboard titles may not appear. If this issue occurs, you must manually add them back.
    * Some tiles may not show correctly when you first add them to the dashboard. To fix this issue, refresh the browser.



