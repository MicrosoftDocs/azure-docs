---
title: Supported resources for metric alerts in Azure Monitor
description: Reference on support metrics and logs for metric alerts in Azure Monitor
author: harelbr
ms.author: harelbr
services: monitoring
ms.topic: conceptual
ms.date: 7/26/2020
ms.subservice: alerts
---

# Supported resources for metric alerts in Azure Monitor

Azure Monitor now supports a [new metric alert type](../../azure-monitor/platform/alerts-overview.md) which has significant benefits over the older [classic metric alerts](../../azure-monitor/platform/alerts-classic.overview.md). Metrics are available for [large list of Azure services](../../azure-monitor/platform/metrics-supported.md). The newer alerts support a (growing) subset of the resource types. This article lists that subset.

You can also use newer metric alerts on popular log data stored in a Log Analytics workspace extracted as metrics. For more information, view [Metric Alerts for Logs](../../azure-monitor/platform/alerts-metric-logs.md).

## Portal, PowerShell, CLI, REST support
Currently, you can create newer metric alerts only in the Azure portal, [REST API](/rest/api/monitor/metricalerts/), or [Resource Manager Templates](../../azure-monitor/platform/alerts-metric-create-templates.md). Support for configuring newer alerts using PowerShell and Azure CLI versions 2.0 and higher is coming soon.

## Metrics and Dimensions Supported
Newer metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. All supported metrics along with applicable dimensions can be explored and visualized from [Azure Monitor - Metrics Explorer](../../azure-monitor/platform/metrics-charts.md).

Here's the full list of Azure monitor metric sources supported by the newer alerts:

