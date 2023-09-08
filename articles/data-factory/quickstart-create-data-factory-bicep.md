---
title: Create an Azure Data Factory using Bicep
description: Create a sample Azure Data Factory pipeline using Bicep.
ms.service: data-factory
ms.subservice: tutorials
tags: azure-resource-manager
author: jonburchel 
ms.author: jburchel 
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 08/10/2023
---

# Quickstart: Create an Azure Data Factory using Bicep

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use Bicep to create an Azure data factory. The pipeline you create in this data factory **copies** data from one folder to another folder in an Azure blob storage. For a tutorial on how to **transform** data using Azure Data Factory, see [Tutorial: Transform data using Spark](transform-data-using-spark.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

> [!NOTE]
> This article does not provide a detailed introduction of the Data Factory service. For an introduction to the Azure Data Factory service, see [Introduction to Azure Data Factory](introduction.md).

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/data-factory-v2-blob-to-blob-copy/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.datafactory/data-factory-v2-blob-to-blob-copy/main.bicep":::

There are several Azure resources defined in the Bicep file:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): Defines a storage account.
- [Microsoft.DataFactory/factories](/azure/templates/microsoft.datafactory/factories): Create an Azure Data Factory.
- [Microsoft.DataFactory/factories/linkedServices](/azure/templates/microsoft.datafactory/factories/linkedservices): Create an Azure Data Factory linked service.
- [Microsoft.DataFactory/factories/datasets](/azure/templates/microsoft.datafactory/factories/datasets): Create an Azure Data Factory dataset.
- [Microsoft.DataFactory/factories/pipelines](/azure/templates/microsoft.datafactory/factories/pipelines): Create an Azure Data Factory pipeline.

## Create a file

Open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

```emp.txt
John, Doe
Jane, Doe
```

Save the file locally. You'll use it later in the quickstart.

## Deploy the Bicep file

1. Save the Bicep file from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/data-factory-v2-blob-to-blob-copy/) as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure CLI or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

You can also use the Azure portal to review the deployed resources.

1. Sign in to the Azure portal.
1. Navigate to your resource group.
1. You'll see your resources listed. Select each resource to see an overview.

## Upload a file

Use the Azure portal to upload the **emp.txt** file.

1. Navigate to your resource group and select the storage account created. Then, select the **Containers** tab on the left panel.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-containers-bicep.png" alt-text="Containers tab":::

2. On the **Containers** page, select the blob container created. The name is in the format - blob\<uniqueid\>.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-bicep-blob-container.png" alt-text="Blob container":::

3. Select **Upload**, and then select the **Files** box icon in the right pane. Navigate to and select the **emp.txt** file that you created earlier.

4. Expand the **Advanced** heading.

5. In the **Upload to folder** box, enter *input*.

6. Select the **Upload** button. You should see the **emp.txt** file and the status of the upload in the list.

7. Select the **Close** icon (an **X**) to close the **Upload blob** page.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-bicep-upload-blob-file.png" alt-text="Upload file to input folder":::

Keep the container page open because you can use it to verify the output at the end of this quickstart.

## Start trigger

1. Navigate to the resource group page, and select the data factory you created.

2. Select **Open** on the **Open Azure Data Factory Studio** tile.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-open-tile-bicep.png" alt-text="Author & Monitor":::

3. Select the **Author** tab :::image type="icon" source="media/quickstart-create-data-factory-bicep/data-factory-author-bicep.png" border="false":::.

4. Select the pipeline created: **ArmtemplateSampleCopyPipeline**.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-bicep-pipelines.png" alt-text="Bicep pipeline":::

5. Select **Add Trigger** > **Trigger Now**.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-trigger-now-bicep.png" alt-text="Trigger":::

6. In the right pane under **Pipeline run**, select **OK**.

## Monitor the pipeline

1. Select the **Monitor** tab. :::image type="icon" source ="media/quickstart-create-data-factory-bicep/data-factory-monitor-bicep.png" border="false":::

2. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline only has one activity of type **Copy**. You should see a run for that activity.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-bicep-successful-run.png" alt-text="Successful run":::

## Verify the output file

The pipeline automatically creates an output folder in the blob container. It then copies the **emp.txt** file from the input folder to the output folder.

1. On the **Containers** page in the Azure portal, select **Refresh** to see the output folder.

2. Select **output** in the folder list.

3. Confirm that the **emp.txt** is copied to the output folder.

    :::image type="content" source="media/quickstart-create-data-factory-bicep/data-factory-bicep-output.png" alt-text="Output":::

## Clean up resources

When no longer needed, use the Azure CLI or Azure PowerShell to delete the resource group and all of its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

You can also use the Azure portal to delete the resource group.

1. In the Azure portal, navigate to your resource group.
1. Select **Delete resource group**.
1. A tab will appear. Enter the resource group name and select **Delete**.

## Next steps

In this quickstart, you created an Azure Data Factory using Bicep and validated the deployment. To learn more about Azure Data Factory and Bicep, continue on to the articles below.

- [Azure Data Factory documentation](index.yml)
- Learn more about [Bicep](../azure-resource-manager/bicep/overview.md)
