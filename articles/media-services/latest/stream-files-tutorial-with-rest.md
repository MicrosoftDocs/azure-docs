---
title: Encode a remote file and stream using Azure Media Services v3
description: Follow the steps of this tutorial to encode a file based on a URL and stream your content with Azure Media Services using REST.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.custom: mvc
ms.date: 11/05/2019
ms.author: juliako
---

# Tutorial: Encode a remote file based on URL and stream the video - REST

Azure Media Services enables you to encode your media files into formats that can be played on a wide variety of browsers and devices. For example, you might want to stream your content in Apple's HLS or MPEG DASH formats. Before streaming, you should encode your high-quality digital media file. For encoding guidance, see [Encoding concept](encoding-concept.md).

This tutorial shows you how to encode a file based on a URL and stream the video with Azure Media Services using REST. 

![Play the video](./media/stream-files-tutorial-with-api/final-video.png)

This tutorial shows you how to:    

> [!div class="checklist"]
> * Create a Media Services account
> * Access the Media Services API
> * Download Postman files
> * Configure Postman
> * Send requests using Postman
> * Test the streaming URL
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- [Create a Media Services account](create-account-cli-how-to.md).

    Make sure to remember the values that you used for the resource group name and Media Services account name

- Install the [Postman](https://www.getpostman.com/) REST client to execute the REST APIs shown in some of the AMS REST tutorials. 

    We are using **Postman** but any REST tool would be suitable. Other alternatives are: **Visual Studio Code** with the REST plugin or **Telerik Fiddler**. 

## Download Postman files

Clone a GitHub repository that contains the  Postman collection and environment files.

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-rest-postman.git
 ```

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Configure Postman

### Configure the environment 

1. Open the **Postman** app.
2. On the right of the screen, select the **Manage environment** option.

    ![Manage env](./media/develop-with-postman/postman-import-env.png)
4. From the **Manage environment** dialog, click **Import**.
2. Browse to the `Azure Media Service v3 Environment.postman_environment.json` file that was downloaded when you cloned `https://github.com/Azure-Samples/media-services-v3-rest-postman.git`.
6. The **Azure Media Service v3 Environment** environment is added.

    > [!Note]
    > Update access variables with values you got from the **Access the Media Services API** section above.

7. Double-click on the selected file and enter values that you got by following the [accessing API](#access-the-media-services-api) steps.
8. Close the dialog.
9. Select the **Azure Media Service v3 Environment** environment from the dropdown.

    ![Choose env](./media/develop-with-postman/choose-env.png)
   
### Configure the collection

1. Click **Import** to import the collection file.
1. Browse to the `Media Services v3.postman_collection.json` file that was downloaded when you cloned `https://github.com/Azure-Samples/media-services-v3-rest-postman.git`
3. Choose the **Media Services v3.postman_collection.json** file.

    ![Import a file](./media/develop-with-postman/postman-import-collection.png)

## Send requests using Postman

In this section, we send requests that are relevant to encoding and creating URLs so you can stream your file. Specifically, the following requests are sent:

1. Get Azure AD Token for Service Principal Authentication
1. Start a Streaming Endpoint
2. Create an output asset
3. Create a Transform
4. Create a Job
5. Create a Streaming Locator
6. List paths of the Streaming Locator

> [!Note]
>  This tutorial assumes you are creating all resources with unique names.  

### Get Azure AD Token 

1. In the left window of the Postman app, select "Step 1: Get AAD Auth token".
2. Then, select "Get Azure AD Token for Service Principal Authentication".
3. Press **Send**.

    The following **POST** operation is sent.

    ```
    https://login.microsoftonline.com/:tenantId/oauth2/token
    ```

4. The response comes back with the token and sets the "AccessToken" environment variable to the token value. To see the code that sets "AccessToken" , click on the **Tests** tab. 

    ![Get AAD token](./media/develop-with-postman/postman-get-aad-auth-token.png)


### Start a Streaming Endpoint

To enable streaming, you first have to start the [Streaming Endpoint](https://docs.microsoft.com/azure/media-services/latest/streaming-endpoint-concept) from which you want to stream the video.

> [!NOTE]
> You are only billed when your Streaming Endpoint is in the running state.

1. In the left window of the Postman app, select "Streaming and Live".
2. Then, select "Start StreamingEndpoint".
3. Press **Send**.

    * The following **POST** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaservices/:accountName/streamingEndpoints/:streamingEndpointName/start?api-version={{api-version}}
        ```
    * If the request is successful, the `Status: 202 Accepted` is returned.

        This status means that the request has been accepted for processing; however, the processing has not been completed. You can query for the operation status based on the value in the `Azure-AsyncOperation` response header.

        For example, the following GET operation returns the status of your operation:
        
        `https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/<resourceGroupName>/providers/Microsoft.Media/mediaservices/<accountName>/streamingendpointoperations/1be71957-4edc-4f3c-a29d-5c2777136a2e?api-version=2018-07-01`

        The [track asynchronous Azure operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) article explains in depth how to track the status of asynchronous Azure operations through values returned in the response.

### Create an output asset

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your encoding job. 

1. In the left window of the Postman app, select "Assets".
2. Then, select "Create or update an Asset".
3. Press **Send**.

    * The following **PUT** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/assets/:assetName?api-version={{api-version}}
        ```
    * The operation has the following  body:

        ```json
        {
        "properties": {
            "description": "My Asset",
            "alternateId" : "some GUID"
         }
        }
        ```

### Create a transform

When encoding or processing content in Media Services, it is a common pattern to set up the encoding settings as a recipe. You would then submit a **Job** to apply that recipe to a video. By submitting new jobs for each new video, you are applying that recipe to all the videos in your library. A recipe in Media Services is called as a **Transform**. For more information, see [Transforms and Jobs](transform-concept.md). The sample described in this tutorial defines a recipe that encodes the video in order to stream it to a variety of iOS and Android devices. 

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object. Each **TransformOutput** contains a **Preset**. **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The sample described in this article uses a built-in Preset called **AdaptiveStreaming**. The Preset encodes the input video into an auto-generated bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. For information about this Preset, see [auto-generating bitrate ladder](autogen-bitrate-ladder.md).

You can use a built-in EncoderNamedPreset or use custom presets. 

> [!Note]
> When creating a [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method. This tutorial assumes you are creating the transform with a unique name.

1. In the left window of the Postman app, select "Encoding and Analysis".
2. Then, select "Create Transform".
3. Press **Send**.

    * The following **PUT** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName?api-version={{api-version}}
        ```
    * The operation has the following body:

        ```json
        {
            "properties": {
                "description": "Standard Transform using an Adaptive Streaming encoding preset from the library of built-in Standard Encoder presets",
                "outputs": [
                    {
                    "onError": "StopProcessingJob",
                "relativePriority": "Normal",
                    "preset": {
                        "@odata.type": "#Microsoft.Media.BuiltInStandardEncoderPreset",
                        "presetName": "AdaptiveStreaming"
                    }
                    }
                ]
            }
        }
        ```

### Create a job

A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the created **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output.

In this example, the job's input is based on an HTTPS URL ("https:\//nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/").

1. In the left window of the Postman app, select "Encoding and Analysis".
2. Then, select "Create or Update Job".
3. Press **Send**.

    * The following **PUT** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName/jobs/:jobName?api-version={{api-version}}
        ```
    * The operation has the following body:

        ```json
        {
        "properties": {
            "input": {
            "@odata.type": "#Microsoft.Media.JobInputHttp",
            "baseUri": "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/",
            "files": [
                    "Ignite-short.mp4"
                ]
            },
            "outputs": [
            {
                "@odata.type": "#Microsoft.Media.JobOutputAsset",
                "assetName": "testAsset1"
            }
            ]
        }
        }
        ```

The job takes some time to complete and when it does you want to be notified. To see the progress of the job, we recommend using Event Grid. It is designed for high availability, consistent performance, and dynamic scale. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. Simple, HTTP-based reactive event handling helps you build efficient solutions through intelligent filtering and routing of events.  See [Route events to a custom web endpoint](job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

#### Job error codes

See [Error codes](https://docs.microsoft.com/rest/api/media/jobs/get#joberrorcode).

### Create a streaming locator

After the encoding job is complete, the next step is to make the video in the output **Asset** available to clients for playback. You can accomplish this in two steps: first, create a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), and second, build the streaming URLs that clients can use. 

The process of creating a streaming locator is called publishing. By default, the streaming locator is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), you need to specify the desired **StreamingPolicyName**. In this example, you will be streaming in-the-clear (or non-encrypted) content, so the predefined clear streaming policy "Predefined_ClearStreamingOnly" is used.

> [!IMPORTANT]
> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. 

Your Media Service account has a quota for the number of **Streaming Policy** entries. You should not be creating a new **Streaming Policy** for each streaming locator.

1. In the left window of the Postman app, select "Streaming Policies and Locators".
2. Then, select "Create a Streaming Locator (clear)".
3. Press **Send**.

    * The following **PUT** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/streamingLocators/:streamingLocatorName?api-version={{api-version}}
        ```
    * The operation has the following body:

        ```json
        {
          "properties": {
            "streamingPolicyName": "Predefined_ClearStreamingOnly",
            "assetName": "testAsset1",
            "contentKeys": [],
            "filters": []
         }
        }
        ```

### List paths and build streaming URLs

#### List paths

Now that the [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) has been created, you can get the streaming URLs

1. In the left window of the Postman app, select "Streaming Policies".
2. Then, select "List Paths".
3. Press **Send**.

    * The following **POST** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/streamingLocators/:streamingLocatorName/listPaths?api-version={{api-version}}
        ```
        
    * The operation has no body:
        
4. Note one of the paths you want to use for streaming, you will use it in the next section. In this case, the following paths were returned:
    
    ```
    "streamingPaths": [
        {
            "streamingProtocol": "Hls",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest(format=m3u8-aapl)"
            ]
        },
        {
            "streamingProtocol": "Dash",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest(format=mpd-time-csf)"
            ]
        },
        {
            "streamingProtocol": "SmoothStreaming",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest"
            ]
        }
    ]
    ```

#### Build the streaming URLs

In this section, let's build an HLS streaming URL. URLs consist of the following values:

1. The protocol over which data is sent. In this case "https".

    > [!NOTE]
    > If a player is hosted on an https site, make sure to update the URL to "https".

2. StreamingEndpoint's hostname. In this case, the name is "amsaccount-usw22.streaming.media.azure.net".

    To get the hostname, you can use the following GET operation:
    
    ```
    https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000000/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/streamingEndpoints/default?api-version={{api-version}}
    ```
    
3. A path that you got in the previous (List paths) section.  

As a result, the following HLS URL was built

```
https://amsaccount-usw22.streaming.media.azure.net/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest(format=m3u8-aapl)
```

## Test the streaming URL


> [!NOTE]
> Make sure the **Streaming Endpoint** from which you want to stream is running.

To test the stream, this article uses Azure Media Player. 

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste the URL you built. 
3. Press **Update Player**.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Clean up resources in your Media Services account

Generally, you should clean up everything except objects that you are planning to reuse (typically, you will reuse **Transforms**, and you will persist **Streaming Locators**, etc.). If you want for your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.  

To delete a resource, select "Delete ..." operation under whichever resource you want to delete.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier.  

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

Now that you know how to upload, encode, and stream your video, see the following article: 

> [!div class="nextstepaction"]
> [Analyze videos](analyze-videos-tutorial-with-api.md)
