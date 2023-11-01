---
title: "Consume models deployed in Azure Machine Learning from Fabric, using Batch Endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a machine learning model in batch endpoints to then consume it from within Fabric.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2023
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Run Azure Machine Learning models from Fabric, using batch endpoints

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

In this article, you learn how to consume Azure Machine Learning batch deployments from Microsoft Fabric. Although the workflow uses models that are deployed to batch endpoints, it also supports the use of batch pipeline deployments from Fabric.

## Prerequisites

- Get a [Microsoft Fabric subscription](/fabric/enterprise/licenses). Or sign up for a free [Microsoft Fabric trial](/fabric/get-started/fabric-trial).
- Sign in to Microsoft Fabric.
- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace. If you don't have one, use the steps in [How to manage workspaces](how-to-manage-workspace.md) to create one.
    - Ensure that you have the following permissions in the workspace:
        - Create/manage batch endpoints and deployments: Use roles Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/batchEndpoints/*`.
        - Create ARM deployments in the workspace resource group: Use roles Owner, contributor, or custom role allowing `Microsoft.Resources/deployments/write` in the resource group where the workspace is deployed.
- A model deployed to a batch endpoint. If you don't have one, use the steps in [Deploy models for scoring in batch endpoints](how-to-use-batch-model-deployments.md) to create one.
- Download the _heart-unlabeled.csv_ sample dataset to use for scoring. [[@facundo: where is this dataset stored?]]

## Architecture

Azure Machine Learning can't directly access data stored in Fabric's [OneLake](/fabric/onelake/onelake-overview). However, you can use OneLake's capability to create shortcuts within a Lakehouse to read and write data stored in [Azure Data Lake Gen2](/azure/storage/blobs/data-lake-storage-introduction). Since Azure Machine Learning supports Azure Data Lake Gen2 storage, this setup allows you to use Fabric and Azure Machine Learning together. The data architecture is as follows:

:::image type="content" source="./media/how-to-use-batch-fabric/fabric-azureml-data-architecture.png" alt-text="A diagram showing how Azure Storage accounts are used to connect Fabric with Azure Machine Learning." lightbox="media/how-to-use-batch-fabric/fabric-azureml-data-architecture.png":::

## Configure data access

To allow Fabric and Azure Machine Learning to read and write the same data without having to copy it, you can take advantage of [OneLake shortcuts](/fabric/onelake/onelake-shortcuts) and [Azure Machine Learning datastores](concept-data.md#datastore). By pointing a OneLake shortcut and a datastore to the same storage account, you can ensure that both Fabric and Azure Machine Learning read from and write to the same underlying data.

In this section, you create or identify a storage account to use for storing the information that the batch endpoint will consume and that Fabric users will see in OneLake. Fabric only supports storage accounts with hierarchical names enabled, such as Azure Data Lake Gen2.

#### Create a OneLake shortcut to the storage account

1. Open the **Synapse Data Engineering** experience in Fabric.
1. From the left-side panel, select your Fabric workspace to open it.
1. Open the lakehouse that you'll use to configure the connection. If you don't have a lakehouse already, go to the **Data Engineering** experience to [create a lakehouse](/fabric/data-engineering/create-lakehouse). In this example, you use a lakehouse named **trusted**.
1. In the left-side navigation bar, open _more options_ for **Files**, and then select **New shortcut** to bring up the wizard.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut.png" alt-text="A screenshot showing how to create a new shortcut in a lakehouse." lightbox="media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut.png":::

1. Select the **Azure Data Lake Storage Gen2** option.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut-type.png" alt-text="A screenshot showing how to create an Azure Data Lake Storage Gen2 shortcut." lightbox="media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut-type.png":::

1. In the **Connection settings** section, paste the URL associated with the Azure Data Lake Gen2 storage account.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut-url.png" alt-text="A screenshot showing how to configure the URL of the shortcut." lightbox="media/how-to-use-batch-fabric/fabric-lakehouse-new-shortcut-url.png":::

1. In the **Connection credentials** section:
    1. For **Connection**, select **Create new connection**.
    1. For **Connection name**, keep the default populated value.
    1. For **Authentication kind**, select **Organizational account** to use the credentials of the connected user via OAuth 2.0.
    1. Select **Sign in** to sign in.

1. Select **Next**.

1. Configure the path to the shortcut, relative to the storage account, if needed. Use this setting to configure the folder that the shortcut will point to.

1. Configure the **Name** of the shortcut. This name will be a path inside the lakehouse. In this example, name the shortcut **datasets**.

1. Save the changes.

#### Create a datastore that points to the storage account

1. Open the [Azure Machine Learning studio](https://ml.azure.com).
1. Go to your Azure Machine Learning workspace.
1. Go to the **Data** section.
1. Select the **Datastores** tab.
1. Select **Create**.
1. Configure the datastore as follows:

    1. For **Datastore name**, enter **trusted_blob**.
    1. For **Datastore type** select **Azure Blob Storage**.
            
        > [!TIP]
        > Why should you configure **Azure Blob Storage** instead of **Azure Data Lake Gen2**? Batch endpoints can only write predictions to Blob Storage accounts. However, every Azure Data Lake Gen2 storage account is also a blob storage account; therefore, they can be used interchangeably.

    1. Select the storage account from the wizard, using the **Subscription ID**, **Storage account**, and **Blob container** (file system).
    
        :::image type="content" source="./media/how-to-use-batch-fabric/azureml-store-create-blob.png" alt-text="A screenshot showing how to configure the Azure Machine Learning data store."::: 

    1. Select **Create**.

1. Ensure that the compute where the batch endpoint is running has permission to mount the data in this storage account. Although access is still granted by the identity that invokes the endpoint, the compute where the batch endpoint runs needs to have permission to mount the storage account that you provide. For more information, see [Accessing storage services](how-to-identity-based-service-authentication.md#accessing-storage-services).

#### Upload sample dataset

Upload some sample data for the endpoint to use as input:

1. Go to your Fabric workspace.
1. Select the lakehouse where you created the shortcut.
1. Go to the **datasets** shortcut.
1. Create a folder to store the sample dataset that you want to score. In this case *uci-heart-unlabeled*.

1. Use the **Get data** option and select **Upload files** to upload the sample dataset.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-lakehouse-get-data.png" alt-text="A screenshot showing how to upload data to an existing folder in OneLake." lightbox="media/how-to-use-batch-fabric/fabric-lakehouse-get-data.png":::

1. Upload the sample dataset.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-lakehouse-upload-data.png" alt-text="A screenshot showing how to upload a file to OneLake." lightbox="media/how-to-use-batch-fabric/fabric-lakehouse-upload-data.png":::

1. The sample file is ready to be consumed. Note the path to the location where you saved it.

## Create a Fabric to batch inferencing pipeline

In this section, you create a Fabric-to-batch inferencing pipeline in your existing Fabric workspace and invoke batch endpoints.

1. Return to the **Data Engineering** experience (if you already navigated away from it), by using the experience selector icon in the lower left corner of your home page.
1. Open your Fabric workspace.
1. From the **New** section of the homepage, select **Data pipeline**.
1. Name the pipeline and select **Create**.

    :::image type="content" source="media/how-to-use-batch-fabric/fabric-select-data-pipeline.png" alt-text="A screenshot showing where to select the data pipeline option." lightbox="media/how-to-use-batch-fabric/fabric-select-data-pipeline.png":::

1. Select the **Activities** tab from the toolbar in the designer canvas.
1. Select more options at the end of the tab and select **Azure Machine Learning**.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-add-activity.png" alt-text="A screenshot showing how to add the Azure Machine Learning activity to a pipeline." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-add-activity.png":::

1. Go to the **Settings** tab and configure the activity as follows:

    1. Select **New** next to **Azure Machine Learning connection** to create a new connection to the Azure Machine Learning workspace that contains your deployment.

        :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-add-connection.png" alt-text="A screenshot of the configuration section of the activity showing how to create a new connection." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-add-connection.png":::

    1. In the **Connection settings** section of the creation wizard, specify the values of the __subscription ID__, __Resource group name__, and __Workspace name__, where your endpoint is deployed.

        :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-add-connection-ws.png" alt-text="A screenshot showing examples of the values for  subscription ID, resource group name, and workspace name." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-add-connection-ws.png":::

    1. In the **Connection credentials** section, select **Organizational account** as the value for the **Authentication kind** for your connection. _Organizational account_ uses the credentials of the connected user. Alternatively, you could use _Service principal_. In production settings, we recommend that you use a Service principal. Regardless of the authentication type, ensure that the identity associated with the connection has the rights to call the batch endpoint that you deployed.

        :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-add-connection-credentials.png" alt-text="A screenshot showing how to configure the authentication mechanism in the connection." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-add-connection-credentials.png":::

    1. **Save** the connection. Once the connection is selected, Fabric automatically populates the available batch endpoints in the selected workspace.

1. For **Batch endpoint**, select the batch endpoint you want to call. In this example, select **heart-classifier-...**.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-configure-endpoint.png" alt-text="A screenshot showing how to select an endpoint once a connection is configured." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-configure-endpoint.png":::

    The **Batch deployment** section automatically populates with the available deployments under the endpoint.

1. For **Batch deployment**, select a specific deployment from the list, if needed. If you don't select a deployment, Fabric invokes the **Default** deployment under the endpoint, allowing the batch endpoint creator to decide which deployment is called. In most scenarios, you'd want to keep this default behavior.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-configure-deployment.png" alt-text="A screenshot showing how to configure the endpoint to use the default deployment." lightbox="media/how-to-use-batch-fabric/fabric-pipeline-configure-deployment.png":::

### Configure inputs and outputs for the batch endpoint

In this section, you configure inputs and outputs from the batch endpoint. **Inputs** to batch endpoints supply data and parameters needed to run the process. The Azure Machine Learning batch pipeline in Fabric supports both [model deployments](how-to-use-batch-model-deployments.md) and [pipeline deployments](how-to-use-batch-pipeline-deployments.md). The number and type of inputs you provide depend on the deployment type. In this example, you use a model deployment that requires exactly one input and produces one output.

For more information on batch endpoint inputs and outputs, see [Understanding inputs and outputs in Batch Endpoints](how-to-access-data-batch-endpoints-jobs.md#understanding-inputs-and-outputs). 

#### Configure the input section

Configure the **Job inputs** section as follows:

1. Expand the **Job inputs** section.

1. Select **New** to add a new input to your endpoint.

1. Name the input `input_data`. Since you're using a model deployment, you can use any name. For pipeline deployments, however, you need to indicate the exact name of the input that your model is expecting.

1. Select the dropdown menu next to the input you just added to open the input's property (name and value field).

1. Enter `JobInputType` in the **Name** field to indicate the type of input you're creating.

1. Enter `UriFolder` in the **Value** field to indicate that the input is a folder path. Other supported values for this field are **UriFile** (a file path) or **Literal** (any literal value like string or integer). You need to use the right type that your deployment expects.

1. Select the plus sign next to the property to add another property for this input.

1. Enter `Uri` in the **Name** field to indicate the path to the data.

1. Enter `azureml://datastores/trusted_blob/datasets/uci-heart-unlabeled`, the path to locate the data, in the **Value** field. Here, you use a path that leads to the storage account that is both linked to OneLake in Fabric and to Azure Machine Learning. **azureml://datastores/trusted_blob/datasets/uci-heart-unlabeled** is the path to CSV files with the expected input data for the model that is deployed to the batch endpoint. You can also use a direct path to the storage account, such as `https://<storage-account>.dfs.azure.com`.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-configure-inputs.png" alt-text="A screenshot showing how to configure inputs in the endpoint.":::

    > [!TIP]
    > If your input is of type **Literal**, replace the property `Uri` by `Value``.

If your endpoint requires more inputs, repeat the previous steps for each of them. In this example, model deployments require exactly one input.

#### Configure the output section

Configure the **Job outputs** section as follows:

1. Expand the **Job outputs** section.

1. Select **New** to add a new output to your endpoint.

1. Name the output `output_data`. Since you're using a model deployment, you can use any name. For pipeline deployments, however, you need to indicate the exact name of the output that your model is generating.

1. Select the dropdown menu next to the output you just added to open the output's property (name and value field).

1. Enter `JobOutputType` in the **Name** field to indicate the type of output you're creating.

1. Enter `UriFile` in the **Value** field to indicate that the output is a file path. The other supported value for this field is **UriFolder** (a folder path). Unlike the job input section, **Literal** (any literal value like string or integer) **isn't** supported as an output.

1. Select the plus sign next to the property to add another property for this output.

1. Enter `Uri` in the **Name** field to indicate the path to the data.

1. Enter `@concat(@concat('azureml://datastores/trusted_blob/paths/endpoints', pipeline().RunId, 'predictions.csv')`, the path to where the output should be placed, in the **Value** field. Azure Machine Learning batch endpoints only support use of data store paths as outputs. Since outputs need to be unique to avoid conflicts, you've used a dynamic expression, `@concat(@concat('azureml://datastores/trusted_blob/paths/endpoints', pipeline().RunId, 'predictions.csv')`, to construct the path.

    :::image type="content" source="./media/how-to-use-batch-fabric/fabric-pipeline-configure-outputs.png" alt-text="A screenshot showing how to configure outputs in the endpoint":::

If your endpoint returns more outputs, repeat the previous steps for each of them. In this example, model deployments produce exactly one output.

### (Optional) Configure the job settings

You can also configure the **Job settings** by adding the following properties:

__For model deployments__:

| Setting | Description |
|:----|:----|
|`MiniBatchSize`|The size of the batch.|
|`ComputeInstanceCount`|The number of compute instances to ask from the deployment.|

__For pipeline deployments__:

| Setting | Description |
|:----|:----|
|`ContinueOnStepFailure`|Indicates if the pipeline should stop processing nodes after a failure.|
|`DefaultDatastore`|Indicates the default data store to use for outputs.|
|`ForceRun`|Indicates if the pipeline should force all the components to run even if the output can be inferred from a previous run.|

Once configured, you can test the pipeline.

## Related links

* [Use low priority VMs in batch deployments](how-to-use-low-priority-batch.md)
* [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md)
* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
