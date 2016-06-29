<properties 
    pageTitle="Azure RemoteApp - how do network bandwidth and quality of experience work together? | Microsoft Azure"
	description="Learn how network bandwidth in Azure RemoteApp can impact your user's quality of experience."
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
    ms.date="06/27/2016" 
    ms.author="elizapo" />

# Azure RemoteApp - how do network bandwidth and quality of experience work together?

When you are looking at the [overall network bandwidth](remoteapp-bandwidth.md) required for Azure RemoteApp, keep in mind the following factors - these are all part of a dynamic system that impacts the overall user experience. 

- **Available network bandwidth and current network conditions** - A set of parameters (loss, latency, jitter) on the same network at a given time can impact the application streaming experience, meaning a lowered overall user experience. The bandwidth available in your network is a function of congestion, random loss, latency because all these parameters affect the congestion control mechanism, which in turn controls the transmission speed to avoid collisions.  For example, a lossy network or network with high latency will make the user experience bad even on a network with 1000 MB bandwidth. The loss and latency vary based on the number of users that are on the same network and what those users are doing (for example, watching videos, downloading or uploading large files, printing).
- **Usage scenario** - The experience depends on what the users are doing as individuals and as a group on the same network. For example, reading one slide requires only a single frame to be updated; if the user skims and scrolls over the content of a text document, they need a higher number of frames to be updated per second. The communication back and forth to the server in this scenario will eventually consume more network bandwidth. Also consider an extreme example: multiple users are watching high-definition videos (like 4K resolution), holding HD conference calls, playing 3D video games, or working on CAD systems. All of these can make even a really high bandwidth network practically unusable.
- **Screen resolution and the number of screens** - More network bandwidth is required to full update bigger screens than smaller screens. The underlying technology does a pretty good job of encoding and transmitting only the regions of the screens that have been updated, but once in a while, the whole screen needs to be updated. When the user has a higher resolution screen (for example 4K resolution), that update requires more network bandwidth than a screen with lower resolution (like 1024x768px). This same logic applies if you use more than one screen for redirection. Bandwidth needs to increase with the number of screens.
- **Clipboard and device redirection** - This is a not very obvious issue, but in many cases if a user stores a large chunk of data to the clipboard, it takes a bit of time for that information to transfer from the Remote Desktop client to the server. The downstream experience can be impacted by the experience of sending the clipboard content upstream. The same applies for device redirection - if a scanner or web cam produces a lot of data that needs to be sent upstream to the server, or a printer needs to receive a large document, or local storage needs to be available to an app running in the cloud to copy a large file, users might notice dropped frames or temporarily "frozen" video because the data needed for the device redirection is increasing the network bandwidth needs. 

When you evaluate your network bandwidth needs, make sure to consider all of these factors working as a system.

Now, go back to the [main network bandwidth article](remoteapp-bandwidth.md), or move on to testing your [network bandwidth](remoteapp-bandwidthtests.md).

## Learn more
- [Estimate Azure RemoteApp network bandwidth usage](remoteapp-bandwidth.md)

- [Azure RemoteApp - testing your network bandwidth usage with some common scenarios](remoteapp-bandwidthtests.md)

- [Azure RemoteApp network bandwidth - general guidelines (if you can't test your own)](remoteapp-bandwidthguidelines.md)