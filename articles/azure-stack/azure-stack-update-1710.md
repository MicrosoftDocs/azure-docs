---
title: Azure Stack 1710 Update (Build 20171020.1) | Microsoft Docs
description: Learn about what's in the 1710 update for Azure Stack integrated systems, the known issues, and where to download the update.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: 135314fd-7add-4c8c-b02a-b03de93ee196
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: brenduns
ms.reviewer: justini

---

# Azure Stack 1710 Update (Build 20171020.1)

*Applies to: Azure Stack integrated systems*

This article describes the improvements and fixes in this update package, known issues for this release, and where to download the update. Known issues are divided into known issues directly related to the update process, and known issues with the build (post-installation).

> [!IMPORTANT]
> This update package is only for Azure Stack integrated systems. Do not apply this update package to Azure Stack Development Kit.

## Improvements and fixes

This update includes the following quality improvements and fixes for Azure Stack.
 
### Windows Server 2016 improvements and fixes

- Updates for Windows Server 2016: October 10, 2017—KB4041691 (OS Build 14393.1770. See [https://support.microsoft.com/help/4041691](https://support.microsoft.com/help/4041691) for more information.

### Additional quality improvements and fixes

- Added privileged endpoint PowerShell cmdlets to help troubleshoot and update the Network Time Protocol (NTP) server.
- Added support for updating the privileged endpoint Just Enough Administration (JEA) endpoint modules and cmdlet whitelist. 
- Fixed local language errors in the privileged endpoint.
- Added the ability to rotate gateway credentials.
- Removed the CBLocalAdmin local administrator account. 
- Fixed the heartbeat alert template content to make sure heartbeat alerts work correctly after an update.
- Fixed the Fabric resource provider to deal with timeouts during FRU operations. 
- Added the ability for cloud developers to use Azure Resource Manager API Profiles on Azure Stack.
- Disabled the Windows Update service on the deployment virtual machine (DVM). 
- Removed the node power on/off actions from the user interface.
- Various other performance and stability fixes. 
 
## Known issues with the update process

This section contains known issues that you may encounter during the installation of the 1710 update.

> [!IMPORTANT]
> If the update fails, when you later try to resume the update you must use the `Resume-AzureStackUpdate` cmdlet from the privileged endpoint. Do not resume the update by using the administrator portal. (This is a known issue in this release.) For more information, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).

| Symptom  | Cause  | Resolution |
|---------|---------|---------|
|When you perform an update, an error similar to the following<br>may occur during the "Storage Hosts Restart Storage Node" step<br> of the update action plan.<br><br>**{"name":"Restart Storage Hosts","description":"Restart<br> Storage Hosts.","errorMessage":"Type 'Restart' of Role<br> 'BareMetal' raised an exception:\n\n The computer<br> HostName-05 is skipped. Fail to retrieve its LastBootUpTime<br> via the WMI service with the following error message:<br> The RPC server is unavailable.<br> (Exception from HRESULT: 0x800706BA).\nat Restart-Host** | This issue is caused by a potential faulty driver present in some configurations. | 1. Sign in to the baseboard management controller (BMC) web interface and restart the host that's identified in the error message.<br><br>2. Resume the update by using the privileged endpoint. |
| When you perform an update, the update process appears to stall<br> and not make progress after step "Step: Running step 2.4 - Install<br> update" of the update action plan.<br><br>This step is then followed by a series of copy processes of .nupkg<br> files to the internal infrastructure file shares. For example:<br><br>**Copying 1 files from content\PerfCollector\VirtualMachines to <br> \VirtualMachineName-ERCS03\C$\TraceCollectorUpdate\ <br>PerfCounterConfiguration**<br><br>Or, you see the message:<br><br>**WarningMessage:Task: Invocation of interface 'LiveUpdate'<br> of role 'Cloud\Fabric\VirtualMachines' failed:<br> Type 'LiveUpdate' of Role 'VirtualMachines' raised an<br> exception: There is not enough space on the disk.**  | The issue is caused by log files filling up the disks on an infrastructure virtual machine and an issue in Windows Server Scale-Out File Server (SOFS) that will be delivered in a subsequent update. | Please contact Microsoft Customer Service and Support (CSS) for assistance. | 
| When you perform an update, an error similar to the following<br> may occur during the step "Step: Running step 2.13.2 - Update<br> *VM_Name*" of the update action plan. (The virtual machine<br> name may vary.)<br><br>**ActionPlanInstanceWarning ece/MachineName:<br> WarningMessage:Task: Invocation of interface 'LiveUpdate' of<br> role 'Cloud\Fabric\WAS'failed: Type 'LiveUpdate' of Role<br> 'WAS' raised an exception: ERROR during storage<br> initialization: An error occurred while trying to make an API<br> call to Microsoft Storage service: {"Message": "A timeout<br> occurred while communicating with Service Fabric.<br> Exception Type: TimeoutException.<br> Exception message: Operation timed out."}**  | The issue is caused by an I/O timeout in Windows Server that will be fixed in a subsequent update. | Please contact Microsoft CSS for assistance.
| When you perform an update, an error similar to the following<br> may occur during step "Step 21 Restart SQL server VMs."<br><br>**Type 'LiveUpdateRestart' of Role 'VirtualMachines' raised an<br> exception: VerboseMessage:[VirtualMachines:LiveUpdateRestart]<br> Querying for VM MachineName-Sql01. - 10/13/2017 5:11:50 PM VerboseMessage:[VirtualMachines:LiveUpdateRestart]<br> VM is marked as HighlyAvailable. - 10/13/2017 5:11:50 PM<br> VerboseMessage:[VirtualMachines:LiveUpdateRestart] at<br>MS.Internal.ServerClusters.ExceptionHelp.Build at<br>MS.Internal.ServerClusters.ClusterResource.BeginTakeOffline<br>(Boolean force) at Microsoft.FailoverClusters.PowerShell.<br>StopClusterResourceCommand.BeginTimedOperation() at <br>Microsoft.FailoverClusters.PowerShell.TimedCmdlet.Wrapped<br>ProcessRecord() at  Microsoft.FailoverClusters.PowerShell.<br>FCCmdlet.ProcessRecord() - 10/13/2017 5:11:50 PM Warning<br>Message: Task: Invocation of interface 'LiveUpdateRestart' of<br> role 'Cloud\Fabric\VirtualMachines' failed:** | This issue can occur if the virtual machine was unable to restart. | Please contact Microsoft CSS for assistance.
| When you perform an update, an error similar to the following may occur:<br><br>**2017-10-22T01:37:37.5369944Z Type 'Shutdown' of Role 'SQL'<br> raised an exception: An error occurred pausing node<br> 's45r1004-Sql01'.at Stop-SQL, C:\ProgramData\SF\ErcsClusterNode2 <br>\Fabric\work\Applications\ EnterpriseCloud <br>EngineApplicationType&#95;App1\ <br>EnterpriseCloudEngineServicePkg.Code.1.0.597.18\ <br> CloudDeployment\Roles\SQL\SQL.psm1:line 542 at<br> Shutdown,C:\ProgramData\SF\ErcsClusterNode2\Fabric\work\ <br>Applications \EnterpriseCloudEngineApplicationType&#95;App1\ <br>EnterpriseCloudEngineServicePkg.Code.1.0.597.18\Cloud<br>Deployment\Classes\SQL\SQL.psm1: line 50 at <ScriptBlock&#62;,<br> <No file>: line 18 at <ScriptBlock&#62;, <No file&#62;: line 16** | This issue can occur if the virtual machine can't be put into a suspended state to drain the roles. | Please contact Microsoft CSS for assistance.
| When you perform an update, either of the following errors may occur:<br><br>**Type 'Validate' of Role 'ADFS' raised an exception: Validation<br> for ADFS/Graph role failed with error: Error checking ADFS<br> probe endpoint *endpoint_URI*: Exception calling<br> "GetResponse" with "0" argument(s): "The remote server<br> returned an error: (503) Server Unavailable." at Invoke-<br>ADFSGraphValidation**<br><br>**Type 'Validate' of Role 'ADFS' raised an exception: Validation<br> for ADFS/Graph role failed with error: Error fetching<br> ADFS properties: Could not connect to <br>net.tcp://localhost:1500/policy. The connection attempt lasted<br> for a time span of 00:00:02.0498923. TCP error code<br> 10061: No connection could be made because the target<br> machine actively refused it 127.0.0.1:1500.<br> at Invoke-ADFSGraphValidation** | The update action plan can't validate Active Directory Federation Services (AD FS) health. | Please contact Microsoft CSS for assistance.

## Known issues (post-installation)

This section contains post-installation known issues with build 20171020.1.

### Portal

- It may not be possible to view compute or storage resources in the administrator portal. This indicates that an error occurred during the installation of the update and that the update was incorrectly reported as successful. If this issue occurs, please contact Microsoft CSS for assistance.
- You may see a blank dashboard in the portal. To recover the dashboard, select the gear icon in the upper right corner of the portal, and then select **Restore default settings**.
- When you view the properties of a resource group, the **Move** button is disabled. This behavior is expected. Moving resource groups between subscriptions is not currently supported.
- For any workflow where you select a subscription, resource group, or location in a drop-down list, you may experience one or more of the following issues:

   - You may see a blank row at the top of the list. You should still be able to select an item as expected.
   - If the list of items in the drop-down list is short, you may not be able to view any of the item names.
   - If you have multiple user subscriptions, the resource group drop-down list may be empty. 

   To work around the last two issues, you can type the name of the subscription or resource group (if you know it), or you can use PowerShell instead.
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.
- You are not able to view permissions to your subscription using the Azure Stack portals. As a workaround, you can verify permissions by using PowerShell.
- The **Service Health** blade fails to load. When you open the Service Health blade in either the admin or user portal, Azure Stack displays an error and does not load information. This is expected behavior. Although you can select and open Service Health, this feature is not yet available but will be implemented in a future version of Azure Stack.
 

### Backup

- Do not enable infrastructure backup on the **Infrastructure backup** blade.

### Health and monitoring

- If you reboot an infrastructure role instance, you may receive a message indicating that the reboot failed. However, the reboot actually succeeded.

### Marketplace
- When you try to add items to the Azure Stack marketplace by using the **Add from Azure** option, not all items may be visible for download.
- Users can browse the full marketplace without a subscription, and can see administrative items like plans and offers. These items are non-functional to users.

### Compute
- Users are given the option to create a virtual machine with geo-redundant storage. This configuration causes virtual machine creation to fail.
- You can configure a virtual machine availability set only with a fault domain of one, and an update domain of one.
- There is no marketplace experience to create virtual machine scale sets. You can create a scale set by using a template.
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.
 
### Networking
- You can't create a load balancer with a public IP address by using the portal. As a workaround, you can use PowerShell to create the load balancer.
- You must create a network address translation (NAT) rule when you create a network load balancer. If you don't, you'll receive an error when you try to add a NAT rule after the load balancer is created.
- You can't disassociate a public IP address from a virtual machine (VM) after the VM has been created and associated with that IP address. Disassociation will appear to work, but the previously assigned public IP address remains associated with the original VM. This behavior occurs even if you reassign the IP address to a new VM (commonly referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the originally associated VM, and not to the new one. Currently, you must only use new public IP addresses for new VM creation.
 
### SQL/MySQL
- It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
- Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in a mismatched state.
 
### App Service
- A user must register the storage resource provider before they create their first Azure Function in the subscription.
 
### Field replaceable unit (FRU) procedures

- During the update run, offline images are not patched. If you need to replace a scale unit node, work with your OEM hardware vendor to make sure the replaced node has the latest patch level.

## Download the update

You can download the 1710 update package [here](https://aka.ms/azurestackupdatedownload).

## Next steps

- For an overview of update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).
- For information about how to apply updates, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).
