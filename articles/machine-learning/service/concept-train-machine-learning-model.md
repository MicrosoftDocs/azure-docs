---
title: Model training methods
titleSuffix: Azure Machine Learning
description: Learn the different methods you can use to train a ML model with Azure Machine Learning. Estimators provide an easy way to work with popular frameworks like Scikit-learn, TensorFlow, Keras, PyTorch, and Chainer. Machine Learning pipelines make it easy to schedule unattended runs, use heterogenous compute environments, and reuse parts of your workflow. And run configurations provide granular control over the compute targets that the training process runs on.
services: machine-learning
ms.service: machine-learning
author: Blackmist
ms.author: larryfr
ms.subservice: core
ms.topic: conceptual
ms.date: 09/18/2019
---

# Train machine learning models with Azure Machine Learning

Azure Machine Learning provides several ways to train your models. Use the following list to determine which training method is right for you:

+ **No code**: The Azure Machine Learning __visual interface__ provides a way to train models using a drag and drop web-based UI.

+ **Python**: The Azure Machine Learning SDK provides several methods to train models:

    + **Script run**: Script runs are a generic way to train a model with Azure Machine Learning. Define the training environment and then submit the training job.

    + **Estimator**: Estimator classes make it easy to train models based on popular machine learning frameworks.

    + **Automated machine learning**: Automate the time consuming, iterative tasks of model development.

    + **Machine learning pipeline**: Optimizes your workflow with speed, portability, and reusability.

        > [!TIP]
        > Machine learning pipelines can use run configuration or estimators for training models.

Each of these training methods can use different types of compute resources for training. Collectively, these resources are referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.

## Visual interface

The visual interface (preview) enables you to prepare train machine learning models without writing code.

__Concepts__

+ [What is the visual interface?](ui-concept-visual-interface.md)

__Tutorials and examples__

+ [Tutorial : Predict automobile price](ui-tutorial-automobile-price-train-score.md)
+ [Regression: Predict price](ui-sample-regression-predict-automobile-price-basic.md)
+ [Classification: Predict credit risk](ui-sample-classification-predict-credit-risk-basic.md)
+ [Classification: Predict churn, appetency, and up-selling](ui-sample-classification-predict-churn.md)


## Script run

A script run uses a [run configuration](concept-azure-machine-learning-architecture.md#run-configurations) to define the environment needed to run your training script. Azure Machine Learning uses the run configuration to configure the environment on a compute target when you submit your script for a training run.

You may start with a run configuration for your local computer, and then switch to one for a cloud-based compute target as needed. When changing the compute target, you only change the run configuration you use.

For more information on using script runs, see the following articles and examples:

__How to__

* [Set up and use compute targets for model training](how-to-set-up-training-targets.md).

__Tutorials and examples__

* []

## Estimator

Estimators make it easy to train models using popular ML frameworks.

__How to__

* [Create estimators in training](how-to-train-ml-models.md)

__Tutorials and examples__

* [Tutorial: Train image classification models with MNIST data and scikit-learn using Azure Machine Learning](tutorial-train-models-with-aml.md)
* 

## Automated Machine Learning

Define the iterations, hyperparameter settings, featurization and other settings. During training, Azure Machine Learning tries different algorithms and parameters in parallel and stops once it hits the exit criteria you defined.

__Concepts__

* [What is automated machine learning?](concept-automated-ml.md)

__How to__

* [Configure automated ML experiments in Python](how-to-configure-auto-train.md)
* [Auto-train a time-series forecast model](how-to-auto-train-forecast.md)

__Tutorials and examples__

* [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md)
* [Tutorial: Use automated machine learning to predict taxi fares](tutorial-auto-train-models.md)

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