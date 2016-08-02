<properties 
	pageTitle="How to start streaming jobs in Stream Analytics | Microsoft Azure" 
	description="How run a streaming job in Azure Stream Analytics | learning path segment."
    keywords="streaming jobs"
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="07/27/2016" 
	ms.author="jeffstok"/>

# How to run a streaming job in Azure Stream Analytics

When a job input, query and output have all been specified you can start the Stream Analytics job.

To start your job:

1.	In the Azure Classic Portal, from the job dashboard, click **Start** at the bottom of the page.

    ![Start job Button](./media/stream-analytics-run-a-job/1-stream-analytics-run-a-job.png)  

    In the Azure Portal, click **Start** at the top of your job page.

    ![Azure Portal Start job Button](./media/stream-analytics-run-a-job/4-stream-analytics-run-a-job.png)  

2.	Specify a **Start Output** value to determine when this job will start producing output. The default setting for jobs that have not previously been started is **Job Start Time**, which means that the job will immediately start processing data. You can also specify a **Custom** time in the past (for consuming historical data) or the future (to delay processing until a future time). For cases when a job has been previously started and stopped, the option **Last Stopped Time** is available in order to resume the job from the last output time and avoid data loss.  

    ![Start streaming job Time](./media/stream-analytics-run-a-job/2-stream-analytics-run-a-job.png)  

    ![Azure Portal Start streaming job Time](./media/stream-analytics-run-a-job/5-stream-analytics-run-a-job.png)  

3.	Confirm your selection. The job status will change to *Starting* and will shortly move to *Running* once the job has started. You can monitor the progress of the **Start** operation in the **Notification Hub**:

    ![streaming job progress](./media/stream-analytics-run-a-job/3-stream-analytics-run-a-job.png)  

    ![Azure Portal stremaing job progress](./media/stream-analytics-run-a-job/6-stream-analytics-run-a-job.png)  

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
