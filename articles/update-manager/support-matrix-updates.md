---
title: Azure Update Manager support matrix for updates
description: This article provides a summary of support for updates, one time updates, periodic assessments and scheduled patching.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/03/2025
ms.topic: overview
zone_pivot_groups: support-matrix-updates
---

# Support for Updates/One time Updates/Periodic assessments and Scheduled patching

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers :heavy_check_mark: Azure VMs.

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Service (EOS) status. Azure Update Manager will soon cease to support it. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Service guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager.

::: zone pivot="azure-vm"

## Azure virtual machines

### Azure Marketplace/PIR images

The Azure Marketplace image has the following attributes:

- **Publisher**: The organization that creates the image. Examples are `Canonical` and `MicrosoftWindowsServer`.
- Offer: The name of the group of related images created by the publisher. Examples are `UbuntuServer` and `WindowsServer`.
- **SKU**: An instance of an offer, such as a major release of a distribution. Examples are `18.04LTS` and `2019-Datacenter`.
- **Version**: The version number of an image SKU.

Update Manager supports the following operating system versions on VMs for all operations except automatic VM guest patching. You might experience failures if there are any configuration changes on the VMs, such as package or repository.

Following is the list of supported images and no other marketplace images released by any other publisher are supported for use with Azure Update Manager.

### Supported Windows OS images

| Publisher      | Offer           | Plan        | Unsupported image(s)|
|--------------|----------------|-----------------|---------|
| center-for-internet-security-inc | cis-windows-server-2012-r2-v2-2-1-l1  | cis-ws2012-r2-l1    ||
|| cis-windows-server-2012-r2-v2-2-1-l2  | cis-ws2012-r2-l2    ||
|| cis-windows-server-2016-v1-0-0-l1     | cis-ws2016-l1       ||
|| cis-windows-server-2016-v1-0-0-l2     | cis-ws2016-l2       ||
|| cis-windows-server-2019-v1-0-0-l1     | cis-ws2019-l1       ||
|| cis-windows-server-2019-v1-0-0-l2     | cis-ws2019-l2       ||
|| cis-windows-server-2022-l1            | *                   ||
|| cis-windows-server-2022-l2            | *                   ||
|| cis-windows-server                    | cis-windows-server2016-l*   ||
||| cis-windows-server2019-l*  ||
||| cis-windows-server2022-l* ||
|||cis-windows-server2019-stig-gen1|
||||cis-windows-server-l*-azure-observability |
|                                  | cis-win-2016-stig | cis-win-2016-stig  |    |
|                                  | cis-win-2019-stig | cis-win-2019-stig  |    |
| cloud-infrastructure-services    | hpc2019-windows-server-2019 | hpc2019-windows-server-2019 | |
|                                  | servercore-2019 | servercore-2019      |        |
|                                  | ad-dc-2016 | ad-dc-2016  |      |
|                                  | ad-dc-2019 | ad-dc-2019  |      |
|                                  | ad-dc-2022 | ad-dc-2022  |  |
|                                  | sftp-2016 | sftp-2016   |  |
|                                  | rds-farm-2019 | rds-farm-2019 |    |
|                                  | hmailserver | hmailserver-email-server-2016|   |
| microsoftsqlserver               | *                                          | *             |    |
| cognosys        | sql-server-2016-sp2-std-win2016-debug-utilities | sql-server-2016-sp2-std-win2016-debug-utilities |    |
| filemagellc     | filemage-gateway-vm-win    | filemage-gateway-vm-win-*    |        |
| microsoft-dsvm | dsvm-windows  | *  | |
|                | dsvm-win-2019| *| |
| | dsvm-win-2022| *||
| microsoftazuresiterecovery| process-server | windows-2012-r2-datacenter |   |
| microsoftbiztalkserver| biztalk-server | * | |
| microsoftdynamicsax | dynamics | * | |
| microsoftpowerbi | *   | * |  |
| microsoftsharepoint | microsoftsharepointserver | *| |
| microsoftvisualstudio | visualstudio* | *-ws2012r2 | |
| | | *-ws2016 | |
| | | *-ws2019 | |
| | | *-ws2022 | |
| microsoftwindowsserver | windowsserver | * | |
| | windowsserver-hub | 2012-r2-datacenter-hub | |
| | | 2016-datacenter-hub | |
| | windows-cvm | * | |
| | windowsserverdotnet | * | |
| | windowsserver-gen2preview | * | |
| | windowsserversemiannual | * | |
| | windowsserverupgrade | * | |
| microsoftwindowsserverhpcpack | windowsserverhpcpack | * | |
| veeam | office365backup | veeamoffice365backup | |
| | veeam-backup-replication | veeam-backup-replication-v* | |
| microsoftdynamicsnav | dynamicsnav | 2017 | |
| aod | win2019azpolicy | win2019azpolicy | |
| esri | arcgis-enterprise* | byol* | |
| | pro-byol | pro-byol-* | |
| southrivertech1586314123192 | tn-ent-payg | tnentpayg* | |
| | tn-sftp-payg | tnsftppayg* | |
| belindaczsro1588885355210 | belvmsrv* | belvmsrv* | |
| bissantechnology1583581147809 | bissan_secure_windows_server2019 | secureserver2019 | |
| ntegralinc1586961136942 | ntg_windows_datacenter_2019 | ntg_windows_server_2019 | |
| outsystems | os11-vm-baseimage | platformserver | |
| tidalmediainc | windows-server-2022-datacenter | windows-server-2022-datacenter | |

