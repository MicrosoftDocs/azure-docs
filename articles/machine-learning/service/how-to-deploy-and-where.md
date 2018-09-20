---
title: Where to deploy models with Azure Machine Learning service | Microsoft Docs
description: Learn about the different ways that you can deploy your models into production using the Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 08/29/2018
---

# Deploy models with the Azure Machine Learning service

The Azure Machine Learning service provides several ways you can deploy your trained model. In this document, learn how to deploy your model as a web service in the Azure cloud, or to IoT edge devices.

You can deploy models to the following compute targets:

- Azure Container Instances (ACI)
- Azure Kubernetes Service (AKS)
- Azure IoT Edge
- Field-programmable gate array (FPGA)

Rest of this document talks about each of these options in detail.

## Azure Container Instances

Use Azure Container Instances for deploying your models as a REST API end point if one or more of the following conditions is true:
- You're looking for a quick deployment in order to score and validate your model. ACI deployment is usually finished in less than 5 minutes.
- You're looking to deploy your model in a development or test environment. ACI allows you to deploy 20 container groups per subscription. For more information, see the [Quotas and region availability for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-quotas) document.

For more information, see the [Deploy a model to Azure Container Instances](how-to-deploy-to-aci.md) document.

## Azure Kubernetes Service

For high-scale production scenarios, you can deploy your model to the Azure Kubernetes Service (AKS). You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

Creating AKS cluster is a one time process for your workspace. Once created, you can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, then you must create a new cluster the next time you need to deploy.

Deploying to AKS provides auto-scaling, logging, model data collection, and fast response times for your web services. 

The process of creating an AKS cluster takes approximately 20 minutes.

For more information, see the [Deploy a model to Azure Kubernetes Service](how-to-deploy-to-aks.md) document.

## Azure IoT Edge

With IoT devices, it is faster to perform scoring on the device instead of sending data to the cloud and waiting on a cloud-hosted model to return data. With Azure IoT Edge, you can host your model on edge devices. Deploy your model to IoT Edge if you need one or more of the following capabilities:
- Handle priority tasks locally, even without a cloud connection
- Work with generated data that is too large to pull rapidly from the cloud
- Enable real-time processing through intelligence in or near local devices
- Accommodate data privacy-related requirements 

For more information, see the [Deploy to Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/tutorial-deploy-machine-learning) document.

For more information on the IoT Edge service, see the [Azure IoT Edge documentation](https://docs.microsoft.com/azure/iot-edge/).


## Field-programmable gate arrays (FPGA)

Hardware Accelerated Models powered by Project Brainwave make it possible to achieve ultra-low latency for real-time inferencing requests. Project Brainwave accelerates deep neural networks (DNN) deployed on field-programmable gate arrays in the Azure cloud. Commonly used DNNs are available as featurizers for transfer learning or customizable with weights trained from your own data.

For more information, see the [Deploy to a FPGA](how-to-deploy-fpga-web-service.md) document.

## Next steps

To learn information on how to deploy a model to a specific compute target, see the following documents:

* [Deploy a model to Azure Container Instances](how-to-deploy-to-aci.md)
* [Deploy a model to Azure Kubernetes Service](how-to-deploy-to-aks.md)
* [Deploy a model to Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/tutorial-deploy-machine-learning)
* [Deploy a model to FPGA](how-to-deploy-fpga-web-service.md)
