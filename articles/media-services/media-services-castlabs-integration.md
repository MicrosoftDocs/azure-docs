<properties 
	pageTitle="Using castLabs to deliver Widevine licenses to Azure Media Services" 
	description="This article describes how you can use Azure Media Services (AMS) to deliver a stream that is dynamically encrypted by AMS with both PlayReady and Widevine DRMs. The PlayReady license comes from Media Services PlayReady license server and Widevine license is delivered by castLabs license server." 
	services="media-services" 
	documentationCenter="" 
	authors="Mingfeiy" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"  
	ms.author="Mingfeiy;willzhan;Juliako"/>


#Using castLabs to deliver Widevine licenses to Azure Media Services

> [AZURE.SELECTOR]
- [Axinom](media-services-axinom-integration.md)
- [castLabs](media-services-castlabs-integration.md)

##Overview

This article describes how you can use Azure Media Services (AMS) to deliver a stream that is dynamically encrypted by AMS with both PlayReady and Widevine DRMs. The PlayReady license comes from Media Services PlayReady license server and Widevine license is delivered by **castLabs** license server.

To playback streaming content protected by CENC (PlayReady and/or Widevine), you can use  [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html). See [AMP document](http://amp.azure.net/libs/amp/latest/docs/) for details.

The following diagram demonstrates a high-level Azure Media Services and castLabs integration architecture.

![integration](./media/media-services-castlabs-integration/media-services-castlabs-integration.png)

##Typical system set up

- Media content is stored in AMS.
- Key IDs of content keys are stored in both castLabs and AMS.
- castLabs and AMS both have token authentication built in. The following sections discuss authentication tokens. 
- When a client requests to stream the video, the content is dynamically encrypted with **Common Encryption** (CENC) and dynamically packaged by AMS to Smooth Streaming and DASH. We also deliver PlayReady M2TS elementary stream encryption for HLS streaming protocol.
- PlayReady license is retrieved from AMS license server and Widevine license is retrieved from castLabs license server. 
- Media Player automatically decides which license to fetch based on the client platform capability. 

##Authentication token generation for getting a license

Both castLabs and AMS support JWT (JSON Web Token) token format used to authorize a license. 

###JWT token in AMS 

The following table describes JWT token in AMS. 

Issuer|Issuer string from the chosen Secure Token Service (STS)
---|---
Audience|Audience string from the used STS
Claims|A set of claims
NotBefore|Start validity of the token
Expires|End validity of the token
SigningCredentials|The key that is shared among PlayReady License Server, castLabs License Server and STS, it could be either symmetric or asymmetric key.

###JWT token in castLabs

The following table describes JWT token in castLabs. 

Name|Description
---|---
optData|A JSON string containing information about you. 
crt|A JSON string containing information about the asset, its license info and playback rights.
iat|The current datetime in epoch.
jti|A unique identifier about this token (every token can only be used once in the castLabs system).

##Sample solution set up 

The [sample solution](https://github.com/AzureMediaServicesSamples/CastlabsIntegration) consists of two projects:

-	A console app that can be used to set DRM restrictions on an already ingested asset, for both PlayReady and Widevine.
-	A Web Application that hands out tokens, which could be seen as a VERY SIMPLIFIED version of an STS.


To use the console application:

1.	Change the app.config to setup AMS credentials, castLabs credentials, STS configuration and shared key.
2.	Upload an Asset into AMS.
3.	Get the UUID from the uploaded Asset, and change Line 32 in the Program.cs file:

		 var objIAsset = _context.Assets.Where(x => x.Id == "nb:cid:UUID:dac53a5d-1500-80bd-b864-f1e4b62594cf").FirstOrDefault();

4.	Use an AssetId for naming the asset in the castLabs system (Line 44 in the Program.cs file).

	You must set AssetId for **castLabs**; it needs to be a unique alphanumeric string.

5.	Run the program.


To use the Web Application (STS):

1.	Change the web.config to setup castlabs merchant ID, the STS configuration and the shared key.
2.	Deploy to Azure Websites.
3.	Navigate to the website.

##Playing back a video

To playback a video encrypted with common encryption (PlayReady and/or Widevine), you can use the [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html). When running the console app, the Content Key ID and the Manifest URL are echoed.

1.	Open a new tab and launch your STS: http://[yourStsName].azurewebsites.net/api/token/assetid/[yourCastLabsAssetId]/contentkeyid/[thecontentkeyid].
2.	Go to [Azure Media Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).
3.	Paste in the streaming URL.
4.	Click the **Advanced Options** checkbox.
5.	In the **Protection** dropdown, select PlayReady and/or Widevine.
6.	Paste the token that you got from your STS in the Token textbox. 
	
	The castLab license server does not need the “Bearer=” prefix in front of the token. So please remove that before submitting the token.
7.	Update the player.
8.	The video should be playing.


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
