---
title: Azure Government Isolation Guidelines for Impact Level 5 | Microsoft Docs
description: 'This article provides guidance for Azure Government Cloud configurations required to implement Impact Level 5 workloads for the DoD'
services: azure-government
cloud: gov
documentationcenter: ''
author: dumartinmsft
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
# Isolation guidelines for Impact Level 5 Workloads

Azure Government supports applications in all regions that require Impact Level 5 (IL5) data, as defined in the [US Department of Defense Cloud Security Requirements Guide (SRG)](https://iase.disa.mil/cloud_security/Lists/Cloud%20SRG/AllItems.aspx). IL5 workloads have a higher degree of impact to the US Department of Defense and must be secured to a higher standard.  When supporting these workloads on Azure Government, their isolation requirements can be met in different ways. The guidance below will address configurations and settings for the isolation required to support IL5 data.  This document will be updated as new implementations are enabled and as new services are accredited for IL5 data by DISA.

## Background

In January 2017, the Impact Level 5 Provisional Authorization (PA) for Azure Government was the first provided to a Hyper Scale cloud provider.  This covered two regions of Azure Government (USDoD Central and USDoD East) that were dedicated to the DoD.  Based on mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA in December 2018 to cover all six Azure Government regions while still honoring the isolation requirements needed by the Department of Defense.

Azure Government continues to provide more PaaS features and services to the DoD at Impact Level 5 than any other cloud provider.

## Principles and approach

To include a service in Impact Level 5 scope, there are two key areas that will be addressed – Storage Isolation and Compute Isolation.  We are focusing on how these services can isolate the compute and storage of Impact Level 5 data.  The SRG allows for a shared management and network infrastructure.

### Compute isolation

The SRG focuses on segmentation of compute when 'processing' data for Impact Level 5. This means ensuring that a virtual machine that compromises the physical host cannot impact a DoD workload.  To remove the risk of runtime attacks and ensure long running workloads are not compromised from other workloads on the same host, all Impact Level 5 virtual machines should be isolated on dedicated physical nodes.

For services where the compute processes are obfuscated from access by the owner and stateless in their processing of data; isolation will be accomplished by focusing on the data being processed and how it is stored and retained. This approach ensures that the data in question is stored in protected mediums and not present on these services for extended periods unless also encrypted as necessary.

### Storage isolation

In the most recent PA for Azure Government, DISA has approved logical separation of IL5 from other data using cryptographic means.  In Azure this means encryption using keys that are maintained in Azure Key Vault.  The keys are owned and managed by the L5 system owner.

When applying this to services, the following evaluation is applied:

- If a service only hosts IL5 data, then the service can control the key on behalf of the end users but must use a dedicated key to protect IL5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, then the service must expose the option to use their own key for encryption. That key will be stored in Azure Key Vault.  This implementation gives consumers of the service the ability to implement cryptographic separation as needed.

This will ensure all key material for decrypting data is stored separately of the data itself and done so with a hardware key management solution.

## Applying this guidance

Impact Level 5 guidelines require workloads to be deployed with a high degree of security, isolation, and control. The below configurations are required in **addition** to any other configurations or controls needed to meet Impact Level 5. Network isolation, access controls, and other necessary security measures are not necessarily addressed in the guidance below.

Make sure to review the entry for each service you are utilizing and ensure that all isolation requirements have been implemented.

## Analytics services

### [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)

Azure Event Hubs can be used in Azure Government supporting Impact Level 5 workloads in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Event Hubs** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]  
> <sup>1</sup>Use client-side encryption to encrypt data prior to leveraging Azure Event Hubs in the noted regions.

### [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/)

Azure HDInsight can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Azure HDInsight can be deployed to existing storage accounts which have enabled appropriate [Storage Service Encryption](#storage-encryption-with-key-vault-managed-keys) as discussed in the Azure Storage for guidance.
- Azure HDInsight enables a database option for certain configurations, ensure the appropriate database configuration for TDE is enabled on the chosen option as discussed in the SQL Database for guidance.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure HDInsight** | X | X | X | X | X | X |

### [Azure SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/)

Azure SQL Warehouse can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the documentation for [Azure SQL transparent data encryption](../sql-database/transparent-data-encryption-byok-azure-sql.md)).

> [!NOTE]
> The instructions to enable this are the same as for Azure SQL database.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL Data Warehouse** | X | X | X | X | X | X |

### [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/)

