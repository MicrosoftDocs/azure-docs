---
title: Dynamic site acceleration via Azure Content Delivery Network
description: Azure Content Delivery Network supports dynamic site acceleration (DSA) optimization for files with dynamic content.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
---

# Dynamic site acceleration via Azure Content Delivery Network

With the explosion of social media, electronic commerce, and the hyper-personalized web, a rapidly increasing percentage of the content served to end users is generated in real time. Users expect a fast, reliable, and personalized web experience, independent of their browser, location, device, or network. However, the very innovations that make these experiences so engaging also slow page downloads and put the quality of the consumer experience at risk.

Standard content delivery network capability includes the ability to cache files closer to end users to speed up delivery of static files. However, with dynamic web applications, caching that content in edge locations isn't possible because the server generates the content in response to user behavior. Speeding up the delivery of such content is more complex than traditional edge caching and requires an end-to-end solution that finely tunes each element along the entire data path from inception to delivery. With Azure Content Delivery Network dynamic site acceleration (DSA) optimization, the performance of web pages with dynamic content is measurably improved.

Dynamic site acceleration from Microsoft is offered through [Azure Front Door](../frontdoor/front-door-overview.md).

<a name='cdn-endpoint-configuration-to-accelerate-delivery-of-dynamic-files'></a>

## Content delivery network endpoint configuration to accelerate delivery of dynamic files

To configure a content delivery network endpoint to optimize delivery of dynamic files, you can either use the Azure portal, the REST APIs, or any of the client SDKs to do the same thing programmatically.

**To configure a CDN endpoint for DSA optimization by using the Azure portal:**

1. In the **CDN profile** page, select **Endpoint**.

   The **Add an endpoint** pane appears.

2. Under **Optimized for**, select **Dynamic site acceleration**.

3. For **Probe path**, enter a valid path to a file.

    Probe path is a feature specific to DSA, and a valid path is required for creation. DSA uses a small *probe path* file placed on the origin server to optimize network routing configurations for the content delivery network. For the probe path file, you can download and upload the sample file to your site, or use an existing asset on your origin that is about 10 KB in size.

4. Enter the other required endpoint options (for more information, see [Create a new content delivery network endpoint](cdn-create-new-endpoint.md#create-a-new-cdn-endpoint)), then select **Add**.

   After the content delivery network endpoint is created, it applies the DSA optimizations for all files that match certain criteria.

<a name='dsa-optimization-using-azure-cdn'></a>

## DSA Optimization using Azure Content Delivery Network

Dynamic Site Acceleration on Azure Content Delivery Network speeds up delivery of dynamic assets by using the following techniques:

-	[Route optimization](#route-optimization)
-	[TCP optimizations](#tcp-optimizations)

### Route Optimization

Route optimization is important because the Internet is a dynamic place, where traffic and temporarily outages are constantly changing the network topology. The Border Gateway Protocol (BGP) is the routing protocol of the Internet, but there might be faster routes via intermediary Point of Presence (POP) servers.

Route optimization chooses the most optimal path to the origin so that a site is continuously accessible and dynamic content is delivered to end users via the fastest and most reliable route possible.

As a result, fully dynamic and transactional content is delivered more quickly and more reliably to end users, even when it's not cacheable.

### TCP Optimizations

Transmission Control Protocol (TCP) is the standard of the Internet Protocol suite used to deliver information between applications on an IP network. By default, the establishment of a TCP connection requires multiple bidirectional requests. Additionally, there are limits in place to prevent network congestion, which can lead to inefficiencies when operating at scale.

#### Eliminating TCP slow start

TCP *slow start* is an algorithm of the TCP protocol that prevents network congestion by limiting the amount of data sent over the network. It starts off with small congestion window sizes between sender and receiver until the maximum is reached or packet loss is detected.

<a name='leveraging-persistent-connections'></a>

#### Using persistent connections

When you're using a content delivery network, fewer unique machines connect to your origin server directly compared with users connecting directly to your origin. Azure Content Delivery Network also pools user requests together to establish fewer connections with the origin.

As previously mentioned, several handshake requests are required to establish a TCP connection. Persistent connections, which get implemented by the `Keep-Alive` HTTP header, reuse existing TCP connections for multiple HTTP requests to save round-trip times and speed up delivery.

## Caching

With DSA, caching is turned off by default on the content delivery network, even when the origin includes `Cache-Control` or `Expires` headers in the response. DSA is typically used for dynamic assets that shouldn't be cached because they're unique to each client. Caching can break this behavior.

If you have a website with a mix of static and dynamic assets, it's best to take a hybrid approach to get the best performance.

To access caching rules:

1. From the **CDN profile** page, under settings, select **Caching rules**.

    The **Caching rules** page opens.

2. Create a global or custom caching rule to turn on caching for your DSA endpoint.

To access the rules engine:

1. From the **CDN profile** page, select **Manage**.

    The content delivery network management portal opens.

2. From the content delivery network management portal, select **ADN**, then select **Rules Engine**.

    ![Rules engine for DSA](./media/cdn-dynamic-site-acceleration/cdn-dsa-rules-engine.png)

Alternatively, you can use two content delivery network endpoints: one endpoint optimized with DSA to deliver dynamic assets and another endpoint optimized with a static optimization type, such as general web delivery, to deliver cacheable assets. Modify your webpage URLs to link directly to the asset on the content delivery network endpoint you plan to use.

For example, `mydynamic.azureedge.net/index.html` is a dynamic page and is loaded from the DSA endpoint. The HTML page references multiple static assets such as JavaScript libraries or images that are loaded from the static content delivery network endpoint, such as `mystatic.azureedge.net/banner.jpg` and `mystatic.azureedge.net/scripts.js`.
