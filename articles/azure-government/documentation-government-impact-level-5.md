---
title: Azure Government isolation guidelines for Impact Level 5
description: Guidance for configuring Azure Government services for DoD Impact Level 5 workloads
ms.service: azure-government
ms.topic: article
ms.custom: references_regions, ignite-2022
author: stevevi
ms.author: stevevi
recommendations: false
ms.date: 04/02/2023
---

# Isolation guidelines for Impact Level 5 workloads

Azure Government supports applications that use Impact Level 5 (IL5) data in all available regions. IL5 requirements are defined in the [US Department of Defense (DoD) Cloud Computing Security Requirements Guide (SRG)](https://public.cyber.mil/dccs/dccs-documents/). IL5 workloads have a higher degree of impact to the DoD and must be secured to a higher standard. When you deploy these workloads on Azure Government, you can meet their isolation requirements in various ways. The guidance in this document addresses configurations and settings needed to meet the IL5 isolation requirements. We'll update this article as we enable new isolation options and the Defense Information Systems Agency (DISA) authorizes new services for IL5 data.

## Background

In January 2017, DISA awarded the [IL5 Provisional Authorization](/azure/compliance/offerings/offering-dod-il5) (PA) to [Azure Government](https://azure.microsoft.com/global-infrastructure/government/get-started/), making it the first IL5 PA awarded to a hyperscale cloud provider. The PA covered two Azure Government regions US DoD Central and US DoD East (US DoD regions) that are [dedicated to the DoD](https://azure.microsoft.com/global-infrastructure/government/dod/). Based on DoD mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA boundary in December 2018 to cover the remaining Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions). For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&rar=true).

- For a list of services in scope for DoD IL5 PA in US Gov regions, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).
- For a list of services in scope for DoD IL5 PA in US DoD regions, see [Azure Government DoD regions IL5 audit scope](./documentation-government-overview-dod.md#us-dod-regions-il5-audit-scope).

Azure Government is available to US federal, state, local, and tribal governments and their partners. The IL5 expansion to Azure Government honors the isolation requirements mandated by the DoD. Azure Government continues to provide more PaaS services suitable for DoD IL5 workloads than any other cloud services environment.

## Principles and approach

You need to address two key areas for Azure services in IL5 scope: compute isolation and storage isolation. We'll focus in this article on how Azure services can help you isolate the compute and storage services for IL5 data. The SRG allows for a shared management and network infrastructure. **This article is focused on Azure Government compute and storage isolation approaches for US Gov Arizona, US Gov Texas, and US Gov Virginia regions (US Gov regions).** If an Azure service is available in Azure Government DoD regions US DoD Central and US DoD East (US DoD regions) and authorized at IL5, then it is by default suitable for IL5 workloads with no extra isolation configuration required. Azure Government DoD regions are reserved for DoD agencies and their partners, enabling physical separation from non-DoD tenants by design. For more information, see [DoD in Azure Government](./documentation-government-overview-dod.md).

> [!IMPORTANT]
> You are responsible for designing and deploying your applications to meet DoD IL5 compliance requirements. In doing so, you should not include sensitive or restricted information in Azure resource names, as explained in **[Considerations for naming Azure resources](./documentation-government-concept-naming-resources.md).**

### Compute isolation

IL5 separation requirements are stated in Section 5.2.2.3 (Page 51) of the [Cloud Computing SRG](https://public.cyber.mil/dccs/dccs-documents/). The SRG focuses on compute separation during "processing" of IL5 data. This separation ensures that a virtual machine that could potentially compromise the physical host can't affect a DoD workload. To remove the risk of runtime attacks and ensure long running workloads aren't compromised from other workloads on the same host, **all IL5 virtual machines and virtual machine scale sets** should be isolated by DoD mission owners via [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/) or [isolated virtual machines](../virtual-machines/isolation.md). Doing so provides a dedicated physical server to host your Azure Virtual Machines (VMs) for Windows and Linux.

For services where the compute processes are obfuscated from access by the owner and stateless in their processing of data, you should accomplish isolation by focusing on the data being processed and how it's stored and retained. This approach ensures the data is stored in protected mediums. It also ensures the data isn't present on these services for extended periods unless it's encrypted as needed.

### Storage isolation

The DoD requirements for encrypting data at rest are provided in Section 5.11 (Page 122) of the [Cloud Computing SRG](https://public.cyber.mil/dccs/dccs-documents/). DoD emphasizes encrypting all data at rest stored in virtual machine virtual hard drives, mass storage facilities at the block or file level, and database records where the mission owner doesn't have sole control over the database service. For cloud applications where encrypting data at rest with DoD key control isn't possible, mission owners must perform a risk analysis with relevant data owners before transmitting data into a cloud service offering.

In a recent PA for Azure Government, DISA approved logical separation of IL5 from other data via cryptographic means. In Azure, this approach involves data encryption via keys that are maintained in Azure Key Vault and stored in [FIPS 140 validated](/azure/compliance/offerings/offering-fips-140-2) Hardware Security Modules (HSMs). The keys are owned and managed by the IL5 system owner, also known as customer-managed keys (CMK).

Here's how this approach applies to services:

- If a service hosts only IL5 data, the service can control the key for end users. But it must use a dedicated key to protect IL5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, the service must expose the option for end users to use their own encryption keys that are maintained in Azure Key Vault. This implementation gives consumers of the service the ability to implement cryptographic separation as needed.

This approach ensures all key material for decrypting data is stored separately from the data itself using a hardware-based key management solution.

## Applying this guidance

IL5 guidelines require workloads to be deployed with a high degree of security, isolation, and control. The following configurations are required *in addition* to any other configurations or controls needed to meet IL5 requirements. Network isolation, access controls, and other necessary security measures aren't necessarily addressed in this article.

> [!NOTE]
> This article tracks Azure services that have received DoD IL5 PA and that require extra configuration options to meet IL5 isolation requirements. Services with IL5 PA that do not require any extra configuration options are not mentioned in this article. For a list of services in scope for DoD IL5 PA in US Gov regions, see **[Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).**

Be sure to review the entry for each service you're using and ensure that all isolation requirements are implemented.

## AI + machine learning

For AI and machine learning services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=project-bonsai,genomics,search,bot-service,databricks,machine-learning-service,cognitive-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Cognitive Search](../search/index.yml)

- Configure encryption at rest of content in Azure Cognitive Search by [using customer-managed keys in Azure Key Vault](../search/search-security-manage-encryption-keys.md).

### [Azure Machine Learning](../machine-learning/index.yml)

- Configure encryption at rest of content in Azure Machine Learning by using customer-managed keys in Azure Key Vault. Azure Machine Learning stores snapshots, output, and logs in the Azure Blob Storage account that's associated with the Azure Machine Learning workspace and customer subscription. All the data stored in Azure Blob Storage is [encrypted at rest with Microsoft-managed keys](../machine-learning/concept-enterprise-security.md). Customers can use their own keys for data stored in Azure Blob Storage. See [Configure encryption with customer-managed keys stored in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

<a name='cognitive-services-content-moderator'></a>

### [Azure AI services: Content Moderator](../ai-services/content-moderator/index.yml)

- Configure encryption at rest of content in the Content Moderator service by [using customer-managed keys in Azure Key Vault](../ai-services/content-moderator/encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault).

<a name='cognitive-services-custom-vision'></a>

### [Azure AI services: Custom Vision](../ai-services/custom-vision-service/index.yml)

- Configure encryption at rest of content in Azure AI Custom Vision [using customer-managed keys in Azure Key Vault](../ai-services/custom-vision-service/encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault).

<a name='cognitive-services-face'></a>

### [Azure AI services: Face](../ai-services/computer-vision/overview-identity.md)

- Configure encryption at rest of content in the Face service by [using customer-managed keys in Azure Key Vault](../ai-services/computer-vision/identity-encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault).

<a name='cognitive-services-language-understanding-luis'></a>

### [Azure AI Language Understanding (LUIS)](../ai-services/luis/index.yml)

- Configure encryption at rest of content in the Language Understanding service by [using customer-managed keys in Azure Key Vault](../ai-services/luis/encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault).

Azure AI Language Understanding (LUIS) is part of [Azure AI Language](../ai-services/language-service/index.yml).

<a name='cognitive-services-personalizer'></a>

### [Azure AI services: Personalizer](../ai-services/personalizer/index.yml)

- Configure encryption at rest of content in Azure AI Personalizer [using customer-managed keys in Azure Key Vault](../ai-services/personalizer/encrypt-data-at-rest.md#customer-managed-keys-with-azure-key-vault).

<a name='cognitive-services-qna-maker'></a>

### [Azure AI services: QnA Maker](../ai-services/qnamaker/index.yml)

- Configure encryption at rest of content in Azure AI QnA Maker [using customer-managed keys in Azure Key Vault](../ai-services/qnamaker/encrypt-data-at-rest.md).

Azure AI QnA Maker is part of [Azure AI Language](../ai-services/language-service/index.yml).

<a name='cognitive-services-speech'></a>

### [Azure AI Speech](../ai-services/speech-service/index.yml)

- Configure encryption at rest of content in Speech Services by [using customer-managed keys in Azure Key Vault](../ai-services/speech-service/speech-encryption-of-data-at-rest.md).

<a name='cognitive-services-translator'></a>

### [Azure AI services: Translator](../ai-services/translator/index.yml)

- Configure encryption at rest of content in the Translator service by [using customer-managed keys in Azure Key Vault](../ai-services/translator/encrypt-data-at-rest.md).


## Analytics

For Analytics services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-share,power-bi-embedded,analysis-services,event-hubs,data-lake-analytics,storage,data-catalog,monitor,data-factory,synapse-analytics,stream-analytics,databricks,hdinsight&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Databricks](/azure/databricks/)

- Azure Databricks can be deployed to existing storage accounts that have enabled appropriate [Storage encryption with Key Vault managed keys](#storage-encryption-with-key-vault-managed-keys).
- Configure customer-managed Keys (CMK) for your [Azure Databricks Workspace](/azure/databricks/security/keys/customer-managed-key-managed-services-azure) and [Databricks File System](/azure/databricks/security/keys/customer-managed-keys-dbfs/) (DBFS). 

### [Azure Data Explorer](/azure/data-explorer/)

- Data in Azure Data Explorer clusters in Azure is secured and encrypted with Microsoft-managed keys by default. For extra control over encryption keys, you can supply customer-managed keys to use for data encryption and manage [encryption of your data](/azure/data-explorer/security#customer-managed-keys-with-azure-key-vault) at the storage level with your own keys.

### [Azure HDInsight](../hdinsight/index.yml)

- Azure HDInsight can be deployed to existing storage accounts that have enabled appropriate [Storage service encryption](#storage-encryption-with-key-vault-managed-keys), as discussed in the guidance for Azure Storage.
- Azure HDInsight enables a database option for certain configurations. Ensure the appropriate database configuration for transparent data encryption (TDE) is enabled on the option you choose. This process is discussed in the guidance for [Azure SQL Database](#azure-sql-database).

### [Azure Stream Analytics](../stream-analytics/index.yml)

- Configure encryption at rest of content in Azure Stream Analytics by [using customer-managed keys in Azure Key Vault](../stream-analytics/data-protection.md#encrypt-your-data).

### [Azure Synapse Analytics](../synapse-analytics/index.yml)

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption](/azure/azure-sql/database/transparent-data-encryption-byok-overview). The instructions to enable this configuration for Azure Synapse Analytics are the same as the instructions to do so for Azure SQL Database.

### [Data Factory](../data-factory/index.yml)

- Secure data store credentials by storing encrypted credentials in a Data Factory managed store. Data Factory helps protect your data store credentials by encrypting them with certificates managed by Microsoft. For more information about Azure Storage security, see [Azure Storage security overview](../storage/common/security-baseline.md). You can also store the data store's credentials in Azure Key Vault. Data Factory retrieves the credentials during the execution of an activity. For more information, see [Store credentials in Azure Key Vault](../data-factory/store-credentials-in-key-vault.md).

### [Event Hubs](../event-hubs/index.yml)

- Configure encryption at rest of content in Azure Event Hubs by [using customer-managed keys in Azure Key Vault](../event-hubs/configure-customer-managed-key.md).


## Compute

For Compute services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud,azure-vmware,cloud-services,batch,app-service,service-fabric,functions,virtual-machine-scale-sets,virtual-machines&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Batch](../batch/index.yml)

- Enable user subscription mode, which will require a Key Vault instance for proper encryption and key storage. For more information, see the documentation on [batch account configurations](../batch/batch-account-create-portal.md).

### [Virtual machines](../virtual-machines/index.yml) and [virtual machine scale sets](../virtual-machine-scale-sets/index.yml)

You can use Azure virtual machines with multiple deployment mediums. You can do so for single virtual machines and for virtual machines deployed via the Azure virtual machine scale sets feature.

All virtual machines should use Disk Encryption for virtual machines or Disk Encryption for virtual machine scale sets, or place virtual machine disks in a storage account that can hold Impact Level 5 data as described in the [Azure Storage section](#storage-encryption-with-key-vault-managed-keys).

> [!IMPORTANT]
> When you deploy VMs in Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia, you must use Azure Dedicated Host, as described in the next section.

#### [Azure Dedicated Host](../virtual-machines/dedicated-hosts.md)

Azure Dedicated Host provides physical servers that can host one or more virtual machines and that are dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our datacenters, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. You can then place VMs directly into your provisioned hosts, in whatever configuration meets your needs.

These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions. When you use Dedicated Host, your Azure VMs are placed on an isolated and dedicated physical server that runs only your organization’s workloads to meet compliance guidelines and standards.

Current Dedicated Host SKUs (VM series and Host Type) that offer the required compute isolation include SKUs in the VM families listed on the [Dedicated Host pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/).

#### [Isolated virtual machines](../virtual-machines/isolation.md)

Virtual machine scale sets aren't currently supported on Azure Dedicated Host. But specific VM types, when deployed, consume the entire physical host for the VM. Isolated VM types can be deployed via virtual machine scale sets to provide proper compute isolation with all the benefits of virtual machine scale sets in place. When you configure your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

> [!IMPORTANT]
> As new hardware generations become available, some VM types might require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. For more information, see **[Virtual machine isolation in Azure](../virtual-machines/isolation.md).**

#### Disk encryption for virtual machines

You can encrypt the storage that supports these virtual machines in one of two ways to support necessary encryption standards.

- Use Azure Disk Encryption to encrypt the drives by using dm-crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](../virtual-machines/linux/disk-encryption-overview.md)
  - [Enable Azure Disk Encryption for Windows](../virtual-machines/windows/disk-encryption-overview.md)
- Use Azure Storage service encryption for storage accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage service encryption with customer-managed keys](../storage/common/customer-managed-keys-configure-key-vault.md)

#### Disk encryption for virtual machine scale sets

You can encrypt disks that support virtual machine scale sets by using Azure Disk Encryption:

- [Encrypt disks in virtual machine scale sets](../virtual-machine-scale-sets/disk-encryption-key-vault.md)

## Containers

For Containers services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=openshift,app-service-linux,container-registry,service-fabric,container-instances,kubernetes-service&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Kubernetes Service](../aks/index.yml)

- Configure encryption at rest of content in AKS by [using customer-managed keys in Azure Key Vault](../aks/azure-disk-customer-managed-keys.md).

### [Container Instances](../container-instances/index.yml)

- Azure Container Instances automatically encrypts data related to your containers when it's persisted in the cloud. Data in Container Instances is encrypted and decrypted with 256-bit AES encryption and enabled for all Container Instances deployments. You can rely on Microsoft-managed keys for the encryption of your container data, or you can manage the encryption by using your own keys. For more information, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md). 

### [Container Registry](../container-registry/index.yml) 

- When you store images and other artifacts in a Container Registry, Azure automatically encrypts the registry content at rest by using service-managed keys. You can supplement the default encryption with an extra encryption layer by [using a key that you create and manage in Azure Key Vault](../container-registry/tutorial-enable-customer-managed-keys.md).

## Databases

For Databases services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sql,sql-server-stretch-database,redis-cache,database-migration,postgresql,mariadb,mysql,sql-database,cosmos-db&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Cosmos DB](../cosmos-db/index.yml)

- Data stored in your Azure Cosmos DB account is automatically and seamlessly encrypted with keys managed by Microsoft (service-managed keys). Optionally, you can choose to add a second layer of encryption with keys you manage (customer-managed keys). For more information, see [Configure customer-managed keys for your Azure Cosmos DB account with Azure Key Vault](../cosmos-db/how-to-setup-cmk.md).

### [Azure Database for MySQL](../mysql/index.yml) 

- Data encryption with customer-managed keys for Azure Database for MySQL enables you to bring your own key (BYOK) for data protection at rest. This encryption is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for MySQL data encryption with a customer-managed key](../mysql/concepts-data-encryption-mysql.md).

### [Azure Database for PostgreSQL](../postgresql/index.yml) 

- Data encryption with customer-managed keys for Azure Database for PostgreSQL Single Server is set at the server level. For a given server, a customer-managed key, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. For more information, see [Azure Database for PostgreSQL Single Server data encryption with a customer-managed key](../postgresql/concepts-data-encryption-postgresql.md).

### [Azure Healthcare APIs](../healthcare-apis/index.yml) (formerly Azure API for FHIR)

Azure Healthcare APIs supports Impact Level 5 workloads in Azure Government with this configuration:

- Configure encryption at rest of content in Azure Healthcare APIs [using customer-managed keys in Azure Key Vault](../healthcare-apis/azure-api-for-fhir/customer-managed-key.md)

### [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption with customer-managed key](/azure/azure-sql/database/transparent-data-encryption-byok-overview).

### [SQL Server Stretch Database](../sql-server-stretch-database/index.yml)

- Add transparent data encryption with customer-managed keys via Azure Key Vault. For more information, see [Azure SQL transparent data encryption with customer-managed key](/azure/azure-sql/database/transparent-data-encryption-byok-overview).


## Hybrid

### [Azure Stack Edge](../databox-online/index.yml)

- You can protect data at rest via storage accounts because your device is associated with a storage account that's used as a destination for your data in Azure. You can configure your storage account to use data encryption with customer-managed keys stored in Azure Key Vault. For more information, see [Protect data in storage accounts](../databox-online/azure-stack-edge-pro-r-security.md#protect-data-in-storage-accounts).


## Integration

For Integration services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid,api-management,service-bus,logic-apps&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Service Bus](../service-bus-messaging/index.yml)

- Configure encryption of data at rest in Azure Service Bus by [using customer-managed keys in Azure Key Vault](../service-bus-messaging/configure-customer-managed-key.md).


## Internet of Things

For Internet of Things services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=notification-hubs,azure-rtos,azure-maps,iot-central,iot-hub&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure IoT Hub](../iot-hub/index.yml)

