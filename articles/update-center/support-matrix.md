---
title: Update management center (preview) support matrix
description: Provides a summary of supported regions and operating system settings
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 04/21/2022
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

### First party updates on Windows
By default, the Windows Update client is configured to provide updates only for Windows. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other products, including security patches for Microsoft SQL Server and other Microsoft software. You can configure this option if you have downloaded and copied the latest [Administrative template files](https://support.microsoft.com/help/3087759/how-to-create-and-manage-the-central-store-for-group-policy-administra) available for Windows 2016 and later.

If you have machines running Windows Server 2012 R2, you can't configure this setting through **Group Policy**. Run the following PowerShell command on these machines:

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceManager.Services
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```
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
Australia | Australia East
United States | East US </br> South Central-US </br> West Central-US </br> West US 2
Europe | North Europe </br> West Europe
Asia | South East Asia
United Kingdom | UK South

---

## Supported operating systems

The following table lists the supported operating systems for Azure VMs and Azure Arc-enabled servers. Before you enable update management center (preview), ensure that the target machines meet the operating system requirements.

>[!NOTE]
> For Azure VMs, we currently support a combination of Offer, Publisher, and SKU of the VM image. Ensure you match all three to confirm support.

# [Azure VMs](#tab/azurevm-os)

[Azure VMs](../virtual-machines/index.yml) are: 
 
   | Publisher | Operating System | SKU |
   |----------|-------------|-------------|
   | Canonical | UbuntuServer | 16.04-LTS, 18.04-LTS |
   | Canonical | 0001-com-ubuntu-server-focal | 20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-focal | pro-20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-bionic | pro-18_04-LTS |
   | Red Hat | RHEL | 7-RAW, 7-LVM, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7_9, 8, 8.1, 8.2, 8_3, 8-LVM |    
   | Red Hat | RHEL-RAW | 8-RAW |     
   | OpenLogic | CentOS | 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7_8, 7_9, 8.0, 8_1, 8_2, 8_3 |
   | OpenLogic | CentOS-LVM | 7-LVM, 8-LVM |
   | SUSE | SLES-12-SP5 | Gen1, Gen2 |
   | SUSE | SLES-15-SP2 | Gen1, Gen2 |
   | MicrosoftWindowsServer  | WindowsServer | 2022-datacenter </br> 2022-datacenter-g2 </br> 2022-datacenter-azure-edition</br> 2022-datacenter-azure-edition-smalldisk </br> 2022-datacenter-core-g2 </br> |
   | MicrosoftWindowsServer	 | WindowsServer | 2019-Datacenter</br> 2019-Datacenter-Core</br> 2019-datacenter-gensecond </br> 2019-Datacenter-smalldisk </br> 2019-Datacenter-with-Containers </br> 2019-datacenter-with-Containers </br> 2019-Datacenter-Server-Core |
   | MicrosoftWindowsServer	 | WindowsServer | 2016-Datacenter</br> 2016-datacenter-gensecond</br> 2016-Datacenter-smalldisk </br> 2016-Datacenter-Server-Core </br> 2016-Datacenter-Server-Containers |
   | MicrosoftWindowsServer | MicrosoftServerOperatingSystems-Previews | Windows-Server-2022-Azure-Edition-Preview, Windows-Server-2019-Azure-Edition-Preview |
   | MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 |
   | MicrosoftVisualStudio | VisualStudio | VS-2017-ENT-Latest-WS2016 | 
   
   >[!NOTE]
   > Custom images are currently not supported.

# [Azure Arc-enabled servers](#tab/azurearc-os)

[Azure Arc-enabled servers](../azure-arc/servers/overview.md) are:

   | Publisher | Operating System
   |----------|-------------|
   | Microsoft Corporation | Windows Server 2012 R2 and higher (including Server Core) |
   | Microsoft Corporation | Windows Server 2008 R2 SP1 with PowerShell enabled and .NET Framework 4.0+ |
   | Canonical | Ubuntu 16.04, 18.04, and 20.04 LTS (x64) |
   | Red Hat | CentOS Linux 7 and 8 (x64) |   
   | SUSE | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat | Red Hat Enterprise Linux (RHEL) 7 and 8 (x64) |    
   | Amazon | Amazon Linux 2 (x64)   |
   | Oracle | Oracle 7.x |       

---

As the Update management center (preview) depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client are enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [configure Windows Update settings](configure-wu-agent.md).
 
 > [!NOTE]
 > For patching, update management center (preview) relies on classification data available on the machine. Unlike other distributions, CentOS YUM package manager does not have this information available in the RTM version to classify updates and packages in different categories.


## Next steps
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via Portal](manage-update-settings.md)