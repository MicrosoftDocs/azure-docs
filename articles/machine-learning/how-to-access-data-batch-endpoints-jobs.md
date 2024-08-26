---
title: Create jobs and input data for batch endpoints
titleSuffix: Azure Machine Learning
description: Learn how to access data from different sources in batch endpoints jobs for Azure Machine Learning deployments by using the Azure CLI, the Python SDK, or REST API calls.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 08/21/2024
ms.reviewer: cacrest
ms.custom:
  - devplatv2
  - devx-track-azurecli
  - ignite-2023

#customer intent: As a developer, I want to specify input data for batch endpoints in Azure Machine Learning deployments so I can create jobs by using the Azure CLI, the Python SDK, or REST.
---

# Create jobs and input data for batch endpoints

Batch endpoints enable you to perform long batch operations over large amounts of data. The data can be located in different places, such as across disperse regions. Certain types of batch endpoints can also receive literal parameters as inputs. 

This article describes how to specify parameter inputs for batch endpoints and create deployment jobs. The process supports working with different types of data. For some examples, see [Understand inputs and outputs](#understand-inputs-and-outputs).

## Prerequisites

To successfully invoke a batch endpoint and create jobs, ensure you complete the following prerequisites:

- A batch endpoint and deployment. If you don't have these resources, see [Deploy models for scoring in batch endpoints](how-to-use-batch-model-deployments.md) to create a deployment.

- Permissions to run a batch endpoint deployment. **AzureML Data Scientist**, **Contributor**, and **Owner** roles can be used to run a deployment. For custom role definitions, see [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md) to review the specific required permissions.

- A valid Microsoft Entra ID token representing a security principal to invoke the endpoint. This principal can be a user principal or a service principal. After you invoke an endpoint, Azure Machine Learning creates a batch deployment job under the identity associated with the token. You can use your own credentials for the invocation, as described in the following procedures.

    # [Azure CLI](#tab/cli)
    
    Use the Azure CLI to sign in with **interactive** or **device code** authentication:
    
    ```azurecli
    az login
    ```
    
    # [Python](#tab/sdk)
    
    Use the Azure Machine Learning SDK for Python to sign in:
    
    ```python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    
    ml_client = MLClient.from_config(DefaultAzureCredential())
    ```
    
    If your configuration runs outside an Azure Machine Learning compute, you need to specify the workspace where the endpoint is deployed:
    
    ```python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```
       
    # [REST](#tab/rest)
    
    The simplest way to get a valid token for your user account is to use the Azure CLI. In a console, run the following Azure CLI command:
    
    ```azurecli
    az account get-access-token --resource https://ml.azure.com --query "accessToken" --output tsv
    ```
    
    > [!TIP]
    > When you work with REST, we recommend invoking batch endpoints by using a service principal. For more information, see [Running jobs by using a service principal (REST)](how-to-authenticate-batch-endpoint.md?tabs=rest#running-jobs-using-a-service-principal) to learn how to get a token for a Service Principal with REST.
    
    ---

    To learn more about how to start batch deployment jobs by using different types of credential, see [How to run jobs by using different types of credentials](how-to-authenticate-batch-endpoint.md#how-to-run-jobs-using-different-types-of-credentials).

- The **compute cluster** where the endpoint is deployed has access to read the input data. 

    > [!TIP]
    > If you use a credential-less data store or external Azure Storage Account as data input, ensure you [configure compute clusters for data access](how-to-authenticate-batch-endpoint.md#configure-compute-clusters-for-data-access). The managed identity of the compute cluster is used for mounting the storage account. The identity of the job (invoker) is still used to read the underlying data, which allows you to achieve granular access control.


## Create jobs basics

To create a job from a batch endpoint, you invoke the endpoint. Invocation can be done by using the Azure CLI, the Azure Machine Learning SDK for Python, or a REST API call. The following examples show the basics of invocation for a batch endpoint that receives a single input data folder for processing. For examples with different inputs and outputs, see [Understand inputs and outputs](#understand-inputs-and-outputs).

# [Azure CLI](#tab/cli)
 
Use the `invoke` operation under batch endpoints:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME \
                            --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
```

# [Python](#tab/sdk)

Use the `MLClient.batch_endpoints.invoke()` method to specify the name of the experiment:

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name,
    inputs={
        "heart_dataset": Input("https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data")
    }
)
```

# [REST](#tab/rest)

Make a `POST` request to the invocation URL of the endpoint. You can get the invocation URL from Azure Machine Learning portal on the endpoint's details page.

__Body__
 
```json
{
    "properties": {
        "InputData": {
           "heart_dataset": {
               "JobInputType" : "UriFolder",
               "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
           }
        }
    }
}
```

__Request__

```http
POST jobs HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

### Invoke a specific deployment

Batch endpoints can host multiple deployments under the same endpoint. The default endpoint is used, unless the user specifies otherwise. You can change the deployment to use with the following procedures.

# [Azure CLI](#tab/cli)
 
Use the argument `--deployment-name` or `-d` to specify the name of the deployment:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME \
                            --deployment-name $DEPLOYMENT_NAME \
                            --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
```

# [Python](#tab/sdk)

Use the parameter `deployment_name` to specify the name of the deployment:

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name,
    deployment_name=deployment.name,
    inputs={
        "heart_dataset": Input("https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data")
    }
)
```

# [REST](#tab/rest)

Add the header `azureml-model-deployment` to your request, including the name of the deployment you want to invoke:

__Body__
 
```json
{
    "properties": {
        "InputData": {
           "heart_dataset": {
               "JobInputType" : "UriFolder",
               "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
           }
        }
    }
}
```

__Request__
 
```http
POST jobs HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
azureml-model-deployment: DEPLOYMENT_NAME
```

---

### Configure job properties

You can configure some of the properties in the created job at invocation time.

> [!NOTE]
> The ability to configure job properties is currently available only in batch endpoints with Pipeline component deployments.

#### Configure experiment name

Use the following procedures to configure experiment name.

# [Azure CLI](#tab/cli)
 
Use the argument `--experiment-name` to specify the name of the experiment:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME \
                            --experiment-name "my-batch-job-experiment" \
                            --input https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
```

# [Python](#tab/sdk)

Use the parameter `experiment_name` to specify the name of the experiment:

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name,
    experiment_name="my-batch-job-experiment",
    inputs={
        "heart_dataset": Input("https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"),
    }
)
```

# [REST](#tab/rest)

Indicate the experiment name by using the `experimentName` key in the `properties` section:

__Body__
 
```json
{
    "properties": {
        "InputData": {
           "heart_dataset": {
               "JobInputType" : "UriFolder",
               "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
           }
        },
        "properties":
        {
            "experimentName": "my-batch-job-experiment"
        }
    }
}
```

__Request__

```http
POST jobs HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## Understand inputs and outputs

Batch endpoints provide a durable API that consumers can use to create batch jobs. The same interface can be used to specify the inputs and outputs your deployment expects. Use inputs to pass any information your endpoint needs to perform the job. 

:::image type="content" source="./media/concept-endpoints/batch-endpoint-inputs-outputs.png" border="false" alt-text="Diagram showing how inputs and outputs are used in batch endpoints.":::

Batch endpoints support two types of inputs:

- [Data inputs](#explore-data-inputs): Pointers to a specific storage location or Azure Machine Learning asset.
- [Literal inputs](#explore-literal-inputs): Literal values like numbers or strings that you want to pass to the job. 

The number and type of inputs and outputs depend on the [type of batch deployment](concept-endpoints-batch.md#batch-deployments). Model deployments always require one data input and produce one data output. Literal inputs aren't supported. However, pipeline component deployments provide a more general construct to build endpoints and allow you to specify any number of inputs (data and literal) and outputs.

The following table summarizes the inputs and outputs for batch deployments:

| Deployment type | Number of inputs | Supported input types | Number of outputs | Supported output types |
| --- | --- | --- | --- | --- |
| [Model deployment](concept-endpoints-batch.md#model-deployment) | 1 | [Data inputs](#explore-data-inputs) | 1 | [Data outputs](#explore-data-outputs) |
| [Pipeline component deployment](concept-endpoints-batch.md#pipeline-component-deployment) | [0..N] | [Data inputs](#explore-data-inputs) and [literal inputs](#explore-literal-inputs) | [0..N] | [Data outputs](#explore-data-outputs) |

> [!TIP]
> Inputs and outputs are always named. The names serve as keys to identify the data and pass the actual value during invocation. Because model deployments always require one input and output, the name is ignored during invocation. You can assign the name that best describes your use case, such as "sales_estimation."

### Explore data inputs

Data inputs refer to inputs that point to a location where data is placed. Because batch endpoints usually consume large amounts of data, you can't pass the input data as part of the invocation request. Instead, you specify the location where the batch endpoint should go to look for the data. Input data is mounted and streamed on the target compute to improve performance. 

Batch endpoints support reading files located in the following storage options:

- [Azure Machine Learning data assets](#use-input-data-from-data-asset), including Folder (`uri_folder`) and File (`uri_file`).
- [Azure Machine Learning data stores](#use-input-data-from-data-stores), including Azure Blob Storage, Azure Data Lake Storage Gen1, and Azure Data Lake Storage Gen2.
- [Azure Storage Accounts](#use-input-data-from-azure-storage-accounts), including Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, and Azure Blob Storage.
- Local data folders/files (Azure Machine Learning CLI or Azure Machine Learning SDK for Python). However, that operation results in the local data to be uploaded to the default Azure Machine Learning Data Store of the workspace you're working on.

> [!IMPORTANT]
> __Deprecation notice__: Datasets of type `FileDataset` (V1) are deprecated and will be retired in the future. Existing batch endpoints that rely on this functionality will continue to work. Batch endpoints created with GA CLIv2 (2.4.0 and newer) or GA REST API (2022-05-01 and newer) won't support V1 dataset.

### Explore literal inputs

Literal inputs refer to inputs that can be represented and resolved at invocation time, like strings, numbers, and boolean values. You typically use literal inputs to pass parameters to your endpoint as part of a pipeline component deployment. Batch endpoints support the following literal types:

- `string`
- `boolean`
- `float`
- `integer`

Literal inputs are only supported in pipeline component deployments. See [Create jobs with literal inputs](#create-jobs-with-literal-inputs) to learn how to specify them.

### Explore data outputs

Data outputs refer to the location where the results of a batch job should be placed. Each output has an identifiable name, and Azure Machine Learning automatically assigns a unique path to each named output. You can specify another path, as required. 

> [!IMPORTANT]
> Batch endpoints only support writing outputs in Azure Blob Storage datastores. If you need to write to an storage account with hierarchical namespaces enabled (also known as Azure Datalake Gen2 or ADLS Gen2), you can register the storage service as a Azure Blob Storage datastore because the services are fully compatible. In this way, you can write outputs from batch endpoints to ADLS Gen2.

## Create jobs with data inputs

The following examples show how to create jobs, taking data inputs from [data assets](#use-input-data-from-data-asset), [data stores](#use-input-data-from-data-stores), and [Azure Storage Accounts](#use-input-data-from-azure-storage-accounts).

### Use input data from data asset

Azure Machine Learning data assets (formerly known as datasets) are supported as inputs for jobs. Follow these steps to run a batch endpoint job by using data stored in a registered data asset in Azure Machine Learning.

> [!WARNING]
> Data assets of type Table (`MLTable`) aren't currently supported.

1. First create the data asset. This data asset consists of a folder with multiple CSV files that you process in parallel by using batch endpoints. You can skip this step if your data is already registered as a data asset.

    # [Azure CLI](#tab/cli)
   
    Create a data asset definition in `YAML`:
   
    __heart-dataset-unlabeled.yml__

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
    name: heart-dataset-unlabeled
    description: An unlabeled dataset for heart classification.
    type: uri_folder
    path: heart-classifier-mlflow/data
    ```
   
    Then, create the data asset:
   
    ```bash
    az ml data create -f heart-dataset-unlabeled.yml
    ```
   
    # [Python](#tab/sdk)
   
    Create a data asset definition:

    ```python
    data_path = "heart-classifier-mlflow/data"
    dataset_name = "heart-dataset-unlabeled"
 
    heart_dataset_unlabeled = Data(
        path=data_path,
        type=AssetTypes.URI_FOLDER,
        description="An unlabeled dataset for heart classification",
        name=dataset_name,
    )
    ```
    
    Create the data asset:
    
    ```python
    ml_client.data.create_or_update(heart_dataset_unlabeled)
    ```
    
    To get the newly created data asset, use the following command:
    
    ```python
    heart_dataset_unlabeled = ml_client.data.get(name=dataset_name, label="latest")
    ```

    # [REST](#tab/rest)

    Use the Azure Machine Learning CLI, Azure Machine Learning SDK for Python, or the Azure Machine Learning studio to get the location (region), workspace, and data asset name and version. You need these items for later procedures.

    ---

1. Create the input or request:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    DATASET_ID=$(az ml data show -n heart-dataset-unlabeled --label latest | jq -r .id)
    ```

    # [Python](#tab/sdk)

    ```python
    input = Input(path=heart_dataset_unlabeled.id)
    ```

    # [REST](#tab/rest)

    __Body__

    ```json
    {
        "properties": {
            "InputData": {
                "heart_dataset": {
                    "JobInputType" : "UriFolder",
                    "Uri": "azureml://locations/<location>/workspaces/<workspace>/data/<dataset_name>/versions/labels/latest"
                }
            }
        }
    }
    ```

    The data assets ID looks like `/subscriptions/<subscription>/resourcegroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/data/<data-asset>/versions/<version>`. You can also use the `azureml:<datasset_name>@latest` format to specify the input.

1. Run the endpoint:

    # [Azure CLI](#tab/cli)

    Use the `--set` argument to specify the input:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME \
        --set inputs.heart_dataset.type="uri_folder" inputs.heart_dataset.path=$DATASET_ID
    ```

    For an endpoint that serves a model deployment, you can use the `--input` argument to specify the data input because a model deployment always requires only one data input.

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input $DATASET_ID
    ```
    
    The argument `--set` tends to produce long commands when multiple inputs are specified. In such cases, place your inputs in a `YAML` file and use the `--file` argument to specify the inputs you need for your endpoint invocation.

    __inputs.yml__
    
    ```yml
    inputs:
      heart_dataset: azureml:/<datasset_name>@latest
    ```
    
    Run the following command:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --file inputs.yml
    ```

    # [Python](#tab/sdk)

    > [!TIP]
    > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

    Call the `invoke` method by using the `inputs` parameter to specify the required inputs:

    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name,
        inputs={
            "heart_dataset": input,
        }
    )
    ```

    Further simplify the `invoke` call for a model deployment by using the `input` parameter to specify the location to the input data:

    ```python
    job = ml_client.batch_endpoints.invoke(
       endpoint_name=endpoint.name,
       input=input,
    )
    ```

   # [REST](#tab/rest)

   __Request__
    
    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```

    ---

### Use input data from data stores

You can directly reference data from Azure Machine Learning registered data stores with batch deployments jobs. In this example, you first upload some data to the default data store in the Azure Machine Learning workspace and then run a batch deployment on it. Follow these steps to run a batch endpoint job using data stored in a data store.

1. Access the default data store in the Azure Machine Learning workspace. If your data is in a different store, you can use that store instead. You aren't required to use the default data store. 

    # [Azure CLI](#tab/cli)

    ```azurecli
    DATASTORE_ID=$(az ml datastore show -n workspaceblobstore | jq -r '.id')
    ```
    
    The data stores ID looks like `/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/datastores/<data-store>`.

    # [Python](#tab/sdk)

    ```python
    default_ds = ml_client.datastores.get_default()
    ```

    # [REST](#tab/rest)

    Use the Azure Machine Learning CLI, Azure Machine Learning SDK for Python, or the studio to get the data store information.
    
    ---
    
    > [!TIP]
    > The default blob data store in a workspace is named __workspaceblobstore__. You can skip this step if you already know the resource ID of the default data store in your workspace.

1. Upload some sample data to the data store.

   This example assumes you already uploaded the sample data included in the repo in the folder `sdk/python/endpoints/batch/deploy-models/heart-classifier-mlflow/data` in the folder `heart-disease-uci-unlabeled` in the Blob Storage account. Be sure to complete this step before you continue.

1. Create the input or request:

    # [Azure CLI](#tab/cli)
    
    Place the file path in the `INPUT_PATH` variable:

    ```azurecli
    DATA_PATH="heart-disease-uci-unlabeled"
    INPUT_PATH="$DATASTORE_ID/paths/$DATA_PATH"
    ```

    # [Python](#tab/sdk)

    Place the file path in the `input` variable:

    ```python
    data_path = "heart-disease-uci-unlabeled"
    input = Input(type=AssetTypes.URI_FOLDER, path=f"{default_ds.id}/paths/{data_path})
    ```

    If your data is a file, change the input type to `type=AssetTypes.URI_FILE`. 

    # [REST](#tab/rest)

    __Body__

    ```json
    {
        "properties": {
            "InputData": {
                "heart_dataset": {
                    "JobInputType" : "UriFolder",
                    "Uri": "azureml:/subscriptions/<subscription>/resourceGroups/<resource-group/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/datastores/<data-store>/paths/<data-path>"
                }
            }
        }
    }

    ```

    If your data is a file, use the `UriFile` type for the input instead. 

    ---
    
    Notice how the `paths` variable for the path is appended to the resource ID of the data store. This format indicates that the value that follows is a path.

    > [!TIP]
    > You can also use the format `azureml://datastores/<data-store>/paths/<data-path>` to specify the input.

1. Run the endpoint:

    # [Azure CLI](#tab/cli)

    Use the `--set` argument to specify the input:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME \
        --set inputs.heart_dataset.type="uri_folder" inputs.heart_dataset.path=$INPUT_PATH
    ```

    For an endpoint that serves a model deployment, you can use the `--input` argument to specify the data input because a model deployment always requires only one data input.

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input $INPUT_PATH --input-type uri_folder
    ```
    
    The argument `--set` tends to produce long commands when multiple inputs are specified. In such cases, place your inputs in a `YAML` file and use the `--file` argument to specify the inputs you need for your endpoint invocation.

    __inputs.yml__
    
    ```yml
    inputs:
      heart_dataset:
        type: uri_folder
        path: azureml://datastores/<data-store>/paths/<data-path>
    ```
    
    Run the following command:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --file inputs.yml
    ```

    If your data is a file, use the `uri_file` type for the input instead. 
   
    # [Python](#tab/sdk)

    > [!TIP]
    > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

    Call the `invoke` method by using the `inputs` parameter to specify the required inputs:

    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name,
        inputs={
            "heart_dataset": input,
        }
    )
    ```

    Further simplify the `invoke` call for a model deployment by using the `input` parameter to specify the location to the input data:

    ```python
    job = ml_client.batch_endpoints.invoke(
       endpoint_name=endpoint.name,
       input=input,
    )
    ```

    # [REST](#tab/rest)

    __Request__
    
    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```

    ---

### Use input data from Azure Storage Accounts

Azure Machine Learning batch endpoints can read data from cloud locations in Azure Storage Accounts, both public and private. Use the following steps to run a batch endpoint job with data stored in a storage account.

To learn more about extra required configuration for reading data from storage accounts, see [Configure compute clusters for data access](how-to-authenticate-batch-endpoint.md#configure-compute-clusters-for-data-access).

1. Create the input or request:

    # [Azure CLI](#tab/cli)

    Set the `INPUT_DATA` variable:

    ```azurecli
    INPUT_DATA = "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
    ```

    If your data is a file, set the variable with the following format:

    ```azurecli
    INPUT_DATA = "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data/heart.csv"
    ```

    # [Python](#tab/sdk)

    Set the `input` variable:

    ```python
    input = Input(
        type=AssetTypes.URI_FOLDER, 
        path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
    )
    ```

    If your data is a file, change the input type to `type=AssetTypes.URI_FILE`:

    ```python
    input = Input(
        type=AssetTypes.URI_FILE,
        path="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data/heart.csv"
    )
    ```

    # [REST](#tab/rest)

    __Body__

    ```json
    {
       "properties": {
           "InputData": {
               "heart_dataset": {
                   "JobInputType" : "UriFolder",
                   "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
               }
           }
       }
    }
    ```

    If your data is a file, change the input type to `JobInputType`:

    __Body__

    ```json
    {
       "properties": {
           "InputData": {
               "heart_dataset": {
                   "JobInputType" : "UriFile",
                   "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data/heart.csv"
               }
           }
       }
    }
    ```

    ---

1. Run the endpoint:

    # [Azure CLI](#tab/cli)
    
    Use the `--set` argument to specify the input:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME \
        --set inputs.heart_dataset.type="uri_folder" inputs.heart_dataset.path=$INPUT_DATA
    ```

    For an endpoint that serves a model deployment, you can use the `--input` argument to specify the data input because a model deployment always requires only one data input.

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --input $INPUT_DATA --input-type uri_folder
    ```
    
    The `--set` argument tends to produce long commands when multiple inputs are specified. In such cases, place your inputs in a `YAML` file and use the `--file` argument to specify the inputs you need for your endpoint invocation.

    __inputs.yml__
    
    ```yml
    inputs:
      heart_dataset:
        type: uri_folder
        path: https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data
    ```
    
    Run the following command:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME --file inputs.yml
    ```

    If your data is a file, use the `uri_file` type for the input instead. 

    # [Python](#tab/sdk)

    > [!TIP]
    > [!INCLUDE [batch-endpoint-invoke-inputs-sdk](includes/batch-endpoint-invoke-inputs-sdk.md)]

    Call the `invoke` method by using the `inputs` parameter to specify the required inputs:

    ```python
    job = ml_client.batch_endpoints.invoke(
        endpoint_name=endpoint.name,
        inputs={
            "heart_dataset": input,
        }
    )
    ```

    Further simplify the `invoke` call for a model deployment by using the `input` parameter to specify the location to the input data:
   
    ```python
    job = ml_client.batch_endpoints.invoke(
       endpoint_name=endpoint.name,
       input=input,
    )
    ```

    # [REST](#tab/rest)

    __Request__
    
    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```

    ---

## Create jobs with literal inputs

Pipeline component deployments can take literal inputs. The following example shows how to specify an input named `score_mode`, of type `string`, with a value of `append`:

# [Azure CLI](#tab/cli)

Place your inputs in a `YAML` file and use `--file` to specify the inputs you need for your endpoint invocation.

__inputs.yml__

```yml
inputs:
  score_mode:
    type: string
    default: append
```

Run the following command:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME --file inputs.yml
```

You can also use the `--set` argument to specify the value. However, this approach tends to produce long commands when multiple inputs are specified:

```azurecli
az ml batch-endpoint invoke --name $ENDPOINT_NAME \
    --set inputs.score_mode.type="string" inputs.score_mode.default="append"
```

# [Python](#tab/sdk)

```python
job = ml_client.batch_endpoints.invoke(
    endpoint_name=endpoint.name, 
    inputs = { 
        'score_mode': Input(type="string", default="append")
        }
)
```

# [REST](#tab/rest)

__Body__

```json
{
    "properties": {
        "InputData": {
            "score_mode": {
                "JobInputType" : "Literal",
                "Value": "append"
            }
        }
    }
}
```

__Request__

```http
POST jobs HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## Create jobs with data outputs

The following example shows how to change the location where an output named `score` is placed. For completeness, these examples also configure an input named `heart_dataset`.

1. Save the output by using the default data store in the Azure Machine Learning workspace. You can use any other data store in your workspace as long as it's a Blob Storage account. 

    # [Azure CLI](#tab/cli)

    ```azurecli
    DATASTORE_ID=$(az ml datastore show -n workspaceblobstore | jq -r '.id')
    ```
    
    The data stores ID looks like `/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/datastores/<data-store>`.

    # [Python](#tab/sdk)

    ```python
    default_ds = ml_client.datastores.get_default()
    ```

    # [REST](#tab/rest)

    Use the Azure Machine Learning CLI, Azure Machine Learning SDK for Python, or the studio to get the data store information.

    ---
    
1. Create a data output:

    # [Azure CLI](#tab/cli)
    
    Set the `OUTPUT_PATH` variable:

    ```azurecli
    DATA_PATH="batch-jobs/my-unique-path"
    OUTPUT_PATH="$DATASTORE_ID/paths/$DATA_PATH"
    ```

    For completeness, also create a data input:

    ```azurecli
    INPUT_PATH="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
    ```

    # [Python](#tab/sdk)

    Set the `output` path variable:

    ```python
    data_path = "batch-jobs/my-unique-path"
    output = Output(type=AssetTypes.URI_FILE, path=f"{default_ds.id}/paths/{data_path})
    ```

    For completeness, let's also create a data input:

    ```python
    input="https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
    ```

    # [REST](#tab/rest)

    __Body__

    ```json
    {
        "properties": {
            "InputData": {
               "heart_dataset": {
                   "JobInputType" : "UriFolder",
                   "Uri": "https://azuremlexampledata.blob.core.windows.net/data/heart-disease-uci/data"
               }
            },
            "OutputData": {
                "score": {
                    "JobOutputType" : "UriFile",
                    "Uri": "azureml:/subscriptions/<subscription>/resourceGroups/<resource-group/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/datastores/<data-store>/paths/<data-path>"
                }
            }
        }
    }
    ```

    ---
    
    > [!NOTE]
    > Notice how the `paths` variable for the path is appended to the resource ID of the data store. This format indicates that the value that follows is a path.

1. Run the deployment:

    # [Azure CLI](#tab/cli)
   
    Use the `--set` argument to specify the input:

    ```azurecli
    az ml batch-endpoint invoke --name $ENDPOINT_NAME \
        --set inputs.heart_dataset.path=$INPUT_PATH \
        --set outputs.score.path=$OUTPUT_PATH
    ```
   
    # [Python](#tab/sdk)

    ```python
    job = ml_client.batch_endpoints.invoke(
       endpoint_name=endpoint.name,
       inputs={ "heart_dataset": input },
       outputs={ "score": output }
    )
    ```

    # [REST](#tab/rest)

    __Request__
    
    ```http
    POST jobs HTTP/1.1
    Host: <ENDPOINT_URI>
    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    ```

    ---

## Related content

- [Customize outputs in model deployments batch deployments](how-to-deploy-model-custom-output.md)
- [Create a custom scoring pipeline with inputs and outputs](how-to-use-batch-scoring-pipeline.md)
- [Invoke batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md)
