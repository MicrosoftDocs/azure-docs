---
title: Prebuilt Docker images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for inference (scoring) in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 05/25/2021
ms.topic: conceptual
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt
---

# Prebuilt Docker images for inference (Preview)

Prebuilt Docker container images for inference are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

* [Add Python packages](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use the prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md). Using this method, you can install both **Python packages and apt packages**.

> [!IMPORTANT]
> Using prebuilt docker images with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why should I use prebuilt images?

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 
* The inference process in the deployment runs as non-root.

## How can I use prebuilt images?

Refer to our sample notebook.

## List of prebuilt Docker images for inference 

Framework | Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
--- | --- | --- | --- | --- | --- |
TensorFlow </p> | 1.15 </p> 2.4 </p> 2.4 </p> | CPU </p> CPU </p> GPU </p> | pandas==0.25.1 </br> numpy=1.20.1 </br></p> numpy>=1.16.0 </br> pandas~=1.1.x </br></p> numpy >= 1.16.0 </br> pandas~=1.1.x </br> CUDA==11.0.3 </br> CuDNN==8.0.5.39 </br> </p> | `mcr.microsoft.com/azureml/tensorflow-1.15-ubuntu18.04-py37-cpu-inference:latest` </p> `mcr.microsoft.com/azureml/xgboost-0.9-ubuntu18.04-py37-cpu-inference:latest` </p> `mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest` </p> | AzureML-tensorflow-1.15-ubuntu18.04-py37-cpu-inference </p> AzureML-tensorflow-2.4-ubuntu18.04-py37-cpu-inference </p> AzureML-tensorflow-2.4-ubuntu18.04-py37-cuda11.0.3-gpu-inference </p> | 
PyTorch </p> | 1.6 </p> 1.7 </p> | CPU </p> CPU </p> | numpy==1.20.1 </br> pandas==0.25.1 </br> </p> numpy>=1.16.0 </br> pandas~=1.1.x </br></p> | `mcr.microsoft.com/azureml/pytorch-1.6-ubuntu18.04-py37-cpu-inference:latest` </p> `mcr.microsoft.com/azureml/pytorch-1.7-ubuntu18.04-py37-cpu-inference:latest` </p> | AzureML-pytorch-1.6-ubuntu18.04-py37-cpu-inference </p> AzureML-pytorch-1.7-ubuntu18.04-py37-cpu-inference </p> | 
Scikit-Learn </p> | 0.24.1  </p> | CPU </p> | scikit-learn==0.24.1 </br> numpy>=1.16.0 </br> pandas~=1.1.x </br></p> | `mcr.microsoft.com/azureml/sklearn-0.24.1-ubuntu18.04-py37-cpu-inference:latest` | AzureML-sklearn-0.24.1-ubuntu18.04-py37-cpu-inference |  
ONNX Runtime </p> | 1.6 </p> | CPU </p> | numpy>=1.16.0 </br> pandas~=1.1.x </br></p> | `mcr.microsoft.com/azureml/onnxruntime-1.6-ubuntu18.04-py37-cpu-inference:latest` |AzureML-onnxruntime-1.6-ubuntu18.04-py37-cpu-inference |
XGBoost </p> | 0.9 </p> 1.4 </p> | CPU </p> CPU </p> | scikit-learn==0.23.2 </br> numpy==1.20.1 </br> pandas==0.25.1 </br></p> scikit-learn==0.24.1 </br> numpy>=1.16.0 </br> pandas~=1.1.x  </br></p> | `mcr.microsoft.com/azureml/xgboost-0.9-ubuntu18.04-py37-cpu-inference:latest` </p> `mcr.microsoft.com/azureml/xgboost-1.4-ubuntu18.04-py37-cpu-inference:latest` </p> | AzureML-xgboost-0.9-ubuntu18.04-py37-cpu-inference </p> AzureML-xgboost-1.4-ubuntu18.04-py37-cpu-inference </p> | 
None | None | CPU | None | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cpu-inference:latest` | AzureML-minimal-ubuntu18.04-py37-cpu-inference  |

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md).