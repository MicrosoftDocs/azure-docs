---
title: Deploy an ML model by using an online endpoint
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as a web service that's to Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: dem108
ms.author: sehan
ms.reviewer: larryfr
ms.date: 08/31/2022
ms.topic: how-to
ms.custom: how-to, devplatv2, ignite-fall-2021, cliv2, event-tier1-build-2022
---

# Deploy and score a machine learning model by using an online endpoint

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


Learn how to use an online endpoint to deploy your model, so you don't have to create and manage the underlying infrastructure. You'll begin by deploying a model on your local machine to debug any errors, and then you'll deploy and test it in Azure.

You'll also learn how to view the logs and monitor the service-level agreement (SLA). You start with a model and end up with a scalable HTTPS/REST endpoint that you can use for online and real-time scoring. 

Managed online endpoints help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. The main example in this doc uses managed online endpoints for deployment. To use Kubernetes instead, see the notes in this document inline with the managed online endpoint discussion. For more information, see [What are Azure Machine Learning endpoints?](concept-endpoints.md).

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* Install and configure the Azure CLI and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure resource group, and you (or the service principal you use) must have Contributor access to it. A resource group is created in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

* (Optional) To deploy locally, you must [install Docker Engine](https://docs.docker.com/engine/install/) on your local computer. We *highly recommend* this option, so it's easier to debug issues.

> [!IMPORTANT]
> The examples in this document assume that you are using the Bash shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about). 

## Prepare your system

To follow along with this article, first clone the samples repository (azureml-examples). Then, run the following code to go to the samples directory:

```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples
cd cli
```

To set your endpoint name, choose one of the following commands, depending on your operating system (replace `YOUR_ENDPOINT_NAME` with a unique name).

For Unix, run this command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="set_endpoint_name":::

> [!NOTE]
> Endpoint names must be unique within an Azure region. For example, in the Azure `westus2` region, there can be only one endpoint with the name `my-endpoint`. 

## Review the endpoint and deployment configurations

The following snippet shows the *endpoints/online/managed/sample/endpoint.yml* file: 

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/endpoint.yml":::

> [!NOTE]
> For a full description of the YAML, see [Online endpoint YAML reference](reference-yaml-endpoint-online.md).

