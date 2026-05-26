---
title: Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM
description: Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM
author: msmbaldwin
ms.author: mbaldwin
ms.date: 05/05/2026
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
---

# Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM

Customer-managed keys (CMK) is a key management control model in which you own and manage the key encryption key (KEK) in your own [Azure Key Vault](/azure/key-vault/) or [Azure Managed HSM](/azure/key-vault/managed-hsm/) instance. Azure services use your KEK to wrap and unwrap their data encryption keys through envelope encryption. For HSM-protected keys, use Azure Key Vault Premium tier or Azure Managed HSM.

The following services support server-side encryption with customer managed keys. For implementation details, see the service-specific documentation or the service's [Microsoft Cloud Security Benchmark: security baseline](/security/benchmark/azure/security-baselines-overview) (section DP-5).

## AI and machine learning

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure AI Search](/azure/search/) | Yes | Yes | [Configure customer-managed keys for data encryption in Azure AI Search](/azure/search/search-security-manage-encryption-keys) |
| [Foundry Tools](/azure/ai-services/) | Yes | Yes | [Customer-managed keys for encryption](/azure/ai-services/encryption/cognitive-services-encryption-keys-portal) |
| [Microsoft Foundry](/azure/ai-studio) | Yes | | [Encryption of data at rest in Foundry Tools](/azure/ai-studio/concepts/encryption-keys-portal) |
| [Content Safety in Foundry Control Plane](/azure/ai-services/content-safety/) | Yes | | [Encryption of data at rest in Content Safety](/azure/ai-services/content-safety/how-to/encrypt-data-at-rest) |
| [Azure Document Intelligence in Foundry Tools](/azure/ai-services/document-intelligence/) | Yes | | [Document Intelligence encryption of data at rest](/azure/ai-services/document-intelligence/authentication/encrypt-data-at-rest) |
| [Azure Language in Foundry Tools](/azure/ai-services/language-service/) | Yes | | [Language encryption of data at rest](/azure/ai-services/language-service/concepts/encryption-data-at-rest) |
| [Azure Bot Service](/azure/bot-service/) | Yes | | [Encryption of bot data in Azure Bot Service](/azure/bot-service/bot-service-encryption) |
| [Azure Health Bot](/azure/health-bot/) | Yes | | [Configure customer-managed keys (CMK) for Azure Health Bot](/azure/health-bot/cmk) |
| [Azure Machine Learning](/azure/machine-learning/) | Yes | | [Customer-managed keys for workspace encryption in Azure Machine Learning](/azure/machine-learning/concept-customer-managed-keys) |
| [Azure OpenAI](/azure/ai-services/openai/) | Yes | Yes | [Azure OpenAI Service encryption of data at rest](/azure/ai-services/openai/encrypt-data-at-rest) |
| [Content Moderator](/azure/ai-services/content-moderator/) | Yes | Yes | [Content Moderator encryption of data at rest](/azure/ai-services/content-moderator/encrypt-data-at-rest) |
| [Dataverse](/powerapps/maker/data-platform/) | Yes | Yes | [Customer-managed keys in Dataverse](/power-platform/admin/customer-managed-key) |
| [Dynamics 365](/dynamics365/) | Yes | Yes | [Customer-managed keys for encryption](/dynamics365/fin-ops-core/dev-itpro/sysadmin/customer-managed-keys) |
| [Azure AI Face](/azure/ai-services/computer-vision/overview-identity) | Yes | Yes | [Face service encryption of data at rest](/azure/ai-services/computer-vision/identity-encrypt-data-at-rest) |
| [Personalizer](/azure/ai-services/personalizer/) | Yes | Yes | [Encryption of data at rest in Personalizer](/azure/ai-services/personalizer/encrypt-data-at-rest) |
| [Power Platform](/power-platform/) | Yes | Yes | [Customer-managed keys in Power Platform](/power-platform/admin/customer-managed-key) |
| [Custom question answering](/azure/ai-services/language-service/question-answering/overview) | Yes | | [Custom question answering encryption of data at rest](/azure/ai-services/language-service/question-answering/how-to/encrypt-data-at-rest) |
| [Azure Speech in Foundry Tools](/azure/ai-services/speech-service/) | Yes | Yes | [Speech service encryption of data at rest](/azure/ai-services/speech-service/speech-encryption-of-data-at-rest) |
| [Azure Translator in Foundry Tools Text](/azure/ai-services/translator/) | Yes | Yes | [Translator encryption of data at rest](/azure/ai-services/translator/encrypt-data-at-rest) |

