---
title: Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM
description: Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM
author: msmbaldwin
ms.author: mbaldwin
ms.date: 10/25/2024
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
---

# Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM

The following services support server-side encryption with customer managed keys in [Azure Key Vault](/azure/key-vault/) and [Azure Managed HSM](/azure/key-vault/managed-hsm/). For implementation details, see the service-specific documentation or the service's [Microsoft Cloud Security Benchmark: security baseline](/security/benchmark/azure/security-baselines-overview) (section DP-5).

## AI and machine learning

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure AI Search](/azure/search/) | Yes | | [Configure customer-managed keys for data encryption in Azure AI Search](/azure/search/search-security-manage-encryption-keys) |
| [Azure AI services](/azure/ai-services/) | Yes | Yes | [Customer-managed keys for encryption](/azure/ai-services/encryption/cognitive-services-encryption-keys-portal) |
| [Azure AI Foundry](/azure/ai-studio) | Yes | | [Encryption of data at rest in Azure AI services](/azure/ai-studio/concepts/encryption-keys-portal) |
| [Azure Bot Service](/azure/bot-service/) | Yes | | [Encryption of bot data in Azure Bot Service](/azure/bot-service/bot-service-encryption) |
| [Azure Health Bot](/azure/health-bot/) | Yes | | [Configure customer-managed keys (CMK) for Azure Health Bot](/azure/health-bot/cmk) |
| [Azure Machine Learning](/azure/machine-learning/) | Yes | | [Customer-managed keys for workspace encryption in Azure Machine Learning](/azure/machine-learning/concept-customer-managed-keys) |
| [Azure OpenAI](/azure/ai-services/openai/) | Yes | Yes | [Azure OpenAI Service encryption of data at rest](/azure/ai-services/openai/encrypt-data-at-rest) |
| [Content Moderator](/azure/ai-services/content-moderator/) | Yes | Yes | [Content Moderator encryption of data at rest](/azure/ai-services/content-moderator/encrypt-data-at-rest) |
| [Dataverse](/powerapps/maker/data-platform/) | Yes | Yes | [Customer-managed keys in Dataverse](/power-platform/admin/customer-managed-key) |
| [Dynamics 365](/dynamics365/) | Yes | Yes | [Customer-managed keys for encryption](/dynamics365/fin-ops-core/dev-itpro/sysadmin/customer-managed-keys) |
| [Face](/azure/ai-services/computer-vision/overview-identity) | Yes | Yes | [Face service encryption of data at rest](/azure/ai-services/computer-vision/identity-encrypt-data-at-rest) |
| [Language Understanding](/azure/ai-services/luis/what-is-luis) | Yes | Yes | [Customer-managed keys with Azure Key Vault](/azure/ai-services/luis/encrypt-data-at-rest) |
| [Personalizer](/azure/ai-services/personalizer/) | Yes | Yes | [Encryption of data at rest in Personalizer](/azure/ai-services/personalizer/encrypt-data-at-rest) |
| [Power Platform](/power-platform/) | Yes | Yes | [Customer-managed keys in Power Platform](/power-platform/admin/customer-managed-key) |
| [QnA Maker](/azure/ai-services/qnamaker/) | Yes | Yes | [QnA Maker encryption of data at rest](/azure/ai-services/qnamaker/encrypt-data-at-rest) |
| [Speech Services](/azure/ai-services/speech-service/) | Yes | Yes | [Speech service encryption of data at rest](/azure/ai-services/speech-service/speech-encryption-of-data-at-rest) |
| [Translator Text](/azure/ai-services/translator/) | Yes | Yes | [Translator encryption of data at rest](/azure/ai-services/translator/encrypt-data-at-rest) |

