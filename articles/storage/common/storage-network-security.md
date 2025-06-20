---
title: Configure Azure Storage firewalls and virtual networks
description: Configure layered network security for your storage account by using the Azure Storage firewall.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Manage public access configuration of a storage account

Put something here.

<a id="change-the-default-network-access-rule"></a>

## Changing the default network rule

Put something here.

<a id="grant-access-from-a-virtual-network"></a>

## Grant access from a virtual network

You can configure storage accounts to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. With [cross-region service endpoints](#azure-storage-cross-region-service-endpoints), the allowed subnets can also be in different regions from the storage account.

You can enable a [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Storage within the virtual network. The service endpoint routes traffic from the virtual network through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the storage account that allow requests to be received from specific subnets in a virtual network. Clients granted access via these network rules must continue to meet the authorization requirements of the storage account to access the data.

Each storage account supports up to 400 virtual network rules. You can combine these rules with [IP network rules](storage-network-security-ip-address-range.md).

> [!IMPORTANT]
> When referencing a service endpoint in a client application, it's recommended that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address may result in unexpected behavior.
>
> Additionally, it's recommended that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL may result in unexpected behavior.

### Required permissions

To apply a virtual network rule to a storage account, the user must have the appropriate permissions for the subnets that are being added. A [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) or a user who has permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) can apply a rule by using a custom Azure role.

The storage account and the virtual networks that get access can be in different subscriptions, including subscriptions that are a part of a different Microsoft Entra tenant.

Configuration of rules that grant access to subnets in virtual networks that are a part of a different Microsoft Entra tenant are currently supported only through PowerShell, the Azure CLI, and REST APIs. You can't configure such rules through the Azure portal, though you can view them in the portal.

<a id="azure-storage-cross-region-service-endpoints"></a>

### Azure Storage cross-region service endpoints

Cross-region service endpoints for Azure Storage became generally available in April 2023. They work between virtual networks and storage service instances in any region. With cross-region service endpoints, subnets no longer use a public IP address to communicate with any storage account, including those in another region. Instead, all the traffic from subnets to storage accounts uses a private IP address as a source IP. As a result, any storage accounts that use IP network rules to permit traffic from those subnets no longer have an effect.

Configuring service endpoints between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md) can be an important part of your disaster recovery plan. Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When you're planning for disaster recovery during a regional outage, create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

Local and cross-region service endpoints can't coexist on the same subnet. To replace existing service endpoints with cross-region ones, delete the existing `Microsoft.Storage` endpoints and re-create them as cross-region endpoints (`Microsoft.Storage.Global`).

<a id="grant-access-from-an-internet-ip-range"></a>

## Grant access from an internet IP range

You can use IP network rules to allow access from specific public internet IP address ranges by creating IP network rules. Each storage account supports up to 400 rules. These rules grant access to specific internet-based services and on-premises networks and block general internet traffic.

### Restrictions for IP network rules

The following restrictions apply to IP address ranges:

- IP network rules are allowed only for *public internet* IP addresses.

  IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with 10, 172.16 to 172.31, and 192.168.

- You must provide allowed internet address ranges by using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form 16.17.18.0/24 or as individual IP addresses like 16.17.18.19.

- Small address ranges that use /31 or /32 prefix sizes are not supported. Configure these ranges by using individual IP address rules.

- Only IPv4 addresses are supported for configuration of storage firewall rules.

> [!IMPORTANT]
> You can't use IP network rules in the following cases:
>
> - To restrict access to clients in same Azure region as the storage account. IP network rules have no effect on requests that originate from the same Azure region as the storage account. Use [Virtual network rules](storage-network-security-virtual-networks.md) to allow same-region requests.
> - To restrict access to clients in a [paired region](../../reliability/cross-region-replication-azure.md) that are in a virtual network that has a service endpoint.
> - To restrict access to Azure services deployed in the same region as the storage account. Services deployed in the same region as the storage account use private Azure IP addresses for communication. So, you can't restrict access to specific Azure services based on their public outbound IP address range.

