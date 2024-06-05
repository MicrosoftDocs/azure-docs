---
title: 'MLOps: Machine learning model management'
titleSuffix: Azure Machine Learning
description: 'Learn about model management (MLOps) with Azure Machine Learning. Deploy, manage, track lineage, and monitor your models to continuously improve them.'
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: mktng-kw-nov2021
ms.date: 02/13/2024
---

# MLOps: Model management, deployment, and monitoring with Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


In this article, learn about machine learning operations (MLOps) practices in Azure Machine Learning for the purpose of managing the lifecycle of your models. Applying MLOps practices can improve the quality and consistency of your machine learning solutions. 

## What is MLOps?

MLOps is based on [DevOps](https://azure.microsoft.com/overview/what-is-devops/) principles and practices that increase the efficiency of workflows. These principles include continuous integration, delivery, and deployment. MLOps applies these principles to the machine learning lifecycle, with the goal of:

* Faster experimentation and development of models.
* Faster deployment of models into production.
* Quality assurance and end-to-end lineage tracking.

<!-- ## MLOps capabilities -->

MLOps provides the following capabilities to the machine learning process:

- **Create reproducible machine learning pipelines.** Use machine learning pipelines to define repeatable and reusable steps for your data preparation, training, and scoring processes.
- **Create reusable software environments.** Use these environments for training and deploying models.
- **Register, package, and deploy models from anywhere.** Track associated metadata required to use a model.
- **Capture governance data for the end-to-end machine learning lifecycle.** The logged lineage information can include who is publishing models and why changes were made. It can also include when models were deployed or used in production.
- **Notify and alert on events in the machine learning lifecycle.** Events include experiment completion, model registration, model deployment, and data drift detection.
- **Monitor machine learning applications for operational and machine learning-related issues.** Compare model inputs between training and inference. Explore model-specific metrics. Provide monitoring and alerts on your machine learning infrastructure.
- **Automate the end-to-end machine learning lifecycle with machine learning and Azure pipelines.** Use pipelines to frequently test and update models. You can continually roll out new machine learning models alongside your other applications and services.

For more information on MLOps, see [Machine learning operations](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-mlops).

## Create reproducible machine learning pipelines

Use Azure Machine Learning pipelines to stitch together all the steps in your model training process. A machine learning pipeline can contain steps that include data preparation, feature extraction, hyperparameter tuning, and model evaluation. 

If you use the [Azure Machine Learning designer](concept-designer.md) to create a machine learning pipeline, you can clone the pipeline to iterate over its design without losing your old versions. To clone a pipeline at any time in the designer, go to the upper-right corner to select **...** > **Clone**.

For more information on Azure Machine Learning pipelines, see [Machine learning pipelines](concept-ml-pipelines.md).

## Create reusable software environments

By using Azure Machine Learning environments, you can track and reproduce your projects' software dependencies as they evolve. You can use environments to ensure that builds are reproducible without manual software configurations.

Environments describe the pip and conda dependencies for your projects. You can use environments for model training and deployment. For more information on environments, see [What are Azure Machine Learning environments?](concept-environments.md).

## Register, package, and deploy models from anywhere

The following sections discuss how to register, package, and deploy models.

### Register and track machine learning models

With model registration, you can store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register the files as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the component files.

You can identify registered models by name and version. Whenever you register a model with the same name as an existing model, the registry increments the version number. You can provide metadata tags during registration and use these tags when you search for a model. Azure Machine Learning supports any model that can be loaded by using Python 3.5.2 or higher.

> [!TIP]
> You can also register models trained outside Azure Machine Learning.

> [!IMPORTANT]
> * When you use the **Filter by** `Tags` option on the **Models** page of Azure Machine Learning studio, instead of using `TagName : TagValue`, use `TagName=TagValue` without spaces.
> * You can't delete a registered model that's being used in an active deployment.

For more information on how to use models in Azure Machine Learning, see [Work with models in Azure Machine Learning](./how-to-manage-models.md).

### Package and debug models

Before you deploy a model into production, it needs to be packaged into a Docker image. In most cases, image creation automatically happens in the background during deployment; however, you can manually specify the image.

It's useful to first deploy to your local development environment so that you can troubleshoot and debug before deploying to the cloud. This practice can help you avoid having problems with your deployment to Azure Machine Learning. For more information on how to resolve common deployment issues, see [How to troubleshoot online endpoints](how-to-troubleshoot-online-endpoints.md).

### Convert and optimize models

You can convert your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) to try to improve performance. Typically, converting to ONNX can double performance.

For more information on ONNX with Machine Learning, see [Create and accelerate machine learning models](concept-onnx.md).

