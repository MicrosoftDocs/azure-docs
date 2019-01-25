---
title: Azure Stack 1901 update | Microsoft Docs
description: Learn about the 1901 update for Azure Stack integrated systems, including what's new, known issues, and where to download the update.
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
ms.date: 01/26/2019
ms.author: sethm
ms.reviewer: adepue

---

# Azure Stack 1901 update

*Applies to: Azure Stack integrated systems*

This article describes the contents of the 1901 update package. The update includes improvements, fixes, and new features for this version of Azure Stack. This article also describes known issues in this release, and includes a link to download the update. Known issues are divided into issues directly related to the update process, and issues with the build (post-installation).

> [!IMPORTANT]  
> This update package is only for Azure Stack integrated systems. Do not apply this update package to the Azure Stack Development Kit.

## Build reference

The Azure Stack 1901 update build number is **1.1901.x.xx**.

## Hotfixes

Azure Stack releases hotfixes on a regular basis. Be sure to install the [latest Azure Stack hotfix](#azure-stack-hotfixes) for 1811 before updating Azure Stack to 1901.

> [!TIP]  
> Subscribe to the following *RSS* or *Atom* feeds to keep up with Azure Stack hotfixes:
> - [RSS](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss)
> - [Atom](https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom)

### Azure Stack hotfixes

- **1809**: [KB 4481548 – Azure Stack hotfix 1.1809.12.114](https://support.microsoft.com/help/4481548/)
- **1811**: No current hotfix available.
- **1901**: No current hotfix available.

## Prerequisites

> [!IMPORTANT]
> During installation of the 1901 update, you must ensure that all instances of the administrator portal are closed. The user portal can remain open, but the admin portal must be closed.

- Get your Azure Stack deployment ready for the Azure Stack extension host. Prepare your system using the following guidance: [Prepare for extension host for Azure Stack](azure-stack-extension-host-prepare.md). 

- Install the [latest Azure Stack hotfix](#azure-stack-hotfixes) for 1811 (if any) before updating to 1901.

- Before you start installation of this update, run [Test-AzureStack](azure-stack-diagnostic-test.md) with the following parameters to validate the status of your Azure Stack and resolve any operational issues found, including all warnings and failures. Also review active alerts, and resolve any that require action:

    ```PowerShell
    Test-AzureStack -Include AzsControlPlane, AzsDefenderSummary, AzsHostingInfraSummary, AzsHostingInfraUtilization, AzsInfraCapacity, AzsInfraRoleSummary, AzsPortalAPISummary, AzsSFRoleSummary, AzsStampBMCSummary, AzsHostingServiceCertificates
    ```

    If you do not have the extension host requirements met, the `Test-AzureStack` output displays the following message:
  
    `To proceed with installation of the 1901 update, you will need to import 
    the SSL certificates required for Extension Host, which simplifies network 
    integration and increases the security posture of Azure Stack. Refer to this 
    link to prepare for Extension Host:
    https://docs.microsoft.com/azure/azure-stack/azure-stack-extension-host-prepare`

- The Azure Stack 1901 update requires that you have properly imported the mandatory extension host certificates into your Azure Stack environment. To proceed with installation of the 1901 update, you must import the SSL certificates required for the extension host. To import the certificates, see [this section](azure-stack-extension-host-prepare.md#import-extension-host-certificates).

    If you ignore every warning and still choose to install the update, the update will fail in approximately 1 hour with the following message:

    `The required SSL certificates for the Extension Host have not been found.
    The Azure Stack update will halt. Refer to this link to prepare for 
    Extension Host: https://docs.microsoft.com/azure/azure-stack/azure-stack-extension-host-prepare,
    then resume the update.
    Exception: The Certificate path does not exist: [certificate path here]`

    Once you have properly imported the mandatory extension host certificates, you can resume the update from the Administrator portal. While Microsoft advises Azure Stack operators to schedule a maintenance window during the update process, a failure due to the missing extension host certificates should not impact existing workloads or services.  

    During the installation of this update, the Azure Stack user portal is unavailable while the extension host is being configured. The configuration of the extension host can take up to 5 hours. During that time, you can check the status of an update, or resume a failed update installation using [Azure Stack Administrator PowerShell or the privileged endpoint](azure-stack-monitor-update.md).

## New features

This update includes the following new features and improvements for Azure Stack:

## Fixed issues

- Fixed an issue in which the portal showed an option to create policy-based VPN gateways, which are not supported in Azure Stack. This option has been removed from the portal.

<!-- 16523695 – IS, ASDK -->
- Fixed an issue in which after updating your DNS Settings for your Virtual Network from **Use Azure Stack DNS** to **Custom DNS**, the instances were not updated with the new setting.

- <!-- 3235634 – IS, ASDK -->
Fixed an issue in which deploying VMs with sizes containing a **v2** suffix; for example, **Standard_A2_v2**, required specifying the suffix as **Standard_A2_v2** (lowercase v). As with global Azure, you can now use **Standard_A2_V2** (uppercase V).

<!-- 2869209 – IS, ASDK --> 
- Fixed an issue when using the [Add-AzsPlatformImage cmdlet](/powershell/module/azs.compute.admin/add-azsplatformimage), in which you had to use the **-OsUri** parameter as the storage account URI where the disk is uploaded. You can now also use the local path to the disk.

<!--  2795678 – IS, ASDK --> 
- Fixed an issue that produced a warning when you used the portal to create virtual machines (VMs) in a premium VM size (DS,Ds_v2,FS,FSv2). The VM was created in a standard storage account. Although this did not affect functionally, IOPs, or billing, the warning has been fixed.

<!-- 1264761 - IS ASDK -->  
- Fixed an issue with the **Health controller** component that was generating the following alerts. The alerts could be safely ignored:

    - Alert #1:
       - NAME:  Infrastructure role unhealthy
       - SEVERITY: Warning
       - COMPONENT: Health controller
       - DESCRIPTION: The health controller Heartbeat Scanner is unavailable. This may affect health reports and metrics.  

    - Alert #2:
       - NAME:  Infrastructure role unhealthy
       - SEVERITY: Warning
       - COMPONENT: Health controller
       - DESCRIPTION: The health controller Fault Scanner is unavailable. This may affect health reports and metrics.

<!-- 3631537 - IS, ASDK -->
- Fixed an issue when creating a new Windows Virtual Machine (VM) in which the **Settings** blade required that you select a public inbound port in order to proceed. Although the setting was required, it had no effect.

<!-- 2724873 - IS --> 
- Fixed an issue when using the PowerShell cmdlets **Start-AzsScaleUnitNode** or  **Stop-AzsScaleunitNode** to manage scale units, in which the first attempt to start or stop the scale unit might fail.

<!-- 2724961- IS ASDK --> 
- Fixed an issue in which you registered the **Microsoft.Insight** resource provider in the subscription settings, and created a Windows VM with Guest OS Diagnostic enabled, but the CPU Percentage chart in the VM overview page did not show metrics data. The data now correctly displays.

- Fixed an issue in which running the **Get-AzureStackLog** cmdlet failed after running **Test-AzureStack** in the same privileged endpoint (PEP) session. You can now use the same PEP session in which you executed **Test-AzureStack**.

## Changes

- A new way to view and edit the quotas in a plan was introduced in 1811. For more information, see [View an existing quota](azure-stack-quota-types.md#view-an-existing-quota).

<!-- 3083238 IS -->
- Security enhancements in this update result in an increase in the backup size of the directory service role. For updated sizing guidance for the external storage location, see the [infrastructure backup documentation](azure-stack-backup-reference.md#storage-location-sizing). This change results in a longer time to complete the backup due to the larger size data transfer. This change impacts integrated systems. 

## Common vulnerabilities and exposures

This update installs the following security updates:  

- [CVE-2018-8477](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8477)
- [CVE-2018-8514](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8514)
- [CVE-2018-8580](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8580)
- [CVE-2018-8595](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8595)
- [CVE-2018-8596](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8596)
- [CVE-2018-8598](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8598)
- [CVE-2018-8621](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8621)
- [CVE-2018-8622](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8622)
- [CVE-2018-8627](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8627)
- [CVE-2018-8637](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8637)
- [CVE-2018-8638](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2018-8638)
- [ADV190001](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/ADV190001)
- [CVE-2019-0536](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0536)
- [CVE-2019-0537](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0537)
- [CVE-2019-0545](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0545)
- [CVE-2019-0549](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0549)
- [CVE-2019-0553](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0553)
- [CVE-2019-0554](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0554)
- [CVE-2019-0559](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0559)
- [CVE-2019-0560](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0560)
- [CVE-2019-0561](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0561)
- [CVE-2019-0569](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0569)
- [CVE-2019-0585](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0585)
- [CVE-2019-0588](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/CVE-2019-0588)


For more information about these vulnerabilities, click on the preceding links, or see Microsoft Knowledge Base articles [4480977](https://support.microsoft.com/en-us/help/4480977).

## Known issues with the update process

- During installation of the 1901 update, ensure that all instances of the administrator portal are closed during this time. The user portal can remain open, but the admin portal must be closed.

- When running [Test-AzureStack](azure-stack-diagnostic-test.md), if either the **AzsInfraRoleSummary** or the **AzsPortalApiSummary** test fails, you are prompted to run **Test-AzureStack** with the `-Repair` flag.  If you run this command, it fails with the following error message:  `Unexpected exception getting Azure Stack health status. Cannot bind argument to parameter 'TestResult' because it is null.`

- During installation of the 1901 update, the Azure Stack use portal is unavailable while the extension host is being configured. The configuration of the extension host can take up to 5 hours. During that time, you can check the status of an update, or resume a failed update installation using [Azure Stack Administrator PowerShell or the privileged endpoint](azure-stack-monitor-update.md). 

- During installation of the 1901 update, the user portal dashboard might not be available, and customizations can be lost. You can restore the dashboard to the default setting after the update completes by opening the portal settings and selecting **Restore default settings**.

- When you run [Test-AzureStack](azure-stack-diagnostic-test.md), a warning message from the Baseboard Management Controller (BMC) is displayed. You can safely ignore this warning.

- <!-- 2468613 - IS --> During installation of this update, you might see alerts with the title `Error – Template for FaultType UserAccounts.New is missing.`  You can safely ignore these alerts. The alerts close automatically after the installation of this update completes.

- <!-- 3139614 | IS --> If you've applied an update to Azure Stack from your OEM, the **Update available** notification may not appear in the Azure Stack administrator portal. To install the Microsoft update, download and import it manually using the instructions located here [Apply updates in Azure Stack](azure-stack-apply-updates.md).

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

<!-- TBD - IS ASDK --> 
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete the user subscriptions.

<!-- TBD - IS ASDK --> 
- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use [PowerShell to verify permissions](/powershell/module/azs.subscriptions.admin/get-azssubscriptionplan).

<!-- ### Health and monitoring -->

### Compute

- When creating a new Windows Virtual Machine (VM), the following error may be displayed:

   `'Failed to start virtual machine 'vm-name'. Error: Failed to update serial output settings for VM 'vm-name'`

   The error occurs if you enable boot diagnostics on a VM but delete your boot diagnostics storage account. To work around this issue, recreate the storage account with the same name as you used previously.

<!-- 2967447 - IS, ASDK, to be fixed in 1902 -->
- The virtual machine scale set (VMSS) creation experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another operating system for your deployment, or use an Azure Resource Manager template specifying another CentOS image that has been downloaded prior to deployment from the marketplace by the operator.  

<!-- 3507629 - IS, ASDK --> 
- Managed Disks creates two new [compute quota types](azure-stack-quota-types.md#compute-quota-types) to limit the maximum capacity of managed disks that can be provisioned. By default, 2048 GiB is allocated for each managed disks quota type. However, you may encounter the following issues:

   - For quotas created before the 1808 update, the Managed Disks quota will show 0 values in the Administrator portal, although 2048 GiB is allocated. You can increase or decrease the value based on your actual needs, and the newly set quota value overrides the 2048 GiB default.
   - If you update the quota value to 0, it is equivalent to the default value of 2048 GiB. As a workaround, set the quota value to 1.

<!-- TBD - IS ASDK --> 
- After applying the 1901 update, you might encounter the following issues when deploying VMs with Managed Disks:

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

<!-- 3631677 - IS, ASDK -->
- In the portal, on the **Networking Properties** blade there is a link for **Effective Security Rules** for each network adapter. If you select this link, a new blade opens that shows the error message `Not Found.` This error occurs because Azure Stack does not yet support **Effective Security Rules**.

<!-- 3632798 - IS, ASDK -->
- In the portal, if you add an inbound security rule and select **Service Tag** as the source, several options are displayed in the **Source Tag** list that are not available for Azure Stack. The only options that are valid in Azure Stack are as follows:

    - **Internet**
    - **VirtualNetwork**
    - **AzureLoadBalancer**
  
    The other options are not supported as source tags in Azure Stack. Similarly, if you add an outbound security rule and select **Service Tag** as the destination, the same list of options for **Source Tag** is displayed. The only valid options are the same as for **Source Tag**, as described in the previous list.

- The **New-AzureRmIpSecPolicy** PowerShell cmdlet does not support setting **DHGroup24** for the `DHGroup` parameter.

### Infrastructure backup

<!--scheduler config lost, bug 3615401, new issue in 1811,  hectorl-->
<!-- TSG: https://www.csssupportwiki.com/index.php/Azure_Stack/KI/Backup_scheduler_configuration_lost --> 
- After enabling automatic backups, the scheduler service goes into disabled state unexpectedly. The backup controller service will detect that automatic backups are disabled and raise a warning in the administrator portal. This warning is expected when automatic backups are disabled. 
    - Cause: This issue is due to a bug in the service that results in loss of scheduler configuration. This bug does not change the storage location, user name, password, or encryption key.   
    - Remediation: To mitigate this issue, open the backup controller settings blade in the Infrastructure Backup resource provider and select **Enable Automatic Backups**. Make sure to set the desired frequency and retention period.
    - Occurrence: Low 

<!-- ### SQL and MySQL-->

### App Service

<!-- 2352906 - IS ASDK --> 
- You must register the storage resource provider before you create your first Azure Function in the subscription.


<!-- ### Usage -->

 
<!-- #### Identity -->
<!-- #### Marketplace -->


## Download the update

You can download the Azure Stack 1901 update package from [here](https://aka.ms/azurestackupdatedownload). 

In connected scenarios only, Azure Stack deployments periodically check a secured endpoint and automatically notify you if an update is available for your cloud. For more information, see [managing updates for Azure Stack](azure-stack-updates.md#using-the-update-tile-to-manage-updates).

## Next steps

- For an overview of the update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).  
- For more information about how to apply updates with Azure Stack, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).
- To review the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state, see [Azure Stack servicing policy](azure-stack-servicing-policy.md).  
- To use the Privileged End Point (PEP) to monitor and resume updates, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).  
