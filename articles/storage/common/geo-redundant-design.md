---
title: Use geo-redundancy to design highly available applications
titleSuffix: Azure Storage
description: Learn how to use geo-redundant storage to design a highly available application that is flexible enough to handle outages.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: conceptual
ms.date: 08/23/2022
ms.author: shaas
ms.reviewer: artek
ms.subservice: storage-common-concepts
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Use geo-redundancy to design highly available applications

Cloud-based infrastructures like Azure Storage provide a highly available and durable platform for hosting data and applications. Developers of cloud-based applications must consider carefully how to leverage this platform to maximize those advantages for their users. Azure Storage offers geo-redundancy options to ensure high availability even during a regional outage. Storage accounts configured for geo-redundant replication are synchronously replicated in the primary region, and asynchronously replicated to a secondary region that is hundreds of miles away.

Azure Storage offers two options for geo-redundant replication: [Geo-redundant storage (GRS)](storage-redundancy.md#geo-redundant-storage) and [Geo-zone-redundant storage (GZRS)](storage-redundancy.md#geo-zone-redundant-storage). To make use of the Azure Storage geo-redundancy options, make sure that your storage account is configured for read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If it's not, you can learn more about how to [change your storage account replication type](redundancy-migration.md).

This article shows how to design an application that will continue to function, albeit in a limited capacity, even when there's a significant outage in the primary region. If the primary region becomes unavailable, your application can switch seamlessly to perform read operations against the secondary region until the primary region is responsive again.

## Application design considerations

You can design your application to handle transient faults or significant outages by reading from the secondary region when there's an issue that interferes with reading from the primary region. When the primary region is available again, your application can return to reading from the primary region.

Keep in mind these key considerations when designing your application for availability and resiliency using RA-GRS or RA-GZRS:

- A read-only copy of the data you store in the primary region is asynchronously replicated in a secondary region. This asynchronous replication means that the read-only copy in the secondary region is [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency) with the data in the primary region. The storage service determines the location of the secondary region.

- You can use the Azure Storage client libraries to perform read and update requests against the primary region endpoint. If the primary region is unavailable, you can automatically redirect read requests to the secondary region. You can also configure your app to send read requests directly to the secondary region, if desired, even when the primary region is available.

- If the primary region becomes unavailable, you can initiate an account failover. When you fail over to the secondary region, the DNS entries pointing to the primary region are changed to point to the secondary region. After the failover is complete, write access is restored for GRS and RA-GRS accounts. For more information, see [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md).

### Working with eventually consistent data

The proposed solution assumes that it's acceptable to return potentially stale data to the calling application. Because data in the secondary region is eventually consistent, it's possible that the primary region may become inaccessible before an update to the secondary region has finished replicating.

For example, suppose your customer submits an update successfully, but the primary region fails before the update is propagated to the secondary region. When the customer asks to read the data back, they receive the stale data from the secondary region instead of the updated data. When designing your application, you must decide whether or not this behavior is acceptable. If it is, you also need to consider how to notify the user.

Later in this article, you'll learn more about [handling eventually consistent data](#handling-eventually-consistent-data) and how to check the **Last Sync Time** property to evaluate any discrepancies between data in the primary and secondary regions.

### Handling services separately or all together

While unlikely, it's possible for one service (blobs, queues, tables, or files) to become unavailable while the other services are still fully functional. You can handle the retries for each service separately, or you can handle retries generically for all the storage services together.

For example, if you use queues and blobs in your application, you may decide to put in separate code to handle retryable errors for each service. That way, a blob service error will only affect the part of your application that deals with blobs, leaving queues to continue running as normal. If, however, you decide to handle all storage service retries together, then requests to both blob and queue services will be affected if either service returns a retryable error.

Ultimately, this decision depends on the complexity of your application. You may prefer to handle failures by service to limit the impact of retries. Or you may decide to redirect read requests for all storage services to the secondary region when you detect a problem with any storage service in the primary region.

## Running your application in read-only mode

To effectively prepare for an outage in the primary region, your application must be able to handle both failed read requests and failed update requests. If the primary region fails, read requests can be redirected to the secondary region. However, update requests can't be redirected because the replicated data in the secondary region is read-only. For this reason, you need to design your application to be able to run in read-only mode.

For example, you can set a flag that is checked before any update requests are submitted to Azure Storage. When an update request comes through, you can skip the request and return an appropriate response to the user. You might even choose to disable certain features altogether until the problem is resolved, and notify users that the features are temporarily unavailable.

If you decide to handle errors for each service separately, you'll also need to handle the ability to run your application in read-only mode by service. For example, you may set up read-only flags for each service. Then you can enable or disable the flags in the code, as needed.

Being able to run your application in read-only mode also gives you the ability to ensure limited functionality during a major application upgrade. You can trigger your application to run in read-only mode and point to the secondary data center, ensuring nobody is accessing the data in the primary region while you're making upgrades.

### Handling updates when running in read-only mode

There are many ways to handle update requests when running in read-only mode. This section focuses on a few general patterns to consider.

- You can respond to the user and notify them that update requests are not currently being processed. For example, a contact management system could enable users to access contact information but not make updates.

- You can enqueue your updates in another region. In this case, you would write your pending update requests to a queue in a different region, and then process those requests after the primary data center comes online again. In this scenario, you should let the user know that the update request is queued for later processing.

- You can write your updates to a storage account in another region. When the primary region comes back online, you can merge those updates into the primary data, depending on the structure of the data. For example, if you're creating separate files with a date/time stamp in the name, you can copy those files back to the primary region. This solution can apply to workloads such as logging and IoT data.

## Handling retries

Applications that communicate with services running in the cloud must be sensitive to unplanned events and faults that can occur. These faults can be transient or persistent, ranging from a momentary loss of connectivity to a significant outage due to a natural disaster. It's important to design cloud applications with appropriate retry handling to maximize availability and improve overall application stability.

### Read requests

If the primary region becomes unavailable, read requests can be redirected to secondary storage. As noted earlier, it must be acceptable for your application to potentially read stale data. The Azure Storage client library offers options for handling retries and redirecting read requests to a secondary region.

In this example, the retry handling for Blob storage is configured in the `BlobClientOptions` class and will apply to the `BlobServiceClient` object we create using these configuration options. This configuration is a **primary then secondary** approach, where read request retries from the primary region are redirected to the secondary region. This approach is best when failures in the primary region are expected to be temporary.

```csharp
string accountName = "<YOURSTORAGEACCOUNTNAME>";
Uri primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");
Uri secondaryAccountUri = new Uri($"https://{accountName}-secondary.blob.core.windows.net/");

// Provide the client configuration options for connecting to Azure Blob storage
BlobClientOptions blobClientOptions = new BlobClientOptions()
{
    Retry = {
        // The delay between retry attempts for a fixed approach or the delay
        // on which to base calculations for a backoff-based approach
        Delay = TimeSpan.FromSeconds(2),

        // The maximum number of retry attempts before giving up
        MaxRetries = 5,

        // The approach to use for calculating retry delays
        Mode = RetryMode.Exponential,

        // The maximum permissible delay between retry attempts
        MaxDelay = TimeSpan.FromSeconds(10)
    },

    // If the GeoRedundantSecondaryUri property is set, the secondary Uri will be used for 
    // GET or HEAD requests during retries.
    // If the status of the response from the secondary Uri is a 404, then subsequent retries
    // for the request will not use the secondary Uri again, as this indicates that the resource 
    // may not have propagated there yet.
    // Otherwise, subsequent retries will alternate back and forth between primary and secondary Uri.
    GeoRedundantSecondaryUri = secondaryAccountUri
};

// Create a BlobServiceClient object using the configuration options above
BlobServiceClient blobServiceClient = new BlobServiceClient(primaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

If you determine that the primary region is likely to be unavailable for a long period of time, you can configure all read requests to point at the secondary region. This configuration is a **secondary only** approach. As discussed earlier, you'll need a strategy to handle update requests during this time, and a way to inform users that only read requests are being processed. In this example, we create a new instance of `BlobServiceClient` which uses the secondary region endpoint.

```csharp
string accountName = "<YOURSTORAGEACCOUNTNAME>";
Uri primaryAccountUri = new Uri($"https://{accountName}.blob.core.windows.net/");
Uri secondaryAccountUri = new Uri($"https://{accountName}-secondary.blob.core.windows.net/");

// Create a BlobServiceClient object pointed at the secondary Uri
// Use blobServiceClientSecondary only when issuing read requests, as secondary storage is read-only
BlobServiceClient blobServiceClientSecondary = new BlobServiceClient(secondaryAccountUri, new DefaultAzureCredential(), blobClientOptions);
```

Knowing when to switch to read-only mode and **secondary only** requests is part of an architectural design pattern called the [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker), which will be discussed in a later section.

### Update requests

Update requests can't be redirected to secondary storage, which is read-only. As described earlier, your application needs to be able to [handle update requests](#handling-updates-when-running-in-read-only-mode) when the primary region is unavailable.

The Circuit Breaker pattern can also be applied to update requests. To handle update request errors, you could set a threshold in the code, such as 10 consecutive failures, and track the number of failures for requests to primary region. Once the threshold is met, you can switch the application to read-only mode so that update requests to the primary region are no longer issued.

### How to implement the Circuit Breaker pattern

Handling failures that may take a variable amount of time to recover from is part of an architectural design pattern called the [Circuit Breaker pattern](/azure/architecture/patterns/circuit-breaker). Proper implementation of this pattern can prevent an application from repeatedly trying to execute an operation that's likely to fail, thereby improving application stability and resiliency.

One aspect of the Circuit Breaker pattern is identifying when there's an ongoing problem with a primary endpoint. To make this determination, you can monitor how frequently the client encounters retryable errors. Because each scenario is different, you need to determine an appropriate threshold to use for the decision to switch to the secondary endpoint and run the application in read-only mode. 

For example, you could decide to perform the switch if there are 10 consecutive failures in the primary region. You can track this by keeping a count of the failures in the code. If there's a success before reaching the threshold, set the count back to zero. If the count reaches the threshold, then switch the application to use the secondary region for read requests.

As an alternative approach, you could decide to implement a custom monitoring component in your application. This component could continuously ping your primary storage endpoint with trivial read requests (such as reading a small blob) to determine its health. This approach would take up some resources, but not a significant amount. When a problem is discovered that reaches your threshold, you would switch to **secondary only** read requests and read-only mode. For this scenario, when pinging the primary storage endpoint becomes successful again you can switch back to the primary region and continue allowing updates.

The error threshold used to determine when to make the switch may vary from service to service within your application, so you should consider making them configurable parameters.

Another consideration is how to handle multiple instances of an application, and what to do when you detect retryable errors in each instance. For example, you may have 20 VMs running with the same application loaded. Do you handle each instance separately? If one instance starts having problems, do you want to limit the response to just that one instance? Or do you want all instances to respond in the same way when one instance has a problem? Handling the instances separately is much simpler than trying to coordinate the response across them, but your approach will depend on your application's architecture.

## Handling eventually consistent data

Geo-redundant storage works by replicating transactions from the primary to the secondary region. The replication process guarantees that the data in the secondary region is eventually consistent. This means that all the transactions in the primary region will eventually appear in the secondary region, but that there may be a lag before they appear. There's also no guarantee that transactions will arrive in the secondary region in the same order as they were originally applied in the primary region. If your transactions arrive in the secondary region out of order, you *may* consider your data in the secondary region to be in an inconsistent state until the service catches up.

The following example for Azure Table storage shows what might happen when you update the details of an employee to make them a member of the **administrator role**. For the sake of this example, this requires you update the **employee** entity and update an **administrator role** entity with a count of the total number of administrators. Notice how the updates are applied out of order in the secondary region.

| **Time** | **Transaction**                                            | **Replication**                       | **Last Sync Time** | **Result** |
|----------|------------------------------------------------------------|---------------------------------------|--------------------|------------|
| T0       | Transaction A: <br> Insert employee <br> entity in primary |                                   |                    | Transaction A inserted to primary,<br> not replicated yet. |
| T1       |                                                            | Transaction A <br> replicated to<br> secondary | T1 | Transaction A replicated to secondary. <br>Last Sync Time updated.    |
| T2       | Transaction B:<br>Update<br> employee entity<br> in primary  |                                | T1                 | Transaction B written to primary,<br> not replicated yet.  |
| T3       | Transaction C:<br> Update <br>administrator<br>role entity in<br>primary |                    | T1                 | Transaction C written to primary,<br> not replicated yet.  |
| *T4*     |                                                       | Transaction C <br>replicated to<br> secondary | T1         | Transaction C replicated to secondary.<br>LastSyncTime not updated because <br>transaction B hasn't been replicated yet.|
| *T5*     | Read entities <br>from secondary                           |                                  | T1                 | You get the stale value for employee <br> entity because transaction B hasn't <br> replicated yet. You get the new value for<br> administrator role entity because C has<br> replicated. Last Sync Time still hasn't<br> been updated because transaction B<br> hasn't replicated. You can tell the<br>administrator role entity is inconsistent <br>because the entity date/time is after <br>the Last Sync Time. |
| *T6*     |                                                      | Transaction B<br> replicated to<br> secondary | T6                 | *T6* – All transactions through C have <br>been replicated, Last Sync Time<br> is updated. |

In this example, assume the client switches to reading from the secondary region at T5. It can successfully read the **administrator role** entity at this time, but the entity contains a value for the count of administrators that isn't consistent with the number of **employee** entities that are marked as administrators in the secondary region at this time. Your client could display this value, with the risk that the information is inconsistent. Alternatively, the client could attempt to determine that the **administrator role** is in a potentially inconsistent state because the updates have happened out of order, and then inform the user of this fact.

To determine whether a storage account has potentially inconsistent data, the client can check the value of the **Last Sync Time** property. **Last Sync Time** tells you the time when the data in the secondary region was last consistent and when the service had applied all the transactions prior to that point in time. In the example shown above, after the service inserts the **employee** entity in the secondary region, the last sync time is set to *T1*. It remains at *T1* until the service updates the **employee** entity in the secondary region when it's set to *T6*. If the client retrieves the last sync time when it reads the entity at *T5*, it can compare it with the timestamp on the entity. If the timestamp on the entity is later than the last sync time, then the entity is in a potentially inconsistent state, and you can take the appropriate action. Using this field requires that you know when the last update to the primary was completed.

To learn how to check the last sync time, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

## Testing

It's important to test that your application behaves as expected when it encounters retryable errors. For example, you need to test that the application switches to the secondary region when it detects a problem, and then switches back when the primary region becomes available again. To properly test this behavior, you need a way to simulate retryable errors and control how often they occur.

One option is to use [Fiddler](https://www.telerik.com/fiddler) to intercept and modify HTTP responses in a script. This script can identify responses that come from your primary endpoint and change the HTTP status code to one that the Storage client library recognizes as a retryable error. This code snippet shows a simple example of a Fiddler script that intercepts responses to read requests against the **employeedata** table to return a 502 status:

```
static function OnBeforeResponse(oSession: Session) {
    ...
    if ((oSession.hostname == "\[YOURSTORAGEACCOUNTNAME\].table.core.windows.net")
      && (oSession.PathAndQuery.StartsWith("/employeedata?$filter"))) {
        oSession.responseCode = 502;
    }
}
```

You could extend this example to intercept a wider range of requests and only change the **responseCode** on some of them to better simulate a real-world scenario. For more information about customizing Fiddler scripts, see [Modifying a Request or Response](https://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse) in the Fiddler documentation.

If you have set up configurable thresholds for switching your application to read-only, it will be easier to test the behavior with non-production transaction volumes.

---

## Next steps

For a complete sample showing how to make the switch back and forth between the primary and secondary endpoints, see [Azure Samples – Using the Circuit Breaker Pattern with RA-GRS storage](https://github.com/Azure-Samples/storage-dotnet-circuit-breaker-pattern-ha-apps-using-ra-grs).
