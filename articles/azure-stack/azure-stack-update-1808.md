---
title: Azure Stack 1808 Update | Microsoft Docs
description: Learn about what's new in the 1808 update for Azure Stack integrated systems, including the known issues and where to download the update.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/28/2018
ms.author: brenduns
ms.reviewer: justini

---

# Azure Stack 1808 update

*Applies to: Azure Stack integrated systems*

This article describes the contents of the 1808 update package. The update package includes improvements, fixes, and known issues for this version of Azure Stack. This article also includes a link so you can download the update. Known issues are divided into issues directly related to the update process and issues with the build (post-installation).

> [!IMPORTANT]  
> This update package is only for Azure Stack integrated systems. Do not apply this update package to the Azure Stack Development Kit.

## Build reference

The Azure Stack 1808 update build number is **1.1808.0.68**.  

### New features

This update includes the following improvements for Azure Stack.

- <!--  2682594   | IS  -->  **All Azure Stack environments now use the Coordinated Universal Time (UTC) time zone format.**  All log data and related information now displays in UTC format. If you update from a previous version that was not installed using UTC, your environment is updated to use UTC. 

- <!-- 2437250  | IS  ASDK --> **Managed Disks are supported.** You can now use Managed Disks in Azure Stack virtual machines and virtual machine scale sets. For more information, see [Azure Stack Managed Disks: Differences and considerations](/azure/azure-stack/user/azure-stack-managed-disk-considerations).




 ### Fixed issues

- **Various fixes** for performance, stability, security, and the operating system that is used by Azure Stack.


### Changes
- <!-- 1697698  | IS, ASDK --> The *Quickstart tutorials* in the User portal dashboard now link to relevant articles in the on-line Azure Stack documentation.

- <!-- 2515955   | IS ,ASDK--> *All services* replaces *More services* in the [Azure Stack admin](azure-stack-manage-portals.md) and user portals. You can now use *All services* as an alternative to navigate in the Azure Stack portals the same way you do in the Azure portals.


### Common Vulnerabilities and Exposures

This release installs the following updates:  

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

