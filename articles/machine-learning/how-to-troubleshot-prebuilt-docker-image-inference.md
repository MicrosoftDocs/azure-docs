---
title: Troubleshoot prebuilt docker images
titleSuffix: Azure Machine Learning
description: 'Troubleshooting steps for using prebuilt Docker images for inference.'
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
# Troubleshooting prebuilt docker images for inference (Preview)

Learn how to troubleshoot problems you may see when using prebuilt docker images for inference with Azure Machine Learning.

> [!IMPORTANT]
> Using prebuilt docker images with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Model deployment failed

If model deployment fails, you won't see logs in [Azure Machine Learning Studio](https://ml.azure.com/) and `service.get_logs()` will return **None**.

So you'll need to run the container locally using one of the commands shown below and replace `<MCR-path>` with an image path in this [table of curated images]().

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

## Enable local debugging by using Azure Machine Learning inference HTTP server

The local inference server allows you to quickly debug your entry script (`score.py`). In case the underlying score script has a bug, the server will fail to initialize or serve the model. Instead, it will throw an exception & the location where the issues occurred. For more information on debugging locally, see [Azure Machine Learning inference HTTP server]().

## For common model deployment issues

For problems when deploying a model from Azure Machine Learning to Azure Container Instances (ACI) or Azure Kubernetes Service (AKS), see [Troubleshoot model deployment](how-to-troubleshoot-deployment.md).

## init() or run() failing to write a file in the container

HTTP server in our Prebuilt Docker Images run as `non-root user`, it may not have access right to all directories. 
Only write to directories you have access rights to. For example, the `/tmp` directory in the container.

## Extra python packages not installed

* Check if there is a typo in the environment variable or file name.
* Check the container log to see if `pip install -r <your_requirements.txt>` is installed or not.
* If installation not found and log says "file not found", check if the file name shown in the log is correct.
* If installation started but failed or timed out, try to install the same `requirements.txt` locally with the same Python and pip version to see if the problem can be reproduced locally.

## Mounting solution failed

* Check if there is a typo in the environment variable or directory name.
* The environment variable must be set to the relative path of the `score.py` file.
* The directory needs to be the "site-packages" directory of the environment.
* If `score.py` still returns `ModuleNotFound` and the module is supposed to be in the directory mounted, try to print the `sys.path` in `init()` or `run()` to see if any path is missing.

## Building an image based on the prebuilt Docker image failed

* If failed during apt package installation, check if the user has been set to root before running the apt command? (Make sure switch back to non-root user)

## Image built based on the prebuilt Docker image can't boot up

* The non-root user needs to be `dockeruser`. Otherwise, the owner of the following directories must be set to the user name you want to use when running the image:

```sh
/var/runit
/var/iot-server
/var/log
/var/lib/nginx
/run
/opt/miniconda
/var/azureml-app
```

* If the `ENTRYPOINT` has been changed in the new built image, then the HTTP server and related components needs to be loaded manually by `runsvdir /var/runit`

## Next steps

* [Add Python packages to prebuilt images](how-to-prebuilt-docker-images-inference-python-extensibility.md).
* [Use a prebuilt package as a base for a new Dockerfile](how-to-extend-prebuilt-docker-images-inference.md).