### Supported Linux OS images

| Publisher| Offer| Plan| Unsupported image(s) |
|--------|-----------|--------|---------|
| github| github-enterprise| github-enterprise| |
| matillion| matillion | matillion-etl-for-snowflake | |
| netapp | netapp-oncommand-cloud-manager | occm-byol | |
| almalinux | almalinux-x86_64  | 8_7-gen2 | |
| | | 8-gen* | |
| | | 9-gen* | |
| |almalinux-hpc | 8_6-hpc | |
| | | 8_6-hpc-gen2 | |
| | | 8-hpc-gen* | |
| | | 8_5-hpc* |  |
| | | 8_7-hpc-gen* ||
| |almalinux | 8-gen* | |
| | | 9-gen*| |
| aviatrix-systems | aviatrix-bundle-payg | aviatrix-enterprise-bundle-byol | |
| |aviatrix-copilot | avx-cplt-byol-01 | | 
| || avx-cplt-byol-02 | | 
| |aviatrix-companion-gateway-v9 | aviatrix-companion-gateway-v9 | | 
| |aviatrix-companion-gateway-v10 | aviatrix-companion-gateway-v10 </br> aviatrix-companion-gateway-v10u ||
| |aviatrix-companion-gateway-v12| aviatrix-companion-gateway-v12 | | |
| |aviatrix-companion-gateway-v13 | aviatrix-companion-gateway-v13 </br> aviatrix-companion-gateway-v13u ||
| |aviatrix-companion-gateway-v14 | aviatrix-companion-gateway-v14 </br> aviatrix-companion-gateway-v14u||
| |aviatrix-companion-gateway-v16 | aviatrix-companion-gateway-v16 | | 
| openlogic | centos-hpc | |* | 
| | centos-lvm | 7-lvm </br> 7-lvm-gen2 </br> 8-lvm | |
| | centos-ci | 7-ci | |
| | centos | 7* |8* |
| center-for-internet-security-inc | cis-rhel | cis-redhat7-l1-gen1 </br> cis-redhat8-l*-gen1 </br> cis-redhat9-l1-gen* ||
| | cis-rhel-7-l2 | cis-rhel7-l2 ||
|| cis-rhel-7-v2-2-0-l1| cis-rhel7-l1||
|| cis-rhel-7-stig| cis-rhel-7-stig||
|| cis-rhel-8-stig| cis-rhel-8-stig||
|| cis-oracle| cis-oraclelinux8-l1-gen1 </br> cis-oraclelinux9-l1-gen*||
|| cis-oracle-linux-8-l1 | cis-oracle8-l1||
|| cis-ubuntu| cis-ubuntu1804-l1 </br> cis-ubuntulinux2004-l1-gen1 </br> cis-ubuntulinux2204-l1-gen*||
|| cis-ubuntu-linux-1804-l1| cis-ubuntu1804-l1||
|| cis-ubuntu-linux-2004-l1| cis-ubuntu2004-l1||
|| cis-ubuntu-linux-2204-l1| cis-ubuntu-linux-2204-l1 </br> cis-ubuntu-linux-2204-l1-gen2||
|| cis-rhel-8-l*| cis-rhel8-l*||
|| cis-rhel9-l1| cis-rhel9-l1*||
| canonical| *| *||
| cloud-infrastructure-services | dns-ubuntu-2004 | dns-ubuntu-2004 ||
|| squid-ubuntu-2004| squid-ubuntu-2004||
|| load-balancer-nginx | load-balancer-nginx | |
| | gitlab-ce-ubuntu20-04 | gitlab-ce-ubuntu-20-04 | |
| cloudera | cloudera-centos-os| 7_5| |
| cncf-upstream | capi | ubuntu-1804-gen1||
||| ubuntu-2004-gen1||
||| ubuntu-2204-gen1||
| credativ| debian| 8||
||| 9||
||| 9-backports||
| debian| debian-10| 10||
||| 10-gen2||
||| 10-backports||
||| 10-backports-gen2||
|| debian-10-daily| 10||
||| 10-gen2||
||| 10-backports||
||| 10-backports-gen2||
|| debian-11| 11||
||| 11-gen2||
||| 11-backports||
|| | 11-backports-gen2 ||
|| debian-11-daily| 11| |
||| 11-gen2||
||| 11-backports||
||| 11-backports-gen2||
| erockyenterprisesoftwarefoundationinc1653071250513 | rockylinux| free||
|| rockylinux-9| rockylinux-9||
| microsoftcblmariner| cbl-mariner| cbl-mariner-1||
||| 1-gen2||
||| cbl-mariner-2||
||| cbl-mariner-2-gen2||
| microsoft-dsvm| aml-workstation| ubuntu||
|| ubuntu-hpc| 1804||
||| 2004-preview-ndv5||
||| 2004||
||| 2204-preview-ndv5||
||| 2204||
|| ubuntu-1804| 1804-gen2||
|| ubuntu-2004| 2004||
||| 2004-gen2||
| nginxinc| nginx-plus-ent-v1| nginx-plus-ent-centos7||
| ntegralinc1586961136942| ntg_oracle_8_7| ntg_oracle_8_7||
|| ntg_ubuntu_20_04_lts| ntg_ubuntu_20_04_lts||
|| ntg_cbl_mariner_2| ntg_cbl_mariner_2_gen2||
| oracle| oracle-linux| 8 </br> 8-ci </br> 81 </br> 81-ci </br> 81-gen2 </br> ol82 </br> ol8_2-gen2 </br> ol82-gen2 </br> ol83-lvm </br> ol83-lvm-gen2 </br> ol84-lvm </br> ol84-lvm-gen2||
| procomputers| almalinux-8-7| almalinux-8-7||
|| rhel-8-2| rhel-8-2||
|| rhel-8-8-gen2| rhel-8-8-gen2||
|| rhel-8-9-gen2| rhel-8-9-gen2||
| redhat| rhel| 7* </br> 8* </br> 9*||
|| rhel-raw| 7* </br> 8* </br> 9*||
|| rhel-byos| rhel-raw76 </br> rhel-lvm7* </br> rhel-lvm8* </br> rhel-lvm92 </br> rhel-lvm-92-gen2||
|| rhel-ha| 8* </br> 9_2 </br> 9_2-gen2 |81_gen2|
|| rhel-sap-apps| 7* </br> 8* </br> 9_0 </br> 90sapapps-gen2 </br> 9_2 </br> 92sapapps-gen2||
|| rhel-sap-ha| 7* </br> 8* </br> 9_2 </br> 92sapha-gen2||
|| rhel-sap| 7*||
|| rhel-sap-*| 9_0||
| microsoftsqlserver| *| *||
|| sql2019-sles*|| *|
|| sql2019-rhel7|| *|
|| sql2017-rhel7|| *|
| oracle| oracle-database| oracle_db_21||
|| oracle-database-19-3| oracle-database-19-0904 |
|| oracle-database-*| 18.*||
|| oracle-linux| 7* </br> ol7* </br> ol8* </br> ol9* </br> ol9-lvm*||
| talend| talend_re_image| tlnd_re||
| tenable| tenablecorewas| tenablecoreol8wasbyol||
|| tenablecorenessus| tenablecorenessusbyol||
| thorntechnologiesllc| sftpgateway| sftpgateway||
| zscaler| zscaler-private-access| zpa-con-azure||
| cloudrichness| rockey_linux_image| rockylinux86||
| openvpn| openvpnas| access_server_byol||
| suse| sles| 12-sp4-gen2 </br> 12-sp3||
|| sles-12-sp5| gen1 </br> gen2 ||
|| sles-12-sp5-*| gen*||
|| sles-15-sp1-basic| gen1||
|| sles-15-sp1-sapcal| gen*||
|| sles-15-sp2-basic| gen1 </br> gen2||
|| sles-15-sp2| gen1 </br> gen2||
|| sles-15-sp2-hpc| gen2||
|| sles-15-sp3-basic| gen1 </br> gen2||
|| sles-15-sp3-sapcal| gen*||
|| sles-15-sp4| gen*||
|| sles-15-sp4-basic| gen*||
|| sles-15-sp4-sapcal| gen1||
|| sles-15-sp4-byos| gen*||
|| sles-15-sp4-chost-byos| gen*||
|| sles-15-sp4-hardened-byos| gen*||
|| sles-15-sp5-basic| gen*||
|| sles-15-sp5-byos| gen*||
|| sles-15-sp5-chost-byos| gen*||
|| sles-15-sp5-hardened-byos| gen*|
|| sles-15-sp5-sapcal| gen*||
|| sles-15-sp5 | gen*||
|| sles-byos| 12-sp4 </br> 12-sp4-gen2||
|| sles-sap| 12-sp3 </br> 12-sp4 </br> 12-sp4-gen2 </br> 15 </br> gen2-15||
|| sles-sap-byos| 12-sp4 </br> 12-sp4-gen2 </br> gen2-12-sp4 </br> 15||
|| sles-sap-12-sp5*| gen*||
|| sles-sap-15-*| gen*||
|| sles-sapcal| 12-sp3||
|| sles-standard| 12-sp4-gen2||
|| opensuse-leap-15-*| gen*||
|| sle-hpc-15-sp4| gen*||
|| sle-hpc-15-sp4-byos| gen*||
|| sle-hpc-15-sp5-byos| gen*||
|| sle-hpc-15-sp5 | gen*||
| rapid7| nexpose-scan-engine| nexpose-scan-engine||
|| rapid7-vm-console| rapid7-vm-console||

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
| Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS |
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

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
