---
title: Clean up your Azure Stream Analytics job
description: This article is a guide for how to delete Azure Stream Analytics jobs.
services: stream-analytics
author: mamccrea
manager: kfile
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/22/2018
---

# Clean up your Azure Stream Analytics job

Azure Stream Analytics jobs can be easily deleted through the Azure portal, Azure PowerShell, Azure SDK for .Net, or REST API.

>[!NOTE] 
>When you stop your Stream Analytics job, the data persists only in the input and output storage, such as Event Hubs or Azure SQL Database. If you are required to remove data from Azure, be sure to follow the removal process for the input and output resources of your Stream Analytics job.

## Stop a job in Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com). 

2. Locate your running Stream Analytics job and select it.

3. On the Stream Analytics job page, select **Stop** to stop the job. 

   ![Stop Job](./media/stream-analytics-clean-up-your-job/stop-job.png)


## Delete a job in Azure portal

1. Sign in to the Azure portal. 

2. Locate your existing Stream Analytics job and select it.

3. On the Stream Analytics job page, select **Delete** to delete the job. 

   ![Delete Job](./media/stream-analytics-clean-up-your-job/delete-job.png)


## Stop or delete a job using PowerShell

To stop a job using PowerShell, use the [Stop-AzureRmStreamAnalyticsJob](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/stop-azurermstreamanalyticsjob?view=azurermps-5.7.0) cmdlet. To delete a job using PowerShell, use the [Remove-AzureRmStreamAnalyticsJob](https://docs.microsoft.com/powershell/module/azurerm.streamanalytics/Remove-AzureRmStreamAnalyticsJob?view=azurermps-5.7.0) cmdlet.

## Stop or delete a job using Azure SDK for .NET

To stop a job using Azure SDK for .NET, use the [StreamingJobsOperationsExtensions.BeginStop](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.streamanalytics.streamingjobsoperationsextensions.beginstop?view=azure-dotnet) method. To delete a job using Azure SDK for .NET, [StreamingJobsOperationsExtensions.BeginDelete](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.streamanalytics.streamingjobsoperationsextensions.begindelete?view=azure-dotnet) method.

## Stop or delete a job using REST API

To stop a job using REST API, refer to the [Stop](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-job#stop) method. To delete a job using REST API, refer to the [Delete](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-job#delete) method.