- IoT Hub supports encryption of data at rest with customer-managed keys, also known as *bring your own key* (BYOK). Azure IoT Hub provides encryption of data at rest and in transit. By default, Azure IoT Hub uses Microsoft-managed keys to encrypt the data. Customer-managed key support enables you to encrypt data at rest by using an [encryption key that you manage via Azure Key Vault](../iot-hub/iot-hub-customer-managed-keys.md).


## Management and governance

For Management and governance services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-automanage,resource-mover,azure-portal,azure-lighthouse,cloud-shell,managed-applications,azure-policy,monitor,automation,scheduler,site-recovery,cost-management,backup,blueprints,advisor&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).

### [Automation](../automation/index.yml)

- By default, your Azure Automation account uses Microsoft-managed keys. You can manage the encryption of secure assets for your Automation account by using your own keys. When you specify a customer-managed key at the level of the Automation account, that key is used to protect and control access to the account encryption key for the Automation account. For more information, see [Encryption of secure assets in Azure Automation](../automation/automation-secure-asset-encryption.md).

### [Azure Managed Applications](../azure-resource-manager/managed-applications/index.yml) 

- You can store your managed application definition in a storage account that you provide when you create the application. Doing so allows you to manage its location and access for your regulatory needs, including [storage encryption with customer-managed keys](#storage-encryption-with-key-vault-managed-keys). For more information, see [Bring your own storage](../azure-resource-manager/managed-applications/publish-service-catalog-bring-your-own-storage.md).

### [Azure Monitor](../azure-monitor/index.yml)

- By default, all data and saved queries are encrypted at rest using Microsoft-managed keys. Configure encryption at rest of your data in Azure Monitor [using customer-managed keys in Azure Key Vault](../azure-monitor/logs/customer-managed-keys.md).

#### [Log Analytics](../azure-monitor/logs/data-platform-logs.md)

Log Analytics, which is a feature of Azure Monitor, is intended to be used for monitoring the health and status of services and infrastructure. The monitoring data and logs primarily store [logs and metrics](../azure-monitor/logs/data-security.md#data-retention) that are service generated. When used in this primary capacity, Log Analytics supports Impact Level 5 workloads in Azure Government with no extra configuration required.

Log Analytics may also be used to ingest extra customer-provided logs. These logs may include data ingested as part of operating Microsoft Defender for Cloud or Microsoft Sentinel. If the ingested logs or the queries written against these logs are categorized as IL5 data, then you should configure customer-managed keys (CMK) for your Log Analytics workspaces and Application Insights components. Once configured, any data sent to your workspaces or components is encrypted with your Azure Key Vault key. For more information, see [Azure Monitor customer-managed keys](../azure-monitor/logs/customer-managed-keys.md).

### [Azure Site Recovery](../site-recovery/index.yml)

- You can replicate Azure VMs with managed disks enabled for customer-managed keys from one Azure region to another. For more information, see [Replicate machines with customer-managed keys enabled disks](../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md).

### [Microsoft Intune](/mem/intune/fundamentals/)

- Intune supports Impact Level 5 workloads in Azure Government with no extra configuration required. Line-of-business apps should be evaluated for IL5 restrictions prior to [uploading to Intune storage](/mem/intune/apps/apps-add). While Intune does encrypt applications that are uploaded to the service for distribution, it doesn't support customer-managed keys.


## Media

For Media services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=cdn,media-services&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Media Services](/azure/media-services/latest/)

- Configure encryption at rest of content in Media Services by [using customer-managed keys in Azure Key Vault](/azure/media-services/latest/concept-use-customer-managed-keys-byok).


## Migration

For Migration services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration,azure-migrate&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Data Box](../databox/index.yml) 