## Analytics

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Data Explorer](/azure/data-explorer/) | Yes | | [Configure customer-managed keys (CMK) in Azure Data Explorer](/azure/data-explorer/customer-managed-keys-portal) |
| [Azure Data Factory](../../data-factory/index.yml) | Yes | Yes | [Encryption with customer-managed keys for Azure Data Factory](../../data-factory/enable-customer-managed-key.md) |
| [Azure Data Lake Store](/azure/data-lake-store/) | Yes (RSA 2048-bit) | | |
| [Azure Data Manager for Energy](../../energy-data-services/index.yml) | Yes | Yes | [Manage data security and encryption](../../energy-data-services/how-to-manage-data-security-and-encryption.md) |
| [Azure Databricks](/azure/databricks/) | Yes | Yes | [Customer-managed keys for managed services](/azure/databricks/security/keys/customer-managed-key-managed-services-azure) |
| [Azure HDInsight](../../hdinsight/index.yml) | Yes | | [Azure HDInsight double encryption for data at rest](../../hdinsight/disk-encryption.md) |
| [Azure Monitor Application Insights](/azure/azure-monitor/app/app-insights-overview) | Yes | | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Azure Monitor Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) | Yes | Yes | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Azure Stream Analytics](../../stream-analytics/index.yml) | Yes* | Yes | [Data protection in Azure Stream Analytics](../../stream-analytics/data-protection.md) |
| [Azure Synapse Analytics](../../synapse-analytics/index.yml) | Yes (RSA 3072-bit) | Yes | [Configure encryption at rest with customer-managed keys](../../synapse-analytics/security/workspaces-encryption.md) |
| [Microsoft Fabric](/fabric) | Yes | Yes | [Customer-managed key (CMK) encryption and Microsoft Fabric](/fabric/security/security-scenario#customer-managed-key-cmk-encryption-and-microsoft-fabric) |
| [Power BI Embedded](/power-bi) | Yes | | [Using your own key for Power BI encryption (Preview)](/power-bi/enterprise/service-encryption-byok) |

## Containers

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Kubernetes Service](/azure/aks/) | Yes | Yes | [Enable host encryption on your AKS cluster nodes](/azure/aks/enable-host-encryption) |
| [Azure Red Hat OpenShift](/azure/openshift/) | Yes | | [Bring your own keys (BYOK) with Azure Red Hat OpenShift](/azure/openshift/howto-byok) |
| [Container Instances](/azure/container-instances/) | Yes | | [Encrypt data with a customer-managed key](/azure/container-instances/container-instances-encrypt-data#encrypt-data-with-a-customer-managed-key) |
| [Container Registry](/azure/container-registry/) | Yes | | [Encrypt container images with a customer-managed key](/azure/container-registry/container-registry-customer-managed-keys) |

## Compute

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [App Service](../../app-service/index.yml) | Yes\* | Yes | [Configure customer-managed keys for App Service](../../app-service/configure-encrypt-at-rest-using-cmk.md) |
| [Azure Functions](../../azure-functions/index.yml) | Yes\* | Yes | [Configure customer-managed keys for Azure Functions](../../azure-functions/configure-encrypt-at-rest-using-cmk.md) |
| [Azure HPC Cache](/azure/hpc-cache/) | Yes | | [Use customer-managed keys with HPC Cache](/azure/hpc-cache/customer-keys) |
| [Azure Load Testing](/azure/load-testing/) | Yes | | [Configure customer-managed keys for Azure Load Testing](/azure/load-testing/how-to-configure-customer-managed-keys) |
| [Azure Managed Applications](../../azure-resource-manager/managed-applications/index.yml) | Yes\* | Yes | [Azure managed applications overview](../../azure-resource-manager/managed-applications/overview.md) |
| [Azure portal](/azure/azure-portal/) | Yes\* | Yes | [Security in the Azure portal](overview.md) |
| [Azure VMware Solution](../../azure-vmware/index.yml) | Yes | Yes | [Configure customer-managed keys in Azure VMware Solution](../../azure-vmware/configure-customer-managed-keys.md) |
| [Batch](../../batch/index.yml) | Yes | | [Use customer-managed keys with Batch accounts](../../batch/batch-customer-managed-key.md) |
| [SAP HANA](/azure/sap/large-instances/hana-overview-architecture) | Yes | | |
| [Site Recovery](../../site-recovery/index.yml) | Yes | | [Enable replication with customer-managed keys](../../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md) |
| [Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/) | Yes | Yes | [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview) |
| [Virtual Machines](/azure/virtual-machines/) | Yes | Yes | [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview) |

## Databases

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Cosmos DB](/azure/cosmos-db/) | Yes | Yes | [Configure customer-managed keys using Azure Key Vault](/azure/cosmos-db/how-to-setup-cmk), [Configure customer-managed keys using Azure Key Vault Managed HSM](/azure/cosmos-db/how-to-setup-customer-managed-keys-mhsm) |
| [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/) | Yes | | [Data encryption with customer-managed key (CMK) for Azure Cosmos DB for MongoDB vCore](https://devblogs.microsoft.com/cosmosdb/data-encryption-with-customer-managed-key-cmk-for-azure-cosmos-db-for-mongodb-vcore/) |
| [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/) | Yes | Yes | [Data encryption with customer-managed keys in Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/concepts-customer-managed-key) |
| [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/) | Yes | Yes | [Data encryption with customer-managed keys in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/concepts-data-encryption) |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/) | Yes | | [Configure customer-managed keys for encryption](/azure/managed-instance-apache-cassandra/customer-managed-keys) |
| [Azure SQL Database](/azure/azure-sql/database/) | Yes (RSA 3072-bit) | Yes | [Bring your own key (BYOK) support for Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) |
| [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/) | Yes (RSA 3072-bit) | Yes | [Bring your own key (BYOK) support for Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) |
| [SQL Server on Azure VM](/azure/azure-sql/virtual-machines/) | Yes | | [Configure Azure Key Vault integration for SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/azure-key-vault-integration-configure) |
| [SQL Server on Virtual Machines](/azure/virtual-machines/windows/sql/) | Yes | | [Transparent data encryption for SQL Server on Azure VM](/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-security#transparent-data-encryption) |
| [SQL Server Stretch Database](/azure/sql-server-stretch-database/) | Yes (RSA 3072-bit) | | |
| [Table Storage](../../storage/tables/index.yml) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |

## Hybrid + multicloud

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Stack Edge](../../databox-online/index.yml) | Yes | | [Protect data at rest on Azure Stack Edge Pro R](../../databox-online/azure-stack-edge-pro-r-security.md#protect-data-at-rest) |

## Integration

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Fluid Relay](../../azure-fluid-relay/index.yml) | Yes | Yes | [Customer-managed keys for Azure Fluid Relay](../../azure-fluid-relay/concepts/customer-managed-keys.md) |
| [Azure Health Data Services](../../healthcare-apis/index.yml) | Yes | Yes | [Configure customer-managed keys for Azure Health Data Services DICOM](../../healthcare-apis/dicom/configure-customer-managed-keys.md), [Configure customer-managed keys for Azure Health Data Services FHIR](../../healthcare-apis/fhir/configure-customer-managed-keys.md) |
| [Event Hubs](../../event-hubs/index.yml) | Yes | Yes | [Configure customer-managed keys for encryption](../../event-hubs/configure-customer-managed-key.md) |
| [Logic Apps](../../logic-apps/index.yml) | Yes | |  |
| [Service Bus](../../service-bus-messaging/index.yml) | Yes | Yes | [Configure customer-managed keys for encryption](../../service-bus-messaging/configure-customer-managed-key.md) |

