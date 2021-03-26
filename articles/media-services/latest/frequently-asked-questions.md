---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions
description: This article gives answers to frequently asked questions about Azure Media Services v3.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/25/2021
ms.author: inhenkel
---

# Media Services v3 frequently asked questions

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article gives answers to frequently asked questions about Azure Media Services v3.

## What is an asset?

A Media Services asset is a container within an Azure Storage account that is used for each video file you upload.  It has a unique identifier that is used with Transforms and other operations.  See [Assets in Media Service v3](assets-concept.md).

## How do I create an asset?

Every time you want to upload a media file and perform and do something with it like encoding or streaming, you create an asset to store the media file and other files associated with that media file. Assets are automatically created for you if you use the Azure portal. If you are not using the portal to upload files, you must create an asset first.  See [Create an Asset](how-to-create-asset.md) to learn how to create one.

## What is a transform?

A transform contains the instructions for encoding or analyzing media files. Think of it as a recipe. It can apply more than one encoding instruction for a media file.  It is used by a job to transform files. For more information on transforms see Transforms in [Transforms and Jobs in Media Services](transforms-jobs-concept.md#transforms).

## How do I create a transform?

You can create a transform using REST, the CLI or the SDKs available for Media Services.  See [How to create a transform](how-to-create-transform.md) to use REST or the CLI.  To use the SDK, see [Media Services samples](https://github.com/Azure-Samples?q=media-services&type=&language=&sort=) available in the Azure Samples repo.

## What is a job?

A job is the request you make to start using a transform to encode or analyze files.  You tell it which input assets and files are to be transformed.  You also tell it to either create an output asset, or use an already exisiting output asset.  Once the job is completed, the transformed files will be in the output asset as well as other files associated with those files. For more information about Jobs, see [Transforms and Jobs in Media Services](transforms-jobs-concept.md#jobs).

## How do I create a job?

You can create a job in the Azure portal, with [CLI](cli-create-jobs.md), REST or any of the SDKs. See the [Media Services samples](https://github.com/Azure-Samples?q=media-services&type=&language=&sort=) for the language you prefer.
