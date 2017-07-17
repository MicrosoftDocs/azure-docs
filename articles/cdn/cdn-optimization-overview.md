---
title: Optimize Azure content delivery for your scenario
description: How to optimize delivery of your content for specific scenarios
services: cdn
documentationcenter: ''
author: smcevoy
manager: erikre
editor: ''

ms.assetid:
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/16/2017
ms.author: v-semcev
---
# Optimize Azure content delivery for your scenario

When delivering content to a large global audience, it is critical to ensure optimized delivery of your content. Azure CDN can optimize the delivery experience based on the type of content you have, whether it is a website, a live stream, a video, or a large file for download, to provide a discernable performance enhancement. When you create a CDN endpoint, you specify a scenario in the “optimized for” menu option. Your choice determines which optimization will be applied to the content delivered from the CDN endpoint

Optimization choices are designed to use ‘best practice’ behaviors to improve content delivery performance and better origin offload. Your scenario choices will affect performance by modifying configurations for partial caching, object chunking, origin failure retry policy, etc. 

This document provides a rough overview of various optimization features and when you should use them. Please see the respective documents on each individual optimization type for more details on features and limitations.

> [!NOTE]
> Your “optimized for” menu options can vary based on the provider you select. CDN providers apply enhancement in different ways, depending on the scenario. 

## Provider Options

> * Azure CDN from Akamai supports general web delivery, general media streaming, video on demand media streaming, large file download, and dynamic site acceleration. 

> * Azure CDN from Verizon supports general web delivery only, which can be used with video on demand and large file download without selecting an optimization type.

> * It is highly recommended that you test  performance variations between different providers to select the optimal provider for your delivery.

## Selecting and Configuring Optimization Types

You can begin creating a new CDN endpoint, by selecting from the drop-down menu that best matches the scenario and the type of content that you use the endpoint to deliver. "General web delivery" is the default selection. You can update the optimization option for any existing Akamai endpoint at any time. This change will not interrupt CDN delivery.  

1. Select an endpoint within a Standard Akamai Profile.

    ![Select an endpoint.](./media/cdn-optimization-overview/01_Akamai.png)

2. Select Optimization from the sidebar, then select a type from the dropdown.

    ![Select Optimization and Type.](./media/cdn-optimization-overview/02_Select.png)

## Optimization for Specific Scenarios

You can optimize the CDN endpoint for one of the following scenarios:  

1.	General web delivery
2.	General media streaming
3.	Video on demand media streaming
4.	Large file download
5.  Dynamic site acceleration

The four scenario optimization configurations type are explained below. 

### General web delivery optimization

General web delivery is the most common option. It is designed for general web content optimization, such as web pages and web applications. This optimization can also be used for file and video downloads.

A typical website usually contains both static and dynamic content. Static content includes images, JavaScript libraries, and style sheets, that can be cached and delivered to different users. Dynamic content is personalized to individual user, such as news items tailored to a user profile. Dynamic content does not need to be cached because it is unique to each user, such as shopping cart contents. General web delivery can optimize your entire website.  

> [!NOTE]
> When do I use this?

> If you use Azure CDN from Akamai, you might want to use this optimization when the average file size is smaller than 10MB. Use "optimized for: large file download" when average file size is larger than 10MB.

### General media streaming optimization

General media streaming is recommended if you need to use the endpoint for both live streaming and video on demand streaming.

For example, media streaming is time sensitive because packets arriving late on the client can cause degraded viewing experience, such as frequent buffering of video content. Media Streaming optimization reduces the latency of media content delivery and provides smooth streaming experience for end users. 

This is a common scenario for Azure media service customers. When you use Azure media services, you will get one streaming endpoint that can be used for both live and on demand streaming. With this scenario the customer doesn't need to switch to another endpoint when they change from live to on demand streaming. General media streaming optimization supports this type of scenario.

Azure CDN from Verizon can use the general web delivery optimization type to deliver streaming media content.

Learn more about Media Streaming Optimization [here](cdn-media-streaming-optimization.md) .

### Video on demand streaming optimization

Video on demand (VOD) media streaming optimization will improve VOD streaming content. When you use an endpoint for VOD streaming, you may want to use this option.

Azure CDN from Verizon can use the general web delivery optimization type to deliver streaming media content.

Learn more about Media Streaming Optimization [here](cdn-media-streaming-optimization.md).

> [!NOTE]
> When do I use this?

> When the endpoint primarily serves VOD content. The major difference between this optimization and general media streaming optimization is the connection retry timeout being much shorter to work with live streaming scenarios.

### Large file download optimization

For Azure CDN from Akamai you must use this optimization to deliver files larger than 1.8GB.  Azure CDN from Verizon does not have a limitation on file download size in their general web delivery optimization.

When using Azure CDN from Akamai, large file downloads are optimized for content larger than 10MB. When your average file size is smaller than 10MB, you may want to use general web delivery. If your average files sizes are consistently larger than 10MB (for example, firmware or software updates), it might be more efficient to create a separate endpoint for large files. 

Azure CDN from Verizon can use the general web delivery optimization type to deliver streaming media content.

Learn more about large file optimization [here](cdn-large-file-optimization.md).

### Dynamic Site Acceleration

This optimization is available from both Akamai and Verizon CDN profiles and involves an additional fee to use. Please see the pricing page for more information.

Dynamic Site Acceleration (DSA) includes a variety of techniques that benefit the latency and performance of dynamic content, such as route and network optimization, TCP optimization, and more. 

You should consider this optimization to accelerate a web app that includes a lot responses that are not cacheable, such as search results, checkout transactions, or real time data, while still leveraging core CDN caching capabilities for static data. 