## Analytics

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Data Explorer](/azure/data-explorer/) | Yes | | [Configure customer-managed keys (CMK) in Azure Data Explorer](/azure/data-explorer/customer-managed-keys-portal) |
| [Azure Data Factory](/azure/data-factory/) | Yes | Yes | [Encryption with customer-managed keys for Azure Data Factory](/azure/data-factory/enable-customer-managed-key) |
| [Azure Data Lake Store](/azure/data-lake-store/) | Yes (RSA 2048-bit) | | |
| [Azure Data Manager for Energy](/azure/energy-data-services/) | Yes | | [Manage data security and encryption](/azure/energy-data-services/how-to-manage-data-security-and-encryption) |
| [Azure Databricks](/azure/databricks/) | Yes | Yes | [Customer-managed keys for managed services](/azure/databricks/security/keys/customer-managed-key-managed-services-azure) |
| [Azure HDInsight](/azure/hdinsight/) | Yes | | [Azure HDInsight double encryption for data at rest](/azure/hdinsight/disk-encryption) |
| [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | Yes | | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Azure Monitor Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) | Yes | Yes | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Azure Stream Analytics](/azure/stream-analytics/) | Yes\* | Yes | [Data protection in Azure Stream Analytics](/azure/stream-analytics/data-protection) |
| [Azure Synapse Analytics](/azure/synapse-analytics/) | Yes (RSA 3072-bit) | Yes | [Configure encryption at rest with customer-managed keys](/azure/synapse-analytics/security/workspaces-encryption) |
| [Microsoft Fabric](/fabric) | Yes | | [Customer-managed key (CMK) encryption and Microsoft Fabric](/fabric/security/security-scenario#customer-managed-key-cmk-encryption-and-microsoft-fabric) |
| [Power BI Embedded](/power-bi) | Yes | | [Using your own key for Power BI encryption (Preview)](/power-bi/enterprise/service-encryption-byok) |

## Containers

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Kubernetes Service](/azure/aks/) | Yes | Yes | [Enable host encryption on your AKS cluster nodes](/azure/aks/enable-host-encryption) |
| [Azure Red Hat OpenShift](/azure/openshift/) | Yes | | [Bring your own keys (BYOK) with Azure Red Hat OpenShift](/azure/openshift/howto-byok) |
| [Container Instances](/azure/container-instances/) | Yes | | [Encrypt data with a customer-managed key](/azure/container-instances/container-instances-encrypt-data#encrypt-data-with-a-customer-managed-key) |
| [Container Registry](/azure/container-registry/) | Yes | | [Encrypt container images with a customer-managed key](/azure/container-registry/container-registry-customer-managed-keys) |

## Compute

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [App Service](/azure/app-service/) | Yes\* | Yes | [Configure customer-managed keys for App Service](/azure/app-service/configure-encrypt-at-rest-using-cmk) |
| [Azure Functions](/azure/azure-functions/) | Yes\* | Yes | [Configure customer-managed keys for Azure Functions](/azure/azure-functions/configure-encrypt-at-rest-using-cmk) |
| [Azure HPC Cache](/azure/hpc-cache/) | Yes | | [Use customer-managed keys with HPC Cache](/azure/hpc-cache/customer-keys) |
| [Azure Managed Applications](/azure/azure-resource-manager/managed-applications/) | Yes\* | Yes | [Azure managed applications overview](/azure/azure-resource-manager/managed-applications/overview) |
| [Azure portal](/azure/azure-portal/) | Yes\* | Yes | [Security in the Azure portal](/azure/security/fundamentals/overview) |
| [Azure VMware Solution](/azure/azure-vmware/) | Yes | Yes | [Configure customer-managed keys in Azure VMware Solution](/azure/azure-vmware/configure-customer-managed-keys) |
| [Batch](/azure/batch/) | Yes | | [Use customer-managed keys with Batch accounts](/azure/batch/batch-customer-managed-key) |
| [SAP HANA](/azure/sap/large-instances/hana-overview-architecture) | Yes | | |
| [Site Recovery](/azure/site-recovery/) | Yes | | [Enable replication with customer-managed keys](/azure/site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks) |
| [Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/) | Yes | Yes | [Encrypt virtual machine scale sets using the portal](/azure/virtual-machines/linux/disk-encryption-key-vault) |
| [Virtual Machines](/azure/virtual-machines/) | Yes | Yes | [Azure Disk Encryption for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |

## Databases

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Cosmos DB](/azure/cosmos-db/) | Yes | Yes | [Configure customer-managed keys using Azure Key Vault](/azure/cosmos-db/how-to-setup-cmk), [Configure customer-managed keys using Azure Key Vault Managed HSM](/azure/cosmos-db/how-to-setup-customer-managed-keys-mhsm) |
| [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/) | Yes | | [Data encryption with customer-managed keys in Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/concepts-customer-managed-key) |
| [Azure Database for MySQL - Single Server](/azure/mysql/single-server/) | Yes | | [Azure Database for MySQL data encryption with a customer-managed key](/previous-versions/azure/mysql/single-server/concepts-data-encryption-mysql) |
| [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/) | Yes | | [Data encryption with customer-managed keys in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/concepts-data-encryption) |
| [Azure Database for PostgreSQL - Single Server](/azure/postgresql/) | Yes | Yes | [Data encryption with customer-managed keys in Azure Database for PostgreSQL - Single Server](/previous-versions/azure/postgresql/single-server/concepts-data-encryption-postgresql) |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/) | Yes | | [Configure customer-managed keys for encryption](/azure/managed-instance-apache-cassandra/customer-managed-keys) |
| [Azure SQL Database](/azure/azure-sql/database/) | Yes (RSA 3072-bit) | Yes | [Bring your own key (BYOK) support for Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) |
| [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/) | Yes (RSA 3072-bit) | Yes | [Bring your own key (BYOK) support for Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) |
| [SQL Server on Azure VM](/azure/azure-sql/virtual-machines/) | Yes | | [Configure Azure Key Vault integration for SQL Server on Azure VMs ](/azure/azure-sql/virtual-machines/windows/azure-key-vault-integration-configure) |
| [SQL Server on Virtual Machines](/azure/virtual-machines/windows/sql/) | Yes | | [Transparent data encryption for SQL Server on Azure VM](/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-security#transparent-data-encryption) |
| [SQL Server Stretch Database](/azure/sql-server-stretch-database/) | Yes (RSA 3072-bit) | | |
| [Table Storage](/azure/storage/tables/) | Yes | | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |

## Hybrid + multicloud

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Stack Edge](/azure/databox-online/) | Yes | | [Protect data at rest on Azure Stack Edge Pro R](/azure/databox-online/azure-stack-edge-pro-r-security#protect-data-at-rest) |

## Integration

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Health Data Services](/azure/healthcare-apis/) | Yes | | [Configure customer-managed keys for Azure Health Data Services DICOM](/azure/healthcare-apis/dicom/configure-customer-managed-keys), [Configure customer-managed keys for Azure Health Data Services FHIR](/azure/healthcare-apis/fhir/configure-customer-managed-keys) |
| [Event Hubs](/azure/event-hubs/) | Yes | | [Configure customer-managed keys for encryption](/azure/event-hubs/configure-customer-managed-key) |
| [Logic Apps](/azure/logic-apps/) | Yes | |  |
| [Service Bus](/azure/service-bus-messaging/) | Yes | | [Configure customer-managed keys for encryption](/azure/service-bus-messaging/configure-customer-managed-key) |

