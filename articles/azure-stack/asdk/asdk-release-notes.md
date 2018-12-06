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
ms.date: 12/03/2018 
ms.author: sethm
ms.reviewer: misainat

---

# ASDK release notes  
This article provides information about improvements, fixes, and known issues in Azure Stack Development Kit (ASDK). If you're not sure which version you're running, you can [use the portal to check](../azure-stack-updates.md#determine-the-current-version).

> Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 1.1811.x.xx

### New features

This build includes the following improvements and fixes for Azure Stack:  

- There is a set of new minimum and recommended hardware and software requirements for the ASDK. These new recommended specs are documented in [Azure Stack deployment planning considerations](asdk-deploy-considerations.md). As the Azure Stack platform has evolved, more services are now available and more resources may be required. The increased specs reflect these revised recommendations.

### Fixed issues


### Known issues

#### Portal  

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

<!-- 3164607 – IS, ASDK -->
- Reattaching a detached disk to the same virtual machine (VM) with the same name and LUN fails with an error such as **Cannot attach data disk 'datadisk' to VM 'vm1'**. The error occurs because the disk is currently being detached or the last detach operation failed. Please wait until the disk is completely detached and then try again or delete/detach the disk explicitly again. The workaround is to reattach it with a different name, or on a different LUN. 

<!-- 3235634 – IS, ASDK -->
- To deploy VMs with sizes containing a **v2** suffix; for example, **Standard_A2_v2**, please specify the suffix as **Standard_A2_v2** (lowercase v). Do not use **Standard_A2_V2** (uppercase V). This works in global Azure and is an inconsistency on Azure Stack.

<!-- 3099544 – IS, ASDK --> 
- When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

<!-- 2869209 – IS, ASDK --> 
- When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

<!--  2966665 – IS, ASDK --> 
- Attaching SSD data disks to premium size managed disk virtual machines  (DS, DSv2, Fs, Fs_V2) fails with an error:  *Failed to update disks for the virtual machine ‘vmname’ Error: Requested operation cannot be performed because storage account type ‘Premium_LRS’ is not supported for VM size ‘Standard_DS/Ds_V2/FS/Fs_v2)*

   To work around this issue, use *Standard_LRS* data disks instead of *Premium_LRS disks*. Use of *Standard_LRS* data disks doesn't change IOPs or the billing cost.  

<!--  2795678 – IS, ASDK --> 
- When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

<!-- 2967447 - IS, ASDK --> 
- The virtual machine scale set (VMSS) create experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment, or use an Azure Resource Manager template specifying another CentOS image that has been downloaded prior to deployment from the marketplace by the operator.

<!-- TBD -  IS ASDK --> 
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

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

## Build 1.1809.0.90

### New features
This build includes the following improvements and fixes for Azure Stack.  

<!--  2712869   | IS  ASDK -->  
- **Azure Stack syslog client (General Availability)**  This client allows the forwarding of audits, alerts, and security logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports specifying the port on which the syslog server is listening.

With this release, the syslog client is generally available, and it can be used in production environments.

For more information, see [Azure Stack syslog forwarding](../azure-stack-integrate-security.md).

### Fixed issues

<!-- TBD - IS ASDK -->
- On the portal, the memory chart reporting free/used capacity is now accurate. You can now more reliably predict how many VMs you are able to create.

<!-- TBD - IS ASDK --> 
- Fixed an issue in which you created virtual machines on the Azure Stack user portal, and the portal displayed an incorrect number of data disks that can attach to a DS series VM. DS series VMs can accommodate as many data disks as the Azure configuration.

- <!-- 2702741 -  IS, ASDK --> Fixed issue in which public IPs that were deployed by using the Dynamic allocation method were not guaranteed to be preserved after a Stop-Deallocate is issued. They are now preserved.

- <!-- 3078022 - IS, ASDK --> If a VM was stop-deallocated before 1808 it could not be re-allocated after the 1808 update.  This issue is fixed in 1809. Instances that were in this state and could not be started can be started in 1809 with this fix. The fix also prevents this issue from reoccurring.

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack

### Changes

### Known issues

#### Portal  

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

<!-- 3164607 – IS, ASDK -->
- Reattaching a detached disk to the same virtual machine (VM) with the same name and LUN fails with an error such as **Cannot attach data disk 'datadisk' to VM 'vm1'**. The error occurs because the disk is currently being detached or the last detach operation failed. Please wait until the disk is completely detached and then try again or delete/detach the disk explicitly again. The workaround is to reattach it with a different name, or on a different LUN. 

