---
title: Use Azure Machine Learning labeling in Language Studio
description: Learn how to label your data in Azure Machine Learning, and import it for use in the Language service.
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 04/17/2023
ms.author: aahi
---

# Use Azure Machine Learning labeling in Language Studio

Labeling data is an important part of preparing your dataset. Using the labeling experience in Azure Machine Learning, you can experience easier collaboration, more flexibility, and the ability to [outsource labeling tasks](/azure/machine-learning/how-to-outsource-data-labeling) to external labeling vendors from the [Azure Market Place](https://azuremarketplace.microsoft.com/marketplace/consulting-services?search=AzureMLVend). You can use Azure Machine Learning labeling for:
* [custom text classification](../custom-text-classification/overview.md) 
* [custom named entity recognition](../custom-named-entity-recognition/overview.md) 

## Prerequisites

Before you can connect your labeling project to Azure Machine Learning, you need:
* A successfully created Language Studio project with a configured Azure blob storage account.
* Text data that has been uploaded to your storage account.
* At least:
    * One entity label for custom named entity recognition, or
    * Two class labels for custom text classification projects.
* An [Azure Machine Learning workspace](/azure/machine-learning/how-to-manage-workspace) that has been [connected](/azure/machine-learning/v1/how-to-connect-data-ui?tabs=credential#create-datastores) to the same Azure blob storage account that your Language Studio account using.

## Limitations

* Connecting your labeling project to Azure Machine Learning is a one-to-one connection. If you disconnect your project, you will not be able to connect your project back to the same Azure Machine Learning project
* You can't label in the Language Studio and Azure Machine Learning simultaneously. The labeling experience is enabled in one studio at a time. 
* The testing and training files in the labeling experience you switch away from will be ignored when training your model.  
* Only Azure Machine Learning's JSONL file format can be imported into Language Studio.
* Projects with the multi-lingual option enabled can't be connected to Azure Machine Learning, and not all languages are supported.
    * Language support is provided by the Azure Machine Learning [TextDNNLanguages Class](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages?view=azure-ml-py&preserve-view=true&branch=main#azureml-automl-core-constants-textdnnlanguages-supported).
* The Azure Machine Learning workspace you're connecting to must be assigned to the same Azure Storage account that Language Studio is connected to. Be sure that the Azure Machine Learning workspace has the storage blob data reader permission on the storage account. The workspace needs to have been linked to the storage account during the [creation process in the Azure portal](https://portal.azure.com/#create/Microsoft.MachineLearningServices).
* Switching between the two labeling experiences isn't instantaneous. It may take time to successfully complete the operation.

## Import your Azure Machine Learning labels into Language Studio

Language Studio supports the JSONL file format used by Azure Machine Learning. If you’ve been labeling data on Azure Machine Learning, you can import your up-to-date labels in a new custom project to utilize the features of both studios. 

1.	Start by creating a new project for custom text classification or custom named entity recognition.

    1. In the **Create a project** screen that appears, follow the prompts to connect your storage account, and enter the basic information about your project. Be sure that the Azure resource you're using doesn't have another storage account already connected.
    
    1. In the **Choose container** section, choose the option indicating that you already have a correctly formatted file. Then select your most recent Azure Machine Learning labels file.
        
        :::image type="content" source="./media/select-label-file.png" alt-text="A screenshot showing the selection for a label file in Language Studio." lightbox="./media/select-label-file.png":::

## Connect to Azure Machine Learning

Before you connect to Azure Machine Learning, you need an Azure Machine Learning account with a pricing plan that can accommodate the compute needs of your project. See the [prerequisites section](#prerequisites) to make sure that you have successfully completed all the requirements to start connecting your Language Studio project to Azure Machine Learning.

1.	Use the [Azure portal](https://portal.azure.com) to navigate to the Azure Blob Storage account connected to your language resource.
2.	Ensure that the *Storage Blob Data Contributor* role is assigned to your AML workspace within the role assignments for your Azure Blob Storage account. 
3.	Navigate to your project in [Language Studio](https://language.azure.com/). From the left navigation menu of your project, select **Data labeling**.
4.	Select **use Azure Machine Learning to label** in either the **Data labeling** description, or under the **Activity pane**. 

    :::image type="content" source="./media/azure-machine-learning-selection.png" alt-text="A screenshot showing the location of the Azure Machine Learning link." lightbox="./media/azure-machine-learning-selection.png":::

1. Select **Connect to Azure Machine Learning** to start the connection process.

    :::image type="content" source="./media/activity-pane.png" alt-text="A screenshot showing the Azure Machine Learning connection button in Language Studio." lightbox="./media/activity-pane.png":::

1. In the window that appears, follow the prompts. Select the Azure Machine Learning workspace you’ve created previously under the same Azure subscription. Enter a name for the new Azure Machine Learning project that will be created to enable labeling in Azure Machine Learning.

    >[!TIP]
    > Make sure your workspace is linked to the same Azure Blob Storage account and Language resource before continuing. You can create a new workspace and [link to your storage account using the Azure portal](https://portal.azure.com/#create/Microsoft.MachineLearningServices). Ensure that the storage account is properly linked to the workspace.

1. (Optional) Turn on the vendor labeling toggle to use labeling vendor companies. Before choosing the vendor labeling companies, contact the vendor labeling companies on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/consulting-services?search=AzureMLVend) to finalize a contract with them. For more information about working with vendor companies, see [How to outsource data labeling](/azure/machine-learning/how-to-outsource-data-labeling). 

    You can also leave labeling instructions for the human labelers that will help you in the labeling process. These instructions can help them understand the task by leaving clear definitions of the labels and including examples for better results.

1.	Review the settings for your connection to Azure Machine Learning and make changes if needed. 

    > [!IMPORTANT]
    > Finalizing the connection **is permanent**. Attempting to disconnect your established connection at any point in time will permanently disable your Language Studio project from connecting to the same Azure Machine Learning project. 

1. After the connection has been initiated, your ability to label data in Language Studio will be disabled for a few minutes to prepare the new connection.

## Switch to labeling with Azure Machine Learning from Language Studio

Once the connection has been established, you can switch to Azure Machine Learning through the **Activity pane** in Language Studio at any time.

:::image type="content" source="./media/switch-labeling-activity.png" alt-text="A screenshot showing the button to switch to labeling using Azure Machine Learning." lightbox="./media/switch-labeling-activity.png":::

When you switch, your ability to label data in Language Studio will be disabled, and you will be able to label data in Azure Machine Learning. You can switch back to labeling in Language Studio at any time through Azure Machine Learning.

For information on how to label the text, see [Azure Machine Learning how to label](/azure/machine-learning/how-to-label-data#label-text).  For information about managing and tracking the text labeling project, see [Azure Machine Learning set up and manage a text labeling project](/azure/machine-learning/how-to-create-text-labeling-projects). 

## Train your model using labels from Azure Machine Learning

When you switch to labeling using Azure Machine Learning, you can still train, evaluate, and deploy your model in Language Studio. To train your model using updated labels from Azure Machine Learning: 

1. Select **Training jobs** from the navigation menu on the left of the Language studio screen for your project. 

1. Select **Import latest labels from Azure Machine Learning** from the **Choose label origin** section in the training page. This synchronizes the labels from Azure Machine Learning before starting the training job.

    :::image type="content" source="./media/azure-machine-learning-label-origin.png" alt-text="A screenshot showing the selector for using labels from Azure Machine Learning." lightbox="./media/azure-machine-learning-label-origin.png":::

## Switch to labeling with Language Studio from Azure Machine Learning

After you've switched to labeling with Azure Machine Learning, You can switch back to labeling with Language Studio project at any time.

> [!NOTE] 
> * Only users with the [correct roles](/azure/machine-learning/how-to-add-users) in Azure Machine Learning have the ability to switch labeling. 
> * When you switch to using Language Studio, labeling on Azure Machine learning will be disabled. 

To switch back to labeling with Language Studio:

1. Navigate to your project in Azure Machine Learning and select **Data labeling** from the left navigation menu. 
1. Select the **Language Studio** tab and select **Switch to Language Studio**. 

    :::image type="content" source="./media/azure-machine-learning-studio.png" alt-text="A screenshot showing the selector for using labels from Language Studio." lightbox="./media/azure-machine-learning-studio.png":::

3. The process takes a few minutes to complete, and your ability to label in Azure Machine Learning will be disabled until it's switched back from Language Studio.

## Disconnecting from Azure Machine Learning

Disconnecting your project from Azure Machine Learning is a permanent, irreversible process and can't be undone. You will no longer be able to access your labels in Azure Machine Learning, and you won’t be able to reconnect the Azure Machine Learning project to any Language Studio project in the future. To disconnect from Azure Machine Learning:

1. Ensure that any updated labels you want to maintain are synchronized with Azure Machine Learning by switching the labeling experience back to the Language Studio.
1. Select **Project settings** from the navigation menu on the left in Language Studio.
1. Select the **Disconnect from Azure Machine Learning** button from the **Manage Azure Machine Learning connections** section.

## Next steps
Learn more about labeling your data for [Custom Text Classification](../custom-text-classification/how-to/tag-data.md) and [Custom Named Entity Recognition](../custom-named-entity-recognition/how-to/tag-data.md).

