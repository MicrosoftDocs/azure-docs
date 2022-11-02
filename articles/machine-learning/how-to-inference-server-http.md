---
title: Azure Machine Learning inference HTTP server
titleSuffix: Azure Machine Learning
description: Learn how to enable local development with Azure machine learning inference http server.
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: inference server, local development, local debugging, devplatv2
ms.date: 07/14/2022
---

# Azure Machine Learning inference HTTP server (preview)

The Azure Machine Learning inference HTTP server [(preview)](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) is a Python package that allows you to easily validate your entry script (`score.py`) in a local development environment. If there's a problem with the scoring script, the server will return an error. It will also return the location where the error occurred.

The server can also be used when creating validation gates in a continuous integration and deployment pipeline. For example, start the server with the candidate script and run the test suite against the local endpoint.

## Prerequisites

- Requires: Python >=3.7

## Installation

> [!NOTE]
> To avoid package conflicts, install the server in a virtual environment.

To install the `azureml-inference-server-http package`, run the following command in your cmd/terminal:

```bash
python -m pip install azureml-inference-server-http
```

## Use the server

1. Create a directory to hold your files:

    ```bash
    mkdir server_quickstart
    cd server_quickstart
    ```

1. To avoid package conflicts, create a virtual environment and activate it:

    ```bash
    virtualenv myenv
    source myenv/bin/activate
    ```

