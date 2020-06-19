---
title: Create an Azure Data Factory using an ARM template
description: Create a sample Azure Data Factory pipeline using an Azure Resource Manager template.
services: data-factory
ms.service: data-factory
tags: azure-resource-manager
ms.workload: data-services
author: djpmsft
ms.author: daperlov
manager: anandsub
ms.reviewer: maghan
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 06/10/2020
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

### Azure subscription
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Azure roles
To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the *contributor* or *owner* role, or an *administrator* of the Azure subscription. To view the permissions that you have in the subscription, go to the [Azure portal](https://portal.azure.com), select your username in the upper-right corner, select "**...**" icon for more options, and then select **My permissions**. If you have access to multiple subscriptions, select the appropriate subscription.

To create and manage child resources for Data Factory - including datasets, linked services, pipelines, triggers, and integration runtimes - the following requirements are applicable:

- To create and manage child resources in the Azure portal, you must belong to the **Data Factory Contributor** role at the resource group level or above.
- To create and manage child resources with PowerShell or the SDK, the **contributor** role at the resource level or above is sufficient.

For sample instructions about how to add a user to a role, see the [Add roles](../articles/cost-management-billing/manage/add-change-subscription-administrator.md) article.

For more info, see the following articles:

- [Data Factory Contributor role](../articles/role-based-access-control/built-in-roles.md#data-factory-contributor)
- [Roles and permissions for Azure Data Factory](../articles/data-factory/concepts-roles-permissions.md)

### Azure Storage account
You use a general-purpose Azure Storage account (specifically Blob storage) as both *source* and *destination* data stores in this quickstart. If you don't have a general-purpose Azure Storage account, see [Create a storage account](../articles/storage/common/storage-account-create.md) to create one. 

#### Get the storage account name
You need the name of your Azure Storage account for this quickstart. The following procedure provides steps to get the name of your storage account: 

1. In a web browser, go to the [Azure portal](https://portal.azure.com) and sign in using your Azure username and password.
2. From the Azure portal menu, select **All services**, then select **Storage** > **Storage accounts**. You can also search for and select *Storage accounts* from any page.
3. In the **Storage accounts** page, filter for your storage account (if needed), and then select your storage account. 

You can also search for and select *Storage accounts* from any page.

#### Create a blob container
In this section, you create a blob container named **adftutorial** in Azure Blob storage.

1. From the storage account page, select **Overview** > **Containers**.
2. On the *\<Account name>* - **Containers** page's toolbar, select **Container**.
3. In the **New container** dialog box, enter **adftutorial** for the name, and then select **OK**. The *\<Account name>* - **Containers** page is updated to include **adftutorial** in the list of containers.

   ![List of containers](media/data-factory-quickstart-prerequisites/list-of-containers.png)



## Create an Azure Data Factory

### Review template

Create a JSON file named **ADFTutorialARM.json** in **C:\ADFTutorial** folder (Create the ADFTutorial folder if it doesn't already exist) with the following content:

```json
{  
    "$schema":"http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion":"1.0.0.0",
    "parameters":{  
        "dataFactoryName":{  
            "type":"string",
            "metadata":"Data Factory Name"
        },
        "dataFactoryLocation":{  
            "type":"string",
            "defaultValue":"East US",
            "metadata":{  
                "description":"Location of the data factory. Currently, only East US, East US 2, and West Europe are supported. "
            }
        },
        "storageAccountName":{  
            "type":"string",
            "metadata":{  
                "description":"Name of the Azure storage account that contains the input/output data."
            }
        },
        "storageAccountKey":{  
            "type":"securestring",
            "metadata":{  
                "description":"Key for the Azure storage account."
            }
        },
        "triggerStartTime": {
            "type": "string",
            "metadata": {
                "description": "Start time for the trigger."
            }
        },
        "triggerEndTime": {
            "type": "string",
            "metadata": {
                "description": "End time for the trigger."
            }
        }
    },      
    "variables":{  
        "factoryId":"[concat('Microsoft.DataFactory/factories/', parameters('dataFactoryName'))]"
    },
    "resources":[  
        {  
            "type":"Microsoft.DataFactory/factories",
            "apiVersion":"2018-06-01",
            "name":"[parameters('dataFactoryName')]",
            "location":"[parameters('dataFactoryLocation')]",
            "identity":{  
                "type":"SystemAssigned"
            },
            "resources":[  
                {  
                    "type":"Microsoft.DataFactory/factories/linkedServices",
                    "apiVersion":"2018-06-01",
                    "name":"[concat(parameters('dataFactoryName'), '/ArmtemplateStorageLinkedService')]",
                    "properties":{  
                        "annotations":[  

                        ],
                        "type":"AzureBlobStorage",
                        "typeProperties":{  
                            "connectionString":"[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',parameters('storageAccountKey'))]"
                        }
                    },
                    "dependsOn":[  
                        "[parameters('dataFactoryName')]"
                    ]
                },
                {  
                    "type":"Microsoft.DataFactory/factories/datasets",
                    "apiVersion":"2018-06-01",
                    "name":"[concat(parameters('dataFactoryName'), '/ArmtemplateTestDatasetIn')]",                    
                    "properties":{  
                        "linkedServiceName":{  
                            "referenceName":"ArmtemplateStorageLinkedService",
                            "type":"LinkedServiceReference"
                        },
                        "annotations":[  

                        ],
                        "type":"Binary",
                        "typeProperties":{  
                            "location":{  
                                "type":"AzureBlobStorageLocation",
                                "fileName":"emp.txt",
                                "folderPath":"input",
                                "container":"adftutorial"
                            }
                        }
                    },
                    "dependsOn":[  
                        "[parameters('dataFactoryName')]",
                        "[concat(variables('factoryId'), '/linkedServices/ArmtemplateStorageLinkedService')]"
                    ]
                },
                {  
                    "type":"Microsoft.DataFactory/factories/datasets",
                    "apiVersion":"2018-06-01",
                    "name":"[concat(parameters('dataFactoryName'), '/ArmtemplateTestDatasetOut')]",
                    "properties":{  
                        "linkedServiceName":{  
                            "referenceName":"ArmtemplateStorageLinkedService",
                            "type":"LinkedServiceReference"
                        },
                        "annotations":[  

                        ],
                        "type":"Binary",
                        "typeProperties":{  
                            "location":{  
                                "type":"AzureBlobStorageLocation",
                                "folderPath":"output",
                                "container":"adftutorial"
                            }
                        }
                    },
                    "dependsOn":[  
                        "[parameters('dataFactoryName')]",
                        "[concat(variables('factoryId'), '/linkedServices/ArmtemplateStorageLinkedService')]"
                    ]
                },
                {  
                    "type":"Microsoft.DataFactory/factories/pipelines",
                    "apiVersion":"2018-06-01",
                    "name":"[concat(parameters('dataFactoryName'), '/ArmtemplateSampleCopyPipeline')]",
                    "properties":{  
                        "activities":[  
                            {  
                                "name":"MyCopyActivity",
                                "type":"Copy",
                                "dependsOn":[  

                                ],
                                "policy":{  
                                    "timeout":"7.00:00:00",
                                    "retry":0,
                                    "retryIntervalInSeconds":30,
                                    "secureOutput":false,
                                    "secureInput":false
                                },
                                "userProperties":[  

                                ],
                                "typeProperties":{  
                                    "source":{  
                                        "type":"BinarySource",
                                        "storeSettings":{  
                                            "type":"AzureBlobStorageReadSettings",
                                            "recursive":true
                                        }
                                    },
                                    "sink":{  
                                        "type":"BinarySink",
                                        "storeSettings":{  
                                            "type":"AzureBlobStorageWriteSettings"
                                        }
                                    },
                                    "enableStaging":false
                                },
                                "inputs":[  
                                    {  
                                        "referenceName":"ArmtemplateTestDatasetIn",
                                        "type":"DatasetReference",
                                        "parameters":{  

                                        }
                                    }
                                ],
                                "outputs":[  
                                    {  
                                        "referenceName":"ArmtemplateTestDatasetOut",
                                        "type":"DatasetReference",
                                        "parameters":{  

                                        }
                                    }
                                ]
                            }
                        ],
                        "annotations":[  

                        ]
                    },
                    "dependsOn":[  
                        "[parameters('dataFactoryName')]",
                        "[concat(variables('factoryId'), '/datasets/ArmtemplateTestDatasetIn')]",
                        "[concat(variables('factoryId'), '/datasets/ArmtemplateTestDatasetOut')]"
                    ]
                },
                {  
                    "type":"Microsoft.DataFactory/factories/triggers",
                    "apiVersion":"2018-06-01",
                    "name":"[concat(parameters('dataFactoryName'), '/ArmTemplateTestTrigger')]",
                    "properties":{  
                        "annotations":[  

                        ],
                        "runtimeState":"Started",
                        "pipelines":[  
                            {  
                                "pipelineReference":{  
                                    "referenceName":"ArmtemplateSampleCopyPipeline",
                                    "type":"PipelineReference"
                                },
                                "parameters":{  

                                }
                            }
                        ],
                        "type":"ScheduleTrigger",
                        "typeProperties":{  
                            "recurrence":{  
                                "frequency":"Hour",
                                "interval":1,
                                "startTime":"[parameters('triggerStartTime')]",
                                "endTime":"[parameters('triggerEndTime')]",
                                "timeZone":"UTC"
                            }
                        }
                    },
                    "dependsOn":[  
                        "[parameters('dataFactoryName')]",
                        "[concat(variables('factoryId'), '/pipelines/ArmtemplateSampleCopyPipeline')]"
                    ]
                }
            ]
        }
    ]
}
```

There are Azure resources defined in the template:

- [Microsoft.DataFactory/factories](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories): Create an Azure Data Factory.
- [Microsoft.DataFactory/factories/linkedServices](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/linkedservices): Create an Azure Data Factory linked service.
- [Microsoft.DataFactory/factories/datasets](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/datasets): Create an Azure Data Factory dataset.
- [Microsoft.DataFactory/factories/pipelines](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/pipelines): Create an Azure Data Factory pipeline.
- [Microsoft.DataFactory/factories/triggers](https://docs.microsoft.com/azure/templates/microsoft.datafactory/factories/triggers): Create an ADF trigger resource.

Create a JSON file named **ADFTutorialARM-Parameters.json** that contains parameters for the Azure Resource Manager template.

- Specify the name and key of your Azure Storage account for the **storageAccountName** and **storageAccountKey** parameters in this parameter file. You created the adftutorial container and uploaded the sample file (emp.txt) to the input folder in this Azure blob storage.
- Specify a globally unique name for the data factory for the **dataFactoryName** parameter. For example: ARMTutorialFactoryJohnDoe11282017.
- For the **triggerStartTime**, specify the current day in the format: `2019-09-08T00:00:00`.
- For the **triggerEndTime**, specify the next day in the format: `2019-09-09T00:00:00`. You can also check the current UTC time and specify the next hour or two as the end time. For example, if the UTC time now is 1:32 AM, specify `2019-09-09:03:00:00` as the end time. In this case, the trigger runs the pipeline twice (at 2 AM and 3 AM).

```json
{  
    "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion":"1.0.0.0",
    "parameters":{  
        "dataFactoryName":{  
            "value":"<datafactoryname>"
        },
        "dataFactoryLocation":{  
            "value":"East US"
        },
        "storageAccountName":{  
            "value":"<yourstorageaccountname>"
        },
        "storageAccountKey":{  
            "value":"<yourstorageaccountkey>"
        },
        "triggerStartTime":{  
            "value":"2019-09-08T11:00:00"
        },
        "triggerEndTime":{  
            "value":"2019-09-08T14:00:00"
        }
    }
}
```

> [!IMPORTANT]
> You may have separate parameter JSON files for development, testing, and production environments that you can use with the same Data Factory JSON template. By using a Power Shell script, you can automate deploying Data Factory entities in these environments.

### Deploy Data Factory entities

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

### Add an input folder and file for the blob container
In this section, you create a folder named **input** in the container you created, and then upload a sample file to the input folder. Before you begin, open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

```emp.txt
John, Doe
Jane, Doe
```

Save the file in the **C:\ADFv2QuickStartPSH** folder. (If the folder doesn't already exist, create it.) Then return to the Azure portal and follow these steps:

1. In the *\<Account name>* - **Containers** page where you left off, select **adftutorial** from the updated list of containers.

   1. If you closed the window or went to another page, sign in to the [Azure portal](https://portal.azure.com) again.
   1. From the Azure portal menu, select **All services**, then select **Storage** > **Storage accounts**. You can also search for and select *Storage accounts* from any page.
   1. Select your storage account, and then select **Containers** > **adftutorial**.

2. On the **adftutorial** container page's toolbar, select **Upload**.
3. In the **Upload blob** page, select the **Files** box, and then browse to and select the **emp.txt** file.
4. Expand the **Advanced** heading. The page now displays as shown:
5. In the **Upload to folder** box, enter **input**.
6. Select the **Upload** button. You should see the **emp.txt** file and the status of the upload in the list.
7. Select the **Close** icon (an **X**) to close the **Upload blob** page.

Keep the **adftutorial** container page open. You use it to verify the output at the end of this quickstart.

### Monitor the pipeline

1. After logging in to the [Azure portal](https://portal.azure.com/), Click **All services**, search with the keyword such as **data fa**, and select **Data factories**.

2. In the **Data Factories** page, click the data factory you created. If needed, filter the list with the name of your data factory.

3. In the Data factory page, click **Author & Monitor** tile.

4. In the **Let's get started** page, select the **Monitor tab**. 
    ![Monitor pipeline run](media/doc-common-process/get-started-page-monitor-button.png)

    > [!IMPORTANT]
    > You see pipeline runs only at the hour clock (for example: 4 AM, 5 AM, 6 AM, etc.). Select **Refresh** on the toolbar to refresh the list when the time reaches the next hour.

5. Click the **View Activity Runs** link in the **Actions** column.

    ![Pipeline actions link](media/quickstart-create-data-factory-resource-manager-template/pipeline-actions-link.png)

6. You see the activity runs associated with the pipeline run. In this quickstart, the pipeline has only one activity of type: Copy. Therefore, you see a run for that activity.

    ![Activity runs](media/quickstart-create-data-factory-resource-manager-template/activity-runs.png)
7. Click the **Output** link under Actions column. You see the output from the copy operation in an **Output** window. Click the maximize button to see the full output. You can close the maximized output window or close it.

8. Stop the trigger once you see a successful/failure run. The trigger runs the pipeline once an hour. The pipeline copies the same file from the input folder to the output folder for each run. To stop the trigger, run the following command in the PowerShell window.
    
    ```powershell
    Stop-AzDataFactoryV2Trigger -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Name $triggerName
    ```

---
ms.service: data-factory
ms.topic: include
ms.date: 11/09/2018
author: linda33wj
ms.author: jingwang
---

## Review deployed resources

### Monitor the pipeline

1. After logging in to the [Azure portal](https://portal.azure.com/), Select **All services**, search with the keyword such as **data fa**, and select **Data factories**.

2. In the **Data Factories** page, select the data factory you created. If needed, filter the list with the name of your data factory.

3. In the Data factory page, select **Author & Monitor** tile.

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

### Output file

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