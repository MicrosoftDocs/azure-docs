---
title: Safe rollout for online endpoints 
titleSuffix: Azure Machine Learning
description: Roll out newer versions of ML models without disruption.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 10/24/2023
reviewer: msakande
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, event-tier1-build-2022, sdkv2
---

# Perform safe rollout of new deployments for real-time inference

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to deploy a new version of a machine learning model in production without causing any disruption. You'll use a blue-green deployment strategy (also known as a safe rollout strategy) to introduce a new version of a web service to production. This strategy will allow you to roll out your new version of the web service to a small subset of users or requests before rolling it out completely.

This article assumes you're using online endpoints, that is, endpoints that are used for online (real-time) inferencing. There are two types of online endpoints: **managed online endpoints** and **Kubernetes online endpoints**. For more information on endpoints and the differences between managed online endpoints and Kubernetes online endpoints, see [What are Azure Machine Learning endpoints?](concept-endpoints-online.md#managed-online-endpoints-vs-kubernetes-online-endpoints).

The main example in this article uses managed online endpoints for deployment. To use Kubernetes endpoints instead, see the notes in this document that are inline with the managed online endpoint discussion.

In this article, you'll learn to:

> [!div class="checklist"]
> * Define an online endpoint with a deployment called "blue" to serve version 1 of a model
> * Scale the blue deployment so that it can handle more requests
> * Deploy version 2 of the model (called the "green" deployment) to the endpoint, but send the deployment no live traffic
> * Test the green deployment in isolation
> * Mirror a percentage of live traffic to the green deployment to validate it
> * Send a small percentage of live traffic to the green deployment
> * Send over all live traffic to the green deployment
> * Delete the now-unused v1 blue deployment

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

# [Studio](#tab/azure-studio)

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace and a compute instance. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

---

## Prepare your system

# [Azure CLI](#tab/azure-cli)

### Set environment variables

If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription id>
   az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

### Clone the examples repository

To follow along with this article, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). Then, go to the repository's `cli/` directory:

