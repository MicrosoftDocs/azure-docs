---
title: Azure resource logs supported services and schemas
description: Understand the supported services and event schemas for Azure resource logs.
ms.topic: reference
ms.date: 05/26/2023
ms.reviewer: lualderm
---

# Common and service-specific schemas for Azure resource logs

> [!NOTE]
> Resource logs were previously known as diagnostic logs. The name was changed in October 2019 as the types of logs gathered by Azure Monitor shifted to include more than just the Azure resource.
>
> This article used to list resource log categories that you can collect. That list is now at [Resource log categories](resource-logs-categories.md).

[Azure Monitor resource logs](../essentials/platform-logs-overview.md) are logs emitted by Azure services that describe the operation of those services or resources. All resource logs available through Azure Monitor share a common top-level schema. Each service has the flexibility to emit unique properties for its own events.

A combination of the resource type (available in the `resourceId` property) and the category uniquely identify a schema. This article describes the top-level schemas for resource logs and links to the schemata for each service.


## Top-level common schema

> [!NOTE]
> The schema described here is valid when resource logs are sent to Azure storage or to an event hub. When the logs are sent to a Log Analytics workspace, the column names may be different. See [Standard columns in Azure Monitor Logs](../logs/log-standard-columns.md) for columns common to all tables in a Log Analytics workspace and [Azure Monitor data reference](/azure/azure-monitor/reference) for a reference of different tables.

| Name | Required or optional | Description |
|---|---|---|
| `time` | Required | The timestamp (UTC) of the event. |
| `resourceId` | Required | The resource ID of the resource that emitted the event. For tenant services, this is of the form */tenants/tenant-id/providers/provider-name*. |
| `tenantId` | Required for tenant logs | The tenant ID of the Active Directory tenant that this event is tied to. This property is used only for tenant-level logs. It does not appear in resource-level logs. |
| `operationName` | Required | The name of the operation that this event represents. If the event represents an Azure role-based access control (RBAC) operation, this is the Azure RBAC operation name (for example, `Microsoft.Storage/storageAccounts/blobServices/blobs/Read`). This name is typically modeled in the form of an Azure Resource Manager operation, even if it's not a documented Resource Manager operation: (`Microsoft.<providerName>/<resourceType>/<subtype>/<Write/Read/Delete/Action>`). |
| `operationVersion` | Optional | The API version associated with the operation, if `operationName` was performed through an API (for example, `http://myservice.windowsazure.net/object?api-version=2016-06-01`). If no API corresponds to this operation, the version represents the version of that operation in case the properties associated with the operation change in the future. |
| `category` | Required | The log category of the event. Category is the granularity at which you can enable or disable logs on a particular resource. The properties that appear within the properties blob of an event are the same within a particular log category and resource type. Typical log categories are `Audit`, `Operational`, `Execution`, and `Request`. |
| `resultType` | Optional | The status of the event. Typical values include `Started`, `In Progress`, `Succeeded`, `Failed`, `Active`, and `Resolved`. |
| `resultSignature` | Optional | The substatus of the event. If this operation corresponds to a REST API call, this field is the HTTP status code of the corresponding REST call. |
| `resultDescription `| Optional | The static text description of this operation; for example, `Get storage file`. |
| `durationMs` | Optional | The duration of the operation in milliseconds. |
| `callerIpAddress` | Optional | The caller IP address, if the operation corresponds to an API call that would come from an entity with a publicly available IP address. |
| `correlationId` | Optional | A GUID that's used to group together a set of related events. Typically, if two events have the same `operationName` value but two different statuses (for example, `Started` and `Succeeded`), they share the same `correlationID` value. This might also represent other relationships between events. |
| `identity` | Optional | A JSON blob that describes the identity of the user or application that performed the operation. Typically, this field includes the authorization and claims or JWT token from Active Directory. |
| `Level` | Optional | The severity level of the event. Must be one of `Informational`, `Warning`, `Error`, or `Critical`. |
| `location` | Optional | The region of the resource emitting the event; for example, `East US` or `France South`. |
| `properties` | Optional | Any extended properties related to this category of events. All custom or unique properties must be put inside this "Part B" of the schema. |

