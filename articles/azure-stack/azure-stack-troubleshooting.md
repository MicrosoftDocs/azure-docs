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
 - You will see that there AzureRM PowerShell modules are no longer installed by default on the MAS-CON01 VM (in TP1 this was named ClientVM). This is now by design, because there is an alternate method to [install these modules and connect](azure-stack-connect-powershell.md).  
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


## Azure Active Directory

### JavaScript error when attempting to connect via AAD and Azure PowerShell

Two options are possible to work around this:

1. Disable Internet Explorer Enhanced Security Configuration on the Host / ClientVM (wherever PowerShell will be executed that pops up the AAD login).

2. Add three websites to the trusted list:
  - https://login.microsoftonline.com 
  - https://*.microsoftonline-p.com 
  - https://login.live.com

Also, depending on your current actions, please ensure you are running PowerShell as the regular Azure Stack user (default user when leveraging the ClientVM) and are not using “Run As Administrator” (different context). Logging in temporarily as the administrator, you could also set these options in this other user context.

### Cookies error when attempting to connect via AAD and AzureRM PowerShell

If you encounter this issue, the workaround is: 

1. In Internet Explorer, Open Internet Settings 
2. Privacy Tab 
3. Click on Advanced 
4. Click On Ok immediately 
5. Close Browser 
6. Try again

>[AZURE.NOTE] You may need to manually find iexplore.exe in the Program Files\Internet Explorer directory.


## Deployment

### At the end of the deployment, the PowerShell session is still open and doesn’t show any output

This is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The POC deployment had actually succeeded but the script was paused when selecting the window. Please press the ESC key to unselect it, and the completion message should be shown after it.

### POC Deployment fails at “DomainJoin” step

POC deployment fails if your DNS server resolves AzureStack.local to another address external to the POC environment.

As a workaround if this is not a separate entry you have control over within your environment, you can add an entry in the hosts file on the POC host machine to point to the ADVM:

1.  Add the following entry in the hosts file under C:\Windows\System32\drivers\etc (you need local administrator privileges to do so)
'192.168.100.2       Azurestack.local'

3.  Re-run the POC deployment script. You do not need to reinstall the host machine

###  My deployment fails with an error about a time and/or date difference between the client and server

Please check your BIOS settings, in case there is an option to synchronize time. We have seen this issue with HP servers (DL380 G9), using the “Coordinated Universal Time” feature. This is what step #8 in the deployment guide means: “Configure the BIOS to use Local Time instead of UTC.” 

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
- If you are using a static IP / gateway, you need to specify the NATVM static IP / gateway as parameters (NATVMStaticIP and  NATVMStaticGateway) when running the deployment script.


Note: TP1 doesn’t support scenarios where the proxy requires authentication.

Repair actions: If you hit this error, ensure NATVM and PortalVM can connect to the Internet and re-run the deployment script, for example, assign proper IP / Gateway on the NATVM, and configure HTTP Proxy on PortalVM and ClientVM. If this does not succeed, you may try to redeploy POC on a clean machine with the correct parameters.

Information about the NATVMStaticIP,  NATVMStaticGateway, and ProxyServer parameters can be found in the [deployment documentation](azure-stack-run-powershell-script.md).


## PaaS resource providers

### Failures when deploying the Web Apps RP template via the portal

Line 410 of the template still has a comment that should have been removed. This line should be deleted before deploying the template from the portal. This should be corrected in the next update for the installation files for the Web Apps RP

### Failures when deploying the Web Apps RP template via PowerShell

If you receive a message about secure strings being expected for passwords, when deploying the template with PowerShell, you can use this syntax to pass a secure string:

`-adminPassword (“MyPassword” | ConvertTo-SecureString –AsPlainText –Force)`

There are other ways to do this via PowerShell, like using the Get-Credential cmdlet.

### Configuring the .NET 3.5-enabled image to use when deploying the PaaS RPs

The SQL Server Resource Provider and the Web Apps Resource Providers both require a Windows Server image with .NET 3.5 installed.
By leveraging the steps mentioned just before in this document, you create such an image, and the documentation tells you to replace the default Windows Server 2012 R2 image with this new .NET 3.5-enabled image. Those steps are accurate and, if you follow them, things should be working.

