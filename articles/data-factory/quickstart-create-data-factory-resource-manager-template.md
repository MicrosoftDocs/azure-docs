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
ms.date: 07/10/2020
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

- Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

- [Azure Storage account](../storage/common/storage-account-create.md) You need an Azure Storage account as both *source* and *destination* data stores.

- [Blob container](../storage/blobs/storage-quickstart-blobs-portal.md): You need a blob container. Remember that the name of your blob must be unique across Azure. For this article, we use the name **adftutorial**.
    - Create a folder in the blob container you created. For this quickstart, the name of the folder is **input**.
    - Upload a sample file to your blob container folder (input). Before you begin, open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

        ```emp.txt
        John, Doe
        Jane, Doe
        ```
    - Save the file on your local system.
    - [Upload the **emp.txt** file to your blob container](../storage/blobs/storage-quickstart-blobs-powershell.md#upload-blobs-to-the-container).


Keep the **adftutorial** container page open. You use it to verify the output at the end of this quickstart.

# [Portal](#tab/Portal)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Create an Azure Data Factory

### Review template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-cosmosdb-sql/).

:::code language="json" source="~/quickstart-templates/101-cosmosdb-sql/azuredeploy.json":::

Three Azure resources are defined in the template:

There are Azure resources defined in the template:

- [Microsoft.DataFactory/factories](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories): Create an Azure Data Factory.
- [Microsoft.DataFactory/factories/linkedServices](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/linkedservices): Create an Azure Data Factory linked service.
- [Microsoft.DataFactory/factories/datasets](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/datasets): Create an Azure Data Factory dataset.
- [Microsoft.DataFactory/factories/pipelines](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/pipelines): Create an Azure Data Factory pipeline.

Create a JSON file named **ADFTutorialARM-Parameters.json** that contains parameters for the Azure Resource Manager template.

- Specify the name and key of your Azure Storage account for the **storageAccountName** and **storageAccountKey** parameters in this parameter file. You created the adftutorial container and uploaded the sample file (emp.txt) to the input folder in this Azure blob storage.
- Specify a globally unique name for the data factory for the **dataFactoryName** parameter. For example: ARMTutorialFactoryJohnDoe11282017.

```json
{  
    "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion":"1.0.0.0",
    "parameters":{  
        "dataFactoryName":{  
            "value":"GEN-UNIQUE"
        },
        "dataFactoryLocation":{  
            "value":"East US"
        },
        "storageAccountName":{  
            "value":"GEN-UNIQUE"
        },
        "storageAccountKey":{  
            "value":"<yourstorageaccountkey>"
        },
    }
```

> [!IMPORTANT]
> You may have separate parameter JSON files for development, testing, and production environments that you can use with the same Data Factory JSON template. By using a Power Shell script, you can automate deploying Data Factory entities in these environments.

### Deploy Data Factory entities

- Specify the name and key of your Azure Storage account for the **storageAccountName** and **storageAccountKey** parameters in this parameter file. You created the adftutorial container and uploaded the sample file (emp.txt) to the input folder in this Azure blob storage.
- Specify a globally unique name for the data factory for the **dataFactoryName** parameter. For example: ARMTutorialFactoryJohnDoe11282017.

In PowerShell, run the following command to deploy Data Factory entities in your resource group (in this case, take ADFTutorialResourceGroup as an example) using the Resource Manager template you created earlier in this quickstart.

```powershell
New-AzResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName ADFTutorialResourceGroup -TemplateFile C:\ADFTutorial\ADFTutorialARM.json -TemplateParameterFile C:\ADFTutorial\ADFTutorialARM-Parameters.json
```

You see output similar to the following sample:

```console
DeploymentName          : MyARMDeployment
ResourceGroupName       : ADFTutorialResourceGroup
ProvisioningState       : Succeeded
Timestamp               : 9/8/2019 10:52:29 AM
Mode                    : Incremental
TemplateLink            : 
Parameters              : 
                          Name                   Type                       Value     
                          =====================  =========================  ==========
                          dataFactoryName        String                     <data factory name>
                          dataFactoryLocation    String                     East US   
                          storageAccountName     String                     <storage account name>
                          storageAccountKey      SecureString                         
                          triggerStartTime       String                     9/8/2019 11:00:00 AM
                          triggerEndTime         String                     9/8/2019 2:00:00 PM

Outputs                 :
DeploymentDebugLogLevel :
```

## Review deployed resources

1. After logging in to the [Azure portal](https://portal.azure.com/), Select **All services**, search with the keyword such as **data fa**, and select **Data factories**.

2. In the **Data Factories** page, select the data factory you created. If needed, filter the list with the name of your data factory.

3. In the Data factory page, select **Author & Monitor** tile.

Trigger steps

4. In the **Let's get started** page, select the **Monitor tab**. 
    ![Monitor pipeline run](media/doc-common-process/get-started-page-monitor-button.png)

    > [!IMPORTANT]
    > You see pipeline runs only at the hour clock (for example: 4 AM, 5 AM, 6 AM, etc.). Select **Refresh** on the toolbar to refresh the list when the time reaches the next hour.

5. Select the **View Activity Runs** link in the **Actions** column.

    ![Pipeline actions link](media/quickstart-create-data-factory-resource-manager-template/pipeline-actions-link.png)

6. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline has only one activity of type: Copy. Therefore, you see a run for that activity.

    ![Activity runs](media/quickstart-create-data-factory-resource-manager-template/activity-runs.png)
7. Select the **Output** link under Actions column. You see the output from the copy operation in an **Output** window. Select the maximize button to see the full output. You can close the maximized output window or close it.

8. Stop the trigger once you see a successful/failure run. The trigger runs the pipeline once an hour. The pipeline copies the same file from the input folder to the output folder for each run. To stop the trigger, run the following command in the PowerShell window.
    
    ```powershell
    Stop-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $triggerName
    ```

### Verify output file

The pipeline automatically creates the output folder in the adftutorial blob container. Then, it copies the emp.txt file from the input folder to the output folder. 

1. In the Azure portal, on the **adftutorial** container page, select **Refresh** to see the output folder. 
    
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