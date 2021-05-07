---
title: Prebuilt Docker Images - Troubleshooting Guide
titleSuffix: Azure Machine Learning
description: 'Prebuilt Docker Images - Troubleshooting Guide'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 05/07/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt, troubleshoot
---
# Troubleshooting Guide

### Model deployment failed

If model deployment fails, you won't see logs in [Azure Machine Learning Studio](https://ml.azure.com/) and `service.get_logs()` will return **None**.

So you'll need to run the container locally using one of the commands shown below and replace `<MCR-path>` with an image path in this [table of curated images]().

#### Mounting extensibility solution

Go to the folder containing `score.py` and run:
```sh
docker run -it -v $(pwd):/var/azureml-app -e AZUREML_EXTRA_PYTHON_LIB_PATH="myenv/lib/python3.7/site-packages" <mcr-path>
```

#### requirements.txt extensibility solution

Go to the folder containing `score.py` and run:
```sh
docker run -it -v $(pwd):/var/azureml-app -e AZUREML_EXTRA_REQUIREMENTS_TXT="requirements.txt" <mcr-path>
```

### Enable Local Debugging by using Azure Machine Learning Inference HTTP Server

The local inference server allows users to quickly debug their score script. In the case that the underlying score script has a bug, the server will fail to initialize/serve and will instead throw an exception & LOC where the issues occurred at. Please follow [Azure Machine Learning Inference HTTP Server Guide.]()

### For common model deployment issues

Learn how to troubleshoot and solve, or work around, common errors you may encounter when deploying a model to Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning. Please read our public documentation - [Troubleshoot model deployment.](https://docs.microsoft.com/azure/machine-learning/how-to-troubleshoot-deployment?tabs=azcli)


### init() or run() trying to write a file in the container, but its failing?

HTTP server in our Prebuilt Docker Images run as `non-root user`, it may not have access right to all folders. 
Please only write to folders you have access right, e.g. /tmp folder

### Extra python packages not installed?

* Check if there is any typo in the environment variable or file name.
* Check the container log to see if `pip install -r <your_requirements.txt>` is installed or not.
* If installation not found and log says "file not found", please check if the file name shows in the log is right or not.
* If installation started but end up failed or timeout, please try to install the same requirements.txt locally with same python and pip version, see if the problem could be reproduced locally.

### Mounting solution failed?

* Check  if there is any typo in the environment variable or folder name.
* The environment variable need to set to the path relative to the path of the score.py
* The folder needs to be the "site-packages" folder of the environment.
* If score.py still hits `ModuleNotFound` and the module supposed to be in the folder mounted, please try to print out the `sys.path` in init() or run() to see if any path is missing.

### Building an image based on the Prebuilt Docker Image failed?

* If failed during apt package installation, check if the user has been set to root before running the apt command? (Make sure switch back to non-root user)

### Image built based on the Prebuilt Docker Image can't boot up?

* The non-root user needs to be "dockeruser". Otherwise, the following folders owner need to be set to the user name you want to use when running the image:

```sh
/var/runit
/var/iot-server
/var/log
/var/lib/nginx
/run
/opt/miniconda
/var/azureml-app
```

* If the "ENTRYPOINT" has been changed in the new built image, then the HTTP server and related components needs to be loaded manually by `runsvdir /var/runit`