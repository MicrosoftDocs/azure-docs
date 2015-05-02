<properties 
	pageTitle="How to consume a Machine Learning web service that has been published from a Machine Learning experiment | Azure" 
	description="Once a machine learning service is published, the RESTFul web service that is made available can be consumed either as request-response service or as a batch execution service." 
	services="machine-learning" 
	solutions="big-data" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="tbd" 
	ms.date="02/20/2015" 
	ms.author="bradsev" />


# How to consume a published Azure Machine Learning web service

## Introduction

When published as a web service, Azure Machine Learning experiments provide a REST API that can be consumed by a wide range of devices and platforms. This is because the simple REST API accepts and responds with JSON formatted messages. The Azure Machine Learning portal provides code that can be used to call the web service in R, C#, and Python. But these services can be called with any programming language and from any device that satisfies three criteria:

* Has a network connection
* Has SSL capabilities to perform HTTPS requests
* Has the ability to parse JSON (by hand or support libraries)

This means the services can be consumed from web applications, mobile applications, custom desktop applications and even from within Excel.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]  

An Azure Machine Learning web service can be consumed in two different ways, either as a request-response service or as a batch execution service. In each scenario the functionality is provided through the RESTFul web service that is made available for consumption once the experiment has been published. Deploying a Machine Learning web service in Azure with an Azure web service end-point, where the service is automatically scaled based on usage, you can avoid upfront and ongoing costs for hardware resources.

<!-- When this article gets published, fix the link and uncomment
For more information on how to manage Azure Machine Learning web service endpoints using the REST API, see **Azure machine learning web service endpoints**. 
-->

For information about how to create and publish an Azure Machine Learning web service, 
see [Publish an Azure Machine Learning web service][publish]. For a step-by-step walkthrough of creating a Machine Learning experiment and publishing it, see [Develop a predictive solution by using Azure Machine Learning][walkthrough].

[publish]: machine-learning-publish-a-machine-learning-web-service.md
[walkthrough]: machine-learning-walkthrough-develop-predictive-solution.md


## Request-Response Service (RRS)

A Request-Response Service (RRS) is a low-latency, highly scalable web service used to provide an interface to the stateless models that have been created and published from an Azure Machine Learning Studio experiment.

RRS accepts a single row of input parameters and generates a single row as output. The output row can contain multiple columns.

An example for RRS is validating the authenticity of an application. Hundreds to millions of installations of an application can be expected in this case. When the application starts up, it makes a call to the RRS service with the relevant input. The application then receives a validation response from the service that either allows or blocks the application from performing.


## Batch Execution Service (BES)
 
A Batch Execution Service (BES) is a service that handles high volume, asynchronous, scoring of a batch of data records. The input for the BES contains a batch of records from a variety of sources, such as blobs, tables in Azure, SQL Azure, HDInsight (results of a Hive Query, for example), and HTTP sources. The output for the BES contains the results of the scoring. Results are output to a file in Azure blob storage and data from the storage endpoint is returned in the response.

A BES would be useful when responses are not needed immediately, such as for regularly scheduled scoring for individuals or internet of things (IOT) devices.

## Examples
To show how both RRS and BES work, we use an example Azure Web Service. This service would be used in an IOT (Internet Of Things) scenario. To keep it simple, our device only sends up one value, `cog_speed`, and gets a single answer back. 