<!-- 3235634 – IS, ASDK -->
- To deploy VMs with sizes containing a **v2** suffix; for example, **Standard_A2_v2**, please specify the suffix as **Standard_A2_v2** (lowercase v). Do not use **Standard_A2_V2** (uppercase V). This works in global Azure and is an inconsistency on Azure Stack.

<!-- 3099544 – IS, ASDK --> 
- When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

<!-- 2869209 – IS, ASDK --> 
- When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

<!--  2966665 – IS, ASDK --> 
- Attaching SSD data disks to premium size managed disk virtual machines  (DS, DSv2, Fs, Fs_V2) fails with an error:  *Failed to update disks for the virtual machine ‘vmname’ Error: Requested operation cannot be performed because storage account type ‘Premium_LRS’ is not supported for VM size ‘Standard_DS/Ds_V2/FS/Fs_v2)*

   To work around this issue, use *Standard_LRS* data disks instead of *Premium_LRS disks*. Use of *Standard_LRS* data disks doesn't change IOPs or the billing cost.  

<!--  2795678 – IS, ASDK --> 
- When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

<!-- 2967447 - IS, ASDK --> 
- The virtual machine scale set (VMSS) create experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment, or use an Azure Resource Manager template specifying another CentOS image that has been downloaded prior to deployment from the marketplace by the operator.

<!-- TBD -  IS ASDK --> 
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

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

## Build 1.1808.0.97

### New features
This build includes the following improvements and fixes for Azure Stack.  

<!-- 1658937 | ASDK, IS --> 
- **Start backups on a pre-defined schedule** - As an appliance, Azure Stack can now automatically trigger infrastructure backups periodically to eliminate human intervention. Azure Stack will also automatically clean up the external share for backups that are older than the defined retention period. For more information, see [Enable Backup for Azure Stack with PowerShell](../azure-stack-backup-enable-backup-powershell.md).

<!-- 2496385 | ASDK, IS -->  
- **Added data transfer time into the total backup time.** For more information, see [Enable Backup for Azure Stack with PowerShell](../azure-stack-backup-enable-backup-powershell.md).

<!-- 1702130 | ASDK, IS --> 
- **Backup external capacity now shows the correct capacity of the external share.** (Previously this was hard-code to 10 GB.) For more information, see [Enable Backup for Azure Stack with PowerShell](../azure-stack-backup-enable-backup-powershell.md).
 
