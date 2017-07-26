---
title: Recommendations API | Microsoft Docs
description: Use the Recommendations API, built with Microsoft Azure Machine Learning, to help your customer discover items in your catalog in Cognitive Services.
services: cognitive-services
author: LuisCabrer
manager: mwinkle

ms.service: cognitive-services
ms.technology: recommendations
ms.topic: article
ms.date: 07/26/2017
ms.author: luisca
---



# Recommendations

> [!NOTE] 
> The Microsoft Cognitive Services Recommendations API preview will be retired on February 15, 2018.
> Consider using the new [Recommendations Solution template](http://aka.ms/recopcs), which lets you host a recommendations 
>  engine within your own Azure subscription. It supports the core scenarios of the Recommendations API, while also giving you the freedom to deploy to any Azure region and more closely control the computational resources used to train models and serve recommendations. 
> Learn more about the Recommendations Solution template by reading [the documentation](https://github.com/Microsoft/Product-Recommendations). 


The Recommendations API built with Microsoft Azure Machine Learning helps your customer discover items in your catalog. Customer activity in your digital store is used to recommend items and to improve conversion in your digital store.

The recommendation engine may be trained by uploading data about past customer activity or by collecting data directly from your digital store. When the customer returns to your store you are able to feature recommended items from your catalog that may increase your conversion rate.

## Resources ##

[Getting Started Guide](../../../articles/cognitive-services/cognitive-services-recommendations-quick-start.md)

[Collecting Data to Train your Model](../../../articles/cognitive-services/cognitive-services-recommendations-collecting-data.md)

[Build Types and Model Quality](../../../articles/cognitive-services/cognitive-services-recommendations-buildtypes.md)

[API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0)

## Common Scenarios Supported By Recommendations

**Frequently Bought Together (FBT) Recommendations**

In this scenario, the recommendations engine recommends items that are likely to be purchased together in the same transaction with a particular item.

For instance, in the following example, customers who bought the Wedge Touch Mouse were also likely to buy at least one of the following products in the same transaction: Wedge Mobile Keyboard, the Surface VGA Adapter and Surface 2.

**Item to Item Recommendations**

A common scenario that uses this capability, is "people who visited/clicked on this item, also visited/clicked on this item."

For instance, in the following example, most people who visited the "Wedge Touch Mouse" details page also visited the pages related to other mouse devices.

**Customer to Item Recommendations**

Given a customer's prior activity, it is possible to recommend items that the customer may be interested in.

For instance, given all movies watched by a customer, it is possible to recommend additional content that may be of interest to the customer.

## Questions?
Feel free to contacts us at mlapi@microsoft.com


