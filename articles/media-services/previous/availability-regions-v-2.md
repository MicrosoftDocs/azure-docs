---
title: Azure Media Services regional availability | Microsoft Docs
description: This article is an overview of Microsoft Azure Media Services features and service regional availability.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/10/2021
ms.author: inhenkel
ms.custom: references_regions
---

# Media Services regional availability

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]

> [!NOTE]
> No new features or functionality are being added to Media Services v2. Check out the latest version, [Media Services v3](../latest/media-services-overview.md). Also, see [migration guidance from v2 to v3](../latest/migrate-v-2-v-3-migration-introduction.md)

Microsoft Azure Media Services (AMS) enables you to securely upload, store, encode, and package video or audio content for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices).

AMS operates in multiple regions around the world, giving you flexibility in choosing where to build your applications. This article is an overview of Microsoft Azure Media Services features and service regional availability.

For more information about the entire Azure global infrastructure, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

## AMS accounts

Use [Azure Products by Region](https://azure.microsoft.com/global-infrastructure/services/?products=media-services&regions=all) to determine whether Media Services is available in a specific region.

## Streaming endpoints

Media Services customers can choose either a **Standard** streaming endpoint or a **Premium** streaming endpoint.

|Name|Status|Region
|---|---|---|
|Standard|GA|All|
|Premium|GA|All|

## Live encoding

Available in all regions except: Germany, Brazil South, India West, India South, and India Central.

## Encoding media processors

AMS offers two on-demand encoders **Media Encoder Standard** and **Media Encoder Premium Workflow**. For more information, see [Overview and comparison of Azure on-demand media encoders](media-services-encode-asset.md).

|Media processor name|Status|Regions
|---|---|---|
|Media Encoder Standard|GA|All|
|Media Encoder Premium Workflow|GA|All except China|

## Analytics media processors

Media Analytics is a collection of speech and vision components that makes it easier for organizations and enterprises to derive actionable insights from their video files. For more information, see [Azure Media Services Analytics Overview](./legacy-components.md).

> [!NOTE]
> Some analytics media processors will be retired. For the retirement dates, see the [legacy components](legacy-components.md) topic.

|Media processor name|Status|Region
|---|---|---|
|Azure Media Face Detector|Preview|All|
|Azure Media Indexer|GA|All|
|Azure Media Motion Detector|Preview|All|
|Azure Media OCR|Preview|All|
|Azure Media Redactor|GA|All|
|Azure Media Video Thumbnails|Preview|All|

## Protection

Microsoft Azure Media Services enables you to secure your media from the time it leaves your computer through storage, processing, and delivery. For more information, see [Protecting AMS content](media-services-content-protection-overview.md).

|Encryption|Status|Regions|
|---|---|---| 
|Storage|GA|All|
|AES-128 keys|GA|All|
|Fairplay|GA|All|
|PlayReady|GA|All|
|Widevine|GA|All except Germany, Federal Government, and China.

> [!NOTE]
> Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Reserved units (RUs)

The number of provisioned reserved units determines the number of media tasks that can be processed concurrently in a given account.

Available in all regions.

## Reserved unit (RU) type

A Media Services account is associated with a reserved unit type that determines the speed with which your media processing tasks are completed. You can choose between the following reserved unit types: S1, S2, or S3.

|RU type name|Status|Regions
|---|---|---|
|S1|GA|All|
|S2|GA|All except Brazil South, and India West|
|S3|GA|All except India West|

## Next steps

[Migrate to Media Services v3](../latest/media-services-overview.md)

## Provide feedback

[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]