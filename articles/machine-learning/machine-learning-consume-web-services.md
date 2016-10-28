<properties
	pageTitle="Consume a Machine Learning Web service | Microsoft Azure"
	description="Once a machine learning service is deployed, the RESTFul Web service that is made available can be consumed either as request-response service or as a batch execution service."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="jhubbard"
	editor="cgronlun" />

<tags
	ms.service="machine-learning"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="tbd"
	ms.date="10/04/2016"
	ms.author="garye" />


# How to consume an Azure Machine Learning Web service that has been deployed from a Machine Learning experiment

## Introduction

When deployed as a Web service, Azure Machine Learning experiments provide a REST API and JSON formatted messages that can be consumed by a wide range of devices and platforms. The Azure Machine Learning portal provides code that can be used to call the Web service in R, C#, and Python. 

Services can be called with any programming language and from any device that satisfies three criteria:

* Has a network connection
* Has SSL capabilities to perform HTTPS requests
* Can parse JSON (by hand or support libraries)

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]  

An Azure Machine Learning Web service can be consumed in two ways, either as a request-response service or as a Batch Execution Service. In each scenario, the functionality is provided through the RESTFul Web service that is made available for consumption once you deploy the experiment.

> [AZURE.TIP] For a simple way to create a web app to access your predictive Web service, see [Consume an Azure Machine Learning Web service with a web app template](machine-learning-consume-web-service-with-web-app-template.md).

<!-- When this article gets published, fix the link and uncomment
For more information on how to manage Azure Machine Learning Web service endpoints using the REST API, see **Azure machine learning Web service endpoints**.
-->

For information about how to create and deploy an Azure Machine Learning Web service, see [Deploy an Azure Machine Learning Web service][publish]. For a step-by-step walkthrough of creating a Machine Learning experiment and deploying it, see [Develop a predictive solution by using Azure Machine Learning][walkthrough].

## Request-Response Service (RRS)

A Request-Response Service (RRS) is a low-latency, highly scalable Web service used to provide an interface to the stateless models that have been created and deployed from an Azure Machine Learning Studio experiment. It enables scenarios where the consuming application expects a response in real time.

RRS accepts a single row, or multiple rows, of input parameters and can generate a single row, or multiple rows, as output. The output row(s) can contain multiple columns.

An example for RRS is validating the authenticity of an application. Hundreds to millions of installations of an application can be expected in this case. When the application starts up, it calls the RRS service with the relevant input. The application then receives a validation response from the service that either allows or blocks the application from performing.


## Batch Execution Service (BES)

A Batch Execution Service (BES) is a service that handles high volume, asynchronous, scoring of a batch of data records. The input for the BES contains a batch of records from various sources, such as blobs, tables in Azure, SQL Azure, HDInsight (results of a Hive Query, for example), and HTTP sources. The output for the BES contains the results of the scoring. Results are output to a file in Azure blob storage and data from the storage endpoint is returned in the response.

A BES would be useful when responses are not needed immediately, such as for regularly scheduled scoring for individuals or internet of things (IOT) devices.

## Examples

To show how both RRS and BES work, we use an example Azure Web service. This service would be used in an IOT (Internet Of Things) scenario. To keep it simple, our device only sends up one value, `cog_speed`, and gets a single answer back.

Once the experiment has been deployed, there are four pieces of information that we need to call either the RRS or BES service.

* The service **API key** or **Primary key**
* The service **request URI**
* The expected API **request headers** and **body**
* The expected API **response headers** and **body**

The manner in which you find this information depends on what type of service you deployed: A New Web service or a Classic Web Service.

### Information location in the Azure Machine Learning Web Services portal 

To find the needed information:

1. Sign in to the [Azure Machine Learning Web Services][webservicesportal] portal.
2. Click **Web Services** or **Classic Web Services**.
3. Click the Web service with which you working. 
4. If you are working with a Classic Web Service, click the endpoint you are working with.

The information is located on these pages:

* The **Primary key** is available on the **Consume** page
* The **request URI** is available on the **Consume** page 
* The expected API **request headers**, **response headers**, and **body** are available on the **Swagger API** page

### Information locations in Machine Learning Studio (Classic Web service only)

You can find the needed information from two locations: Machine Learning Studio or the Azure Machine Learning Web Services portal.

To find the needed information in Machine Learning studio:

1. Sign in to [Machine Learning Studio][mlstudio].
2. On the left of the screen, click **WEB SERVICES**.
3. Click the Web service with which you are working. 

