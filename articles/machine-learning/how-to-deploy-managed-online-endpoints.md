---
title: "Deploy an ML model with a managed online endpoint" 
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as a web service automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 05/13/2021
ms.topic: how-to
ms.custom: how-to
---

# Deploy and score a machine learning model with a managed online endpoint (preview)

Managed online endpoints (preview) provide you the ability to deploy your model without your having to create and manage the underlying infrastructure. In this article, you'll start by deploying a model on your local machine to debug any errors, and then you'll deploy and test it in Azure. You'll also learn how to view the logs and monitor the Service Level Agreement (SLA). You start with a model and end up with a scalable HTTPS/REST endpoint that can be used for online/real-time scoring.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace. You'll have such a workspace if you configured your ML extension per the above article.

* If you've not already set the defaults for Azure CLI, you should save your default settings. To avoid having to repeatedly pass in the values, run:

   ```azurecli
   az account set --subscription <subscription id>
   az configure --defaults workspace=<azureml workspace name> group=<resource group>

* [Optional] To deploy locally, you must have [Docker engine](https://docs.docker.com/engine/install/) running locally. This step is **highly recommended**. It will help you debug issues.

## Prepare your system

To follow along with the article, clone the samples repository, and navigate to the right directory by running the following commands:

```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

Set your endpoint name (rename the below `YOUR_ENDPOINT_NAME` to a unique name). The below command is for Unix environments:

```azurecli
export ENDPOINT_NAME=YOUR_ENDPOINT_NAME
```

If you use a Windows operating system, use this command instead `set ENDPOINT_NAME=YOUR_ENDPOINT_NAME`.

> [!NOTE]
> Endpoint names need to be unique at the Azure region level. For example, there can be only one endpoint with the name `my-endpoint` in `westus2`. 

## Define the endpoint configuration

The inputs needed to deploy a model on an online endpoint are:

- Model files (or the name and version of a model already registered in your workspace). In the example, we have a `scikit-learn` model that does regression.
- Code that is needed to score the model. In this case, we have a `score.py` file.
- An environment in which your model is run (as you'll see, the environment may be a Docker image with conda dependencies or may be a Dockerfile).
- Settings to specify the instance type and scaling capacity.

The following snippet shows the `endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml` file that captures all the above information: 

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml":::

> [!Note]
> A fully specified sample YAML for managed online endpoints is available for [reference](https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.template.yaml)

The reference for the endpoint YAML format is below. To understand how to specify these attributes, refer to the YAML example from this article or to the fully specified YAML sample mentioned in the preceding note. For more on limits related to managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md).

| Key | Description |
| --- | --- |
| $schema    | [Optional] The YAML schema. You can view the schema in the above example in a browser to see all available options in the YAML file.|
| name       | Name of the endpoint. Needs to be unique at Azure region level.|
| traffic | Percentage of traffic from endpoint to divert to each deployment. Traffic values need to sum to 100 |
| auth_mode | use `key` for key based authentication and `aml_token` for Azure machine learning token-based authentication. `key` doesn't expire but `aml_token` does. Get the most recent token with the `az ml endpoint get-credentials` command). |
| deployments | Contains a list of deployments to be created in the endpoint. In this case, we have only one deployment, named `blue`. For more on multiple deployments, see [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)|

Attributes of the `deployment`:

| Key | Description |
| --- | --- |
| name  | Name of the deployment |
| model | In this example, we specify the model properties inline: `name`, `version`, and `local_path`. The model files will be uploaded and registered automatically. A downside of inline specification is that you must increment the version manually if you want to update the model files. Read the **Tip** in the below section for related best practices. |
| code_configuration.code.local_path | The directory that contains all the Python source code for scoring the model. Nested directories/packages are supported. |
| code_configuration.scoring_script | The Python file in the above scoring directory. This Python code must have an `init()` function and a `run()` function. The function `init()` will be called after the model is created or updated (you can use it to cache the model in memory, and so forth). The `run()` function is called at every invocation of the endpoint to do the actual scoring/prediction. |
| environment | Contains the details of the environment to host the model and code. In this example, we have inline definitions that include `name`, `version`, and `path`. In this example, `environment.docker.image` will be used as the image and the `conda_file` dependencies will be installed on top of it. For more information, see the **Tip** in the below section. |
| instance_type | The VM SKU to host your deployment instances. For more, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). |
| scale_settings.scale_type | Currently, this value must be `manual`. To scale up or scale down after the endpoint and deployment are created, update the `instance_count` in the YAML and run the command `az ml endpoint update -n $ENDPOINT_NAME --file <yaml filepath>`.|
| scale_settings.instance_count | Number of instances in the deployment. Base the value on the workload you expect. For high availability, Microsoft recommends you set it to at least `3`. |