```azurecli
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository. This reduces the time to complete the operation.

The commands in this tutorial are in the file `deploy-safe-rollout-online-endpoints.sh` in the `cli` directory, and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory.

> [!NOTE]
> The YAML configuration files for Kubernetes online endpoints are in the `endpoints/online/kubernetes/` subdirectory.

# [Python](#tab/python)

### Clone the examples repository

To run the training examples, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). Then, go into the `azureml-examples/sdk/python/endpoints/online/managed` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk/python/endpoints/online/managed
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository. This reduces the time to complete the operation.

The information in this article is based on the [online-endpoints-safe-rollout.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb) notebook. It contains the same content as this article, although the order of the codes is slightly different.

> [!NOTE]
> The steps for the Kubernetes online endpoint are based on the [kubernetes-online-endpoints-safe-rollout.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/kubernetes/kubernetes-online-endpoints-safe-rollout.ipynb) notebook.

### Connect to Azure Machine Learning workspace

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace where you'll perform deployment tasks. To follow along, open your `online-endpoints-safe-rollout.ipynb` notebook.

1. Import the required libraries:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=import_libraries)]

    > [!NOTE]
    > If you're using the Kubernetes online endpoint, import the `KubernetesOnlineEndpoint` and `KubernetesOnlineDeployment` class from the `azure.ai.ml.entities` library.

1. Configure workspace details and get a handle to the workspace:

    To connect to a workspace, we need identifier parameters—a subscription, resource group and workspace name. We'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. This example uses the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential).

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=workspace_details)]

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=workspace_handle)]

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
1. Locate the model folder `/cli/endpoints/online/model-1/model` and scoring script `/cli/endpoints/online/model-1/onlinescoring/score.py` for a first model `model-1`.
1. Locate the model folder `/cli/endpoints/online/model-2/model` and scoring script `/cli/endpoints/online/model-2/onlinescoring/score.py` for a second model `model-2`.

---

## Define the endpoint and deployment

Online endpoints are used for online (real-time) inferencing. Online endpoints contain deployments that are ready to receive data from clients and send responses back in real time.

### Define an endpoint

The following table lists key attributes to specify when you define an endpoint.

| Attribute                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name                      | **Required.** Name of the endpoint. It must be unique in the Azure region. For more information on the naming rules, see [endpoint limits](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).                                                                                                                                                                                                                                                                                                                                                                                                     |
| Authentication mode      | The authentication method for the endpoint. Choose between key-based authentication `key` and Azure Machine Learning token-based authentication `aml_token`. A key doesn't expire, but a token does expire. For more information on authenticating, see [Authenticate to an online endpoint](how-to-authenticate-online-endpoint.md).                                                                                                                                                                                                                                                                                         |
| Description    | Description of the endpoint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Tags           | Dictionary of tags for the endpoint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Traffic        | Rules on how to route traffic across deployments. Represent the traffic as a dictionary of key-value pairs, where key represents the deployment name and value represents the percentage of traffic to that deployment. You can set the traffic only when the deployments under an endpoint have been created. You can also update the traffic for an online endpoint after the deployments have been created. For more information on how to use mirrored traffic, see [Allocate a small percentage of live traffic to the new deployment](#allocate-a-small-percentage-of-live-traffic-to-the-new-deployment). |
| Mirror traffic | Percentage of live traffic to mirror to a deployment. For more information on how to use mirrored traffic, see [Test the deployment with mirrored traffic](#test-the-deployment-with-mirrored-traffic).                                                                                                                                                                                                                                                                                                                                                                                                     |

To see a full list of attributes that you can specify when you create an endpoint, see [CLI (v2) online endpoint YAML schema](/azure/machine-learning/reference-yaml-endpoint-online) or [SDK (v2) ManagedOnlineEndpoint Class](/python/api/azure-ai-ml/azure.ai.ml.entities.managedonlineendpoint).

### Define a deployment

A *deployment* is a set of resources required for hosting the model that does the actual inferencing. The following table describes key attributes to specify when you define a deployment.


| Attribute      | Description                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name           | **Required.** Name of the deployment.                                                                                                                                                                                                                                                                                                                                                                    |
| Endpoint name  | **Required.** Name of the endpoint to create the deployment under.                                                                                                                                                                                                                                                                                                                                       |
| Model          | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. In the example, we have a scikit-learn model that does regression.                                                                                                                                                                                                                                    |
| Code path      | The path to the directory on the local development environment that contains all the Python source code for scoring the model. You can use nested directories and packages.                                                                                                                                                                                                                    |
| Scoring script | Python code that executes the model on a given input request. This value can be the relative path to the scoring file in the source code directory.<br>The scoring script receives data submitted to a deployed web service and passes it to the model. The script then executes the model and returns its response to the client. The scoring script is specific to your model and must understand the data that the model expects as input and returns as output.<br>In this example, we have a *score.py* file. This Python code must have an `init()` function and a `run()` function. The `init()` function will be called after the model is created or updated (you can use it to cache the model in memory, for example). The `run()` function is called at every invocation of the endpoint to do the actual scoring and prediction.  |
| Environment    | **Required.** The environment to host the model and code. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. The environment can be a Docker image with Conda dependencies, a Dockerfile, or a registered environment.                                                                                                                                                                                                                 |
| Instance type  | **Required.** The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).                                                                                                                                                                                                                            |
| Instance count | **Required.** The number of instances to use for the deployment. Base the value on the workload you expect. For high availability, we recommend that you set the value to at least `3`. We reserve an extra 20% for performing upgrades. For more information, see [limits for online endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).                                |

To see a full list of attributes that you can specify when you create a deployment, see [CLI (v2) managed online deployment YAML schema](/azure/machine-learning/reference-yaml-deployment-managed-online) or
[SDK (v2) ManagedOnlineDeployment Class](/python/api/azure-ai-ml/azure.ai.ml.entities.managedonlinedeployment).

# [Azure CLI](#tab/azure-cli)

### Create online endpoint

First set the endpoint's name and then configure it. In this article, you'll use the *endpoints/online/managed/sample/endpoint.yml* file to configure the endpoint. The following snippet shows the contents of the file:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/endpoint.yml":::

The reference for the endpoint YAML format is described in the following table. To learn how to specify these attributes, see the [online endpoint YAML reference](reference-yaml-endpoint-online.md). For information about limits related to managed online endpoints, see [limits for online endpoints](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).

| Key         | Description                                                                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`   | (Optional) The YAML schema. To see all available options in the YAML file, you can view the schema in the preceding code snippet in a browser.                                                                                                                   |
| `name`      | The name of the endpoint.                                               |
| `auth_mode` | Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. To get the most recent token, use the `az ml online-endpoint get-credentials` command. |

