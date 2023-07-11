---
title: Set up service authentication
titleSuffix: Azure Machine Learning
description: Learn how to set up and configure authentication between Azure Machine Learning and other Azure services.
services: machine-learning
author: meyetman
ms.author: meyetman 
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.date: 09/23/2022
ms.topic: how-to
ms.custom: has-adal-ref, contperf-fy21q2, subject-rbac-steps, cliv2, sdkv2, event-tier1-build-2022, devx-track-azurecli
---

# Set up authentication between Azure Machine Learning and other services

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


Azure Machine Learning is composed of multiple Azure services. There are multiple ways that authentication can happen between Azure Machine Learning and the services it relies on.


* The Azure Machine Learning workspace uses a __managed identity__ to communicate with other services. By default, this is a system-assigned managed identity. You can also use a user-assigned managed identity instead.
* Azure Machine Learning uses Azure Container Registry (ACR) to store Docker images used to train and deploy models. If you allow Azure Machine Learning to automatically create ACR, it will enable the __admin account__.
* The Azure Machine Learning compute cluster uses a __managed identity__ to retrieve connection information for datastores from Azure Key Vault and to pull Docker images from ACR. You can also configure identity-based access to datastores, which will instead use the managed identity of the compute cluster.
* Data access can happen along multiple paths depending on the data storage service and your configuration. For example, authentication to the datastore may use an account key, token, security principal, managed identity, or user identity.
* Managed online endpoints can use a managed identity to access Azure resources when performing inference. For more information, see [Access Azure resources from an online endpoint](how-to-access-resources-from-endpoints-managed-identities.md).

## Prerequisites

[!INCLUDE [cli & sdk v2](includes/machine-learning-cli-sdk-v2-prereqs.md)]

