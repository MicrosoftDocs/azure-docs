---
title: Dynamic Site Acceleration via Azure CDN
description: Dynamic site acceleration deep dive
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
ms.date: 08/02/2017
ms.author: v-semcev
---
# Dynamic Site Acceleration via Azure CDN

With the explosion of social media, electronic commerce, and the hyper-personalized web, a rapidly increasing percentage of the content served to end users is generated in real time. Users expect fast, reliable, and personalized web experiences, independent of their browser, location, device, or network. However, the very innovations that make these experiences so engaging also slow page downloads and put the quality of the consumer experience at risk. 

Standard CDN capability includes the ability to cache files closer to end users to speed up delivery of static files. However, with dynamic web applications, caching that content in edge locations isn't possible because the server generates the content in response to user behavior. Speeding up the delivery of such content is more complex than traditional edge caching and requires an end-to-end solution that finely tunes each element along the entire data path from inception to delivery. With Azure CDN Dynamic Site Acceleration (DSA), the performance of web pages with dynamic content is measurably improved.

Azure CDN from Akamai and Verizon offers DSA optimization through the **Optimized for** menu during endpoint creation.

## Configuring CDN endpoint to accelerate delivery of dynamic files

You can configure your CDN endpoint to optimize delivery of dynamic files via Azure portal by selecting the **Dynamic site acceleration** option under the **Optimized for** property selection during the endpoint creation. You can also use our REST APIs or any of the client SDKs to do the same thing programmatically. 

### Probe path
Probe path is a feature specific to Dynamic Site Acceleration, and a valid one is required for creation. DSA uses a small *probe path* file placed on the origin to optimize network routing configurations for the CDN. You can download and upload our sample file to your site, or use an existing asset on your origin that is roughly 10 KB for the probe path instead if the asset exists.

> [!Note]
> DSA incurs extra charges. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cdn/) for more information.

The following screenshots illustrate the process via Azure portal.
 
![Adding a new CDN endpoint](./media/cdn-dynamic-site-acceleration/01_Endpoint_Profile.png) 

*Figure 1: Adding a new CDN endpoint from the CDN Profile*
 
![Creating a new CDN endpoint with DSA](./media/cdn-dynamic-site-acceleration/02_Optimized_DSA.png)  

*Figure 2: Creating a CDN Endpoint with Dynamic site acceleration Optimization selected*

Once the CDN endpoint is created, it applies the DSA optimizations for all files that match certain criteria. The following section describes DSA optimization in detail.

## DSA Optimization using Azure CDN

Dynamic Site Acceleration on Azure CDN speeds up delivery of dynamic assets using the following techniques:

-	Route Optimization
-	TCP Optimizations
-	Object Prefetch (Akamai only)
-   Mobile Image Compression (Akamai only)

### Route Optimization

Route optimization is important because the Internet is a dynamic place, where traffic and temporarily outages are constantly changing the network topology. The Border Gateway Protocol (BGP) is the routing protocol of the Internet, but there may be faster routes via intermediary Point of Presence (PoP) servers. 

Route optimization chooses the most optimal path to the origin so that a site is continuously accessible and dynamic content is delivered to end users via the fastest and most reliable route possible. 

The Akamai network uses techniques to collect real-time data and compare various paths through different nodes in the Akamai server, as well as the default BGP route across the open Internet to determine the fastest route between the origin and the CDN edge. These techniques avoid Internet congestion points and long routes. 

Similarly, the Verizon network uses a combination of Anycast DNS, high capacity support PoPs, and health checks, to determine the best gateways to best route data from the client to the origin.
 
As a result, fully dynamic and transactional content is delivered more quickly and more reliably to end users, even when it is uncacheable. 

### TCP Optimizations

Transmission Control Protocol (TCP) is the standard of the Internet protocol suite used to deliver information between applications on an IP network.  By default, there are several back and forth requests required to set up a TCP connection, as well as limits to avoid network congestions, which result in inefficiencies at scale. Azure CDN from Akamai deals with this problem by optimizing in three areas: 

 - eliminating slow start
 - leveraging persistent connections
 - tuning TCP packet parameters (Akamai only)

#### Eliminating slow start

