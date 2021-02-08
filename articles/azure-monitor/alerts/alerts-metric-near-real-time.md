---
title: Supported resources for metric alerts in Azure Monitor
description: Reference on support metrics and logs for metric alerts in Azure Monitor
author: harelbr
ms.author: harelbr
services: monitoring
ms.topic: conceptual
ms.date: 12/15/2020
ms.subservice: alerts
---

# Supported resources for metric alerts in Azure Monitor

Azure Monitor now supports a [new metric alert type](../platform/alerts-overview.md) which has significant benefits over the older [classic metric alerts](./alerts-classic.overview.md). Metrics are available for [large list of Azure services](../platform/metrics-supported.md). The newer alerts support a (growing) subset of the resource types. This article lists that subset.

You can also use newer metric alerts on popular log data stored in a Log Analytics workspace extracted as metrics. For more information, view [Metric Alerts for Logs](./alerts-metric-logs.md).

## Portal, PowerShell, CLI, REST support
Currently, you can create newer metric alerts only in the Azure portal, [REST API](/rest/api/monitor/metricalerts/), or [Resource Manager Templates](./alerts-metric-create-templates.md). Support for configuring newer alerts using PowerShell and Azure CLI versions 2.0 and higher is coming soon.

## Metrics and Dimensions Supported
Newer metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. All supported metrics along with applicable dimensions can be explored and visualized from [Azure Monitor - Metrics Explorer](../platform/metrics-charts.md).

Here's the full list of Azure Monitor metric sources supported by the newer alerts:

