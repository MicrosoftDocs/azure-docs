---
title: Configure SAP parameters files for Ansible
description: Learn how to define SAP parameters for Ansible.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 03/17/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible
---

# Configure SAP installation parameters

The Ansible playbooks use a combination of default parameters and parameters defined by the Terraform deployment for the SAP installation.

## Default parameters

The following tables contain the default parameters defined by the framework.

### User IDs

This table contains the IDs for the SAP users and groups for the different platforms.

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                       | Description                                                                | Default value                |
> | ------------------------------- | -------------------------------------------------------------------------- | ---------------------------- | 
> | HANA                            |                                                                            |                              |
> | `sapadm_uid`                    | The UID for the sapadm account                                            | 2100                         |
> | `sidadm_uid`                    | The UID for the sidadm account                                            | 2003                         |
> | `hdbadm_uid`                    | The UID for the hdbadm account                                            | 2200                         |
> | `sapinst_gid`                   | The GID for the sapinst group                                             | 2001                         |
> | `sapsys_gid`                    | The GID for the sapsys group                                              | 2000                         |
> | `hdbshm_gid`                    | The GID for the hdbshm group                                              | 2002                         |
> | DB2                             |                                                                            |                              |
> | `db2sidadm_uid`                 | The UID for the db2sidadm account                                         | 3004                         |
> | `db2sapsid_uid`                 | The UID for the db2sapsid account                                         | 3005                         |
> | `db2sysadm_gid`                 | The UID for the db2sysadm group                                           | 3000                         |
> | `db2sysctrl_gid`                | The UID for the db2sysctrl group                                          | 3001                         |
> | `db2sysmaint_gid`               | The UID for the db2sysmaint group                                         | 3002                         |
> | `db2sysmon_gid`                 | The UID for the db2sysmon group                                           | 2003                         |
> | ORACLE                          |                                                                            |                              |
> | `orasid_uid`                    | The UID for the orasid account                                            | 3100                         |
> | `oracle_uid`                    | The UID for the oracle account                                            | 3101                         |
> | `observer_uid`                  | The UID for the observer account                                          | 4000                         |
> | `dba_gid`                       | The GID for the dba group                                                 | 3100                         |
> | `oper_gid`                      | The GID for the oper group                                                | 3101                         |
> | `asmoper_gid`                   | The GID for the asmoper group                                             | 3102                         |
> | `asmadmin_gid`                  | The GID for the asmadmin group                                            | 3103                         |
> | `asmdba_gid`                    | The GID for the asmdba group                                              | 3104                         |
> | `oinstall_gid`                  | The GID for the oinstall group                                            | 3105                         |
> | `backupdba_gid`                 | The GID for the backupdba group                                           | 3106                         |
> | `dgdba_gid`                     | The GID for the dgdba group                                               | 3107                         |
> | `kmdba_gid`                     | The GID for the kmdba group                                               | 3108                         |
> | `racdba_gid`                    | The GID for the racdba group                                              | 3108                         |

### Windows parameters

This table contains the information pertinent to Windows deployments.

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                       | Description                                                                | Default value                |
> | ------------------------------- | -------------------------------------------------------------------------- | ---------------------------- | 
> | `mssserver_version`             | SQL Server version                                                         | `mssserver2019`              |

## Parameters

The following tables contain the parameters stored in the *sap-parameters.yaml* file. Most of the values are prepopulated via the Terraform deployment.

### Infrastructure

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `sap_fqdn`                | The FQDN suffix for the virtual machines to be added to the local hosts file                                     | Required |

### Application tier

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `bom_base_name`           | The name of the SAP Application Bill of Materials file                                                           | Required   |
> | `sap_sid`                 | The SID of the SAP application                                                                                   | Required   |
> | `scs_high_availability`   | Defines if the central services is deployed highly available                                                     | Required   |
> | `scs_instance_number`     | Defines the instance number for ASCS                                                                             | Optional   |
> | `scs_lb_ip`               | IP address of ASCS instance                                                                                      | Optional   |
> | `scs_virtual_hostname`    | The host name of the ASCS instance                                                                               | Optional   |
> | `ers_instance_number`     | Defines the instance number for ERS                                                                              | Optional   |
> | `ers_lb_ip`               | IP address of ERS instance                                                                                       | Optional   |
> | `ers_virtual_hostname`    | The host name of the ERS instance                                                                                | Optional   |
> | `pas_instance_number`     | Defines the instance number for PAS                                                                              | Optional   |
> | `web_sid`                 | The SID for the web dispatcher                                                                                   | Required if web dispatchers are deployed  |
> | `scs_clst_lb_ip`          | IP address of Windows cluster service                                                                            | Optional   |

### Database tier

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                 | Description                                                                                                      | Type       |
> | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `db_sid`                  | The SID of the SAP database.                                                                                      | Required   |
> | `db_instance_number`      | Defines the instance number for the database.                                                                     | Required   |
> | `db_high_availability`    | Defines if the database is deployed highly available.                                                             | Required   |
> | `db_lb_ip`                | IP address of the database load balancer.                                                                         | Optional   |
> | `platform`                | The database platform. Valid values are ASE, DB2, HANA, ORACLE, and SQLSERVER.                                       | Required   |
> | `db_clst_lb_ip`           | IP address of database cluster for Windows.                                                                       | Optional   |