|Resource type  |Dimensions Supported |Multi-resource alerts| Metrics Available|
|---------|---------|-----|----------|
|Microsoft.ApiManagement/service | Yes | No | [API Management](../../azure-monitor/platform/metrics-supported.md#microsoftapimanagementservice) |
|Microsoft.AppConfiguration/configurationStores |Yes | No | [App Configuration](../../azure-monitor/platform/metrics-supported.md#microsoftappconfigurationconfigurationstores) |
|Microsoft.AppPlatform/Spring | Yes | No | [Azure Spring Cloud](../../azure-monitor/platform/metrics-supported.md#microsoftappplatformspring) |
|Microsoft.Automation/automationAccounts | Yes| No | [Automation Accounts](../../azure-monitor/platform/metrics-supported.md#microsoftautomationautomationaccounts) |
|Microsoft.Batch/batchAccounts | Yes | No | [Batch Accounts](../../azure-monitor/platform/metrics-supported.md#microsoftbatchbatchaccounts) |
|Microsoft.Cache/Redis | Yes | No | [Azure Cache for Redis](../../azure-monitor/platform/metrics-supported.md#microsoftcacheredis) |
|Microsoft.ClassicStorage/storageAccounts | Yes | No | [Storage Accounts (classic)](../../azure-monitor/platform/metrics-supported.md#microsoftclassicstoragestorageaccounts) |
|Microsoft.ClassicStorage/storageAccounts/blobServices | Yes | No | |
|Microsoft.ClassicStorage/storageAccounts/fileServices | Yes | No | |
|Microsoft.ClassicStorage/storageAccounts/queueServices | Yes | No | |
|Microsoft.ClassicStorage/storageAccounts/tableServices | Yes | No | |
|Microsoft.CognitiveServices/accounts | Yes | No | [Cognitive Services](../../azure-monitor/platform/metrics-supported.md#microsoftcognitiveservicesaccounts) |
|Microsoft.Compute/virtualMachines | Yes | Yes | [Virtual Machines](../../azure-monitor/platform/metrics-supported.md#microsoftcomputevirtualmachines) |
|Microsoft.Compute/virtualMachineScaleSets | Yes | No |[Virtual machine scale sets](../../azure-monitor/platform/metrics-supported.md#microsoftcomputevirtualmachinescalesets) |
|Microsoft.ContainerInstance/containerGroups | Yes| No | [Container groups](../../azure-monitor/platform/metrics-supported.md#microsoftcontainerinstancecontainergroups) |
|Microsoft.ContainerRegistry/registries | No | No | [Container Registries](../../azure-monitor/platform/metrics-supported.md#microsoftcontainerregistryregistries) |
|Microsoft.ContainerService/managedClusters | Yes | No | [Managed Clusters](../../azure-monitor/platform/metrics-supported.md#microsoftcontainerservicemanagedclusters) |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices | Yes | Yes | [Data Box](../../azure-monitor/platform/metrics-supported.md#microsoftdataboxedgedataboxedgedevices) |
|Microsoft.DataFactory/datafactories| Yes| No | [Data Factories V1](../../azure-monitor/platform/metrics-supported.md#microsoftdatafactorydatafactories) |
|Microsoft.DataFactory/factories |Yes | No | [Data Factories V2](../../azure-monitor/platform/metrics-supported.md#microsoftdatafactoryfactories) |
|Microsoft.DataShare/accounts | Yes | No | |
|Microsoft.DBforMariaDB/servers | No | No | [DB for MariaDB](../../azure-monitor/platform/metrics-supported.md#microsoftdbformariadbservers) |
|Microsoft.DBforMySQL/servers | No | No |[DB for MySQL](../../azure-monitor/platform/metrics-supported.md#microsoftdbformysqlservers)|
|Microsoft.DBforPostgreSQL/servers | No | No | [DB for PostgreSQL](../../azure-monitor/platform/metrics-supported.md#microsoftdbforpostgresqlservers)|
|Microsoft.DBforPostgreSQL/serversv2 | No | No | [DB for PostgreSQL V2](../../azure-monitor/platform/metrics-supported.md#microsoftdbforpostgresqlserversv2)|
|Microsoft.DBforPostgreSQL/singleservers | No | No | [DB for PostgreSQL (single servers)](../../azure-monitor/platform/metrics-supported.md#microsoftdbforpostgresqlsingleservers)|
|Microsoft.Devices/IotHubs | Yes | No |[IoT Hub](../../azure-monitor/platform/metrics-supported.md#microsoftdevicesiothubs) |
|Microsoft.Devices/provisioningServices| Yes | No | [Device Provisioning Services](../../azure-monitor/platform/metrics-supported.md#microsoftdevicesprovisioningservices) |
|Microsoft.DocumentDB/databaseAccounts | Yes | No | [Cosmos DB](../../azure-monitor/platform/metrics-supported.md#microsoftdocumentdbdatabaseaccounts) |
|Microsoft.EventGrid/domains | Yes | No | [Event Grid Domains](../../azure-monitor/platform/metrics-supported.md#microsofteventgriddomains) |
|Microsoft.EventGrid/systemTopics | Yes | No | [Event Grid System Topics](../../azure-monitor/platform/metrics-supported.md#microsofteventgridsystemtopics) |
|Microsoft.EventGrid/topics |Yes | No | [Event Grid Topics](../../azure-monitor/platform/metrics-supported.md#microsofteventgridtopics) |
|Microsoft.EventHub/clusters |Yes| No | [Event Hubs Clusters](../../azure-monitor/platform/metrics-supported.md#microsofteventhubclusters) |
|Microsoft.EventHub/namespaces |Yes| No | [Event Hubs](../../azure-monitor/platform/metrics-supported.md#microsofteventhubnamespaces) |
|Microsoft.HDInsight/clusters | Yes | No | [HDInsight Clusters](../../azure-monitor/platform/metrics-supported.md#microsofthdinsightclusters) |
|Microsoft.Insights/Components | Yes | No | [Application Insights](../../azure-monitor/platform/metrics-supported.md#microsoftinsightscomponents) |
|Microsoft.KeyVault/vaults | No |No |[Vaults](../../azure-monitor/platform/metrics-supported.md#microsoftkeyvaultvaults)|
|Microsoft.Kusto/Clusters | Yes |No |[Data Explorer Clusters](../../azure-monitor/platform/metrics-supported.md#microsoftkustoclusters)|
|Microsoft.Logic/workflows | No | No |[Logic Apps](../../azure-monitor/platform/metrics-supported.md#microsoftlogicworkflows) |
|Microsoft.MachineLearningServices/workspaces | Yes | No | [Machine Learning](../../azure-monitor/platform/metrics-supported.md#microsoftmachinelearningservicesworkspaces) |
|Microsoft.Maps/accounts | Yes | No | [Maps Accounts](../../azure-monitor/platform/metrics-supported.md#microsoftmapsaccounts) |
|Microsoft.Media/mediaservices | No | No | [Media Services](../../azure-monitor/platform/metrics-supported.md#microsoftmediamediaservices) |
|Microsoft.Media/mediaservices/streamingEndpoints | Yes | No | [Media Services Streaming Endpoints](../../azure-monitor/platform/metrics-supported.md#microsoftmediamediaservicesstreamingendpoints) |
|Microsoft.NetApp/netAppAccounts/capacityPools | Yes | No | [Azure NetApp Capacity Pools](../../azure-monitor/platform/metrics-supported.md#microsoftnetappnetappaccountscapacitypools) |
|Microsoft.NetApp/netAppAccounts/capacityPools/volumes | Yes | No | [Azure NetApp Volumes](../../azure-monitor/platform/metrics-supported.md#microsoftnetappnetappaccountscapacitypoolsvolumes) |
|Microsoft.Network/applicationGateways | Yes | No | [Application Gateways](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkapplicationgateways) |
|Microsoft.Network/azurefirewalls | Yes | No | [Firewalls](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkazurefirewalls) |
|Microsoft.Network/dnsZones | No | No | [DNS Zones](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkdnszones) |
|Microsoft.Network/expressRouteCircuits | N/A | No |[Express Route Circuits](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkexpressroutecircuits) |
|Microsoft.Network/loadBalancers (only for Standard SKUs)| Yes| No | [Load Balancers](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkloadbalancers) |
|Microsoft.Network/natGateways| No | No | |
|Microsoft.Network/privateEndpoints| No | No | |
|Microsoft.Network/privateLinkServices| No | No |
|Microsoft.Network/publicipaddresses | No | No |[Public IP Addresses](../../azure-monitor/platform/metrics-supported.md#microsoftnetworkpublicipaddresses)|
|Microsoft.Network/trafficManagerProfiles | Yes | No | [Traffic Manager Profiles](../../azure-monitor/platform/metrics-supported.md#microsoftnetworktrafficmanagerprofiles) |
|Microsoft.OperationalInsights/workspaces| Yes | No | [Log Analytics workspaces](../../azure-monitor/platform/metrics-supported.md#microsoftoperationalinsightsworkspaces)|
|Microsoft.Peering/peerings | Yes | No | [Peerings](../../azure-monitor/platform/metrics-supported.md#microsoftpeeringpeerings) |
|Microsoft.Peering/peeringServices | Yes | No | [Peering Services](../../azure-monitor/platform/metrics-supported.md#microsoftpeeringpeeringservices) |
|Microsoft.PowerBIDedicated/capacities | No | No | [Capacities](../../azure-monitor/platform/metrics-supported.md#microsoftpowerbidedicatedcapacities) |
|Microsoft.Relay/namespaces | Yes | No | [Relays](../../azure-monitor/platform/metrics-supported.md#microsoftrelaynamespaces) |
|Microsoft.Search/searchServices | No | No | [Search services](../../azure-monitor/platform/metrics-supported.md#microsoftsearchsearchservices) |
|Microsoft.ServiceBus/namespaces | Yes | No | [Service Bus](../../azure-monitor/platform/metrics-supported.md#microsoftservicebusnamespaces) |
|Microsoft.Sql/managedInstances | No | Yes | [SQL Managed Instances](../../azure-monitor/platform/metrics-supported.md#microsoftsqlmanagedinstances) |
|Microsoft.Sql/servers/databases | No | Yes | [SQL Databases](../../azure-monitor/platform/metrics-supported.md#microsoftsqlserversdatabases) |
|Microsoft.Sql/servers/elasticPools | No | Yes | [SQL Elastic Pools](../../azure-monitor/platform/metrics-supported.md#microsoftsqlserverselasticpools) |
|Microsoft.Storage/storageAccounts |Yes | No | [Storage Accounts](../../azure-monitor/platform/metrics-supported.md#microsoftstoragestorageaccounts)|
|Microsoft.Storage/storageAccounts/services | Yes| No | [Blob Services](../../azure-monitor/platform/metrics-supported.md#microsoftstoragestorageaccountsblobservices), [File Services](../../azure-monitor/platform/metrics-supported.md#microsoftstoragestorageaccountsfileservices), [Queue Services](../../azure-monitor/platform/metrics-supported.md#microsoftstoragestorageaccountsqueueservices) and [Table Services](../../azure-monitor/platform/metrics-supported.md#microsoftstoragestorageaccountstableservices)|
|Microsoft.StorageCache/caches | Yes | No | |
|Microsoft.StorageSync/storageSyncServices | Yes | No | [Storage Sync Services](../../azure-monitor/platform/metrics-supported.md#microsoftstoragesyncstoragesyncservices) |
|Microsoft.StreamAnalytics/streamingjobs | Yes | No | [Stream Analytics](../../azure-monitor/platform/metrics-supported.md#microsoftstreamanalyticsstreamingjobs) |
|Microsoft.VMWareCloudSimple/virtualMachines | Yes | No | [CloudSimple Virtual Machines](../../azure-monitor/platform/metrics-supported.md#microsoftvmwarecloudsimplevirtualmachines) |
|Microsoft.Web/hostingEnvironments/multiRolePools | Yes | No | [App Service Environment Multi-Role Pools](../../azure-monitor/platform/metrics-supported.md#microsoftwebhostingenvironmentsmultirolepools)|
|Microsoft.Web/hostingEnvironments/workerPools | Yes | No | [App Service Environment Worker Pools](../../azure-monitor/platform/metrics-supported.md#microsoftwebhostingenvironmentsworkerpools)|
|Microsoft.Web/serverfarms | Yes | No | [App Service Plans](../../azure-monitor/platform/metrics-supported.md#microsoftwebserverfarms)|
|Microsoft.Web/sites | Yes | No | [App Services](../../azure-monitor/platform/metrics-supported.md#microsoftwebsites-excluding-functions) and [Functions](../../azure-monitor/platform/metrics-supported.md#microsoftwebsites-functions)|
|Microsoft.Web/sites/slots | Yes | No | [App Service slots](../../azure-monitor/platform/metrics-supported.md#microsoftwebsitesslots)|

## Payload schema

> [!NOTE]
> You can also use the [common alert schema](https://aka.ms/commonAlertSchemaDocs), which provides the advantage of having a single extensible and unified alert payload across all the alert services in Azure Monitor, for your webhook integrations. [Learn about the common alert schema definitions.](https://aka.ms/commonAlertSchemaDefinitions)​


The POST operation contains the following JSON payload and schema for all near newer metric alerts when an appropriately configured [action group](../../azure-monitor/platform/action-groups.md) is used:

```json
{
  "schemaId": "AzureMonitorMetricAlert",
  "data": {
    "version": "2.0",
    "status": "Activated",
    "context": {
      "timestamp": "2018-02-28T10:44:10.1714014Z",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/microsoft.insights/metricAlerts/StorageCheck",
      "name": "StorageCheck",
      "description": "",
      "conditionType": "SingleResourceMultipleMetricCriteria",
      "severity":"3",
      "condition": {
        "windowSize": "PT5M",
        "allOf": [
          {
            "metricName": "Transactions",
            "metricNamespace":"microsoft.storage/storageAccounts",
            "dimensions": [
              {
                "name": "AccountResourceId",
                "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500"
              },
              {
                "name": "GeoType",
                "value": "Primary"
              }
            ],
            "operator": "GreaterThan",
            "threshold": "0",
            "timeAggregation": "PT5M",
            "metricValue": 1
          }
        ]
      },
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "resourceGroupName": "Contoso",
      "resourceName": "diag500",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceId": "/subscriptions/1e3ff1c0-771a-4119-a03b-be82a51e232d/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500",
      "portalLink": "https://portal.azure.com/#resource//subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500"
    },
    "properties": {
      "key1": "value1",
      "key2": "value2"
    }
  }
}
```

## Next steps

* Learn more about the new [Alerts experience](../../azure-monitor/platform/alerts-overview.md).
* Learn about [log alerts in Azure](../../azure-monitor/platform/alerts-unified-log.md).
* Learn about [alerts in Azure](../../azure-monitor/platform/alerts-overview.md).
