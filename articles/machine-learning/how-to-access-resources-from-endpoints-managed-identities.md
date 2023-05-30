---
title: Access Azure resources from an online endpoint
titleSuffix: Azure Machine Learning
description: Securely access Azure resources for your machine learning model deployment from an online endpoint with a system-assigned or user-assigned managed identity.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 04/07/2022
ms.topic: how-to
ms.custom: devplatv2, cliv2, event-tier1-build-2022, ignite-2022
#Customer intent: As a data scientist, I want to securely access Azure resources for my machine learning model deployment with an online endpoint and managed identity.
---

# Access Azure resources from an online endpoint with a managed identity 

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Learn how to access Azure resources from your scoring script with an online endpoint and either a system-assigned managed identity or a user-assigned managed identity. 

Both managed endpoints and Kubernetes endpoints allow Azure Machine Learning to manage the burden of provisioning your compute resource and deploying your machine learning model. Typically your model needs to access Azure resources such as the Azure Container Registry or your blob storage for inferencing; with a managed identity you can access these resources without needing to manage credentials in your code. [Learn more about managed identities](../active-directory/managed-identities-azure-resources/overview.md).

This guide assumes you don't have a managed identity, a storage account or an online endpoint. If you already have these components, skip to the [give access permission to the managed identity](#give-access-permission-to-the-managed-identity) section. 

## Prerequisites

# [System-assigned (CLI)](#tab/system-identity-cli)

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install and configure the Azure CLI and ML (v2) extension. For more information, see [Install, set up, and use the 2.0 CLI](how-to-configure-cli.md).

* An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` and  `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article.

* An Azure Machine Learning workspace. You'll have a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment. If you are following along with the sample, a model is provided.

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults gitworkspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

* To follow along with the sample, clone the samples repository

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```
    
# [User-assigned (CLI)](#tab/user-identity-cli)

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install and configure the Azure CLI and ML (v2) extension. For more information, see [Install, set up, and use the 2.0 CLI](how-to-configure-cli.md).

* An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` and  `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article.

* An Azure Machine Learning workspace. You'll have a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment. If you are following along with the sample, a model is provided.

* If you haven't already set the defaults for the Azure CLI, save your default settings. To avoid passing in the values for your subscription, workspace, and resource group multiple times, run this code:

   ```azurecli
   az account set --subscription <subscription ID>
   az configure --defaults gitworkspace=<Azure Machine Learning workspace name> group=<resource group>
   ```

* To follow along with the sample, clone the samples repository

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```

# [System-assigned (Python)](#tab/system-identity-python)

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install and configure the Azure Machine Learning Python SDK (v2). For more information, see [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install).

* An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` and  `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article.

* An Azure Machine Learning workspace. You'll have a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment. If you are following along with the sample, a model is provided.

* Clone the samples repository. 

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/sdk/endpoints/online/managed/managed-identities
    ```
* To follow along with this notebook, access the companion [example notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb) within in the  `sdk/endpoints/online/managed/managed-identities` directory. 

* Additional Python packages are required for this example: 

    * Microsoft Azure Storage Management Client 

    * Microsoft Azure Authorization Management Client

    Install them with the following code: 
    
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=install-packages)]

# [User-assigned (Python)](#tab/user-identity-python)

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Role creation permissions for your subscription or the Azure resources accessed by the User-assigned identity. 

* Install and configure the Azure Machine Learning Python SDK (v2). For more information, see [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install).

* An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` and  `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article.

* An Azure Machine Learning workspace. You'll have a workspace if you configured your ML extension per the above article.

* A trained machine learning model ready for scoring and deployment. If you are following along with the sample, a model is provided.

* Clone the samples repository. 

    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/sdk/endpoints/online/managed/managed-identities
    ```
* To follow along with this notebook, access the companion [example notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb) within in the  `sdk/endpoints/online/managed/managed-identities` directory. 

* Additional Python packages are required for this example: 

    * Microsoft Azure Msi Management Client 

    * Microsoft Azure Storage Client

    * Microsoft Azure Authorization Management Client

    Install them with the following code: 
    
   [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=install-packages)]
    
---

## Limitations

