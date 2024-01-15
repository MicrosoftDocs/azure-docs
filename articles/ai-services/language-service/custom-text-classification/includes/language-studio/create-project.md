---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

1. Sign into the [Language Studio](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select your Language resource. 

2. Under the **Classify text** section of Language Studio, select **Custom text classification**.

    :::image type="content" source="../../media/select-custom-text-classification.png" alt-text="A screenshot showing the location of custom text classification in the Language Studio landing page." lightbox="../../media/select-custom-text-classification.png":::
        

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you label data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../media/create-project.png" alt-text="A screenshot of the custom text classification project creation page." lightbox="../../media/create-project.png":::


4.  After you click, **Create new project**, a window will appear to let you connect your storage account. If you've already connected a storage account, you will see the storage accounted connected. If not, choose your storage account from the dropdown that appears and select **Connect storage account**; this will set the required roles for your storage account. This step will possibly return an error if you are not assigned as **owner** on the storage account.

    >[!NOTE]
    > * You only need to do this step once for each new language resource you use. 
    > * This process is irreversible, if you connect a storage account to your Language resource you cannot disconnect it later.
    > * You can only connect your Language resource to one storage account.

    :::image type="content" source="../../media/connect-storage.png" alt-text="A screenshot of the storage connection screen for custom classification projects." lightbox="../../media/connect-storage.png":::

5. Select project type. You can either create a **Multi label classification** project where each document can belong to one or more classes or **Single label classification** project where each document can belong to only one class. The selected type can't be changed later. Learn more about [project types](../../glossary.md#project-types)
    
    :::image type="content" source="../../media/project-types.png" alt-text="A screenshot of the available custom classification project types." lightbox="../../media/project-types.png":::

5. Enter the project information, including a name, description, and the language of the documents in your project. If you're using the [example dataset](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/language-service/Custom%20text%20classification/Custom%20multi%20classification%20-%20movies%20summary.zip), select **English**. You won’t be able to change the name of your project later. Select **Next**.
       
    >[!TIP]
    > Your dataset doesn't have to be entirely in the same language. You can have multiple documents, each with different supported languages. If your dataset contains documents of different languages or if you expect text from different languages during runtime, select **enable multi-lingual dataset** option when you enter the basic information for your project. This option can be enabled later from the **Project settings** page.

6. Select the container where you have uploaded your dataset. 
    
    >[!Note]
    > If you have already labeled your data make sure it follows the [supported format](../../concepts/data-formats.md) and select **Yes, my documents are already labeled and I have formatted JSON labels file** and select the labels file from the drop-down menu below. 
 
    > If you’re using one of the example datasets, use the included `webOfScience_labelsFile` or `movieLabels` json file. Then select **Next**.
    
7. Review the data you entered and select **Create Project**.
