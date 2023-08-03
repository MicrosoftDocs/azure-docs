---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/13/2022
ms.author: aahi
---

1. In [Language Studio](https://aka.ms/languageStudio), find the section named **Understand questions and conversational language** and select **Conversational language understanding**.  
    :::image type="content" source="../../media/select-custom-clu.png" alt-text="A screenshot showing the location of Custom Language Understanding in the Language Studio landing page." lightbox="../../media/select-custom-clu.png"::: 
    

2. This will bring you to the **Conversational language understanding projects** page. Select **Create new project**. 

    :::image type="content" source="../../media/projects-page.png" alt-text="A screenshot showing the conversation project page in Language Studio." lightbox="../../media/projects-page.png":::


To create a new project you need to provide the following details:

|Value  | Description  |
|---------|---------|
|Name     | A name for your project. Once it's created, it can't be changed  |
|Description    | Optional project description.        |
|Utterances primary language     | The primary language of your project. Your training data should primarily be in this language.        |
|Enable multiple languages    |  Whether you would like to enable your project to support [multiple languages](../../language-support.md#multi-lingual-option) at once.       |

Once you're done, select **Next** and review the details. Select **create** to complete the process. You should now see the **Build Schema** screen in your project.

