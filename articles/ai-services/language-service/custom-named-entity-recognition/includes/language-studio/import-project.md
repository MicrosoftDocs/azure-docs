---
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

1. Sign into the [Language Studio](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select your Language resource. 

2. Under the **Extract information** section of Language Studio, select **Custom named entity recognition**.

    :::image type="content" source="../../media/select-custom-ner.png" alt-text="A screenshot showing the location of the custom NER feature in the Language Studio landing page." lightbox="../../media/select-custom-ner.png":::
        

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../../media/create-project.png":::


4.  After you select **Create new project**, a screen will appear to let you connect your storage account. If you can’t find your storage account, make sure you created a resource using the recommended steps. If you've already connected a storage account to your Language resource, you will see your storage account connected.

    >[!NOTE]
    > * You only need to do this step once for each new language resource you use. 
    > * This process is irreversible, if you connect a storage account to your Language resource you cannot disconnect it later.
    > * You can only connect your Language resource to one storage account.

    :::image type="content" source="../../media/connect-storage.png" alt-text="A screenshot of the storage connection screen for new projects." lightbox="../../media/connect-storage.png":::

4. Enter the project information, including a name, description, and the language of the files in your project. You won’t be able to change the name of your project later. Select **Next**.
       
    >[!TIP]
    > Your dataset doesn't have to be entirely in the same language. You can have multiple documents, each with different supported languages. If your dataset contains documents of different languages or if you expect text from different languages during runtime, select **enable multi-lingual dataset** option when you enter the basic information for your project. This option can be enabled later from the **Project settings** page.

5. Select the container where you have uploaded your dataset. 

7. Select **Yes, my files are already labeled and I have formatted JSON labels file** and select the labels file from the drop-down menu below to import your JSON labels file. Make sure it follows the [supported format](../../concepts/data-formats.md).

8.   Select **Next**.

9. Review the data you entered and select **Create Project**.
