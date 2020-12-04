---
title: Azure Government isolation guidelines for Impact Level 5 
description: 'This article provides guidance for Azure Government Cloud configurations required to implement Impact Level 5 workloads for the DoD.'
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/14/2020
ms.custom: references_regions
#Customer intent: As a DoD mission owner, I want to know how to implement a workload at Impact Level 5 in Microsoft Azure Government.
---
# Isolation guidelines for Impact Level 5 workloads

Azure Government supports applications in all regions that require Impact Level 5 (IL5) data, as defined in the [US Department of Defense Cloud Security Requirements Guide (SRG)](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html). IL5 workloads have a higher degree of impact to the US Department of Defense and must be secured to a higher standard. When you deploy these workloads on Azure Government, you can meet their isolation requirements in various ways. The guidance in this document will address configurations and settings to meet the isolation required to support IL5 data. We'll update this document as new implementations are enabled and as new services are accredited for IL5 data by DISA.

## Background

In January 2017, the Impact Level 5 Provisional Authorization (PA) for Azure Government was the first provided to a hyperscale cloud provider. This authorization covered two regions of Azure Government (US DoD Central and US DoD East) that were dedicated to the DoD. Based on mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA in December 2018 to cover all six Azure Government regions while still honoring the isolation requirements needed by the Department of Defense.

Azure Government continues to provide more PaaS features and services to the DoD at Impact Level 5 than any other cloud provider.

## Principles and approach

Two key areas need to be addressed for services in Impact Level 5 scope: storage isolation and compute isolation. We'll focus on how these services can isolate the compute and storage of Impact Level 5 data.  The SRG allows for a shared management and network infrastructure.

### Compute isolation

The SRG focuses on the segmentation of compute during "processing" of data for Impact Level 5. This segmentation ensures that a virtual machine that compromises the physical host can't affect a DoD workload. To remove the risk of runtime attacks and ensure long running workloads aren't compromised from other workloads on the same host, all Impact Level 5 virtual machines should be isolated via Azure Dedicated Host. Doing so provides a dedicated physical server to host your Azure VMs for Windows and Linux. 

For services where the compute processes are obfuscated from access by the owner and stateless in their processing of data, you should accomplish isolation by focusing on the data being processed and how it's stored and retained. This approach ensures that the data is stored in protected mediums and not present on these services for extended periods unless it's encrypted as needed.

### Storage isolation

In the most recent PA for Azure Government, DISA approved logical separation of IL5 from other data via cryptographic means. In Azure, this approach involves encryption via keys that are maintained in Azure Key Vault. The keys are owned and managed by the IL5 system owner.

To apply this approach to services:

- If a service hosts only IL5 data, the service can control the key on behalf of end users. But it must use a dedicated key to protect IL5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, the service must expose the option to for end users to use their own keys for encryption. Those keys are stored in Azure Key Vault. This implementation gives consumers of the service the ability to implement cryptographic separation as needed.

This approach ensures all key material for decrypting data is stored separately of the data itself and done so with a hardware key-management solution.

## Applying this guidance

Impact Level 5 guidelines require workloads to be deployed with a high degree of security, isolation, and control. The following configurations are required in *addition* to any other configurations or controls needed to meet Impact Level 5. Network isolation, access controls, and other necessary security measures aren't necessarily addressed in the guidance here.

Be sure to review the entry for each service you're using and ensure that all isolation requirements are implemented.

## AI + machine learning

### [Azure Bot Service](/azure/bot-service/)

Azure Bot Service supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Bot Service** | X | X | X |  |  |

### [Azure Cognitive Search](https://azure.microsoft.com/services/search/)

Azure Cognitive Search supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Cognitive Search by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/search/search-security-manage-encryption-keys).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Cognitive Search** | X | X | X |  |  |

### [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/)

Azure Machine Learning supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Machine Learning by using customer-managed keys in Azure Key Vault. Azure Machine Learning stores snapshots, output, and logs in the Azure Blob Storage account that's associated with the Azure Machine Learning workspace and customer subscription. All the data stored in Azure Blob Storage is [encrypted at rest with Microsoft-managed keys](https://docs.microsoft.com/azure/machine-learning/concept-enterprise-security#data-encryption). Customers can use their own keys for data stored in Azure Blob Storage. See [Configure encryption with customer-managed keys stored in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Machine Learning** | X | X | X |  |  |

### [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) 

