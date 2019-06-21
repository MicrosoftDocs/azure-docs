---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 05/30/2019
---

| Compute target | Usage | GPU support | FPGA support | Description |
| ----- | ----- | ----- | ----- | ----- |
| [Local&nbsp;web&nbsp;service](../articles/machine-learning/service/how-to-deploy-and-where.md#local) | Testing/debug | maybe | &nbsp; | Good for limited testing and troubleshooting. Hardware acceleration depends on using libraries in the local system.
| [Azure Kubernetes Service (AKS)](../articles/machine-learning/service/how-to-deploy-and-where.md#aks) | Real-time inference |  [yes](../articles/machine-learning/service/how-to-deploy-inferencing-gpus.md)  | [yes](../articles/machine-learning/service/how-to-deploy-fpga-web-service.md)   |Good for high-scale production deployments. Provides fast response time and autoscaling of the deployed service. Cluster autoscaling is not supported through the Azure Machine Learning SDK. To change the nodes in the AKS cluster, use the UI for your AKS cluster in the Azure portal. AKS is the only option available for the visual interface. |
| [Azure Container Instances (ACI)](../articles/machine-learning/service/how-to-deploy-and-where.md#aci) | Testing or dev | &nbsp;  | &nbsp; | Good for low scale, CPU-based workloads requiring <48-GB RAM |
| [Azure Machine Learning Compute](../articles/machine-learning/service/how-to-run-batch-predictions.md) | (Preview) Batch&nbsp;inference | yes | &nbsp;  | Run batch scoring on serverless compute. Supports normal and low-priority VMs. |
| [Azure IoT Edge](../articles/machine-learning/service/how-to-deploy-and-where.md#iotedge) | (Preview) IoT&nbsp;module |  &nbsp; | &nbsp; | Deploy & serve ML models on IoT devices. |
| [Azure Data Box Edge](../articles/databox-online/data-box-edge-overview.md)   | via IoT Edge |  &nbsp; | yes | Deploy & serve ML models on IoT devices. |
