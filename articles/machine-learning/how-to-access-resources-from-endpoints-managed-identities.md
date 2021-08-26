---
title: Access Azure resources from managed endpoint
titleSuffix: Azure Machine Learning
description: Securely access Azure resources for your machine learning model deployment from a managed online endpoint with a system-assigned or user-assigned managed identity.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 09/10/2021
ms.topic: how-to
ms.custom: devplatv2

# Customer intent: As a data scientist, I want to securely access Azure resources for my machine learning model deployment with a managed online endpoint and managed identity. 
---

# Access Azure resources from a managed online endpoint (preview) with a managed identity 

Learn how to access Azure resources from your scoring script with a managed online endpoint and either a system-assigned managed identity or a user-assigned managed identity. 

Managed endpoints (preview) allow Azure Machine Learning to manage the burden of provisioning your compute resource and deploying your machine learning model. Typically your model needs to access Azure resources such as the Azure Container Registry or your blob storage for inferencing; with a managed identity you can access these resources without needing to manage credentials in your code. [Learn more about managed identities](../active-directory/managed-identities-azure-resources/overview.md).

In this example, walk through how to
 
* Define the configuration YAML
* Configure the variables for your deployment
* Create the managed identity to be used with your endpoint
* Create a storage and container that you want to access
* Create a managed online endpoint
* Give required permissions to the managed identity
* Review the Scoring script to access Azure resource
* Create a deployment using your configuration
* Confirm your endpoint deployed successfully
* Delete the endpoint and storage account

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article.

* Install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md).

* An Azure Machine Learning workspace. You'll have a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment.

## Set the defaults for Azure CLI

To ensure the correct resources are used throughout this guide, set the default values for the Azure subscription ID, Azure Machine Learning workspace, and resource group you want to use. Doing so allows you to avoid repeatedly passing in the values every time you call an Azure CLI command.

> [!IMPORTANT]
> Ensure your user account has "User Access Administrator" role assigned to the resource group. 

```azurecli
az account set --subscription <subscription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```

To follow along with the sample, clone the samples repository

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

## Define configuration YAML file for your deployment

To deploy a managed endpoint with the CLI, you need to define the configuration in a YAML file. For more information on the YAML schema, see [online endpoint YAML reference](reference-yaml-endpoint-managed-online.md) document.

# [System-assigned managed identity](#tab/system-identity)

The following code example creates a managed endpoint that,  
* Shows the YAML files from `endpoints/online/managed/managed-identities/` directory.
* Defines the name by which you want to refer to the endpoint, `my-sai-endpoint`.
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`.
* Specifies that the type of endpoint you want to create is an `online` endpoint.
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/2-sai-deployment.yml":::


# [User-assigned managed identity](#tab/user-identity)

The following file:

* Shows the YAML file `endpoints/online/managed/managed-identities/1-uai-create-endpoint-with-deployment.yml`.
* Defines the name by which you want to refer to the endpoint, `my-uai-endpoint`.
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`.
* Specifies that the type of endpoint you want to create is an `online` endpoint.
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/1-uai-create-endpoint-with-deployment.yml":::

---

## Configure variables for your deployment

Configure the variable names for the workspace, workspace location, and the endpoint you want to create and use.

# [System-assigned managed identity](#tab/system-identity)

The following code exports these values as environment variables in your endpoint:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

The following code exports those values as environment variables:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="configure_storage_names" :::

After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system assigned managed identity that's generated upon endpoint creation.

# [User-assigned managed identity](#tab/user-identity)

Decide on the name of your endpoint, workspace, workspace location and export that value as an environment variable:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="configure_storage_names" :::

After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the user-assigned identity used in the endpoint. 

Decide on the name of your user identity name, and export that value as an environment variable:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="set_user_identity_name" :::

---

## Create the identity to be used with your endpoint

# [System-assigned managed identity](#tab/system-identity)

You don't need to create a separate system-assigned managed identity. One is automatically generated for you upon endpoint creation.

# [User-assigned managed identity](#tab/user-identity)

To create an user-assigned identity, use the Azure CLI to run:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_user_identity" :::

---

## Create a storage and container

For this example, you create a blob storage account and blob container, and then upload the previously created text file to the blob container.

# [System-assigned managed identity](#tab/system-identity)

First, create a storage account.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_account" :::

Next, create the blob container in the storage account.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_container" :::

Then, upload your text file to the blob container.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="upload_file_to_storage" :::

# [User-assigned managed identity](#tab/user-identity)