* The identity for an endpoint is immutable. During endpoint creation, you can associate it with a system-assigned identity (default) or a user-assigned identity. You can't change the identity after the endpoint has been created.
* If your ARC and blob storage are configured as private, i.e. behind a Vnet, then access from the Kubernetes endpoint should be over the private link regardless of whether your workspace is public or private. More details about private link setting, please refer to [How to secure workspace vnet](./how-to-secure-workspace-vnet.md#azure-container-registry).


## Configure variables for deployment

Configure the variable names for the workspace, workspace location, and the endpoint you want to create for use with your deployment.

# [System-assigned (CLI)](#tab/system-identity-cli)

The following code exports these values as environment variables in your endpoint:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

The following code exports those values as environment variables:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="configure_storage_names" :::

After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system-assigned managed identity that's generated upon endpoint creation.

# [User-assigned (CLI)](#tab/user-identity-cli)

Decide on the name of your endpoint, workspace, workspace location and export that value as an environment variable:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="set_variables" :::

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in `az storage account create` and `az storage container create` commands in the next section.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="configure_storage_names" :::

After these variables are exported, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the user-assigned managed identity used in the endpoint. 

Decide on the name of your user identity name, and export that value as an environment variable:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="set_user_identity_name" :::

# [System-assigned (Python)](#tab/system-identity-python)

Assign values for the workspace and deployment-related variables:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=1-assign-variables)]

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in the storage account and container creation code by the `StorageManagementClient` and `ContainerClient`. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=1-specify-storage-details)]

After these variables are assigned, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system-assigned managed identity that's generated upon endpoint creation.

Now, get a handle to the workspace and retrieve its location:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=1-retrieve-workspace-location)]

We will use this value to create a storage account. 


# [User-assigned (Python)](#tab/user-identity-python)


Assign values for the workspace and deployment-related variables:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=1-assign-variables)]

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in the storage account and container creation code by the `StorageManagementClient` and `ContainerClient`. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=1-specify-storage-details)]

After these variables are assigned, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the user-assigned managed identity that's generated upon endpoint creation.

Decide on the name of your user identity name:
[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=1-decide-name-user-identity)]

Now, get a handle to the workspace and retrieve its location:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=1-retrieve-workspace-location)]

We will use this value to create a storage account. 

---

## Define the deployment configuration


# [System-assigned (CLI)](#tab/system-identity-cli)

To deploy an online endpoint with the CLI, you need to define the configuration in a YAML file. For more information on the YAML schema, see [online endpoint YAML reference](reference-yaml-endpoint-online.md) document.

The YAML files in the following examples are used to create online endpoints. 

The following YAML example is located at `endpoints/online/managed/managed-identities/1-sai-create-endpoint`. The file, 

* Defines the name by which you want to refer to the endpoint, `my-sai-endpoint`.
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/1-sai-create-endpoint.yml":::

This YAML example, `2-sai-deployment.yml`,

* Specifies that the type of endpoint you want to create is an `online` endpoint.
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/2-sai-deployment.yml":::

# [User-assigned (CLI)](#tab/user-identity-cli)

To deploy an online endpoint with the CLI, you need to define the configuration in a YAML file. For more information on the YAML schema, see [online endpoint YAML reference](reference-yaml-endpoint-online.md) document.

The YAML files in the following examples are used to create online endpoints. 

The following YAML example is located at `endpoints/online/managed/managed-identities/1-uai-create-endpoint`. The file, 

* Defines the name by which you want to refer to the endpoint, `my-uai-endpoint`.
* Specifies the type of authorization to use to access the endpoint, `auth-mode: key`.
* Indicates the identity type to use, `type: user_assigned`

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/1-uai-create-endpoint.yml":::

This YAML example, `2-sai-deployment.yml`,

* Specifies that the type of endpoint you want to create is an `online` endpoint.
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as, which model to deploy and which environment and scoring script to use.

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/2-uai-deployment.yml":::

# [System-assigned (Python)](#tab/system-identity-python)

To deploy an online endpoint with the Python SDK (v2), objects may be used to define the configuration as below. Alternatively, YAML files may be loaded using the `.load` method. 

The following Python endpoint object: 

