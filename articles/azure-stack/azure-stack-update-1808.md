---
title: Azure Stack 1808 Update | Microsoft Docs
description: Learn about what's new in the 1808 update for Azure Stack integrated systems, including the known issues and where to download the update.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/12/2018
ms.author: sethm
ms.reviewer: justini

---

# Azure Stack 1808 update

*Applies to: Azure Stack integrated systems*

This article describes the contents of the 1808 update package. The update package includes improvements, fixes, and known issues for this version of Azure Stack. This article also includes a link so you can download the update. Known issues are divided into issues directly related to the update process and issues with the build (post-installation).

> [!IMPORTANT]  
> This update package is only for Azure Stack integrated systems. Do not apply this update package to the Azure Stack Development Kit.

## Build reference

The Azure Stack 1808 update build number is **1.1808.0.97**.  

### New features

This update includes the following improvements for Azure Stack.

<!--  2682594   | IS  --> 
- **All Azure Stack environments now use the Coordinated Universal Time (UTC) time zone format.**  All log data and related information now display in UTC format. If you update from a previous version that was not installed using UTC, your environment is updated to use UTC. 

<!-- 2437250  | IS  ASDK --> 
- **Managed Disks are supported.** You can now use Managed Disks in Azure Stack virtual machines and virtual machine scale sets. For more information, see [Azure Stack Managed Disks: Differences and considerations](/azure/azure-stack/user/azure-stack-managed-disk-considerations).

<!-- 2563799  | IS  ASDK --> 
- **Azure Monitor**. Like Azure Monitor on Azure, Azure Monitor on Azure Stack provides base-level infrastructure metrics and logs for most services. For more information, see [Azure Monitor on Azure Stack](/azure/azure-stack/user/azure-stack-metrics-azure-data).

<!-- 2487932| IS --> 
- **Prepare for the extension host**. You can use the extension host to help secure Azure Stack by reducing the number of required TCP/IP ports. With the 1808 update, you can prepare, get your Azure Stack ready for extension host. For more information, see [Prepare for extension host for Azure Stack](/azure/azure-stack/azure-stack-extension-host-prepare).

<!-- IS --> 
- **Gallery items for Virtual Machine Scale Sets are now built in**. The Virtual Machine Scale Set gallery item is now made available in the user and administrator portals without having to download it.  If you upgrade to 1808 it is available upon completion of upgrade.  

