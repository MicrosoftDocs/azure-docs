---
title: Azure Stack 1811 update | Microsoft Docs
description: Learn about the 1811 update for Azure Stack integrated systems, including what's new, known issues, and where to download the update.
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
ms.date: 11/27/2018
ms.author: sethm
ms.reviewer: adepue

---

# Azure Stack 1811 update

*Applies to: Azure Stack integrated systems*

This article describes the contents of the 1811 update package. The update package includes improvements, fixes, and known issues for this version of Azure Stack. This article also includes a link so you can download the update. Known issues are divided into issues directly related to the update process and issues with the build (post-installation).

> [!IMPORTANT]  
> This update package is only for Azure Stack integrated systems. Do not apply this update package to the Azure Stack Development Kit.

## Build reference

The Azure Stack 1811 update build number is **1.1811.x.xx**.  

### New features

<!-- Will remove this section as they are no longer new features. -->

This update includes the following improvements for Azure Stack:

- Enhanced Azure Stack operator experience for managing updates from the Update blade.

- Support is added for the following Azure Storage Service API versions: 2017-07-29, 2017-11-09; and the following Azure Storage Resource Provider API versions: 2016-05-01, 2016-12-01, 2017-06-01, 2017-10-01. For more information, see [Azure Stack storage: Differences and considerations](./user/azure-stack-acs-differences.md).

