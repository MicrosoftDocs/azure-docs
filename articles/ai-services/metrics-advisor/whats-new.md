---
title: Metrics Advisor what's new
titleSuffix: Azure AI services
description: Learn about what is new with Metrics Advisor
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: whats-new
ms.date: 12/16/2022
ms.author: mbullwin
---

# Metrics Advisor: what's new in the docs

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Welcome! This page covers what's new in the Metrics Advisor docs. Check back every month for information on service changes, doc additions and updates this month.

## December 2022

**Metrics Advisor new portal experience** has been released in preview! [Metrics Advisor Studio](https://metricsadvisor.appliedai.azure.com/) is designed to align the look and feel with the Azure AI services studio experiences with better usability and significant accessibility improvements. Both the classic portal and the new portal will be available for a period of time, until we officially retire the classic portal.

We **strongly encourage** you to try out the new experience and share your feedback through the smiley face on the top banner.

## May 2022

 **Detection configuration auto-tuning** has been released. This feature enables you to customize the service to better surface and personalize anomalies. Instead of the traditional way of setting configurations for each time series or a group of time series. A guided experience is provided to capture your detection preferences, such as the level of sensitivity, and the types of anomaly patterns, which allows you to tailor the model to your own needs on the back end. Those preferences can then be applied to all the time series you're monitoring. This allows you to reduce configuration costs while achieving better detection results.

Check out [this article](how-tos/configure-metrics.md#tune-the-detection-configuration) to learn how to take advantage of the new feature.  

## SDK updates

If you want to learn about the latest updates to Metrics Advisor client SDKs see: 

* [.NET SDK change log](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/CHANGELOG.md)
* [Java SDK change log](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/CHANGELOG.md)
* [Python SDK change log](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/CHANGELOG.md)
* [JavaScript SDK change log](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/metricsadvisor/ai-metrics-advisor/CHANGELOG.md)

## June 2021

### New articles

* [Tutorial: Write a valid query to onboard metrics data](tutorials/write-a-valid-query.md)
* [Tutorial: Enable anomaly notification in Metrics Advisor](tutorials/enable-anomaly-notification.md)

### Updated articles

* [Updated metrics onboarding flow](how-tos/onboard-your-data.md)
* [Enriched guidance when adding data feeds from different sources](data-feeds-from-different-sources.md)
* [Updated new notification channel using Microsoft Teams](how-tos/alerts.md#teams-hook)
* [Updated incident diagnostic experience](how-tos/diagnose-an-incident.md)

## October 2020

### New articles

* [Quickstarts for Metrics Advisor client SDKs for .NET, Java, Python, and JavaScript](quickstarts/rest-api-and-client-library.md)

### Updated articles

* [Update on how Metric Advisor builds an incident tree for multi-dimensional metrics](./faq.yml)
