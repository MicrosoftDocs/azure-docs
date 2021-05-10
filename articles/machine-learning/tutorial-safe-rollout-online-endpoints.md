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
ms.date: 05/25/2021
ms.topic: tutorial 
---

# Tutorial: Safe rollout for online endpoints (preview)

Blue-green deployment is a deployment approach in which new version of a service is introduced to production by rolling out the change to small subset of users/requests before rolling it out completely.

In this article, you'll learn to:

[!div class="checklist"]
* Deploy a new online endpoint called "blue" that serves version 1 of the model
* Scale this deployment so that it can handle more requests
* Deploy version 2 of the model to an endpoint called "green" that accepts no live traffic
* Test the green deployment in isolation 
* Send 10% of live traffic to the green deployment
* Fully cut-over all live traffic to the green deployment
* Delete the now-unused v1 blue deployment

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- An **Azure subscription** . If you don't have such a subscription, try the [free or paid personal subscription](https://aka.ms/AMLFree)

* The Azure Command Line Interface (CLI) and ML extension. You must have Azure CLI version `>=tk`. Check your version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::

For more information on installing and configuring the Azure CLI and ML extension, see [Install, set up, and use  the 2.0 CLI](how-to-configure-cli.md).

* An Azure resource group in which you have "Contributor" access. For more information, see [Manage Azure Resource Manager resource groups by using Azure CLI](../../azure-resource-manager/management/manage-resource-groups-cli.md).

* An Azure Machine Learning workspace. For more information, see [Create and manage Azure Machine Learning workspaces](how-to-manage-workspace.md).

* If you have not already set the defaults for the CLI, do so now:

```azurecli
az account set --subscription <subcription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```

* An existing managed endpoint. This article assumes that your deployment is as described in [Tutorial: Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md). {>> todo: rename <- to tutorial-deploy-managed-online-endpoints <<}

* If you have not already set the environment variable $ENDPOINT_NAME, do so now:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="tk":::

* (Recommended) Clone the samples repository and switch to the repository's `cli/` directory: 

```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples/cli
```

The commands in this tutorial are in the file `how-to-deploy-declarative-safe-rollout-online-endpoints.sh` and the YAML configuration files are in the `endpoints/online/managed/canary-declarative-flow/` subdirectory.

## Confirm your existing deployment is online

tk

## Scale your existing deployment to handle additional traffic

In the deployment described in [Tutorial: Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md), you set the `instance_count` to the value `1`. To handle more traffic, change the value to `2` in the YAML configuration file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/2-scale-blue.yaml" highlight="29":::

Update the deployment with:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="scale_blue" :::

## Deploy a new model, but send it no traffic yet

To deploy your new model, add a new section to the `deployments` section of your configuration file, but specify in the `traffic` section that it should receive 0% of traffic:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/3-create-green.yaml" highlight="7,35-56":::

Update the deployment: 

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="create_green" :::

### Test the new deployment

The configuration specified 0% traffic to your just-created `green` deployment. To test it, you can invoke it directly by specifying the `--deployment` name:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="test_green" :::

You should see a result similar to:

```bash
tk
```

## Divide traffic between models

Once you have tested your `green` deployment, you can serve some percentage of traffic by modifying the `traffic` node in the configuration file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/4-flight-green.yaml" range="5-7":::

The above shows only a snippet from the configuration file, which is otherwise unchanged. Update your deployment with:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="green_10pct_traffic" :::

Now, your `green` deployment will receive 10% of requests. 

## Send all traffic to newer deployment

Once you're satisfied that your `green` deployment is fully satisfactory, switch all traffic to it. The following snippet shows only the relevant code from the configuration file, which is otherwise unchanged:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/5-full-green.yaml" range="5-7":::

And update the deployment: 

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="green_100pct_traffic" :::

## Remove the old deployment

Complete the swap-over to your new model by deleting the older `blue` deployment. The final configuration file looks like:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/6-delete-blue.yaml":::

Update the deployment with:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="delete_blue" :::

## Delete the endpoint and deployment

If you are not going use the deployment, you should delete it with:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-declarative-safe-rollout-online-endpoints.sh" id="delete_endpoint" :::

## Next steps
- [tk](tk)
- Understand managed inference [tk](concept-article.md)
- Batch inference {>> And backlink batch inference to tutorial 1 <<}
- Managed identity tutorials
