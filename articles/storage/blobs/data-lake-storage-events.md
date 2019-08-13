---
title: 'Use Azure Event Grid to populate a Databricks Delta table in Azure Data Lake Storage Gen2 | Microsoft Docs'
description: This tutorial shows you how to use an Event Grid subscription, an Azure Function, and an Azure Databricks job to insert rows of data into a table that is stored in Azure DataLake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: tutorial
ms.date: 08/06/2019
ms.author: normesta
ms.reviewer: sumameh
---

# Tutorial: Use Event Grid to populate a Databricks Delta table in Azure Data Lake Storage Gen2

This tutorial shows you how to handle events in storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2). This tutorial helps you build a solution that enables you to upload a file that describes a new sales order. An Event Grid subscription notifies an Azure Function and passes information to that function which describes the file that was uploaded. The Azure Function runs a Job in Azure Databricks which inserts a row into a Databricks Delta table that is located in the storage account.

In this tutorial, you will:

> [!div class="checklist"]
> * Create an Event Grid subscription that calls the Azure Function when a file that describes a new order is uploaded to the storage account.
> * Create an Azure Function that receives a notification from an event, and then runs the job in Azure Databricks.
> * Create a job that inserts a customer order row into a Databricks Delta table that is located in a storage account.

We'll build this solution in reverse order, starting with the Azure Databricks workspace.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* Create a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2). This tutorial uses a storage account named `contosoorders`. Make sure that your user account has the [Storage Blob Data Contributor role](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac) assigned to it.

  See [Create an Azure Data Lake Storage Gen2 account](data-lake-storage-quickstart-create-account.md).

