---
title: Access Azure resources from an online endpoint
titleSuffix: Azure Machine Learning
description: Securely access Azure resources for your machine learning model deployment from an online endpoint with a system-assigned or user-assigned managed identity.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: shohei1029
ms.author: shnagata
ms.reviewer: mopeakande
ms.date: 04/07/2022
ms.topic: how-to
ms.custom: devplatv2, cliv2, event-tier1-build-2022, ignite-2022
#Customer intent: As a data scientist, I want to securely access Azure resources for my machine learning model deployment with an online endpoint and managed identity.
---

# Access Azure resources from an online endpoint with a managed identity 

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Learn how to access Azure resources from your scoring script with an online endpoint and either a system-assigned managed identity or a user-assigned managed identity. 

Managed endpoints allow Azure Machine Learning to manage the burden of provisioning your compute resource and deploying your machine learning model. Typically your model needs to access Azure resources such as the Azure Container Registry or your blob storage for inferencing; with a managed identity you can access these resources without needing to manage credentials in your code. [Learn more about managed identities](../active-directory/managed-identities-azure-resources/overview.md).

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

* Install and configure the Azure ML Python SDK (v2). For more information, see [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install).

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
    
    ```python 
    pip install --pre azure-mgmt-storage
    pip install --pre azure-mgmt-authorization
    ```


Install them with the following code:

# [User-assigned (Python)](#tab/user-identity-python)

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Role creation permissions for your subscription or the Azure resources accessed by the User-assigned identity. 

* Install and configure the Azure ML Python SDK (v2). For more information, see [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install).

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
    
    ```python
    pip install --pre azure-mgmt-msi
    pip install --pre azure-mgmt-storage
    pip install --pre azure-mgmt-authorization
    ```
    
---

## Limitations

* The identity for an endpoint is immutable. During endpoint creation, you can associate it with a system-assigned identity (default) or a user-assigned identity. You can't change the identity after the endpoint has been created.

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

```python 
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

endpoint_name = "<ENDPOINT_NAME>"
```

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in the storage account and container creation code by the `StorageManagementClient` and `ContainerClient`. 

```python 
storage_account_name = "<STORAGE_ACCOUNT_NAME>"
storage_container_name = "<CONTAINER_TO_ACCESS>"
file_name = "<FILE_TO_ACCESS>"
``` 

After these variables are assigned, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the system-assigned managed identity that's generated upon endpoint creation.

Now, get a handle to the workspace and retrieve its location:

```python 
from azure.ai.ml import MLClient
from azure.identity import AzureCliCredential
from azure.ai.ml.entities import (
    ManagedOnlineDeployment,
    ManagedOnlineEndpoint,
    Model,
    CodeConfiguration,
    Environment,
)

credential = AzureCliCredential()
ml_client = MLClient(credential, subscription_id, resource_group, workspace_name)

workspace_location = ml_client.workspaces.get(workspace_name).location
``` 

We will use this value to create a storage account. 


# [User-assigned (Python)](#tab/user-identity-python)


Assign values for the workspace and deployment-related variables:

```python 
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"

endpoint_name = "<ENDPOINT_NAME>"
```

Next, specify what you want to name your blob storage account, blob container, and file. These variable names are defined here, and are referred to in the storage account and container creation code by the `StorageManagementClient` and `ContainerClient`. 

```python 
storage_account_name = "<STORAGE_ACCOUNT_NAME>"
storage_container_name = "<CONTAINER_TO_ACCESS>"
file_name = "<FILE_TO_ACCESS>"
``` 

After these variables are assigned, create a text file locally. When the endpoint is deployed, the scoring script will access this text file using the user-assigned managed identity that's generated upon endpoint creation.

Decide on the name of your user identity name:
```python 
uai_name = "<USER_ASSIGNED_IDENTITY_NAME>"
``` 

Now, get a handle to the workspace and retrieve its location:
```python 
from azure.ai.ml import MLClient
from azure.identity import AzureCliCredential
from azure.ai.ml.entities import (
    ManagedOnlineDeployment,
    ManagedOnlineEndpoint,
    Model,
    CodeConfiguration,
    Environment,
)

credential = AzureCliCredential()
ml_client = MLClient(credential, subscription_id, resource_group, workspace_name)

workspace_location = ml_client.workspaces.get(workspace_name).location
``` 

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

```python
from azure.mgmt.msi import ManagedServiceIdentityClient
from azure.mgmt.msi.models import Identity

credential = AzureCliCredential()
msi_client = ManagedServiceIdentityClient(
    subscription_id=subscription_id,
    credential=credential,
)
``` 

Then, create the identity:

```python
msi_client.user_assigned_identities.create_or_update(
    resource_group_name=resource_group,
    resource_name=uai_name,
    parameters=Identity(location=workspace_location),
)
``` 

Now, retrieve the identity object, which contains details we will use below: 

```python 
uai_identity = msi_client.user_assigned_identities.get(
    resource_group_name=resource_group,
    resource_name=uai_name,
)
uai_identity.as_dict()
``` 

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

```python 
from azure.mgmt.storage import StorageManagementClient
from azure.storage.blob import ContainerClient
from azure.mgmt.storage.models import Sku, StorageAccountCreateParameters, BlobContainer

credential = AzureCliCredential()
storage_client = StorageManagementClient(
    credential=credential, subscription_id=subscription_id
)
``` 

Then, create a storage account: 

```python 
storage_account_parameters = StorageAccountCreateParameters(
    sku=Sku(name="Standard_LRS"), kind="Storage", location=workspace_location
)

storage_account = storage_client.storage_accounts.begin_create(
    resource_group_name=resource_group,
    account_name=storage_account_name,
    parameters=storage_account_parameters,
).result()
``` 

Next, create the blob container in the storage account:

```python 
blob_container = storage_client.blob_containers.create(
    resource_group_name=resource_group,
    account_name=storage_account_name,
    container_name=storage_container_name,
    blob_container=BlobContainer(),
)
``` 

Retrieve the storage account key and create a handle to the container with `ContainerClient`: 

```python 
res = storage_client.storage_accounts.list_keys(
    resource_group_name=resource_group,
    account_name=storage_account_name,
)
key = res.keys[0].value

container_client = ContainerClient(
    account_url=storage_account.primary_endpoints.blob,
    container_name=storage_container_name,
    credential=key,
)
``` 

Then, upload a blob to the container with the `ContainerClient`:

```python 
file_path = "hello.txt"
with open(file_path, "rb") as f:
    container_client.upload_blob(name=file_name, data=f.read())
``` 

# [User-assigned (Python)](#tab/user-identity-python)

First, get a handle to the `StorageManagementclient`:

```python 
from azure.mgmt.storage import StorageManagementClient
from azure.storage.blob import ContainerClient
from azure.mgmt.storage.models import Sku, StorageAccountCreateParameters, BlobContainer

credential = AzureCliCredential()
storage_client = StorageManagementClient(
    credential=credential, subscription_id=subscription_id
)
``` 

Then, create a storage account: 

```python 
storage_account_parameters = StorageAccountCreateParameters(
    sku=Sku(name="Standard_LRS"), kind="Storage", location=workspace_location
)

storage_account = storage_client.storage_accounts.begin_create(
    resource_group_name=resource_group,
    account_name=storage_account_name,
    parameters=storage_account_parameters,
).result()
``` 

Next, create the blob container in the storage account:

```python 
blob_container = storage_client.blob_containers.create(
    resource_group_name=resource_group,
    account_name=storage_account_name,
    container_name=storage_container_name,
    blob_container=BlobContainer(),
)
``` 

Retrieve the storage account key and create a handle to the container with `ContainerClient`: 

```python 
res = storage_client.storage_accounts.list_keys(
    resource_group_name=resource_group,
    account_name=storage_account_name,
)
key = res.keys[0].value

container_client = ContainerClient(
    account_url=storage_account.primary_endpoints.blob,
    container_name=storage_container_name,
    credential=key,
)
``` 

Then, upload a blob to the container with the `ContainerClient`:

```python 
file_path = "hello.txt"
with open(file_path, "rb") as f:
    container_client.upload_blob(name=file_name, data=f.read())
``` 

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

```python
endpoint = ml_client.online_endpoints.begin_create_or_update(endpoint).result()
``` 

Check the status of the endpoint via the details of the deployed endpoint object with the following code:  

```python
endpoint = ml_client.online_endpoints.get(endpoint_name)
endpoint.identity.as_dict()
```

If you encounter any issues, see [Troubleshooting online endpoints deployment and scoring](how-to-troubleshoot-managed-online-endpoints.md).


# [User-assigned (Python)](#tab/user-identity-python)

The following Python endpoint object: 

* Assigns the name by which you want to refer to the endpoint to the variable `endpoint_name. 
* Specifies the type of authorization to use to access the endpoint `auth-mode="key"`.
* Defines its identity as a ManagedServiceIdentity and specifies the Managed Identity created above as user-assigned. 

Define and deploy the endpoint: 

```python
from azure.ai.ml._restclient.v2022_05_01.models import ManagedServiceIdentity

