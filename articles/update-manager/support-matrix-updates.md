---
title: Azure Update Manager support matrix for updates
description: This article provides a summary of support for updates, one time updates, periodic assessments and scheduled patching.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 03/18/2025
ms.topic: overview
zone_pivot_groups: support-matrix-updates
---

# Support for Updates/One time Updates/Periodic assessments and Scheduled patching

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers :heavy_check_mark: Azure VMs.

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Service (EOS) status. Azure Update Manager will soon cease to support it. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Service guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager.

::: zone pivot="azure-vm"

## Azure Marketplace/PIR images

The Azure Marketplace image has the following attributes:

- **Publisher**: The organization that creates the image. Examples are `Canonical` and `MicrosoftWindowsServer`.
- Offer: The name of the group of related images created by the publisher. Examples are `UbuntuServer` and `WindowsServer`.
- **SKU**: An instance of an offer, such as a major release of a distribution. Examples are `18.04LTS` and `2019-Datacenter`.
- **Version**: The version number of an image SKU.

Update Manager supports the following operating system versions on VMs for all operations except automatic VM guest patching. You might experience failures if there are any configuration changes on the VMs, such as package or repository.

>[!NOTE]
> * Only x64 operating systems are currently supported. Neither ARM64 nor x86 are supported for any operating system.
> * Updates might fail to install on SUSE machines if they require accepting the EULA.

Following is the list of supported images and no other marketplace images released by any other publisher are supported for use with Azure Update Manager.

The asterisk (*) in the Offer or Plan columns acts as a wildcard. * means all possible values are supported.

#### [Supported Windows OS images](#tab/mpir-winos)

|Publisher |Offer |Plan |Unsupported image(s) |
|--|--|--|--|
| aod | win2019azpolicy | win2019azpolicy |  |
| belindaczsro1588885355210 | belvmsrv* | belvmsrv* |  |
| bissantechnology1583581147809 | bissan_secure_windows_server2019 | secureserver2019 |  |
| center-for-internet-security-inc | cis-win-2016-stig | cis-win-2016-stig |  |
| center-for-internet-security-inc | cis-win-2019-stig | cis-win-2019-stig |  |
| center-for-internet-security-inc | cis-windows-server | cis-windows-server2016-l* |  |
| center-for-internet-security-inc | cis-windows-server-2012-r2-v2-2-1-l1 | cis-ws2012-r2-l1 |  |
| center-for-internet-security-inc | cis-windows-server-2012-r2-v2-2-1-l2 | cis-ws2012-r2-l2 |  |
| center-for-internet-security-inc | cis-windows-server-2012-v2-0-1-l2  | cis-ws2012-l2 | |
| center-for-internet-security-inc | cis-windows-server-2016-v1-0-0-l1 | cis-ws2016-l1 |  |
| center-for-internet-security-inc | cis-windows-server-2016-v1-0-0-l2 | cis-ws2016-l2 |  |
| center-for-internet-security-inc | cis-windows-server-2019-v1-0-0-l1 | cis-ws2019-l1 |  |
| center-for-internet-security-inc | cis-windows-server-2019-v1-0-0-l2 | cis-ws2019-l2 |  |
| center-for-internet-security-inc | cis-windows-server-2022-l1 | * |  |
| center-for-internet-security-inc | cis-windows-server-2022-l2 | * |  |
| center-for-internet-security-inc |  | cis-windows-server2019-l* |  |
| center-for-internet-security-inc |  | cis-windows-server2022-l* |  |
| center-for-internet-security-inc |  |  | cis-windows-server-l*-azure-observability |
| center-for-internet-security-inc |  | cis-windows-server2019-stig-gen1 |
| cloud-infrastructure-services | ad-dc-2016 | ad-dc-2016 |  |
| cloud-infrastructure-services | ad-dc-2019 | ad-dc-2019 |  |
| cloud-infrastructure-services | hpc2019-windows-server-2019 | hpc2019-windows-server-2019 |  |
| cloud-infrastructure-services | servercore-2019 | servercore-2019 |  |
| cloud-infrastructure-services | ad-dc-2022 | ad-dc-2022 |  |
| cloud-infrastructure-services | sftp-2016 | sftp-2016 |  |
| cloud-infrastructure-services | hmailserver | hmailserver-email-server-2016 |  |
| cloud-infrastructure-services | rds-farm-2019 | rds-farm-2019 |  |
| cognosys | sql-server-2016-sp2-std-win2016-debug-utilities | sql-server-2016-sp2-std-win2016-debug-utilities |  |
| esri | arcgis-enterprise* | byol* |  |
| esri | pro-byol | pro-byol-* |  |
| filemagellc | filemage-gateway-vm-win | filemage-gateway-vm-win-* |  |
| microsoft-dsvm | dsvm-win-2019 | * |  |
| microsoft-dsvm | dsvm-win-2022 | * |  |
| microsoft-dsvm | dsvm-windows | * |  |
| microsoftazuresiterecovery | process-server | windows-2012-r2-datacenter |  |
| microsoftbiztalkserver | biztalk-server | * |  |
| microsoftdynamicsax | dynamics | * |  |
| microsoftdynamicsnav | dynamicsnav | 2017 |  |
| microsoftpowerbi | * | * |  |
| microsoftsharepoint | microsoftsharepointserver | * |  |
| microsoftsqlserver | * | * |  |
| microsoftvisualstudio |  | *-ws2016 |  |
| microsoftvisualstudio |  | *-ws2019 |  |
| microsoftvisualstudio |  | *-ws2022 |  |
| microsoftvisualstudio | visualstudio* | *-ws2012r2 |  |
| microsoftwindowsserver |  | 2016-datacenter-hub |  |
| microsoftwindowsserver | windows-cvm | * |  |
| microsoftwindowsserver | windowsserver | * |  |
| microsoftwindowsserver | windowsserver-gen2preview | * |  |
| microsoftwindowsserver | windowsserver-hub | 2012-r2-datacenter-hub |  |
| microsoftwindowsserver | windowsserverdotnet | * |  |
| microsoftwindowsserver | windowsserversemiannual | * |  |
| microsoftwindowsserver | windowsserverupgrade | * |  |
| microsoftwindowsserverhpcpack | windowsserverhpcpack | * |  |
| ntegralinc1586961136942 | ntg_windows_datacenter_2019 | ntg_windows_server_2019 |  |
| outsystems | os11-vm-baseimage | platformserver lifetime |  |
| southrivertech1586314123192 | tn-ent-payg | tnentpayg* |  |
| southrivertech1586314123192 | tn-sftp-payg | tnsftppayg* |  |
| tidalmediainc | windows-server-2022-datacenter | windows-server-2022-datacenter |  |
| veeam | office365backup | veeamoffice365backup |  |
| veeam | veeam-backup-replication | veeam-backup-replication-v* |  |


