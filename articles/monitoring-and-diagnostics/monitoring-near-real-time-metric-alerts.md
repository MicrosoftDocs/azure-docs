---
title: Supported resources for metric alerts in Azure Monitor
description: Reference on support metrics and logs for metric alerts in Azure Monitor
author: snehithm
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/29/2018
ms.author: snmuvva
ms.component: alerts
---

# Supported resources for metric alerts in Azure Monitor

Azure Monitor now supports a [new metric alert type](monitoring-overview-unified-alerts.md) which has significant benefits over the older [classic metric alerts](insights-alerts-portal.md). Metrics are available for [large list of Azure services](monitoring-supported-metrics.md). The newer alerts support a (growing) subset of the resource types. This article lists that subset.

You can also use newer metric alerts on popular Log Analytics logs extracted as metrics as part of Metrics from Logs 
- [Performance counters](../log-analytics/log-analytics-data-sources-performance-counters.md) for Windows & Linux machines
- [Heartbeat records for Agent Health](../operations-management-suite/oms-solution-agenthealth.md)
- [Update management](../operations-management-suite/oms-solution-update-management.md) records
- [Event data](../log-analytics/log-analytics-data-sources-windows-events.md) logs
 
> [!NOTE]
> Specific metric and/or dimension will only be shown if data for it exists in chosen period. These metrics are available for customers with Azure Log Analytics workspaces in East US, West Central US and West Europe. Metrics from Log Analytics is currently in public preview and subject to changes.

