---
title: "Authorization on batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how authentication works on Batch Endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2023
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Authorization on batch endpoints

Batch endpoints support Microsoft Entra authentication, or `aad_token`. That means that in order to invoke a batch endpoint, the user must present a valid Microsoft Entra authentication token to the batch endpoint URI. Authorization is enforced at the endpoint level. The following article explains how to correctly interact with batch endpoints and the security requirements for it.

## How authorization works

To invoke a batch endpoint, the user must present a valid Microsoft Entra token representing a __security principal__. This principal can be a __user principal__ or a __service principal__. In any case, once an endpoint is invoked, a batch deployment job is created under the identity associated with the token. The identity needs the following permissions in order to successfully create a job:

> [!div class="checklist"]
> * Read batch endpoints/deployments.
> * Create jobs in batch inference endpoints/deployment.
> * Create experiments/runs.
> * Read and write from/to data stores.
> * Lists datastore secrets.

See [Configure RBAC for batch endpoint invoke](#configure-rbac-for-batch-endpoints-invoke) for a detailed list of RBAC permissions.

> [!IMPORTANT]
> The identity used for invoking a batch endpoint may not be used to read the underlying data depending on how the data store is configured. Please see [Configure compute clusters for data access](#configure-compute-clusters-for-data-access) for more details.

## How to run jobs using different types of credentials

The following examples show different ways to start batch deployment jobs using different types of credentials:

> [!IMPORTANT]
> When working on a private link-enabled workspaces, batch endpoints can't be invoked from the UI in Azure Machine Learning studio. Please use the Azure Machine Learning CLI v2 instead for job creation.

### Prerequisites

* This example assumes that you have a model correctly deployed as a batch endpoint. Particularly, we are using the *heart condition classifier* created in the tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

### Running jobs using user's credentials

In this case, we want to execute a batch endpoint using the identity of the user currently logged in. Follow these steps:

# [Azure CLI](#tab/cli)

1. Use the Azure CLI to log in using either interactive or device code authentication:

    ```azurecli
    az login
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci
    ```

# [Python](#tab/sdk)

1. Use the Azure Machine Learning SDK for Python to log in using either interactive or device authentication:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import InteractiveAzureCredentials

    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"

    ml_client = MLClient(InteractiveAzureCredentials(), subscription_id, resource_group, workspace)
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```python
    job = ml_client.batch_endpoints.invoke(
            endpoint_name,
            input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci")
        )
    ```

# [REST](#tab/rest)

When working with REST, we recommend invoking batch endpoints using a service principal. However, if you want to test a particular deployment using REST with your own credentials, you can do it by generating a Microsoft Entra token for your account. Follow these steps:

1. The simplest way to get a valid token for your user account is to use the Azure CLI. In a console, run the following command:

    ```azurecli
    az account get-access-token --resource https://ml.azure.com --query "accessToken" --output tsv
    ```

1. Take note of the generated output.

1. Once authenticated, make a request to the invocation URI replacing `<TOKEN>` by the one you obtained before.

    __Request__:

    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```
    __Body:__

    ```json
    {
        "properties": {
            "InputData": {
            "mnistinput": {
                "JobInputType" : "UriFolder",
                "Uri":  "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci"
                }
            }
        }
    }
    ```

---

### Running jobs using a service principal

In this case, we want to execute a batch endpoint using a service principal already created in Microsoft Entra ID. To complete the authentication, you will have to create a secret to perform the authentication. Follow these steps:

# [Azure CLI](#tab/cli)

1. Create a secret to use for authentication as explained at [Option 3: Create a new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret).
1. To authenticate using a service principal, use the following command. For more details see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

    ```azurecli
    az login --service-principal -u <app-id> -p <password-or-cert> --tenant <tenant>
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/
    ```

# [Python](#tab/sdk)

1. Create a secret to use for authentication as explained at [Option 3: Create a new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret).
1. To authenticate using a service principal, indicate the tenant ID, client ID and client secret of the service principal using environment variables as demonstrated:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import EnvironmentCredential

    os.environ["AZURE_TENANT_ID"] = "<TENANT_ID>"
    os.environ["AZURE_CLIENT_ID"] = "<CLIENT_ID>"
    os.environ["AZURE_CLIENT_SECRET"] = "<CLIENT_SECRET>"

    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"

    ml_client = MLClient(EnvironmentCredential(), subscription_id, resource_group, workspace)
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```python
    job = ml_client.batch_endpoints.invoke(
            endpoint_name,
            input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci")
        )
    ```

# [REST](#tab/rest)

1. Create a secret to use for authentication as explained at [Option 3: Create a new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret).

1. Use the login service from Azure to get an authorization token. Authorization tokens are issued to a particular scope. The resource type for Azure Machine Learning is `https://ml.azure.com`. The request would look as follows:

    __Request__:

    ```http
    POST /{TENANT_ID}/oauth2/token HTTP/1.1
    Host: login.microsoftonline.com
    ```

    __Body__:

    ```
    grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>&resource=https://ml.azure.com
    ```

    > [!IMPORTANT]
    > Notice that the resource scope for invoking a batch endpoints (`https://ml.azure.com1) is different from the resource scope used to manage them. All management APIs in Azure use the resource scope `https://management.azure.com`, including Azure Machine Learning.

3. Once authenticated, use the query to run a batch deployment job:

    __Request__:

    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```
    __Body:__

    ```json
    {
        "properties": {
            "InputData": {
            "mnistinput": {
                "JobInputType" : "UriFolder",
                "Uri":  "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci"
                }
            }
        }
    }
    ```

---

### Running jobs using a managed identity

You can use managed identities to invoke batch endpoint and deployments. Notice that this manage identity doesn't belong to the batch endpoint, but it is the identity used to execute the endpoint and hence create a batch job. Both user assigned and system assigned identities can be use in this scenario.

# [Azure CLI](#tab/cli)

On resources configured for managed identities for Azure resources, you can sign in using the managed identity. Signing in with the resource's identity is done through the `--identity` flag. For more details, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

```azurecli
az login --identity
```

Once authenticated, use the following command to run a batch deployment job:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci
```

# [Python](#tab/sdk)

On resources configured for managed identities for Azure resources, you can sign in using the managed identity. Use the resource ID along with the `ManagedIdentityCredential` object as demonstrated in the following example:

```python
from azure.ai.ml import MLClient
from azure.identity import ManagedIdentityCredential

subscription_id = "<subscription>"
resource_group = "<resource-group>"
workspace = "<workspace>"
resource_id = "<resource-id>"

ml_client = MLClient(ManagedIdentityCredential(resource_id), subscription_id, resource_group, workspace)
```

Once authenticated, use the following command to run a batch deployment job:

```python
job = ml_client.batch_endpoints.invoke(
        endpoint_name,
        input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci")
    )
```

# [REST](#tab/rest)

You can use the REST API of Azure Machine Learning to start a batch endpoints job using a managed identity. The steps vary depending on the underlying service being used. Some examples include (but are not limited to):

* [Managed identity for Azure Data Factory](../data-factory/data-factory-service-identity.md)
* [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md).
* [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

You can also use the Azure CLI to get an authentication token for the managed identity and the pass it to the batch endpoints URI.

---

## Configure RBAC for Batch Endpoints invoke

Batch Endpoints exposes a durable API consumers can use to generate jobs. The invoker request proper permission to be able to generate those jobs. You can either use one of the [built-in security roles](../role-based-access-control/built-in-roles.md) or you can create a custom role for the purposes.

To successfully invoke a batch endpoint you need the following explicit actions granted to the identity used to invoke the endpoints. See [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md) for instructions to assign them.

```json
"actions": [
    "Microsoft.MachineLearningServices/workspaces/read",
    "Microsoft.MachineLearningServices/workspaces/data/versions/write",
    "Microsoft.MachineLearningServices/workspaces/datasets/registered/read",
    "Microsoft.MachineLearningServices/workspaces/datasets/registered/write",
    "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/read",
    "Microsoft.MachineLearningServices/workspaces/datasets/unregistered/write",
    "Microsoft.MachineLearningServices/workspaces/datastores/read",
    "Microsoft.MachineLearningServices/workspaces/datastores/write",
    "Microsoft.MachineLearningServices/workspaces/datastores/listsecrets/action",
    "Microsoft.MachineLearningServices/workspaces/listStorageAccountKeys/action",
    "Microsoft.MachineLearningServices/workspaces/batchEndpoints/read",
    "Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/read",
    "Microsoft.MachineLearningServices/workspaces/computes/read",
    "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
    "Microsoft.MachineLearningServices/workspaces/metadata/secrets/read",
    "Microsoft.MachineLearningServices/workspaces/metadata/snapshots/read",
    "Microsoft.MachineLearningServices/workspaces/metadata/artifacts/read",
    "Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write",
    "Microsoft.MachineLearningServices/workspaces/experiments/read",
    "Microsoft.MachineLearningServices/workspaces/experiments/runs/submit/action",
    "Microsoft.MachineLearningServices/workspaces/experiments/runs/read",
    "Microsoft.MachineLearningServices/workspaces/experiments/runs/write",
    "Microsoft.MachineLearningServices/workspaces/metrics/resource/write",
    "Microsoft.MachineLearningServices/workspaces/modules/read",
    "Microsoft.MachineLearningServices/workspaces/models/read",
    "Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/read",
    "Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/write",
    "Microsoft.MachineLearningServices/workspaces/environments/read",
    "Microsoft.MachineLearningServices/workspaces/environments/write",
    "Microsoft.MachineLearningServices/workspaces/environments/build/action"
    "Microsoft.MachineLearningServices/workspaces/environments/readSecrets/action"
]
```

## Configure compute clusters for data access

Batch endpoints ensure that only authorized users are able to invoke batch deployments and generate jobs. However, depending on how the input data is configured, other credentials might be used to read the underlying data. Use the following table to understand which credentials are used:

| Data input type              | Credential in store             | Credentials used                                              | Access granted by |
|------------------------------|---------------------------------|---------------------------------------------------------------|-------------------|
| Data store                   | Yes                             | Data store's credentials in the workspace                     | Access key or SAS |
| Data asset                   | Yes                             | Data store's credentials in the workspace                     | Access Key or SAS |
| Data store                   | No                              | Identity of the job + Managed identity of the compute cluster | RBAC              |
| Data asset                   | No                              | Identity of the job + Managed identity of the compute cluster | RBAC              |
| Azure Blob Storage           | Not apply                       | Identity of the job + Managed identity of the compute cluster | RBAC              |
| Azure Data Lake Storage Gen1 | Not apply                       | Identity of the job + Managed identity of the compute cluster | POSIX             |
| Azure Data Lake Storage Gen2 | Not apply                       | Identity of the job + Managed identity of the compute cluster | POSIX and RBAC    |

For those items in the table where **Identity of the job + Managed identity of the compute cluster** is displayed, the managed identity of the compute cluster is used **for mounting** and configuring storage accounts. However, the identity of the job is still used to read the underlying data allowing you to achieve granular access control. That means that in order to successfully read data from storage, the managed identity of the compute cluster where the deployment is running must have at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account.

To configure the compute cluster for data access, follow these steps:

1. Go to [Azure Machine Learning studio](https://ml.azure.com).

1. Navigate to __Compute__, then __Compute clusters__, and select the compute cluster your deployment is using.

1. Assign a managed identity to the compute cluster:

   1. In the __Managed identity__ section, verify if the compute has a managed identity assigned. If not, select the option __Edit__.
      
   1. Select __Assign a managed identity__ and configure it as needed. You can use a System-Assigned Managed Identity or a User-Assigned Managed Identity. If using a System-Assigned Managed Identity, it is named as "[workspace name]/computes/[compute cluster name]".

   1. Save the changes. 

    :::image type="content" source="media/how-to-authenticate-batch-endpoint/guide-manage-identity-cluster.gif" alt-text="Animation showing the steps to assign a managed identity to a cluster.":::

1. Go to the [Azure portal](https://portal.azure.com) and navigate to the associated storage account where the data is located. If your data input is a Data Asset or a Data Store, look for the storage account where those assets are placed.

1. Assign Storage Blob Data Reader access level in the storage account:

   1. Go to the section __Access control (IAM)__.

   1. Select the tab __Role assignment__, and then click on __Add__ > __Role assignment__.

   1. Look for the role named __Storage Blob Data Reader__, select it, and click on __Next__.

   1. Click on __Select members__.

   1. Look for the managed identity you have created. If using a System-Assigned Managed Identity, it is named as __"[workspace name]/computes/[compute cluster name]"__.

   1. Add the account, and complete the wizard.
  
    :::image type="content" source="media/how-to-authenticate-batch-endpoint/guide-manage-identity-assign.gif" alt-text="Animation showing the steps to assign the created managed identity to the storage account.":::
  
1. Your endpoint is ready to receive jobs and input data from the selected storage account. 

## Next steps

* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
* [Invoking batch endpoints from Event Grid events in storage](how-to-use-event-grid-batch.md).
* [Invoking batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md).
