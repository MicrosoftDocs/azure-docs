---
title: Azure Machine Learning inference HTTP server
titleSuffix: Azure Machine Learning
description: Learn how to enable local development with Azure machine learning inference http server.
author: shivanissambare
ms.author: ssambare
ms.reviewer: larryfr
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: inference server, local development, local debugging, devplatv2
ms.date: 05/14/2021
---

# Azure Machine Learning inference HTTP server (Preview)

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

1. A python CLI wrapper sits around the server's network stack and is used to start the server.
1. A client sends a request to the server.
1. When a request is received, it goes through the [WSGI](https://www.fullstackpython.com/wsgi-servers.html) server and is then dispatched to one of the workers.
    - [Gunicorn](https://docs.gunicorn.org/) is used on __Linux__.
    - [Waitress](https://docs.pylonsproject.org/projects/waitress/) is used on __Windows__.
1. The requests are then handled by a [Flask](https://flask.palletsprojects.com/) app, which loads the entry script & any dependencies.
1. Finally, the request is sent to your entry script. The entry script then makes an inference call to the loaded model and returns a response.

:::image type="content" source="./media/how-to-inference-server-http/inference-server-architecture.png" alt-text="Diagram of the HTTP server process":::

## Frequently asked questions

### Do I need to reload the server when changing the score script?

After changing your scoring script (`score.py`), stop the server with `ctrl + c`. Then restart it with `azmlinfsrv --entry_script score.py`.

### Which OS is supported?

The Azure Machine Learning inference server runs on Windows & Linux based operating systems.

## Next steps

* For more information on creating an entry script and deploying models, see [How to deploy a model using Azure Machine Learning](how-to-deploy-and-where.md).
* Learn about [Prebuilt docker images for inference](concept-prebuilt-docker-images-inference.md)