<properties 
	pageTitle="Develop video player applications" 
	description="The topic also provides links to Player Frameworks and plugins that you can use to develop your own client applications that can consume streaming media from Media Services." 
	authors="juliako" 
	manager="dwrede" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="juliako"/>


#Develop video player applications

##Overview

Azure Media Services provides the tools you need to create rich, dynamic client player applications for most platforms including: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes. This topic also provides links to SDKs and Player Frameworks that you can use to develop your own client applications that can consume streaming media from Media Services.

##Playback your content with existing players

For more information, see [playing your content with existing players](media-services-playback-content-with-existing-players.md).


##Tools for creating player applications

- [Smooth Streaming Client SDK](http://www.iis.net/downloads/microsoft/smooth-streaming) 
- [Microsoft Media Platform: Player Framework](http://playerframework.codeplex.com/) 
- [HTML5 Player Framework Documentation](http://playerframework.codeplex.com/wikipage?title=HTML5%20Player&referringTitle=Documentation) 
- [Microsoft Smooth Streaming Plugin for OSMF](https://www.microsoft.com/download/details.aspx?id=36057) 
- [Media Player Framework for iOS](https://github.com/Azure/azure-media-player-framework) 
- [Licensing Microsoft® Smooth Streaming Client Porting Kit](https://www.microsoft.com/mediaplatform/sspk.aspx) 
- Building Video Applications on Windows 8 
- [XBOX Video Application Development](http://xbox.create.msdn.com/) 

For more information, see [Developing Video Player Applications](https://msdn.microsoft.com/library/dn223283.aspx).

##Advertising

Azure Media Services provides support for ad insertion through the Windows Media Platform: Player Frameworks. Player frameworks with ad support are available for Windows 8, Silverlight, Windows Phone 8, and iOS devices. Each player framework contains sample code that shows you how to implement a player application. There are three different kinds of ads you can insert into your media:

Linear – full frame ads that pause the main video

Nonlinear – overlay ads that are displayed as the main video is playing, usually a logo or other static image placed within the player

Companion – ads that are displayed outside of the player

Ads can be placed at any point in the main video’s time line. You must tell the player when to play the ad and which ads to play. This is done using a set of standard XML-based files: Video Ad Service Template (VAST), Digital Video Multiple Ad Playlist (VMAP), Media Abstract Sequencing Template (MAST), and Digital Video Player Ad Interface Definition (VPAID). VAST files specify what ads to display. VMAP files specify when to play various ads and contain VAST XML. MAST files are another way to sequence ads which also can contain VAST XML. VPAID files define an interface between the video player and the ad or ad server. For more information, see [Inserting Ads](https://msdn.microsoft.com/library/dn387398.aspx).

For information about closed captioning and ads support in Live streaming videos, see [Supported Closed Captioning and Ad Insertion Standards](https://msdn.microsoft.com/library/c49e0b4d-357e-4cca-95e5-2288924d1ff3#caption_ad).