## Portal, PowerShell, CLI, REST support
Currently, you can create newer metric alerts only in the Azure portal, [REST API](https://docs.microsoft.com/rest/api/monitor/metricalerts/createorupdate) or [Resource Manager Templates](monitoring-create-metric-alerts-with-templates.md). Support for configuring newer alerts  using PowerShell and Azure CLI versions 2.0 and higher is coming soon.

## Metrics and Dimensions Supported
Newer metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. All supported metrics along with applicable dimensions can be explored and visualized from [Azure Monitor - Metrics Explorer](monitoring-metric-charts.md).

Here's the full list of Azure monitor metric sources supported by the newer alerts:

|Resource type  |Dimensions Supported  | Metrics Available|
|---------|---------|----------------|
|Microsoft.ApiManagement/service     | Yes        | [API Management](monitoring-supported-metrics.md#microsoftapimanagementservice)|
|Microsoft.Automation/automationAccounts     |     Yes   | [Automation Accounts](monitoring-supported-metrics.md#microsoftautomationautomationaccounts)|
|Microsoft.Batch/batchAccounts | N/A| [Batch Accounts](monitoring-supported-metrics.md#microsoftbatchbatchaccounts)|
|Microsoft.Cache/Redis     |    N/A     |[Redis Cache](monitoring-supported-metrics.md#microsoftcacheredis)|
|Microsoft.CognitiveServices/accounts     |    N/A     | [Cognitive Services](monitoring-supported-metrics.md#microsoftcognitiveservicesaccounts)|
|Microsoft.Compute/virtualMachines     |    N/A     | [Virtual Machines](monitoring-supported-metrics.md#microsoftcomputevirtualmachines)|
|Microsoft.Compute/virtualMachineScaleSets     |   N/A      |[Virtual Machine scale sets](monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesets)|
|Microsoft.ContainerInstance/containerGroups | Yes| [Container groups](monitoring-supported-metrics.md#microsoftcontainerinstancecontainergroups)|
|Microsoft.ContainerService/managedClusters | Yes | [Managed Clusters](monitoring-supported-metrics.md#microsoftcontainerservicemanagedclusters)|
|Microsoft.DataFactory/datafactories| Yes| [Data Factories V1](monitoring-supported-metrics.md#microsoftdatafactorydatafactories)|
|Microsoft.DataFactory/factories     |   Yes     |[Data Factories V2](monitoring-supported-metrics.md#microsoftdatafactoryfactories)|
|Microsoft.DBforMySQL/servers     |   N/A      |[DB for MySQL](monitoring-supported-metrics.md#microsoftdbformysqlservers)|
|Microsoft.DBforPostgreSQL/servers     |    N/A     | [DB for PostgreSQL](monitoring-supported-metrics.md#microsoftdbforpostgresqlservers)|
|Microsoft.EventHub/namespaces     |  Yes      |[Event Hubs](monitoring-supported-metrics.md#microsofteventhubnamespaces)|
|Microsoft.KeyVault/vaults| No | [Vaults](monitoring-supported-metrics.md#microsoftkeyvaultvaults)|
|Microsoft.Logic/workflows     |     N/A    |[Logic Apps](monitoring-supported-metrics.md#microsoftlogicworkflows) |
|Microsoft.Network/applicationGateways     |    N/A     | [Application Gateways](monitoring-supported-metrics.md#microsoftnetworkapplicationgateways) |
|Microsoft.Network/expressRouteCircuits | N/A |  [Express Route Circuits](monitoring-supported-metrics.md#microsoftnetworkexpressroutecircuits) |
|Microsoft.Network/dnsZones | N/A| [DNS Zones](monitoring-supported-metrics.md#microsoftnetworkdnszones) |
|Microsoft.Network/loadBalancers (only for Standard SKUs)| Yes| [Load Balancers](monitoring-supported-metrics.md#microsoftnetworkloadbalancers) |
|Microsoft.Network/publicipaddresses     |  N/A       |[Public IP Addreses](monitoring-supported-metrics.md#microsoftnetworkpublicipaddresses)|
|Microsoft.PowerBIDedicated/capacities | N/A | [Capacities](monitoring-supported-metrics.md#microsoftpowerbidedicatedcapacities)|
|Microsoft.Network/trafficManagerProfiles | Yes | [Traffic Manager Profiles](monitoring-supported-metrics.md#microsoftnetworktrafficmanagerprofiles) |
|Microsoft.Search/searchServices     |   N/A      |[Search services](monitoring-supported-metrics.md#microsoftsearchsearchservices)|
|Microsoft.ServiceBus/namespaces     |  Yes       |[Service Bus](monitoring-supported-metrics.md#microsoftservicebusnamespaces)|
|Microsoft.Storage/storageAccounts     |    Yes     | [Storage Accounts](monitoring-supported-metrics.md#microsoftstoragestorageaccounts)|
|Microsoft.Storage/storageAccounts/services     |     Yes    | [Blob Services](monitoring-supported-metrics.md#microsoftstoragestorageaccountsblobservices), [File Services](monitoring-supported-metrics.md#microsoftstoragestorageaccountsfileservices), [Queue Services](monitoring-supported-metrics.md#microsoftstoragestorageaccountsqueueservices) and [Table Services](monitoring-supported-metrics.md#microsoftstoragestorageaccountstableservices)|
|Microsoft.StreamAnalytics/streamingjobs     |  N/A       | [Stream Analytics](monitoring-supported-metrics.md#microsoftstreamanalyticsstreamingjobs)|
| Microsoft.Web/serverfarms | Yes | [App Service Plans](monitoring-supported-metrics.md#microsoftwebserverfarms)  |
| Microsoft.Web/sites | Yes | [App Services](monitoring-supported-metrics.md#microsoftwebsites-excluding-functions) and [Functions](monitoring-supported-metrics.md#microsoftwebsites-functions)|
| Microsoft.Web/sites/slots | Yes | [App Service slots](monitoring-supported-metrics.md#microsoftwebsitesslots)|
|Microsoft.OperationalInsights/workspaces| Yes|[Log Analytics workspaces](monitoring-supported-metrics.md#microsoftoperationalinsightsworkspaces)|



## Payload schema

The POST operation contains the following JSON payload and schema for all near newer metric alerts when an appropriately configured [action group](monitoring-action-groups.md) is used:

```json
{"schemaId":"AzureMonitorMetricAlert","data":
    {
    "version": "2.0",
    "status": "Activated",
    "context": {
    "timestamp": "2018-02-28T10:44:10.1714014Z",
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/microsoft.insights/metricAlerts/StorageCheck",
    "name": "StorageCheck",
    "description": "",
    "conditionType": "SingleResourceMultipleMetricCriteria",
    "condition": {
      "windowSize": "PT5M",
      "allOf": [
        {
          "metricName": "Transactions",
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
          "metricValue": 1.0
        },
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

* Learn more about the new [Alerts experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure](monitor-alerts-unified-log.md).
* Learn about [alerts in Azure](monitoring-overview-alerts.md).