endpoint = ManagedOnlineEndpoint(
    name=endpoint_name,
    auth_mode="key",
    identity=ManagedServiceIdentity(
        type="user_assigned",
        user_assigned_identities=[{"resource_id": uai_identity.id}],
    ),
)

ml_client.online_endpoints.begin_create_or_update(endpoint).result()
``` 

Check the status of the endpoint via the details of the deployed endpoint object with the following code:  

```python
endpoint = ml_client.online_endpoints.get(endpoint_name)
endpoint.identity.as_dict()
```

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

```python 
from azure.mgmt.authorization import AuthorizationManagementClient
from azure.mgmt.authorization.v2018_01_01_preview.models import RoleDefinition
import uuid

role_definition_client = AuthorizationManagementClient(
    credential=credential,
    subscription_id=subscription_id,
    api_version="2018-01-01-preview",
)
```

Now, initialize one to make Role Assignments: 

```python 
from azure.mgmt.authorization.v2020_10_01_preview.models import (
    RoleAssignment,
    RoleAssignmentCreateParameters,
)

role_assignment_client = AuthorizationManagementClient(
    credential=credential,
    subscription_id=subscription_id,
    api_version="2020-10-01-preview",
)
```

Then, get the Principal ID of the System-assigned managed identity: 

```python
endpoint = ml_client.online_endpoints.get(endpoint_name)
system_principal_id = endpoint.identity.principal_id
```

Next, give assign the `Storage Blob Data Reader` role to the endpoint. The Role Definition is retrieved by name and passed along with the Principal ID of the endpoint. The role is applied at the scope of the storage account created above and allows the endpoint to read the file. 

```python 
role_name = "Storage Blob Data Reader"
scope = storage_account.id

role_defs = role_definition_client.role_definitions.list(scope=scope)
role_def = next((r for r in role_defs if r.role_name == role_name))

role_assignment_client.role_assignments.create(
    scope=scope,
    role_assignment_name=str(uuid.uuid4()),
    parameters=RoleAssignmentCreateParameters(
        role_definition_id=role_def.id, principal_id=system_principal_id
    ),
)
``` 


# [User-assigned (Python)](#tab/user-identity-python)

First, make an `AuthorizationManagementClient` to list Role Definitions: 

```python 
from azure.mgmt.authorization import AuthorizationManagementClient
from azure.mgmt.authorization.v2018_01_01_preview.models import RoleDefinition
import uuid

role_definition_client = AuthorizationManagementClient(
    credential=credential,
    subscription_id=subscription_id,
    api_version="2018-01-01-preview",
)
```

Now, initialize one to make Role Assignments: 

```python 
from azure.mgmt.authorization.v2020_10_01_preview.models import (
    RoleAssignment,
    RoleAssignmentCreateParameters,
)

role_assignment_client = AuthorizationManagementClient(
    credential=credential,
    subscription_id=subscription_id,
    api_version="2020-10-01-preview",
)
```

Then, get the Principal ID and Client ID of the User-assigned managed identity. To assign roles, we only need the Principal ID. However, we will use the Client ID to fill the `UAI_CLIENT_ID` placeholder environment variable before creating the deployment.

```python
uai_identity = msi_client.user_assigned_identities.get(
    resource_group_name=resource_group, resource_name=uai_name
)
uai_principal_id = uai_identity.principal_id
uai_client_id = uai_identity.client_id
```

Next, assign the `Storage Blob Data Reader` role to the endpoint. The Role Definition is retrieved by name and passed along with the Principal ID of the endpoint. The role is applied at the scope of the storage account created above to allow the endpoint to read the file. 

```python 
role_name = "Storage Blob Data Reader"
scope = storage_account.id

role_defs = role_definition_client.role_definitions.list(scope=scope)
role_def = next((r for r in role_defs if r.role_name == role_name))

role_assignment_client.role_assignments.create(
    scope=scope,
    role_assignment_name=str(uuid.uuid4()),
    parameters=RoleAssignmentCreateParameters(
        role_definition_id=role_def.id, principal_id=uai_principal_id
    ),
)
``` 
For the next two permissions, we'll need the workspace and container registry objects: 

```python 
workspace = ml_client.workspaces.get(workspace_name)
container_registry = workspace.container_registry
``` 

Next, assign the `AcrPull` role to the User-assigned identity. This role allows images to be pulled from an Azure Container Registry. The scope is applied at the level of the container registry associated with the workspace.

```python 
role_name = "AcrPull"
scope = container_registry

role_defs = role_definition_client.role_definitions.list(scope=scope)
role_def = next((r for r in role_defs if r.role_name == role_name))