<a id="configuring-access-from-on-premises-networks"></a>

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account by using an IP network rule, you must identify the internet-facing IP addresses that your network uses. Contact your network administrator for help.

If you're using [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, you need to identify the NAT IP addresses used for Microsoft peering. Either the service provider or the customer provides the NAT IP addresses.

To allow access to your service resources, you must allow these public IP addresses in the firewall setting for resource IPs.

<a id="grant-access-from-azure-resource-instances"></a>

## Grant access from Azure resource instances

In some cases, an application might depend on Azure resources that can't be isolated through a virtual network or an IP address rule. But you still want to secure and restrict storage account access to only your application's Azure resources. You can configure storage accounts to allow access to specific resource instances of trusted Azure services by creating a resource instance rule.

The Azure role assignments of the resource instance determine the types of operations that a resource instance can perform on storage account data. Resource instances must be from the same tenant as your storage account, but they can belong to any subscription in the tenant.

<a id="grant-access-to-trusted-azure-services"></a>
<a id="manage-exceptions"></a>
<a id="trusted-microsoft-services"></a>

## Grant access to trusted Azure services

Some Azure services operate from networks that you can't include in your network rules. You can grant a subset of such trusted Azure services access to the storage account, while maintaining network rules for other apps. These trusted services will then use strong authentication to connect to your storage account.

In some cases, like storage analytics, access to read resource logs and metrics is required from outside the network boundary. When you configure trusted services to access the storage account, you can allow read access for the log files, metrics tables, or both by creating a network rule exception. You can manage network rule exceptions through the Azure portal, PowerShell, or the Azure CLI v2.

To learn more about working with storage analytics, see [Use Azure Storage analytics to collect logs and metrics data](./storage-analytics.md).

<a id="trusted-access-based-on-system-assigned-managed-identity"></a>

### Trusted access for resources registered in your Microsoft Entra tenant

Resources of some services can access your storage account for selected operations, such as writing logs or running backups. Those services must be registered in a subscription that is located in the same Microsoft Entra tenant as your storage account. The following table describes each service and the allowed operations.

