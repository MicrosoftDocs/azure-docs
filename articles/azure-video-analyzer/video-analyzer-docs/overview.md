---
title: Overview
description: This topic provides an overview of Azure Video Analyzer
ms.topic: overview
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# What is Azure Video Analyzer? (preview)

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]
 
Azure Video Analyzer provides you a platform for building intelligent video applications that span the edge and the cloud. The platform consists of an IoT Edge module and an Azure service. It offers the capability to capture, record, and analyze live videos and publish the results, namely video and insights from video, to edge or cloud.

The Video Analyzer edge module can be used with other Azure IoT Edge modules such as Stream Analytics, Cognitive Services, and other Azure cloud services such as Event Hub and Cognitive Services to build powerful hybrid (that is, edge + cloud) applications. This extensible edge module seamlessly integrates with various AI edge modules such as Azure Cognitive Services containers or custom edge modules built using open-source machine learning models and your training data. By building on the Video Analyzer platform, you can analyze live video without worrying about the complexity of building, operating, and maintaining a complex system.

Apart from analyzing live video, the edge module also enables you to optionally record video locally on the edge or to the cloud, and to publish video insights to Azure services (on the edge and/or in the cloud). If video and video insights are recorded to the cloud, then the Video Analyzer cloud service can be used to manage them.

The Video Analyzer cloud service can therefore be used to enhance IoT solutions with [video management system (VMS)](https://en.wikipedia.org/wiki/Video_management_system) capabilities such as recording, playback, and exporting (generating video files that can be shared externally). It can also be used to build a cloud-native solution with the same capabilities, as shown in the diagram below, with cameras connecting directly to the cloud.

## Accelerate IoT solutions development 

IoT solutions that combine video analytics with signals from other IoT sensors and/or business data can help you automate or semi-automate business decisions, resulting in productivity improvements. Video Analyzer enables you to build such solutions quicker. You can focus on building the video analysis modules and logic that is specific to your business, and letting the platform hide the complexities of managing and running a video pipeline.

With Video Analyzer, you can continue to use your [CCTV cameras](https://en.wikipedia.org/wiki/Closed-circuit_television_camera) with your existing [video management systems (VMS)](https://en.wikipedia.org/wiki/Video_management_system) and build video analytics apps independently. Video Analyzer can be used along with computer vision SDKs and toolkits to build cutting edge IoT solutions. The diagram below illustrates this.

![Develop IoT solutions with Video Analyzer](./media/overview/product-diagram.svg)

### Concepts

* [Pipeline](pipeline.md)
* [Video Analyzer without video recording](analyze-live-video-without-recording.md)
* [Video recording](video-recording.md)


## Compliance, Privacy and Security

As an important reminder, you must comply with all applicable laws in your use of Video Analyzer, and you may not use Video Analyzer or any Azure service in a manner that violates the rights of others, or that may be harmful to others.

Before processing any videos by Video Analyzer, you must have all the proper rights to use the videos, including, where required by law, all the necessary consents from individuals (if any) in the video/image, for the use, processing, and storage of their data in Video Analyzer and Azure. Some jurisdictions may impose special legal requirements for the collection, online processing, and storage of certain categories of data, such as biometric data. Before using Video Analyzer and Azure for the processing and storage of any data subject to special legal requirements, you must ensure compliance with any such legal requirements that may apply to You.

To learn about compliance, privacy and security in Video Analyzer visit the Microsoft [Trust Center](https://www.microsoft.com/TrustCenter/CloudServices/Azure/default.aspx). For Microsoft's privacy obligations, data handling and retention practices, including how to delete your data, review Microsoft's [Privacy Statement](https://privacy.microsoft.com/PrivacyStatement), the [Product Terms](https://www.microsoft.com/licensing/terms/welcome/welcomepage), and [Microsoft Products and Services Data Protection Addendum](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) ("DPA"). By using Video Analyzer, you agree to be bound by the Product Terms, DPA, and the Privacy Statement.

## Next steps

* Follow the [Quickstart: Get started with Azure Video Analyzer](get-started-detect-motion-emit-events.md) article to see how you can run motion detection on live video.
* Review [terminology](terminology.md).
