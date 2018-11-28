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

The Azure Batch AI service is retiring in March. The training and testing at-scale capabilities of Batch AI are now available in [Azure Machine Learning service](../machine-learning/service/overview-what-is-azure-ml.md), which became generally available on December 4, 2018. 

Along with many other machine learning capabilities, the Azure Machine Learning service includes a cloud-based managed compute target for training, deploying, and scoring ML models. This compute target is called the [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md). 

You can interact with the Azure Machine Learning service through its [Python SDKs](../machine-learning/service/quickstart-create-workspace-with-python.md), the [Azure portal](../machine-learning/service/quickstart-get-started.md), and the CLI. 

## Batch AI support timeline

| Date | Support details |
| ---- |-----------------|
| December&nbsp;14&nbsp;2018 | Continue to use your existing Azure Batch AI subscriptions as before. However, creating new subscriptions is no longer possible and no new investments will be made to this service.  <br><br>**Migration**: support is available to existing customers wanting to migrate to the more comprehensive [Azure Machine Learning service](https://aka.ms/aml-docs). If Azure Machine Learning service doesn't meet your need where a same supported functionality exists in Batch AI, open a Batch AI whitelist request with the support team. |
| March 4 2019 | After this date, existing Batch AI subscriptions will no longer run. |

## How do I migrate?

To avoid disruptions to your applications and to benefit from the latest features, take the following steps before March 4, 2019:

1. Create an Azure Machine Learning service workspace and get started:
    + [Python based quickstart](../machine-learning/service/quickstart-create-workspace-with-python.md)
    + [Azure portal based quickstart](../machine-learning/service/quickstart-get-started.md)

1. Set up an [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md) for model training.

1. Update your scripts to use the Azure Machine Learning Compute.


## Next steps

- Read the [Azure Machine Learning service overview](../machine-learning/service/overview-what-is-azure-ml.md).

- [Configure a compute target for model training](../machine-learning/service/how-to-set-up-training-targets.md) with Azure Machine Learning service.

Review the [Azure roadmap](https://azure.microsoft.com/updates/) to learn of other  Azure service updates.
