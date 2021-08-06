---
title: Quickstart - Use Language Studio
titleSuffix: Azure Cognitive Services
description: Use this article to quickly get started with Language Studio
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 07/15/2021
ms.author: aahi
---

# Quickstart: use Language Studio to being using custom text classification

In this article, we use the Language studio to demonstrate key concepts of Custom text classification. As an example we will build a custom classification model to triage support tickets.

## Prerequisites

* A Text analytics resource in **West US 2** or **West Europe** with **S** pricing tier.
* Proper permissions for storage account.

* For model evaluation to work you must have at least 10 files in your container.

## Sign in to the Language studio

* Login through the [Language studio portal](https://language.azure.com)

* Select your subscription.

* Select your Text analytics resource. Your resource has to be in **West US 2** or **West Europe** with **S** pricing tier. [Enable managed identity](../concepts/service-requirements.md#enable-identity-management-on-resource) for your resource.

:::image type="content" source="../media/select-resource.png" alt-text="Select your resource" lightbox="../media/select-resource.png":::

* Select **Custom classification** from available services.

:::image type="content" source="../media/language-studio.png" alt-text="Custom classification selection" lightbox="../media/language-studio.png":::

## Create new project

To start working with custom text classification, you need to create a project, which you connect to the container hosting your data. In a project you can tag data, train, evaluate, improve, and deploy your models. You can have up to 500 projects per Azure resource. 

* Select **Create new project** from the top menu in your projects page.

:::image type="content" source="../media/create-project-1.png" alt-text="Create a new project" lightbox="../media/create-project-1.png":::

### Connect storage account to resource

>[!NOTE]
>
> * You only need to do this step once for each resource.
> * This process is **irreversible**, if you connect a storage account to your resource you cannot disconnect it later.
>* You can only connect your resource to one storage account.

* Select your storage account from the drop-down menu. If you cannot find your storage account, see required [permissions](../concepts/service-requirements.md#set-permissions)

:::image type="content" source="../media/connect-storage.png" alt-text="Connect your storage account" lightbox="../media/connect-storage.png":::

* Click **Next**

### If resource is already connected to a storage account

* Select project type, for this project we will create a multi label classification project. You can learn more about the different project types [here](../definitions.md#project).

:::image type="content" source="../media/project-type.png" alt-text="Select a project type" lightbox="../media/project-type.png":::

* Click **Next**

* Enter the project information

| Key | Description |
|--| -- |
| Name | Name of your project. **Note** that there is no option to rename your project after creation. |
| Description | Description of your project |
| Language | Language of the files in your project.|

> [!NOTE]
> If your files will be in multiple languages select the **multiple languages** option in project creation and set the **language** option to the language of the majority of your files.

:::image type="content" source="../media/create-project-2.png" alt-text="Enter basic information for your project" lightbox="../media/create-project-2.png":::

* Choose storage container

:::image type="content" source="../media/create-project-3.png" alt-text="Storage container selection screen" lightbox="../media/create-project-3.png":::

* Review the data you entered and select **Create Project**.

## Tag your data

If you already have tagged data, make sure it follows the format mentioned [here](../how-to/tag-data.md).

## Train your model

Before proceeding to training your model, verify that your data has already been tagged. You can also [view recommended practices](../concepts/recommended-practices.md) before training.

>[!NOTE]
> While training, your data will be spilt into 3 parts; 80% for training, 10% for validation and 10% for testing.

To start training your model:

* Select **Train** from the left side menu.

* Select the model you want to train from the **Model name** dropdown, if you don’t have models already, type in the name of your model and click on **create new model**.

:::image type="content" source="../media/train-model-1.png" alt-text="Select the model you want to train" lightbox="../media/train-model-1.png":::

* Click on the **Train** button at the bottom of the page.

* If the model you selected is already trained, a pop-up will appear to confirm overwriting the last model state.

:::image type="content" source="../media/train-model-2.png" alt-text="Confirm you want to overwrite the trained model" lightbox="../media/train-model-2.png":::

>[!NOTE]
> Training can take up to few hours so please be patient 😊.

## View the model evaluation details

Once your model training completes, you can view the evaluation data and decide if you are satisfied with the current results or there is room for improvement.

* Select **View model details** from the left side menu.

* View your model training status in the **Status** column.

:::image type="content" source="../media/model-details-1.png" alt-text="Model details" lightbox="../media/model-details-1.png":::

* Click on the model name for more details.

* In the **Overview** section you can find the macro precision, recall, and F1 score for the collective model.

* Under the **Class performance metrics** you can find the micro precision, recall, and F1 score for each class separately.

:::image type="content" source="../media/model-details-2.png" alt-text="Model performance metrics" lightbox="../media/model-details-2.png":::

> [!NOTE]
> If you don't see all the classes you have in your model displayed here, it is because they were not there in any of the files in the test set.

* Under **Test set confusion matrix**, find the confusion matrix for the model. 

:::image type="content" source="../media/conf-matrix-multi.png" alt-text="The confusion matrix for the model" lightbox="../media/conf-matrix-multi.png":::

>[!NOTE]
> You can learn more about Evaluation metrics and Confusion matrix [here](../concepts/evaluation.md).

## Improve model

After viewing model details, you can review inconsistencies between predicted classes and tagged classes (ground truth) by the model and examine data distribution.
In this step, we will focus on data derived from [validation set](../how-to/train-model.md#data-groups).

* Select **Improve model** from the left side menu.

* Select **Review validation set**.

* Choose your trained model from **Model** dropdown.

* For easier analysis you can toggle on **Show incorrect predictions only** to view mistakes only.

:::image type="content" source="../media/review-validation-set.png" alt-text="Review the validation set" lightbox="../media/review-validation-set.png":::

* You can find more details about improving your model performance [here](../how-to/improve-model.md).

## Deploy model

After you have reviewed the model evaluation details and decided that the current behavior is satisfactory, you can go ahead and deploy your model. Deploying a model is to make it available for use via the Analyze API.

>[!NOTE]
>You can only have one deployed model per project. Deploying a new model replaces any existing deployed model.

* Select **Deploy model** from the left side menu.

* Select the model you want to deploy and from the top menu click on **Deploy model**. You can see models that have completed training successfully.

:::image type="content" source="../media/deploy-model-1.png" alt-text="Deploy the model" lightbox="../media/deploy-model-1.png":::

## Test your model

* Select **Test model** from the left side menu.

* Select the model you want to test.

* Insert your text in the top textbox or you can upload a `.txt` file. You can enter text or upload a file with a maximum of 125k characters.

* Click on **Run the test**.

:::image type="content" source="../media/test-model-1.png" alt-text="Run a test on the model" lightbox="../media/test-model-1.png":::

* In the box at the bottom, you can see the predicted classes for your text.

* You can view the JSON response under the **JSON** tab.

:::image type="content" source="../media/test-model-2.png" alt-text="View the test results" lightbox="../media/test-model-2.png":::

## Run custom text classification task

After you have deployed you model, you can use the Analyze API.

* Select **Deploy model** from the left side menu.

* After deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

:::image type="content" source="../media/get-prediction-url-1.png" alt-text="Get the prediction URL" lightbox="../media/get-prediction-url-1.png":::

* In the window that appears, under the **Submit** pivot, copy the sample request into your command line

* Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to classify.

:::image type="content" source="../media/get-prediction-url-2.png" alt-text="View the sample request" lightbox="../media/get-prediction-url-2.png":::

* Submit the request

* In the response header you receive extract `operation_id` from `operation-location`, which has the following format: `{YOUR-ENDPOINT}/text/analytics/v3.1-preview.ct.1/analyze/jobs/<operation_id>`

* Copy the retrieve request and replace `operation_id` and submit the request.

:::image type="content" source="../media/get-prediction-url-3.png" alt-text="The operation ID in the request" lightbox="../media/get-prediction-url-3.png":::

## Clean up resources

When no longer needed, delete the project. To do so, go to your projects page in [Language Studio](https://language.azure.com/customTextNext/projects/classification), select the project you want to delete and click on **Delete** button.

:::image type="content" source="../media/delete-project.png" alt-text="Delete your project" lightbox="../media/delete-project.png":::

## Next steps

* [View recommended practices](../concepts/recommended-practices.md)
