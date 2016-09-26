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

If you experience issues while deploying or using Microsoft Azure Stack, refer to the guidance below. But first, make sure that your deployment environment complies with all [requirements](azure-stack-deploy.md) and [preparations](azure-stack-run-powershell-script.md). In particular, make sure you comply with the storage configuration requirements and this note:

>[AZURE.IMPORTANT] Only one NIC is allowed during the deployment process. If you want to use a specific NIC, you must disable all the others.

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. Code examples are provided as is and expected results cannot be guaranteed. This section is not comprehensive of all troubleshooting issues for Microsoft Azure Stack, and it is subject to frequent edits and updates as improvements to the product are implemented.

## Known Issues

 - You may see the following non-terminating errors during deployment, these do not impact deployment success:
     - “The term 'C:\WinRM\Start-Logging.ps1' is not recognized”
     - “Invoke-EceAction : Cannot index into a null array” 
	 - “InvokeEceAction : Cannot bind argument to parameter 'Message' because it is an empty string.”
 - You will see that the **Availability Set** resource in the Marketplace shows up under the **virtualMachine-ARM** category – this is a only cosmetic issue.
 - When creating a new virtual machine in the portal, in the **Basics** step, the storage option defaults to SSD.  This must be changed to HDD or on the **Size** step of VM deployment, you will not see VM sizes available to select and continue deployment. 
 - You will see AzureRM PowerShell modules are no longer installed by default on the MAS-CON01 VM (in TP1 this was named ClientVM). This is now by design, because there is an alternate method to [install these modules and connect](azure-stack-connect-powershell.md).  
 - You will see that the **Microsoft.Insights** resource provider is not automatically registered for tenant subscriptions. If you would like to see monitoring data for a VM deployed as a tenant, you will have to run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
       
	    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Insights 

 - You will see export functionality in the portal for Resource Groups, however no text is displayed and available for export.      
 - You can start a deployment of storage resources larger than available quota.  This deployment will fail and the account resources will be suspended.  There are two remediation options available:
     - Service Administrator can increase the quota, though changes will not take effect immediately and commonly take up to an hour to propogate.
     - Service Administrator can create an add-on plan with additional quota that the tenant can then add to the subscription.
 - When using the portal to create VMs on Azure Stack environments with identity in ‘Azure - China’, you will not see VM sizes available to select in the **Size** step of VM deployment and will be unable to continue deployment.
 - You may a see a deployment failure in the portal, when the VM has actually deployed successfully.
 - When you delete a plan, offer, or subscription, VMs may not be deleted.
 - You will see the VM extensions in the marketplace.
 - You can not deploy a VM from a saved VM image.

## Deployment

### Deployment failure
If you experience a failure during installation, the Azure Stack installer allows you to continue a failed installation by following the rerun deployment steps.

### At the end of the deployment, the PowerShell session is still open and doesn’t show any output

This is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The POC deployment had actually succeeded but the script was paused when selecting the window. Please press the ESC key to unselect it, and the completion message should be shown after it.

### POC Deployment fails at “DomainJoin” step

POC deployment fails if your DNS server resolves AzureStack.local to another address external to the POC environment.

As a workaround if this is not a separate entry you have control over within your environment, you can add an entry in the hosts file on the POC host machine to point to the ADVM:

1.  Add the following entry in the hosts file under C:\Windows\System32\drivers\etc (you need local administrator privileges to do so)
'192.168.100.2       Azurestack.local'

3.  Re-run the POC deployment script. You do not need to reinstall the host machine

###  My deployment fails with an error about a time and/or date difference between the client and server

Please check your BIOS settings, in case there is an option to synchronize time. We have seen this issue with HP servers (DL380 G9), using the “Coordinated Universal Time” feature. 

### Installing .NET Framework 3.5 on a Windows Server 2012 R2 machine, from the command line

Here are two methods:

Method 1:

1. Download Windows Server 2012 R2 ISO, and copy the “sources\sxs” folder to local machine (e.g. “c:\sources\ws2012r2\sxs”)
2. Mount Image:
`Dism /Mount-Image /ImageFile:C:\ClusterStorage\Volume1\Share\CRP\PlatformImages\WindowsServer2012R2DatacenterEval\WindowsServer2012R2DatacenterEval.vhd /index:1 /MountDir:C:\OfflineImg`
3. Check if .Net Framework 3.5 is installed (NetFx3)
`DISM /Image:c:\OfflineImg /Get-Features /Format:Table`
4. Install .Net Framework 3.5 specifying the “sxs” sources
`DISM /Image:c:\OfflineImg /Enable-Feature /FeatureName:NetFx3 /All /LimitAccess /Source:C:\Sources\WS2012R2\sxs`
5. Check .Net Framework 3.5 was installed (NetFx3)
`DISM /Image:c:\OfflineImg /Get-Features /Format:Table`
A status of “Enable Pending” indicates that the image must be brought online to complete the installation.
6. Unmount image and commit changes
`Dism /Unmount-Image /MountDir:c:\OfflineImg /commit`

Method 2:

Mount the Windows Server 2012R2 ISO and run:
`Install-WindowsFeature -Vhd C:\ClusterStorage\Volume1\Share\CRP\PlatformImages\WindowsServer2012R2DatacenterEval\WindowsServer2012R2DatacenterEval.vhd -Name NET-Framework-Core -Source X:\sources\sxs\`

### The POC deployment fails with AAD error “User realm discovery failed”

This error indicates that deployment script is unable to connect to the Internet for Azure Active Directory (AAD) authentication via the NATVM. Please verify the PortalVM has Internet connectivity by browsing to https://login.windows.net

If you are using a static IP / gateway, you need to specify the NATVM static IP / gateway as parameters (*NATVMStaticIP* and  *NATVMStaticGateway*) when running the deployment script.

Information about the NATVMStaticIP and NATVMStaticGateway parameters can be found in the [deployment documentation](azure-stack-run-powershell-script.md).

## Azure Active Directory

### JavaScript error when attempting to connect via AAD and Azure PowerShell

Two options are possible to work around this:

1. Disable Internet Explorer Enhanced Security Configuration on the Host / MAS-Con01 (wherever PowerShell will be executed that pops up the AAD login).

2. Add three websites to the trusted list:
  - https://login.microsoftonline.com 
  - https://*.microsoftonline-p.com 
  - https://login.live.com

Also, depending on your current actions, please ensure you are running PowerShell as the regular Azure Stack user (default user when leveraging the MAS-Con01) and are not using “Run As Administrator” (different context). Logging in temporarily as the administrator, you could also set these options in this other user context.

### Cookies error when attempting to connect via AAD and AzureRM PowerShell

If you encounter this issue, the workaround is: 

1. In Internet Explorer, Open Internet Settings 
2. Privacy Tab 
3. Click on Advanced 
4. Click On Ok immediately 
5. Close Browser 
6. Try again

>[AZURE.NOTE] You may need to manually find iexplore.exe in the Program Files\Internet Explorer directory.


## Portal

### Error when creating a storage account

When creating a storage account in the portal, you must select a subscription first (before entering a name).

## PowerShell

### When creating a storage account in PowerShell, I get an error about the “specific argument was out of the range of valid values”

Please ensure you use minimal caps for the storage account. This behavior is consistent with Microsoft Azure (public cloud).

## Templates

### Template deployment fails using Visual Studio

A deployment in Visual Studio may time out after one hour with an access token expiration (UTC is earlier than current UTC time). This is a known issue with Visual Studio.

Workaround:  publish the template using PowerShell.

### Azure template won't deploy to Azure Stack

Make sure that:

- The template must be using a Microsoft Azure service that is already available or in preview in Azure Stack.
- The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack Technical Preview (TP) 2, vs the “East US” or “South India” in Azure).
- You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.


## Tenant

### Tenant can't change plan's status to "public"

If the service admin sets an offer/plan to private, the tenant admin cannot change it to public.

Workaround: Change the plan and offer to public at the service admin level.  The tenant admin can then flip it to public or private.

## Virtual machines

### After starting my Microsoft Azure Stack POC host, all my tenants VMs are gone from Hyper-V Manager, and come back automatically after waiting a bit?

As the system comes back up the Azure-consistent Storage subsystem and RPs need to determine consistency. The time needed depends on the hardware and specs being used, but it may sometimes take ~45 minutes after a reboot of the host for tenant VMs to come back and be recognized.

Please note this would not happen in a multi system deployment because you would not have a single box running the Azure Consistent Storage layer unless you restarted all nodes at the same time, similar to a full restart of an all up integrated system.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this expected?

Yes, this is expected. It was designed this way because:

- When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
- When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold in [manage storage accounts](azure-stack-manage-storage-accounts.md).

## Next steps

[Frequently asked questions](azure-stack-FAQ.md)
