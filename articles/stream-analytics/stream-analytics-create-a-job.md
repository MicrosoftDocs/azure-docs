---
title: How to create a data analytics processing job for Azure Stream Analytics
description: Create a data analytics processing job for Stream Analytics | learning path segment.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/28/2017
---
# How to create a data analytics processing job for Stream Analytics
The top-level resource in Azure Stream Analytics is a Stream Analytics Job.  It consists of one or more input data sources, a query expressing the data transformation, and one or more output targets that results are written to. Together these enable the user to perform data analytics processing for streaming data scenarios.

To start using Stream Analytics, begin by creating a new Stream Analytics job.  Note this action has no billing implications until the job is started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource** > **Data + Analytics** > **Stream Analytics job**.
3. Select **Create**.
   
3. Specify the desired configuration for the Stream Analytics job.
   
   * In the **Job Name** box, enter a name to identify the Stream Analytics job. When the **Job Name** is validated, a green check mark appears in the Job Name box. The **Job Name** may contain only alphanumeric characters and the '-' character, and must be between 3 and 63 characters.
   * Use **Location** to specify the geographic location where you want to run the job.
   * Specify a new or existing **Resource Group** to hold related resources for your application.
4. Select **Create**.
It can take a few minutes for the Stream Analytics job to be created. To check the status, you can monitor the progress in the Notifications hub.
    
   ![Azure portal Data analytics processing job Create Job](./media/stream-analytics-create-a-job/5-stream-analytics-create-a-job.png)  
5. The new job will show a status of **Created**. Notice that the **Start** button is disabled. Configure the job input, query, and output before you start the job.

   
   ![Azure portal Data analytics processing job status](./media/stream-analytics-create-a-job/6-stream-analytics-create-a-job.png)  

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

