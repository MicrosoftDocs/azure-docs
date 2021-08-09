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

* A Language Services resource in **West US 2** or **West Europe** with the standard (**S**) pricing tier.
* An Azure [storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
* The data file for this quickstart, available [on GitHub](https://github.com/Azure-Samples/cognitive-services-sample-data-files).

### Enable identity management for your Language Services resource

You can enable identity management either using the Azure portal or from Language Studio. To enable it using the Azure portal:

1. Go to the page for your Language Services resource in [Azure portal](https://ms.portal.azure.com/).
2. Select **Identity** in the left navigation menu.
3. Switch **Status** to **On** and select **Save**.

:::image type="content" source="../media/enable-identity-azure.png" alt-text="ct-assign-roles-azure" lightbox="../media/enable-identity-azure.png":::

### Set contributor roles on storage account

Ensure the below resource roles are set correctly on the storage account:

* Your resource has the **owner** or **contributor** role on the storage account.
* Your resource has the **Storage blob data owner** or **Storage blob data contributor** role on the storage account
* Your resource has the **Reader** role on the storage account.

To set proper roles on your storage account, 

1. go to your storage account page in the [Azure portal](https://ms.portal.azure.com/)
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the **Owner** or **Contributor** role. You can search for user names in the **Select** field.

:::image type="content" source="../media/assign-roles-azure.png" alt-text="ct-assign-roles-azure" lightbox="../media/assign-roles-azure.png":::

## Sign in to the Language Studio and create a custom classification project

1. Login through the [Language Studio portal](https://language.azure.com). A window will appear to let you select your subscription and Language Services resource.

<!--
:::image type="content" source="../media/select-resource.png" alt-text="Select your resource" lightbox="../media/select-resource.png":::
-->

2. Scroll down until you see **Custom classification** from the available services, and select it.

<!--
:::image type="content" source="../media/language-studio.png" alt-text="Custom classification selection" lightbox="../media/language-studio.png":::
-->

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

<!--
:::image type="content" source="../media/create-project-1.png" alt-text="Create a new project" lightbox="../media/create-project-1.png"::: 
-->

4. In the **Connect storage** screen that appears, connect your storage account using the drop-down menu. If you cannot find your storage account, make sure you set the [required permissions](#prerequisites). When you are done, select **Next**. 
 
    >[!NOTE]
    > * You only need to do this step once for each resource.
    > * This process is **irreversible**, if you connect a storage account to your resource you cannot disconnect it later.
    > * You can only connect your resource to one storage account.
    > * If you've already connected a storage account, you will see a **Select project type** screen instead. See the next step.

<!--
:::image type="content" source="../media/connect-storage.png" alt-text="Connect your storage account" lightbox="../media/connect-storage.png":::
-->

5. Select your project type, for this project we will create a multi label classification project. You can learn more about different project types in [definitions](../definitions.md#project-types). Then click **Next**

<!--
:::image type="content" source="../media/project-type.png" alt-text="Select a project type" lightbox="../media/project-type.png":::
-->

6. Enter the project information, including a name, description and the language of the files in your project.

    > [!IMPORTANT]
    > You will not be able to change the name of your project later. 
    
<!--
:::image type="content" source="../media/create-project-2.png" alt-text="Enter basic information for your project" lightbox="../media/create-project-2.png":::
-->

<!--
:::image type="content" source="../media/create-project-3.png" alt-text="Storage container selection screen" lightbox="../media/create-project-3.png":::
-->

7. Review the data you entered and select **Create Project**.

## Train your model

To start training your model:

1. Select **Train** from the left side menu.

2. Select the model you want to train from the **Model name** dropdown, if you don’t have models already, type in the name of your model and click on **create new model**.

    :::image type="content" source="../media/train-model-1.png" alt-text="Select the model you want to train" lightbox="../media/train-model-1.png":::

3. Click on the **Train** button at the bottom of the page.

    > [!NOTE]
    > * While training, your data will be spilt into 3 parts; 80% for training, 10% for validation and 10% for testing.
    > * If the model you selected is already trained, a pop-up will appear to confirm overwriting the last model state.
    > * Training can take up to a few hours.

## Deploy model

Generally after training a model you would review it's evaluation details and made adjustments if necessary. in this quickstart, you will just deploy your model, and make it available for you to use. 

>[!NOTE]
>You can only have one deployed model per project. Deploying a new model replaces any existing deployed model.

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy, then select **Deploy model**.

<!--
:::image type="content" source="../media/deploy-model-1.png" alt-text="Deploy the model" lightbox="../media/deploy-model-1.png":::
-->

## Test your model

1. Select **Test model** from the left side menu.

2. Select the model you want to test.

3. Add your text to the textbox, you can also upload a `.txt` file. 

4. Click on **Run the test**.

    :::image type="content" source="../media/test-model-1.png" alt-text="Run a test on the model" lightbox="../media/test-model-1.png":::

5. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. 

    :::image type="content" source="../media/test-model-2.png" alt-text="View the test results" lightbox="../media/test-model-2.png":::

## Clean up resources

When you don't need your project anymore, you can delete your project using [Language Studio](https://language.azure.com/customTextNext/projects/classification). Select **Custom text classification** in the left navigation menu, select project you want to delete and click on **Delete**.

## Next steps

* [View recommended practices](../concepts/recommended-practices.md)
* [View your model's evaluation and confusion matrix](../concepts/how-to/view-model-evaluation.md).
* [Learn about the evaluation metrics](../concepts/evaluation.md)
* [Improve your model's performance](../how-to/improve-model.md).
