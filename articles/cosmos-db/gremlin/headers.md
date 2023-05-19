---
title: Azure Cosmos DB for Gremlin response headers
description: Reference documentation for server response metadata that enables additional troubleshooting 
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.custom: ignite-2022
ms.topic: reference
ms.date: 09/03/2019
author: manishmsfte
ms.author: mansha
---

# Azure Cosmos DB for Gremlin server response headers
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

This article covers headers that Azure Cosmos DB for Gremlin server returns to the caller upon request execution. These headers are useful for troubleshooting request performance, building application that integrates natively with Azure Cosmos DB service and simplifying customer support.

Keep in mind that taking dependency on these headers you are limiting portability of your application to other Gremlin implementations. In return, you are gaining tighter integration with Azure Cosmos DB for Gremlin. These headers are not a TinkerPop standard.

## Headers

| Header | Type | Sample Value | When Included | Explanation |
| --- | --- | --- | --- | --- |
| **x-ms-request-charge** | double | 11.3243 | Success and Failure | Amount of collection or database throughput consumed in [request units (RU/s or RUs)](../request-units.md) for a partial response message. This header is present in every continuation for requests that have multiple chunks. It reflects the charge of a particular response chunk. Only for requests that consist of a single response chunk this header matches total cost of traversal. However, for majority of complex traversals this value represents a partial cost. |
| **x-ms-total-request-charge** | double | 423.987 | Success and Failure | Amount of collection or database throughput consumed in [request units (RU/s or RUs)](../request-units.md) for entire request. This header is present in every continuation for requests that have multiple chunks. It indicates cumulative charge  since the beginning of request. Value of this header in the last chunk indicates complete request charge. |
| **x-ms-server-time-ms** | double | 13.75 | Success and Failure | This header is included for latency troubleshooting purposes. It indicates the amount of time, in milliseconds, that Azure Cosmos DB for Gremlin server took to execute and produce a partial response message. Using value of this header and comparing it to overall request latency applications can calculate network latency overhead. |
| **x-ms-total-server-time-ms** | double | 130.512 | Success and Failure | Total time, in milliseconds, that Azure Cosmos DB for Gremlin server took to execute entire traversal. This header is included in every partial response. It represents cumulative execution time since the start of request. The last response indicates total execution time. This header is useful to differentiate between client and server as a source of latency. You can compare traversal execution time on the client to the value of this header. |
| **x-ms-status-code** | long | 200 | Success and Failure | Header indicates internal reason for request completion or termination. Application is advised to look at the value of this header and take corrective action. |
| **x-ms-substatus-code** | long | 1003 | Failure Only | Azure Cosmos DB is a multi-model database that is built on top of unified storage layer. This header contains additional insights about the failure reason when failure occurs within lower layers of high availability stack. Application is advised to store this header and use it when contacting Azure Cosmos DB customer support. Value of this header is useful for Azure Cosmos DB engineer for quick troubleshooting. |
| **x-ms-retry-after-ms** | string (TimeSpan) | "00:00:03.9500000" | Failure Only | This header is a string representation of a .NET [TimeSpan](/dotnet/api/system.timespan) type. This value will only be included in requests failed due provisioned throughput exhaustion. Application should resubmit traversal again after instructed period of time. |
| **x-ms-activity-id** | string (Guid) | "A9218E01-3A3A-4716-9636-5BD86B056613" | Success and Failure | Header contains a unique server-side identifier of a request. Each request is assigned a unique identifier by the server for tracking purposes. Applications should log activity identifiers returned by the server for requests that customers may want to contact customer support about. Azure Cosmos DB support personnel can find specific requests by these identifiers in Azure Cosmos DB service telemetry. |

## Status codes

Most common codes returned for `x-ms-status-code` status attribute by the server are listed below.

