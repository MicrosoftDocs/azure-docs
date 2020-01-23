---
title: SAP HANA Backup support matrix
description: In this article, learn about the supported scenarios and limitations when you use Azure backup to back up SAP HANA databases on Azure VMs.
ms.topic: conceptual
ms.date: 11/7/2019
---

# Support matrix for backup of SAP HANA databases on Azure VMs

Azure Backup supports the backup of SAP HANA databases to Azure. This article summarizes the scenarios supported and limitations present when you use Azure Backup to back up SAP HANA databases on Azure VMs.

## Onboard to the public preview

Onboard to the public preview as follows:

* In the portal, register your subscription ID to the Recovery Services service provider by [following this article](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-register-provider-errors#solution-3---azure-portal).
* For PowerShell, run this cmdlet. It should complete as "Registered".

```PowerShell
Register-AzProviderFeature -FeatureName "HanaBackup" –ProviderNamespace Microsoft.RecoveryServices
```

> [!NOTE]
> The frequency of log backup can now be set to a minimum of 15 minutes. Log backups only begin to flow after a successful full backup for the database has completed.

## Scenario support

| **Scenario**               | **Supported  configurations**                                | **Unsupported  configurations**                              |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Topology**               | SAP HANA running in Azure Linux  VMs only                    | HANA Large Instances (HLI)                                   |
| **Geos**                   | Australia South East, East  Australia    Brazil South    Canada Central, Canada East    South East Asia, East Asia    East US, East US 2, West Central US, West US, West  US 2, North Central US, Central US, South Central US   India Central, India South    Japan East, Japan West   Korea Central, Korea South    North Europe, West Europe    UK South, UK West | Australia Central, Australia  Central 2  China East, China North, China  East2, China North 2  West India   France Central, France South  Germany North, Germany West  Central  Switzerland North, Switzerland  West  South Africa North, South Africa  West, UAE North, UAE Central  Azure Government regions |
| **OS versions**            | SLES 12 with SP2, SP3, or SP4           | SLES 15, RHEL                                                |
| **HANA versions**          | SDC on HANA 1.x, MDC on HANA 2.x  <= SPS04 Rev 44           | -                                                            |
| **HANA deployments**       | SAP HANA on a single Azure VM -  Scale up only               | Scale-out                                                    |
| **HANA Instances**         | A single SAP HANA instance on a  single Azure VM – scale up only | Multiple SAP HANA instances on a  single VM                  |
| **HANA database types**    | Single Database Container (SDC)  ON 1.x, Multi-Database Container (MDC) on 2.x | MDC in HANA 1.x                                              |
| **HANA database size**     | 2-TB full backup size as reported by HANA) |                                                              |
| **Backup types**           | Full, Differential, and Log backups                           | Incremental, Snapshots                                       |
| **Restore types**          | Refer to the SAP HANA Note [1642148](https://launchpad.support.sap.com/#/notes/1642148) to learn about the supported restore types |                                                              |
| **Backup limits**          | Up to 2 TB of full backup size per SAP HANA instance  |                                                              |
| **Special configurations** |                                                              | SAP HANA + Dynamic Tiering <br>  Cloning through LaMa            |

------

> [!NOTE]
> Backup and restore operations from SAP HANA native clients (SAP HANA Studio/ Cockpit/ DBA Cockpit) aren't currently supported.



## Next steps

* Learn how to [Backup SAP HANA databases running on Azure VMs](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database)
* Learn how to [Restore SAP HANA databases running on Azure VMs](https://docs.microsoft.com/azure/backup/sap-hana-db-restore)
* Learn how to [manage SAP HANA databases that are backed up using Azure Backup](sap-hana-db-manage.md)
* Learn how to [troubleshoot common issues when backing up SAP HANA databases](https://docs.microsoft.com/azure/backup/backup-azure-sap-hana-database-troubleshoot)
