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

When using a remote Windows session, different applications and display resolutions will require different network configurations. Your network’s available bandwidth will have a considerable impact on your experience quality, so it’s important to make sure your network is well-suited to your needs. The recommendations here hold for a network with less than 0.1% loss.

## Applications

The frame rate output by your app workload will put a load on your network in concert with your display resolution, so keep in mind that the recommendations in this section are the minimum necessary for a reasonable experience. For example, using a high-resolution display with a light workload will likely require higher available bandwidth than the recommendation for that app workload. 

|Workload        |Sample applications                                                                                  |Recommended bandwidth|
|----------------|--------------------------------------------------------------------------------------------------------------|------------|
|Task worker     |Microsoft Word, Outlook, Excel, Adobe Reader                                                                  |1.5 Mbps    |
|Office worker   |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer                                        |3 Mbps      |
|Knowledge worker|Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java                                  |5 Mbps      |
|Power worker    |Microsoft Word, Outlook, Excel, Adobe Reader, PowerPoint, Photo Viewer, Java, CAD/CAm, illustration/publishing|15 Mbps     |

Other scenarios, such as voice or video conferencing, real-time communication, and 4K video will have varying bandwidth requirements depending on your usage. Please load test your deployment with such scenarios using simulation tools. Vary the load size and execute both stress tests and simulations of real-life usage to understand your network requirements. 

## Display resolutions

Different display resolutions require different available bandwidths. Below are the recommended available bandwidths for a reasonable experience with typical display resolutions at 30 frames per second. Keep in mind that for scenarios outputting a frame rate under 30 frames per second, like reading static text, less available bandwidth may be necessary than recommended below. 

|Typical display resolutions at 30 fps|Recommended bandwidth|
|-------------------------------------|---------------------|
|~ 1024 × 768 px​                      |1.5 Mbps             |
|~ 1280 × 720 px                      |3.0 Mbps             |
|~ 1920 × 1080 px                     |5.0 Mbps             |
|~ 3840 × 2160 px (4K)                |15 Mbps              |

## Cut

The following table shows the recommended available bandwidths for a reasonable experience in your remote session:

|Available bandwidth|Sample display resolutions at 30 fps|Sample applications                                            |
|-------------------|------------------------------------|---------------------------------------------------------------|
|1.5 Mbps           |1024 × 768 px​                         |Microsoft Office (Word, PowerPoint, Excel)                     |
|3.0 Mbps           |1280 × 720 px                         |Illustration/publishing, voice chat                            |
|5.0 Mbps           |1920 × 1080 px                        |CAD/CAM, video conferencing (with 640x480 px video resolution) |
|15 Mbps            |3840 × 2160 px (4K)                   |Video conferencing (with 1280x720 px video resolution)         |

## Benchmarks

The following table lists rough benchmarks that we recommend your network meet for a reasonable experience with certain common display resolutions and apps.

|Workload        |Sample applications                                                                        |Recommended available bandwidth|
|----------------|-------------------------------------------------------------------------------------------|-------------------------------|
|Task worker     |Microsoft Office (Word, Excel, Outlook)                                                    |1.5 Mbps                       |
|Office worker   |Adobe Reader, Photo Viewer, illustration/publishing, voice chat                            |3 Mbps                         |
|Knowledge worker|Freemind/Java, CAD/CAM, video conferencing with around 640x480 px video resolution         |5 Mbps                         |
|Power worker    |Simulated application install, video conferencing with around 1280 × 720 px video resolution |15 Mbps                        |

To connect to your remote session, the basic recommendation is that you have 1.5 Mbps of available bandwidth. This bandwidth will also provide you a reasonable experience with apps associated with the Login VSI Task Worker workload, namely Microsoft Office apps. 

For apps that fall under the Login VSI Office Worker workload (such as Photo Viewer or Illustrator), illustration/publishing software, or voice chat, the recommended available bandwidth recommended for a reasonable experience in your remote session is 3.0 Mbps. 

For apps that fall under the Login VSI Knowledge Worker workload (such as Freemind or Java), CAD/CAM software, or video conferencing with 640x480 px video resolution, the recommended available bandwidth for a reasonable experience in your remote session is 5.0 Mbps. 

For scenarios that fall under the Login VSI Power Worker workload (such as simulated application install), or video conferencing with around 1280x720 px video resolution, the recommended available bandwidth for a reasonable experience in your remote session is 15.0 Mbps. 