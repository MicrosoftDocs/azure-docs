---
title: Recommendations API | Microsoft Docs
description: Use the Recommendations API, built with Microsoft Azure Machine Learning, to help your customer discover items in your catalog in Cognitive Services.
services: cognitive-services
author: LuisCabrer
manager: mwinkle

ms.service: cognitive-services
ms.technology: recommendations
ms.topic: article
ms.date: 06/18/2016
ms.author: luisca
---

# Recommendations

The Recommendations API built with Microsoft Azure Machine Learning helps your customer discover items in your catalog. Customer activity in your digital store is used to recommend items and to improve conversion in your digital store.

The recommendation engine may be trained by uploading data about past customer activity or by collecting data directly from your digital store. When the customer returns to your store you will be able to feature recommended items from your catalog that may increase your conversion rate.

## Resources ##

[Getting Started Guide](../../../articles/cognitive-services/cognitive-services-recommendations-quick-start.md)

[Collecting Data to Train your Model](../../../articles/cognitive-services/cognitive-services-recommendations-collecting-data.md)

[Build Types and Model Quality](../../../articles/cognitive-services/cognitive-services-recommendations-buildtypes.md)

[API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0)

## Common Scenarios Supported By Recommendations

**Frequently Bought Together (FBT) Recommendations**

In this scenario the recommendations engine will recommend items that are likely to be purchased together in the same transaction with a particular item.

For instance, in the example below, customers who bought the Wedge Touch Mouse were also likely to buy the at least one of the following product in the same transaction: Wedge Mobile Keyboard, the Surface VGA Adapter and Surface 2.

**Item to Item Recommendations**

A common scenario that uses this capability, is "people who visited/clicked on this item, also visited/clicked on this item".

For instance, in the example below, most people who visited the "Wedge Touch Mouse" details page also visited the pages related to other mouse devices.

**Customer to Item Recommendations**

Given a customer's prior activity, it is possible to recommend items that the customer may be interested in.

For instance, given all movies watched by a customer, it is possible to recommend additional content that may be of interest to the customer.

## Questions?
Feel free to contacts us at mlapi@microsoft.com


