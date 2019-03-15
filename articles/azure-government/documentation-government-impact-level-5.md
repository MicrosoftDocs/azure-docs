---
title: Azure Government Overview | Microsoft Docs
description: 'This article provides guidance for Azure Government Cloud configurations required to implement Impact Level 5 workloads for the DoD'
services: azure-government
cloud: gov
documentationcenter: ''
author: dumartin
manager: zakramer

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 02/22/2019
ms.author: dumartin

#Customer intent: As a DoD mission owner I want to know how to implement a workload at Impact Level 5 in Microsoft Azure Government
---
# Overview

Azure Government supports applications that support Impact Level 5 (IL5) data, as defined in the [US Department of Defense Cloud Security Requirements Guide (SRG)](https://iase.disa.mil/cloud_security/Lists/Cloud%20SRG/AllItems.aspx), in all regions. IL5 workloads have a higher degree of impact to the US Department of Defense and must be secured to a higher standard.  When supporting these workloads on Azure Government, their isolation requirements can be met in different ways. The guidance below will address configurations and settings for the isolation required to support IL5 data.  This document will be updated as new implementations are enabled and as new services are accredited for IL5 data by DISA.

## Background

In January 2017, the Impact Level 5 Provisional Authorization (PA) for Azure Government was the first provided to a Hyper Scale cloud provider.  This covered two regions of Azure Government (USDoD Central and USDoD East) that were dedicated to the DoD.  Based on mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA in December 2018 to cover all 6 Azure Government regions while still honoring the isolation requirements needed by the Department of Defense.

Azure Government remains the only Hyper Scale cloud provider to have PaaS accredited at IL5.

## Principles and Approach

To include a service in Impact Level 5 scope, there are two key areas that will be addressed – Storage Isolation and Compute Isolation.  We are focusing on how these services can isolate the compute and storage of Impact Level 5 data.  The SRG allows for a shared management and network infrastructure.

### Compute isolation

The SRG focuses on segmentation of compute when &#39;processing&#39; data for Impact Level 5. This focuses on ensuring that a virtual machine that compromises the physical host cannot impact a DoD workload.  To remove the risk of runtime attacks and ensure long running operations and workloads are not compromised from other workloads on the same host, all Impact Level 5 virtual machines should be isolated on dedicated physical nodes.

For services where the compute processes are obfuscated from access by the owner and stateless in their processing of data; isolation will be accomplished by focusing on the data being processed and how it is stored and retained. This ensures that the data in question is stored in protected mediums and not present on these services for extended periods unless also encrypted as necessary.

### Storage Isolation

In the most recent PA for Azure Government, DISA has approved logical separation of IL5 from other data using cryptographic means.  In Azure this means encryption using keys that are maintained in Azure Key Vault.  The keys are owned and managed by the L5 system owner.

When applying this to services the following evaluation:

- If a service only hosts IL5 data, then the service can control the key on behalf of the end users but must use a dedicated key to protect IL5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, then the service must expose the option for application storing IL5 data to use their own key that is stored in Azure Key Vault.  This gives consumers of the service the ability to implement cryptographic separation.

This ensures all key material for decrypting data is stored separately of the data itself and done so with a hardware key management solution.

## Services

### Azure Storage

Azure Storage consists of multiple data features: Blob storage, File storage, Table storage, and Queue storage. Blob storage supports both standard and premium storage, with premium storage using only SSDs for the fastest performance possible. Storage also includes configurations which modify these storage types, such as hot and cool to provide appropriate speed-of-availability for data scenarios. The below outlines which features of storage currently support IL5 workloads.

When using an Azure Storage account, you must follow the steps for using **Storage Encryption with Key Vault Managed Keys** to ensure the data is protected with customer managed keys.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Blobs** | X | X | X | X | X | X |
| **Files** | X | X | X | X | X | X |
| **Tables** | X | X | X | X | X | X |
| **Queues** | X | X | X | X | X | X |

Tables and Queues when used outside the **USDoD regions** must encrypt the data before inserting into the Table and Queue (instructions [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-client-side-encryption-java)).

#### Storage Encryption with Key Vault Managed Keys

To implement Impact Level 5 compliant controls on an Azure Storage account running in Azure Government outside of the dedicated DoD regions, Encryption at Rest must be implemented with the customer-managed key option enabled (also known as bring-your-own-key).

For more information on how to enable this Azure Storage Encryption feature, please review the supporting documentation [found here](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption-customer-managed-keys).

**Important note:** When using this encryption method, it is important that it is enabled BEFORE content is added to the storage account. Any content added prior will not be encrypted with the selected key, and only encrypted using standard encryption at rest provided by Azure Storage.

### Azure Virtual Machines &amp; Virtual Machine Scale Sets

Microsoft Azure Virtual Machines can be used through multiple deployment mediums. This includes single Virtual Machines as well as Virtual Machines deployed using Azure&#39;s VM Scale Sets feature.

All Virtual Machines should use **Disk Encryption for Virtual Machines,**** Disk Encryption for VMSS,** or place Virtual Machine disks in a storage account that can hold Impact Level 5 data as described in the Azure Storage section.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Virtual Machines** | X | X | X | X | X | X |
| **Virtual Machine Scale Sets (VMSS)** | X | X | X | X | X | X |

When deploying VMs in these regions you must use **Dedicated Virtual Machines** as described below.

#### Dedicated Virtual Machines

Specific VM types when deployed consume the entire physical host for that VM. These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions.  In addition to deploying on these hosts, the underlying storage and disks for these virtual machines must be configured with encryption at rest.

Each of the above VM types can be deployed leveraging VMSS to provide proper compute isolation with all the benefits of VMSS in place. When configuring your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

Current VM SKUs that offer necessary compute isolation include specific offerings from our VM families:

| VM Family\*\* | VM SKU |
| --- | --- |
| D-Series - General Purpose | Standard\_DS15\_v2Standard\_D15\_v2 |
| Memory Optimized | Standard\_E64is\_v3Standard\_E64i\_v3 |
| Compute Optimized | Standard\_F72s\_v2 |
| Large Memory Optimized | Standard\_M128ms |
| GPU Enabled VMs | Standard\_NV24 |

**Note:** As new hardware generations become available, some VM types may require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. This document will be updated to reflect any changes.

#### Disk Encryption for Virtual Machines

The storage supporting these Virtual Machines can be encrypted in one of two ways to support necessary encryption standards.

- Leverage Azure Disk Encryption to encrypt the drives using DM-Crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-linux)
  - [Enable Azure Disk Encryption for Windows](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-windows)
