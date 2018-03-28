---
title: Create a Stream Analytic job by using Azure portal | Microsoft Docs
description: This quickstart shows you how to get started by creating a Stream Analytic job, configuring inputs, outputs, and defining a query.
services: stream-analytics
keywords: Stream analytics, Cloud jobs, Azure portal, job input, job output, job transformation

author: SnehaGunda
ms.author: sngun
ms.date: 03/16/2018
ms.topic: quickstart
ms.service: stream-analytics
ms.custom: mvc
manager: kfile
#Customer intent: "As an IT admin/developer I want to create a Stream Analytics job, configure input and output & analyze data by using Azure portal."
---

# Quickstart: Create a Stream Analytic job by using Azure portal

Azure Stream Analytics is a managed event processing engine that does real-time analytic computations on streaming data. This quickstart shows you how to get started by creating a Stream Analytic job, configuring inputs, outputs, and defining a query. The scenario in this article describes reading data from the blob storage, transforming the data and writing it back to a different container in the same blob storage.

## Before you begin

* If you don't have an Azure subscription, create a [free account.](https://azure.microsoft.com/free/)
* Log in to the [Azure portal](https://portal.azure.com/).
* Download the [sensor sample data](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/GettingStarted/HelloWorldASA-InputStream.json) from GitHub.

## Create a Stream Analytics job

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.  
2. Select **Data+Analytics** > and then **Stream Analytics job** from the results list.  
3. Fill out the Stream Analytics job blade with the following information:

   ![Create job](./media/stream-analytics-quick-create-portal/create-job.png)

   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Job name   |  myJob   |   Enter a name to identify your Stream Analytics job. Stream Analytics job name can contain alphanumeric characters, hyphens, and underscores only and it must be between 3 and 63 characters long. |
   |Subscription  | \<Your subscription\> |  Select the Azure subscription that you want to use for this job. |
   |Resource group   |   myResourceGroup  |   Select **Create New** and enter a new resource-group name for your account. For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   |Location  |  \<Select the region that is closest to your users\> | Select geographic location where you can host your Stream Analytics job. Use the location that's closest to your users for better performance and to reduce the data transfer cost. |
   |Streaming units  | 1  |   Streaming units represent the computing resources that are required to execute a job. By default, this value is set to 1. To learn about scaling streaming units, refer to [understanding and adjusting streaming units](stream-analytics-streaming-unit-consumption.md) article.   |
   |Hosting environment  |  Cloud  |   Stream Analytics jobs can be deployed to cloud or edge. Cloud allows you to deploy to Azure Cloud, and Edge allows you to deploy to an IoT edge device. |

4. Check the **Pin to dashboard** box to place your job on your dashboard and then select **Create**.  
5. You should see a 'Deployment in progress...' displayed in the top right of your browser window. 

## Configure input to the job

In this section, you will configure blob storage as an input to the Stream Analytics job. Before configuring the input, create a blob storage account.  

### Create a blob storage account and upload sample data

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.  
2. Select **Storage** > and then **Storage account** from the results list.  
3. Fill out the Storage account job blade with the **Name** and **Resource group** details (host the storage account in the same resource group as the Streaming job for increased performance), you can leave other options to their default values.  
4. Go to the Storage account you created in the above step > Under **Overview** > open the **Blobs** tile.  
5. Under the **Blob Service** > click **Container** > provide a **Name** for your container, such as *container1* > change the **Public access level** to Blob (anonymous read access for blobs only) > Click **OK**.  
6. Go to the container that’s created > select Upload > upload the [sensor sample data](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/GettingStarted/HelloWorldASA-InputStream.json) that you downloaded earlier.  

   ![Upload sample data to blob](./media/stream-analytics-quick-create-portal/upload-sample-data-to-blob.png)
 
### Add the input 

1. Navigate to your Stream Analytics job.  
2. Select **Inputs** > **Add Stream input** > **Blob storage**.  
3. Fill out the **Blob storage** blade with the following values:

   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Input alias  |  BlobInput   |  Enter a name to identify the job’s input.   |
   |Subscription   |  \<Your subscription\> |  Select the Azure subscription that has the storage account you created. The storage account can be in the same or in a different subscription. This example assumes that you have created storage account in the same subscription. |
   |Storage account  |  myasastorageaccount |  Choose or enter the name of the storage account. Storage account names are automatically detected if they are created in the same subscription. |
   |Container  | container1 | Choose the name of the container that has sample data. Container names are automatically detected if they are created in the same subscription. |

4. Leave other options to default values and click **Save** to save the settings.  

   ![Configure input data](./media/stream-analytics-quick-create-portal/configure-input.png)
 
## Configure output to the job

1. Navigate to the Stream Analytics job that you created earlier.  
2. Select **Outputs > Add > Blob storage**.  
3. Fill out the **Blob storage** blade with the following values:


   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Output alias |   BlobOutput   |   Enter a name to identify the job’s output. |
   |Subscription  |  \<Your subscription\>  |  Select the Azure subscription that has the storage account you created. The storage account can be in the same or in a different subscription. This example assumes that you have created storage account in the same subscription. |
   |Storage account |  myasastorageaccount |   Choose or enter the name of the storage account. Storage account names are automatically detected if they are created in the same subscription.       |
   |Container |   container2  |  Create a new container in the same storage account that you used for input.   |

4. Leave other options to default values and click **Save** to save the settings.  

   ![Configure output](./media/stream-analytics-quick-create-portal/configure-output.png)
 
## Define the transformation query

1. Navigate to the Stream Analytics job that you created earlier.
2. Select **Query** > and update the query as follows:

   ```sql
   SELECT
      time,
      dspl as SensorName,
      temp as Temperature,
      hmdt as Humidity
   INTO
     BlobOutput
   FROM
     BlobInput
   ```

3. In this example, the query reads the data from blob and copies it to a new file in the blob > click **Save**.

   ![Configure job transformation](./media/stream-analytics-quick-create-portal/configure-job-transformation.png)

## Start the Stream Analytics job and check the output

1. Return to the job overview blade > Click **Start**  
2. Under **Start job**, select **Custom**, > In the **Start time** field, and then select one day prior to when you uploaded the file to blob storage because the time at which the file was uploaded is earlier that the current time. When you're done, click **Start**.  

   ![Start the job](./media/stream-analytics-quick-create-portal/start-the-job.png)

3. After few minutes, In the portal, find the storage account & the container that you have configured as output for the job. You can now see the output file in the container. The job takes a few minutes to start for the first time, after it is started, it will continue to run as the data arrives.

   ![Transformed output](./media/stream-analytics-quick-create-portal/transformed-output.png)

## Clean up resources

When no longer needed, delete the resource group, the streaming job, and all related resources. Deleting the job avoids billing the streaming units consumed by the job. If you're planning to use the job in future, you can stop it and re-start it later when you need. If you are not going to continue to use this job, delete all resources created by this quickstart by using the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created.  
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you’ve deployed a simple Stream analytics job, to learn about configuring other input sources and performing real-time detection, continue to the following article:

> [!div class="nextstepaction"]
> [Real-time fraud detection using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)

