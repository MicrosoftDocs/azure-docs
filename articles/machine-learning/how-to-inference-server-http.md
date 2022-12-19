---
title: Azure Machine Learning inference HTTP server
titleSuffix: Azure Machine Learning
description: Learn how to enable local development with Azure machine learning inference http server.
author: shohei1029
ms.author: shnagata
ms.reviewer: mopeakande
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: inference server, local development, local debugging, devplatv2
ms.date: 11/29/2022
---

# Debugging scoring script with Azure Machine Learning inference HTTP server (preview)

The Azure Machine Learning inference HTTP server [(preview)](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) is a Python package that exposes your scoring function as an HTTP endpoint and wraps the Flask server code and dependencies into a singular package. It's included in [prebuilt Docker images for inference](concept-prebuilt-docker-images-inference.md) that are used when deploying a model with Azure Machine Learning. Using the package by itself, you can easily validate your entry script (`score.py`) in a local development environment. If there's a problem with the scoring script, the server will return an error. It will also return the location where the error occurred.

The server can also be used when creating validation gates in a continuous integration and deployment pipeline. For example, start the server with the candidate script and run the test suite against the local endpoint.

This article targets both you want to use the inference server to debug locally and to use the inference server with online endpoints.

## Online endpoint local debugging

Debugging endpoints locally before deploying them to the cloud can help you catch errors in your code and configuration earlier. You have different options for debugging endpoints locally.

- Azure Machine Learning inference HTTP server
- [Local endpoint](how-to-debug-managed-online-endpoints-visual-studio-code.md)

This guide focuses on Azure Machine Learning inference HTTP server.

The following table provides an overview of scenarios to help you choose what works best for you.

| Scenario                                                                | Inference HTTP Server | Local endpoint |
| ----------------------------------------------------------------------- | --------------------- | -------------- |
| Update local Python environment, **without** Docker image rebuild       | Yes                   | No             |
| Update scoring script                                                   | Yes                   | Yes            |
| Update deployment configurations (deployment, environment, code, model) | No                    | Yes            |
| VS Code Debugger integration                                            | Yes                   | Yes            |

By running the inference HTTP server locally, you can focus on debugging your scoring script without being affected by the deployment container configurations.

## Prerequisites

- Requires: Python >=3.7
- Anaconda

> [!TIP]
> The Azure Machine Learning inference HTTP server runs on Windows & Linux based operating systems.

## Installation

> [!NOTE]
> To avoid package conflicts, install the server in a virtual environment.

To install the `azureml-inference-server-http package`, run the following command in your cmd/terminal:

```bash
python -m pip install azureml-inference-server-http
```

## Debug your scoring script locally
### Understand the server behavior with a dummy scoring script
1. Create a directory to hold your files:

    ```bash
    mkdir server_quickstart
    cd server_quickstart
    ```

1. To avoid package conflicts, create a virtual environment and activate it:

    ```bash
    python -m venv myenv
    source myenv/bin/activate
    ```

    > [!TIP]
    > After testing, run `deactivate` to deactivate the Python virtual environment.

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

1. Start the server (azmlinfsrv) and set `score.py` as the entry script:

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

After testing, you can press `Ctrl + C` to terminate the server. 
Now you can modify the scoring script (`score.py`) and test your changes by running the server again (`azmlinfsrv --entry_script score.py`).

### How to integrate with Visual Studio Code

There are two ways to use Visual Studio Code (VSCode) and [Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) to debug with [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/) package. 

1. Start the AzureML Inference Server in a command line and use VSCode + Python Extension to attach to the process.
1. Set up the `launch.json` in the VSCode and starts the AzureML Inference Server within VSCode.

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

In both ways, you can set breakpoint and debug step by step.

### End-to-end example
In this section, we'll run the server locally with [sample files](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/model-1) (scoring script, model file, and environment) in our example repository. The sample files are also used in our article for [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)

1. Clone the sample repository.

    ```bash
    git clone --depth 1 https://github.com/Azure/azureml-examples
    cd azureml-examples/cli/endpoints/online/model-1/
    ```

