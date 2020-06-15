---
title: Azure Government Isolation Guidelines for Impact Level 5 | Microsoft Docs
description: 'This article provides guidance for Azure Government Cloud configurations required to implement Impact Level 5 workloads for the DoD'
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 05/25/2020
ms.custom: references_regions
#Customer intent: As a DoD mission owner I want to know how to implement a workload at Impact Level 5 in Microsoft Azure Government
---
# Isolation guidelines for Impact Level 5 Workloads

Azure Government supports applications in all regions that require Impact Level 5 (IL5) data, as defined in the [US Department of Defense Cloud Security Requirements Guide (SRG)](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html). IL5 workloads have a higher degree of impact to the US Department of Defense and must be secured to a higher standard.  When supporting these workloads on Azure Government, their isolation requirements can be met in different ways. The guidance below will address configurations and settings for the isolation required to support IL5 data.  This document will be updated as new implementations are enabled and as new services are accredited for IL5 data by DISA.

## Background

In January 2017, the Impact Level 5 Provisional Authorization (PA) for Azure Government was the first provided to a Hyper Scale cloud provider.  This covered two regions of Azure Government (USDoD Central and USDoD East) that were dedicated to the DoD.  Based on mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA in December 2018 to cover all six Azure Government regions while still honoring the isolation requirements needed by the Department of Defense.

Azure Government continues to provide more PaaS features and services to the DoD at Impact Level 5 than any other cloud provider.

## Principles and approach

To include a service in Impact Level 5 scope, there are two key areas that will be addressed – Storage Isolation and Compute Isolation.  We are focusing on how these services can isolate the compute and storage of Impact Level 5 data.  The SRG allows for a shared management and network infrastructure.

### Compute isolation

The SRG focuses on segmentation of compute when 'processing' data for Impact Level 5. This means ensuring that a virtual machine that compromises the physical host cannot impact a DoD workload.  To remove the risk of runtime attacks and ensure long running workloads are not compromised from other workloads on the same host, all Impact Level 5 virtual machines should be isolated using Azure Dedicated Hosts which provides a dedicated physical server to host your Azure VMs for Windows and Linux. 

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

## AI + Machine Learning

### [Azure Bot Service](https://docs.microsoft.com/azure/bot-service/)

Azure Bot Service can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Bot Service** | X | X | X | X | X | X |

### [Azure Cognitive Search](https://azure.microsoft.com/services/search/)

