
<properties
	pageTitle="Getting recommendations in batches: Machine learning recommendations API | Microsoft Azure"
	description="Azure machine learning recommendations--getting recommendations in batches"
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

# Get recommendations in batches

>[AZURE.NOTE] Getting recommendations in batches is more complicated than getting recommendations one at a time. Check the APIs for information about how to get recommendations for a single request:

> [Item-to-Item recommendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3d4)<br>
> [User-to-Item recommendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3dd)
>
> Batch scoring only works for builds that were created after July 21, 2016.


There are situations in which you need to get recommendations for more than one item at a time. For instance, you might be interested in creating a recommendations cache or even analyzing the types of recommendations that you are getting.

Batch scoring operations, as we call them, are asynchronous operations. You need to submit the request, wait for the operation to finish, and then gather your results.  

To be more precise, these are the steps to follow:

1.	Create an Azure Storage container if you don’t have one already.
2.	Upload an input file that describes each of your recommendation requests to Azure Blob storage.
3.	Kick-start the scoring batch job.
4.	Wait for the asynchronous operation to finish.
5.	When the operation has finished, gather the results from Blob storage.

Let’s walk through each of these steps.

## Create a Storage container if you don’t have one already

Go to the [Azure portal](https://portal.azure.com) and create a new storage account if you don’t have one already. To do this, navigate to **New** > **Data** + **Storage** > **Storage Account**.

After you have a storage account, you need to create the blob containers where you will store the input and output of the batch execution.

Upload an input file that describes each of your recommendation requests to Blob storage--let's call the file input.json here.
After you have a container, you need to upload a file that describes each of the requests that you need to perform from the recommendations service.

A batch can perform only one type of request from a specific build. We will explain how to define this information in the next section. For now, let’s assume that we will be performing item recommendations out of a specific build. The input file then contains the input information (in this case, the seed items) for each of the requests.

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

As you can see, the file is a JSON file, where each of the requests has the information that's necessary to send a recommendations request. Create a similar JSON file for the requests that you need to fulfill, and copy it to the container that you just created in Blob storage.

## Kick-start the batch job

The next step is to submit a new batch job. For more information, check the [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/).

The request body of the API needs to define the locations where the input, output, and error files need to be stored. It also needs to define the credentials that are necessary to access those locations. In addition, you need to specify some parameters that apply to the whole batch (the type of recommendations to request, the model/build to use, the number of results per call, and so on.)

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

Here a few important things to note:

-	Currently, **authenticationType** should always be set to **PublicOrSas**.

-	You need to get a Shared Access Signature (SAS) token to allow the Recommendations API to read and write from/to your Blob storage account. More information about how to generate SAS tokens can be found on [the Recommendations API page](../storage/storage-dotnet-shared-access-signature-part-1.md).

-	The only **apiName** that's currently supported is **ItemRecommend**, which is used for Item-to-Item  recommendations. Batching doesn't currently support User-to-Item recommendations.

## Wait for the asynchronous operation to finish

When you start the batch operation, the response returns the Operation-Location header that gives you the information that's necessary to track the operation.
You track the operation by using the [Retrieve Operation Status API]( https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3da), just like you do for tracking the operation of a build operation.

## Get the results

After the operation has finished, assuming that there were no errors, you can gather the results from your output Blob storage.

The example below show what the output might look like. In this example, we show results for a batch with only two requests (for brevity).

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


## Learn about the limitations

-	Only one batch job can be called per subscription at a time.
-	A batch job input file cannot be more than 2 MB.
