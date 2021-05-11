---
title: Prebuilt Docker images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for inference (scoring) in Azure Machine Learning'
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

# Prebuilt Docker images for inference (Preview)

Prebuilt Docker container images for inference are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

* [Add Python packages](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use the prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-images-inference.md). Using this method, you can install both Python packages and `apt` packages.

> [!IMPORTANT]
> Using prebuilt docker images with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Why should I use prebuilt images?

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 
* The inference process in the deployment runs as non-root.
## List of prebuilt Docker images for inference 

Framework | Framework version | CPU/GPU | Pre-installed packages | Image path | Curated environment
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

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-images-inference.md).