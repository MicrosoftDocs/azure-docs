---
title: Traffic View in Azure Traffic Manager
description: In this introduction, learn how Traffic manager Traffic view works.
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

# Traffic Manager Traffic View

Traffic Manager provides you with DNS level routing so that your end users are directed to healthy endpoints based on the routing method specified when you created the profile. Traffic View provides Traffic Manager with a view of your user bases (at a DNS resolver granularity level) and their traffic pattern. When you enable Traffic View, this information is processed to provide you with actionable insights. 

By using Traffic View, you can:
- understand where your user bases are located (up to a local DNS resolver level granularity).
- view the volume of traffic (observed as DNS queries handled by Azure Traffic Manager) originating from these regions.
- get insights into what is the representative latency experienced by these users.
- deep dive into the specific traffic patterns from each of these user bases to Azure regions where you have endpoints. 

For example, you can use Traffic View to understand which regions have a large number of traffic but suffer from higher latencies. Next, you can use this information to plan your footprint expansion to new Azure regions so that these users can have a lower latency experience.

## How Traffic View works

Traffic View works by having Traffic Manager look at the incoming queries received in the past seven days against a profile that has this feature enabled. From the incoming queries information, Traffic View extracts the source IP of the DNS resolver that is used as a representation of the location of the users. These are then grouped together at a DNS resolver level granularity to create user base regions by using the geographic information of IP addresses maintained by Traffic Manager. Traffic Manager then looks at the Azure regions to which the query was routed and constructs a traffic flow map for users from those regions.  
In the next step, Traffic Manager correlates the user base region to Azure region mapping with the network intelligence latency tables that it maintains for different end-user networks to understand the average latency experienced by users from those regions when connecting to Azure regions. All these calculations are then combined at a per local DNS resolver IP level before it is presented to you. You can consume the information in various ways.

The frequency of Traffic view data update depends on multiple internal service variables. However, the data is usually updated once every 24 hours.

>[!NOTE]
>The latency described in Traffic View is a representative latency between the end user and the Azure regions to which they had connected to, and is not the DNS lookup latency. Traffic View makes a best effort estimate of the latency between the local DNS resolver and the Azure region the query was routed to, if there is insufficient data available then the latency returned will be null. 

## Visual overview

When you navigate to the **Traffic View** section in your Traffic Manager page, you are presented with a geographical map with an overlay of Traffic View insights. The map provides information about the user base and endpoints for your Traffic Manager profile.

![Traffic Manager Traffic View Geographic view][1]

### User base information

For those local DNS resolvers for which location information is available, they are shown in the map. The color of the DNS resolver denotes the average latency experienced by end users who used that DNS resolver for their Traffic Manager queries.

If you hover over a DNS resolver location in the map, it shows:
- the IP address of the DNS resolver
- the volume of DNS query traffic seen by Traffic Manager from it
- the endpoints to which traffic from the DNS resolver was routed, as a line between the endpoint and the DNS resolver 
- the average latency from that location to the endpoint, represented as the color of the line connecting them

### Endpoint information

The Azure regions in which the endpoints reside are shown as blue dots in the map. If your endpoint is external and doesn’t have an Azure region mapped to it, it is shown at the top of the map. Click on any endpoint to see the different locations (based on the DNS resolver used) from where traffic was directed to that endpoint. The connections are shown as a line between the endpoint and the DNS resolver location and are colored according to the representative latency between that pair. In addition, you can see the name of the endpoint, the Azure region in which it runs, and the total volume of requests that were directed to it by this Traffic Manager profile.


## Tabular listing and raw data download

You can view the Traffic View data in a tabular format in Azure portal. There is an entry for each DNS resolver IP / endpoint pair that shows the IP address of the DNS resolver, the name and geographical location of the Azure region in which the endpoint is located (if available), the volume of requests associated with that DNS resolver to that endpoint, and the representative latency associated with end users using that DNS (where available). You can also download the Traffic View data as a CSV file that can be used as a part of an analytics workflow of your choice.

## Billing

When you use Traffic View, you are billed based on the number of data points used to create the insights presented. Currently, the only data point type used is the queries received against your Traffic Manager profile. For more details on the pricing, visit the [Traffic Manager pricing page](https://azure.microsoft.com/pricing/details/traffic-manager/).

## FAQs

* [What does Traffic View do?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#what-does-traffic-view-do)

* [How can I benefit from using Traffic View?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-can-i-benefit-from-using-traffic-view)

* [How is Traffic View different from the Traffic Manager metrics available through Azure monitor?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-is-traffic-view-different-from-the-traffic-manager-metrics-available-through-azure-monitor)

* [Does Traffic View use EDNS Client Subnet information?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#does-traffic-view-use-edns-client-subnet-information)

* [How many days of data does Traffic View use?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-many-days-of-data-does-traffic-view-use)

* [How does Traffic View handle external endpoints?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-does-traffic-view-handle-external-endpoints)

* [Do I need to enable Traffic View for each profile in my subscription?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#do-i-need-to-enable-traffic-view-for-each-profile-in-my-subscription)

* [How can I turn off Traffic View?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-can-i-turn-off-traffic-view)

* [How does Traffic View billing work?](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-faqs#how-does-traffic-view-billing-work)

## Next steps

- Learn [how Traffic Manager works](traffic-manager-overview.md)
- Learn more about the [traffic-routing methods](traffic-manager-routing-methods.md) supported by Traffic Manager
- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile.md)

<!--Image references-->
[1]: ./media/traffic-manager-traffic-view-overview/trafficview.png