There are four pieces of information that are needed to call either the RRS or BES service. This information is readily available from the service pages in [Azure Machine Learning service pages](https://studio.azureml.net) once the experiment has been published. Click on the WEB SERVICES link at the left of the screen and you will see the published services. To find information about a specific service, there are API help page links for both RRS and BES.

1.	The **service API Key**, available on the services main page
2.	The **service URI**, available on the API help page for the chosen service
3.	The expected **API request body**, available on the API help page for the chosen service
4.	The expected **API response body**, available on the API help page for the chosen service

In the two examples below, the C# language is used to illustrate the code needed and the targeted platform is a Windows 8 desktop. 

### RRS Example
On the API help page, aside from the URI, you will input and output definitions and code samples. The API input is called out, for this service specifically, and is the payload of the API call. 

**Sample Request**

	{
	  "Inputs": {
	    "input1": {
	      "ColumnNames": [
	        "cog_speed"
	      ],
	      "Values": [
	        [
	          "0"
	        ],
	        [
	          "1"
	        ]
	      ]
	    }
	  },
	  "GlobalParameters": {}
	}


Similarly, the API response is also called out, again for this service specifically.

**Sample Response**

	{
	  "Results": {
	    "output1": {
	      "type": "DataTable",
	      "value": {
	        "ColumnNames": [
	          "cog_speed"
	        ],
	        "ColumnTypes": [
	          "Numeric"
	        ].
	      "Values": [
	        [
	          "0"
	        ],
	        [
	          "1"
	        ]
	      ]
	    }
	  },
	  "GlobalParameters": {}
	}

Towards the bottom of the page you will find the code examples. Below is the code sample for the C# implementation 
                   
**Sample Code**
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Net.Http;
	using System.Net.Http.Formatting;
	using System.Net.Http.Headers;
	using System.Text;
	using System.Threading.Tasks;
	
	namespace CallRequestResponseService
	{
	    public class StringTable
	    {
	        public string[] ColumnNames { get; set; }
	        public string[,] Values { get; set; }
	    }
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            InvokeRequestResponseService().Wait();
	        }
	
	        static async Task InvokeRequestResponseService()
	        {
	            using (var client = new HttpClient())
	            {
	                var scoreRequest = new
	                {
	                    Inputs = new Dictionary<string, StringTable> () { 
	                        { 
	                            "input1", 
	                            new StringTable() 
	                            {
	                                ColumnNames = new string[] {"cog_speed"},
	                                Values = new string[,] {  { "0"},  { "1"}  }
	                            }
	                        },
	                    GlobalParameters = new Dictionary<string, string>() { }
	                };
	                
	                const string apiKey = "abc123"; // Replace this with the API key for the web service
	                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue( "Bearer", apiKey);
	
	                client.BaseAddress = new Uri("https://ussouthcentral.services.azureml.net/workspaces/<workspace id>/services/<service id>/execute?api-version=2.0&details=true");
	                
	                // WARNING: The 'await' statement below can result in a deadlock if you are calling this code from the UI thread of an ASP.Net application.
	                // One way to address this would be to call ConfigureAwait(false) so that the execution does not attempt to resume on the original context.
	                // For instance, replace code such as:
	                //      result = await DoSomeTask()
	                // with the following:
	                //      result = await DoSomeTask().ConfigureAwait(false)

	                HttpResponseMessage response = await client.PostAsJsonAsync("", scoreRequest);
	
	                if (response.IsSuccessStatusCode)
	                {
	                    string result = await response.Content.ReadAsStringAsync();
	                    Console.WriteLine("Result: {0}", result);
	                }
	                else
	                {
	                    Console.WriteLine("Failed with status code: {0}", response.StatusCode);
	                }
	            }
	        }
	    }
	}

### BES Example
On the API help page, in addition to the URI, you will find information about several calls that are available. Unlike the RRS service, the BES service is asynchronous. This means that the BES API is simply queuing up a job to be executed. But it does not actually execute it before the API response is received. There are three things a developer can do with the BES service, which are described below.

1. Submit a Batch Execution job
1. Get the status or result of a Batch Execution job
1. Delete a Batch Execution Job  

**1. Submit a Batch Execution job**

You submit a batch execution job by providing information about where the batch data is stored. For this example, we will assume the records we want batch scored are in a blob file in a storage account.

The response to a batch job is a job id, again, because the job is run asynchronously. We will use the job id to get the job status and results at a later time.

**Sample Request**

	{
	  "Input": {
	    "ConnectionString":     
	    "DefaultEndpointsProtocol=https;AccountName=mystorageacct;AccountKey=mystorageacctKey",
	    "RelativeLocation": "/mycontainer/mydatablob.csv",
	    "BaseLocation": null,
	    "SasBlobToken": null
	  },
	  "Output": null,
	  "GlobalParameters": {}
	}

**Sample Response**

	"539d0bc2fde945b6ac986b851d0000f0" // The JOB_ID

**Sample Code**

	// This code requires the Nuget package Microsoft.AspNet.WebApi.Client to be installed.
	// Instructions for doing this in Visual Studio:
	// Tools -> Nuget Package Manager -> Package Manager Console
	// Install-Package Microsoft.AspNet.WebApi.Client
	
	using System;
	using System.Collections.Generic;
	using System.Net.Http;
	using System.Threading.Tasks;
	using System.Net.Http.Headers;
	
	namespace CallBatchExecutionService
	{
	    internal class Program
	    {
	        private static void Main(string[] args)
	        {
	            InvokeBatchExecutionService().Wait();
	        }
	
	        private static async Task InvokeBatchExecutionService()
	        {
	            // API Information
	            const string BESUrl = "[BES URI]";
	            const string ApiKey = "abc123"; 
	            // The storage account information
	            const string StorageAccountName = @"mystorageacct"; 
	            const string StorageAccountKey = @"Dx9WbMIThAvXRQWap/aLnxT9LV5txxw==";
	            // Storage file with the batch of records
	            const string StorageInputFile = @"/mycontainermydatablob.csv"; 
	
	
	            String connString = String.Format(
	                "DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}",
	                StorageAccountName,
	                StorageAccountKey);
	
	            BatchRequest request = new BatchRequest();
	            request.Input.RelativeLocation = StorageInputFile;
	            request.Input.ConnectionString = connString;
	
	            using (var client = new HttpClient())
	            {
	                client.BaseAddress = new Uri(BESUrl);
	                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
	
	                HttpResponseMessage response = await client.PostAsJsonAsync("", request);
	                if (response.IsSuccessStatusCode)
	                {
	                    string result = await response.Content.ReadAsStringAsync();
	                    Console.WriteLine("Job ID: {0}", result);
	                }
	                else
	                {
	                    Console.WriteLine("Failed with status code: {0}", response.StatusCode);
	                }
	            }
	        }
	    }
	
	    public class BatchInput
	    {
	        public String ConnectionString { get; set; }
	        public String RelativeLocation { get; set; }
	        public String BaseLocation { get; set; }
	        public String SasBlobToken { get; set; }
	
	        public BatchInput()
	        {
	            ConnectionString = null;
	            RelativeLocation = null;
	            BaseLocation = null;
	            SasBlobToken = null;
	        }
	    }
	
	    public class BatchRequest
	    {
	        public BatchInput Input { get; set; }
	
	        public Object Output { get; set; }
	
	        public Dictionary<string, string> GlobalParameters { get; set; }
	
	        public BatchRequest()
	        {
	            this.GlobalParameters = new Dictionary<string, string>();
	            Input = new BatchInput();
	            Output = null;
	        }
	    }
	}
	
**2. Get the status or result of a Batch Execution job**

To get the result of a job, you must first have the job id, which was in the response to the job submission. There is no real input on this API call. It uses a slight change to the BES URI and the request method. Instead of a POST request, is uses a GET request following the URI defined on the API help page.
 
The response, however, is layered.

**Response Payload**

	{
	    "StatusCode": STATUS_CODE,
	    "Result": RESULT,
	    "Details": DETAILS
	}

`StatusCode` may have a value of 0, 1, 2, 3 or 4 with the following semantics:

* 0	Not started
* 1	Running
* 2	Failed
* 3	Canceled
* 4	Finished

If the job does not finished, `Result` is **null**. If the job is finished, `Result` would be of the form: 

	{
	  "ConnectionString": null,
	  "RelativeLocation": "RELATIVE_LOCATION",
	  "BaseLocation": "BASE_LOCATION",
	  "SasBlobToken": "SAS_BLOB_TOKEN"
	}

Details shows the error details, if any .

**Sample Code**

	// This code requires the Nuget package Microsoft.AspNet.WebApi.Client to be installed.
	// Instructions for doing this in Visual Studio:
	// Tools -> Nuget Package Manager -> Package Manager Console
	// Install-Package Microsoft.AspNet.WebApi.Client
	//
	// Also, add a reference to Microsoft.WindowsAzure.Storage.dll for reading from and writing to the Azure blob storage
	
	using System;
	using System.IO;
	using System.Net.Http;
	using System.Net.Http.Headers;
	using System.Threading.Tasks;
	using Newtonsoft.Json;
	
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Blob;
	
	namespace CallBatchExecutionService
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            String jobId = "123";
	            InvokeBatchExecutionService(jobId).Wait();
	        }
	
	        static async Task InvokeBatchExecutionService(String JobId)
	        {
	            Console.WriteLine(String.Format("Getting job status for job {0}", JobId));
	
	            // BES Information
	            const string BaseUrl = @"[BES Job Id]/{0}";
	            const string ApiKey = "abc123"; 
	            // Replace this with the location you would like to use for your output file
	            const string OutputFileLocation = @"myresults.csv"; 
	
	            using (var client = new HttpClient())
	            {
	                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
	
	                HttpResponseMessage response = await client.GetAsync(String.Format(BaseUrl, JobId));
	                if (response.IsSuccessStatusCode)
	                {
	                    string result = await response.Content.ReadAsStringAsync();
	                    BatchResponseStructure responseStruct = JsonConvert.DeserializeObject<BatchResponseStructure>(result);
	
	                    switch (responseStruct.StatusCode)
	                    {
	                        case (int)BatchScoreStatusCode.NotStarted:
	                            Console.WriteLine("Not started...");
	                            break;
	                        case (int)BatchScoreStatusCode.Running:
	                            Console.WriteLine("Running...");
	                            break;
	                        case (int)BatchScoreStatusCode.Failed:
	                            Console.WriteLine("Failed!");
	                            Console.WriteLine(string.Format(@"Error details: {0}", status.Details));
	                            break;
	                        case (int)BatchScoreStatusCode.Cancelled:
	                            Console.WriteLine("Cancelled!");
	                            break;
	                        case (int)BatchScoreStatusCode.Finished:
	                            Console.WriteLine("Finished!");
	                            var credentials = new StorageCredentials(status.Result.SasBlobToken);
	                            var cloudBlob = new CloudBlockBlob(new Uri(new Uri(responseStruct.Result.BaseLocation), 
	                                                                                               responseStruct.Result.RelativeLocation), credentials);
	                            cloudBlob.DownloadToFile(OutputFileLocation, FileMode.Create);
	                            Console.WriteLine(string.Format(@"The results have been written to the file {0}", OutputFileLocation));
	                            break;
	                    }
	                }
	                else
	                {
	                    Console.WriteLine(String.Format("Batch Result : Failed with status code: {0}", response.StatusCode));
	                }
	            }
	        }
	    }
	
	    public enum BatchScoreStatusCode : int
	    {
	        NotStarted = 0,
	        Running = 1,
	        Failed = 2,
	        Cancelled = 3,
	        Finished = 4
	    }
	
	    public class BatchResult
	    {
	        public String ConnectionString { get; set; }
	        public String RelativeLocation { get; set; }
	        public String BaseLocation { get; set; }
	        public String SasBlobToken { get; set; }
	    }
	
	    public class BatchResponseStructure
	    {
	        public int StatusCode { get; set; }
	        public BatchResult Result { get; set; }
	        public String Details { get; set; }
	        public BatchResponseStructure()
	        {
	            this.Result = new BatchResult();
	        }
	    }
	}

**3. Delete a Batch Execution Job**              
A job can also be deleted once it has started. This would be done for various reasons such as that the job is taking too long to complete. To delete a job, you must first have the job id, which was contained in the response to the job submission.

There is no real input on this API call. A slight change to the BES URI and the request method. Instead of a POST request, it uses a DELETE request following the URI defined on the API help page. The code sample for this is very straightforward.

