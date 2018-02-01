---
title: Optimize Azure content delivery for your scenario
description: How to optimize delivery of your content for specific scenarios
services: cdn
documentationcenter: ''
author: dksimpson
manager: 
editor: ''

ms.assetid:
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2018
ms.author: rli
---
# Optimize Azure content delivery for your scenario

When you deliver content to a large global audience, it's critical to ensure the optimized delivery of your content. The Azure Content Delivery Network can optimize the delivery experience based on the type of content you have. Content can be a website, a live stream, a video, or a large file for download. When you create a content delivery network (CDN) endpoint, you specify a scenario in the **Optimized for** option. Your choice determines which optimization is applied to the content delivered from the CDN endpoint.

Optimization choices are designed to use best-practice behaviors to improve content delivery performance and better origin offload. Your scenario choices affect performance by modifying configurations for partial caching, object chunking, and the origin failure retry policy. 

This article provides an overview of various optimization features and when you should use them. For more information on features and limitations, see the respective articles on each individual optimization type.

> [!NOTE]
> Your **Optimized for** options can vary based on the provider you select. CDN providers apply enhancement in different ways, depending on the scenario. 

## Provider options

**Azure Content Delivery Network from Akamai** supports the following optimizations:

* [General web delivery](#general-web-delivery) 

* [General media streaming](#general-media-streaming)

* [Video-on-demand media streaming](#video-on-demand-media-streaming)

* [Large file download](#large-file-download)

* [Dynamic site acceleration](#dynamic-site-acceleration) 

**Azure Content Delivery Network from Verizon** supports the following optimizations:

* [General web delivery](#general-web-delivery) (can also be used for media streaming and large file download content)

* [Dynamic site acceleration](#dynamic-site-acceleration) 

We highly recommend that you test performance variations between different providers to select the optimal provider for your delivery.

## Select and configure optimization types

To create a new endpoint, select an optimization type that best matches the scenario and type of content that you want the endpoint to deliver. **General web delivery** is the default selection. For existing **Azure Content Delivery Network from Akamai** endpoints, you can update the optimization option at any time. This change doesn't interrupt delivery from the CDN. 

1. Within an **Azure Content Delivery Network from Akamai** profile, select an endpoint.

    ![Endpoint selection ](./media/cdn-optimization-overview/01_Akamai.png)

2. Under **SETTINGS**, select **Optimization**. Then, select a type from the **Optimized for** drop-down list.

    ![Optimization and type selection](./media/cdn-optimization-overview/02_Select.png)

## Optimization for specific scenarios

You can optimize the CDN endpoint for one of these scenarios. 

### General web delivery

General web delivery is the most common optimization option. It's designed for general web content optimization, such as webpages and web applications. This optimization also can be used for file and video downloads.

A typical website contains static and dynamic content. Static content includes images, JavaScript libraries, and style sheets that can be cached and delivered to different users. Dynamic content is personalized for an individual user, such as news items that are tailored to a user profile. Dynamic content isn't cached because it's unique to each user, such as shopping cart contents. General web delivery can optimize your entire website. 

> [!NOTE]
> If you use **Azure Content Delivery Network from Akamai**, you might want to use this optimization if your average file size is smaller than 10 MB. If your average file size is larger than 10 MB, select **Large file download** from the **Optimized for** drop-down list.

### General media streaming

If you need to use the endpoint for live streaming and video-on-demand streaming, we recommend general media streaming optimization.

Media streaming is time sensitive, because packets that arrive late on the client can cause a degraded viewing experience, such as frequent buffering of video content. Media streaming optimization reduces the latency of media content delivery and provides a smooth streaming experience for users. 

This scenario is common for Azure media service customers. When you use Azure media services, you get one streaming endpoint that can be used for both live and on-demand streaming. With this scenario, customers don't need to switch to another endpoint when they change from live to on-demand streaming. General media streaming optimization supports this type of scenario.

**Azure Content Delivery Network from Verizon** uses the general web delivery optimization type to deliver streaming media content.

For more information about media streaming optimization, see [Media streaming optimization](cdn-media-streaming-optimization.md).

### Video-on-demand media streaming

Video-on-demand media streaming optimization improves video-on-demand streaming content. If you use an endpoint for video-on-demand streaming, you might want to use this option.

**Azure Content Delivery Network from Verizon** uses the general web delivery optimization type to deliver streaming media content.

For more information about media streaming optimization, see [Media streaming optimization](cdn-media-streaming-optimization.md).

> [!NOTE]
> If the endpoint primarily serves video-on-demand content, use this optimization type. The major difference between this optimization and the general media streaming optimization is the connection retry time-out. The time-out is much shorter to work with live streaming scenarios.

### Large file download

If you use **Azure Content Delivery Network from Akamai**, you must use large file download to deliver files larger than 1.8 GB. **Azure Content Delivery Network from Verizon** doesn't have a limitation on file download size in its general web delivery optimization.

If you use **Azure Content Delivery Network from Akamai**, large file downloads are optimized for content larger than 10 MB. If your average file size is smaller than 10 MB, you might want to use general web delivery. If your average files sizes are consistently larger than 10 MB, it might be more efficient to create a separate endpoint for large files. For example, firmware or software updates typically are large files.

**Azure Content Delivery Network from Verizon** uses the general web delivery optimization type to deliver large file download content.

For more information about large file optimization, see [Large file optimization](cdn-large-file-optimization.md).

### Dynamic site acceleration

 Dynamic site acceleration is available in both **Azure Content Delivery Network from Akamai** and **Azure Content Delivery Network from Verizon** profiles. This optimization involves an additional fee to use; for more information, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

Dynamic site acceleration includes various techniques that benefit the latency and performance of dynamic content. Techniques include route and network optimization, TCP optimization, and more. 

You can use this optimization to accelerate a web app that includes numerous responses that aren't cacheable. Examples are search results, checkout transactions, or real-time data. You can continue to use core CDN caching capabilities for static data. 

For more information about dynamic site acceleration, see [Dynamic site acceleration](cdn-dynamic-site-acceleration.md).