Azure Cognitive Search can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Configure encryption at rest of content in Azure Cognitive Search using customer-managed keys in Azure Key Vault (https://docs.microsoft.com/azure/search/search-security-manage-encryption-keys)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Cognitive Search** | X | X | X | X | X | X |

### [Cognitive Services: Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) 

Computer Vision can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Computer Vision** | X | X | X | X | X | X |

### [Cognitive Services: Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/)

Text Analytics can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Text Analytics** | X | X | X | X | X | X |

## Analytics services

### [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/)

Azure Data Explorer can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Data in Azure Data Explorer clusters in Azure is secured and encrypted with Microsoft-managed keys by default. For additional control over encryption keys, you can supply customer-managed keys to use for data encryption and manage encryption of your data at the storage level with your own keys.(https://docs.microsoft.com/azure/data-explorer/security#data-encryption)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Data Explorer** | X | X | X | X | X | X |

### [Azure Data Factory](https://azure.microsoft.com/services/data-factory/)

Azure Data Factory can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Secure data store credentials by storing encrypted credentials in an Azure Data Factory managed store. Data Factory helps protect your data store credentials by encrypting them with certificates managed by Microsoft. For more information about Azure Storage security, see Azure Storage security overview. You can also store the data store's credential in Azure Key Vault. Data Factory retrieves the credential during the execution of an activity. For more information, see Store credential in Azure Key Vault (https://docs.microsoft.com/azure/data-factory/store-credentials-in-key-vault)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Data Factory** | X | X | X | X | X | X |

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

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the documentation for [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md)).

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

### [Azure Automation](https://azure.microsoft.com/services/automation/)

Azure Automation can be used in Azure Government supporting Impact level 5 workloads for providing compute level isolation.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Automation** | X |  | X | X | | |

Azure Automation can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the VM that's hosting the role and against resources in your environment. Runbooks are stored and managed in Azure Automation and then delivered to these one or more assigned computers known as Hybrid Runbook Workers. Use Azure Dedicated Host or Isolated Virtual Machine types for Hybrid worker role. [Isolated VM types](#isolated-virtual-machines) when deployed, consume the entire physical host for that VM providing the necessary level of isolation required to support IL5 workloads.

- [Azure Dedicated Host](#azure-dedicated-hosts) provides physical servers, able to host one or more virtual machines, dedicated to one Azure subscription.

### [Azure Batch](https://azure.microsoft.com/services/batch/)

Azure Batch can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Enable User Subscription Mode which will require a Key Vault instance for proper encryption and key storage (see documentation on [batch account configurations](../batch/batch-account-create-portal.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Batch** | X | X | X | X | X | X |

### [Cloud Services](https://azure.microsoft.com/services/cloud-services/) 

Cloud Services can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Cloud Services** | X | X | X | X | X | X |

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
> <sup>1</sup> When deploying VMs in these regions you must use **Azure Dedicated Host** as described below.

#### [Azure Dedicated Hosts](https://azure.microsoft.com/services/virtual-machines/dedicated-host/)

Azure Dedicated Host provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions. Using dedicated host, your Azure VMs are placed on an isolated and dedicated physical server that runs only your organization’s workloads to meet compliance guidelines and standards.

Current Dedicated Host SKUs (VM series and Host Type) that offer necessary compute isolation include specific offerings from our VM families are listed here: (https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/)

#### Isolated Virtual Machines

Virtual machine scale sets are not currently supported on Azure Dedicated Hosts. However, specific VM types when deployed consume the entire physical host for that VM.  Each of the above VM types can be deployed leveraging virtual machine scale sets to provide proper compute isolation with all the benefits of virtual machine scale sets in place. When configuring your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

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
  - [Enable Azure Disk Encryption for Linux](../virtual-machines/linux/disk-encryption-overview.md)
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

## Containers

### [Azure Container Instances](https://azure.microsoft.com/services/container-instances/)

Azure Container Instances can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Azure Container Instances service automatically encrypts data related to your containers when it is persisted in the cloud. Data in ACI is encrypted and decrypted using 256-bit AES encryption and enabled for all ACI deployments. You can rely on Microsoft-managed keys for the encryption of your container data, or you can manage the encryption with your own keys. (https://docs.microsoft.com/azure/container-instances/container-instances-encrypt-data) 

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Container Instances** | X | X | X | X | X | X |

### [Container Registry](https://azure.microsoft.com/services/container-registry/) 

Container Registry can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

When you store images and other artifacts in an Azure container registry, Azure automatically encrypts the registry content at rest with service-managed keys. You can supplement default encryption with an additional encryption layer using a key that you create and manage in Azure Key Vault. (https://docs.microsoft.com/azure/container-registry/container-registry-customer-managed-keys)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Container Registry** | X | X | X | X | X | X |

## Databases

### [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) 

Azure Database for MySQL can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Data encryption with customer-managed keys for Azure Database for MySQL enables you to bring your own key (BYOK) for data protection at rest. Data encryption with customer-managed keys for Azure Database for MySQL, is set at the server-level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. (https://docs.microsoft.com/azure/mysql/concepts-data-encryption-mysql)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Database for MySQL** | X | X | X | X | X | X |

### [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) 

Azure Database for PostgreSQL can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Data encryption with customer-managed keys for Azure Database for PostgreSQL Single server, is set at the server-level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. (https://docs.microsoft.com/azure/postgresql/concepts-data-encryption-postgresql)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Database for PostgreSQL** | X | X | X | X | X | X |

## Developer Tools

### [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab/)

Azure DevTest Labs can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure DevTest Labs** | X | X | X | X | X | X |

## Hybrid

### [Azure Stack Edge] (https://azure.microsoft.com/products/azure-stack/edge/)

Azure Stack Edge can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

You can protect data via storage accounts as your device is associated with a storage account that's used as a destination for your data in Azure. Access to the storage account is controlled by the subscription and FIPS compliant storage access keys associated with that storage account. (https://docs.microsoft.com/azure/databox-online/data-box-edge-security#protect-your-data) 

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Stack Edge** | X | X | X | X | X | X |

## Integration services

<a name="logic-apps"></a>

### [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)

Azure Logic Apps can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

Azure Logic Apps relies on Azure Storage to store and automatically encrypt data at rest. This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data. For more information about how Azure Storage encryption works, see Azure Storage encryption for data at rest and Azure Data Encryption-at-Rest.(https://docs.microsoft.com/azure/logic-apps/customer-managed-keys-integration-service-environment)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Logic Apps** | X | | X | X | | |

### [Azure Event Grid](https://azure.microsoft.com/services/event-grid/)

Event Grid can persist customer content for no more than 24 hours as explained online-https://docs.microsoft.com/bs-cyrl-ba/azure/event-grid/security-authentication#encryption-at-rest.  All data written to disk is encrypted with Microsoft managed keys. Azure Event Grid can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Event Grid** | X | X | X | X | X | X |

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

## Internet of Things

### [IoT Hub](https://azure.microsoft.com/services/iot-hub/)

Azure IoT Hub can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

IoT Hub supports encryption of data at rest with customer-managed keys (CMK), also known as Bring your own key (BYOK), support for Azure IoT Hub. Azure IoT Hub provides encryption of data at rest and in transit. By default, IoT Hub uses Microsoft-managed keys to encrypt the data. With CMK support, customers now have the choice of encrypting the data at rest with a key encryption key, managed by the customers, using the Azure Key Vault. (https://docs.microsoft.com/azure/iot-hub/iot-hub-customer-managed-keys)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **IoT Hub** | X | X | X | X | X | X |

### [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/) 

Notification Hubs can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Notification Hubs** | X | X | X | X | X | X |

## Management and governance

### [Automation](https://azure.microsoft.com/services/automation/) 

Automation can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

By default, your Azure Automation account uses Microsoft-managed keys.You can manage encryption of secure assets for your Automation account with your own keys. When you specify a customer-managed key at the level of the Automation account, that key is used to protect and control access to the account encryption key for the Automation account. (https://docs.microsoft.com/azure/automation/automation-secure-asset-encryption)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Automation** | X | X | X | X | X | X |

### [Azure Advisor](https://azure.microsoft.com/services/advisor/) 

Azure Advisor can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Advisor** | X | X | X | X | X | X |

### [Azure Backup](https://azure.microsoft.com/services/backup/)

Azure Backup can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Backup** | X | X | X | X | X | X |

### [Azure Blueprints](https://azure.microsoft.com/services/blueprints/)

Azure Blueprints can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Blueprints** | X | X | X | X | X | X |

### [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) 

Azure Cloud Shell can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Cloud Shell** | X | X | X | X | X | X |

### [Azure Cost Management](https://azure.microsoft.com/services/cost-management/) 

Azure Cost Management can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Cost Management** | X | X | X | X | X | X |

### [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/) 

Azure Managed Applications can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

You can store your managed application definition within a storage account provided by you during creation so that it's location and access can be fully managed by you for your regulatory needs. (https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/publish-service-catalog-app#bring-your-own-storage-for-the-managed-application-definition)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Managed Applications** | X | X | X | X | X | X |

### [Azure Monitor](https://azure.microsoft.com/services/monitor/)

Azure Monitor can be used in Azure Government supporting all impact levels with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Monitor** | X | X | X | X | X | X |

### [Azure Policy](https://azure.microsoft.com/services/azure-policy/)

Azure Policy can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Policy** | X | X | X | X | X | X |

### [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)

Microsoft Azure portal can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

You can add a markdown tile to your Azure dashboards to display custom, static content. For example, you can show basic instructions, an image, or a set of hyperlinks on a markdown tile (https://docs.microsoft.com/azure/azure-portal/azure-portal-markdown-tile)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Microsoft Azure portal** | X | X | X | X | X | X |

### [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) 

Azure Resource Manager can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Resource Manager** | X | X | X | X | X | X |

### [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview)

Azure Resource Graph can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Resource Graph** | X | X | X | X | X | X |

### [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/)

Azure Site Recovery can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

You can replicate Azure VMs with Customer-Managed Keys (CMK) enabled managed disks, from one Azure region to another (https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Site Recovery** | X | X | X | X | X | X |

### [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs)

Log Analytics can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

Configure Customer-Managed Keys (CMK) for your Log Analytics workspaces and Application Insights components. Once configured, any data sent to your workspaces or components is encrypted with your Azure Key Vault key.(https://docs.microsoft.com/azure/azure-monitor/platform/customer-managed-keys)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Log Analytics** | X | X | X | X | X | X |

### Azure Scheduler

Azure Scheduler is being retired and replaced by [Azure Logic Apps](#logic-apps). To continue working with the jobs that you set up in Scheduler, please migrate to Azure Logic Apps as soon as possible by following this article, [Migrate Azure Scheduler jobs to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md).

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

### [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)

Azure Firewall can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Firewall** | X | X | X | X | X | X |

### [Azure Load Balancer](https://azure.microsoft.com/services/load-balancer/)

Load Balancer can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Load Balancer** | X | X | X | X | X | X |

### [Network Watcher](https://azure.microsoft.com/services/network-watcher/)

Network Watcher and Network Watcher Traffic Analytics can be used in Azure Government supporting all impact levels with no additional configuration required between regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Network Watcher** | X | X | X | X | X | X |

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

### [Azure Advanced Threat Protection](https://azure.microsoft.com/features/azure-advanced-threat-protection/)

Azure Advanced Threat Protection can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Advanced Threat Protection** | X | X | X | X | X | X |

### [Azure Dedicated HSM](https://azure.microsoft.com/services/azure-dedicated-hsm/)

Azure Dedicated HSM can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Dedicated HSM** | X | X | X | X | X | X |

### [Azure Security Center](https://azure.microsoft.com/services/security-center/)

Azure Security Center can be used in all Azure Government regions, supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Security Center** | X | X | X | X | X | X |

### [Multi-Factor Authentication](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks) 

Multi-Factor Authentication can be used in Azure Government supporting Impact Level 5 workloads with no additional configuration in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Multi-Factor Authentication** | X | X | X | X | X | X |

### [Microsoft Defender Advanced Threat Protection](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) 

Microsoft Defender Advanced Threat Protection can be used in Azure Government supporting all impact levels with no additional configuration required in the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Microsoft Defender Advanced Threat Protection** | X | X | X | X | X | X |

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

### [Azure Archive Storage](https://azure.microsoft.com/services/storage/archive/)

Azure Archive Storage can be used in Azure Government to support Impact Level 5 data. Azure Archive Storage is a tier of Azure Storage and automatically secures that data at rest using 256-bit AES keys. Just like hot and cool tiers, Azure Archive Storage can be set at the blob level. To access the content, the archived blob needs to be rehydrated or copied to an online tier, at which point customers can enforce customer managed keys that are in place for their online storage tiers. When creating a target storage account for Archive Storage of Impact Level 5 data add storage encryption with customer managed keys (additional documentation and guidance found in the [storage services section](#storage-encryption-with-key-vault-managed-keys)).

The target storage account for Archive storage can reside in any of the following regions:

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure Archive Storage** | X | X | X | X | X | X |

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

### [StorSimple](https://azure.microsoft.com/services/storsimple/)

StorSimple can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

To help ensure the security and integrity of data moved to the cloud, StorSimple allows you to define cloud storage encryption keys as follows - You specify the cloud storage encryption key when you create a volume container. (https://docs.microsoft.com/azure/storsimple/storsimple-8000-security#storsimple-data-protection)

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **StorSimple** | X | X | X | X | X | X |

### [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)

Azure SQL Database can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the [Azure SQL documentation](../azure-sql/database/transparent-data-encryption-byok-overview.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL DB** | X | X | X | X | X | X |

### [Azure SQL Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)

Azure SQL Stretch Database can be used in Azure Government supporting Impact Level 5 workloads in the following configurations:

- Add Transparent Data Encryption with customer managed keys via Azure Key Vault (additional documentation and guidance found in the documentation for [Azure SQL transparent data encryption](../azure-sql/database/transparent-data-encryption-byok-overview.md)).

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Azure SQL Stretch DB** | X | X | X | X | X | X |
