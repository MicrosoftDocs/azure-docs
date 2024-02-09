--- 
title: Job Router metrics definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of job router metrics available in the Azure portal.
author: nabennet
manager: bga
services: azure-communication-services
ms.author: nabennet
ms.date: 06/23/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
--- 

# Job Router metrics overview

## Where to find metrics

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Azure Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Azure Communication Services resource.

## Metric definitions

All API request metrics contain four dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../../azure-monitor/essentials/metrics-charts.md#aggregation).

- **Operation** - All operations or routes that can be called on the Azure Communication Services gateway.

- **API Version** – The version of the API used in the API request.

- **Status Code** - The status code response sent after the request.

- **StatusSubClass** - The status code series sent after the response.  

### Job Router API requests

The following operations are available on Job Router API request metrics:

| Operation / Route  | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| UpsertClassificationPolicy | Creates or updates a classification policy |
| GetClassificationPolicy | Retrieves an existing classification policy by ID |
| ListClassificationPolicies | Retrieves existing classification policies |
| DeleteDistributionPolicy | Delete a classification policy by ID|
| UpsertDistributionPolicy | Creates or updates a distribution policy |
| GetDistributionPolicy | Retrieves an existing distribution policy by ID |
| ListDistributionPolicies | Retrieves existing distribution policies |
| DeleteDistributionPolicy | Delete a distribution policy by ID |
| UpsertExceptionPolicy | Creates or updates an exception policy |
| GetExceptionPolicy | Retrieves an existing exception policy by ID |
| ListExceptionPolicies | Retrieves existing exception policies |
| DeleteExceptionPolicy | Delete an exception policy by ID |
| UpsertQueue| Creates or updates a queue |
| GetQueue | Retrieves an existing queue by ID |
| GetQueues | Retrieves existing queues |
| DeleteQueue | Delete a queue by ID |
| GetQueueStatistics | Retrieves a queue's statistics |
| UpsertJob | Creates or updates a job |
| GetJob | Retrieves an existing job by ID |
| GetJobs | Retrieves existing jobs |
| DeleteJob | Delete a queue policy by ID |
| ReclassifyJob | Reclassify a job |
| CancelJob | Submits request to cancel an existing job by ID while supplying free-form cancellation reason |
| CompleteJob | Completes an assigned job |
| CloseJob | Closes a completed job |
| AcceptJobOffer | Accepts an offer to work on a job and returns a 409/Conflict if another agent accepted the job already |
| DeclineJobOffer| Declines an offer to work on a job |
| UpsertWorker | Creates or updates a worker |
| GetWorker | Retrieves an existing worker by ID |
| GetWorkers | Retrieves existing workers |
| DeleteWorker | Deletes a worker and all of its traces |

 :::image type="content" source="./media/acs-router-api-requests.png" alt-text="Diagram that shows the Job Router API requests." lightbox="./media/acs-router-api-requests.png":::

## Next steps

- Learn more about [Data Platform Metrics](../../../azure-monitor/essentials/data-platform-metrics.md).