* Create a service principal. See [How to: Use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

  There's a couple of specific things that you'll have to do as you perform the steps in that article.

  :heavy_check_mark: When performing the steps in the [Assign the application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role) section of the article, make sure to assign the **Storage Blob Data Contributor** role to the service principal.

  > [!IMPORTANT]
  > Make sure to assign the role in the scope of the Data Lake Storage Gen2 storage account. You can assign a role to the parent resource group or subscription, but you'll receive permissions-related errors until those role assignments propagate to the storage account.

  :heavy_check_mark: When performing the steps in the [Get values for signing in](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section of the article, paste the tenant ID, app ID, and password values into a text file. You'll need those soon.

## Create initial data

1. Open Azure Storage Explorer, navigate to your storage account, and in the **Blob Containers** section, create a new container named **data**.

   ![data folder](./media/data-lake-storage-events/data-container.png "data folder")

   For more information about how to use Storage Explorer, see [Use Azure Storage Explorer to manage data in an Azure Data Lake Storage Gen2 account](data-lake-storage-explorer.md).

2. In the **data** container, create a folder named **input**.

3. Paste the following text into a text editor.

   ```
   InvoiceNo,StockCode,Description,Quantity,InvoiceDate,UnitPrice,CustomerID,Country
   536365,85123A,WHITE HANGING HEART T-LIGHT HOLDER,6,12/1/2010 8:26,2.55,17850,United Kingdom
   ```

4. Save this file to your local computer and give it the name **data.csv**.

5. In Storage Explorer, upload this file to the **input** folder.  

## Create a job in Azure Databricks

In this section, you'll perform these tasks:

* Create an Azure Databricks workspace.
* Create and populate a Databricks Detla table.
* Add upload and insert capability to the notebook.
* Create a Job.

### Create an Azure Databricks workspace

In this section, you create an Azure Databricks workspace using the Azure portal.

1. In the Azure portal, select **Create a resource** > **Analytics** > **Azure Databricks**.

    ![Databricks on Azure portal](./media/data-lake-storage-quickstart-create-databricks-account/azure-databricks-on-portal.png "Databricks on Azure portal")

2. Under **Azure Databricks Service**, provide the values to create a Databricks workspace.

    ![Create an Azure Databricks workspace](./media/data-lake-storage-events/new-databricks-service.png "Create an Azure Databricks workspace")

3. The account creation takes a few minutes. To monitor the operation status, view the progress bar at the top.

### Create and populate a Databricks Delta table

In this section, you create a notebook in Azure Databricks workspace and then run code snippets to set up the customer table in the storage account.

1. In the [Azure portal](https://portal.azure.com), go to the Azure Databricks workspace you created, and then select **Launch Workspace**.

2. In the left pane, select **Workspace**. From the **Workspace** drop-down, select **Create** > **Notebook**.

    ![Create notebook in Databricks](./media/data-lake-storage-quickstart-create-databricks-account/databricks-create-notebook.png "Create notebook in Databricks")

3. In the **Create Notebook** dialog box, enter a name for the notebook. Select **Python** as the language, and then select the Spark cluster that you created earlier.

    ![Create notebook in Databricks](./media/data-lake-storage-events/new-databricks-notebook.png "Create notebook in Databricks")

    Select **Create**.

4. Copy and paste the following code block into the first cell, but don't run this code yet.

    ```Python
    dbutils.widgets.text('source_file', "", "Source File")

    spark.conf.set("fs.azure.account.auth.type", "OAuth")
    spark.conf.set("fs.azure.account.oauth.provider.type", "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
    spark.conf.set("fs.azure.account.oauth2.client.id", "<appId")
    spark.conf.set("fs.azure.account.oauth2.client.secret", "<password>")
    spark.conf.set("fs.azure.account.oauth2.client.endpoint", "https://login.microsoftonline.com/<tenant>/oauth2/token")
    spark.conf.set("fs.azure.createRemoteFileSystemDuringInitialization", "true")

    adlsPath = 'abfss://data@contosoorders.dfs.core.windows.net/'
    inputPath = adlsPath + dbutils.widgets.get('source_file')
    customerTablePath = adlsPath + 'delta-tables/customers'
    ```

5. In this code block, replace the `appId`, `password`, `tenant` placeholder values in this code block with the values that you collected while completing the prerequisites of this tutorial.

6. Press the **SHIFT + ENTER** keys to run the code in this block.

7. Copy and paste the following code block into a different cell, then press the **SHIFT + ENTER** keys to run the code in this block. This code configures the structure of your databricks delta table and then loads some initial data from the csv file that you uploaded earlier.

   ```Python
   from pyspark.sql.types import StructType, StructField, DoubleType, IntegerType, StringType


   inputSchema = StructType([
   StructField("InvoiceNo", IntegerType(), True),
   StructField("StockCode", StringType(), True),
   StructField("Description", StringType(), True),
   StructField("Quantity", IntegerType(), True),
   StructField("InvoiceDate", StringType(), True),
   StructField("UnitPrice", DoubleType(), True),
   StructField("CustomerID", IntegerType(), True),
   StructField("Country", StringType(), True)
   ])

   rawDataDF = (spark.read
    .option("header", "true")
    .schema(inputSchema)
    .csv(adlsPath + 'input')
   )

   (rawDataDF.write
     .mode("overwrite")
     .format("delta")
     .saveAsTable("customer_data", path=customerTablePath))
   ```

8. After this code block successfully runs, remove this code block from your notebook. You no longer need it.

### Add upload and insert capability to the notebook

1. Copy and paste the following code block into a different cell, but don't run this cell.

   ```Python
   upsertDataDF = (spark
     .read
     .option("header", "true")
     .csv(inputPath)
   )
   upsertDataDF.createOrReplaceTempView("customer_data_to_upsert")
   ```

   This code uploads and inserts data from a csv file identified by the widget that you added earlier. We'll populate that widget by using a function app when the event is triggered.

2. Add the following code to merge the temporary table with the actual table:

   ```
   %sql
   MERGE INTO customer_data cd
   USING customer_data_to_upsert cu
   ON cd.CustomerID = cu.CustomerID
   WHEN MATCHED THEN
     UPDATE SET
       cd.StockCode = cu.StockCode,
       cd.Description = cu.Description,
       cd.InvoiceNo = cu.InvoiceNo,
       cd.Quantity = cu.Quantity,
       cd.InvoiceDate = cu.InvoiceDate,
       cd.UnitPrice = cu.UnitPrice,
       cd.Country = cu.Country
   WHEN NOT MATCHED
     THEN INSERT (InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID, Country)
     VALUES (
       cu.InvoiceNo,
       cu.StockCode,
       cu.Description,
       cu.Quantity,
       cu.InvoiceDate,
       cu.UnitPrice,
       cu.CustomerID,
       cu.Country)
   ```

### Create a Job

1. Click **Jobs**.

2. In the **Jobs** page, click **Create Job**.

3. Give the job a name, and then choose the `upsert-order-data` workbook.

   ![Create a job](./media/data-lake-storage-events/create-spark-job.png "Create a job")

4. Start the job (put exact steps here)

## Create an Azure Function

1. In the upper corner of the workspace, choose the people icon, and then choose **User settings**.

   ![Manage account](./media/data-lake-storage-events/generate-token.png "User settings")

2. Click the **Generate new token**, and then click **Generate**.

   Make sure to copy to the token to safe place. You'll need this later.
  
3. Select the **Create a resource** button found on the upper left-hand corner of the Azure portal, then select **Compute > Function App**.

   ![Create an Azure function](./media/data-lake-storage-events/function-app-create-flow.png "Create Azure function")

4. Configure the function app.

   ![Configure the function app](./media/data-lake-storage-events/new-function-app.png "Configure the function app")

5. Add configuration variables.

   ![Configure the function app](./media/data-lake-storage-events/configure-function-app.png "Configure the function app")

6. Choose the **New application setting** button to add settings.

   ![Add configuration setting](./media/data-lake-storage-events/add-application-setting.png "Add configuration setting")

   Add the following settings by using this approach:

   |Setting name | Value |
   |----|----|
   |**DBX_INSTANCE**| The region of your databricks workspace. For example: `westus2.azuredatabricks.net`|
   |**DBX_PAT**| The personal access token that you generated earlier. |
   |**DBX_JOB_ID**|The identifier of the running job. In our case, this value is `1`.|

7. In the overview page of the function app, click the **New function** button.

   ![New function](./media/data-lake-storage-events/new-function.png "New function")

8. Choose **Azure Event Grid Trigger**.

   You might be prompted to install the **Microsoft.Azure.WebJobs.Extensions.EventGrid** extension. If you are, install it. If you have to install it, then you'll have to choose **Azure Event Grid Trigger** again to create the function.

   The **New Function** pane appears.

9. In the **New Function** pane, name the function **UpsertOrder**, and then click the **Create** button.

10. Replace the contents of the code file with this code, and then click the **Save** button:

   ```cs
   using "Microsoft.Azure.EventGrid"
   using "Newtonsoft.Json"
   using Microsoft.Azure.EventGrid.Models;
   using Newtonsoft.Json;
   using Newtonsoft.Json.Linq;

   private static HttpClient httpClient = new HttpClient();

   public static async Task Run(EventGridEvent eventGridEvent, ILogger log)
   {
       log.LogInformation("Event Subject: " + eventGridEvent.Subject);
       log.LogInformation("Event Topic: " + eventGridEvent.Topic);
       log.LogInformation("Event Type: " + eventGridEvent.EventType);
       log.LogInformation(eventGridEvent.Data.ToString());

       if (eventGridEvent.EventType == "Microsoft.Storage.BlobCreated" || eventGridEvent.EventType == "Microsoft.Storage.FileRenamed") {
           var fileData = ((JObject)(eventGridEvent.Data)).ToObject<StorageBlobCreatedEventData>();
           if (fileData.Api == "FlushWithClose") {
               log.LogInformation("Triggering Databricks Job for file: " + fileData.Url);
               var fileUrl = new Uri(fileData.Url);
               var httpRequestMessage = new HttpRequestMessage {
                   Method = HttpMethod.Post,
                   RequestUri = new Uri(String.Format("https://{0}/api/2.0/jobs/run-now", System.Environment.GetEnvironmentVariable("DBX_INSTANCE", EnvironmentVariableTarget.Process))),
                   Headers = { 
                       { System.Net.HttpRequestHeader.Authorization.ToString(), "Bearer " + System.Environment.GetEnvironmentVariable("DBX_PAT", EnvironmentVariableTarget.Process)},
                       { System.Net.HttpRequestHeader.ContentType.ToString(), "application/json" }
                   },
                   Content = new StringContent(JsonConvert.SerializeObject(new {
                       job_id = System.Environment.GetEnvironmentVariable("DBX_JOB_ID", EnvironmentVariableTarget.Process),
                       notebook_params = new {
                           source_file = String.Join("", fileUrl.Segments.Skip(2))
                       }
                   }))
                };
               var response = await httpClient.SendAsync(httpRequestMessage);
               response.EnsureSuccessStatusCode();
           }
       }  
   }
   ```

## Create an Event Grid subscription

1. In the function code page, click the **Add Event Grid subscription** button.

   ![New event subscription](./media/data-lake-storage-events/new-event-subscription.png "New event subscription")

2. In the **Create Event Subscription** page, name the subscription, and then use the fields in the page to select your storage account.

   ![New event subscription](./media/data-lake-storage-events/new-event-subscription-2.png "New event subscription")

3. In the **Filter to Event Types** drop-down list, select the **Blob Created**, and **Blob Deleted** events, and then click the **Create** button.

## Test the Event Grid subscription

1. Create a file named `customer-order.csv` and paste the following information into that file, and save it to your local.

   ```
   InvoiceNo,StockCode,Description,Quantity,InvoiceDate,UnitPrice,CustomerID,Country
   536371,99999,EverGlow Single,228,1/1/2018 9:01,33.85,20993,Sierra Leone
   ```

3. In Storage Explorer, upload this file to the **input** folder to begin the process.

4. Check that the job succeeded. Open your databricks workspace, and click **Jobs**, and then open the job that you started in an earlier step.

5. Select the job to open the job page.

   ![Spark job](./media/data-lake-storage-events/spark-job.png "Spark job")

   When the job completes, you'll see a completion status.

   ![Successfully completed job](./media/data-lake-storage-events/spark-job-completed.png "Successfully completed job")

5. In a new workbook cell, run this query in a cell to see the updated delta table.

   ```
   %sql select * from customer_data
   ```

   The returned tabled shows the latest record.

## Clean up resources

When they're no longer needed, delete the resource group and all related resources. To do so, select the resource group for the storage account and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Reacting to Blob storage events](storage-blob-event-overview.md)
