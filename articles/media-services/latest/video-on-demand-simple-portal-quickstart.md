---
title: Quickstart Video on Demand with Media Services 
description: This article shows you how to do the basic steps for delivering video on demand (VOD) with Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.topic: quickstart
ms.workload: media
ms.date: 02/16/2022
ms.author: inhenkel
---

# Quickstart Basic Video On Demand (VOD) with Media Services

This article shows you how to do the basic steps for delivering a basic video on demand (VOD) application with Azure Media Services and a GitHub repository.  All the steps happen with your web browser from our documentation, the Azure portal, and GitHub.

## Prerequisites

- [Create a Media Services account](account-create-how-to.md). When you set up the Media Services account, a storage account, a user managed identity, and a default streaming endpoint will also be created.
- One MP4 video to use for this exercise.
- Create a GitHub account if you don't have one already, and stay logged in.
- Create an Azure [Static Web App](/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript).

> [!NOTE]
> You will be switching between several browser tabs or windows during this process. The below steps assume that you have your browser set to open tabs.  Keep them all open.

## Upload videos

You should have a media services account, a storage account, and a default streaming endpoint.  

1. In the portal, navigate to the Media Services account that you just created.
1. Select **Assets**. Assets are the containers that are used to house your media content.
1. Select **Upload**. The Upload new assets screen will appear.
1. Select the storage account you created for the Media Services account from the **Storage account** dropdown menu. It should be selected by default.
1. Select the **file folder icon** next to the Upload files field.
1. Select the media files you want to use. An asset will be created for every video you upload. The name of the asset will start with the name of the video and will be appended with a unique identifier. You *could* upload the same video twice and it will be located in two different assets.
1. You must agree to the statement "I have all the rights to use the content/file, and agree that it will be handled per the Online Services Terms and the Microsoft Privacy Statement." Select **I agree and upload.**
1. Select **Continue upload and close**, or **Close** if you want to watch the video upload progress.
1. Repeat this process for each of the files you want to stream.

## Create a transform

> [!IMPORTANT] 
> You must encode your files with a transform in order to stream them, even if they have been encoded locally.  The Media Services encoding process creates the manifest files needed for streaming.

You'll now create a transform that uses a Built-in preset, which is like a recipe for encoding.

1. Select **Transforms + jobs**.
1. Select **Add transform**. The Add transform screen will appear.
1. Enter a transform name in the **Transform name** field.
1. Select the **Encoding** radio button.
1. Select ContentAwareEncoding from the **Built-in preset name** dropdown list.
1. Select **Add**.

Stay on this screen for the next steps.

## Create a job

Next, you'll create a job which is for telling Media Services which transform to run on files within an asset.  The asset you choose will be the input asset.  The job will create an output asset to contain the encoded files as well as the manifest.

1. Select **Add job**. The Create a job screen will appear.
1. For the **Input source**, the **Asset** radio button should be selected by default.  If not, select it now.
1. Select **Select an existing asset** and choose one of the assets that was just created when you uploaded your videos. The Select an asset screen will appear.
1. Select one of the assets in the list. You can only select one at a time for the job.
1. Select the **Use existing** radio button.
1. Select the transform that you created earlier from the **Transform** dropdown list.
1. Under Configure output, default settings will be autopopulated, for this exercise leave them as they are.
1. Select **Create**.
1. Select **Transforms + Jobs**.
1. You'll see the name of the transform you chose for the job. Select the transform to see the status of the job.
1. Select the job listed under **Name** in the table of jobs. The job detail screen will open.
1. Select the output asset from the **Outputs** list. The asset screen will open.
1. Select the link for the asset next to Storage container.  A new browser tab will open and You'll see the results of the job that used the transform.  There should be several files in the output asset including:
    1. Encoded video files with.mpi and .mp4 extensions.
    1. A *XXXX_metadata.json* file.
    1. A *XXXX_manifest.json* file.
    1. A *XXXX_.ism* file.
    1. A *XXXX.isc* file.
    1. A *ThumbnailXXXX.jpg* file.
1. Once you've viewed what is in the output asset, close the tab. Go back to the asset browser tab.

## Create a streaming locator

In order to stream your videos you need a streaming locator.

1. Select **New streaming locator**. The Add streaming locator screen will appear and a default name for the locator will appear. You can change it or leave it as is.
1. Select *Predefined_ClearStreamingOnly* from the Streaming policy dropdown list. This is a streaming policy that says that the video will be streamed using DASH, HLS and Smooth with no content protection restrictions except that the video can’t be downloaded by the viewer. No content key policy is required.
1. Leave the rest of the settings as they are.
1. Select **Add**. The video will start playing in the player on the screen, and the **Streaming URL** field will be populated.
1. Select **Show URLs** in the Streaming locator list. The Streaming URLs screen will appear.

On this screen, you'll see that the streaming endpoint that was created when you created your account is in the Streaming endpoint dropdown list along with other data about the streaming locator.

In the streaming and download section, you'll see the URLs to use for your streaming application. For the following steps, you'll use the URL that ends with `(format=m3u8-cmaf)`. Keep this browser tab open as you'll be coming back to it in a later step.

## Create a web page with a video player client

Assuming that you created a Static Web App, you'll now change the HTML in the index.html file. If you didn't create a web app with Azure, you can still use this code where you plan to host your web app.

1. If you aren't already logged in, sign in to GitHub and navigate to the repository you created for the Static Web App.
1. Navigate to the *index.html* file.  It should be in a directory called `src`.
1. Select the edit pencil icon to edit the file.
1. Replace the code that is in the html file with the following code:

    ```html
    <html lang="en-US">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Basic Video on Demand Static Web App</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!--*****START OF Azure Media Player Scripts*****-->
            <!--Note: DO NOT USE the "latest" folder in production. Replace "latest" with a version number like "1.0.0"-->
            <!--EX:<script src="//amp.azure.net/libs/amp/1.0.0/azuremediaplayer.min.js"></script>-->
            <!--Azure Media Player versions can be queried from //aka.ms/ampchangelog-->
        <link href="//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
        <script src="//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>
        <!--*****END OF Azure Media Player Scripts*****-->
    </head>
    <body>
        <h1>Clear Streaming Only</h1>
        <video id="azuremediaplayer" class="azuremediaplayer amp-default-skin amp-big-play-centered" controls autoplay width="640" height="400" poster="" data-setup='{}' tabindex="0">
            <source src="put streaming url here" type="application/vnd.ms-sstr+xml" />
            <p class="amp-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video</p>
        </video>
    </body>
    </html>
    ```

1. Return to the Azure portal, Streaming locator browser tab where the streaming URLs are located.
1. Copy the URL that ends with `(format=m3u8-cmaf)` under HLS.
1. Return to the index file on GitHub browser tab.
1. Paste the URL into the `src` value in the source object in the HTML.
1. Select **Commit changes** to commit the change. It may take a minute for the changes to be live.
1. Back in the Azure portal, Static web app tab, select the link next to **URL** to open the index page in another tab of your browser. The player should appear on the page.
1. Select the **video play** button. The video should begin playing. If it isn't playing, check that your streaming endpoint is running.

## Clean up resources

If you don't intend to further develop this basic web app, make sure you delete all the resources you created or you'll be billed.