Computer Vision supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Computer Vision** | X | X | X |  |  |

### [Cognitive Services: Content Moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/)

The Azure Cognitive Services Content Moderator service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Content Moderator service by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/cognitive-services/content-moderator/content-moderator-encryption-of-data-at-rest).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Content Moderator** | X | X | X |  |  |

### [Cognitive Services: Face](https://azure.microsoft.com/services/cognitive-services/face/)

The Cognitive Services Face service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Face service by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/cognitive-services/face/face-encryption-of-data-at-rest).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Face** | X | X | X |  |  |

### [Cognitive Services: Language Understanding](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/)

The Cognitive Services Language Understanding service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Language Understanding service by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/cognitive-services/luis/luis-encryption-of-data-at-rest).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Language Understanding** | X | X | X |  |  |

### [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/)

Text Analytics supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Text Analytics** | X | X | X |  |  |

### [Cognitive Services: Translator](https://azure.microsoft.com/services/cognitive-services/translator/)

The Cognitive Services Translator service supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in the Translator service by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/cognitive-services/translator/translator-encryption-of-data-at-rest).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Translator** | X | X | X |  |  |


### [Cognitive Services: Speech Services](https://azure.microsoft.com/services/cognitive-services/speech-services/)

Cognitive Services Speech Services supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Speech Services by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-encryption-of-data-at-rest).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Speech Services** | X | X | X |  |  |

## Analytics services

### [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/)

Azure Data Explorer supports Impact Level 5 workloads in Azure Government with this configuration:

- Data in Azure Data Explorer clusters in Azure is secured and encrypted with Microsoft-managed keys by default. For additional control over encryption keys, you can supply customer-managed keys to use for data encryption and manage [encryption of your data](https://docs.microsoft.com/azure/data-explorer/security#data-encryption) at the storage level with your own keys.

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Data Explorer** | X | X | X | X | X | 

### [Azure Data Factory](https://azure.microsoft.com/services/data-factory/)

Azure Data Factory supports Impact Level 5 workloads in Azure Government with this configuration:

- Secure data store credentials by storing encrypted credentials in a Data Factory managed store. Data Factory helps protect your data store credentials by encrypting them with certificates managed by Microsoft. For more information about Azure Storage security, see [Azure Storage security overview](../storage/common/security-baseline.md). You can also store the data store's credentials in Azure Key Vault. Data Factory retrieves the credentials during the execution of an activity. For more information, see [Store credentials in Azure Key Vault](https://docs.microsoft.com/azure/data-factory/store-credentials-in-key-vault).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Data Factory** | X | X | X |  |  |

### [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)

Azure Event Hubs supports Impact Level 5 workloads in Azure Government in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Event Hubs** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]  
> <sup>1</sup>Use client-side encryption to encrypt data before using Azure Event Hubs in the noted regions.

### [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/)

Azure HDInsight supports Impact Level 5 workloads in Azure Government with these configurations:

- Azure HDInsight can be deployed to existing storage accounts that have enabled appropriate [Storage service encryption](#storage-encryption-with-key-vault-managed-keys), as discussed in the guidance for Azure Storage.
- Azure HDInsight enables a database option for certain configurations. Ensure the appropriate database configuration for TDE is enabled on the option you choose, as discussed in the guidance for [Azure SQL Database](#azure-sql-database).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure HDInsight** | X | X | X | X | X |

### [Azure Synapse Analytics](https://azure.microsoft.com/services/sql-data-warehouse/)

Azure Synapse Analytics supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md)).

   > [!NOTE]
   > The instructions to enable this configuration are the same as the instructions to do so for Azure SQL Database.

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Synapse Analytics** | X | X | X | X | X |

### [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/)

Power BI Embedded supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Power BI Embedded** | X | X | X | X | X |

### [Power Automate](https://flow.microsoft.com/)

Power Automate supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Power Automate** | X | X | X |  |  |

### [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)

