---
title: Model training methods
titleSuffix: Azure Machine Learning
description: Learn the different methods you can use to train model with Azure Machine Learning. Estimators provide an easy way to work with popular frameworks like Scikit-learn, TensorFlow, Keras, PyTorch, and Chainer. Machine Learning pipelines make it easy to schedule unattended runs, use heterogenous compute environments, and reuse parts of your workflow. And run configurations provide granular control over the compute targets that the training process runs on.
services: machine-learning
ms.service: machine-learning
author: Blackmist
ms.author: larryfr
ms.subservice: core
ms.topic: conceptual
ms.date: 09/18/2019
---

# Train models with Azure Machine Learning

Azure Machine Learning provides several ways to train your models. Use the following list to determine which training method is right for you:

+ **Python**: With the Azure Machine Learning SDK, you define a __run configuration__ that provides the information needed to configure the training environment used to train your model. While you can manually create a run configuration (using the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py)), and use it to train your model, there are several other training methods that you should consider:

    + **Automated machine learning**: Automated machine learning allows you to train models without extensive data science or programming knowledge. For those with a data science and programming background, it provides a way to save time and resources by automating algorithm selection and hyperparameter tuning. You don't have to worry about defining a run configuration when using automated machine learning.

    + **Estimator**: Estimator classes make it easy to train models based on popular machine learning frameworks. There are estimator classes for **Scikit-learn**, **PyTorch**, **TensorFlow**, and **Chainer**. There is also a generic estimator that can be used with frameworks that do not already have a dedicated estimator class. You don't have to worry about defining a run configuration when using estimators.

    + **Machine learning pipeline**: Pipelines are not a different training method, but a way of defining a workflow using modular, reusable steps, that can include training as part of the workflow. Machine learning pipelines support using automated machine learning, estimators, and run configuration to train models.

        Since pipelines are not focused specifically on training, the reasons for using a pipeline are more varied than the other training methods. Generally, you might use a pipeline when:

        * You need to schedule unattended processes such as long running training jobs or data preparation.
        * Use multiple pipelines that are coordinated across heterogeneous compute resources and storage locations.
        * Use the pipeline as a reusable template for specific scenarios, such as training or batch scoring.
        * Track and version data sources, inputs, and outputs for your workflow.
        * Your workflow is implemented by different teams that work on specific steps independently. Steps can then be joined together in a pipeline to implement the workflow

+ **Visual interface**: The Azure Machine Learning __visual interface__ provides an easy entry-point into machine learning for building proof of concepts, or for users with little coding experience. It allows you to train models using a drag and drop web-based UI. You can use Python code as part of the design, or train models without writing any code.

+ **CLI**: The machine learning CLI is provides commands for common tasks with Azure Machine Learning. For training models, it provides commands that submit training jobs. It can submit jobs using run configurations or pipelines.

Each of these training methods can use different types of compute resources for training. Collectively, these resources are referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.

## Visual interface

The visual interface (preview) enables you to train models using a drag and drop interface in your web browser.

+ [What is the visual interface?](ui-concept-visual-interface.md)
+ [Tutorial : Predict automobile price](ui-tutorial-automobile-price-train-score.md)
+ [Regression: Predict price](how-to-ui-sample-regression-predict-automobile-price-basic.md)
+ [Classification: Predict credit risk](how-to-ui-sample-classification-predict-credit-risk-basic.md)
+ [Classification: Predict churn, appetency, and up-selling](how-to-ui-sample-classification-predict-churn.md)

## Python SDK

A generic training job with Azure Machine Learning can be defined using the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py). This is then used, along with your training script(s) to train a model on a compute target.

You may start with a run configuration for your local computer, and then switch to one for a cloud-based compute target as needed. When changing the compute target, you only change the run configuration you use. A run also logs information about the training job, such as the inputs, outputs, and logs.

* [What is a run configuration?](concept-azure-machine-learning-architecture.md#run-configurations)
* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md)
* [Examples: Jupyter Notebook examples of training models](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training)
* [How to: Set up and use compute targets for model training](how-to-set-up-training-targets.md)

### Estimator

Estimators make it easy to train models using popular ML frameworks. If you're using **Scikit-learn**, **PyTorch**, **TensorFlow**, or **Chainer**, you should consider using an estimator for training. There is also a generic estimator that can be used with frameworks that do not already have a dedicated estimator class. You don't have to worry about defining a run configuration when using estimators.

* [What are estimators?](concept-azure-machine-learning-architecture#estimators)
* [Tutorial: Train image classification models with MNIST data and scikit-learn using Azure Machine Learning](tutorial-train-models-with-aml.md)
* [Examples: Jupyter Notebook examples of using estimators](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning)
* [How to: Create estimators in training](how-to-train-ml-models.md)

### Automated Machine Learning

Define the iterations, hyperparameter settings, featurization, and other settings. During training, Azure Machine Learning tries different algorithms and parameters in parallel. Training stops once it hits the exit criteria you defined. You don't have to worry about defining a run configuration when using estimators.

> [!TIP]
> In addtion to the Python SDK, you can also use Automated ML through the [workspace landing page (preview)](https://ml.azure.com).

* [What is automated machine learning?](concept-automated-ml.md)
* [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md)
* [Tutorial: Use automated machine learning to predict taxi fares](tutorial-auto-train-models.md)
* [Examples: Jupyter Notebook examples for automated machine learning](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)
* [How to: Configure automated ML experiments in Python](how-to-configure-auto-train.md)
* [How to: Autotrain a time-series forecast model](how-to-auto-train-forecast.md)
* [How to: Create, explore and deploy automated machine learning experiments with Azure Machine Learning's workspace landing page (preview)](how-to-create-portal-experiments.md)

### Machine learning pipeline

Machine learning pipelines can use the previously mentioned training methods (run configuration, estimators, and automated machcine learning). Pipelines are more about creating a workflow, so they encompass more than just the training of models.

* [What are ML pipelines in Azure Machine Learning?](concept-ml-pipelines.md).
* [Tutorial: Use Azure Machine Learning Pipelines for batch scoring](tutorial-pipeline-batch-scoring-classification.md)
* [Examples: Jupyter Notebook examples for machine learning pipelines](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines)

## CLI

The machine learning CLI is an extension for the Azure CLI. It provides cross-platform CLI commands for working with Azure Machine Learning. Typically, you use the CLI to automate tasks, such as training a machine learning model.

* [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md)
* [MLOps on Azure](https://github.com/microsoft/MLOps)

## Next steps

Learn how to [Set up training environments](how-to-set-up-training-targets.md).
