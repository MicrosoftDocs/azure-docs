---
title: Debug managed online endpoints deployment VS Code (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use Visual Studio Code to test and debug managed online endpoints locally before deploying them to Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: luisquintanilla
ms.author:  luquinta
ms.date: 08/30/2021
ms.topic: troubleshooting
ms.custom: devplatv2
#Customer intent: As a machine learning engineer, I want to test and debug managed online endpoints locally using Visual Studio Code before deploying them Azure.
---

# Debug managed online endpoints locally in Visual Studio Code (preview)

Learn how to use the Visual Studio Code (VS Code) debugger to test and debug managed online endpoints locally before deploying them to Azure.

Azure Machine Learning Local Endpoints helps test and debug your scoring script, environment configuration, code configuration, and machine learning model locally.

## Local debugging options

You have different options for debugging locally with the VS Code.

- Inference HTTP Server package
- Local Endpoints

The following table provides an overview of scenarios to help you choose what works best for you.

| Scenario | Inference HTTP Server Package | Local Endpoint |
|--|--|--|
| Iterate on local python environment, without re-build of image | Yes | No |
| Iterate on scoring script | Yes | Yes |
| Iterate on deployment configurations (deployment, environment, code, model) | No | Yes |
| VSCode Debugger integration | Yes | Yes |

This guide goes through local endpoints.  

## Prerequisites

This guide assumes you have the following items installed locally on your PC.

- Docker
- Visual Studio Code
- Azure CLI
- Azure Machine Learning 2.0 CLI extension

For more information, see [how to deploy managed online endpoints](how-to-deploy-managed-online-endpoints#prepare-your-system).

## Start development container

Azure Machine Learning Local Endpoints use Docker and Visual Studio Code development containers (dev container) to build and configure your local debug environment. As a result you can take advantage of Visual Studio Code features from inside a Docker container. For more information on dev containers, see [Create a development container](https://code.visualstudio.com/docs/remote/create-dev-container).

To debug managed online endpoints locally, use the --vscode-debug flag when creating or updating and online deployment.

```azurecli
az ml online-deployment create --endpoint-name <ENDPOINT-NAME> --name <DEPLOYMENT-NAME> --file <DEPLOYMENT-FILE> --local --vscode-debug
```

A local Azure Machine Learning Docker image is built. Any environment or model file errors are surfaced at this stage of the process.

Once the image successfully builds, your development container opens in a Visual Studio Code window.

You'll use a few Visual Studio Code extensions to debug your deployments in the dev container:

- Pylance
- Jupyter
- Python

Azure Machine Learning automatically installs these extensions in your dev container.

> [!IMPORTANT]
> Before starting your debug session, make sure that the Visual Studio Code extensions have finished installing in your dev container.  

## Start debugging session

Once your environment is setup, use the Visual Studio Code debugger to test and debug your deployment locally.

1. Open your scoring script in Visual Studio. In this guide, the sample used is the [*simple-flow*](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/simple-flow) sample in the [*azureml-examples*](https://github.com/Azure/azureml-examples) repository.
1. Set a breakpoint anywhere in your scoring script. To debug startup behavior, place your breakpoint(s) inside the `init` function. For scoring behavior, place your breakpoint(s) inside the `run` function. 
1. Select the Visual Studio Code Run and Debug view. 
1. In the **Breakpoints** section of the Run and Debug view:
    1. Uncheck **Raised Exceptions**
    1. Check **Caught Exceptions**
1. In the Run and Debug dropdown, select **Azure ML: Debug Local Endpoint** to start debugging your endpoint locally.
1. Use the debug actions to step through your code. For more information on debug actions, see the [debug actions guide](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).

## Make predictions

Now that your application is running in the debugger, try making a prediction to debug your code.

1. Use the 2.0 CLI to make a request to your local endpoint. 

    ```azurecli
    az ml online-endpoint invoke --name <ENDPOINT-NAME> --request-file <REQUEST-FILE> --local
    ```

    In this case, `<REQUEST-FILE>` is a JSON file called *sample-request.json* which contains input data samples for the model to make predictions on.

    ```json
    {"data": [
        [1,2,3,4,5,6,7,8,9,10], 
        [10,9,8,7,6,5,4,3,2,1]
    ]}
    ```

    > [!IMPORTANT]
    > When using something other than the 2.0 CLI, you need to know the `scoring_uri` where your deployment is listening for requests. Use the 2.0 CLI to get the `scoring_uri` for your endpoint.
    >
    >    ```azurecli
    >    az ml online-endpoint show --name $ENDPOINT_NAME --local
    >    ```

## Editing your endpoint

TODO: Add edit instructions