---
title: Design highly available applications using geo-redundant storage
titleSuffix: Azure Storage
description: Learn how to use read-access geo-redundant storage to architect a highly available application that is flexible enough to handle outages.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 01/14/2020
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Designing highly available applications using read-access geo-redundant storage

A common feature of cloud-based infrastructures like Azure Storage is that they provide a highly available platform for hosting applications. Developers of cloud-based applications must consider carefully how to leverage this platform to deliver highly available applications to their users. This article focuses on how developers can use one of Azure's geo-redundant replication options to ensure that their Azure Storage applications are highly available.

Storage accounts configured for geo-redundant replication are synchronously replicated in the primary region, and then asynchronously replicated to a secondary region that is hundreds of miles away. Azure Storage offers two types of geo-redundant replication:

* [Geo-zone-redundant storage (GZRS) (preview)](storage-redundancy-gzrs.md) provides replication for scenarios requiring both high availability and maximum durability. Data is replicated synchronously across three Azure availability zones in the primary region using zone-redundant storage (ZRS), then replicated asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-zone-redundant storage (RA-GZRS).
* [Geo-redundant storage (GRS)](storage-redundancy-grs.md) provides cross-regional replication to protect against regional outages. Data is replicated synchronously three times in the primary region using locally redundant storage (LRS), then replicated asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-redundant storage (RA-GRS).

This article shows how to design your application to handle an outage in the primary region. If the primary region becomes unavailable, your application can adapt to perform read operations against the secondary region instead. Make sure that your storage account is configured for RA-GRS or RA-GZRS before you get started.

