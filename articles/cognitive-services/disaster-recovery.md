---
title: Disaster recovery with cross-region support
titleSuffix: Azure Cognitive Services
description: This article provides instructions on how to use the cross-region feature to recover your Cognitive Service resources in the event of a network outage.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: how-to
ms.date: 01/27/2023
ms.author: pafarley
---

# Cross–region disaster recovery  

One of the first decisions every Cognitive Service customer makes is which region to create their resource in. The choice of region provides customers with the benefits of regional compliance by enforcing data residency requirements. Cognitive Services is available in [multiple geographies](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=cognitive-services) to ensure customers across the world are supported.  

It's rare, but possible, to encounter a network issue that affects an entire region. If your solution needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. Both approaches require at least two resources in different regions and the ability to sync data between them.

## Feature overview 

The cross-region disaster recovery feature, also known as Single Resource Multiple Region (SRMR), enables this scenario by allowing you to distribute traffic or copy custom models to multiple resources which can exist in any supported geography.

## SRMR business scenarios 

* To ensure high availability of your application, each Cognitive Service supports a flexible recovery region option that allows you to choose from a list of supported regions. 
* Customers with globally distributed end users can deploy resources in multiple regions to optimize the latency of their applications.

## Routing profiles

Azure Traffic Manager routes requests among the selected regions. The SRMR currently supports [Priority](../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method), [Performance](../traffic-manager/traffic-manager-routing-methods.md#performance-traffic-routing-method) and [Weighted](../traffic-manager/traffic-manager-routing-methods.md#weighted-traffic-routing-method) profiles and is currently available for the following services:  

* [Computer Vision](./computer-vision/overview.md)
* [Immersive Reader](../applied-ai-services/immersive-reader/overview.md)
* [Univariate Anomaly Detector](./anomaly-detector/overview.md)

> [!NOTE]
> SRMR is not supported for multi-service resources or free tier resources. 

If you use Priority or Weighted traffic manager profiles, your configuration will behave according to the [Traffic Manager documentation](../traffic-manager/traffic-manager-routing-methods.md).  

## Enable SRMR  

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your resource's page.
1. Under the **Resource Management** section on the left pane, select the Regions tab and choose a routing method.
   :::image type="content" source="media/disaster-recovery/routing-method.png" alt-text="Screenshot of the routing method select menu in the Azure portal." lightbox="media/disaster-recovery/routing-method.png":::
1. Select the **Add Region** link.
1. On the **Add Region** pop-up screen, set up additional regions for your resources.
   :::image type="content" source="media/disaster-recovery/add-regions.png" alt-text="Screenshot of the Add Region popup in the Azure portal." lightbox="media/disaster-recovery/add-regions.png":::
1. Save your changes. 

## See also
* [Create a new resource using the Azure portal](cognitive-services-apis-create-account.md)
* [Create a new resource using the Azure CLI](cognitive-services-apis-create-account-cli.md)
* [Create a new resource using the client library](cognitive-services-apis-create-account-client-library.md)
* [Create a new resource using an ARM template](create-account-resource-manager-template.md)