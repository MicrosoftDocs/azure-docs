---
title: Azure Stack 1902 update | Microsoft Docs
description: Learn about the 1902 update for Azure Stack integrated systems, including what's new, known issues, and where to download the update.
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
ms.date: 04/09/2019
ms.author: sethm
ms.reviewer: adepue
ms.lastreviewed: 04/05/2019
---

# Azure Stack 1902 update

*Applies to: Azure Stack integrated systems*

This article describes the contents of the 1902 update package. The update includes improvements, fixes, and new features for this version of Azure Stack. This article also describes known issues in this release, and includes a link to download the update. Known issues are divided into issues directly related to the update process, and issues with the build (post-installation).

> [!IMPORTANT]  
> This update package is only for Azure Stack integrated systems. Do not apply this update package to the Azure Stack Development Kit.

## Build reference

The Azure Stack 1902 update build number is **1.1902.0.69**.

## Hotfixes

Azure Stack releases hotfixes on a regular basis. Be sure to install the [latest Azure Stack hotfix](#azure-stack-hotfixes) for 1901 before updating Azure Stack to 1902.

Azure Stack hotfixes are only applicable to Azure Stack integrated systems; do not attempt to install hotfixes on the ASDK.

> [!TIP]  
> Subscribe to the following *RSS* or *Atom* feeds to keep up with Azure Stack hotfixes:
> - [RSS](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss)
> - [Atom](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom)

### Azure Stack hotfixes

- **1809**: [KB 4481548 – Azure Stack hotfix 1.1809.12.114](https://support.microsoft.com/help/4481548/)
- **1811**: No current hotfix available.
- **1901**: [KB 4495662 – Azure Stack hotfix 1.1901.3.105](https://support.microsoft.com/help/4495662)
- **1902**: [KB 4494719 – Azure Stack hotfix 1.1902.2.73](https://support.microsoft.com/help/4494719)

## Prerequisites

> [!IMPORTANT]
> You can install 1902 directly from either the [1.1901.0.95 or 1.1901.0.99](azure-stack-update-1901.md#build-reference) release, without first installing any 1901 hotfix. However, if you have installed the older **1901.2.103** hotfix, you must install the newer [1901.3.105 hotfix](https://support.microsoft.com/help/4495662) before proceeding to 1902.

- Before you start installation of this update, run [Test-AzureStack](azure-stack-diagnostic-test.md) with the following parameters to validate the status of your Azure Stack and resolve any operational issues found, including all warnings and failures. Also review active alerts, and resolve any that require action:

    ```powershell
    Test-AzureStack -Include AzsDefenderSummary, AzsHostingInfraSummary, AzsHostingInfraUtilization, AzsInfraCapacity, AzsInfraRoleSummary, AzsPortalAPISummary, AzsSFRoleSummary, AzsStampBMCSummary, AzsHostingServiceCertificates
    ```

  If the `AzsControlPlane` parameter is included when **Test-AzureStack** is executed, you will see the following failure in the **Test-AzureStack** output: **FAIL Azure Stack Control Plane Websites Summary**. You can safely ignore this specific error.

- When Azure Stack is managed by System Center Operations Manager (SCOM), make sure to update the [Management Pack for Microsoft Azure Stack](https://www.microsoft.com/download/details.aspx?id=55184) to version 1.0.3.11 before applying 1902.

- The package format for the Azure Stack update has changed from **.bin/.exe/.xml** to **.zip/.xml** starting with the 1902 release. Customers with connected Azure Stack scale units will see the **Update available** message in the portal. Customers that are not connected can now simply download and import the .zip file with the corresponding .xml.

<!-- ## New features -->

<!-- ## Fixed issues -->

## Improvements

- The 1902 build introduces a new user interface on the Azure Stack Administrator portal for creating plans, offers, quotas, and add-on plans. For more information, including screenshots, see [Create plans, offers, and quotas](azure-stack-create-plan.md).

<!-- 1460884	Hotfix: Adding StorageController service permission to talk to ClusterOrchestrator	Add node -->
- Improvements to the reliability of capacity expansion during an add node operation when switching the scale unit state from “Expanding storage” to “Running”.

<!--
1426197	3852583: Increase Global VM script mutex wait time to accommodate enclosed operation timeout	PNU
1399240	3322580: [PNU] Optimize the DSC resource execution on the Host	PNU
1398846	Bug 3751038: ECEClient.psm1 should provide cmdlet to resume action plan instance	PNU
1398818	3685138, 3734779: ECE exception logging, VirtualMachine ConfigurePending should take node name from execution context	PNU
1381018	[1902] 3610787 - Infra VM creation should fail if the ClusterGroup already exists	PNU
-->
- To improve package integrity and security, as well as easier management for offline ingestion, Microsoft has changed the format of the Update package from .exe and .bin files to a .zip file. The new format adds additional reliability of the unpacking process that at times, can cause the preparation of the update to stall. The same package format also applies to update packages from your OEM.
- To improve the Azure Stack operator experience when running Test-AzureStack, operators can now simply use, “Test-AzureStack -Group UpdateReadiness” as opposed to passing ten additional parameters after an Include statement.

  ```powershell
    Test-AzureStack -Group UpdateReadiness  
  ```  
  
- To improve on the overall reliability and availability of core infrastructure services during the update process, the native Update resource provider as part of the update action plan will detect and invoke automatic global remediations as-needed. Global remediation “repair” workflows include:

  - Checking for infrastructure virtual machines that are in a non-optimal state and attempt to repair them as-needed.
  - Check for SQL service issues as part of the control plan and attempt to repair them as-needed.
  - Check the state of the Software Load Balancer (SLB) service as part of the Network Controller (NC) and attempt to repair them as-needed.
  - Check the state of the Network Controller (NC) service and attempt to repair it as needed
  - Check the state of the Emergency Recovery Console Service (ERCS) service fabric nodes and repair them as needed.
  - Check the state of the infrastructure role and repair as needed.
  - Check the state of the Azure Consistent Storage (ACS) service fabric nodes and repair them as needed.

<!-- 
1426690	[SOLNET] 3895478-Get-AzureStackLog_Output got terminated in the middle of network log	Diagnostics
1396607	3796092: Move Blob services log from Storage role to ACSBlob role to reduce the log size of Storage	Diagnostics
1404529	3835749: Enable Group Policy Diagnostic Logs	Diagnostics
1436561	Bug 3949187: [Bug Fix] Remove AzsStorageSvcsSummary test from SecretRotationReadiness Test-AzureStack flag	Diagnostics
1404512	3849946: Get-AzureStackLog should collect all child folders from c:\Windows\Debug	Diagnostics 
-->
- Improvements to Azure stack diagnostic tools to improve log collection reliability and performance. Additional logging for networking and identity services. 

<!-- 1384958	Adding a Test-AzureStack group for Secret Rotation	Diagnostics -->
- Improvements to the reliability of Test-AzureStack for secret rotation readiness test.

<!-- 1404751	3617292: Graph: Remove dependency on ADWS.	Identity -->
- Improvements to increase AD Graph reliability when communicating with customer’s Active Directory environment

<!-- 1391444	[ISE] Telemetry for Hardware Inventory - Fill gap for hardware inventory info	System info -->
- Improvements hardware inventory collection in Get-AzureStackStampInformation.

- To improve reliability of operations running on ERCS infrastructure, the memory for each ERCS instance increases from 8 GB to 12 GB. On an Azure Stack integrated systems installation, this results in a 12 GB increase overall.

> [!IMPORTANT]
> To make sure the patch and update process results in the least amount of tenant downtime, make sure your Azure Stack stamp has more than 12 GB of available space in the **Capacity** blade. You can see this memory increase reflected in the **Capacity** blade after a successful installation of the update.

## Common vulnerabilities and exposures

This update installs the following security updates:  
- [ADV190005](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/ADV190006)
- [CVE-2019-0595](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0595)
- [CVE-2019-0596](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0596)
- [CVE-2019-0597](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0597)
- [CVE-2019-0598](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0598)
- [CVE-2019-0599](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0599)
- [CVE-2019-0600](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0600)
- [CVE-2019-0601](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0601)
- [CVE-2019-0602](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0602)
- [CVE-2019-0615](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0615)
- [CVE-2019-0616](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0616)
- [CVE-2019-0618](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0618)
- [CVE-2019-0619](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0619)
- [CVE-2019-0621](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0621)
- [CVE-2019-0623](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0623)
- [CVE-2019-0625](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0625)
- [CVE-2019-0626](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0626)
- [CVE-2019-0627](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0627)
- [CVE-2019-0628](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0628)
- [CVE-2019-0630](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0630)
- [CVE-2019-0631](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0631)
- [CVE-2019-0632](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0632)
- [CVE-2019-0633](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0633)
- [CVE-2019-0635](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0635)
- [CVE-2019-0636](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0636)
- [CVE-2019-0656](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0656)
- [CVE-2019-0659](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0659)
- [CVE-2019-0660](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0660)
- [CVE-2019-0662](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0662)
- [CVE-2019-0663](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0663)

For more information about these vulnerabilities, click on the preceding links, or see Microsoft Knowledge Base articles [4487006](https://support.microsoft.com/en-us/help/4487006).

## Known issues with the update process

- When you run [Test-AzureStack](azure-stack-diagnostic-test.md), a warning message from the Baseboard Management Controller (BMC) is displayed. You can safely ignore this warning.

- <!-- 2468613 - IS --> During installation of this update, you might see alerts with the title `Error – Template for FaultType UserAccounts.New is missing.`  You can safely ignore these alerts. The alerts close automatically after the installation of this update completes.

## Post-update steps

- After the installation of this update, install any applicable hotfixes. For more information, see [Hotfixes](#hotfixes), as well as our [Servicing Policy](azure-stack-servicing-policy.md).  

- Retrieve the data at rest encryption keys and securely store them outside of your Azure Stack deployment. Follow the [instructions on how to retrieve the keys](azure-stack-security-bitlocker.md).

## Known issues (post-installation)

The following are post-installation known issues for this build version.

### Portal

<!-- 2930820 - IS ASDK --> 
- In both the administrator and user portals, if you search for "Docker," the item is incorrectly returned. It is not available in Azure Stack. If you try to create it, a blade with an error indication is displayed. 

<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

<!-- TBD - IS ASDK --> 
- The two administrative subscription types that were introduced with version 1804 should not be used. The subscription types are **Metering subscription**, and **Consumption subscription**. These subscription types are visible in new Azure Stack environments beginning with version 1804 but are not yet ready for use. You should continue to use the **Default Provider** subscription type.

<!-- 3557860 - IS ASDK --> 
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete the user subscriptions.

<!-- 1663805 - IS ASDK --> 
- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use [PowerShell to verify permissions](/powershell/module/azs.subscriptions.admin/get-azssubscriptionplan).

<!-- Daniel 3/28 -->
- In the user portal, when you navigate to a blob within a storage account and try to open **Access Policy** from the navigation tree, the subsequent window fails to load. To work around this issue, the following PowerShell cmdlets enable creating, retrieving, setting and deleting access policies, respectively:

  - [New-AzureStorageContainerStoredAccessPolicy](/powershell/module/azure.storage/new-azurestoragecontainerstoredaccesspolicy)
  - [Get-AzureStorageContainerStoredAccessPolicy](/powershell/module/azure.storage/get-azurestoragecontainerstoredaccesspolicy)
  - [Set-AzureStorageContainerStoredAccessPolicy](/powershell/module/azure.storage/set-azurestoragecontainerstoredaccesspolicy)
  - [Remove-AzureStorageContainerStoredAccessPolicy](/powershell/module/azure.storage/remove-azurestoragecontainerstoredaccesspolicy)

<!-- ### Health and monitoring -->

### Compute

- When creating a new Windows Virtual Machine (VM), the following error may be displayed:

   `'Failed to start virtual machine 'vm-name'. Error: Failed to update serial output settings for VM 'vm-name'`

   The error occurs if you enable boot diagnostics on a VM but delete your boot diagnostics storage account. To work around this issue, recreate the storage account with the same name as you used previously.

<!-- 2967447 - IS, ASDK, to be fixed in 1902 -->
- The virtual machine scale set (VMSS) creation experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another operating system for your deployment, or use an Azure Resource Manager template specifying another CentOS image that has been downloaded prior to deployment from the marketplace by the operator.  

<!-- TBD - IS ASDK --> 
- After applying the 1902 update, you might encounter the following issues when deploying VMs with Managed Disks:

   - If the subscription was created before the 1808 update, deploying a VM with Managed Disks might fail with an internal error message. To resolve the error, follow these steps for each subscription:
      1. In the Tenant portal, go to **Subscriptions** and find the subscription. Select **Resource Providers**, then select **Microsoft.Compute**, and then click **Re-register**.
      2. Under the same subscription, go to **Access Control (IAM)**, and verify that **Azure Stack – Managed Disk** is listed.
   - If you have configured a multi-tenant environment, deploying VMs in a subscription associated with a guest directory might fail with an internal error message. To resolve the error, follow these steps in [this article](azure-stack-enable-multitenancy.md#registering-azure-stack-with-the-guest-directory) to reconfigure each of your guest directories.

- An Ubuntu 18.04 VM created with SSH authorization enabled will not allow you to use the SSH keys to log in. As a workaround, use VM access for the Linux extension to implement SSH keys after provisioning, or use password-based authentication.

### Networking  

<!-- 3239127 - IS, ASDK -->
- In the Azure Stack portal, when you change a static IP address for an IP configuration that is bound to a network adapter attached to a VM instance, you will see a warning message that states 

    `The virtual machine associated with this network interface will be restarted to utilize the new private IP address...`.

    You can safely ignore this message; the IP address will be changed even if the VM instance does not restart.

<!-- 3632798 - IS, ASDK -->
- In the portal, if you add an inbound security rule and select **Service Tag** as the source, several options are displayed in the **Source Tag** list that are not available for Azure Stack. The only options that are valid in Azure Stack are as follows:

  - **Internet**
  - **VirtualNetwork**
  - **AzureLoadBalancer**
  
  The other options are not supported as source tags in Azure Stack. Similarly, if you add an outbound security rule and select **Service Tag** as the destination, the same list of options for **Source Tag** is displayed. The only valid options are the same as for **Source Tag**, as described in the previous list.

- Network security groups (NSGs) do not work in Azure Stack in the same way as global Azure. In Azure, you can set multiple ports on one NSG rule (using the portal, PowerShell, and Resource Manager templates). In Azure Stack however, you cannot set multiple ports on one NSG rule via the portal. To work around this issue, use a Resource Manager template or PowerShell to set these additional rules.

<!-- 3203799 - IS, ASDK -->
- Azure Stack does not support attaching more than 4 Network Interfaces (NICs) to a VM instance today, regardless of the instance size.

<!-- ### SQL and MySQL-->

### App Service

<!-- 2352906 - IS ASDK --> 
- You must register the storage resource provider before you create your first Azure Function in the subscription.


<!-- ### Usage -->

 
<!-- #### Identity -->
<!-- #### Marketplace -->

### Syslog 

- The syslog configuration is not persisted through an update cycle, causing the syslog client to lose its configuration, and the syslog messages to stop being forwarded. This issue applies to all versions of Azure Stack since the GA of the syslog client (1809). To work around this issue, reconfigure the syslog client after applying an Azure Stack update.

## Download the update

You can download the Azure Stack 1902 update package from [here](https://aka.ms/azurestackupdatedownload). 

In connected scenarios only, Azure Stack deployments periodically check a secured endpoint and automatically notify you if an update is available for your cloud. For more information, see [managing updates for Azure Stack](azure-stack-updates.md#using-the-update-tile-to-manage-updates).

## Next steps

- For an overview of the update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).  
- For more information about how to apply updates with Azure Stack, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).
- To review the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state, see [Azure Stack servicing policy](azure-stack-servicing-policy.md).  
- To use the Privileged End Point (PEP) to monitor and resume updates, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).  