For information about which primary regions are paired with which secondary regions, see [Business continuity and disaster recovery (BCDR): Azure Paired Regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

There are code snippets included in this article, and a link to a complete sample at the end that you can download and run.

## Application design considerations when reading from the secondary

The purpose of this article is to show you how to design an application that will continue to function (albeit in a limited capacity) even in the event of a major disaster at the primary data center. You can design your application to handle transient or long-running issues by reading from the secondary region when there is a problem that interferes with reading from the primary region. When the primary region is available again, your application can return to reading from the primary region.

Keep in mind these key points when designing your application for RA-GRS or RA-GZRS:

* Azure Storage maintains a read-only copy of the data you store in your primary region in a secondary region. As noted above, the storage service determines the location of the secondary region.

* The read-only copy is [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency) with the data in the primary region.

* For blobs, tables, and queues, you can query the secondary region for a *Last Sync Time* value that tells you when the last replication from the primary to the secondary region occurred. (This is not supported for Azure Files, which doesn't have RA-GRS redundancy at this time.)

* You can use the Storage Client Library to read and write data in either the primary or secondary region. You can also redirect read requests automatically to the secondary region if a read request to the primary region times out.

* If the primary region becomes unavailable, you can initiate an account failover. When you fail over to the secondary region, the DNS entries pointing to the primary region are changed to point to the secondary region. After the failover is complete, write access is restored for GRS and RA-GRS accounts. For more information, see [Disaster recovery and storage account failover (preview) in Azure Storage](storage-disaster-recovery-guidance.md).

> [!NOTE]
> Customer-managed account failover (preview) is not yet available in regions supporting GZRS/RA-GZRS, so customers cannot currently manage account failover events with GZRS and RA-GZRS accounts. During the preview, Microsoft will manage any failover events affecting GZRS/RA-GZRS accounts.

### Using eventually consistent data

The proposed solution assumes that it is acceptable to return potentially stale data to the calling application. Because data in the secondary region is eventually consistent, it is possible the primary region may become inaccessible before an update to the secondary region has finished replicating.

For example, suppose your customer submits an update successfully, but the primary region fails before the update is propagated to the secondary region. When the customer asks to read the data back, they receive the stale data from the secondary region instead of the updated data. When designing your application, you must decide whether this is acceptable, and if so, how you will message the customer. 

Later in this article, we show how to check the Last Sync Time for the secondary data to check whether the secondary is up-to-date.

### Handling services separately or all together

While unlikely, it is possible for one service to become unavailable while the other services are still fully functional. You can handle the retries and read-only mode for each service separately (blobs, queues, tables), or you can handle retries generically for all the storage services together.

For example, if you use queues and blobs in your application, you may decide to put in separate code to handle retryable errors for each of these. Then if you get a retry from the blob service, but the queue service is still working, only the part of your application that handles blobs will be impacted. If you decide to handle all storage service retries generically and a call to the blob service returns a retryable error, then requests to both the blob service and the queue service will be impacted.

Ultimately, this depends on the complexity of your application. You may decide not to handle the failures by service, but instead to redirect read requests for all storage services to the secondary region and run the application in read-only mode when you detect a problem with any storage service in the primary region.

### Other considerations

These are the other considerations we will discuss in the rest of this article.

* Handling retries of read requests using the Circuit Breaker pattern

* Eventually-consistent data and the Last Sync Time

* Testing

## Running your application in read-only mode

To effectively prepare for an outage in the primary region, you must be able to handle both failed read requests and failed update requests (with update in this case meaning inserts, updates, and deletions). If the primary region fails, read requests can be redirected to the secondary region. However, update requests cannot be redirected to the secondary because the secondary is read-only. For this reason, you need to design your application to run in read-only mode.

For example, you can set a flag that is checked before any update requests are submitted to Azure Storage. When one of the update requests comes through, you can skip it and return an appropriate response to the customer. You may even want to disable certain features altogether until the problem is resolved and notify users that those features are temporarily unavailable.

If you decide to handle errors for each service separately, you will also need to handle the ability to run your application in read-only mode by service. For example, you may have read-only flags for each service that can be enabled and disabled. Then you can handle the flag in the appropriate places in your code.

Being able to run your application in read-only mode has another side benefit – it gives you the ability to ensure limited functionality during a major application upgrade. You can trigger your application to run in read-only mode and point to the secondary data center, ensuring nobody is accessing the data in the primary region while you're making upgrades.

## Handling updates when running in read-only mode

There are many ways to handle update requests when running in read-only mode. We won't cover this comprehensively, but generally, there are a couple of patterns that you consider.

1. You can respond to your user and tell them you are not currently accepting updates. For example, a contact management system could enable customers to access contact information but not make updates.

2. You can enqueue your updates in another region. In this case, you would write your pending update requests to a queue in a different region, and then have a way to process those requests after the primary data center comes online again. In this scenario, you should let the customer know that the update requested is queued for later processing.

3. You can write your updates to a storage account in another region. Then when the primary data center comes back online, you can have a way to merge those updates into the primary data, depending on the structure of the data. For example, if you are creating separate files with a date/time stamp in the name, you can copy those files back to the primary region. This works for some workloads such as logging and iOT data.

## Handling retries

The Azure Storage client library helps you determine which errors can be retried. For example, a 404 error (resource not found) would not be retried because retrying it is not likely to result in success. On the other hand, a 500 error can be retried because it is a server error, and the problem may simply be a transient issue. For more details, check out the [open source code for the ExponentialRetry class](https://github.com/Azure/azure-storage-net/blob/87b84b3d5ee884c7adc10e494e2c7060956515d0/Lib/Common/RetryPolicies/ExponentialRetry.cs) in the .NET storage client library. (Look for the ShouldRetry method.)

### Read requests

Read requests can be redirected to secondary storage if there is a problem with primary storage. As noted above in [Using Eventually Consistent Data](#using-eventually-consistent-data), it must be acceptable for your application to potentially read stale data. If you are using the storage client library to access data from the secondary, you can specify the retry behavior of a read request by setting a value for the **LocationMode** property to one of the following:

* **PrimaryOnly** (the default)

* **PrimaryThenSecondary**

* **SecondaryOnly**

* **SecondaryThenPrimary**

When you set the **LocationMode** to **PrimaryThenSecondary**, if the initial read request to the primary endpoint fails with an error that can be retried, the client automatically makes another read request to the secondary endpoint. If the error is a server timeout, then the client will have to wait for the timeout to expire before it receives a retryable error from the service.

There are basically two scenarios to consider when you are deciding how to respond to a retryable error:

* This is an isolated problem and subsequent requests to the primary endpoint will not return a retryable error. An example of where this might happen is when there is a transient network error.

    In this scenario, there is no significant performance penalty in having **LocationMode** set to **PrimaryThenSecondary** as this only happens infrequently.

* This is a problem with at least one of the storage services in the primary region and all subsequent requests to that service in the primary region are likely to return retryable errors for a period of time. An example of this is if the primary region is completely inaccessible.

    In this scenario, there is a performance penalty because all your read requests will try the primary endpoint first, wait for the timeout to expire, then switch to the secondary endpoint.

For these scenarios, you should identify that there is an ongoing issue with the primary endpoint and send all read requests directly to the secondary endpoint by setting the **LocationMode** property to **SecondaryOnly**. At this time, you should also change the application to run in read-only mode. This approach is known as the [Circuit Breaker Pattern](/azure/architecture/patterns/circuit-breaker).

### Update requests

The Circuit Breaker pattern can also be applied to update requests. However, update requests cannot be redirected to secondary storage, which is read-only. For these requests, you should leave the **LocationMode** property set to **PrimaryOnly** (the default). To handle these errors, you can apply a metric to these requests – such as 10 failures in a row – and when your threshold is met, switch the application into read-only mode. You can use the same methods for returning to update mode as those described below in the next section about the Circuit Breaker pattern.

## Circuit Breaker pattern

Using the Circuit Breaker pattern in your application can prevent it from retrying an operation that is likely to fail repeatedly. It allows the application to continue to run rather than taking up time while the operation is retried exponentially. It also detects when the fault has been fixed, at which time the application can try the operation again.

### How to implement the circuit breaker pattern

To identify that there is an ongoing problem with a primary endpoint, you can monitor how frequently the client encounters retryable errors. Because each case is different, you have to decide on the threshold you want to use for the decision to switch to the secondary endpoint and run the application in read-only mode. For example, you could decide to perform the switch if there are 10 failures in a row with no successes. Another example is to switch if 90% of the requests in a 2-minute period fail.

For the first scenario, you can simply keep a count of the failures, and if there is a success before reaching the maximum, set the count back to zero. For the second scenario, one way to implement it is to use the MemoryCache object (in .NET). For each request, add a CacheItem to the cache, set the value to success (1) or fail (0), and set the expiration time to 2 minutes from now (or whatever your time constraint is). When an entry's expiration time is reached, the entry is automatically removed. This will give you a rolling 2-minute window. Each time you make a request to the storage service, you first use a Linq query across the MemoryCache object to calculate the percent success by summing the values and dividing by the count. When the percent success drops below some threshold (such as 10%), set the **LocationMode** property for read requests to **SecondaryOnly** and switch the application into read-only mode before continuing.

The threshold of errors used to determine when to make the switch may vary from service to service in your application, so you should consider making them configurable parameters. This is also where you decide to handle retryable errors from each service separately or as one, as discussed previously.

Another consideration is how to handle multiple instances of an application, and what to do when you detect retryable errors in each instance. For example, you may have 20 VMs running with the same application loaded. Do you handle each instance separately? If one instance starts having problems, do you want to limit the response to just that one instance, or do you want to try to have all instances respond in the same way when one instance has a problem? Handling the instances separately is much simpler than trying to coordinate the response across them, but how you do this depends on your application's architecture.

### Options for monitoring the error frequency

You have three main options for monitoring the frequency of retries in the primary region in order to determine when to switch over to the secondary region and change the application to run in read-only mode.

* Add a handler for the [**Retrying**](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.operationcontext.retrying) event on the [**OperationContext**](https://docs.microsoft.com/java/api/com.microsoft.applicationinsights.extensibility.context.operationcontext) object you pass to your storage requests – this is the method displayed in this article and used in the accompanying sample. These events fire whenever the client retries a request, enabling you to track how often the client encounters retryable errors on a primary endpoint.

    ```csharp
    operationContext.Retrying += (sender, arguments) =>
    {
        // Retrying in the primary region
        if (arguments.Request.Host == primaryhostname)
            ...
    };
    ```

* In the [**Evaluate**](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.iextendedretrypolicy.evaluate) method in a custom retry policy, you can run custom code whenever a retry takes place. In addition to recording when a retry happens, this also gives you the opportunity to modify your retry behavior.

    ```csharp 
    public RetryInfo Evaluate(RetryContext retryContext,
    OperationContext operationContext)
    {
        var statusCode = retryContext.LastRequestResult.HttpStatusCode;
        if (retryContext.CurrentRetryCount >= this.maximumAttempts
            || ((statusCode >= 300 && statusCode < 500 && statusCode != 408)
            || statusCode == 501 // Not Implemented
            || statusCode == 505 // Version Not Supported
            ))
        {
            // Do not retry
            return null;
        }

        // Monitor retries in the primary location
        ...

        // Determine RetryInterval and TargetLocation
        RetryInfo info =
            CreateRetryInfo(retryContext.CurrentRetryCount);

        return info;
    }
    ```

* The third approach is to implement a custom monitoring component in your application that continually pings your primary storage endpoint with dummy read requests (such as reading a small blob) to determine its health. This would take up some resources, but not a significant amount. When a problem is discovered that reaches your threshold, you would then perform the switch to **SecondaryOnly** and read-only mode.

At some point, you will want to switch back to using the primary endpoint and allowing updates. If using one of the first two methods listed above, you could simply switch back to the primary endpoint and enable update mode after an arbitrarily selected amount of time or number of operations has been performed. You can then let it go through the retry logic again. If the problem has been fixed, it will continue to use the primary endpoint and allow updates. If there is still a problem, it will once more switch back to the secondary endpoint and read-only mode after failing the criteria you've set.

For the third scenario, when pinging the primary storage endpoint becomes successful again, you can trigger the switch back to **PrimaryOnly** and continue allowing updates.

## Handling eventually consistent data

Geo-redundant storage works by replicating transactions from the primary to the secondary region. This replication process guarantees that the data in the secondary region is *eventually consistent*. This means that all the transactions in the primary region will eventually appear in the secondary region, but that there may be a lag before they appear, and that there is no guarantee the transactions arrive in the secondary region in the same order as that in which they were originally applied in the primary region. If your transactions arrive in the secondary region out of order, you *may* consider your data in the secondary region to be in an inconsistent state until the service catches up.

The following table shows an example of what might happen when you update the details of an employee to make them a member of the *administrators* role. For the sake of this example, this requires you update the **employee** entity and update an **administrator role** entity with a count of the total number of administrators. Notice how the updates are applied out of order in the secondary region.

| **Time** | **Transaction**                                            | **Replication**                       | **Last Sync Time** | **Result** |
|----------|------------------------------------------------------------|---------------------------------------|--------------------|------------| 
| T0       | Transaction A: <br> Insert employee <br> entity in primary |                                   |                    | Transaction A inserted to primary,<br> not replicated yet. |
| T1       |                                                            | Transaction A <br> replicated to<br> secondary | T1 | Transaction A replicated to secondary. <br>Last Sync Time updated.    |
| T2       | Transaction B:<br>Update<br> employee entity<br> in primary  |                                | T1                 | Transaction B written to primary,<br> not replicated yet.  |
| T3       | Transaction C:<br> Update <br>administrator<br>role entity in<br>primary |                    | T1                 | Transaction C written to primary,<br> not replicated yet.  |
| *T4*     |                                                       | Transaction C <br>replicated to<br> secondary | T1         | Transaction C replicated to secondary.<br>LastSyncTime not updated because <br>transaction B has not been replicated yet.|
| *T5*     | Read entities <br>from secondary                           |                                  | T1                 | You get the stale value for employee <br> entity because transaction B hasn't <br> replicated yet. You get the new value for<br> administrator role entity because C has<br> replicated. Last Sync Time still hasn't<br> been updated because transaction B<br> hasn't replicated. You can tell the<br>administrator role entity is inconsistent <br>because the entity date/time is after <br>the Last Sync Time. |
| *T6*     |                                                      | Transaction B<br> replicated to<br> secondary | T6                 | *T6* – All transactions through C have <br>been replicated, Last Sync Time<br> is updated. |

In this example, assume the client switches to reading from the secondary region at T5. It can successfully read the **administrator role** entity at this time, but the entity contains a value for the count of administrators that is not consistent with the number of **employee** entities that are marked as administrators in the secondary region at this time. Your client could simply display this value, with the risk that it is inconsistent information. Alternatively, the client could attempt to determine that the **administrator role** is in a potentially inconsistent state because the updates have happened out of order, and then inform the user of this fact.

To recognize that it has potentially inconsistent data, the client can use the value of the *Last Sync Time* that you can get at any time by querying a storage service. This tells you the time when the data in the secondary region was last consistent and when the service had applied all the transactions prior to that point in time. In the example shown above, after the service inserts the **employee** entity in the secondary region, the last sync time is set to *T1*. It remains at *T1* until the service updates the **employee** entity in the secondary region when it is set to *T6*. If the client retrieves the last sync time when it reads the entity at *T5*, it can compare it with the timestamp on the entity. If the timestamp on the entity is later than the last sync time, then the entity is in a potentially inconsistent state, and you can take whatever is the appropriate action for your application. Using this field requires that you know when the last update to the primary was completed.

## Getting the last sync time

You can use PowerShell or Azure CLI to retrieve the last sync time to determine when data was last written to the secondary.

### PowerShell

To get the last sync time for the storage account by using PowerShell, install an Azure Storage preview module that supports getting geo-replication stats. For example:

```powershell
Install-Module Az.Storage –Repository PSGallery -RequiredVersion 1.1.1-preview –AllowPrerelease –AllowClobber –Force
```

Then check the storage account's **GeoReplicationStats.LastSyncTime** property. Remember to replace the placeholder values with your own values:

```powershell
$lastSyncTime = $(Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account> `
    -IncludeGeoReplicationStats).GeoReplicationStats.LastSyncTime
```

### Azure CLI

To get the last sync time for the storage account by using Azure CLI, check the storage account's **geoReplicationStats.lastSyncTime** property. Use the `--expand` parameter to return values for the properties nested under **geoReplicationStats**. Remember to replace the placeholder values with your own values:

```azurecli
$lastSyncTime=$(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --expand geoReplicationStats \
    --query geoReplicationStats.lastSyncTime \
    --output tsv)
```

## Testing

It's important to test that your application behaves as expected when it encounters retryable errors. For example, you need to test that the application switches to the secondary and into read-only mode when it detects a problem, and switches back when the primary region becomes available again. To do this, you need a way to simulate retryable errors and control how often they occur.

You can use [Fiddler](https://www.telerik.com/fiddler) to intercept and modify HTTP responses in a script. This script can identify responses that come from your primary endpoint and change the HTTP status code to one that the Storage Client Library recognizes as a retryable error. This code snippet shows a simple example of a Fiddler script that intercepts responses to read requests against the **employeedata** table to return a 502 status:

```java
static function OnBeforeResponse(oSession: Session) {
    ...
    if ((oSession.hostname == "\[yourstorageaccount\].table.core.windows.net")
      && (oSession.PathAndQuery.StartsWith("/employeedata?$filter"))) {
        oSession.responseCode = 502;
    }
}
```

You could extend this example to intercept a wider range of requests and only change the **responseCode** on some of them to better simulate a real-world scenario. For more information about customizing Fiddler scripts, see [Modifying a Request or Response](https://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse) in the Fiddler documentation.

If you have made the thresholds for switching your application to read-only mode configurable, it will be easier to test the behavior with non-production transaction volumes.

## Next Steps

* For more information about how to read from the secondary region, including another example of how the Last Sync Time property is set, see [Azure Storage Redundancy Options and Read Access Geo-Redundant Storage](https://blogs.msdn.microsoft.com/windowsazurestorage/2013/12/11/windows-azure-storage-redundancy-options-and-read-access-geo-redundant-storage/).

* For a complete sample showing how to make the switch back and forth between the primary and secondary endpoints, see [Azure Samples – Using the Circuit Breaker Pattern with RA-GRS storage](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs).
