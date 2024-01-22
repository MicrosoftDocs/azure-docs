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
ms.custom: seodec18, mktng-kw-nov2021, event-tier1-build-2022, ignite-2022
ms.date: 01/04/2023
---

# MLOps: Model management, deployment, and monitoring with Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


In this article, learn how to apply Machine Learning Operations (MLOps) practices in Azure Machine Learning for the purpose of managing the lifecycle of your models. Applying MLOps practices can improve the quality and consistency of your machine learning solutions. 

## What is MLOps?

MLOps is based on [DevOps](https://azure.microsoft.com/overview/what-is-devops/) principles and practices that increase the efficiency of workflows. Examples include continuous integration, delivery, and deployment. MLOps applies these principles to the machine learning process, with the goal of:

* Faster experimentation and development of models.
* Faster deployment of models into production.
* Quality assurance and end-to-end lineage tracking.

## MLOps in Machine Learning

Machine Learning provides the following MLOps capabilities:

- **Create reproducible machine learning pipelines.** Use machine learning pipelines to define repeatable and reusable steps for your data preparation, training, and scoring processes.
- **Create reusable software environments.** Use these environments for training and deploying models.
- **Register, package, and deploy models from anywhere.** You can also track associated metadata required to use the model.
- **Capture the governance data for the end-to-end machine learning lifecycle.** The logged lineage information can include who is publishing models and why changes were made. It can also include when models were deployed or used in production.
- **Notify and alert on events in the machine learning lifecycle.** Event examples include experiment completion, model registration, model deployment, and data drift detection.
- **Monitor machine learning applications for operational and machine learning-related issues.** Compare model inputs between training and inference. Explore model-specific metrics. Provide monitoring and alerts on your machine learning infrastructure.
- **Automate the end-to-end machine learning lifecycle with Machine Learning and Azure Pipelines.** By using pipelines, you can frequently update models. You can also test new models. You can continually roll out new machine learning models alongside your other applications and services.

For more information on MLOps, see [Machine learning DevOps](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-mlops).

## Create reproducible machine learning pipelines

Use machine learning pipelines from Machine Learning to stitch together all the steps in your model training process.

A machine learning pipeline can contain steps from data preparation to feature extraction to hyperparameter tuning to model evaluation. For more information, see [Machine learning pipelines](concept-ml-pipelines.md).

If you use the [designer](concept-designer.md) to create your machine learning pipelines, you can at any time select the **...** icon in the upper-right corner of the designer page. Then select **Clone**. When you clone your pipeline, you iterate your pipeline design without losing your old versions.

## Create reusable software environments

By using Machine Learning environments, you can track and reproduce your projects' software dependencies as they evolve. You can use environments to ensure that builds are reproducible without manual software configurations.

Environments describe the pip and conda dependencies for your projects. You can use them for training and deployment of models. For more information, see [What are Machine Learning environments?](concept-environments.md).

## Register, package, and deploy models from anywhere

The following sections discuss how to register, package, and deploy models.

### Register and track machine learning models

With model registration, you can store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that's stored in multiple files, you can register them as a single model in your Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. More metadata tags can be provided during registration. These tags are then used when you search for a model. Machine Learning supports any model that can be loaded by using Python 3.5.2 or higher.

> [!TIP]
> You can also register models trained outside Machine Learning.

> [!IMPORTANT]
> * When you use the **Filter by** `Tags` option on the **Models** page of Azure Machine Learning Studio, instead of using `TagName : TagValue`, use `TagName=TagValue` without spaces.
> * You can't delete a registered model that's being used in an active deployment.

For more information, [Work with models in Azure Machine Learning](./how-to-manage-models.md).

### Package and debug models

Before you deploy a model into production, it's packaged into a Docker image. In most cases, image creation happens automatically in the background during deployment. You can manually specify the image.

If you run into problems with the deployment, you can deploy on your local development environment for troubleshooting and debugging.

For more information, see [How to troubleshoot online endpoints](how-to-troubleshoot-online-endpoints.md).

### Convert and optimize models

Converting your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) might improve performance. On average, converting to ONNX can double performance.

For more information on ONNX with Machine Learning, see [Create and accelerate machine learning models](concept-onnx.md).

### Use models

Trained machine learning models are deployed as [endpoints](concept-endpoints.md) in the cloud or locally. Deployments use CPU, GPU for inferencing.