* Assigns the name by which you want to refer to the endpoint to the variable `endpoint_name. 
* Specifies the type of authorization to use to access the endpoint `auth-mode="key"`.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=2-define-endpoint-configuration)]

This deployment object: 

* Specifies that the type of deployment you want to create is a `ManagedOnlineDeployment` via the class. 
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as the `name` and `instance_count` 
* Defines additional objects inline and associates them with the deployment for `Model`,`CodeConfiguration`, and `Environment`. 
* Includes environment variables needed for the system-assigned managed identity to access storage.  


[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=2-define-deployment-configuration)]

# [User-assigned (Python)](#tab/user-identity-python)

To deploy an online endpoint with the Python SDK (v2), objects may be used to define the configuration as below. Alternatively, YAML files may be loaded using the `.load` method. 

For a user-assigned identity, we will define the endpoint configuration below once the User-Assigned Managed Identity has been created. 

This deployment object: 

* Specifies that the type of deployment you want to create is a `ManagedOnlineDeployment` via the class. 
* Indicates that the endpoint has an associated deployment called `blue`.
* Configures the details of the deployment such as the `name` and `instance_count` 
* Defines additional objects inline and associates them with the deployment for `Model`,`CodeConfiguration`, and `Environment`. 
* Includes environment variables needed for the user-assigned managed identity to access storage. 
* Adds a placeholder environment variable for `UAI_CLIENT_ID`, which will be added after creating one and before actually deploying this configuration. 


[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=2-define-deployment-configuration)]

---


## Create the managed identity 
To access Azure resources, create a system-assigned or user-assigned managed identity for your online endpoint. 

# [System-assigned (CLI)](#tab/system-identity-cli)

When you [create an online endpoint](#create-an-online-endpoint), a system-assigned managed identity is automatically generated for you, so no need to create a separate one. 

# [User-assigned (CLI)](#tab/user-identity-cli)

To create a user-assigned managed identity, use the following:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_user_identity" :::

# [System-assigned (Python)](#tab/system-identity-python)

When you [create an online endpoint](#create-an-online-endpoint), a system-assigned managed identity is automatically generated for you, so no need to create a separate one. 

# [User-assigned (Python)](#tab/user-identity-python)

To create a user-assigned managed identity, first get a handle to the `ManagedServiceIdentityClient`: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=3-get-handle)]

Then, create the identity:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=3-create-identity)]

Now, retrieve the identity object, which contains details we will use below: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=3-retrieve-identity-object)]

---

## Create storage account and container

For this example, create a blob storage account and blob container, and then upload the previously created text file to the blob container. 
This is the storage account and blob container that you'll give the online endpoint and managed identity access to. 

# [System-assigned (CLI)](#tab/system-identity-cli)

First, create a storage account.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_account" :::

Next, create the blob container in the storage account.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_storage_container" :::

Then, upload your text file to the blob container.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="upload_file_to_storage" :::

# [User-assigned (CLI)](#tab/user-identity-cli)

First, create a storage account.  

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_storage_account" :::

You can also retrieve an existing storage account ID with the following. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_storage_account_id" :::

Next, create the blob container in the storage account. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_storage_container" :::

Then, upload file in container. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="upload_file_to_storage" :::

# [System-assigned (Python)](#tab/system-identity-python)

First, get a handle to the `StorageManagementclient`:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=4-get-handle)]


Then, create a storage account: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=4-create-storage-account)]

Next, create the blob container in the storage account:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=4-create-blob-container)]

Retrieve the storage account key and create a handle to the container with `ContainerClient`: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=4-create-container-client)]

Then, upload a blob to the container with the `ContainerClient`:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=4-upload-blob)]

# [User-assigned (Python)](#tab/user-identity-python)

First, get a handle to the `StorageManagementclient`:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=4-get-handle)]

Then, create a storage account: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=4-create-storage-account)]

Next, create the blob container in the storage account:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=4-create-blob-container)]

Retrieve the storage account key and create a handle to the container with `ContainerClient`: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=4-create-container-client)]

Then, upload a blob to the container with the `ContainerClient`:

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=4-upload-blob)]

---

## Create an online endpoint

The following code creates an online endpoint without specifying a deployment. 

> [!WARNING]
> The identity for an endpoint is immutable. During endpoint creation, you can associate it with a system-assigned identity (default) or a user-assigned identity. You can't change the identity after the endpoint has been created.

# [System-assigned (CLI)](#tab/system-identity-cli)
When you create an online endpoint, a system-assigned managed identity is created for the endpoint by default.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="create_endpoint" :::

Check the status of the endpoint with the following.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_endpoint_Status" :::

If you encounter any issues, see [Troubleshooting online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md).

# [User-assigned (CLI)](#tab/user-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_endpoint" :::

Check the status of the endpoint with the following.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_endpoint_Status" :::

If you encounter any issues, see [Troubleshooting online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md).

# [System-assigned (Python)](#tab/system-identity-python)

When you create an online endpoint, a system-assigned managed identity is created for the endpoint by default.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=5-create-online-endpoint)]

Check the status of the endpoint via the details of the deployed endpoint object with the following code:  

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=5-get-details)]

If you encounter any issues, see [Troubleshooting online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md).


# [User-assigned (Python)](#tab/user-identity-python)

The following Python endpoint object: 

* Assigns the name by which you want to refer to the endpoint to the variable `endpoint_name. 
* Specifies the type of authorization to use to access the endpoint `auth-mode="key"`.
* Defines its identity as a ManagedServiceIdentity and specifies the Managed Identity created above as user-assigned. 