| Service                  | Resource provider name     | Allowed operations                 |
|:------------------------ |:-------------------------- |:---------------------------------- |
| Azure Backup             | `Microsoft.RecoveryServices` | Run backups and restores of unmanaged disks in infrastructure as a service (IaaS) virtual machines (not required for managed disks). [Learn more](../../backup/backup-overview.md). |
| Azure Data Box           | `Microsoft.DataBox`          | Import data to Azure. [Learn more](../../databox/data-box-overview.md). |
| Azure Data Explorer           | `Microsoft.Kusto`          | Read data for ingestion and external tables, and write data to external tables. [Learn more](/azure/data-explorer/data-explorer-overview). |
| Azure DevTest Labs       | `Microsoft.DevTestLab`       | Create custom images and install artifacts. [Learn more](../../devtest-labs/devtest-lab-overview.md). |
| Azure Event Grid         | `Microsoft.EventGrid`        | Enable [Azure Blob Storage event publishing](../../event-grid/concepts.md#event-sources) and allow [publishing to storage queues](../../event-grid/event-handlers.md). |
| Azure Event Hubs         | `Microsoft.EventHub`         | Archive data by using Event Hubs Capture. [Learn More](../../event-hubs/event-hubs-capture-overview.md). |
| Azure File Sync          | `Microsoft.StorageSync`      | Transform your on-premises file server to a cache for Azure file shares. This capability allows multiple-site sync, fast disaster recovery, and cloud-side backup. [Learn more](../file-sync/file-sync-planning.md). |
| Azure HDInsight          | `Microsoft.HDInsight`        | Provision the initial contents of the default file system for a new HDInsight cluster. [Learn more](../../hdinsight/hdinsight-hadoop-use-blob-storage.md). |
| Azure Import/Export      | `Microsoft.ImportExport`     | Import data to Azure Storage or export data from Azure Storage. [Learn more](../../import-export/storage-import-export-service.md).  |
| Azure Monitor            | `Microsoft.Insights`         | Write monitoring data to a secured storage account, including resource logs, Microsoft Defender for Endpoint data, Microsoft Entra sign-in and audit logs, and Microsoft Intune logs. [Learn more](/azure/azure-monitor/roles-permissions-security). |
| Azure networking services         | `Microsoft.Network`          | Store and analyze network traffic logs, including through the Azure Network Watcher and Azure Traffic Manager services. [Learn more](../../network-watcher/network-watcher-nsg-flow-logging-overview.md). |
| Azure Site Recovery      | `Microsoft.SiteRecovery`     | Enable replication for disaster recovery of Azure IaaS virtual machines when you're using firewall-enabled cache, source, or target storage accounts.  [Learn more](../../site-recovery/azure-to-azure-tutorial-enable-replication.md). |

<a id="trusted-access-based-on-a-managed-identity"></a>

### Trusted access based on a managed identity

The following table lists services that can access your storage account data if the resource instances of those services have the appropriate permission.

| Service                         | Resource provider name                  | Purpose            |
| :------------------------------ | :-------------------------------------- | :----------------- |
| Azure FarmBeats                 | `Microsoft.AgFoodPlatform/farmBeats`    | Enables access to storage accounts. |
| Azure API Management            | `Microsoft.ApiManagement/service`       | Enables access to storage accounts behind firewalls via policies. [Learn more](../../api-management/authentication-managed-identity-policy.md#use-managed-identity-in-send-request-policy). |
| Microsoft Autonomous Systems    | `Microsoft.AutonomousSystems/workspaces` | Enables access to storage accounts. |
| Azure Cache for Redis | `Microsoft.Cache/Redis` | Enables access to storage accounts. [Learn more](../../azure-cache-for-redis/cache-managed-identity.md).| 
| Azure AI Search          | `Microsoft.Search/searchServices`       | Enables access to storage accounts for indexing, processing, and querying. |
| Azure AI services        | `Microsoft.CognitiveService/accounts`   | Enables access to storage accounts. [Learn more](../..//cognitive-services/cognitive-services-virtual-networks.md).|
| Microsoft Cost Management | `Microsoft.CostManagementExports` | Enables export to storage accounts behind a firewall. [Learn more](../../cost-management-billing/costs/tutorial-improved-exports.md).|
| Azure Databricks                | `Microsoft.Databricks/accessConnectors` | Enables access to storage accounts. Serverless SQL warehouses require additional configuration. [Learn more](/azure/databricks/admin/sql/serverless).|
| Azure Data Factory              | `Microsoft.DataFactory/factories`       | Enables access to storage accounts through the Data Factory runtime. |
| Azure Data Explorer           | `Microsoft.Kusto/Clusters`          | Read data for ingestion and external tables, and write data to external tables. [Learn more](/azure/data-explorer/data-explorer-overview). |
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

If your account doesn't have the hierarchical namespace feature enabled on it, you can grant permission by explicitly assigning an Azure role to the [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for each resource instance. In this case, the scope of access for the instance corresponds to the Azure role that's assigned to the managed identity.

You can use the same technique for an account that has the hierarchical namespace feature enabled on it. However, you don't have to assign an Azure role if you add the managed identity to the access control list (ACL) of any directory or blob that the storage account contains. In that case, the scope of access for the instance corresponds to the directory or file to which the managed identity has access.

You can also combine Azure roles and ACLs together to grant access. To learn more, see [Access control model in Azure Data Lake Storage](../blobs/data-lake-storage-access-control-model.md).

We recommend that you [use resource instance rules to grant access to specific resources](storage-network-security-resource-instances.md).


## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
