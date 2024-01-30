---
title: Prebuilt Docker images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for inference (scoring) in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.author: sehan
author: dem108
ms.date: 11/04/2022
ms.topic: conceptual
ms.reviewer: mopeakande
ms.custom: deploy, docker, prebuilt
---

# Prebuilt Docker images for inference

Prebuilt Docker container images for inference are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

## Why should I use prebuilt images?

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 

## List of prebuilt Docker images for inference 

> [!IMPORTANT]
> The list provided below includes only **currently supported** inference docker images by Azure Machine Learning.

* All the docker images run as non-root user.
* We recommend using `latest` tag for docker images. Prebuilt docker images for inference are published to Microsoft container registry (MCR), to query list of tags available, follow [instructions on the GitHub repository](https://github.com/microsoft/ContainerRegistry#browsing-mcr-content).
* If you want to use a specific tag for any inference docker image, we support from `latest` to the tag that is *6 months* old from the `latest`.  

**Inference minimal base images**

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest`
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cuda11.6.2-gpu-inference:latest`

## How to use inference prebuilt docker images?

[Check examples in the Azure machine learning GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/custom-container)

## Next steps

* [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
* [Learn more about custom containers](how-to-deploy-custom-container.md)
* [azureml-examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online)