## IoT services

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Device Update for IoT Hub](../../iot-hub-device-update/index.yml) | Yes | Yes | [Data encryption for Device Update for IoT Hub](../../iot-hub-device-update/device-update-data-encryption.md) |
| [IoT Hub Device Provisioning](../../iot-dps/index.yml) | Yes | |  |

## Management and governance

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [App Configuration](../../azure-app-configuration/index.yml) | Yes | | [Use customer-managed keys to encrypt data](../../azure-app-configuration/concept-customer-managed-keys.md) |
| [Automation](../../automation/index.yml) | Yes | | [Encryption of automation assets](../../automation/automation-secure-asset-encryption.md) |
| [Azure Chaos Studio](/azure/chaos-studio/) | Yes | | [Configure customer-managed keys for Azure Chaos Studio](/azure/chaos-studio/chaos-studio-configure-customer-managed-keys) |
| [Azure Migrate](../../migrate/index.yml) | Yes | | [Tutorial: Migrate VMware VMs to Azure](../../migrate/tutorial-migrate-vmware.md) |
| [Azure Monitor](/azure/azure-monitor) | Yes | Yes | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |

## Media

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Communication Services](../../communication-services/index.yml) | Yes | | [Data encryption in Azure Communication Services](/azure/communications-gateway/security#data-retention-data-security-and-encryption-at-rest) |
| [Media Services](/azure/media-services/) | Yes | | [Use your own encryption keys with Azure Media Services](/azure/media-services/latest/concept-use-customer-managed-keys-byok) |

## Security

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Azure Information Protection](/azure/information-protection/) | Yes | Yes | [How are the Azure Rights Management cryptographic keys managed and secured?](/azure/information-protection/how-does-it-work#how-the-azure-rms-cryptographic-keys-are-stored-and-secured) |
| [Microsoft Defender for Cloud](/azure/defender-for-cloud/) | Yes | Yes | [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys) |
| [Microsoft Defender for IoT](/azure/defender-for-iot/) | Yes | | |
| [Microsoft Sentinel](/azure/sentinel/) | Yes | Yes | [Encryption at rest in Microsoft Sentinel](/azure/sentinel/customer-managed-keys) |

## Storage

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Archive Storage](../../storage/blobs/archive-blob.md) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [Azure Backup](../../backup/index.yml) | Yes | Yes | [Encrypt backup data using customer-managed keys](../../backup/encryption-at-rest-with-cmk.md) |
| [Azure Cache for Redis](../../azure-cache-for-redis/index.yml) | Yes\*\* | Yes | [Configure disk encryption for Azure Cache for Redis instances using customer managed keys](../../azure-cache-for-redis/cache-how-to-encryption.md) |
| [Azure Data Box](../../databox/index.yml) | Yes | | [Use a customer-managed key to secure your Data Box](../../databox/data-box-customer-managed-encryption-key-portal.md) |
| [Azure Elastic SAN](../../storage/elastic-san/index.yml) | Yes | | [Configure customer-managed keys for Azure Elastic SAN](../../storage/elastic-san/elastic-san-configure-customer-managed-keys.md) |
| [Azure Import/Export](../../import-export/index.yml) | Yes | | [Use customer-managed keys for Azure Import/Export service](../../import-export/storage-import-export-encryption-key-portal.md) |
| [Azure Managed Lustre](/azure/azure-managed-lustre/) | Yes | | [Use customer-managed encryption keys with Azure Managed Lustre](/azure/azure-managed-lustre/customer-managed-encryption-keys) |
| [Azure NetApp Files](../../azure-netapp-files/index.yml) | Yes | Yes | [Configure customer-managed keys for Azure NetApp Files volume encryption](../../azure-netapp-files/configure-customer-managed-keys.md?tabs=azure-portal) |
| [Blob Storage](../../storage/blobs/index.yml) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction/) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Encryption at host for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |
| [File Storage](../../storage/files/index.yml) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [File Sync](../../storage/file-sync/file-sync-introduction.md) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [Managed Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Encryption at host for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |
| [Premium Blob Storage](../../storage/blobs/index.yml) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [Queue Storage](../../storage/queues/index.yml) | Yes | Yes | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md) |
| [StorSimple](/azure/storsimple/) | Yes | | [Azure StorSimple security features](/azure/storsimple/storsimple-security#data-encryption) |
| [Ultra Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | [Encryption at host for Windows and Linux VMs](/azure/virtual-machines/disk-encryption#customer-managed-keys) |

## Other

| Product, feature, or service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| [Universal Print](/universal-print/) | Yes | Yes | [Data encryption in Universal Print](/universal-print/fundamentals/universal-print-encryption) |

## Caveats

\* This service supports storing data in your own Key Vault, Storage Account, or other data persisting service that already supports server-side encryption with customer-managed key.

\*\* Any transient data stored temporarily on disk such as page files or swap files are encrypted with a Microsoft key (all tiers) or a customer-managed key (using the Enterprise and Enterprise Flash tiers). For more information, see [Configure disk encryption in Azure Cache for Redis](../../azure-cache-for-redis/cache-how-to-encryption.md).

## Related content

- [Data encryption models in Microsoft Azure](encryption-models.md)
- [How encryption is used in Azure](encryption-overview.md)
- [Double encryption](double-encryption.md)
