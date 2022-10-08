---
title: "Deploy models using batch endpoints with REST APIs"
titleSuffix: Azure Machine Learning
description: Learn how to deploy models using batch endpoints with REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: dem108
ms.author: sehan
ms.date: 05/24/2022
ms.reviewer: larryfr
ms.custom: devplatv2, event-tier1-build-2022, ignite-2022
---

# Deploy models with REST for batch scoring 

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Learn how to use the Azure Machine Learning REST API to deploy models for batch scoring.



The REST API uses standard HTTP verbs to create, retrieve, update, and delete resources. The REST API works with any language or tool that can make HTTP requests. REST's straightforward structure makes it a good choice in scripting environments and for MLOps automation.

In this article, you learn how to use the new REST APIs to:

> [!div class="checklist"]
> * Create machine learning assets
> * Create a batch endpoint and a batch deployment
> * Invoke a batch endpoint to start a batch scoring job

## Prerequisites

- An **Azure subscription** for which you have administrative rights. If you don't have such a subscription, try the [free or paid personal subscription](https://azure.microsoft.com/free/).
- An [Azure Machine Learning workspace](quickstart-create-resources.md).
- A service principal in your workspace. Administrative REST requests use [service principal authentication](how-to-setup-authentication.md#use-service-principal-authentication).
- A service principal authentication token. Follow the steps in [Retrieve a service principal authentication token](./how-to-manage-rest.md#retrieve-a-service-principal-authentication-token) to retrieve this token. 
- The **curl** utility. The **curl** program is available in the [Windows Subsystem for Linux](/windows/wsl/install-win10) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. 
- The [jq](https://stedolan.github.io/jq/) JSON processor.

> [!IMPORTANT]
> The code snippets in this article assume that you are using the Bash shell.
>
> The code snippets are pulled from the `/cli/batch-score-rest.sh` file in the [AzureML Example repository](https://github.com/Azure/azureml-examples).

## Set endpoint name

> [!NOTE]
> Batch endpoint names need to be unique at the Azure region level. For example, there can be only one batch endpoint with the name mybatchendpoint in westus2.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="set_endpoint_name":::

## Azure Machine Learning batch endpoints

[Batch endpoints](concept-endpoints.md#what-are-batch-endpoints) simplify the process of hosting your models for batch scoring, so you can focus on machine learning, not infrastructure. In this article, you'll create a batch endpoint and deployment, and invoking it to start a batch scoring job. But first you'll have to register the assets needed for deployment, including model, code, and environment.

There are many ways to create an Azure Machine Learning batch endpoint, including [the Azure CLI](how-to-use-batch-endpoint.md), and visually with [the studio](how-to-use-batch-endpoints-studio.md). The following example creates a batch endpoint and a batch deployment with the REST API.

## Create machine learning assets

First, set up your Azure Machine Learning assets to configure your job.

In the following REST API calls, we use `SUBSCRIPTION_ID`, `RESOURCE_GROUP`, `LOCATION`, and `WORKSPACE` as placeholders. Replace the placeholders with your own values. 

Administrative REST requests a [service principal authentication token](how-to-manage-rest.md#retrieve-a-service-principal-authentication-token). Replace `TOKEN` with your own value. You can retrieve this token with the following command:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" range="10":::

The service provider uses the `api-version` argument to ensure compatibility. The `api-version` argument varies from service to service. Set the API version as a variable to accommodate future versions:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" range="8":::

### Create compute
Batch scoring runs only on cloud computing resources, not locally. The cloud computing resource is a reusable virtual computer cluster where you can run batch scoring workflows.

Create a compute cluster:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_compute":::

> [!TIP]
> If you want to use an existing compute instead, you must specify the full Azure Resource Manager ID when [creating the batch deployment](#create-batch-deployment). The full ID uses the format `/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/computes/<your-compute-name>`.

### Get storage account details

To register the model and code, first they need to be uploaded to a storage account. The details of the storage account are available in the data store. In this example, you get the default datastore and Azure Storage account for your workspace. Query your workspace with a GET request to get a JSON file with the information.

You can use the tool [jq](https://stedolan.github.io/jq/) to parse the JSON result and get the required values. You can also use the Azure portal to find the same information:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_storage_details":::

### Upload & register code

Now that you have the datastore, you can upload the scoring script. For more information about how to author the scoring script, see [Understanding the scoring script](how-to-use-batch-endpoint.md#understanding-the-scoring-script). Use the Azure Storage CLI to upload a blob into your default container:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="upload_code":::

> [!TIP]
> You can also use other methods to upload, such as the Azure portal or [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

Once you upload your code, you can specify your code with a PUT request:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_code":::

### Upload and register model

Similar to the code, upload the model files:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="upload_model":::

Now, register the model:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_model":::

### Create environment
The deployment needs to run in an environment that has the required dependencies. Create the environment with a PUT request. Use a docker image from Microsoft Container Registry. You can configure the docker image with `image` and add conda dependencies with `condaFile`.

Run the following code to read the `condaFile` defined in json. The source file is at `/cli/endpoints/batch/mnist/environment/conda.json` in the example repository:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="read_condafile":::

Now, run the following snippet to create an environment:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_environment":::

## Deploy with batch endpoints

Next, create a batch endpoint, a batch deployment, and set the default deployment for the endpoint.

### Create batch endpoint

Create the batch endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_endpoint":::

### Create batch deployment

Create a batch deployment under the endpoint:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="create_deployment":::

### Set the default batch deployment under the endpoint

There's only one default batch deployment under one endpoint, which will be used when invoke to run batch scoring job.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="set_endpoint_defaults":::

## Run batch scoring

Invoking a batch endpoint triggers a batch scoring job. A job `id` is returned in the response, and can be used to track the batch scoring progress. In the following snippets, `jq` is used to get the job `id`.

### Invoke the batch endpoint to start a batch scoring job

#### Getting the Scoring URI and access token

Get the scoring uri and access token to invoke the batch endpoint. First get the scoring uri:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_endpoint":::

Get the batch endpoint access token:

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="get_access_token":::

#### Invoke the batch endpoint with different input options

It's time to invoke the batch endpoint to start a batch scoring job. If your data is a folder (potentially with multiple files) publicly available from the web, you can use the following snippet:

```rest-api
response=$(curl --location --request POST $SCORING_URI \
--header "Authorization: Bearer $SCORING_TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
    \"properties\": {
    	\"InputData\": {
    		\"mnistinput\": {
    			\"JobInputType\" : \"UriFolder\",
    			\"Uri\":  \"https://pipelinedata.blob.core.windows.net/sampledata/mnist\"
    		}
        }
    }
}")

JOB_ID=$(echo $response | jq -r '.id')
JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
```

Now, let's look at other options for invoking the batch endpoint. When it comes to input data, there are multiple scenarios you can choose from, depending on the input type (whether you are specifying a folder or a single file), and the URI type (whether you are using a path on Azure Machine Learning registered datastore, a reference to Azure Machine Learning registered V2 data asset, or a public URI).

- An `InputData` property has `JobInputType` and `Uri` keys. When you are specifying a single file, use `"JobInputType": "UriFile"`, and when you are specifying a folder, use `'JobInputType": "UriFolder"`.

- When the file or folder is on Azure ML registered datastore, the syntax for the `Uri` is  `azureml://datastores/<datastore-name>/paths/<path-on-datastore>` for folder, and `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/<file-name>` for a specific file. You can also use the longer form to represent the same path, such as `azureml://subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/workspaces/<workspace-name>/datastores/<datastore-name>/paths/<path-on-datastore>/`.

- When the file or folder is registered as V2 data asset as `uri_folder` or `uri_file`, the syntax for the `Uri` is `\"azureml://locations/<location-name>/workspaces/<workspace-name>/data/<data-name>/versions/<data-version>"` (Asset ID form) or `\"/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>/data/<data-name>/versions/<data-version>\"` (ARM ID form).

- When the file or folder is a publicly accessible path, the syntax for the URI is `https://<public-path>` for folder, `https://<public-path>/<file-name>` for a specific file.

> [!NOTE]
> For more information about data URI, see [Azure Machine Learning data reference URI](reference-yaml-core-syntax.md#azure-ml-data-reference-uri).

Below are some examples using different types of input data.

- If your data is a folder on the Azure ML registered datastore, you can either:

    - Use the short form to represent the URI:

    ```rest-api
    response=$(curl --location --request POST $SCORING_URI \
    --header "Authorization: Bearer $SCORING_TOKEN" \
    --header "Content-Type: application/json" \
    --data-raw "{
        \"properties\": {
            \"InputData\": {
                \"mnistInput\": {
                    \"JobInputType\" : \"UriFolder\",
                    \"Uri": \"azureml://datastores/workspaceblobstore/paths/$ENDPOINT_NAME/mnist\"
                }
            }
        }
    }")
    
    JOB_ID=$(echo $response | jq -r '.id')
    JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
    ```

    - Or use the long form for the same URI:

    ```rest-api
    response=$(curl --location --request POST $SCORING_URI \
    --header "Authorization: Bearer $SCORING_TOKEN" \
    --header "Content-Type: application/json" \
    --data-raw "{
        \"properties\": {
        	\"InputData\": {
        		\"mnistinput\": {
        			\"JobInputType\" : \"UriFolder\",
        			\"Uri\": \"azureml://subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/workspaces/$WORKSPACE/datastores/workspaceblobstore/paths/$ENDPOINT_NAME/mnist\"
        		}
            }
        }
    }")
    
    JOB_ID=$(echo $response | jq -r '.id')
    JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
    ```

- If you want to manage your data as Azure ML registered V2 data asset as `uri_folder`, you can follow the two steps below:

    1. Create the V2 data asset:

    ```rest-api
    DATA_NAME="mnist"
    DATA_VERSION=$RANDOM
    
    response=$(curl --location --request PUT https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.MachineLearningServices/workspaces/$WORKSPACE/data/$DATA_NAME/versions/$DATA_VERSION?api-version=$API_VERSION \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $TOKEN" \
    --data-raw "{
        \"properties\": {
            \"dataType\": \"uri_folder\",
      \"dataUri\": \"https://pipelinedata.blob.core.windows.net/sampledata/mnist\",
      \"description\": \"Mnist data asset\"
        }
    }")
    ```

    2. Reference the data asset in the batch scoring job:

    ```rest-api
    response=$(curl --location --request POST $SCORING_URI \
    --header "Authorization: Bearer $SCORING_TOKEN" \
    --header "Content-Type: application/json" \
    --data-raw "{
        \"properties\": {
            \"InputData\": {
                \"mnistInput\": {
                    \"JobInputType\" : \"UriFolder\",
                    \"Uri": \"azureml://locations/$LOCATION_NAME/workspaces/$WORKSPACE_NAME/data/$DATA_NAME/versions/$DATA_VERSION/\"
                }
            }
        }
    }")
    
    JOB_ID=$(echo $response | jq -r '.id')
    JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
    ```

- If your data is a single file publicly available from the web, you can use the following snippet:

    ```rest-api
    response=$(curl --location --request POST $SCORING_URI \
    --header "Authorization: Bearer $SCORING_TOKEN" \
    --header "Content-Type: application/json" \
    --data-raw "{
        \"properties\": {
            \"InputData\": {
                \"mnistInput\": {
                    \"JobInputType\" : \"UriFile\",
                    \"Uri": \"https://pipelinedata.blob.core.windows.net/sampledata/mnist/0.png\"
                }
            }
        }
    }")
    
    JOB_ID=$(echo $response | jq -r '.id')
    JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
    ```

> [!NOTE]
> We strongly recommend using the latest REST API version for batch scoring.
> - If you want to use local data, you can upload it to Azure Machine Learning registered datastore and use REST API for Cloud data.
> - If you are using existing V1 FileDataset for batch endpoint, we recommend migrating them to V2 data assets and refer to them directly when invoking batch endpoints. Currently only data assets of type `uri_folder` or `uri_file` are supported. Batch endpoints created with GA CLIv2 (2.4.0 and newer) or GA REST API (2022-05-01 and newer) will not support V1 Dataset.
> - You can also extract the URI or path on datastore extracted from V1 FileDataset by using `az ml dataset show` command with `--query` parameter and use that information for invoke.
> - While Batch endpoints created with earlier APIs will continue to support V1 FileDataset, we will be adding further V2 data assets support with the latest API versions for even more usability and flexibility. For more information on V2 data assets, see [Work with data using SDK v2](how-to-read-write-data-v2.md). For more information on the new V2 experience, see [What is v2](concept-v2.md).

#### Configure the output location and overwrite settings

The batch scoring results are by default stored in the workspace's default blob store within a folder named by job name (a system-generated GUID). You can configure where to store the scoring outputs when you invoke the batch endpoint. Use `OutputData` to configure the output file path on an Azure Machine Learning registered datastore. `OutputData` has `JobOutputType` and `Uri` keys. `UriFile` is the only supported value for `JobOutputType`. The syntax for `Uri` is the same as that of `InputData`, i.e., `azureml://datastores/<datastore-name>/paths/<path-on-datastore>/<file-name>`.

Following is the example snippet for configuring the output location for the batch scoring results.

```rest-api
response=$(curl --location --request POST $SCORING_URI \
--header "Authorization: Bearer $SCORING_TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
    \"properties\": {
        \"InputData\":
        {
            \"mnistInput\": {
                \"JobInputType\" : \"UriFolder\",
                \"Uri": \"azureml://datastores/workspaceblobstore/paths/$ENDPOINT_NAME/mnist\"
            }
        },
        \"OutputData\":
        {
            \"mnistOutput\": {
                \"JobOutputType\": \"UriFile\",
                \"Uri\": \"azureml://datastores/workspaceblobstore/paths/$ENDPOINT_NAME/mnistOutput/$OUTPUT_FILE_NAME\"
            }
        }
    }
}")

JOB_ID=$(echo $response | jq -r '.id')
JOB_ID_SUFFIX=$(echo ${JOB_ID##/*/})
```

> [!IMPORTANT]
> You must use a unique output location. If the output file exists, the batch scoring job will fail. 

### Check the batch scoring job

Batch scoring jobs usually take some time to process the entire set of inputs. Monitor the job status and check the results after it's completed:

> [!TIP]
> The example invokes the default deployment of the batch endpoint. To invoke a non-default deployment, use the `azureml-model-deployment` HTTP header and set the value to the deployment name. For example, using a parameter of `--header "azureml-model-deployment: $DEPLOYMENT_NAME"` with curl.

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="check_job":::

### Check batch scoring results

For information on checking the results, see [Check batch scoring results](how-to-use-batch-endpoint.md#check-batch-scoring-results).

## Delete the batch endpoint

If you aren't going use the batch endpoint, you should delete it with the below command (it deletes the batch endpoint and all the underlying deployments):

:::code language="rest-api" source="~/azureml-examples-main/cli/batch-score-rest.sh" id="delete_endpoint":::

## Next steps

* Learn how to deploy your model for batch scoring [using the Azure CLI](how-to-use-batch-endpoint.md).
* Learn how to deploy your model for batch scoring [using studio](how-to-use-batch-endpoints-studio.md).
* Learn to [Troubleshoot batch endpoints](how-to-troubleshoot-batch-endpoints.md)