- Configure encryption at rest of content in Azure Data Box [using customer-managed keys in Azure Key Vault](../databox/data-box-customer-managed-encryption-key-portal.md).

### [Azure Migrate](../migrate/index.yml)

- Configure encryption at rest of content in Azure Migrate by [using customer-managed keys in Azure Key Vault](../migrate/how-to-migrate-vmware-vms-with-cmk-disks.md).


## Security

For Security services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-sentinel,azure-dedicated-hsm,security-center,key-vault&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Information Protection](/azure/information-protection/)

- Configure encryption at rest of content in Azure Information Protection [using customer-managed keys in Azure Key Vault](/azure/information-protection/byok-price-restrictions).

### [Microsoft Sentinel](../sentinel/index.yml) (formerly Azure Sentinel)

- Configure encryption at rest of content in Microsoft Sentinel by [using customer-managed keys in Azure Key Vault](../sentinel/customer-managed-keys.md).

### [Microsoft Defender for Cloud Apps](/defender-cloud-apps/) (formerly Microsoft Cloud App Security)

- Configure encryption at rest of content in Microsoft Defender for Cloud Apps [using customer-managed keys in Azure Key Vault](/enterprise-mobility-security/solutions/ems-cloud-app-security-govt-service-byok).


## Storage

For Storage services availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=hpc-cache,managed-disks,storsimple,storage&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true). For a list of services in scope for DoD IL5 PA, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). Guidance below is provided only for IL5 PA services that require extra configuration to support IL5 workloads.

