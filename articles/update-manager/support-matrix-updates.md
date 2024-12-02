---
title: Azure Update Manager support matrix for updates
description: This article provides a summary of support for updates, one time updates, periodic assessments and scheduled patching.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 12/02/2024
ms.topic: overview
zone_pivot_groups: support-matrix-updates
---

# Support for Updates/One time Updates/Periodic assessments and Scheduled patching

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers :heavy_check_mark: Azure VMs.

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager

::: zone pivot="azure-vm"

## Azure virtual machines

### Azure Marketplace/PIR images

The Azure Marketplace image has the following attributes:

- **Publisher**: The organization that creates the image. Examples are `Canonical` and `MicrosoftWindowsServer`.
- **Offer**: The name of the group of related images created by the publisher. Examples are `UbuntuServer` and `WindowsServer`.
- **SKU**: An instance of an offer, such as a major release of a distribution. Examples are `18.04LTS` and `2019-Datacenter`.
- **Version**: The version number of an image SKU.

Update Manager supports the following operating system versions on VMs for all operations except automatic VM guest patching. You might experience failures if there are any configuration changes on the VMs, such as package or repository.

Following is the list of supported images and no other marketplace images released by any other publisher are supported for use with Azure Update Manager.

#### Supported Windows OS versions

**Publisher - Center for Internet Security Inc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cis-windows-server-2012-r2-v2-2-1-l2 | cis-ws2012-r2-l2 ||
|cis-windows-server-2016-v1-0-0-l1 | cis--l1 ||
|cis-windows-server-2016-v1-0-0-l2 | cis-ws2016-l2 ||
|cis-windows-server-2019-v1-0-0-l1 | cis-ws2019-l1 ||
|cis-windows-server-2019-v1-0-0-l2 | cis-ws2019-l2 ||
|cis-windows-server-2022-l1| cis-windows-server-2022-l1 </br>cis-windows-server-2022-l1-gen2 | |
|cis-windows-server-2022-l2 | cis-windows-server-2022-l2 </br>cis-windows-server-2022-l2-gen2 | |
|cis-windows-server| cis-windows-server2016-l1-gen1 </br> cis-windows-server2019-l1-gen1 </br> cis-windows-server2019-l1-gen2 </br> cis-windows-server2019-l2-gen1 </br> cis-windows-server2022-l1-gen2 </br> cis-windows-server2022-l2-gen2 </br>cis-windows-server2022-l1-gen1 ||

**Publisher - cloud-infrastructure-services**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|hpc2019-windows-server-2019| hpc2019-windows-server-2019||

**Publisher - microsoftsqlserver**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|sql2016sp1-ws2016 | standard
|sql2016sp2-ws2016 | standard|
|sql2017-ws2016 | enterprise |
|sql2017-ws2016 | standard|
|sql2019-ws2019 | enterprise |
|sql2019-ws2019 | sqldev|
|sql2019-ws2019 | standard |
|sql2019-ws2019 | standard-gen2|

**Publisher - cognosys**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| sql-server-2016-sp2-std-win2016-debug-utilities |sql-server-2016-sp2-std-win2016-debug-utilities|

**Publisher - filemagellc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|filemage-gateway-vm-win-001 </br> filemage-gateway-vm-win-002 |

**Publisher - github**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|github-enterprise| github-enterprise||

**Publisher - matillion**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|matillion | matillion-etl-for-snowflake||

**Publisher - microsoft-ads**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|windows-data-science-vm| windows2016 </br> windows2016byol||

**Publisher -  microsoft-dsvm**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|ubuntu-1804| 1804-gen2 ||
|dsvm-windows </br> dsvm-win-2019 </br> dsvm-win-2022 | * </br> * </br> * |

**Publisher -  microsoftazuresiterecovery**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|process-server | windows-2012-r2-datacenter |

**Publisher -  microsoftbiztalkserver**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|biztalk-server | *|

**Publisher -  microsoftdynamicsax**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|dynamics | * |

**Publisher -  microsoftpowerbi**	

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|* |* |

**Publisher -  microsoftsharepoint**	

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|microsoftsharepointserver | *|


**Publisher -  Visualstudio**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|Visualstudio* |  *-ws2012r2 </br> *-ws2016-ws2019 </br> *-ws2022 |

**Publisher -  microsoftwindowsserver**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|windows server | windowsserver 2008| |
|windows-cvm | * |
|windowsserver-gen2preview | *|
|windowsserverdotnet | *|
|microsoftwindowsserver | windowsserverupgrade | * |
|microsoftwindowsserverhpcpack | windowsserverhpcpack | * |