To create an online endpoint:

1. Set your endpoint name:

   For Unix, run this command (replace `YOUR_ENDPOINT_NAME` with a unique name):

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="set_endpoint_name":::

    > [!IMPORTANT]
    > Endpoint names must be unique within an Azure region. For example, in the Azure `westus2` region, there can be only one endpoint with the name `my-endpoint`.

1. Create the endpoint in the cloud:

   Run the following code to use the `endpoint.yml` file to configure the endpoint:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_endpoint":::

### Create the 'blue' deployment

In this article, you'll use the *endpoints/online/managed/sample/blue-deployment.yml* file to configure the key aspects of the deployment. The following snippet shows the contents of the file:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/blue-deployment.yml":::

To create a deployment named `blue` for your endpoint, run the following command to use the `blue-deployment.yml` file to configure 

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_blue":::

> [!IMPORTANT]
> The `--all-traffic` flag in the `az ml online-deployment create` allocates 100% of the endpoint traffic to the newly created blue deployment.

In the `blue-deployment.yaml` file, we specify the `path` (where to upload files from) inline. The CLI automatically uploads the files and registers the model and environment. As a best practice for production, you should register the model and environment and specify the registered name and version separately in the YAML. Use the form `model: azureml:my-model:1` or `environment: azureml:my-env:1`.

For registration, you can extract the YAML definitions of `model` and `environment` into separate YAML files and use the commands `az ml model create` and `az ml environment create`. To learn more about these commands, run `az ml model create -h` and `az ml environment create -h`.

For more information on registering your model as an asset, see [Register your model as an asset in Machine Learning by using the CLI](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-cli). For more information on creating an environment, see [Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md#create-an-environment).

# [Python](#tab/python)

### Create online endpoint

To create a managed online endpoint, use the `ManagedOnlineEndpoint` class. This class allows users to configure the key aspects of the endpoint.

1. Configure the endpoint:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=configure_endpoint)]

    > [!NOTE]
    > To create a Kubernetes online endpoint, use the `KubernetesOnlineEndpoint` class.

1. Create the endpoint:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=create_endpoint)]

### Create the 'blue' deployment

To create a deployment for your managed online endpoint, use the `ManagedOnlineDeployment` class. This class allows users to configure the key aspects of the deployment.
The following table describes the attributes of a `deployment`:

1. Configure blue deployment:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=configure_deployment)]

    In this example, we specify the `path` (where to upload files from) inline. The SDK automatically uploads the files and registers the model and environment. As a best practice for production, you should register the model and environment and specify the registered name and version separately in the codes.

    For more information on registering your model as an asset, see [Register your model as an asset in Machine Learning by using the SDK](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-sdk).

    For more information on creating an environment, see [Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md#create-an-environment).

    > [!NOTE]
    > To create a deployment for a Kubernetes online endpoint, use the `KubernetesOnlineDeployment` class.

1. Create the deployment:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=create_deployment)]

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=deployment_traffic)]

# [Studio](#tab/azure-studio)

When you create a managed online endpoint in the Azure Machine Learning studio, you must define an initial deployment for the endpoint. Before you can define a deployment, you must have a registered model in your workspace. Let's begin by registering the model to use for the deployment.

### Register your model

A model registration is a logical entity in the workspace. This entity can contain a single model file or a directory of multiple files. As a best practice for production, you should register the model and environment. When creating the endpoint and deployment in this article, we'll assume that you've registered the [model folder](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/model-1/model) that contains the model.

To register the example model, follow these steps:

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select **Register**, and then choose **From local files**.
1. Select __Unspecified type__ for the __Model type__.
1. Select __Browse__, and choose __Browse folder__.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/register-model-folder.png" alt-text="A screenshot of the browse folder option." lightbox="media/how-to-safely-rollout-managed-endpoints/register-model-folder.png":::

