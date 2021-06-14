---
title: Scenarios and best practices for monitoring Azure Blob Storage
description: Learn best practice guidelines and how to them when using metrics and logs to monitor your Azure Blob Storage. 
author: normesta
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.author: normesta
ms.date: 05/28/2021
ms.custom: "monitoring"
---

# Scenarios and best practices for monitoring Azure Blob Storage

Intro goes here

## Monitor use and capacity

Tasks for determining use and capacity

#### Identify storage accounts with no or low use

Monitor for accounts that have low or now traffic. 

- Lead with metrics  - Capacity, ingress, egress. how many operations how much activity are we seeing in accounts. 

- Showcase storage insights for this one. Borrow whatever you can from that article and try a few things out.

- Use logs to drill in a bit deeper on things like use etc.

- Log analytic query to find accounts that have had below a certain threshold of requests against it.

- Log analytic query to identify accounts that have little or no blob data in them. 

#### Monitor the use of a container

This scenario is about clearly identifying container use. For example, ISV partners might build solutions that use blob storage to host data. For example, container A for customer A and container B for customer B. All data stored in separate container. If they want to charge their customers for data use, they need to clearly identify how much data is being used by container. 

Another way to phrase this scenario is that customers want effective ways to meter costs in their Azure data estate. They want to identify costs and account for them at a granular level. For example: tagging, how much data is being queried or consumed by other departments. Keeping track of costs at folder or container level.

This is the solution with inventory - [Calculate blob count and total size per container using Azure Storage inventory](calculate-blob-count-size.md).

There's also a PowerShell script that does this sort of calculation. 

## Monitor activity

Tasks for monitoring account activity

#### Audit activities for Blob Storage

This is about compliance auditing. Compliance auditing companies will often time be hired to audit a companies cloud platform based on controls. A popular control that relates to this scenario is about "access management". We need to use this section to discuss both data plane and control plane operations audit. The key elements of logs - who why what when.

Need examples here of specific types of queries. What to put here?

#### Analyze traffic per source

Determine traffic by bytes or by operation from a source. Source could be any of these things:

Azure Active Directory (Azure AD) identity

- Service principal
- AAD user-assigned managed identity
- AAD system-assigned managed identity

Anonymous identity via shared key or SAS authorization

- IP address
- Agent

An IP address can be shared by multiple users or applications. An agent could also be used. Lay out those challenges as well.

##### Identify all sources

// log analytic query to return all sources that have made requests

// Guidance here for more clearly identifying sources. For example - translating IDs to UPNs etc.

    |Auth method| log entry|
    |--|--|
    | AAD user | RequesterUserName|
    | AAD service principal | RequesterUpn |
    | AAD user-assigned managed identity | ? |
    | AAD system-assigned managed identity | ? |
    | Shared Key | ? |
    | SAS token | ? |

Provide guidance for converting values to find identity.

##### Identity bytes read or written by source

// Log Analytic query to return byte count for each source
// Metrics?

##### Identify operations by source

// Log Analytic query to return operations for each user.
// Metric?

##### Other scenarios for traffic by source?

// Content goes here.

## Optimize cost

#### Optimize cost for infrequent queries

This is a scenario that applies in cases where there may be an annual compliance audit. For a massive number of transactions, the cost of using Log Analytics might be high relative to just archiving to storage and using other query techniques. Log Analytics makes sense when customers want to leverage rich capabilities on Log Analytics.
One way to reduce the cost of querying data is to archive logs to a storage account and then query logs in a Synapse workspace or use Query acceleration.

1. Archive logs to storage account. See [Creating a diagnostic setting](monitor-blob-storage.md#creating-a-diagnostic-setting).

2. Consider the use of tiering to move data that you don't frequently use to colder storage. You might also even consider archive storage and then rehydrate that to hotter tier. Make sure to mention considerations around query cost and rehydration cost as well.

##### Query Acceleration

To learn more about how to set up query acceleration, see [Filter data by using Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration-how-to.md).

Here's an example for checking total blob size

```powershell
Function Get-QueryCsv($ctx, $container, $blob, $query, $hasheaders) {
    $tempfile = New-TemporaryFile
    $informat = New-AzStorageBlobQueryConfig -AsCsv -HasHeader:$hasheaders
    Get-AzStorageBlobQueryResult -Context $ctx -Container $container -Blob $blob -InputTextConfiguration $informat -OutputTextConfiguration (New-AzStorageBlobQueryConfig -AsCsv -HasHeader) -ResultFile $tempfile.FullName -QueryString $query -Force
    Get-Content $tempfile.FullName
}
 
$query = [string]::Format("SELECT SUM(CAST(_4 AS INT)) FROM BlobStorage where SUBSTRING(_1, 0, {1}) = '{2}'", $targetContainer.Length, $targetContainer.Length, $targetContainer)
Get-QueryCsv $ctx $inventoryContainer $blob $query $true

```

Here's an example for getting total blob count:

```powershell
$query = [string]::Format("SELECT COUNT(*) FROM BlobStorage where SUBSTRING(_1, 0, {1}) = '{2}'", $targetContainer.Length, $targetContainer.Length, $targetContainer)
Get-QueryCsv $ctx $inventoryContainer $blob $query $true

```

##### Azure Synapse

This option is available only for accounts that have the hierarchical namespace feature enabled on them.

1. Create and configure a Synapse workspace. See [Quickstart: Create a Synapse workspace](../../azure/synapse-analytics/quickstart-create-workspace.md).

2. Query logs. See [Query JSON files using serverless SQL pool in Azure Synapse Analytics](../../synapse-analytics/sql/query-json-files.md).

   Here's an example:

   ```sql
    select
        JSON_VALUE(doc, '$.time') AS time,
        JSON_VALUE(doc, '$.properties.accountName') AS accountName,
        JSON_VALUE(doc, '$.identity.type') AS identityType,    
        JSON_VALUE(doc, '$.identity.requester.objectId') AS requesterObjectId,
        JSON_VALUE(doc, '$.operationName') AS operationName,
        JSON_VALUE(doc, '$.callerIpAddress') AS callerIpAddress,
        JSON_VALUE(doc, '$.uri') AS uri
        doc
    from openrowset(
            bulk 'https://demo2uswest4log.blob.core.windows.net/insights-logs-storageread/resourceId=/subscriptions/d151d0d8-eee6-40fb-91a2-47ec72d2e8e5/resourceGroups/mytestrp/providers/Microsoft.Storage/storageAccounts/demo2uswest/blobServices/default/y=2021/m=03/d=19/h=*/m=*/PT1H.json',
            format = 'csv', fieldterminator ='0x0b', fieldquote = '0x0b'
        ) with (doc nvarchar(max)) as rows
    order by JSON_VALUE(doc, '$.time') desc

   ```

## See also

- [Monitoring Azure Blob Storage](monitor-blob-storage.md).

  

