<properties 
    pageTitle="Azure RemoteApp network bandwidth - general guidelines | Microsoft Azure"
	description="Understand some basic network bandwidth guidelines for your Azure RemoteApp collections and apps."
	services="remoteapp"
	documentationCenter="" 
	authors="lizap" 
	manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/15/2016" 
    ms.author="elizapo" />
    
# Azure RemoteApp network bandwidth - general guidelines (if you can't test your own)

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

If you do not have the time or capability to run the [network bandwidth tests](remoteapp-bandwidthtests.md) for Azure RemoteApp, here are some fairly generic guidelines that can help you estimate network bandwidth per user.

If you have a mix of these scenarios, we don't recommend anything less than (or equal to) 10 MB/s as the MINIMUM network bandwidth for modern Internet-connected apps in a remote environment. (Although, as discussed, this will not guarantee a better than average user experience.)

## Complex PowerPoint, simple PowerPoint

Azure RemoteApp does best on 100 MB LAN. At the 10 MB/s network profile, when jitter above 120 ms is more than 5%, the user will see an average experience. At 1 MB/s the different is glaring - for example, in a slide show, the user might not see animated transitions at all because frames are skipped.

## Internet Explorer, mixed PDF, PDF, Text

10 MB/s network profile is close to LAN in most aspects. 1 MB/s will provide an OK experience, although there may be some jitter when a user scrolls while there are images on the screen.

## Flash video (YouTube)

100 MB/s LAN provides the best experience, while 10 MB/s is acceptable (meaning we keep up with the frame rate but jitter increases). At 1 MB/s, jitter is very high and noticeable.

## Word typing (Word remote input)
This is a low-bandwidth usage scenario. At 256 KB/s we provide as good of an experience as LAN.

## Learn more
- [Estimate Azure RemoteApp network bandwidth usage](remoteapp-bandwidth.md)

- [Azure RemoteApp - how do network bandwidth and quality of experience work together?](remoteapp-bandwidthexperience.md)

- [Azure RemoteApp - tseting your network bandwidth usage with some common scenarios](remoteapp-bandwidthtests.md)