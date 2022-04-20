---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/06/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **View model details** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models. You can click on the model name for more details.

4. You can find the **model-level** evaluation metrics under **Overview**, and the **entity-level** evaluation metrics under **Entity performance metrics**. The confusion matrix for the model is located under **Test set confusion matrix**
    
    > [!NOTE]
    > If you don't find all the entities displayed here, it's because they were not in any of the files within the test set.

    :::image type="content" source="../media/model-details.png" alt-text="A screenshot of the model performance metrics in Language Studio" lightbox="../media/model-details.png":::
