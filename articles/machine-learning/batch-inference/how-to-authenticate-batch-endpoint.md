---
title: "Authentication on batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how authentication works on Batch Endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Authentication on batch endpoints

Batch endpoints support Azure Active Directory authentication, or `aad_token`. That means that in order to invoke a batch endpoint, the user must present a valid Azure Active Directory authentication token to the batch endpoint URI. Authorization is enforced at the endpoint level. The following article explains how to correctly interact with batch endpoints and the security requirements for it.

## Prerequisites

* This example assumes that you have a model correctly deployed as a batch endpoint. Particularly, we are using the *heart condition classifier* created in the tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

## How authentication works

To invoke a batch endpoint, the user must present a valid Azure Active Directory token representing a security principal. This principal can be a __user principal__ or a __service principal__. In any case, once an endpoint is invoked, a batch deployment job is created under the identity associated with the token. The identity needs the following permissions in order to successfully create a job:

> [!div class="checklist"]
> * Read batch endpoints/deployments.
> * Create jobs in batch inference endpoints/deployment.
> * Create experiments/runs.
> * Read and write from/to data stores.
> * Lists datastore secrets.

You can either use one of the [built-in security roles](../../role-based-access-control/built-in-roles.md) or create a new one. In any case, the identity used to invoke the endpoints requires to be granted the permissions explicitly. See [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md) for instructions to assign them.

> [!IMPORTANT]
> The identity used for invoking a batch endpoint may not be used to read the underlying data depending on how the data store is configured. Please see [Security considerations when reading data](how-to-access-data-batch-endpoints-jobs.md#security-considerations-when-reading-data) for more details.

## How to run jobs using different types of credentials

The following examples show different ways to start batch deployment jobs using different types of credentials:

### Running jobs using user's credentials

In this case, we want to execute a batch endpoint using the identity of the user currenly logged in. Follow these steps:

> [!IMPORTANT] 
> When working on a private link-enabled workspaces, batch endpoints can't be invoked from the UI in Azure ML studio. Please use the Azure ML CLI v2 instead for job creation. 

> [!NOTE]
> When working on Azure ML studio, batch endpoints/deployments are always executed using the identity of the current user logged in.

# [Azure ML CLI](#tab/cli)

1. Use the Azure CLI to log in using either interactive or device code authentication:

    ```azurecli
    az login
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
    ```

# [Azure ML SDK for Python](#tab/sdk)

1. Use the Azure ML SDK for Python to log in using either interactive or device authentication:

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
            input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data")
        )
    ```

---

### Running jobs using a service principal

In this case, we want to execute a batch endpoint using a service princpal already created in Azure Active Directory. To complete the authentication, you will have to create a secret to perform the authentication. Follow these steps:

# [Azure ML CLI](#tab/cli)

1. Create a secret to use for authentication as explained at [Option 2: Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).
1. For more details see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

    ```bash
    az login --service-principal -u <app-id> -p <password-or-cert> --tenant <tenant>
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
    ```

# [Azure ML SDK for Python](#tab/sdk)

1. Create a secret to use for authentication as explained at [Option 2: Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal#option-2-create-a-new-application-secret).
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

    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```python
    job = ml_client.batch_endpoints.invoke(
            endpoint_name, 
            input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data")
        )
    ```

# [REST](#tab/rest)

You can use the REST API of Azure Machine Learning to start a batch endpoints job using the user's credential. Follow these steps:

1. Use the login service from Azure to get an authorization token. Authorization tokens are issued to a particular scope. The resource type for Azure Machine learning is `https://ml.azure.com`. The request would look as follows:
    
    __POST__: https://login.microsoftonline.com/<TENANT_ID>/oauth2/token
    ```Body
    grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>&resource=https://ml.azure.com
    ```
    
    > [!IMPORTANT]
    > Notice that the resource scope for invoking a batch endpoints (`https://ml.azure.com1) is different from the resource scope used to manage them. All management APIs in Azure use the resource scope `https://management.azure.com`, including Azure Machine Learning.

3. Once authenticated, use the query to run a batch deployment job:
    
    __POST__: <ENDPOINT_URI>
    
    ```json
    {
        "properties": {
    	    "InputData": {
    		"mnistinput": {
    		    "JobInputType" : "UriFolder",
    		    "Uri":  "https://pipelinedata.blob.core.windows.net/sampledata/mnist"
    	        }
            }
        }
    }
    ```
    
    The following headers need to be included:
    
    | Header        | Value            |
    |---------------|------------------|
    | Authorization | Bearer <TOKEN>   |
    | Content-Type  | application/json |

---

### Running jobs using a managed identity

# [Azure ML CLI](#tab/cli)

On resources configured for managed identities for Azure resources, you can sign in using the managed identity. Signing in with the resource's identity is done through the `--identity` flag.

```bash
az login --identity
```

For more details see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

# [Azure ML SDK for Python](#tab/sdk)

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
        input=Input(path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data")
    )
```

---

## Next steps

* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
