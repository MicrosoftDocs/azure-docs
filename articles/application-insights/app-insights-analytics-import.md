---
title: Import your data to Analytics in Azure Application Insights | Microsoft Docs
description: Import static data to join with app telemetry, or import a separate data stream to query with Analytics.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 12/14/2016
ms.author: awills

---
# Import data into Analytics

Import any tabular data into [Analytics](app-insights-analytics.md), either to join it with [Application Insights](app-insights-overview.md) telemetry from your app, or so that you can analyze it as a separate stream. Analytics is a powerful query language well-suited to analyzing high-volume timestamped streams of telemetry.

You can import data into Analytics using your own schema. It doesn't have to use the standard Application Insights schemas such as request or trace.

Currently, you can import CSV (comma-separated value) files, or similar formats using tab or semicolon separators.

There are three situations where importing to Analytics is useful:

* **Join with app telemetry.** For example, you could import a table that maps URLs from your website to more readable page titles. In Analytics you can create a dashboard chart report that shows the ten most popular pages in your website. Now it can show the page titles instead of the URLs.
* **Correlate your application telemetry** with other sources such as network traffic, server data, or CDN log files.
* **Apply Analytics to a separate data stream.** Application Insights Analytics is a very powerful tool, that works well with sparse, timestamped streams - much better than SQL in many cases. If you have such a stream from some other source, you can analyze it with Analytics.

Sending data to your data source is very easy. 

1. (One time) Define the schema of your data in a 'data source'.
2. (Periodically) Upload your data to Azure storage, and call the REST API to notify us that new data is waiting for ingestion. Within a few minutes the data is available for query in Analytics.

The frequency of the upload is defined by you and how fast would you like your data to be available for queries. It is more efficient to upload data in larger chunks, but not larger than 1GB.

