---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

[!INCLUDE [create a new resource from the Azure portal](../../includes/resource-creation-azure-portal.md)]

You can also [use an existing Language resource](../../how-to/use-azure-resources.md#optional-using-a-pre-existing-azure-resource) to get started with custom features.

## Upload sample data to blob container

After you have created an Azure storage account and linked it to your Language Service resource

1. [Download sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) for this quickstart from GitHub.

2. Go to your Azure storage account in the [Azure portal](https://ms.portal.azure.com), create a new container and upload sample data to it.

## Create a custom classification project

1. Login through the [Language Studio portal](https://language.azure.com). A window will appear to let you select your subscription and Language Services resource. Select the resource you created in the above step. 

2. Scroll down until you see **Custom text classification** from the available services, and select it.

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../../media/create-project.png":::

4. If you have created your resource using the steps above, the **Connect storage** step will be completed already. You only need to do this step once for each resource you use and it is irreversible. If you connect a storage account to your resource, you cannot disconnect it later.

    :::image type="content" source="../../../custom-named-entity-recognition/media/connect-storage.png" alt-text="A screenshot showing the storage connection screen." lightbox="../../../custom-named-entity-recognition/media/connect-storage.png":::

5. Select your project type. For this quickstart, we will create a multi label classification project. Then click **Next**. You can learn more abou project types [here](../../definitions.md#Project)

6. Enter the project information, including a name, description, and the language of the files in your project. You will not be able to change the name of your project later.

    >[!NOTE]
    > If your datset contains files of different languages or if you expect different languages during runtime, enable the muti-lingual option.

7. Select the container where you have uploaded your data. For this quickstart, we will use the existing tags file available in the container. Then click **Next**.
 
8. Review the data you entered and select **Create Project**.

## Tagging your data

Typically, you would import your data and begin [tagging the entities](../../how-to/tag-data.md) within it to train the classification model. For this quickstart, you will use the existing tags file available in your container.

## Train your model

To start training your model:

1. Select **Train** from the left side menu.

2. Select the model you want to train from the **Model name** dropdown. If you don’t have models already, type in the name of your model and click on **create new model**.

    :::image type="content" source="../../media/train-model.png" alt-text="A screenshot showing the model selection page for training" lightbox="../../media/train-model.png":::

3. Click on the **Train** button at the bottom of the page. If the model you selected is already trained, a pop-up will appear to confirm you want to overwrite the last model state.

    > [!NOTE]
    > * While training, your data will be spilt into 2 sets: 80% for training and 20% for testing.
    > * Training can take up to a few hours.

## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/improve-model.md) if necessary. in this quickstart, you will just deploy your model, and make it available for you to try. 

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy, then select **Deploy model**.

## Test your model

1. Select **Test model** from the left side menu.

2. Select the model you want to test.

3. Add your text to the textbox, you can also upload a `.txt` file. 

4. Click on **Run the test**.

5. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. 

    :::image type="content" source="../../media/test-model-results.png" alt-text="View the test results" lightbox="../../media/test-model-results.png":::

After you've tested your model, you can start sending [text classification requests](../../how-to/run-inference.md).

## Clean up projects

When you don't need your project anymore, you can delete it from your [projects page in Language Studio](https://language.azure.com/customText/projects/classification). Select the project you want to delete and click on **Delete**.
