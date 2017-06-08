---
title: How to sign up for Azure Video Indexer and upload your first video | Microsoft Docs
description: This topic demonstrates how to sign up and upload your first video using the Video Indexer portal.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: video-indexer
ms.topic: article
ms.date: 05/02/2017
ms.author: juliako;

---
# How to sign up and upload your first video

This short getting started tutorial shows how to sign in to Visual Indexer and how to upload your first video.

To read a detailed overview of the Video Indexer service, see the [overview](video-indexer-overview.md) article.

## Sign up and sign in

To start developing with Video Indexer, you must first Sign up and sign in to the [Video Indexer](http://vi.microsoft.com) portal. 

You can sign up for the service using existing AAD, LinkedIn, Facebook, Google, or MSA account. 

If signing in with an AAD account (for example, alice@contoso.onmicrosoft.com) you must go through two preliminary steps: 

1. 	Contact Microsoft to register your AAD organization’s domain (contoso.onmicrosoft.com).
2. 	Your AAD organization’s admin must first sign in to grant the portal permissions to your org. 

##Upload a video

To upload video press the Upload button.

![Upload](./media/video-indexer-get-started/video-indexer-upload.png)

Once your video has been uploaded, Video Indexer starts indexing and analyzing the video.

![Uploaded](./media/video-indexer-get-started/video-indexer-uploaded.png) 

Once Video Indexer is done analyzing, you will get a notification with a link to your video and a short description of what was found in your video. For example: people, topics, OCRs.

##Next steps

You can now use the [Video Indexer portal](video-indexer-view-edit.md) or the [API](video-indexer-use-apis.md) to see the insights of the video. 

## See also

[Video Indexer overview](video-indexer-overview.md)
