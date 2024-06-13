---
title: Troubleshoot prebuilt docker images
titleSuffix: Azure Machine Learning
description: 'Troubleshooting steps for using prebuilt Docker images for inference.'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.author: sehan
author: dem108
ms.date: 08/15/2022
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: UpdateFrequency5, deploy, docker, prebuilt, troubleshoot, devx-track-python
---
# Troubleshooting prebuilt docker images for inference

Learn how to troubleshoot problems you may see when using prebuilt docker images for inference with Azure Machine Learning.

> [!IMPORTANT]
> Using [Python package extensibility for prebuilt Docker images](how-to-prebuilt-docker-images-inference-python-extensibility.md) with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Model deployment failed

If model deployment fails, you won't see logs in [Azure Machine Learning studio](https://ml.azure.com/) and `service.get_logs()` will return None.
If there is a problem in the init() function of score.py, `service.get_logs()` will return logs for the same.

So you'll need to run the container locally using one of the commands shown below and replace `<MCR-path>` with an image path. For a list of the images and paths, see [Prebuilt Docker images for inference](../concept-prebuilt-docker-images-inference.md).

### Mounting extensibility solution

Go to the directory containing `score.py` and run:

```bash
docker run -it -v $(pwd):/var/azureml-app -e AZUREML_EXTRA_PYTHON_LIB_PATH="myenv/lib/python3.7/site-packages" <mcr-path>
```

### requirements.txt extensibility solution

Go to the directory containing `score.py` and run:

```bash
docker run -it -v $(pwd):/var/azureml-app -e AZUREML_EXTRA_REQUIREMENTS_TXT="requirements.txt" <mcr-path>
```

## Enable local debugging

The local inference server allows you to quickly debug your entry script (`score.py`). In case the underlying score script has a bug, the server will fail to initialize or serve the model. Instead, it will throw an exception & the location where the issues occurred. [Learn more about Azure Machine Learning inference HTTP Server](../how-to-inference-server-http.md)

## For common model deployment issues

For problems when deploying a model from Azure Machine Learning to Azure Container Instances (ACI) or Azure Kubernetes Service (AKS), see [Troubleshoot model deployment](how-to-troubleshoot-deployment.md).

## init() or run() failing to write a file

HTTP server in our Prebuilt Docker Images run as *non-root user*, it may not have access right to all directories. 
Only write to directories you have access rights to. For example, the `/tmp` directory in the container.

## Extra Python packages not installed

* Check if there's a typo in the environment variable or file name.
* Check the container log to see if `pip install -r <your_requirements.txt>` is installed or not.
* Check if source directory is set correctly in the [inference config](/python/api/azureml-core/azureml.core.model.inferenceconfig#constructor) constructor.
* If installation not found and log says "file not found", check if the file name shown in the log is correct.
* If installation started but failed or timed out, try to install the same `requirements.txt` locally with same Python and pip version in clean environment (that is, no cache directory; `pip install --no-cache-dir -r requriements.txt`). See if the problem can be reproduced locally.

## Mounting solution failed

* Check if there's a typo in the environment variable or directory name.
* The environment variable must be set to the relative path of the `score.py` file.
* Check if source directory is set correctly in the [inference config](/python/api/azureml-core/azureml.core.model.inferenceconfig#constructor) constructor.
* The directory needs to be the "site-packages" directory of the environment.
* If `score.py` still returns `ModuleNotFound` and the module is supposed to be in the directory mounted, try to print the `sys.path` in `init()` or `run()` to see if any path is missing.

## Building an image based on the prebuilt Docker image failed

* If failed during apt package installation, check if the user has been set to root before running the apt command? (Make sure switch back to non-root user) 

## Run doesn't complete on GPU local deployment

GPU base images can't be used for local deployment, unless the local deployment is on an Azure Machine Learning compute instance.  GPU base images are supported only on Microsoft Azure Services such as Azure Machine Learning compute clusters and instances, Azure Container Instance (ACI), Azure VMs, or Azure Kubernetes Service (AKS).

## Image built based on the prebuilt Docker image can't boot up

* The non-root user needs to be `dockeruser`. Otherwise, the owner of the following directories must be set to the user name you want to use when running the image:

    ```bash
    /var/runit
    /var/log
    /var/lib/nginx
    /run
    /opt/miniconda
    /var/azureml-app
    ```

* If the `ENTRYPOINT` has been changed in the new built image, then the HTTP server and related components need to be loaded by `runsvdir /var/runit`

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-image-inference.md).
