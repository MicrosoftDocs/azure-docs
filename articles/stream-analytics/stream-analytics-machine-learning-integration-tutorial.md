---
title: Azure Stream Analytics and Machine Learning integration | Microsoft Docs
description: How to use a user-defined function and Machine Learning in a Stream Analytics job
keywords: ''
documentationcenter: ''
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: cfced01f-ccaa-4bc6-81e2-c03d1470a7a2
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 03/28/2017
ms.author: jeffstok
---

# Sentiment analysis by using Azure Stream Analytics and Azure Machine Learning
This article is designed to help you quickly set up a simple Azure Stream Analytics job, with Azure Machine Learning integration. We will use a sentiment analytics Machine Learning model from the Cortana Intelligence Gallery to analyze streaming text data, and determine the sentiment score in real time. The information in this article can help you understand scenarios such as real-time sentiment analytics on streaming Twitter data, analyze records of customer chats with support staff, and evaluate comments on forums, blogs, and videos, in addition to many other real-time, predictive scoring scenarios.

This article offers a sample CSV file with text as input in Azure Blob storage, shown in the following image. The job applies the sentiment analytics model as a user-defined function (UDF) on the sample text data from the blob store. The end result is placed in the same blob store in another CSV file. 

![Stream Analytics Machine Learning](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-figure-2.png)  

