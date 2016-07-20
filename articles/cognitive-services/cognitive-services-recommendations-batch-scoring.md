<properties
	pageTitle="Getting Recommendations in Batches: Machine Learning Recommendations API | Microsoft Azure"
	description="Azure Machine Learning Recommendations - Getting Recommendations IN bATCHES"
	services="cognitive-services"
	documentationCenter=""
	authors="luiscabrer"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="cognitive-services"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/24/2016"
	ms.author="luisca"/>

# Getting recommendations in batches

> **Note**
> Getting recommendations in batches is more complicated than getting a recommendation results one at a time. Please do check the APIs for getting recommendations for a single request here:<br>
> [Item-to-Item Recoomendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3d4)<br>
> [User-to-Item Recommendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3dd)
>
> Batch scoring only works for builds created after July 21. 2016


There are situations when you need to get recommendations for more than one item at a time. For instance, you may be interested in creating a recommendations cache or even doing an analysis on the types of recommendations you are getting.

Batch scoring operations as we call them, are asynchronous operations. You need to submit the request, wait for the operation to complete, and then gather your results.  
To be more precise, these are the steps to follow:

1.	Create an Azure Storage Container if you don’t have one already.
2.	Upload an input file that describes each of your recommendation requests to Azure Blob Storage.
3.	Kick-start the scoring batch job.
4.	Wait for the asynchronous operation to complete.
5.	Once completed, gather the results from Azure Blob Storage.

Let’s walk through each of these steps.

## Create an Azure Storage Container if you don’t have one already

