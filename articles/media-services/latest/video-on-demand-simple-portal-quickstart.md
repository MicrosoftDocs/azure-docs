---
title: Quickstart Video on Demand with Media Services 
description: This article shows you how to do the basic steps for delivering video on demand (VOD) with Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: quickstart
ms.workload: media
ms.date: 03/01/2022
ms.author: inhenkel
---

# Quickstart Basic Video On Demand (VOD) with Media Services

This article shows you how to do the basic steps for delivering a basic video on demand (VOD) application with Azure Media Services and a GitHub repository.  All the steps happen with your web browser from our documentation, the Azure portal, and GitHub.

## Prerequisites

- [Create a Media Services account](account-create-how-to.md). When you set up the Media Services account, a storage account, a user managed identity, and a default streaming endpoint will also be created.
- One MP4 video to use for this exercise.
- Create a GitHub account if you don't have one already, and stay logged in.
- Create an Azure [Static Web App](../../static-web-apps/get-started-portal.md?tabs=vanilla-javascript).

> [!NOTE]
> You will be switching between several browser tabs or windows during this process. The below steps assume that you have your browser set to open tabs.  Keep them all open.

[!INCLUDE [task-create-asset-portal](includes/task-create-asset-portal.md)]

<!-- ## Create a transform -->

[!INCLUDE [task-create-asset-portal](includes/task-create-transform-portal.md)]

Stay on this screen for the next steps.

<!-- ## Create a job -->

Next, you'll create a job which is for telling Media Services which transform to run on files within an asset.  The asset you choose will be the input asset.  The job will create an output asset to contain the encoded files as well as the manifest.

[!INCLUDE [task-create-asset-portal](includes/task-create-job-portal.md)]

Once you've viewed what is in the output asset, close the tab. Go back to the asset browser tab.

In order to stream your videos you need a streaming locator.

<!-- ## Create a streaming locator -->

[!INCLUDE [task-create-asset-portal](includes/task-create-streaming-locator-portal.md)]

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