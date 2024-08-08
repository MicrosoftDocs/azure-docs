---
title: Debug with Azure Machine Learning inference server
titleSuffix: Azure Machine Learning
description: Learn how to enable local development with Azure Machine Learning inference HTTP server, and debug scoring scripts or endpoints before you deploy to the cloud.
author: msakande
ms.author: mopeakande
ms.reviewer: alehughes
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.custom: inference server, local development, local debugging, devplatv2
ms.date: 08/07/2024

#customer intent: As a developer, I want to work with the Azure Machine Learning inference HTTP server so I can debug scoring scripts or endpoints before deployment.
---

# Debug scoring scripts with Azure Machine Learning inference HTTP server

The Azure Machine Learning inference HTTP server is a Python package that exposes your scoring function as an HTTP endpoint and wraps the Flask server code and dependencies into a singular package. The serve is included in the [prebuilt Docker images for inference](concept-prebuilt-docker-images-inference.md) that are used when deploying a model with Azure Machine Learning. Using the package alone, you can deploy the model locally for production, and easily validate your scoring (entry) script in a local development environment. If there's a problem with the scoring script, the server returns an error and the location of the error.

The server can also be used to create validation gates in a continuous integration and deployment pipeline. For example, you can start the server with the candidate script and run the test suite against the local endpoint.

This article supports developers who want to use the inference server to debug locally and describes how to use the inference server with online endpoints on Windows.

## Explore local debug options for online endpoints

By debugging endpoints locally before you deploy to the cloud, you can catch errors in your code and configuration earlier. To debug endpoints locally, you have several options, including:

- The Azure Machine Learning inference HTTP server
- A [local endpoint](how-to-debug-managed-online-endpoints-visual-studio-code.md)

This article describes how to work with the Azure Machine Learning inference HTTP server on Windows.

The following table provides an overview of scenarios to help you choose the best option:

| Scenario | Inference HTTP server | Local endpoint |
| --- | :---: | :---: |
| Update local Python environment **without** Docker image rebuild        | Yes | No  |
| Update scoring script                                                   | Yes | Yes |
| Update deployment configurations (deployment, environment, code, model) | No  | Yes |
| Integrate Microsoft Visual Studio Code (VS Code) Debugger               | Yes | Yes |

When you run the inference HTTP server locally, you can focus on debugging your scoring script without concern for deployment container configurations.

## Prerequisites

To use the Azure Machine Learning inference HTTP server for local debugging, your configuration must include the following components:

- Python 3.8 or later
- Anaconda

The Azure Machine Learning inference HTTP server runs on Windows and Linux based operating systems.

## Install azureml-inference-server-http package

To install the `azureml-inference-server-http` package, run the following command:

```bash
python -m pip install azureml-inference-server-http
```

> [!NOTE]
> To avoid package conflicts, install the inference HTTP server in a virtual environment.
> You can use the `pip install virtualenv` command to enable virtual environments for your configuration.

## Debug your scoring script locally

To debug your scoring script locally, you have several options for testing the server behavior:

