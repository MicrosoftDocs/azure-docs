---
title: Access Azure Data Lake Storage Gen2 data with DataBricks using Spark
description: 
keywords: 
services: hdinsight,storage
documentationcenter: 
tags: azure-portal
author: dineshm
manager: jahogg
editor: cgronlun

ms.component: data-lake-storage-gen2
ms.service: hdinsight
ms.custom: 
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 6/27/2018
ms.author: dineshm
---

# Tutorial: Access Azure Data Lake Storage Gen2 data with DataBricks using Spark

In this tutorial, you learn how to run Spark queries on a DataBricks cluster to query data in Azure Data Lake Storage Gen2 account.

> [!div class="checklist"]
> * Create a DataBricks cluster
> * Ingest unstructured data into a storage account
> * Trigger an Azure Function to process data
> * Running analytics on your data in Blob storage

## Prerequisites

This tutorial demonstrates how to consume and query airline flight data, which is available from the [United States Department of Transportation](https://transtats.bts.gov/Tables.asp?DB_ID=120&DB_Name=Airline%20On-Time%20Performance%20Data&DB_Short_Name=On-Time). Download at least two year's worth of airline data (selecting all fields) and save the result to your machine. Make sure to take note of the file name and path of your download; you need this information in a later step.

> [!NOTE]
> Click on the **Prezipped file** checkbox to select all data fields. The download will be many gigabytes in size, but this amount of data is necessary for analysis.

## Create an Azure Data Lake Storage account

To begin, create a new [Azure Data Data Lake storage account](quickstart-create-account.md) and give it a unique name. Once created, navigate to the storage account to retrieve configuration settings.

> [!IMPORTANT]
> During Preview, Azure Functions only work with Azure Data Lake Storage accounts created with a flat namespace.

1. Under **Settings**, click  **Access keys**
3. Click the **Copy** button next to **key1** to copy the key value

Both the account name and key are required for later steps in this tutorial. Open a text editor and set aside the account name and key for future reference.

## Create DataBricks cluster

The next step is to create a [DataBricks service](https://docs.databricks.com/) to create a data workspace.

1. Create a [DataBricks service](https://ms.portal.azure.com/#create/Microsoft.Databricks) and name it **myFlightDataService** (make sure to check the *Pin to dashboard* checkbox as you create the service)
2. Click **Launch Workspace** to open the workspace in a new browser window
3. Click **Clusters** in the left-hand nav bar
4. Click **Create Cluster**
5. Enter a **myFlightDataCluster** in the *Cluster name* field
6. Select **Standard_D8s_v3** in the *Worker Type* field
7. Change the **Min Workers** value to *4*
8. Click **Create Cluster** at the top of the page (this process may take up to 5 minutes to complete)

While the request to create the cluster executes in the background, you can generate a DataBricks token.

### Create DataBricks token

A [DataBricks token](https://docs.databricks.com/api/latest/tokens.html) is required by a function that responds as data is created. The following steps demonstrate how to create a token and set it aside for next step. 

1. Click the profile icon (![Profile icon](./media/using-databricks-spark/databricks-workspace-profile-icon.png)) at the top right of the screen
2. Click **User Settings**
3. Click **Generate New Token**
4. Enter **myFlightDataToken** in the *Comment* field
5. Copy the token value from the browser into the text file where you have set aside the account name and key

## Create an Azure Function
A [serverless function](https://azure.microsoft.com/services/functions/) is required to listen for changes in the Azure Data Lake Storage account.

1. Create a [Function App](https://ms.portal.azure.com/#create/Microsoft.FunctionApp) and name it *myFlightDataApp* (make sure to check the *Pin to dashboard* checkbox as you create the service)
2. Click the **+** to create a new function (available when hover your mouse over the *Functions* label on the left)
3. Click **Custom function** located on the bottom half of the screen under *Get started on your own*
4. Locate *Event Grid Trigger* and click **C#**
5. Click **Create** to accept the default function name
6. Click the **Logs** tab at the bottom of the screen to reveal the log pane
7. Paste the following code into functions editor

> [!IMPORTANT]
> Make sure you replace the `<YOUR_DATABRICKS_TOKEN>` placeholder with the token you set aside in your text editor

```csharp
#r "Newtonsoft.Json"

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Net;
using System.Text;

/// <summary>
/// Function triggered with a blob create event from EventGrid.</summary>
public static async Task Run(JObject eventGridEvent, TraceWriter log)
{
    log.Info(eventGridEvent.ToString());
    log.Info("Triggered for event: " + eventGridEvent["data"]["url"].ToString(Formatting.Indented));

    // Call DataBricks with the filename and run job id = 1
    Uri uri = new Uri(eventGridEvent["data"]["url"].ToString());
    string filename = System.IO.Path.GetFileName(uri.LocalPath);
    if(filename.Contains("On_Time_On_Time"))
        await RunNowAsync(filename, 1, log);
}

/// <summary>
/// Runs a job on a DataBricks cluster to process a blob.</summary>
static async Task RunNowAsync(string csvFileUrl, int job_id, TraceWriter log)
{
    // DataBricks URI and token
    var databricksUri = "https://eastus2.azuredatabricks.net/api/2.0/jobs/run-now";
    var databricksToken = "<YOUR_DATABRICKS_TOKEN>";

    // REST API payload
    var payload = new Job { 
        id = job_id,
        NotebookParams = new NotebookParams { 
            BlobName = csvFileUrl
        }
    };

    // Serialize JSON and create the HttpContent
    var stringPayload = JsonConvert.SerializeObject(payload);
    var httpContent = new StringContent(stringPayload, Encoding.UTF8, "application/json");


    // Send the request to DataBricks
    using (var httpClient = new HttpClient()) {

        // Send the Run-Now request: https://docs.azuredatabricks.net/api/latest/jobs.html#run-now
        httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + databricksToken);
        var httpResponse = await httpClient.PostAsync(databricksUri, httpContent);

        // If the response contains content we want to read it!
        if (httpResponse.Content != null) {
            var responseContent = await httpResponse.Content.ReadAsStringAsync();
            log.Info(responseContent);
        }

    }
}

/// <summary>
/// Class to serialize/deserialize JSON content for the DataBricks Run-now REST API</summary>
public class Job
{
    [JsonProperty("job_id")]
    public int id { get; set; }

    [JsonProperty("notebook_params")]
    public NotebookParams NotebookParams { get; set; }
}

public class NotebookParams
{
    [JsonProperty("blob_name")]
    public string BlobName { get; set; }
}
```

<ol start="8">Click <strong>Save</strong></ol>

> [!IMPORTANT]
> After saving the code for the function, verify you see a message saying "Compilation succeeded" in the *Logs* pane.

## Subscribe to the blob creation event

Next you create an [Event Grid Subscription](/event-grid/overview) for the function to process incoming data. 

1. Click on **Add Event Grid subscription** (next to the *Run* button)
2. Enter **myFlightDataSubscription** in the *Name* field
3. Select **Storage Account** from the *Topic Type* dropdown
4. Select your Azure subscription in the *Subscription* field
5. Enter the resource group you used for your storage account in the *Resource Group* field
6. Enter your storage account name in the *Instance* field
7. Uncheck the **Subscribe to all event types** checkbox
8. Expand the dropdown and uncheck **Blob Selected** (*Blob Created* should now be the only event type selected)
9. Enter **.csv** in the *Suffix Filter* field
10. Click **Create**

> [!NOTE]
> If the *Add Event Grid subscription* link is disabled, click on **Manage** and then back on the function name to activate the link.

## Ingest data
The cluster and event grid subscription is now set up to read incoming data. The next step is to create the pipeline to ingest data into the storage account.

### Use DataBricks Notebook to convert CSV to Parquet

Return to the browser DataBricks browser tab and execute the following steps:

1. Click **Azure DataBricks** on the top left of the nav bar
2. Click **Notebook** under the *New* section on the bottom half of the page
3. Enter **CSV2Parquet** in the *Name* field (leave all other fields with default values)
4. Click **Create**
5. Paste the following code into the **Cmd 1** cell (this code auto-saves in the editor)

```python
from pyspark.sql import SQLContext
import tarfile
import os

sqlContext = SQLContext(sc)

blobName = dbutils.widgets.get("blob_name")
print("Transforming " + blobName)

if(blobName == ""):
  raise ValueError('No blob name provided')

df = sqlContext.read.format('com.databricks.spark.csv').options(header='true', inferschema='true').load('/mnt/temp/' + blobName) 
df.write.mode("append").parquet("/mnt/temp/parquet/flights")
```

5. Select **Jobs** on the left nav pane
6. Click **Create Job**
7. Enter **CSV2ParquetJob** in the *Title* field
8. Click **Select Notebook** under the *Task* section
9. Select **CSV2Parquet**
10. Click **OK**
11. Click **Edit** under *Cluster*
12. Select **Existing Cluster** from the *Custer Type* drop-down
13. Select **myFlightDataCluster** from the *Select Cluster* field
14. Click **Confirm**
15. Click the expansion indicator arrow next to *Advanced*
16. Click **Edit** next to *Maximum Concurrent Runs*
17. Enter **32** in the *Maximum concurrent runs* field
18. Click **OK**

### Copy source data into the storage account

The next task is to use AzCopy to copy data from the *.csv* file into Azure storage. Open a command prompt window and enter the following commands:

> [!IMPORTANT]
> Make sure you replace the placeholders **<DOWNLOAD_FILE_PATH>**, **<ACCOUNT_NAME>** and **<ACCOUNT_KEY>** with the corresponding values you set aside in a previous step.

```bash
set ACCOUNT_NAME=<ACCOUNT_NAME>
set ACCOUNT_KEY=<ACCOUNT_KEY>
azcopy cp "<DOWNLOAD_FILE_PATH>" https://<ACCOUNT_NAME>.dfs.core.windows.net/dbricks/folder1/On_Time --recursive 
```
## Explore data using Hadoop Distributed File System

Return to the DataBricks workspace and click on the **Recent** icon in the left nav bar.

1. Click on the **Flight Data Analytics** notebook
2. Press **Ctrl + Alt + N** to create a new cell

Enter each of the following code blocks into **Cmd 1** and press **Cmd + Enter** to run the Python script.

To get a list of CSV files uploaded via AzCopy, run the following script:

```python
import os.path
import IPython
from pyspark.sql import SQLContext
source = "abfs://<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/"
dbutils.fs.ls(source + "/temp")
display(dbutils.fs.ls(source + "/temp/"))
```

To create a new file and list files in the *parquet/flights* folder, run this script:

```python
source = "abfs:/<FILE_SYSTEM_NAME>@<ACCOUNT_NAME>.dfs.core.windows.net/"

dbutils.fs.help()

dbutils.fs.put(source + "/temp/1.txt", "Hello, World!", True)
dbutils.fs.ls(source + "/temp/parquet/flights")
```
With these code samples you have explored the heirarchial nature of HDFS using data stored in an Azure Data Lake Storage account.

## Query the data

Next, you can beging to query the data you uploaded into Azure Data Lake Storage. Enter each of the following code blocks into **Cmd 1** and press **Cmd + Enter** to run the Python script.

### Simple queries
To create dataframes for your data sources, run the following script:

> [!IMPORTANT]
> Make sure to replace the **<YOUR_CSV_FILE_NAME>** placeholder with the file name you downloaded at the beginning of this tutorial.

```python
#Copy this into a Cmd cell in your notebook.
acDF = spark.read.format('csv').options(header='true', inferschema='true').load("/mnt/temp/<YOUR_CSV_FILE_NAME>.csv")
acDF.write.parquet('/mnt/temp/parquet/airlinecodes')

#read the existing parquet file for the flights database that was created via the Azure Function
flightDF = spark.read.format('parquet').options(header='true', inferschema='true').load("/mnt/temp/parquet/flights")

#print the schema of the dataframes
acDF.printSchema()
flightDF.printSchema()

#print the flight database size
print("Number of flights in the database: ", flightDF.count())

#show the first 20 rows (20 is the default)
#to show the first n rows, run: df.show(n)
acDF.show(100, False)
flightDF.show(20, False)

#Display to run visualizations
#preferrably run this in a separate cmd cell
display(flightDF)
```

To run analysis queries against the data, run the following script:

```python
#Run each of these queries, preferrably in a separate cmd cell for separate analysis
#create a temporary sql view for querying flight information
FlightTable = spark.read.parquet('dbfs:/mnt/temp/parquet/flights')
FlightTable.createOrReplaceTempView('FlightTable')

#create a temporary sql view for querying airline code information
AirlineCodes = spark.read.parquet('dbfs:/mnt/temp/parquet/airlinecodes')
AirlineCodes.createOrReplaceTempView('AirlineCodes')

#using spark sql, query the parquet file to return total flights in January and February 2016
out1 = spark.sql("SELECT * FROM FlightTable WHERE Month=1 and Year= 2016")
NumJan2016Flights = out1.count()
out2 = spark.sql("SELECT * FROM FlightTable WHERE Month=2 and Year= 2016")
NumFeb2016Flights=out2.count()
print("Jan 2016: ", NumJan2016Flights," Feb 2016: ",NumFeb2016Flights)
Total= NumJan2016Flights+NumFeb2016Flights
print("Total flights combined: ", Total)

# List out all the airports in Texas
out = spark.sql("SELECT distinct(OriginCityName) FROM FlightTable where OriginStateName = 'Texas'") 
print('Airports in Texas: ', out.show(100))

#find all airlines that fly from Texas
out1 = spark.sql("SELECT distinct(Carrier) FROM FlightTable WHERE OriginStateName='Texas'")
print('Airlines that fly to/from Texas: ', out1.show(100, False))
```
### Complex queries

To execute the following more complex queries, run each segment at a time in the notebook and inspect the results.

```python
#find the airline with the most flights

#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v")
spark.sql("CREATE TEMPORARY VIEW v AS SELECT Carrier, count(*) as NumFlights from FlightTable group by Carrier, UniqueCarrier order by NumFlights desc LIMIT 10")
output = spark.sql("SELECT AirlineName FROM AirlineCodes WHERE AirlineCode in (select Carrier from v)")

#show the top row without truncation
output.show(1, False)

#show the top 10 airlines
output.show(10, False)

#Determine which is the least on time airline

#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v")
spark.sql("CREATE TEMPORARY VIEW v AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE DepDelay>60 or ArrDelay>60 group by Carrier, UniqueCarrier order by NumFlights desc LIMIT 10")
output = spark.sql("select * from v")
#output = spark.sql("SELECT AirlineName FROM AirlineCodes WHERE AirlineCode in (select Carrier from v)")
#show the top row without truncation
output.show(1, False)

#which airline improved its performance
#find the airline with the most improvement in delays
#create a temporary view to hold the flight delay information aggregated by airline, then select the airline name from the Airlinecodes dataframe
spark.sql("DROP VIEW IF EXISTS v1")
spark.sql("DROP VIEW IF EXISTS v2")
spark.sql("CREATE TEMPORARY VIEW v1 AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE (DepDelay>0 or ArrDelay>0) and Year=2016 group by Carrier order by NumFlights desc LIMIT 10")
spark.sql("CREATE TEMPORARY VIEW v2 AS SELECT Carrier, count(*) as NumFlights from FlightTable WHERE (DepDelay>0 or ArrDelay>0) and Year=2017 group by Carrier order by NumFlights desc LIMIT 10")
output = spark.sql("SELECT distinct ac.AirlineName, v1.Carrier, v1.NumFlights, v2.NumFlights from v1 INNER JOIN v2 ON v1.Carrier = v2.Carrier INNER JOIN AirlineCodes ac ON v2.Carrier = ac.AirlineCode WHERE v1.NumFlights > v2.NumFlights")
#show the top row without truncation
output.show(10, False)

#display for visual analysis
display(output)
```
> [!div class="checklist"]
> * Create a DataBricks cluster
> * Ingest unstructured data into a storage account
> * Trigger an Azure Function to process data
> * Running analytics on your data in Blob storage

## Next steps

* [Extract, transform, and load data using Apache Hive on Azure HDInsight](tutorial-extract-transform-load-hive.md)