The following image demonstrates this configuration. For a more realistic scenario, you can replace Blob storage with streaming Twitter data from an Azure Event Hubs input. Additionally, you could build a [Microsoft Power BI](https://powerbi.microsoft.com/) real-time visualization of the aggregate sentiment.    

![Stream Analytics Machine Learning](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-figure-1.png)  

## Prerequisites
The prerequisites for completing the tasks that are demonstrated in this article are as follows:

* An active Azure subscription.
* A CSV file with some data in it. You can download the file shown in Figure 1 from [GitHub](https://github.com/Azure/azure-stream-analytics/blob/master/Sample Data/sampleinput.csv), or you can create your own file. For this article, we assume that you use the one provided for download on GitHub.

At a high level, to complete the tasks demonstrated in this article, you'll do the following:

1. Upload the CSV input file to Azure Blob storage.
2. Add a sentiment analytics model from the Cortana Intelligence Gallery to your Azure Machine Learning workspace.
3. Deploy this model as a web service in the Machine Learning workspace.
4. Create a Stream Analytics job that calls this web service as a function, to determine sentiment for the text input.
5. Start the Stream Analytics job and observe the output.

## Create a storage blob and upload the CSV input file
For this step, you can use any CSV file, such as the one already specified as available for download on GitHub. Uploading the csv file is simple as it is an option included in creating a storage blob.

For our tutorial, create a new storage account by clicking **New** and then searching for 'storage account' and then selecting the resulting icon for storage account and providing details for the creation of the account. Provide a **Name** (azuresamldemosa in my example), create or use an existing **Resource group** and specify a **Location** (for location, it is important that all the resources created in this demo all use the same location if possible).

![create storage account](./media/stream-analytics-machine-learning-integration-tutorial/create-sa.png)

Once that is completed you can click on Blob service and create a blob container.

![create blob container](./media/stream-analytics-machine-learning-integration-tutorial/create-sa2.png)

Then provide a **Name** for the container (azuresamldemoblob in my example) and verify the **Access type** is set to 'blob'.

![create blob access type](./media/stream-analytics-machine-learning-integration-tutorial/create-sa3.png)

Now we can populate the blob with our data. Select **Files** and then select the file on your local drive that you downloaded from GitHub. I selected Block blob and 4 MB as a size these should be fine for this demonstration. Then select **Upload** and the portal will create a blob with the text sample for you.

![create blob upload file](./media/stream-analytics-machine-learning-integration-tutorial/create-sa4.png)

Now that the sample data is in a blob it is time to enable the sentiment analysis model in Cortana Intelligence Gallery.

## Add the sentiment analytics model from the Cortana Intelligence Gallery
1. Download the [predictive sentiment analytics model](https://gallery.cortanaintelligence.com/Experiment/Predictive-Mini-Twitter-sentiment-analysis-Experiment-1) from the Cortana Intelligence Gallery.  
2. In Machine Learning Studio, select **Open in Studio**.  
   
   ![Stream Analytics Machine Learning, open Machine Learning Studio](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-open-ml-studio.png)  

3. Sign in to go to the workspace. Select the location that best suits your own location.
4. Click **Run** at the bottom of the page.  
5. After the process runs successfully, select **Deploy Web Service**.
6. The sentiment analytics model is ready to use. To validate, select the **Test** button and provide text input, such as, “I love Microsoft.” The test should return a result similar to the following:

`'Predictive Mini Twitter sentiment analysis Experiment' test returned ["4","0.715057671070099"]...`  

![Stream Analytics Machine Learning, analysis data](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-analysis-data.png)  

In the **Apps** column, select the link for **Excel 2010 or earlier workbook** to get your API key and the URL that you’ll need later to set up the Stream Analytics job. (This step is required only to use a Machine Learning model from another Azure account workspace. This article assumes this is the case, to address that scenario.)  

Note the web service URL and access key from the downloaded Excel file, as shown below:  

![Stream Analytics Machine Learning, quick glance](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-quick-glance.png)  

## Create a Stream Analytics job that uses the Machine Learning model
1. Go to the [Azure portal](https://portal.azure.com).  
2. Click **New** > **Intelligence + analytics** > **Stream Analytics**. Enter a name for your job in **Job name**, specify an existing resource group or create a new one as required, and enter the appropriate location for the job in the **Location** field.    
   
   ![create job](./media/stream-analytics-machine-learning-integration-tutorial/create-job-1.png)
   
3. After the job is created, on the **Inputs** tab, select **Add an Input**.  
   
   ![Stream Analytics Machine Learning, add Machine Learning input](./media/stream-analytics-machine-learning-integration-tutorial/create-job-add-input.png)  

4. Select **Add** and then specify an **Input alias**, select **Data stream**, **Blob Storage** as the input, and then select **Next**.  
5. On the **Blob Storage Settings** page of the wizard, provide the storage account blob container name you defined earlier when you uploaded the data. Click **Next**. For **Event Serialization Format**, select **CSV**. Accept the default values for the rest of the **Serialization settings** page. Click **OK**.  
   
   ![add input blob container](./media/stream-analytics-machine-learning-integration-tutorial/create-job-add-input-blob.png)

6. On the **Outputs** tab, select **Add an Output**.  
   
   ![Stream Analytics Machine Learning, add output](./media/stream-analytics-machine-learning-integration-tutorial/create-output.png)  

7. Click **Blob Storage**, and then enter the same parameters, except for the container. The value for **Input** was configured to read from the container named “test” where the **CSV** file was uploaded. For **Output**, enter “testoutput”.
8. Validate that the output’s **Serialization settings** are set to **CSV**, and then select the **OK** button.
   
   ![Stream Analytics Machine Learning, add output](./media/stream-analytics-machine-learning-integration-tutorial/create-output2.png) 

9. On the **Functions** tab, select **Add a Machine Learning Function**.  
   
   ![Stream Analytics Machine Learning, add Machine Learning function](./media/stream-analytics-machine-learning-integration-tutorial/add-function.png)  

10. On the **Machine Learning Web Service Settings** page, locate the Machine Learning workspace, web service, and default endpoint. For this article, apply the settings manually to gain familiarity with configuring a web service for any workspace, as long as you know the URL and have the API key. Enter the endpoint **URL** and **API key**. Click **OK**. Note that the **Function Alias** is 'sentiment'.  
    
    ![Stream Analytics Machine Learning, Machine Learning web service](./media/stream-analytics-machine-learning-integration-tutorial/add-function-endpoints.png)    

11. On the **Query** tab, modify the query as follows:    
    
    ```
    WITH sentiment AS (  
      SELECT text, sentiment(text) as result from datainput  
    )  
    
    Select text, result.[Scored Labels]  
    Into testoutput  
    From sentiment  
    ```    

12. Click **Save** to save the query.

## Start the Stream Analytics job and observe the output
1. Click **Start** at the top of the job page.
2. On the **Start Query Dialog**, select **Custom Time**, and then select one day prior to when you uploaded the CSV to Blob storage. Click **OK**.  
3. Go to the Blob storage by using the tool you used to upload the CSV file, for example, Visual Studio.
4. A few minutes after the job is started, the output container is created and a CSV file is uploaded to it.  
5. Open the file in the default CSV editor. Something similar to the following should be displayed:  
   
   ![Stream Analytics Machine Learning, CSV view](./media/stream-analytics-machine-learning-integration-tutorial/stream-analytics-machine-learning-integration-tutorial-csv-view.png)  

## Conclusion
This article demonstrates how to create a Stream Analytics job that reads streaming text data and applies sentiment analytics to the data in real time. You can accomplish all of this without needing to worry about the intricacies of building a sentiment analytics model. This is one of the advantages of the Cortana Intelligence Suite.

You also can view Azure Machine Learning function-related metrics. To do this, select the **Monitor** tab. Three function-related metrics are displayed.  

* **Function Requests** indicates the number of requests sent to a Machine Learning web service.  
* **Function Events** indicates the number of events in the request. By default, each request to a Machine Learning web service contains up to 1,000 events.  
  
    ![Stream Analytics Machine Learning, Machine Learning monitor view](./media/stream-analytics-machine-learning-integration-tutorial/job-monitor.png)  