**Publisher -  microsoftwindowsserver**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|netapp |netapp-oncommand-cloud-manager| occm-byol||



#### Supported Linux OS versions

**Publisher - (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|ad-dc-2016 | ad-dc-2016|
|ad-dc-2019| ad-dc-2019 |
|ad-dc-2022 | ad-dc-2022 |

**Publisher - (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|almalinux-hpc | 8_6-hpc, 8_6-hpc-gen2 |

**Publisher - (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|aviatrix-companion-gateway-v9 | aviatrix-companion-gateway-v9|
|aviatrix-companion-gateway-v10 | aviatrix-companion-gateway-v10,</br> aviatrix-companion-gateway-v10u|
|aviatrix-companion-gateway-v12 | aviatrix-companion-gateway-v12|
|aviatrix-companion-gateway-v13 | aviatrix-companion-gateway-v13,</br> aviatrix-companion-gateway-v13u|
|aviatrix-companion-gateway-v14 | aviatrix-companion-gateway-v14,</br> aviatrix-companion-gateway-v14u |
|aviatrix-companion-gateway-v16 | aviatrix-companion-gateway-v16|
|aviatrix-copilot |avx-cplt-byol-01, avx-cplt-byol-02 |

**Publisher - (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|centos-ci | 7-ci |
|centos-hpc | 7.1, 7.3, 7.4 |
|centos-lvm | 7-lvm-gen2 |
|centos-lvm | 7-lvm, 8-lvm |

**Publisher - center-for-internet-security-inc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cis-oracle-linux-8-l1 | cis-oracle8-l1|

**Publisher - cis-rhel**
|
 **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| cis-redhat7-l1-gen1 </br> cis-redhat8-l1-gen1 </br> cis-redhat8-l2-gen1 </br>  cis-redhat9-l1-gen1 </br> cis-redhat9-l1-gen2| |

**Publisher - cis-rhel-7-l2**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| cis-rhel7-l2 | |

**Publisher - cis-rhel-8-l2**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| cis-rhel8-l2 | |

**Publisher - cis-rhel9-l1**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| cis-rhel9-l1 </br> cis-rhel9-l1-gen2 ||

**Publisher - center-for-internet-security-inc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cis-ubuntu | cis-ubuntu1804-l1 </br> cis-ubuntulinux2004-l1-gen1 </br> cis-ubuntulinux2204-l1-gen1 </br> cis-ubuntulinux2204-l1-gen2 ||


**Publisher (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |

|--- | --- | ---|
|cis-ubuntu-linux-1804-l1| cis-ubuntu1804-l1||

**Publisher (to add)**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cis-ubuntu-linux-2004-l1 | cis-ubuntu2004-l1 </br> cis-ubuntu-linux-2204-l1-gen2|

**Publisher - center-for-internet-security-inc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cis-ubuntu-linux-2004-l1| cis-ubuntu2004-l1||
|cis-ubuntu-linux-2204-l1 | cis-ubuntu-linux-2204-l1 </br> cis-ubuntu-linux-2204-l1-gen2 | |
|debian-10-daily | 10, 10-gen2,</br> 10-backports,</br> 10-backports-gen2|
|debian-11 | 11, 11-gen2,</br> 11-backports, </br> 11-backports-gen2 |
|debian-11-daily | 11, 11-gen2,</br>  11-backports, </br> 11-backports-gen2 |
|dns-ubuntu-2004 | dns-ubuntu-2004|
|oracle-database | oracle_db_21 |
|oracle-database-19-3 | oracle-database-19-0904 |
|rhel-ha | 9_2, 9_2-gen2 |
|rhel-sap-apps | 9_0, 90sapapps-gen2, 9_2, 92sapapps-gen2 | 
|rhel-sap-ha |  9_2, 92sapha-gen2 |
|servercore-2019| servercore-2019|
|sftp-2016 | sftp-2016|
|sle-hpc-15-sp4 | gen1, gen2 |
|sle-hpc-15-sp4-byos | gen1, gen2 |
|sle-hpc-15-sp5 |  gen1, gen 2 |
|sle-hpc-15-sp5-byos | gen1, gen 2 |
|sles-15-sp1-sapcal | gen1, gen2 |
|sles-15-sp2-basic  | gen2 |
|sles-15-sp2-hpc | gen2 |
|sles-15-sp3-sapcal | gen1, gen2 |
|sles-15-sp4 | gen1, gen2 |
|sles-15-sp4-byos | gen1, gen2 | 
|sles-15-sp4-chost-byos | gen1, gen 2|
|sles-15-sp4-hardened-byos | gen1, gen2 | 
|sles-15-sp5 | gen1, gen2 |
|sles-15-sp5-basic | gen1, gen2 |
|sles-15-sp5-byos | gen1, gen2| 
|sles-15-sp5-hardened-byos | gen1, gen2 |
|sles-15-sp5-sapcal | gen1, gen2 |
|sles-byos | 12-sp4, 12-sp4-gen2 |
|sles-sap | 12-sp4, 12-sp4-gen2 |
|sles-sap-15-sp4-byos | gen1, gen2 |
|sles-sap-15-sp4-hardened-byos | gen1, gen2 |
|sles-sap-15-sp5-byos | gen1, gen2 |
|sles-sap-15-sp5-hardened-byos| gen1, gen2 |
|sles-sap-byos | 12-sp4, 12-sp4-gen2, gen2-12-sp4 |
|sles-sapcal | 12-sp3 |
|sles-standard | 12-sp4-gen2 |
|sles| 12-sp4-gen2 |
|squid-ubuntu-2004 | squid-ubuntu-2004|
|ubuntu-2004 | 2004, 2004-gen2 |
|ubuntu-hpc | 1804, 2004-preview-ndv5, 2004, 2204, 2204-preview-ndv5 |

**Publisher - sles-15-sp5-chost-byos**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| gen1, gen2 |

**Publisher - almalinux**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|almalinux </br> | 8-gen1, 8-gen2, 9-gen1, 9-gen2|
|almalinux-x86_64 | 8-gen1, 8-gen2, 8_7-gen2, 9-gen1, 9-gen2|

**Publisher - aviatrix-systems**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|aviatrix-bundle-payg  | aviatrix-enterprise-bundle-byol|

**Publisher - belindaczsro1588885355210**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|belvmsrv01 |belvmsrv003|| 

**Publisher - canonical**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| *||

**Publisher - cloud-infrastructure-services**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|rds-farm-2019| rds-farm-2019|

**Publisher - cloudera**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cloudera-centos-os| 7_5||

**Publisher - cncf-upstream**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| capi | ubuntu-1804-gen1, ubuntu-2004-gen1, ubuntu-2204-gen1 |

**Publisher - credativ**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| debian | 9, 9-backports |

**Publisher - debian**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| debian-10 | 10, 10-gen2,</br> 10-backports, </br> 10-backports-gen2 |

**Publisher - esri**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|arcgis-enterprise-107| byol-1071||
|pro-byol| pro-byol-29||
|arcgis-enterprise | byol-108 </br> byol-109 </br> byol-111 </br> byol-1081 </br> byol-1091|
|esri|arcgis-enterprise-106| byol-1061||

**Publisher - erockyenterprisesoftwarefoundationinc1653071250513**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| rockylinux | free |
| rockylinux-9 | rockylinux-9 |

**Publisher - microsoft-aks**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|aks |aks-engine-ubuntu-1804-202112 | |

**Publisher - microsoft-dsvm**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|aml-workstation |  ubuntu-20, ubuntu-20-gen2 | |
|aml-workstation | ubuntu |


**Publisher - microsoftcblmariner**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|cbl-mariner | cbl-mariner-1 </br> 1-gen2 </br> cbl-mariner-2 </br> cbl-mariner-2-gen2. | |
|cbl-mariner-1,1-gen2, cbl-mariner-2, cbl-mariner-2-gen2 |

**Publisher - microsoftsqlserver**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| * | * |**Offers**: sql2019-sles* </br> sql2019-rhel7 </br> sql2017-rhel 7 </br></br> Example  </br> Publisher: </br> microsoftsqlserver </br> Offer: sql2019-sles12sp5 </br> sku:webARM </br></br> Publisher: microsoftsqlserver </br> Offer: sql2019-rhel7 </br> sku: web-ARM | 
| * | *|**Offers**:  sql2019-sles*</br> sql2019-rhel7 </br> sql2017-rhel7 |

**Publisher - nginxinc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|nginx-plus-ent-v1 | nginx-plus-ent-centos7 |

**Publisher  ntegralinc1586961136942**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|ntg_oracle_8_7| ntg_oracle_8_7|

**Publisher - openlogic**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| centos | 7.2, 7.3, 7.4, 7.5, 7.6, 7_8, 7_9, 7_9-gen2 |

**Publisher - oracle**
|
 **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|oracle-linux | 7*, ol7*, ol8*, ol9*, ol9-lvm*, 8, 8-ci, 81, 81-ci, 81-gen2 |

**Publisher - procomputers**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|almalinux-8-7| almalinux-8-7||
|rhel-8-2 | rhel-8-2||

**Publisher - redhat**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|rhel | 8.1||
|rhel | 89-gen2 |
|rhel-sap | 7.4| |
|rhel-sap | 7.7 |
|rhel | 8_9||
|rhel-byos | rhel-lvm79 </br> rhel-lvm79-gen2 </br> rhel-lvm8 </br> rhel-lvm82-gen2 </br> rhel-lvm83 </br> rhel-lvm84 </br> rhel-lvm84-gen2 </br> rhel-lvm85-gen2 </br> rhel-lvm86 </br> rhel-lvm86-gen2 </br> rhel-lvm87-gen2 </br> rhel-raw76 </br> |
|rhel-byos |rhel-lvm88 </br> rhel-lvm88-gent2 </br> rhel-lvm92 </br>rhel-lvm92-gen2 ||
|rhel-ha | 8* | 81_gen2 |
|rhel-raw | 7*,8*,9* | |
|redhat |rhel-sap | 7*|  |
|rhel-sap-apps | 90sapapps-gen2 |
|rhel-sap-ha | 90sapha-gen2 |
|rhel-sap-ha| 7*, 8* | |
|rhel-sap* | 9_0 |
|rhel| 7*,8*,9* |  |
|sap-apps | 7*, 8* |

**Publisher - southrivertech1586314123192**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| tn-ent-payg| Tnentpayg||
| tn-sftp-payg | Tnsftppayg ||

**Publisher - suse**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|opensuse-leap-15-* | gen* |
|sles-12-sp5 | gen1, gen2 |
|sles-12-sp5-* | gen* |
|sles-15-sp2 | gen1, gen2 |
|sles-15-sp5 | gen2 ||
|sles-sap-12-sp5* |gen*  |
|sles-sap-15-* | gen*  </br> **Offer**: sles-sap-15-\*-byos  </br></br> **Sku**: gen\* </br> Example </br> Publisher: suse </br> Offer: sles-sap-15-sp3-byos </br> sku: gen1-ARM  |
|sles-sap-15-sp2-byos | gen2||

**Publisher - talend**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|talend_re_image | tlnd_re|

**Publisher - thorntechnologiesllc**

| **Offer** | **Plan**|**Unsupported image(s)** |
|--- | --- | ---|
| sftpgateway | Sftpgateway|

**Publisher - veeam**

|**Offer** |**Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|office365backup | veeamoffice365backup ||
|veeam-backup-replication| veeam-backup-replication-v11||

**Publisher - zscaler**

|**Offer** |**Plan**|**Unsupported image(s)** |
|--- | --- | ---|
|zscaler-private-access | zpa-con-azure |


### Custom images

Custom images (including images uploaded to [Azure Compute gallery](/azure/virtual-machines/linux/tutorial-custom-images#overview)) which are created from below listed operating systems are supported for all Azure Update Manager operations except automatic VM guest patching. For instructions on how to use Azure Update Manager to manage updates on VMs created from custom images, see [Manage updates for custom images](manage-updates-customized-images.md). 


#### [Windows operating system](#tab/ci-win)

   |**Windows operating systems**|
   |---|
   |Windows Server 2022|
   |Windows Server 2019|
   |Windows Server 2016|
   |Windows Server 2012 R2|
   |Windows Server 2012|
  
#### [Linux operating system](#tab/ci-lin)

   |**Linux operating systems**|
   |---|
   |Oracle Linux 7.x, 8x|
   |Red Hat Enterprise 7, 8, 9|
   |SUSE Linux Enterprise Server 12.x, 15.0-15.4|
   |Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS|
 
---
:::zone-end

::: zone pivot="azure-arc-enabled-servers"

### Azure Arc-enabled servers

The following table lists the operating systems supported on [Azure Arc-enabled servers](/azure/azure-arc/servers/overview).

   |**Operating system**|
   |-------------|
   | Alma Linux 9 |
   | Amazon Linux 2 (x64)   |
   | Amazon Linux 2023 |
   | Debian 10 and 11|
   | Oracle 7.x, 8.x|
   | Oracle Linux 9 |
   | Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |
   | Rocky Linux 8, 9|
   | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS |
   | Windows Server 2012 R2 and higher (including Server Core) |

:::zone-end

::: zone pivot="win-iot-arc-servers"

### Windows IoT Enterprise on Arc enabled servers (preview)

   - Windows 10 IoT Enterprise LTSC 2021 
   - Windows 10 IoT Enterprise LTSC 2019 
   - Windows 11 IoT Enterprise, version 23H2 
   - Windows 11 IoT Enterprise LTSC 2024 

:::zone-end

## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