The reference for the endpoint YAML format is described in the following table. To learn how to specify these attributes, see the YAML example in [Prepare your system](#prepare-your-system) or the [online endpoint YAML reference](reference-yaml-endpoint-online.md). For information about limits related to managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).

| Key | Description |
| --- | --- |
| `$schema`    | (Optional) The YAML schema. To see all available options in the YAML file, you can view the schema in the preceding example in a browser.|
| `name`       | The name of the endpoint. It must be unique in the Azure region.<br>Naming rules are defined under [managed online endpoint limits](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).|
| `auth_mode` | Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. `key` doesn't expire, but `aml_token` does expire. (Get the most recent token by using the `az ml online-endpoint get-credentials` command.) |

The example contains all the files needed to deploy a model on an online endpoint. To deploy a model, you must have:

- Model files (or the name and version of a model that's already registered in your workspace). In the example, we have a scikit-learn model that does regression.
- The code that's required to score the model. In this case, we have a *score.py* file.
- An environment in which your model runs. As you'll see, the environment might be a Docker image with Conda dependencies, or it might be a Dockerfile.
- Settings to specify the instance type and scaling capacity.

The following snippet shows the *endpoints/online/managed/sample/blue-deployment.yml* file, with all the required inputs: 

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/blue-deployment.yml":::

The table describes the attributes of a `deployment`:

| Key | Description |
| --- | --- |
| `name`  | The name of the deployment. |
| `model` | In this example, we specify the model properties inline: `path`. Model files are automatically uploaded and registered with an autogenerated name. For related best practices, see the tip in the next section. |
| `code_configuration.code.path` | The directory on the local development environment that contains all the Python source code for scoring the model. You can use nested directories and packages. |
| `code_configuration.scoring_script` | The Python file that's in the `code_configuration.code.path` scoring directory on the local development environment. This Python code must have an `init()` function and a `run()` function. The function `init()` will be called after the model is created or updated (you can use it to cache the model in memory, for example). The `run()` function is called at every invocation of the endpoint to do the actual scoring and prediction. |
| `environment` | Contains the details of the environment to host the model and code. In this example, we have inline definitions that include the`path`. We'll use `environment.docker.image` for the image. The `conda_file` dependencies will be installed on top of the image. For more information, see the tip in the next section. |
| `instance_type` | The VM SKU that will host your deployment instances. For more information, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). |
| `instance_count` | The number of instances in the deployment. Base the value on the workload you expect. For high availability, we recommend that you set `instance_count` to at least `3`. We reserve an extra 20% for performing upgrades. For more information, see [managed online endpoint quotas](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints). |

During deployment, the local files such as the Python source for the scoring model, are uploaded from the development environment.

For more information about the YAML schema, see the [online endpoint YAML reference](reference-yaml-endpoint-online.md).

> [!NOTE]
> To use Kubernetes instead of managed endpoints as a compute target:
> 1. Create and attach your Kubernetes cluster as a compute target to your Azure Machine Learning workspace by using [Azure Machine Learning studio](how-to-attach-kubernetes-to-workspace.md).
> 1. Use the [endpoint YAML](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/kubernetes/kubernetes-endpoint.yml) to target Kubernetes instead of the managed endpoint YAML. You'll need to edit the YAML to change the value of `target` to the name of your registered compute target. You can use this [deployment.yaml](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/kubernetes/kubernetes-blue-deployment.yml) that has additional properties applicable to Kubernetes deployment.
>
> All the commands that are used in this article (except the optional SLA monitoring and Azure Log Analytics integration) can be used either with managed endpoints or with Kubernetes endpoints.

### Register your model and environment separately

In this example, we specify the `path` (where to upload files from) inline. The CLI automatically uploads the files and registers the model and environment. As a best practice for production, you should register the model and environment and specify the registered name and version separately in the YAML. Use the form `model: azureml:my-model:1` or `environment: azureml:my-env:1`.

For registration, you can extract the YAML definitions of `model` and `environment` into separate YAML files and use the commands `az ml model create` and `az ml environment create`. To learn more about these commands, run `az ml model create -h` and `az ml environment create -h`.

### Use different CPU and GPU instance types

The preceding YAML uses a general-purpose type (`Standard_F2s_v2`) and a non-GPU Docker image (in the YAML, see the `image` attribute). For GPU compute, choose a GPU compute type SKU and a GPU Docker image.

For supported general-purpose and GPU instance types, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md). For a list of Azure Machine Learning CPU and GPU base images, see [Azure Machine Learning base images](https://github.com/Azure/AzureML-Containers).

> [!NOTE]
> To use Kubernetes instead of managed endpoints as a compute target, see [Introduction to Kubermentes compute target](./how-to-attach-kubernetes-anywhere.md)

### Use more than one model

Currently, you can specify only one model per deployment in the YAML. If you've more than one model, when you register the model, copy all the models as files or subdirectories into a folder that you use for registration. In your scoring script, use the environment variable `AZUREML_MODEL_DIR` to get the path to the model root folder. The underlying directory structure is retained.

## Understand the scoring script

> [!TIP]
> The format of the scoring script for online endpoints is the same format that's used in the preceding version of the CLI and in the Python SDK.

As noted earlier, the `code_configuration.scoring_script` must have an `init()` function and a `run()` function. This example uses the [score.py file](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/model-1/onlinescoring/score.py). The `init()` function is called when the container is initialized or started. Initialization typically occurs shortly after the deployment is created or updated. Write logic here for global initialization operations like caching the model in memory (as we do in this example). The `run()` function is called for every invocation of the endpoint and should do the actual scoring and prediction. In the example, we extract the data from the JSON input, call the scikit-learn model's `predict()` method, and then return the result.

## Deploy and debug locally by using local endpoints

To save time debugging, we *highly recommend* that you test-run your endpoint locally. For more, see [Debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

> [!NOTE]
> * To deploy locally, [Docker Engine](https://docs.docker.com/engine/install/) must be installed.
> * Docker Engine must be running. Docker Engine typically starts when the computer starts. If it doesn't, you can [troubleshoot Docker Engine](https://docs.docker.com/config/daemon/#start-the-daemon-manually).

> [!IMPORTANT]
> The goal of a local endpoint deployment is to validate and debug your code and configuration before you deploy to Azure. Local deployment has the following limitations:
> - Local endpoints do *not* support traffic rules, authentication, or probe settings. 
> - Local endpoints support only one deployment per endpoint. 

### Deploy the model locally

First create the endpoint. Optionally, for a local endpoint, you can skip this step and directly create the deployment (next step), which will, in turn, create the required metadata. This is useful for development and testing purposes.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="create_endpoint":::

Now, create a deployment named `blue` under the endpoint.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="create_deployment":::

The `--local` flag directs the CLI to deploy the endpoint in the Docker environment.

> [!TIP]
> Use Visual Studio Code to test and debug your endpoints locally. For more information, see [debug online endpoints locally in Visual Studio Code](how-to-debug-managed-online-endpoints-visual-studio-code.md).

### Verify the local deployment succeeded

Check the status to see whether the model was deployed without error:

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

The following table contains the possible values for `provisioning_state`:

| State | Description |
| ----- | ----- |
| __Creating__ | The resource is being created. |
| __Updating__ | The resource is being updated. |
| __Deleting__ | The resource is being deleted. |
| __Succeeded__ | The create/update operation was successful. |
| __Failed__ | The create/update/delete operation has failed. |

### Invoke the local endpoint to score data by using your model

Invoke the endpoint to score the model by using the convenience command `invoke` and passing query parameters that are stored in a JSON file:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="test_endpoint":::

If you want to use a REST client (like curl), you must have the scoring URI. To get the scoring URI, run `az ml online-endpoint show --local -n $ENDPOINT_NAME`. In the returned data, find the `scoring_uri` attribute. Sample curl based commands are available later in this doc.

### Review the logs for output from the invoke operation

In the example *score.py* file, the `run()` method logs some output to the console. You can view this output by using the `get-logs` command again:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-local-endpoint.sh" ID="get_logs":::

##  Deploy your online endpoint to Azure

Next, deploy your online endpoint to Azure.

### Deploy to Azure

To create the endpoint in the cloud, run the following code:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="create_endpoint" :::

To create the deployment named `blue` under the endpoint, run the following code:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="create_deployment" :::

This deployment might take up to 15 minutes, depending on whether the underlying environment or image is being built for the first time. Subsequent deployments that use the same environment will finish processing more quickly.

> [!IMPORTANT]
> The `--all-traffic` flag in the above `az ml online-deployment create` allocates 100% of the traffic to the endpoint to the newly created deployment. Though this is helpful for development and testing purposes, for production, you might want to open traffic to the new deployment through an explicit command. For example,
> `az ml online-endpoint update -n $ENDPOINT_NAME --traffic "blue=100"` 

> [!TIP]
> * If you prefer not to block your CLI console, you may add the flag `--no-wait` to the command. However, this will stop the interactive display of the deployment status.
>
> * Use [Troubleshooting online endpoints deployment](./how-to-troubleshoot-online-endpoints.md) to debug errors.

### Check the status of the deployment

The `show` command contains information in `provisioning_status` for endpoint and deployment:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_status" :::

You can list all the endpoints in the workspace in a table format by using the `list` command:

```azurecli
az ml online-endpoint list --output table
```

### Check the status of the cloud deployment

Check the logs to see whether the model was deployed without error:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

By default, logs are pulled from inference-server. To see the logs from storage-initializer (it mounts assets like model and code to the container), add the `--container storage-initializer` flag.

### Invoke the endpoint to score data by using your model

You can use either the `invoke` command or a REST client of your choice to invoke the endpoint and score some data: 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint" :::

The following example shows how to get the key used to authenticate to the endpoint:

> [!TIP]
> You can control which Azure Active Directory security principals can get the authentication key by assigning them to a custom role that allows `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/token/action` and `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/listkeys/action`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl_get_key":::

Next, use curl to score data.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="test_endpoint_using_curl" :::

Notice we use `show` and `get-credentials` commands to get the authentication credentials. Also notice that we're using the `--query` flag to filter attributes to only what we need. To learn more about `--query`, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

To see the invocation logs, run `get-logs` again.

For information on authenticating using a token, see [Authenticate to online endpoints](how-to-authenticate-online-endpoint.md).

### (Optional) Update the deployment

If you want to update the code, model, or environment, update the YAML file, and then run the `az ml online-endpoint update` command. 

> [!NOTE]
> If you update instance count and along with other model settings (code, model, or environment) in a single `update` command: first the scaling operation will be performed, then the other updates will be applied. In production environment is a good practice to perform these operations separately.

To understand how `update` works:

1. Open the file *online/model-1/onlinescoring/score.py*.
1. Change the last line of the `init()` function: After `logging.info("Init complete")`, add `logging.info("Updated successfully")`. 
1. Save the file.
1. Run this command:

    ```azurecli
    az ml online-deployment update -n blue --endpoint $ENDPOINT_NAME -f endpoints/online/managed/sample/blue-deployment.yml
    ```

    > [!Note]
    > Updating by using YAML is declarative. That is, changes in the YAML are reflected in the underlying Azure Resource Manager resources (endpoints and deployments). A declarative approach facilitates [GitOps](https://www.atlassian.com/git/tutorials/gitops): *All* changes to endpoints and deployments (even `instance_count`) go through the YAML. You can make updates without using the YAML by using the `--set` flag.
    
1. Because you modified the `init()` function (`init()` runs when the endpoint is created or updated), the message `Updated successfully` will be in the logs. Retrieve the logs by running:

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="get_logs" :::

The `update` command also works with local deployments. Use the same `az ml online-deployment update` command with the `--local` flag.

> [!TIP]
> With the `update` command, you can use the [`--set` parameter in the Azure CLI](/cli/azure/use-cli-effectively#generic-update-arguments) to override attributes in your YAML *or* to set specific attributes without passing the YAML file. Using `--set` for single attributes is especially valuable in development and test scenarios. For example, to scale up the `instance_count` value for the first deployment, you could use the `--set instance_count=2` flag. However, because the YAML isn't updated, this technique doesn't facilitate [GitOps](https://www.atlassian.com/git/tutorials/gitops).

> [!Note]
> The above is an example of inplace rolling update.
> * For managed online endpoint, the same deployment is updated with the new configuration, with 20% nodes at a time, i.e. if the deployment has 10 nodes, 2 nodes at a time will be updated. 
> * For Kubernetes online endpoint, the system will iterately create a new deployment instance with the new configuration and delete the old one.
> * For production usage, you might want to consider [blue-green deployment](how-to-safely-rollout-managed-endpoints.md), which offers a safer alternative.

### (Optional) Configure autoscaling

Autoscale automatically runs the right amount of resources to handle the load on your application. Managed online endpoints support autoscaling through integration with the Azure monitor autoscale feature. To configure autoscaling, see [How to autoscale online endpoints](how-to-autoscale-endpoints.md).

### (Optional) Monitor SLA by using Azure Monitor

To view metrics and set alerts based on your SLA, complete the steps that are described in [Monitor online endpoints](how-to-monitor-online-endpoints.md).

### (Optional) Integrate with Log Analytics

The `get-logs` command provides only the last few hundred lines of logs from an automatically selected instance. However, Log Analytics provides a way to durably store and analyze logs. For more information on using logging, see [Monitor online endpoints](how-to-monitor-online-endpoints.md#logs)

[!INCLUDE [Email Notification Include](../../includes/machine-learning-email-notifications.md)]

## Delete the endpoint and the deployment

If you aren't going use the deployment, you should delete it by running the following code (it deletes the endpoint and all the underlying deployments):

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

## Next steps

To learn more, review these articles:

- [Deploy models with REST](how-to-deploy-with-rest.md)
- [Create and use online endpoints in the studio](how-to-use-managed-online-endpoint-studio.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoints deployment](how-to-troubleshoot-online-endpoints.md)
- [Enable network isolation with managed online endpoints](how-to-secure-online-endpoint.md)
