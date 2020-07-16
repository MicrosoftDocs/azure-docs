---
title: Create an Azure Data Factory using an ARM template
description: Create a sample Azure Data Factory pipeline using an Azure Resource Manager template.
services: data-factory
ms.service: data-factory
tags: azure-resource-manager
ms.workload: data-services
author: djpmsft
ms.author: daperlov
ms.reviewer: maghan, jingwang
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 07/16/2020
---

# Quickstart: Create an Azure Data Factory using Azure Resource Manager template

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-build-your-first-pipeline-using-arm.md)
> * [Current version](quickstart-create-data-factory-resource-manager-template.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use an Azure Resource Manager template to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

## Prerequisites

Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Create a file

Open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

```emp.txt
John, Doe
Jane, Doe
```

Save the file in the **C:\ADFv2QuickStartPSH** folder. (If the folder doesn't already exist, create it.)

## Create an Azure Data Factory

### Review template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-data-factory-v2-blob-to-blob-copy/).

:::code language="json" source="~/quickstart-templates/101-data-factory-v2-blob-to-blob-copy/azuredeploy.json":::

There are Azure resources defined in the template:
- [Microsoft.DataFactory/factories](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories): Create an Azure Data Factory.
- [Microsoft.DataFactory/factories/linkedServices](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/linkedservices): Create an Azure Data Factory linked service.
- [Microsoft.DataFactory/factories/datasets](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/datasets): Create an Azure Data Factory dataset.
- [Microsoft.DataFactory/factories/pipelines](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/pipelines): Create an Azure Data Factory pipeline.

More Azure Data Factory template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Documentdb).

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Data Factory account, a storage account, and a blob container.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-data-factory-v2-blob-to-blob-copy%2Fazuredeploy.json)

2. Select or enter the following values.

   :::image type="content" source="./media/quick-create-template/create-cosmosdb-using-template-portal.png" alt-text="ARM template, Azure Cosmos DB integration, deploy portal":::

    Unless it is specified, use the default values to create the Azure Data Factory resources.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location.  For example, **Central US**.
    * **Account Name**: enter a name for the Azure Cosmos account. It must be globally unique.
    * **Location**: enter a location where you want to create your Azure Cosmos account. The Azure Cosmos account can be in the same location as the resource group.
    * **Primary Region**: The primary replica region for the Azure Cosmos account.
    * **Secondary region**: The secondary replica region for the Azure Cosmos account.
    * **Default Consistency Level**: The default consistency level for the Azure Cosmos account.
    * **Max Staleness Prefix**: Max stale requests. Required for BoundedStaleness.
    * **Max Interval in Seconds**: Max lag time. Required for BoundedStaleness.
    * **Database Name**: The name of the Azure Cosmos database.
    * **Container Name**: The name of the Azure Cosmos container.
    * **Throughput**:  The throughput for the container, minimum throughput value is 400 RU/s.
    * **I agree to the terms and conditions state above**: Select.


## Review deployed resources

1. Login to the [Azure portal](https://portal.azure.com/).

2. Select **All services**, search with the keyword **storage**, and select **Storage accounts**.
    1. On the **Storage account** page, select the storage account you created.
        1. The storage account name is in the format - storage<uniqueid>.

3. While on the  **Storage accounts** page, select **Containers**.
    1. On the **Containers** page, select the blob container you created.
        1. The storage account name is in the format - blob<uniqueid>.

4. Select **All services**, search with the keyword such as **data fa**, and select **Data factories**.
    1. On the **Data Factories** page, select the data factory you created.
        1. data factory name is in the format - datafactory<uniqueid>.

### Upload a file

1. On the **Upload blob** page, select **Upload**.
2. In te right pane, select the **Files** box, and then browse to and select the **emp.txt** file that you created earlier.
3. Expand the **Advanced** heading.
    1. ![Select Advanced link](media/data-factory-quickstart-prerequisites/upload-blob-advanced.png)
4. In the **Upload to folder** box, enter **input**.
5. Select the **Upload** button. You should see the **emp.txt** file and the status of the upload in the list.
6. Select the **Close** icon (an **X**) to close the **Upload blob** page.

Keep the container page open. You use it to verify the output at the end of this quickstart.

### Initiate Trigger

1. While on the Data factory page, select the **Author & Monitor** tile.

2. Select the **Author** tab.

3. Select the pipeline created - ArmtemplateSampleCopyPipeline.

4. Select **Add Trigger** > **Trigger Now**.

5. In the right pane under **Pipeline run**, select **OK**.

### Monitor

1. Select the **Monitor** tab. 
    ![Monitor pipeline run](media/doc-common-process/get-started-page-monitor-button.png)

    > [!IMPORTANT]
    > You see pipeline runs only at the hour clock (for example: 4 AM, 5 AM, 6 AM, etc.). Select **Refresh** on the toolbar to refresh the list when the time reaches the next hour.

2. Select the **View Activity Runs** link in the **Actions** column.

    ![Pipeline actions link](media/quickstart-create-data-factory-resource-manager-template/pipeline-actions-link.png)

3. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline has only one activity of type: Copy. Therefore, you see a run for that activity.

    ![Activity runs](media/quickstart-create-data-factory-resource-manager-template/activity-runs.png)

4. Select the **Output** link under Actions column. You see the output from the copy operation in an **Output** window. Select the maximize button to see the full output. You can close the maximized output window or close it.

### Verify the output file

The pipeline automatically creates the output folder in the blob container. Then, it copies the emp.txt file from the input folder to the output folder. 

1. In the Azure portal, on the container page, select **Refresh** to see the output folder. 
    
    ![Refresh](media/data-factory-quickstart-verify-output-cleanup/output-refresh.png)

2. Select **output** in the folder list.

3. Confirm that the **emp.txt** is copied to the output folder. 

    ![Refresh](media/data-factory-quickstart-verify-output-cleanup/output-file.png)

## Clean up resources

You can clean up the resources that you created in the Quickstart in two ways. You can delete the [Azure resource group](../articles/azure-resource-manager/management/overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the data factory you created in this tutorial.

Deleting a resource group deletes all resources including data factories in it. Run the following command to delete the entire resource group: 

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

> [!Note]
> Dropping a resource group may take some time. Please be patient with the process

If you want to delete just the data factory, not the entire resource group, run the following command: 

```powershell
Remove-AzDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Next steps

In this quickstart, you created an Azure Data Factory using an Azure Resource Manager template and validated the deployment. To learn more about Azure Data Factory and Azure Resource Manager, continue on to the articles below.

- [Azure Data Factory documentation](index.yml)
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)
- Get other [Azure Data Factory Resource Manager templates](https://azure.microsoft.com/resources/templates/)