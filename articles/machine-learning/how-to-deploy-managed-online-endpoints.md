---
title: Deploy a machine learning model by using a managed online endpoint (preview)
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as a web service that's automatically managed by Azure.
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

# Deploy and score a machine learning model by using a managed online endpoint (preview)

Learn how to use a managed online endpoint (preview) to deploy your model, so you don't have to create and manage the underlying infrastructure. You'll begin by deploying a model on your local machine to debug any errors, and then you'll deploy and test it in Azure. 

You'll also learn how to view the logs and monitor the service-level agreement (SLA). You start with a model and end up with a scalable HTTPS/REST endpoint that you can use for online and real-time scoring. 

For more information, see [What are Azure Machine Learning endpoints (preview)?](concept-endpoints.md).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). 

* You must have an Azure resource group, and you (or the service principal you use) must have Contributor access to it. A resource group is created in [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). 

* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md).

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

## Prepare your system

To follow along with this article, first clone the samples repository (azureml-examples). Then, run the following code to go to the samples directory:

```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

To set your endpoint name, choose one of the following commands, depending on your operating system (replace `YOUR_ENDPOINT_NAME` with a unique name).

For Unix, run this command:

```azurecli
export ENDPOINT_NAME=YOUR_ENDPOINT_NAME
```

For Windows, run this command:

```azurecli
set ENDPOINT_NAME=YOUR_ENDPOINT_NAME
```

> [!NOTE]
> Endpoint names must be unique within an Azure region. For example, in the Azure westus2 region, there can be only one endpoint with the name `my-endpoint`. 

## Define the endpoint configuration

Specific inputs are required to deploy a model on an online endpoint:

- Model files (or the name and version of a model that's already registered in your workspace). In the example, we have a scikit-learn model that does regression.
- The code that's required to score the model. In this case, we have a *score.py* file.
- An environment in which your model runs. As you'll see, the environment might be a Docker image with Conda dependencies, or it might be a Dockerfile.
- Settings to specify the instance type and scaling capacity.

The following snippet shows the *endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml* file, which captures all the required inputs: 

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml":::

> [!NOTE]
> For a full description of the YAML, see [Managed online endpoints (preview) YAML reference](reference-yaml-endpoint-managed-online.md).

The reference for the endpoint YAML format is described in the following table. To learn how to specify these attributes, see the YAML example in [Prepare your system](#prepare-your-system) or the [online endpoint YAML reference](reference-yaml-endpoint-managed-online.md). For information about limits related to managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview).

| Key | Description |
| --- | --- |
| `$schema`    | (Optional) The YAML schema. To see all available options in the YAML file, you can view the schema in the preceding example in a browser.|
| `name`       | The name of the endpoint. It must be unique in the Azure region.|
| `traffic` | The percentage of traffic from the endpoint to divert to each deployment. The sum of traffic values must be 100. |
| `auth_mode` | Use `key` for key-based authentication or use `aml_token` for Azure Machine Learning token-based authentication. `key` doesn't expire, but `aml_token` does expire. (Get the most recent token by using the `az ml endpoint get-credentials` command.) |
| `deployments` | The list of deployments to be created in the endpoint. In this case, we have only one deployment, named `blue`. For more information about multiple deployments, see [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md).|

The next table describes the attributes of `deployments`:

| Key | Description |
| --- | --- |
| `name`  | The name of the deployment. |
| `model` | In this example, we specify these model properties inline: `name`, `version`, and `local_path`. Model files are automatically uploaded and registered. A downside of inline specification is that you must increment the version manually if you want to update the model files. For related best practices, see the tip in the next section. |
| `code_configuration.code.local_path` | The directory that contains all the Python source code for scoring the model. You can use nested directories and packages. |
| `code_configuration.scoring_script` | The Python file that's in the `code_configuration.code.local_path` scoring directory. This Python code must have an `init()` function and a `run()` function. The function `init()` will be called after the model is created or updated (you can use it to cache the model in memory, for example). The `run()` function is called at every invocation of the endpoint to do the actual scoring and prediction. |
| `environment` | Contains the details of the environment to host the model and code. In this example, we have inline definitions that include `name`, `version`, and `path`. We'll use `environment.docker.image` for the image. The `conda_file` dependencies will be installed on top of the image. For more information,  see the tip in the next section. |
| `instance_type` | The VM SKU that will host your deployment instances. For more information, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). |
| `scale_settings.scale_type` | Currently, this value must be `manual`. To scale up or scale down after you create the endpoint and deployment, update `instance_count` in the YAML and run the command `az ml endpoint update -n $ENDPOINT_NAME --file <yaml filepath>`.|
| `scale_settings.instance_count` | The number of instances in the deployment. Base the value on the workload you expect. For high availability, we recommend that you set `scale_settings.instance_count` to at least `3`. |

For more information about the YAML schema, see the [online endpoint YAML reference](reference-yaml-endpoint-managed-online.md).

> [!NOTE]
> To use Azure Kubernetes Service (AKS) instead of managed endpoints as a compute target:
> 1. Create and attach your AKS cluster as a compute target to your Azure Machine Learning workspace by using [Azure ML Studio](how-to-create-attach-compute-studio.md#whats-a-compute-target).
> 1. Use the [endpoint YAML](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/aks/simple-flow/1-create-aks-endpoint-with-blue.yml) to target AKS instead of the managed endpoint YAML. You'll need to edit the YAML to change the value of `target` to the name of your registered compute target.
>
> All the commands that are used in this article (except the optional SLA monitoring and Azure Log Analytics integration) can be used either with managed endpoints or with AKS endpoints.

### Register your model and environment separately

In this example, we specify the model and environment properties inline: `name`, `version`, and `local_path` (where to upload files from). The CLI automatically uploads the files and registers the model and environment. As a best practice for production, you should register the model and environment and specify the registered name and version separately in the YAML. Use the form `model: azureml:my-model:1` or `environment: azureml:my-env:1`.

For registration, you can extract the YAML definitions of `model` and `environment` into separate YAML files and use the commands `az ml model create` and `az ml environment create`. To learn more about these commands, run `az ml model create -h` and `az ml environment create -h`.

### Use different CPU and GPU instance types

The preceding YAML uses a general-purpose type (`Standard_F2s_v2`) and a non-GPU Docker image (in the YAML, see the `image` attribute). For GPU compute, choose a GPU compute type SKU and a GPU Docker image.

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For a list of Azure Machine Learning CPU and GPU base images, see [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

### Use more than one model

Currently, you can specify only one model per deployment in the YAML. If you have more than one model, when you register the model, copy all the models as files or subdirectories into a folder that you use for registration. In your scoring script, use the environment variable `AZUREML_MODEL_DIR` to get the path to the model root folder. The underlying directory structure is retained.

## Understand the scoring script

> [!TIP]
> The format of the scoring script for managed online endpoints is the same format that's used in the preceding version of the CLI and in the Python SDK.

As noted earlier, the `code_configuration.scoring_script` must have an `init()` function and a `run()` function. This example uses the [score.py file](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/model-1/onlinescoring/score.py). The `init()` function is called when the container is initialized or started. Initialization typically occurs shortly after the deployment is created or updated. Write logic here for global initialization operations like caching the model in memory (as we do in this example). The `run()` function is called for every invocation of the endpoint and should do the actual scoring and prediction. In the example, we extract the data from the JSON input, call the scikit-learn model's `predict()` method, and then return the result.

## Deploy and debug locally by using local endpoints

To save time debugging, we *highly recommend* that you test-run your endpoint locally.

> [!NOTE]
> * To deploy locally, [Docker Engine](https://docs.docker.com/engine/install/) must be installed.
> * Docker Engine must be running. Docker Engine typically starts when the computer starts. If it doesn't, you can [troubleshoot Docker Engine](https://docs.docker.com/config/daemon/#start-the-daemon-manually).

> [!IMPORTANT]
> The goal of a local endpoint deployment is to validate and debug your code and configuration before you deploy to Azure. Local deployment has the following limitations:
> - Local endpoints do *not* support traffic rules, authentication, scale settings, or probe settings. 
> - Local endpoints support only one deployment per endpoint. That is, in a local deployment, you can't use a reference to a model or environment that's registered in your Azure Machine Learning workspace. 

### Deploy the model locally

To deploy the model locally:

```azurecli
az ml endpoint create --local -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
```

> [!NOTE]
> If you use a Windows operating system, use `%ENDPOINT_NAME%` instead of `$ENDPOINT_NAME` here and in subsequent commands

The `--local` flag directs the CLI to deploy the endpoint in the Docker environment.

### Verify the local deployment succeeded

Check the logs to see whether the model was deployed without error:

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

### Invoke the local endpoint to score data by using your model

Invoke the endpoint to score the model by using the convenience command `invoke` and passing query parameters that are stored in a JSON file:

```azurecli
az ml endpoint invoke --local -n $ENDPOINT_NAME --request-file endpoints/online/model-1/sample-request.json
```

If you want to use a REST client (like curl), you must have the scoring URI. To get the scoring URI, run `az ml endpoint show --local -n $ENDPOINT_NAME`. In the returned data, find the `scoring_uri` attribute. 

### Review the logs for output from the invoke operation

In the example *score.py* file, the `run()` method logs some output to the console. You can view this output by using the `get-logs` command again:

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

##  Deploy your managed online endpoint to Azure

Next, deploy your managed online endpoint to Azure.

### Deploy to Azure

To deploy the YAML configuration to the cloud, run the following code:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="deploy" :::

This deployment might take up to 15 minutes, depending on whether the underlying environment or image is being built for the first time. Subsequent deployments that use the same environment will finish processing more quickly.

> [!TIP]
> * If you prefer not to block your CLI console, you may add the flag `--no-wait` to the command. However, this will stop the interactive display of the deployment status.
>
> * Use [Troubleshooting managed online endpoints deployment (preview)](how-to-troubleshoot-managed-online-endpoints.md) to debug errors.

### Check the status of the deployment

The `show` command contains information in `provisioning_status` for endpoint and deployment:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_status" :::

You can list all the endpoints in the workspace in a table format by using the `list` command:

```azurecli
az ml endpoint list --output table
```

### Check the status of the cloud deployment

Check the logs to see whether the model was deployed without error:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

By default, logs are pulled from inference-server. To see the logs from storage-initializer (it mounts assets like model and code to the container), add the `--container storage-initializer` flag.

### Invoke the endpoint to score data by using your model

You can use either the `invoke` command or a REST client of your choice to invoke the endpoint and score some data: 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint" :::

To see the invocation logs, run `get-logs` again.

To use a REST client, you must have the value for `scoring_uri` and the authentication key or token. The `scoring_uri` value is available in the output of the `show` command:
 
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_scoring_uri" :::

We're using the `--query` flag to filter attributes to only what we need. To learn more about `--query`, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

Retrieve the required credentials by using the `get-credentials` command:

```azurecli
az ml endpoint get-credentials -n $ENDPOINT_NAME
```

### (Optional) Update the deployment

If you want to update the code, model, environment, or your scale settings, update the YAML file, and then run the `az ml endpoint update` command. 

> [!IMPORTANT]
> You can  modify only *one* aspect (traffic, scale settings, code, model, or environment) in a single `update` command. 

To understand how `update` works:

1. Open the file *online/model-1/onlinescoring/score.py*.
1. Change the last line of the `init()` function: After `logging.info("Init complete")`, add `logging.info("Updated successfully")`. 
1. Save the file.
1. Run this command:

    ```azurecli
    az ml endpoint update -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
    ```

    > [!IMPORTANT]
    > Updating by using YAML is declarative. That is, changes in the YAML are reflected in the underlying Azure Resource Manager resources (endpoints and deployments). A declarative approach facilitates [GitOps](https://www.atlassian.com/git/tutorials/gitops): *All* changes to endpoints and deployments (even `instance_count`) go through the YAML. As a result, if you remove a deployment from the YAML and run `az ml endpoint update` by using the file, the deployment will be deleted. You can make updates without using the YAML by using the `--set` flag.
    
1. Because you modified the `init()` function (`init()` runs when the endpoint is created or updated), the message `Updated successfully` will be in the logs. Retrieve the logs by running:

    ```azurecli
    az ml endpoint get-logs -n $ENDPOINT_NAME --deployment blue
    ```

In the rare case that you want to delete and re-create your deployment because of an irresolvable issue, run:

```azurecli
az ml endpoint delete -n $ENDPOINT_NAME --deployment blue
```

The `update` command also works with local endpoints. Use the same `az ml endpoint update` command with the `--local` flag.

> [!TIP]
> With the `az ml endpoint update` command, you can use the [`--set` parameter in the Azure CLI](/cli/azure/use-cli-effectively#generic-update-arguments) to override attributes in your YAML *or* to set specific attributes without passing the YAML file. Using `--set` for single attributes is especially valuable in development and test scenarios. For example, to scale up the `instance_count` value for the first deployment, you could use the `--set deployments[0].scale_settings.instance_count=2` flag. However, because the YAML isn't updated, this technique doesn't facilitate [GitOps](https://www.atlassian.com/git/tutorials/gitops).

### (Optional) Monitor SLA by using Azure Monitor

To view metrics and set alerts based on your SLA, complete the steps that are described in [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).

### (Optional) Integrate with Log Analytics

The `get-logs` command provides only the last few hundred lines of logs from an automatically selected instance. However, Log Analytics provides a way to durably store and analyze logs. 

First, create a Log Analytics workspace by completing the steps in [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md#create-a-workspace).

Then, in the Azure portal:

1. Go to the resource group.
1. Select your endpoint.
1. Select the **ARM resource page**.
1. Select **Diagnostic settings**.
1. Select **Add settings**.
1. Select to enable sending console logs to the Log Analytics workspace.

The logs might take up to an hour to connect. After an hour, send some scoring requests, and then check the logs by using the following steps:

1. Open the Log Analytics workspace. 
1. In the left menu, select **Logs**.
1. Close the **Queries** dialog that automatically opens.
1. Double-click **AmlOnlineEndpointConsoleLog**.
1. Select **Run**.

## Delete the endpoint and the deployment

If you aren't going use the deployment, you should delete it by running the following code (it deletes the endpoint and all the underlying deployments):

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

## Next steps

To learn more, review these articles:

- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [Create and use managed online endpoints (preview) in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md)
- [Use batch endpoints (preview) for batch scoring](how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Tutorial: Access Azure resources by using a managed online endpoint and system-managed identity (preview)](tutorial-deploy-managed-endpoints-using-system-managed-identity.md)
- [Troubleshoot managed online endpoints deployment](how-to-troubleshoot-managed-online-endpoints.md)