#### [Supported Linux OS images](#tab/mpir-linos)

| Publisher| Offer| Plan| Unsupported image(s)|
|--|--|--|--|
|almalinux | | 8_5-hpc* |  |
|almalinux | | 8_6-hpc-gen2 | |
|almalinux | | 8_7-hpc-gen* ||
|almalinux | | 8-gen* | |
|almalinux | | 8-hpc-gen* | |
|almalinux | | 9-gen* | |
|almalinux | | 9-gen*| |
|almalinux | almalinux-x86_64  | 8_7-gen2 | |
|almalinux |almalinux | 8-gen* | |
|almalinux |almalinux-hpc | 8_6-hpc </br> 8_7-hpc-gen*  | |
| ||8_10-hpc-gen* |
|aviatrix-systems | aviatrix-bundle-payg | aviatrix-enterprise-bundle-byol | |
|aviatrix-systems || avx-cplt-byol-02 | | 
|aviatrix-systems |aviatrix-companion-gateway-v9 | aviatrix-companion-gateway-v9 | | 
|aviatrix-systems |aviatrix-companion-gateway-v10 | aviatrix-companion-gateway-v10 <br> aviatrix-companion-gateway-v10u ||
|aviatrix-systems |aviatrix-companion-gateway-v12| aviatrix-companion-gateway-v12 | |
|aviatrix-systems |aviatrix-companion-gateway-v13 | aviatrix-companion-gateway-v13 <br> aviatrix-companion-gateway-v13u ||
|aviatrix-systems |aviatrix-companion-gateway-v14 | aviatrix-companion-gateway-v14 <br> aviatrix-companion-gateway-v14u||
|aviatrix-systems |aviatrix-companion-gateway-v16 | aviatrix-companion-gateway-v16 | | 
|aviatrix-systems |aviatrix-copilot | avx-cplt-byol-01 | | 
|canonical| *| *||
|center-for-internet-security-inc | cis-rhel | cis-redhat7-l1-gen1 <br> cis-redhat7-l*-gen1 </br> cis-redhat8-l*-gen1 <br> cis-redhat8-l*-gen2 </br> cis-redhat9-l*-gen1 </br> cis-redhat9-l*-gen2 ||
|center-for-internet-security-inc | cis-rhel-7-l2 | cis-rhel7-l2 ||
|center-for-internet-security-inc| cis-oracle-linux-8-l1 | cis-oracle8-l1||
|center-for-internet-security-inc| cis-oracle| cis-oraclelinux8-l1-gen1 <br> cis-oraclelinux9-l1-gen*||
|center-for-internet-security-inc| cis-rhel-7-stig| cis-rhel-7-stig||
|center-for-internet-security-inc| cis-rhel-7-v2-2-0-l1| cis-rhel7-l1||
|center-for-internet-security-inc| cis-rhel-8-l*| cis-rhel8-l*||
|center-for-internet-security-inc| cis-rhel-8-stig| cis-rhel-8-stig||
|center-for-internet-security-inc| cis-rhel9-l1| cis-rhel9-l1*||
|center-for-internet-security-inc| cis-ubuntu-linux-1804-l1| cis-ubuntu1804-l1||
|center-for-internet-security-inc| cis-ubuntu-linux-2004-l1| cis-ubuntu2004-l1||
|center-for-internet-security-inc| cis-ubuntu-linux-2204-l1| cis-ubuntu-linux-2204-l1 <br> cis-ubuntu-linux-2204-l1-gen2||
|center-for-internet-security-inc| cis-ubuntu| cis-ubuntu1804-l1 <br> cis-ubuntulinux2004-l1-gen1 <br> cis-ubuntulinux2204-l1-gen*||
|cloud-infrastructure-services | dns-ubuntu-2004 | dns-ubuntu-2004 ||
|cloud-infrastructure-services | gitlab-ce-ubuntu20-04 | gitlab-ce-ubuntu-20-04 | |
|cloud-infrastructure-services| load-balancer-nginx | load-balancer-nginx | |
|cloud-infrastructure-services| squid-ubuntu-2004| squid-ubuntu-2004||
|cloudera | cloudera-centos-os| 7_5| |
|cloudrichness| rockey_linux_image| rockylinux86||
|cncf-upstream| capi | ubuntu-1804-gen1||
|cncf-upstream|| ubuntu-2004-gen1||
|cncf-upstream|| ubuntu-2204-gen1||
|cognosys |centos-77-free | centos-77-free ||
|credativ| debian| 8||
|credativ|| 9-backports||
|credativ|| 9||
|debian| debian - 11| 11-backports-gen2 | |
|debian| debian-10-daily| 10||
|debian| debian-10| 10||
|debian| debian-11-daily| 11| |
|debian| debian-11| 11||
|debian|| 10-backports-gen2||
|debian|| 10-backports-gen2||
|debian|| 10-backports||
|debian|| 10-backports||
|debian|| 10-gen2||
|debian|| 10-gen2||
|debian| debian-11-daily |11 |  |
|debian|debian-11| 11-backports||
|debian|debian-11-daily|11 backports ||
|debian| debian-11|11-gen2||
|debian|debian-11-daily| 11-gen2||
|debian|debian-12| 12 </br> 12-arm64 </br>  12-gen2| |
|debian|debian-12-daily| 12 </br> 12-arm64  </br> 12-gen2 </br> 12-backports </br> 12-backports-arm64 </br> 12-backports-gen2 ||
|erockyenterprisesoftwarefoundationinc1653071250513 | rockylinux| free||
|erockyenterprisesoftwarefoundationinc1653071250513| rockylinux-9| rockylinux-9||
|kali-linux | kali | kali-2024-3 |
|github| github-enterprise| github-enterprise| |
|matillion| matillion | matillion-etl-for-snowflake | |
|microsoft-dsvm| aml-workstation| ubuntu||
|microsoft-dsvm| ubuntu-1804| 1804-gen2||
|microsoft-dsvm| ubuntu-2004| 2004 </br> 2004-gen2||
|microsoft-dsvm| ubuntu-hpc| 1804||
|microsoft-dsvm|| 2004-gen2||
|microsoft-dsvm|| 2004-preview-ndv5||
|microsoft-dsvm|| 2004||
|microsoft-dsvm|| 2204-preview-ndv5||
|microsoft-dsvm|| 2204||
|microsoftcblmariner| cbl-mariner| cbl-mariner-1||
|microsoftcblmariner|| 1-gen2||
|microsoftcblmariner|| cbl-mariner-2-gen2||
|microsoftcblmariner|| cbl-mariner-2||
|microsoftsqlserver| *| *||
|microsoftsqlserver| sql2017-rhel7|| *|
|microsoftsqlserver| sql2019-rhel7|| *|
|microsoftsqlserver| sql2019-sles*|| *|
|netapp | netapp-oncommand-cloud-manager | occm-byol | |
|nginxinc| nginx-plus-ent-v1| nginx-plus-ent-centos7||
|ntegralinc1586961136942| ntg_cbl_mariner_2| ntg_cbl_mariner_2_gen2||
|ntegralinc1586961136942| ntg_oracle_8_7| ntg_oracle_8_7||
|ntegralinc1586961136942| ntg_ubuntu_20_04_lts| ntg_ubuntu_20_04_lts||
|openlogic | centos | 7* |8* |
|openlogic | centos-ci | 7-ci | |
|openlogic | centos-hpc | |* | 
|openlogic | centos-lvm | 7-lvm <br> 7-lvm-gen2 <br> 8-lvm | |
|openvpn| openvpnas| access_server_byol||
|oracle| oracle-database-*| 18.*||
|oracle| oracle-database-19-3| oracle-database-19-0904 |
|oracle| oracle-database| oracle_db_21||
|oracle| oracle-linux| 7* <br> ol7* <br> ol8* <br> ol9* <br> ol9-lvm*||
|oracle| oracle-linux| 8 <br> 8-ci <br> 81 <br> 81-ci <br> 81-gen2 <br> ol82 <br> ol8_2-gen2 <br> ol82-gen2 <br> ol83-lvm <br> ol83-lvm-gen2 <br> ol84-lvm <br> ol84-lvm-gen2 </br> ol9-lvm*||
|procomputers| almalinux-8-7| almalinux-8-7||
|procomputers| rhel-8-2| rhel-8-2||
|procomputers| rhel-8-8-gen2| rhel-8-8-gen2||
|procomputers| rhel-8-9-gen2| rhel-8-9-gen2||
|rapid7| nexpose-scan-engine| nexpose-scan-engine||
|rapid7| rapid7-vm-console| rapid7-vm-console||
|redhat| rhel-byos| rhel-raw76 <br> rhel-lvm7* <br> rhel-lvm8* <br> rhel-lvm92 <br> rhel-lvm-92-gen2||
|redhat| rhel-ha| 8* <br> 9_2 <br> 9_2-gen2 |81_gen2|
|redhat| rhel-raw| 7* <br> 8* <br> 9*||
|redhat| rhel-sap-*| 9_0||
|redhat| rhel-sap-apps| 7* <br> 8* <br> 9_0 <br> 90sapapps-gen2 <br> 9_2 <br> 92sapapps-gen2||
|redhat| rhel-sap-ha| 7* <br> 8* <br> 9_2 <br> 92sapha-gen2||
|redhat| rhel-sap| 7*||
|redhat| rhel| 7* <br> 8* <br> 9*||
|resf| rockylinux-x86_64 | 8-base </br> 8-lvm </br> 9-base </br> 9-lvm || 
|suse| opensuse-leap-15-*| gen*||
|suse| sle-hpc-15-sp4-byos| gen*||
|suse| sle-hpc-15-sp4| gen*||
|suse| sle-hpc-15-sp5 | gen*||
|suse| sle-hpc-15-sp5-byos| gen*||
|suse| sles-12-sp5-*| gen*||
|suse| sles-12-sp5| gen1 <br> gen2 ||
|suse| sles-15-sp1-basic| gen1||
|suse| sles-15-sp1-sapcal| gen*||
|suse| sles-15-sp2-basic| gen1 <br> gen2||
|suse| sles-15-sp2-hpc| gen2||
|suse| sles-15-sp2| gen1 <br> gen2||
|suse| sles-15-sp3| gen2 ||
|suse| sles-15-sp3-basic| gen1 <br> gen2||
|suse| sles-15-sp3-sapcal| gen*||
|suse| sles-15-sp4-basic| gen*||
|suse| sles-15-sp4-byos| gen*||
|suse| sles-15-sp4-chost-byos| gen*||
|suse| sles-15-sp4-hardened-byos| gen*||
|suse| sles-15-sp4-sapcal| gen1||
|suse| sles-15-sp4| gen*||
|suse| sles-15-sp5 | gen*||
|suse| sles-15-sp5-basic| gen*||
|suse| sles-15-sp5-byos| gen*||
|suse| sles-15-sp5-chost-byos| gen*||
|suse| sles-15-sp5-hardened-byos| gen*|
|suse| sles-15-sp5-sapcal| gen*||
|suse| sles-15-sp6*| gen*||
|suse| sles-byos| 12-sp4 <br> 12-sp4-gen2||
|suse| sles-sap-12-sp5*| gen*||
|suse| sles-sap-15-sp1-byos | gen1||
|suse| sles-sap-15-sp2-byos | gen2||
|suse| sles-sap-15-sp4-byos | gen1||
|suse| sles-sap-15-* | gen*|
|suse| sles-sap-15-*| gen*||
|suse| sles-sap-byos| 12-sp4 <br> 12-sp4-gen2 <br> gen2-12-sp4 <br> 15||
|suse| sles-sap| 12-sp3 <br> 12-sp4 <br> 12-sp4-gen2 <br> 15 <br> gen2-15||
|suse| sles-sapcal| 12-sp3||
|suse| sles-standard| 12-sp4-gen2||
|suse| sles| 12-sp3 </br> 12-sp4-gen2 </br> 15||
|talend| talend_re_image| tlnd_re||
|tenable| tenablecorenessus| tenablecorenessusbyol||
|tenable| tenablecorewas| tenablecoreol8wasbyol||
|thorntechnologiesllc| sftpgateway| sftpgateway||
|zscaler| zscaler-private-access| zpa-con-azure||

