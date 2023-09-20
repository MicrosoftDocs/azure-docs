---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 04/10/2023
 ms.author: normesta
---

Azure Storage provides the following transaction metrics in Azure Monitor.

| Metric | Description |
| ------------------- | ----------------- |
| Transactions | The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests that produced errors. <br/><br/> Unit: Count<br/> Aggregation Type: Total <br/> Applicable dimensions: ResponseType, GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions))<br/> Value example: 1024 |
| Ingress | The amount of ingress data. This number includes ingress from an external client into Azure Storage as well as ingress within Azure. <br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| Egress | The amount of egress data. This number includes egress to an external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| SuccessServerLatency | The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency. <br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| SuccessE2ELatency | The average end-to-end latency of successful requests made to a storage service or the specified API operation. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response. The difference between SuccessE2ELatency and SuccessServerLatency values is the latency likely caused by the network and the client.<br/><br/> Unit: Milliseconds <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 1024 |
| Availability | The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the total billable requests value and dividing it by the number of applicable requests, including those requests that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation. <br/><br/> Unit: Percent <br/> Aggregation Type: Average <br/> Applicable dimensions: GeoType, ApiName, and Authentication ([Definition](#metrics-dimensions)) <br/> Value example: 99.99 |
