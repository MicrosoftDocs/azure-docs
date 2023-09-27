---
title: Service limits - Anomaly Detector service
titleSuffix: Azure AI services
description: Service limits for Anomaly Detector service, including Univariate Anomaly Detection and Multivariate Anomaly Detection.
services: cognitive-services
author: jr-MS
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: conceptual
ms.date: 1/31/2023
ms.author: jingruhan
ms.custom: 
---

# Anomaly Detector service quotas and limits

This article contains both a quick reference and detailed description of Azure AI Anomaly Detector service quotas and limits for all pricing tiers. It also contains some best practices to help avoid request throttling.

The quotas and limits apply to all the versions within Azure AI Anomaly Detector service.

## Univariate Anomaly Detection

|Quota<sup>1</sup>|Free (F0)|Standard (S0)|
|--|--|--|
| **All APIs per second** | 10 | 500 |

<sup>1</sup> All the quota and limit are defined for one Anomaly Detector resource.

## Multivariate Anomaly Detection

### API call per minute

|Quota<sup>1</sup>|Free (F0)<sup>2</sup>|Standard (S0)|
|--|--|--|
| **Training API per minute** | 1 | 20 |
| **Get model API per minute** | 1 | 20 |
| **Batch(async) inference API per minute** | 10 | 60 |
| **Get inference results API per minute** | 10 | 60 |
| **Last(sync) inference API per minute** | 10 | 60 |
| **List model API per minute** | 1 | 20 |
| **Delete model API per minute** | 1 | 20 |

<sup>1</sup> All quotas and limits are defined for one Anomaly Detector resource.

<sup>2</sup> For **Free (F0)** pricing tier see also monthly allowances at the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/anomaly-detector/)

### Concurrent models and inference tasks
|Quota<sup>1</sup>|Free (F0)|Standard (S0)|
|--|--|--|
| **Maximum models** *(created, running, ready, failed)*| 20 | 1000 |
| **Maximum running models** *(created, running)* | 1 | 20 |
| **Maximum running inference** *(created, running)* | 10 | 60 |

<sup>1</sup> All quotas and limits are defined for one Anomaly Detector resource. If you want to increase the limit, please contact AnomalyDetector@microsoft.com for further communication.

## How to increase the limit for your resource?

For the Standard pricing tier, this limit can be increased. Increasing the **concurrent request limit** doesn't directly affect your costs. Anomaly Detector service uses "Pay only for what you use" model. The limit defines how high the Service may scale before it starts throttle your requests.

The **concurrent request limit parameter** isn't visible via Azure portal, Command-Line tools, or API requests. To verify the current value, create an Azure Support Request.

If you would like to increase your limit, you can enable auto scaling on your resource. Follow this document to enable auto scaling on your resource [enable auto scaling](../autoscale.md). You can also submit an increase Transactions Per Second (TPS) support request.

### Have the required information ready

* Anomaly Detector resource ID

* Region

#### Retrieve resource ID and region

* Sign in to the [Azure portal](https://portal.azure.com)
* Select the Anomaly Detector Resource for which you would like to increase the transaction limit
* Select Properties (Resource Management group)
* Copy and save the values of the following fields:
  * Resource ID
  * Location (your endpoint Region)

### Create and submit support request

To request a limit increase for your resource submit a **Support Request**:

1. Sign in to the [Azure portal](https://portal.azure.com)
2. Select the Anomaly Detector Resource for which you would like to increase the limit
3. Select New support request (Support + troubleshooting group)
4. A new window will appear with auto-populated information about your Azure Subscription and Azure Resource
5. Enter Summary (like "Increase Anomaly Detector TPS limit")
6. In Problem type, select *"Quota or usage validation"*
7. Select Next: Solutions
8. Proceed further with the request creation
9. Under the Details tab enters the following in the Description field:
    * A note, that the request is about Anomaly Detector quota.
    * Provide a TPS expectation you would like to scale to meet.
    * Azure resource information you collected.
    * Complete entering the required information and select Create button in *Review + create* tab
    * Note the support request number in Azure portal notifications. You'll be contacted shortly for further processing.
