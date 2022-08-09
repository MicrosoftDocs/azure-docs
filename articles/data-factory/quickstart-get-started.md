---
title: Get started with Azure Data Factory
description: Get started with your first data factory demo to copy data from one blob storage to another.
author: pennyzhou-msft
ms.service: data-factory
ms.subservice: data-movement
ms.devlang: bicep
ms.topic: quickstart
ms.date: 08/08/2022
ms.author: xupzhou
ms.custom: subject-armqs
---

# Quickstart: Get started with Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
> * [Current version](quickstart-create-data-factory-rest-api.md)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This getting started article aims to let you start your first data factory demo within 5 minutes.  With one click, everything for your first demo will be created and configured.  Then you only need to navigate to your demo data factory and make one more click to trigger the created activity, to move data from one Azure blob storage to another.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Try your first demo with one click

Your first demo scenario:  Use the [Copy activity](copy-activity-overview.md) in a data factory to copy an Azure blob named moviesDB2.csv from an input folder on an Azure Blob Storage to an output folder.

The one-click button will use this ARM template code.  After clicking the button, the following objects will be created in Azure:
- A data factory account
- A pipeline within the data factory with one copy activity
- An Azure blob storage with moviesDB2.csv uploaded into an input folder as source
- A linked service to connect the data factory to the Azure blob storage

## Step 1: Click the button to start

Select the button below to be redirected to the custom deployment configuration page to deploy this template.  Here you only need to create a **new resource group** where all of the objects referenced above will be created.  You can leave the other values with their defaults.  Then click **Review + create** and click **Create** to start.

[![Try your first data factory demo](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-v2-blob-to-blob-copy%2Fazuredeploy.json)

:::image type="content" source="media/quickstart-get-started/deploy-template.png" alt-text="A screenshot of the deployment template creation dialog.":::

## Step 2: Review deployed resources

1. Select **Go to resource group** after your deployment is complete.
   :::image type="content" source="media/quickstart-get-started/deployment-complete.png" alt-text="A screenshot of the deployment complete page in the Azure portal after successfully deploying the template.":::

1. In the resource group, you will find a new data factory, Azure blob storage account, and managed identity.
   :::image type="content" source="media/quickstart-get-started/resource-group-contents.png" alt-text="A screenshot of the contents of the resource group created for the demo.":::

1. Select the data factory in the resource group and then select the **Open Azure Data Factory Studio** button to continue.
   :::image type="content" source="media/quickstart-get-started/open-data-factory-studio.png" alt-text="A screenshot of the Azure portal on the newly created data factory page, highlighting the location of the Open Azure Data Factory Studio button.":::

1. Click on the **Author** tab <img src="media/quickstart-get-started/author-button.png" alt="Author tab"/> and select the **Pipeline** created by the template.  Then check the source data by clicking **Open**.
   :::image type="content" source="media/quickstart-get-started/view-pipeline.png" alt-text="Screenshot of the Azure Data Factory Studio showing the pipeline created by the template.":::

   In the source dataset, click **Browse**, and you can see the moviesDB2.csv file has been uploaded into the input folder already.

   :::image type="content" source="media/quickstart-get-started/source-dataset-browse.png" alt-text="Screenshot of the source dataset highlighting the Browse button where the user can see the input file created for the demo.":::

   :::image type="content" source="media/quickstart-get-started/input-contents.png" alt-text="Screenshot of the contents of the input folder showing the moviesDB2.csv file used in the demo.":::

## Step 3: Trigger the pipeline to run

1. Select **Add Trigger**, and then **Trigger Now**.
   :::image type="content" source="media/quickstart-get-started/trigger-now.png" alt-text="Screenshot of the Trigger Now button for the pipeline in the demo.":::
1. In the right pane under **Pipeline run**, select **OK**.

## Monitor the pipeline

1. Select the **Monitor** tab <img src="media/quickstart-get-started/monitor-button.png" alt="Monitor tab"/>.
1. You see the activity runs associated with the pipeline run.  In this quickstart, the pipeline has only one activity of type: Copy.  As such, you see a run for that activity.

## Verify the output file

The pipeline automatically creates an output folder in the blob container.  Then it simply copies the moviesDB2.csv from the input folder to the output folder.

1. Navigate to Azure portal for the storage account that was created in the resource group shown above, and find the **Containers** page.  If necessary, select **Refresh** to see the created output folder.
1. Select the **output** folder.
1. Confirm that **moviesDB2.csv** is copied to the output folder.
   :::image type="content" source="media/quickstart-get-started/output-file.png" alt-text="Screenshot of the blob storage output folder and moviesDB2.csv created by the copy activity in the demo.":::

## Clean up resources

You can clean up all the resources you created in this quickstart in two ways.  You can [delete the entire Azure resource group](../azure-resource-manager/management/delete-resource-group.md), which includes all the resources created in it.  Or if you want to keep other resources intact, delete only the data factory you created in this tutorial.

Deleting a resource group deletes all the resources, including data factories, created within it.  Run the following command to delete the entire resource group:

```azurepowershell-interactive
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

If you want to delete just the data factory, and not the entire resource group, run the following command:

```azurepowershell-interactive
Remove-AzDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Next Steps

In this quickstart, you created an Azure Data Factory using an Azure Resource Manager (ARM) template and validated the deployment.  To learn more about Azure Data Factory and ARM, continue on to the articles below.

- Browse all of the [Azure Data Factory documentation](./index.yml).
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md).
- Get other [Azure Data Factory ARM templates](/resources/templates/?resourceType=Microsoft.Datafactory&pageNumber=1&sort=Popular).
