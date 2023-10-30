---
title: "Consume models deployed in Azure Machine Learning from Fabric using Batch Endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to deploy a machine learning model in batch endpoints to then consume it from within Fabric
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

# Run Azure Machine Learning models from Fabric using Batch Endpoints

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

In this article, you learn how to consume Azure Machine Learning batch deployments from Microsoft Fabric. Although this article focuses on model deployment to a batch endpoint, the workflow also supports batch pipeline deployment if you need to consume Azure Machine Learning pipelines from Fabric.

## Prerequisites

- Get a [Microsoft Fabric subscription](/fabric/enterprise/licenses). Or sign up for a free [Microsoft Fabric trial](/fabric/get-started/fabric-trial.md).
- Sign in to Microsoft Fabric.
- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](../how-to-manage-workspace.md) to create one.
    - Ensure you have the following permissions in the workspace:
        - Create/manage batch endpoints and deployments: Use roles Owner, contributor, or custom role allowing `Microsoft.MachineLearningServices/workspaces/batchEndpoints/*`.
        - Create ARM deployments in the workspace resource group: Use roles Owner, contributor, or custom role allowing `Microsoft.Resources/deployments/write` in the resource group where the workspace is deployed.
- A model deployed to a batch endpoint. If you don't have one, use the steps in [Deploy models for scoring in batch endpoints](how-to-use-batch-model-deployments.md) to create one.

<!-- * Switch to the Data Science experience by using the experience switcher icon on the left side of your home page.

   :::image type="content" source="../media/tutorial-data-science-prepare-system/switch-to-data-science.png" alt-text="Screenshot of the experience switcher menu, showing where to select Data Science." lightbox="../media/tutorial-data-science-prepare-system/switch-to-data-science.png"::: -->

## Architecture

Azure Machine Learning can't directly access data that's stored in Fabric's [OneLake](/fabric/onelake/onelake-overview). However, you can use OneLake's capability to create shortcuts within a Lakehouse to read and write data that's stored in [Azure Data Lake Gen2](/azure/storage/blobs/data-lake-storage-introduction). Since Azure Machine Learning supports Azure Data Lake Gen2 storage, this setup allows you to use Fabric and Azure Machine Learning together. The data architecture is as follows:

:::image type="content" source="./media/how-to-use-fabric/fabric-azureml-data-architecture.png" alt-text="A diagram showing how Azure Storage accounts are used to connect Fabric with Azure Machine Learning." lightbox="media/how-to-use-fabric/fabric-azureml-data-architecture.png":::

## Configure data access

