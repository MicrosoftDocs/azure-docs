---
title: 'Tutorial: Managed online endpoints for accessing resources'
description: Securely access Azure resources for your machine learning model deployment with a managed online endpoint and a system-assigned managed identity.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 058/05/2021
ms.topic: tutorial
ms.custom: tutorial, devplatv2

# Customer intent: As a data scientist, I want to securely access Azure resources for my machine learning model deployment with a managed online endpoint and system assigned managed identity. 
---

# Tutorial: Access resources with managed online endpoints and identity (preview)

In this tutorial, you learn how to securely access Azure resources from your scoring script with a managed online endpoint and a system-assigned managed identity.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]
This tutorial demonstrates how to take the following actions with the Azure CLI and its ML extension:

> [!div class="checklist"]
> * Set the default values for the Azure CLI to use
> * Configure the variables to be used with your managed online endpoint
> * Create a blob storage account and blob container 
> * Create a managed online endpoint
> * Give the system assigned managed identity permission to access storage
> * Create a deployment associated with managed endpoint


## Prerequisites

* To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace. You'll have such a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment.


## Set the defaults for Azure CLI

To ensure the correct resources are used throughout this tutorial, set the default values for the Azure subscription ID, Azure Machine Learning workspace, and resource group you want to use. Doing so allows you to avoid having to repeatedly pass in the values every time you call an Azure CLI command. 

> [!IMPORTANT]
> Ensure your user account has "User Access Administrator" role assigned to resource group. 

```azurecli
az account set --subscription <subscription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```

## Define the configuration YAML file for your deployment

To deploy a managed endpoint, you first need to define the configuration for your endpoint in a YAML file.

The following code example creates a managed endpoint that,  
* Shows the YAML files from `endpoints/online/managed/managed-identities/` directory.
* Defines the name by which you want to refer to the endpoint, `my-sai-endpoint`
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`
* Specifies that the type of endpoint you want to create is an `online` endpoint. 
* Indicates that the endpoint has an associated deployment called `blue`
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/2-sai-deployment.yml":::

For a reference to the YAML, see [Managed online endpoints (preview) YAML reference](reference-yaml-endpoint-managed-online.md).

## Configure variables for your deployment

Configure the variable names for the workspace, workspace location, and the endpoint you want to create. The following code exports these values as environment variables in your endpoint:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

The following code exports those values as environment variables:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="configure_storage_names" :::


After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system assigned managed identity that's generated upon endpoint creation.

## Create blob storage and container

For this example, you create a blob storage account and blob container, and then upload the previously created text file to the blob container. 

First, create a storage account. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_account" :::

Next, create the blob container in storage account. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_container" :::

Then, upload your text file to the blob container. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="upload_file_to_storage" :::

## Create a managed online endpoint

The following code creates a managed online endpoint without specifying a deployment. Deployment creation is done later in the tutorial.

When you create a managed endpoint, a system-assigned managed identity is created for the endpoint by default.

>[!IMPORTANT]
> System assigned managed identities are immutable and can't be changed once created.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_endpoint" :::

Check the status of the endpoint with the following. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_endpoint_Status" :::

If you encounter any issues, see [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md).

## Give storage permission to system-assigned managed identity

You can allow the managed endpoint permission to access your storage via its system assigned managed identity. 

Retrieve the system- assigned managed identity was created for your endpoint. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="get_system_identity" :::

From here, you can give the system-assigned managed identity permission to access your storage.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="give_permission_to_user_storage_account" :::

## Scoring script to access Azure resource

Refer to the following scoring script, to understand how to use system-assigned managed identity token to access Azure resources. In this scenario, the Azure resource is the storage account created in previous sections. 

:::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score_managedidentity.py":::

## Create a deployment using your configuration

Create a deployment that's associated with the managed endpoint.

This deployment can take approximately 8-14 minutes depending on whether the underlying environment/image is being built for the first time. Subsequent deployments using the same environment will go quicker.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="deploy" :::

Check the status of the deployment. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deploy_Status" :::

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system assigned managed identity token. 

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deployment_log" :::

Once this command completes, you will have registered the model, the environment, and the endpoint in your Azure Machine Learning workspace.

### Confirm your endpoint deployed successfully

Once your endpoint is deployed, confirm its operation. Details of inferencing vary from model to model. For this tutorial, the JSON query parameters look like: 

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/model-1/sample-request.json" :::

To call your endpoint, run: 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="test_endpoint" :::


## Delete the endpoint and storage account

If you don't plan to continue using the deployed endpoint and storage, delete them to reduce costs. When you delete the endpoint, all of its associated deployments are deleted as well. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_storage_account" :::

## Next steps

In this Azure Machine Learning tutorial, you used the machine learning CLI for the following tasks:

> [!div class="checklist"]
> * Set the default values for the Azure CLI to use
> * Configure the variables to be used with your endpoint
> * Create a blob storage account and Blob container 
> * Create a managed endpoint
> * Give the system assigned managed identity permission to access storage
> * Create a deployment associated with managed endpoint

* For more information on using the CLI, see [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To refine JSON queries to only return specific data, see [Query Azure CLI command output](/cli/azure/query-azure-cli).
* For more information on the YAML schema, see [online endpoint YAML reference](reference-yaml-endpoint-managed-online.md) document.
* To see which compute resources you can use, see [Managed online endpoints SKU list (preview)](reference-managed-online-endpoints-vm-sku-list.md).
* For more on costs, see [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md).
* For more on deployment, see [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md).
* For information on monitoring endpoints, see [Monitor managed online endpoints (preview)](how-to-monitor-online-endpoints.md).
* For information on limitations for managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview).