- Install the latest available [update or hotfix for version 1805](azure-stack-update-1805.md#post-update-steps).  
  > [!TIP]  
  > Subscribe to the following *RRS* or *Atom* feeds to keep up with Azure Stack Hotfixes:
  > - RRS: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss … 
  > - Atom: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom …


- Before you start installation of update 1808, run [Test-AzureStack](azure-stack-diagnostic-test.md) to validate the status of your Azure Stack and resolve any operational issues found. Also review active alerts, and resolve any that require action.

### Known issues with the update process

- <!-- 2468613 - IS --> During installation of this update, you might see alerts with the title *Error – Template for FaultType UserAccounts.New is missing.*  You can safely ignore these alerts. These alerts will close automatically after installation of this update completes.

- <!-- 2489559 - IS --> Do not attempt to create virtual machines during the installation of this update. For more information about managing updates, see [Manage updates in Azure Stack overview](azure-stack-updates.md#plan-for-updates).

- <!-- 2830461 - IS --> In certain circumstances when an update requires attention, the corresponding alert may not be generated. The accurate status will still be reflected in the portal and is not impacted.

### Post-update steps

*There are no post-update steps for update 1808.*

<!-- After the installation of this update, install any applicable Hotfixes. For more information view the following knowledge base articles, as well as our [Servicing Policy](azure-stack-servicing-policy.md).  
 - Link to KB  
 -->

## Known issues (post-installation)

The following are post-installation known issues for this build version.

### Portal
- <!-- 2931230 – IS  ASDK --> Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

- <!--2760466 – IS  ASDK --> When you install a new Azure Stack environment that runs this version, the alert that indicates *Activation Required* might not display. [Activation](azure-stack-registration.md) is required before you can use marketplace syndication.  

- <!-- TBD - IS ASDK --> The two administrative subscription types that were [introduced with version 1804](azure-stack-update-1804.md#new-features) should not be used. The subscription types are **Metering subscription**, and **Consumption subscription**. These subscription types are visible in new Azure Stack environments beginning with version 1804 but are not yet ready for use. You should continue to use the **Default Provider** subscription type.

- <!-- TBD - IS --> It might not be possible to view compute or storage resources in the administrator portal. The cause of this issue is an error during the installation of the update that causes the update to be incorrectly reported as successful. If this issue occurs, contact Microsoft Customer Support Services for assistance.

- <!-- TBD - IS --> You might see a blank dashboard in the portal. To recover the dashboard, select the gear icon in the upper right corner of the portal, and then select **Restore default settings**.

- <!-- TBD - IS ASDK --> Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

- <!-- TBD - IS ASDK --> You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.


### Health and monitoring
- <!-- 1264761 - IS ASDK -->  You might see alerts for the **Health controller** component that have the following details:  

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


- <!-- 2812138 | IS --> You might see an alert for **Storage** component that have the following details:

   - NAME: Storage service internal communication error  
   - SEVERITY: Critical  
   - COMPONENT: Storage  
   - DESCRIPTION: Storage service internal communication error occurred when sending requests to the following nodes.  

    The alert can be safely ignored, but you need to close the alert manually.

- <!-- 2368581 - IS. ASDK --> An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a **Fabric VM creation error**, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.


### Compute

- <!-- 2724873 - IS --> When using the PowerShell cmdlets **Start-AzsScaleUnitNode** or  **Stop-AzsScaleunitNode** to manage scale units, the first attempt to start or stop the scale unit might fail. If the cmdlet fails on the first run, run the cmdlet a second time. The second run should succeed to complete the operation. 

- <!-- 2494144 - IS, ASDK --> When selecting a virtual machine size for a virtual machine deployment, some F-Series VM sizes are not visible as part of the size selector when you create a VM. The following VM sizes do not appear in the selector: *F8s_v2*, *F16s_v2*, *F32s_v2*, and *F64s_v2*.  
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


- <!-- TBD - IS ASDK --> Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

- <!-- TBD - IS --> When you create an availability set in the portal by going to **New** > **Compute** > **Availability set**, you can only create an availability set with a fault domain and update domain of 1. As a workaround, when creating a new virtual machine, create the availability set by using PowerShell, CLI, or from within the portal.

- <!-- TBD - IS ASDK --> When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach to a DS series VM. DS series VMs can accommodate as many data disks as the Azure configuration.

- <!-- TBD - IS ASDK --> If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

- <!-- 1662991 IS ASDK --> Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.  

- <!-- 2724961- IS ASDK --> When you register the **Microsoft.Insight** resource provider in Subscription settings, and create a Windows VM with Guest OS Diagnostic enabled, the CPU Percentage chart in the VM overview page will not be able to show metric data. To find the CPU Percentage chart for the VM, go to the **Metrics** blade and show all the supported Windows VM guest metrics.

### Networking  

- <!-- 1766332 - IS ASDK --> Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

- <!-- 1902460 - IS ASDK --> Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

- <!-- 16309153 - IS ASDK --> On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

- <!-- 2702741 -  IS ASDK --> Public IPs that are deployed by using the Dynamic allocation method are not guaranteed to be preserved after a Stop-Deallocate is issued.

- <!-- 2529607 - IS ASDK --> During Azure Stack *Secret Rotation*, there is a period in which Public IP Addresses are unreachable for two to five minutes.

-	<!-- 2664148 - IS ASDK --> In scenarios where the tenant is accessing their virtual machines by using a S2S VPN tunnel, they might encounter a scenario where connection attempts fail if the on-premise subnet was added to the Local Network Gateway after gateway was already created. 


<!-- ### SQL and MySQL-->


### App Service

- <!-- 2352906 - IS ASDK --> Users must register the storage resource provider before they create their first Azure Function in the subscription.

- <!-- 2489178 - IS ASDK --> In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.

- <!-- TBD - IS ASDK --> App Service can only be deployed into the *Default Provider subscription* at this time.  


### Usage  
- <!-- TBD - IS ASDK --> Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.


<!-- #### Identity -->
<!-- #### Marketplace -->


## Download the update
You can download the Azure Stack 1807 update package from [here](https://aka.ms/azurestackupdatedownload).


## Next steps
- To review the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state, see [Azure Stack servicing policy](azure-stack-servicing-policy.md).  
- To use the Privileged End Point (PEP) to monitor and resume updates, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).  
- For an overview of the update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).  
- For more information about how to apply updates with Azure Stack, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).  
