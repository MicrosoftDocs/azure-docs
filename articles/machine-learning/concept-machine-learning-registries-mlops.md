---
title: Machine Learning registries
titleSuffix: Azure Machine Learning
description: Learn about Azure Machine Learning registries and their role in scaling MLOps across different environments.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: mlops
ms.author: larryfr
author: Blackmist
ms.reviewer: kritifaujdar
ms.date: 06/06/2024
ms.topic: conceptual
ms.custom: build-2023
---

# Machine Learning registries for MLOps

This article describes how Azure Machine Learning registries decouple machine learning assets from workspaces, letting you use MLOps across development, testing, and production environments. Your environments can vary based on the complexity of your IT systems. The following factors influence the number and type of environments you need:

- Security and compliance policies. Production environments might need to be isolated from development environments in terms of access controls, network architecture, and data exposure.
- Subscriptions. Development environments and production environments often use separate subscriptions for billing, budgeting, and cost management purposes.
- Regions. You might need to deploy to different Azure regions to support latency and redundancy requirements.

In the preceding scenarios, you might use different Azure Machine Learning workspaces for development, testing, and production. This configuration presents the following potential challenges for model training and deployment:

- You might need to train a model in a development workspace, but deploy it to an endpoint in a production workspace, possibly in a different Azure subscription or region. In this case, you must be able to trace back the training job. For example, if you encounter accuracy or performance issues with the production deployment, you need to analyze the metrics, logs, code, environment, and data you used to train the model.

- You might need to develop a training pipeline with test data or anonymized data in the development workspace, but retrain the model with production data in the production workspace. In this case, you might need to compare training metrics on sample vs. production data to ensure the training optimizations perform well with actual data.

## Cross-workspace MLOps with registries

A registry, much like a Git repository, decouples machine learning assets from workspaces and hosts the assets in a central location, making them available to all workspaces in your organization.

To promote models across development, test, and production environments, you can start by iteratively developing a model in the development environment. When you have a good candidate model, you can publish it to a registry. You can then deploy the model from the registry to endpoints in different workspaces.

> [!TIP]
> If you already have models registered in a workspace, you can promote the models to a registry. You can also register a model directly in a registry from the output of a training job.

To develop a pipeline in one workspace and then run it in other workspaces, start by registering the components and environments that form the building blocks of the pipeline. When you submit the pipeline job, the compute and the training data, which are unique to each workspace, determine the workspace to run in.

The following diagram shows training pipeline promotion between exploratory and development workspaces, then trained model promotion to test and production.

:::image type="content" source="./media/concept-machine-learning-registries-mlops/cross-workspace-mlops-with-registries.png" alt-text="Diagram of pipeline and model use across environments." border="false":::

## Next steps

- [Create and manage Azure Machine Learning registries](./how-to-manage-registries.md)
- [Network isolation with registries](./how-to-registry-network-isolation.md)
- [Share models, components, and environments across workspaces with registries](./how-to-share-models-pipelines-across-workspaces-with-registries.md)
