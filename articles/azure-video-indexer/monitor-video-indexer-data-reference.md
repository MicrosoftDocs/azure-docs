---
title: Monitoring Azure AI Video Indexer data reference
description: Important reference material needed when you monitor Azure AI Video Indexer 
ms.topic: reference
ms.service: azure-video-indexer
ms.custom: subject-monitoring
ms.date: 04/17/2023
ms.author: inhenkel
author: itnorman
---

# Monitor Azure AI Video Indexer data reference

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

See [Monitoring Azure AI Video Indexer](monitor-video-indexer.md) for details on collecting and analyzing monitoring data for Azure AI Video Indexer.

## Metrics

Azure AI Video Indexer currently does not support any metrics monitoring.

<!-- REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
<!-- Please keep headings in this order -->

<!-- 2 options here depending on the level of extra content you have. -->

<!--------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

<!--This section lists all the automatically collected platform metrics collected for Azure AI Video Indexer.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machine | [Microsoft.Compute/virtualMachine](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachinescaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescaleset) 

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the metrics as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the metrics-supported link. For highly customized example, see [CosmosDB](../cosmos-db/monitor-cosmos-db-reference.md#metrics). They even regroup the metrics into usage type vs. resource provider and type.
-->

<!-- Example format. Mimic the setup of metrics supported, but add extra information -->

<!--### Virtual Machine metrics

Resource Provider and Type: [Microsoft.Compute/virtualMachines](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines)

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  
<!--|        |      |             |  | 

<!--### Virtual machine scale set metrics

Namespace- [Microsoft.Compute/virtualMachinesscaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescalesets) 

| Metric | Unit | Description | *TODO replace this label with other information*  |
|:-------|:-----|:------------|:------------------|
|        |      |             | Use this metric for <!-- put your specific information in here -->  
<!--|        |      |             |  |

<!-- Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric dimensions

Azure AI Video Indexer currently does not support any metrics monitoring.
<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com -->

<!--For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Azure AI Video Indexer does not have any metrics that contain dimensions.

*OR*

Azure AI Video Indexer has the following dimensions associated with its metrics.

<!-- See https://learn.microsoft.com/azure/storage/common/monitor-storage-reference#metrics-dimensions for an example. Part is copied below. -->

<!--**--------------EXAMPLE format when you have dimensions------------------**

Azure Storage supports following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **BlobType** | The type of blob for Blob metrics only. The supported values are **BlockBlob**, **PageBlob**, and **Azure Data Lake Storage**. Append blobs are included in **BlockBlob**. |
| **BlobTier** | Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. See more in [Azure Storage blob tier](/azure/storage/blobs/storage-blob-storage-tiers). The supported values include: <br/> <li>**Hot**: Hot tier</li> <li>**Cool**: Cool tier</li> <li>**Archive**: Archive tier</li> <li>**Premium**: Premium tier for block blob</li> <li>**P4/P6/P10/P15/P20/P30/P40/P50/P60**: Tier types for premium page blob</li> <li>**Standard**: Tier type for standard page Blob</li> <li>**Untiered**: Tier type for general purpose v1 storage account</li> |
| **GeoType** | Transaction from Primary or Secondary cluster. The available values include **Primary** and **Secondary**. It applies to Read Access Geo Redundant Storage(RA-GRS) when reading objects from secondary tenant. | -->

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for Azure AI Video Indexer.

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

<!--------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

<!--This section lists all the resource log category types collected for Azure AI Video Indexer.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

<!--### Web Sites

Resource Provider and Type: [Microsoft.videoindexer/accounts](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  -->

### Azure AI Video Indexer

Resource Provider and Type: [Microsoft.VideoIndexer/accounts](/azure/azure-monitor/platform/resource-logs-categories#microsoftvideoindexeraccounts)

| Category | Display Name | Additional information |
|:---------|:-------------|------------------|
| VIAudit   | Azure AI Video Indexer Audit Logs | Logs are produced from both the [Azure AI Video Indexer website](https://www.videoindexer.ai/) and the REST API. |
| IndexingLogs | Indexing Logs | Azure AI Video Indexer indexing logs to monitor all files uploads, indexing and reindexing jobs. |

<!-- --------------**END Examples** ------------- -->

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure AI Video Indexer and available for query by Log Analytics. 

<!--------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

|Resource Type | Notes |
|-------|-----|
| [Azure AI Video Indexer](/azure/azure-monitor/reference/tables/tables-resourcetype#azure-video-indexer) | |

<!----------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  List out your tables adding additional information on what each table is for. Individually link to each table using the table name.  For example, link to [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics).  

NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the automatically generated list. You can group these sections however you want provided you include the proper links back to the proper tables. 
-->

### Azure AI Video Indexer

| Table |  Description | Additional information  |
|:---------|:-------------|------------------|
| [VIAudit](/azure/azure-monitor/reference/tables/tables-resourcetype#azure-video-indexer)<!-- (S/azure/azure-monitor/reference/tables/viaudit)-->   | <!-- description copied from previous link --> Events produced using the Azure AI Video Indexer [website](https://aka.ms/VIportal) or the [REST API portal](https://aka.ms/vi-dev-portal). |  |
|VIIndexing| Events produced using the Azure AI Video Indexer [upload](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) and [re-index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) APIs. |
<!--| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | <!-- description copied from previous link --> 
<!--Metric data emitted by Azure services that measure their health and performance.    | *TODO other important information about this type |
|  etc.               |                              |                                                   |  

<!--### Virtual Machine Scale Sets

| Table |  Description | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| [ADAssessmentRecommendation](/azure/azure-monitor/reference/tables/adassessmentrecommendation)   | <!-- description copied from previous link -->
<!-- Recommendations generated by AD assessments that are started through a scheduled task. When you schedule the assessment it runs by default every 7 days and upload the data into Azure Log Analytics | *TODO other important information about this type |
| [ADReplicationResult](/azure/azure-monitor/reference/tables/adreplicationresult) | <!-- description copied from previous link --> 
<!--The AD Replication Status solution regularly monitors your Active Directory environment for any replication failures.    | *TODO other important information about this type |
|  etc.               |                              |                                                   | 

<!-- Add extra information if required -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

<!-- --------------**END EXAMPLES** -------------

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

<!-- Azure AI Video Indexer uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |-->

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to Azure AI Video Indexer that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
|Generate_AccessToken | |
|Accounts_Update | |
|Write tags | |
|Create or update resource diagnostic setting| |
|Delete resource diagnostic setting|

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by Azure AI Video Indexer

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

#### Audit schema

```json
{
    "time": "2022-03-22T10:59:39.5596929Z",
    "resourceId": "/SUBSCRIPTIONS/602a61eb-c111-43c0-8323-74825230a47d/RESOURCEGROUPS/VI-RESOURCEGROUP/PROVIDERS/MICROSOFT.VIDEOINDEXER/ACCOUNTS/VIDEOINDEXERACCOUNT",
    "operationName": "Get-Video-Thumbnail",
    "category": "Audit",
    "location": "westus2",
    "durationMs": "192",
    "resultSignature": "200",
    "resultType": "Success",
    "resultDescription": "Get Video Thumbnail",
    "correlationId": "33473fc3-bcbc-4d47-84cc-9fba2f3e9faa",
    "callerIpAddress": "46.*****",
    "operationVersion": "Operations",
    "identity": {
      "externalUserId": "4704F34286364F2*****",
      "upn": "alias@outlook.com",
      "claims": { "permission": "Reader", "scope": "Account" }
    },
    "properties": {
      "accountName": "videoIndexerAccoount",
      "accountId": "8878b584-d8a0-4752-908c-00d6e5597f55",
      "videoId": "1e2ddfdd77"
    }
  }
  ```

#### Indexing schema

```json
{
    "time": "2022-09-28T09:41:08.6216252Z",
    "resourceId": "/SUBSCRIPTIONS/{SubscriptionId}/RESOURCEGROUPS/{ResourceGroup}/PROVIDERS/MICROSOFT.VIDEOINDEXER/ACCOUNTS/MY-VI-ACCOUNT",
    "operationName": "UploadStarted",
    "category": "IndexingLogs",
    "correlationId": "5cc9a3ea-126b-4f53-a4b5-24b1a5fb9736",
    "resultType": "Success",
    "location": "eastus",
    "operationVersion": "2.0",
    "durationMs": "0",
    "identity": {
        "upn": "my-email@microsoft.com",
        "claims": null
    },
    "properties": {
        "accountName": "my-vi-account",
        "accountId": "6961331d-16d3-413a-8f90-f86a5cabf3ef",
        "videoId": "46b91bc012",
        "indexing": {
            "Language": "en-US",
            "Privacy": "Private",
            "Partition": null,
            "PersonModelId": null,
            "LinguisticModelId": null,
            "AssetId": null,
            "IndexingPreset": "Default",
            "StreamingPreset": "Default",
            "Description": null,
            "Priority": null,
            "ExternalId": null,
            "Filename": "1 Second Video 1.mp4",
            "AnimationModelId": null,
            "BrandsCategories": null,
            "CustomLanguages": "en-US,ar-BH,hi-IN,es-MX",
            "ExcludedAIs": "Faces",
            "LogoGroupId": "ea9d154d-0845-456c-857e-1c9d5d925d95"
        }
    }
}
  ```

## Next steps

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure AI Video Indexer](monitor-video-indexer.md) for a description of monitoring Azure AI Video Indexer.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
