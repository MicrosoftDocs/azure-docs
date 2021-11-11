---
title: Monitoring Azure Monitor data reference 
description: Important reference material needed when you monitor Azure Monitor alerts and action groups 
ms.topic: reference
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.subservice: alerts
ms.custom: subject-monitoring
ms.date: 11/01/2021
---
<!-- VERSION 2.3
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring [servicename]" article for the service. -->

<!-- IMPORTANT STEP 1.  Do a search and replace of [TODO-replace-with-service-name] with the name of your service. That will make the template easier to read -->

# Monitoring Azure Monitor alerts data reference

Azure Monitor is the main system to monitor all resource providers.  In addition some Azure Monitor resources also have include monitoring themselves. This article is a reference for those resources.  

See [Monitoring Azure Monitor](monitor-azure-monitor.md) for details on collecting and analyzing monitoring data for Azure monitor resources that support such monitoring. 

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Monitor.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics | Details|
|-------|-----|------|
| Azure Monitor autoscale | [Microsoft.insights/autoscalesettings](/azure/azure-monitor/essentials/metrics-supported#microsoftinsightsautoscalesettings) | collected by default |
| Log Analytics Metrics to Logs namespaces| [Microsoft.Insights/Components](/azure/azure-monitor/platform/metrics-supported##microsoftinsightscomponents)| Only collected when your use the Metrics to Logs feature



--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/monitor-cosmos-db-reference#metrics). They even regroup the metrics into usage type vs. resource provider and type.
-->

<!-- Example format. Mimic the setup of metrics supported, but add extra information -->

### Virtual Machine metrics

Resource Provider and Type: [Microsoft.Compute/virtualMachines](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines)

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |

### Virtual machine scale set metrics

Namespace- [Microsoft.Compute/virtualMachinesscaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescalesets) 

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  |
|        |      |             |  |


<!-- Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).



## Metric Dimensions

<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com -->

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).


[TODO-replace-with-service-name] does not have any metrics that contain dimensions.

*OR*

[TODO-replace-with-service-name] has the following dimensions associated with its metrics.

<!-- See https://docs.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. |

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for [TODO-replace-with-service-name]. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the resource log category types collected for [TODO-replace-with-service-name].  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Web Sites

