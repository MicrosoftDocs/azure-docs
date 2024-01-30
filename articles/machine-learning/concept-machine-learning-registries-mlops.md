---
title: Machine Learning registries
titleSuffix: Azure Machine Learning
description: Learn what are Azure Machine Learning registries and how to use to for MLOps
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: mabables
author: ManojBableshwar
ms.reviewer: larryfr
ms.date: 06/14/2023
ms.topic: conceptual
ms.custom: ignite-2022, build-2023
---

# Machine Learning registries for MLOps

In this article, you'll learn how to scale MLOps across development, testing and production environments. Your environments can vary from few to many based on the complexity of your IT environment and is influenced by factors such as:

* Security and compliance policies - Do production environments need to be isolated from development environments in terms of access controls, network architecture, data exposure, etc.?
* Subscriptions - Are your development environments in one subscription and production environments in a different  subscription? Often separate subscriptions are used to account for billing, budgeting, and cost management purposes.
* Regions - Do you need to deploy to different Azure regions to support latency and redundancy requirements? 

In such scenarios, you may be using different Azure Machine Learning workspaces for development, testing and production. This configuration presents the following challenges for model training and deployment:
* You need to train a model in a development workspace but deploy it an endpoint in a production workspace, possibly in a different Azure subscription or region. In this case, you must be able to trace back the training job. For example, to analyze the metrics, logs, code, environment, and data used to train the model if you encounter accuracy or performance issues with the production deployment. 
* You need to develop a training pipeline with test data or anonymized data in the development workspace but retrain the model with production data in the production workspace. In this case, you may need to compare training metrics on sample vs production data to ensure the training optimizations are performing well with actual data. 

## Cross-workspace MLOps with registries

Registries, much like a Git repository, decouples ML assets from workspaces and hosts them in a central location, making them available to all workspaces in your organization.

If you want to promote models across environments (dev, test, prod), start by iteratively developing a model in dev. When you have a good candidate model, you can publish it to a registry. You can then deploy the model from the registry to endpoints in different workspaces. 

> [!TIP]
> If you already have models registered in a workspace, you can promote them to a registry. You can also register a model directly in a registry from the output of a training job.  

If you want to develop a pipeline in one workspace and then run it in others, start by registering the components and environments that form the building blocks of the pipeline. When you submit the pipeline job, the workspace it runs in is selected by the compute and training data, which are unique to each workspace.

The following diagram illustrates promotion of pipelines between exploratory and dev workspaces, then model promotion between dev, test, and production.

:::image type="content" source="./media/concept-machine-learning-registries-mlops/cross-workspace-mlops-with-registries.png" alt-text="Diagram of pipeline and model use across environments.":::

## Next steps

* [Create a registry](./how-to-manage-registries.md)
* [Network isolation with registries](./how-to-registry-network-isolation.md)
* [Share models, components, and environments using registries](./how-to-share-models-pipelines-across-workspaces-with-registries.md)
