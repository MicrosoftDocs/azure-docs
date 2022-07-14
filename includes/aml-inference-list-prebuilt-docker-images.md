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

### No framework

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
NA | CPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cpu-inference:latest`
NA | GPU | NA | `mcr.microsoft.com/azureml/minimal-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest`

### TensorFlow

Framework version | CPU/GPU | Pre-installed packages | MCR Path 
 --- | --- | --- | --- |
2.4 | CPU | numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest` 
2.4 | GPU | numpy >= 1.16.0 </br> pandas~=1.1.x </br> CUDA==11.0.3 </br> CuDNN==8.0.5.39 | `mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest`
1.15 | CPU | pandas == 0.25.1 </br> numpy == 1.20.1 | `mcr.microsoft.com/azureml/tensorflow-1.15-ubuntu18.04-py37-cpu-inference:latest` 

### PyTorch

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
1.10 | CPU | numpy >= 1.16.0 </br> pandas >= 1.1, < 1.2 | `mcr.microsoft.com/azureml/pytorch-1.10-ubuntu18.04-py37-cpu-inference` 
1.9 | CPU | numpy >= 1.16.0 </br> pandas >= 1.1, < 1.2 | `mcr.microsoft.com/azureml/pytorch-1.9-ubuntu18.04-py37-cpu-inference:latest` 
1.9 | GPU | | `mcr.microsoft.com/azureml/pytorch-1.9-ubuntu18.04-py37-cuda11.0.3-gpu-inference:latest` 

### SciKit-Learn

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- | 
0.24.1  | CPU | scikit-learn==0.24.1 </br> numpy>=1.16.0 </br> pandas~=1.1.x | `mcr.microsoft.com/azureml/sklearn-0.24.1-ubuntu18.04-py37-cpu-inference:latest`

### LightGBM

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
3.2 | CPU | scikit-learn==0.24.1 </br> numpy>=1.16.0, <1.20 </br> pandas>=1.1, <1.2 | `mcr.microsoft.com/azureml/lightgbm-3.2-ubuntu18.04-py37-cpu-inference:latest`

### XGBoost

Framework version | CPU/GPU | Pre-installed packages | MCR Path
 --- | --- | --- | --- |
0.9 | CPU | scikit-learn==0.23.2 </br> numpy==1.20.1 </br> pandas==0.25.1 | `mcr.microsoft.com/azureml/xgboost-0.9-ubuntu18.04-py37-cpu-inference:latest` |
