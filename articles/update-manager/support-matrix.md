---
title: Azure Update Manager support matrix
description: This article provides a summary of supported regions and operating system settings.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 05/24/2024
ms.topic: overview
ms.custom: references_regions
---

# Support matrix for Azure Update Manager

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly.

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager. The article includes the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure virtual machines (VMs) or machines managed by Azure Arc-enabled servers.

## Supported update sources

**Windows**: [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) reports to Microsoft Update by default, but you can configure it to report to [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus). If you configure WUA to report to WSUS, based on the last synchronization from WSUS with Microsoft Update, the results in Update Manager might differ from what Microsoft Update shows.

To specify sources for scanning and downloading updates, see [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings?branch=main#specify-intranet-microsoft-update-service-location). To restrict machines to the internal update service, see [Don't connect to any Windows Update internet locations](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates?branch=main#do-not-connect-to-any-windows-update-internet-locations).

**Linux**: You can configure Linux machines to report to a local or public YUM or APT package repository. The results shown in Update Manager depend on where the machines are configured to report.

## Supported update types

The following types of updates are supported.

### Operating system updates

Update Manager supports operating system updates for both Windows and Linux.

Update Manager doesn't support driver updates.

### Extended Security Updates (ESU) for Windows Server

Using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012 / R2 machines. To enroll in Windows Server 2012 Extended Security Updates, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2.](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc)

### First-party updates on Windows

By default, the Windows Update client is configured to provide updates only for the Windows operating system. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products. Updates include security patches for Microsoft SQL Server and other Microsoft software.

Use one of the following options to perform the settings change at scale:

- For servers configured to patch on a schedule from Update Manager (with virtual machine `PatchSettings` set to `AutomaticByPlatform = Azure-Orchestrated`), and for all Windows Servers running on an earlier operating system than Windows Server 2016, run the following PowerShell script on the server you want to change:

    ```powershell
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
    ```

- For servers running Windows Server 2016 or later that aren't using Update Manager scheduled patching (with virtual machine `PatchSettings` set to `AutomaticByOS = Azure-Orchestrated`), you can use Group Policy to control this process by downloading and using the latest Group Policy [Administrative template files](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

> [!NOTE]
> Run the following PowerShell script on the server to disable first-party updates:
>
> ```powershell
> $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
> $ServiceManager.Services
> $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
> $ServiceManager.RemoveService($ServiceId)
> ```

### Third party updates

**Windows**: Update Manager relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. This scenario allows Update Manager to update machines that use Configuration Manager as their update repository with third party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

**Linux**: If you include a specific third party software repository in the Linux package manager repository location, it's scanned when it performs software update operations. The package isn't available for assessment and installation if you remove it.

Update Manager doesn't support managing the Configuration Manager client.

## Supported regions

Update Manager scales to all regions for both Azure VMs and Azure Arc-enabled servers. The following table lists the Azure public cloud where you can use Update Manager.

#### [Azure Public cloud](#tab/public)

### Azure VMs

Azure Update Manager is available in all Azure public regions where compute virtual machines are available.

### Azure Arc-enabled servers


Azure Update Manager is currently supported in the following regions. It implies that VMs must be in the following regions.

**Geography** | **Supported regions**
--- | ---
Africa | South Africa North
Asia Pacific | East Asia </br> South East Asia
Australia | Australia East </br> Australia Southeast
Brazil | Brazil South
Canada | Canada Central </br> Canada East
Europe | North Europe </br> West Europe
France | France Central
Germany | Germany West Central
India | Central India
Japan | Japan East
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
UAE | UAE North
United Kingdom | UK South </br> UK West
United States | Central US </br> East US </br> East US 2</br> North Central US </br> South Central US </br> West Central US </br> West US </br> West US 2 </br> West US 3

#### [Azure for US Government (preview)](#tab/gov)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
United States | USGovVirginia </br>  USGovArizona </br> USGovTexas | For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For Azure VMs only

#### [Azure operated by 21Vianet (preview)](#tab/21via)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
China | ChinaEast </br> ChinaEast3 </br>  ChinaNorth </br> ChinaNorth3 </br> ChinaEast2 </br>  ChinaNorth2 | For Azure VMs only </br> For Azure VMs only </br> For Azure VMs only </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers.


---

## Supported operating systems

>[!NOTE]
> - All operating systems are assumed to be x64. For this reason, x86 isn't supported for any operating system.
> - Update Manager doesn't support virtual machines created from CIS-hardened images.