*Slow start* is a part of the TCP protocol that prevents network congestion by limiting the amount of data sent over the network. It starts off with small congestion window sizes between sender and receiver until the maximum is reached or packet loss is detected.

Azure CDN from Akamai and Verizon eliminates slow start in three steps:

1.	Both Akamai and Verizon's network use health and bandwidth monitoring to measure the bandwidth of connections between edge PoP servers.
2. The metrics are shared between edge PoP servers so that each server is aware of the network conditions and server health of the other PoPs around them.  
3. The CDN edge servers are now able to make assumptions about some transmission parameters, such as what the optimal window size should be when communicating with other CDN edge servers in its proximity. This step means that the initial congestion window size can be increased if the health of the connection between the CDN edge servers is capable of higher packet data transfers.  

#### Leveraging persistent connections

Using a CDN, fewer unique machines connect to your origin server directly compared with users connecting directly to your origin. Azure CDN from Akamai and Verizon also pools user requests together to establish fewer connections with the origin.

As mentioned earlier, TCP connections take several requests back and forth in a handshake to establish a new connection. Persistent connections, also known as "HTTP Keep-Alive," reuse existing TCP connections for multiple HTTP requests to save round-trip times and speed up delivery. 

The Verizon network also sends periodic keep-alive packets over the TCP connection to prevent an open connection from being closed.

#### Tuning TCP packet parameters

Azure CDN from Akamai also tunes the parameters that govern server-to-server connections, and reduces the amount of long haul round trips required to retrieve content embedded in the site by using the following techniques:

1.	Increasing the initial congestion window so that more packets can be sent without waiting for an acknowledgement.
2.	Decreasing the initial retransmit timeout so that a loss is detected, and retransmission occurs more quickly.
3.	Decreasing the minimum and maximum retransmit timeout to reduce the wait time before assuming packets were lost in transmission.

### Object Prefetch (Akamai only)

Most websites consist of an HTML page, which references various other resources such as images and scripts. Typically, when a client requests a webpage, the browser first downloads and parses the HTML object, and then makes additional requests to linked assets that are required to fully load the page. 

*Prefetch* is a technique to retrieve images and scripts embedded in the HTML page while the HTML is served to the browser, and before the browser even makes these object requests. 

With the **prefetch** option turned on at the time when the CDN serves the HTML base page to the client’s browser, the CDN parses the HTML file and make additional requests for any linked resources and store it in its cache. When the client makes the requests for the linked assets, the CDN edge server already has the requested objects and can serve them immediately without a round trip to the origin. This optimization benefits both cacheable and non-cacheable content.

### Adaptive Image Compression (Akamai only)

Some devices, especially mobile ones, experience slower network speeds from time to time. In these scenarios, it is more beneficial for the user to receive smaller images in their webpage more quickly rather than waiting a long time for full resolution images.

This feature automatically monitors network quality, and employs standard JPEG compression methods when network speeds are slower to improve delivery time.

Adaptive Image Compression | File Extensions  
--- | ---  
JPEG compression | .jpg, .jpeg, .jpe, .jig, .jgig, .jgi

## Caching

With DSA, caching is turned off by default on the CDN, even when the origin includes cache-control/expires headers in the response. This default is turned off because DSA is typically used for dynamic assets that should not be cached since they are unique to each client, and turning on caching by default can break this behavior.

If you have a website with a mix of static and dynamic assets, it is best to take a hybrid approach to get the best performance. 

If you are using ADN with Verizon Premium, you can turn caching back on for specific cases using the Rules Engine.  

An alternative is to use two CDN endpoints. One with DSA to deliver dynamic assets, and another endpoint with a static optimization type, such as general web delivery, to delivery cacheable assets. In order to accomplish this alternative, you will modify your webpage URLs to link directly to the asset on the CDN endpoint you plan to use. 

For example: 
`mydynamic.azureedge.net/index.html` is a dynamic page and is loaded from the DSA endpoint.  The html page references multiple static assets such as JavaScript libraries or images that are loaded from the static CDN endpoint, such as `mystatic.azureedge.net/banner.jpg` and `mystatic.azureedge.net/scripts.js`. 

You can find an example [here](https://docs.microsoft.com/azure/cdn/cdn-cloud-service-with-cdn#controller) on how to use controllers in an ASP.NET web application to serve content through a specific CDN URL.




