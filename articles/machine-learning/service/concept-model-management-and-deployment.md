---
title: 'MLOps: Manage, deploy, & monitor ML models'
titleSuffix: Azure Machine Learning service
description: 'Learn how to use Azure Machine Learning Service for MLOps: deploy, manage, and monitor your models to continuously improve them. You can deploy the models you trained with Azure Machine Learning Service, on your local machine, or from other sources.'  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: jpe316
ms.author:  jordane
ms.date: 06/24/2019
ms.custom: seodec18
---

# MLOps: Manage, deploy, and monitor models with Azure Machine Learning Service

In this article, learn about how to use Azure Machine Learning service to manage the lifecycle of your models. Azure Machine Learning uses a Machine Learning Operations (MLOps) approach, which improves the quality and consistency of your machine learning solutions. 

Azure Machine Learning Service provides the following MLOps capabilities:

- **Deploy ML projects from anywhere**
- **Monitor ML applications for operational and ML related issues** - compare model inputs between training and inference, explore model-specific metrics and provide monitoring and alerts on your ML infrastructure.
- **Capture the data required for establishing an end to end audit trail of the ML lifecycle**, including who is publishing models, why changes are being made, and when models were deployed or used in production.
- **Automate the end to end ML lifecycle with Azure Machine Learning and Azure DevOps** to frequently update models, test new models, and continuously roll out new ML models alongside your other applications and services.

To hear more on the concepts behind MLOps and how they apply to the Azure Machine Learning service, watch the following video.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE2X1GX]

## Deploy ML projects from anywhere

### Turn your training process into a reproducible pipeline
Use ML pipelines from Azure Machine Learning to stitch together all of the steps involved in your model training process, from data preparation to feature extraction to hyperparameter tuning to model evaluation.

For more information, see [ML pipelines](concept-ml-pipelines.md).

### Register and track ML models

Model registration allows you to store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.
 
Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. You can also provide additional metadata tags during registration that can be used when searching for models. The Azure Machine Learning service supports any model that can be loaded using Python 3.5.2 or higher.

> [!TIP]
> You can also register models trained outside the Azure Machine Learning service.

You can't delete a registered model that is being used in an active deployment.
For more information, see the register model section of [Deploy models](how-to-deploy-and-where.md#registermodel).

### Package and debug models

Before deploying a model into production, it is packaged into a Docker image. In most cases, image creation happens automatically in the background during deployment. For advanced scenarios, you can manually specify the image.

If you run into problems with the deployment, you can deploy on your local development environment for troubleshooting and debugging.

For more information, see [Deploy models](how-to-deploy-and-where.md#registermodel) and [Troubleshooting deployments](how-to-troubleshoot-deployment.md).

### Validate and profile models

Azure Machine Learning service can use profiling to determine the ideal CPU and memory settings to use when deploying your model. Model validation happens as part of this process, using data that you supply for the profiling process.

### Convert and optimize models

Converting your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) may improve performance. On average, converting to ONNX can yield a 2x performance increase.

For more information on ONNX with Azure Machine Learning service, see the [Create and accelerate ML models](concept-onnx.md) article.

### Use models

Trained machine learning models can be deployed as web services in the cloud or locally on your development environment. You can also deploy models to Azure IoT Edge devices. Deployments can use CPU, GPU, or field-programmable gate arrays (FPGA) for inferencing. You can also use models from Power BI.

When using a model as a web service or IoT Edge device, you provide the following items:

* The model(s) that are used to score data submitted to the service/device.
* An entry script. This script accepts requests, uses the model(s) to score the data, and return a response.
* A conda environment file that describes the dependencies required by the model(s) and entry script.
* Any additional assets such as text, data, etc. that are required by the model(s) and entry script.

These assets are packaged into a Docker image, and deployed as a web service or IoT Edge module.

Optionally, you can use the following parameters to further tune the deployment:

* Enable GPU: Used to enable GPU support in the Docker image. The image must be used on Microsoft Azure Services such as Azure Container Instances, Azure Kubernetes Service, Azure Machine Learning Compute, or Azure Virtual Machines.
* Extra docker file steps: A file that contains additional Docker steps to run when creating the Docker image.
* Base image: A custom image to use as the base image. If you do not use a custom image, the base image is provided by the Azure Machine Learning service.

You also provide the configuration of the target deployment platform. For example, the VM family type, available memory, and number of cores when deploying to Azure Kubernetes Service.

When the image is created, components required by Azure Machine Learning Service are also added. For example, assets needed to run the web service and interact with IoT Edge.

> [!NOTE]
> You cannot modify or change the web server or IoT Edge components used in the Docker image. Azure Machine Learning service uses a web server configuration and IoT Edge components that are tested and supported by Microsoft.

#### Web service

You can use your models in **web services** with the following compute targets:

* Azure Container Instance
* Azure Kubernetes Service
* Local development environment

To deploy the model as a web service, you must provide the following items:

* The model or ensemble of models.
* Dependencies required to use the model. For example, a script that accepts requests and invokes the model, conda dependencies, etc.
* Deployment configuration that describes how and where to deploy the model.

For more information, see [Deploy models](how-to-deploy-and-where.md).

#### IoT Edge devices

You can use models with IoT devices through **Azure IoT Edge modules**. IoT Edge modules are deployed to a hardware device, which enables inference, or model scoring, on the device.

For more information, see [Deploy models](how-to-deploy-and-where.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [Azure Machine Learning integration in Power BI (Preview)](https://docs.microsoft.com/power-bi/service-machine-learning-integration).


## Monitor ML applications for operational and ML related issues

Monitoring enables you to understand what data is being sent to your model, and the predictions that it returns.

This information helps you understand how your model is being used. The collected input data may also be useful in training future versions of the model.

For more information, see [How to enable model data collection](how-to-enable-data-collection.md).


## Capture an end to end audit trail of the ML lifecycle

Azure ML gives you the capability to track the end to end audit trail of all of your ML assets. Specifically:

- Azure ML integrates with Git to track information which repository / branch / commit your code came from.
- Azure ML Datasets help you track and version data.
- Azure ML Run History manages the code, data and compute used to train a model.
- The Azure ML Model Registry captures all of the metadata associated with your model (which experiment trained it, where it is being deployed, if its deployments are healthy).

## Automate the end to end ML lifecycle 

You can use GitHub and Azure Pipelines to create a continuous integration process that trains a model. In a typical scenario, when a Data Scientist checks a change into the Git repo for a project, the Azure Pipeline will start a training run. The results of the run can then be inspected to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

The [Azure Machine Learning extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.vss-services-azureml) makes it easier to work with Azure Pipelines. It provides the following enhancements to Azure Pipelines:

* Enables workspace selection when defining a service connection.
* Enables release pipelines to be triggered by trained models created in a training pipeline.

For more information on using Azure Pipelines with Azure Machine Learning, see the [Continuous integration and deployment of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning) article and the [Azure Machine Learning Service MLOps](https://aka.ms/mlops) repository.

## Next steps

Learn more about [how and where you can deploy models](how-to-deploy-and-where.md) with the Azure Machine Learning service. For an example of deployment, see [Tutorial: Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md).

Learn how to create [continuous integration and deployment of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning). 

Learn how to create client applications and services that [Consume a model deployed as a web service](how-to-consume-web-service.md).
