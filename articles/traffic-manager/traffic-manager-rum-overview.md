---
title: Real User Measurements in Azure Traffic Manager
description: Introduction to Real User Measurements in Traffic Manager
services: traffic-manager
documentationcenter: traffic-manager
author: asudbring
ms.service: traffic-manager
ms.devlang: na
ms.topic: article 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 03/16/2018
ms.author: allensu
ms.custom: 
---

# Traffic Manager Real User Measurements overview

When you set up a Traffic Manager profile to use the performance routing method, the service looks at where the DNS query requests are coming from and makes routing decisions to direct those requestors to the Azure region that gives them the lowest latency. This is accomplished by utilizing the network latency intelligence that Traffic Manager maintains for different end-user networks.

Real User Measurements enables you to measure network latency measurements to Azure regions, from the client applications your end users use, and have Traffic Manager consider that information as well when making routing decisions. By choosing to use the Real User Measurements, you can increase the accuracy of the routing for requests coming from those networks where your end users reside. 

## How Real User Measurements work

Real User Measurements work by having your client applications measure latency to Azure regions as it is seen from the end-user networks in which they are used. For example, if you have a web page that is accessed by users across different locations (for example, in the North American regions), you can use Real User Measurements with performance routing method to get them to the best Azure region in which your server application is hosted.

It starts by embedding an Azure provided JavaScript (with a unique key in it) in your web pages. Once that is done, whenever a user visits that webpage, the JavaScript queries Traffic Manager to get information about the Azure regions it should measure. The service returns a set of endpoints to the script that then measure these regions consecutively by downloading a single pixel image hosted in those Azure regions and noting the latency between the time the request was sent and the time when the first byte was received. These measurements are then reported back to the Traffic Manager service.

Over time, this happens many times and across many networks leading to Traffic Manager getting more accurate information about the latency characteristics of the networks in which your end users reside. This information starts getting to be included in the routing decisions made by Traffic Manager. As a result, it leads to increased accuracy in those decisions based on the Real User Measurements sent.

When you use Real User Measurements, you are billed based on the number of measurements sent to Traffic Manager. For more details on the pricing, visit the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).

## Next steps
- Learn how to use [Real User Measurements with web pages](traffic-manager-create-rum-web-pages.md)
- Learn [how Traffic Manager works](traffic-manager-overview.md)
- Learn more about [Mobile Center](https://docs.microsoft.com/mobile-center/)
- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager
- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile.md)

