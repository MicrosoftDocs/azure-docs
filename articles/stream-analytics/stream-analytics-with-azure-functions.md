---
title: Run Azure Functions with Azure Stream Analytics jobs  | Microsoft Docs
description: Learn how to configure Azure Function as an output sink to the Stream Analytic jobs.
keywords: data output, streaming data, Azure Function
documentationcenter: ''
services: stream-analytics
author: SnehaGunda
manager: kfile

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 12/19/2017
ms.author: sngun

---

# Run Azure Functions with Azure Stream Analytics jobs 
 
> [!IMPORTANT]
> This functionality is in preview.

You can run Azure Functions with Azure Stream Analytics by configuring Azure Functions as one of the output sinks to the Stream Analytics job. Azure Function is an event driven, compute-on-demand experience that lets you implement code that is triggered by events occurring in Azure or third-party services. This ability of Azure Function to respond to triggers makes it a natural output to Azure Stream Analytics job.

Azure Stream Analytics invokes Azure Function through HTTP triggers. The Azure Function output adapter allows users to connect Azure Functions to Stream Analytics such that the events can be triggered based on the Stream Analytics queries. 

This tutorial demonstrates how to connect Azure Stream Analytics to [Azure Redis Cache](../redis-cache/cache-dotnet-how-to-use-azure-redis-cache.md) using [Azure Functions](../azure-functions/functions-overview.md). 

## Configure Stream Analytics job to run an Azure Function 

This section demonstrates how to configure a Stream Analytics job to run an Azure Function that writes data to Azure Redis Cache. The Stream Analytics job reads events from the Event Hub, executes a query that invokes the Azure function. This Azure Function reads data from the Stream Analytics job and writes it to the Azure Redis Cache.

![Graphic to illustrate the tutorial](./media/stream-analytics-with-azure-functions/image1.png)