1. Select the `\azureml-examples\cli\endpoints\online\model-1\model` folder from the local copy of the repo you cloned or downloaded earlier. When prompted, select __Upload__ and wait for the upload to complete.
1. Select __Next__ after the folder upload is completed.
1. Enter a friendly __Name__ for the model. The steps in this article assume the model is named `model-1`.
1. Select __Next__, and then __Register__ to complete registration.
1. Repeat the previous steps to register a `model-2` from the `\azureml-examples\cli\endpoints\online\model-2\model` folder in the local copy of the repo you cloned or downloaded earlier.

For more information on working with registered models, see [Register and work with models](how-to-manage-models.md).

For information on creating an environment in the studio, see [Create an environment](how-to-manage-environments-in-studio.md#create-an-environment).

### Create a managed online endpoint and the 'blue' deployment

Use the Azure Machine Learning studio to create a managed online endpoint directly in your browser. When you create a managed online endpoint in the studio, you must define an initial deployment. You can't create an empty managed online endpoint.

One way to create a managed online endpoint in the studio is from the **Models** page. This method also provides an easy way to add a model to an existing managed online deployment. To deploy the model named `model-1` that you registered previously in the [Register your model](#register-your-model) section:

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select the model named `model-1` by checking the circle next to its name.
1. Select **Deploy** > **Real-time endpoint**.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/deploy-from-models-page.png" lightbox="media/how-to-safely-rollout-managed-endpoints/deploy-from-models-page.png" alt-text="A screenshot of creating a managed online endpoint from the Models UI.":::
    
    This action opens up a window where you can specify details about your endpoint.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/online-endpoint-wizard.png" lightbox="media/how-to-safely-rollout-managed-endpoints/online-endpoint-wizard.png" alt-text="A screenshot of a managed online endpoint create wizard.":::

1. Enter an __Endpoint name__.
1. Keep the default selections: __Managed__ for the compute type and __key-based authentication__ for the authentication type.
1. Select __Next__, until you get to the "Deployment" page. Here, perform the following tasks:

    * Name the deployment "blue".
    * Check the box for __Enable Application Insights diagnostics and data collection__ to allow you to view graphs of your endpoint's activities in the studio later.

1. Select __Next__ to go to the "Environment" page. Here, perform following steps:

    * In the "Select scoring file and dependencies" box, browse and select the `\azureml-examples\cli\endpoints\online\model-1\onlinescoring\score.py` file from the repo you cloned or downloaded earlier.
    * Start typing `sklearn` in the search box above the list of environments, and select the **AzureML-sklearn-0.24** curated environment.

1. Select __Next__ to go to the "Compute" page. Here, keep the default selection for the virtual machine "Standard_DS3_v2" and change the __Instance count__ to 1.
1. Select __Next__, to accept the default traffic allocation (100%) to the blue deployment.
1. Review your deployment settings and select the __Create__ button.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/review-deployment-creation-page.png" lightbox="media/how-to-safely-rollout-managed-endpoints/review-deployment-creation-page.png" alt-text="A screenshot showing the review page for creating a managed online endpoint with a deployment.":::

Alternatively, you can create a managed online endpoint from the **Endpoints** page in the studio.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select **+ Create**.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/endpoint-create-managed-online-endpoint.png" lightbox="media/how-to-safely-rollout-managed-endpoints/endpoint-create-managed-online-endpoint.png" alt-text="A screenshot for creating managed online endpoint from the Endpoints tab.":::

This action opens up a window for you to specify details about your endpoint and deployment. Enter settings for your endpoint and deployment as described in the previous steps 5-11, accepting defaults until you're prompted to __Create__  the deployment.

---

## Confirm your existing deployment

One way to confirm your existing deployment is to invoke your endpoint so that it can score your model for a given input request. When you invoke your endpoint via the CLI or Python SDK, you can choose to specify the name of the deployment that will receive the incoming traffic.

> [!NOTE]
> Unlike the CLI or Python SDK, Azure Machine Learning studio requires you to specify a deployment when you invoke an endpoint.

### Invoke endpoint with deployment name

If you invoke the endpoint with the name of the deployment that will receive traffic, Azure Machine Learning will route the endpoint's traffic directly to the specified deployment and return its output. You can use the `--deployment-name` option [for CLI v2](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-invoke-optional-parameters), or `deployment_name` option [for SDK v2](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-invoke) to specify the deployment.

### Invoke endpoint without specifying deployment

If you invoke the endpoint without specifying the deployment that will receive traffic, Azure Machine Learning will route the endpoint's incoming traffic to the deployment(s) in the endpoint based on traffic control settings.

Traffic control settings allocate specified percentages of incoming traffic to each deployment in the endpoint. For example, if your traffic rules specify that a particular deployment in your endpoint will receive incoming traffic 40% of the time, Azure Machine Learning will route 40% of the endpoint's traffic to that deployment.

# [Azure CLI](#tab/azure-cli)

You can view the status of your existing endpoint and deployment by running:

```azurecli
az ml online-endpoint show --name $ENDPOINT_NAME 

az ml online-deployment show --name blue --endpoint $ENDPOINT_NAME 
```

You should see the endpoint identified by `$ENDPOINT_NAME` and, a deployment called `blue`.

### Test the endpoint with sample data

The endpoint can be invoked using the `invoke` command. We'll send a sample request using a [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-1/sample-request.json) file.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_blue" :::

# [Python](#tab/python)

Check the status to see whether the model was deployed without error:

```python
ml_client.online_endpoints.get(name=online_endpoint_name)
```

### Test the endpoint with sample data

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

* `endpoint_name` - Name of the endpoint
* `request_file` - File with request data
* `deployment_name` - Name of the specific deployment to test in an endpoint

We'll send a sample request using a [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-1/sample-request.json) file.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=test_deployment)]

# [Studio](#tab/azure-studio)

### View managed online endpoints

You can view all your managed online endpoints in the **Endpoints** page. Go to the endpoint's **Details** page to find critical information including the endpoint URI, status, testing tools, activity monitors, deployment logs, and sample consumption code:

1. In the left navigation bar, select **Endpoints**. Here, you can see a list of all the endpoints in the workspace.
1. (Optional) Create a **Filter** on **Compute type** to show only **Managed** compute types.
1. Select an endpoint name to view the endpoint's __Details__ page.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/managed-endpoint-details-page.png" lightbox="media/how-to-safely-rollout-managed-endpoints/managed-endpoint-details-page.png" alt-text="Screenshot of managed endpoint details view.":::

### Test the endpoint with sample data

Use the **Test** tab in the endpoint's details page to test your managed online deployment. Enter sample input and view the results.

1. Select the **Test** tab in the endpoint's detail page. The blue deployment is already selected in the dropdown menu.
1. Copy the sample input from the [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-1/sample-request.json) file
1. Paste the sample input in the test box.
1. Select **Test**.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/test-deployment.png" lightbox="media/how-to-safely-rollout-managed-endpoints/test-deployment.png" alt-text="A screenshot of testing a deployment by providing sample data, directly in your browser.":::

---

## Scale your existing deployment to handle more traffic

# [Azure CLI](#tab/azure-cli)

In the deployment described in [Deploy and score a machine learning model with an online endpoint](how-to-deploy-online-endpoints.md), you set the `instance_count` to the value `1` in the deployment yaml file. You can scale out using the `update` command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="scale_blue" :::

> [!Note]
> Notice that in the above command we use `--set` to override the deployment configuration. Alternatively you can update the yaml file and pass it as an input to the `update` command using the `--file` input.

# [Python](#tab/python)

Using the `MLClient` created earlier, we'll get a handle to the deployment. The deployment can be scaled by increasing or decreasing the `instance_count`.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=scale_deployment)]

### Get endpoint details

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=get_endpoint_details)]

