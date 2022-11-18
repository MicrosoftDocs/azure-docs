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
ms.date: 10/27/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, event-tier1-build-2022, sdkv2
---

# Safe rollout for online endpoints

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this article, you'll learn how to deploy a new version of a machine learning model in production without causing any disruption. You'll use blue-green deployment, also known as a safe rollout strategy, to introduce a new version of a web service to production. This strategy will allow you to roll out your new version of the web service to a small subset of users or requests before rolling it out completely.

This article assumes you're using online endpoints, that is, endpoints that are used for online (real-time) inferencing. There are two types of online endpoints: **managed online endpoints** and **Kubernetes online endpoints**. For more information on endpoints and the differences between managed online endpoints and Kubernetes online endpoints, see [What are Azure Machine Learning endpoints?](concept-endpoints.md#managed-online-endpoints-vs-kubernetes-online-endpoints).

> [!Note]
> The main example in this article uses managed online endpoints for deployment. To use Kubernetes endpoints instead, see the notes in this document inline with the managed online endpoints discussion.

In this article, you'll learn to:

> [!div class="checklist"]
> * Define an online endpoint and a deployment called "blue" to serve version 1 of a model
> * Scale the blue deployment so that it can handle more requests
> * Deploy version 2 of the model (called the "green" deployment) to the endpoint, but send the deployment no live traffic
> * Test the green deployment in isolation
> * Mirror a percentage of live traffic to the green deployment to validate it (preview)
> * Send a small percentage of live traffic to the green deployment
> * Send over all live traffic to the green deployment
> * Delete the now-unused v1 blue deployment

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](../../includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription id>
   az configure --defaults workspace=<azureml workspace name> group=<resource group>
   ```

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

# [Python](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](../../includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

---

## Prepare your system

# [Azure CLI](#tab/azure-cli)

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

The [workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace where you'll perform deployment tasks.

1. Import the required libraries:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=import_libraries)]

    > [!NOTE]
    > If you're using the Kubernetes online endpoint, import the `KubernetesOnlineEndpoint` and `KubernetesOnlineDeployment` class from the `azure.ai.ml.entities` library.

1. Configure workspace details and get a handle to the workspace:

    To connect to a workspace, we need identifier parameters—a subscription, resource group and workspace name. We'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. This example uses the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential).

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=workspace_details)]

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=workspace_handle)]

---

## Define the endpoint and deployment

Online endpoints are used for online (real-time) inferencing. Online endpoints contain deployments that are ready to receive data from clients and can send responses back in real time.

# [Azure CLI](#tab/azure-cli)

### Create online endpoint

To create an online endpoint:

1. Set your endpoint name:

   For Unix, run this command (replace `YOUR_ENDPOINT_NAME` with a unique name):

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="set_endpoint_name":::

    > [!IMPORTANT]
    > Endpoint names must be unique within an Azure region. For example, in the Azure `westus2` region, there can be only one endpoint with the name `my-endpoint`.

1. Create the endpoint in the cloud, run the following code:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_endpoint":::

### Create the 'blue' deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. To create a deployment named `blue` for your endpoint, run the following command:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_blue":::

# [Python](#tab/python)

### Create online endpoint

To create a managed online endpoint, use the `ManagedOnlineEndpoint` class. This class allows users to configure the following key aspects of the endpoint:

* `name` - Name of the endpoint. Needs to be unique at the Azure region level
* `auth_mode` - The authentication method for the endpoint. Key-based authentication and Azure ML token-based authentication are supported. Key-based authentication doesn't expire but Azure ML token-based authentication does. Possible values are `key` or `aml_token`.
* `identity`- The managed identity configuration for accessing Azure resources for endpoint provisioning and inference.
    * `type`- The type of managed identity. Azure Machine Learning supports `system_assigned` or `user_assigned` identity.
    * `user_assigned_identities` - List (array) of fully qualified resource IDs of the user-assigned identities. This property is required if `identity.type` is user_assigned.
* `description`- Description of the endpoint.

1. Configure the endpoint:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=configure_endpoint)]

    > [!NOTE]
    > To create a Kubernetes online endpoint, use the `KubernetesOnlineEndpoint` class.

1. Create the endpoint:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=create_endpoint)]

### Create the 'blue' deployment

A deployment is a set of resources required for hosting the model that does the actual inferencing. To create a deployment for your managed online endpoint, use the `ManagedOnlineDeployment` class. This class allows users to configure the following key aspects of the deployment:

**Key aspects of deployment**
* `name` - Name of the deployment.
* `endpoint_name` - Name of the endpoint to create the deployment under.
* `model` - The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.
* `environment` - The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification.
* `code_configuration` - the configuration for the source code and scoring script
    * `path`- Path to the source code directory for scoring the model
    * `scoring_script` - Relative path to the scoring file in the source code directory
* `instance_type` - The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* `instance_count` - The number of instances to use for the deployment

1. Configure blue deployment:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=configure_deployment)]

    > [!NOTE]
    > To create a deployment for a Kubernetes online endpoint, use the `KubernetesOnlineDeployment` class.

1. Create the deployment:

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=create_deployment)]

    [!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=deployment_traffic)]

---

## Confirm your existing deployment

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

---

## Scale your existing deployment to handle more traffic

# [Azure CLI](#tab/azure-cli)

In the deployment described in [Deploy and score a machine learning model with an online endpoint](how-to-deploy-managed-online-endpoints.md), you set the `instance_count` to the value `1` in the deployment yaml file. You can scale out using the `update` command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="scale_blue" :::

> [!Note]
> Notice that in the above command we use `--set` to override the deployment configuration. Alternatively you can update the yaml file and pass it as an input to the `update` command using the `--file` input.

# [Python](#tab/python)

Using the `MLClient` created earlier, we'll get a handle to the deployment. The deployment can be scaled by increasing or decreasing the `instance_count`.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=scale_deployment)]

### Get endpoint details

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=get_endpoint_details)]

---

## Deploy a new model, but send it no traffic yet

# [Azure CLI](#tab/azure-cli)

Create a new deployment named `green`:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_green" :::

Since we haven't explicitly allocated any traffic to `green`, it will have zero traffic allocated to it. You can verify that using the command:

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

---

## Test the deployment with mirrored traffic (preview)
[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Once you've tested your `green` deployment, you can copy (or 'mirror') a percentage of the live traffic to it. Mirroring traffic doesn't change results returned to clients. Requests still flow 100% to the `blue` deployment. The mirrored percentage of the traffic is copied and submitted to the `green` deployment so you can gather metrics and logging without impacting your clients. Mirroring is useful when you want to validate a new deployment without impacting clients. For example, to check if latency is within acceptable bounds and that there are no HTTP errors.

> [!WARNING]
> Mirroring traffic uses your [endpoint bandwidth quota](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints) (default 5 MBPS). Your endpoint bandwidth will be throttled if you exceed the allocated quota. For information on monitoring bandwidth throttling, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md#metrics-at-endpoint-scope).

# [Azure CLI](#tab/azure-cli)

The following command mirrors 10% of the traffic to the `green` deployment:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green_with_mirror_traffic" :::

You can test mirror traffic by invoking the endpoint several times:

```azurecli
for i in {1..20} ; do
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file endpoints/online/model-1/sample-request.json
done
```

# [Python](#tab/python)

The following command mirrors 10% of the traffic to the `green` deployment:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=new_deployment_traffic)]

You can test mirror traffic by invoking the endpoint several times:
[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=several_tests_to_mirror_traffic)]

---

Mirroring has the following limitations:
* You can only mirror traffic to one deployment.
* Mirror traffic isn't currently supported for Kubernetes online endpoints.
* The maximum mirrored traffic you can configure is 50%. This limit is to reduce the impact on your endpoint bandwidth quota.

Also note the following behavior:
* A deployment can only be set to live or mirror traffic, not both.
* You can send traffic directly to the mirror deployment by specifying the deployment set for mirror traffic.
* You can send traffic directly to a live deployment by specifying the deployment set for live traffic, but in this case the traffic won't be mirrored to the mirror deployment. Mirror traffic is routed from traffic sent to endpoint without specifying the deployment. 

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing 10% traffic mirrored to one deployment.":::

# [Azure CLI](#tab/azure-cli)
You can confirm that the specific percentage of the traffic was sent to the `green` deployment by seeing the logs from the deployment:

```azurecli
az ml online-deployment get-logs --name blue --endpoint $ENDPOINT_NAME
```

After testing, you can set the mirror traffic to zero to disable mirroring:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="reset_mirror_traffic" :::

# [Python](#tab/python)
You can confirm that the specific percentage of the traffic was sent to the `green` deployment by seeing the logs from the deployment:

```python
ml_client.online_deployments.get_logs(
    name="green", endpoint_name=online_endpoint_name, lines=50
)
```

After testing, you can set the mirror traffic to zero to disable mirroring:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=disable_traffic_mirroring)]

---

## Test the new deployment with a small percentage of live traffic

# [Azure CLI](#tab/azure-cli)

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_10pct_traffic" :::

# [Python](#tab/python)

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=allocate_some_traffic)]

---

Now, your `green` deployment will receive 10% of requests.

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept.png" alt-text="Diagram showing traffic split between deployments.":::

## Send all traffic to your new deployment

# [Azure CLI](#tab/azure-cli)

Once you're fully satisfied with your `green` deployment, switch all traffic to it.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_100pct_traffic" :::

# [Python](#tab/python)

Once you're fully satisfied with your `green` deployment, switch all traffic to it.

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=allocate_all_traffic)]

---

## Remove the old deployment

# [Azure CLI](#tab/azure-cli)

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_blue" :::

# [Python](#tab/python)

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=remove_old_deployment)]

---

## Delete the endpoint and deployment

# [Azure CLI](#tab/azure-cli)

If you aren't going use the deployment, you should delete it with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_endpoint" :::

# [Python](#tab/python)

If you aren't going use the deployment, you should delete it with:

[!notebook-python[](~/azureml-examples-main/sdk/python/endpoints/online/managed/online-endpoints-safe-rollout.ipynb?name=delete_endpoint)]

---

## Next steps
- [Explore online endpoint samples](https://github.com/Azure/azureml-examples/tree/v2samplesreorg/sdk/python/endpoints)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints  in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md)
- [Troubleshooting  online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md)
- [Online endpoint YAML reference](reference-yaml-endpoint-online.md)