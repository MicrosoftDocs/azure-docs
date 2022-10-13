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
ms.date: 04/29/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, cliv2, event-tier1-build-2022,sdkv2
---

# Safe rollout for managed online endpoints

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this article, you learn how to deploy a new version of a machine learning model in production without causing any disruption. Using blue-green deployment (or safe rollout), you'll introduce a new version of a web service to production by rolling out the change to a small subset of users/requests before rolling it out completely. This article assumes you're using online endpoints; for more information, see [What are Azure Machine Learning endpoints?](concept-endpoints.md).

In this article, you'll learn to:

> [!div class="checklist"]
> * Confirm that an online endpoint called "blue" and serves version 1 of the model exists
> * Scale this deployment so that it can handle more requests
> * Deploy version 2 of the model to an endpoint called "green" that accepts no live traffic
> * Test the green deployment in isolation
> * Send 10% of live traffic to the green deployment
> * Fully cut-over all live traffic to the green deployment
> * Delete the now-unused v1 blue deployment

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](../../includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

* An existing online endpoint and deployment. This article assumes that your deployment is as described in [Deploy and score a machine learning model with an online endpoint](how-to-deploy-managed-online-endpoints.md).

* If you haven't already set the environment variable $ENDPOINT_NAME, do so now:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="set_endpoint_name":::

<!-- * (Recommended) Clone the samples repository and switch to the repository's `cli/` directory: 

   ```azurecli
   git clone https://github.com/Azure/azureml-examples
   cd azureml-examples/cli
   ```

The commands in this tutorial are in the file `deploy-safe-rollout-online-endpoints.sh` and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory. -->


* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

The commands in this tutorial are in the file `deploy-safe-rollout-online-endpoints.sh` and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory.

> [!IMPORTANT]
> The examples in this document assume that you are using the Bash shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).

# [Python](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](../../includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

## Prepare your system

# [Azure CLI](#tab/azure-cli)

### Clone the sample repository

