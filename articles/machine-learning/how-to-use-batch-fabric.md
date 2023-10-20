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

# Consume models deployed in Azure Machine Learning from Fabric using Batch Endpoints

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Microsoft Fabric provides a one-stop shop for all the analytical needs for every enterprise. It covers a complete spectrum of services including data movement, data lake, data engineering, data integration and data science, real time analytics, and business intelligence. Fabric brings the best of multiple products together into a unified experience which makes it an excellent choice to integrate Azure Machine Learning workloads in the enterprise.

In this tutorial, you learn how you can deploy Azure Machine Learning models in Batch Endpoints and consume them from Fabric using the **Azure Machine Learning** activity in Fabric.

> [!TIP]
> Although this tutorials mentions deploying a model to batch endpoint (a.k.a. *model deployments*), *pipeline deployments* are also supported if you need to consume entire machine learning pipelines from within Fabric.

## Architecture

Azure Machine Learning can't access data stored in OneLake directly momentarily. However, you can use OneLake Fabrics capability to create shortcuts within a Lakehouse to read and write data stored in Azure Data Lake Gen2. Since this kind of storage is supported by Azure Machine Learning, such setup allow users to use Fabric and Azure Machine Learning together. The general data architecture looks as follows:

:::image type="content" source="./media/how-to-use-fabric/fabric-azureml-data-architecture.png" alt-text="A diagram showing how Azure Storage accounts are used to connect Fabric with Azure Machine Learning.":::


## Configure data access

To allow Fabric and Azure Machine Learning to read and write the same data witout copying it, you can take advantage of shortcuts in OneLake and data stores in Azure Machine Learning. By pointing both of them to the same storage account, you will be able to ensure both products are reading and writing the same underlying data.

1. Create or identify an storage account that you want to use to store the information the batch endpoint will consume and that Fabric users will see in OneLake. Fabric only support Storage Accounts with hierarchical names enabled (a.k.a. Azure Data Lake Gen2).

1. In Fabric, create a shortcut to the Storage Account:

    1. Navigate to your Fabric workspace.

    1. Open the Lakehouse you want to use to configure the connection. If you don't have a Lakehouse created, go to the **Data Engineering** experience and create one. In this example we will use a Lakehouse named **trusted**.

    1. In the navigation bar on the left, select the three dots next to **Files** and select the option **New shortcut**.

        :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut.png" alt-text="An screenshot showing how to create a new shortcut in a Lakehouse":::

    1. A wizard will appear. Select the option **Azure Data Lake Storage Gen2**.
        
        :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut-type.png" alt-text="A screenshot showing how to create an Azure Data Lake Storage Gen2 shortcut":::

    1. On the section **Connection settings**, paste the **URL** associated with the Azure Data Lake Gen2 storage account.

         :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-new-shortcut-url.png" alt-text="A screenshot showing how to configure the URL of the shortcut.":::

    1. On the section **Connection credentials**, create a new connection either using one of the supported methods. In this case, we are using **Organizational account** which uses the credentials of the connected user via OAuth 2.0.
    
    1. Click on **Next**.

    1. Configure the path to the shortcut relative to the Storage Account, if needed. Use this settings to configure the folder where the shortcut will point to.

    1. Configure the **Name** of the shortcut. This name will be a path inside of the Lakehouse. In this example we will name the shortcut **datasets**.

    1. Save the changes.

1. In Azure Machine Learning, create a new data store pointing to the Storage Account:

    1. Navigate to your Azure Machine Learning workspace.

    1. Go to the section **Data**.

    1. Select the tab **Data stores** and click on **Create**. 

    1. Configure the store as follows:

        1. Give the store a name. In this example we name the store **trusted_blob**.

        1. On **Datastore type** select **Azure Blob Storage**.
            
            > [!TIP]
            > Why configuring **Azure Blob Storage** instead of **Azure Data Lake Gen2**? Batch Endpoints can only write predictions to Blob Storage accounts by the moment. However, every Azure Data Lake Gen2 storage account is also a blob storage account and hence they can be used interchangably.

        1. Select the Storage Account from the wizard using the **Subscription ID**, **Storage account**, and **Blob container** (file system).
        
            :::image type="content" source="./media/how-to-use-fabric/azureml-store-create-blob.png" alt-text="A screenshot showing how to configure the Azure Machine Learning data store."::: 

        1. Click on create.