1. Install the `azureml-inference-server-http` package from the [pypi](https://pypi.org/project/azureml-inference-server-http/) feed:

    ```bash
    python -m pip install azureml-inference-server-http
    ```

1. Create your entry script (`score.py`). The following example creates a basic entry script:

    ```bash
    echo '
    import time

    def init():
        time.sleep(1)

    def run(input_data):
        return {"message":"Hello, World!"}
    ' > score.py
    ```

1. Start the server and set `score.py` as the entry script:

    ```bash
    azmlinfsrv --entry_script score.py
    ```

    > [!NOTE]
    > The server is hosted on 0.0.0.0, which means it will listen to all IP addresses of the hosting machine.

1. Send a scoring request to the server using `curl`:

    ```bash
    curl -p 127.0.0.1:5001/score
    ```

    The server should respond like this.

    ```bash
    {"message": "Hello, World!"}
    ```

Now you can modify the scoring script and test your changes by running the server again.

## Server Routes

The server is listening on port 5001 at these routes.

| Name | Route|
| --- | --- |
| Liveness Probe | 127.0.0.1:5001/|
| Score | 127.0.0.1:5001/score|

## Server parameters

The following table contains the parameters accepted by the server:

| Parameter | Required | Default | Description |
| ---- | --- | ---- | ----|
| entry_script | True | N/A | The relative or absolute path to the scoring script.|
| model_dir	| False | N/A | The relative or absolute path to the directory holding the model used for inferencing.
| port | False | 5001 | The serving port of the server.|
| worker_count | False | 1 | The number of worker threads that will process concurrent requests. |
| appinsights_instrumentation_key | False | N/A | The instrumentation key to the application insights where the logs will be published. |

## Request flow

The following steps explain how the Azure Machine Learning inference HTTP server works handles incoming requests:

1. A Python CLI wrapper sits around the server's network stack and is used to start the server.
1. A client sends a request to the server.
1. When a request is received, it goes through the [WSGI](https://www.fullstackpython.com/wsgi-servers.html) server and is then dispatched to one of the workers.
    - [Gunicorn](https://docs.gunicorn.org/) is used on __Linux__.
    - [Waitress](https://docs.pylonsproject.org/projects/waitress/) is used on __Windows__.
1. The requests are then handled by a [Flask](https://flask.palletsprojects.com/) app, which loads the entry script & any dependencies.
1. Finally, the request is sent to your entry script. The entry script then makes an inference call to the loaded model and returns a response.

:::image type="content" source="./media/how-to-inference-server-http/inference-server-architecture.png" alt-text="Diagram of the HTTP server process":::

## How to integrate with Visual Studio Code

There are two ways to use Visual Studio Code (VSCode) and [Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) to debug with [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/) package. 

1. User starts the AzureML Inference Server in a command line and use VSCode + Python Extension to attach to the process.
1. User sets up the `launch.json` in the VSCode and starts the AzureML Inference Server within VSCode.

**launch.json**
```json
{
    "name": "Debug score.py",
    "type": "python",
    "request": "launch",
    "module": "azureml_inference_server_http.amlserver",
    "args": [
        "--entry_script",
        "score.py"
    ]
}
```

In both ways, user can set breakpoint and debug step by step.

## Frequently asked questions

### 1. I encountered the following error during server startup:

```bash

TypeError: register() takes 3 positional arguments but 4 were given

  File "/var/azureml-server/aml_blueprint.py", line 251, in register

    super(AMLBlueprint, self).register(app, options, first_registration)

TypeError: register() takes 3 positional arguments but 4 were given

```

You have **Flask 2** installed in your python environment but are running a version of `azureml-inference-server-http` that doesn't support Flask 2. Support for Flask 2 is added in `azureml-inference-server-http>=0.7.0`, which is also in `azureml-defaults>=1.44`.

1. If you're not using this package in an AzureML docker image, use the latest version of
   `azureml-inference-server-http` or `azureml-defaults`.

2. If you're using this package with an AzureML docker image, make sure you're using an image built in or after July,
   2022. The image version is available in the container logs. You should be able to find a log similar to below:

    ```
    2022-08-22T17:05:02,147738763+00:00 | gunicorn/run | AzureML Container Runtime Information
    2022-08-22T17:05:02,161963207+00:00 | gunicorn/run | ###############################################
    2022-08-22T17:05:02,168970479+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,174364834+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,187280665+00:00 | gunicorn/run | AzureML image information: openmpi4.1.0-ubuntu20.04, Materializaton Build:20220708.v2
    2022-08-22T17:05:02,188930082+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,190557998+00:00 | gunicorn/run | 
    ```

   The build date of the image appears after "Materialization Build", which in the above example is `20220708`, or July 8, 2022. This image is compatible with Flask 2. If you don't see a banner like this in your container log, your image is out-of-date, and should be updated. If you're using a cuda image, and are unable to find a newer image, check if your image is deprecated in [AzureML-Containers](https://github.com/Azure/AzureML-Containers). If it is, you should be able to find replacements.

   If this is an online endpoint, you can also find the logs under "Deployment logs" in the [online endpoint page in Azure Machine Learning studio](https://ml.azure.com/endpoints). If you deploy with SDK v1 and don't explicitly specify an image in your deployment configuration, it will default to using a version of `openmpi4.1.0-ubuntu20.04` that matches your local SDK toolset, which may not be the latest version of the image. For example, SDK 1.43 will default to using `openmpi4.1.0-ubuntu20.04:20220616`, which is incompatible. Make sure you use the latest SDK for your deployment.

   If for some reason you're unable to update the image, you can temporarily avoid the issue by pinning `azureml-defaults==1.43` or `azureml-inference-server-http~=0.4.13`, which will install the older version server with `Flask 1.0.x`.
   
   See also [Troubleshooting online endpoints deployment](how-to-troubleshoot-online-endpoints.md#error-resourcenotready).

### 2. I encountered an ``ImportError`` or ``ModuleNotFoundError`` on modules ``opencensus``, ``jinja2``, ``MarkupSafe``, or ``click`` during startup like the following message:

```bash
ImportError: cannot import name 'Markup' from 'jinja2'
```

Older versions (<= 0.4.10) of the server didn't pin Flask's dependency to compatible versions. This problem is fixed in the latest version of the server.

### 3. Do I need to reload the server when changing the score script?

After changing your scoring script (`score.py`), stop the server with `ctrl + c`. Then restart it with `azmlinfsrv --entry_script score.py`.

### 4. Which OS is supported?

The Azure Machine Learning inference server runs on Windows & Linux based operating systems.

## Next steps

* For more information on creating an entry script and deploying models, see [How to deploy a model using Azure Machine Learning](how-to-deploy-managed-online-endpoints.md).
* Learn about [Prebuilt docker images for inference](concept-prebuilt-docker-images-inference.md)