First, create a storage account.  

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_storage_account" :::

You can also retrieve an existing storage account ID with the following. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_storage_account_id" :::

Next, create the blob container in the storage account. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_storage_container" :::

Then, upload file in container. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="upload_file_to_storage" :::

---

## Create a managed online endpoint

The following code creates a managed online endpoint without specifying a deployment. 

When you create a managed endpoint, a system-assigned managed identity is created for the endpoint by default.

>[!IMPORTANT]
> System assigned managed identities are immutable and can't be changed once created.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_endpoint" :::

Check the status of the endpoint with the following.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_endpoint_Status" :::

If you encounter any issues, see [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md).

## Give required permissions to the identity

>[!IMPORTANT] 
> Online endpoints require AcrPull permission to container registry and Storage Blob Data Reader permission to the default datastore of the workspace.

You can allow the managed endpoint permission to access your storage via its system assigned managed identity or give permission to the user-assigned identity to access the storage account created in the previous section.

# [System-assigned managed identity](#tab/system-identity)

Retrieve the system-assigned managed identity that was created for your endpoint.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="get_system_identity" :::

From here, you can give the system-assigned managed identity permission to access your storage.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="give_permission_to_user_storage_account" :::

# [User-assigned managed identity](#tab/user-identity)

Retrieve user-assigned identity client ID.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_user_identity_client_id" :::

Or, retrieve the user-assigned identity ID.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_user_identity_id" :::

Get the container registry associated with workspace.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_container_registry_id" :::

Retrieve the default storage of the workspace.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_workspace_storage_id" :::

Give permission of storage account to the user-assigned identity.  

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_user_storage_account" :::

Give permission of container registry to user assigned identity.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_container_registry" :::

Give permission of default workspace storage to user-assigned identity.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_workspace_storage_account" :::

---

## Scoring script to access Azure resource

Refer to the following script to understand how to use your identity tokens to access Azure resources. The Azure resource is the storage account created in previous sections. 

:::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score_managedidentity.py":::

## Create a deployment using your configuration

Create a deployment that's associated with the managed endpoint.

>[!WARNING]
> This deployment can take approximately 8-14 minutes depending on whether the underlying environment/image is being built for the first time. Subsequent deployments using the same environment will go quicker.

# [System-assigned managed identity](#tab/system-identity)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="deploy" :::

>[!NOTE]
> The value of the `--name` argument may override the `name` key inside the YAML file.

Check the status of the deployment.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deploy_Status" :::

To refine the above query to only return specific data, see [Query Azure CLI command output](https://docs.microsoft.com/cli/azure/query-azure-cli).

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deployment_log" :::


# [User-assigned managed identity](#tab/user-identity)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_endpoint" :::

>[!Note]
> The value of the `--name` argument may override the `name` key inside the YAML file.

Once the command executes, you can check the status of the deployment.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_endpoint_Status" :::

To refine the above query to only return specific data, see (Query Azure CLI command output)[https://docs.microsoft.com/cli/azure/query-azure-cli].

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_deployment_log" :::

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_deployment_log" :::

---

Once this command completes, you will have registered the model, the environment, and the endpoint in your Azure Machine Learning workspace.

## Confirm your endpoint deployed successfully

Once your endpoint is deployed, confirm its operation. Details of inferencing vary from model to model. For this tutorial, the JSON query parameters look like: 

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/model-1/sample-request.json" :::

To call your endpoint, run:

# [System-assigned managed identity](#tab/system-identity)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="test_endpoint" :::

# [User-assigned managed identity](#tab/user-identity)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="test_endpoint" :::

---

## Delete the endpoint and storage account

If you don't plan to continue using the deployed endpoint and storage, delete them to reduce costs. When you delete the endpoint, all of its associated deployments are deleted as well.

# [System-assigned managed identity](#tab/system-identity)
 
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_storage_account" :::

# [User-assigned managed identity](#tab/user-identity)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_storage_account" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_user_identity" :::

---

## Next steps

* For more information on using the CLI, see [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To see which compute resources you can use, see [Managed online endpoints SKU list (preview)](reference-managed-online-endpoints-vm-sku-list.md).
* For more on costs, see [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md).
* For more on deployment, see [Safe rollout for online endpoints (preview)](how-to-safely-rollout-managed-endpoints.md).
* For information on monitoring endpoints, see [Monitor managed online endpoints (preview)](how-to-monitor-online-endpoints.md).
* For information on limitations for managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview).