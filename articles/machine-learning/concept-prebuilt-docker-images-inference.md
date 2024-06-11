---
title: Prebuilt Docker images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for inference (scoring) in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.author: sehan
author: dem108
ms.date: 04/08/2024
ms.topic: concept-article
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: deploy, docker, prebuilt
---

# Prebuilt Docker images for inference

Prebuilt Docker container images for inference are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

## Why should I use prebuilt images?

* Reduces model deployment latency
* Improves model deployment success rate
* Avoids unnecessary image build during model deployment
* Includes only the required dependencies and access right in the image/container

## List of prebuilt Docker images for inference 

> [!IMPORTANT]
> The list provided in the following table includes only the inference Docker images that Azure Machine Learning **currently supports**.

* All the Docker images run as non-root user.
* We recommend using the `latest` tag for Docker images. Prebuilt Docker images for inference are published to the Microsoft container registry (MCR). For information on how to query the list of tags available, see the [MCR GitHub repository](https://github.com/microsoft/ContainerRegistry#browsing-mcr-content).
* If you want to use a specific tag for any inference Docker image, Azure Machine Learning supports tags that range from `latest` to *six months* older than `latest`.  

**Inference minimal base images**

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cuda11.6.2-gpu-inference:latest`
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu22.04-py39-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu22.04-py39-cuda11.8-gpu-inference:latest`


## Related content

* [GitHub examples of how to use inference prebuilt Docker images](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/custom-container)
* [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
* [Use a custom container to deploy a model to an online endpoint](how-to-deploy-custom-container.md)