Define and deploy the endpoint: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=5-create-online-endpoint)]


Check the status of the endpoint via the details of the deployed endpoint object with the following code:  

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=5-get-details)]

If you encounter any issues, see [Troubleshooting online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md).

---

## Give access permission to the managed identity

>[!IMPORTANT] 
> Online endpoints require Azure Container Registry pull permission, AcrPull permission, to the container registry and Storage Blob Data Reader permission to the default datastore of the workspace.

You can allow the online endpoint permission to access your storage via its system-assigned managed identity or give permission to the user-assigned managed identity to access the storage account created in the previous section.

# [System-assigned (CLI)](#tab/system-identity-cli)

Retrieve the system-assigned managed identity that was created for your endpoint.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="get_system_identity" :::

From here, you can give the system-assigned managed identity permission to access your storage.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="give_permission_to_user_storage_account" :::

# [User-assigned (CLI)](#tab/user-identity-cli)

Retrieve user-assigned managed identity client ID.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_user_identity_client_id" :::

Retrieve the user-assigned managed identity ID.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_user_identity_id" :::

Get the container registry associated with workspace.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_container_registry_id" :::

Retrieve the default storage of the workspace.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="get_workspace_storage_id" :::

Give permission of storage account to the user-assigned managed identity.  

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_user_storage_account" :::

Give permission of container registry to user assigned managed identity.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_container_registry" :::

Give permission of default workspace storage to user-assigned managed identity.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="give_permission_to_workspace_storage_account" :::

# [System-assigned (Python)](#tab/system-identity-python)

First, make an `AuthorizationManagementClient` to list Role Definitions: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=6-get-role-definitions-client)]

Now, initialize one to make Role Assignments: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=6-get-role-assignments-client)]


Then, get the Principal ID of the System-assigned managed identity: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=6-get-sai-details)]

Next, assign the `Storage Blob Data Reader` role to the endpoint. The Role Definition is retrieved by name and passed along with the Principal ID of the endpoint. The role is applied at the scope of the storage account created above and allows the endpoint to read the file. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=6-give-permission-user-storage-account)]


# [User-assigned (Python)](#tab/user-identity-python)

First, make an `AuthorizationManagementClient` to list Role Definitions: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-get-role-definitions-client)]

Now, initialize one to make Role Assignments: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-get-role-assignments-client)]

Then, get the Principal ID and Client ID of the User-assigned managed identity. To assign roles, we only need the Principal ID. However, we will use the Client ID to fill the `UAI_CLIENT_ID` placeholder environment variable before creating the deployment.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-get-uai-details)]

Next, assign the `Storage Blob Data Reader` role to the endpoint. The Role Definition is retrieved by name and passed along with the Principal ID of the endpoint. The role is applied at the scope of the storage account created above to allow the endpoint to read the file. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-give-permission-user-storage-account)]

For the next two permissions, we'll need the workspace and container registry objects: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-retrieve-workspace-acr)]

Next, assign the `AcrPull` role to the User-assigned identity. This role allows images to be pulled from an Azure Container Registry. The scope is applied at the level of the container registry associated with the workspace.

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-give-permission-container-registry)]

Finally, assign the `Storage Blob Data Reader` role to the endpoint at the workspace storage account scope. This role assignment will allow the endpoint to read blobs in the workspace storage account as well as the newly created storage account.

The role has the same name and capabilities as the first role assigned above, however it is applied at a different scope and has a different ID. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=6-give-permission-workspace-storage)]