1. Create and activate a virtual environment with [conda](https://conda.io/projects/conda/en/latest/user-guide/getting-started.html).
    In this example, the `azureml-inference-server-http` package is automatically installed because it's included as a dependent library of the `azureml-defaults` package in `conda.yml` below.

    ```bash
    # Create the environment from the YAML file
    conda env create --name model-env -f ./environment/conda.yml
    # Activate the new environment
    conda activate model-env
    ```

1. Review your scoring script.

    __onlinescoring/score.py__  
    :::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score.py" :::

1. Run the inference server with specifying scoring script and model file.
   The specified model directory (`model_dir` parameter) will be defined as `AZUREML_MODEL_DIR` variable and retrieved in the scoring script. 
   In this case, we specify the current directory (`./`) since the subdirectory is specified in the scoring script as `model/sklearn_regression_model.pkl`.

    ```bash
    azmlinfsrv --entry_script ./onlinescoring/score.py --model_dir ./
    ```

    The example [startup log](#startup-logs) will be shown if the server launched and the scoring script invoked successfully. Otherwise, there will be error messages in the log.

1. Test the scoring script with a sample data.
    Open another terminal and move to the same working directory to run the command.
    Use the `curl` command to send an example request to the server and receive a scoring result.

    ```bash
    curl --request POST "127.0.0.1:5001/score" --header 'Content-Type: application/json' --data @sample-request.json
    ```

    The scoring result will be returned if there's no problem in your scoring script. If you find something wrong, you can try to update the scoring script, and launch the server again to test the updated script.

## Server Routes

The server is listening on port 5001 (as default) at these routes.

| Name           | Route                |
| -------------- | -------------------- |
| Liveness Probe | 127.0.0.1:5001/      |
| Score          | 127.0.0.1:5001/score |

## Server parameters

The following table contains the parameters accepted by the server:

| Parameter                       | Required | Default | Description                                                                                                        |
| ------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| entry_script                    | True     | N/A     | The relative or absolute path to the scoring script.                                                               |
| model_dir                       | False    | N/A     | The relative or absolute path to the directory holding the model used for inferencing.                             |
| port                            | False    | 5001    | The serving port of the server.                                                                                    |
| worker_count                    | False    | 1       | The number of worker threads that will process concurrent requests.                                                |
| appinsights_instrumentation_key | False    | N/A     | The instrumentation key to the application insights where the logs will be published.                              |
| access_control_allow_origins    | False    | N/A     | Enable CORS for the specified origins. Separate multiple origins with ",". <br> Example: "microsoft.com, bing.com" |

> [!TIP]
> CORS (Cross-origin resource sharing) is a way to allow resources on a webpage to be requested from another domain. CORS works via HTTP headers sent with the client request and returned with the service response. For more information on CORS and valid headers, see [Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) in Wikipedia. See [here](v1/how-to-deploy-advanced-entry-script.md#cross-origin-resource-sharing-cors) for an example of the scoring script.

## Request flow

The following steps explain how the Azure Machine Learning inference HTTP server (azmlinfsrv) handles incoming requests:

1. A Python CLI wrapper sits around the server's network stack and is used to start the server.
1. A client sends a request to the server.
1. When a request is received, it goes through the [WSGI](https://www.fullstackpython.com/wsgi-servers.html) server and is then dispatched to one of the workers.
    - [Gunicorn](https://docs.gunicorn.org/) is used on __Linux__.
    - [Waitress](https://docs.pylonsproject.org/projects/waitress/) is used on __Windows__.
1. The requests are then handled by a [Flask](https://flask.palletsprojects.com/) app, which loads the entry script & any dependencies.
1. Finally, the request is sent to your entry script. The entry script then makes an inference call to the loaded model and returns a response.

:::image type="content" source="./media/how-to-inference-server-http/inference-server-architecture.png" alt-text="Diagram of the HTTP server process":::

## Understanding logs

Here we describe logs of the AzureML Inference HTTP Server. You can get the log when you run the `azureml-inference-server-http` locally, or [get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs) if you're using online endpoints. 

> [!NOTE]
> The logging format has changed since version 0.8.0. If you find your log in different style, update the `azureml-inference-server-http` package to the latest version.

> [!TIP]
> If you are using online endpoints, the log from the inference server starts with `Azure ML Inferencing HTTP server <version>`.

### Startup logs

When the server is started, the server settings are first displayed like as shown below followed by the logs:

```
Azure ML Inferencing HTTP server <version>


Server Settings
---------------
Entry Script Name: <entry_script>
Model Directory: <model_dir>
Worker Count: <worker_count>
Worker Timeout (seconds): None
Server Port: <port>
Application Insights Enabled: false
Application Insights Key: <appinsights_instrumentation_key>
Inferencing HTTP server version: azmlinfsrv/<version>
CORS for the specified origins: <access_control_allow_origins>


Server Routes
---------------
Liveness Probe: GET   127.0.0.1:<port>/
Score:          POST  127.0.0.1:<port>/score

<logs>
```

For example, when running on a managed online endpoint:

```
Azure ML Inferencing HTTP server v0.8.0


Server Settings
---------------
Entry Script Name: /var/azureml-app/online/score.py
Model Directory: /var/azureml-app/azureml-models/nyc_taxi_ux/1
Worker Count: 1
Worker Timeout (seconds): 300
Server Port: 31311
Application Insights Enabled: false
Application Insights Key: None
Inferencing HTTP server version: azmlinfsrv/0.8.0
CORS for the specified origins: None


Server Routes
---------------
Liveness Probe: GET   127.0.0.1:31311/
Score:          POST  127.0.0.1:31311/score

2022-11-29 16:54:29,312 I [21] azmlinfsrv.user_script - Found user script at /var/azureml-app/online/score.py
2022-11-29 16:54:29,313 I [21] azmlinfsrv.user_script - run() is not decorated. Server will invoke it with raw input.
2022-11-29 16:54:29,313 I [21] azmlinfsrv.user_script - Invoking user's init function
2022-11-29 16:54:29,313 I [21] azmlinfsrv.user_script - User's init() completed successfully in 203ms.
2022-11-29 16:54:29,313 I [21] azmlinfsrv.app - Azure ML Inference HTTP server is up and ready for requests!
```


### Log format

The logs from the inference server are generated in the following format, except for the launcher scripts since they aren't part of the python package: 

`<UTC Time> | <level> [<pid>] <logger name> - <message>`

Here `<pid>` is the process ID and `<level>` is the first character of the [logging level](https://docs.python.org/3/library/logging.html#logging-levels) – E for ERROR, I for INFO, etc.  

There are six levels of logging in Python, with numbers associated with severity:

| Logging level | Numeric value |
| ------------- | ------------- |
| CRITICAL      | 50            |
| ERROR         | 40            |
| WARNING       | 30            |
| INFO          | 20            |
| DEBUG         | 10            |
| NOTSET        | 0             |

### Access logs

When a request comes into the server, it will be logged except for requests to `/`.
The logs are emitted in the following format as the `<message>`:

`<method> <encoded path + query> <status> <response size> <duration>ms [- <optional message>]`

For example, a GET request to `/score` will be logged as follows:

```
2022-11-29 16:54:29,313 I [21] azmlinfsrv.access - GET /score?a=10 200 15 21ms
```

## Troubleshooting guide
In this section, we'll provide basic troubleshooting tips for Azure Machine Learning inference HTTP server. If you want to troubleshoot online endpoints, see also [Troubleshooting online endpoints deployment](how-to-troubleshoot-online-endpoints.md)

[!INCLUDE [inference server TSGs](../../includes/machine-learning-inference-server-troubleshooting.md)]

## Next steps

* For more information on creating an entry script and deploying models, see [How to deploy a model using Azure Machine Learning](how-to-deploy-online-endpoints.md).
* Learn about [Prebuilt docker images for inference](concept-prebuilt-docker-images-inference.md)
