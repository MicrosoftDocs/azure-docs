---
title: Deploy machine learning models to online endpoints for inference
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as an online endpoint in Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 04/30/2024
reviewer: msakande
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, sdkv2, update-code
---

# Deploy and score a machine learning model by using an online endpoint

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn to deploy your model to an online endpoint for use in real-time inferencing. You begin by deploying a model on your local machine to debug any errors. Then, you deploy and test the model in Azure, view the deployment logs, and monitor the service-level agreement (SLA). By the end of this article, you'll have a scalable HTTPS/REST endpoint that you can use for real-time inference.

Online endpoints are endpoints that are used for real-time inferencing. There are two types of online endpoints: **managed online endpoints** and **Kubernetes online endpoints**. For more information on endpoints and differences between managed online endpoints and Kubernetes online endpoints, see [What are Azure Machine Learning endpoints](concept-endpoints-online.md#managed-online-endpoints-vs-kubernetes-online-endpoints)?

Managed online endpoints help to deploy your machine learning models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure.

The main example in this doc uses managed online endpoints for deployment. To use Kubernetes instead, see the notes in this document that are inline with the managed online endpoint discussion.

## Prerequisites

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. If you use the studio to create/manage online endpoints/deployments, you'll need an extra permission "Microsoft.Resources/deployments/write" from the resource group owner. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

# [Studio](#tab/azure-studio)

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace and a compute instance. If you don't have these resources and want to create them, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [ARM template](#tab/arm)

> [!NOTE]
> While the Azure CLI and CLI extension for machine learning are used in these steps, they're not the main focus. they're used more as utilities, passing templates to Azure and checking the status of template deployments.

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

---

* Ensure that you have enough virtual machine (VM) quota allocated for deployment. Azure Machine Learning reserves 20% of your compute resources for performing upgrades on some VM SKUs. For example, if you request 10 instances in a deployment, you must have a quota for 12 for each number of cores for the VM SKU. Failure to account for the extra compute resources results in an error. There are some VM SKUs that are exempt from the extra quota reservation. For more information on quota allocation, see [virtual machine quota allocation for deployment](how-to-manage-quotas.md#virtual-machine-quota-allocation-for-deployment).

* Alternatively, you could use quota from Azure Machine Learning's shared quota pool for a limited time. Users can access quota from this pool to perform testing for a limited time. When you use the studio to deploy Llama-2, Phi, Nemotron, Mistral, Dolly, and Deci-DeciLM models from the model catalog to a managed online endpoint, Azure Machine Learning allows you to access its shared quota pool for a short time so that you can perform testing. For more information on the shared quota pool, see [Azure Machine Learning shared quota](how-to-manage-quotas.md#azure-machine-learning-shared-quota).


## Prepare your system

# [Azure CLI](#tab/cli)

### Set environment variables

If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

### Clone the examples repository

To follow along with this article, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). Then, run the following code to go to the repository's `cli/` directory:

```azurecli
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

The commands in this tutorial are in the files `deploy-local-endpoint.sh` and `deploy-managed-online-endpoint.sh` in the `cli` directory, and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory.

> [!NOTE]
> The YAML configuration files for Kubernetes online endpoints are in the `endpoints/online/kubernetes/` subdirectory.

# [Python SDK](#tab/python)

### Clone the examples repository

To run the training examples, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples) and change into the `azureml-examples/sdk/python/endpoints/online/managed` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk/python/endpoints/online/managed
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

The information in this article is based on the [online-endpoints-simple-deployment.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/online-endpoints-simple-deployment.ipynb) notebook. It contains the same content as this article, although the order of the codes is slightly different.

### Connect to Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, you connect to the workspace in which you'll perform deployment tasks. To follow along, open your `online-endpoints-simple-deployment.ipynb` notebook.

1. Import the required libraries:

    ```python
    # import required libraries
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import (
        ManagedOnlineEndpoint,
        ManagedOnlineDeployment,
        Model,
        Environment,
        CodeConfiguration,
    )
    from azure.identity import DefaultAzureCredential
    ```

    > [!NOTE]
    > If you're using the Kubernetes online endpoint, import the `KubernetesOnlineEndpoint` and `KubernetesOnlineDeployment` class from the `azure.ai.ml.entities` library.

1. Configure workspace details and get a handle to the workspace:

    To connect to a workspace, you need identifier parameters - a subscription, resource group, and workspace name. You use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. This example uses the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential).

    ```python
    # enter details of your Azure Machine Learning workspace
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    workspace = "<AZUREML_WORKSPACE_NAME>"
    ```

    ```python
    # get a handle to the workspace
    ml_client = MLClient(
        DefaultAzureCredential(), subscription_id, resource_group, workspace
    )
    ```

# [Studio](#tab/azure-studio)

If you have Git installed on your local machine, you can follow the instructions to clone the examples repository. Otherwise, follow the instructions to download files from the examples repository.

### Clone the examples repository

To follow along with this article, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples) and then change into the `azureml-examples/cli/endpoints/online/model-1` directory.

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/cli/endpoints/online/model-1
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

### Download files from the examples repository

If you cloned the examples repo, your local machine already has copies of the files for this example, and you can skip to the next section. If you didn't clone the repo, you can download it to your local machine.

1. Go to [https://github.com/Azure/azureml-examples/](https://github.com/Azure/azureml-examples/).
1. Go to the **<> Code** button on the page, and then select **Download ZIP** from the **Local** tab.
1. Locate the folder `/cli/endpoints/online/model-1/model` and the file `/cli/endpoints/online/model-1/onlinescoring/score.py`.

# [ARM template](#tab/arm)

### Set environment variables

Set the following environment variables, as they're used in the examples in this article. Replace the values with your Azure subscription ID, the Azure region where your workspace is located, the resource group that contains the workspace, and the workspace name:

```bash
export SUBSCRIPTION_ID="your Azure subscription ID"
export LOCATION="Azure region where your workspace is located"
export RESOURCE_GROUP="Azure resource group that contains your workspace"
export WORKSPACE="Azure Machine Learning workspace name"
```

A couple of the template examples require you to upload files to the Azure Blob store for your workspace. The following steps query the workspace and store this information in environment variables used in the examples:

1. Get an access token:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="get_access_token":::

1. Set the REST API version:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="api_version":::

1. Get the storage information:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="get_storage_details":::

### Clone the examples repository

To follow along with this article, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). Then, run the following code to go to the examples directory:

```azurecli
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

---

## Define the endpoint

To define an online endpoint, specify the __endpoint name__ and __authentication mode__. For more information on managed online endpoints, see [Online endpoints](concept-endpoints-online.md#online-endpoints).

# [Azure CLI](#tab/cli)

### Set an endpoint name

To set your endpoint name, run the following command. Replace `YOUR_ENDPOINT_NAME` with a name that's unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

For Linux, run this command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="set_endpoint_name":::

### Configure the endpoint

The following snippet shows the *endpoints/online/managed/sample/endpoint.yml* file:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/endpoint.yml":::

The reference for the endpoint YAML format is described in the following table. To learn how to specify these attributes, see the [online endpoint YAML reference](reference-yaml-endpoint-online.md). For information about limits related to managed endpoints, see [limits for online endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

| Key         | Description                                                                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`   | (Optional) The YAML schema. To see all available options in the YAML file, you can view the schema in the preceding code snippet in a browser.                                                                                                                   |
| `name`      | The name of the endpoint.                                               |
| `auth_mode` | Use `key` for key-based authentication.<br>Use `aml_token` for Azure Machine Learning token-based authentication.<br>Use `aad_token` for Microsoft Entra token-based authentication (preview). <br>For more information on authenticating, see [Authenticate clients for online endpoints](how-to-authenticate-online-endpoint.md). |

# [Python SDK](#tab/python)

### Configure an endpoint

First define the name of the online endpoint, then configure the endpoint. 

Your endpoint name must be unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

```python
# Define an endpoint name
endpoint_name = "my-endpoint"

# Example way to define a random name
import datetime

endpoint_name = "endpt-" + datetime.datetime.now().strftime("%m%d%H%M%f")

# create an online endpoint
endpoint = ManagedOnlineEndpoint(
    name = endpoint_name, 
    description="this is a sample endpoint",
    auth_mode="key"
)
```

The previous code uses `key` for key-based authentication. To use Azure Machine Learning token-based authentication, use `aml_token`. To use Microsoft Entra token-based authentication (preview), use `aad_token`. For more information on authenticating, see [Authenticate clients for online endpoints](how-to-authenticate-online-endpoint.md).

# [Studio](#tab/azure-studio)

### Configure an endpoint

When you deploy to Azure from the studio, you'll create an endpoint and a deployment to add to it. At that time, you'll be prompted to provide names for the endpoint and deployment.

# [ARM template](#tab/arm)

### Set an endpoint name

To set your endpoint name, run the following command. Replace `YOUR_ENDPOINT_NAME` with a name that's unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

For Linux, run this command:

:::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" ID="set_endpoint_name":::

### Configure the endpoint

To define the endpoint and deployment, this article uses the Azure Resource Manager templates [online-endpoint.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint.json) and [online-endpoint-deployment.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint-deployment.json). To use the templates for defining an online endpoint and deployment, see the [Deploy to Azure](#deploy-to-azure) section.

---

## Define the deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. For this example, you deploy a scikit-learn model that does regression and use a scoring script _score.py_  to execute the model upon a given input request.

To learn about the key attributes of a deployment, see [Online deployments](concept-endpoints-online.md#online-deployments).


### Configure a deployment

Your deployment configuration uses the location of the model that you wish to deploy.

# [Azure CLI](#tab/cli)

The following snippet shows the *endpoints/online/managed/sample/blue-deployment.yml* file, with all the required inputs to configure a deployment:

__blue-deployment.yml__
:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/blue-deployment.yml":::

The _blue-deployment.yml_ file specifies the following deployment attributes:

- `model` - specifies the model properties inline, using the `path` (where to upload files from). The CLI automatically uploads the model files and registers the model with an autogenerated name.
- `environment` - using inline definitions that include where to upload files from, the CLI automatically uploads the `conda.yaml` file and registers the environment. Later, to build the environment, the deployment uses the `image` (in this example, it's `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest`) for the base image, and the `conda_file` dependencies are installed on top of the base image.
- `code_configuration` - during deployment, the local files such as the Python source for the scoring model, are uploaded from the development environment.

For more information about the YAML schema, see the [online endpoint YAML reference](reference-yaml-endpoint-online.md).

> [!NOTE]
> To use Kubernetes endpoints instead of managed online endpoints as a compute target:
> 1. Create and attach your Kubernetes cluster as a compute target to your Azure Machine Learning workspace by using [Azure Machine Learning studio](how-to-attach-kubernetes-to-workspace.md).
> 1. Use the [endpoint YAML](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/kubernetes/kubernetes-endpoint.yml) to target Kubernetes, instead of the managed endpoint YAML. You need to edit the YAML to change the value of `compute` to the name of your registered compute target. You can use this [deployment.yaml](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/kubernetes/kubernetes-blue-deployment.yml) that has additional properties applicable to a Kubernetes deployment.
>
> All the commands that are used in this article for managed online endpoints also apply to Kubernetes endpoints, except for the following capabilities that don't apply to Kubernetes endpoints:
> - The optional [SLA monitoring and Azure Log Analytics integration, using Azure Monitor](#optional-monitor-sla-by-using-azure-monitor)
> - Use of Microsoft Entra token
> - Autoscaling as described in the optional [Configure autoscaling](#optional-configure-autoscaling) section

# [Python SDK](#tab/python)


To configure a deployment:

```python
model = Model(path="../model-1/model/sklearn_regression_model.pkl")
env = Environment(
    conda_file="../model-1/environment/conda.yaml",
    image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest",
)

blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=endpoint_name,
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="../model-1/onlinescoring", scoring_script="score.py"
    ),
    instance_type="Standard_DS3_v2",
    instance_count=1,
)
```

- `Model` - specifies the model properties inline, using the `path` (where to upload files from). The SDK automatically uploads the model files and registers the model with an autogenerated name.
- `Environment` - using inline definitions that include where to upload files from, the SDK automatically uploads the `conda.yaml` file and registers the environment. Later, to build the environment, the deployment uses the `image` (in this example, it's `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest`) for the base image, and the `conda_file` dependencies are installed on top of the base image.
- `CodeConfiguration` - during deployment, the local files such as the Python source for the scoring model, are uploaded from the development environment.

For more information about online deployment definition, see [OnlineDeployment Class](/python/api/azure-ai-ml/azure.ai.ml.entities.onlinedeployment).



# [Studio](#tab/azure-studio)

### Configure a deployment

When you deploy to Azure, you'll create an endpoint and a deployment to add to it. At that time, you'll be prompted to provide names for the endpoint and deployment.

# [ARM template](#tab/arm)

### Configure the deployment

To define the endpoint and deployment, this article uses the Azure Resource Manager templates [online-endpoint.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint.json) and [online-endpoint-deployment.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint-deployment.json). To use the templates for defining an online endpoint and deployment, see the [Deploy to Azure](#deploy-to-azure) section.

---

## Understand the scoring script

> [!TIP]
> The format of the scoring script for online endpoints is the same format that's used in the preceding version of the CLI and in the Python SDK.

# [Azure CLI](#tab/cli)
The scoring script specified in `code_configuration.scoring_script` must have an `init()` function and a `run()` function.

# [Python SDK](#tab/python)
The scoring script must have an `init()` function and a `run()` function.

# [Studio](#tab/azure-studio)
The scoring script must have an `init()` function and a `run()` function.

# [ARM template](#tab/arm)

The scoring script must have an `init()` function and a `run()` function. This article uses the [score.py file](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/model-1/onlinescoring/score.py). 

When using a template for deployment, you must first upload the scoring file(s) to an Azure Blob store, and then register it:

1. The following code uses the Azure CLI command `az storage blob upload-batch` to upload the scoring file(s):

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="upload_code":::

1. The following code registers the code, using a template:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="create_code":::

---

This example uses the [score.py file](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/model-1/onlinescoring/score.py):
__score.py__
:::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score.py" :::

The `init()` function is called when the container is initialized or started. Initialization typically occurs shortly after the deployment is created or updated. The `init` function is the place to write logic for global initialization operations like caching the model in memory (as shown in this _score.py_ file).

The `run()` function is called every time the endpoint is invoked, and it does the actual scoring and prediction. In this _score.py_ file, the `run()` function extracts data from a JSON input, calls the scikit-learn model's `predict()` method, and then returns the prediction result.

## Deploy and debug locally by using a local endpoint

We *highly recommend* that you test-run your endpoint locally to validate and debug your code and configuration before you deploy to Azure. Azure CLI and Python SDK support local endpoints and deployments, while Azure Machine Learning studio and ARM template don't.

To deploy locally, [Docker Engine](https://docs.docker.com/engine/install/) must be installed and running. Docker Engine typically starts when the computer starts. If it doesn't, you can [troubleshoot Docker Engine](https://docs.docker.com/config/daemon/#start-the-daemon-manually).

> [!TIP]
> You can use [Azure Machine Learning inference HTTP server Python package](how-to-inference-server-http.md) to debug your scoring script locally **without Docker Engine**. Debugging with the inference server helps you to debug the scoring script before deploying to local endpoints so that you can debug without being affected by the deployment container configurations.

For more information on debugging online endpoints locally before deploying to Azure, see [Online endpoint debugging](concept-endpoints-online.md#online-endpoint-debugging).

### Deploy the model locally

First create an endpoint. Optionally, for a local endpoint, you can skip this step and directly create the deployment (next step), which will, in turn, create the required metadata. Deploying models locally is useful for development and testing purposes.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="create_endpoint":::

# [Python SDK](#tab/python)

```python
ml_client.online_endpoints.begin_create_or_update(endpoint, local=True)
```

# [Studio](#tab/azure-studio)

The studio doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

# [ARM template](#tab/arm)

The template doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

---

Now, create a deployment named `blue` under the endpoint.

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="create_deployment":::

The `--local` flag directs the CLI to deploy the endpoint in the Docker environment.

# [Python SDK](#tab/python)

```python
ml_client.online_deployments.begin_create_or_update(
    deployment=blue_deployment, local=True
)
```

The `local=True` flag directs the SDK to deploy the endpoint in the Docker environment.

# [Studio](#tab/azure-studio)

The studio doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

# [ARM template](#tab/arm)

The template doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

---

> [!TIP]
> Use Visual Studio Code to test and debug your endpoints locally. For more information, see [debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

### Verify that the local deployment succeeded

Check the deployment status to see whether the model was deployed without error:

# [Azure CLI](#tab/cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="get_status":::

The output should appear similar to the following JSON. The `provisioning_state` is `Succeeded`.

```json
{
  "auth_mode": "key",
  "location": "local",
  "name": "docs-endpoint",
  "properties": {},
  "provisioning_state": "Succeeded",
  "scoring_uri": "http://localhost:49158/score",
  "tags": {},
  "traffic": {}
}
```

# [Python SDK](#tab/python)

```python
ml_client.online_endpoints.get(name=endpoint_name, local=True)
```

The method returns [`ManagedOnlineEndpoint` entity](/python/api/azure-ai-ml/azure.ai.ml.entities.managedonlineendpoint). The `provisioning_state` is `Succeeded`.

```
ManagedOnlineEndpoint({'public_network_access': None, 'provisioning_state': 'Succeeded', 'scoring_uri': 'http://localhost:49158/score', 'swagger_uri': None, 'name': 'endpt-10061534497697', 'description': 'this is a sample endpoint', 'tags': {}, 'properties': {}, 'id': None, 'Resource__source_path': None, 'base_path': '/path/to/your/working/directory', 'creation_context': None, 'serialize': <msrest.serialization.Serializer object at 0x7ffb781bccd0>, 'auth_mode': 'key', 'location': 'local', 'identity': None, 'traffic': {}, 'mirror_traffic': {}, 'kind': None})
```

# [Studio](#tab/azure-studio)

The studio doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

# [ARM template](#tab/arm)

The template doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

---

The following table contains the possible values for `provisioning_state`:

| Value             | Description                                |
|-------------------|--------------------------------------------|
| **__Creating__**  | The resource is being created.             |
| **__Updating__**  | The resource is being updated.             |
| **__Deleting__**  | The resource is being deleted.             |
| **__Succeeded__** | The create/update operation succeeded.     |
| **__Failed__**    | The create/update/delete operation failed. |

### Invoke the local endpoint to score data by using your model

# [Azure CLI](#tab/cli)

Invoke the endpoint to score the model by using the `invoke` command and passing query parameters that are stored in a JSON file:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="test_endpoint":::

If you want to use a REST client (like curl), you must have the scoring URI. To get the scoring URI, run `az ml online-endpoint show --local -n $ENDPOINT_NAME`. In the returned data, find the `scoring_uri` attribute.

# [Python SDK](#tab/python)

Invoke the endpoint to score the model by using the `invoke` command and passing query parameters that are stored in a JSON file.

```python
ml_client.online_endpoints.invoke(
    endpoint_name=endpoint_name,
    request_file="../model-1/sample-request.json",
    local=True,
)
```

If you want to use a REST client (like curl), you must have the scoring URI. To get the scoring URI, run the following code. In the returned data, find the `scoring_uri` attribute.

```python
endpoint = ml_client.online_endpoints.get(endpoint_name, local=True)
scoring_uri = endpoint.scoring_uri
```

# [Studio](#tab/azure-studio)

The studio doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

# [ARM template](#tab/arm)

The template doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

---

### Review the logs for output from the invoke operation

In the example *score.py* file, the `run()` method logs some output to the console. 

# [Azure CLI](#tab/cli)

You can view this output by using the `get-logs` command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="get_logs":::

# [Python SDK](#tab/python)

You can view this output by using the `get_logs` method:

```python
ml_client.online_deployments.get_logs(
    name="blue", endpoint_name=endpoint_name, local=True, lines=50
)
```

# [Studio](#tab/azure-studio)

The studio doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

# [ARM template](#tab/arm)

The template doesn't support local endpoints. See the Azure CLI or Python tabs for steps to test the endpoint locally.

---

## Deploy your online endpoint to Azure

Next, deploy your online endpoint to Azure. As a best practice for production, we recommend that you register the model and environment that you'll use in your deployment.

### Register your model and environment

We recommend that you register your model and environment before deployment to Azure so that you can specify their registered names and versions during deployment. Registering your assets allows you to reuse them without the need to upload them every time you create deployments, thereby increasing reproducibility and traceability.

> [!NOTE]
> Unlike deployment to Azure, local deployment doesn't support using registered models and environments. Rather, local deployment uses local model files and uses environments with local files only.
> For deployment to Azure, you can use either local or registered assets (models and environments). In this section of the article, the deployment to Azure uses registered assets, but you have the option of using local assets instead. For an example of a deployment configuration that uploads local files to use for local deployment, see [Configure a deployment](#configure-a-deployment).

# [Azure CLI](#tab/cli)

To register the model and environment, use the form `model: azureml:my-model:1` or `environment: azureml:my-env:1`.
For registration, you can extract the YAML definitions of `model` and `environment` into separate YAML files and use the commands `az ml model create` and `az ml environment create`. To learn more about these commands, run `az ml model create -h` and `az ml environment create -h`.

1. Create a YAML definition for the model:

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/model.schema.json
    name: my-model
    path: ../../model-1/model/
    ```

1. Register the model:

    ```azurecli
    az ml model create -n my-model -v 1 -f ./model.yaml
    ```

1. Create a YAML definition for the environment:

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
    name: my-env
    image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest
    conda_file: ../../model-1/environment/conda.yaml
    ```

1. Register the environment:

    ```azurecli
    az ml environment create -n my-env -v 1 -f ./environment.yaml
    ```

For more information on registering your model as an asset, see [Register your model as an asset in Machine Learning by using the CLI](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-cli). For more information on creating an environment, see [Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md#create-a-custom-environment).

# [Python SDK](#tab/python)

1. Register a model

    ```python
    from azure.ai.ml.entities import Model
    from azure.ai.ml.constants import AssetTypes
    
    file_model = Model(
        path="../../model-1/model/",
        type=AssetTypes.CUSTOM_MODEL,
        name="my-model",
        description="Model created from local file.",
    )
    ml_client.models.create_or_update(file_model)
    ```

1. Register the environment:

    ```python
    from azure.ai.ml.entities import Environment
    
    env_docker_conda = Environment(
        image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04",
        conda_file="../../model-1/environment/conda.yaml",
        name="my-env",
        description="Environment created from a Docker image plus Conda environment.",
    )
    ml_client.environments.create_or_update(env_docker_conda)
    ```

To learn how to register your model as an asset so that you can specify its registered name and version during deployment, see [Register your model as an asset in Machine Learning by using the SDK](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-sdk).

For more information on creating an environment, see [Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md#create-a-custom-environment).


# [Studio](#tab/azure-studio)

### Register the model

A model registration is a logical entity in the workspace that can contain a single model file or a directory of multiple files. As a best practice for production, you should register the model and environment. Before creating the endpoint and deployment in this article, you should register the [model folder](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/model-1/model) that contains the model.

To register the example model, follow these steps:

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select **Register**, and then choose **From local files**.
1. Select __Unspecified type__ for the __Model type__.
1. Select __Browse__, and choose __Browse folder__.

    :::image type="content" source="media/how-to-deploy-online-endpoints/register-model-folder.png" alt-text="A screenshot of the browse folder option." lightbox="media/how-to-deploy-online-endpoints/register-model-folder.png":::

1. Select the `\azureml-examples\cli\endpoints\online\model-1\model` folder from the local copy of the repo you cloned or downloaded earlier. When prompted, select __Upload__ and wait for the upload to complete.
1. Select __Next__ after the folder upload is completed.
1. Enter a friendly __Name__ for the model. The steps in this article assume the model is named `model-1`.
1. Select __Next__, and then __Register__ to complete registration.

For more information on working with registered models, see [Register and work with models](how-to-manage-models.md).

### Create and register the environment

1. In the left navigation bar, select the **Environments** page.
1. Select **Create**.
1. On the "Settings" page, provide a name, such as `my-env` for the environment.
1. For "Select environment source" choose **Use existing docker image with optional conda source**.

    :::image type="content" source="media/how-to-deploy-online-endpoints/create-environment.png" alt-text="A screenshot showing how to create a custom environment." lightbox="media/how-to-deploy-online-endpoints/create-environment.png":::

1. Select **Next** to go to the "Customize" page.
1. Copy the contents of the `\azureml-examples\cli\endpoints\online\model-1\environment\conda.yaml` file from the local copy of the repo you cloned or downloaded earlier.
1. Paste the contents into the text box.

    :::image type="content" source="media/how-to-deploy-online-endpoints/customize-environment-with-conda-file.png" alt-text="A screenshot showing how to customize the environment, using a conda file." lightbox="media/how-to-deploy-online-endpoints/customize-environment-with-conda-file.png":::

1. Select **Next** until you get to the "Review" page.
1. select **Create**.

For more information on creating an environment in the studio, see [Create an environment](how-to-manage-environments-in-studio.md#create-an-environment).

# [ARM template](#tab/arm)

1. To register the model using a template, you must first upload the model file to an Azure Blob store. The following example uses the `az storage blob upload-batch` command to upload a file to the default storage for your workspace:

    :::code language="{language}" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="upload_model":::

1. After uploading the file, use the template to create a model registration. In the following example, the `modelUri` parameter contains the path to the model:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="create_model":::

1. Part of the environment is a conda file that specifies the model dependencies needed to host the model. The following example demonstrates how to read the contents of the conda file into environment variables:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="read_condafile":::

1. The following example demonstrates how to use the template to register the environment. The contents of the conda file from the previous step are passed to the template using the `condaFile` parameter:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="create_environment":::

---

### Configure a deployment that uses registered assets

Your deployment configuration uses the registered model that you wish to deploy and your registered environment..

# [Azure CLI](#tab/cli)

Use the registered assets (model and environment) in your deployment definition. The following snippet shows the `endpoints/online/managed/sample/blue-deployment-with-registered-assets.yml` file, with all the required inputs to configure a deployment:

__blue-deployment-with-registered-assets.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/blue-deployment-with-registered-assets.yml":::

# [Python SDK](#tab/python)

To configure a deployment, use the registered model and environment:

```python
model = "azureml:my-model:1"
env = "azureml:my-env:1"
 
blue_deployment_with_registered_assets = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=endpoint_name,
    model=model,
    environment=env,
    code_configuration=CodeConfiguration(
        code="../model-1/onlinescoring", scoring_script="score.py"
    ),
    instance_type="Standard_DS3_v2",
    instance_count=1,
)
```

# [Studio](#tab/azure-studio)

When you deploy from the studio, you'll create an endpoint and a deployment to add to it. At that time, you'll be prompted to provide names for the endpoint and deployment.

# [ARM template](#tab/arm)

To define the endpoint and deployment, this article uses the Azure Resource Manager templates [online-endpoint.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint.json) and [online-endpoint-deployment.json](https://github.com/Azure/azureml-examples/tree/main/arm-templates/online-endpoint-deployment.json). To use the templates for defining an online endpoint and deployment, see the [Deploy to Azure](#deploy-to-azure) section.

---

### Use different CPU and GPU instance types and images

# [Azure CLI](#tab/cli)

You can specify the CPU or GPU instance types and images in your deployment definition for both local deployment and deployment to Azure.

Your deployment definition in the _blue-deployment-with-registered-assets.yml_ file used a general-purpose type `Standard_DS3_v2` instance and a non-GPU Docker image `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest`. For GPU compute, choose a GPU compute type SKU and a GPU Docker image.

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For a list of Azure Machine Learning CPU and GPU base images, see [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

> [!NOTE]
> To use Kubernetes, instead of managed endpoints, as a compute target, see [Introduction to Kubernetes compute target](./how-to-attach-kubernetes-anywhere.md).

# [Python SDK](#tab/python)

You can specify the CPU or GPU instance types and images in your deployment configuration for both local deployment and deployment to Azure.

Earlier, you configured a deployment that used a general-purpose type `Standard_DS3_v2` instance and a non-GPU Docker image `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest`. For GPU compute, choose a GPU compute type SKU and a GPU Docker image.

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For a list of Azure Machine Learning CPU and GPU base images, see [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

> [!NOTE]
> To use Kubernetes, instead of managed endpoints, as a compute target, see [Introduction to Kubernetes compute target](./how-to-attach-kubernetes-anywhere.md).

# [Studio](#tab/azure-studio)

When using the studio to [deploy to Azure](#deploy-to-azure), you'll be prompted to specify the compute properties (instance type and instance count) and environment to use for your deployment.

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For more information on environments, see [Manage software environments in Azure Machine Learning studio](how-to-manage-environments-in-studio.md).

# [ARM template](#tab/arm)

The preceding registration of the environment specifies a non-GPU docker image `mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04` by passing the value to the `environment-version.json` template using the `dockerImage` parameter. For a GPU compute, provide a value for a GPU docker image to the template (using the `dockerImage` parameter) and provide a GPU compute type SKU to the `online-endpoint-deployment.json` template (using the `skuName` parameter).

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For a list of Azure Machine Learning CPU and GPU base images, see [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

---

Next, deploy your online endpoint to Azure.

### Deploy to Azure

# [Azure CLI](#tab/cli)

1. Create the endpoint in the Azure cloud.

    ::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="create_endpoint" :::

1. Create the deployment named `blue` under the endpoint.

    ```azurecli
    az ml online-deployment create -name blue --endpoint $ENDPOINT_NAME -f endpoints/online/managed/sample/blue-deployment-with-registered-assets.yml --all-traffic
    ```

    The deployment creation can take up to 15 minutes, depending on whether the underlying environment or image is being built for the first time. Subsequent deployments that use the same environment are processed faster.

    > [!TIP]
    > * If you prefer not to block your CLI console, you can add the flag `--no-wait` to the command. However, this option will stop the interactive display of the deployment status.

    > [!IMPORTANT]
    > The `--all-traffic` flag in the code `az ml online-deployment create` that's used to create the deployment allocates 100% of the endpoint traffic to the newly created blue deployment. Though this is helpful for development and testing purposes, for production, you might want to route traffic to the new deployment through an explicit command. For example, `az ml online-endpoint update -n $ENDPOINT_NAME --traffic "blue=100"`.

# [Python SDK](#tab/python)

1. Create the endpoint:

    Using the `endpoint` you defined earlier and the `MLClient` you created earlier, you can now create the endpoint in the workspace. This command starts the endpoint creation and returns a confirmation response while the endpoint creation continues.

    ```python
    ml_client.online_endpoints.begin_create_or_update(endpoint)
    ```

1. Create the deployment:

    Using the `blue_deployment_with_registered_assets` that you defined earlier and the `MLClient` you created earlier, you can now create the deployment in the workspace. This command starts the deployment creation and returns a confirmation response while the deployment creation continues.

    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment_with_registered_assets)
    ```

    > [!TIP]
    > * If you prefer not to block your Python console, you can add the flag `no_wait=True` to the parameters. However, this option will stop the interactive display of the deployment status.

    ```python
    # blue deployment takes 100 traffic
    endpoint.traffic = {"blue": 100}
    ml_client.online_endpoints.begin_create_or_update(endpoint)
    ```