## Service-specific schemas

The schema for resource logs varies depending on the resource and log category. The following list shows Azure services that make available resource logs and links to the service and category-specific schemas (where available). The list changes as new services are added. If you don't see what you need, feel free to open a GitHub issue on this article so we can update it.

| Service or feature | Schema and documentation |
| --- | --- |
| Azure Active Directory | [Overview](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md), [Audit log schema](../../active-directory/reports-monitoring/overview-reports.md), [Sign-ins schema](../../active-directory/reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md) |
| Azure Analysis Services | [Azure Analysis Services: Set up diagnostic logging](../../analysis-services/analysis-services-logging.md) |
| Azure API Management | [API Management resource logs](../../api-management/api-management-howto-use-azure-monitor.md#resource-logs) |
| Azure App Service | [App Service logs](../../app-service/troubleshoot-diagnostic-logs.md)
| Azure Application Gateway |[Logging for Application Gateway](../../application-gateway/application-gateway-diagnostics.md) |
| Azure Automation |[Log Analytics for Azure Automation](../../automation/automation-manage-send-joblogs-log-analytics.md) |
| Azure Batch |[Azure Batch logging](../../batch/batch-diagnostics.md) |
| Azure Cognitive Search | [Cognitive Search monitoring data reference (schemas)](../../search/monitor-azure-cognitive-search-data-reference.md#schemas) |
| Azure AI services | [Logging for Azure AI services](../../ai-services/diagnostic-logging.md) |
| Azure Container Instances | [Logging for Azure Container Instances](../../container-instances/container-instances-log-analytics.md#log-schema) |
| Azure Container Registry | [Logging for Azure Container Registry](../../container-registry/monitor-service.md) |
| Azure Content Delivery Network | [Diagnostic logs for Azure Content Delivery Network](../../cdn/cdn-azure-diagnostic-logs.md) |
| Azure Cosmos DB | [Azure Cosmos DB logging](../../cosmos-db/monitor-cosmos-db.md) |
| Azure Data Explorer | [Azure Data Explorer logs](/azure/data-explorer/using-diagnostic-logs) |
| Azure Data Factory | [Monitor Data Factory by using Azure Monitor](../../data-factory/monitor-using-azure-monitor.md) |
| Azure Data Lake Analytics |[Accessing logs for Azure Data Lake Analytics](../../data-lake-analytics/data-lake-analytics-diagnostic-logs.md) |
| Azure Data Lake Storage |[Accessing logs for Azure Data Lake Storage](../../data-lake-store/data-lake-store-diagnostic-logs.md) |
| Azure Database for MySQL | [Azure Database for MySQL diagnostic logs](../../mysql/concepts-server-logs.md#diagnostic-logs) |
| Azure Database for PostgreSQL | [Azure Database for PostgreSQL logs](../../postgresql/concepts-server-logs.md#resource-logs) |
| Azure Databricks | [Diagnostic logging in Azure Databricks](/azure/databricks/administration-guide/account-settings/azure-diagnostic-logs) |
| Azure DDoS Protection | [Logging for Azure DDoS Protection](../../ddos-protection/ddos-view-diagnostic-logs.md#example-log-queries) |
| Azure Digital Twins | [Set up Azure Digital Twins diagnostics](../../digital-twins/troubleshoot-diagnostics.md#log-schemas)
| Azure Event Hubs |[Azure Event Hubs logs](../../event-hubs/event-hubs-diagnostic-logs.md) |
| Azure ExpressRoute | [Monitoring Azure ExpressRoute](../../expressroute/monitor-expressroute.md#collection-and-routing) |
| Azure Firewall | [Logging for Azure Firewall](../../firewall/logs-and-metrics.md#diagnostic-logs) |
| Azure Front Door | [Logging for Azure Front Door](../../frontdoor/front-door-diagnostics.md) |
| Azure Functions | [Monitoring Azure Functions Data Reference Resource Logs](../../azure-functions/monitor-functions-reference.md#resource-logs) |
| Azure IoT Hub | [IoT Hub operations](../../iot-hub/monitor-iot-hub-reference.md#resource-logs) |
| Azure IoT Hub Device Provisioning Service| [Device Provisioning Service operations](../../iot-dps/monitor-iot-dps-reference.md#resource-logs) |
| Azure Key Vault |[Azure Key Vault logging](../../key-vault/general/logging.md) |
| Azure Kubernetes Service |[Azure Kubernetes Service logging](../../aks/monitor-aks-reference.md#resource-logs) |
| Azure Load Balancer |[Log Analytics for Azure Load Balancer](../../load-balancer/monitor-load-balancer.md) |
| Azure Load Testing |[Azure Load Testing logs](../../load-testing/monitor-load-testing-reference.md#resource-logs) |
| Azure Logic Apps |[Logic Apps B2B custom tracking schema](../../logic-apps/tracking-schemas-as2-x12-custom.md) |
| Azure Machine Learning | [Diagnostic logging in Azure Machine Learning](../../machine-learning/monitor-resource-reference.md) |
| Azure Media Services | [Media Services monitoring schemas](/azure/media-services/latest/monitoring/monitor-media-services#schemas) |
| Network security groups |[Log Analytics for network security groups (NSGs)](../../virtual-network/virtual-network-nsg-manage-log.md) |
| Azure Power BI Embedded | [Logging for Power BI Embedded in Azure](/power-bi/developer/azure-pbie-diag-logs) |
| Recovery Services | [Data model for Azure Backup](../../backup/backup-azure-reports-data-model.md)|
| Azure Service Bus |[Azure Service Bus logs](../../service-bus-messaging/service-bus-diagnostic-logs.md) |
| Azure SignalR | [Monitoring Azure SignalR Service data reference](../../azure-signalr/signalr-howto-monitor-reference.md) |
| Azure SQL Database | [Azure SQL Database logging](/azure/azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure) |
| Azure Storage | [Blobs](../../storage/blobs/monitor-blob-storage-reference.md#resource-logs-preview), [Files](../../storage/files/storage-files-monitoring-reference.md#resource-logs-preview), [Queues](../../storage/queues/monitor-queue-storage-reference.md#resource-logs-preview),  [Tables](../../storage/tables/monitor-table-storage-reference.md#resource-logs-preview) |
| Azure Stream Analytics |[Job logs](../../stream-analytics/stream-analytics-job-diagnostic-logs.md) |
| Azure Traffic Manager | [Traffic Manager log schema](../../traffic-manager/traffic-manager-diagnostic-logs.md) |
| Azure Video Indexer|[Monitor Azure Video Indexer data reference](../../azure-video-indexer/monitor-video-indexer-data-reference.md)|
| Azure Virtual Network | Schema not available |
| Azure Web PubSub | [Monitoring Azure Web PubSub data reference](../../azure-web-pubsub/howto-monitor-data-reference.md) |
| Virtual network gateways | [Logging for Virtual Network Gateways](../../vpn-gateway/troubleshoot-vpn-with-azure-diagnostics.md)|



## Next steps

* [See the resource log categories you can collect](resource-logs-categories.md)
* [Learn more about resource logs](../essentials/platform-logs-overview.md)
* [Stream resource logs to Event Hubs](./resource-logs.md#send-to-azure-event-hubs)
* [Change resource log diagnostic settings by using the Azure Monitor REST API](/rest/api/monitor/diagnosticsettings)
* [Analyze logs from Azure Storage with Log Analytics](./resource-logs.md#send-to-log-analytics-workspace)
