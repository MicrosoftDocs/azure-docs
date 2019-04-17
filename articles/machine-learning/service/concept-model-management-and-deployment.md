---
title: Manage, register, deploy, & monitor ML models
titleSuffix: Azure Machine Learning service
description: Learn how to use Azure Machine Learning Service to deploy, manage, and monitor your models to continuously improve them. You can deploy the models you trained with Azure Machine Learning Service, on your local machine, or from other sources.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: chris-lauren
ms.author:  clauren
ms.date: 4/17/2019
ms.custom: seodec18
---

# Manage, deploy, and monitor models with Azure Machine Learning Service

In this article, you can learn how to use Azure Machine Learning Service to deploy, manage, and monitor your models to continuously improve them. You can deploy the models you trained with Azure Machine Learning, on your local machine, or from other sources. 

The following diagram illustrates the complete deployment workflow:
[![Deployment workflow for Azure Machine Learning](media/concept-model-management-and-deployment/deployment-pipeline.png)](media/concept-model-management-and-deployment/deployment-pipeline.png#lightbox)

The deployment workflow includes the following steps:
1. **Register the model** in a registry hosted in your Azure Machine Learning Service workspace
1. **Deploy** the image as a web service in the cloud or to edge devices
1. **Monitor and collect data**
1. **Update** a deployment to use a new image.

Each step can be performed independently or as part of a single deployment command. Additionally, you can integrate deployment into a **CI/CD workflow** as illustrated in this graphic.

[!['Azure Machine Learning continuous integration/continuous deployment (CI/CD) cycle'](media/concept-model-management-and-deployment/model-ci-cd.png)](media/concept-model-management-and-deployment/model-ci-cd.png#lightbox)

## Step 1: Register model

Model registration allows you to store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.
 
Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. You can also provide additional metadata tags during registration that can be used when searching for models. The Azure Machine Learning service supports any model that can be loaded using Python 3. 

You can't delete models that are being used in an active deployment.

For more information, see the register model section of [Deploy models](how-to-deploy-and-where.md#registermodel).

For an example of registering a model stored in pickle format, see [Tutorial: Train an image classification model](tutorial-deploy-models-with-aml.md).

For information on using ONNX models, see the [ONNX and Azure Machine Learning](how-to-build-deploy-onnx.md) document.

## Step 2: Deploy model

You can deploy your models as **web services** using the following cloud deployment targets:

* Azure Container Instance
* Azure Kubernetes Service
* Azure Field Programmable Gate Arrays (FPGA)

To deploy the model as a web service, you must provide the following:

* The model or ensemble of models.
* Dependencies required to use the model. For example, a script that accepts requests and invokes the model, conda dependencies, etc.
* Deployment configuration that describes how and where to deploy the model.

Requests to the web service are automatically load balanced, and the cluster is scaled to meet spikes in demand. Telemetry from inferencing requests can be routed to the Azure Application Insights account associated with your workspace. For more information on using telemetry information, see [Enable application insights](how-to-enable-app-insights.md)

You can also deploy models as **Azure IoT Edge modules**. IoT Edge modules are deployed to hardware devices, which enables inferencing on the device.

> [!IMPORTANT]
> When deploying to FPGA or an IoT Edge module, you must also create an image from the model. The image is then deployed to the FPGA resource or IoT device.

For more information, see [Deploy models](how-to-deploy-and-where.md) and [Deploy models to FPGA](how-to-deploy-fpga-web-service.md).

## Step 3: Monitor models and collect data

An SDK for model logging and data capture is available so you can monitor input, output, and other relevant data from your model. The data is stored as a blob in the Azure Storage account for your workspace.

To use the SDK with your model, you import the SDK into your scoring script or application. You can then use the SDK to log data such as parameters, results, or input details.

If you decide to enable model data collection every time you deploy the image, the details needed to capture the data, such as the credentials to your personal blob store, are provisioned automatically.

> [!Important]
> Microsoft does not see the data you collect from your model. The data is sent directly to the Azure storage account for your workspace.

For more information, see [How to enable model data collection](how-to-enable-data-collection.md).

## Step 4: Update the deployment

Deployments must be explicitly updated. For more information, see update section of [Deploy models](how-to-deploy-and-where.md#update).

## Next steps

Learn more about [how and where you can deploy models](how-to-deploy-and-where.md) with the Azure Machine Learning service. For an example of deployment, see [Tutorial: Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md).

Learn how to create client applications and services that [Consume a model deployed as a web service](how-to-consume-web-service.md).