- With this release, Azure Stack integrated systems supports configurations of 4-16 nodes. You can use the [Azure Stack Capacity Planner](https://aka.ms/azstackcapacityplanner) to help in your planning for Azure Stack capacity and configuration.

- Support for Device Authentication with ADFS in particular when using Azure CLI. [@Matt add Link to CLI for ADFS]

- Support for Azure CLI using Web Browser authentication with ADFS.

- Added new privileged endpoint commands to update and remove service principles for ADFS. (@Matt add link to updated SPN - ADFS article)

- New Scale Unit Node operations that allow an Azure Stack operator to start, stop and shut down a scale unit node. [@Matt add link to updated node actions doc]

- Added new privileged endpoint command to update the BMC credential - user name and password used to communicate with the physical machines. [@Matt add link to updated bmc doc]

<!--  2712869   | IS  ASDK -->  
- **Azure Stack syslog client (General Availability)**  This client allows the forwarding of audits, alerts, and security logs related to the Azure Stack infrastructure to a syslog server or security information and event management (SIEM) software external to Azure Stack. The syslog client now supports specifying the port on which the syslog server is listening.

   With this release, the syslog client is generally available, and it can be used in production environments.

   For more information, see [Azure Stack syslog forwarding](azure-stack-integrate-security.md).

- You can now [move the registration resource](azure-stack-registration.md#move-a-registration-resource) on Azure between resource groups without having to re-register. Cloud Solution Providers (CSPs) can also move the registration resource between subscriptions, as long as both the new and old subscriptions are mapped to the same CSP partner ID. This does not impact the existing customer tenant mappings. 

### Fixed issues

<!-- 2930718 - IS ASDK --> 
- Fixed: in the administrator portal, when accessing the details of any user subscription, after closing the blade and clicking on **Recent**, the user subscription name does not appear.

<!-- 3060156 - IS ASDK --> 
- Fixed an issue in both the administrator and user portals: clicking on the portal settings and selecting **Delete all settings and private dashboards** did not work as expected. An error notification was displayed. 

<!-- 2930799 - IS ASDK --> 
- Fixed an issue in both the administrator and user portals: under **All services**, the asset **DDoS protection plans** was incorrectly listed. It is not available in Azure Stack.
 
<!--2760466 – IS  ASDK --> 
- Fixed: when you installed a new Azure Stack environment, the alert that indicates *Activation Required* might not display.

<!--1236441 – IS  ASDK --> 
- Fixed an issue that prevented applying RBAC policies to a user group when using ADFS.

<!--3463840 - IS, ASDK --> 
- Fixed issue with infrastructure backups failing due to inaccessible file server from the public VIP network. This fix moves the infrastructure backup service back to the public infrastructure network. If you applied the [Azure Stack Hotfix 1.1809.6.102](https://support.microsoft.com/en-us/help/4477849) that addresses this issue, the 1811 update will not make any further modifications.  

### Changes

None.

### Common Vulnerabilities and Exposures

This update installs the following security updates:  

- [ADV180022](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180022)
- [CVE-2018-0965](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-0965)
- [CVE-2018-8271](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8271)
- [CVE-2018-8320](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8320)
- [CVE-2018-8330](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8330)
- [CVE-2018-8332](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8332)
- [CVE-2018-8333](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8333)
- [CVE-2018-8335](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8335)
- [CVE-2018-8392](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8392)
- [CVE-2018-8393](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8393)
- [CVE-2018-8410](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8410)
- [CVE-2018-8411](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8411)
- [CVE-2018-8413](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8413)
- [CVE-2018-8419](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8419)
- [CVE-2018-8420](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8420)
- [CVE-2018-8423](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8423)
- [CVE-2018-8424](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8424)
- [CVE-2018-8433](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8433)
- [CVE-2018-8434](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8434)
- [CVE-2018-8435](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8435)
- [CVE-2018-8438](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8438)
- [CVE-2018-8439](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8439)
- [CVE-2018-8440](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8440)
- [CVE-2018-8442](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8442)
- [CVE-2018-8443](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8443)
- [CVE-2018-8446](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8446)
- [CVE-2018-8449](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8449)
- [CVE-2018-8453](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8453)
- [CVE-2018-8455](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8455)
- [CVE-2018-8462](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8462)
- [CVE-2018-8468](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8468)
- [CVE-2018-8472](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8472)
- [CVE-2018-8475](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8475)
- [CVE-2018-8481](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8481)
- [CVE-2018-8482](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8482)
- [CVE-2018-8484](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8484)
- [CVE-2018-8486](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8486)
- [CVE-2018-8489](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8489)
- [CVE-2018-8490](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8490)
- [CVE-2018-8492](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8492)
- [CVE-2018-8493](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8493)
- [CVE-2018-8494](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8494)
- [CVE-2018-8495](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8495)
- [CVE-2018-8497](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2018-8497)

For more information about these vulnerabilities, click on the preceding links, or see Microsoft Knowledge Base articles [4457131](https://support.microsoft.com/help/4457131) and [4462917](https://support.microsoft.com/help/4462917).

### Prerequisites

> [!Important]  
> Get your Azure Stack deployment ready for extension host. Prepare your system using the following guidance, [Prepare for extension host for Azure Stack](azure-stack-extension-host-prepare.md).

- Install the latest Azure Stack Hotfix for 1809 before updating to 1811. For more information, see [KB 4471993 – Azure Stack Hotfix Azure Stack Hotfix 1.1809.3.96](https://support.microsoft.com/help/4471993/).

Seth:  The latest Hotfix for 1809 as of today is https://support.microsoft.com/en-us/help/4477849/azure-stack-hotfix-1-1809-6-102

  > [!TIP]  
  > Subscribe to the following *RRS* or *Atom* feeds to keep up with Azure Stack Hotfixes:
  > - RRS: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/rss … 
  > - Atom: https://support.microsoft.com/app/content/api/content/feeds/sap/en-us/32d322a8-acae-202d-e9a9-7371dccf381b/atom …


- Before you start installation of this update, run [Test-AzureStack](azure-stack-diagnostic-test.md) with the following parameters to validate the status of your Azure Stack and resolve any operational issues found, including all warnings and failures. Also review active alerts, and resolve any that require action.  

  ```PowerShell
  Test-AzureStack -Include AzsControlPlane, AzsDefenderSummary, AzsHostingInfraSummary, AzsHostingInfraUtilization, AzsInfraCapacity, AzsInfraRoleSummary, AzsPortalAPISummary, AzsSFRoleSummary, AzsStampBMCSummary
  ``` 

- The Azure Stack 1811 update requires that you have properly imported the mandatory extension host certificates into your Azure Stack environment. For more information on these certificates see [this article](azure-stack-extension-host-prepare.md). If you do not properly import the mandatory extension host certificates and begin the 1811 update, it may fail with the following error:

   ```shell
   Type 'VerifyHostingServiceCerts' of Role 'WAS' raised an exception: 
   The Certificate path does not exist: \\SU1FileServer\SU1_Infrastructure_1\WASRole\ExternalCertificates\Hosting.Admin.SslCertificate.pfx
   ``` 
 
In addition to various quality improvements, the [1.1809.3.96 Hotfix](https://support.microsoft.com/help/4471993/) includes a check for properly imported extension host certificates. You may receive the following Warning in the Alerts blade if you haven't performed the required steps: 
 
`
Missing SSL certificates. SSL certificates for Extension Host not detected. The required SSL certificates for Extension Host have not been imported. If you are missing the required SSL certificates, the Azure Stack update fails.
`

   Once you have properly imported the mandatory extension host certificates, you can simply resume the 1811 update from the Administrator portal. While Microsoft advises Azure Stack operators to place the scale unit into maintenance mode during the update process, a failure due to the missing extension host certificates should not impact existing workloads or services.  

### Known issues with the update process

- When you run [Test-AzureStack](azure-stack-diagnostic-test.md), a warning message from the Baseboard Management Controller (BMC) is displayed. You can safely ignore this warning.

- <!-- 2468613 - IS --> During installation of this update, you might see alerts with the title *Error – Template for FaultType UserAccounts.New is missing.*  You can safely ignore these alerts. These alerts will close automatically after installation of this update completes.

- <!-- 3139614 | IS --> If you've applied an update to Azure Stack from your OEM, the **Update available** notification may not appear in the Azure Stack Admin portal. To install the Microsoft update, download and import it manually using the instructions located here [Apply updates in Azure Stack](azure-stack-apply-updates.md).

### Post-update steps



After the installation of this update, install any applicable Hotfixes. For more information view the following knowledge base articles, as well as our [Servicing Policy](azure-stack-servicing-policy.md).  
<!-- Hotfix link here -->  

## Known issues (post-installation)

The following are post-installation known issues for this build version.

### Portal

- The Azure Stack technical documentation focuses on the latest release. Due to portal changes between releases, what you see when using the Azure Stack portals might vary from what you see in the documentation.


<!-- 2930820 - IS ASDK --> 
- In both the administrator and user portals, if you search for "Docker," the item is incorrectly returned. It is not available in Azure Stack. If you try to create it, a blade with an error indication is displayed. 

<!-- 2967387 – IS, ASDK --> 
- The account you use to sign in to the Azure Stack admin or user portal displays as **Unidentified user**. This message is displayed when the account does not have either a *First* or *Last* name specified. To work around this issue, edit the user account to provide either the First or Last name. You must then sign out and then sign back in to the portal.  

<!--  2873083 - IS ASDK --> 
-  When you use the portal to create a virtual machine scale set (VMSS), the *instance size* dropdown doesn’t load correctly when you use Internet Explorer. To work around this problem, use another browser while using the portal to create a VMSS.  

<!-- 2931230 – IS  ASDK --> 
- Plans that are added to a user subscription as an add-on plan cannot be deleted, even when you remove the plan from the user subscription. The plan will remain until the subscriptions that reference the add-on plan are also deleted. 

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
   
  Run the [Test-AzureStack](azure-stack-diagnostic-test.md) cmdlet to verify the health of the infrastructure role instances and scale unit nodes. If no issues are detected by [Test-AzureStack](azure-stack-diagnostic-test.md), you can ignore these alerts. If an issue is detected, you can attempt to start the infrastructure role instance or node using the admin portal or PowerShell.

  This issue is fixed in the latest [1809 hotfix release](https://support.microsoft.com/help/4471993/), so be sure to install this hotfix if you're experiencing the issue. 

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
- You might see an alert for the **Storage** component that has the following details:

   - NAME: Storage service internal communication error  
   - SEVERITY: Critical  
   - COMPONENT: Storage  
   - DESCRIPTION: Storage service internal communication error occurred when sending requests to the following nodes.  

    The alert can be safely ignored, but you need to close the alert manually.

<!-- 2368581 - IS, ASDK --> 
- An Azure Stack operator, if you receive a low memory alert and tenant virtual machines fail to deploy with a **Fabric VM creation error**, it is possible that the Azure Stack stamp is out of available memory. Use the [Azure Stack Capacity Planner](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822) to best understand the capacity available for your workloads.

### Compute

<!-- 3235634 – IS, ASDK -->
- To deploy VMs with sizes containing a **v2** suffix; for example, **Standard_A2_v2**, please specify the suffix as **Standard_A2_v2** (lowercase v). Do not use **Standard_A2_V2** (uppercase V). This works in global Azure and is an inconsistency on Azure Stack.

<!-- 3099544 – IS, ASDK --> 
- When you create a new virtual machine (VM) using the Azure Stack portal, and you select the VM size, the USD/Month column is displayed with an **Unavailable** message. This column should not appear; displaying the VM pricing column is not supported in Azure Stack.

<!-- 2869209 – IS, ASDK --> 
- When using the [**Add-AzsPlatformImage** cmdlet](https://docs.microsoft.com/powershell/module/azs.compute.admin/add-azsplatformimage?view=azurestackps-1.4.0), you must use the **-OsUri** parameter as the storage account URI where the disk is uploaded. If you use the local path of the disk, the cmdlet fails with the following error: *Long running operation failed with status ‘Failed’*. 

<!--  2795678 – IS, ASDK --> 
- When you use the portal to create virtual machines (VM) in a premium VM size (DS,Ds_v2,FS,FSv2), the VM is created in a standard storage account. Creation in a standard storage account does not affect functionally, IOPs, or billing. 

   You can safely ignore the warning that says: *You've chosen to use a standard disk on a size that supports premium disks. This could impact operating system performance and is not recommended. Consider using premium storage (SSD) instead.*

<!-- 2967447 - IS, ASDK --> 
- The virtual machine scale set (VMSS) creation experience provides CentOS-based 7.2 as an option for deployment. Because that image is not available on Azure Stack, either select another OS for your deployment or use an Azure Resource Manager template specifying another CentOS image that has been downloaded prior to deployment from the marketplace by the operator.  

<!-- 2724873 - IS --> 
- When using the PowerShell cmdlets **Start-AzsScaleUnitNode** or  **Stop-AzsScaleunitNode** to manage scale units, the first attempt to start or stop the scale unit might fail. If the cmdlet fails on the first run, run the cmdlet a second time. The second run should succeed to complete the operation. 

<!-- TBD - IS ASDK --> 
- If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

<!-- 1662991 IS ASDK --> 
- Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings.  

<!-- 2724961- IS ASDK --> 
- When you register the **Microsoft.Insight** resource provider in Subscription settings, and create a Windows VM with Guest OS Diagnostic enabled, the CPU Percentage chart in the VM overview page doesn't show metrics data.

   To find metrics data, such as the CPU Percentage chart for the VM, go to the Metrics window and show all the supported Windows VM guest metrics.



### Networking  

<!-- 1766332 - IS ASDK --> 
- Under **Networking**, if you click **Create VPN Gateway** to set up a VPN connection, **Policy Based** is listed as a VPN type. Do not select this option. Only the **Route Based** option is supported in Azure Stack.

<!-- 1902460 - IS ASDK --> 
- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

<!-- 16309153 - IS ASDK --> 
- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.

<!-- 2529607 - IS ASDK --> 
- During Azure Stack *Secret Rotation*, there is a period in which Public IP Addresses are unreachable for two to five minutes.

<!-- 2664148 - IS ASDK --> 
-	In scenarios where the tenant is accessing their virtual machines by using a S2S VPN tunnel, they might encounter a scenario where connection attempts fail if the on-premises subnet was added to the Local Network Gateway after gateway was already created. 


<!-- ### SQL and MySQL-->


### App Service

<!-- 2352906 - IS ASDK --> 
- Users must register the storage resource provider before they create their first Azure Function in the subscription.


### Usage  

<!-- TBD - IS ASDK --> 
- The public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you cannot use this data to perform accurate accounting of public IP address usage.


<!-- #### Identity -->
<!-- #### Marketplace -->


## Download the update

You can download the Azure Stack 1811 update package from [here](https://aka.ms/azurestackupdatedownload).
  

## Next steps

- To review the servicing policy for Azure Stack integrated systems, and what you must do to keep your system in a supported state, see [Azure Stack servicing policy](azure-stack-servicing-policy.md).  
- To use the Privileged End Point (PEP) to monitor and resume updates, see [Monitor updates in Azure Stack using the privileged endpoint](azure-stack-monitor-update.md).  
- For an overview of the update management in Azure Stack, see [Manage updates in Azure Stack overview](azure-stack-updates.md).  
- For more information about how to apply updates with Azure Stack, see [Apply updates in Azure Stack](azure-stack-apply-updates.md).  