# [Studio](#tab/azure-studio)

### Create a managed online endpoint and deployment

Use the studio to create a managed online endpoint directly in your browser. When you create a managed online endpoint in the studio, you must define an initial deployment. You can't create an empty managed online endpoint.

One way to create a managed online endpoint in the studio is from the **Models** page. This method also provides an easy way to add a model to an existing managed online deployment. To deploy the model named `model-1` that you registered previously in the [Register your model and environment](#register-your-model-and-environment) section:

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select the model named `model-1` by checking the circle next to its name.
1. Select **Deploy** > **Real-time endpoint**.

    :::image type="content" source="media/how-to-deploy-online-endpoints/deploy-from-models-page.png" lightbox="media/how-to-deploy-online-endpoints/deploy-from-models-page.png" alt-text="A screenshot of creating a managed online endpoint from the Models UI.":::
    
    This action opens up a window where you can specify details about your endpoint.

    :::image type="content" source="media/how-to-deploy-online-endpoints/online-endpoint-wizard.png" lightbox="media/how-to-deploy-online-endpoints/online-endpoint-wizard.png" alt-text="A screenshot of a managed online endpoint create wizard.":::

1. Enter an __Endpoint name__ that's unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).
1. Keep the default selection: __Managed__ for the compute type.
1. Keep the default selection: __key-based authentication__ for the authentication type. For more information on authenticating, see [Authenticate clients for online endpoints](how-to-authenticate-online-endpoint.md).
1. Select __Next__, until you get to the "Deployment" page. Here, toggle __Application Insights diagnostics__ to Enabled to allow you to view graphs of your endpoint's activities in the studio later and analyze metrics and logs using Application Insights.
1. Select __Next__ to go to the "Code + environment" page. Here, select the following options:

    * __Select a scoring script for inferencing__: Browse and select the `\azureml-examples\cli\endpoints\online\model-1\onlinescoring\score.py` file from the repo you cloned or downloaded earlier.
    * __Select environment__ section: Select **Custom environments** and then select the **my-env:1** environment that you created earlier.

    :::image type="content" source="media/how-to-deploy-online-endpoints/deploy-with-custom-environment.png" lightbox="media/how-to-deploy-online-endpoints/deploy-with-custom-environment.png" alt-text="A screenshot showing selection of a custom environment for deployment.":::

1. Select __Next__, accepting defaults, until you're prompted to create the deployment.
1. Review your deployment settings and select the __Create__ button.

Alternatively, you can create a managed online endpoint from the **Endpoints** page in the studio.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select **+ Create**.

    :::image type="content" source="media/how-to-deploy-online-endpoints/endpoint-create-managed-online-endpoint.png" lightbox="media/how-to-deploy-online-endpoints/endpoint-create-managed-online-endpoint.png" alt-text="A screenshot for creating managed online endpoint from the Endpoints tab.":::

This action opens up a window for you to select your model and specify details about your endpoint and deployment. Enter settings for your endpoint and deployment as described previously, then __Create__  the deployment.

# [ARM template](#tab/arm)

1. Use the template to create an online endpoint:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="create_endpoint":::

1. Deploy the model to the endpoint after the endpoint has been created:

    :::code language="azurecli" source="~/azureml-examples-main/deploy-arm-templates-az-cli.sh" id="create_deployment":::

---

To debug errors in your deployment, see [Troubleshooting online endpoint deployments](./how-to-troubleshoot-online-endpoints.md).

### Check the status of the endpoint

# [Azure CLI](#tab/cli)

1. Use the `show` command to display information in the `provisioning_state` for the endpoint and deployment:

    ::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_status" :::

1. List all the endpoints in the workspace in a table format by using the `list` command:

    ```azurecli
    az ml online-endpoint list --output table
    ```

# [Python SDK](#tab/python)

1. Check the endpoint's status to see whether the model was deployed without error:

    ```python
    ml_client.online_endpoints.get(name=endpoint_name)
    ```

1. List all the endpoints in the workspace in a table format by using the `list` method:

    ```python
    for endpoint in ml_client.online_endpoints.list():
        print(endpoint.name)
    ```

    The method returns a list (iterator) of `ManagedOnlineEndpoint` entities. 

1. You can get more information by specifying [more parameters](/python/api/azure-ai-ml/azure.ai.ml.entities.managedonlineendpoint#parameters). For example, output the list of endpoints like a table:

    ```python
    print("Kind\tLocation\tName")
    print("-------\t----------\t------------------------")
    for endpoint in ml_client.online_endpoints.list():
        print(f"{endpoint.kind}\t{endpoint.location}\t{endpoint.name}")
    ```

# [Studio](#tab/azure-studio)

### View managed online endpoints

You can view all your managed online endpoints in the **Endpoints** page. Go to the endpoint's **Details** page to find critical information including the endpoint URI, status, testing tools, activity monitors, deployment logs, and sample consumption code:

1. In the left navigation bar, select **Endpoints**. Here, you can see a list of all the endpoints in the workspace.
1. (Optional) Create a **Filter** on **Compute type** to show only **Managed** compute types.
1. Select an endpoint name to view the endpoint's __Details__ page.

    :::image type="content" source="media/how-to-deploy-online-endpoints/managed-endpoint-details-page.png" lightbox="media/how-to-deploy-online-endpoints/managed-endpoint-details-page.png" alt-text="Screenshot of managed endpoint details view.":::

# [ARM template](#tab/arm)

> [!TIP]
> While templates are useful for deploying resources, they can't be used to list, show, or invoke resources. Use the Azure CLI, Python SDK, or the studio to perform these operations. The following code uses the Azure CLI.

1. Use the `show` command to display information in the `provisioning_state` for the endpoint and deployment:

    ::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_status" :::

1. List all the endpoints in the workspace in a table format by using the `list` command:

    ```azurecli
    az ml online-endpoint list --output table
    ```

---

### Check the status of the online deployment

Check the logs to see whether the model was deployed without error.

# [Azure CLI](#tab/cli)

1. To see log output from a container, use the following CLI command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

    By default, logs are pulled from the inference server container. To see logs from the storage initializer container, add the `--container storage-initializer` flag. For more information on deployment logs, see [Get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs).

# [Python SDK](#tab/python)

1. You can view log output by using the `get_logs` method:

    ```python
    ml_client.online_deployments.get_logs(
        name="blue", endpoint_name=endpoint_name, lines=50
    )
    ```

1. By default, logs are pulled from the inference server container. To see logs from the storage initializer container, add the `container_type="storage-initializer"` option. For more information on deployment logs, see [Get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs).

    ```python
    ml_client.online_deployments.get_logs(
        name="blue", endpoint_name=endpoint_name, lines=50, container_type="storage-initializer"
    )
    ```

# [Studio](#tab/azure-studio)

To view log output, select the **Logs** tab from the endpoint's page. If you have multiple deployments in your endpoint, use the dropdown to select the deployment whose log you want to see.

:::image type="content" source="media/how-to-deploy-online-endpoints/deployment-logs.png" lightbox="media/how-to-deploy-online-endpoints/deployment-logs.png" alt-text="A screenshot of observing deployment logs in the studio.":::

By default, logs are pulled from the inference server. To see logs from the storage initializer container, use the Azure CLI or Python SDK (see each tab for details). Logs from the storage initializer container provide information on whether code and model data were successfully downloaded to the container. For more information on deployment logs, see [Get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs).

# [ARM template](#tab/arm)

> [!TIP]
> While templates are useful for deploying resources, they can't be used to list, show, or invoke resources. Use the Azure CLI, Python SDK, or the studio to perform these operations. The following code uses the Azure CLI.

1. To see log output from a container, use the following CLI command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

    By default, logs are pulled from the inference server container. To see logs from the storage initializer container, add the `--container storage-initializer` flag. For more information on deployment logs, see [Get container logs](how-to-troubleshoot-online-endpoints.md#get-container-logs).

---

### Invoke the endpoint to score data by using your model

# [Azure CLI](#tab/cli)

1. Use either the `invoke` command or a REST client of your choice to invoke the endpoint and score some data:

    ::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint" :::

1. Get the key used to authenticate to the endpoint:

    > [!TIP]
    > You can control which Microsoft Entra security principals can get the authentication key by assigning them to a custom role that allows `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` and `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listkeys/action`. For more information on managing authorization to workspaces, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl_get_key":::

1. Use curl to score data.

    ::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl" :::

    Notice you use `show` and `get-credentials` commands to get the authentication credentials. Also notice that you're using the `--query` flag to filter only the attributes that are needed. To learn more about the `--query` flag, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

1. To see the invocation logs, run `get-logs` again.

# [Python SDK](#tab/python)

Using the `MLClient` created earlier, get a handle to the endpoint. The endpoint can then be invoked using the `invoke` command with the following parameters:

- `endpoint_name` - Name of the endpoint
- `request_file` - File with request data
- `deployment_name` - Name of the specific deployment to test in an endpoint

1. Send a sample request using a [json](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/model-1/sample-request.json) file.

    ```python
    # test the blue deployment with some sample data
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        deployment_name="blue",
        request_file="../model-1/sample-request.json",
    )
    ```

# [Studio](#tab/azure-studio)

Use the **Test** tab in the endpoint's details page to test your managed online deployment. Enter sample input and view the results.

1. Select the **Test** tab in the endpoint's detail page.
1. Use the dropdown to select the deployment you want to test.
1. Enter the [sample input](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/model-1/sample-request.json).
1. Select **Test**.

    :::image type="content" source="media/how-to-deploy-online-endpoints/test-deployment.png" lightbox="media/how-to-deploy-online-endpoints/test-deployment.png" alt-text="A screenshot of testing a deployment by providing sample data, directly in your browser.":::

# [ARM template](#tab/arm)

> [!TIP]
> While templates are useful for deploying resources, they can't be used to list, show, or invoke resources. Use the Azure CLI, Python SDK, or the studio to perform these operations. The following code uses the Azure CLI.

1. Use either the `invoke` command or a REST client of your choice to invoke the endpoint and score some data:

    ```azurecli
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file cli/endpoints/online/model-1/sample-request.json
    ```

---

### (Optional) Update the deployment

# [Azure CLI](#tab/cli)

If you want to update the code, model, or environment, update the YAML file, and then run the `az ml online-endpoint update` command.

> [!NOTE]
> If you update instance count (to scale your deployment) along with other model settings (such as code, model, or environment) in a single `update` command, the scaling operation will be performed first, then the other updates will be applied. It's a good practice to perform these operations separately in a production environment.

To understand how `update` works:

1. Open the file *online/model-1/onlinescoring/score.py*.
1. Change the last line of the `init()` function: After `logging.info("Init complete")`, add `logging.info("Updated successfully")`. 
1. Save the file.
1. Run this command:

    ```azurecli
    az ml online-deployment update -n blue --endpoint $ENDPOINT_NAME -f endpoints/online/managed/sample/blue-deployment-with-registered-assets.yml
    ```

    > [!Note]
    > Updating by using YAML is declarative. That is, changes in the YAML are reflected in the underlying Azure Resource Manager resources (endpoints and deployments). A declarative approach facilitates [GitOps](https://www.atlassian.com/git/tutorials/gitops): *All* changes to endpoints and deployments (even `instance_count`) go through the YAML.

    > [!TIP]
    > * You can use [generic update parameters](/cli/azure/use-cli-effectively#generic-update-parameters), such as the `--set` parameter, with the CLI `update` command to override attributes in your YAML *or* to set specific attributes without passing them in the YAML file. Using `--set` for single attributes is especially valuable in development and test scenarios. For example, to scale up the `instance_count` value for the first deployment, you could use the `--set instance_count=2` flag. However, because the YAML isn't updated, this technique doesn't facilitate [GitOps](https://www.atlassian.com/git/tutorials/gitops).
    > * Specifying the YAML file is NOT mandatory. For example, if you wanted to test different concurrency setting for a given deployment, you can try something like `az ml online-deployment update -n blue -e my-endpoint --set request_settings.max_concurrent_requests_per_instance=4 environment_variables.WORKER_COUNT=4`. This will keep all existing configuration but update only the specified parameters.

1. Because you modified the `init()` function, which runs when the endpoint is created or updated, the message `Updated successfully` will be in the logs. Retrieve the logs by running:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

The `update` command also works with local deployments. Use the same `az ml online-deployment update` command with the `--local` flag.

# [Python SDK](#tab/python)

If you want to update the code, model, or environment, update the configuration, and then run the `MLClient`'s `online_deployments.begin_create_or_update` method to [create or update a deployment](/python/api/azure-ai-ml/azure.ai.ml.operations.onlinedeploymentoperations#azure-ai-ml-operations-onlinedeploymentoperations-begin-create-or-update).

> [!NOTE]
> If you update instance count (to scale your deployment) along with other model settings (such as code, model, or environment) in a single `begin_create_or_update` method, the scaling operation will be performed first, then the other updates will be applied. It's a good practice to perform these operations separately in a production environment.

To understand how `begin_create_or_update` works:

1. Open the file *online/model-1/onlinescoring/score.py*.
2. Change the last line of the `init()` function: After `logging.info("Init complete")`, add `logging.info("Updated successfully")`. 
3. Save the file.
4. Run the method:

    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment_with_registered_assets)
    ```

5. Because you modified the `init()` function, which runs when the endpoint is created or updated, the message `Updated successfully` will be in the logs. Retrieve the logs by running:

    ```python
    ml_client.online_deployments.get_logs(
        name="blue", endpoint_name=endpoint_name, lines=50
    )
    ```

The `begin_create_or_update` method also works with local deployments. Use the same method with the `local=True` flag.

# [Studio](#tab/azure-studio)

Currently, the studio allows you to make updates only to the instance count of a deployment. Use the following instructions to scale an individual deployment up or down by adjusting the number of instances:

1. Open the endpoint's **Details** page and find the card for the deployment you want to update.
1. Select the edit icon (pencil icon) next to the deployment's name.
1. Update the instance count associated with the deployment. You can choose between **Default** or **Target Utilization** for "Deployment scale type".
    - If you select **Default**, you cal also specify a numerical value for the **Instance count**.
    - If you select **Target Utilization**, you can specify values to use for parameters when autoscaling the deployment.
1. Select **Update** to finish updating the instance counts for your deployment.


# [ARM template](#tab/arm)

There currently isn't an option to update the deployment using an ARM template.

---

> [!NOTE]
> The update to the deployment in this section is an example of an in-place rolling update.
> * For a managed online endpoint, the deployment is updated to the new configuration with 20% nodes at a time. That is, if the deployment has 10 nodes, 2 nodes at a time are updated.
> * For a Kubernetes online endpoint, the system iteratively creates a new deployment instance with the new configuration and deletes the old one.
> * For production usage, you should consider [blue-green deployment](how-to-safely-rollout-online-endpoints.md), which offers a safer alternative for updating a web service.

### (Optional) Configure autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed online endpoints support autoscaling through integration with the Azure monitor autoscale feature. To configure autoscaling, see [How to autoscale online endpoints](how-to-autoscale-endpoints.md).

### (Optional) Monitor SLA by using Azure Monitor

To view metrics and set alerts based on your SLA, complete the steps that are described in [Monitor online endpoints](how-to-monitor-online-endpoints.md).

### (Optional) Integrate with Log Analytics

The `get-logs` command for CLI or the `get_logs` method for SDK provides only the last few hundred lines of logs from an automatically selected instance. However, Log Analytics provides a way to durably store and analyze logs. For more information on using logging, see [Monitor online endpoints](how-to-monitor-online-endpoints.md#logs).

<!-- [!INCLUDE [Email Notification Include](includes/machine-learning-email-notifications.md)] -->

## Delete the endpoint and the deployment

# [Azure CLI](#tab/cli)

Delete the endpoint and all its underlying deployments:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

# [Python SDK](#tab/python)

Delete the endpoint and all its underlying deployments:

```python
ml_client.online_endpoints.begin_delete(name=endpoint_name)
```

# [Studio](#tab/azure-studio)

If you aren't going use the endpoint and deployment, you should delete them. By deleting the endpoint, you also delete all its underlying deployments.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select an endpoint by checking the circle next to the model name.
1. Select **Delete**.

Alternatively, you can delete a managed online endpoint directly by selecting the **Delete** icon in the [endpoint details page](#view-managed-online-endpoints).

# [ARM template](#tab/arm)

Delete the endpoint and all its underlying deployments:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

---

## Related content

- [Perform safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