<!-- IS, ASDK --> 
- **Virtual Machine Scale Set scaling**. You can use the portal to [scale a Virtual Machine Scale Set](azure-stack-compute-add-scalesets.md#scale-a-virtual-machine-scale-set) (VMSS).    

<!-- 2489570 | IS ASDK--> 
- **Support for custom IPSec/IKE policy configurations** for [VPN gateways in Azure Stack](/azure/azure-stack/azure-stack-vpn-gateway-about-vpn-gateways).

<!-- | IS ASDK--> 
- **Kubernetes marketplace item**. You can now deploy Kubernetes clusters using the [Kubernetes Marketplace item](azure-stack-solution-template-kubernetes-cluster-add.md). Users can select the Kubernetes item and fill out a few parameters to deploy a Kubernetes cluster to Azure Stack. The purpose of the templates is to make it simple to users to set up dev/test Kubernetes deployments in a few steps.

<!-- | IS ASDK--> 
- **Blockchain templates**. You can now execute [Ethereum consortium deployments](azure-stack-ethereum.md) on Azure Stack. You can find three new templates in the [Azure Stack Quick Start Templates](https://github.com/Azure/AzureStack-QuickStart-Templates). They allow the user to deploy and configure a multi-member consortium Ethereum network with minimal Azure and Ethereum knowledge. The purpose of the templates is to make it simple to users to set up dev/test Blockchain deployments in a few steps.

<!-- | IS ASDK--> 
- **The API version profile 2017-03-09-profile has been updated to 2018-03-01-hybrid**. API profiles specify the Azure resource provider and the API version for Azure REST endpoints. For more information about profiles, see [Manage API version profiles in Azure Stack](/azure/azure-stack/user/azure-stack-version-profiles).

 ### Fixed issues
<!-- IS ASDK--> 
- We fixed the issue for creating an availability set in the portal which resulted in the set having a fault domain and update domain of 1. 

<!-- IS ASDK --> 
- Settings to scale virtual machine scale sets are now available in the portal.  

<!-- 2494144- IS, ASDK --> 
- The issue that prevented some F-series virtual machine sizes from appearing when selecting a VM size for deployment is now resolved. 

<!-- IS, ASDK --> 
- Improvements for performance when creating virtual machines, and more optimized use of underlying storage.

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack.


### Changes
<!-- 1697698  | IS, ASDK --> 
- *Quickstart tutorials* in the User portal dashboard now link to relevant articles in the on-line Azure Stack documentation.

<!-- 2515955   | IS ,ASDK--> 
- *All services* replaces *More services* in the Azure Stack admin and user portals. You can now use *All services* as an alternative to navigate in the Azure Stack portals the same way you do in the Azure portals.

<!-- TBD | IS, ASDK --> 
- *+ Create a resource* replaces *+ New* in the Azure Stack admin and user portals.  You can now use *+ Create a resource* as an alternative to navigate in the Azure Stack portals the same way you do in the Azure portals.  

<!--  TBD – IS, ASDK --> 
- *Basic A* virtual machine sizes are retired for [creating virtual machine scale sets](azure-stack-compute-add-scalesets.md) (VMSS) through the portal. To create a VMSS with this size, use PowerShell or a template.  

### Common Vulnerabilities and Exposures

This update installs the following updates:  

- [CVE-2018-0952](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-0952)
- [CVE-2018-8200](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8200)
- [CVE-2018-8204](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8204)
- [CVE-2018-8253](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8253)
- [CVE-2018-8339](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8339)
- [CVE-2018-8340](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8340)
- [CVE-2018-8341](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8341)
- [CVE-2018-8343](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8343)
- [CVE-2018-8344](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8344)
- [CVE-2018-8345](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8345)
- [CVE-2018-8347](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8347)
- [CVE-2018-8348](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8348)
- [CVE-2018-8349](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8349)
- [CVE-2018-8394](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8394)
- [CVE-2018-8398](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8398)
- [CVE-2018-8401](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8401)
- [CVE-2018-8404](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8404)
- [CVE-2018-8405](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8405)
- [CVE-2018-8406](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8406)  

For more information about these vulnerabilities, click on the preceding links, or see Microsoft Knowledge Base article [4343887](https://support.microsoft.com/help/4343887).

This update also contains the mitigation for the speculative execution side channel vulnerability known as L1 Terminal Fault (L1TF), described in the [Microsoft Security Advisory ADV180018](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180018).  

### Prerequisites

- Install the Azure Stack [1807 Update](azure-stack-update-1807.md) before you apply the Azure Stack 1808 update. 

- Install the latest available [update or hotfix for version 1807](azure-stack-update-1807.md#post-update-steps).  
  > [!TIP]  
  > Subscribe to the following *RRS* or *Atom* feeds to keep up with Azure Stack Hotfixes:
  > - RRS: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss … 
  > - Atom: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom …


- Before you start installation of this update, run [Test-AzureStack](azure-stack-diagnostic-test.md) with the following parameters to validate the status of your Azure Stack and resolve any operational issues found, including all warnings and failures. Also review active alerts, and resolve any that require action.  

  ```PowerShell
  Test-AzureStack -Include AzsControlPlane, AzsDefenderSummary, AzsHostingInfraSummary, AzsHostingInfraUtilization, AzsInfraCapacity, AzsInfraRoleSummary, AzsPortalAPISummary, AzsSFRoleSummary, AzsStampBMCSummary
  ```   

### Known issues with the update process

- When you run [Test-AzureStack](azure-stack-diagnostic-test.md) after the 1808 update, a warning message from the Baseboard Management Controller (BMC) is displayed. You can safely ignore this warning.

<!-- 2468613 - IS --> 
- During installation of this update, you might see alerts with the title *Error – Template for FaultType UserAccounts.New is missing.*  You can safely ignore these alerts. These alerts will close automatically after installation of this update completes.

<!-- 2489559 - IS --> 
- Do not attempt to create virtual machines during the installation of this update. For more information about managing updates, see [Manage updates in Azure Stack overview](azure-stack-updates.md#plan-for-updates).

<!-- 2830461 - IS --> 
- In certain circumstances when an update requires attention, the corresponding alert may not be generated. The accurate status will still be reflected in the portal and is not impacted.

### Post-update steps
After the installation of this update, install any applicable Hotfixes. For more information view the following knowledge base articles, as well as our [Servicing Policy](azure-stack-servicing-policy.md). 
- [KB 4467062 – Azure Stack Hotfix Azure Stack Hotfix 1.1808.4.108](https://support.microsoft.com/help/4467062/)


## Known issues (post-installation)

The following are post-installation known issues for this build version.

### Portal

- The Azure Stack technical documentation focuses on the latest release of Azure Stack. Due to portal changes between releases, what you see when using the Azure Stack portals might vary from what you see in the documentation. 

<!-- TBD - IS ASDK --> 
- You might see a blank dashboard in the portal. To recover the dashboard, click **Edit Dashboard**, then right-click and select **Reset to default state**.

<!-- 2930718 - IS ASDK --> 
- In the administrator portal, when accessing the details of any user subscription, after closing the blade and clicking on **Recent**, the user subscription name does not appear.

<!-- 3060156 - IS ASDK --> 
- In both the administrator and user portals, clicking on the portal settings and selecting **Delete all settings and private dashboards** does not work as expected. An error notification is displayed. 

<!-- 2930799 - IS ASDK --> 
- In both the administrator and user portals, under **All services**, the asset **DDoS protection plans** is incorrectly listed. It is not actually available in Azure Stack. If you try to create it, an error is displayed stating that the portal could not create the marketplace item. 

<!-- 2930820 - IS ASDK --> 
- In both the administrator and user portals, if you search for "Docker," the item is incorrectly returned. It is not actually available in Azure Stack. If you try to create it, a blade with an error indication is displayed. 

<!-- 2967387 – IS, ASDK --> 
- The account you use to sign in to the Azure Stack admin or user portal displays as **Unidentified user**. This occurs when the account does not have either a *First* or *Last* name specified. To work around this issue, edit the user account to provide either the First or Last name. You must then sign out and then sign back in to the portal. 

<!--  2873083 - IS ASDK --> 
-  When you use the portal to create a virtual machine scale set (VMSS), the *instance size* dropdown doesn’t load correctly when you use Internet Explorer. To work around this problem, use another browser while using the portal to create a VMSS.  

<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

<!--2760466 – IS  ASDK --> 
- When you install a new Azure Stack environment that runs this version, the alert that indicates *Activation Required* might not display. [Activation](azure-stack-registration.md) is required before you can use marketplace syndication.  

<!-- TBD - IS ASDK --> 
- The two administrative subscription types that were introduced with version 1804 should not be used. The subscription types are **Metering subscription**, and **Consumption subscription**. These subscription types are visible in new Azure Stack environments beginning with version 1804 but are not yet ready for use. You should continue to use the **Default Provider** subscription type.

<!-- TBD - IS ASDK --> 
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

<!-- TBD - IS ASDK --> 
- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.


### Health and monitoring

<!-- TBD - IS -->
- You might see the following alerts repeatedly appear and then disappear on your Azure Stack system:
   - *Infrastructure role instance unavailable*
   - *Scale unit node is offline*
   
  Please run the [Test-AzureStack](azure-stack-diagnostic-test.md) cmdlet to verify the health of the infrastructure role instances and scale unit nodes. If no issues are detected by [Test-AzureStack](azure-stack-diagnostic-test.md), you can ignore these alerts. If an issue is detected, you can attempt to start the infrastructure role instance or node using the admin portal or PowerShell.

<!-- 1264761 - IS ASDK --> 
- You might see alerts for the **Health controller** component that have the following details:  

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

  Both alerts can be safely ignored and they'll close automatically over time.  


<!-- 2812138 | IS --> 
- You might see an alert for **Storage** component that contains the following details:

   - NAME: Storage service internal communication error  
   - SEVERITY: Critical  
   - COMPONENT: Storage  
   - DESCRIPTION: Storage service internal communication error occurred when sending requests to the following nodes.  

    The alert can be safely ignored, but you need to close the alert manually.

<!-- 2368581 - IS. ASDK --> 
- An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a **Fabric VM creation error**, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.


### Compute

<!-- 3099544 – IS, ASDK --> 
- When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

<!-- 3090289 – IS, ASDK --> 
- After applying the 1808 update, you may encounter the following issues when deploying VMs with Managed Disks:

   1. If the subscription was created before the 1808 update, deploying VM with Managed Disks may fail with an internal error message. To resolve the error, follow these steps for each subscription:
      1. In the Tenant portal, go to **Subscriptions** and find the subscription. Click **Resource Providers**, then click **Microsoft.Compute**, and then click **Re-register**.
      2. Under the same subscription, go to **Access Control (IAM)**, and verify that **Azure Stack – Managed Disk** is listed.
   2. If you have configured a multi-tenant environment, deploying VMs in a subscription associated with a guest directory may fail with an internal error message. To resolve the error, follow these steps:
      1. Apply the [1808 Azure Stack Hotfix](https://support.microsoft.com/help/4467062/).
      2. Follow the steps in [this article](azure-stack-enable-multitenancy.md#registering-azure-stack-with-the-guest-directory) to reconfigure each of your guest directories.

<!-- 2869209 – IS, ASDK --> 
- When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

<!--  2966665 – IS, ASDK --> 
- Attaching SSD data disks to premium size managed disk virtual machines  (DS, DSv2, Fs, Fs_V2) fails with an error:  *Failed to update disks for the virtual machine ‘vmname’ Error: Requested operation cannot be performed because storage account type ‘Premium_LRS’ is not supported for VM size ‘Standard_DS/Ds_V2/FS/Fs_v2)*

   To work around this issue, use *Standard_LRS* data disks instead of *Premium_LRS disks*. Use of *Standard_LRS* data disks doesn't change IOPs or the billing cost. 

<!--  2795678 – IS, ASDK --> 
- When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

<!-- 2967447 - IS, ASDK --> 
- The virtual machine scale set (VMSS) create experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment or use an Azure Resource Manager template specifying another CentOS image which has been downloaded prior to deployment from the marketplace by the operator.  

<!-- 2724873 - IS --> 
- When using the PowerShell cmdlets **Start-AzsScaleUnitNode** or  **Stop-AzsScaleunitNode** to manage scale units, the first attempt to start or stop the scale unit might fail. If the cmdlet fails on the first run, run the cmdlet a second time. The second run should succeed to complete the operation. 

<!-- TBD - IS ASDK --> 
- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach to a DS series VM. DS series VMs can accommodate as many data disks as the Azure configuration.

<!-- TBD - IS ASDK --> 
- If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

<!-- 1662991 IS ASDK --> 
- Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.  

<!-- 2724961- IS ASDK --> 
- When you register the **Microsoft.Insight** resource provider in Subscription settings, and create a Windows VM with Guest OS Diagnostic enabled, the CPU Percentage chart in the VM overview page will not be able to show metric data.

   To find the CPU Percentage chart for the VM, go to the **Metrics** blade and show all the supported Windows VM guest metrics.



### Networking  

<!-- 1766332 - IS ASDK --> 
- Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

<!-- 1902460 - IS ASDK --> 
- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

<!-- 16309153 - IS ASDK --> 
- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

<!-- 2702741 -  IS ASDK --> 
- Public IPs that are deployed by using the Dynamic allocation method are not guaranteed to be preserved after a Stop-Deallocate is issued.

<!-- 2529607 - IS ASDK --> 
- During Azure Stack *Secret Rotation*, there is a period in which Public IP Addresses are unreachable for two to five minutes.

<!-- 2664148 - IS ASDK --> 
- In scenarios where the tenant is accessing their virtual machines by using a S2S VPN tunnel, they might encounter a scenario where connection attempts fail if the on-premise subnet was added to the Local Network Gateway after gateway was already created. 


<!-- ### SQL and MySQL-->


### App Service

<!-- 2352906 - IS ASDK --> 
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

<!-- 2489178 - IS ASDK --> 
- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.



### Usage  
<!-- TBD - IS ASDK --> 
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.


<!-- #### Identity -->
<!-- #### Marketplace -->


## Download the update
You can download the Azure Stack 1808 update package from [here](https://aka.ms/azurestackupdatedownload).
  

## Next steps
- To review the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state, see [Azure Stack servicing policy](azure-stack-servicing-policy.md).  
- To use the Privileged End Point (PEP) to monitor and resume updates, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).  
- For an overview of the update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).  
- For more information about how to apply updates with Azure Stack, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).  
