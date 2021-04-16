---
title: Video playback Azure Video Analyzer - Azure
description: Placeholder
ms.topic: conceptual
ms.date: 04/12/2021

---
# Video playback 

## Suggested pre-reading 

* [Azure Video Analyzer overview]()
* [Azure Video Analyzer terminology]()
* [Pipeline concept]()

## Overview  

You can use [pipelines]() to record video into your Azure Video Analyzer account [AVA Video](). In this document, you can learn about the steps you need to take in order to play an asset using existing streaming capabilities of Azure Video Analyzer.

## RVX Widget One Player

You can install the RVX Widget to playback video stored in your Azure Video Analyzer. The widget can be installed using npm or yarn and this will allow you to include it in your own client-side application. Run one of the following commands to include the widget in your own application:

NPM:
```
npm install –-save @azure/video-analytics/widgets
```
YARN:
```
yarn add @azure/video-analytics/widgets 
```
Alternatively you can embed an existing pre-build script by adding type="module" to the script element referencing the pre-build location using the following example:

```
<script async type=”module” src=”https://unpkg.com/@azure/video-analytics/widgets”></script> 
``` 

## Media endpoint 

The media endpoints authorize a player by verifying the playback token presented by the player. You can use your own player to play videos directly from your Azure Video Analyzer account in DASH/HLS format. In order to get access to the video you will need to provide a JWT token to the API. Currently we support a JWT token to be passed to the API by the following ways:
1. JWT token as HTTP authorization header
1. JWT token as cookie
1. JWT token as querystring

The JWT will expire and you will need to renew the JWT at regular intervals for continued playback of the videos.

## Streaming Authorization 

<!-- Need information how to get a token -->

## Steps to playback video  

The following steps can be used to setup video playback using Azure Video Analyzer Video Application APIs: 

1. Create topology with video sink.
1. Create stream using topology created in previous step. Once stream is started, video is going to be created. 
1. Create access policy that has permission to playback video created in previous step. 
1. Generate token that matches access policy, call client API to retrieve all videos for a given account. 
1. For the selected video, call playback authorization endpoint to get cookie and expiration time.
1. Start streaming video from streaming endpoint using video metadata retrieved in step 4, pass playback auth token as part of the call via cookie. 
1. Call playback authorization endpoint as needed to renew token/cookie.

## Next steps

[Azure IoT Edge](../../iot-edge/index.yml)
<!--
## Next steps

[Playback recording](playback-recording-how-to.md)
-->
