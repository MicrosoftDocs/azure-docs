---
title: Microsoft Azure Stack Development Kit release notes | Microsoft Docs
description: Improvements, fixes, and known issues for Azure Stack Development Kit.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/02/2018 
ms.author: sethm
ms.reviewer: misainat

---

# Azure Stack Development Kit release notes  
This article provides information about improvements, fixes, and known issues in Azure Stack Development Kit. If you're not sure which version you're running, you can [use the portal to check](.\.\azure-stack-updates.md#determine-the-current-version).

> Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 1.1808.0.97

### New features
This build includes the following improvements and fixes for Azure Stack.  

<!--  2712869   | IS  ASDK -->  
- **Azure Stack syslog client (General Availability)**  This client allows the forwarding of audits, alerts, and security logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports specifying the port on which the syslog server is listening.

With this release, the syslog client is generally available, and it can be used in production environments.

For more information, see [Azure Stack syslog forwarding](../azure-stack-integrate-security.md).

### Fixed issues

<!-- 2702741 - IS ASDK --> 
Fixed issue in which public IPs that were deployed by using the Dynamic allocation method were not guaranteed to be preserved after a Stop-Deallocate is issued. They are now preserved.

<!-- 3078022 - IS ASDK --> 
- If a VM was stop-deallocated before 1808 it could not be re-allocated after the 1808 update.  This issue is fixed in 1809. Instances that were in this state and could not be started can be started in 1809 with this fix. The fix also prevents this issue from reoccurring.

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack


### Changes

<!-- 1697698  | IS, ASDK --> 
- *Quickstart tutorials* in the User portal dashboard now link to relevant articles in the on-line Azure Stack documentation.

<!-- 2515955   | IS ,ASDK--> 
- *All services* replaces *More services* in the Azure Stack admin and user portals. You can now use *All services* as an alternative to navigate in the Azure Stack portals the same way you do in the Azure portals.

<!--  TBD – IS, ASDK --> 
- *Basic A* virtual machine sizes are retired for [creating virtual machine scale sets](../azure-stack-compute-add-scalesets.md) (VMSS) through the portal. To create a VMSS with this size, use PowerShell or a template. 

### Known issues

#### Portal  

<!-- 1697698  | IS, ASDK --> 
- *Quickstart tutorials* in the User portal dashboard now link to relevant articles in the on-line Azure Stack documentation.

<!-- 2515955   | IS ,ASDK--> 
- *All services* replaces *More services* in the Azure Stack admin and user portals. You can now use *All services* as an alternative to navigate in the Azure Stack portals the same way you do in the Azure portals.

<!--  TBD – IS, ASDK --> 
- *Basic A* virtual machine sizes are retired for [creating virtual machine scale sets](../azure-stack-compute-add-scalesets.md) (VMSS) through the portal. To create a VMSS with this size, use PowerShell or a template.

#### Health and monitoring

<!-- 1264761 - IS ASDK -->  
- You might see alerts for the *Health controller* component that have the following details:  

   Alert #1:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Heartbeat Scanner is unavailable. This may affect health reports and metrics.  

  Alert #2:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Fault Scanner is unavailable. This may affect health reports and metrics.

  Both alerts can be safely ignored and will close automatically over time.  

<!-- 2368581 - IS. ASDK --> 
- An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a *Fabric VM creation error*, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.


#### Compute  

<!-- 3099544 – IS, ASDK --> 
- When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

<!-- 3090289 – IS, ASDK --> 
- After applying the 1808 update, you may encounter the following issues when deploying VMs with Managed Disks:

   1. If the subscription was created before the 1808 update, deploying VM with Managed Disks may fail with an internal error message. To resolve the error, follow these steps for each subscription:
      1. In the Tenant portal, go to **Subscriptions** and find the subscription. Click **Resource Providers**, then click **Microsoft.Compute**, and then click **Re-register**.
      2. Under the same subscription, go to **Access Control (IAM)**, and verify that **Azure Stack – Managed Disk** is listed.
   2. If you have configured a multi-tenant environment, deploying VMs in a subscription associated with a guest directory may fail with an internal error message. To resolve the error, follow these steps:
      1. Apply the [1808 Azure Stack Hotfix](https://support.microsoft.com/help/4465859).
      2. Follow the steps in [this article](../azure-stack-enable-multitenancy.md#registering-azure-stack-with-the-guest-directory) to reconfigure each of your guest directories.

<!-- 2869209 – IS, ASDK --> 
- When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

<!--  2966665 – IS, ASDK --> 
- Attaching SSD data disks to premium size managed disk virtual machines  (DS, DSv2, Fs, Fs_V2) fails with an error:  *Failed to update disks for the virtual machine ‘vmname’ Error: Requested operation cannot be performed because storage account type ‘Premium_LRS’ is not supported for VM size ‘Standard_DS/Ds_V2/FS/Fs_v2)*

   To work around this issue, use *Standard_LRS* data disks instead of *Premium_LRS disks*. Use of *Standard_LRS* data disks doesn't change IOPs or the billing cost.  

<!--  2795678 – IS, ASDK --> 
- When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

<!-- 2967447 - IS, ASDK --> 
- The virtual machine scale set (VMSS) create experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment or use an ARM template specifying another CentOS image which has been downloaded prior to deployment from the marketplace by the operator.

<!-- TBD -  IS ASDK --> 
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

<!-- TBD -  IS ASDK --> 
- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach a D series VM. All supported D series VMs can accommodate as many data disks as the Azure configuration.

<!-- TBD -  IS ASDK --> 
- When a VM image fails to be created, a failed item that you cannot delete might be added to the VM images compute blade.

  As a workaround, create a new VM image with a dummy VHD that can be created through Hyper-V (New-VHD -Path C:\dummy.vhd -Fixed -SizeBytes 1 GB). This process should fix the problem that prevents deleting the failed item. Then, 15 minutes after creating the dummy image, you can successfully delete it.

  You can then retry the download of the VM image that previously failed.

<!-- TBD -  IS ASDK --> 
- If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

<!-- 1662991 - IS ASDK --> 
- Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.

<!-- 2724961- IS ASDK --> 
- When you register the **Microsoft.Insight** resource provider in Subscription settings, and create a Windows VM with Guest OS Diagnostic enabled, the CPU Percentage chart in the VM overview page will not be able to show metric data.
 
  To find the CPU Percentage chart for the VM, go to the **Metrics** blade and show all the supported Windows VM guest metrics.

 

#### Networking
<!-- 1766332 - IS, ASDK --> 
- Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

<!-- 1902460 -  IS ASDK --> 
- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

<!-- 16309153 -  IS ASDK --> 
- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

<!-- 2702741 -  IS ASDK --> 
- Public IPs that are deployed by using the Dynamic allocation method are not guaranteed to be preserved after a Stop-Deallocate is issued.

<!-- 2529607 - IS ASDK --> 
- During Azure Stack *Secret Rotation*, there is a period in which Public IP Addresses are unreachable for two to five minutes.

<!-- 2664148 - IS ASDK --> 
- In scenarios where the tenant is accessing their virtual machines by using a S2S VPN tunnel, they might encounter a scenario where connection attempts fail if the on-premise subnet was added to the Local Network Gateway after gateway was already created. 


<!--  #### SQL and MySQL  -->


#### App Service
<!-- 2352906 - IS ASDK --> 
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

<!-- TBD - IS ASDK --> 
- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.  


#### Usage  
<!-- TBD -  IS ASDK --> 
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.

<!-- #### Identity -->




## Build 1.1807.0.76

### New features
This build includes the following improvements and fixes for Azure Stack.  

<!-- 1658937 | ASDK, IS --> 
- **Start backups on a pre-defined schedule** - As an appliance, Azure Stack can now automatically trigger infrastructure backups periodically to eliminate human intervention. Azure Stack will also automatically clean up the external share for backups that are older than the defined retention period. For more information, see [Enable Backup for Azure Stack with PowerShell](.\.\azure-stack-backup-enable-backup-powershell.md).

<!-- 2496385 | ASDK, IS -->  
- **Added data transfer time into the total backup time.** For more information, see [Enable Backup for Azure Stack with PowerShell](.\.\azure-stack-backup-enable-backup-powershell.md).

<!-- 1702130 | ASDK, IS --> 
- **Backup external capacity now shows the correct capacity of the external share.** (Previously this was hard-code to 10 GB.) For more information, see [Enable Backup for Azure Stack with PowerShell](.\.\azure-stack-backup-enable-backup-powershell.md).
 
<!-- 2753130 |  IS, ASDK   -->  
- **Azure Resource Manager templates now support the condition element** - You can now deploy a resource in an Azure Resource Manger template using a condition. You can design your template to deploy a resource based on a condition, such as evaluating if a parameter value is present. For information about using a template as a condition, see [Conditionally deploy a resource](https://docs.microsoft.com/azure/architecture/building-blocks/extending-templates/conditional-deploy) and [Variables section of Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-templates-variables) in the Azure documentation. 

   You can also use templates to [deploy resources to more than one subscription or resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-cross-resource-group-deployment).  

<!--2753073 | IS, ASDK -->  
- **The Microsoft.Network API resource version support has been updated** to include support for API version 2017-10-01 from 2015-06-15 for Azure Stack network resources. Support for resource versions between 2017-10-01 and 2015-06-15 is not included in this release. Please refer to [Considerations for Azure Stack networking](.\.\user\azure-stack-network-differences.md) for functionality differences.

<!-- 2272116 | IS, ASDK   -->  
- **Azure Stack has added support for reverse DNS lookups for externally facing Azure Stack infrastructure endpoints** (that is for portal, adminportal, management, and adminmanagement). This allows Azure Stack external endpoint names to be resolved from an IP address.

<!-- 2780899 |  IS, ASDK   --> 
- **Azure Stack now supports adding additional network interfaces to an existing VM.**  This functionality is available by using the portal, PowerShell, and CLI. For more information, see [Add or remove network interfaces](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface-vm) in the Azure documentation. 

<!-- 2222444 | IS, ASDK   -->  
- **Improvements in accuracy and resiliency have been made to networking usage meters**. Network usage meters are now more accurate and take into account suspended subscriptions, outage periods and race conditions.

<!-- 2297790 | IS, ASDK -->  
- **Improvements to the Azure Stack syslog client (preview feature)**. This client allows the forwarding of audit and logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports the TCP protocol with plain text or TLS 1.2 encryption, the latter being the default configuration. You can configure the TLS connection with either server-only or mutual authentication.

  To configure how the syslog client communicates (such as protocol, encryption, and authentication) with the syslog server, use the Set-SyslogServer cmdlet. This cmdlet is available from the privileged endpoint (PEP). 

  To add the client-side certificate for the syslog client TLS 1.2 mutual authentication, use the Set-SyslogClient cmdlet in the PEP.

  With this preview, you can see a much larger number of audits and alerts. 

  Because this feature is still in preview, you don't rely on it in production environments.

  For more information, see [Azure Stack syslog forwarding](.\.\azure-stack-integrate-security.md).

<!-- ####### | IS, ASDK -->  
- **Azure Resource Manager includes the region name.** With this release, objects retrieved from the Azure Resource Manager will now include the region name attribute. If an existing PowerShell script directly passes the object to another cmdlet, the script may produce an error and fail. This is Azure Resource Manager compliant behavior, and requires the calling client to subtract the region attribute. For more information about the Azure Resource Manager see [Azure Resource Manager Documentation](https://docs.microsoft.com/azure/azure-resource-manager/).

<!-- TBD | IS, ASDK -->  
- **Move subscriptions between Delegated Providers.** You can now move subscriptions between new or existing Delegated Provider subscriptions that belong to the same Directory tenant. Subscriptions belonging to the Default Provider Subscription can also be moved to the Delegated Provider Subscriptions in the same Directory-tenant. For more information see [Delegate offers in Azure Stack](.\.\azure-stack-delegated-provider.md).
 
<!-- 2536808 IS ASDK --> 
- **Improved VM creation time** for VMs that are created with images you download from the Azure marketplace.

### Fixed issues

<!-- TBD | ASDK, IS --> 
- Various improvements were made to the update process to make it more reliable. In addition, fixes have been made to underlying infrastructure, which improves node drain, thereby minimizing potential downtime for workloads during the update.

<!--2292271 | ASDK, IS --> 
- We fixed an issue where a modified Quota limit did not apply to existing subscriptions.  Now, when you raise a Quota limit for a network resource that is part of an Offer and Plan associated with a user subscription, the new limit applies to the pre-existing subscriptions, as well as new subscriptions.

<!-- 2448955 | IS ASDK --> 
- You can now successfully query activity logs for systems that are deployed in a UTC+N time zone.    

<!-- 2319627 |  ASDK, IS --> 
- Pre-check for backup configuration parameters (Path/Username/Password/Encryption Key) no longer sets incorrect settings to the backup configuration. (Previously, incorrect settings were set into the backup and backup would then fail when triggered.)

<!-- 2215948 |  ASDK, IS --> 
- The backup list now refreshes when you manually delete the backup from the external share.

<!-- 2360715 |  ASDK, IS -->  
- When you set up datacenter integration, you no longer access the AD FS metadata file from a share. For more information, see [Setting up AD FS integration by providing federation metadata file](.\.\azure-stack-integrate-identity.md#setting-up-ad-fs-integration-by-providing-federation-metadata-file). 

<!-- 2388980 | ASDK, IS --> 
- We fixed an issue that prevented users from assigned an existing Public IP Address that had been previously assigned to a Network Interface or Load Balancer to a new Network Interface or Load Balancer.  

<!-- 2551834 - IS, ASDK --> 
- When you select *Overview* for a storage account in either the admin or user portals, the *Essentials* pane now displays all the expected information correctly. 

<!-- 2551834 - IS, ASDK --> 
- When you select *Tags* for a storage account in either the admin or user portals, the information now displays correctly.

<!-- TBD - IS ASDK --> 
- This version of Azure Stack fixes the issue that prevented the application of driver updates from OEM Extension packages.

<!-- 2055809- IS ASDK --> 
- We fixed an issue that prevented you from deleting VMs from the compute blade when the VM failed to be created.  

<!--  2643962 IS ASDK -->  
- The alert for *Low memory capacity* no longer appears incorrectly.

<!--  TBD ASDK --> 
- The virtual machine that hosts the privilege endpoint (PEP) has been increased to 4GB. In the ASDK, this virtual machine is named AzS-ERCS01.

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack


<!-- ### Changes  -->
<!--   ### Additional releases timed with this update  -->


### Known issues

#### Portal  
<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

<!--2760466 – IS  ASDK --> 
- When you install a new Azure Stack environment that runs this version, the alert that indicates *Activation Required* might not display. [Activation](.\.\azure-stack-registration.md) is required before you can use marketplace syndication. 

<!-- TBD - IS ASDK --> 
- The two administrative subscription types that were introduced with version 1804 should not be used. The subscription types are **Metering subscription**, and **Consumption subscription**. These subscription types are **Metering subscription**, and **Consumption subscription**. These subscription types are visible in new Azure Stack environments beginning with version 1804 but are not yet ready for use. You should continue to use the **Default Provider subscription** type.

<!-- 2403291 - IS ASDK --> 
- You might not have use of the horizontal scroll bar along the bottom of the admin and user portals. If you can’t access the horizontal scroll bar, use the breadcrumbs to navigate to a previous blade in the portal by selecting the name of the blade you want to view from the breadcrumb list found at the top left of the portal.
  ![Breadcrumb](media/asdk-release-notes/breadcrumb.png)

<!-- TBD -  IS ASDK --> 
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

<!-- TBD -  IS ASDK --> 
- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.

<!--  TBD | ASDK -->  
- The default time zone for your Azure Stack deployment will now get set to UTC. You can select a time zone when installing Azure Stack, however it will automatically revert to UTC as the default during installation.

#### Health and monitoring
<!-- 1264761 - IS ASDK -->  
- You might see alerts for the *Health controller* component that have the following details:  

   Alert #1:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Heartbeat Scanner is unavailable. This may affect health reports and metrics.  

  Alert #2:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Fault Scanner is unavailable. This may affect health reports and metrics.

  Both alerts can be safely ignored and will close automatically over time.  

<!-- 2368581 - IS. ASDK --> 
- An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a *Fabric VM creation error*, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.

<!-- TBD - IS. ASDK --> 
- When running the **Test-AzureStack** cmdlet on the privileged endpoint (PEP), the **Azure Stack Infrastructure Role Instance Performance** test will generate a WARN message for the ERCS VM. You can safely ignore the WARN message and continue to use the ASDK.

#### Compute
<!-- 2494144 - IS, ASDK --> 
- When selecting a virtual machine size for a virtual machine deployment, some F-Series VM sizes are not visible as part of the size selector when you create a VM. The following VM sizes do not appear in the selector: *F8s_v2*, *F16s_v2*, *F32s_v2*, and *F64s_v2*.  
  As a workaround, use one of the following methods to deploy a VM. In each method, you need to specify the VM size you want to use.

  - **Azure Resource Manager template:** When you use a template, set the *vmSize* in the template to equal the VM size you want to use. For example, the following entry is used to deploy a VM that uses the *F32s_v2* size:  

    ```
        "properties": {
        "hardwareProfile": {
                "vmSize": "Standard_F32s_v2"
        },
    ```  
  - **Azure CLI:** You can use the [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create) command and specify the VM size as a parameter, similar to `--size "Standard_F32s_v2"`.

  - **PowerShell:** With PowerShell you can use [New-AzureRMVMConfig](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermvmconfig?view=azurermps-6.0.0) with the parameter that specifies the VM size, similar to `-VMSize "Standard_F32s_v2"`.


<!-- TBD -  IS ASDK --> 
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

<!-- TBD -  IS ASDK --> 
- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach a D series VM. All supported D series VMs can accommodate as many data disks as the Azure configuration.

<!-- TBD -  IS ASDK --> 
- When a VM image fails to be created, a failed item that you cannot delete might be added to the VM images compute blade.

  As a workaround, create a new VM image with a dummy VHD that can be created through Hyper-V (New-VHD -Path C:\dummy.vhd -Fixed -SizeBytes 1 GB). This process should fix the problem that prevents deleting the failed item. Then, 15 minutes after creating the dummy image, you can successfully delete it.

  You can then retry the download of the VM image that previously failed.

<!-- TBD -  IS ASDK --> 
- If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

<!-- 1662991 - IS ASDK --> 
- Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.

<!-- 2724961- IS ASDK --> 
- When you register the **Microsoft.Insight** resource provider in Subscription settings, and create a Windows VM with Guest OS Diagnostic enabled, the VM overview page doesn't show metrics data. 

   To find metrics data, like the CPU Percentage chart for the VM, go to the **Metrics** blade and show all the supported Windows VM guest metrics.

#### Networking
<!-- 1766332 - IS, ASDK --> 
- Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

<!-- 1902460 -  IS ASDK --> 
- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

<!-- 16309153 -  IS ASDK --> 
- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

<!-- 2702741 -  IS ASDK --> 
- Public IPs that are deployed by using the Dynamic allocation method are not guaranteed to be preserved after a Stop-Deallocate is issued.

<!-- 2529607 - IS ASDK --> 
- During Azure Stack *Secret Rotation*, there is a period in which Public IP Addresses are unreachable for two to five minutes.

<!-- 2664148 - IS ASDK --> 
- In scenarios where the tenant is accessing their virtual machines by using a S2S VPN tunnel, they might encounter a scenario where connection attempts fail if the on-premise subnet was added to the Local Network Gateway after gateway was already created. 


#### SQL and MySQL
<!-- TBD - ASDK --> 
- The database hosting servers must be dedicated for use by the resource provider and user workloads. You cannot use an instance that is being used by any other consumer, including App Services.

<!-- IS, ASDK --> 
- Special characters, including spaces and periods, are not supported in the **Family** name when you create a SKU for the SQL and MySQL resource providers.

#### App Service
<!-- 2352906 - IS ASDK --> 
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

<!-- TBD - IS ASDK --> 
- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.  

<!-- TBD - IS ASDK --> 
- App Service can only be deployed into the *Default Provider subscription* at this time.

#### Usage  
<!-- TBD -  IS ASDK --> 
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.

<!-- #### Identity -->






## Build 1.1805.1.47

> [!TIP]  
> Based on customer feedback, there is an update to the version schema in use for Microsoft Azure Stack. Starting with this update, 1805, the new schema better represents the current cloud version.  
>
> The version schema is now *Version.YearYearMonthMonth.MinorVersion.BuildNumber* where the second and third sets indicate the version and release. For example, 1805.1 represents the *release to manufacturing* (RTM) version of 1805.  


### New features
This build includes the following improvements and fixes for Azure Stack.  

<!-- 2297790 - IS, ASDK --> 
- **Azure Stack now includes a *Syslog* client** as a *preview feature*. This client allows the forwarding of audit and security logs related to the Azure Stack infrastructure to a Syslog server or security information and event management (SIEM) software that is external to Azure Stack. Currently, the Syslog client only supports unauthenticated UDP connections over default port 514. The payload of each Syslog message is formatted in Common Event Format (CEF).

  To configure the Syslog client, use  the **Set-SyslogServer** cmdlet on the Privileged Endpoint.

  With this preview, you might see the following three alerts. When presented by Azure Stack, these alerts include *descriptions* and *remediation* guidance.
  - TITLE: Code Integrity Off  
  - TITLE: Code Integrity in Audit Mode
  - TITLE: User Account Created

  While this feature is in preview, it shouldn't be relied upon in production environments.   


### Fixed issues
- We fixed the issue that blocked [opening a new support request from the dropdown](.\.\azure-stack-manage-portals.md#quick-access-to-help-and-support) from within the admin portal. This option now works as intended.

<!--  TBD ASDK --> 
- The virtual machine that hosts the privilege endpoint (PEP) has been increased to 4GB. In the ASDK, this virtual machine is named AzS-ERCS01.

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack


<!-- ### Changes  -->


<!--   ### Additional releases timed with this update  -->


### Known issues

#### Portal
<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

<!-- 2551834 - IS, ASDK --> 
- When you select **Overview** for a storage account in either the admin or user portals, the information from the *Essentials* pane does not display.  The Essentials pane displays information about the account like its *Resource group*, *Location*, and *Subscription ID*.  Other options for Overview  are accessible, like *Services* and *Monitoring*, as well as options to *Open in Explorer* or to *Delete storage account*.  

  To view the unavailable information, use the [Get-azureRMstorageaccount](https://docs.microsoft.com/powershell/module/azurerm.storage/get-azurermstorageaccount?view=azurermps-6.2.0) PowerShell cmdlet.

<!-- 2551834 - IS, ASDK --> 
- When you select **Tags** for a storage account in either the admin or user portals, the information fails to load and does not display.  

  To view the unavailable information, use the [Get-AzureRmTag](https://docs.microsoft.com/powershell/module/azurerm.tags/get-azurermtag?view=azurermps-6.2.0) PowerShell cmdlet.

<!-- TBD - IS ASDK --> 
- Do not use the new administrative subscription types of *Metering subscription*, and *Consumption subscription*. These new subscription types were introduced with version 1804 but are not yet ready for use. You should continue to use the *Default Provider* subscription type.
  
<!-- TBD - IS ASDK --> 
- You cannot apply driver updates by using an OEM Extension package with this version of Azure Stack.  There is no workaround for this problem.
 
<!-- TBD - IS ASDK --> 
- The ability [to open a new support request from the dropdown](.\.\azure-stack-manage-portals.md#quick-access-to-help-and-support) from within the administrator portal isn’t available. Instead, use the following link:     
    - For Azure Stack Development Kit, use https://aka.ms/azurestackforum.    

<!-- 2403291 - IS ASDK --> 
- You might not have use of the horizontal scroll bar along the bottom of the admin and user portals. If you can’t access the horizontal scroll bar, use the breadcrumbs to navigate to a previous blade in the portal by selecting the name of the blade you want to view from the breadcrumb list found at the top left of the portal.
  ![Breadcrumb](media/asdk-release-notes/breadcrumb.png)

<!-- TBD -  IS ASDK --> 
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

<!-- TBD -  IS ASDK --> 
- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.


#### Health and monitoring
<!-- 1264761 - IS ASDK -->  
- You might see alerts for the *Health controller* component that have the following details:  

   Alert #1:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Heartbeat Scanner is unavailable. This may affect health reports and metrics.  

  Alert #2:
   - NAME:  Infrastructure role unhealthy
   - SEVERITY: Warning
   - COMPONENT: Health controller
   - DESCRIPTION: The health controller Fault Scanner is unavailable. This may affect health reports and metrics.

    Both alerts #1 and #2 can be safely ignored and they'll close automatically over time. 

  You might also see the following alert for *Capacity*. For this alert, the percentage of available memory identified in the description can vary:  

  Alert #3:
   - NAME:  Low memory capacity
   - SEVERITY: Critical
   - COMPONENT: Capacity
   - DESCRIPTION: The region has consumed more than 80.00% of available memory. Creating virtual machines with large amounts of memory may fail.  

  In this version of Azure Stack, this alert can fire incorrectly. If tenant virtual machines continue to deploy successfully, you can safely ignore this alert. 
  
  Alert #3 won't automatically close. If you close this alert Azure Stack will create the same alert within 15 minutes.  

<!-- 2368581 - IS. ASDK --> 
- An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a *Fabric VM creation error*, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.

<!-- TBD - IS. ASDK --> 
- When running the Test-AzureStack cmdlet on the privilege endpoint (PEP), will generate a WARN message for the ERCS VM. You can continue to use the ASDK. 


#### Compute
<!-- TBD - IS, ASDK --> 
- When selecting a virtual machine size for a virtual machine deployment, some F-Series VM sizes are not visible as part of the size selector when you create a VM. The following VM sizes do not appear in the selector: *F8s_v2*, *F16s_v2*, *F32s_v2*, and *F64s_v2*.  
  As a workaround, use one of the following methods to deploy a VM. In each method, you need to specify the VM size you want to use.

  - **Azure Resource Manager template:** When you use a template, set the *vmSize* in the template to equal the VM size you want to use. For example, the following entry is used to deploy a VM that uses the *F32s_v2* size:  

    ```
        "properties": {
        "hardwareProfile": {
                "vmSize": "Standard_F32s_v2"
        },
    ```  
  - **Azure CLI:** You can use the [az vm create](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create) command and specify the VM size as a parameter, similar to `--size "Standard_F32s_v2"`.

  - **PowerShell:** With PowerShell you can use [New-AzureRMVMConfig](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermvmconfig?view=azurermps-6.0.0) with the parameter that specifies the VM size, similar to `-VMSize "Standard_F32s_v2"`.


<!-- TBD -  IS ASDK --> 
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

<!-- TBD -  IS ASDK --> 
- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach a D series VM. All supported D series VMs can accommodate as many data disks as the Azure configuration.

<!-- TBD -  IS ASDK --> 
- When a VM image fails to be created, a failed item that you cannot delete might be added to the VM images compute blade.

  As a workaround, create a new VM image with a dummy VHD that can be created through Hyper-V (New-VHD -Path C:\dummy.vhd -Fixed -SizeBytes 1 GB). This process should fix the problem that prevents deleting the failed item. Then, 15 minutes after creating the dummy image, you can successfully delete it.

  You can then retry the download of the VM image that previously failed.

<!-- TBD -  IS ASDK --> 
- If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

<!-- 1662991 - IS ASDK --> 
- Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.

#### Networking
<!-- TBD - IS ASDK --> 
- You cannot create user-defined routes in either the admin or user portal. As a workaround, use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-network/tutorial-create-route-table-powershell).

<!-- 1766332 - IS, ASDK --> 
- Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

<!-- 2388980 -  IS ASDK --> 
- After a VM is created and associated with a public IP address, you can't disassociate that VM from that IP address. Disassociation appears to work, but the previously assigned public IP address remains associated with the original VM.

  Currently, you must use only new public IP addresses for new VMs you create.

  This behavior occurs even if you reassign the IP address to a new VM (commonly referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the original VM, and not to the new one.

<!-- 2292271 - IS ASDK --> 
- If you raise a Quota limit for a Network resource that is part of an Offer and Plan that is associated with a tenant subscription, the new limit is not applied to that subscription. However, the new limit does apply to new subscriptions that are created after the quota is increased.

  To work around this problem, use an Add-On plan to increase a Network Quota when the plan is already associated with a subscription. For more information, see how to [make an add-on plan available](.\.\azure-stack-subscribe-plan-provision-vm.md#to-make-an-add-on-plan-available).

<!-- 2304134 IS ASDK --> 
- You cannot delete a subscription that has DNS Zone resources or Route Table resources associated with it. To successfully delete the subscription, you must first delete DNS Zone and Route Table resources from the tenant subscription.

<!-- 1902460 -  IS ASDK --> 
- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

<!-- 16309153 -  IS ASDK --> 
- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

<!-- TBD -  IS ASDK --> 
- Azure Stack does not support adding additional network interfaces to a VM instance after the VM is deployed. If the VM requires more than one network interface, they must be defined at deployment time.


#### SQL and MySQL
<!-- TBD - ASDK --> 
- The database hosting servers must be dedicated for use by the resource provider and user workloads. You cannot use an instance that is being used by any other consumer, including App Services.

<!-- IS, ASDK --> 
- Special characters, including spaces and periods, are not supported in the **Family** name when you create a SKU for the SQL and MySQL resource providers.

#### App Service
<!-- 2352906 - IS ASDK --> 
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

<!-- TBD - IS ASDK --> 
- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.  

<!-- TBD - IS ASDK --> 
- App Service can only be deployed into the *Default Provider subscription* at this time. <!-- In a future update, App Service will deploy into the new *Metering subscription* that was introduced in Azure Stack 1804. When Metering is supported for use, all existing deployments will be migrated to this new subscription type. -->

#### Usage  
<!-- TBD -  IS ASDK --> 
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.

<!-- #### Identity -->

