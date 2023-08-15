---
title: Update management center (preview) support matrix
description: Provides a summary of supported regions and operating system settings.
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/11/2023
ms.topic: overview
ms.custom: references_regions
---

# Support matrix for update management center (preview)

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by update management center (preview) including the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure VMs or machines managed by Arc-enabled servers. 

## Update sources supported

**Windows**: [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) reports to Microsoft Update by default, but you can configure it to report to [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus). If you configure WUA to report to WSUS, based on the WSUS's last synchronization with Microsoft update, the results in the update management center (preview) might differ  to what the Microsoft update shows. You can specify sources for scanning and downloading updates using [specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings?branch=main#specify-intranet-microsoft-update-service-location). To restrict machines to the internal update service, see [Do not connect to any Windows Update Internet locations](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates?branch=main#do-not-connect-to-any-windows-update-internet-locations)

**Linux**: You can configure Linux machines to report to a local or public YUM or APT package repository. The results shown in update management center (preview) depend on where the machines are configured to report.

## Types of updates supported

### Operating system updates
Update management center (preview) supports operating system updates for both Windows and Linux.

> [!NOTE]
> Update management center (preview) doesn't support driver Updates. 

### First party updates on Windows
By default, the Windows Update client is configured to provide updates only for Windows operating system. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products, including security patches for Microsoft SQL Server and other Microsoft software. 

Use one of the following options to perform the settings change at scale:

- For Servers configured to patch on a schedule from Update management center (that has the VM PatchSettings set to AutomaticByPlatform = Azure-Orchestrated), and for all Windows Servers running on an earlier operating system than server 2016, Run the following PowerShell script on the server you want to change.

    ```powershell
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
    ```
- For servers running Server 2016 or later which are not using Update management center scheduled patching (that has the VM PatchSettings set to AutomaticByOS = Azure-Orchestrated) you can use Group Policy to control this by downloading and using the latest Group Policy [Administrative template files](https://learn.microsoft.com/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

> [!NOTE]
> Run the following PowerShell script on the server to disable first party updates.
> ```powershell
> $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")  
> $ServiceManager.Services 
> $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
> $ServiceManager.RemoveService($ServiceId)
> ```

### Third-party updates

**Windows**: Update Management relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. This scenario allows update management to update machines that use Configuration Manager as their update repository with third-party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

**Linux**: If you include a specific third party software repository in the Linux package manager repository location, it is scanned when it performs software update operations. The package won't be available for assessment and installation if you remove it.


## Supported regions

Update management center (preview) will scale to all regions for both Azure VMs and Azure Arc-enabled servers. Listed below are the Azure public cloud where you can use update management center (preview).

# [Azure virtual machine](#tab/azurevm)

Update management center (preview) is available in all Azure public regions where compute virtual machines are available.

# [Azure Arc-enabled servers](#tab/azurearc)
Update management center (preview) is supported in the following regions currently. It implies that VMs must be in below regions:

**Geography** | **Supported Regions**
--- | ---
Africa | South Africa North
Asia Pacific | East Asia </br> South East Asia
Australia | Australia East
Brazil | Brazil South
Canada | Canada Central
Europe | North Europe </br> West Europe
France | France Central
India | Central India
Japan | Japan East
Korea | Korea Central
Switzerland | Switzerland North
United Kingdom | UK South </br> UK West
United States | Central US </br> East US </br> East US 2</br> North Central US </br> South Central US </br> West Central US </br> West US </br> West US 2 </br> West US 3  

---

## Supported operating systems

> [!NOTE]
> - All operating systems are assumed to be x64. x86 isn't supported for any operating system.
> - Update management center (preview) doesn't support CIS hardened images.

# [Azure VMs](#tab/azurevm-os)

> [!NOTE]
> Currently, update management center has the following limitations regarding the operating system support: 
> - Marketplace images other than the [list of supported marketplace OS images](../virtual-machines/automatic-vm-guest-patching.md#supported-os-images) are currently not supported.
> - [Specialized images](../virtual-machines/linux/imaging.md#specialized-images) and **VMs created by Azure Migrate, Azure Backup, Azure Site Recovery** aren't fully supported for now. However, you can **use on-demand operations such as one-time update and check for updates** in update management center (preview). 
>
> For the above limitations, we recommend that you use [Automation update management](../automation/update-management/overview.md) till the support is available in Update management center (preview).

**Marketplace/PIR images**

Currently, we support a combination of Offer, Publisher, and Sku of the image. Ensure that you match all the three to confirm support. For more information, see [list of supported marketplace OS images](../virtual-machines/automatic-vm-guest-patching.md#supported-os-images). 

**Custom images**

We support [generalized](../virtual-machines/linux/imaging.md#generalized-images) custom images. Table below lists the operating systems that we support for generalized images. Refer to [custom images (preview)](manage-updates-customized-images.md) for instructions on how to start using Update manage center to manage updates on custom images.

   |**Windows Operating System**|
   |-- |
   |Windows Server 2022|
   |Windows Server 2019|
   |Windows Server 2016|
   |Windows Server 2012 R2|
   |Windows Server 2012|
   |Windows Server 2008 R2 (RTM and SP1 Standard)|


   |**Linux Operating System**|
   |-- |
   |CentOS 7, 8|
   |Oracle Linux 7.x, 8x|
   |Red Hat Enterprise 7, 8, 9|
   |SUSE Linux Enterprise Server 12.x, 15.0-15.4|
   |Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS|


# [Azure Arc-enabled servers](#tab/azurearc-os)

The table lists the operating systems supported on [Azure Arc-enabled servers](../azure-arc/servers/overview.md) are:

   |**Operating System**|
   |-------------|
   | Windows Server 2012 R2 and higher (including Server Core) |
   | Windows Server 2008 R2 SP1 with PowerShell enabled and .NET Framework 4.0+ |
   | Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS |
   | CentOS Linux 7 and 8 (x64) |   
   | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |    
   | Amazon Linux 2 (x64)   |
   | Oracle 7.x, 8.x|
   | Debian 10 and 11|
   | Rocky Linux 8|        

---

## Unsupported Operating systems

The following table lists the operating systems that aren't supported:

   | **Operating system**| **Notes** 
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](https://learn.microsoft.com/mem/intune/) to manage updates.|
   | Virtual machine scale sets| We recommend that you use [Automatic upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) to patch the virtual machine scale sets.|
   | Azure Kubernetes Nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](https://learn.microsoft.com/azure/aks/node-updates-kured).|


As the Update management center (preview) depends on your machine's OS package manager or update service, ensure that the Linux package manager, or Windows Update client are enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [configure Windows Update settings](configure-wu-agent.md).
 

## Next steps
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via Portal](manage-update-settings.md)
