---
title: Monitor Azure Load Testing data reference
description: Important reference material needed when you monitor Azure Load Testing
author: Sachid26
ms.topic: reference
ms.author: sacsharm
ms.service: load-testing
ms.custom: subject-monitoring
ms.date: 06/02/2023
---
# Monitor Azure Load Testing data reference

Learn about the data and resources collected by Azure Monitor from your Azure load testing instance. See [Monitor Azure Load Testing](monitor-load-testing.md) for details on collecting and analyzing monitoring data.

## Resource logs

This section lists the types of resource logs you can collect for Azure Load Testing.


### Operational logs

Operational log entries include elements listed in the following table:

|Name  |Description  |
|---------|---------|
|TimeGenerated     | Date and time when the record was created       |
|RequestMethod     | HTTP Method of the API request       |
|HttpStatusCode     | HTTP status code of the API response        |
|CorrelationId     | Unique identifier to be used to correlate logs        |
|RequestId     |   Unique identifier to be used to correlate request logs      |
|Identity     | JSON structure containing information about the caller        |
|RequestBody     | Request body of the API calls        |
|ResourceRegion     | Region where the resource is located        |
|ServiceLocation     |Location of the service which processed the request         |
|RequestUri     |URI of the API request         |
|OperationId     |Operation identifier for rest api         |
|OperationName     |Name of the operation attempted on the resource         |
|ResultType     | Indicates if the request was successful or failed        |
|DurationMs     |Amount of time it took to process request in milliseconds         |
|CallerIpAddress     |IP Address of the client that submitted the request         |
|FailureDetails     |Details of the error in case if request is failed         |
|UserAgent     |HTTP header passed by the client, if applicable         |
|OperationVersion     | Request api version        |

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitor Azure Load Testing](./monitor-load-testing.md) for a description of monitoring Azure Load Testing.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.