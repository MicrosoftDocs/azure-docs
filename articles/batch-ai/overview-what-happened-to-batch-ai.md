---
title: What's happening to Azure Batch AI? | Microsoft Docs
description: Learn about what's happening to Azure Batch AI and the Azure Machine Learning service compute option.
services: batch-ai
author: garyericson

ms.service: batch-ai
ms.topic: overview
ms.date: 12/14/2018
ms.author: garye
---

# What's happening to Azure Batch AI?

**The Azure Batch AI service is retiring in March.** The at-scale training and testing capabilities of Batch AI are now available in [Azure Machine Learning service](../machine-learning/service/overview-what-is-azure-ml.md), which became generally available on December 4, 2018.

Along with many other machine learning capabilities, the Azure Machine Learning service includes a cloud-based managed compute target for training, deploying, and scoring machine learning models. This compute target is called [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md#amlcompute). [Start migrating and using it today](#migrate). You can interact with the Azure Machine Learning service through its [Python SDKs](../machine-learning/service/quickstart-create-workspace-with-python.md) and the [Azure portal](../machine-learning/service/quickstart-get-started.md).

## Support timeline

| Date | Batch AI service support details |
| ---- |-----------------|
| December&nbsp;14&#x2c;&nbsp;2018| Continue to use your existing Azure Batch AI subscriptions as before. However, registering new subscriptions is no longer possible and no new investments will be made to this service.|
| March&nbsp;4&#x2c;&nbsp;2019 | After this date, existing Batch AI subscriptions will no longer work. |

<a name="migrate"></a>
## How do I migrate?

To avoid disruptions to your applications and to benefit from the latest features, take the following steps before March 4, 2019:

1. Create an Azure Machine Learning service workspace and get started:
    + [Python based quickstart](../machine-learning/service/quickstart-create-workspace-with-python.md)
    + [Azure portal based quickstart](../machine-learning/service/quickstart-get-started.md)

1. Set up an [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md#amlcompute) for model training.

1. Update your scripts to use the Azure Machine Learning Compute.

## Support

Support is available to existing customers wanting to migrate to the more comprehensive [Azure Machine Learning service](https://aka.ms/aml-docs).

If Azure Machine Learning service doesn't meet your need where a supported functionality exists in Batch AI service, open a Batch AI support request with the support team to whitelist your subscription. 

## Next steps

+ Read the [Azure Machine Learning service overview](../machine-learning/service/overview-what-is-azure-ml.md).

+ [Configure a compute target for model training](../machine-learning/service/how-to-set-up-training-targets.md) with Azure Machine Learning service.

+ Review the [Azure roadmap](https://azure.microsoft.com/updates/) to learn of other  Azure service updates.