> [!Note]
> To use Azure Kubernetes Service (AKS) as a compute target instead of managed endpoints:
> 1. Create and attach your AKS cluster as a compute target to your Azure Machine Learning workspace [using Azure ML Studio](how-to-create-attach-compute-studio.md#whats-a-compute-target)
> 2. Use this [endpoint YAML](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/aks/simple-flow/1-create-aks-endpoint-with-blue.yml) to target AKS instead of the above managed endpoint YAML. You'll need to edit the YAML to change the value of `target` to the name of your registered compute target.
> This article's commands, except for the optional SLA monitoring and Log Analytics integration, are interchangeable between managed and AKS endpoints.

### Registering your model and environment separately

 In this example, we're specifying the model and environment properties inline: `name`, `version`, and the `local_path` from which to upload files. Under the covers, the CLI will upload the files and register the model and environment automatically. As a best practice for production, you should separately register the model and environment and specify the registered name and version in the YAML. The form is `model: azureml:my-model:1` or `environment: azureml:my-env:1`.

 To do the registration, you may extract the YAML definitions of `model` and `environment` into separate YAML files and use the commands `az ml model create` and `az ml environment create`. To learn more about these commands, run `az ml model create -h` and `az ml environment create -h`.

### Using different CPU & GPU instance types

The above YAML uses a general purpose type (`Standard_F2s_v2`) and a non-GPU Docker image (in the YAML see the `image` attribute). For GPU compute, you should choose a GPU compute type SKU and a GPU Docker image.

You can see the supported general purpose and GPU instance types in [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). A list of Azure ML CPU & GPU base images can be found at [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

### Using more than one model

Currently, you can specify only one model per deployment in the YAML. If you've more than one model, you can work around this limitation: when you register the model, copy all the models (as files or subdirectories) into a folder that you use for registration. In your scoring script you can use the environment variable `AZUREML_MODEL_DIR` to get the path to the model root folder; the underlying directory structure is retained.

## Understand the scoring script

> [!Tip]
> The format of the scoring script for managed online endpoints is the same format used in earlier version of the CLI and in the Python SDK

As referred to in the above YAML, the `code_configuration.scoring_script` must have an `init()` function and a `run()` function. This example uses this [score.py file](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/model-1/onlinescoring/score.py). The `init()` function is called when the container is initialized/started. This initialization typically occurs shortly after the deployment is created or updated. Write logic here to do global initialization operations like caching the model in memory (as is done in this example). The `run()` function is called for every invocation of the endpoint and should do the actual scoring/prediction. In the example, we extract the data from the JSON input, call the `scikit-learn` model's `predict()` method, and return the result.

## Deploy and debug locally using local endpoints

To save time in debugging, it's **highly recommended** you test-run your endpoint locally.

> [!Note]
> * To deploy locally, you must have installed [Docker engine](https://docs.docker.com/engine/install/)
> * Your Docker engine must be running. Typically, the engine launches at startup, if not you can [troubleshoot here](https://docs.docker.com/config/daemon/#start-the-daemon-manually)

> [!Important]
> The goal of a local endpoint deployment is to validate and debug your code and configuration before deploying to Azure. Local deployment has the following limitations:
> - Local endpoints do **not** support traffic rules, authentication, scale settings, or probe settings. 
> - Local endpoints only support one deployment per endpoint. That is, in a local deployment you cannot use a reference to a model or environment registered in your Azure machine learning workspace. 

### Deploy the model locally

To deploy the model locally, run the following command:

```azurecli
az ml endpoint create --local -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
```

The `--local` flag directs the CLI to deploy the endpoint in the Docker environment.

>[!NOTE]
>If you use a Windows operating system, use `%ENDPOINT_NAME%` instead of `$ENDPOINT_NAME` here and in subsequent commands

### Check if the local deployment succeeded

Check if the model was deployed without error by checking the logs:

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

### Invoke the local endpoint to score data with your model

Invoke the endpoint to score the model by using the convenience command `invoke` and passing query parameters stored in a JSON file:

```azurecli
az ml endpoint invoke --local -n $ENDPOINT_NAME --request-file endpoints/online/model-1/sample-request.json
```

If you would like to use a REST client (such as curl), you need the scoring URI. You can get it using the command `az ml endpoint show --local -n $ENDPOINT_NAME`. In the returned data, you'll find an attribute named `scoring_uri`. 

### Review the logs for output from the invoke operation

In the example `score.py`, the `run()` method logs some output to the console. You can view this output by using the `get-logs` command again:

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

##  Deploy your managed online endpoint to Azure 

### Deploy to Azure

To deploy the YAML configuration to the cloud, run the following command:

::: code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="deploy" :::

This deployment can take approximately 8-14 minutes depending on whether the underlying environment/image is being built for the first time. Subsequent deployments using the same environment will go quicker.

> [!Tip]
> If you prefer not to block your CLI console, you may add the flag `--no-wait` to the command. However, this will stop the interactive display of the deployment status.

> [!Tip]
> Use [Troubleshooting managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md) to debug errors.

### Check the status of the deployment

The `show` command contains `provisioning_status` for both endpoint and deployment:

::: code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="get_status" :::

You may list all the endpoints in the workspace in a table format with the `list` command:

```azurecli
az ml endpoint list --output table
```

### Check if the cloud deployment succeeded

Check if the model was deployed without error by checking the logs:

:::code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="get_logs" :::

By default, logs are pulled from the inference-server. If you want to see the logs from the storage-initializer (which mounts the assets such as model and code to the container), add the flag `--container storage-initializer`.

### Invoke the endpoint to score data with your model

You can use either the `invoke` command or a REST client of your choice to invoke the endpoint and score some data: 

::: code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="test_endpoint" :::

You can again use the `get-logs` command shown previously to see the invocation logs.

To use a REST client, you'll need the `scoring_uri` and the auth key/token. The `scoring_uri` is available in the output of the `show` command:
 
::: code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="get_scoring_uri" :::

Note how we're using the `--query` to filter attributes to only what are needed. You can learn more about `--query` at [Query Azure CLI command output](/cli/azure/query-azure-cli).

Retrieve the necessary credentials using the `get-credentials` command:

```azurecli
az ml endpoint get-credentials -n $ENDPOINT_NAME
```

### [Optional] Update the deployment

If you want to update the code, model, environment, or your scale settings, update the YAML file and run the `az ml endpoint update` command. 

>[!IMPORTANT]
> You can only modify **one** aspect (traffic, scale settings, code, model, or environment) in a single `update` command. 

To understand how `update` works:

1. Open the file `online/model-1/onlinescoring/score.py`.
1. Change the last line of the `init()` function: after `logging.info("Init complete")`, add `logging.info("Updated successfully")`. 
1. Save the file
1. Run the command:
```azurecli
az ml endpoint update -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
```

> [!IMPORTANT]
> Update using the YAML is declarative. That is, changes in the YAML will be reflected in the underlying Azure Resource Manager resources (endpoints & deployments). This approach facilitates [GitOps](https://www.atlassian.com/git/tutorials/gitops): *ALL* changes to endpoints/deployments go through the YAML (even `instance_count`). As a side effect, if you remove a deployment from the YAML and run `az ml endpoint update` using the file, that deployment will be deleted. You may make updates without using the YAML using the `--set ` flag, as  described in the following Tip.

5. Because you modified the `init()` function, which runs when the endpoint is created or updates, the message `Updated successfully` will be in the logs. Retrieve the logs by running:
```azurecli
az ml endpoint get-logs -n $ENDPOINT_NAME --deployment blue
```

In the rare case that you want to delete and recreate your deployment because of an irresolvable issue, use:

```azurecli
az ml endpoint delete -n $ENDPOINT_NAME --deployment blue
```

The `update` command works with local endpoints as well. Use the same `az ml endpoint update` command with the flag `--local`.

> [!Tip]
> With the `az ml endpoint update` command, you may use the [`--set` parameter available in Azure CLI](/cli/azure/use-cli-effectively#generic-update-arguments) to override attributes in your YAML **or** for setting specific attributes without passing the YAML file. Use of `--set` for single attributes is especially valuable in dev/test scenarios. For example, to scale up the `instance_count` of the first deployment, you could use the flag `--set deployments[0].scale_settings.instance_count=2`. However, since the YAML isn't updated, this technique doesn't facilitate [GitOps](https://www.atlassian.com/git/tutorials/gitops).

### [Optional] Monitor SLA using Azure Monitor

You can view metrics and set alerts based on your SLA by following instructions in [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).

### [Optional] Integrate with Log Analytics

The `get-logs` command will only provide the last few-hundred lines of logs from an automatically selected instance. However, Log Analytics provides a way to store and analyze logs durably. First, follow the steps in [Create a Log Analytics workspace in the Azure portal](/azure/azure-monitor/logs/quick-create-workspace#create-a-workspace) to create a Log Analytics workspace.

Then, in the Azure portal:

1. Go to the resource group
1. Choose your endpoint
1. Select the **ARM resource page**
1. Select **Diagnostic settings**
1. Select **Add settings**: Enable sending console logs to the log analytics workspace

Note that it might take up to an hour for the logs to be connected. Send some scoring requests after this time period and then check the logs using the following steps:

1. Open the Log Analytics workspace 
1. Select **Logs** in the left navigation area
1. Close the **Queries** popup that automatically opens
1. Double-click on **AmlOnlineEndpointConsoleLog**
1. Select *Run*

## Delete the endpoint and deployment

If you aren't going use the deployment, you should delete it with the below command (it deletes the endpoint and all the underlying deployments):

::: code language="azurecli" source="~/azureml-examples-main/cli/how-to-deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

## Next steps

- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)|
- [Troubleshooting managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)
