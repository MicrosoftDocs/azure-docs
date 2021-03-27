---
title: Azure Monitor Troubleshooting logs
description: Use Azure Monitor to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases, which often rely upon searching over high volume of data for specific insights.
author: osalzberg
ms.author: bwren
ms.reviewer: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 12/29/2020

---

# Azure Monitor Troubleshooting logs (Preview)

Troubleshooting Logs is a new flavor of logs that would be offered in Azure Monitor Logs side by side to the existing monitoring and analytics logs. Troubleshooting logs are relevant for container logs and application traces where customers send large volume of verbose logs, not for analytics but to be able to troubleshoot their systems. Such logs will be much cheaper to ingest while their queries will be less performant and not available for alerting. Azure Monitor Logs is becoming a comprehensive log solution that supports all kind of logs using the same query language, experience, and the ability to cross-correlate them. There is no need for a customer to operate several different log solutions to monitor their applications and infrastructure.

Customers will be able to mark their AppTraces and ContainerLog/ContainerLogV2 tables as troubleshooting logs. By default, these tables would remain as there are today. Current troubleshooting logs performance settings are:
* Max query time range of two days. Queries that involve troubleshooting logs that have larger time span will be adjusted for two days.
* Up to two concurrent queries per user will be allowed for these tables. Dashboards that contain many parts that query these logs will load slower.
* Alerts will not support queries over troubleshooting logs.
* [Purge](https://docs.microsoft.com/rest/api/loganalytics/workspacepurge/purge) command will not be available for this data.

## Preview terms
During the first half of 2021, Troubleshooting logs will be offered as a private preview. The provisional price for these logs will be $0.50/GB with four days of retention included. Customers can extend the retention for these tables at the standard $0.10/GB/month cost. During the first period of the preview, until May 2021, no charging will be made for these logs.

## Troubleshoot and query your code or configuration issues
Use Azure Monitor Troubleshooting Logs to fetch your records and investigate problems and issues in a simpler and cheaper way using KQL.
Troubleshooting Logs decrees your charges by giving you basic capabilities for troubleshooting.

> [!NOTE]
>* By default, the tables inherits the workspace retention. To avoid additional charges, it is recommended to change these tables retention. [Click here to learn how to change table retention](https://docs.microsoft.com//azure/azure-monitor/platform/manage-cost-storage).
>* This feature is available only for subscriptions that were added to the feature allow-list.

## Turn on Troubleshooting Logs on your tables

To turn on Troubleshooting Logs in your workspace, you need to use the following API call.
```rest
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2020-10-01
```

## Check if the Troubleshooting logs feature is enabled for a given table
To check whether the Troubleshooting Log is enabled for a given table, you can use the following API call.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2020-10-01

Response: 
"properties": {
          "retentionInDays": 30,
          "isTroubleshootingAllowed": true,
          "isTroubleshootEnabled": true,
          "lastTroubleshootDate": "Thu, 19 Nov 2020 07:40:51 GMT"
        },
        "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/{tableName}",
        "name": " {tableName}"

```
## Check if the Troubleshooting logs feature is enabled for all of the tables in a workspace
To check which tables have the Troubleshooting Log enabled, you can use the following API call.

```http
GET "https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables?api-version=2020-10-01"

Response: 
{
          "properties": {
            "retentionInDays": 30,
            "isTroubleshootingAllowed": true,
            "isTroubleshootEnabled": true,
            "lastTroubleshootDate": "Thu, 19 Nov 2020 07:40:51 GMT"
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table1",
          "name": "table1"
        },
        {
          "properties": {
            "retentionInDays": 7,
            "isTroubleshootingAllowed": true
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table2",
          "name": "table2"
        },
        {
          "properties": {
            "retentionInDays": 7,
            "isTroubleshootingAllowed": false
          },
          "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.operationalinsights/workspaces/{workspaceName}/tables/table3",
          "name": "table3"
        }
```
## Turn off Troubleshooting Logs on your tables

To turn off Troubleshooting Logs in your workspace, you need to use the following API call.
```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2020-10-01

(With body in the form of a GET single table request response)

Response:

{
        "properties": {
          "retentionInDays": 40,
          "isTroubleshootingAllowed": true,
          "isTroubleshootEnabled": false
        },
        "id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}",
        "name": "{tableName}"
      }
```
>[!TIP]
>* You can use any REST API tool to run the commands. [Read More](https://docs.microsoft.com/rest/api/azure/)
>* You need to use the Bearer token for authentication. [Read More](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx)

>[!NOTE]
>* The "isTroubleshootingAllowed" flag – describes if the table is allowed in the service
>* The "isTroubleshootEnabled" indicates if the feature is enabled for the table - can be switched on or off (true or false)
>* When disabling the "isTroubleshootEnabled" flag for a specific table, re-enabling it is possible only one week after the prior enable date.
>* Currently this is supported only for tables under (some other SKUs will also be supported in the future) - [Read more about pricing](https://docs.microsoft.com/services-hub/health/azure_pricing).

## Schema for Container logs (ContainerLogV2)
As part of Troubleshooting Logs, Azure Monitor for containers is now in Private Preview of new schema for Container logs called ContainerLogV2. As part of this schema, there new fields to make common queries to view AKS (Azure Kubernetes Service) data.

>[!NOTE]
>The new fields are:
>* ContainerName
>* PodName
>* PodNamespace

## ContainerLogV2 schema
```kusto
 Computer: string,
 ContainerId: string,
 ContainerName: string,
 PodName: string,
 PodNamespace: string,
 LogMessage: dynamic,
 LogSource: string,
 TimeGenerated: datetime
```
## Enable ContainerLogV2 schema
1. Customers can enable ContainerLogV2 schema at cluster level. 
2. To enable ContainerLogV2 schema, configure the cluster's configmap, Learn more about [configmap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) in Kubernetes documentation & [Azure Monitor configmap](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-agent-config#configmap-file-settings-overview).
3. Follow the instructions accordingly when configuring an existing ConfigMap or using a new one.
### Configuring an existing ConfigMap
* When configuring an existing ConfigMap, we have to append the following section in your existing ConfigMap yaml file:
```yml
[log_collection_settings.schema]
          # In the absense of this configmap, default value for containerlog_schema_version is "v1"
          # Supported values for this setting are "v1","v2"
          # See documentation for benefits of v2 schema over v1 schema before opting for "v2" schema
          containerlog_schema_version = "v2"
```
### Configuring a new ConfigMap
* Download the new ConfigMap from [here](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).
* For new downloaded configmapdefault the value for containerlog_schema_version is "v1"
* Update the "containerlog_schema_version = "v2""

```yml
[log_collection_settings.schema]
# In the absense of this configmap, default value for containerlog_schema_version is "v1"
# Supported values for this setting are "v1","v2"
# See documentation for benefits of v2 schema over v1 schema before opting for "v2" schema
containerlog_schema_version = "v2"
```
* Once you have finished configuring the configmap Run the following kubectl command: kubectl apply -f `<configname>`
>[!TIP]
>Example: kubectl apply -f container-azm-ms-agentconfig.yaml.

>[!NOTE]
>* The configuration change can take a few minutes to complete before taking effect, all omsagent pods in the cluster will restart. 
>* The restart is a rolling restart for all omsagent pods, it will not restart all of them at the same time.
## Next steps
* [Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)
* [Rest API](https://docs.microsoft.com/rest/api/azure/)