# [Studio](#tab/azure-studio)

Use the following instructions to scale the deployment up or down by adjusting the number of instances:

1. In the endpoint Details page. Find the card for the blue deployment.
1. Select the **edit icon** in the header of the blue deployment's card.
1. Change the instance count to 2.
1. Select **Update**.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/scale-blue-deployment.png" alt-text="A screenshot showing how to adjust the number of instances used by the blue deployment." lightbox="media/how-to-safely-rollout-managed-endpoints/scale-blue-deployment.png":::

---

## Deploy a new model, but send it no traffic yet

# [Azure CLI](#tab/azure-cli)

Create a new deployment named `green`:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_green" :::

Since we haven't explicitly allocated any traffic to `green`, it has zero traffic allocated to it. You can verify that using the command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="get_traffic" :::

### Test the new deployment

Though `green` has 0% of traffic allocated, you can invoke it directly by specifying the `--deployment` name:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green" :::

If you want to use a REST client to invoke the deployment directly without going through traffic rules, set the following HTTP header: `azureml-model-deployment: <deployment-name>`. The below code snippet uses `curl` to invoke the deployment directly. The code snippet should work in Unix/WSL environments:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green_using_curl" :::

# [Python](#tab/python)

Create a new deployment for your managed online endpoint and name the deployment `green`:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=configure_new_deployment)]

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=create_new_deployment)]