## IoT services

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Device Update for IoT Hub](/azure/iot-hub-device-update/) | Yes | Yes | [Data encryption for Device Update for IoT Hub](/azure/iot-hub-device-update/device-update-data-encryption) |
| [IoT Hub Device Provisioning](/azure/iot-dps/) | Yes | |  |

## Management and governance

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [App Configuration](/azure/azure-app-configuration/) | Yes | | [Use customer-managed keys to encrypt data](/azure/azure-app-configuration/concept-customer-managed-keys) |
| [Automation](/azure/automation/) | Yes | | [Encryption of automation assets](/azure/automation/automation-secure-asset-encryption) |
| [Azure Migrate](/azure/migrate/) | Yes | | [Tutorial: Migrate VMware VMs to Azure](/azure/migrate/tutorial-migrate-vmware) |
| [Azure Monitor](/azure/azure-monitor) | Yes | | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |

## Media

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Communication Services](/azure/communication-services/) | Yes | | [Data encryption in Azure Communication Services](/azure/communications-gateway/security#data-retention-data-security-and-encryption-at-rest) |
| [Media Services](/azure/media-services/) | Yes | | [Use your own encryption keys with Azure Media Services](/azure/media-services/latest/concept-use-customer-managed-keys-byok) |

## Security

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Information Protection](/azure/information-protection/) | Yes | | [How are the Azure Rights Management cryptographic keys managed and secured?](/azure/information-protection/how-does-it-work#how-the-azure-rms-cryptographic-keys-are-stored-and-secured) |
| [Microsoft Defender for Cloud](/azure/defender-for-cloud/) | Yes | | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Microsoft Defender for IoT](/azure/defender-for-iot/) | Yes | | |
| [Microsoft Sentinel](/azure/sentinel/) | Yes | Yes | [Encryption at rest in Microsoft Sentinel](/azure/sentinel/customer-managed-keys) |

