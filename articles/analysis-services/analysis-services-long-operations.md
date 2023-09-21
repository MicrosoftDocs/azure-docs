---
title: Learn about best practices for long running operations in Azure Analysis Services | Microsoft Docs
description: This article describes best practices for long running operations.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: owend

---
# Best practices for long running operations

In Azure Analysis Services, a *node* represents a host virtual machine where a server resource is running. Some operations such as long running queries, refresh operations, and query scale-out synchronization can fail if a server resource moves to a different node. Common error messages in this scenario include:

- "An error has occurred while trying to locate a long running XMLA request. The request might have been interrupted by service upgrade or server restart."
- "Job with ID '\<guid\>for model '\<database\>' was canceled due to service error (inactivity) with message 'Cancelling the refresh request since it was stuck without any updates. This is an internal service issue. Please resubmit the job or file a ticket to get help if this issue happens repeatedly."

There are many reasons why long running operations can be disrupted. For example, updates in Azure such as: 
- Operating System patches 
- Security updates
- Azure Analysis Services service updates
- Service Fabric updates. Service Fabric is a platform component used by a number of Microsoft cloud services, including Azure Analysis Services.

Besides updates that occur in the service, there's a natural movement of services across nodes due to load balancing. Node movements are an expected part of a cloud service. Azure Analysis Services tries to minimize impacts from node movements, but it's impossible to eliminate them entirely. 

In addition to node movements, other failures can occur. For example, a data source database system might be offline or network connectivity is lost. If during refresh, a partition has 10 million rows and a failure occurs at the 9 millionth row, there's no way to restart refresh at the point of failure. The service must be started again from the beginning. 

## Refresh REST API

Service interruptions can be challenging for long running operations like data refresh. Azure Analysis Services includes a REST API to help mitigate negative impacts from service interruptions. To learn more, see [Asynchronous refresh with the REST API](analysis-services-async-refresh.md).
 
Besides the REST API, there are other approaches you can use to minimize potential issues during long running refresh operations. The goal is to avoid having to restart the refresh operation from the beginning, and instead perform refreshes in smaller batches that can be committed in stages. 
 
The REST API allows for such restart, but it doesn't allow for full flexibility of partition creation and deletion. If a scenario requires complex data management operations, your solution should include some form of batching in its logic. For example, by using transactions to process data in multiple, separate batches allows for a failure to not require restart from the beginning, but instead from an intermediate checkpoint. 
 
## Scale-out query replicas

Whether using REST or custom logic, client application queries can still return inconsistent or intermediate results while batches are being processed. If consistent data returned by client application queries is required while processing is happening, and model data is in an intermediate state, use [scale-out](analysis-services-scale-out.md) with read-only query replicas.

By using read-only query replicas, while refreshes are being performed in batches, client application users can continue to query the old snapshot of data on the read-only replicas. Once refreshes are finished, a Synch operation can be performed to bring the read-only replicas up to date.


## Next steps

[Asynchronous refresh with the REST API](analysis-services-async-refresh.md)  
[Azure Analysis Services scale-out](analysis-services-scale-out.md)  
[Analysis Services high availability](analysis-services-bcdr.md)  
[Retry guidance for Azure services](/azure/architecture/best-practices/retry-service-specific)