Azure Stream Analytics supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Stream Analytics by [using customer-managed keys in Azure Key Vault](https://docs.microsoft.com/azure/stream-analytics/data-protection).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Stream Analytics** | X | X | X |  |  |

## Compute services

### [Azure Batch](https://azure.microsoft.com/services/batch/)

Azure Batch supports Impact Level 5 workloads in Azure Government with this configuration:

- Enable user subscription mode, which will require a Key Vault instance for proper encryption and key storage. For more information, see the documentation on [batch account configurations](../batch/batch-account-create-portal.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Batch** | X | X | X | X | X | 

### [Cloud Services](https://azure.microsoft.com/services/cloud-services/) 

Azure Cloud Services supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Cloud Services** | X | X | X | X | X |

### [Azure Functions](https://azure.microsoft.com/services/functions/)

Azure Functions supports Impact Level 5 workloads in Azure Government with this configuration:

- To accommodate proper network and workload isolation, deploy your Azure functions on App Service plans configured to use the Isolated SKU. For more information, see the [App Service plan documentation](../app-service/overview-hosting-plans.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Functions** | X | X | X | X | X |

### [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/)

Azure Service Fabric supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Service Fabric** |  |   |   | X | X |

### [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) and [virtual machine scale sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)

You can use Azure virtual machines with multiple deployment mediums. This is the case for single virtual machines and for virtual machines deployed via the Azure virtual machine scale sets feature.

All virtual machines should use Disk Encryption for virtual machines or Disk Encryption for virtual machine scale sets, or place virtual machine disks in a storage account that can hold Impact Level 5 data as described in the [Azure Storage section](#storage-encryption-with-key-vault-managed-keys).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Virtual Machines** | X<sup>1</sup>  | X<sup>1</sup> | X<sup>1</sup> | X | X |
| **Virtual machine scale sets** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup>When you deploy VMs in these regions, you must use Azure Dedicated Host, as described in the next section.

#### [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/)

Azure Dedicated Host provides physical servers that can host one or more virtual machines and that are dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our datacenters, provided as a resource. You can provision dedicated hosts within a region, Availability Zone, and fault domain. You can then place VMs directly into your provisioned hosts, in whatever configuration meets your needs.

These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions. When you use Dedicated Host, your Azure VMs are placed on an isolated and dedicated physical server that runs only your organization’s workloads to meet compliance guidelines and standards.

Current Dedicated Host SKUs (VM series and Host Type) that offer the required compute isolation include SKUs in the VM families listed on the [Dedicated Host pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/).

#### Isolated virtual machines

Virtual machine scale sets aren't currently supported on Azure Dedicated Host. But specific VM types, when deployed, consume the entire physical host for the VM. Each of the following VM types can be deployed via virtual machine scale sets to provide proper compute isolation with all the benefits of virtual machine scale sets in place. When you configure your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

Current VM SKUs that offer the required compute isolation include SKUs in these VM families:

| **VM family** | **VM SKU** |
| --- | --- |
| D-Series (general purpose) | Standard\_DS15\_v2Standard\_D15\_v2 |
| Memory optimized | Standard\_E64is\_v3Standard\_E64i\_v3 |
| Compute optimized | Standard\_F72s\_v2 |
| Large memory optimized | Standard\_M128ms |
| GPU-enabled | Standard\_NV24 |

> [!IMPORTANT]
> As new hardware generations become available, some VM types might require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. This document will be updated to reflect any changes.

#### Disk Encryption for virtual machines

You can encrypt the storage that supports these virtual machines in one of two ways to support necessary encryption standards.

- Use Azure Disk Encryption to encrypt the drives by using dm-crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](../virtual-machines/linux/disk-encryption-overview.md)
  - [Enable Azure Disk Encryption for Windows](../virtual-machines/linux/disk-encryption-overview.md)
- Use Azure Storage service encryption for storage accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage service encryption with customer-managed keys](../storage/common/customer-managed-keys-configure-key-vault.md)

#### Disk Encryption for virtual machine scale sets

You can encrypt disks that support virtual machine scale sets by using Azure Disk Encryption:

- [Encrypt disks in virtual machine scale sets](../virtual-machine-scale-sets/disk-encryption-powershell.md)

### [Web Apps feature of Azure App Service](https://azure.microsoft.com/services/app-service/web/)

Web Apps supports Impact Level 5 workloads in Azure Government with this configuration:

- To accommodate proper network and workload isolation, deploy your web apps on the Isolated SKU. For more information, see the [App Service plan documentation](../app-service/overview-hosting-plans.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Web Apps** | X | X | X | X | X | 

## Containers

### [Azure Container Instances](https://azure.microsoft.com/services/container-instances/)

Azure Container Instances supports Impact Level 5 workloads in Azure Government with this configuration:

- Azure Container Instances automatically encrypts data related to your containers when it's persisted in the cloud. Data in Container Instances is encrypted and decrypted with 256-bit AES encryption and enabled for all Container Instances deployments. You can rely on Microsoft-managed keys for the encryption of your container data, or you can manage the encryption by using your own keys. For more information, see [Encrypt deployment data](https://docs.microsoft.com/azure/container-instances/container-instances-encrypt-data). 

The Container Instances Dedicated SKU provides an [isolated and dedicated compute environment](../container-instances/container-instances-dedicated-hosts.md) for running containers with increased security. When you use the Dedicated SKU, each container group has a dedicated physical server in an Azure datacenter.

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Container Instances** | X | X | X |  |  |

### [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/)

Azure Kubernetes Service (AKS) supports Impact Level 5 workloads in Azure Government with these configurations:

- Configure encryption at rest of content in AKS by [using customer-managed keys in Azure Key Vault](https://ddocs.microsoft.com/azure/aks/azure-disk-customer-managed-keys).
- For workloads that require isolation from other customer workloads, you can use [isolated virtual machines](../aks/concepts-security.md#compute-isolation) as the agent nodes in an AKS cluster. 

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **AKS** | X | X | X |  |  |

### [Container Registry](https://azure.microsoft.com/services/container-registry/) 

Azure Container Registry supports Impact Level 5 workloads in Azure Government with this configuration:

- When you store images and other artifacts in an Container Registry, Azure automatically encrypts the registry content at rest by using service-managed keys. You can supplement the default encryption with an additional encryption layer by [using a key that you create and manage in Azure Key Vault](https://docs.microsoft.com/azure/container-registry/container-registry-customer-managed-keys).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Container Registry** | X | X | X |  |  | 

## Databases

### [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)

Azure SQL Database supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see the [Azure SQL documentation](../azure-sql/database/transparent-data-encryption-byok-overview.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure SQL Database** | X | X | X | X | X |

### [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)

SQL Server Stretch Database supports Impact Level 5 workloads in Azure Government with this configuration:

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **SQL Server Stretch Database** | X | X | X | X | X |

### [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) 

Azure Database for MySQL supports Impact Level 5 workloads in Azure Government with this configuration:

- Data encryption with customer-managed keys for Azure Database for MySQL enables you to bring your own key (BYOK) for data protection at rest. This encryption is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for MySQL data encryption with a customer-managed key](https://docs.microsoft.com/azure/mysql/concepts-data-encryption-mysql).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Database for MySQL** | X | X | X | X | X | 

### [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) 

Azure Database for PostgreSQL supports Impact Level 5 workloads in Azure Government with this configuration:

- Data encryption with customer-managed keys for Azure Database for PostgreSQL Single Server is set at the server-level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for PostgreSQL Single Server data encryption with a customer-managed key](https://docs.microsoft.com/azure/postgresql/concepts-data-encryption-postgresql).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Database for PostgreSQL** | X | X | X | X | X | 

## Developer tools

### [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/)

Azure DevTest Labs supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure DevTest Labs** | X | X | X |  |  | 

## Hybrid

### [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/)

You can protect data via storage accounts because your device is associated with a storage account that's used as a destination for your data in Azure. Access to the storage account is controlled by the subscription and FIPS-compliant storage access keys associated with the storage account. For more information, see [Protect your data](https://docs.microsoft.com/azure/databox-online/data-box-edge-security#protect-your-data).

Azure Stack Edge supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Stack Edge** | X | X | X | X | X |

## Integration services

<a name="logic-apps"></a>

### [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)

Azure Logic Apps supports all impact levels in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Logic Apps** | X | X | X | | X |

For more information, see [Secure access and data in Azure Logic Apps: Isolation guidance](../logic-apps/logic-apps-securing-a-logic-app.md#isolation-logic-apps).

### [Azure Event Grid](https://azure.microsoft.com/services/event-grid/)

Azure Event Grid can persist customer content for no more than 24 hours. For more information, see [Authenticate event delivery to event handlers](https://docs.microsoft.com/azure/event-grid/security-authentication#encryption-at-rest).  All data written to disk is encrypted with Microsoft-managed keys. 

Azure Event Grid supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Event Grid** | X | X | X | X | X | 

### [Azure Service Bus](https://azure.microsoft.com/services/service-bus/)

Azure Service Bus supports Impact Level 5 workloads in Azure Government in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Service Bus** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup>Use client-side encryption to encrypt data before using Azure Service Bus in the noted regions.

### [Azure API Management](https://azure.microsoft.com/services/api-management/)

Azure API Management supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **API Management** | X | X | X | X | X | 

## Internet of Things

### [IoT Hub](https://azure.microsoft.com/services/iot-hub/)

Azure IoT Hub supports Impact Level 5 workloads in Azure Government with this configuration:

- IoT Hub supports encryption of data at rest with customer-managed keys, also known as "bring your own key (BYOK)." Azure IoT Hub provides encryption of data at rest and in transit. By default, IoT Hub uses Microsoft-managed keys to encrypt the data. Customer-managed key support enables customers to encrypt data at rest by using an [encryption key that they manage via Azure Key Vault](https://docs.microsoft.com/azure/iot-hub/iot-hub-customer-managed-keys).

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **IoT Hub** | X | X | X |  |  | 

### [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) 

Azure Notification Hubs supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Notification Hubs** | X | X | X |  |  | 

## Management and governance

### [Automation](https://azure.microsoft.com/services/automation/)

Azure Automation supports Impact level 5 workloads in Azure Government to provide compute-level isolation.

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Automation** | X | X | X | | |

Automation supports Impact Level 5 workloads in Azure Government in these configurations:

- Use the [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) feature of Azure Automation to run runbooks directly on the VM that's hosting the role and against resources in your environment. Runbooks are stored and managed in Azure Automation and then delivered to one or more assigned computers known as Hybrid Runbook Workers. Use Azure Dedicated Host or isolated virtual machine types for the Hybrid Worker role. When deployed, [isolated VM types](#isolated-virtual-machines) consume the entire physical host for the VM, providing the level of isolation required to support IL5 workloads.

  [Azure Dedicated Host](#azure-dedicated-host) provides physical servers that can host one or more virtual machines and that are dedicated to one Azure subscription.
- By default, your Azure Automation account uses Microsoft-managed keys. You can manage the encryption of secure assets for your Automation account by using your own keys. When you specify a customer-managed key at the level of the Automation account, that key is used to protect and control access to the account encryption key for the Automation account. For more information, see [Encryption of secure assets in Azure Automation](https://docs.microsoft.com/azure/automation/automation-secure-asset-encryption).

### [Azure Advisor](https://azure.microsoft.com/services/advisor/) 

Azure Advisor supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Advisor** | X | X | X |  |  | 

### [Azure Backup](https://azure.microsoft.com/services/backup/)

Azure Backup supports all impact levels in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Backup** | X | X | X | X | X |

### [Azure Blueprints](https://azure.microsoft.com/services/blueprints/)

Azure Blueprints supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Blueprints** | X | X | X |  |  | 

### [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) 

Azure Cloud Shell supports all impact levels in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Cloud Shell** | X | X | X |  |  | 

### [Azure Cost Management and Billing](https://azure.microsoft.com/services/cost-management/) 

Azure Cost Management and Billing supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Cost Management and Billing** | X | X | X |  |  |

### [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/)

Azure Lighthouse supports Impact Level 5 workloads in Azure Government with no additional configuration in these regions:

| **Service** | **US Gov VA** | **US Gov TX** | **US Gov AZ** | **US DoD East** | **US DoD Central** |
| --- | --- | --- | --- | --- | --- |
| **Azure Lighthouse** | X | X | X |  |  |

### [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) 

Azure Managed Applications supports Impact Level 5 workloads in Azure Government with this configuration:

- You can store your managed application definition in a storage account that you provide when you create the application so that you can manage its location and access for your regulatory needs. (https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/publish-service-catalog-app#bring-your-own-storage-for-the-managed-application-definition)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Managed Applications** | X | X | X | X | X | 

### [Azure Monitor](https://azure.microsoft.com/services/monitor/)

Azure Monitor can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Monitor** | X | X | X | X | X |

### [Azure Policy](https://azure.microsoft.com/services/azure-policy/)

Azure Policy can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Policy** | X | X | X |  |  | 

### [Azure Policy Guest Configuration](../governance/policy/concepts/guest-configuration.md)

Azure Policy Guest Configuration can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Policy Guest Configuration** | X | X | X |  |  |

### [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)

Microsoft Azure portal can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

You can add a markdown tile to your Azure dashboards to display custom, static content. For example, you can show basic instructions, an image, or a set of hyperlinks on a markdown tile (https://docs.microsoft.com/azure/azure-portal/azure-portal-markdown-tile)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Microsoft Azure portal** | X | X | X | X | X | 

### [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) 

Azure Resource Manager can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Resource Manager** | X | X | X | X | X |

### [Azure Resource Graph](../governance/resource-graph/overview.md)

Azure Resource Graph can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Resource Graph** | X | X | X |  |  |

### [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/)

Azure Site Recovery can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

You can replicate Azure VMs with Customer-Managed Keys (CMK) enabled managed disks, from one Azure region to another (https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Site Recovery** | X | X | X | X | X | 

### [Log Analytics](../azure-monitor/platform/data-platform-logs.md)

Log Analytics can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Configure Customer-Managed Keys (CMK) for your Log Analytics workspaces and Application Insights components. Once configured, any data sent to your workspaces or components is encrypted with your Azure Key Vault key.(https://docs.microsoft.com/azure/azure-monitor/platform/customer-managed-keys)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Log Analytics** | X | X | X |  |  | 

### Azure Scheduler

Azure Scheduler is being retired and replaced by [Azure Logic Apps](#logic-apps). To continue working with the jobs that you set up in Scheduler, please migrate to Azure Logic Apps as soon as possible by following this article, [Migrate Azure Scheduler jobs to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md).

## Media services

### [Azure Media Services](https://azure.microsoft.com/services/media-services/)

Azure Media Services can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Media Services** |   |   |   | X | X |

## Migration services

### [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)

Azure Migrate can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Configure encryption at rest of content in Azure Migrate using customer-managed keys in Azure Key Vault (https://docs.microsoft.com/azure/migrate/how-to-migrate-vmware-vms-with-cmk-disks)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Migrate** | X | X | X |  |  |

### [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/)

Azure Database Migration Service can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Database Migration Service** | X | X | X |  |  |

## Networking services

### [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/)

Application Gateway can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Application Gateway** | X | X | X | X | X | 

### [Azure DNS](https://azure.microsoft.com/services/dns/)

Azure DNS can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure DNS** | X | X | X | X | X | 

### [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/)

ExpressRoute can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **ExpressRoute** | X | X | X | X | X | 

### [Azure Front Door](https://azure.microsoft.com/services/frontdoor/)

Azure Front Door can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Front Door** | X | X | X |  |  |

### [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)

Azure Firewall can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Firewall** | X | X | X | X | X |

### [Azure Load Balancer](https://azure.microsoft.com/services/load-balancer/)

Load Balancer can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Load Balancer** | X | X | X | X | X | 

### [Network Watcher](https://azure.microsoft.com/services/network-watcher/)

Network Watcher and Network Watcher Traffic Analytics can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Network Watcher** | X | X | X | X | X | 

### [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)

Azure Traffic Manager can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Traffic Manager** | X | X | X | X | X |

### [Azure Virtual Network](https://azure.microsoft.com/services/virtual-network/)

Azure Virtual Network can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Virtual Network** | X | X | X | X | X | 

### [Azure VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/)

Azure VPN Gateway can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **VPN Gateway** | X | X | X | X | X | 

## Security and identity services

### [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)

Azure Active Directory can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** |  **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Active Directory** | X | X | X | X | X | 

### [Azure Advanced Threat Protection](https://azure.microsoft.com/features/azure-advanced-threat-protection/)

Azure Advanced Threat Protection can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Advanced Threat Protection** | X | X | X |  |  |

### [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/)

Azure Dedicated HSM can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Dedicated HSM** | X | X | X |  |  | 

### [Azure Security Center](https://azure.microsoft.com/services/security-center/)

Azure Security Center can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Security Center** | X | X | X |  |  |

### [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/)

Azure Sentinel can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Configure encryption at rest of content in Azure Sentinel using customer-managed keys in Azure Key Vault (https://docs.microsoft.com/azure/sentinel/customer-managed-keys)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Sentinel** | X | X | X |  |  |

### [Customer Lockbox](../security/fundamentals/customer-lockbox-overview.md)

Customer Lockbox can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Customer Lockbox** | X | X | X |  |  |

### [Multi-Factor Authentication](../active-directory/authentication/concept-mfa-howitworks.md) 

Multi-Factor Authentication can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Multi-Factor Authentication** | X | X | X | X | X |

### [Microsoft Defender Advanced Threat Protection](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) 

Microsoft Defender Advanced Threat Protection can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Microsoft Defender Advanced Threat Protection** | X | X | X |  |  |

### [Microsoft Graph](/graph/overview)

Microsoft Graph can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Microsoft Graph** | X | X | X | X | X | 

### [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

Azure Key Vault can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Key Vault** | X | X | X | X | X |

## Storage and database services 

### [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/)

Azure Analysis Services can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Analysis Services** | X | X | X | X | X |

### [Azure Cache for Redis](https://azure.microsoft.com/services/cache/)

Azure Cache for Redis can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure Cache for Redis** | X | X | X | X | X |

### [Azure Import/Export](../storage/common/storage-import-export-service.md)

Azure Import/Export can be used in Azure Government to import/export Impact Level 5 data.  By default, Import/Export will encrypt the data that is written to the disk drive for transport. When creating a target storage account for Import/Export of Impact Level 5 data add storage encryption with customer managed keys (additional documentation and guidance found in the [storage services section](#storage-encryption-with-key-vault-managed-keys)).

The target storage account for Import and source storage account for Export can reside in any of the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Import/Export** | X | X | X | X | X |

### [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/)

Azure Archive Storage can be used in Azure Government to support Impact Level 5 data. Azure Archive Storage is a tier of Azure Storage and automatically secures that data at rest using 256-bit AES keys. Just like hot and cool tiers, Azure Archive Storage can be set at the blob level. To access the content, the archived blob needs to be rehydrated or copied to an online tier, at which point customers can enforce customer managed keys that are in place for their online storage tiers. When creating a target storage account for Archive Storage of Impact Level 5 data add storage encryption with customer managed keys (additional documentation and guidance found in the [storage services section](#storage-encryption-with-key-vault-managed-keys)).

The target storage account for Archive storage can reside in any of the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure Archive Storage** | X | X | X | X | X |

### [Azure CosmosDB](https://azure.microsoft.com/services/cosmos-db/)

Azure CosmosDB can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | 
| **Azure CosmosDB** | X | X | X | X | X |

### [Azure Storage](https://azure.microsoft.com/services/storage/)

Azure Storage consists of multiple data features: Blob storage, File storage, Table storage, and Queue storage. Blob storage supports both standard and premium storage, with premium storage using only SSDs for the fastest performance possible. Storage also includes configurations which modify these storage types, such as hot and cool to provide appropriate speed-of-availability for data scenarios. The below outlines which features of storage currently support IL5 workloads.

When using an Azure Storage account, you must follow the steps for using **Storage Encryption with Key Vault Managed Keys** to ensure the data is protected with customer managed keys.

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Blobs** | X | X | X | X | X | 
| **Files** | X | X | X | X | X | 
| **Tables** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |
| **Queues** | X<sup>1</sup> | X<sup>1</sup> | X<sup>1</sup> | X | X |

> [!IMPORTANT]
> <sup>1</sup>Tables and Queues when used outside the **USDoD Regions** must encrypt the data before inserting into the Table and Queue. For more information refer to the instructions for using [client side encryption](../storage/common/storage-client-side-encryption-java.md).

#### Storage Encryption with Key Vault Managed Keys

To implement Impact Level 5 compliant controls on an Azure Storage account running in Azure Government outside of the dedicated DoD regions, Encryption at Rest must be implemented with the customer-managed key option enabled (also known as bring-your-own-key).

For more information on how to enable this Azure Storage Encryption feature, please review the supporting documentation for [Azure Storage](../storage/common/customer-managed-keys-configure-key-vault.md).

> [!NOTE]
> When using this encryption method, it is important that it is enabled BEFORE content is added to the storage account. Any content added prior will not be encrypted with the selected key, and only encrypted using standard encryption at rest provided by Azure Storage.`

### [Azure File Sync](../storage/files/storage-sync-files-planning.md)

Azure File Sync can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Configure encryption at rest of content in Azure File Sync using customer-managed keys in Azure Key Vault (https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning#azure-file-share-encryption-at-rest)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **Azure File Sync** | X | X | X |  |  |

### [StorSimple](https://azure.microsoft.com/services/storsimple/)

StorSimple can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

To help ensure the security and integrity of data moved to the cloud, StorSimple allows you to define cloud storage encryption keys as follows - You specify the cloud storage encryption key when you create a volume container. (https://docs.microsoft.com/azure/storsimple/storsimple-8000-security#storsimple-data-protection)

| **Service** | **USGov VA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- |
| **StorSimple** | X | X | X | X | X |