When deploying a model as an endpoint, you provide the following items:

* The models that are used to score data submitted to the service or device.
* An entry script. This script accepts requests, uses the models to score the data, and returns a response.
* A Machine Learning environment that describes the pip and conda dependencies required by the models and entry script.
* Any other assets such as text and data that are required by the models and entry script.

You also provide the configuration of the target deployment platform. For example, the VM family type, available memory, and number of cores. When the image is created, components required by Azure Machine Learning are also added. For example, assets needed to run the web service.

#### Batch scoring

Batch scoring is supported through batch endpoints. For more information, see [endpoints](concept-endpoints.md).

#### Online endpoints

You can use your models with an online endpoint. Online endpoints can use the following compute targets:

* Managed online endpoints
* Azure Kubernetes Service
* Local development environment

To deploy the model to an endpoint, you must provide the following items:

* The model or ensemble of models.
* Dependencies required to use the model. Examples are a script that accepts requests and invokes the model and conda dependencies.
* Deployment configuration that describes how and where to deploy the model.

For more information, see [Deploy online endpoints](how-to-deploy-online-endpoints.md).

#### Controlled rollout

When deploying to an online endpoint, you can use controlled rollout to enable the following scenarios:

* Create multiple versions of an endpoint for a deployment
* Perform A/B testing by routing traffic to different deployments within the endpoint.
* Switch between endpoint deployments by updating the traffic percentage in endpoint configuration.

For more information, see [Controlled rollout of machine learning models](./how-to-safely-rollout-online-endpoints.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [Machine Learning integration in Power BI (preview)](/power-bi/service-machine-learning-integration).

## Capture the governance data required for MLOps

Machine Learning gives you the capability to track the end-to-end audit trail of all your machine learning assets by using metadata. For example:

- [Machine Learning datasets](how-to-create-register-datasets.md) help you track, profile, and version data.
- [Interpretability](how-to-machine-learning-interpretability.md) allows you to explain your models, meet regulatory compliance, and understand how models arrive at a result for specific input.
- Machine Learning Job history stores a snapshot of the code, data, and computes used to train a model.
- The [Machine Learning Model Registry](./how-to-manage-models.md?tabs=use-local#create-a-model-in-the-model-registry) captures all the metadata associated with your model. For example, metadata includes which experiment trained it, where it's being deployed, and if its deployments are healthy.
- [Integration with Azure](how-to-use-event-grid.md) allows you to act on events in the machine learning lifecycle. Examples are model registration, deployment, data drift, and training (job) events.

> [!TIP]
> While some information on models and datasets is automatically captured, you can add more information by using _tags_. When you look for registered models and datasets in your workspace, you can use tags as a filter.

## Notify, automate, and alert on events in the machine learning lifecycle

Machine Learning publishes key events to Azure Event Grid, which can be used to notify and automate on events in the machine learning lifecycle. For more information, see [Use Event Grid](how-to-use-event-grid.md).

## Automate the machine learning lifecycle

You can use GitHub and Azure Pipelines to create a continuous integration process that trains a model. In a typical scenario, when a data scientist checks a change into the Git repo for a project, Azure Pipelines starts a training job. The results of the job can then be inspected to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

The [Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml) makes it easier to work with Azure Pipelines. It provides the following enhancements to Azure Pipelines:

* Enables workspace selection when you define a service connection.
* Enables release pipelines to be triggered by trained models created in a training pipeline.

For more information on using Azure Pipelines with Machine Learning, see:

* [Continuous integration and deployment of machine learning models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning)
* [Machine Learning MLOps](https://github.com/Azure/mlops-v2) repository


## Next steps

Learn more by reading and exploring the following resources:

+ [Set up MLOps with Azure DevOps](how-to-setup-mlops-azureml.md)
+ [Learning path: End-to-end MLOps with Azure Machine Learning](/training/paths/build-first-machine-operations-workflow/)
+ [How to deploy a model to an online endpoint](how-to-deploy-online-endpoints.md) with Machine Learning
+ [Tutorial: Train and deploy a model](tutorial-train-deploy-notebook.md)
+ [CI/CD of machine learning models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning)
+ [Machine learning at scale](/azure/architecture/data-guide/big-data/machine-learning-at-scale)
+ [Azure AI reference architectures and best practices repo](https://github.com/microsoft/AI)
