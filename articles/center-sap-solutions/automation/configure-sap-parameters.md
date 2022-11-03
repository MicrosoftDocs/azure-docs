---
title: Configure SAP parameters file for Ansible
description: Define SAP parameters for Ansible
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: azure-center-sap-solutions
---

# Configure sap-parameters file 

Ansible will use a file called sap-parameters.yaml that will contain the parameters required for the Ansible playbooks. The file is a .yaml file. 

## Parameters

The table below contains the parameters stored in the sap-parameters.yaml file, most of the values are pre-populated via the Terraform deployment.

### Infrastructure

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `sap_fqdn`                | The FQDN suffix for the virtual machines to be added to the local hosts file                                     | Required |

### Application Tier

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `bom_base_name`           | The name of the SAP Application Bill of Materials file                                                           | Required   |
> | `sap_sid`                 | The SID of the SAP application                                                                                   | Required   |
> | `scs_high_availability`   | Defines if the Central Services is deployed highly available                                                     | Required   |
> | `scs_instance_number`     | Defines the instance number for ASCS                                                                             | Required   |
> | `scs_lb_ip`               | IP address of ASCS instance                                                                                      | Required   |
> | `ers_instance_number`     | Defines the instance number for ERS                                                                              | Required   |
> | `ers_lb_ip`               | IP address of ERS instance                                                                                       | Required   |
> | `pas_instance_number`     | Defines the instance number for PAS                                                                              | Required   |

### Database Tier

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `db_sid`                  | The SID of the SAP database                                                                                      | Required   |
> | `db_high_availability`    | Defines if the database is deployed highly available                                                             | Required   |
> | `db_lb_ip`                | IP address of the database load balancer                                                                         | Required   |
> | `platform`                | The database platform. Valid values are: ASE, DB2, HANA, ORACLE, SQLSERVER                                       | Required   |

### NFS

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `NFS_provider`               | Defines what NFS backend to use, the options are 'AFS' for Azure Files NFS or 'ANF' for Azure NetApp files, 'NONE' for NFS from the SCS server or 'NFS' for an external NFS solution.  | Optional |
> | `sap_mnt`                    | The NFS path for sap_mnt                                                                                         | Required   |
> | `sap_trans`                  | The NFS path for sap_trans                                                                                       | Required   |
> | `usr_sap_install_mountpoint` | The NFS path for usr/sap/install                                                                                 | Required   |

### Miscellaneous

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `kv_name`                    | The name of the Azure key vault containing the system credentials                                                | Required   |
> | `secret_prefix`              | The prefix for the name of the secrets for the SID stored in key vault                                           | Required   |
> | `upgrade_packages`           | Update all installed packages on the virtual machines                                                            | Required   |

### Disks

Disks is a dictionary defining the disks of all the virtual machines in the SID.

> [!div class="mx-tdCol2BreakAll "]
> | attribute                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `host`                       | The computer name of the virtual machine                                                                         | Required   |
> | `LUN`                        | Defines the LUN number that the disk is attached to                                                              | Required   |
> | `type`                       | This attribute is used to group the disks, each disk of the same type will be added to the LVM on the virtual machine | Required   |


See sample below
```yaml

disks:
  - { host: 'rh8dxdb00l084', LUN: 0, type: 'sap' }
  - { host: 'rh8dxdb00l084', LUN: 10, type: 'data' }
  - { host: 'rh8dxdb00l084', LUN: 11, type: 'data' }
  - { host: 'rh8dxdb00l084', LUN: 12, type: 'data' }
  - { host: 'rh8dxdb00l084', LUN: 13, type: 'data' }
  - { host: 'rh8dxdb00l084', LUN: 20, type: 'log' }
  - { host: 'rh8dxdb00l084', LUN: 21, type: 'log' }
  - { host: 'rh8dxdb00l084', LUN: 22, type: 'log' }
  - { host: 'rh8dxdb00l084', LUN: 2, type: 'backup' }
  - { host: 'rh8dxdb00l184', LUN: 0, type: 'sap' }
  - { host: 'rh8dxdb00l184', LUN: 10, type: 'data' }
  - { host: 'rh8dxdb00l184', LUN: 11, type: 'data' }
  - { host: 'rh8dxdb00l184', LUN: 12, type: 'data' }
  - { host: 'rh8dxdb00l184', LUN: 13, type: 'data' }
  - { host: 'rh8dxdb00l184', LUN: 20, type: 'log' }
  - { host: 'rh8dxdb00l184', LUN: 21, type: 'log' }
  - { host: 'rh8dxdb00l184', LUN: 22, type: 'log' }
  - { host: 'rh8dxdb00l184', LUN: 2, type: 'backup' }
  - { host: 'rh8app00l84f', LUN: 0, type: 'sap' }
  - { host: 'rh8app01l84f', LUN: 0, type: 'sap' }
  - { host: 'rh8scs00l84f', LUN: 0, type: 'sap' }
  - { host: 'rh8scs01l84f', LUN: 0, type: 'sap' }
```

### Oracle support

From the v3.4 release, it is possible to deploy SAP on Azure systems in a Shared Home configuration using an Oracle database backend. For more information on running SAP on Oracle in Azure, see [Azure Virtual Machines Oracle DBMS deployment for SAP workload](dbms_guide_oracle.md). 

In order to install the Oracle backend using the SAP on Azure Deployment Automation Framework, you need to provide the following parameters

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `platform`                   | The database backend, 'ORACLE'                                                                                   | Required   |
> | `ora_release`                | The Oracle release version, for example 19                                                                       | Required   |
> | `ora_release`                | The Oracle release version, for example 19.0.0                                                                   | Required   |
> | `oracle_sbp_patch`           | The Oracle SBP patch file name                                                                                   | Required   |

### Shared Home support

To configure shared home support for Oracle, you need to add a dictionary defining the SIDs to be deployed. You can do that by adding the parameter 'MULTI_SIDS' that contains a list of the SIDs and the SID details.

```yaml
MULTI_SIDS:
- {sid: 'DE1', dbsid_uid: '3005', sidadm_uid: '2001', ascs_inst_no: '00', pas_inst_no: '00', app_inst_no: '00'}
- {sid: 'QE1', dbsid_uid: '3006', sidadm_uid: '2002', ascs_inst_no: '01', pas_inst_no: '01', app_inst_no: '01'}
```

Each row must specify the following parameters.
 
> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `sid`                        | The SID for the instance                                                                                         | Required   |
> | `dbsid_uid`                  | The UID for the DB admin user for the instance                                                                   | Required   |
> | `sidadm_uid`                 | The UID for the SID admin user for the instance                                                                  | Required   |
> | `ascs_inst_no`               | The ASCS instance number for the instance                                                                        | Required   |
> | `pas_inst_no`                | The PAS instance number for the instance                                                                         | Required   |
> | `app_inst_no`                | The APP instance number for the instance                                                                         | Required   |


## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP System](deploy-system.md)

