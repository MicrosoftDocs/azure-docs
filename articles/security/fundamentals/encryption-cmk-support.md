---
title: Data encryption models in Microsoft Azure
description: This article provides an overview of data encryption models In Microsoft Azure.
author: msmbaldwin
ms.author: mbaldwin
ms.date: 07/19/2024
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
---

## Services that support customer managed keys (CMKs) in Azure Key Vault and Azure Managed HSM

The following services support server-side encryption with customer managed keys in [Azure Key Vault](/azure/key-vault/) and [Azure Managed HSM](/azure/key-vault/managed-hsm/). For implementation details, see the service-specific documentation or the service's [Microsofr Cloud Security Benchmark: security baseline](/security/benchmark/azure/baselines/) (section DP-5).

| Product, Feature, or Service | Key Vault | Managed HSM | Documentation |
|---|---|---|---|---|
| **AI and Machine Learning** | | | |
| [Azure AI Search](/azure/search/) | Yes | | |
| [Azure AI services](/azure/cognitive-services/) | Yes | Yes | |
| [Azure AI Studio](/azure/ai-studio) | Yes | | [CMKs or encryption with Azure AI Studio](/azure/ai-studio/concepts/encryption-keys-portal) |
| [Azure Bot Service](/azure/bot-service/) | Yes | | [Azure Bot Service CMK documentation](/bot-service/bot-service-encryption#customer-managed-keys-with-azure-key-vault) |
| [Azure Health Bot](/azure/health-bot/) | Yes | | [Azure Health Bot CMK documentation](/azure/health-bot/cmk) |
| [Azure Machine Learning](/azure/machine-learning/) | Yes | | |
| [Azure OpenAI](/azure/ai-services/openai/) | Yes | Yes | |
| [Content Moderator](/azure/cognitive-services/content-moderator/) | Yes | Yes | |
| [Dataverse](/powerapps/maker/data-platform/) | Yes | Yes | |
| [Dynamics 365](/dynamics365/) | Yes | Yes | |
| [Face](/azure/cognitive-services/face/) | Yes | Yes | |
| [Language Understanding](/azure/cognitive-services/luis/) | Yes | Yes | |
| [Personalizer](/azure/cognitive-services/personalizer/) | Yes | Yes | |
| [Power Platform](/power-platform/) | Yes | Yes | |
| [QnA Maker](/azure/cognitive-services/qnamaker/) | Yes | Yes | |
| [Speech Services](/azure/cognitive-services/speech-service/) | Yes | Yes | |
| [Translator Text](/azure/cognitive-services/translator/) | Yes | Yes | |
| **Analytics** | | | |
| [Azure Data Explorer](/azure/data-explorer/) | Yes | | [Azure Data Explorer CMK documentation](/data-explorer/customer-managed-keys-portal) |
| [Azure Data Factory](/azure/data-factory/) | Yes | Yes | |
| [Azure Data Lake Store](/azure/data-lake-store/) | Yes (RSA 2048-bit) | | |
| [Azure Data Manager for Energy](/azure/energy-data-services/) | Yes | | [Azure Data Manager for Energy CMK documentation](/azure/energy-data-services/how-to-manage-data-security-and-encryption) |
| [Azure Databricks](/azure/databricks/) | Yes | Yes | [Azure Databricks CMK documentation](/databricks/security/keys/customer-managed-key-managed-services-azure) |
| [Azure HDInsight](/azure/hdinsight/) | Yes | | |
| [Azure Monitor Application Insights](/azure/azure-monitor/app/) | Yes | | |
| [Azure Monitor Log Analytics](/azure/azure-monitor/logs/) | Yes | Yes | |
| [Azure Stream Analytics](/azure/stream-analytics/) | Yes\*\* | Yes | [Azure Stream Analytics CMK documentation](/stream-analytics/data-protection) |
| [Azure Synapse Analytics](/azure/synapse-analytics/) | Yes (RSA 3072-bit) | Yes | [Azure Synapse Analytics CMK documentation](/azure/synapse-analytics/security/workspaces-encryption) |
| [Event Hubs](/azure/event-hubs/) | Yes | | [Event Hubs CMK documentation](/event-hubs/configure-customer-managed-key) |
| [Functions](/azure/azure-functions/) | Yes | | [Functions CMK documentation](/azure/azure-functions/configure-encrypt-at-rest-using-cmk) |
| [Microsoft Fabric](/fabric) | Yes | | [CMK encryption and Microsoft Fabric](/fabric/security/security-scenario#customer-managed-key-cmk-encryption-and-microsoft-fabric) |
| [Power BI Embedded](/power-bi) | Yes | | [BYOK for Power BI](/power-bi/enterprise/service-encryption-byok) |
| **Containers** | | | |
| [App Configuration](/azure/azure-app-configuration/) | Yes | | [Use CMKs to encrypt App Configuration data](/azure/azure-app-configuration/concept-customer-managed-keys) |
| [Azure Kubernetes Service](/azure/aks/) | Yes | Yes | [Azure Kubernetes Service (AKS) CMK documentation](/azure/aks/enable-host-encryption) |
| [Azure Managed Applications](/azure/azure-resource-manager/managed-applications/) | Yes\*\* | Yes | |
| [Azure Red Hat OpenShift](/azure/openshift/) | Yes | | [Encrypt OS disks with CMKs on Azure Red Hat OpenShift](/azure/openshift/howto-byok) |
| [Container Instances](/azure/container-instances/) | Yes | | [Container Instances CMK documentation](/container-instances/container-instances-encrypt-data#encrypt-data-with-a-customer-managed-key) |
| [Container Registry](/azure/container-registry/) | Yes | | [Container Registry CMK documentation](/container-registry/container-registry-customer-managed-keys) |
| **Compute** | | | |
| [App Service](/azure/app-service/) | Yes\*\* | Yes | [App Service CMK documentation](/app-service/configure-encrypt-at-rest-using-cmk) |
| [Automation](/azure/automation/) | Yes | | [Automation CMK documentation](/automation/automation-secure-asset-encryption) |
| [Azure Functions](/azure/azure-functions/) | Yes\*\* | Yes | [Functions CMK documentation](/azure/azure-functions/configure-encrypt-at-rest-using-cmk) |
| [Azure HPC Cache](/azure/hpc-cache/) | Yes | | [Azure HPC Cache CMK documentation](/azure/hpc-cache/customer-keys) |
| [Azure Managed Applications](/azure/azure-resource-manager/managed-applications/) | Yes\*\* | Yes | |
| [Azure portal](/azure/azure-portal/) | Yes\*\* | Yes | |
| [Azure VMware Solution](/azure/azure-vmware/) | Yes | Yes | |
| [Batch](/azure/batch/) | Yes | | [Batch CMK documentation](/azure/batch/batch-customer-managed-key) |
| [Logic Apps](/azure/logic-apps/) | Yes | | |
| [SAP HANA](/azure/sap/large-instances/hana-overview-architecture) | Yes | | |
| [Service Bus](/azure/service-bus-messaging/) | Yes | | [Service Bus CMK documentation](/service-bus-messaging/configure-customer-managed-key) |
| [Site Recovery](/azure/site-recovery/) | Yes | | [Site Recovery CMK documentation](/azure/site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks) |
| [Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/) | Yes | Yes | [Virtual Machine Scale Sets CMK documentation](/virtual-machines/linux/disk-encryption-key-vault) |
| [Virtual Machines](/azure/virtual-machines/) | Yes | Yes | [Linux and Windows Virtual Machines CMK documentation](/azure/virtual-machines/disk-encryption#customer-managed-keys) |
| **Databases** | | | |
| [Azure Cosmos DB](/azure/cosmos-db/) | Yes | Yes | [Configure CMKs (Key Vault)](/azure/cosmos-db/how-to-setup-cmk), [Configure CMKs (Managed HSM)](/azure/cosmos-db/how-to-setup-customer-managed-keys-mhsm) |
| [Azure Database for MySQL](/azure/mysql/) | Yes | Yes | |
| [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/) | Yes | | [Azure Database for MySQL - Flexible Server CMK documentation](/azure/mysql/flexible-server/concepts-customer-managed-key) |
| [Azure Database for PostgreSQL](/azure/postgresql/) | Yes | Yes | |
| [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/) | Yes | | [Azure Database for PostgreSQL - Flexible Server CMK documentation](/azure/postgresql/flexible-server/concepts-data-encryption) |
| [Azure Database Migration Service](/azure/dms/) | N/A\* | | |
| [Azure Databricks](/azure/databricks/) | Yes | Yes | [Azure Databricks CMK documentation](/databricks/security/keys/customer-managed-key-managed-services-azure) |
| [Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/) | Yes | | [CMKs in Azure Managed Instance for Apache Cassandra](/azure/managed-instance-apache-cassandra/customer-managed-keys) |
| [Azure SQL Database](/azure/azure-sql/database/) | Yes (RSA 3072-bit) | Yes | |
| [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/) | Yes (RSA 3072-bit) | Yes | |
| [Azure Synapse Analytics (dedicated SQL pool (formerly SQL DW) only)](/azure/synapse-analytics/) | Yes (RSA 3072-bit) | Yes | |
| [SQL IaaS](/azure/virtual-machines/sql/) | Yes | | [SQL IaaS CMK documentation](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) |
| [SQL Server on Virtual Machines](/azure/virtual-machines/windows/sql/) | Yes | | |
| [SQL Server Stretch Database](/sql/sql-server/stretch-database/) | Yes (RSA 3072-bit) | | |
| [Table Storage](/azure/storage/tables/) | Yes | | |
| **Hybrid + Multicloud** | | | |
| [Azure Stack Edge](/azure/databox-online/) | Yes | | [Azure Stack Edge CMK documentation](/azure/databox-online/azure-stack-edge-pro-r-security#protect-data-at-rest) |
| **Identity** | | | |
| [Azure Information Protection](/azure/information-protection/) | Yes | | [Azure Information Protection CMK documentation](/information-protection/how-does-it-work#how-the-azure-rms-cryptographic-keys-are-stored-and-secured) |
| [Microsoft Entra Domain Services](/azure/active-directory-domain-services/) | Yes | | |
| **Integration** | | | |
| [Azure Health Data Services](/azure/healthcare-apis/) | Yes | | [Configure CMKs for DICOM](/azure/healthcare-apis/dicom/configure-customer-managed-keys), [Configure CMKs for FHIR](/azure/healthcare-apis/fhir/configure-customer-managed-keys) |
| [Event Hubs](/azure/event-hubs/) | Yes | | [Event Hubs CMK documentation](/event-hubs/configure-customer-managed-key) |
| [Logic Apps](/azure/logic-apps/) | Yes | | |
| [Service Bus](/azure/service-bus-messaging/) | Yes | | [Service Bus CMK documentation](/service-bus-messaging/configure-customer-managed-key) |
| **IoT Services** | | | |
| [IoT Hub](/azure/iot-hub/) | Yes | | |
| [IoT Hub Device Provisioning](/azure/iot-dps/) | Yes | | |
| **Management and Governance** | | | |
| [App Configuration](/azure/azure-app-configuration/) | Yes | | [Azure App Configuration CMK documentation](/azure-app-configuration/concept-customer-managed-keys) |
| [Automation](/azure/automation/) | Yes | | [Automation CMK documentation](/automation/automation-secure-asset-encryption) |
| [Azure Migrate](/azure/migrate/) | Yes | | [Azure Migrate CMK documentation](/migrate/tutorial-migrate-vmware) |
| [Azure Monitor](/azure/azure-monitor) | Yes | | [Azure Monitor CMK documentation](/azure-monitor/logs/customer-managed-keys) |
| **Media** | | | |
| [Azure Communication Services](/azure/communication-services/) | Yes | | |
| [Media Services](/azure/media-services/) | Yes | | [Media Services CMK documentation](/media-services/latest/concept-use-customer-managed-keys-byok) |
| **Security** | | | |
| [Azure Information Protection](/azure/information-protection/) | Yes | | [Azure Information Protection CMK documentation](/information-protection/how-does-it-work#how-the-azure-rms-cryptographic-keys-are-stored-and-secured) |
| [Key Vault](/azure/key-vault/) | Yes | | [Key Vault CMK documentation](/key-vault/general/overview#securely-store-secrets-and-keys) |
| [Key Vault - Managed HSM](/azure/key-vault/managed-hsm/) | Yes | | [Key Vault - Managed HSM CMK documentation](/key-vault/managed-hsm/security-domain) |
| [Microsoft Defender for Cloud](/azure/defender-for-cloud/) | Yes | | [Microsoft Defender for Cloud CMK documentation](/azure/azure-monitor/logs/customer-managed-keys) |
| [Microsoft Defender for IoT](/azure/defender-for-iot/) | Yes | | |
| [Microsoft Sentinel](/azure/sentinel/) | Yes | Yes | [Microsoft Sentinel CMK documentation](/azure/sentinel/customer-managed-keys) |
| **Storage** | | | |
| [Archive Storage](/azure/storage/blobs/archive-blob) | Yes | | |
| [Azure Backup](/azure/backup/) | Yes | Yes | [Backup CMK documentation](/backup/encryption-at-rest-with-cmk) |
| [Azure Cache for Redis](/azure/azure-cache-for-redis/) | Yes\*\*\* | Yes | |
| [Azure Data Box](/azure/databox/) | Yes | | [Azure Data Box CMK documentation](/databox/data-box-customer-managed-encryption-key-portal) |
| [Azure Managed Lustre](/azure/azure-managed-lustre/) | Yes | | [Use CMKs with Azure Managed Lustre](/azure/azure-managed-lustre/customer-managed-encryption-keys) |
| [Azure NetApp Files](/azure/azure-netapp-files/) | Yes | Yes | |
| [Blob Storage](/azure/storage/blobs/) | Yes | Yes | |
| [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction/) | Yes | Yes | |
| [Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | |
| [File Premium Storage](/azure/storage/files/) | Yes | Yes | |
| [File Storage](/azure/storage/files/) | Yes | Yes | |
| [File Sync](/azure/storage/file-sync/file-sync-introduction) | Yes | Yes | |
| [Managed Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | |
| [Premium Blob Storage](/azure/storage/blobs/) | Yes | Yes | |
| [Queue Storage](/azure/storage/queues/) | Yes | Yes | |
| [StorSimple](/azure/storsimple/) | Yes | | |
| [Ultra Disk Storage](/azure/virtual-machines/disks-types/) | Yes | Yes | |
| **Other** | | | |
| [Universal Print](https://docs.microsoft.com/universal-print/) | Yes | | [Universal Print CMK documentation](https://docs.microsoft.com/universal-print/fundamentals/universal-print-encryption) |


\* This service doesn't persist data. Transient caches, if any, are encrypted with a Microsoft key.

\*\* This service supports storing data in your own Key Vault, Storage Account, or other data persisting service that already supports Server-Side Encryption with Customer-Managed Key.

\*\*\* Any transient data stored temporarily on disk such as pagefiles or swap files are encrypted with a Microsoft key (all tiers) or a customer-managed key (using the Enterprise and Enterprise Flash tiers). For more information, see [Configure disk encryption in Azure Cache for Redis](../../azure-cache-for-redis/cache-how-to-encryption.md).

## Related content

- [How encryption is used in Azure](encryption-overview.md)
- [Double encryption](double-encryption.md)