* To assign roles, the login for your Azure subscription must have the [Managed Identity Operator](../role-based-access-control/built-in-roles.md#managed-identity-operator) role, or other role that grants the required actions (such as __Owner__).

* You must be familiar with creating and working with [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

## User-assigned managed identity

### Workspace

You can add a user-assigned managed identity when creating an Azure Machine Learning workspace from the [Azure portal](https://portal.azure.com). Use the following steps while creating the workspace:

1. From the __Basics__ page, select the Azure Storage Account, Azure Container Registry, and Azure Key Vault you want to use with the workspace.
1. From the __Advanced__ page, select __User-assigned identity__ and then select the managed identity to use.

The following [Azure RBAC role assignments](../role-based-access-control/role-assignments.md) are required on your user-assigned managed identity for your Azure Machine Learning workspace to access data on the workspace-associated resources.

|Resource|Permission|
|---|---|
|Azure Storage|Contributor (control plane) + Storage Blob Data Contributor (data plane, optional, to enable data preview in the Azure Machine Learning studio)|
|Azure Key Vault (when using [RBAC permission model](../key-vault/general/rbac-guide.md))|Contributor (control plane) + Key Vault Administrator (data plane)|
|Azure Key Vault (when using [access policies permission model](../key-vault/general/assign-access-policy.md))|Contributor + any access policy permissions besides **purge** operations|
|Azure Container Registry|Contributor|
|Azure Application Insights|Contributor|

For automated creation of role assignments on your user-assigned managed identity, you may use [this ARM template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-dependencies-role-assignment).

> [!TIP]
> For a workspace with [customer-managed keys for encryption](concept-data-encryption.md), you can pass in a user-assigned managed identity to authenticate from storage to Key Vault. Use the `user-assigned-identity-for-cmk-encryption` (CLI) or `user_assigned_identity_for_cmk_encryption` (SDK) parameters to pass in the managed identity. This managed identity can be the same or different as the workspace primary user assigned managed identity.

#### To create a workspace with multiple user assigned identities, use one of the following methods:

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml workspace create -f workspace_creation_with_multiple_UAIs.yml --subscription <subscription ID> --resource-group <resource group name> --name <workspace name>
```

Where the contents of *workspace_creation_with_multiple_UAIs.yml* are as follows:

```yaml
location: <region name>
identity:
   type: user_assigned
   user_assigned_identities:
    '<UAI resource ID 1>': {}
    '<UAI resource ID 2>': {}
storage_account: <storage acccount resource ID>
key_vault: <key vault resource ID>
image_build_compute: <compute(virtual machine) resource ID>
primary_user_assigned_identity: <one of the UAI resource IDs in the above list>
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml import MLClient, load_workspace
from azure.identity import DefaultAzureCredential

sub_id="<subscription ID>"
rg_name="<resource group name>"
ws_name="<workspace name>"

client = MLClient(DefaultAzureCredential(), sub_id, rg_name)
wps = load_workspace("workspace_creation_with_multiple_UAIs.yml")

workspace = client.workspaces.begin_create(workspace=wps).result()
```

# [Studio](#tab/azure-studio)

Not supported currently.

---

#### To update user assigned identities for a workspace, includes adding a new one or deleting the existing ones, use one of the following methods:

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml workspace update -f workspace_update_with_multiple_UAIs.yml --subscription <subscription ID> --resource-group <resource group name> --name <workspace name>
```

Where the contents of *workspace_update_with_multiple_UAIs.yml* are as follows:

```yaml
identity:
   type: user_assigned
   user_assigned_identities:
    '<UAI resource ID 1>': {}
    '<UAI resource ID 2>': {}
primary_user_assigned_identity: <one of the UAI resource IDs in the above list>
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml import MLClient, load_workspace
from azure.identity import DefaultAzureCredential

sub_id="<subscription ID>"
rg_name="<resource group name>"
ws_name="<workspace name>"

client = MLClient(DefaultAzureCredential(), sub_id, rg_name)
wps = load_workspace("workspace_update_with_multiple_UAIs.yml")

workspace = client.workspaces.begin_update(workspace=wps).result()
```

# [Studio](#tab/azure-studio)

Not supported currently.

---

> [!TIP]
> To add a new UAI, you can specify the new UAI ID under the section user_assigned_identities in addition to the existing UAIs, it's required to pass all the existing UAI IDs.<br>
To delete one or more existing UAIs, you can put the UAI IDs which needs to be preserved under the section user_assigned_identities, the rest UAI IDs would be deleted.<br>
To update identity type from SAI to UAI|SAI, you can change type from "user_assigned" to "system_assigned, user_assigned".

### Compute cluster

> [!NOTE]
> Azure Machine Learning compute clusters support only **one system-assigned identity** or **multiple user-assigned identities**, not both concurrently.

The **default managed identity** is the system-assigned managed identity or the first user-assigned managed identity.

During a run there are two applications of an identity:

1. The system uses an identity to set up the user's storage mounts, container registry, and datastores.

    * In this case, the system will use the default-managed identity.

1. You apply an identity to access resources from within the code for a submitted job:

    * In this case, provide the *client_id* corresponding to the managed identity you want to use to retrieve a credential.
    * Alternatively, get the user-assigned identity's client ID through the *DEFAULT_IDENTITY_CLIENT_ID* environment variable.

    For example, to retrieve a token for a datastore with the default-managed identity:

    ```python
    client_id = os.environ.get('DEFAULT_IDENTITY_CLIENT_ID')
    credential = ManagedIdentityCredential(client_id=client_id)
    token = credential.get_token('https://storage.azure.com/')
    ```

To configure a compute cluster with managed identity, use one of the following methods:

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml compute create -f create-cluster.yml
```

Where the contents of *create-cluster.yml* are as follows: 

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-user-identity.yml":::

For comparison, the following example is from a YAML file that creates a cluster that uses a system-assigned managed identity:

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-system-identity.yml":::

If you have an existing compute cluster, you can change between user-managed and system-managed identity. The following examples demonstrate how to change the configuration:

__User-assigned managed identity__

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-mlcompute-update-to-user-identity.sh":::

__System-assigned managed identity__

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-mlcompute-update-to-system-identity.sh":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml.entities import ManagedIdentityConfiguration, IdentityConfiguration, AmlCompute
from azure.ai.ml.constants import ManagedServiceIdentityType

# Create an identity configuration from the user-assigned managed identity
managed_identity = ManagedIdentityConfiguration(resource_id="/subscriptions/<subscription_id>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity>")
identity_config = IdentityConfiguration(type = ManagedServiceIdentityType.USER_ASSIGNED, user_assigned_identities=[managed_identity])

# specify aml compute name.
cpu_compute_target = "cpu-cluster"

try:
    ml_client.compute.get(cpu_compute_target)
except Exception:
    print("Creating a new cpu compute target...")
    # Pass the identity configuration
    compute = AmlCompute(
        name=cpu_compute_target, size="STANDARD_D2_V2", min_instances=0, max_instances=4, identity=identity_config
    )
    ml_client.compute.begin_create_or_update(compute)
```

# [Studio](#tab/azure-studio)

During cluster creation or when editing compute cluster details, in the **Advanced settings**, toggle **Assign a managed identity** and specify a system-assigned identity or user-assigned identity.

---

### Data storage

When you create a datastore that uses **identity-based data access**, your Azure account ([Azure Active Directory token](../active-directory/fundamentals/active-directory-whatis.md)) is used to confirm you have permission to access the storage service. In the **identity-based data access** scenario, no authentication credentials are saved. Only the storage account information is stored in the datastore.

In contrast, datastores that use **credential-based authentication** cache connection information, like your storage account key or SAS token, in the [key vault](https://azure.microsoft.com/services/key-vault/) that's associated with the workspace. This approach has the limitation that other workspace users with sufficient permissions can retrieve those credentials, which may be a security concern for some organization.

For more information on how data access is authenticated, see the [Data administration](how-to-administrate-data-authentication.md) article. For information on configuring identity based access to data, see [Create datastores](how-to-datastore.md).

There are two scenarios in which you can apply identity-based data access in Azure Machine Learning. These scenarios are a good fit for identity-based access when you're working with confidential data and need more granular data access management:

- Accessing storage services
- Training machine learning models

The identity-based access allows you to use [role-based access controls (RBAC)](../storage/blobs/assign-azure-role-data-access.md) to restrict which identities, such as users or compute resources, have access to the data. 

### Accessing storage services

You can connect to storage services via identity-based data access with[Azure Machine Learning datastores](how-to-datastore.md). 

When you use identity-based data access, Azure Machine Learning prompts you for your Azure Active Directory token for data access authentication instead of keeping your credentials in the datastore. That approach allows for data access management at the storage level and keeps credentials confidential. 

The same behavior applies when you work with data interactively via a Jupyter Notebook on your local computer or [compute instance](concept-compute-instance.md).

> [!NOTE]
> Credentials stored via credential-based authentication include subscription IDs, shared access signature (SAS) tokens, and storage access key and service principal information, like client IDs and tenant IDs.

To help ensure that you securely connect to your storage service on Azure, Azure Machine Learning requires that you have permission to access the corresponding data storage.
 
> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If cross tenant access is needed for your scenario, please reach out to the Azure Machine Learning Data Support team alias at  amldatasupport@microsoft.com for assistance with a custom code solution.

Identity-based data access supports connections to **only** the following storage services.

* Azure Blob Storage
* Azure Data Lake Storage Gen1
* Azure Data Lake Storage Gen2

To access these storage services, you must have at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../storage/blobs/assign-azure-role-data-access.md). 

### Access data for training jobs on compute using managed identity

Certain machine learning scenarios involve working with private data. In such cases, data scientists may not have direct access to data as Azure AD users. In this scenario, the managed identity of a compute can be used for data access authentication. In this scenario, the data can only be accessed from a compute instance or a machine learning compute cluster executing a training job. With this approach, the admin grants the compute instance or compute cluster managed identity Storage Blob Data Reader permissions on the storage. The individual data scientists don't need to be granted access.

To enable authentication with compute managed identity:

 * Create compute with managed identity enabled. See the [compute cluster](#compute-cluster) section, or for compute instance, the [Assign managed identity](how-to-create-compute-instance.md#assign-managed-identity) section.
 * Grant compute managed identity at least Storage Blob Data Reader role on the storage account.
 * Create any datastores with identity-based authentication enabled. See [Create datastores](how-to-datastore.md).

> [!NOTE]
> The name of the created system managed identity for compute instance or cluster will be in the format /workspace-name/computes/compute-name in your Azure Active Directory.

Once the identity-based authentication is enabled, the compute managed identity is used by default when accessing data within your training jobs. Optionally, you can authenticate with user identity using the steps described in next section.

For information on using configuring Azure RBAC for the storage, see [role-based access controls](../storage/blobs/assign-azure-role-data-access.md).

### Access data for training jobs on compute clusters using user identity

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

When training on [Azure Machine Learning compute clusters](how-to-create-attach-compute-cluster.md#what-is-a-compute-cluster), you can authenticate to storage with your user Azure Active Directory token. 

This authentication mode allows you to: 
* Set up fine-grained permissions, where different workspace users can have access to different storage accounts or folders within storage accounts.
* Let data scientists re-use existing permissions on storage systems.
* Audit storage access because the storage logs show which identities were used to access data.

> [!IMPORTANT] 
> This functionality has the following limitations
> * Feature is supported for experiments submitted via the [Azure Machine Learning CLI and Python SDK V2](concept-v2.md), but not via ML Studio.
> * User identity and compute managed identity cannot be used for authentication within same job.
> * For pipeline jobs, the user identity must be configured at job top level, not for individual pipeline steps.   

The following steps outline how to set up data access with user identity for training jobs on compute clusters from CLI. 

1. Grant the user identity access to storage resources. For example, grant StorageBlobReader access to the specific storage account you want to use or grant ACL-based permission to specific folders or files in Azure Data Lake Gen 2 storage.

1. Create an Azure Machine Learning datastore without cached credentials for the storage account. If a datastore has cached credentials, such as storage account key, those credentials are used instead of user identity.

1. Submit a training job with property **identity** set to **type: user_identity**, as shown in following job specification. During the training job, the authentication to storage happens via  the identity of the user that submits the job.

    > [!NOTE] 
    > If the **identity** property is left unspecified and datastore does not have cached credentials, then compute managed identity becomes the fallback option. 

    ```yaml
    command: |
    echo "--census-csv: ${{inputs.census_csv}}"
    python hello-census.py --census-csv ${{inputs.census_csv}}
    code: src
    inputs:
    census_csv:
        type: uri_file 
        path: azureml://datastores/mydata/paths/census.csv
    environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
    compute: azureml:cpu-cluster
    identity:
    type: user_identity
    ```

The following steps outline how to set up data access with user identity for training jobs on compute clusters from Python SDK.

1. Grant data access and create data store as described above for CLI.

1. Submit a training job with identity parameter set to [azure.ai.ml.UserIdentityConfiguration](/python/api/azure-ai-ml/azure.ai.ml.useridentityconfiguration). This parameter setting enables the job to access data on behalf of user submitting the job.

    ```python
    from azure.ai.ml import command
    from azure.ai.ml.entities import Data, UriReference
    from azure.ai.ml import Input
    from azure.ai.ml.constants import AssetTypes
    from azure.ai.ml import UserIdentityConfiguration
    
    # Specify the data location
    my_job_inputs = {
        "input_data": Input(type=AssetTypes.URI_FILE, path="<path-to-my-data>")
    }

    # Define the job
    job = command(
        code="<my-local-code-location>", 
        command="python <my-script>.py --input_data ${{inputs.input_data}}",
        inputs=my_job_inputs,
        environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
        compute="<my-compute-cluster-name>",
        identity= UserIdentityConfiguration() 
    )
    # submit the command
    returned_job = ml_client.jobs.create_or_update(job)
    ```

> [!IMPORTANT] 
> During job submission with authentication with user identity enabled, the code snapshots are protected against tampering by checksum validation. If you have existing pipeline components and intend to use them with authentication with user identity enabled, you may need to re-upload them. Otherwise the job may fail during checksum validation. 

### Work with virtual networks

By default, Azure Machine Learning can't communicate with a storage account that's behind a firewall or in a virtual network.

You can configure storage accounts to allow access only from within specific virtual networks. This configuration requires extra steps to ensure data isn't leaked outside of the network. This behavior is the same for credential-based data access. For more information, see [How to prevent data exfiltration](how-to-prevent-data-loss-exfiltration.md). 

If your storage account has virtual network settings, that dictates what identity type and permissions access is needed. For example for data preview and data profile, the virtual network settings determine what type of identity is used to authenticate data access. 
 
* In scenarios where only certain IPs and subnets are allowed to access the storage, then Azure Machine Learning uses the workspace MSI to accomplish data previews and profiles.

* If your storage is ADLS Gen 2 or Blob and has virtual network settings, customers can use either user identity or workspace MSI depending on the datastore settings defined during creation. 

* If the virtual network setting is "Allow Azure services on the trusted services list to access this storage account", then Workspace MSI is used. 

## Scenario: Azure Container Registry without admin user

When you disable the admin user for ACR, Azure Machine Learning uses a managed identity to build and pull Docker images. There are two workflows when configuring Azure Machine Learning to use an ACR with the admin user disabled:

* Allow Azure Machine Learning to create the ACR instance and then disable the admin user afterwards.
* Bring an existing ACR with the admin user already disabled.

### Azure Machine Learning with auto-created ACR instance

1. Create a new Azure Machine Learning workspace.
1. Perform an action that requires Azure Container Registry. For example, the [Tutorial: Train your first model](tutorial-1st-experiment-sdk-train.md).
1. Get the name of the ACR created by the cluster.

    [!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

    ```azurecli-interactive
    az ml workspace show -w <my workspace> \
    -g <my resource group>
    --query containerRegistry
    ```

    This command returns a value similar to the following text. You only want the last portion of the text, which is the ACR instance name:

    ```output
    /subscriptions/<subscription id>/resourceGroups/<my resource group>/providers/MicrosoftContainerReggistry/registries/<ACR instance name>
    ```

1. Update the ACR to disable the admin user:

    ```azurecli-interactive
    az acr update --name <ACR instance name> --admin-enabled false
    ```

### Bring your own ACR

If ACR admin user is disallowed by subscription policy, you should first create ACR without admin user, and then associate it with the workspace. Also, if you have existing ACR with admin user disabled, you can attach it to the workspace.

[Create ACR from Azure CLI](../container-registry/container-registry-get-started-azure-cli.md) without setting ```--admin-enabled``` argument, or from Azure portal without enabling admin user. Then, when creating Azure Machine Learning workspace, specify the Azure resource ID of the ACR. The following example demonstrates creating a new Azure Machine Learning workspace that uses an existing ACR:

> [!TIP]
> To get the value for the `--container-registry` parameter, use the [az acr show](/cli/azure/acr#az-acr-show) command to show information for your ACR. The `id` field contains the resource ID for your ACR.

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli-interactive
az ml workspace create -w <workspace name> \
-g <workspace resource group> \
-l <region> \
--container-registry /subscriptions/<subscription id>/resourceGroups/<acr resource group>/providers/Microsoft.ContainerRegistry/registries/<acr name>
```

### Create compute with managed identity to access Docker images for training

To access the workspace ACR, create machine learning compute cluster with system-assigned managed identity enabled. You can enable the identity from Azure portal or Studio when creating compute, or from Azure CLI using the below. For more information, see [using managed identity with compute clusters](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli-interaction
az ml compute create --name cpu-cluster --type <cluster name>  --identity-type systemassigned
```

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml.entities import IdentityConfiguration, AmlCompute
from azure.ai.ml.constants import ManagedServiceIdentityType

# Create an identity configuration for a system-assigned managed identity
identity_config = IdentityConfiguration(type = ManagedServiceIdentityType.SYSTEM_ASSIGNED)

# specify aml compute name.
cpu_compute_target = "cpu-cluster"

try:
    ml_client.compute.get(cpu_compute_target)
except Exception:
    print("Creating a new cpu compute target...")
    # Pass the identity configuration
    compute = AmlCompute(
        name=cpu_compute_target, size="STANDARD_D2_V2", min_instances=0, max_instances=4, identity=identity_config
    )
    ml_client.compute.begin_create_or_update(compute)
```


# [Studio](#tab/azure-studio)

For information on configuring managed identity when creating a compute cluster in studio, see [Set up managed identity](how-to-create-attach-compute-cluster.md#set-up-managed-identity).

---

A managed identity is automatically granted ACRPull role on workspace ACR to enable pulling Docker images for training.

> [!NOTE]
> If you create compute first, before workspace ACR has been created, you have to assign the ACRPull role manually.

### Use Docker images for inference

Once you've configured ACR without admin user as described earlier, you can access Docker images for inference without admin keys from your Azure Kubernetes service (AKS). When you create or attach AKS to workspace, the cluster's service principal is automatically assigned ACRPull access to workspace ACR.

> [!NOTE]
> If you bring your own AKS cluster, the cluster must have service principal enabled instead of managed identity.

## Scenario: Use a private Azure Container Registry

By default, Azure Machine Learning uses Docker base images that come from a public repository managed by Microsoft. It then builds your training or inference environment on those images. For more information, see [What are ML environments?](concept-environments.md).

To use a custom base image internal to your enterprise, you can use managed identities to access your private ACR. There are two use cases:

 * Use base image for training as is.
 * Build Azure Machine Learning managed image with custom image as a base.

### Pull Docker base image to machine learning compute cluster for training as is

Create machine learning compute cluster with system-assigned managed identity enabled as described earlier. Then, determine the principal ID of the managed identity.

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli-interactive
az ml compute show --name <cluster name> -w <workspace> -g <resource group>
```

Optionally, you can update the compute cluster to assign a user-assigned managed identity:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli-interactive
az ml compute update --name <cluster name> --user-assigned-identities <my-identity-id>
```

To allow the compute cluster to pull the base images, grant the managed service identity ACRPull role on the private ACR

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli-interactive
az role assignment create --assignee <principal ID> \
--role acrpull \
--scope "/subscriptions/<subscription ID>/resourceGroups/<private ACR resource group>/providers/Microsoft.ContainerRegistry/registries/<private ACR name>"
```

Finally, create an environment and specify the base image location in the [environment YAML file](reference-yaml-environment.md).

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image.yml":::

```azurecli
az ml environment create --file <yaml file>
```

You can now use the environment in a [training job](how-to-train-cli.md).

### Build Azure Machine Learning managed environment into base image from private ACR for training or inference

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

In this scenario, Azure Machine Learning service builds the training or inference environment on top of a base image you supply from a private ACR. Because the image build task happens on the workspace ACR using ACR Tasks, you must perform more steps to allow access.

1. Create __user-assigned managed identity__ and grant the identity ACRPull access to the __private ACR__.  
1. Grant the workspace __managed identity__ a __Managed Identity Operator__ role on the __user-assigned managed identity__ from the previous step. This role allows the workspace to assign the user-assigned managed identity to ACR Task for building the managed environment. 

    1. Obtain the principal ID of workspace system-assigned managed identity:

        [!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

        ```azurecli-interactive
        az ml workspace show -w <workspace name> -g <resource group> --query identityPrincipalId
        ```

    1. Grant the Managed Identity Operator role:

        ```azurecli-interactive
        az role assignment create --assignee <principal ID> --role managedidentityoperator --scope <user-assigned managed identity resource ID>
        ```

        The user-assigned managed identity resource ID is Azure resource ID of the user assigned identity, in the format `/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user-assigned managed identity name>`.

1. Specify the external ACR and client ID of the __user-assigned managed identity__ in workspace connections by using the `az ml connection` command. This command accepts a YAML file that provides information on the connection. The following example demonstrates the format for specifying a managed identity. Replace the `client_id` and `resource_id` values with the ones for your managed identity:

    [!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

    :::code language="yaml" source="~/azureml-examples-main/cli/resources/connections/container-registry-managed-identity.yml":::

    The following command demonstrates how to use the YAML file to create a connection with your workspace. Replace `<yaml file>`, `<workspace name>`, and `<resource group>` with the values for your configuration:

    ```azurecli-interactive
    az ml connection create --file <yml file> --resource-group <resource group> --workspace-name <workspace>
    ```

1. Once the configuration is complete, you can use the base images from private ACR when building environments for training or inference. The following code snippet demonstrates how to specify the base image ACR and image name in an environment definition:

    [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
    name: private-acr-example
    image: <acr url>/pytorch/pytorch:latest
    description: Environment created from private ACR.
    ```

## Next steps

* Learn more about [enterprise security in Azure Machine Learning](concept-enterprise-security.md)
* Learn about [data administration](how-to-administrate-data-authentication.md)
* Learn about [managed identities on compute cluster](how-to-create-attach-compute-cluster.md).
