---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what are assets and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Assets

An **Asset** contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.

This article gives an explanation of what are assets and how they are used by Azure Media Services.

## Overview

An asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the asset are stored as block blobs in that container. Page blobs are not supported by Azure Media Services.

When deciding what media content to upload and store in an asset, the following considerations apply:

* An asset should contain only a single, unique instance of media content. For example, a single edit of a TV episode, movie, or advertisement.
* An asset should not contain multiple renditions or edits of an audiovisual file. 
    
    One example of an improper usage of an Asset would be attempting to store more than one TV episode, advertisement, or multiple camera angles from a single production inside an asset. Storing multiple renditions or edits of an audiovisual file in an asset can result in difficulties submitting encoding jobs, streaming and securing the delivery of the asset later in the workflow. 

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
