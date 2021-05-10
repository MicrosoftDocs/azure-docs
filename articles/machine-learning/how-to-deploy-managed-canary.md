---
title: Safe rollout for online endpoints 
titleSuffix: Azure Machine Learning
description: Learn how to deploy machine learning models for separate customer groups.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 04/24/2021
ms.topic: how-to 
ms.custom: how-to 
---

# Safe rollout for online endpoints (preview)

{>> Q: This seems more like blue-green than canary to me. The word 'canary' refers to _users_ being used as "the canary in the coalmine" while this deployment technique is traffic-based. <<}

{>> Q: All code in how-to-deploy-declarative-safe-rollout-online-endpoints.sh uses `-n my-new-endpoint` to override `name: my-endpoint` in YAML. Existing endpoint from `how-to-deploy-managed-online-endpoints.sh` is `my-endpoint`. Is this renaming / override intentional and necessary? <<}

Canary release is a deployment approach in which new version of a service is introduced to production by rolling out the change to small subset of users/requests before rolling it out completely.

In the example below, we will start by creating a new endpoint with a deployment (v1 of the model, that we call blue). Then we will scale this deployment to handle more requests. Once we are ready to launch v2 of the model (called green), we will do so safely by performing a canary release: Deploy the v2 (i.e. green) but taking no live traffic yet, test the deployment in isolation, then gradually divert live production traffic (say 10%) to green deployment, and finally, make the 100% traffic switch to green and delete blue.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The Azure Command Line Interface (CLI) and ML extension. You must have Azure CLI version `>=tk`. Check your version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::
* Resource group, workspace, and tk defaults configured for the ML extension. Check your configuration with:

:::code language="azurecli" source="tk" id="confirm_rg_ws_config":::

For more information on installing and configuring the Azure CLI and ML extension, see [tk](tk).

* An existing managed endpoint. This article assumes that your deployment is as described in [tk](tk).


## What is GitOps
{>> I don't know if this paragraph is necessary. None of the steps in this how-to invoke git. Why is this paragraph relevant? <<}
GitOps is code-based infrastructure and operational procedures that rely on Git as a source control system. It’s an evolution of Infrastructure as Code (IaC) and a DevOps best practice that leverages Git as the single source of truth, and control mechanism for creating, updating, and deleting system architecture. More simply, it is the practice of using Git pull requests to verify and automatically deploy system infrastructure modifications.

## Scale your existing deployment to handle additional traffic

In the deployment described in [tk](tk), you set the `instance_count` to the value `1`. To handle more traffic, change the value to `2` in the YAML configuration file:

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/canary-declarative-flow/2-scale-blue.yaml" highlight="29":::
{>> Note: Docker image is ubuntu 16.04 again<<}

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
{>> Q: Snippet is incorrect: duplicate of flight-green. Made PR to fix https://github.com/Azure/azureml-examples/pull/466 <<}

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

## Swap all traffic to your new model

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
- {>> Anything else? More on log analytics? <<}
