---
title: Configure SAP parameters file for Ansible
description: Define SAP parameters for Ansible
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 02/14/2022
ms.topic: conceptual
ms.service: virtual-machines-sap
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
> | `usr_sap_install_mountpoint' | The NFS path for usr/sap/install                                                                                 | Required   |

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

## Next steps

> [!div class="nextstepaction"]
> [Deploy SAP System](automation-deploy-system.md)

