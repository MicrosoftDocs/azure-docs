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
ms.date: 10/10/2022
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Authorization on batch endpoints

Batch endpoints support Azure Active Directory authentication, or `aad_token`. That means that in order to invoke a batch endpoint, the user must present a valid Azure Active Directory authentication token to the batch endpoint URI. Authorization is enforced at the endpoint level. The following article explains how to correctly interact with batch endpoints and the security requirements for it.

## Prerequisites

* This example assumes that you have a model correctly deployed as a batch endpoint. Particularly, we are using the *heart condition classifier* created in the tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).

## How authorization works

To invoke a batch endpoint, the user must present a valid Azure Active Directory token representing a __security principal__. This principal can be a __user principal__ or a __service principal__. In any case, once an endpoint is invoked, a batch deployment job is created under the identity associated with the token. The identity needs the following permissions in order to successfully create a job:

> [!div class="checklist"]
> * Read batch endpoints/deployments.
> * Create jobs in batch inference endpoints/deployment.
> * Create experiments/runs.
> * Read and write from/to data stores.
> * Lists datastore secrets.

You can either use one of the [built-in security roles](../role-based-access-control/built-in-roles.md) or create a new one. In any case, the identity used to invoke the endpoints requires to be granted the permissions explicitly. See [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md) for instructions to assign them.

> [!IMPORTANT]
> The identity used for invoking a batch endpoint may not be used to read the underlying data depending on how the data store is configured. Please see [Security considerations when reading data](how-to-access-data-batch-endpoints-jobs.md#security-considerations-when-reading-data) for more details.

## How to run jobs using different types of credentials

The following examples show different ways to start batch deployment jobs using different types of credentials:

> [!IMPORTANT]
> When working on a private link-enabled workspaces, batch endpoints can't be invoked from the UI in Azure Machine Learning studio. Please use the Azure Machine Learning CLI v2 instead for job creation.

### Running jobs using user's credentials

In this case, we want to execute a batch endpoint using the identity of the user currently logged in. Follow these steps:

> [!NOTE]
> When working on Azure Machine Learning studio, batch endpoints/deployments are always executed using the identity of the current user logged in.

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

When working with REST, we recommend invoking batch endpoints using a service principal. However, if you want to test a particular deployment using REST with your own credentials, you can do it by generating an Azure AD token for your account. Follow these steps:

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

In this case, we want to execute a batch endpoint using a service principal already created in Azure Active Directory. To complete the authentication, you will have to create a secret to perform the authentication. Follow these steps:

# [Azure CLI](#tab/cli)

1. Create a secret to use for authentication as explained at [Option 32: Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret).
1. To authenticate using a service principal, use the following command. For more details see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

    ```azurecli
    az login --service-principal -u <app-id> -p <password-or-cert> --tenant <tenant>
    ```

1. Once authenticated, use the following command to run a batch deployment job:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/
    ```

# [Python](#tab/sdk)

1. Create a secret to use for authentication as explained at [Option 3: Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret).
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

1. Create a secret to use for authentication as explained at [Option 3: Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-application-secret).

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

You can use managed identities to invoke batch endpoint and deployments. Please notice that this manage identity doesn't belong to the batch endpoint, but it is the identity used to execute the endpoint and hence create a batch job. Both user assigned and system assigned identities can be use in this scenario.

# [Azure CLI](#tab/cli)

On resources configured for managed identities for Azure resources, you can sign in using the managed identity. Signing in with the resource's identity is done through the `--identity` flag. For more details see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

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

## Next steps

* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
* [Invoking batch endpoints from Event Grid events in storage](how-to-use-event-grid-batch.md).
* [Invoking batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md).