| Status | Explanation |
| --- | --- |
| **401** | Error message `"Unauthorized: Invalid credentials provided"` is returned when authentication password doesn't match Azure Cosmos DB account key. Navigate to your Azure Cosmos DB for Gremlin account in the Azure portal and confirm that the key is correct.|
| **404** | Concurrent operations that attempt to delete and update the same edge or vertex simultaneously. Error message `"Owner resource does not exist"` indicates that specified database or collection is incorrect in connection parameters in `/dbs/<database name>/colls/<collection or graph name>` format.|
| **409** | `"Conflicting request to resource has been attempted. Retry to avoid conflicts."` This usually happens when vertex or an edge with an identifier already exists in the graph.| 
| **412** | Status code is complemented with error message `"PreconditionFailedException": One of the specified pre-condition is not met`. This error is indicative of an optimistic concurrency control violation between reading an edge or vertex and writing it back to the store after modification. Most common situations when this error occurs is property modification, for example `g.V('identifier').property('name','value')`. Gremlin engine would read the vertex, modify it, and write it back. If there is another traversal running in parallel trying to write the same vertex or an edge, one of them will receive this error. Application should submit traversal to the server again.| 
| **429** | Request was throttled and should be retried after value in **x-ms-retry-after-ms**| 
| **500** | Error message that contains `"NotFoundException: Entity with the specified id does not exist in the system."` indicates that a database and/or collection was re-created with the same name. This error will disappear within 5 minutes as change propagates and invalidates caches in different Azure Cosmos DB components. To avoid this issue, use unique database and collection names every time.| 
| **1000** | This status code is returned when server successfully parsed a message but wasn't able to execute. It usually indicates a problem with the query.| 
| **1001** | This code is returned when server completes traversal execution but fails to serialize response back to the client. This error can happen when traversal generates complex result, that is too large or does not conform to TinkerPop protocol specification. Application should simplify the traversal when it encounters this error. | 
| **1003** | `"Query exceeded memory limit. Bytes Consumed: XXX, Max: YYY"` is returned when traversal exceeds allowed memory limit. Memory limit is **2 GB** per traversal.| 
| **1004** | This status code indicates malformed graph request. Request can be malformed when it fails deserialization, non-value type is being deserialized as value type or unsupported gremlin operation requested. Application should not retry the request because it will not be successful. | 
| **1007** | Usually this status code is returned with error message `"Could not process request. Underlying connection has been closed."`. This situation can happen if client driver attempts to use a connection that is being closed by the server. Application should retry the traversal on a different connection.
| **1008** | Azure Cosmos DB for Gremlin server can terminate connections to rebalance traffic in the cluster. Client drivers should handle this situation and use only live connections to send requests to the server. Occasionally client drivers may not detect that connection was closed. When application encounters an error, `"Connection is too busy. Please retry after sometime or open more connections."` it should retry traversal on a different connection.
| **1009** | The operation did not complete in the allotted time and was canceled by the server. Optimize your traversals to run quickly by filtering vertices or edges on every hop of traversal to narrow search scope. Request timeout default is **60 seconds**. |

## Samples

A sample client application based on Gremlin.Net that reads one status attribute:

```csharp
// Following example reads a status code and total request charge from server response attributes.
// Variable "server" is assumed to be assigned to an instance of a GremlinServer that is connected to Azure Cosmos DB account.
using (GremlinClient client = new GremlinClient(server, new GraphSON2Reader(), new GraphSON2Writer(), GremlinClient.GraphSON2MimeType))
{
  ResultSet<dynamic> responseResultSet = await GremlinClientExtensions.SubmitAsync<dynamic>(client, requestScript: "g.V().count()");
  long statusCode = (long)responseResultSet.StatusAttributes["x-ms-status-code"];
  double totalRequestCharge = (double)responseResultSet.StatusAttributes["x-ms-total-request-charge"];

  // Status code and request charge are logged into application telemetry.
}
```

An example that demonstrates how to read status attribute from Gremlin Java client:

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
* [HTTP status codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) 
* [Common Azure Cosmos DB REST response headers](/rest/api/cosmos-db/common-cosmosdb-rest-response-headers)
* [TinkerPop Graph Driver Provider Requirements]( http://tinkerpop.apache.org/docs/current/dev/provider/#_graph_driver_provider_requirements)
