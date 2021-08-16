---
title: Safe rollout for online endpoints 
titleSuffix: Azure Machine Learning
description: Roll out newer versions of ML models without disruption.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 08/05/2021
ms.topic: how-to
ms.custom: how-to, devplatv2
---

# Safe rollout for online endpoints (preview)

You have an existing model deployed in production and you want to deploy a new version of the model. How do you roll out your new ML model without causing any disruption? A good answer is blue-green deployment, an approach in which a new version of a web service is introduced to production by rolling out the change to a small subset of users/requests before rolling it out completely. This article assumes you're using online endpoints; for more information, see [What are Azure Machine Learning endpoints (preview)?](concept-endpoints.md).

In this article, you'll learn to:

> [!div class="checklist"]
> * Deploy a new online endpoint called "blue" that serves version 1 of the model
> * Scale this deployment so that it can handle more requests
> * Deploy version 2 of the model to an endpoint called "green" that accepts no live traffic
> * Test the green deployment in isolation 
> * Send 10% of live traffic to the green deployment
> * Fully cut-over all live traffic to the green deployment
> * Delete the now-unused v1 blue deployment

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace. You'll have such a workspace if you configured your ML extension per the above article.

* If you've not already set the defaults for Azure CLI, you should save your default settings. To avoid having to repeatedly pass in the values, run:

```azurecli
az account set --subscription <subscription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```

* An existing managed endpoint. This article assumes that your deployment is as described in [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md).

* If you have not already set the environment variable $ENDPOINT_NAME, do so now:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="set_endpoint_name":::

* (Recommended) Clone the samples repository and switch to the repository's `cli/` directory: 

```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples/cli
```

The commands in this tutorial are in the file `deploy-declarative-safe-rollout-online-endpoints.sh` and the YAML configuration files are in the `endpoints/online/managed/canary-declarative-flow/` subdirectory.

## Confirm your existing deployment is created

You can view the status of your existing deployment by running: 

```azurecli
az ml endpoint show --name $ENDPOINT_NAME 
```

You should see the endpoint identified by `$ENDPOINT_NAME` and, a deployment called `blue`. 

## Scale your existing deployment to handle more traffic

In the deployment described in [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md), you set the `instance_count` to the value `1`. To handle more traffic, the second version of the YAML file (`2-scale-blue.yml`) changes the value to `2`:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/canary-declarative-flow/2-scale-blue.yml" range="29":::

Update the deployment with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="scale_blue" :::

> [!IMPORTANT]
> Update using the YAML is declarative. That is, changes in the YAML will be reflected in the underlying Azure Resource Manager resources (endpoints & deployments). This approach facilitates [GitOps](https://www.atlassian.com/git/tutorials/gitops): *ALL* changes to endpoints/deployments go through the YAML (even `instance_count`). As a side effect, if you remove a deployment from the YAML and run `az ml endpoint update` using the file, that deployment will be deleted. 

## Deploy a new model, but send it no traffic yet

To deploy your new model, add a new section to the `deployments` section of your configuration file, but specify in the `traffic` section that it should receive 0% of traffic. The file `3-create-green.yml` incorporates this change:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/canary-declarative-flow/3-create-green.yml" range="7,35-56":::

Update the deployment: 

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="create_green" :::

### Test the new deployment

The configuration specified 0% traffic to your just-created `green` deployment. To test it, you can invoke it directly by specifying the `--deployment` name:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="test_green" :::

If you want to use a REST client to invoke the deployment directly without going through traffic rules, set the following HTTP header: `azureml-model-deployment: <deployment-name>`.

## Test the new deployment with a small percentage of live traffic

Once you have tested your `green` deployment, the `4-flight-green.yml` file demonstrates how to serve some percentage of traffic by modifying the `traffic` configuration in the configuration file:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/canary-declarative-flow/4-flight-green.yml" range="5-7":::

Other than the highlighted lines, the configuration file is otherwise unchanged. Update your deployment with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="green_10pct_traffic" :::

Now, your `green` deployment will receive 10% of requests. 

## Send all traffic to your new deployment

Once you're satisfied that your `green` deployment is fully satisfactory, switch all traffic to it. The following snippet shows only the relevant code from the configuration file, which is otherwise unchanged:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/canary-declarative-flow/5-full-green.yml" range="5-7":::

And update the deployment: 

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="green_100pct_traffic" :::

## Remove the old deployment

Complete the swap-over to your new model by deleting the older `blue` deployment. The final configuration file looks like:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/canary-declarative-flow/6-delete-blue.yml" :::

Update the deployment with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="delete_blue" :::

## Delete the endpoint and deployment

If you are not going use the deployment, you should delete it with:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-declarative-safe-rollout-online-endpoints.sh" ID="delete_endpoint" :::


## Next steps
- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints (preview) in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Tutorial: Access Azure resources with a managed online endpoint and system-managed identity (preview)](tutorial-deploy-managed-endpoints-using-system-managed-identity.md)
- [Monitor managed online endpoints (preview)](how-to-monitor-online-endpoints.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Managed online endpoints SKU list (preview)](reference-managed-online-endpoints-vm-sku-list.md)
- [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md)
- [Managed online endpoints (preview) YAML reference](reference-yaml-endpoint-managed-online.md)