## Storage

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Archive Storage](/azure/storage/blobs/archive-blob) | Yes | | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [Azure Backup](/azure/backup/) | Yes | Yes | [Encrypt backup data using customer-managed keys](/azure/backup/encryption-at-rest-with-cmk) |
| [Azure Cache for Redis](/azure/azure-cache-for-redis/) | Yes\*\* | Yes | [Configure disk encryption for Azure Cache for Redis instances using customer managed keys](/azure/azure-cache-for-redis/cache-how-to-encryption) |
| [Azure Data Box](/azure/databox/) | Yes | | [Use a customer-managed key to secure your Data Box](/azure/databox/data-box-customer-managed-encryption-key-portal) |
| [Azure Managed Lustre](/azure/azure-managed-lustre/) | Yes | | [Use customer-managed encryption keys with Azure Managed Lustre](/azure/azure-managed-lustre/customer-managed-encryption-keys) |
| [Azure NetApp Files](/azure/azure-netapp-files/) | Yes | Yes | [Configure customer-managed keys for Azure NetApp Files volume encryption](/azure/azure-netapp-files/configure-customer-managed-keys?tabs=azure-portal) |
| [Blob Storage](/azure/storage/blobs/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Azure Disk Encryption for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |
| [File Storage](/azure/storage/files/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [File Sync](/azure/storage/file-sync/file-sync-introduction) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [Managed Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Azure Disk Encryption for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |
| [Premium Blob Storage](/azure/storage/blobs/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [Queue Storage](/azure/storage/queues/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview) |
| [StorSimple](/azure/storsimple/) | Yes | | [Azure StorSimple security features](/azure/storsimple/storsimple-security#data-encryption) |
| [Ultra Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Azure Disk Encryption for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |

## Other

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Universal Print](/universal-print/) | Yes | | [Data encryption in Universal Print](/universal-print/fundamentals/universal-print-encryption) |

## Caveats

\* This service supports storing data in your own Key Vault, Storage Account, or other data persisting service that already supports Server-Side Encryption with Customer-Managed Key.

\*\* Any transient data stored temporarily on disk such as pagefiles or swap files are encrypted with a Microsoft key (all tiers) or a customer-managed key (using the Enterprise and Enterprise Flash tiers). For more information, see [Configure disk encryption in Azure Cache for Redis](../../azure-cache-for-redis/cache-how-to-encryption.md).

## Related content

- [Data encryption models in Microsoft Azure](encryption-models.md)
- [How encryption is used in Azure](encryption-overview.md)
- [Double encryption](double-encryption.md)
