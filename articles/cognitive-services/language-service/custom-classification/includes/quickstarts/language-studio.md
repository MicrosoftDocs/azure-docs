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

> [!IMPORTANT]
> In this quickstart, we recommend creating a new Azure Text Analytics resource using the steps provided below. Using these steps will let you create and configure an Azure blob storage account at the same time, which is easier than doing it later. 
>
> **If you already have a resource** that you want to use, you will need to ensure that:
> * Your resource is in the "West US 2" or "West Europe" region, with the Standard (**S**) pricing tier. The free (**F0**) tier is not supported.
> * Your resources has managed identity enabled.   
> * You have the owner or contributor role assigned on your Azure resource. 
>
> You must also have an Azure storage account with:
>    * The **owner** or **contributor** role on the storage account.
>    * The **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
>    * The **Reader** role on the storage account.
>
> See [**Using Azure resources with Custom Text Classification**](../../how-to/use-azure-resources.md#optional-using-a-pre-existing-azure-resource) for information on completing these requirements.

## Create a new resource from the Azure portal

To create an Azure Text Analytics resource with an Azure blob storage account configured to work with Custom Text Classification: 

1. Go to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Text Analytics resource. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following parameters.  

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](/azure/storage/common/storage-account-overview) you will want to use in production environments. 

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard | 
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally-redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

After you have created an Azure storage account and linked it to your Language Service resource, you will need to upload the example files for this quickstart. These files will later be used to train your model.

1. [Download sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) for this quickstart from GitHub.

2. Go to your Azure storage account in the [Azure portal](https://ms.portal.azure.com). Navigate to your account, and upload the sample data to it.

## Create a custom classification project

Creating a Text Analytics resource and blob storage container will let you begin working with Custom Text Classification. A project will contain your text classification model, and be the work area for building your custom model.  

1. Login through the [Language Studio portal](https://language.azure.com). A window will appear to let you select your subscription and Language Services resource. Select the resource you created in the above step. 

2. Scroll down until you see **Custom text classification** from the available services, and select it.

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../../media/create-project.png":::
<!--
4. If you have created your resource using the steps above, the **Connect storage** step will be completed already. You only need to do this step once for each resource you use and it is irreversible. If you connect a storage account to your resource, you cannot disconnect it later.

    :::image type="content" source="../../../custom-named-entity-recognition/media/connect-storage.png" alt-text="A screenshot showing the storage connection screen." lightbox="../../../custom-named-entity-recognition/media/connect-storage.png":::
-->
4. If you have created your resource using the steps above, you will need to add information about your project, like a name, and select your storage container.

    1. Select your project type. For this quickstart, we will create a multi label classification project. Then click **Next**.

    2. Enter the project information, including a name, description, and the language of the files in your project. You will not be able to change the name of your project later.

    >[!TIP]
    > Later when you create your own projects, if your datset contains files of different languages or if you expect different languages during runtime, you can enable the multi-lingual option.

    3. Select the container where you have uploaded your data. For this quickstart, we will use the existing tags file available in the container. Then click **Next**.
 
    4. Review the data you entered and select **Create Project**.

## Train your model

Typically after you create a project, you would import your data and begin [tagging the entities](../../how-to/tag-data.md) within it to train the classification model. For this quickstart, you will use the example tagged data file you downloaded earlier, and stored in your Azure blob storage account.

In this step, your model will start learning from the tagged data. 


To start training your model:

1. Select **Train** from the left side menu.

2. Select the model you want to train from the **Model name** dropdown. If you don’t have models already, type in the name of your model and click on **create new model**.

    :::image type="content" source="../../media/train-model.png" alt-text="A screenshot showing the model selection page for training" lightbox="../../media/train-model.png":::

3. Click on the **Train** button at the bottom of the page. If the model you selected is already trained, a pop-up will appear to confirm you want to overwrite the last model state.

    > [!NOTE]
    > * While training, the data will be spilt into 2 sets: 80% for training and 20% for testing.
    > * Training can take up to a few hours.

## Deploy your model

After your model is trained, you can deploy it. Deploying your model lets you start using it to classify text, using the runtime API.  

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/improve-model.md) if necessary. in this quickstart, you will just deploy your model, and make it available for you to try. 

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy, then select **Deploy model**.

## Test your model

After your model is deployed, you can start using it for text classification. Use the following steps to send your first text classification request. 

1. Select **Test model** from the left side menu.

2. Select the model you want to test.

3. Add your text to the textbox, you can also upload a `.txt` file. 

4. Click on **Run the test**.

5. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. 

    :::image type="content" source="../../media/test-model-results.png" alt-text="View the test results" lightbox="../../media/test-model-results.png":::

> [!IMPORTANT]
> After you've tested your model using these steps, You will need to use the REST API or SDK to send [text classification requests](../../how-to/run-inference.md) to your applications.

## Clean up projects

When you don't need your project anymore, you can delete it from your [projects page in Language Studio](https://language.azure.com/customText/projects/classification). Select the project you want to delete and click on **Delete**.