To allow Fabric and Azure Machine Learning to read and write the same data without having to copy it, you can take advantage of [OneLake shortcuts](/fabric/onelake/onelake-shortcuts) and [Azure Machine Learning datastores](concept-data.md#datastore). By pointing a OneLake shortcut and a datastore to the same storage account, you can ensure that both Fabric and Azure Machine Learning read from and write to the same underlying data.

In the next sections you create or identify a storage account that you want to use to store the information that the batch endpoint will consume and that Fabric users will see in OneLake. Fabric only supports storage accounts with hierarchical names enabled, such as Azure Data Lake Gen2.

#### Create a OneLake shortcut to the storage account

1. Go to  your Fabric workspace.
1. Open the lakehouse you want to use to configure the connection. If you don't have a lakehouse already, go to the **Data Engineering** experience to [create a lakehouse](/fabric/data-engineering/create-lakehouse). In this example you use a lakehouse named **trusted**.
1. In the left-side navigation bar, select the three dots next to **Files**, and then select **New shortcut** to bring up the wizard.

    :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut.png" alt-text="A screenshot showing how to create a new shortcut in a lakehouse." lightbox="media/how-to-use-fabric/fabric-lakehouse-new-shortcut.png":::

1. Select the option **Azure Data Lake Storage Gen2**.

    :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut-type.png" alt-text="A screenshot showing how to create an Azure Data Lake Storage Gen2 shortcut." lightbox="media/how-to-use-fabric/fabric-lakehouse-new-shortcut-type.png":::

1. In the **Connection settings** section, paste the URL associated with the Azure Data Lake Gen2 storage account.

        :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut-url.png" alt-text="A screenshot showing how to configure the URL of the shortcut." lightbox="media/how-to-use-fabric/fabric-lakehouse-new-shortcut-url.png":::

1. In the section **Connection credentials** section:
    1. For **Connection**, select **Create new connection**.
    1. For **Connection name** keep the default populated value.
    1. For **Authentication kind**, select **Organizational account** to use the credentials of the connected user via OAuth 2.0.
    1. Select **Sign in** to sign in.

1. Select **Next**.

1. Configure the path to the shortcut, relative to the storage account, if needed. Use this setting to configure the folder where the shortcut will point to.

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
        > Why configure **Azure Blob Storage** instead of **Azure Data Lake Gen2**? Batch Endpoints can only write predictions to Blob Storage accounts. However, every Azure Data Lake Gen2 storage account is also a blob storage account and hence they can be used interchangeably.

    1. Select the storage account from the wizard, using the **Subscription ID**, **Storage account**, and **Blob container** (file system).
    
        :::image type="content" source="./media/how-to-use-fabric/azureml-store-create-blob.png" alt-text="A screenshot showing how to configure the Azure Machine Learning data store."::: 

    1. Select **Create**.

1. Ensure that the compute where the batch endpoint is running has permissions to mount the data in this storage account. Even though access is still granted by the identity that invokes the endpoint, the compute where the batch endpoint runs needs to have permission to mount the storage account that you provide. For more information, see [Accessing storage services](how-to-identity-based-service-authentication.md#accessing-storage-services).

#### Upload sample dataset

Upload some sample data for the endpoint to use as input:

1. Go to your Fabric workspace.
1. Go to the lakehouse where you created the shortcut.
1. Go to the **datasets** shortcut.
1. Create a folder to store the sample dataset you want to score. In this case *uci-heart-unlabeled*.

1. Use the **Get data** option and select **Upload files** to upload the sample dataset.

    :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-get-data.png" alt-text="A screenshot showing how to upload data to an existing folder in OneLake." lightbox="media/how-to-use-fabric/fabric-lakehouse-get-data.png":::

1. Upload the sample dataset.

    :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-upload-data.png" alt-text="A screenshot showing how to upload a file to OneLake." lightbox="media/how-to-use-fabric/fabric-lakehouse-upload-data.png":::

1. The sample file is ready to be consumed. Take note of the path where you've saved it.

## Create Fabric-batch inferencing pipeline

To create this pipeline in your existing Fabric workspace and invoke batch endpoints, follow these steps:

1. Open Fabric workspace and select the **Data Engineering** experience from the experience selector in the lower left corner.

1. Click on **New** and then select **Pipeline**.

1. On the designer canvas, in the tool bar, select the tab **Activities**, go to the three dots at the end of the tab and then select **Azure Machine Learning**.

    :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-add-activity.png" alt-text="A screenshot showing how to add the activity Azure Machine Learning to a pipeline.":::

1. Go to the tab **Settings** and configure the activity as follows:

    1. In the section **Azure Machine Learning connection**, create a new connection to the **Azure Machine Learning** workspace your endpoint is deployed to by selecting the option **New**.

        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-add-connection.png" alt-text="A screenshot of the configuration section of the activity showing how to create a new connection.":::

    1. On the creation wizard, on **Connection settings**, indicate the subscription ID, resource group name, and workspace name, where you endpoints are deployed to.

        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-add-connection-ws.png" alt-text="A screenshot showing examples of the values for  subscription ID, resource group name, and workspace name.":::

    1. Select an appropiate **Authentication kind** for your connection. You can use **Organizational account** (the credentials of the connected user) or **Service principal**. In production settings we recommend to use a **Service principal**. Regardless of the authentication type, ensure the identity associated with the connection has the rights to call the batch endpoint you deployed. 

        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-add-connection-credentials.png" alt-text="A screenshot showing how to configure the authentication mechanism in the connection.":::

    1. Save the connection.

1. Once the connection is selected, Fabric automatically populates the available batch endpoints in the selected workspace. Select the batch endpoint you want to call. In this example, we select **heart-classifier-...**. 

    :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-configure-endpoint.png" alt-text="A screenshot showing how to select an endpoint once a connection is configured.":::

1. The section **Deployments** automatically populates with the available deployments under the endpoint. If you don't select a deployment, Fabric will invoke the **Default** deployment under the endpoint allowing the batch endpoint creator to decide which deployment is called. In most scenarios, you want to leave use such behavior. However, you can select an specific deployment from the list if needed.

    :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-configure-deployment.png" alt-text="A screenshot showing how to configure the endpoint to use the default deployment.":::

## Configure the inputs and outputs from the batch endpoint

1. Now, it's time to configure inputs and outputs from the batch endpoint. **Inputs** are used by batch endpoints to supply data and parameters needed to run the process. The Azure Machine Learning Fabric's activity support both [Model deployments]() and [Pipeline deployments](). Depending on the type of deployment, the number and type of the inputs that need to be indicated. If you are not familiar with Batch Endpoints inputs and outputs we recommend to read [Understanding inputs and outputs in Batch Endpoints](how-to-access-data-batch-endpoints-jobs.md#understanding-inputs-and-outputs). In this example, we have deployed a model deployment which requires exactly one input and produces one output. 

#### Configure the input section

1. Configure the input section as follows:

    1. Click on **New** to add a new input to your endpoints.

    1. Give a name to the input. Since this is a model deployment, any name can be used. On pipeline deployments, however, you may need to indicate the exact name of the input your model is expecting to.

    1. Click on the plus sign to add a new property for this input.

    1. In the first field, asking for the name of the property, type **JobInputType**, which indicated the type of the input you are creating.
    
    1. In the second field, asking for the value of the property, type **UriFolder**, which indicates that the type of input is of type **Folder**. Supported values here are **UriFolder** (a folder path), **UriFile** (a file path), or **Literal** (any literal value like string, integers, etc). You need to use the right type your deployment is expecting to.

    1. Click on the plus sign again to add a new property for this input.

    1. In the first field, asking for the name of the property, type **Uri**, which indicated the path to the data.

    1. In the second field, asking for the value of the property, type the path to locate the data. Here we want to add a path that leads to the Storage Account that is both linked to OneLake in Fabric and to Azure Machine Learning. In this example, we will use the value **azureml://datastores/trusted_blob/datasets/uci-heart-unlabeled** which has the path to CSV files with the expected input data for the model we have deployed. You can also use directly a path to the Storage Account like `https://<storage-account>.dfs.azure.com``.
    
        > [!TIP]
        > If you input is of type **Literal**, replace the property **Uri** by **Value**.

    1. Your input section will look as follows:
    
        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-configure-inputs.png" alt-text="A screenshot showing how to configure inputs in the endpoint.":::

1. If your endpoint requires more inputs, repeat this process for each of them. In our example, model deployments require exactly one input.

#### Configure the input section

1. Configure the output section as follows:

    1. Click on **New** to add a new output to your endpoints.

    1. Give a name to the output. Since this is a model deployment, any name can be used. On pipeline deployments, however, you may need to indicate the exact name of the output your model is generating.

    1. Click on the plus sign to add a new property for this output.

    1. In the first field, asking for the name of the property, type **JobOutputType**, which indicated the type of the output you are creating.
    
    1. In the second field, asking for the value of the property, type **UriFile**, which indicates that the type of output is of type **File**. Supported values here are **UriFolder** (a folder path) or **UriFile** (a file path). **Literal** (any literal value like string, integers, etc) is not supported as an output.

    1. Click on the plus sign again to add a new property for this output.

    1. In the first field, asking for the name of the property, type **Uri**, which indicated the path to the data.

    1. In the second field, asking for the value of the property, type the path to where the output has to be placed. Azure Machine Learning Batch Endpoints only supports using data store paths as outputs. Since outputs need to be unique to avoid already existing conflicts, we are using a dynamic expression to construct the path using the following value: `@concat(@concat('azureml://datastores/trusted_blob/paths/endpoints', pipeline().RunId, 'predictions.csv')`. 
    
    1. Your output section will look as follows:
        
        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-configure-outputs.png" alt-text="A screenshot showing how to configure outputs in the endpoint":::

1. If your endpoint produces more outputs, repeat this process for each of them. In our example, model deployments produce exactly one output.

1. Optionally, you can configure the section **Job settings**. You can add the following properties:

    <table>
        <tbody>
            <tr>
                <tdrowspan=2>For model deployments</td>
                <td>`MiniBatchSize`</td>
                <td>The size of the batch size</td>
            </tr>
            <tr>
                <td>`ComputeInstanceCount`</td>
                <td>The number of compute instances to ask from the deployment</td>
            </tr>
            <tr>
                <td rowspan=2>For pipeline deployments</td>
                <td>`ContinueOnStepFailure`</td>
                <td>Indicates if the pipeline should stop processing nodes after a failure.</td>
            </tr>
            <tr>
                <td>`DefaultDatastore`</td>
                <td>Indicates the default data store to use for outputs. </td>
            </tr>
            <tr>
                <td>`ForceRun`</td>
                <td>Indicates if the pipeline should force all the components to run even if when the output can be inferred from a previous run.</td>
            </tr>
        </tbody>
    </table>

1. Once configured, you can test the pipeline.


## Related links

* [Use low priority VMs in batch deployments](how-to-use-low-priority-batch.md)
* [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md)
* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