- Leverage Azure Storage Service Encryption for Storage Accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage Service Encryption with Customer Managed Keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption-customer-managed-keys)

#### Disk Encryption using Virtual Machine Scale Sets (VMSS)

The disks that support Virtual Machine Scale Sets can be encrypted using Azure Disk Encryption:

- [Encrypt Disks with Virtual Machine Scale Sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-encrypt-disks-ps)

### Azure Import/Export

Azure Import/Export can be used in Azure Government to import/export impact level 5 data.  By default, Import/Export will encrypt the data that is written to the disk drive for transport. When creating a target storage account for Import/Export of impact level 5 data add storage at rest encryption via Azure Key Vault (additional documentation and guidance found here).

The target storage account for Import and source storage account for Export can reside in the any of the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Import/Export** | X | X | X | X | X | X |

### Azure Service Fabric

Azure Service Fabric can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Leverage Azure Service Fabric in the dedicated Azure DoD regions

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Service Fabric** |   |   |   |   | X | X |

### Azure Web Apps

Azure Web Apps can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- To accommodate proper network and internet isolation, leverage the Web Apps Isolated SKU. More information can be found [here](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Web Apps** | X | X | X | X | X | X |

### Azure Monitor

Azure Monitor can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Monitor** | X | X | X | X | X | X |

### Azure Active Directory

Azure Active Directory can be used in all Azure Government regions, supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Active Directory** | X | X | X | X | X | X |

### Microsoft Graph

Microsoft Graph can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Microsoft Graph** | X | X | X | X | X | X |

### Azure ExpressRoute

ExpressRoute can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **ExpressRoute** | X | X | X | X | X | X |

### Azure Load Balancer

Load Balancer can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Load Balancer** | X | X | X | X | X | X |

### Azure Traffic Manager

Azure Traffic Manager can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Traffic Manager** | X | X | X | X | X | X |

### Azure Virtual Network

Azure Virtual Network can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Virtual Network** | X | X | X | X | X | X |

### Azure VPN Gateway

Azure VPN Gateway can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **VPN Gateway** | X | X | X | X | X | X |

### Azure Batch

Azure Batch can be used in Azure Government supporting impact level 5 workloads in the following configurations:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Batch** | X | X | X | X | X | X |

 Enable User Subscription Mode which will require a Key Vault instance for proper encryption and key storage (see documentation [here](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal)).

### Azure Service Bus

Azure Service Bus can be used in Azure Government supporting impact level 5 workloads in the following configurations:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Service Bus** | X[^1] | X[^1] | X[^1] | X[^1] | X | X |

 [^1]: Use client-side encryption to encrypt data prior to leveraging Azure Service Bus?

### Azure Event Hubs

Azure Event Hubs can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Leverage Azure Event Hubs in the dedicated Azure DoD regions

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Event Hubs** | X[^2] | X[^2] | X[^2] | X[^2] | X | X |

[^2]: Use client-side encryption to encrypt data prior to leveraging Azure Event Hubs

### Azure API Management

Azure API Management can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **API Management** | X | X | X | X | X | X |

### Azure Media Services

Azure Media Services can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Leverage Azure Media Services in the dedicated Azure DoD regions

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Media Services** |   |   |   |   | X | X |

### Azure Key Vault

Azure Key Vault can be used in Azure Government supporting all impact levels with no additional configuration required between regions.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Key Vault** | X | X | X | X | X | X |

### Azure SQL Database

Azure SQL Database can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found [here](https://docs.microsoft.com/en-us/azure/sql-database/transparent-data-encryption-byok-azure-sql)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL DB** | X | X | X | X | X | X |

### Azure SQL Stretch Database

Azure SQL Stretch Database can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found [here](https://docs.microsoft.com/en-us/azure/sql-database/transparent-data-encryption-byok-azure-sql)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL Stretch DB** | X | X | X | X | X | X |

### Azure CosmosDB

Azure CosmosDB can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Leverage Azure CosmosDB in the dedicated Azure DoD regions

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure CosmosDB** |  |  |  |  | X | X |

### Azure HDInsight

Azure HDInsight can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Azure HDInsight can be deployed to existing storage accounts which have enabled appropriate Storage Service Encryption as discussed in the Azure Storage for guidance.
- Azure HDInsight enables a database option for certain configurations, ensure the appropriate database configuration for TDE is enabled on the chosen option as discussed in the SQL Database for guidance.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure HDInsight** | X | X | X | X | X | X |

### Azure SQL Data Warehouse

Azure SQL Warehouse can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found [here](https://docs.microsoft.com/en-us/azure/sql-database/transparent-data-encryption-byok-azure-sql)).

**Note:** The instructions to enable this are the same as for Azure SQL database.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL Data Warehouse** | X | X | X | X | X | X |

### Power BI Embedded

Power BI Embedded can be used in Azure Government supporting impact level 5 workloads in the following configurations:

- Leverage Power BI Embedded in the dedicated Azure DoD regions

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Power BI Embedded** |   |   |   |   | X | X |
