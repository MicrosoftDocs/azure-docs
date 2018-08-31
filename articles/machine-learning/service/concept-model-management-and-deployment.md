---
title: Model Management and Deployment in Azure Machine Learning  | Microsoft Docs
description: Microsoft provides a full end-to-end solution to discover, manage, deploy, and monitor your machine learning models. 
services: machine-learning
author: hjerez
ms.author: hjerez
manager: cgronlun
ms.reviewer: garyericson, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: overview
ms.date: 08/28/2018
---

# Model management, deployment, and monitoring with Azure Machine Learning

The Azure Machine Learning service allows you to deploy, manage, and monitor your models to continuously improve them. You can use models you create with Azure Machine Learning, or from other sources. For example, you might deploy a model that you trained on your local computer.

Models are registered ?????????????????

## Deployment pipeline

The deployment pipeline is constructed from the following steps:

* __Model registration__: The model registry is hosted in your Azure Machine Learning workspace. Multiple versions of a model can be registered, and are tracked by version number. The models may have been created with Azure Machine Learning or created by another process. For example, training locally or on another cloud service.

* __Image registration__: Each registered model can be paired with a scoring script or application, along with any dependencies, to create an image. The image is then registered with the image registry in your workspace.

* __Deployment__: Images can be deployed as a web service in the Azure cloud or to edge devices outside the cloud.

Each step can be performed independently, or as part of a single deployment command. The following diagram illustrates the complete deployment pipeline:

![Deployment pipeline](media/concept-model-management-and-deployment/deployment-pipeline.png)

## Model registration

The model registry keeps track of all the models in your Azure Machine Learning workspace.

Models are identified by name and version. Each time you register a model with the same name as an existing one, the registry assumes that it is a new version. The version is incremented and the new model is registered under the name.

You can provide additional metadata tags when you register the model. You can use these tags when searching for models.

You cannot delete models that are being used by an image.

For more information on using the model registry, see the model registry operations reference. (LINK?)

## Image registration

Images provide the ability to reliably deploy a model, along with all components needed to use the model. An image contains the following items:

* The model
* The inferencing engine
* A scoring file or application
* Any dependencies needed to score the model

The image can also include SDK components for logging and monitoring. The SDK logs data that can be used to fine tune or retrain your model, including the input and output of the model.

All the objects used to create the image are stored in an Azure storage account in your workspace. The image is created and stored in the Azure Container Registry. You can provide additional metadata tags when creating the image, which are also stored by the image registry and can be queried to find your image.

For more information on image creation and registration, see the image creation and registration operation reference. (LINK?)

## Model logging and data capture SDK

The model logging and data capture SDK can be used to monitor input, output, and other relevant data from your model. The data is stored as a blob in the Azure Storage account for your workspace.

To use the SDK with your model, you import the SDK into your scoring script or application. You can then use the SDK to log data such as parameters, results, or input details.

> [!NOTE]
> Microsoft does not see the data you collect from your model. The data is sent directly to the Azure storage account for your workspace.

TBD - clarify language around enabling model data collection every time you deploy.


For more information on the SDK, see the model data logging and data collection SDK reference.

## Deployment

Images can be deployed into the cloud or to edge devices. The deployment process creates all the resources needed to monitor, load balance, and auto scale your model. You can also upgrade an existing deployment to use a newer image.

Deployments are also searchable. For example, you can search for all deployments of a specific model or image.

### Deployment targets

Images can be deployed to the following targets:

* Azure Container Instance
* Azure Kubernetes Service
* Project Brainwave



![Inferencing targets](media/concept-model-management-and-deployment/inferencing-targets.png)
<!--
### Cloud deployments

* aci
* aks
* GPU
* FPGA

### Edge deployments
-->