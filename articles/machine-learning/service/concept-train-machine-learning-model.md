---
title: Model training methods
titleSuffix: Azure Machine Learning service
description: Learn the different methods you can use to train a machine learning model with the Azure Machine Learning service. Estimators provide an easy way to work with popular frameworks like Scikit-learn, TensorFlow, Keras, PyTorch, and Chainer. Machine Learning pipelines make it easy to schedule unattended runs, use heterogenous compute environments, and reuse parts of your workflow. And run configurations provide granular control over the compute targets that the training process runs on.
services: machine-learning
ms.service: machine-learning
author: Blackmist
ms.author: larryfr
ms.subservice: core
ms.topic: conceptual
ms.date: 09/18/2019
---

# Train machine learning models with Azure Machine Learning

Azure Machine Learning service provides several ways to train your models. Use the following list to determine which training method is right for you:

+ **Run configuration**: A low-level method of training, which provides more flexibility and control over the training process.

+ **Estimator**: A high-level abstraction that makes it easier to use popular machine learning frameworks.

+ **Machine learning pipeline**: Optimizes your workflow with speed, portability, and reusability.

    > [!TIP]
    > Machine learning pipelines can use run configuration or estimators for training models.

Each of these training methods can use different types of compute resources for training. Collectively, these resources are referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.

## Run configuration

A __run configuration__ defines the environment needed to run your training script. Azure Machine Learning uses the run configuration to configure the training environment where your script runs.

You may start with a run configuration for your local computer, and then switch to one for a cloud-based compute target as needed. Without having to change your training script for the new environment.

For more information on using run configurations, see [Set up and use compute targets for model training](how-to-set-up-training-targets.md).

## Estimator

To make it easier to train a model using popular frameworks, the Azure Machine Learning SDK provides __estimators__ for the following frameworks:

+ Scikit-learn
+ TensorFlow
+ Keras
+ PyTorch
+ Chainer

There is also a generic estimator class that can be used for any framework.

For more information on using estimators, see [Create estimators in training](how-to-train-ml-models.md).

## Machine learning pipeline

The key features of machine learning pipelines are:

+ Unattended runs: Schedule steps to run in parallel or in sequence in a reliable and unattended manner. Perfect for long running tasks such as data preparation or long running training jobs.
+ Heterogenous compute: Use multiple ML pipelines that are reliably coordinated across heterogeneous and scalable compute resources and storage locations.
+ Reusability: Create ML pipeline templates for specific scenarios, such as training or batch scoring. Publish the pipelines as a REST endpoint and trigger via REST calls.
+ Tracking and versioning: ML pipelines can explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity.
+ Collaboration: ML pipelines allow data scientists to collaborate across all areas of the machine learning design process, while being able to concurrently work on pipeline steps.

> [!TIP]
> Machine learning pipelines can use run configuration or estimators for training models.

Machine learning pipelines are constructed from multiple steps, which are distinct computational units in the pipeline. Each step can run independently, and use isolated compute resources. Multiple data scientists can work on the same pipeline at the same time without over-taxing compute resources. It also makes it easy to use different compute types/sizes for each step.

While machine learning pipelines can train models, they can also prepare data before training and deploy models after training. One of the primary uses for pipelines is batch scoring.

For more information, see [Pipelines: Optimize machine learning workflows](concept-ml-pipelines.md).

## Next steps

Learn how to [Set up training environments](how-to-set-up-training-targets.md).