### Deploy models

You can deploy trained machine learning models as [endpoints](concept-endpoints.md) in the cloud or locally. Deployments use CPU and GPU for inferencing.

When deploying a model as an endpoint, you need to provide the following items:

* The __model__ that is used to score data submitted to the service or device.
* An __entry script__<sup>1</sup>. This script accepts requests, uses the models to score the data, and returns a response.
* An __environment__<sup>2</sup> that describes the pip and conda dependencies required by the models and entry script.
* Any __other assets__, such as text and data that are required by the models and entry script.

You also provide the configuration of the target deployment platform. For example, the virtual machine (VM) family type, available memory, and number of cores. When the image is created, components required by Azure Machine Learning, such as assets needed to run the web service, are also added.

<sup>1,2</sup> When you deploy an MLflow model, you don't need to provide an entry script, also known as a scoring script. You also don't need to provide an environment for the deployment. For more information on deploying MLflow models, see [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md).

#### Batch scoring

Batch scoring is supported through batch endpoints. For more information on batch scoring, see [Batch endpoints](concept-endpoints-batch.md).

#### Real-time scoring

You can use your models with an online endpoint for real-time scoring. Online endpoints can use the following compute targets:

* Managed online endpoints
* Azure Kubernetes Service
* Local development environment

To deploy a model to an endpoint, you must provide the following items:

* The model or ensemble of models.
* Dependencies required to use the model. Examples are a script that accepts requests and invokes the model and conda dependencies.
* Deployment configuration that describes how and where to deploy the model.

For more information on deployment for real-time scoring, see [Deploy online endpoints](how-to-deploy-online-endpoints.md).

#### Controlled rollout for online endpoints

When deploying to an online endpoint, you can use controlled rollout to enable the following scenarios:

* Create multiple versions of an endpoint for a deployment.
* Perform A/B testing by routing traffic to different deployments within the endpoint.
* Switch between endpoint deployments by updating the traffic percentage in the endpoint configuration.

For more information on deployment using a controlled rollout, see [Perform safe rollout of new deployments for real-time inference](./how-to-safely-rollout-online-endpoints.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [Azure Machine Learning integration in Power BI](/power-bi/transform-model/dataflows/dataflows-machine-learning-integration).

## Capture the governance data required for MLOps

Azure Machine Learning gives you the capability to track the end-to-end audit trail of all your machine learning assets by using metadata. For example:

- [Azure Machine Learning data assets](how-to-create-register-datasets.md) help you track, profile, and version data.
- [Model interpretability](how-to-machine-learning-interpretability.md) allows you to explain your models, meet regulatory compliance, and understand how models arrive at a result for a given input.
- Azure Machine Learning Job history stores a snapshot of the code, data, and computes used to train a model.
- [Azure Machine Learning model registry](./how-to-manage-models.md?tabs=use-local#create-a-model-in-the-model-registry) captures all the metadata associated with your model. For example, which experiment trained the model, where the model is being deployed, and if the model's deployments are healthy.
- [Integration with Azure](how-to-use-event-grid.md) allows you to act on events, such as model registration, deployment, data drift, and training (job) events, in the machine learning lifecycle.

> [!TIP]
> While some information on models and data assets is automatically captured, you can add more information by using _tags_. When you look for registered models and data assets in your workspace, you can use tags as a filter.

## Notify, automate, and alert on events in the machine learning lifecycle

Azure Machine Learning publishes key events to Azure Event Grid, which can be used to notify and automate on events in the machine learning lifecycle. For more information on how to set up event-driven processes based on Azure Machine Learning events, see [Custom CI/CD and event-driven workflows](how-to-use-event-grid.md).

## Automate the machine learning lifecycle

You can use GitHub and [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) to create a continuous integration process that trains a model. In a typical scenario, when a data scientist checks a change into a project's Git repo, Azure Pipelines starts a training job. The results of the job can then be inspected to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

The [Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml) makes it easier to work with Azure Pipelines. The extension provides the following enhancements to Azure Pipelines:

* Enables workspace selection when you define a service connection.
* Enables release pipelines to be triggered by trained models created in a training pipeline.

For more information on using Azure Pipelines with Machine Learning, see [Use Azure Pipelines with Azure Machine Learning](how-to-devops-machine-learning.md).


## Related content

- [Set up MLOps with Azure DevOps](how-to-setup-mlops-azureml.md)
- [Learning path: End-to-end MLOps with Azure Machine Learning](/training/paths/build-first-machine-operations-workflow/)
- [CI/CD of machine learning models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning)