Go to the [Azure Management Portal](https://portal.azure.com) and create a new storage account if you don’t have one already by navigating to *+New* > *Data* + *Storage* > *Storage Account*.

Once you have a storage account, you need to create the blob container(s) where you will store the input and output of the batch execution.

Upload an input file that describes each of your recommendation requests to Azure Blob - let's call it input.json here.
Once you have a container, you need to upload a file that describes each of the requests that you need to perform from the recommendations service. A given batch can perform only one type of request from a specific build. We will explain how to define this information in the next section, for now let’s assume that we will be performing item recommendations out of a specific build. The input file then contains the input information (in this case the seed items) for each of the requests.

This is an example of what the input.json file looks like:

    {
      "requests": [
      { "SeedItems": [ "C9F-00163", "FKF-00689" ] },
      { "SeedItems": [ "F34-03453" ] },
      { "SeedItems": [ "D16-3244" ] },
      { "SeedItems": [ "C9F-00163", "FKF-00689" ] },
      { "SeedItems": [ "F43-01467" ] },
      { "SeedItems": [ "BD5-06013" ] },
      { "SeedItems": [ "P45-00163", "FKF-00689" ] },
      { "SeedItems": [ "C9A-69320" ] }
      ]
    }
    
As you can see, the file is a JSON file, where each of the requests has the information necessary to send a recommendations request. Create a similar JSON file for the requests you need to fulfill, and copy it to the container you just created in blob storage.

## Kick-start the batch job

The next step is to submit a new batch job. Check the API reference [here](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/).

The request body of the API needs to define the locations where the input, output and error files need to be stored, as well as the credentials necessary to access those locations. In addition, you need to specify some parameters that apply to the whole batch (the type of recommendations to request, the model/build to use, number of results per call, etc.)

This is an example of what the request body should look like:

    {
      "input": {
        "authenticationType": "PublicOrSas",
        "baseLocation": "https://mystorage1.blob.core.windows.net/",
        "relativeLocation": "container1/batchInput.json",
        "sasBlobToken": "?sv=2015-07_restofToken_…4Z&sp=rw"
      },
      "output": {
        "authenticationType": "PublicOrSas",
        "baseLocation": "https://mystorage1.blob.core.windows.net/",
        "relativeLocation": "container1/batchOutput.json ",
        "sasBlobToken": "?sv=2015-07_restofToken_…4Z&sp=rw"
      },
      "error": {
        "authenticationType": "PublicOrSas",
        "baseLocation": "https://mystorage1.blob.core.windows.net/",
        "relativeLocation": "container1/errors.txt",
        "sasBlobToken": "?sv=2015-07_restofToken_…4Z&sp=rw"
      },
      "job": {
        "apiName": "ItemRecommend",
        "modelId": "9ac12a0a-1add-4bdc-bf42-c6517942b3a6",
        "buildId": 1015703,
        "numberOfResults": 10,
        "includeMetadata": true,
        "minimalScore": 0.0
      }
    }

A few things to point out:

1.	Currently AuthenticationType should always be set to PublicOrSas.
2.	You need to get a Shared Access Signature (SAS) token to allow the Recommendations API to read and write from/to your blob storage account. More information on generating SAS tokens can be found [here](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)
3.	The only *apiName* currently supported is “ItemRecommend” which is used for Item-to-Item  recommendations. User to Item recommendations are not supported by batching right now.

## Wait for the asynchronous operation to complete.

When you start the batch operation, the response will return the Operation-Location header that will give you the information necessary to track the operation.
You track the operation using the [Retrieve Operation Status API]( https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3da), just like you do for tracking the operation of a build operation.

## Get the results

Once the operation is completed, and assuming that there were no errors in the operation you can gather the results from your output blob storage.

The sample below show an example of what the output may look like. In the example we show results for a batch with two requests for brevity.

    {
      "results":
      [   
        {
          "request": { "seedItems": [ "DAF-00500", "P3T-00003" ] },
          "recommendations": [
            {
              "items": [
                {
                  "itemId": "F5U-00011",
                  "name": "L2 Ethernet Adapter-Win8Pro SC EN/XD/XX Hdwr",
                  "metadata": ""
                }
              ],
              "rating": 0.722,
              "reasoning": [ "People who like the selected items also like 'L2 Ethernet Adapter-Win8Pro SC EN/XD/XX Hdwr'" ]
            },
            {
              "items": [
                {
                  "itemId": "G5Y-00001",
                  "name": "Docking Station for Srf Pro/Pro2 SC EN/XD/ES Hdwr",
                  "metadata": ""
                }
              ],
              "rating": 0.718,
              "reasoning": [ "People who like the selected items also like 'Docking Station for Srf Pro/Pro2 SC EN/XD/ES Hdwr'" ]
            }
          ]
        },
        {
          "request": { "seedItems": [ "C9F-00163" ] },
          "recommendations": [
            {
              "items": [
                {
                  "itemId": "C9F-00172",
                  "name": "Nokia 2K Shell for Nokia Lumia 630/635 - Green",
                  "metadata": ""
                }
              ],
              "rating": 0.649,
              "reasoning": [ "People who like 'MOZO Flip Cover for Nokia Lumia 635 - White' also like 'Nokia 2K Shell for Nokia Lumia 630/635 - Green'" ]
            },
            {
              "items": [
                {
                  "itemId": "C9F-00171",
                  "name": "Nokia 2K Shell for Nokia Lumia 630/635 - Orange",
                  "metadata": ""
                }
              ],
              "rating": 0.647,
              "reasoning": [ "People who like 'MOZO Flip Cover for Nokia Lumia 635 - White' also like 'Nokia 2K Shell for Nokia Lumia 630/635 - Orange'" ]
            },
            {
              "items": [
                {
                  "itemId": "C9F-00170",
                  "name": "Nokia 2K Shell for Nokia Lumia 630/635 - Yellow",
                  "metadata": ""
                }
              ],
              "rating": 0.646,
              "reasoning": [ "People who like 'MOZO Flip Cover for Nokia Lumia 635 - White' also like 'Nokia 2K Shell for Nokia Lumia 630/635 - Yellow'" ]
            }       
          ]
        }
    ]}


## Limitations

1.	Only one batch job can be called per subscription at a time.
2.	A batch job input file cannot be more than 2MB.

