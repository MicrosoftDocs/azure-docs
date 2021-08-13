---
title: The Azure Video Analyzer player widget sample
description: This reference article gives a brief overview of the Video Analyzer player widget sample application
ms.service: azure-video-analyzer
ms.topic: reference
ms.date: 08/13/2021

---

# Azure Video Analyzer player widget sample

This sample application shows the integration of Video Analyzer's player widget with video playback, zone drawing and video clip generation features.

* Clone the [AVA C# sample repository](https://github.com/Azure-Samples/video-analyzer-iot-edge-csharp)
* Follow the instrcutions in the [README in the **src/video-player** folder](https://github.com/Azure-Samples/video-analyzer-iot-edge-csharp/blob/main/src/video-player/readme.md)

## Get Started
After following the README instructions and the app is running on http://localhost:3000/
1. Click 'Get Videos'
2. Select a Video from the drop-down list of all of the Videos in your Video Analyzer account

## Video Player
The Video Player page presents the typical player, as seen in the Portal.  
![Screenshot of video player.](./media/sample-widget-player/widget-video-player.png)

## Zone Drawer
The Zone Drawer allows you to create zones by drawing polygons and drawing lines on your video. You can also save these zones and lines to receive the coordinates of your respective zones and lines.  
  
**Example:**
```json
  {
    "@type": "#Microsoft.VideoAnalyzer.NamedLineString",
    "name": "Line 1",
    "line": [
      {
        "x": 0.6987951807228916,
        "y": 0.4430992736077482
      },
      {
        "x": 0.6987951807228916,
        "y": 0.7046004842615012
      }
    ]
  }{
    "@type": "#Microsoft.VideoAnalyzer.NamedPolygonString",
    "name": "Zone 2",
    "polygon": [
      {
        "x": 0.10575635876840696,
        "y": 0.7481840193704601
      },
      {
        "x": 0.16599732262382866,
        "y": 0.7796610169491526
      },
      {
        "x": 0.07764390896921017,
        "y": 0.9007263922518159
      },
      {
        "x": 0.024096385542168676,
        "y": 0.8547215496368039
      }
    ]
  }
```
Copying these coordinates can be done using the **Copy to clipboard** button. Zones and lines can be renamed and deleted using the three dots next to each zone and line.  
![Screenshot of zone drawer.](./media/sample-widget-player/widget-zone-drawer.png)

## Video Clips
Video Clips allows you to select a start date and time along with an end date and time. You can generate the video clip by using the *Add* button.
You can select any of your generated clips from drop-down list, where each clip is titled as the start and end dates and times.
(Example: Format)
Your video clip can then be viewed in the typical video player format.  
![Screenshot of video clips.](./media/sample-widget-player/widget-video-clips.png)

## Next Steps
Try creating your own custom Video Analyzer player widget with these [instructions](./player-widget.md)

