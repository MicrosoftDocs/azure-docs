---
title: Real User Measurements in Azure Traffic Manager
description: In this introduction, learn how Azure Traffic Manager Real User Measurements work.
services: traffic-manager
documentationcenter: traffic-manager
author: rohinkoul
ms.service: traffic-manager
ms.devlang: na
ms.topic: article 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 03/16/2018
ms.author: rohink
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

## FAQs

* [What are the benefits of using Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#what-are-the-benefits-of-using-real-user-measurements)

* [Can I use Real User Measurements with non-Azure regions?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-use-real-user-measurements-with-non-azure-regions)

* [Which routing method benefits from Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#which-routing-method-benefits-from-real-user-measurements)

* [Do I need to enable Real User Measurements each profile separately?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#do-i-need-to-enable-real-user-measurements-each-profile-separately)

* [How do I turn off Real User Measurements for my subscription?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-do-i-turn-off-real-user-measurements-for-my-subscription)

* [Can I use Real User Measurements with client applications other than web pages?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-use-real-user-measurements-with-client-applications-other-than-web-pages)

* [How many measurements are made each time my Real User Measurements enabled web page is rendered?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-many-measurements-are-made-each-time-my-real-user-measurements-enabled-web-page-is-rendered)

* [Is there a delay before Real User Measurements script runs in my webpage?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#is-there-a-delay-before-real-user-measurements-script-runs-in-my-webpage)

* [Can I use Real User Measurements with only the Azure regions I want to measure?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-use-real-user-measurements-with-only-the-azure-regions-i-want-to-measure)

* [Can I limit the number of measurements made to a specific number?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-limit-the-number-of-measurements-made-to-a-specific-number)

* [Can I see the measurements taken by my client application as part of Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-see-the-measurements-taken-by-my-client-application-as-part-of-real-user-measurements)

* [Can I modify the measurement script provided by Traffic Manager?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-i-modify-the-measurement-script-provided-by-traffic-manager)

* [Will it be possible for others to see the key I use with Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#will-it-be-possible-for-others-to-see-the-key-i-use-with-real-user-measurements)

* [Can others abuse my RUM key?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-others-abuse-my-rum-key)

* [Do I need to put the measurement JavaScript in all my web pages?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#do-i-need-to-put-the-measurement-javascript-in-all-my-web-pages)

* [Can information about my end users be identified by Traffic Manager if I use Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#can-information-about-my-end-users-be-identified-by-traffic-manager-if-i-use-real-user-measurements)

* [Does the webpage measuring Real User Measurements need to be using Traffic Manager for routing?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#does-the-webpage-measuring-real-user-measurements-need-to-be-using-traffic-manager-for-routing)

* [Do I need to host any service on Azure regions to use with Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#do-i-need-to-host-any-service-on-azure-regions-to-use-with-real-user-measurements)

* [Will my Azure bandwidth usage increase when I use Real User Measurements?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#will-my-azure-bandwidth-usage-increase-when-i-use-real-user-measurements)

## Next steps
- Learn how to use [Real User Measurements with web pages](traffic-manager-create-rum-web-pages.md)
- Learn [how Traffic Manager works](traffic-manager-overview.md)
- Learn more about [Mobile Center](https://docs.microsoft.com/mobile-center/)
- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager
- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile.md)

