---
title: "Run batch endpoints from Azure Data Factory"
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Data Factory to invoke batch endpoints. Azure Data Factory supports pipelines to orchestrate and manage multiple data transformations.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 08/13/2024
ms.reviewer: cacrest
ms.custom: devplatv2
---

# Run batch endpoints from Azure Data Factory

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Big data requires a service that can orchestrate and operationalize processes to refine these enormous stores of raw data into actionable business insights. The [Azure Data Factory](../data-factory/introduction.md) managed cloud service handles these complex hybrid extract-transform-load (ETL), extract-load-transform (ELT), and data integration projects.

Azure Data Factory allows you to create pipelines that can orchestrate multiple data transformations and manage them as a single unit. Batch endpoints are an excellent candidate to become a step in such processing workflow. In this article, learn how to use batch endpoints in Azure Data Factory activities by relying on the Web Invoke activity and the REST API.

> [!TIP]
> When you use data pipelines in Fabric, you can invoke batch endpoint directly using the Azure Machine Learning activity. We recommend using Fabric for data orchestration whenever possible to take advantage of the newest capabilities. The Azure Machine Learning activity in Azure Data Factory can only work with assets from Azure Machine Learning V1. For more information, see [Run Azure Machine Learning models from Fabric, using batch endpoints (preview)](how-to-use-batch-fabric.md).

## Prerequisites

- A model deployed as a batch endpoint. Use the *heart condition classifier* created in [Using MLflow models in batch deployments](how-to-mlflow-batch.md).
- An Azure Data Factory resource. To create a data factory, follow the steps in [Quickstart: Create a data factory by using the Azure portal](../data-factory/quickstart-create-data-factory-portal.md).
- After creating your data factory, browse to it in the Azure portal and select **Launch Studio**:

  :::image type="content" source="./media/how-to-use-batch-adf/data-factory-home-page.png" alt-text="Screenshot of the home page for the Azure Data Factory, labeled Open Azure Data Factory Studio and Launch studio highlighted.":::

## Authenticate against batch endpoints

Azure Data Factory can invoke the REST APIs of batch endpoints by using the *Web Invoke* activity. Batch endpoints support Microsoft Entra ID for authorization and the request made to the APIs require a proper authentication handling. For more information, see [Web activity in Azure Data Factory and Azure Synapse Analytics](../data-factory/control-flow-web-activity.md).

You can use a service principal or a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate against batch endpoints. We recommend using a managed identity because it simplifies the use of secrets.

# [Use a managed identity](#tab/mi)

You can use Azure Data Factory managed identity to communicate with batch endpoints. In this case, you only need to make sure that your Azure Data Factory resource was deployed with a managed identity.

1. If you don't have an Azure Data Factory resource or it was already deployed without a managed identity, follow this procedure to create it: [System-assigned managed identity](../data-factory/data-factory-service-identity.md#system-assigned-managed-identity).

   > [!CAUTION]
   > It isn't possible to change the resource identity in Azure Data Factory after deployment. If you need to change the identity of a resource after you create it, you need to recreate the resource.

1. After deployment, grant access for the managed identity of the resource you created to your Azure Machine Learning workspace. See [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access). In this example, the service principal requires:

   - Permission in the workspace to read batch deployments and perform actions over them.
   - Permissions to read/write in data stores.
   - Permissions to read in any cloud location (storage account) indicated as a data input.

# [Use a service principal](#tab/sp)

1. Create a service principal following the procedure at [Register a Microsoft Entra app and create a service principal](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).
1. Create a secret to use for authentication as explained at [Option 3: Create a new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret).
1. Take note of the client secret **Value** that is generated. This value is only displayed once.
1. Take note of the `client ID` and the `tenant id` in the **Overview** pane of the application.
1. Grant access for the service principal you created to your workspace as explained at [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access). In this example, the service principal requires:

   - Permission in the workspace to read batch deployments and perform actions over them.
   - Permissions to read/write in data stores.

---

## About the pipeline

In this example, you create a pipeline in Azure Data Factory that can invoke a given batch endpoint over some data. The pipeline communicates with Azure Machine Learning batch endpoints using REST. For more information about how to use the REST API of batch endpoints, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md?tabs=rest).

The pipeline looks as follows:

# [Use a managed identity](#tab/mi)

:::image type="content" source="./media/how-to-use-batch-adf/pipeline-diagram-mi.png" alt-text="Diagram that shows th high level structure of the pipeline you're creating.":::

The pipeline contains the following activities:

- **Run Batch-Endpoint**: A Web Activity that uses the batch endpoint URI to invoke it. It passes the input data URI where the data is located and the expected output file.
- **Wait for job**: It's a loop activity that checks the status of the created job and waits for its completion, either as **Completed** or **Failed**. This activity, in turns, uses the following activities:

  - **Check status**: A Web Activity that queries the status of the job resource that was returned as a response of the **Run Batch-Endpoint** activity.
  - **Wait**: A Wait Activity that controls the polling frequency of the job's status. We set a default of 120 (2 minutes).

The pipeline requires you to configure the following parameters:

| Parameter             | Description  | Sample value |
| --------------------- | -------------|------------- |
| `endpoint_uri`        | The endpoint scoring URI  | `https://<endpoint_name>.<region>.inference.ml.azure.com/jobs` |
| `poll_interval`       | The number of seconds to wait before checking the job status for completion. Defaults to `120`.  | `120` |
| `endpoint_input_uri`  | The endpoint's input data. Multiple data input types are supported. Ensure that the managed identity that you use to execute the job has access to the underlying location. Alternatively, if you use Data Stores, ensure the credentials are indicated there.  | `azureml://datastores/.../paths/.../data/` |
| `endpoint_input_type`  | The type of the input data you're providing. Currently batch endpoints support folders (`UriFolder`) and File (`UriFile`). Defaults to `UriFolder`.  | `UriFolder` |
| `endpoint_output_uri` | The endpoint's output data file. It must be a path to an output file in a Data Store attached to the Machine Learning workspace. No other type of URIs is supported. You can use the default Azure Machine Learning data store, named `workspaceblobstore`. | `azureml://datastores/workspaceblobstore/paths/batch/predictions.csv` |

# [Use a service principal](#tab/sp)

:::image type="content" source="./media/how-to-use-batch-adf/pipeline-diagram.png" alt-text="Diagram that shows th high level structure of the pipeline you're creating.":::

The pipeline contains the following activities:

- **Authorize**: A Web Activity that uses the service principal created in [Authenticating against batch endpoints](#authenticating-against-batch-endpoints) to obtain an authorization token. This token is used to invoke the endpoint later.
- **Run Batch-Endpoint**: A Web Activity that uses the batch endpoint URI to invoke it. It passes the input data URI where the data is located and the expected output file.
- **Wait for job**: It's a loop activity that checks the status of the created job and waits for its completion, either as **Completed** or **Failed**. This activity uses the following activities:

  - **Check status**: A Web Activity that queries the status of the job resource that was returned as a response of the **Run Batch-Endpoint** activity.
  - **Wait**: A Wait Activity that controls the polling frequency of the job's status. We set a default of 120 (2 minutes).

The pipeline requires the following parameters to be configured:

| Parameter             | Description  | Sample value |
| --------------------- | -------------|------------- |
| `tenant_id`           | Tenant ID where the endpoint is deployed  | `00000000-0000-0000-00000000` |
| `client_id`           | The client ID of the service principal used to invoke the endpoint  | `00000000-0000-0000-00000000` |
| `client_secret`       | The client secret of the service principal used to invoke the endpoint  | `ABCDEFGhijkLMNOPQRstUVwz` |
| `endpoint_uri`        | The endpoint scoring URI  | `https://<endpoint_name>.<region>.inference.ml.azure.com/jobs` |
| `poll_interval`       | The number of seconds to wait before checking the job status for completion. Defaults to `120`.  | `120` |
| `endpoint_input_uri`  | The endpoint's input data. Multiple data input types are supported. Ensure that the managed identity you use to run the job has access to the underlying location. Alternatively, if you use Data Stores, ensure the credentials are indicated there.  | `azureml://datastores/.../paths/.../data/` |
| `endpoint_input_type`  | The type of the input data you provide. Currently, batch endpoints support folders (`UriFolder`) and File (`UriFile`). Defaults to `UriFolder`.  | `UriFolder` |
| `endpoint_output_uri` | The endpoint's output data file. It must be a path to an output file in a Data Store attached to the Machine Learning workspace. No other type of URIs is supported. You can use the default Azure Machine Learning data store, named `workspaceblobstore`. | `azureml://datastores/workspaceblobstore/paths/batch/predictions.csv` |

---

> [!WARNING]
> Remember that `endpoint_output_uri` should be the path to a file that doesn't exist yet. Otherwise, the job fails with the error *the path already exists*.

## Create the pipeline

To create this pipeline in your existing Azure Data Factory and invoke batch endpoints, follow these steps:

1. Ensure the compute where the batch endpoint runs has permissions to mount the data Azure Data Factory provides as input. The entity that invokes the endpoint still grants access.

   In this case, it's Azure Data Factory. However, the compute where the batch endpoint runs needs to have permission to mount the storage account your Azure Data Factory provides. See [Accessing storage services](how-to-identity-based-service-authentication.md#accessing-storage-services) for details.

1. Open Azure Data Factory Studio. Select the pencil icon to open the Author pane and, under **Factory Resources**, select the plus sign.

1. Select **Pipeline** > **Import from pipeline template**.

1. Select a *.zip* file.

   - To use managed identities, select [this file](https://azuremlexampledata.blob.core.windows.net/data/templates/batch-inference/Run-BatchEndpoint-MI.zip).
   - To use a service principle, select [this file](https://azuremlexampledata.blob.core.windows.net/data/templates/batch-inference/Run-BatchEndpoint-SP.zip).

1. A preview of the pipeline shows up in the portal. Select **Use this template**.

   The pipeline is created for you with the name **Run-BatchEndpoint**.

1. Configure the parameters of the batch deployment:

   # [Use a managed identity](#tab/mi)

   :::image type="content" source="./media/how-to-use-batch-adf/pipeline-params-mi.png" alt-text="Screenshot of the pipeline parameters expected for the resulting pipeline that uses managed identity.":::

   # [Use a service principal](#tab/sp)

   :::image type="content" source="./media/how-to-use-batch-adf/pipeline-params.png" alt-text="Screenshot of the pipeline parameters expected for the resulting pipeline that uses a service principal.":::

  ---

  > [!WARNING]
  > Ensure that your batch endpoint has a default deployment configured before you submit a job to it. The created pipeline invokes the endpoint. A default deployment needs to be created and configured.

  > [!TIP]
  > For best reusability, use the created pipeline as a template and call it from within other Azure Data Factory pipelines by using the [Execute pipeline activity](../data-factory/control-flow-execute-pipeline-activity.md). In that case, don't configure the parameters in the inner pipeline but pass them as parameters from the outer pipeline as shown in the following image:
  >
  > :::image type="content" source="./media/how-to-use-batch-adf/pipeline-run.png" alt-text="Screenshot of the pipeline parameters expected for the resulting pipeline when invoked from another pipeline.":::

Your pipeline is ready to use.

## Limitations

When you use Azure Machine Learning batch deployments, consider the following limitations:

### Data inputs

- Only Azure Machine Learning data stores or Azure Storage Accounts (Azure Blob Storage, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2) are supported as inputs. If your input data is in another source, use the Azure Data Factory Copy activity before the execution of the batch job to sink the data to a compatible store.
- Batch endpoint jobs don't explore nested folders. They can't work with nested folder structures. If your data is distributed in multiple folders, you have to flatten the structure.
- Make sure that your scoring script provided in the deployment can handle the data as it's expected to be fed into the job. If the model is MLflow, for the limitations on supported file types, see [Deploy MLflow models in batch deployments](how-to-mlflow-batch.md).

### Data outputs

- Only registered Azure Machine Learning data stores are supported. We recommend that you to register the storage account your Azure Data Factory is using as a Data Store in Azure Machine Learning. In that way, you can write back to the same storage account where you're reading.
- Only Azure Blob Storage Accounts are supported for outputs. For instance, Azure Data Lake Storage Gen2 isn't supported as output in batch deployment jobs. If you need to output the data to a different location or sink, use the Azure Data Factory Copy activity after you run the batch job.

## Related content

- [Using low priority VMs in batch deployments](how-to-use-low-priority-batch.md)
- [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md)
- [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
