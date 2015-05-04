<properties 
	pageTitle="Connect to an Azure Machine Learning Web Service | Azure" 
	description="With C# or Python, connect to an Azure Machine Learning web service using an authorization key." 
	services="machine-learning" 
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="derrickv" />


# Connect to an Azure Machine Learning Web Service 
The Azure Machine Learning developer experience is a web service API to make predictions from input data in real time or in batch mode. You use the Azure Machine Learning Studio to create predictions and publish an Azure Machine Learning web service. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

To learn about how to create and publish an Azure Machine Learning web service using Studio:

- [Publish a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md)
- [Getting Started with ML Studio](http://azure.microsoft.com/documentation/videos/getting-started-with-ml-studio/)
- [Azure Machine Learning Preview](https://studio.azureml.net/)
- [Machine Learning Documentation Center](http://azure.microsoft.com/documentation/services/machine-learning/)

## Azure Machine Learning web service ##

With the Azure Machine Learning (ML) web service, an external application communicates with an ML workflow scoring model in real time. An ML web service call returns prediction results to an external application. To make an ML web service call, you pass an API key which is created when you publish a prediction. The ML web service is based on REST, a popular architecture choice for web programming projects.

Azure Machine Learning has two types of services:

- Request-Response Service (RRS) – A low latency, highly scalable service that provides an interface to the stateless models created and published from the ML Studio.
- Batch Execution Service (BES) – An asynchronous service that scores a batch for data records.

For more information about Azure Machine Learning web services, see [Publish a Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

## Get an Azure Machine Learning authorization key ##
You get a web service API key from an ML web service. You can get it from Microsoft Azure Machine Learning studio or the Azure Management Portal.
### Microsoft Azure Machine Learning studio ###
1. In Microsoft Azure Machine Learning studio, click **WEB SERVICES** on the left.
2. Click a web service. The “API key” is on the **DASHBOARD** tab.

### Azure Management Portal ###

1. Click **MACHINE LEARNING** on the left.
2. Click a workspace.
3. Click **WEB SERVICES**.
4. Click a web service.
5. Click an endpoint. The “API KEY” is down at the lower-right.

## <a id="connect"></a>Connect to an Azure Machine Learning web service

You can connect to an Azure Machine Learning web service using any programming language that supports HTTP request and response. You can view examples in C#, Python, and R from an Azure ML web service help page.

### To view an Azure ML Web Service API help page ###
An Azure ML API help page is created when you publish a web service. See [Azure Machine Learning Walkthrough- Publish Web Service](machine-learning-walkthrough-5-publish-web-service.md).


**To view an Azure ML API help page**
In Microsoft Azure Machine Learning Studio:

1. Choose **WEB SERVICES**.
2. Choose a web service.
3. Choose **API help page** - **REQUEST/RESPONSE** or **BATCH EXECUTION**.


**Azure ML API help page**
The Azure ML API help page contains details about a prediction web service including


<table>
	<tr>
		<td>&nbsp;</td>
		<td>Example </td>
	</tr>
	<tr>
		<td>Request POST URI </td>

		<td>https://ussouthcentral.services.azureml.net/workspaces/{WorkspaceId}/services/{ServiceId}/score
		</td>
	</tr>
	<tr>
		<td>Sample Request </td>
		<td>{ <br/> 
			&nbsp;&nbsp; "Id": "score00001",   <br/>
			&nbsp;&nbsp; "Instance": <br/>
			&nbsp;&nbsp;&nbsp;&nbsp; {  <br/>  
 			&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; "FeatureVector": { <br/>
			&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  "Col1": "0", <br/>      
			&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  "Col2": "0", <br/>      
			&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  "Col3": "0", <br/>  
			&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  ...     },   <br/>
			&nbsp;&nbsp;&nbsp;&nbsp;   "GlobalParameters": {}   <br/>
			&nbsp;&nbsp;&nbsp;&nbsp; } <br/>
		}</td>
	</tr>
	<tr>
		<td>Response Body </td>
		<td>
		<table style="width: 100%">

			<tr>
				<td><B>Name</B></td>
				<td><B>Data Type</B></td>
			</tr>
	
			<tr>
				<td>Feature</td>
				<td>String</td>
			</tr>
			<tr>
				<td>Count</td>
				<td>Numeric</td>
			</tr>
			<tr>
				<td>Unique Value Count </td>
				<td>Numeric </td>
			</tr>
			<tr>
				<td>... </td>
				<td>... </td>
			</tr>
		</table>
		</td>
	</tr>
	<tr>
		<td>Sample Response </td>
		<td>[&quot;Col1&quot;,&quot;1&quot;,&quot;1&quot;,…] </td>
	</tr>
	<tr>
		<td>Sample Code </td>
		<td>(Sample code in C#, Python, and R) </td>
	</tr>
</table>

**NOTE** The examples are from Sample 1: Download dataset from UCI: Adult 2 class dataset part of the Azure ML sample collection.

### C# Sample ###

To connect to an Azure ML web service, use an **HttpClient** passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Azure ML service with an API key.

To connect to an ML web service, the **Microsoft.AspNet.WebApi.Client** Nuget package must be installed.

**Install Microsoft.AspNet.WebApi.Client Nuget in Visual Studio**

1. Publish the Download dataset from UCI: Adult 2 class dataset Web Service.
2. Click **Tools** > **Nuget Package Manager** > **Package Manager Console**.
2. Choose **Install-Package Microsoft.AspNet.WebApi.Client**.

**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Azure ML sample collection.
2. Assign apiKey with the key from a web service. See How to get an Azure ML authorization key.
3. Assign serviceUri with the Request URI. See How to get a Request URI.

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
	    public class ScoreData
	    {
	        public Dictionary<string, string> FeatureVector { get; set; }
	        public Dictionary<string, string> GlobalParameters { get; set; }
	    }
	
	    public class ScoreRequest
	    {
	        public string Id { get; set; }
	        public ScoreData Instance { get; set; }
	    }
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            InvokeRequestResponseService().Wait();
	
	            Console.ReadLine();
	        }
	
	        static async Task InvokeRequestResponseService()
	        {
	            //Assign apiKey with the key from a web service.
	            const string apiKey = "{ApiKey}";
	
	            //Assign serviceUri with the Request URI. See How to get a Request URI.
	            const string serviceUri = "{ServiceUri}";
	            
	            using (var client = new HttpClient())
	            {
	                ScoreData scoreData = new ScoreData()
	                {
	                    //Input data
	                    FeatureVector = new Dictionary<string, string>() 
	                    {
	                        { "Col1", "0" },
	                        { "Col2", "0" },
	                        { "Col3", "0" },
	                        { "Col4", "0" },
	                        { "Col5", "0" },
	                        { "Col6", "0" },
	                        { "Col7", "0" },
	                        { "Col8", "0" },
	                        { "Col9", "0" },
	                        { "Col10", "0" },
	                        { "Col11", "0" },
	                        { "Col12", "0" },
	                        { "Col13", "0" },
	                        { "Col14", "0" },
	                        { "Col15", "0" },
	                    },
	                    GlobalParameters = 
	                        new Dictionary<string, string>() {}
	                };
	
	                ScoreRequest scoreRequest = new ScoreRequest()
	                {
	                    Id = "score00001",
	                    Instance = scoreData
	                };
	
	                //Set authorization header
	                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue( "Bearer", apiKey);
	             
	                client.BaseAddress = new Uri(serviceUrl);
	
	                //Post HTTP response message
	                HttpResponseMessage response = await client.PostAsJsonAsync("", scoreRequest);
	
	                if (response.IsSuccessStatusCode)
	                {
	                    //Read result string
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


### Python Sample ###

To connect to an Azure ML web service, use the **urllib2** library passing ScoreData. ScoreData contains a FeatureVector, an n-dimensional  vector of numerical features that represents the ScoreData. You authenticate to the Azure ML service with an API key.


**To run the code sample**

1. Publish "Sample 1: Download dataset from UCI: Adult 2 class dataset" experiment, part of the Azure ML sample collection.
2. Assign apiKey with the key from a web service. See How to get an Azure ML authorization key.
3. Assign serviceUri with the Request URI. See How to get a Request URI.

		import urllib2
		# If you are using Python 3+, import urllib instead of urllib2
	
		import json 
	
		data =  {
	            "Id": "score00001",
	            "Instance": {
	                "FeatureVector": {
	                    "Col1": "0",
	                    "Col2": "0",
	                    "Col3": "0",
	                    "Col4": "0",
	                    "Col5": "0",
	                    "Col6": "0",
	                    "Col7": "0",
	                    "Col8": "0",
	                    "Col9": "0",
	                    "Col10": "0",
	                    "Col11": "0",
	                    "Col12": "0",
	                    "Col13": "0",
	                    "Col14": "0",
	                    "Col15": "0",
	                },
	                "GlobalParameters": { }
	            }
	        }
	
		body = str.encode(json.dumps(data))
	
		#Assign serviceUrl with the Request URI. See How to get a Request URI.
		uri = '{ServiceUri}'
	
		#Assign apiKey with the key from a web service.
		api_key = '{ApiKey}'
		headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}
	
		req = urllib2.Request(uri, body, headers) 
		response = urllib2.urlopen(req)
	
		#If you are using Python 3+, replace urllib2 with urllib.request in the above code:
		#req = urllib.request.Request(uri, body, headers) 
		#response = urllib.request.urlopen(req)
	
		result = response.read()
		print(result) 