> [!NOTE]
> If you're creating a deployment for a Kubernetes online endpoint, use the `KubernetesOnlineDeployment` class and specify a [Kubernetes instance type](how-to-manage-kubernetes-instance-types.md) in your Kubernetes cluster.

### Test the new deployment

Though `green` has 0% of traffic allocated, you can still invoke the endpoint and deployment with the [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-2/sample-request.json) file.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=test_new_deployment)]

# [Studio](#tab/azure-studio)

Create a new deployment to add to your managed online endpoint and name the deployment `green`.

From the **Endpoint details page**

1. Select **+ Add Deployment** button in the endpoint "Details" page.
1. Select **Deploy a model**.
1. Select **Next** to go to the "Model" page and select the model _model-2_.
1. Select **Next** to go to the "Deployment" page and perform the following tasks:
    1. Name the deployment "green".
    1. Enable application insights diagnostics and data collection.
1. Select __Next__ to go to the "Environment" page. Here, perform following steps:
    * In the "Select scoring file and dependencies" box, browse and select the `\azureml-examples\cli\endpoints\online\model-2\onlinescoring\score.py` file from the repo you cloned or downloaded earlier.
    * Start typing `sklearn` in the search box above the list of environments, and select the **AzureML-sklearn-0.24** curated environment.
1. Select __Next__ to go to the "Compute" page. Here, keep the default selection for the virtual machine "Standard_DS3_v2" and change the __Instance count__ to 1.
1. Select __Next__ to go to the "Traffic" page. Here, keep the default traffic allocation to the deployments (100% traffic to "blue" and 0% traffic to "green").
1. Select __Next__ to review your deployment settings.

    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/add-green-deployment-from-endpoint-page.png" lightbox="media/how-to-safely-rollout-managed-endpoints/add-green-deployment-from-endpoint-page.png" alt-text="A screenshot of Add deployment option from Endpoint details page.":::
1.  Select __Create__ to create the deployment.

Alternatively, you can use the **Models** page to add a deployment:

1. In the left navigation bar, select the **Models** page.
1. Select a model by checking the circle next to the model name.
1. Select **Deploy** > **Real-time endpoint**.
1. Choose to deploy to an existing managed online endpoint.
    :::image type="content" source="media/how-to-safely-rollout-managed-endpoints/add-green-deployment-from-models-page.png" lightbox="media/how-to-safely-rollout-managed-endpoints/add-green-deployment-from-models-page.png" alt-text="A screenshot of Add deployment option from Models page.":::
1. Follow the previous steps 3 to 9 to finish creating the green deployment.

> [!NOTE]
> When adding a new deployment to an endpoint, you can adjust the traffic balance between deployments on the "Traffic" page. At this point, though, you should keep the default traffic allocation to the deployments (100% traffic to "blue" and 0% traffic to "green").


### Test the new deployment

Though `green` has 0% of traffic allocated, you can still invoke the endpoint and deployment. Use the **Test** tab in the endpoint's details page to test your managed online deployment. Enter sample input and view the results.

1. Select the **Test** tab in the endpoint's detail page.
1. Select the green deployment from the dropdown menu.
1. Copy the sample input from the [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-2/sample-request.json) file.
1. Paste the sample input in the test box.
1. Select **Test**.

