<properties
	pageTitle="Microsoft Azure Stack troubleshooting | Microsoft Azure"
	description="Azure Stack troubleshooting."
	services="azure-stack"
	documentationCenter=""
	authors="heathl17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Microsoft Azure Stack troubleshooting

If you experience issues while deploying or using Microsoft Azure Stack, refer to the following guidance. But first, make sure that your deployment environment complies with all [requirements](azure-stack-deploy.md) and [preparations](azure-stack-run-powershell-script.md). In particular, make sure you comply with the storage configuration requirements and this note:

>[AZURE.IMPORTANT] Only one NIC is allowed during the deployment process. If you want to use a specific NIC, you must disable all the others.

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. Code examples are provided as is and expected results cannot be guaranteed. This section is not comprehensive of all troubleshooting issues for Microsoft Azure Stack, and it is subject to frequent edits and updates as improvements to the product are implemented.

## Known Issues

 - You may see the following non-terminating errors during deployment, which will not affect deployment success:
     - “The term 'C:\WinRM\Start-Logging.ps1' is not recognized”
     - “Invoke-EceAction: Cannot index into a null array” 
	 - “InvokeEceAction: Cannot bind argument to parameter 'Message' because it is an empty string.”
 - You will see that the **Availability Set** resource in the Marketplace shows up under the **virtualMachine-ARM** category – this appearance is only a cosmetic issue.
 - When creating a new virtual machine in the portal, in the **Basics** step, the storage option defaults to SSD.  This setting must be changed to HDD or on the **Size** step of VM deployment, you will not see VM sizes available to select and continue deployment. 
 - You will see AzureRM PowerShell modules are no longer installed by default on the MAS-CON01 VM (in TP1 this was named ClientVM). This behavior is by design, because there is an alternate method to [install these modules and connect](azure-stack-connect-powershell.md).  
 - You will see that the **Microsoft.Insights** resource provider is not automatically registered for tenant subscriptions. If you would like to see monitoring data for a VM deployed as a tenant, run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
       
	    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Insights 

 - You will see export functionality in the portal for Resource Groups, however no text is displayed and available for export.      
 - You can start a deployment of storage resources larger than available quota.  This deployment will fail and the account resources will be suspended.  There are two remediation options available:
     - Service Administrator can increase the quota, though changes will not take effect immediately and commonly take up to an hour to propagate.
     - Service Administrator can create an add-on plan with additional quota that the tenant can then add to the subscription.
 - When using the portal to create VMs on Azure Stack environments with identity in ‘Azure - China’, you will not see VM sizes available to select in the **Size** step of VM deployment and will be unable to continue deployment.
 - You may see a deployment failure in the portal, when the VM has actually deployed successfully.
 - When you delete a plan, offer, or subscription, VMs may not be deleted.
 - You will see the VM extensions in the marketplace.
 - You cannot deploy a VM from a saved VM image.
 - Tenants may see services which are not included in their subscription.  When tenants attempt to deploy these resources, they will receive an error.  Example:  Tenant subscription only includes storage resources.  Tenant will see option to create other resources like VMs.  In this scenario, when a tenant attempts to deploy a VM, they will receive an message indicating the VM can’t be created. 

## Deployment

### Deployment failure
If you experience a failure during installation, the Azure Stack installer allows you to continue a failed installation by following the [rerun deployment steps](azure-stack-rerun-deploy.md).

### At the end of the deployment, the PowerShell session is still open and doesn’t show any output

This is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The POC deployment had actually succeeded but the script was paused when selecting the window. Please press the ESC key to unselect it, and the completion message should be shown after it.

## Templates

### Azure template won't deploy to Azure Stack

Make sure that:

- The template must be using a Microsoft Azure service that is already available or in preview in Azure Stack.
- The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack Technical Preview (TP) 2, vs the “East US” or “South India” in Azure).
- You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in Azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.

## Virtual machines

### After starting my Microsoft Azure Stack POC host, all my tenants VMs are gone from Hyper-V Manager, and come back automatically after waiting a bit?

As the system comes back up the storage subsystem and RPs need to determine consistency. The time needed depends on the hardware and specs being used, but it may be some time after a reboot of the host for tenant VMs to come back and be recognized.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this expected?

Yes, this is expected. It was designed this way because:

- When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
- When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold in [manage storage accounts](azure-stack-manage-storage-accounts.md).

## Next steps

[Frequently asked questions](azure-stack-FAQ.md)
