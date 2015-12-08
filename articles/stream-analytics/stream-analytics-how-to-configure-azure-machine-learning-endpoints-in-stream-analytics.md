<properties 
	pageTitle="How to configure Azure Machine Learning endpoints in Stream Analytics | Microsoft Azure" 
	description="Machine Language User defined functions in Stream Analytics"
	keywords=""
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
	ms.date="12/07/2015" 
	ms.author="jeffstok"
/>

# Introduction: Machine Learning user defined function capabilities in Stream Analytics

Stream Analytics provides support for user defined functions that call out to Azure Machine Learning endpoints. REST API support for this feature is detailed in the Stream Analytics REST API library. This article provides supplemental information needed for successful implementation of this capability in Stream Analytics.

## Overview: Azure Machine Learning terminology

Microsoft Azure Machine Learning provides a collaborative, drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions on your data. This tool is called the *Azure Machine Learning Studio*. The studio will be utilized to interact with the Machine Learning resources and easily build, test and iterate on your design. These resources and their definitions are below.

- **Workspace**: The *workspace* is a container that holds all other Machine Learning resources together in a container for management and control.
- **Experiment**: *Experiments* are created by data scientists to utilize datasets and train a machine learning model.
- **Endpoint**: *Endpoints* are the Azure Machine Learning object used to apply the experiment to input and return output. 
- **Scoring Webservice**: A *scoring webservice* is utilized to apply a trained experiment to one or more endpoints.

Each endpoint has apis for batch execution and synchronous execution. Stream Analytics uses synchronous execution exclusively. The specific service is named a [Request/Response Service](./articles/machine-learning-consume-web-services/#request-response-service-rrs "Azure Machine Learning request-response service") in AzureML studio.

## AzureML resources that are needed for Stream Analytics jobs

For the purposes of Stream Analytics job processing, a Request/Response endpoint, an [apikey](./articles/machine-learning-connect-to-azure-machine-learning-web-service/#get-an-azure-machine-learning-authorization-key "Azure Machine Learning API Key") and a swagger definition are all necessary for successful execution. Stream Analytics has an additional endpoint that constructs the url for swagger endpoint, looks up the interface and returns a default UDF definition to the user.

## Configuring a Stream Analytics job with Azure Machine Learning functions via the REST API

By using REST APIs you may configure your job to call Azure Machine Language functions. The steps are as follows:

1. Create a Stream Analytics job
2. Define an input
3. Define an output
4. Create a user defined function (UDF)
5. Write a Stream Analytics transformation that calls the UDF
6. Start the job

## Creating a UDF with basic properties

As an example, the following sample code creates a scalar UDF named *newudf* that binds to an Azure Machine Learning endpoint. Note that the en**dpoint (service URI) can be found on the API help page for the chosen service and the *apiKey* can be found on the services main page.

PUT : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>?api-version=<apiVersion>  

Example request body:  

	{
	"name": "newudf",
	"properties": {
    	"type": "Scalar",
	   	"properties": {
     		"binding": {
       			"type": "Microsoft.MachineLearning/WebService",
       			"properties": {
         				"endpoint": "https://ussouthcentral.services.azureml.net/workspaces/f80d5d7a77fb4b46bf2a30c63c078dca/services/b7be5e40fd194258796fb402c1958eaf/execute ",
         				"apiKey": "replacekeyhere",
    					}
    			}
    		}
		}
	}

## Call the RetrieveDefaultDefinition endpoint to get default UDF

Once this is entered, the complete definition of the UDF is needed. The RetrieveDefaultDefinition is performed. The payload below requires you to get the default UDF definition for a scalar function that is bound to an Azure Machine Learning endpoint. It doesn’t specify the actual endpoint as it has already been provided during PUT request. Stream Analytics will call the endpoint from the request if it is provided explicitly. However it will use the one located in the database if one is not explicitly provided. Here the UDF takes a single string parameter (which is a sentenc)e and returns a single output of type string which indicates the “sentiment” label for that sentence.

POST : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>/RetrieveDefaultDefinition?api-version=<apiVersion>

Example request body:  

	{
	"bindingType": "Microsoft.MachineLearning/WebService",
	"bindingRetrievalProperties": {
		"executeEndpoint": null,
		"udfype": "Scalar"
		}
	}

A sample output of this would look something like below.  

	{
	"name": "newudf",
	"properties": {
		"type": "Scalar",
		"properties": {
			"inputs": [
			{
			"dataType": "nvarchar(max)",
			"isConfigurationParameter": null
			}
			],
		"output": {
			"dataType": "nvarchar(max)"
		},
		"binding": {
			"type": "Microsoft.MachineLearning/WebService",
			"properties": {
			"endpoint": "https://ussouthcentral.services.azureml.net/workspaces/f80d5d7a77ga4a4bbf2a30c63c078dca/services/b7be5e40fd194258896fb602c1858eaf/execute",
			"apiKey": null,
			"inputs": {
				"name": "input1",
				"columnNames": [
				{
					"name": "tweet",
					"dataType": "string",
					"mapTo": 0
				}
				]
			},
			"outputs": [
				{
					"name": "Sentiment",
					"dataType": "string"
				}
				],
				"batchSize": 10
				}
			}
		}
	}

## Patch the UDF with the previous response 

Now the UDF must be patched with the previous response, as shown below.

PATCH : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>?api-version=<apiVersion>

Request Body: Output from  RetrieveDefaultDefinition

## Implement a Stream Analytics transformation that calls the UDF

Now query the UDF (here named scoreTweet) for every input event and write a response for that event to an output.  

	{
		"name": "transformation",
		"properties": {
			"streamingUnits": null,
			"query": "select *,scoreTweet(Tweet) TweetSentiment into blobOutput from blobInput"
		}
	}

For further information see:


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)