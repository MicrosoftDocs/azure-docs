---
title: Customize the Container Image Used for Deploying Azure ML Models | Microsoft Docs
description: This article describes how to customize a container image for Azure Machine Learning models
services: machine-learning
author: tedway
ms.author: tedway
manager: mwinkle
ms.reviewer: mldocs, raymondl
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 3/26/2018

ROBOTS: NOINDEX
---


# Customize the container image used for Azure ML Models

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



This article describes how to customize a container image for Azure Machine Learning models.  Azure ML Workbench uses containers for deploying machine learning models. The models are deployed along with their dependencies, and Azure ML builds an image from the model, the dependencies, and associated files.

## How to customize the Docker image
Customize the Docker image that Azure ML deploys using:

1. A `dependencies.yml` file: to manage dependencies that are installable from [PyPi]( https://pypi.python.org/pypi), you can use the `conda_dependencies.yml` file from the Workbench project, or create your own. This is the recommend approach for installing Python dependencies that are pip-installable.

   Example CLI command:
   ```azurecli
   az ml image create -n <my Image Name> --manifest-id <my Manifest ID> -c amlconfig\conda_dependencies.yml
   ```

   Example conda_dependencies file: 
   ```yaml
   name: project_environment
   dependencies:
      - python=3.5.2
      - scikit-learn
      - ipykernel=4.6.1
      
      - pip:
        - azure-ml-api-sdk==0.1.0a11
        - matplotlib
   ```
        
2. A Docker steps file: using this option, you customize the deployed image by installing dependencies that cannot be installed from PyPi. 

   The file should include Docker installation steps like a DockerFile. The following commands are allowed in the file: 

	RUN, ENV, ARG, LABEL, EXPOSE

   Example CLI command:
   ```azurecli
   az ml image create -n <my Image Name> --manifest-id <my Manifest ID> --docker-file <myDockerStepsFileName> 
   ```

   Image, Manifest, and Service commands accept the docker-file flag.

   Example Docker steps file:
   ```docker
   # Install tools required to build the project
   RUN apt-get update && apt-get install -y git libxml2-dev
   # Install library dependencies
   RUN dep ensure -vendor-only
   ```

> [!NOTE]
> The base image for Azure ML containers is Ubuntu and can't be changed. If you specify a different base image, it will be ignored.

## Next steps
Now that you've customized your container image, you can deploy it to a cluster for large-scale use.  For details on setting up a cluster for web service deployment, see [Model Management Configuration](deployment-setup-configuration.md). 
