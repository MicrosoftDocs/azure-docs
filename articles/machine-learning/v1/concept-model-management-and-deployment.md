---
title: 'MLOps: Azure Machine Learning model management v1'
titleSuffix: Azure Machine Learning
description: 'Learn about model management (MLOps) with Azure Machine Learning. Deploy, manage, track lineage, and monitor your models to continuously improve them. (v1)'
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: msakande
ms.author: mopeakande
ms.reviewer: sehan
ms.custom: UpdateFrequency5, mktng-kw-nov2021
ms.date: 08/12/2024
---

# MLOps: Model management, deployment, lineage, and monitoring with Azure Machine Learning v1

[!INCLUDE [dev v1](../includes/machine-learning-dev-v1.md)]

In this article, learn how to apply machine learning operations (MLOps) practices in Azure Machine Learning to manage the lifecycle of your models. Machine learning operations practices can improve the quality and consistency of your machine learning solutions.

> [!IMPORTANT]
> Items in this article marked as *preview* are currently in public preview. The preview version is provided without a service level agreement. We don't recommend preview features for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What is machine learning operations?

Based on [DevOps](https://azure.microsoft.com/overview/what-is-devops/) principles and practices, machine learning operations (MLOps) increases the efficiency of workflows. For example, continuous integration, delivery, and deployment. Machine learning operations apply these principles to the machine learning process with the goal of:

- Faster experimentation and development of models
- Faster deployment of models into production
- Quality assurance and end-to-end lineage tracking

## MLOps in Azure Machine Learning

Azure Machine Learning provides the following machine learning operations capabilities:

- **Create reproducible machine learning pipelines**. Machine Learning pipelines allow you to define repeatable and reusable steps for your data preparation, training, and scoring processes.
- **Create reusable software environments** for training and deploying models.
- **Register, package, and deploy models from anywhere**. You can also track associated metadata required to use the model.
- **Capture the governance data for the end-to-end machine learning lifecycle**. The logged lineage information can include who is publishing models, why changes were made, and when models were deployed or used in production.
- **Notify and alert on events in the machine learning lifecycle**. For example, experiment completion, model registration, model deployment, and data drift detection.
- **Monitor machine learning applications for operational and machine learning issues**. Compare model inputs between training and inference, explore model-specific metrics, and provide monitoring and alerts on your machine learning infrastructure.
- **Automate the end-to-end machine learning lifecycle with Azure Machine Learning and Azure Pipelines**. Using pipelines allows you to frequently update models, test new models, and continuously roll out new machine learning models alongside your other applications and services.

For more information on machine learning operations, see [Machine learning operations](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-mlops).

## Create reproducible machine learning pipelines

Use machine learning pipelines from Azure Machine Learning to stitch together all of the steps involved in your model training process.

A machine learning pipeline can contain steps from data preparation to feature extraction to hyperparameter tuning to model evaluation. For more information, see [Azure Machine Learning pipelines](../concept-ml-pipelines.md).

If you use the [Designer](concept-designer.md) to create your machine learning pipelines, select the ellipses (**...**) at the top right of the Designer page and then select **Clone**. Cloning your pipeline allows you to iterate your pipeline design without losing your old versions.  

## Create reusable software environments

Azure Machine Learning environments allow you to track and reproduce your projects' software dependencies as they evolve. Environments allow you to ensure that builds are reproducible without manual software configurations.

Environments describe the pip and Conda dependencies for your projects. Environments can be used for both training and deployment of models. For more information, see [What are Azure Machine Learning environments](../concept-environments.md).

## Register, package, and deploy models from anywhere

You can register, package, and deploy models from anywhere.

### Register and track machine learning models

Model registration allows you to store and version your models in your workspace in the Azure cloud. The model registry makes it easy to organize and keep track of your trained models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

Name and version identify registered models. Each time you register a model with the same name as an existing one, the registry increments the version. You can specify other metadata tags during registration. These tags are then used when searching for a model. Azure Machine Learning supports any model that can be loaded using Python 3.5.2 or higher.

> [!TIP]
> You can also register models trained outside Azure Machine Learning.

You can't delete a registered model that is being used in an active deployment. For more information, see [Register the model](how-to-deploy-and-where.md#registermodel).

> [!IMPORTANT]
> When you use the filter by `Tags` option on the **Models** page of Azure Machine Learning Studio, instead of using `TagName : TagValue` you should use `TagName=TagValue` (without space).

### Package and debug models

Before deploying a model into production, it's packaged into a Docker image. In most cases, image creation happens automatically in the background during deployment. You can manually specify the image.

If you run into problems with the deployment, you can deploy on your local development environment for troubleshooting and debugging.

For more information, see [Deploy machine learning models to Azure](how-to-deploy-and-where.md#registermodel) and [Troubleshooting remote model deployment](how-to-troubleshoot-deployment.md).

### Convert and optimize models

Converting your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) might improve performance. On average, converting to ONNX can yield a 2x performance increase.

For more information, see [ONNX and Azure Machine Learning](../concept-onnx.md).

### Use models

Trained machine learning models are deployed as web services in the cloud or locally. Deployments use CPU or GPU for inferencing. You can also use models from Power BI.

When you use a model as a web service, provide the following items:

- The models that are used to score data submitted to the service or device.
- An entry script. This script accepts requests, uses the models to score the data, and return a response.
- An Azure Machine Learning environment that describes the Pip and Conda dependencies that the models requires an entry script.
- Any other assets such as text or data that the models require and entry script.

You also provide the configuration of the target deployment platform. For example, the virtual machine family type, available memory, and number of cores when deploying to Azure Kubernetes Service.

When the image is created, components required by Azure Machine Learning are also added. For example, assets needed to run the web service.

#### Batch scoring

Batch scoring is supported through machine learning pipelines. For more information, see [Tutorial: Build an Azure Machine Learning pipeline for image classification](https://learn.microsoft.com/en-us/azure/machine-learning/tutorial-pipeline-python-sdk).

#### Real-time web services

You can use your models in **web services** with the following compute targets:

- Azure Container Instance
- Azure Kubernetes Service
- Local development environment

To deploy the model as a web service, you must provide the following items:

- The model or ensemble of models.
- Dependencies required to use the model. For example, a script that accepts requests and invokes the model or conda dependencies.
- Deployment configuration that describes how and where to deploy the model.

For more information, see [Deploy machine learning models to Azure](how-to-deploy-and-where.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [AI with dataflows](/power-bi/service-machine-learning-integration).

## Capture the governance data required for machine learning operations

Azure Machine Learning gives you the capability to track the end-to-end audit trail of all of your machine learning assets by using metadata.

- Azure Machine Learning [integrates with Git](../concept-train-model-git-integration.md) to track information on which repository, branch, and commit your code came from.
- [Azure Machine Learning Datasets](how-to-create-register-datasets.md) help you track, profile, and version data.
- [Interpretability](../how-to-machine-learning-interpretability.md) allows you to explain your models, meet regulatory compliance, and understand how models arrive at a result for given input.
- Azure Machine Learning Run history stores a snapshot of the code, data, and computes used to train a model.
- The Azure Machine Learning Model Registry captures all of the metadata associated with your model. This metadata includes which experiment trained it, where it's being deployed, and if its deployments are healthy.
- [Integration with Azure](../how-to-use-event-grid.md) allows you to act on events in the machine learning lifecycle. For example, model registration, deployment, data drift, and training (run) events.

> [!TIP]
> Some information on models and datasets is automatically captured. You can add other information by using **tags**. When looking for registered models and datasets in your workspace, you can use tags as a filter.
>
> Associating a dataset with a registered model is an optional step. For information on referencing a dataset when registering a model, see the [Model Class](/python/api/azureml-core/azureml.core.model%28class%29) reference.

## Notify, automate, and alert on events in the machine learning lifecycle

Azure Machine Learning publishes key events to Azure Event Grid, which can be used to notify and automate on events in the machine learning lifecycle. For more information, see [Trigger applications, processes, or CI/CD workflows based on Azure Machine Learning events](../how-to-use-event-grid.md).

## Monitor for operational and machine learning issues

Monitoring enables you to understand what data is being sent to your model, and the predictions that it returns.

This information helps you understand how your model is being used. The collected input data can also be useful in training future versions of the model.

For more information, see [Collect data from models in production](how-to-enable-data-collection.md).

## Retrain your model on new data

Often, you want to validate your model, update it, or even retrain it from scratch, as you receive new information. Sometimes, receiving new data is an expected part of the domain. Other times, model performance can degrade due to changes to a particular sensor, natural data changes such as seasonal effects, or features shifting in their relation to other features. For more information, see [Detect data drift (preview) on datasets](how-to-monitor-datasets.md).

There isn't a universal answer to "How do I know if I should retrain?" but Azure Machine Learning event and monitoring tools previously discussed are good starting points for automation. Once you decide to retrain, you should:

- Preprocess your data using a repeatable, automated process
- Train your new model
- Compare the outputs of your new model to the outputs of your old model
- Use predefined criteria to choose whether to replace your old model

A theme of the above steps is that your retraining should be automated, not improvised. [Azure Machine Learning pipelines](../concept-ml-pipelines.md) are a good answer for creating workflows relating to data preparation, training, validation, and deployment. Read [Use pipeline parameters to retrain models in the designer](how-to-retrain-designer.md) to see how pipelines and the Azure Machine Learning designer fit into a retraining scenario.

## Automate the machine learning lifecycle

You can use GitHub and Azure Pipelines to create a continuous integration process that trains a model. In a typical scenario, when a Data Scientist checks a change into the Git repo for a project, the Azure Pipeline starts a training run. You can inspect the results of the run to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

The [Azure Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml) makes it easier to work with Azure Pipelines. It provides the following enhancements to Azure Pipelines:

- Enables workspace selection when defining a service connection.
- Enables release pipelines to be triggered by trained models created in a training pipeline.

For more information on using Azure Pipelines with Azure Machine Learning, see the following resources:

- [Continuous integration and deployment of machine learning models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning)
- [Azure Machine Learning MLOps](https://aka.ms/mlops) repository
- [Azure Machine Learning MLOpsPython](https://github.com/Microsoft/MLOpspython) repository

You can also use Azure Data Factory to create a data ingestion pipeline that prepares data for use with training. For more information, see [DevOps for a data ingestion pipeline](how-to-cicd-data-ingestion.md).

## Next steps

Learn more by reading and exploring the following resources:

- [Deploy machine learning models to Azure](how-to-deploy-and-where.md)
- [Tutorial: Train and deploy an image classification model with an example Jupyter Notebook](../tutorial-train-deploy-notebook.md).
- [Machine learning operations examples repo](https://github.com/microsoft/MLOps)
- [Use Azure Pipelines with Azure Machine Learning](/azure/devops/pipelines/targets/azure-machine-learning)
- [Consume an Azure Machine Learning model deployed as a web service](how-to-consume-web-service.md)
- [Artificial intelligence architecture design](/azure/architecture/ai-ml/)
- [Samples, Reference Architectures & Best Practices](https://github.com/microsoft/AI)