### [Azure Archive Storage](../storage/blobs/access-tiers-overview.md)

- Azure Archive Storage is a tier of Azure Storage. It automatically helps secure data at rest by using 256-bit AES encryption. Just like hot and cool tiers, Archive Storage can be set at the blob level. To enable access to the content, you need to rehydrate the archived blob or copy it to an online tier, at which point you can enforce customer-managed keys that are in place for your online storage tiers. When you create a target storage account for IL5 data in Archive Storage, add storage encryption via customer-managed keys. For more information, see [Storage encryption with Key Vault managed keys](#storage-encryption-with-key-vault-managed-keys).
- The target storage account for Archive Storage can be located in any Azure Government region.

### [Azure File Sync](../storage/file-sync/index.yml)

- Configure encryption at rest of content in Azure File Sync by [using customer-managed keys in Azure Key Vault](../storage/file-sync/file-sync-planning.md#azure-file-share-encryption-at-rest).

### [Azure HPC Cache](../hpc-cache/index.yml)

- Configure encryption at rest of content in Azure HPC Cache [using customer-managed keys in Azure Key Vault](../hpc-cache/customer-keys.md)

### [Azure Import/Export](../import-export/index.yml)

- By default, the Import/Export service will encrypt data that's written to the hard drive for transport. When you create a target storage account for import and export of IL5 data, add storage encryption via customer-managed keys. For more information, see [Storage encryption with Key Vault managed keys](#storage-encryption-with-key-vault-managed-keys) in this article.
- The target storage account for import and source storage account for export can be located in any Azure Government region.

### [Azure NetApp Files](../azure-netapp-files/index.yml) 

- Configure encryption at rest of content in Azure NetApp Files [using customer-managed keys](../azure-netapp-files/faq-security.md#how-are-encryption-keys-managed)

### [Azure Storage](../storage/index.yml)

Azure Storage consists of multiple data features: Blob storage, File storage, Table storage, and Queue storage. Blob storage supports both standard and premium storage. Premium storage uses only SSDs, to provide the fastest performance possible. Storage also includes configurations that modify these storage types, like hot and cool to provide appropriate speed-of-availability for data scenarios.

Blob storage and File storage always use the account encryption key to encrypt data. Queue storage and Table storage can be [optionally configured](../storage/common/account-encryption-key-create.md) to encrypt data with the account encryption key when the storage account is created. You can opt to use customer-managed keys to encrypt data at rest in all Azure Storage features, including Blob, File, Table, and Queue storage. When you use an Azure Storage account, you must follow the steps below to ensure the data is protected with customer-managed keys.

#### Storage encryption with Key Vault managed keys

To implement Impact Level 5 compliant controls on an Azure Storage account that runs in Azure Government outside of the dedicated DoD regions, you must use encryption at rest with the customer-managed key option enabled. The customer-managed key option is also known as *bring your own key.*

For more information about how to enable this Azure Storage encryption feature, see [Configure encryption with customer-managed keys stored in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md).

> [!NOTE]
> When you use this encryption method, you need to enable it before you add content to the storage account. Any content that's added before the customer-managed key is configured will be protected with Microsoft-managed keys.

### [StorSimple](../storsimple/index.yml)

- To help ensure the security and integrity of data moved to the cloud, StorSimple allows you to [define cloud storage encryption keys](../storsimple/storsimple-8000-security.md#storsimple-data-protection). You specify the cloud storage encryption key when you create a volume container. 


## Next steps

Learn more about Azure Government:

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [DoD Impact Level 5](/azure/compliance/offerings/offering-dod-il5)
- [DoD in Azure Government](./documentation-government-overview-dod.md)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)

Start using Azure Government:

- [Guidance for developers](./documentation-government-developer-guide.md)
- [Connect with the Azure Government portal](./documentation-government-get-started-connect-with-portal.md)
- [Deploy STIG-compliant Linux VMs](./documentation-government-stig-linux-vm.md)
- [Deploy STIG-compliant Windows VMs](./documentation-government-stig-windows-vm.md)
