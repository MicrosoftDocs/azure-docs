---
title: 'MLOps: Manage, deploy, & monitor ML models'
titleSuffix: Azure Machine Learning service
description: 'Learn how to use Azure Machine Learning Service for MLOps: deploy, manage, and monitor your models to continuously improve them. You can deploy the models you trained with Azure Machine Learning Service, on your local machine, or from other sources.'  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: chris-lauren
ms.author:  clauren
ms.date: 05/02/2019
ms.custom: seodec18
---

# MLOps: Manage, deploy, and monitor models with Azure Machine Learning Service

In this article, you can learn how to use Azure Machine Learning Service to deploy, manage, and monitor your models to continuously improve them. You can deploy the models you trained with Azure Machine Learning, on your local machine, or from other sources. 

The following diagram illustrates the basic deployment workflow when using Azure Machine Learning service:

[![Deployment workflow for Azure Machine Learning](media/concept-model-management-and-deployment/deployment-pipeline.png)](media/concept-model-management-and-deployment/deployment-pipeline.png#lightbox)

The MLOps / deployment workflow includes the following steps:
1. **Register the model** in a registry hosted in your Azure Machine Learning Service workspace
1. **Use** the model in a web service in the cloud, on an IoT device, or for analytics with Power BI.
1. **Monitor and collect data**
1. **Update** a deployment to use a new image.

The workflow may optionally include steps such as converting an ML model to a different format, or creating a **CI/CD workflow** to train and deploy a model when changes are checked in.

To hear more on the concepts behind MLOps and how they apply to the Azure Machine Learning service, watch the following video.

> [!VIDEO https://www.youtube.com/embed/0MaHb070H_8]

## Operationalize models

The operationalization of ML models is the process of taking an experiment and turning it into product or service used by your business or customers. The model has graduated from an experiment, and is ready to be used in production.

### Convert training to an Azure Pipeline

You can use Azure Pipelines to create a continuous integration process that trains a model. The pipeline can run the training process whenever a change is checked in to your code repository. The results of the run can then be inspected to see the performance characteristics of the trained model. You can also create a pipeline that deploys the model as a web service.

For more information on using Azure Pipelines with Azure Machine Learning, see the [Continuous integration and deployment of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning) article.

### Convert and optimize models

Converting your model to [Open Neural Network Exchange](https://onnx.ai) (ONNX) may improve performance. On average, converting to ONNX can yield a 2x performance increase.

For more information on ONNX with Azure Machine Learning service, see the [Create and accelerate ML models](concept-onnx.md) article.

### Register model

Model registration allows you to store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

> [!TIP]
> You can also register models trained outside the Azure Machine Learning service.
 
Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. You can also provide additional metadata tags during registration that can be used when searching for models. The Azure Machine Learning service supports any model that can be loaded using Python 3.5.2 or higher.

You can't delete models that are being used in an active deployment.

For more information, see the register model section of [Deploy models](how-to-deploy-and-where.md#registermodel).

For an example of registering a model stored in pickle format, see [Tutorial: Train an image classification model](tutorial-deploy-models-with-aml.md).

### Package and debug models

Before deploying a model into production, it is packaged into a Docker image. In most cases, this happens automatically in the background during deployment. For advanced scenarios you can manually specify the image.

If you run into problems with the deployment, you can deploy on your local development environment for troubleshooting and debugging.

For more information, see [Deploy models](how-to-deploy-and-where.md#registermodel) and [Troublethooting deployments](how-to-troubleshoot-deployment.md).

### Validate and profile models

Azure Machine Learning service can use profiling to determine the ideal CPU and memory settings to use when deploying your model. Model validation happens as part of this process, using data that you supply for the profiling process.

For more information, see [TBD]().

## Use models

Trained machine learning models can be deployed as web services in the cloud or locally on your development environment. You can also deploy models to Azure IoT Edge devices. Deployments can use CPU, GPU, or field-programmable gate arrays (FPGA) for inferencing. You can also use models from Power BI.

### Web service

You can use your models in **web services** with the following compute targets:

* Azure Container Instance
* Azure Kubernetes Service
* Local development environment

To deploy the model as a web service, you must provide the following:

* The model or ensemble of models.
* Dependencies required to use the model. For example, a script that accepts requests and invokes the model, conda dependencies, etc.
* Deployment configuration that describes how and where to deploy the model.

For more information, see [Deploy models](how-to-deploy-and-where.md).

### IoT Edge devices

You can use models with IoT devices through **Azure IoT Edge modules**. IoT Edge modules are deployed to hardware devices, which enables inferencing on the device.

For more information, see [Deploy models](how-to-deploy-and-where.md).

### Analytics

Microsoft Power BI supports using machine learning models for data analytics. For more information, see [Azure Machine Learning integration in Power BI (Preview)](https://docs.microsoft.com/power-bi/service-machine-learning-integration).

### Monitor and collect data

Monitoring enables you to understand what data is being sent to your model, and the predictions that it returns.

This information helps you understand how your model is being used. The collected input data may also be useful in training future versions of the model.

For more information, see [How to enable model data collection](how-to-enable-data-collection.md).

## Next steps

Learn more about [how and where you can deploy models](how-to-deploy-and-where.md) with the Azure Machine Learning service. For an example of deployment, see [Tutorial: Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md).

Learn how to create [continuous integration and deployment of ML models with Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning). 

Learn how to create client applications and services that [Consume a model deployed as a web service](how-to-consume-web-service.md).
