---
title: Record video for playback with Azure Video Analyzer
description: This article discusses recording of video for playback with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: conceptual
ms.date: 06/01/2021

---

# Record video for playback

In the context of a video management system for CCTV cameras, video recording refers to the process of capturing video from the cameras and recording it for subsequent viewing via mobile and browser apps. Video recording can be categorized as continuous video recording and event-based video recording.

## Continuous video recording

Continuous video recording (CVR) refers to the process of continuously recording all the video being captured from a video source. CVR ensures that the desired duration of video is available (dictated by the **[recording policy](#recording-policy))** to analyze and/or audit at a later point in time.


## Event-based video recording

Event-based video recording (EVR) refers to the process of recording video triggered by an event. The event in question, could originate due to processing of the video signal itself (for example, detecting motion) or could be from an independent source (for example, from a door sensor). EVR can result in storage savings, but it requires additional components that generate the events and trigger the video recording. In other words, EVR requires making additional decisions regarding the events that should trigger video recording and the duration of that video recording. An example could be something like: record the video for 2 minutes starting from 30 seconds prior to the event time.

## Choosing recording modes

The choice of whether to use CVR or EVR depends on the business goals. Azure Video Analyzer (AVA) provides platform capabilities for both CVR and EVR. You can learn more about it in the **[CVR](continuous-video-recording.md)** and **[EVR](event-based-video-recording-concept.md)** scenario articles.

## Recording policy

Recording policy refers to the policies that dictate the length or duration of the video recording that is retained. Recording policies enable you to balance storage cost with business requirements. For CVR, recording policy defines how many days of video should be stored (for example, the last 7 days). You can learn more about it in the **[CVR](continuous-video-recording.md)** scenario article.

## Next steps

- [Read about EVR scenarios](event-based-video-recording-concept.md)
- [Read about CVR scenarios](continuous-video-recording.md)
