---
title: What's New - Anomaly Detector
description: This article is regularly updated with news about the Azure AI Anomaly Detector.
ms.service: azure-ai-anomaly-detector
ms.topic: whats-new
ms.author: mbullwin
author: mrbullwinkle
manager: nitinme
ms.date: 12/15/2022
---

# What's new in Anomaly Detector

Learn what's new in the service. These items include release notes, videos, blog posts, papers, and other types of information. Bookmark this page to keep up to date with the service.

We have also added links to some user-generated content. Those items will be marked with **[UGC]** tag. Some of them are hosted on websites that are external to Microsoft and Microsoft isn't responsible for the content there. Use discretion when you refer to these resources. Contact AnomalyDetector@microsoft.com or raise an issue on GitHub if you'd like us to remove the content.

## Release notes

### Jan 2023
* Multivariate Anomaly Detection will begin charging as of January 10th, 2023. For pricing details, see the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/anomaly-detector/).

### Dec 2022
* The following SDKs for Multivariate Anomaly Detection are updated to match with the generally available REST API.

    |SDK Package  |Sample Code  |
    |---------|---------|
    | [Python](https://pypi.org/project/azure-ai-anomalydetector/3.0.0b6/)|[sample_multivariate_detect.py](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_multivariate_detect.py)|
    | [.NET](https://www.nuget.org/packages/Azure.AI.AnomalyDetector/3.0.0-preview.6) | [Sample4_MultivariateDetect.cs](https://github.com/Azure/azure-sdk-for-net/blob/40a7d122ac99a3a8a7c62afa16898b7acf82c03d/sdk/anomalydetector/Azure.AI.AnomalyDetector/tests/samples/Sample4_MultivariateDetect.cs)|
    | [JAVA](https://search.maven.org/artifact/com.azure/azure-ai-anomalydetector/3.0.0-beta.5/jar) | [MultivariateSample.java](https://github.com/Azure/azure-sdk-for-java/blob/e845677d919d47a2c4837153306b37e5f4ecd795/sdk/anomalydetector/azure-ai-anomalydetector/src/samples/java/com/azure/ai/anomalydetector/MultivariateSample.java)|
    | [JS/TS](https://www.npmjs.com/package/@azure-rest/ai-anomaly-detector/v/1.0.0-beta.1) |[sample_multivariate_detection.ts](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/anomalydetector/ai-anomaly-detector-rest/samples-dev/sample_multivariate_detection.ts)|

* Check out this AI Show video to learn more about the GA version of Multivariate Anomaly Detection: [AI Show | Multivariate Anomaly Detection is Generally Available](/shows/ai-show/ep-70-the-latest-from-azure-multivariate-anomaly-detection).

### Nov 2022

* Multivariate Anomaly Detection is now a generally available feature in Anomaly Detector service, with a better user experience and better model performance. Learn more about [how to get started using the latest release of Multivariate Anomaly Detection](how-to/create-resource.md).

### June 2022

* New blog released: [Four sets of best practices to use Multivariate Anomaly Detector when monitoring your equipment](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/4-sets-of-best-practices-to-use-multivariate-anomaly-detector/ba-p/3490848#footerContent).

### May 2022

* New blog released: [Detect anomalies in equipment with Multivariate Anomaly Detector in Azure Databricks](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/detect-anomalies-in-equipment-with-anomaly-detector-in-azure/ba-p/3390688).

### April 2022
* Univariate Anomaly Detector is now integrated in Azure Data Explorer(ADX). Check out this [announcement blog post](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/announcing-univariate-anomaly-detector-in-azure-data-explorer/ba-p/3285400) to learn more!

### March 2022
* Anomaly Detector (univariate) available in Sweden Central.

### February 2022
* **Multivariate Anomaly Detector API has been integrated with Synapse.** Check out this [blog](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/announcing-multivariate-anomaly-detector-in-synapseml/ba-p/3122486) to learn more! 

### January 2022
* **Multivariate Anomaly Detector API v1.1-preview.1 public preview on 1/18.** In this version, Multivariate Anomaly Detector supports synchronous API for inference and added new fields in API output interpreting the correlation change of variables. 
* Univariate Anomaly Detector added new fields in API output. 

### November 2021
* Multivariate Anomaly Detector available in six more regions: UAE North, France Central, North Central US, Switzerland North, South Africa North, Jio India West. Now in total 26 regions are supported.

### September 2021
* Anomaly Detector (univariate) available in Jio India West.
* Multivariate anomaly detector APIs deployed in five more regions: East Asia, West US, Central India, Korea Central, Germany West Central.

### August 2021

* Multivariate anomaly detector APIs deployed in five more regions: West US 3, Japan East, Brazil South, Central US, Norway East. Now in total 15 regions are supported.

### July 2021

* Multivariate anomaly detector APIs deployed in four more regions: Australia East, Canada Central, North Europe, and Southeast Asia. Now in total 10 regions are supported.
* Anomaly Detector (univariate) available in West US 3 and Norway East.


### June 2021

* Multivariate anomaly detector APIs available in more regions: West US 2, West Europe, East US 2, South Central US, East US, and UK South.
* Anomaly Detector (univariate) available in Azure cloud for US Government.
* Anomaly Detector (univariate) available in Microsoft Azure operated by 21Vianet (China North 2).

### April 2021

* [IoT Edge module](https://azuremarketplace.microsoft.com/marketplace/apps/azure-cognitive-service.edge-anomaly-detector) (univariate) published.
* Anomaly Detector (univariate) available in Microsoft Azure operated by 21Vianet (China East 2).
* Multivariate anomaly detector APIs preview in selected regions (West US 2, West Europe).

### September 2020

* Anomaly Detector (univariate) generally available.

### March 2019

* Anomaly Detector announced preview with univariate anomaly detection support.

## Technical articles

* March 12, 2021 [Introducing Multivariate Anomaly Detection](https://techcommunity.microsoft.com/t5/azure-ai/introducing-multivariate-anomaly-detection/ba-p/2260679) - Technical blog on the new multivariate APIs
* September 2020 [Multivariate Time-series Anomaly Detection via Graph Attention Network](https://arxiv.org/abs/2009.02040) - Paper on multivariate anomaly detection accepted by ICDM 2020
* November 5, 2019 [Overview of SR-CNN algorithm in Azure AI Anomaly Detector](https://techcommunity.microsoft.com/t5/ai-customer-engineering-team/overview-of-sr-cnn-algorithm-in-azure-anomaly-detector/ba-p/982798) - Technical blog on SR-CNN
* June 10, 2019 [Time-Series Anomaly Detection Service at Microsoft](https://arxiv.org/abs/1906.03821) - Paper on SR-CNN accepted by KDD 2019
* April 20, 2019 [Introducing Azure AI Anomaly Detector API](https://techcommunity.microsoft.com/t5/ai-customer-engineering-team/introducing-azure-anomaly-detector-api/ba-p/490162) - Announcement blog

## Videos

* Nov 12, 2022 AI Show: [Multivariate Anomaly Detection is GA](/shows/ai-show/ep-70-the-latest-from-azure-multivariate-anomaly-detection) (Seth with Louise Han).
* May 7, 2021 [New to Anomaly Detector: Multivariate Capabilities](/shows/AI-Show/New-to-Anomaly-Detector-Multivariate-Capabilities) - AI Show on the new multivariate anomaly detector APIs with Tony Xing and Seth Juarez
* April 20, 2021 AI Show Live | Episode 11| New to Anomaly Detector: Multivariate Capabilities - AI Show live recording with Tony Xing and Seth Juarez
* May 18, 2020 [Inside Anomaly Detector](/shows/AI-Show/Inside-Anomaly-Detector) - AI Show with Qun Ying and Seth Juarez
* September 19, 2019 **[UGC]** [Detect Anomalies in Your Data with the Anomaly Detector](https://www.youtube.com/watch?v=gfb63wvjnYQ) - Video by Jon Wood
* September 3, 2019 [Anomaly detection on streaming data using Azure Databricks](/shows/AI-Show/Anomaly-detection-on-streaming-data-using-Azure-Databricks) - AI Show with Qun Ying
* August 27, 2019 [Anomaly Detector v1.0 Best Practices](/shows/AI-Show/Anomaly-Detector-v10-Best-Practices) - AI Show on univariate anomaly detection best practices with Qun Ying
* August 20, 2019 [Bring Anomaly Detector on-premises with containers support](/shows/AI-Show/Bring-Anomaly-Detector-on-premise-with-containers-support) - AI Show with Qun Ying and Seth Juarez
* August 13, 2019 [Introducing Azure AI Anomaly Detector](/shows/AI-Show/Introducing-Azure-Anomaly-Detector?WT.mc_id=ai-c9-niner) - AI Show with Qun Ying and Seth Juarez


## Service updates

[Azure update announcements for Azure AI services](https://azure.microsoft.com/updates/?product=cognitive-services)