### NFS

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `NFS_provider`               | Defines what NFS back end to use. The options are `AFS` for Azure Files NFS or `ANF` for Azure NetApp Files, `NONE` for NFS from the SCS server, or `NFS` for an external NFS solution.  | Optional |
> | `sap_mnt`                    | The NFS path for sap_mnt.                                                                                         | Required   |
> | `sap_trans`                  | The NFS path for sap_trans.                                                                                       | Required   |
> | `usr_sap_install_mountpoint` | The NFS path for usr/sap/install.                                                                                 | Required   |

### Azure NetApp Files
> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `hana_data`                  | The NFS path for hana_data volumes                                                                               | Required   |
> | `hana_log`                   | The NFS path for hana_log volumes                                                                                | Required   |
> | `hana_shared`                | The NFS path for hana_shared volumes                                                                             | Required   |
> | `usr_sap`                    | The NFS path for /usr/sap volumes                                                                                | Required   |

### Windows support

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `domain_name`                | Defines the Windows domain name, for example, sap.contoso.net                                                    | Required   |
> | `domain`                     | Defines the Windows domain Netbios name, for example, sap                                                        | Optional   |
> | SQL                          |                                                                                                                  |            |
> | `use_sql_for_SAP`            | Uses the SAP-defined SQL Server media, defaults to `true`                                                        | Optional   |
> | `win_cluster_share_type`     | Defines the cluster type (CSD/FS), defaults to CSD                                                               | Optional   |

### Miscellaneous

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `kv_name`                    | The name of the Azure key vault that contains the system credentials                                                | Required   |
> | `secret_prefix`              | The prefix for the name of the secrets for the SID stored in the key vault                                           | Required   |
> | `upgrade_packages`           | Updates all installed packages on the virtual machines                                                            | Required   |
> | `use_msi_for_clusters`       | Uses managed identities for fencing                                                                               | Required   |

### Disks

Disks define a dictionary with information about the disks of all the virtual machines in the SAP application virtual machines.

> [!div class="mx-tdCol2BreakAll "]
> | Attribute                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `host`                       | The computer name of the virtual machine.                                                                         | Required   |
> | `LUN`                        | Defines the LUN number that the disk is attached to.                                                              | Required   |
> | `type`                       | This attribute is used to group the disks. Each disk of the same type is added to the LVM on the virtual machine. | Required   |

Example of the disks dictionary:

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

From the v3.4 release, it's possible to deploy SAP on Azure systems in a shared home configuration by using an Oracle database back end. For more information on running SAP on Oracle in Azure, see [Azure Virtual Machines Oracle DBMS deployment for SAP workload](../workloads/dbms-guide-oracle.md).

To install the Oracle back end by using SAP Deployment Automation Framework, you need to provide the following parameters:

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `platform`                   | The database back end, `ORACLE`                                                                                   | Required   |
> | `ora_release`                | The Oracle release version, for example, 19                                                                       | Required   |
> | `ora_release`                | The Oracle release version, for example, 19.0.0                                                                   | Required   |
> | `oracle_sbp_patch`           | The Oracle SBP patch file name                                                                                   | Required   |

#### Shared home support

To configure shared home support for Oracle, you need to add a dictionary that defines the SIDs to be deployed. You can do that by adding the parameter `MULTI_SIDS` that contains a list of the SIDs and the SID details.

```yaml
MULTI_SIDS:
- {sid: 'DE1', dbsid_uid: '3005', sidadm_uid: '2001', ascs_inst_no: '00', pas_inst_no: '00', app_inst_no: '00'}
- {sid: 'QE1', dbsid_uid: '3006', sidadm_uid: '2002', ascs_inst_no: '01', pas_inst_no: '01', app_inst_no: '01'}
```

Each row must specify the following parameters:

> [!div class="mx-tdCol2BreakAll "]
> | Parameter                    | Description                                                                                                      | Type       |
> | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- | 
> | `sid`                        | The SID for the instance                                                                                         | Required   |
> | `dbsid_uid`                  | The UID for the DB admin user for the instance                                                                   | Required   |
> | `sidadm_uid`                 | The UID for the SID admin user for the instance                                                                  | Required   |
> | `ascs_inst_no`               | The ASCS instance number for the instance                                                                        | Required   |
> | `pas_inst_no`                | The PAS instance number for the instance                                                                         | Required   |
> | `app_inst_no`                | The APP instance number for the instance                                                                         | Required   |

## Override the default parameters

You can override the default parameters by either specifying them in the *sap-parameters.yaml* file or by passing them as command-line parameters to the Ansible playbooks.

For example, if you want to override the default value of the group ID for the `sapinst` group (`sapinst_gid`) parameter, add the following line to the *sap-parameters.yaml* file:

```yaml
sapinst_gid: 1000
```

If you want to provide them as parameters for the Ansible playbooks, add the following parameter to the command line:

```bash
ansible-playbook -i hosts SID_hosts.yaml --extra-vars "sapinst_gid=1000" .....
```

You can also override the default parameters by specifying them in the `configuration_settings` variable in your `tfvars` file. For example, if you want to override `sapinst_gid`, your `tfvars` file should contain the following line:

```terraform
configuration_settings = {
  sapinst_gid = "1000"
}
```

## Next step

> [!div class="nextstepaction"]
> [Deploy the SAP system](deploy-system.md)