The information is located on these pages:

* The **API key** is available on the service **Dashboard** 
* The **request URI** is available on the API help page
* The expected API **request headers**, **response headers**, and **body** are available on the API help page


To access the API help page, click either the **REQUEST/RESPONSE** or **BATCH EXECUTION** link as appropriate to your task.

To find the needed information on the Azure Machine Learning Web Services portal:

1. Sign in to the [Azure Machine Learning Web Services][webservicesportal] portal.
2. Click **Classic Web Services**.
3. Click the Web service with which you are working. 
4. Click the endpoint with which you are working.

The information is located on these pages:

* The **Primary key** is available on the **Consume** page
* The **request URI** is available on the **Consume** page 
* The expected API **request headers**, **response headers**, and **body** are available on the **Swagger API** page

In the two examples below, the C# language is used to illustrate the code needed.

### RRS Example



The following sample request shows the API input the payload for the API call of our sample service. For a Classic Web service, you can find payload samples on the **API help page** or on the **Swagger API** page of the Machine Learning Web Services portal. For a New Web service, you can find payload samples on the **Swagger API** page of the Machine Learning Web Services portal.

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


Similarly, the following sample shows the API response for the service.

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

The following is the code sample for the C# implementation. For a Classic Web service, you can find code samples at the bottom of the **API help page** or at the bottom of the **Consume** page. For a New Web service, you can find code samples at the bottom of the **Consume** page.

**Sample Code in C#**

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

	                const string apiKey = "abc123"; // Replace this with the API key for the Web service
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

**Sample Code in Java**