However, you may want to keep one image without .NET 3.5 and one with .NET 3.5. For this, you can [add](azure-stack-add-vm-image.md) your new .NET 3.5-enabled image, and change the “SKU”, “Publisher”, “Offer” fields from the SQL Server RP and Web Apps RP templates, to match your new values.

### Can't delete resource groups hosting a SQL Server "virtual server"

The SQL Server resource provider includes the notion of a “virtual server”, that you can create/reuse when you create a database. This creates a Contained Database authentication user, and provides tenant-scoped virtual servers that can be used to connect to specific databases on the underlying SQL Server hosting servers.

When creating a database, you can specify credentials (username/password), and those credentials will be used for all the databases on the logical server you create, but you can’t specify existing wellknown logins on the backing hosting server (due to the access scoping that happens with the chosen account).  

In particular, if you use a well-known login on the underlying hosting server (like “sa”), there is a known issue where the hosting resource group cannot be deleted afterwards. 

### SQL Server or MySQL Server gallery package fails to publish

If publishing fails for a SQL Server or MySQL Server gallery package with multiple subscriptions fails, change the script to explicitly select the **Default Provider Subscription**.


### "Signature verification failed on downloaded file" error during Web Apps resource provider deployment

Workaround: Clear any previous cache (C:/Users/<your username>/AppData/Local/Temp/Websites/WebsitesSetup/) you may have and try the download again.


## Portal

### Error when creating a storage account

When creating a storage account in the portal, you must select a subscription first (before entering a name).

## PowerShell

### When creating a storage account in PowerShell, I get an error about the “specific argument was out of the range of valid values”

Please ensure you use minimal caps for the storage account. This behavior is consistent with Microsoft Azure (public cloud).

## Templates

### The SQL Server VM templates are failing to deploy SQL Server

SQL Server requires .NET Framework 3.5, and the image used in the template must contain that component. The default image provided with TP1 does not include the .NET Framework 3.5.

To create a new image with this component, see [Add an VM Image in Azure Stack](azure-stack-add-vm-image.md).

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

As the system comes back up the Azure Consistent Storage subsystem and RPs need to determine consistency. The time needed depends on the hardware and specs being used, but it may sometimes take ~45 minutes after a reboot of the host for tenant VMs to come back and be recognized.

Please note this would not happen in a multi system deployment because you would not have a single box running the Azure Consistent Storage layer unless you restarted all nodes at the same time, similar to a full restart of an all up integrated system.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this expected?

Yes, this is expected. It was designed this way because:

- When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
- When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs. Garbage collection runs every 2 days in the TP1 release.

So:

- If you delete a VM and nothing more, VHDs will stay there, and may still be there for weeks or months.
- If you delete the storage account containing those VHDs, they should be deleted the next time garbage collection runs (in a maximum of 2 days, depending when it ran last).

If you see "orphan" VHDs (that have not been touched for more than 2 days), it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there. If the storage account was deleted less than 2 days ago, it's also normal, because garbage collection may not have run yet. If the storage account was deleted more than 2 days ago, those VHDs should not be there, and this should be investigated.

Example flow:

- Day 1: Create a storage account and VM with VHDs in this storage account.
- Day 2: Delete VM – VHDs remain, per design.
- Day 3: Delete storage account (directly or via resource group) – which should be allowed since there is no VM still “attached” to the disks in the storage account.
- Day 3 + 2 (maximum, depending on last garbage collector run): VHDs should be deleted.

The garbage collector lets the Storage service administrator "undelete" a storage account and get all the data back (see the Azure Consistent Storage/Storage Resource Provider document).

   
### Performance issues while deploying or deleting tenant virtual machines

If you see performance issues while deploying or deleting tenant virtual machines, try this workaround:

1. Restart the WinRM service on the Hyper-V Host 2.

2. If that doesn’t work, restart the CRP service on the xRPVM.

3. If that doesn’t work, restart the xRPVM.


## Next steps

[Frequently asked questions](azure-stack-FAQ.md)