To follow along with this article, first clone the [samples repository (azureml-examples)](https://github.com/azure/azureml-examples). Then, run the following code to go to the samples directory:

```azurecli
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository. This reduces time to complete the operation.

The commands in this tutorial are in the file `deploy-safe-rollout-online-endpoints.sh` and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory.

### Set an endpoint name

To set your endpoint name, run the following command (replace `YOUR_ENDPOINT_NAME` with a unique name).

For Unix, run this command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="set_endpoint_name":::

> [!NOTE]
> Endpoint names must be unique within an Azure region. For example, in the Azure `westus2` region, there can be only one endpoint with the name `my-endpoint`. 

# [Python](#tab/python)

### Clone the sample repository

To run the training examples, first clone the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples) and change into the `azureml-examples/sdk/python/endpoints/online/managed` directory:

```bash
git clone --depth 1 https://github.com/Azure/azureml-examples
cd azureml-examples/sdk/python/endpoints/online/managed
```

> [!TIP]
> Use `--depth 1` to clone only the latest commit to the repository, which reduces time to complete the operation.

The information in this article is based on the [online-endpoints-simple-deployment.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/online-endpoints-simple-deployment.ipynb) notebook. It contains the same content as this article, although the order of the codes is slightly different.



## -----------------------------------------------------------------
<!-- * To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace. You'll have such a workspace if you configured your ML extension per the above article.

* If you've not already set the defaults for Azure CLI, you should save your default settings. To avoid having to repeatedly pass in the values, run:

   ```azurecli
   az account set --subscription <subscription id>
   az configure --defaults workspace=<azureml workspace name> group=<resource group> -->
   ```



## Confirm your existing deployment is created

You can view the status of your existing endpoint and deployment by running: 

```azurecli
az ml online-endpoint show --name $ENDPOINT_NAME 

az ml online-deployment show --name blue --endpoint $ENDPOINT_NAME 
```

You should see the endpoint identified by `$ENDPOINT_NAME` and, a deployment called `blue`. 

## Scale your existing deployment to handle more traffic

In the deployment described in [Deploy and score a machine learning model with an online endpoint](how-to-deploy-managed-online-endpoints.md), you set the `instance_count` to the value `1` in the deployment yaml file. You can scale out using the `update` command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="scale_blue" :::

> [!Note]
> Notice that in the above command we use `--set` to override the deployment configuration. Alternatively you can update the yaml file and pass it as an input to the `update` command using the `--file` input.

## Deploy a new model, but send it no traffic yet

Create a new deployment named `green`: 

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="create_green" :::

Since we haven't explicitly allocated any traffic to green, it will have zero traffic allocated to it. You can verify that using the command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="get_traffic" :::

### Test the new deployment

Though `green` has 0% of traffic allocated, you can invoke it directly by specifying the `--deployment` name:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green" :::

If you want to use a REST client to invoke the deployment directly without going through traffic rules, set the following HTTP header: `azureml-model-deployment: <deployment-name>`. The below code snippet uses `curl` to invoke the deployment directly. The code snippet should work in Unix/WSL environments:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="test_green_using_curl" :::

## Test the deployment with mirrored traffic (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Once you've tested your `green` deployment, you can copy (or 'mirror') a percentage of the live traffic to it. Mirroring traffic doesn't change results returned to clients. Requests still flow 100% to the blue deployment. The mirrored percentage of the traffic is copied and submitted to the `green` deployment so you can gather metrics and logging without impacting your clients. Mirroring is useful when you want to validate a new deployment without impacting clients. For example, to check if latency is within acceptable bounds and that there are no HTTP errors.

> [!WARNING]
> Mirroring traffic uses your [endpoint bandwidth quota](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints) (default 5 MBPS). Your endpoint bandwidth will be throttled if you exceed the allocated quota. For information on monitoring bandwidth throttling, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md#metrics-at-endpoint-scope).

The following command mirrors 10% of the traffic to the `green` deployment:

```azurecli
az ml online-endpoint update --name $ENDPOINT_NAME --mirror-traffic "green=10"
```

> [!IMPORTANT]
> Mirroring has the following limitations:
> * You can only mirror traffic to one deployment.
> * Mirrored traffic is not currently supported with K8s.
> * The maximum mirrored traffic you can configure is 50%. This limit is to reduce the impact on your endpoint bandwidth quota.
> 
> Also note the following behavior:
> * A deployment can only be set to live or mirror traffic, not both.
> * You can send traffic directly to the mirror deployment by specifying the deployment set for mirror traffic.
> * You can send traffic directly to a live deployment by specifying the deployment set for live traffic, but in this case the traffic won't be mirrored to the mirror deployment. Mirror traffic is routed from traffic sent to endpoint without specifying the deployment. 

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept-mirror.png" alt-text="Diagram showing 10% traffic mirrored to one deployment.":::

After testing, you can set the mirror traffic to zero to disable mirroring:

```azurecli
az ml online-endpoint update --name $ENDPOINT_NAME --mirror-traffic "green=0"
```

## Test the new deployment with a small percentage of live traffic

Once you've tested your `green` deployment, allocate a small percentage of traffic to it:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_10pct_traffic" :::

Now, your `green` deployment will receive 10% of requests. 

:::image type="content" source="./media/how-to-safely-rollout-managed-endpoints/endpoint-concept.png" alt-text="Diagram showing traffic split between deployments.":::

## Send all traffic to your new deployment

Once you're satisfied that your `green` deployment is fully satisfactory, switch all traffic to it.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="green_100pct_traffic" :::

## Remove the old deployment

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_blue" :::

## Delete the endpoint and deployment

If you aren't going use the deployment, you should delete it with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-safe-rollout-online-endpoints.sh" ID="delete_endpoint" :::


## Next steps
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints  in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md)
- [Troubleshooting  online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md)
- [Online endpoint YAML reference](reference-yaml-endpoint-online.md)