1. Ensure the compute where the batch endpoint is running has permissions to mount the data in this storage account. Notice that access is still granted by the identity that invokes the endpoint. However, the compute where the batch endpoint runs needs to have permission to mount the storage account you provide. See [Accessing storage services](how-to-identity-based-service-authentication.md#accessing-storage-services) for details.

1. Upload some sample data for the endpoint to use as input:

    1. Navigate to your Fabric workspace.

    1. Navigate to the Lakehouse where the shortcut was created.

    1. Navigate to the shortcut, in our case, **datasets**.

    1. Create one folder to store our sample dataset we want to score. In this case **uci-heart-unlabeled**.

    1. Use the option **Get data** and select upload files to upload the sample dataset.
    
        :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-get-data.png" alt-text="A screenshot showing how to upload data to an existing folder in OneLake.":::

    1. Upload the sample dataset.
    
        :::image type="content" source="./media/how-to-use-fabric/fabric-lakehouse-upload-data.png" alt-text="A screenshot showing how to upload a file to OneLake.":::

    1. The sample file is ready to be consumed. Take note of the path where you have save it.

## Steps

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

1. Now, it's time to configure inputs and outputs from the batch endpoint. **Inputs** are used by batch endpoints to supply data and parameters needed to run the process. The Azure Machine Learning Fabric's activity support both [Model deployments]() and [Pipeline deployments](). Depending on the type of deployment, the number and type of the inputs that need to be indicated. If you are not familiar with Batch Endpoints inputs and outputs we recommend to read [Understanding inputs and outputs in Batch Endpoints](how-to-access-data-batch-endpoints-jobs.md#understanding-inputs-and-outputs). In this example, we have deployed a model deployment which requires exactly one input and produces one output. 

1. Configure the input section as follows:

    1. Click on **New** to add a new input to your endpoints.

    1. Give a name to the input. Since this is a model deployment, any name can be used. On pipeline deployments, however, you may need to indicate the exact name of the input your model is expecting to.

    1. Click on the plus sign to add a new property for this input.

    1. In the first field, asking for the name of the property, type **JobInputType**, which indicated the type of the input you are creating.
    
    1. In the second field, asking for the value of the property, type **UriFolder**, which indicates that the type of input is of type **Folder**. Supported values here are **UriFolder** (a folder path), **UriFile** (a file path), or **Literal** (any literal value like string, integers, etc). You need to use the right type your deployment is expecting to.

    1. Click on the plus sign again to add a new property for this input.

    1. In the first field, asking for the name of the property, type **Uri**, which indicated the path to the data.

    1. In the second field, asking for the value of the property, type the path to locate the data. Here we want to add a path that leads to the Storage Account that is both linked to OneLake in Fabric and to Azure Machine Learning. In this example, we will use the value **azureml://datastores/trusted_blob/datasets/uci-heart-unlabeled** which has the path to CSV files with the expected input data for the model we have deployed. You can also use directly a path to the Storage Account like "https://<storage-account>.dfs.azure.com".
    
        > [!TIP]
        > If you input is of type **Literal**, replace the property **Uri** by **Value**.

    1. Your input section will look as follows:
    
        :::image type="content" source="./media/how-to-use-fabric/fabric-pipeline-configure-inputs.png" alt-text="A screenshot showing how to configure inputs in the endpoint.":::

1. If your endpoint requires more inputs, repeat this process for each of them. In our example, model deployments require exactly one input.

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

    For model deployments:
    
    For pipeline deployments:

1. Your pipeline is ready to be used.

## Limitations



## Next steps

* [Use low priority VMs in batch deployments](how-to-use-low-priority-batch.md)
* [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md)
* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
