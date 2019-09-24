---
title: Bandwidth recommendations for remote sessions - Azure
description: Available bandwidth recommendations for remote sessions.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: reference
ms.date: 09/23/2019
ms.author: helohr
---
# Bandwidth recommendations for remote sessions

When using a remote Windows session, your network’s available bandwidth greatly impacts the quality of your experience. Different applications and display resolutions require different network configurations, so it’s important to make sure your network is configured to meet your needs. This article describes recommended bandwidths for each workload.

>[!NOTE]
>The following recommendations hold for a network with less than 0.1% loss.

## Applications

The recommendations in the following table are the minimum requirements for a good user experience. However, keep in mind that your app workload's framerate output will put an additional load on your network along with your display resolution, which may raise the bandwidth requirements. For example, using a high-resolution display with a light workload requires a higher available bandwidth than the recommendation for that app workload.

|Workload        |Sample applications                                                                                  |Recommended bandwidth|
|----------------|--------------------------------------------------------------------------------------------------------------|------------|
|Task worker     |Microsoft Word, Outlook, Excel, Adobe Reader                                                                  |1.5 Mbps    |
|Office worker   |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer                                        |3 Mbps      |
|Knowledge worker|Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java                                  |5 Mbps      |
|Power worker    |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java, CAD/CAm, illustration/publishing|15 Mbps     |

Other scenarios, such as voice or video conferencing, real-time communication, and 4K video will have varying bandwidth requirements depending on your usage. Make sure to load test these scenarios in your deployment using simulation tools. Vary the load size and execute both stress tests and simulations of real-life usage to understand your network requirements. 

## Display resolutions

Different display resolutions require different available bandwidths. The following table lists the bandwidths we recommend for a smooth user experience at typical display resolutions with a framerate of 30 fps. Keep in mind that for scenarios outputting a frame rate under 30 frames per second, like reading static text, less available bandwidth may be necessary than recommended below. 

|Typical display resolutions at 30 fps|Recommended bandwidth|
|-------------------------------------|---------------------|
|~ 1024 × 768 px​                      |1.5 Mbps             |
|~ 1280 × 720 px                      |3.0 Mbps             |
|~ 1920 × 1080 px                     |5.0 Mbps             |
|~ 3840 × 2160 px (4K)                |15 Mbps              |

## Cut

The following table lists the recommended available bandwidths for a smooth user experience in remote sessions:

|Available bandwidth|Sample display resolutions at 30 fps  |Sample applications                                              |
|-------------------|--------------------------------------|-----------------------------------------------------------------|
|1.5 Mbps           |1024 × 768 px​                         |Microsoft Office (Word, PowerPoint, Excel)                       |
|3.0 Mbps           |1280 × 720 px                         |Illustration/publishing, voice chat                              |
|5.0 Mbps           |1920 × 1080 px                        |CAD/CAM, video conferencing (with 640 × 480 px video resolution) |
|15 Mbps            |3840 × 2160 px (4K)                   |Video conferencing (with 1280 × 720 px video resolution)         |

## Benchmarks

The following table lists rough benchmarks that your network needs to meet for a smooth user experience with certain common display resolutions and apps.

|Workload        |Sample applications                                                                        |Recommended available bandwidth|
|----------------|-------------------------------------------------------------------------------------------|-------------------------------|
|Task worker     |Microsoft Office (Word, Excel, Outlook)                                                    |1.5 Mbps                       |
|Office worker   |Adobe Reader, Photo Viewer, illustration/publishing, voice chat                            |3 Mbps                         |
|Knowledge worker|Freemind/Java, CAD/CAM, video conferencing with around 640 × 480 px video resolution         |5 Mbps                         |
|Power worker    |Simulated application install, video conferencing with around 1280 × 720 px video resolution |15 Mbps                      |

To connect to your remote session, we recommend you have at least 1.5 Mbps of available bandwidth. This bandwidth will also provide you a reasonable experience with apps associated with the Login VSI Task Worker workload, such as Microsoft Office. 

For apps that fall under the Login VSI Office Worker workload, such as Photo Viewer, Illustrator, illustration/publishing software, or voice chat, we recommend that you have at least 3.0 Mbps of available bandwidth for your remote session. 

For apps that fall under the Login VSI Knowledge Worker workload, such as Freemind, Java, CAD/CAM software, or video conferencing with 640 × 480 px video resolution, we recommend you have at least 5.0 Mbps of available bandwidth for your remote session. 

For scenarios that fall under the Login VSI Power Worker workload, such as simulated application install or video conferencing with around 1280 × 720 px video resolution, we recommend you have at least 15.0 Mbps of available bandwidth for your remote session. 