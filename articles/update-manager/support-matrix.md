---
title: Azure Update Manager support matrix
description: This article provides a summary of supported regions and operating system settings.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 08/01/2024
ms.topic: overview
ms.custom: references_regions
---

# Support matrix for Azure Update Manager

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Azure Update Manager will soon cease to support it. Please consider your use and planning accordingly. For more information, see the [CentOS End-Of-Life guidance](../virtual-machines/workloads/centos/centos-end-of-life.md).

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager. The article includes the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure virtual machines (VMs) or machines managed by Azure Arc-enabled servers.

## Supported operating systems

>[!NOTE]
> - All operating systems are assumed to be x64. For this reason, x86 isn't supported for any operating system.


### Support for automatic VM Guest patching

If [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) is enabled on a VM, then the available Critical and Security patches are downloaded and applied automatically on the VM.

- For marketplace images, see the list of [supported OS images](../virtual-machines/automatic-vm-guest-patching.md#supported-os-images).
- For VMs created from customized images even if the Patch orchestration mode is set to `Azure Orchestrated/AutomaticByPlatform`, automatic VM guest patching doesn't work. We recommend that you use scheduled patching to patch the machines by defining your own schedules or install updates on-demand.

### Support for Check for Updates/One time Update/Periodic assessment and Scheduled patching

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

| **Publisher**| **Offer** | **SKU**| **Plan** |**Unsupported image(s)** |
|----------|-------------|-----| ---| --- |
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
|microsoft-dvsm | dsvm-windows </br> dsvm-win-2019 </br> dsvm-win-2022 | * </br> * </br> * |
|microsoft-dsvm | ubuntu-1804||1804-gen2 ||
|microsoft-ads| windows-data-science-vm||windows2016 </br> windows2016byol||
| netapp |netapp-oncommand-cloud-manager||occm-byol||
| | cis-windows-server| | cis-windows-server2016-l1-gen1 </br> cis-windows-server2019-l1-gen1 </br> cis-windows-server2019-l1-gen2 </br> cis-windows-server2019-l2-gen1 </br> cis-windows-server2022-l1-gen2 </br> cis-windows-server2022-l2-gen2 </br> cis-windows-server2022-l1-gen1 | |
| | cis-windows-server-2022-l1| | cis-windows-server-2022-l1 </br> cis-windows-server-2022-l1-gen2 | |
| | cis-windows-server-2022-l2 | | cis-windows-server-2022-l2 </br> cis-windows-server-2022-l2-gen2 | |
| | cis-windows-server-2019-v1-0-0-l1 | | cis-ws2019-l1 ||
| | cis-windows-server-2019-v1-0-0-l2 | | cis-ws2019-l2 ||
| | cis-windows-server-2016-v1-0-0-l1 | | cis--l1 ||
| | cis-windows-server-2016-v1-0-0-l2 | | cis-ws2016-l2 ||
| | cis-windows-server-2012-r2-v2-2-1-l2 | |cis-ws2012-r2-l2 ||
|cognosys | sql-server-2016-sp2-std-win2016-debug-utilities ||sql-server-2016-sp2-std-win2016-debug-utilities|
|filemagellc| filemage-gateway-vm-win || filemage-gateway-vm-win-001 </br> filemage-gateway-vm-win-002 |
|github | github-enterprise|| github-enterprise||
|matillion | matillion || matillion-etl-for-snowflake||
| | hpc2019-windows-server-2019|| hpc2019-windows-server-2019||


#### Supported Linux OS versions

| **Publisher**| **Offer** | **SKU**| **Plan** |**Unsupported image(s)** |
|----------|-------------|-----| ---| --- |
|canonical | * | *|||
|microsoftsqlserver | * | * | |**Offers**: sql2019-sles* </br> sql2019-rhel7 </br> sql2017-rhel 7 </br></br> Example  </br> Publisher: </br> microsoftsqlserver </br> Offer: sql2019-sles12sp5 </br> sku:webARM </br></br> Publisher: microsoftsqlserver </br> Offer: sql2019-rhel7 </br> sku: web-ARM | 
|microsoftsqlserver | * | *||**Offers**:  sql2019-sles*</br> sql2019-rhel7 </br> sql2017-rhel7 |
|microsoftcblmariner | cbl-mariner | cbl-mariner-1 </br> 1-gen2 </br> cbl-mariner-2 </br> cbl-mariner-2-gen2. | |
|microsoft-aks | aks |aks-engine-ubuntu-1804-202112 | |
|microsoft-dsvm |aml-workstation |  ubuntu-20, ubuntu-20-gen2 | |
|microsoft-dsvm | aml-workstation | ubuntu |
|| ubuntu-hpc | 1804, 2004-preview-ndv5, 2004, 2204, 2204-preview-ndv5 |
|nginxinc| nginx-plus-ent-v1 || nginx-plus-ent-centos7 |
|ntegralinc1586961136942|ntg_oracle_8_7||ntg_oracle_8_7|
|| ubuntu-2004 | 2004, 2004-gen2 |
| | cis-rhel9-l1 | | cis-rhel9-l1 </br> cis-rhel9-l1-gen2 ||
| | cis-rhel-8-l1 | | | |
| | cis-rhel-8-l2 | | cis-rhel8-l2 | |
| | cis-rhel-7-l2| |  cis-rhel7-l2 | |
| | cis-rhel | | cis-redhat7-l1-gen1 </br> cis-redhat8-l1-gen1 </br> cis-redhat8-l2-gen1 </br>  cis-redhat9-l1-gen1 </br> cis-redhat9-l1-gen2| |
|| cis-ubuntu-linux-2204-l1 || cis-ubuntu-linux-2204-l1 </br> cis-ubuntu-linux-2204-l1-gen2 | |
|| cis-ubuntu-linux-2004-l1 ||cis-ubuntu2004-l1 </br> cis-ubuntu-linux-2204-l1-gen2||
|| cis-ubuntu-linux-2004-l1||cis-ubuntu2004-l1||
|| cis-ubuntu-linux-1804-l1|| cis-ubuntu1804-l1||
|| cis-ubuntu ||cis-ubuntu1804-l1 </br> cis-ubuntulinux2004-l1-gen1 </br> cis-ubuntulinux2204-l1-gen1 </br> cis-ubuntulinux2204-l1-gen2 ||
|| cis-oracle-linux-8-l1 ||cis-oracle8-l1||
|oracle | oracle-linux | 7*, ol7*, ol8*, ol9*, ol9-lvm*, 8, 8-ci, 81, 81-ci, 81-gen2 |
| | oracle-database | oracle_db_21 |
| | oracle-database-19-3 | oracle-database-19-0904 |
|microsoftcblmariner| cbl-mariner | cbl-mariner-1,1-gen2, cbl-mariner-2, cbl-mariner-2-gen2 |
| openlogic | centos | 7.2, 7.3, 7.4, 7.5, 7.6, 7_8, 7_9, 7_9-gen2 |
| |centos-hpc | 7.1, 7.3, 7.4 |
| |centos-lvm | 7-lvm, 8-lvm |
| |centos-ci | 7-ci |
| |centos-lvm | 7-lvm-gen2 |
|almalinux | almalinux </br> | 8-gen1, 8-gen2, 9-gen1, 9-gen2|
|Almalinux|almalinux-x86_64 | 8-gen1, 8-gen2, 8_7-gen2, 9-gen1, 9-gen2
||almalinux-hpc | 8_6-hpc, 8_6-hpc-gen2 |
| aviatrix-systems | aviatrix-bundle-payg  | aviatrix-enterprise-bundle-byol|
|| aviatrix-copilot |avx-cplt-byol-01, avx-cplt-byol-02 |
|| aviatrix-companion-gateway-v9 | aviatrix-companion-gateway-v9|
|| aviatrix-companion-gateway-v10 | aviatrix-companion-gateway-v10,</br> aviatrix-companion-gateway-v10u|
|| aviatrix-companion-gateway-v12 | aviatrix-companion-gateway-v12|
|| aviatrix-companion-gateway-v13 | aviatrix-companion-gateway-v13,</br> aviatrix-companion-gateway-v13u|
|| aviatrix-companion-gateway-v14 | aviatrix-companion-gateway-v14,</br> aviatrix-companion-gateway-v14u |
|| aviatrix-companion-gateway-v16 | aviatrix-companion-gateway-v16|
| belindaczsro1588885355210 |belvmsrv01 || belvmsrv003|| 
| cloudera | cloudera-centos-os||7_5||
| cloud-infrastructure-services |rds-farm-2019||rds-farm-2019|
|| ad-dc-2019||ad-dc-2019 |
|| sftp-2016 || sftp-2016|
|| ad-dc-2016 || ad-dc-2016|
|| dns-ubuntu-2004 || dns-ubuntu-2004|
|| servercore-2019|| servercore-2019|
|| ad-dc-2022 || ad-dc-2022 ||
|| squid-ubuntu-2004 || squid-ubuntu-2004|
| cncf-upstream | capi | ubuntu-1804-gen1, ubuntu-2004-gen1, ubuntu-2204-gen1 |
| credativ | debian | 9, 9-backports |
| debian | debian-10 | 10, 10-gen2,</br> 10-backports, </br> 10-backports-gen2 |
|| debian-10-daily | 10, 10-gen2,</br> 10-backports,</br> 10-backports-gen2|
|| debian-11 | 11, 11-gen2,</br> 11-backports, </br> 11-backports-gen2 |
|| debian-11-daily | 11, 11-gen2,</br>  11-backports, </br> 11-backports-gen2 |
|esri| arcgis-enterprise || byol-108 </br> byol-109 </br> byol-111 </br> byol-1081 </br> byol-1091|
|esri| arcgis-enterprise-106||byol-1061||
|esri | arcgis-enterprise-107||byol-1071||
|esri | pro-byol|| pro-byol-29||
|procomputers |almalinux-8-7||almalinux-8-7||
|procomputers | rhel-8-2 || rhel-8-2||
|RedHat | rhel || 8_9||
|redhat | rhel| 7*,8*,9* |  |
|redhat | rhel-ha | 8* | 81_gen2 |
|redhat | rhel-raw | 7*,8*,9* | |
|redhat | rhel-sap | 7*|  |
|redhat | sap-apps | 7*, 8* |
|redhat | rhel-sap* | 9_0 |
|redhat | rhel-sap-ha| 7*, 8* | |
|redhat | rhel-sap-apps | 90sapapps-gen2 |
|redhat | rhel-sap-ha | 90sapha-gen2 |
|redhat | rhel-byos || rhel-lvm79 </br> rhel-lvm79-gen2 </br> rhel-lvm8 </br> rhel-lvm82-gen2 </br> rhel-lvm83 </br> rhel-lvm84 </br> rhel-lvm84-gen2 </br> rhel-lvm85-gen2 </br> rhel-lvm86 </br> rhel-lvm86-gen2 </br> rhel-lvm87-gen2 </br> rhel-raw76 </br> |
|redhat | rhel-byos |rhel-lvm88 </br> rhel-lvm88-gent2 </br> rhel-lvm92 </br>rhel-lvm92-gen2 || |
| redhat | rhel | | 8.1||
| redhat | rhel-sap | | 7.4| |
| redhat | rhel-sap | | 7.7 |
| redhat | rhel | | 89-gen2 |
|| rhel-ha | 9_2, 9_2-gen2 |
|| rhel-sap-apps | 9_0, 90sapapps-gen2, 9_2, 92sapapps-gen2 | 
|| rhel-sap-ha |  9_2, 92sapha-gen2 |
| southrivertech1586314123192 | tn-ent-payg||Tnentpayg||
| southrivertech1586314123192 | tn-sftp-payg || Tnsftppayg ||
|suse | sles-sap-15-sp2-byos || gen2||
|suse | sles-15-sp5 || gen2 ||
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
|| sle-hpc-15-sp4-byos | gen1, gen2 |
|| sle-hpc-15-sp5-byos | gen1, gen 2 |
|| sle-hpc-15-sp5 |  gen1, gen 2 |
|| sles-15-sp4-byos | gen1, gen2 | 
|| sles-15-sp4-chost-byos | gen1, gen 2|
|| sles-15-sp4-hardened-byos | gen1, gen2 | 
|| sles-15-sp5-basic | gen1, gen2 |
|| sles-15-sp5-byos | gen1, gen2| 
|| sles-15-sp5-chost-byos | gen1, gen2 |
|| sles-15-sp5-hardened-byos | gen1, gen2 |
|| sles-15-sp5-sapcal | gen1, gen2 |
|| sles-15-sp5 | gen1, gen2 |
|| sles-sap-15-sp4-byos | gen1, gen2 |
|| sles-sap-15-sp4-hardened-byos | gen1, gen2 |
|| sles-sap-15-sp5-byos | gen1, gen2 |
|| sles-sap-15-sp5-hardened-byos| gen1, gen2 |
|talend | talend_re_image || tlnd_re|
|thorntechnologiesllc | sftpgateway || Sftpgateway|
|veeam |office365backup || veeamoffice365backup ||
|veeam | veeam-backup-replication|| veeam-backup-replication-v11||
| zscaler | zscaler-private-access || zpa-con-azure ||



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
   | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |
   | Amazon Linux 2 (x64)   |
   | Oracle 7.x, 8.x|
   | Debian 10 and 11|
   | Rocky Linux 8|

# [Windows IoT Enterprise on Arc enabled IaaS VMs (preview)](#tab/winio-arc)

   - Windows 10 IoT Enterprise LTSC 2021 
   - Windows 10 IoT Enterprise LTSC 2019 
   - Windows 11 IoT Enterprise, version 23H2 
   - Windows 11 IoT Enterprise LTSC 2024 

---

## Unsupported workloads

The following table lists the workloads that aren't supported.

   | **Workloads**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual Machine Scale Sets| We recommend that you use [Automatic upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) to patch the Virtual Machine Scale Sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


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

#### [Azure for US Government](#tab/gov)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
United States | USGovVirginia </br>  USGovArizona </br> USGovTexas | For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For Azure VMs only

#### [Azure operated by 21Vianet](#tab/21via)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
China | ChinaEast </br> ChinaEast3 </br>  ChinaNorth </br> ChinaNorth3 </br> ChinaEast2 </br>  ChinaNorth2 | For Azure VMs only </br> For Azure VMs only </br> For Azure VMs only </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers.

---

### Supported update sources
For more information, see the  supported [update sources](workflow-update-manager.md#update-source). 

### Supported update types
The following types of updates are supported.

#### Operating system updates
Update Manager supports operating system updates for both Windows and Linux.

Update Manager doesn't support driver updates.

#### Extended Security Updates (ESU) for Windows Server

Using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012 / R2 machines. ESUs are available by default to Azure Virtual machines. To enroll in Windows Server 2012 Extended Security Updates on Arc connected machines, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2 via Azure Arc](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc).


#### Microsoft application updates on Windows

By default, the Windows Update client is configured to provide updates only for the Windows operating system. 

If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products. Updates include security patches for Microsoft SQL Server and other Microsoft software.

Use one of the following options to perform the settings change at scale:

•	For all Windows Servers running on an earlier operating system than Windows Server 2016, run the following PowerShell script on the server you want to change:

   ```azurepowershell-interactive
    
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
   ```

•	For servers running Windows Server 2016 or later, you can use Group Policy to control this process by downloading and using the latest Group Policy Administrative template files.

> [!NOTE]
> Run the following PowerShell script on the server to disable Microsoft applications updates:

   ```azurepowershell-interactive
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.RemoveService($ServiceId)
   ```

#### Third party application updates

#### [Windows](#tab/third-party-win)

Update Manager relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. This scenario allows Update Manager to update machines that use Configuration Manager as their update repository with third party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

#### [Linux](#tab/third-party-lin)

Third party application updates are supported in Azure Update Manager. If you include a specific third party software repository in the Linux package manager repository location, it's scanned when it performs software update operations. The package isn't available for assessment and installation if you remove it.

---

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
