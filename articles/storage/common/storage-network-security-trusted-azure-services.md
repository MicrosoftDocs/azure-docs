---
title: Trusted Azure services for Azure Storage network security
description: Learn about the list of trusted Azure services that you can allow in network settings.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/24/2025
ms.author: normesta

---

# Trusted Azure services

If you need to enable traffic from an Azure service outside of your network boundary, you can add a *network security exception*. This is useful when an Azure service operates from a network that you can't include in your virtual network or IP network rules. For example, some services might need to read resource logs and metrics in your account. You can allow read access for log files, metrics tables, or both by creating a network rule exception. These services connect to your storage account using strong authentication.

To learn how to add a network security exception, see [Manage Network security exceptions](storage-network-security-manage-exceptions.md).

<a id="trusted-access-based-on-system-assigned-managed-identity"></a>

### Trusted access for resources registered in your Microsoft Entra tenant

Resources from some services can access your storage account for selected operations, such as writing logs or running backups. These services must be registered in a subscription that is located in the same Microsoft Entra tenant as your storage account. The following table describes each service and its allowed operations.

| Service                  | Resource provider name     | Allowed operations                 |
|:------------------------ |:-------------------------- |:---------------------------------- |
| Azure Backup             | `Microsoft.RecoveryServices` | Run backups and restores of unmanaged disks in infrastructure as a service (IaaS) virtual machines (not required for managed disks). [Learn more](../../backup/backup-overview.md). |
| Azure Data Box           | `Microsoft.DataBox`          | Import data to Azure. [Learn more](../../databox/data-box-overview.md). |
| Azure Data Explorer      | `Microsoft.Kusto`          | Read data for ingestion and external tables, and write data to external tables. [Learn more](/azure/data-explorer/data-explorer-overview). |
| Azure DevTest Labs       | `Microsoft.DevTestLab`       | Create custom images and install artifacts. [Learn more](../../devtest-labs/devtest-lab-overview.md). |
| Azure Event Grid         | `Microsoft.EventGrid`        | Enable [Azure Blob Storage event publishing](../../event-grid/concepts.md#event-sources) and allow [publishing to storage queues](../../event-grid/event-handlers.md). |
| Azure Event Hubs         | `Microsoft.EventHub`         | Archive data by using Event Hubs Capture. [Learn More](../../event-hubs/event-hubs-capture-overview.md). |
| Azure File Sync          | `Microsoft.StorageSync`      | Transform your on-premises file server into a cache for Azure file shares. This capability allows multiple-site sync, fast disaster recovery, and cloud-side backup. [Learn more](../file-sync/file-sync-planning.md). |
| Azure HDInsight          | `Microsoft.HDInsight`        | Provision the initial contents of the default file system for a new HDInsight cluster. [Learn more](../../hdinsight/hdinsight-hadoop-use-blob-storage.md). |
| Azure Import/Export      | `Microsoft.ImportExport`     | Import data to Azure Storage or export data from Azure Storage. [Learn more](../../import-export/storage-import-export-service.md).  |
| Azure Monitor            | `Microsoft.Insights`         | Write monitoring data to a secured storage account, including resource logs, Microsoft Defender for Endpoint data, Microsoft Entra sign-in and audit logs, and Microsoft Intune logs. [Learn more](/azure/azure-monitor/roles-permissions-security). |
| Azure networking services         | `Microsoft.Network`          | Store and analyze network traffic logs, including through Azure Network Watcher and Azure Traffic Manager services. [Learn more](../../network-watcher/network-watcher-nsg-flow-logging-overview.md). |
| Azure Site Recovery      | `Microsoft.SiteRecovery`     | Enable replication for disaster recovery of Azure IaaS virtual machines when you're using firewall-enabled cache, source, or target storage accounts. [Learn more](../../site-recovery/azure-to-azure-tutorial-enable-replication.md). |

<a id="trusted-access-based-on-a-managed-identity"></a>

### Trusted access based on a managed identity

The following table lists services that can access your storage account data if the resource instances of those services have the appropriate permissions.

| Service                         | Resource provider name                  | Purpose            |
| :------------------------------ | :-------------------------------------- | :----------------- |
| Azure FarmBeats                 | `Microsoft.AgFoodPlatform/farmBeats`    | Enables access to storage accounts. |
| Azure API Management            | `Microsoft.ApiManagement/service`       | Enables access to storage accounts behind firewalls via policies. [Learn more](../../api-management/authentication-managed-identity-policy.md#use-managed-identity-in-send-request-policy). |
| Microsoft Autonomous Systems    | `Microsoft.AutonomousSystems/workspaces` | Enables access to storage accounts. |
| Azure Cache for Redis | `Microsoft.Cache/Redis` | Enables access to storage accounts. [Learn more](../../azure-cache-for-redis/cache-managed-identity.md).| 
| Azure AI Search          | `Microsoft.Search/searchServices`       | Enables access to storage accounts for indexing, processing, and querying. |
| Azure AI services        | `Microsoft.CognitiveService/accounts`   | Enables access to storage accounts. [Learn more](../..//cognitive-services/cognitive-services-virtual-networks.md).|
| Microsoft Cost Management | `Microsoft.CostManagementExports` | Enables export to storage accounts behind a firewall. [Learn more](../../cost-management-billing/costs/tutorial-improved-exports.md).|
| Azure Databricks                | `Microsoft.Databricks/accessConnectors` | Enables access to storage accounts. Serverless SQL warehouses require extra configuration. [Learn more](/azure/databricks/admin/sql/serverless).|
| Azure Data Factory              | `Microsoft.DataFactory/factories`       | Enables access to storage accounts through the Data Factory runtime. |
| Azure Data Explorer      | `Microsoft.Kusto/Clusters`          | Read data for ingestion and external tables, and write data to external tables. [Learn more](/azure/data-explorer/data-explorer-overview). |
| Azure Backup Vault              | `Microsoft.DataProtection/BackupVaults` | Enables access to storage accounts. |
| Azure Data Share                | `Microsoft.DataShare/accounts`          | Enables access to storage accounts. |
| Azure Database for PostgreSQL   | `Microsoft.DBForPostgreSQL`             | Enables access to storage accounts. |
| Azure Device Registry           | `Microsoft.DeviceRegistry/schemaRegistries`     | Enables access to storage accounts. |
| Azure IoT Hub                   | `Microsoft.Devices/IotHubs`             | Allows data from an IoT hub to be written to Blob Storage. [Learn more](../../iot-hub/virtual-network-support.md#egress-connectivity-from-iot-hub-to-other-azure-resources). |
| Azure DevTest Labs              | `Microsoft.DevTestLab/labs`             | Enables access to storage accounts. |
| Azure Event Grid                | `Microsoft.EventGrid/domains`           | Enables access to storage accounts. |
| Azure Event Grid                | `Microsoft.EventGrid/partnerTopics`     | Enables access to storage accounts. |
| Azure Event Grid                | `Microsoft.EventGrid/systemTopics`      | Enables access to storage accounts. |
| Azure Event Grid                | `Microsoft.EventGrid/topics`            | Enables access to storage accounts. |
| Microsoft Fabric                | `Microsoft.Fabric`                      | Enables access to storage accounts. |
| Azure Healthcare APIs           | `Microsoft.HealthcareApis/services`     | Enables access to storage accounts. |
| Azure Healthcare APIs           | `Microsoft.HealthcareApis/workspaces`   | Enables access to storage accounts. |
| Azure IoT Central               | `Microsoft.IoTCentral/IoTApps`          | Enables access to storage accounts. |
| Azure Key Vault Managed HSM     | `Microsoft.keyvault/managedHSMs`        | Enables access to storage accounts. |
| Azure Logic Apps                | `Microsoft.Logic/integrationAccounts`   | Enables logic apps to access storage accounts. [Learn more](../../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). |
| Azure Logic Apps                | `Microsoft.Logic/workflows`             | Enables logic apps to access storage accounts. [Learn more](../../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). |
| Azure Machine Learning studio   | `Microsoft.MachineLearning/registries`  | Enables authorized Azure Machine Learning workspaces to write experiment output, models, and logs to Blob Storage and read the data. [Learn more](/azure/machine-learning/how-to-network-security-overview#secure-the-workspace-and-associated-resources). |
| Azure Machine Learning          | `Microsoft.MachineLearningServices`     | Enables authorized Azure Machine Learning workspaces to write experiment output, models, and logs to Blob Storage and read the data. [Learn more](/azure/machine-learning/how-to-network-security-overview#secure-the-workspace-and-associated-resources). |
| Azure Machine Learning          | `Microsoft.MachineLearningServices/workspaces` | Enables authorized Azure Machine Learning workspaces to write experiment output, models, and logs to Blob Storage and read the data. [Learn more](/azure/machine-learning/how-to-network-security-overview#secure-the-workspace-and-associated-resources). |
| Azure Media Services            | `Microsoft.Media/mediaservices`         | Enables access to storage accounts. |
| Azure Migrate                   | `Microsoft.Migrate/migrateprojects`     | Enables access to storage accounts. |
| Azure ExpressRoute              | `Microsoft.Network/expressRoutePorts`   | Enables access to storage accounts. |
| Microsoft Power Platform        | `Microsoft.PowerPlatform/enterprisePolicies` | Enables access to storage accounts. |
| Microsoft Project Arcadia       | `Microsoft.ProjectArcadia/workspaces`   | Enables access to storage accounts. |
| Azure Data Catalog              | `Microsoft.ProjectBabylon/accounts`     | Enables access to storage accounts. |
| Microsoft Purview               | `Microsoft.Purview/accounts`            | Enables access to storage accounts. |
| Azure Site Recovery             | `Microsoft.RecoveryServices/vaults`     | Enables access to storage accounts. |
| Security Center                 | `Microsoft.Security/dataScanners`       | Enables access to storage accounts. |
| Singularity                     | `Microsoft.Singularity/accounts`        | Enables access to storage accounts. |
| Azure Storage Actions           | `Microsoft.Storageactions/Storagetasks` | Enables access to storage accounts. |
| Azure SQL Database              | `Microsoft.Sql`                         | Allows [writing audit data to storage accounts behind a firewall](/azure/azure-sql/database/audit-write-storage-account-behind-vnet-firewall). |
| Azure SQL Servers               | `Microsoft.Sql/servers`                 | Allows [writing audit data to storage accounts behind a firewall](/azure/azure-sql/database/audit-write-storage-account-behind-vnet-firewall). |
| Azure Synapse Analytics         | `Microsoft.Sql`                         | Allows import and export of data from specific SQL databases via the `COPY` statement or PolyBase (in a dedicated pool), or the `openrowset` function and external tables in a serverless pool. [Learn more](/azure/azure-sql/database/vnet-service-endpoint-rule-overview). |
| Azure Stream Analytics          | `Microsoft.StreamAnalytics`             | Allows data from a streaming job to be written to Blob Storage. [Learn more](../../stream-analytics/blob-output-managed-identity.md). |
| Azure Stream Analytics          | `Microsoft.StreamAnalytics/streamingjobs` | Allows data from a streaming job to be written to Blob Storage. [Learn more](../../stream-analytics/blob-output-managed-identity.md). |
| Azure Synapse Analytics         | `Microsoft.Synapse/workspaces`          | Enables access to data in Azure Storage. |
| Azure Video Indexer             | `Microsoft.VideoIndexer/Accounts`       | Enables access to storage accounts. |

If your account doesn't have the hierarchical namespace feature enabled, you can grant permission by explicitly assigning an Azure role to the [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for each resource instance. In this case, the scope of access for the instance corresponds to the Azure role assigned to the managed identity.

You can use the same technique for an account that has the hierarchical namespace feature enabled. However, you don't have to assign an Azure role if you add the managed identity to the access control list (ACL) of any directory or blob that the storage account contains. In that case, the scope of access for the instance corresponds to the directory or file to which the managed identity has access.

You can also combine Azure roles and ACLs together to grant access. To learn more, see [Access control model in Azure Data Lake Storage](../blobs/data-lake-storage-access-control-model.md).

We recommend that you [use resource instance rules to grant access to specific resources](storage-network-security-resource-instances.md).

## See also

- [Azure Storage firewall and virtual network rules](storage-network-security.md)
- [Manage Network security exceptions](storage-network-security-manage-exceptions.md)