The following sample code shows how to construct a REST API request in Java. It assumes that the variables (apikey and apiurl) have the necessary API details and the variable jsonBody has a correct JSON object as expected by the REST API. You can download the full code from github - [https://github.com/nk773/AzureML_RRSApp](https://github.com/nk773/AzureML_RRSApp). This Java sample requires [apache http client library](https://hc.apache.org/downloads.cgi).

	/**
	 * Download full code from github - [https://github.com/nk773/AzureML_RRSApp](https://github.com/nk773/AzureML_RRSApp)
 	 */
    	/**
     	  * Call REST API for retrieving prediction from Azure ML 
     	  * @return response from the REST API
     	  */	
    	public static String rrsHttpPost() {
        
        	HttpPost post;
        	HttpClient client;
        	StringEntity entity;
        
        	try {
            		// create HttpPost and HttpClient object
            		post = new HttpPost(apiurl);
            		client = HttpClientBuilder.create().build();
            
            		// setup output message by copying JSON body into 
            		// apache StringEntity object along with content type
            		entity = new StringEntity(jsonBody, HTTP.UTF_8);
            		entity.setContentEncoding(HTTP.UTF_8);
            		entity.setContentType("text/json");

            		// add HTTP headers
            		post.setHeader("Accept", "text/json");
            		post.setHeader("Accept-Charset", "UTF-8");
        
            		// set Authorization header based on the API key
            		post.setHeader("Authorization", ("Bearer "+apikey));
            		post.setEntity(entity);

            		// Call REST API and retrieve response content
            		HttpResponse authResponse = client.execute(post);
            
            		return EntityUtils.toString(authResponse.getEntity());
            
        	}
        	catch (Exception e) {
            
            		return e.toString();
        	}
    
    	}
    
    	
 

### BES Example

Unlike the RRS service, the BES service is asynchronous. This means that the BES API is simply queuing up a job to be executed, and the caller polls the job's status to see when it has completed. Here are the operations currently supported for batch jobs:

1. Create (submit) a batch job
1. Start this batch job
1. Get the status or result of the batch job
1. Cancel a running batch job

**1. Create a Batch Execution Job**

When you create a batch job for your Azure Machine Learning service, you can specify several parameters that define the batch execution:

* **Input**: Represents a blob reference where the batch job's input is stored.
* **GlobalParameters**: Represents the set of global parameters that you can define for their experiment. An Azure Machine Learning experiment can have both required and optional parameters that customize the service's execution, and the caller is expected to provide all required parameters, if applicable. These parameters are specified as a collection of key-value pairs.
* **Outputs**: If the service has defined one or more outputs, the caller can redirect any of them to an Azure blob location. By setting this parameter, you can save the output of the service in a preferred location and under a predictable name, otherwise the output blob name is randomly generated. 

    The service expects the output content, based on its type, to be saved as supported formats:
  - dataset outputs: can be saved as **.csv, .tsv, .arff**
  - trained model outputs: Must be saved as **.ilearner**

	You specify the Output location overrides as a collection of output name, or blob reference pairs. The *output name* is the user-defined name for a specific output node, and *blob reference* is a reference to an Azure blob location to which the output is redirected. The *output name* is shown on the service's API help page.

All the job creation parameters are optional depending on the nature of your service. For example, services with no input node defined do not require passing in an *Input* parameter. Likewise, the output location override feature is optional, as outputs are otherwise stored in the default storage account that was set up for your Azure Machine Learning workspace. The following sample request payloads for a service where only the input information is provided:

**Sample Request**

	{
	  "Input": {
	    "ConnectionString":     
	    "DefaultEndpointsProtocol=https;AccountName=mystorageacct;AccountKey=mystorageacctKey",
	    "RelativeLocation": "/mycontainer/mydatablob.csv",
	    "BaseLocation": null,
	    "SasBlobToken": null
	  },
	  "Outputs": null,
	  "GlobalParameters": null
	}

The response to the batch job creation API is the unique job ID that is associated with your job. This ID is important since it provides the only means for you to reference this job in the system for other operations.  

**Sample Response**

	"539d0bc2fde945b6ac986b851d0000f0" // The JOB_ID

**2. Start a Batch Execution Job**

When you Create a batch job it is registered in the system and places it in a *Not started* state. To actually schedule the job for execution, you call the **start** API described on the service endpoint's API help page or the Web service's Swagger API page, and provide the job ID obtained when the job was created.

**3. Get the Status of a Batch Execution Job**

You can poll the status of your asynchronous batch job at any time by passing the job's ID to the *GetJobStatus* API. The API response contains an indicator of the job's current state and the results of the batch job indicating whether it has completed successfully. If there is an error, more information about the actual reason behind the failure is returned in the *Details* property, as shown here:

**Response Payload**

	{
	    "StatusCode": STATUS_CODE,
	    "Results": RESULTS,
	    "Details": DETAILS
	}

*StatusCode* can be one of the following:

* Not started
* Running
* Failed
* Canceled
* Finished

The *Results* property is populated when the job has successfully completed (it is **null** otherwise.) 
Once the job has completed, and if the service has at least one output node defined, the results are returned as a collection of *[output name, blob reference]* pairs, where the blob reference is a SAS read-only reference to the blob containing the result.

**Sample Response**

	{
	    "Status Code": "Finished",
	    "Results":
	    {
	        "dataOutput":
	        {              
	            "ConnectionString": null,
	            "RelativeLocation": "outputs/dataOutput.csv",
	            "BaseLocation": "https://mystorageaccount.blob.core.windows.net/",
	            "SasBlobToken": "?sv=2013-08-15&sr=b&sig=ABCD&st=2015-04-04T05%3A39%3A55Z&se=2015-04-05T05%3A44%3A55Z&sp=r"              
	        },
	        "trainedModelOutput":
	        {              
	            "ConnectionString": null,
	            "RelativeLocation": "models/trainedModel.ilearner",
	            "BaseLocation": "https://mystorageaccount.blob.core.windows.net/",
	            "SasBlobToken": "?sv=2013-08-15&sr=b&sig=EFGH%3D&st=2015-04-04T05%3A39%3A55Z&se=2015-04-05T05%3A44%3A55Z&sp=r"              
	        },           
	    },
	    "Details": null
	}

**4. Cancel a Batch Execution Job**

You can cancel a running batch job at any time by calling the designated *CancelJob* API and passing in the job's id. You might cancel for various reasons such as the job is taking too long to complete.

#### Using the BES SDK

The [BES SDK Nuget package](http://www.nuget.org/packages/Microsoft.Azure.MachineLearning/) provides functions that simplify calling BES to score in batch mode. To install the Nuget package, in Visual Studio in the **Tools** menu, select **Nuget Package Manager** and click **Package Manager Console**.

Azure Machine Learning experiments that are deployed as Web services can include Web service input modules. This means that input to the Web service is provided through a Web service call in the form of a reference to a blob location. There is also the option of not using a Web service input module and using an **Import Data** module instead. In this case, the **Import Data** module reads from a data source, such as a SQL DB using a query at run time. Web service parameters can be used to dynamically point to other servers or tables, etc. The SDK supports both of these patterns.

The following code sample demonstrates how to submit and monitor a batch job against an Azure Machine Learning service using the BES SDK. The comments contain details on the settings and calls.

#### **Sample Code**

	// This code requires the Nuget package Microsoft.Azure.MachineLearning to be installed.
	// Instructions for doing this in Visual Studio:
	// Tools -> Nuget Package Manager -> Package Manager Console
	// Install-Package Microsoft.Azure.MachineLearning

	  using System;
	  using System.Collections.Generic;
	  using System.Threading.Tasks;

	  using Microsoft.Azure.MachineLearning;
	  using Microsoft.Azure.MachineLearning.Contracts;
	  using Microsoft.Azure.MachineLearning.Exceptions;

	namespace CallBatchExecutionService
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {	            
	            InvokeBatchExecutionService().Wait();
	        }

	        static async Task InvokeBatchExecutionService()
	        {
	            // First collect and fill in the URI and access key for your Web service endpoint.
	            // These are available on your service's API help page.
	            var endpointUri = "https://ussouthcentral.services.azureml.net/workspaces/YOUR_WORKSPACE_ID/services/YOUR_SERVICE_ENDPOINT_ID/";
	            string accessKey = "YOUR_SERVICE_ENDPOINT_ACCESS_KEY";

	            // Create an Azure Machine Learning runtime client for this endpoint
	            var runtimeClient = new RuntimeClient(endpointUri, accessKey);

	            // Define the request information for your batch job. This information can contain:
	            // -- A reference to the AzureBlob containing the input for your job run
	            // -- A set of values for global parameters defined as part of your experiment and service
	            // -- A set of output blob locations that allow you to redirect the job's results

	            // NOTE: This sample is applicable, as is, for a service with explicit input port and
	            // potential global parameters. Also, we choose to also demo how you could override the
	            // location of one of the output blobs that could be generated by your service. You might
	            // need to tweak these features to adjust the sample to your service.
	            //
	            // All of these properties of a BatchJobRequest shown below can be optional, depending on
	            // your service, so it is not required to specify all with any request.  If you do not want to
	            // use any of the parameters, a null value should be passed in its place.

	            // Define the reference to the blob containing your input data. You can refer to this blob by its
                    // connection string / container / blob name values; alternatively, we also support references
                    // based on a blob SAS URI

                    BlobReference inputBlob = BlobReference.CreateFromConnectionStringData(connectionString:                                         "DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT_NAME;AccountKey=YOUR_ACCOUNT_KEY",
                        containerName: "YOUR_CONTAINER_NAME",
                        blobName: "YOUR_INPUT_BLOB_NAME");

                    // If desired, one can override the location where the job outputs are to be stored, by passing in
                    // the storage account details and name of the blob where we want the output to be redirected to.

                    var outputLocations = new Dictionary<string, BlobReference>
                        {
                          {
                           "YOUR_OUTPUT_NODE_NAME",
                           BlobReference.CreateFromConnectionStringData(                                     connectionString: "DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT_NAME;AccountKey=YOUR_ACCOUNT_KEY",
                                containerName: "YOUR_CONTAINER_NAME",
                                blobName: "YOUR_DESIRED_OUTPUT_BLOB_NAME")
                           }
                        };

	            // If applicable, you can also set the global parameters for your service
	            var globalParameters = new Dictionary<string, string>
	            {
	                { "YOUR_GLOBAL_PARAMETER", "PARAMETER_VALUE" }
	            };

	            var jobRequest = new BatchJobRequest
	            {
	                Input = inputBlob,
	                GlobalParameters = globalParameters,
	                Outputs = outputLocations
	            };

	            try
	            {
	                // Register the batch job with the system, which will grant you access to a job object
	                BatchJob job = await runtimeClient.RegisterBatchJobAsync(jobRequest);

	                // Start the job to allow it to be scheduled in the running queue
	                await job.StartAsync();

	                // Wait for the job's completion and handle the output
	                BatchJobStatus jobStatus = await job.WaitForCompletionAsync();
	                if (jobStatus.JobState == JobState.Finished)
	                {
	                    // Process job outputs
	                    Console.WriteLine(@"Job {0} has completed successfully and returned {1} outputs", job.Id, jobStatus.Results.Count);
	                    foreach (var output in jobStatus.Results)
	                    {
	                        Console.WriteLine(@"\t{0}: {1}", output.Key, output.Value.AbsoluteUri);
	                    }
	                }
	                else if (jobStatus.JobState == JobState.Failed)
	                {
	                    // Handle job failure
	                    Console.WriteLine(@"Job {0} has failed with this error: {1}", job.Id, jobStatus.Details);
	                }
	            }
	            catch (ArgumentException aex)
	            {
	                Console.WriteLine("Argument {0} is invalid: {1}", aex.ParamName, aex.Message);
	            }
	            catch (RuntimeException runtimeError)
	            {
	                Console.WriteLine("Runtime error occurred: {0} - {1}", runtimeError.ErrorCode, runtimeError.Message);
	                Console.WriteLine("Error details:");
	                foreach (var errorDetails in runtimeError.Details)
	                {
	                    Console.WriteLine("\t{0} - {1}", errorDetails.Code, errorDetails.Message);
	                }
	            }
	            catch (Exception ex)
	            {
	                Console.WriteLine("Unexpected error occurred: {0} - {1}", ex.GetType().Name, ex.Message);
	            }
	        }
	    }
	}

