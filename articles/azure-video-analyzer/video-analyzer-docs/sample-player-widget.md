---
title: The Azure Video Analyzer player widget sample
description: This reference article gives a brief overview of the Video Analyzer player widget sample application
ms.service: azure-video-analyzer
ms.topic: reference
ms.date: 08/13/2021

---

# Azure Video Analyzer player widget sample

This sample application shows the integration of Video Analyzer's player widget with video playback, zone drawing and video clip generation features.

<TODO: include for Python & C# for cloning respective repo>  
Follow the instrcutions in the README in the src/video-player folder

## Get Started
1. Click 'Get Videos'
2. Select a Video from the drop-down list of all of the Videos in your Video Analyzer account

## Video Player
The Video Player page presents the typical player as seen in the Portal
<TODO: include screenshot>

## Zone Drawer
The Zone Drawer allows you to create zones by drawing polygons and drawing lines on your video. You can also save these zones and lines to receive the coordinates of your respective zones and lines. Copying these coordinates can be done using the *Copy to clipboard* button
(Example: {})
Zones and lines can be renamed and deleted.copy zone/line coordinates to clipboard
<TODO: include screenshot>

## Video Clips
Video Clips allows you to select a start date and time along with an end date and time. You can generate the video clip by using the *Add* button.
You can select any of your generated clips from drop-down list, where each clip is titled as the start and end dates and times.
(Example: Format)
Your video clip can then be viewed in the typical video player format.
<TODO: include screenshot>

This sample app shows what is capable with the Video Analyzer player widget.

## Next Steps
Try creating your own custom Video Analyzer player widget with these [instructions](./player-widget.md)