|Resource type  |Dimensions Supported |Multi-resource alerts| Metrics Available|
|---------|---------|-----|----------|
|Microsoft.Aadiam/azureADMetrics | Yes | No | |
|Microsoft.ApiManagement/service | Yes | No | [API Management](../platform/metrics-supported.md#microsoftapimanagementservice) |
|Microsoft.AppConfiguration/configurationStores |Yes | No | [App Configuration](../platform/metrics-supported.md#microsoftappconfigurationconfigurationstores) |
|Microsoft.AppPlatform/Spring | Yes | No | [Azure Spring Cloud](../platform/metrics-supported.md#microsoftappplatformspring) |
|Microsoft.Automation/automationAccounts | Yes| No | [Automation Accounts](../platform/metrics-supported.md#microsoftautomationautomationaccounts) |
|Microsoft.AVS/privateClouds | No | No | |
|Microsoft.Batch/batchAccounts | Yes | No | [Batch Accounts](../platform/metrics-supported.md#microsoftbatchbatchaccounts) |
|Microsoft.Cache/Redis | Yes | Yes | [Azure Cache for Redis](../platform/metrics-supported.md#microsoftcacheredis) |
|Microsoft.ClassicCompute/domainNames/slots/roles | No | No | [Classic Cloud Services](../platform/metrics-supported.md#microsoftclassiccomputedomainnamesslotsroles) |
|Microsoft.ClassicCompute/virtualMachines | No | No | [Classic Virtual Machines](../platform/metrics-supported.md#microsoftclassiccomputevirtualmachines) |
|Microsoft.ClassicStorage/storageAccounts | Yes | No | [Storage Accounts (classic)](../platform/metrics-supported.md#microsoftclassicstoragestorageaccounts) |
|Microsoft.ClassicStorage/storageAccounts/blobServices | Yes | No | [Storage Accounts (classic) - Blobs](../platform/metrics-supported.md#microsoftclassicstoragestorageaccountsblobservices) |
|Microsoft.ClassicStorage/storageAccounts/fileServices | Yes | No | [Storage Accounts (classic) - Files](../platform/metrics-supported.md#microsoftclassicstoragestorageaccountsfileservices) |
|Microsoft.ClassicStorage/storageAccounts/queueServices | Yes | No | [Storage Accounts (classic) - Queues](../platform/metrics-supported.md#microsoftclassicstoragestorageaccountsqueueservices) |
|Microsoft.ClassicStorage/storageAccounts/tableServices | Yes | No | [Storage Accounts (classic) - Tables](../platform/metrics-supported.md#microsoftclassicstoragestorageaccountstableservices) |
|Microsoft.CognitiveServices/accounts | Yes | No | [Cognitive Services](../platform/metrics-supported.md#microsoftcognitiveservicesaccounts) |
|Microsoft.Compute/virtualMachines | Yes | Yes<sup>1</sup> | [Virtual Machines](../platform/metrics-supported.md#microsoftcomputevirtualmachines) |
|Microsoft.Compute/virtualMachineScaleSets | Yes | No |[Virtual machine scale sets](../platform/metrics-supported.md#microsoftcomputevirtualmachinescalesets) |
|Microsoft.ContainerInstance/containerGroups | Yes| No | [Container groups](../platform/metrics-supported.md#microsoftcontainerinstancecontainergroups) |
|Microsoft.ContainerRegistry/registries | No | No | [Container Registries](../platform/metrics-supported.md#microsoftcontainerregistryregistries) |
|Microsoft.ContainerService/managedClusters | Yes | No | [Managed Clusters](../platform/metrics-supported.md#microsoftcontainerservicemanagedclusters) |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices | Yes | Yes | [Data Box](../platform/metrics-supported.md#microsoftdataboxedgedataboxedgedevices) |
|Microsoft.DataFactory/datafactories| Yes| No | [Data Factories V1](../platform/metrics-supported.md#microsoftdatafactorydatafactories) |
|Microsoft.DataFactory/factories |Yes | No | [Data Factories V2](../platform/metrics-supported.md#microsoftdatafactoryfactories) |
|Microsoft.DataShare/accounts | Yes | No | |
|Microsoft.DBforMariaDB/servers | No | No | [DB for MariaDB](../platform/metrics-supported.md#microsoftdbformariadbservers) |
|Microsoft.DBforMySQL/servers | No | No |[DB for MySQL](../platform/metrics-supported.md#microsoftdbformysqlservers)|
|Microsoft.DBforPostgreSQL/servers | No | No | [DB for PostgreSQL](../platform/metrics-supported.md#microsoftdbforpostgresqlservers)|
|Microsoft.DBforPostgreSQL/serversv2 | No | No | [DB for PostgreSQL V2](../platform/metrics-supported.md#microsoftdbforpostgresqlserversv2)|
|Microsoft.DBforPostgreSQL/flexibleServers | Yes | No | [DB for PostgreSQL (flexible servers)](../platform/metrics-supported.md#microsoftdbforpostgresqlflexibleservers)|
|Microsoft.Devices/IotHubs | Yes | No |[IoT Hub](../platform/metrics-supported.md#microsoftdevicesiothubs) |
|Microsoft.Devices/provisioningServices| Yes | No | [Device Provisioning Services](../platform/metrics-supported.md#microsoftdevicesprovisioningservices) |
|Microsoft.DigitalTwins/digitalTwinsInstances | Yes | No | |
|Microsoft.DocumentDB/databaseAccounts | Yes | No | [Cosmos DB](../platform/metrics-supported.md#microsoftdocumentdbdatabaseaccounts) |
|Microsoft.EventGrid/domains | Yes | No | [Event Grid Domains](../platform/metrics-supported.md#microsofteventgriddomains) |
|Microsoft.EventGrid/systemTopics | Yes | No | [Event Grid System Topics](../platform/metrics-supported.md#microsofteventgridsystemtopics) |
|Microsoft.EventGrid/topics |Yes | No | [Event Grid Topics](../platform/metrics-supported.md#microsofteventgridtopics) |
|Microsoft.EventHub/clusters |Yes| No | [Event Hubs Clusters](../platform/metrics-supported.md#microsofteventhubclusters) |
|Microsoft.EventHub/namespaces |Yes| No | [Event Hubs](../platform/metrics-supported.md#microsofteventhubnamespaces) |
|Microsoft.HDInsight/clusters | Yes | No | [HDInsight Clusters](../platform/metrics-supported.md#microsofthdinsightclusters) |
|Microsoft.Insights/Components | Yes | No | [Application Insights](../platform/metrics-supported.md#microsoftinsightscomponents) |
|Microsoft.KeyVault/vaults | Yes |Yes |[Vaults](../platform/metrics-supported.md#microsoftkeyvaultvaults)|
|Microsoft.Kusto/Clusters | Yes |No |[Data Explorer Clusters](../platform/metrics-supported.md#microsoftkustoclusters)|
|Microsoft.Logic/integrationServiceEnvironments | Yes | No |[Integration Service Environments](../platform/metrics-supported.md#microsoftlogicintegrationserviceenvironments) |
|Microsoft.Logic/workflows | No | No |[Logic Apps](../platform/metrics-supported.md#microsoftlogicworkflows) |
|Microsoft.MachineLearningServices/workspaces | Yes | No | [Machine Learning](../platform/metrics-supported.md#microsoftmachinelearningservicesworkspaces) |
|Microsoft.Maps/accounts | Yes | No | [Maps Accounts](../platform/metrics-supported.md#microsoftmapsaccounts) |
|Microsoft.Media/mediaservices | No | No | [Media Services](../platform/metrics-supported.md#microsoftmediamediaservices) |
|Microsoft.Media/mediaservices/streamingEndpoints | Yes | No | [Media Services Streaming Endpoints](../platform/metrics-supported.md#microsoftmediamediaservicesstreamingendpoints) |
|Microsoft.NetApp/netAppAccounts/capacityPools | Yes | Yes | [Azure NetApp Capacity Pools](../platform/metrics-supported.md#microsoftnetappnetappaccountscapacitypools) |
|Microsoft.NetApp/netAppAccounts/capacityPools/volumes | Yes | Yes | [Azure NetApp Volumes](../platform/metrics-supported.md#microsoftnetappnetappaccountscapacitypoolsvolumes) |
|Microsoft.Network/applicationGateways | Yes | No | [Application Gateways](../platform/metrics-supported.md#microsoftnetworkapplicationgateways) |
|Microsoft.Network/azurefirewalls | Yes | No | [Firewalls](../platform/metrics-supported.md#microsoftnetworkazurefirewalls) |
|Microsoft.Network/dnsZones | No | No | [DNS Zones](../platform/metrics-supported.md#microsoftnetworkdnszones) |
|Microsoft.Network/expressRouteCircuits | Yes | No |[ExpressRoute Circuits](../platform/metrics-supported.md#microsoftnetworkexpressroutecircuits) |
|Microsoft.Network/expressRoutePorts | Yes | No |[ExpressRoute Direct](../platform/metrics-supported.md#microsoftnetworkexpressrouteports) |
|Microsoft.Network/loadBalancers (only for Standard SKUs)| Yes| No | [Load Balancers](../platform/metrics-supported.md#microsoftnetworkloadbalancers) |
|Microsoft.Network/natGateways| No | No | |
|Microsoft.Network/privateEndpoints| No | No | |
|Microsoft.Network/privateLinkServices| No | No |
|Microsoft.Network/publicipaddresses | No | No |[Public IP Addresses](../platform/metrics-supported.md#microsoftnetworkpublicipaddresses)|
|Microsoft.Network/trafficManagerProfiles | Yes | No | [Traffic Manager Profiles](../platform/metrics-supported.md#microsoftnetworktrafficmanagerprofiles) |
|Microsoft.OperationalInsights/workspaces| Yes | No | [Log Analytics workspaces](../platform/metrics-supported.md#microsoftoperationalinsightsworkspaces)|
|Microsoft.Peering/peerings | Yes | No | [Peerings](../platform/metrics-supported.md#microsoftpeeringpeerings) |
|Microsoft.Peering/peeringServices | Yes | No | [Peering Services](../platform/metrics-supported.md#microsoftpeeringpeeringservices) |
|Microsoft.PowerBIDedicated/capacities | No | No | [Capacities](../platform/metrics-supported.md#microsoftpowerbidedicatedcapacities) |
|Microsoft.Relay/namespaces | Yes | No | [Relays](../platform/metrics-supported.md#microsoftrelaynamespaces) |
|Microsoft.Search/searchServices | No | No | [Search services](../platform/metrics-supported.md#microsoftsearchsearchservices) |
|Microsoft.ServiceBus/namespaces | Yes | No | [Service Bus](../platform/metrics-supported.md#microsoftservicebusnamespaces) |
|Microsoft.Sql/managedInstances | No | Yes | [SQL Managed Instances](../platform/metrics-supported.md#microsoftsqlmanagedinstances) |
|Microsoft.Sql/servers/databases | No | Yes | [SQL Databases](../platform/metrics-supported.md#microsoftsqlserversdatabases) |
|Microsoft.Sql/servers/elasticPools | No | Yes | [SQL Elastic Pools](../platform/metrics-supported.md#microsoftsqlserverselasticpools) |
|Microsoft.Storage/storageAccounts |Yes | No | [Storage Accounts](../platform/metrics-supported.md#microsoftstoragestorageaccounts)|
|Microsoft.Storage/storageAccounts/blobServices | Yes| No | [Storage Accounts - Blobs](../platform/metrics-supported.md#microsoftstoragestorageaccountsblobservices) |
|Microsoft.Storage/storageAccounts/fileServices | Yes| No | [Storage Accounts - Files](../platform/metrics-supported.md#microsoftstoragestorageaccountsfileservices) |
|Microsoft.Storage/storageAccounts/queueServices | Yes| No | [Storage Accounts - Queues](../platform/metrics-supported.md#microsoftstoragestorageaccountsqueueservices) |
|Microsoft.Storage/storageAccounts/tableServices | Yes| No | [Storage Accounts - Tables](../platform/metrics-supported.md#microsoftstoragestorageaccountstableservices) |
|Microsoft.StorageCache/caches | Yes | No | |
|Microsoft.StorageSync/storageSyncServices | Yes | No | [Storage Sync Services](../platform/metrics-supported.md#microsoftstoragesyncstoragesyncservices) |
|Microsoft.StreamAnalytics/streamingjobs | Yes | No | [Stream Analytics](../platform/metrics-supported.md#microsoftstreamanalyticsstreamingjobs) |
|Microsoft.Synapse/workspaces | Yes | No | [Synapse Analytics](../platform/metrics-supported.md#microsoftsynapseworkspaces) |
|Microsoft.Synapse/workspaces/bigDataPools | Yes | No | [Synapse Analytics Apache Spark Pools](../platform/metrics-supported.md#microsoftsynapseworkspacesbigdatapools) |
|Microsoft.Synapse/workspaces/sqlPools | Yes | No | [Synapse Analytics SQL Pools](../platform/metrics-supported.md#microsoftsynapseworkspacessqlpools) |
|Microsoft.VMWareCloudSimple/virtualMachines | Yes | No | [CloudSimple Virtual Machines](../platform/metrics-supported.md#microsoftvmwarecloudsimplevirtualmachines) |
|Microsoft.Web/hostingEnvironments/multiRolePools | Yes | No | [App Service Environment Multi-Role Pools](../platform/metrics-supported.md#microsoftwebhostingenvironmentsmultirolepools)|
|Microsoft.Web/hostingEnvironments/workerPools | Yes | No | [App Service Environment Worker Pools](../platform/metrics-supported.md#microsoftwebhostingenvironmentsworkerpools)|
|Microsoft.Web/serverfarms | Yes | No | [App Service Plans](../platform/metrics-supported.md#microsoftwebserverfarms)|
|Microsoft.Web/sites | Yes | No | [App Services and Functions](../platform/metrics-supported.md#microsoftwebsites)|
|Microsoft.Web/sites/slots | Yes | No | [App Service slots](../platform/metrics-supported.md#microsoftwebsitesslots)|

<sup>1</sup> Not supported for virtual machine network metrics (Network In Total, Network Out Total, Inbound Flows, Outbound Flows, Inbound Flows Maximum Creation Rate, Outbound Flows Maximum Creation Rate) and custom metrics.

## Payload schema

> [!NOTE]
> You can also use the [common alert schema](./alerts-common-schema.md), which provides the advantage of having a single extensible and unified alert payload across all the alert services in Azure Monitor, for your webhook integrations. [Learn about the common alert schema definitions.](./alerts-common-schema-definitions.md)​


The POST operation contains the following JSON payload and schema for all near newer metric alerts when an appropriately configured [action group](../platform/action-groups.md) is used:

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

* Learn more about the new [Alerts experience](../platform/alerts-overview.md).
* Learn about [log alerts in Azure](./alerts-unified-log.md).
* Learn about [alerts in Azure](../platform/alerts-overview.md).
