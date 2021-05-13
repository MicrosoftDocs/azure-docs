---
title: Deploy a managed endpoint using system managed identity for accessing Azure resources.
titleSuffix: Azure Machine Learning
description: Deploy your machine learning model as a web service managed by Azure and use system managed identity for accessing Azure resources within your scoring script.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 05/25/2021
ms.topic: tutorial
ms.custom: tutorial
---

# Tutorial: Deploy and score a machine learning model with a managed endpoint (preview)

In this tutorial, you learn how to create a managed endpoint  to deploy and score a machine learning model. Managed endpoints can use a system assigned managed identity to access Azure resources like storage containers that contain your scoring script.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Learn how to take the following actions:

> [!div class="checklist"]
> * Set the default values for the Azure CLI to use
> * Configure the variables to be used with your endpoint
> * Create a blob storage account and Blob container 
> * Create a managed endpoint
> * Give the system assigned managed identity permission to access storage
> * Create a deployment associated with managed endpoint
> * Deploy the model 

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* To use the CLI commands in this document from your **local environment**, install the [Azure CLI](/cli/azure/install-azure-cli)and [leverage `ml` extension](how-to-configure-cli.md). 

* To follow along with the sample, clone the samples repository

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```
* A basic understanding of what [system assigned managed identity accomplishes](how-to-create-attach-compute-studio.md#managed-identity). 

* A trained machine learning model ready for scoring and deployment.

## Set the defaults for Azure CLI

To ensure the Azure CLI knows what resources to use throughout this tutorial, set the default values for the Azure subscription ID, Azure Machine Learning workspace and resource group you want to use. Doing so allows you to not have to specify these resources every time you call an Azure CLI command. 

> [!IMPORTANT]
> Ensure your user account has "User Access Administrator" role assigned to resource group. 

```azurecli
az account set --subscription <subscription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```

## Define the configuration YAML file for your deployment

In order to deploy a managed endpoint, you first need to define the configuration for your endpoint in a YAML file.

The following code example creates a managed endpoint that,  
* Shows the YAML files from `endpoints/online/managed/managed-identities/` directory.
* Defines the name by which you want to refer to the endpoint, `my-sai-endpoint`
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`
* Specifies that the type of endpoint you want to create is an `online` endpoint. 
* Indicates that the endpoint has an associated deployment called `blue`
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/managed-identities/2-sai-deployment.yml":::


## Configure variables for your deployment

Configure the variable names for the workspace, workspace location and the endpoint you want to create. The following code exports these values as environment variables in your endpoint:

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

The following code exports those values as environment variables:

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="configure_storage_names" :::


After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system assigned managed identity that's generated upon endpoint creation.

## Create blob storage and container

For this example, you create a blob storage account and blob container. Then, upload the previously created text file to the blob container. 

First, create a storage account. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_account" :::

Next, create the blob container in storage account. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_container" :::

Then, upload your text file to the blob container. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="upload_file_to_storage" :::

## Create an endpoint

The following code creates a managed endpoint without specifying a deployment. Deployment creation is done later in the tutorial.

When you create a managed endpoint a system assigned managed identity is created for the endpoint by default.

>[!IMPORTANT]
> System assigned managed identities are immutable and can't be changed once created.

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="create_endpoint" :::

Check the status of the endpoint with the following. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="check_endpoint_Status" :::


## Give storage permission to system-assigned managed identity

You can allow the managed endpoint permission to access your storage via its system assigned managed identity. 

Retrieve the system- assigned managed identity was created for your endpoint. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="get_system_identity" :::

From here, you can give the system-assigned managed identity permission to access your storage.

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="give_permission_to_user_storage_account" :::

## Scoring script to access Azure resource

Refer to the following scoring script, to understand how to use system-assigned managed identity token to access Azure resources. In this scenario the Azure resource is the storage account created in previous sections. 

:::code language="python" source="~/azureml-examples-cli-preview/cli/endpoints/online/model-1/onlinescoring/score_managedidentity.py":::

## Create a deployment using your configuration

Create a deployment that's associated with the managed endpoint.

> NOTE It can take 8-10 minutes for deployment to complete. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="deploy" :::

> [!WARNING]
> The value of the `--name` argument may override the `name` key inside the YAML file. 

Check the status of the deployment. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deploy_Status" :::

Once this command completes, you will have registered the model, the environment, and the endpoint in your Azure Machine Learning workspace.

### Confirm your endpoint deployed successfully

Once your endpoint is deployed, confirm its operation. Details of inferencing vary from model to model. For this tutorial, the JSON query parameters look like: 

:::code language="json" source="~/azureml-examples-cli-preview/cli/endpoints/online/model-1/sample-request.json" :::

To call your endpoint, run: 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="test_endpoint" :::


> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system assigned managed identity token. 

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deployment_log" :::

## Delete the endpoint and storage account

> [!IMPORTANT]
> The resources you created can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles.

If you plan on continuing to use the Azure Machine Learning workspace, but want to delete the deployed endpoint and storage to reduce costs, use the following commands. When you delete the endpoint all the deployments associated with it are deleted as well. 

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_storage_account" :::


## Next steps

* For more information on using the CLI, see [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To refine JSON queries to only return specific data, see [Query Azure CLI command output](/cli/azure/query-azure-cli).