role_assignment_client.role_assignments.create(
    scope=scope,
    role_assignment_name=str(uuid.uuid4()),
    parameters=RoleAssignmentCreateParameters(
        role_definition_id=role_def.id, principal_id=uai_principal_id
    ),
)
``` 

Finally, assign the `Storage Blob Data Reader` role to the endpoint at the workspace storage account scope. This role assignment will allow the endpoint to read blobs in the workspace storage account as well as the newly created storage account.

The role has the same name and capabilities as the first role assigned above, however it is applied at a different scope and has a different ID. 

```python 
role_name = "Storage Blob Data Reader"
scope = workspace.storage_account

role_defs = role_definition_client.role_definitions.list(scope=scope)
role_def = next((r for r in role_defs if r.role_name == role_name))

role_assignment_client.role_assignments.create(
    scope=scope,
    role_assignment_name=str(uuid.uuid4()),
    parameters=RoleAssignmentCreateParameters(
        role_definition_id=role_def.id, principal_id=uai_principal_id
    ),
)
``` 

---

## Scoring script to access Azure resource

Refer to the following script to understand how to use your identity token to access Azure resources, in this scenario, the storage account created in previous sections. 

:::code language="python" source="~/azureml-examples-main/cli/endpoints/online/model-1/onlinescoring/score_managedidentity.py":::

## Create a deployment with your configuration

Create a deployment that's associated with the online endpoint. [Learn more about deploying to online endpoints](how-to-deploy-managed-online-endpoints.md).

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

```python 
deployment = ml_client.online_deployments.begin_create_or_update(deployment).result()
```

Once deployment completes, check its status and confirm its identity details: 


```python 
deployment = ml_client.online_deployments.get(
    endpoint_name=endpoint_name, name=deployment.name
)
print(deployment)
``` 

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the system-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

```python 
ml_client.online_deployments.get_logs(deployment.name, deployment.endpoint_name, 1000)
``` 

Now that the deployment is confirmed, set the traffic to 100%: 

```python 
endpoint.traffic = {str(deployment.name): 100}
ml_client.begin_create_or_update(endpoint).result()
```

# [User-assigned (Python)](#tab/user-identity-python)

Before we deploy, update the `UAI_CLIENT_ID` environment variable placeholder. 

```python
deployment.environment_variables['UAI_CLIENT_ID'] = uai_client_id
```

Now, create the deployment: 

```python 
deployment = ml_client.online_deployments.begin_create_or_update(deployment).result()
```

Once deployment completes, check its status and confirm its identity details: 

```python 
deployment = ml_client.online_deployments.get(
    endpoint_name=endpoint_name, name=deployment.name
)
print(deployment)
``` 

> [!NOTE]
> The init method in the scoring script reads the file from your storage account using the user-assigned managed identity token.

To check the init method output, see the deployment log with the following code. 

```python 
ml_client.online_deployments.get_logs(deployment.name, deployment.endpoint_name, 1000)
``` 

Now that the deployment is confirmed, set the traffic to 100%: 

```python 
endpoint.traffic = {str(deployment.name): 100}
ml_client.begin_create_or_update(endpoint).result()
```

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

```python 
sample_data = "../../model-1/sample-request.json"
ml_client.online_endpoints.invoke(endpoint_name=endpoint_name, request_file=sample_data)
``` 

# [User-assigned (Python)](#tab/user-identity-python)


```python 
sample_data = "../../model-1/sample-request.json"
ml_client.online_endpoints.invoke(endpoint_name=endpoint_name, request_file=sample_data)
``` 

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

```python 
ml_client.online_endpoints.begin_delete(endpoint_name)
```

Delete the storage account: 

```python 
storage_client.storage_accounts.delete(
    resource_group_name=resource_group, account_name=storage_account_name
)
``` 

# [User-assigned (Python)](#tab/user-identity-python)

Delete the endpoint: 

```python 
ml_client.online_endpoints.begin_delete(endpoint_name)
```

Delete the storage account: 

```python 
storage_client.storage_accounts.delete(
    resource_group_name=resource_group, account_name=storage_account_name
)
```

Delete the User-assigned managed identity: 

```python
msi_client.user_assigned_identities.delete(
    resource_group_name=resource_group, resource_name=uai_name
)
```


---

## Next steps

* [Deploy and score a machine learning model by using a online endpoint](how-to-deploy-managed-online-endpoints.md).
* For more on deployment, see [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md).
* For more information on using the CLI, see [Use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To see which compute resources you can use, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* For more on costs, see [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md).
* For information on monitoring endpoints, see [Monitor managed online endpoints](how-to-monitor-online-endpoints.md).
* For limitations for managed endpoints, see [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).
