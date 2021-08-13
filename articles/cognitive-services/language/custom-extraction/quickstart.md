---
title: Quickstart - Custom extraction
titleSuffix: Azure Cognitive Services
description: Use this article to quickly get started using custom extraction with Language Studio
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 08/13/2021
ms.author: aahi
---

# Quickstart: Custom extraction

In this article, we use the Language  studio to demonstrate key concepts of custom entity recognition. As an example we will build a custom extraction model to extract relevant entities from loan agreements.

## Prerequisites

* A Text analytics resource in **West US 2** or **West Europe** with **S** pricing tier. You can learn more about creating yor resource [here](../ct-before-get-started.md#Create-new-resource)

* Proper permissions for storage account. You can learn more about required permissions [here](../ct-before-get-started.md#set-permissions)

* For model evaluation to work you must have at least 10 files in your container.

> [!NOTE]
> You should read this [**document**](../ct-before-get-started.md) before starting to use the service.

## Sign-in to the Language studio

* Login through the [Language studio portal](https://language.azure.com)

* Select your subscription, only **whitelisted** subscriptions will be displayed. To whitelist yours fill this [form](../ct-before-get-started.md#Fill-Form)

* Select your Text analytics resource. Your resource has to be in **West US 2** or **West Europe** with **S** pricing tier. [Enable managed identity](../ct-before-get-started.md#Enable-identity-management-on-resource) for your resource.

![select-resource](../../media/extraction/ct-select-resource.png)

* Select **Custom entity extraction** from available services.

![language-studio](../../media/extraction/ct-language-studio.png)

## Create new project

To start working with custom entity extraction, you need to create a project which you connect to the container hosting your data. In a project you can tag data, train, evaluate, improve and deploy your models. You can have up to 500 projects per Azure resource. View guidance for [data selection](ct-concept-data-selection.md) and [schema definition](ct-concept-schema-definition-and-refinement.md.)

* Select **Create new project** from the top menu in your projects page .

![create-project-1](../../media/extraction/ct-create-project-1.png)

### Connect storage account to resource

>[!NOTE]
>
> * You only need to do this step once for each resource.
> * This process is **irreversible**, if you connect a storage account to your resource you cannot disconnect it later.
>* You can only connect your resource to one storage account.

* Select your storage account from the drop down. If you cannot find your storage account, see required [permissions](../ct-before-get-started.md#Set-permissions)

![connect-storage](../../media/extraction/ct-connect-storage.png)

* Click **Next**

### If resource is already connected to a storage account

* Enter the following information in the window that appears:

| Key | Description |
| -- | -- |
| Name | Name of your project. **Note** that there is no option to rename your project after creation. |
| Description | Description of your project |
| Language | Language of the files in your project.|

> [!NOTE]
>If your files will be in multiple languages select the **multiple languages** option in project creation and set the **language** option to the language of the majority of your documents.

![create-project-1](../../media/extraction/ct-create-project-2.png)

* Choose storage container

![create-project-3](../../media/extraction/ct-create-project-3.png)

* Review the data you entered and select **Create Project**.

## Tag your data

* If you already have tagged data, make sure it follows the format mentioned here*](ct-concept-tags-file-format.md).

* If not, you can learn more about tagging your data [here](ct-how-to-tag-data-tool.md).

## Train your model

Before proceeding to training your model,verify that your data has already been tagged. You can also [view recommended practices](ct-concept-recommended-practices.md) before training.

>[!NOTE]
> While training, your data will be spilt into 3 parts; 80% for training, 10% for validation and 10% for testing.

To start training your model:

* Select **Train** from the left side menu, .

* Select the model you want to train from the **Model name** dropdown, if you don’t have models already, type in the name of your model and a new one will be created for you.

![train-model-1](../../media/extraction/ct-train-model-1.png)

* Click on the **Train** button at the bottom of the page.

* If the model you selected is already trained, a pop up will appear to confirm overwriting the last model state.

![train-model-2](../../media/extraction/ct-train-model-2.png)

>[!NOTE]
> Training can take up to few hours so please be patient 😊.

## View model evaluation details

Once your model training completes, you can view the evaluation data and decide if you are satisfied with the current results or there is room for improvement.

* Select **View model details** from the left side menu,.

* View your model training status in the **Status** column.

![model-details](../../media/extraction/ct-model-details-1.png)

* Click on the model name for more details.

* In the **Overview** section you can find the macro precision, recall and F1 score for the collective model.

* Under the **Entity performance metrics** you can find the micro precision, recall and F1 score for each entity separately. You can learn more about evaluation metrics [here](ct-concept-evaluation.md)

![model-details-2](../../media/extraction/ct-model-details-2.png)

> [!NOTE]
> If you don't see all the entities you have in your model displayed here, it is because they were not there in any of the files in the test set.

* Under the **Test set confusion matrix** you can find confusion matrix for the model. For more details about the confusion matrix refer to this [section](ct-concept-evaluation.md#Confusion-matrix).

![model-details-3](../../media/extraction/ct-model-details-3.png)

>[!NOTE]
> You can learn more about Evaluation metrics and Confusion matrix [here](ct-concept-evaluation.md).

## Improve model

After View model details. review inconsistencies between predicted entities and tagged entities (ground truth) by the model and examine data distribution.
In this step we will focusing on data driven from [validation set](ct-concept-training.md#validation-set).

* Select **Improve model** from the left side menu.

* Select **Review validation set**.

* Choose your trained model from **Model** dropdown.

* For easier analysis you can toggle on **Show incorrect predictions only** to view mistakes only.

![review-validation-set](../../media/extraction/ct-review-validation-set.png)

* You can find more details about improving your model performance [here](ct-how-to-improve-model.md).

## Deploy model

After you have reviewed the model evaluation details and decided that the current behavior is satisfactory, you can go ahead and deploy your model. Deploying a model is to make it available for use via the [Analyze API](../../extras/Microsoft.CustomText.Runtime.v3.1-preview.1.json).

>[!NOTE]
>You can only have one deployed model per project. Deploying a new model replaces any existing deployed model.

* Select **Deploy model** from the left side menu.

* Select the model you want to deploy and from the top menu click on **Deploy model**. You can see models that have completed training successfully .

![deploy-model-1](../../media/extraction/ct-deploy-model-1.png)

## Test your model

* Select **Test model** from the left side menu.

* Select the model you want to test.

* Insert your text in the top textbox or you can upload a `.txt` file. You can enter text or a upload file with a maximum of 125k characters.

* Click on **Run the test**.

![test-model-1](../../media/extraction/ct-test-model-1.png)

* In the bottom box you can visualize your results and you find the extracted entities highlighted.

* You can also toggle **Show Cards** button to view entity cards. This views shows the extracted entities only each with its confidence score.

* You can view the JSON response under the **JSON** tab.

![test-model-2](../../media/extraction/ct-test-model-2.png)

## Run custom entity extraction task

After you have deployed you model, you can use the [Analyze API](../../extras/Microsoft.CustomText.Runtime.v3.1-preview.1.json) to run your tasks.

* Select **Deploy model** from the left side menu.

* After deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

![run-inference](../../media/extraction/ct-get-prediction-url-1.png)

* In the window that appears, under the the **Submit** pivot, copy the sample request into you command line

* Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to extract entities from.

![run-inference-2](../../media/extraction/ct-get-prediction-url-2.png)

* Submit the request

* In the response header you receive extract `operation_id` from `operation-location` which is formatted as follows `{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<operation_id>`

* Copy the retrieve request and replace `operation_id` and submit the request.

![run-inference-3](../../media/extraction/ct-get-prediction-url-3.png)

## Clean up resources

When no longer needed, delete the project. To do so, go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/extraction), select the project you want to delete and click on **Delete** button.

![delete-project](../../media/extraction/ct-delete-project.png)

## Next steps

* [View recommended practices](ct-concept-recommended-practices.md)