Resource Provider and Type: [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

### Web Site Slots

Resource Provider and Type: [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

--------------**END Examples** -------------

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to [TODO-replace-with-service-name] and available for query by Log Analytics. 

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

|Resource Type | Notes |
|-------|-----|
| [Virtual Machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  List out your tables adding additional information on what each table is for. Individually link to each table using the table name.  For example, link to [AzureMetrics](https://docs.microsoft.com/azure/azure-monitor/reference/tables/azuremetrics).  

NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the automatically generated list. You can group these sections however you want provided you include the proper links back to the proper tables. 
-->

### Virtual Machines

| Table |  Description | *TODO replace this label with proper title for your additional information*  |
|:---------|:-------------|------------------|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)   | <!-- description copied from previous link --> Entries from the Azure Activity log that provides insight into any subscription-level or management group level events that have occurred in Azure. | *TODO other important information about this type |
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | <!-- description copied from previous link --> Metric data emitted by Azure services that measure their health and performance.    | *TODO other important information about this type |
|  etc.               |                              |                                                   |  

### Virtual Machine Scale Sets

| Table |  Description | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| [ADAssessmentRecommendation](/azure/azure-monitor/reference/tables/adassessmentrecommendation)   | <!-- description copied from previous link --> Recommendations generated by AD assessments that are started through a scheduled task. When you schedule the assessment it runs by default every 7 days and upload the data into Azure Log Analytics | *TODO other important information about this type |
| [ADReplicationResult](/azure/azure-monitor/reference/tables/adreplicationresult) | <!-- description copied from previous link --> The AD Replication Status solution regularly monitors your Active Directory environment for any replication failures.    | *TODO other important information about this type |
|  etc.               |                              |                                                   |  

<!-- Add extra information if required -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

--------------**END EXAMPLES** -------------
### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

[TODO-replace-with-service-name] uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to [TODO-replace-with-service-name] that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following jason examples demonstrate the how the json for Azure Monitor action group events.

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

### Create Action Group
```json
{
    "authorization": {
        "action": "microsoft.insights/actionGroups/write",
        "scope": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc"
    },
    "caller": "duke.kamstra@ieee.org",
    "channels": "Operation",
    "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/04ebb17f-c9d2-426e-881f-8fd503332aac/",
        "iat": "1627074914",
        "nbf": "1627074914",
        "exp": "1627078814",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "AUQAu/8TAAAAyZJhgackCVdLETN5UafFt95J8/bC1SP+tBFMusYZ3Z4PBQRZUZ4SmEkWlDevT4p7Wtr4e/R+uksbfixGGQumxw==",
        "altsecid": "1:live.com:00037FFE809E290F",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
        "appid": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "duke.kamstra@ieee.org",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Kamstra",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Duke",
        "groups": "d734c6d5-b506-4b39-8992-88fd979076eb",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "live.com",
        "ipaddr": "73.254.142.52",
        "name": "Duke Kamstra",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "f19e58c4-5bfa-4ac6-8e75-9823bbb1ea0a",
        "puid": "1003000086500F96",
        "rh": "0.AVgAf7HrBNLJbkKIH4_VAzMqrINAS8SwO8FJtH2XTlPL3zxYAFQ.",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "SzEgbtESOKM8YsOx9t49Ds-L2yCyUR-hpIDinBsS-hk",
        "http://schemas.microsoft.com/identity/claims/tenantid": "04ebb17f-c9d2-426e-881f-8fd503332aac",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "live.com#duke.kamstra@ieee.org",
        "uti": "KuRF5PX4qkyvxJQOXwZ2AA",
        "ver": "1.0",
        "wids": "62e90394-69f5-4237-9190-012177145e10",
        "xms_tcdt": "1373393473"
    },
    "correlationId": "74d253d8-bd5a-4e8d-a38e-5a52b173b7bd",
    "description": "",
    "eventDataId": "0e9bc114-dcdb-4d2d-b1ea-d3f45a4d32ea",
    "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:21:22.9871449Z",
    "id": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/0e9bc114-dcdb-4d2d-b1ea-d3f45a4d32ea/ticks/637626720829871449",
    "level": "Informational",
    "operationId": "74d253d8-bd5a-4e8d-a38e-5a52b173b7bd",
    "operationName": {
        "value": "microsoft.insights/actionGroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "DUKEK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actionGroups",
        "localizedValue": "microsoft.insights/actionGroups"
    },
    "resourceId": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "Created",
        "localizedValue": "Created (HTTP Status Code: 201)"
    },
    "submissionTimestamp": "2021-07-23T21:22:22.1634251Z",
    "subscriptionId": "52c65f65-0518-4d37-9719-7dbbfc68c57a",
    "tenantId": "04ebb17f-c9d2-426e-881f-8fd503332aac",
    "properties": {
        "statusCode": "Created",
        "serviceRequestId": "33658bb5-fc62-4e40-92e8-8b1f16f649bb",
        "eventCategory": "Administrative",
        "entity": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
        "message": "microsoft.insights/actionGroups/write",
        "hierarchy": "52c65f65-0518-4d37-9719-7dbbfc68c57a"
    },
    "relatedEvents": []
}

```

```json

```

```json

```

```json

```

### Unsubscribe from action group
```json
{
    "caller": "",
    "channels": "Operation",
    "claims": {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "4252137109",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": ""
    },
    "correlationId": "e039f06d-c0d1-47ac-b594-89239101c4d0",
    "description": "User with phone number:4252137109 has unsubscribed from action group:TestingLogginc, Action:DukePhone_-SMSAction-",
    "eventDataId": "789d0b03-2a2f-40cf-b223-d228abb5d2ed",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:31:47.1537759Z",
    "id": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/789d0b03-2a2f-40cf-b223-d228abb5d2ed/ticks/637626727071537759",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "microsoft.insights/actiongroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "DUKEK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actiongroups",
        "localizedValue": "microsoft.insights/actiongroups"
    },
    "resourceId": "/subscriptions/52c65f65-0518-4d37-9719-7dbbfc68c57a/resourceGroups/DUKEK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "Updated",
        "localizedValue": "Updated"
    },
    "submissionTimestamp": "2021-07-23T21:31:47.1537759Z",
    "subscriptionId": "52c65f65-0518-4d37-9719-7dbbfc68c57a",
    "tenantId": "",
    "properties": {},
    "relatedEvents": []
}
```



## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure [TODO-replace-with-service-name]](monitor-service-name.md) for a description of monitoring Azure [TODO-replace-with-service-name].
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.