<!-- 2753130 |  IS, ASDK   -->  
- **Azure Resource Manager templates now support the condition element** - You can now deploy a resource in an Azure Resource Manger template using a condition. You can design your template to deploy a resource based on a condition, such as evaluating if a parameter value is present. For information about using a template as a condition, see [Conditionally deploy a resource](https://docs.microsoft.com/azure/architecture/building-blocks/extending-templates/conditional-deploy) and [Variables section of Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-templates-variables) in the Azure documentation. 

   You can also use templates to [deploy resources to more than one subscription or resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-cross-resource-group-deployment).  

<!--2753073 | IS, ASDK -->  
- **The Microsoft.Network API resource version support has been updated** to include support for API version 2017-10-01 from 2015-06-15 for Azure Stack network resources. Support for resource versions between 2017-10-01 and 2015-06-15 is not included in this release. Please refer to [Considerations for Azure Stack networking](../user/azure-stack-network-differences.md) for functionality differences.

<!-- 2272116 | IS, ASDK   -->  
- **Azure Stack has added support for reverse DNS lookups for externally facing Azure Stack infrastructure endpoints** (that is for portal, adminportal, management, and adminmanagement). This allows Azure Stack external endpoint names to be resolved from an IP address.

<!-- 2780899 |  IS, ASDK   --> 
- **Azure Stack now supports adding additional network interfaces to an existing VM.**  This functionality is available by using the portal, PowerShell, and CLI. For more information, see [Add or remove network interfaces](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface-vm) in the Azure documentation. 

<!-- 2222444 | IS, ASDK   -->  
- **Improvements in accuracy and resiliency have been made to networking usage meters**. Network usage meters are now more accurate and take into account suspended subscriptions, outage periods and race conditions.

<!-- 2297790 | IS, ASDK -->  
- **Improvements to the Azure Stack syslog client (preview feature)**. This client allows the forwarding of audit and logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports the TCP protocol with plain text or TLS 1.2 encryption, the latter being the default configuration. You can configure the TLS connection with either server-only or mutual authentication.

  To configure how the syslog client communicates (such as protocol, encryption, and authentication) with the syslog server, use the Set-SyslogServer cmdlet. This cmdlet is available from the privileged endpoint (PEP). 

- <!-- ASDK --> **Gallery items for Virtual Machine Scale Sets are now built-in**.  Virtual Machine Scale Set gallery items are now made available in the user and administrator portals without having to download them. 

- <!-- IS, ASDK --> **Virtual Machine Scale Set scaling**.  You can use the portal to [scale a Virtual Machine Scale Set](../azure-stack-compute-add-scalesets.md#scale-a-virtual-machine-scale-set) (VMSS).   

- <!-- 2489570 | IS ASDK--> **Support for custom IPSec/IKE policy configurations** for [VPN gateways in Azure Stack](/azure/azure-stack/azure-stack-vpn-gateway-about-vpn-gateways).

- <!-- | IS ASDK--> **Kubernetes marketplace item**. You can now deploy Kubernetes clusters using the [Kubernetes Marketplace item](/azure/azure-stack/azure-stack-solution-template-kubernetes-cluster-add). Users can select the Kubernetes item and fill out a few parameters to deploy a Kubernetes cluster to Azure Stack. The purpose of the templates is to make it simple to users to setup dev/test Kubernetes deployments in a few steps.

<!-- ####### | IS, ASDK -->  
- **Azure Resource Manager includes the region name.** With this release, objects retrieved from the Azure Resource Manager will now include the region name attribute. If an existing PowerShell script directly passes the object to another cmdlet, the script may produce an error and fail. This is Azure Resource Manager compliant behavior, and requires the calling client to subtract the region attribute. For more information about the Azure Resource Manager see [Azure Resource Manager Documentation](https://docs.microsoft.com/azure/azure-resource-manager/).

<!-- TBD | IS, ASDK -->  
- **Move subscriptions between Delegated Providers.** You can now move subscriptions between new or existing Delegated Provider subscriptions that belong to the same Directory tenant. Subscriptions belonging to the Default Provider Subscription can also be moved to the Delegated Provider Subscriptions in the same Directory-tenant. For more information see [Delegate offers in Azure Stack](../azure-stack-delegated-provider.md).
 
<!-- 2536808 IS ASDK --> 
- **Improved VM creation time** for VMs that are created with images you download from the Azure marketplace.

### Fixed issues
- <!-- IS ASDK--> We fixed the issue for creating an availability set in the portal which resulted in the set having a fault domain and update domain of 1.

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
- When you set up datacenter integration, you no longer access the AD FS metadata file from a share. For more information, see [Setting up AD FS integration by providing federation metadata file](../azure-stack-integrate-identity.md#setting-up-ad-fs-integration-by-providing-federation-metadata-file). 

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

- <!--  TBD – IS, ASDK --> *Basic A* virtual machine sizes are retired for [creating virtual machine scale sets](../azure-stack-compute-add-scalesets.md) (VMSS) through the portal. To create a VMSS with this size, use PowerShell or a template. 

### Known issues

#### Portal  
- <!-- 2967387 – IS, ASDK --> The account you use to sign in to the Azure Stack admin or user portal displays as **Unidentified user**. This occurs when the account does not have either a *First* or *Last* name specified. To work around this issue, edit the user account to provide either the First or Last name. You must then sign out and then sign back in to the portal. 

-  <!--  2873083 - IS ASDK --> When you use the portal to create a virtual machine scale set (VMSS), the *instance size* dropdown doesn’t load correctly when you use Internet Explorer. To work around this problem, use another browser while using the portal to create a VMSS.  

#### Portal  
<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

<!--2760466 – IS  ASDK --> 
- When you install a new Azure Stack environment that runs this version, the alert that indicates *Activation Required* might not display. [Activation](../azure-stack-registration.md) is required before you can use marketplace syndication. 

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

- <!-- 3099544 – IS, ASDK --> When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

- <!-- 2869209 – IS, ASDK --> When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

- <!--  2966665 – IS, ASDK --> Attaching SSD data disks to premium size managed disk virtual machines  (DS, DSv2, Fs, Fs_V2) fails with an error:  *Failed to update disks for the virtual machine ‘vmname’ Error: Requested operation cannot be performed because storage account type ‘Premium_LRS’ is not supported for VM size ‘Standard_DS/Ds_V2/FS/Fs_v2)*

   To work around this issue, use *Standard_LRS* data disks instead of *Premium_LRS disks*. Use of *Standard_LRS* data disks doesn't change IOPs or the billing cost.  

- <!--  2795678 – IS, ASDK --> When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

- <!-- 2967447 - IS, ASDK --> The virtual machine scale set (VMSS) create experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment or use an ARM template specifying another CentOS image which has been downloaded prior to deployment from the marketplace by the operator.

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