### Support for Azure Update Manager operations

- [Periodic assessment, Schedule patching, On-demand assessment, and On-demand patching](#support-for-all-other-azure-update-manager-operations)
- [Automatic VM guest patching](#support-for-automatic-vm-guest-patching)


### Support for automatic VM Guest patching

If [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) is enabled on a VM, then the available Critical and Security patches are downloaded and applied automatically on the VM.

- For marketplace images, see the list of [supported OS images](../virtual-machines/automatic-vm-guest-patching.md#supported-os-images).
- For VMs created from customized images even if the Patch orchestration mode is set to `Azure Orchestrated/AutomaticByPlatform`, automatic VM guest patching doesn't work. We recommend that you use scheduled patching to patch the machines by defining your own schedules or install updates on-demand.

### Support for all other Azure Update Manager operations

Azure Update Manager supports the following operations:

- [periodic assessment](assessment-options.md#periodic-assessment)
- [scheduled patching](prerequsite-for-schedule-patching.md)
- [on-demand assessment](assessment-options.md#check-for-updates-nowon-demand-assessment), and patching is described in the following sections:

# [Azure VMs](#tab/azurevm-os)

### Azure Marketplace/PIR images

The Azure Marketplace image has the following attributes:

- **Publisher**: The organization that creates the image. Examples are `Canonical` and `MicrosoftWindowsServer`.
- **Offer**: The name of the group of related images created by the publisher. Examples are `UbuntuServer` and `WindowsServer`.
- **SKU**: An instance of an offer, such as a major release of a distribution. Examples are `18.04LTS` and `2019-Datacenter`.
- **Version**: The version number of an image SKU.

Update Manager supports the following operating system versions on VMs for all operations except automatic VM guest patching. You might experience failures if there are any configuration changes on the VMs, such as package or repository.

Following is the list of supported images and no other marketplace images released by any other publisher are supported for use with Azure Update Manager.

#### Supported Windows OS versions

| **Publisher**| **Offer** | **SKU**|  **Unsupported image(s)** |
|----------|-------------|-----| ---|
|microsoftwindowsserver | windows server | * | windowsserver 2008|
|microsoftbiztalkserver | biztalk-server | *|
|microsoftdynamicsax | dynamics | * |
|microsoftpowerbi |* |* |
|microsoftsharepoint | microsoftsharepointserver | *|
|microsoftvisualstudio | Visualstudio* |  *-ws2012r2 </br> *-ws2016-ws2019 </br> *-ws2022 |
|microsoftwindowsserver | windows-cvm | * |
|microsoftwindowsserver | windowsserverdotnet | *|
|microsoftwindowsserver | windowsserver-gen2preview | *|
|microsoftwindowsserver | windowsserverupgrade | * |
|microsoftwindowsserver | windowsserverhotpatch-previews | windows-server-2022-azure-edition-hotpatch |
| | microsoftserveroperatingsystems-previews | windows-server-vnext-azure-edition-core |
|microsoftwindowsserverhpcpack | windowsserverhpcpack | * |
|microsoftsqlserver | sql2016sp1-ws2016 | standard |
| | sql2016sp2-ws2016 | standard|
| | sql2017-ws2016 | standard|
| | sql2017-ws2016 | enterprise |
| | sql2019-ws2019 | enterprise |
| | sql2019-ws2019 | sqldev|
| | sql2019-ws2019 | standard |
| | sql2019-ws2019 | standard-gen2|
|microsoftazuresiterecovery  | process-server | windows-2012-r2-datacenter |

#### Supported Linux OS versions

| **Publisher**| **Offer** | **SKU**| **Unsupported image(s)**  |
|----------|-------------|-----|----|
|canonical | * | *||
|microsoftsqlserver | * | * | **Offers**: sql2019-sles* </br> sql2019-rhel7 </br> sql2017-rhel 7 </br></br> Example  </br> Publisher: </br> microsoftsqlserver </br> Offer: sql2019-sles12sp5 </br> sku:webARM </br></br> Publisher: microsoftsqlserver </br> Offer: sql2019-rhel7 </br> sku: web-ARM | 
|microsoftsqlserver | * | *|**Offers**:  sql2019-sles*</br> sql2019-rhel7 </br> sql2017-rhel7 |
|microsoftcblmariner | cbl-mariner | cbl-mariner-1 </br> 1-gen2 </br> cbl-mariner-2 </br> cbl-mariner-2-gen2. | |
|microsoft-aks | aks |aks-engine-ubuntu-1804-202112 | |
|microsoft-dsvm |aml-workstation |  ubuntu-20, ubuntu-20-gen2 | |
|redhat | rhel| 7*,8*,9* | 74-gen2 |
|redhat | rhel-ha | 8* | 8.1, 81_gen2 |
|redhat | rhel-raw | 7*,8*,9* | |
|redhat | rhel-sap | 7*| 7.4, 7.5, 7.7 |
|redhat | sap-apps | 7*, 8* |
|redhat | rhel-sap* | 9_0 |
|redhat | rhel-sap-ha| 7*, 8* | 7.5|
|redhat | rhel-sap-apps | 90sapapps-gen2 |
|redhat | rhel-sap-ha | 90sapha-gen2 |
|suse | opensuse-leap-15-* | gen* |
|suse | sles-12-sp5-* | gen* |
|suse | sles-sap-12-sp5* |gen*  |
|suse | sles-sap-15-* | gen* | **Offer**: sles-sap-15-\*-byos  </br></br> **Sku**: gen\* </br> Example </br> Publisher: suse </br> Offer: sles-sap-15-sp3-byos </br> sku: gen1-ARM  |
|suse | sles-12-sp5 | gen1, gen2 |
|suse | sles-15-sp2 | gen1, gen2 |
| |sle-hpc-15-sp4 | gen1, gen2 |
| | sles| 12-sp4-gen2 |
| | sles-15-sp1-sapcal | gen1, gen2 |
| | sles-15-sp2-basic  | gen2 |
| | sles-15-sp2-hpc | gen2 |
| | sles-15-sp3-sapcal | gen1, gen2 |
| | sles-15-sp4 | gen1, gen2 |
| | sles-byos | 12-sp4, 12-sp4-gen2 |
| | sles-sap | 12-sp4, 12-sp4-gen2 |
| | sles-sap-byos | 12-sp4, 12-sp4-gen2, gen2-12-sp4 |
| | sles-sapcal | 12-sp3 |
| | sles-standard | 12-sp4-gen2 |
|oracle | oracle-linux | 7*, ol7*, ol8*, ol9*, ol9-lvm*, 8, 8-ci, 81, 81-ci, 81-gen2 |
| | oracle-database | oracle_db_21 |
| | oracle-database-19-3 | oracle-database-19-0904 |
|microsoftcblmariner| cbl-mariner | cbl-mariner-1,1-gen2, cbl-mariner-2, cbl-mariner-2-gen2 |
| openlogic | centos | 7.2, 7.3, 7.4, 7.5, 7.6, 7_8, 7_9, 7_9-gen2 |
| |centos-hpc | 7.1, 7.3, 7.4 |
| |centos-lvm | 7-lvm, 8-lvm |
| |centos-ci | 7-ci |
| |centos-lvm | 7-lvm-gen2 |

### Custom images

We support VMs created from customized images (including images uploaded to [Azure Compute gallery](../virtual-machines/linux/tutorial-custom-images.md#overview)) and the following table lists the operating systems that we support for all Azure Update Manager operations except automatic VM guest patching. For instructions on how to use Update Manager to manage updates on VMs created from custom images, see [Manage updates for custom images](manage-updates-customized-images.md).


   |**Windows operating system**|
   |---|
   |Windows Server 2022|
   |Windows Server 2019|
   |Windows Server 2016|
   |Windows Server 2012 R2|
   |Windows Server 2012|
  

   |**Linux operating system**|
   |---|
   |CentOS 7, 8|
   |Oracle Linux 7.x, 8x|
   |Red Hat Enterprise 7, 8, 9|
   |SUSE Linux Enterprise Server 12.x, 15.0-15.4|
   |Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS|


# [Azure Arc-enabled servers](#tab/azurearc-os)

The following table lists the operating systems supported on [Azure Arc-enabled servers](../azure-arc/servers/overview.md).

   |**Operating system**|
   |-------------|
   | Amazon Linux 2023 |
   | Windows Server 2012 R2 and higher (including Server Core) |
   | Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS |
   | CentOS Linux 7 and 8 (x64) |
   | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |
   | Amazon Linux 2 (x64)   |
   | Oracle 7.x, 8.x|
   | Debian 10 and 11|
   | Rocky Linux 8|

---

## Unsupported workloads

The following table lists the workloads that aren't supported.

   | **Workloads**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual Machine Scale Sets| We recommend that you use [Automatic upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) to patch the Virtual Machine Scale Sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).

## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