Power BI Embedded can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Power BI Embedded** |   |   |   |   | X | X |

## Compute services

### [Azure Batch](https://azure.microsoft.com/services/batch/)

Azure Batch can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Enable User Subscription Mode which will require a Key Vault instance for proper encryption and key storage (see documentation on [batch account configurations](../batch/batch-account-create-portal.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Batch** | X | X | X | X | X | X |

### [Azure Functions](https://azure.microsoft.com/services/functions/)

Azure Functions can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- To accommodate proper network and workload isolation, deploy your Azure Functions on App Service Plans configured to leverage the **Isolated SKU**. More information can be found in the [app services plan documentation](../app-service/overview-hosting-plans.md).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Functions** | X | X | X | X | X | X |

### [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/)

Azure Service Fabric can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Service Fabric** |   |   |   |   | X | X |

### [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) &amp; [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)

Microsoft Azure Virtual Machines can be used through multiple deployment mediums. This includes single Virtual Machines as well as Virtual Machines deployed using Azure's virtual machine scale sets feature.

All Virtual Machines should use Disk Encryption for Virtual Machines, Disk Encryption for virtual machine scale sets, or place Virtual Machine disks in a storage account that can hold Impact Level 5 data as described in the [Azure Storage section](#storage-encryption-with-key-vault-managed-keys).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Virtual Machines** | X<sup>1</sup>  | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |
| **Virtual Machine Scale Sets** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup> When deploying VMs in these regions you must use **Isolated Virtual Machines** as described below.

#### Isolated Virtual Machines

Specific VM types when deployed consume the entire physical host for that VM. These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions.  In addition to deploying on these hosts, the underlying storage and disks for these virtual machines must be configured with encryption at rest.

Each of the above VM types can be deployed leveraging virtual machine scale sets to provide proper compute isolation with all the benefits of virtual machine scale sets in place. When configuring your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

Current VM SKUs that offer necessary compute isolation include specific offerings from our VM families:

| **VM Family** | **VM SKU** |
| --- | --- |
| D-Series - General Purpose | Standard\_DS15\_v2Standard\_D15\_v2 |
| Memory Optimized | Standard\_E64is\_v3Standard\_E64i\_v3 |
| Compute Optimized | Standard\_F72s\_v2 |
| Large Memory Optimized | Standard\_M128ms |
| GPU Enabled VMs | Standard\_NV24 |

> [!IMPORTANT]
> As new hardware generations become available, some VM types may require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. This document will be updated to reflect any changes.

#### Disk Encryption for Virtual Machines

The storage supporting these Virtual Machines can be encrypted in one of two ways to support necessary encryption standards.

- Leverage Azure Disk Encryption to encrypt the drives using DM-Crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](../security/azure-security-disk-encryption-linux.md)
  - [Enable Azure Disk Encryption for Windows](../security/azure-security-disk-encryption-windows.md)
- Leverage Azure Storage Service Encryption for Storage Accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage Service Encryption with Customer Managed Keys](../storage/common/storage-service-encryption-customer-managed-keys.md)

#### Disk Encryption using Virtual Machine Scale Sets

The disks that support Virtual Machine Scale Sets can be encrypted using Azure Disk Encryption:

- [Encrypt Disks with Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-encrypt-disks-ps.md)

### [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/)

Azure Web Apps can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- To accommodate proper network and workload isolation, deploy your web apps on the **Isolated SKU**. More information can be found in the [app services plan documentation](../app-service/overview-hosting-plans.md).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Web Apps** | X | X | X | X | X | X |

## Integration services

### [Azure Service Bus](https://azure.microsoft.com/services/service-bus/)

Azure Service Bus can be used in Azure Government supporting Impact Level 5 workloads in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Service Bus** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup>Use client-side encryption to encrypt data prior to leveraging Azure Service Bus in the noted regions

### [Azure API Management](https://azure.microsoft.com/services/api-management/)

Azure API Management can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **API Management** | X | X | X | X | X | X |

## Management and governance

### [Azure Backup](https://azure.microsoft.com/services/backup/)

Azure Backup can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Backup** | X | X | X | X | X | X |

### [Azure Monitor](https://azure.microsoft.com/services/monitor/)

Azure Monitor can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Monitor** | X | X | X | X | X | X |

### [Azure Scheduler](https://azure.microsoft.com/services/scheduler/)

Azure Scheduler can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Scheduler** | X | X | X | X | X | X |

## Media services

### [Azure Media Services](https://azure.microsoft.com/services/media-services/)

Azure Media Services can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Media Services** |   |   |   |   | X | X |

## Networking services

### [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/)

Application Gateway can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Application Gateway** | X | X | X | X | X | X |

### [Azure DNS](https://azure.microsoft.com/services/dns/)

Azure DNS can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure DNS** | X | X | X | X | X | X |

### [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/)

ExpressRoute can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **ExpressRoute** | X | X | X | X | X | X |

### [Azure Load Balancer](https://azure.microsoft.com/services/load-balancer/)

Load Balancer can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Load Balancer** | X | X | X | X | X | X |

### [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)

Azure Traffic Manager can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Traffic Manager** | X | X | X | X | X | X |

### [Azure Virtual Network](https://azure.microsoft.com/services/virtual-network/)

Azure Virtual Network can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Virtual Network** | X | X | X | X | X | X |

### [Azure VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/)

Azure VPN Gateway can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **VPN Gateway** | X | X | X | X | X | X |

## Security and identity services

### [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)

Azure Active Directory can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Active Directory** | X | X | X | X | X | X |

### [Microsoft Graph](https://docs.microsoft.com/graph/overview)

Microsoft Graph can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Microsoft Graph** | X | X | X | X | X | X |

### [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

Azure Key Vault can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Key Vault** | X | X | X | X | X | X |

## Storage and database services 

### [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/)

Azure Analysis Services can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Analysis Services** |  |  |  |  | X | X |

### [Azure Cache for Redis](https://azure.microsoft.com/services/cache/)

Azure Cache for Redis can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Cache for Redis** |  |  |  |  | X | X |

### [Azure Import/Export](../storage/common/storage-import-export-service.md)

Azure Import/Export can be used in Azure Government to import/export Impact Level 5 data.  By default, Import/Export will encrypt the data that is written to the disk drive for transport. When creating a target storage account for Import/Export of Impact Level 5 data add storage encryption with customer managed keys (additional documentation and guidance found in the [storage services section](#storage-encryption-with-key-vault-managed-keys)).

The target storage account for Import and source storage account for Export can reside in any of the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Import/Export** | X | X | X | X | X | X |

### [Azure CosmosDB](https://azure.microsoft.com/services/cosmos-db/)

Azure CosmosDB can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure CosmosDB** |  |  |  |  | X | X |

### [Azure Storage](https://azure.microsoft.com/services/storage/)

Azure Storage consists of multiple data features: Blob storage, File storage, Table storage, and Queue storage. Blob storage supports both standard and premium storage, with premium storage using only SSDs for the fastest performance possible. Storage also includes configurations which modify these storage types, such as hot and cool to provide appropriate speed-of-availability for data scenarios. The below outlines which features of storage currently support IL5 workloads.

When using an Azure Storage account, you must follow the steps for using **Storage Encryption with Key Vault Managed Keys** to ensure the data is protected with customer managed keys.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Blobs** | X | X | X | X | X | X |
| **Files** | X | X | X | X | X | X |
| **Tables** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |
| **Queues** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup>Tables and Queues when used outside the **USDoD Regions** must encrypt the data before inserting into the Table and Queue. For more information refer to the instructions for using [client side encryption](../storage/common/storage-client-side-encryption-java.md).

#### Storage Encryption with Key Vault Managed Keys

To implement Impact Level 5 compliant controls on an Azure Storage account running in Azure Government outside of the dedicated DoD regions, Encryption at Rest must be implemented with the customer-managed key option enabled (also known as bring-your-own-key).

For more information on how to enable this Azure Storage Encryption feature, please review the supporting documentation for [Azure Storage](../storage/common/storage-service-encryption-customer-managed-keys.md).

> [!NOTE]
> When using this encryption method, it is important that it is enabled BEFORE content is added to the storage account. Any content added prior will not be encrypted with the selected key, and only encrypted using standard encryption at rest provided by Azure Storage.`

### [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)

Azure SQL Database can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the [Azure SQL documentation](../sql-database/transparent-data-encryption-byok-azure-sql.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL DB** | X | X | X | X | X | X |

### [Azure SQL Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)

Azure SQL Stretch Database can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the documentation for [Azure SQL transparent data encryption](../sql-database/transparent-data-encryption-byok-azure-sql.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL Stretch DB** | X | X | X | X | X | X |