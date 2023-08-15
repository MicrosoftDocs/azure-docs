---
title: Create an Azure Data Factory using an Azure Resource Manager template (ARM template)
description: Create a sample Azure Data Factory pipeline using an Azure Resource Manager template (ARM template).
ms.service: data-factory
ms.subservice: tutorials
tags: azure-resource-manager
author: ssabat
ms.author: susabat
ms.reviewer: jburchel, jingwang
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 10/25/2022
---

# Quickstart: Create an Azure Data Factory using ARM template

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-build-your-first-pipeline-using-arm.md)
> * [Current version](quickstart-create-data-factory-resource-manager-template.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-v2-blob-to-blob-copy%2Fazuredeploy.json)

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Create a file

Open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

```emp.txt
John, Doe
Jane, Doe
```

Save the file in the **C:\ADFv2QuickStartPSH** folder. (If the folder doesn't already exist, create it.)

## Review template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Datafactory&pageNumber=1&sort=Popular).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.datafactory/data-factory-v2-blob-to-blob-copy/azuredeploy.json":::

There are Azure resources defined in the template:

- [Microsoft.Storage/storageAccounts](/azure/templates/Microsoft.Storage/storageAccounts): Defines a storage account.
- [Microsoft.DataFactory/factories](/azure/templates/microsoft.datafactory/factories): Create an Azure Data Factory.
- [Microsoft.DataFactory/factories/linkedServices](/azure/templates/microsoft.datafactory/factories/linkedservices): Create an Azure Data Factory linked service.
- [Microsoft.DataFactory/factories/datasets](/azure/templates/microsoft.datafactory/factories/datasets): Create an Azure Data Factory dataset.
- [Microsoft.DataFactory/factories/pipelines](/azure/templates/microsoft.datafactory/factories/pipelines): Create an Azure Data Factory pipeline.

More Azure Data Factory template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Datafactory&pageNumber=1&sort=Popular).

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Data Factory account, a storage account, and a blob container.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-v2-blob-to-blob-copy%2Fazuredeploy.json)

2. Select or enter the following values.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-deploy-arm-template.png" alt-text="Deploy ADF ARM template":::

    Unless it's specified, use the default values to create the Azure Data Factory resources:

    - **Subscription**: Select an Azure subscription.
    - **Resource group**: Select **Create new**, enter a unique name for the resource group, and then select **OK**.
    - **Region**: Select a location.  For example, *East US*.
    - **Data Factory Name**: Use  default value.
    - **Location**: Use default value.
    - **Storage Account Name**: Use default value.
    - **Blob Container**: Use default value.

## Review deployed resources

1. Select **Go to resource group**.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-go-to-resource-group.png" alt-text="Resource Group":::

2.  Verify your Azure Data Factory is created.
    1. Your Azure Data Factory name is in the format - datafactory\<uniqueid\>.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-sample.png" alt-text="Sample Data Factory":::

2. Verify your storage account is created.
    1. The storage account name is in the format - storage\<uniqueid\>.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-storage-account.png" alt-text="Storage Account":::

3. Select the storage account created and then select **Containers**.
    1. On the **Containers** page, select the blob container you created.
        1. The blob container name is in the format - blob\<uniqueid\>.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-blob-container.png" alt-text="Blob container":::

### Upload a file

1. On the **Containers** page, select **Upload**.

2. In te right pane, select the **Files** box, and then browse to and select the **emp.txt** file that you created earlier.

3. Expand the **Advanced** heading.

4. In the **Upload to folder** box, enter *input*.

5. Select the **Upload** button. You should see the **emp.txt** file and the status of the upload in the list.

6. Select the **Close** icon (an **X**) to close the **Upload blob** page.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-upload-blob-file.png" alt-text="Upload file to input folder":::

Keep the container page open, because you can use it to verify the output at the end of this quickstart.

### Start Trigger

1. Navigate to the **Data factories** page, and select the data factory you created.

2. Select **Open** on the **Open Azure Data Factory Studio** tile.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-open-tile.png" alt-text="Author & Monitor":::

2. Select the **Author** tab :::image type="icon" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-author.png" border="false":::.

3. Select the pipeline created - ArmtemplateSampleCopyPipeline.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-pipelines.png" alt-text="ARM template pipeline":::

4. Select **Add Trigger** > **Trigger Now**.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-trigger-now.png" alt-text="Trigger":::

5. In the right pane under **Pipeline run**, select **OK**.

### Monitor the pipeline

1. Select the **Monitor** tab :::image type="icon" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-monitor.png" border="false":::.

2. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline has only one activity of type: Copy. As such, you see a run for that activity.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-successful-run.png" alt-text="Successful run":::

### Verify the output file

The pipeline automatically creates an output folder in the blob container. Then, it copies the emp.txt file from the input folder to the output folder.

1. In the Azure portal, on the **Containers** page, select **Refresh** to see the output folder.

2. Select **output** in the folder list.

3. Confirm that the **emp.txt** is copied to the output folder.

    :::image type="content" source="media/quickstart-create-data-factory-resource-manager-template/data-factory-arm-template-output.png" alt-text="Output":::

## Clean up resources

You can clean up the resources that you created in the Quickstart in two ways. You can [delete the Azure resource group](../azure-resource-manager/management/delete-resource-group.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the data factory you created in this tutorial.

Deleting a resource group deletes all resources including data factories in it. Run the following command to delete the entire resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

If you want to delete just the data factory, and not the entire resource group, run the following command:

```azurepowershell-interactive
Remove-AzDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Next steps

In this quickstart, you created an Azure Data Factory using an ARM template and validated the deployment. To learn more about Azure Data Factory and Azure Resource Manager, continue on to the articles below.

- [Azure Data Factory documentation](index.yml)
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)
- Get other [Azure Data Factory ARM templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Datafactory&pageNumber=1&sort=Popular)