The following steps are required to achieve this task:
* [Create Stream Analytics job with Event Hub as input.](#create-stream-analytics-job-with-event-hub-as-input)  
* [Create an Azure Redis Cache.](#create-an-azure-redis-cache)  
* [Create an Azure Function that can write data to the Redis Cache.](#create-an-azure-function-that-can-write-data-to-the-redis-cache)    
* [Update the Stream Analytic job with Azure Function as output.](#update-the-stream-analytic-job-with-azure-function-as-output)  
* [Check Redis Cache for results.](#check-redis-cache-for-results)  

## Create Stream Analytics job with Event Hub as input

Follow the [Real-time fraud detection](stream-analytics-real-time-fraud-detection.md) tutorial to create an event hub, start the event generator application, and create an Azure Stream Analytics (skip through the steps to create the query and the output, you will instead  setup an Azure Functions output in the next section.)

## Create an Azure Redis Cache

1. Create an Azure Redis Cache by using the steps described in [create a cache](../redis-cache/cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache) section of the Redis Cache article.  

2. After the Redis Cache is created, navigate to the created cache > **Access Keys** > and make a note of the **Primary connection string**.

   ![Redis Cache connection string](./media/stream-analytics-with-azure-functions/image2.png)

## Create an Azure Function that can write data to the Redis Cache

1. Use the [Create a function app](../azure-functions/functions-create-first-azure-function.md#create-a-function-app) section of the Azure Functions documentation to create an Azure Function App and a [HTTP-triggered Azure Function](../azure-functions/functions-create-first-azure-function.md#create-function) (aka Webhook) by using **CSharp** language.  

2. Navigate to the **run.csx** function and update it with the following code (make sure to replace the “\<your redis cache connection string goes here\>” text with the Redis Cache’s primary connection string that you retrieved in the previous section):  

   ```c#
   using System;
   using System.Net;
   using System.Threading.Tasks;
   using StackExchange.Redis;
   using Newtonsoft.Json;
   using System.Configuration;

   public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
   {
      log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");
    
      // Get the request body
      dynamic dataArray = await req.Content.ReadAsAsync<object>();

      // Throw an HTTP Request Entity Too Large exception when the incoming batch(dataArray) is greater than 256 KB. Make sure that the size value is consistent with the value entered in the Stream Analytics portal.

      if (dataArray.ToString().Length > 262144)
      {        
         return new HttpResponseMessage(HttpStatusCode.RequestEntityTooLarge);
      }
      var connection = ConnectionMultiplexer.Connect("<your redis cache connection string goes here>");
      log.Info($"Connection string.. {connection}");
    
      // Connection refers to a property that returns a ConnectionMultiplexer
      IDatabase db = connection.GetDatabase();
      log.Info($"Created database {db}");
    
      log.Info($"Message Count {dataArray.Count}");

      // Perform cache operations using the cache object. For example, the following code block adds few integral data types to the cache
      for (var i = 0; i < dataArray.Count; i++)
      {
        string time = dataArray[i].time;
        string callingnum1 = dataArray[i].callingnum1;
        string key = time + " - " + callingnum1;
        db.StringSet(key, dataArray[i].ToString());
        log.Info($"Object put in database. Key is {key} and value is {dataArray[i].ToString()}");
       
      // Simple get of data types from the cache
      string value = db.StringGet(key);
      log.Info($"Database got: {value}");
      }

      return req.CreateResponse(HttpStatusCode.OK, "Got");
}    

   ```

   When Azure Stream Analytics receives 413 (Http Request Entity Too Large) exception from the Azure function, it reduces the size of the batches it sends to Azure Functions. In your Azure function, use the following code to check that the Azure Stream Analytics doesn’t send oversized batches. Make sure that the maximum batch count and size values used in the function are consistent with the values entered in the Stream Analytics portal.

   ```c#
   if (dataArray.ToString().Length > 262144)
      {        
        return new HttpResponseMessage(HttpStatusCode.RequestEntityTooLarge);
      }
   ```

3. In a text editor of your choice, create a JSON file named **project.json** with the following code and save it on your local computer. This file contains the NuGet package dependencies required by the c# function.  
   
   ```json
       {
         "frameworks": {
             "net46": {
                 "dependencies": {
                     "StackExchange.Redis":"1.1.603",
                     "Newtonsoft.Json": "9.0.1"
                 }
             }
         }
     }

   ```
 
4. Go back to the Azure portal > Navigate to your Azure function > from the **Platform features** tab > click on **App Service Editor** that is located under **Development Tools**. 
 
   ![App service editor screen](./media/stream-analytics-with-azure-functions/image3.png)

5. In the App Service Editor, right click on your root directory and upload the **project.json** file. After the upload is successful, refresh the page, you should now see an autogenerated file named **project.lock.json**.  The autogenerated file contains references to the dlls that are specified in the Project.json file.  

   ![Upload project.json file](./media/stream-analytics-with-azure-functions/image4.png)

 

## Update the Stream Analytic job with Azure Function as output

1. Open your Azure Stream Analytics job on the Azure portal.  

2. Navigate to your Azure function > **Overview** > **Outputs** > **Add** a new output > select **Azure Function** for the Sink option. The new Azure Function output adapter is available with the following properties:  

   |**Property name**|**Description**|
   |---|---|
   |Output alias| A user-friendly name that you use in the job's query to reference the output. |
   |Import option| You can use azure function from the current subscription or provide the settings manually if the function is located in other subscription. |
   |Function App| Name of your Azure Function App. |
   |Function| Name of the function in your Function App (name of your run.csx function).|
   |Max Batch Size|This property is used to set the maximum size for each output batch, which is sent to your Azure Function. By default, this value is set to 256 KB.|
   |Max Batch Count|This property allows you to specify the maximum number of events in each batch that is sent to the Azure Function. The default max batch count value is 100. This property is optional.|
   |Key|This property allows you to use an Azure Function from another subscription. Provide the key value to access your function. This property is optional.|

3. Provide a name for the output alias. In this tutorial, we name it **saop1** (you can use any other name of your choice) and fill in other details.  

4. Open your Stream Analytics job, and update the query to the following (Make sure to replace the “saop1” text if you have named the output sink differently):  

   ```sql
    SELECT 
            System.Timestamp as Time, CS1.CallingIMSI, CS1.CallingNum as CallingNum1, 
            CS2.CallingNum as CallingNum2, CS1.SwitchNum as Switch1, CS2.SwitchNum as Switch2
        INTO saop1
        FROM CallStream CS1 TIMESTAMP BY CallRecTime
           JOIN CallStream CS2 TIMESTAMP BY CallRecTime
            ON CS1.CallingIMSI = CS2.CallingIMSI AND DATEDIFF(ss, CS1, CS2) BETWEEN 1 AND 5
        WHERE CS1.SwitchNum != CS2.SwitchNum
   ```

5. Start the telcodatagen.exe application by running the following command in command line (The command takes the format- `telcodatagen.exe [#NumCDRsPerHour] [SIM Card Fraud Probability] [#DurationHours]`)  
   
   **telcodatagen.exe 1000 .2 2**
    
6.	Start the Stream Analytics Job.

## Check Redis Cache for results

1. Navigate to the Azure portal and find your Redis Cache > select **Console**.  

2. Use [Redis cache commands](https://redis.io/commands) to verify that your data is in Redis cache. (The command takes the format- Get {key}). For example:

   **Get "12/19/2017 21:32:24 - 123414732"**

   This command should print the value for the specified key:

   ![Redis Cache output](./media/stream-analytics-with-azure-functions/image5.png)

## Known issues

* In the Azure portal, when you try to reset the Max Batch Size/ Max Batch Count value to empty(default), it changes back to the previously entered value upon save. Deliberately enter the default values for these fields in this case.

## Next steps