- Try a dummy scoring script
- Use Visual Studio Code to debug with the [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/) package
- Run an actual scoring script, model file, and environment file from our [examples repo](https://github.com/Azure/azureml-examples)

### Test server behavior with dummy scoring script

1. Create a directory named _server\_quickstart_ to hold your files:

   ```bash
   mkdir server_quickstart
   cd server_quickstart
   ```

1. To avoid package conflicts, create a virtual environment, such as _myenv_, and activate it:

   ```bash
   python -m virtualenv myenv
   ```

   > [!NOTE]
   > On Linux, run the `source myenv/bin/activate` command to activate the virtual environment.

   <!-- Reviewer: The 'source' command appears to apply to Linux only. 
        I found that the 'python -m virtualenv...' command (as opposed to 'python -m venv ...') both creates and activates the env. -->

   After you test the server, you can run `deactivate` to deactivate the Python virtual environment.

1. Install the `azureml-inference-server-http` package from the [pypi](https://pypi.org/project/azureml-inference-server-http/) feed:

   ```bash
   python -m pip install azureml-inference-server-http
   ```

1. Create your entry script. The following example creates a basic entry script and saves it to a file named _score.py_:

   ```bash
   echo -e "import time def init(): \n\t time.sleep(1) \n\n def run(input_data): \n\t return {"message":"Hello, World!"}" > score.py
   ```

1. Start the server with the `azmlinfsrv` command and set the _score.py_ file as the entry script:

   <!-- Reviewer: The following command doesn't fully succeed.
        I'll add a screenshot of the output in the PR comments. -->

   ```bash
   azmlinfsrv --entry_script score.py
   ```

   > [!NOTE]
   > The server is hosted on 0.0.0.0, which means it listens to all IP addresses of the hosting machine.

1. Send a scoring request to the server by using the `curl` utility:

   <!-- Reviewer: Because the previous command doesn't fully succeed, I can't verify the output. -->

   ```bash
   curl -p 127.0.0.1:5001/score
   ```

   The server posts the following response:

   ```bash
   {"message": "Hello, World!"}
   ```

1. After testing, select Ctrl + C to terminate the server. 

Now you can modify the scoring script file (_score.py_) and test your changes by running the server again with the `azmlinfsrv --entry_script score.py` command.

### Integrate with Visual Studio Code

To use VS Code and the [Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for debugging with the [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/) package, you can use the [Launch and Attach modes](https://code.visualstudio.com/docs/editor/debugging#_launch-versus-attach-configurations). 

- For **Launch mode**, set up the _launch.json_ file in VS Code and start the Azure Machine Learning inference HTTP server within VS Code:

   1. Start VS Code and open the folder containing the script (_score.py_).

   1. Add the following configuration to the _launch.json_ file for that workspace in VS Code:

      **launch.json**

      ```json
      {
          "version": "0.2.0",
          "configurations": [
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
          ]
        }
      ```

   1. Start the debugging session in VS Code by selecting **Run** > **Start Debugging** or use the keyboard shortcut F5.

- For **Attach mode**, start the Azure Machine Learning inference HTTP server in a command window, and use VS Code with the Python Extension to attach to the process:

   > [!NOTE]
   > For Linux, first install the `gdb` package by running the `sudo apt-get install -y gdb` command.

   1. Add the following configuration to the _launch.json_ file for that workspace in VS Code:
        
      **launch.json**

      ```json
      {
          "version": "0.2.0",
          "configurations": [
              {
                  "name": "Python: Attach using Process Id",
                  "type": "python",
                  "request": "attach",
                  "processId": "${command:pickProcess}",
                  "justMyCode": true
              }
          ]
        }
      ```

   1. In a command window, start the inference HTTP server by using the `azmlinfsrv --entry_script score.py` command.

   1. Start the debugging session in VS Code:

      1. Select **Run** > **Start Debugging** or use the keyboard shortcut F5.

      1. In the command window, view the logs from the inference server, and locate the process ID of the `azmlinfsrv` command (not the `gunicorn`).

         :::image type="content" source="./media/how-to-inference-server-http/debug-attach-pid.png" border="false" alt-text="Screenshot that shows a command window displaying logs from the inference HTTP server and the process ID of the azmlinfsrv command highlighted.":::

      1. In the VS Code Debugger, enter the process ID of the `azmlinfsrv` command.
      
         If you don't see the VS Code process picker, you can manually enter the process ID in the `processId` field of the _launch.json_ file for that workspace.

For both modes, you can set [breakpoints](https://code.visualstudio.com/docs/editor/debugging#_breakpoints) and debug the script step by step.

### Use an end-to-end example

The following procedure runs the server locally with [sample files](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/model-1) (scoring script, model file, and environment) from the Azure Machine Learning example repository. For more examples of how to use these sample files, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

1. Clone the sample repository:

   ```bash
   git clone --depth 1 https://github.com/Azure/azureml-examples
   cd azureml-examples/cli/endpoints/online/model-1/
   ```

1. Create and activate a virtual environment with [conda](https://conda.io/projects/conda/en/latest/user-guide/getting-started.html):

   In this example, the `azureml-inference-server-http` package is automatically installed. The package is included as a dependent library of the `azureml-defaults` package in the _conda.yml_ file:

   ```bash
   # Create the environment from the YAML file
   conda env create --name model-env -f ./environment/conda.yml
   # Activate the new environment
   conda activate model-env
   ```

1. Review your scoring script:

   **onlinescoring/score.py**

   :::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score.py":::

1. Run the inference HTTP server by specifying the scoring script and model file:

   The model directory specified in the `model_dir` parameter is defined by using the `AZUREML_MODEL_DIR` variable and retrieved in the scoring script. 

   In this case, you specify the current directory _./_ because the subdirectory is specified in the scoring script as _model/sklearn\_regression\_model.pkl_.

   ```bash
   azmlinfsrv --entry_script ./onlinescoring/score.py --model_dir ./
   ```

   When the server launches and successfully invokes the scoring script, the example [startup log](#startup-logs) opens. Otherwise, the log shows error messages.

1. Test the scoring script with sample data:

   Open another command window and change into the same working directory where you run the command.

   Use the `curl` utility to send an example request to the server and receive a scoring result:

   ```bash
   curl --request POST "127.0.0.1:5001/score" --header "Content-Type:application/json" --data @sample-request.json
   ```

   When there are no problems in your scoring script, the script returns the scoring result. If problems occur, you can try to update the scoring script, and launch the server again to test the updated script.

## Review server routes

The inference HTTP server listens on port 5001 by default at the following routes:

| Name | Route |
| --- | --- |
| **Liveness Probe**    | `127.0.0.1:5001/`             |
| **Score**             | `127.0.0.1:5001/score`        |
| **OpenAPI (swagger)** | `127.0.0.1:5001/swagger.json` |

## Review server parameters

The following table summarizes the parameters accepted by the inference HTTP server:

| Parameter | Required | Default | Description |
| --- | --- | :---: | --- |
| `entry_script`                    | True     | N/A   | Identifies the relative or absolute path to the scoring script. |
| `model_dir`                       | False    | N/A   | Identifies the relative or absolute path to the directory that holds the model used for inferencing. |
| `port`                            | False    | 5001  | Specifies the serving port of the server. |
| `worker_count`                    | False    | 1     | Provides the number of worker threads to process concurrent requests. |
| `appinsights_instrumentation_key` | False    | N/A   | Provides the instrumentation key to the application insights where the logs are published. |
| `access_control_allow_origins`    | False    | N/A   | Enables CORS for the specified origins, where multiple origins are separated by a comma (,), such as `microsoft.com, bing.com`. |

## Explore server request processing

The following steps demonstrate how the Azure Machine Learning inference HTTP server (azmlinfsrv) handles incoming requests:

1. A Python CLI wrapper sits around the server's network stack and is used to start the server.

1. A client sends a request to the server.

1. The server sends the request through the [Web Server Gateway Interface (WSGI)](https://www.fullstackpython.com/wsgi-servers.html) server, which dispatches the request to a Flask worker application:

   - **Windows**: [waitress](https://docs.pylonsproject.org/projects/waitress/)
   - **Linux**: [gunicorn](https://docs.gunicorn.org/) 

1. The [Flask](https://flask.palletsprojects.com/) worker app handles the request, which includes loading the entry script and any dependencies.

1. Your entry script receives the request. The entry script makes an inference call to the loaded model and returns a response:

:::image type="content" source="./media/how-to-inference-server-http/inference-server-architecture.png" border="false" alt-text="Diagram that shows how the inference HTTP server processes incoming requests." lightbox="./media/how-to-inference-server-http/inference-server-architecture.png":::

## Explore server logs

There are two ways to obtain log data for the inference HTTP server test:

- Run the `azureml-inference-server-http` package locally and view the logs output.
- Use online endpoints and view the [container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs). The log for the inference server is named **Azure Machine Learning Inferencing HTTP server <version>**.

> [!NOTE]
> The logging format has changed since version 0.8.0. If your log uses a different style than expected, update the `azureml-inference-server-http` package to the latest version.

### View startup logs

When the server starts, the logs show the initial server settings as follows:

```console
Azure Machine Learning Inferencing HTTP server <version>

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

For example, when you launch the server by following the [end-to-end example](#use-an-end-to-end-example), the log displays as follows:

```
Azure Machine Learning Inferencing HTTP server v0.8.0

Server Settings
---------------
Entry Script Name: /home/user-name/azureml-examples/cli/endpoints/online/model-1/onlinescoring/score.py
Model Directory: ./
Worker Count: 1
Worker Timeout (seconds): None
Server Port: 5001
Application Insights Enabled: false
Application Insights Key: None
Inferencing HTTP server version: azmlinfsrv/0.8.0
CORS for the specified origins: None

Server Routes
---------------
Liveness Probe: GET   127.0.0.1:5001/
Score:          POST  127.0.0.1:5001/score

2022-12-24 07:37:53,318 I [32726] gunicorn.error - Starting gunicorn 20.1.0
2022-12-24 07:37:53,319 I [32726] gunicorn.error - Listening at: http://0.0.0.0:5001 (32726)
2022-12-24 07:37:53,319 I [32726] gunicorn.error - Using worker: sync
2022-12-24 07:37:53,322 I [32756] gunicorn.error - Booting worker with pid: 32756
Initializing logger
2022-12-24 07:37:53,779 I [32756] azmlinfsrv - Starting up app insights client
2022-12-24 07:37:54,518 I [32756] azmlinfsrv.user_script - Found user script at /home/user-name/azureml-examples/cli/endpoints/online/model-1/onlinescoring/score.py
2022-12-24 07:37:54,518 I [32756] azmlinfsrv.user_script - run() is not decorated. Server will invoke it with the input in JSON string.
2022-12-24 07:37:54,518 I [32756] azmlinfsrv.user_script - Invoking user's init function
2022-12-24 07:37:55,974 I [32756] azmlinfsrv.user_script - Users's init has completed successfully
2022-12-24 07:37:55,976 I [32756] azmlinfsrv.swagger - Swaggers are prepared for the following versions: [2, 3, 3.1].
2022-12-24 07:37:55,977 I [32756] azmlinfsrv - AML_FLASK_ONE_COMPATIBILITY is set, but patching is not necessary.
```

### Understand log data format

All logs from the inference HTTP server, except for the launcher script, present data in the following format:

`<UTC Time> | <level> [<pid>] <logger name> - <message>`

The format consists of the following values:

- `<UTC Time>`: Time when the entry was entered into the log.
- `<pid>`: The ID of the process associated with the entry.
- `<level>`: The first character of the [logging level](https://docs.python.org/3/library/logging.html#logging-levels) for the entry, such as `E` for ERROR, `I` for INFO, and so on.  
- `<logger name>`: The name of the resource associated with the log entry.
- `<message>`: The contents of the log message.

There are six levels of logging in Python with assigned numeric values according to severity:

| Logging level | Numeric value |
| --- | :---:|
| **CRITICAL** | 50 |
| **ERROR**    | 40 |
| **WARNING**  | 30 |
| **INFO**     | 20 |
| **DEBUG**    | 10 |
| **NOTSET**   | 0  |

## Troubleshoot server issues

The following sections provide basic troubleshooting tips for Azure Machine Learning inference HTTP server. To troubleshoot online endpoints, see [Troubleshoot online endpoints deployment](how-to-troubleshoot-online-endpoints.md).

[!INCLUDE [inference server TSGs](includes/machine-learning-inference-server-troubleshooting.md)]

## Related content

- [Deploy a model by using Azure Machine Learning](how-to-deploy-online-endpoints.md)
- Use [prebuilt docker images for inference](concept-prebuilt-docker-images-inference.md)
