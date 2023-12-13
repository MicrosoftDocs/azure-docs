---
title: Debug online endpoints locally in VS Code (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use Visual Studio Code to test and debug online endpoints locally before deploying them to Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 11/03/2021
ms.topic: troubleshooting
ms.custom: devplatv2, devx-track-azurecli, cliv2, ignite-2022
ms.devlang: azurecli
#Customer intent: As a machine learning engineer, I want to test and debug online endpoints locally using Visual Studio Code before deploying them Azure.
---

# Debug online endpoints locally in Visual Studio Code

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to use the Visual Studio Code (VS Code) debugger to test and debug online endpoints locally before deploying them to Azure.

Azure Machine Learning local endpoints help you test and debug your scoring script, environment configuration, code configuration, and machine learning model locally.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Online endpoint local debugging

Debugging endpoints locally before deploying them to the cloud can help you catch errors in your code and configuration earlier. You have different options for debugging endpoints locally with VS Code.

- [Azure Machine Learning inference HTTP server](how-to-inference-server-http.md)
- Local endpoint

This guide focuses on local endpoints.

The following table provides an overview of scenarios to help you choose what works best for you.

| Scenario | Inference HTTP Server | Local endpoint |
|--|--|--|
| Update local Python environment, **without** Docker image rebuild | Yes | No |
| Update scoring script | Yes | Yes |
| Update deployment configurations (deployment, environment, code, model) | No | Yes |
| VS Code Debugger integration | Yes | Yes |

## Prerequisites

# [Azure CLI](#tab/cli)

This guide assumes you have the following items installed locally on your PC.

- [Docker](https://docs.docker.com/engine/install/)
- [VS Code](https://code.visualstudio.com/#alt-downloads)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Azure CLI `ml` extension (v2)](how-to-configure-cli.md)

For more information, see the guide on [how to prepare your system to deploy online endpoints](how-to-deploy-online-endpoints.md#prepare-your-system).

The examples in this article are based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo and then change directories to the `cli` directory in the repo:

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples
cd cli
```

If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, use the following commands. Replace the following parameters with values for your specific configuration:

* Replace `<subscription>` with your Azure subscription ID.
* Replace `<workspace>` with your Azure Machine Learning workspace name.
* Replace `<resource-group>` with the Azure resource group that contains your workspace.
* Replace `<location>` with the Azure region that contains your workspace.

> [!TIP]
> You can see what your current defaults are by using the `az configure -l` command.

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

This guide assumes you have the following items installed locally on your PC.

- [Docker](https://docs.docker.com/engine/install/)
- [VS Code](https://code.visualstudio.com/#alt-downloads)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Azure CLI `ml` extension (v2)](how-to-configure-cli.md)
- [Azure Machine Learning Python SDK (v2)](https://aka.ms/sdk-v2-install)

For more information, see the guide on [how to prepare your system to deploy online endpoints](how-to-deploy-online-endpoints.md#prepare-your-system).

The examples in this article can be found in the [Debug online endpoints locally in Visual Studio Code](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/debug-online-endpoints-locally-in-visual-studio-code.ipynb) notebook within the[azureml-examples](https://github.com/azure/azureml-examples) repository. To run the code locally, clone the repo and then change directories to the notebook's parent directory `sdk/endpoints/online/managed`. 

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples
cd sdk/python/endpoints/online/managed
```

Import the required modules: 

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    CodeConfiguration,
    Environment,
)
from azure.identity import DefaultAzureCredential
``` 

Set up variables for the workspace and endpoint: 

```python 
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

endpoint_name = "<ENDPOINT_NAME>"
``` 

--- 

## Launch development container

# [Azure CLI](#tab/cli)

Azure Machine Learning local endpoints use Docker and VS Code development containers (dev container) to build and configure a local debugging environment. With dev containers, you can take advantage of VS Code features from inside a Docker container. For more information on dev containers, see [Create a development container](https://code.visualstudio.com/docs/remote/create-dev-container).

To debug online endpoints locally in VS Code, use the `--vscode-debug` flag when creating or updating and Azure Machine Learning online deployment. The following command uses a deployment example from the examples repo:

```azurecli
az ml online-deployment create --file endpoints/online/managed/sample/blue-deployment.yml --local --vscode-debug
```

> [!IMPORTANT]
> On Windows Subsystem for Linux (WSL), you'll need to update your PATH environment variable to include the path to the VS Code executable or use WSL interop. For more information, see [Windows interoperability with Linux](/windows/wsl/interop).

A Docker image is built locally. Any environment configuration or model file errors are surfaced at this stage of the process.

> [!NOTE]
> The first time you launch a new or updated dev container it can take several minutes.

Once the image successfully builds, your dev container opens in a VS Code window.

You'll use a few VS Code extensions to debug your deployments in the dev container. Azure Machine Learning automatically installs these extensions in your dev container.

- Inference Debug
- [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

> [!IMPORTANT]
> Before starting your debug session, make sure that the VS Code extensions have finished installing in your dev container.  


# [Python](#tab/python)

Azure Machine Learning local endpoints use Docker and VS Code development containers (dev container) to build and configure a local debugging environment. With dev containers, you can take advantage of VS Code features from inside a Docker container. For more information on dev containers, see [Create a development container](https://code.visualstudio.com/docs/remote/create-dev-container).

Get a handle to the workspace: 

```python 
credential = DefaultAzureCredential()
ml_client = MLClient(
    credential,
    subscription_id=subscription_id,
    resource_group_name=resource_group,
    workspace_name=workspace_name,
)
``` 

To debug online endpoints locally in VS Code, set the `vscode-debug` and `local` flags when creating or updating an Azure Machine Learning online deployment. The following code mirrors a deployment example from the examples repo:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/debug-online-endpoints-locally-in-visual-studio-code.ipynb?name=launch-container-4)]

> [!IMPORTANT]
> On Windows Subsystem for Linux (WSL), you'll need to update your PATH environment variable to include the path to the VS Code executable or use WSL interop. For more information, see [Windows interoperability with Linux](/windows/wsl/interop).

A Docker image is built locally. Any environment configuration or model file errors are surfaced at this stage of the process.

> [!NOTE]
> The first time you launch a new or updated dev container it can take several minutes.

Once the image successfully builds, your dev container opens in a VS Code window.

You'll use a few VS Code extensions to debug your deployments in the dev container. Azure Machine Learning automatically installs these extensions in your dev container.

- Inference Debug
- [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

> [!IMPORTANT]
> Before starting your debug session, make sure that the VS Code extensions have finished installing in your dev container.  

---



---

## Start debug session

Once your environment is set up, use the VS Code debugger to test and debug your deployment locally.

1. Open your scoring script in Visual Studio Code.

    > [!TIP]
    > The score.py script used by the endpoint deployed earlier is located at `azureml-samples/cli/endpoints/online/managed/sample/score.py` in the repository you cloned. However, the steps in this guide work with any scoring script.

1. Set a breakpoint anywhere in your scoring script.

    - To debug startup behavior, place your breakpoint(s) inside the `init` function.
    - To debug scoring behavior, place your breakpoint(s) inside the `run` function.

1. Select the VS Code Job view.
1. In the Run and Debug dropdown, select **AzureML: Debug Local Endpoint** to start debugging your endpoint locally.

    In the **Breakpoints** section of the Run view, check that:

    - **Raised Exceptions** is **unchecked**
    - **Uncaught Exceptions** is **checked**

    :::image type="content" source="media/how-to-debug-managed-online-endpoints-visual-studio-code/configure-debug-profile.png" alt-text="Configure Azure Machine Learning Debug Local Environment debug profile":::

1. Select the play icon next to the Run and Debug dropdown to start your debugging session.

    At this point, any breakpoints in your `init` function are caught. Use the debug actions to step through your code. For more information on debug actions, see the [debug actions guide](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).

For more information on the VS Code debugger, see [Debugging in VS Code](https://code.visualstudio.com/Docs/editor/debugging)

## Debug your endpoint

# [Azure CLI](#tab/cli)

Now that your application is running in the debugger, try making a prediction to debug your scoring script.

Use the `ml` extension `invoke` command to make a request to your local endpoint.

```azurecli
az ml online-endpoint invoke --name <ENDPOINT-NAME> --request-file <REQUEST-FILE> --local
```

In this case, `<REQUEST-FILE>` is a JSON file that contains input data samples for the model to make predictions on similar to the following JSON:

```json
{"data": [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]}
```

> [!TIP]
> The scoring URI is the address where your endpoint listens for requests. Use the `ml` extension to get the scoring URI.
>
>    ```azurecli
>    az ml online-endpoint show --name <ENDPOINT-NAME> --local
>    ```
>
> The output should look similar to the following:
>
> ```json
> {
>  "auth_mode": "aml_token",
>  "location": "local",
>  "name": "my-new-endpoint",
>  "properties": {},
>  "provisioning_state": "Succeeded",
>  "scoring_uri": "http://localhost:5001/score",
>  "tags": {},
>  "traffic": {},
>  "type": "online"
>}
>```
>
>The scoring URI can be found in the `scoring_uri` property.

At this point, any breakpoints in your `run` function are caught. Use the debug actions to step through your code. For more information on debug actions, see the [debug actions guide](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).


# [Python](#tab/python)

Now that your application is running in the debugger, try making a prediction to debug your scoring script.

Use the `invoke` method on your `MLClient` object to make a request to your local endpoint.

```python
endpoint = ml_client.online_endpoints.get(name=endpoint_name, local=True)

request_file_path = "../model-1/sample-request.json"

ml_client.online_endpoints.invoke(endpoint_name, request_file_path, local=True)
```

In this case, `<REQUEST-FILE>` is a JSON file that contains input data samples for the model to make predictions on similar to the following JSON:

```json
{"data": [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]}
```

> [!TIP]
> The scoring URI is the address where your endpoint listens for requests. The `as_dict` method of endpoint objects returns information similar to `show` in the Azure CLI. The endpoint object can be obtained through `.get`. 
>
>    ```python 
>    print(endpoint)
>    ```
>
> The output should look similar to the following:
>
> ```json
> {
>  "auth_mode": "aml_token",
>  "location": "local",
>  "name": "my-new-endpoint",
>  "properties": {},
>  "provisioning_state": "Succeeded",
>  "scoring_uri": "http://localhost:5001/score",
>  "tags": {},
>  "traffic": {},
>  "type": "online"
>}
>```
>
>The scoring URI can be found in the `scoring_uri` key.

At this point, any breakpoints in your `run` function are caught. Use the debug actions to step through your code. For more information on debug actions, see the [debug actions guide](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).


--- 


## Edit your endpoint

# [Azure CLI](#tab/cli)

As you debug and troubleshoot your application, there are scenarios where you need to update your scoring script and configurations.

To apply changes to your code:

1. Update your code
1. Restart your debug session using the `Developer: Reload Window` command in the command palette. For more information, see the [command palette documentation](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

> [!NOTE]
> Since the directory containing your code and endpoint assets is mounted onto the dev container, any changes you make in the dev container are synced with your local file system.

For more extensive changes involving updates to your environment and endpoint configuration, use the `ml` extension `update` command. Doing so will trigger a full image rebuild with your changes.

```azurecli
az ml online-deployment update --file <DEPLOYMENT-YAML-SPECIFICATION-FILE> --local --vscode-debug
```

Once the updated image is built and your development container launches, use the VS Code debugger to test and troubleshoot your updated endpoint.

# [Python](#tab/python)

As you debug and troubleshoot your application, there are scenarios where you need to update your scoring script and configurations.

To apply changes to your code:

1. Update your code
1. Restart your debug session using the `Developer: Reload Window` command in the command palette. For more information, see the [command palette documentation](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

> [!NOTE]
> Since the directory containing your code and endpoint assets is mounted onto the dev container, any changes you make in the dev container are synced with your local file system.

For more extensive changes involving updates to your environment and endpoint configuration, use your `MLClient`'s `online_deployments.update` module/method. Doing so will trigger a full image rebuild with your changes.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/debug-online-endpoints-locally-in-visual-studio-code.ipynb?name=edit-endpoint-1)]

Once the updated image is built and your development container launches, use the VS Code debugger to test and troubleshoot your updated endpoint.



--- 

## Next steps

- [Deploy and score a machine learning model by using an online endpoint)](how-to-deploy-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring)](how-to-troubleshoot-managed-online-endpoints.md)
