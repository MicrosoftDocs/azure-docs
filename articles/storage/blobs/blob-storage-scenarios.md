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

Use storage insights because it provides you with a unified view of all of your storage accounts. This is different than the storage account-specific view that you get when you use metrics from the account menu itself. Point to guidance for storage insights.

A great way to determine use is to scan for transaction volume and capacity.

##### Transactions

Line all of them up and quickly see transactions in the overview page. If you see transactions below a certain threshold, you might deem the account has having low or no use. You can investigate the nature of transactions by clicking the account link to see transaction by storage account type. You can adjust the time frame to any thing you want. 

If you see some small number of transactions and want to know what those are and who is performing the transaction ...

You can look at what API was used in the "Transactions by API name" if you want. Some other ways to identity the nature of transactions is:

You can open up the transaction chart and modify it to show a separate line for ingress and a separate line for egress. This helps you figure out whether data is coming in or out.

You can use metrics to identity the nature of a transaction, but you'll have to look at logs to identity the exact content that was read, uploaded, or downloaded, and from what source this occurred. Therefore, zoom into spikes of activity and use that date or date range to query logs. These can be hints as to what is happening there.

For example:

- The time of the transaction (time)
- OperationName - revealing if it is a read write or delete operation.
- CallerIpAddress can help you determine which client performed the operation.
- URI shows what the file is.
- Identify the caller by how they authorized the call.

Show log analytic query that pulls all this info together. See the section below about how to use the information in the identity fields to determine the source.

##### Capacity

See capacity of them in the capacity page of Storage Analytics. Look for accounts that have low amount used capacity or accounts that have a flat amount used capacity over time.

Click into the account. Then click the "Capacity" tab. You'll see two tables "Storage capacity" and "Storage units". capacity is about usage in bytes and units is about number of blobs.

Open up into either of those windows and adjust your time frame to find when the last time capacity was used in the account. If you're beyond the point that metrics are kept, then that means nothings been added in a long time. 

A flat line over time indicates no usage or perhaps slight usage of the account. If you see a spike in capacity use, you can use logs to find more about what was uploaded. If you have a large amount of data in an account that sees no or little use over time, you might want to determine what is taking up so much space. You can't easily do that with metrics or logs.  You can however, use blob inventory to look into that - put steps here for blob inventory and show example.

#### Monitor the use of a container

This scenario is about clearly identifying container use. For example, ISV partners might build solutions that use blob storage to host data. For example, container A for customer A and container B for customer B. All data stored in separate container. If they want to charge their customers for data use, they need to clearly identify how much data is being used by container. 

Another way to phrase this scenario is that customers want effective ways to meter costs in their Azure data estate. They want to identify costs and account for them at a granular level. For example: tagging, how much data is being queried or consumed by other departments. Keeping track of costs at folder or container level.

##### Determine space used

This is the solution with inventory - [Calculate blob count and total size per container using Azure Storage inventory](calculate-blob-count-size.md).

##### Determine transaction costs associated with the container.

Figure out a way to attribute transaction costs and other costs associated with container traffic for the purpose of departmental billing.

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

  

