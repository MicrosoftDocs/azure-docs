---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
ms.custom: ignite-fall-2021
---

1. Sign into the [Language Studio portal](https://aka.ms/languageStudio). A window will appear to let you select your subscription and Language resource. Select the resource you created in the above step. 

2. Find the **Entity extraction** section, and select **Custom named entity recognition** from the available services.

    :::image type="content" source="../media/select-custom-ner.png" alt-text="A screenshot showing the location of custom NER in the Language Studio landing page." lightbox="../media/select-custom-ner.png":::

3. Select **Create new project** from the top menu in your projects page. Creating a project will let you tag data, train, evaluate, improve, and deploy your models. 

    :::image type="content" source="../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../media/create-project.png":::


4.  After you click, **Create new project**, a screen will appear to let you connect your storage account. If you can’t find your storage account, make sure you created a resource using the steps above.

    >[!NOTE]
    > * You only need to do this step once for each new resource you use. 
    > * This process is irreversible, if you connect a storage account to your resource you cannot disconnect it later.
    > * You can only connect your resource to one storage account.
    > * If you've already connected a storage account, you will see a **Enter basic information** screen instead. See the next step.
    
    :::image type="content" source="../media/connect-storage.png" alt-text="A screenshot showing the storage connection screen." lightbox="../media/connect-storage.png":::

5. Enter the project information, including a name, description, and the language of the files in your project. You won’t be able to change the name of your project later. 

6. Select the container where you’ve uploaded your data.