---

## Test the deployment with mirrored traffic

Once you've tested your `green` deployment, you can *mirror* (or copy) a percentage of the live traffic to it. Traffic mirroring (also called shadowing) doesn't change the results returned to clients—requests still flow 100% to the `blue` deployment. The mirrored percentage of the traffic is copied and submitted to the `green` deployment so that you can gather metrics and logging without impacting your clients. Mirroring is useful when you want to validate a new deployment without impacting clients. For example, you can use mirroring to check if latency is within acceptable bounds or to check that there are no HTTP errors. Testing the new deployment with traffic mirroring/shadowing is also known as [shadow testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/shadow-testing/). The deployment receiving the mirrored traffic (in this case, the `green` deployment) can also be called the *shadow deployment*.

Mirroring has the following limitations:
* Mirroring is supported for the CLI (v2) (version 2.4.0 or above) and Python SDK (v2) (version 1.0.0 or above). If you use an older version of CLI/SDK to update an endpoint, you'll lose the mirror traffic setting.
* Mirroring isn't currently supported for Kubernetes online endpoints.
* You can mirror traffic to only one deployment in an endpoint.
* The maximum percentage of traffic you can mirror is 50%. This limit is to reduce the effect on your [endpoint bandwidth quota](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints) (default 5 MBPS)—your endpoint bandwidth is throttled if you exceed the allocated quota. For information on monitoring bandwidth throttling, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md#metrics-at-endpoint-scope).

Also note the following behaviors:

* A deployment can be configured to receive only live traffic or mirrored traffic, not both.
* When you invoke an endpoint, you can specify the name of any of its deployments — even a shadow deployment — to return the prediction.
* When you invoke an endpoint with the name of the deployment that will receive incoming traffic, Azure Machine Learning won't mirror traffic to the shadow deployment. Azure Machine Learning mirrors traffic to the shadow deployment from traffic sent to the endpoint when you don't specify a deployment.

Now, let's set the green deployment to receive 10% of mirrored traffic. Clients will still receive predictions from the blue deployment only.

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing 10% traffic mirrored to one deployment.":::

# [Azure CLI](#tab/azure-cli)

The following command mirrors 10% of the traffic to the `green` deployment:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green_with_mirror_traffic" :::

You can test mirror traffic by invoking the endpoint several times without specifying a deployment to receive the incoming traffic:

```azurecli
for i in {1..20} ; do
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file endpoints/online/model-1/sample-request.json
done
```

You can confirm that the specific percentage of the traffic was sent to the `green` deployment by seeing the logs from the deployment:

```azurecli
az ml online-deployment get-logs --name blue --endpoint $ENDPOINT_NAME
```

After testing, you can set the mirror traffic to zero to disable mirroring:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="reset_mirror_traffic" :::

# [Python](#tab/python)

The following command mirrors 10% of the traffic to the `green` deployment:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=new_deployment_traffic)]

You can test mirror traffic by invoking the endpoint several times without specifying a deployment to receive the incoming traffic:
[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=several_tests_to_mirror_traffic)]

You can confirm that the specific percentage of the traffic was sent to the `green` deployment by seeing the logs from the deployment:

```python
ml_client.online_deployments.get_logs(
    name="green", endpoint_name=online_endpoint_name, lines=50
)
```

After testing, you can set the mirror traffic to zero to disable mirroring:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=disable_traffic_mirroring)]

# [Studio](#tab/azure-studio)

To mirror 10% of the traffic to the `green` deployment:

1. From the endpoint Details page, Select **Update traffic**.
1. Slide the button to **Enable mirrored traffic**.
1. Select the **green** deployment in the "Deployment name" dropdown menu.
1. Keep the default traffic allocation of 10%.
1. Select **Update**.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/mirror-traffic-to-green-deployment.png" alt-text="Screenshot showing how to mirror a percentage of traffic to the green deployment." lightbox="media/how-to-safely-rollout-managed-endpoints/mirror-traffic-to-green-deployment.png":::