---

### Custom images


Custom images (including images uploaded to [Azure Compute gallery](/azure/virtual-machines/linux/tutorial-custom-images#overview))  which are created from below listed operating systems are supported for all Azure Update Manager operations (on-demand operations and customer managed schedules). For instructions on how to use Azure Update Manager to manage updates on VMs created from custom images, see [Manage updates for custom images](manage-updates-customized-images.md).  

#### [Windows operating system](#tab/ci-win)

| Windows operating systems |
| --- |
| Windows Server 2025|
| Windows Server 2022 |
| Windows Server 2019 |
| Windows Server 2016 |
| Windows Server 2012 R2 |
| Windows Server 2012 |

#### [Linux operating system](#tab/ci-lin)

| Linux operating systems |
| --- |
| Oracle Linux 7.x, 8x, 9x |
| Red Hat Enterprise 7, 8, 9 |
| SUSE Linux Enterprise Server 12.x, 15.0-15.4 |
| Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS |
| Common Base Linux Mariner 1, 2|
| Rocky Linux 9|
| Debian 10,11|
| Alma Linux 8, 9|

---

:::zone-end

::: zone pivot="azure-arc-enabled-servers"


## Azure Arc-enabled servers

The following table lists the operating systems supported on [Azure Arc-enabled servers](/azure/azure-arc/servers/overview).

| Operating system |
| --- |
| Alma Linux 9 |
| Amazon Linux 2 (x64) |
| Amazon Linux 2023 |
| Debian 10 and 11 |
| Oracle 7.x, 8.x |
| Oracle Linux 9 |
| Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |
| Rocky Linux 8, 9 |
| SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
| Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS |
| Windows Server 2012 R2 and higher (including Server Core) |

:::zone-end

::: zone pivot="win-iot-arc-servers"

## Windows IoT Enterprise on Arc enabled servers (preview)

| Windows Enterprise systems |
| --- |
| Windows 10 IoT Enterprise LTSC 2021 |
| Windows 10 IoT Enterprise LTSC 2019  |
| Windows 11 IoT Enterprise, version 23H2 | 
| Windows 11 IoT Enterprise LTSC 2024  |

:::zone-end

## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