#### Sample code in Java for BES

The Batch execution service REST API takes the JSON consisting of a reference to an input sample csv and an output sample csv, as shown in the following sample, and creates a job in the Azure ML to do the batch predictions. You can view the full code in [Github](https://github.com/nk773/AzureML_BESApp/tree/master/src/azureml_besapp). This Java sample requires [apache http client library](https://hc.apache.org/downloads.cgi). 


	{ "GlobalParameters": {}, 
    	"Inputs": { "input1": { "ConnectionString": 	"DefaultEndpointsProtocol=https;
			AccountName=myAcctName; AccountKey=Q8kkieg==", 
        	"RelativeLocation": "myContainer/sampleinput.csv" } }, 
    	"Outputs": { "output1": { "ConnectionString": 	"DefaultEndpointsProtocol=https;
			AccountName=myAcctName; AccountKey=kjC12xQ8kkieg==", 
        	"RelativeLocation": "myContainer/sampleoutput.csv" } } 
	} 


##### Create a BES job	
	    
	    /**
	     * Call REST API to create a job to Azure ML 
	     * for batch predictions
	     * @return response from the REST API
	     */	
	    public static String besCreateJob() {
	        
	        HttpPost post;
	        HttpClient client;
	        StringEntity entity;
	        
	        try {
	            // create HttpPost and HttpClient object
	            post = new HttpPost(apiurl);
	            client = HttpClientBuilder.create().build();
	            
	            // setup output message by copying JSON body into 
	            // apache StringEntity object along with content type
	            entity = new StringEntity(jsonBody, HTTP.UTF_8);
	            entity.setContentEncoding(HTTP.UTF_8);
	            entity.setContentType("text/json");
	
	            // add HTTP headers
	            post.setHeader("Accept", "text/json");
	            post.setHeader("Accept-Charset", "UTF-8");
	        
	            // set Authorization header based on the API key
				// note a space after the word "Bearer " - don't miss that
	            post.setHeader("Authorization", ("Bearer "+apikey));
	            post.setEntity(entity);
	
	            // Call REST API and retrieve response content
	            HttpResponse authResponse = client.execute(post);
	            
	            jobId = EntityUtils.toString(authResponse.getEntity()).replaceAll("\"", "");
	            
	            
	            return jobId;
	            
	        }
	        catch (Exception e) {
	            
	            return e.toString();
	        }
	    
	    }
	    
##### Start a previously created BES job	    
    
	    /**
	     * Call REST API for starting prediction job previously submitted 
	     * 
	     * @param job job to be started 
	     * @return response from the REST API
	     */	
	    public static String besStartJob(String job){
	        HttpPost post;
	        HttpClient client;
	        StringEntity entity;
	        
	        try {
	            // create HttpPost and HttpClient object
	            post = new HttpPost(startJobUrl+"/"+job+"/start?api-version=2.0");
	            client = HttpClientBuilder.create().build();
	         
	            // add HTTP headers
	            post.setHeader("Accept", "text/json");
	            post.setHeader("Accept-Charset", "UTF-8");
	        
	            // set Authorization header based on the API key
	            post.setHeader("Authorization", ("Bearer "+apikey));
	
	            // Call REST API and retrieve response content
	            HttpResponse authResponse = client.execute(post);
	            
	            if (authResponse.getEntity()==null)
	            {
	                return authResponse.getStatusLine().toString();
	            }
	            
	            return EntityUtils.toString(authResponse.getEntity());
	            
	        }
	        catch (Exception e) {
	            
	            return e.toString();
	        }
	    }
##### Cancel a previously created BES job
	    
	    /**
	     * Call REST API for canceling the batch job 
	     * 
	     * @param job job to be started 
	     * @return response from the REST API
	     */	
	    public static String besCancelJob(String job) {
	        HttpDelete post;
	        HttpClient client;
	        StringEntity entity;
	        
	        try {
	            // create HttpPost and HttpClient object
	            post = new HttpDelete(startJobUrl+job);
	            client = HttpClientBuilder.create().build();
	         
	            // add HTTP headers
	            post.setHeader("Accept", "text/json");
	            post.setHeader("Accept-Charset", "UTF-8");
	        
	            // set Authorization header based on the API key
	            post.setHeader("Authorization", ("Bearer "+apikey));
	
	            // Call REST API and retrieve response content
	            HttpResponse authResponse = client.execute(post);
	         
	            if (authResponse.getEntity()==null)
	            {
	                return authResponse.getStatusLine().toString();
	            }
	            return EntityUtils.toString(authResponse.getEntity());
	            
	        }
	        catch (Exception e) {
	            
	            return e.toString();
	        }
	    }
	    
### Other programming environments

You can also generate the code in many other languages following the directions provided at [swagger.io](http://swagger.io/) site. For a Classic Web service you can get the swagger document:

* From the API help page 
* By calling Get API Document for Endpoint, found on the Swagger API page of Machine Learning Web Services portal. 

Go to the [swagger.io](http://swagger.io/swagger-codegen/) and follow the instructions to download swagger code, java, and apache mvn. 

The following list is the summary of instructions on setting up swagger for other programming environments.

* Make sure Java 7 or higher is installed
* Install apache mvn (On ubuntu, you can use *apt-get install mvn*)
* Goto github for swagger and download the swagger project as a zip file
* Unzip swagger
* Build swagger tools by running *mvn package* from the swagger's source directory

Now you can use any of the swagger tools. Here are the instructions to generate Java client code. 

* Go to the Azure ML API Help page (example [here](https://studio.azureml.net/apihelp/workspaces/afbd553b9bac4c95be3d040998943a4f/webservices/4dfadc62adcc485eb0cf162397fb5682/endpoints/26a3afce1767461ab6e73d5a206fbd62/jobs))
* Find the URL for swagger.json for Azure ML REST APIs (second last bullet on top of API help page)
* Click the swagger document link (example [here](https://management.azureml.net/workspaces/afbd553b9bac4c95be3d040998943a4f/webservices/4dfadc62adcc485eb0cf162397fb5682/endpoints/26a3afce1767461ab6e73d5a206fbd62/apidocument))
* Use the following command as shown in the [Read Me file of swagger](https://github.com/swagger-api/swagger-codegen/blob/master/README.md) to generate the client code

**Sample Command Line to generate client code**

	java -jar swagger-codegen-cli.jar generate\
	 -i https://ussouthcentral.services.azureml.net:443/workspaces/\
	fb62b56f29fc4ba4b8a8f900c9b89584/services/26a3afce1767461ab6e73d5a206fbd62/swagger.json\
	 -l java -o /home/username/sample

* Combine values in the fields host, basePath and "/swagger.json" in the sample of a swagger [API help page](https://management.azureml.net/workspaces/afbd553b9bac4c95be3d040998943a4f/webservices/4dfadc62adcc485eb0cf162397fb5682/endpoints/26a3afce1767461ab6e73d5a206fbd62/apidocument) shown below to construct swagger URL used in the preceding command line.

**Sample API Help Page**


	{
	  "swagger": "2.0",
	  "info": {
	    "version": "2.0",
	    "title": "Sample 5: Binary Classification with Web service: Adult Dataset [Predictive Exp.]",
	    "description": "No description provided for this Web service.",
	    "x-endpoint-name": "default"
	  },
	  "host": "ussouthcentral.services.azureml.net:443",
	  "basePath": "/workspaces/afbd553b9bac4c95be3d040998943a4f/services/26a3afce1767461ab6e73d5a206fbd62",
	  "schemes": [
	    "https"
	  ],
	  "consumes": [
	    "application/json"
	  ],
	  "produces": [
	    "application/json"
	  ],
	  "paths": {
	    "/swagger.json": {
	      "get": {
	        "summary": "Get swagger API document for the Web service",
	        "operationId": "getSwaggerDocument",
	        
<!-- Relative Links -->

[publish]: machine-learning-publish-a-machine-learning-web-service.md
[walkthrough]: machine-learning-walkthrough-develop-predictive-solution.md

<!-- External Links -->
[webservicesportal]: https://services.azureml.net/
[mlstudio]: https://studio.azureml.net