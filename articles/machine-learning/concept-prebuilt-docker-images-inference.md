---
title: Prebuilt Docker images
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker images for inference (scoring) in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 10/21/2021
ms.topic: conceptual
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt, curated environments
---

# Prebuilt Docker images for inference

Prebuilt Docker container images for inference are used when deploying a model with Azure Machine Learning.  The images are prebuilt with popular machine learning frameworks and Python packages. You can also extend the packages to add other packages by using one of the following methods:

* [Add Python packages](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use prebuilt inference image as base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md). Using this method, you can install both **Python packages and apt packages**.

## Why should I use prebuilt images?

* Reduces model deployment latency.
* Improves model deployment success rate.
* Avoid unnecessary image build during model deployment.
* Only have required dependencies and access right in the image/container. 

## List of prebuilt Docker images for inference 

[!INCLUDE [list-of-inference-prebuilt-docker-images](../../includes/aml-inference-list-prebuilt-docker-images.md)]

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md).