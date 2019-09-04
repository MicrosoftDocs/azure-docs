---
title: Azure Cosmos DB Gremlin response headers
description: Reference documentation for server response metadata that enables additional troubleshooting 
author: OlegIgnat
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: reference
ms.date: 09/03/2019
ms.author: olignat
---

# Azure Cosmos DB Gremlin server response headers
This article covers headers that Cosmos DB Gremlin server returns to the caller upon request execution. These headers are useful for troubleshooting request performance, building application that integrates natively with Cosmos DB service and simplifying customer support.

Applications that take dependency on these headers are trading their portability to other Gremlin implementations at the expense of tighter integration with Cosmos DB Gremlin. These are not standard TinkerPop headers as such developers should be mindful of

## Headers

| Header | Type | Sample Value | When Included | Explanation |
| --- | --- | --- | --- | --- |
| **x-ms-request-charge** | double | 11.3243 | Success and Failure | Amount of collection or database throughput consumed in [request units (RU/s or RUs)](request-units.md) for a partial response message. This header is present in every continuation for requests that have multiple chunks. It indicates the charge incurred by a particular chunk in which it is included. Only for requests that consist of a single response chunk this matches total cost of traversal. For most complex traversals this is a partial cost. |
| **x-ms-total-request-charge** | double | 423.987 | Success and Failure | Amount of collection or database throughput consumed in [request units (RU/s or RUs)](request-units.md) for entire request from the first continuation until the current continuation in which this header is included. This header is present in every continuation for requests that have multiple chunks. It indicates cumulative charge incurred since the beginning of request until the chunk in which it is present. Value of this header in the last chunk indicates complete request charge. |
| **x-ms-server-time-ms** | double | 13.75 | Success and Failure | This header is included for latency troubleshooting purposes. It indicates the amount of time, in milliseconds, that Cosmos DB Gremlin server took to execute and produce a partial response message. Using value of this header and comparing it to overall request latency applications can calculate network latency overhead. |
| **x-ms-total-server-time-ms** | double | 130.512 | Success and Failure | Total time, in milliseconds, that Cosmos DB Gremlin server took to execute entire traversal. This header is included in every partial response and it represents cumulative execution time since the start of request until the time a particular partial message was sent to the client. The very last response indicates total execution time. This header can be used to identify whether client or a server is a source of latency by comparing end-to-end execution time captured on the client to the value of this header returned from the server. |
| **x-ms-status-code** | long | 200 | Success and Failure | Header indicates internal reason for request completion or termination. Application is advised to look at the value of this header and take corrective action. |
| **x-ms-substatus-code** | long | 1003 | Failure Only | Cosmos DB is a multi-model database that is built on top of unified storage layer. This header contains additional insights about the failure reason when failure occurs within lower layers of high availability stack. Application is advised to store this header and use it when reaching out to Cosmos DB support. Values of this header are not publicly documented but are useful for Cosmos DB engineer for quick troubleshooting. |
| **x-ms-retry-after-ms** | string (TimeSpan) | "00:00:03.9500000" | Failure Only | This header is a string representation of a .NET [TimeSpan](https://docs.microsoft.com/en-us/dotnet/api/system.timespan) type. For backward-compatibility reasons it is not a double type as header name suggests, but rather a TimeSpan's ToString() representation. This value will only be included in requests that failed due to exhaustion of provisioned throughput. Application is advised to follow the value in this header and retry traversal after instructed period of time. |
| **x-ms-activity-id** | string (Guid) | "A9218E01-3A3A-4716-9636-5BD86B056613" | Success and Failure | Header contains a unique server-side identifier of a request. Each request is assigned a unique identifier by the server for tracking purposes. Applications are advised to retain activity identifiers returned by the server for requests that customers may want to contact customer support about. Cosmos DB support personell can find specific requests by these identifiers in Cosmos DB service telemetry quickly and share additional insights with the customers. |

## Status codes

Most common status codes returned by the server are listed below.

| Status | Explanation |
| --- | --- |
| **404** | Concurrent operations that attempts to delete and update the same edge or vertex simultaneously. Error message `"Owner resource does not exist"` indicates that specified database or collection is incorrect in connection parameters in `/dbs/<database name>/colls/<collection or graph name>` format.|
| **409** | `Conflicting request to resource has been attempted. Retry to avoid conflicts.` This usually happens when vertex or an edge with an identifier already exists in the graph.| 
| **412** | Status code is usually complemented with error message `"PreconditionFailedException": One of the specified pre-condition is not met`. This is indicative of an optimistic concurrency control violation between reading an edge or vertex and writing it back to the store after modification. Most common situations when this occurs is property modification, for example `g.V('identifier').property('name','value')`. Gremlin engine would read the vertex, perform modification and write it back. If two traversals concurrently read and write the same vertex or an edge one of them will receive this error. It is recommended to retry traversal again.| 
| **429** | Request was throttled and should be retried after value in **x-ms-retry-after-ms**| 
| **500** | Error message that contains `"NotFoundException: Entity with the specified id does not exist in the system."` indicates that a database and/or collection was re-created with the same name. This error will disappear within 5 minutes as change propagates and invalidates caches in different Cosmos DB components. To avoid this issue, use unique database and collection names every time.| 

## Samples

A sample client application based on Gremlin.Net that reads one status attribute:

```csharp
// Following example reads a status code and total request charge from server response attributes.
// Variable "server" is assumed to be assigned to an instance of a GremlinServer that is connected to Cosmos DB account.
using (GremlinClient client = new GremlinClient(server, new GraphSON2Reader(), new GraphSON2Writer(), GremlinClient.GraphSON2MimeType))
{
  ResultSet<dynamic> responseResultSet = await GremlinClientExtensions.SubmitAsync<dynamic>(client, requestScript: "g.V().count()");
  long statusCode = (long)responseResultSet.StatusAttributes["x-ms-status-code"];
  double totalRequestCharge = (double)responseResultSet.StatusAttributes["x-ms-total-request-charge"];

  // Status code and request charge are logged into application telemetry.
}
```

An example that demonstrates how to read status attribute from Gremlin java client:

```java
try {
  ResultSet resultSet = this.client.submit("g.addV().property('id', '13')");
  List<Result> results = resultSet.all().get();

  // Process and consume results

} catch (ResponseException re) {
  // Check for known errors that need to be retried or skipped
  if (re.getStatusAttributes().isPresent()) {
    Map<String, Object> attributes = re.getStatusAttributes().get();
    int statusCode = (int) attributes.getOrDefault("x-ms-status-code", -1);

    // Now we can check for specific conditions
    if (statusCode == 409) {
        // Handle conflicting writes
      }
    }

    // Check if we need to delay retry
    if (attributes.containsKey("x-ms-retry-after-ms")) {
      // Read the value of the attribute as is
      String retryAfterTimeSpan = (String) attributes.get("x-ms-retry-after-ms"));

      // Convert the value into actionable duration
			LocalTime locaTime = LocalTime.parse(retryAfterTimeSpan);
			Duration duration = Duration.between(LocalTime.MIN, locaTime);

      // Perform a retry after "duration" interval of time has elapsed
    }
  }
}

```

## Next steps
* Get started building a graph application [using our SDKs](create-graph-dotnet.md) 
* Learn more about [graph support](graph-introduction.md) in Azure Cosmos DB