The endpoint details page now shows mirrored traffic allocation of 10% to the `green` deployment.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/endpoint-details-showing-mirrored-traffic-allocation.png" alt-text="Endpoint details page showing mirrored traffic allocation in the deployment summary." lightbox="media/how-to-safely-rollout-managed-endpoints/endpoint-details-showing-mirrored-traffic-allocation.png":::

To test mirrored traffic, see the Azure CLI or Python tabs to invoke the endpoint several times. Confirm that the specific percentage of the traffic was sent to the `green` deployment by seeing the logs from the deployment. You can access the deployment logs from the endpoint's **Deployment logs** tab. You can also use Metrics and Logs to monitor performance of the mirrored traffic. For more information, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

After testing, you can disable mirroring:

1. From the endpoint Details page, Select **Update traffic**.
1. Slide the button next to **Enable mirrored traffic** again to disable mirrored traffic.
1. Select **Update**.

:::image type="content" source="media/how-to-safely-rollout-managed-endpoints/endpoint-details-showing-disabled-mirrored-traffic.png" alt-text="Endpoint details page showing no mirrored traffic in the deployment summary." lightbox="media/how-to-safely-rollout-managed-endpoints/endpoint-details-showing-disabled-mirrored-traffic.png":::

---

## Allocate a small percentage of live traffic to the new deployment

# [Azure CLI](#tab/azure-cli)

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_10pct_traffic" :::

# [Python](#tab/python)

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=allocate_some_traffic)]

# [Studio](#tab/azure-studio)

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

1. In the endpoint Details page, Select  **Update traffic**.
1. Adjust the deployment traffic by allocating 10% to the green deployment and 90% to the blue deployment.
1. Select **Update**.

---

> [!TIP]
> The total traffic percentage must sum to either 0% (to disable traffic) or 100% (to enable traffic).

Now, your `green` deployment receives 10% of all live traffic. Clients will receive predictions from both the `blue` and `green` deployments.

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept.png" alt-text="Diagram showing traffic split between deployments.":::

## Send all traffic to your new deployment

# [Azure CLI](#tab/azure-cli)

Once you're fully satisfied with your `green` deployment, switch all traffic to it.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_100pct_traffic" :::

# [Python](#tab/python)

Once you're fully satisfied with your `green` deployment, switch all traffic to it.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=allocate_all_traffic)]

# [Studio](#tab/azure-studio)

Once you're fully satisfied with your `green` deployment, switch all traffic to it.

1. In the endpoint Details page, Select  **Update traffic**.
1. Adjust the deployment traffic by allocating 100% to the green deployment and 0% to the blue deployment.
1. Select **Update**.

---

## Remove the old deployment

Use the following steps to delete an individual deployment from a managed online endpoint. Deleting an individual deployment does affect the other deployments in the managed online endpoint:

# [Azure CLI](#tab/azure-cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_blue" :::

# [Python](#tab/python)

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=remove_old_deployment)]

# [Studio](#tab/azure-studio)

> [!NOTE]
> You cannot delete a deployment that has live traffic allocated to it. You must first [set traffic allocation](#send-all-traffic-to-your-new-deployment) for the deployment to 0% before deleting it.

1. In the endpoint Details page, find the blue deployment.
1. Select the **delete icon** next to the deployment name.

---

## Delete the endpoint and deployment

# [Azure CLI](#tab/azure-cli)

If you aren't going to use the endpoint and deployment, you should delete them. By deleting the endpoint, you'll also delete all its underlying deployments.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

If you aren't going to use the endpoint and deployment, you should delete them. By deleting the endpoint, you'll also delete all its underlying deployments.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=delete_endpoint)]

# [Studio](#tab/azure-studio)

If you aren't going to use the endpoint and deployment, you should delete them. By deleting the endpoint, you'll also delete all its underlying deployments.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select an endpoint by checking the circle next to the model name.
1. Select **Delete**.

Alternatively, you can delete a managed online endpoint directly by selecting the **Delete** icon in the endpoint's details page.

---

## Next steps
- [Explore online endpoint samples](https://github.com/Azure/azureml-examples/tree/v2samplesreorg/sdk/python/endpoints)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Use network isolation with managed online endpoints](how-to-secure-online-endpoint.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md)
- [Troubleshooting  online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md)
- [Online endpoint YAML reference](reference-yaml-endpoint-online.md)