---

## Scoring script to access Azure resource

Refer to the following script to understand how to use your identity token to access Azure resources, in this scenario, the storage account created in previous sections. 

:::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score_managedidentity.py":::

## Create a deployment with your configuration

Create a deployment that's associated with the online endpoint. [Learn more about deploying to online endpoints](how-to-deploy-online-endpoints.md).

>[!WARNING]
> This deployment can take approximately 8-14 minutes depending on whether the underlying environment/image is being built for the first time. Subsequent deployments using the same environment will go quicker.

# [System-assigned (CLI)](#tab/system-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="deploy" :::

>[!NOTE]
> The value of the `--name` argument may override the `name` key inside the YAML file.

Check the status of the deployment.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deploy_Status" :::

To refine the above query to only return specific data, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="check_deployment_log" :::


# [User-assigned (CLI)](#tab/user-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="create_endpoint" :::

>[!Note]
> The value of the `--name` argument may override the `name` key inside the YAML file.

Once the command executes, you can check the status of the deployment.

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_endpoint_Status" :::

To refine the above query to only return specific data, see [Query Azure CLI command output](/cli/azure/query-azure-cli).

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_deployment_log" :::

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the user-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="check_deployment_log" :::

# [System-assigned (Python)](#tab/system-identity-python)

First, create the deployment:  

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=7-create-deployment)]

Once deployment completes, check its status and confirm its identity details: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=7-check-deployment-status)]

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=7-get-deployment-logs)]

Now that the deployment is confirmed, set the traffic to 100%: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=7-set-traffic)]

# [User-assigned (Python)](#tab/user-identity-python)

Before we deploy, update the `UAI_CLIENT_ID` environment variable placeholder. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=7-update-uai-client-id)]

Now, create the deployment: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=7-create-deployment)]

Once deployment completes, check its status and confirm its identity details: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=7-check-deployment-status)]

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the user-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=7-get-deployment-logs)]

Now that the deployment is confirmed, set the traffic to 100%: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=7-set-traffic)]

---

When your deployment completes,  the model, the environment, and the endpoint are registered to your Azure Machine Learning workspace.

## Test the endpoint

Once your online endpoint is deployed, test and confirm its operation with a request. Details of inferencing vary from model to model. For this guide, the JSON query parameters look like: 

:::code language="json" source="~/azureml-examples-main/cli/endpoints/online/model-1/sample-request.json" :::

To call your endpoint, run:

# [System-assigned (CLI)](#tab/system-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="test_endpoint" :::

# [User-assigned (CLI)](#tab/user-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="test_endpoint" :::

# [System-assigned (Python)](#tab/system-identity-python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=8-confirm-endpoint-deployed-successfully)]

# [User-assigned (Python)](#tab/user-identity-python)


[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=8-confirm-endpoint-deployed-successfully)]

---

## Delete the endpoint and storage account

If you don't plan to continue using the deployed online endpoint and storage, delete them to reduce costs. When you delete the endpoint, all of its associated deployments are deleted as well.

# [System-assigned (CLI)](#tab/system-identity-cli)
 
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-sai.sh" id="delete_storage_account" :::

# [User-assigned (CLI)](#tab/user-identity-cli)

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_endpoint" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_storage_account" :::
::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-access-resource-uai.sh" id="delete_user_identity" :::

# [System-assigned (Python)](#tab/system-identity-python)

Delete the endpoint: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=9-delete-endpoint)]

Delete the storage account: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-sai.ipynb?name=9-delete-storage-account)]

# [User-assigned (Python)](#tab/user-identity-python)

Delete the endpoint: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=9-delete-endpoint)]


Delete the storage account: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=9-delete-storage-account)]

Delete the User-assigned managed identity: 

[!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/managed/managed-identities/online-endpoints-managed-identity-uai.ipynb?name=9-delete-uai)]

---

## Next steps

* [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).
* For more on deployment, see [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md).
* For more information on using the CLI, see [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To see which compute resources you can use, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* For more on costs, see [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md).
* For information on monitoring endpoints, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).
* For limitations for managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning-managed online endpoint](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).
* For limitations for Kubernetes endpoints, see [Manage and increase quotas for resources with Azure Machine Learning-kubernetes online endpoint](how-to-manage-quotas.md#azure-machine-learning-kubernetes-online-endpoints).
