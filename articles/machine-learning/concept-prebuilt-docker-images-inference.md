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

Prebuilt Docker container images for inference [(preview)](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

* [Add Python packages](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use prebuilt inference image as base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md). Using this method, you can install both **Python packages and apt packages**.

## Why should I use prebuilt images?

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 

## List of prebuilt Docker images for inference 

* All the docker images run as non-root user.

### TensorFlow

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
 1.15 | CPU | pandas==0.25.1 </br> numpy=1.20.1 | `mcr.microsoft.com/azureml/tensorflow-1.15-ubuntu18.04-py37-cpu-inference:latest`  | AzureML-tensorflow-1.15-ubuntu18.04-py37-cpu-inference | 
2.4 | CPU | numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest` | AzureML-tensorflow-2.4-ubuntu18.04-py37-cpu-inference |
2.4 | GPU | numpy >= 1.16.0 </br> pandas~=1.1.x </br> CUDA==11.0.3 </br> CuDNN==8.0.5.39 | `mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest` | AzureML-tensorflow-2.4-ubuntu18.04-py37-cuda11.0.3-gpu-inference |

### PyTorch

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
 1.6 | CPU | numpy==1.20.1 </br> pandas==0.25.1 | `mcr.microsoft.com/azureml/pytorch-1.6-ubuntu18.04-py37-cpu-inference:latest` | AzureML-pytorch-1.6-ubuntu18.04-py37-cpu-inference |
1.7 | CPU | numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/pytorch-1.7-ubuntu18.04-py37-cpu-inference:latest` | AzureML-pytorch-1.7-ubuntu18.04-py37-cpu-inference |

### SciKit-Learn

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
0.24.1  | CPU | scikit-learn==0.24.1 </br> numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/sklearn-0.24.1-ubuntu18.04-py37-cpu-inference:latest` | AzureML-sklearn-0.24.1-ubuntu18.04-py37-cpu-inference |

### ONNX Runtime

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
1.6 | CPU | numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/onnxruntime-1.6-ubuntu18.04-py37-cpu-inference:latest` |AzureML-onnxruntime-1.6-ubuntu18.04-py37-cpu-inference |

### XGBoost

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
0.9 | CPU | scikit-learn==0.23.2 </br> numpy==1.20.1 </br> pandas==0.25.1 | `mcr.microsoft.com/azureml/xgboost-0.9-ubuntu18.04-py37-cpu-inference:latest` | AzureML-xgboost-0.9-ubuntu18.04-py37-cpu-inference | 

### No framework

Framework version | CPU/GPU | Pre-installed packages | MCR Path | Curated environment
 --- | --- | --- | --- | --- |
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cpu-inference:latest` | AzureML-minimal-ubuntu18.04-py37-cpu-inference  |

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md).