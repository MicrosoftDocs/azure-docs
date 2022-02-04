---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 02/02/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom text classification, you will need to create an Azure Language resource, which will give you the credentials needed to create a project and start training a model. You will also need an Azure storage account, where you can upload your dataset that will be used to building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See the [**project requirements**](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Custom text classification & custom NER**. When you create your resource, ensure it has the following parameters.

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, select an existing storage account or select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](../../../../../storage/common/storage-account-overview.md) you will want to use in production environments.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard |
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom classification](blob-storage-upload.md)]

## Create a custom classification project

1. Log in to [Language Studio](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select the resource you created in the above step.

2. Under the **Classify text** section of Language Studio, select **custom text classification** from the available services, and select it.
    
    :::image type="content" source="../../media/select-custom-text-classification.png" alt-text="A screenshot showing the location of custom classification in the Language Studio landing page." lightbox="../../media/select-custom-text-classification.png":::
    
3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../../media/create-project.png":::

4. If you have created your resource using the steps above, the **Connect storage** step will be completed already. If not, you need to assign [roles for your storage account](../../how-to/create-project.md#roles-for-your-storage-account) before connecting it to your resource

5. Select your project type. For this quickstart, we will create a multilabel classification project where you can assign multiple classes to the same file. Then click **Next**. Learn more about [project types](../../glossary.md#project-types)

6. Enter project information, including a name, description, and the language of the files in your project. You will not be able to change the name of your project later.
    >[!TIP]
    > Your dataset doesn't have to be entirely in the same language. You can have multiple files, each with different supported languages. If your dataset contains files of different languages or if you expect different languages during runtime, select **enable multi-lingual dataset** when you enter the basic information for your project.

7. Select the container where you have uploaded your data. For this quickstart, we will use the existing tags file available in the container. Then click **Next**.

8. Review the data you entered and select **Create Project**.

## Train your model

[!INCLUDE [Train a model using Language Studio](../train-model-language-studio.md)]

## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/improve-model.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try.

After your model is trained, you can deploy it. Deploying your model lets you start using it to classify text, using [Analyze API](https://aka.ms/ct-runtime-swagger).

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy, then select **Deploy model**.

## Test your model

After your model is deployed, you can start using it for text classification. Use the following steps to send your first text classification request. 

1. Select **Test model** from the left side menu.

2. Select the model you want to test.

3. Add your text to the textbox, you can also upload a `.txt` file. 

4. Click on **Run the test**.

5. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. 

    :::image type="content" source="../../media/test-model-results.png" alt-text="A screenshot showing model test results. The example is from CMU Movie Summary, CC BY-SA 3.0, modified by Microsoft" lightbox="../../media/test-model-results.png":::

## Clean up projects

When you don't need your project anymore, you can delete it from your [projects page in Language Studio](https://aka.ms/custom-classification
). Select the project you want to delete and click on **Delete**.
