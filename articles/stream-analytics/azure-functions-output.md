---
title: Azure Functions output from Azure Stream Analytics
description: This article describes Azure functions as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/28/2021
---

# Azure Functions output from Azure Stream Analytics

Azure Functions is a serverless compute service that you can use to run code on-demand without having to explicitly provision or manage infrastructure. It lets you implement code that's triggered by events occurring in Azure or partner services. This ability of Azure Functions to respond to triggers makes it a natural output for Azure Stream Analytics. This output adapter enables users to connect Stream Analytics to Azure Functions, and run a script or piece of code in response to a variety of events.

Azure Functions output from Stream Analytics is not available in Microsoft Azure operated by 21Vianet and Azure Germany (T-Systems International). Connection to Azure Functions inside a virtual network (VNet) from a Stream Analytics job that is running in a multi-tenant cluster is also not supported.

Azure Stream Analytics invokes Azure Functions via HTTP triggers. The Azure Functions output adapter is available with the following configurable properties:

| Property name | Description |
| --- | --- |
| Function app |The name of your Azure Functions app. |
| Function |The name of the function in your Azure Functions app. |
| Key |If you want to use an Azure Function from another subscription, you can do so by providing the key to access your function. |
| Max batch size |A property that lets you set the maximum size for each output batch that's sent to your Azure function. The input unit is in bytes. By default, this value is 262,144 bytes (256 KB). |
| Max batch count  |A property that lets you specify the maximum number of events in each batch that's sent to Azure Functions. The default value is 100. |

Azure Stream Analytics expects HTTP status 200 from the Functions app for batches that were processed successfully.

When Azure Stream Analytics receives a 413 ("http Request Entity Too Large") exception from an Azure function, it reduces the size of the batches that it sends to Azure Functions. In your Azure function code, use this exception to make sure that Azure Stream Analytics doesn't send oversized batches. Also, make sure that the maximum batch count and size values used in the function are consistent with the values entered in the Stream Analytics portal.

> [!NOTE]
> During test connection, Stream Analytics sends (POST) an empty batch to Azure Functions to test if the connection between the two works. Make sure that your Functions app handles empty batch requests to make sure test connection passes.

Also, in a situation where there's no event landing in a time window, no output is generated. As a result, the **computeResult** function isn't called. This behavior is consistent with the built-in windowed aggregate functions.

## Partitioning

The partition key is based on the PARTITION BY clause in the query. The number of output writers follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md).

## Output batch size

The default batch size is 262,144 bytes (256 KB). The default event count per batch is 100. The batch size is configurable and can be increased or decreased in the Stream Analytics output options.

## Limitation

Azure Functions should complete its request in under 100 seconds as the HTTP client times out after 100 seconds. If it takes more than 100 seconds for Azure  Functions to process a batch of data,  there is a timeout that will trigger a retry. This retry can result in duplicate data because Azure Functions will process the data again and potentially produce the same output since it may have been outputted partially in the previous request

## Code samples

The Azure Functions output can be used to relay messages into unsupported databases, [like Redis](stream-analytics-with-azure-functions.md), or update tables [in Azure SQL](sql-database-upsert.md).

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)
