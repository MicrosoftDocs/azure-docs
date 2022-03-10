---
title: Subclip a video when encoding with Media Services
description: This topic describes how to subclip a video when encoding with Azure Media Services.
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/09/2022
ms.author: inhenkel
---

# Subclip a video

You can trim or subclip a video when encoding it using a Media Services Job. 

This functionality works with any Transform that is built using either the BuiltInStandardEncoderPreset presets, or the StandardEncoderPreset presets.

## [REST](#tab/rest/)

## Subclip a video when encoding with Media Services - REST

You can trim or subclip a video when encoding it using a [Job](/rest/api/media/jobs). This functionality works with any [Transform](/rest/api/media/transforms) that is built using either the [BuiltInStandardEncoderPreset](/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset) presets, or the [StandardEncoderPreset](/rest/api/media/transforms/createorupdate#standardencoderpreset) presets. 

The REST example in this topic creates a job that trims a video as it submits an encoding job. 

[!INCLUDE [warning-rest-api-retry-policy.md](./includes/warning-rest-api-retry-policy.md)]

## Prerequisites

To complete the steps described in this topic, you have to:

- [Create an Azure Media Services account](./account-create-how-to.md).
- [Configure Postman for Azure Media Services REST API calls](setup-postman-rest-how-to.md).
    
    Make sure to follow the last step in the topic [Get Azure AD Token](setup-postman-rest-how-to.md#get-azure-ad-token). 
- Create a Transform and an output Assets. You can see how to create a Transform and an output Assets in the [Encode a remote file based on URL and stream the video - REST](stream-files-tutorial-with-rest.md) tutorial.
- Review the [Encoding concept](encode-concept.md) topic.

## Create a subclipping job

1. In the Postman collection that you downloaded, select **Transforms and jobs** -> **Create Job with Sub Clipping**.
    
    The **PUT** request looks like this:
    
    ```
    https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName/jobs/:jobName?api-version={{api-version}}
    ```
1. Update the value of "transformName" environment variable with your transform name. 
1. Select the **Body** tab and update the "myOutputAsset" with your output Asset name.

    ```json
    {
      "properties": {
        "description": "A Job with transform cb9599fb-03b3-40eb-a2ff-7ea909f53735 and single clip.",
       
        "input": {
          "@odata.type": "#Microsoft.Media.JobInputHttp",
          "baseUri": "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/",
          "files": [
            "Ignite-short.mp4"
          ],
          "start": {
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
            "time": "PT10S"
          },
          "end": {
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
            "time": "PT40S"
          }
        },
      
        "outputs": [
          {
            "@odata.type": "#Microsoft.Media.JobOutputAsset",
            "assetName": "myOutputAsset"
          }
        ],
        "priority": "Normal"
      }
    }
    ```
1. Press **Send**.

    You see the **Response** with the info about the job that was created and submitted and the job's status. 

## [.NET](#tab/net/)

The following C# example creates a job that trims a video in an Asset as it submits an encoding job. 

## Prerequisites

To complete the steps described in this topic, you have to:

- [Create an Azure Media Services account](./account-create-how-to.md)
- Create a Transform and an input and output Assets. You can see how to create a Transform and input and output Assets in the [Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md) tutorial.
- Review the [Encoding concept](encode-concept.md) topic.

## Example

```csharp
/// <summary>
/// Submits a request to Media Services to apply the specified Transform to a given input video.
/// </summary>
/// <param name="client">The Media Services client.</param>
/// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
/// <param name="accountName"> The Media Services account name.</param>
/// <param name="transformName">The name of the transform.</param>
/// <param name="jobName">The (unique) name of the job.</param>
/// <param name="inputAssetName">The name of the input asset.</param>
/// <param name="outputAssetName">The (unique) name of the  output asset that will store the result of the encoding job. </param>
// <SubmitJob>
private static async Task<Job> JobWithBuiltInStandardEncoderWithSingleClipAsync(
    IAzureMediaServicesClient client,
    string resourceGroupName,
    string accountName,
    string transformName,
    string jobName,
    string inputAssetName,
    string outputAssetName)
{
    var jobOutputs = new List<JobOutputAsset>
    {
        new JobOutputAsset(state: JobState.Queued, progress: 0, assetName: outputAssetName)
    };

    var clipStart = new AbsoluteClipTime()
    {
        Time = new TimeSpan(0, 0, 20)
    };

    var clipEnd = new AbsoluteClipTime()
    {
        Time = new TimeSpan(0, 0, 30)
    };

    var jobInput = new JobInputAsset(assetName: inputAssetName, start: clipStart, end: clipEnd);

    Job job = await client.Jobs.CreateAsync(
        resourceGroupName,
        accountName,
        transformName,
        jobName,
        new Job(input: jobInput, outputs: jobOutputs.ToArray(), name: jobName)
        {
            Description = $"A Job with transform {transformName} and single clip.",
            Priority = Priority.Normal,
        });

    return job;
}

```