> [!NOTE]
> *Got lots of data sources to analyze?* [*Consider using* logstash *to ship your data into Application Insights.*](https://github.com/Microsoft/logstash-output-application-insights)
> 

## Before you start

You need:

1. An Application Insights resource in Microsoft Azure.

 * If you want to analyze your data separately from any other telemetry, [create a new Application Insights resource](app-insights-create-new-resource.md).
 * If you're joining or comparing your data with telemetry from an app that is already set up with Application Insights, then you can use the resource for that app.
 * You need contributor or owner access to that resource.
 
2. Azure storage. You upload to Azure storage, and Analytics gets your data from there. 

 * We recommend you create a dedicated storage account for your blobs. If your blobs are shared with other processes, it takes longer for our processes to read your blobs.

2. While this feature is in preview, you need to ask for access.

 * From your Application Insights resource in the [Azure portal](https://portal.azure.com), open Analytics. 
 * At the bottom of the schema pane, click the 'Contact us' link under **Other Data Sources.** 
 * If you see 'Add data source', then you already have access.


## Define your schema

Before you can import data, you need to define a *data source,* which specifies the schema of your data.

1. Start the data source wizard

    ![Add new data source](./media/app-insights-analytics-import/add-new-data-source.png)

2. Follow the instructions to upload a sample data file.

 * The first row of the sample can be column headers. (You can change the field names in the next step.)
 * The sample should include at least 10 rows of data.

3. Review the schema that the wizard has inferred from your sample. You can adjust the inferred types of the columns if necessary.

4. Select a Timestamp. All data in Analytics must have a timestamp field. It must have type `datetime`, but it doesn't have to be named 'timestamp'. If your data has a column containing a date and time in ISO format, choose this as the timestamp column. Otherwise, choose "as data arrived", and the import process will add a timestamp field.

    ![Review the schema](./media/app-insights-analytics-import/data-source-review-schema.png)

5. Create the data source.


## Import data

To import data, you upload it to Azure storage, create an access key for it, and then make a REST API call.

![Add new data source](./media/app-insights-analytics-import/analytics-upload-process.png)

You can perform the following process manually, or set up an automated system to do it at regular intervals. You need to follow these steps for each block of data you want to import.

1. Upload the data to [Azure blob storage](../storage/storage-dotnet-how-to-use-blobs.md). 

 * Blobs can be any size up to 1GB uncompressed. Large blobs of hundreds of MB are ideal from a performance perspective.
 * You can compress it with Gzip to improve upload time and latency for the data to be available for query. Use the `.gz` filename extension.
 
2. [Create a Shared Access Signature key for the blob](../storage/storage-dotnet-shared-access-signature-part-2.md). The key should have an expiration period of one day and provide read access.
3. Make a REST call to notify Application Insights that data is waiting.

 * Endpoint: `https://eus-breeziest-in.cloudapp.net/v2/track`
 * HTTP method: POST
 * Payload:

```JSON

    {
       "data": {
            "baseType":"OpenSchemaData",
            "baseData":{
               "ver":"2",
               "blobSasUri":"<Blob URI with Shared Access Key>",
               "sourceName":"<Data source name>",
               "sourceVersion":"1.0"
             }
       },
       "ver":1,
       "name":"Microsoft.ApplicationInsights.OpenSchema",
       "time":"<DateTime>",
       "iKey":<instrumentation key>"
    }
```

The placeholders are:

* `Blob URI with Shared Access Key`: You get this from the procedure for creating a key. It is specific to the blob.
* `Data source name`: The name you gave to your data source. The data in this blob should conform to the schema you defined for this source.
* `DateTime`: The time at which the request is submitted, UTC. We accept the following formats: ISO8601 (like "2016-01-01 13:45:01"); RFC822  ("Wed, 14 Dec 16 14:57:01 +0000"); RFC850 ("Wednesday, 14-Dec-16 14:57:00 UTC"); RFC1123 ("Wed, 14 Dec 2016 14:57:00 +0000").
* `Instrumentation key` of your Application Insights resource.

The data is available in Analytics after a few minutes.

## Error responses

* **400 bad request**: indicates that the request payload is invalid. Check the following:
 * Correct instrumentation key.
 * Valid time value. It should be the time now in UTC.
 * Data conforms to the schema.
* **403 Forbidden**: The blob you've sent is not accessible. Make sure that the shared access key is valid and has not expired.
* **404 Not Found**:
 * The blob doesn't exist.
 * The data source name is wrong.

More detailed information is available in the response error message.

## Sample code

This code uses the [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/9.0.1) Nuget package.

### Classes

```C#


namespace IngestionClient 
{ 
    using System; 
    using Newtonsoft.Json; 

    public class AnalyticsDataSourceIngestionRequest 
    { 
        #region Members 
        private const string BaseDataRequiredVersion = "2"; 
        private const string RequestName = "Microsoft.ApplicationInsights.OpenSchema"; 
        #endregion Members 

        public AnalyticsDataSourceIngestionRequest(string ikey, string schemaId, string blobSasUri, int version = 1) 
        { 
            Ver = version; 
            IKey = ikey; 
            Data = new Data 
            { 
                BaseData = new BaseData 
                { 
                    Ver = BaseDataRequiredVersion, 
                    BlobSasUri = blobSasUri, 
                    SourceName = schemaId, 
                    SourceVersion = version.ToString() 
                } 
            }; 
        } 


        [JsonProperty("data")] 
        public Data Data { get; set; } 

        [JsonProperty("ver")] 
        public int Ver { get; set; } 

        [JsonProperty("name")] 
        public string Name { get { return RequestName; } } 

        [JsonProperty("time")] 
        public DateTime Time { get { return DateTime.UtcNow; } } 

        [JsonProperty("iKey")] 
        public string IKey { get; set; } 
    } 

    #region Internal Classes 

    public class Data 
    { 
        private const string DataBaseType = "OpenSchemaData"; 

        [JsonProperty("baseType")] 
        public string BaseType 
        { 
            get { return DataBaseType; } 
        } 

        [JsonProperty("baseData")] 
        public BaseData BaseData { get; set; } 
    } 


    public class BaseData 
    { 
        [JsonProperty("ver")] 
        public string Ver { get; set; } 

        [JsonProperty("blobSasUri")] 
        public string BlobSasUri { get; set; } 

        [JsonProperty("sourceName")] 
        public string SourceName { get; set; } 

        [JsonProperty("sourceVersion")] 
        public string SourceVersion { get; set; } 
    } 

    #endregion Internal Classes 
} 


namespace IngestionClient 
{ 
    using System; 
    using System.IO; 
    using System.Net; 
    using System.Text; 
    using System.Threading.Tasks; 
    using Newtonsoft.Json; 

    public class AnalyticsDataSourceClient 
    { 
        #region Members 
        private readonly Uri breezeEndpoint = new Uri("https://eus-breeziest-in.cloudapp.net/v2/track"); 
        private const string RequestContentType = "application/json; charset=UTF-8"; 
        private const string RequestAccess = "application/json"; 
        #endregion Members 

        #region Public 

        public async Task<bool> RequestBlobIngestion(AnalyticsDataSourceIngestionRequest ingestionRequest) 
        { 
            HttpWebRequest request = WebRequest.CreateHttp(breezeEndpoint); 
            request.Method = WebRequestMethods.Http.Post; 
            request.ContentType = RequestContentType; 
            request.Accept = RequestAccess; 

            string notificationJson = Serialize(ingestionRequest); 
            byte[] notificationBytes = GetContentBytes(notificationJson); 
            request.ContentLength = notificationBytes.Length; 

            Stream requestStream = request.GetRequestStream(); 
            requestStream.Write(notificationBytes, 0, notificationBytes.Length); 
            requestStream.Close(); 

            HttpWebResponse response; 
            try 
            { 
                response = (HttpWebResponse)await request.GetResponseAsync(); 
            } 
            catch (WebException e) 
            { 
                HttpWebResponse httpResponse = e.Response as HttpWebResponse; 
                if (httpResponse != null) 
                { 
                    Console.WriteLine( 
                        "Ingestion request failed with status code: {0}. Error: {1}", 
                        httpResponse.StatusCode, 
                        httpResponse.StatusDescription); 
                } 
                return false; 
            } 

            return response.StatusCode == HttpStatusCode.OK; 
        } 
        #endregion Public 

        #region Private 
        private byte[] GetContentBytes(string content) 
        { 
            return Encoding.UTF8.GetBytes(content);
        } 


        private string Serialize(AnalyticsDataSourceIngestionRequest ingestionRequest) 
        { 
            return JsonConvert.SerializeObject(ingestionRequest); 
        } 
        #endregion Private 
    } 
} 

```

### Ingest data

Use this code for each blob. 

```C#


   AnalyticsDataSourceClient client = new AnalyticsDataSourceClient(); 

   var ingestionRequest = new AnalyticsDataSourceIngestionRequest("iKey", "tableId/sourceId", "blobUrlWithSas"); 

   bool success = await client.RequestBlobIngestion(ingestionRequest);

```

## Next steps

* [Tour of the Analytics query language](app-insights-analytics-tour.md)
* [Use *logstash* to send data to Application Insights](https://github.com/Microsoft/logstash-output-application-insights)
