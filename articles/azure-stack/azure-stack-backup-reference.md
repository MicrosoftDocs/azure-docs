---
title: Azure Stack Infrastructure Backup Service reference | Microsoft Docs
description: This article contains reference material for the Azure Stack Infrastructure Backup Service.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: D6EC0224-97EA-446C-BC95-A3D32F668E2C
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/17/2018
ms.author: jeffgilb
ms.reviewer: hectorl

---
# Infrastructure Backup Service reference

## Azure backup infrastructure

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack consists of many services that comprise the portal, Azure Resource Manager, and infrastructure management experience. The appliance-like management experience of Azure Stack focuses on reducing the complexity exposed to the operator of the solution.

Infrastructure Backup is designed to internalize the complexity of backing up and restoring data for infrastructure services, ensuring operators can focus on managing the solution and maintaining an SLA to users.

Exporting the backup data to an external share is required to avoid storing backups on the same system. Requiring an external share gives the administrator the flexibility to determine where to store the data based on existing company BC/DR policies. 

### Infrastructure Backup components

Infrastructure Backup includes the following components:

 - **Infrastructure Backup Controller**  
 The Infrastructure Backup Controller is instantiated with and resides in every Azure Stack Cloud.
 - **Backup Resource Provider**  
 The Backup Resource Provider (Backup RP) is composed of the user interface and application program interfaces (API)s exposing basic backup functionality for Azure Stack infrastructure.

#### Infrastructure Backup Controller

The Infrastructure Backup Controller is a Service Fabric service gets instantiated for an Azure Stack Cloud. Backup resources are created at a regional level and capture region-specific service data from AD, CA, Azure Resource Manager, CRP, SRP, NRP, KeyVault, RBAC. 

### Backup Resource Provider

The Backup Resource Provider presents user interface in the Azure Stack portal for basic configuration and listing of backup resources. Operator can perform the following operations in the user interface:

 - Enable backup for the first time by providing external storage location, credentials, and encryption key
 - View completed created backup resources and status resources under creation
 - Modify the storage location where Backup Controller places backup data
 - Modify the credentials that Backup Controller uses to access external storage location
 - Modify the encryption key that Backup Controller uses to encrypt backups 


## Backup Controller requirements

This section describes the important requirements for Infrastructure Backup. We recommend that you review the information carefully before you enable backup for your Azure Stack instance, and then refer back to it as necessary during deployment and subsequent operation.

The requirements include:

  - **Software requirements** – describes supported storage locations and sizing guidance. 
  - **Network requirements** – describes network requirements for different storage locations.  

### Software requirements

#### Supported storage locations

| Storage location                                                                 | Details                                                                                                                                                  |
|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| SMB file share hosted on a storage device within the trusted network environment | SMB share in the same datacenter where Azure Stack is deployed or in a different datacenter. Multiple Azure Stack instances can use the same file share. |
| SMB file share on Azure                                                          | Not currently supported.                                                                                                                                 |
| Blob storage on Azure                                                            | Not currently supported.                                                                                                                                 |

#### Supported SMB versions

| SMB | Version |
|-----|---------|
| SMB | 3.x     |

#### Storage location sizing 

Infrastructure Backup Controller will back up data on demand. The recommendation is to back up at last two times a day and keep at most seven days of backups. 

| Environment Scale | Projected size of backup | Total amount of space required |
|-------------------|--------------------------|--------------------------------|
| 4-12 nodes        | 10 GB                     | 140 GB                          |

### Network requirements
| Storage location                                                                 | Details                                                                                                                                                                                 |
|----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SMB file share hosted on a storage device within the trusted network environment | Port 445 is required if the Azure Stack instance resides in a firewalled environment. Infrastructure Backup Controller will initiate a connection to the SMB file server over port 445. |
| To use FQDN of file server, the name must be resolvable from the PEP             |                                                                                                                                                                                         |

> [!Note]  
> No inbound ports need to be opened.


## Infrastructure Backup Limits

Consider these limits as you plan, deploy, and operate your Microsoft Azure Stack instances. The following table describes these limits.

### Infrastructure Backup limits
| Limit identifier                                                 | Limit        | Comments                                                                                                                                    |
|------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| Backup type                                                      | Full only    | Infrastructure Backup Controller only supports full backups. Incremental backups are not supported.                                          |
| Scheduled backups                                                | Manual only  | Backup controller currently only supports on-demand backups                                                                                 |
| Maximum concurrent backup jobs                                   | 1            | Only one active backup job is supported per instance of Backup Controller.                                                                  |
| Network switch configuration                                     | Not in scope | Administrator must back up network switch configuration using OEM tools. Refer to documentation for Azure Stack provided by each OEM vendor. |
| Hardware Lifecycle Host                                          | Not in scope | Administrator must back up Hardware Lifecycle Host using OEM tools. Refer to documentation for Azure Stack provided by each OEM vendor.      |
| Maximum number of file shares                                    | 1            | Only one file share can be used to store backup data                                                                                        |
| Backup App Services, Function, SQL, mysql resource provider data | Not in scope | Refer to guidance published for deploying and managing value-add RPs created by Microsoft.                                                  |
| Backup third-party resource providers                              | Not in scope | Refer to guidance published for deploying and managing value-add RPs created by third-party vendors.                                          |

## Next steps

 - To learn more about the Infrastructure Backup Service, see [Backup and data recovery for Azure Stack with the Infrastructure Backup Service](azure-stack-backup-infrastructure-backup.md).