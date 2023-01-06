---
title: "include file"
description: "include file"
services: machine-learning
author: shivanissambare
ms.service: machine-learning
ms.author: ssambare
ms.custom: "include file"
ms.topic: "include"
ms.date: 07/14/2022
---

* All the docker images run as non-root user.
* We recommend using `latest` tag for docker images. Prebuilt docker images for inference are published to Microsoft container registry (MCR), to query list of tags available, follow [instructions on the GitHub repository](https://github.com/microsoft/ContainerRegistry#browsing-mcr-content).
* If you want to use a specific tag for any inference docker image, we support from `latest` to the tag that is *6 months* old from the `latest`.  

### Inference minimal base images

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest`
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cuda11.6.2-gpu-inference:latest`
