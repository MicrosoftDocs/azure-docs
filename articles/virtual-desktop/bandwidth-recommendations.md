---
title: Bandwidth recommendations for remote sessions - Azure
description: Available bandwidth recommendations for remote sessions.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/01/2019
ms.author: helohr
---
# Bandwidth recommendations for remote sessions

When using a remote Windows session, your network’s available bandwidth greatly impacts the quality of your experience. Different applications and display resolutions require different network configurations, so it’s important to make sure your network is configured to meet your needs.

>[!NOTE]
>The following recommendations apply to networks with less than 0.1% loss.

## Applications

The following table lists the minimum recommended bandwidths for a smooth user experience. 

|Workload        |Sample applications                                                                                           |Recommended bandwidth|
|----------------|--------------------------------------------------------------------------------------------------------------|---------------------|
|Task worker     |Microsoft Word, Outlook, Excel, Adobe Reader                                                                  |1.5&nbsp;Mbps        |
|Office worker   |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer                                        |3&nbsp;Mbps          |
|Knowledge worker|Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java                                  |5&nbsp;Mbps          |
|Power worker    |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java, CAD/CAM, illustration/publishing|15&nbsp;Mbps         |

>[!NOTE]
>These recommendations apply regardless of how many users are in the session.

Keep in mind that the stress put on your network depends on both your app workload's output frame rate and your display resolution. If either the frame rate or display resolution increases, the bandwidth requirement will also rise. For example, a light workload with a high-resolution display requires more available bandwidth than a light workload with regular or low resolution.

Other scenarios can have their bandwidth requirements change depending on how you use them, such as:

- Voice or video conferencing
- Real-time communication
- Streaming 4K video

Make sure to load test these scenarios in your deployment using simulation tools like Login VSI. Vary the load size, run stress tests, and test common user scenarios in remote sessions to better understand your network's requirements. 

## Display resolutions

Different display resolutions require different available bandwidths. The following table lists the bandwidths we recommend for a smooth user experience at typical display resolutions with a frame rate of 30 frames per second (fps). These recommendations apply to single and multiple user scenarios. Keep in mind that scenarios involving a frame rate under 30 fps, such as reading static text, require less available bandwidth. 

|Typical display resolutions at 30 fps    |Recommended bandwidth|
|-----------------------------------------|---------------------|
|About 1024 × 768 px                      |1.5 Mbps             |
|About 1280 × 720 px                      |3 Mbps               |
|About 1920 × 1080 px                     |5 Mbps               |
|About 3840 × 2160 px (4K)                |15 Mbps              |

>[!NOTE]
>These recommendations apply regardless of how many users are in the session.

## Additional resources

The Azure region you're in can affect user experience as much as network conditions. Check out the [Windows Virtual Desktop experience estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to learn more.
