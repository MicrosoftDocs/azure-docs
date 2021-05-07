---
title: Prebuilt Docker Images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for Inferencing in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 05/07/2021
ms.topic: conceptual
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt
---

# Use Prebuilt Docker images for Inference in Azure Machine Learning (Preview)

In this article you will learn about Prebuilt Docker container images for Inferencing needs in Azure Machine Learning. 
These Docker images come pre-built with popular machine learning frameworks and Python packages.

We also provide extensibility solutions with our Prebuilt Docker images.

1. __Python Extensibility Solution__
2. __Extending Inferencing Images with a Dockerfile__

## List of Prebuilt Docker images for Inference 

* Run as non-root.

Framework | Framework Version | CPU/GPU | Pre-installed packages | MCR Path | Curated Environment
--- | --- | --- | --- | --- | --- |
TensorFlow | 1.15 | CPU | pandas==0.25.1 <br/> numpy==1.20.1 | `mcr.microsoft.com/azureml/tensorflow1.15-py3.7-inference-cpu:latest` | AzureML-TensorFlow-1.15-Inference-CPU  |
PyTorch | 1.6 | CPU | pandas==0.25.1 <br/> numpy==1.20.1 | `mcr.microsoft.com/azureml/pytorch1.6-py3.7-inference-cpu:latest` | AzureML-PyTorch-1.6-Inference-CPU |
XGBoost | 0.9 | CPU | scikit-learn==0.23.2 <br/> pandas==0.25.1 <br/> numpy==1.20.1 | `mcr.microsoft.com/azureml/xgboost0.9-py3.7-inference-cpu:latest` | AzureML-XGBoost-0.9-Inference-CPU |
Scikit-Learn | 0.24.1 | CPU | scikit-learn==0.24.1 <br/> pandas== <br/> numpy== | | |
TensorFlow | 2.4 | CPU | numpy== <br/> pandas== | | |
PyTorch | 1.7 | CPU | numpy== <br/> pandas== | | |
XGBoost | 1.4 | CPU | scikit-learn==0.24.1 </br> pandas== | | |
ONNX Runtime | 1.6 | CPU | numpy== </br> pandas== | | |
TensorFlow | 2.4 | GPU | numpy== </br> pandas == </br> CUDA==11.0.3 | | |
None | None | CPU | None | `mcr.microsoft.com/azureml/minimal-py3.7-inference-cpu:latest` | AzureML-Minimal-Inference-CPU  |

### Why should I use this feature

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 

