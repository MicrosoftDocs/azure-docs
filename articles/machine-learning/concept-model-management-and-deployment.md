---
title: 'MLOps: ML model management'
titleSuffix: Azure Machine Learning
description: 'Learn about model management with Azure Machine Learning (MLOps). Deploy, manage, and monitor your models to continuously improve them. '  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: jpe316
ms.author:  jordane
ms.date: 03/17/2020
ms.custom: seodec18
---

# MLOps: Model management, deployment, and monitoring with Azure Machine Learning

In this article, learn about how to use Azure Machine Learning to manage the lifecycle of your models. Azure Machine Learning uses a Machine Learning Operations (MLOps) approach. MLOps improves the quality and consistency of your machine learning solutions. 

## What is MLOps?

Machine Learning Operations (MLOps) is based on [DevOps](https://azure.microsoft.com/overview/what-is-devops/) principles and practices that increase the efficiency of workflows. For example, continuous integration, delivery, and deployment. MLOps applies these principles to the machine learning process, with the goal of:

* Faster experimentation and development of models
* Faster deployment of models into production
* Quality assurance

Azure Machine Learning provides the following MLOps capabilities:

- **Create reproducible ML pipelines**. Machine Learning pipelines allow you to define repeatable and reusable steps for your data preparation, training, and scoring processes.
- **Create reusable software environments** for training and deploying models.
- **Register, package, and deploy models from anywhere**. You can also track associated metadata required to use the model.
- **Capture the governance data for the end-to-end ML lifecycle**. The logged information can include who is publishing models, why changes were made, and when models were deployed or used in production.
- **Notify and alert on events in the ML lifecycle**. For example, experiment completion, model registration, model deployment, and data drift detection.
- **Monitor ML applications for operational and ML-related issues**. Compare model inputs between training and inference, explore model-specific metrics, and provide monitoring and alerts on your ML infrastructure.
- **Automate the end-to-end ML lifecycle with Azure Machine Learning and Azure Pipelines**. Using pipelines allows you to frequently update models, test new models, and continuously roll out new ML models alongside your other applications and services.

## Create reproducible ML pipelines

Use ML pipelines from Azure Machine Learning to stitch together all of the steps involved in your model training process.

An ML pipeline can contain steps from data preparation to feature extraction to hyperparameter tuning to model evaluation. For more information, see [ML pipelines](concept-ml-pipelines.md).

If you use the [Designer](concept-designer.md) to create your ML pipelines, you may at any time click the **"..."** at the top-right of the Designer page and then select **Clone**. Cloning your pipeline allows you to iterate your pipeline design without losing your old versions.  

## Create reusable software environments

Azure Machine Learning environments allow you to track and reproduce your projects' software dependencies as they evolve. Environments allow you to ensure that builds are reproducible without manual software configurations.

Environments describe the pip and Conda dependencies for your projects, and can be used for both training and deployment of models. For more information, see [What are Azure Machine Learning environments](concept-environments.md).

## Register, package, and deploy models from anywhere

### Register and track ML models

Model registration allows you to store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. Additional metadata tags can be provided during registration. These tags are then used when searching for a model. Azure Machine Learning supports any model that can be loaded using Python 3.5.2 or higher.

> [!TIP]
> You can also register models trained outside Azure Machine Learning.

You can't delete a registered model that is being used in an active deployment.
For more information, see the register model section of [Deploy models](how-to-deploy-and-where.md#registermodel).

### Profile models

Azure Machine Learning can help you understand the CPU and memory requirements of the service that will be created when you deploy your model. Profiling tests the service that runs your model and returns information such as the CPU usage, memory usage, and response latency. It also provides a CPU and memory recommendation based on the resource usage.
For more information, see the profiling section of [Deploy models](how-to-deploy-and-where.md#profilemodel).

### Package and debug models

Before deploying a model into production, it is packaged into a Docker image. In most cases, image creation happens automatically in the background during deployment. You can manually specify the image.

If you run into problems with the deployment, you can deploy on your local development environment for troubleshooting and debugging.

For more information, see [Deploy models](how-to-deploy-and-where.md#registermodel) and [Troubleshooting deployments](how-to-troubleshoot-deployment.md).

### Convert and optimize models

Converting your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) may improve performance. On average, converting to ONNX can yield a 2x performance increase.

For more information on ONNX with Azure Machine Learning, see the [Create and accelerate ML models](concept-onnx.md) article.

### Use models

Trained machine learning models are deployed as web services in the cloud or locally. You can also deploy models to Azure IoT Edge devices. Deployments use CPU, GPU, or field-programmable gate arrays (FPGA) for inferencing. You can also use models from Power BI.

When using a model as a web service or IoT Edge device, you provide the following items:

* The model(s) that are used to score data submitted to the service/device.
* An entry script. This script accepts requests, uses the model(s) to score the data, and return a response.
* An Azure Machine Learning environment that describes the pip and Conda dependencies required by the model(s) and entry script.
* Any additional assets such as text, data, etc. that are required by the model(s) and entry script.

You also provide the configuration of the target deployment platform. For example, the VM family type, available memory, and number of cores when deploying to Azure Kubernetes Service.

When the image is created, components required by Azure Machine Learning are also added. For example, assets needed to run the web service and interact with IoT Edge.

#### Batch scoring
Batch scoring is supported through ML pipelines. For more information, see [Batch predictions on big data](how-to-use-parallel-run-step.md).

#### Real-time web services

You can use your models in **web services** with the following compute targets:

* Azure Container Instance
* Azure Kubernetes Service
* Local development environment

To deploy the model as a web service, you must provide the following items:

* The model or ensemble of models.
* Dependencies required to use the model. For example, a script that accepts requests and invokes the model, conda dependencies, etc.
* Deployment configuration that describes how and where to deploy the model.

For more information, see [Deploy models](how-to-deploy-and-where.md).

#### Controlled rollout

When deploying to Azure Kubernetes Service, you can use controlled rollout to enable the following scenarios:

* Create multiple versions of an endpoint for a deployment
* Perform A/B testing by routing traffic to different versions of the endpoint.
* Switch between endpoint versions by updating the traffic percentage in endpoint configuration.

For more information, see [Controlled rollout of ML models](how-to-deploy-azure-kubernetes-service.md#deploy-models-to-aks-using-controlled-rollout-preview).

#### IoT Edge devices

You can use models with IoT devices through **Azure IoT Edge modules**. IoT Edge modules are deployed to a hardware device, which enables inference, or model scoring, on the device.

For more information, see [Deploy models](how-to-deploy-and-where.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [Azure Machine Learning integration in Power BI (preview)](https://docs.microsoft.com/power-bi/service-machine-learning-integration).

## Capture the governance data required for capturing the end-to-end ML lifecycle

Azure ML gives you the capability to track the end-to-end audit trail of all of your ML assets by using metadata.

- Azure ML [integrates with Git](how-to-set-up-training-targets.md#gitintegration) to track information on which repository / branch / commit your code came from.
- [Azure ML Datasets](how-to-create-register-datasets.md) help you track, profile, and version data.
- [Interpretability](how-to-machine-learning-interpretability.md) allows you to explain your models, meet regulatory compliance, and understand how models arrive at a result for given input.
- Azure ML Run history stores a snapshot of the code, data, and computes used to train a model.
- The Azure ML Model Registry captures all of the metadata associated with your model (which experiment trained it, where it is being deployed, if its deployments are healthy).
- [Integration with Azure](how-to-use-event-grid.md)  allows you to act on events in the ML lifecycle. For example, model registration, deployment, data drift, and training (run) events.

> [!TIP]
> While some information on models and datasets is automatically captured, you can add additional information by using __tags__. When looking for registered models and datasets in your workspace, you can use tags as a filter.
>
> Associating a dataset with a registered model is an optional step. For information on referencing a dataset when registering a model, see the [Model](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model(class)?view=azure-ml-py) class reference.


## Notify, automate, and alert on events in the ML lifecycle
Azure ML publishes key events to Azure EventGrid, which can be used to notify and automate on events in the ML lifecycle. For more information, please see [this document](how-to-use-event-grid.md).


## Monitor for operational & ML issues

Monitoring enables you to understand what data is being sent to your model, and the predictions that it returns.

This information helps you understand how your model is being used. The collected input data may also be useful in training future versions of the model.

For more information, see [How to enable model data collection](how-to-enable-data-collection.md).

## Retrain your model on new data

Often, you'll want to validate your model, update it, or even retrain it from scratch, as you receive new information. Sometimes, receiving new data is an expected part of the domain. Other times, as discussed in [Detect data drift (preview) on datasets](how-to-monitor-datasets.md), model performance can degrade in the face of such things as changes to a particular sensor, natural data changes such as seasonal effects, or features shifting in their relation to other features. 

There is no universal answer to "How do I know if I should retrain?" but Azure ML event and monitoring tools previously discussed are good starting points for automation. Once you have decided to retrain, you should: 

- Preprocess your data using a repeatable, automated process
- Train your new model
- Compare the outputs of your new model to those of your old model
- Use predefined criteria to choose whether to replace your old model 

A theme of the above steps is that your retraining should be automated, not ad hoc. [Azure Machine Learning pipelines](concept-ml-pipelines.md) are a good answer for creating workflows relating to data preparation, training, validation, and deployment. Read [Retrain models with Azure Machine Learning designer (preview)](how-to-retrain-designer.md) to see how pipelines and the Azure Machine Learning designer fit into a retraining scenario. 

## Automate the ML lifecycle 

You can use GitHub and Azure Pipelines to create a continuous integration process that trains a model. In a typical scenario, when a Data Scientist checks a change into the Git repo for a project, the Azure Pipeline will start a training run. The results of the run can then be inspected to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

The [Azure Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml) makes it easier to work with Azure Pipelines. It provides the following enhancements to Azure Pipelines:

* Enables workspace selection when defining a service connection.
* Enables release pipelines to be triggered by trained models created in a training pipeline.

For more information on using Azure Pipelines with Azure Machine Learning, see the following links:

* [Continuous integration and deployment of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning) 
* [Azure Machine Learning MLOps](https://aka.ms/mlops) repository.
* [Azure Machine Learning MLOpsPython](https://github.com/Microsoft/MLOpspython) repository.

You can also use Azure Data Factory to create a data ingestion pipeline that prepares data for use with training. For more information, see [Data ingestion pipeline](how-to-cicd-data-ingestion.md).

## Next steps

Learn more by reading and exploring the following resources:

+ [How & where to deploy models](how-to-deploy-and-where.md) with Azure Machine Learning

+ [Tutorial: Deploy an image classification model in ACI](tutorial-deploy-models-with-aml.md).

+ [End-to-end MLOps examples repo](https://github.com/microsoft/MLOps)

+ [CI/CD of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning)

+ Create clients that [consume a deployed model](how-to-consume-web-service.md)

+ [Machine learning at scale](/azure/architecture/data-guide/big-data/machine-learning-at-scale)

+ [Azure AI reference architectures & best practices rep](https://github.com/microsoft/AI)
