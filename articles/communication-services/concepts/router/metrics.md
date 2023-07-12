--- 

title: Job Router metrics definitions for Azure Communication Service 

titleSuffix: An Azure Communication Services concept document 

description: This document covers definitions of job router metrics available in the Azure portal. 

author: nabennet 

manager: bga 

services: azure-communication-services 

ms.author: mkhribech 

ms.date: 06/23/nabennet 

ms.topic: conceptual 

ms.service: azure-communication-services 

ms.subservice: data 

--- 

# Job Router metrics overview 

 

## Where to find metrics 

 

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Communication Services resource. 

 

## Metric definitions 

 

All API request metrics contain four dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation. 

 

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../../../azure-monitor/essentials/metrics-charts.md#aggregation). 

 

- **Operation** - All operations or routes that can be called on the Azure Communication Services Chat gateway. 

- **API Version – The version of the API used in the API request. 

- **Status Code** - The status code response sent after the request. 

- **StatusSubClass** - The status code series sent after the response.  

 

### Job Router API requests 

 

The following operations are available on Job Router API request metrics: 

 

| Operation / Route  | Description                                                                                    | 

| -------------------- | ---------------------------------------------------------------------------------------------- | 

| UpsertClassificationPolicy | Creates or updates a classification policy | 

| GetClassificationPolicy | Retrieves an existing classification policy by Id | 

| ListClassificationPolicies | Retrieves existing classification policies | 

| DeleteDistributionPolicy | Delete a classification policy by Id| 

| UpsertDistributionPolicy | Creates or updates a distribution policy | 

| GetDistributionPolicy | Retrieves an existing distribution policy by Id | 

| ListDistributionPolicies | Retrieves existing distributionpolicies | 

| DeleteDistributionPolicy | Delete a distribution policy by Id | 

| UpsertExceptionPolicy | Creates or updates an exception policy | 

| GetExceptionPolicy | Retrieves an existing exception policy by Id | 

| ListExceptionPolicies | Retrieves existing exception policies | 

| DeleteExceptionPolicy | Delete an exception policy by Id | 

| UpsertQueue| Creates or updates a queue | 

| GetQueue | Retrieves an existing queue by Id | 

| GetQueues | Retrieves existing queues | 

| DeleteQueue | Delete a queue by Id | 

| GetQueueStatistics | Retrieves a queue's statistics | 

| UpsertJob | Creates or updates a job | 

| GetJob | Retrieves an existing job by Id | 

| GetJobs | Retrieves existing jobs | 

| DeleteJob | Delete a queue policy by Id | 

| ReclassifyJob | Reclassify a job | 

| CancelJob | Submits request to cancel an existing job by Id while supplying free-form cancellation reason | 

| CompleteJob | Completes an assigned job | 

| CloseJob | Closes a completed job | 

| AcceptJobOffer | Accepts an offer to work on a job and returns a 409/Conflict if another agent accepted the job already | 

| DeclineJobOffer| Declines an offer to work on a job | 

| UpsertWorker | Creates or updates a worker | 

| GetWorker | Retrieves an existing worker by Id | 

| GetWorkers | Retrieves existing workers | 

| DeleteWorker | Deletes a worker and all of its traces | 
 

 :::image type="content" source="./media/acs-router-api-requests.png" alt-text="Diagram that shows the Job Router API requests.":::

## Next steps 

 

- Learn more about [Data Platform Metrics](../../../../azure-monitor/essentials/data-platform-metrics.md). 

 
