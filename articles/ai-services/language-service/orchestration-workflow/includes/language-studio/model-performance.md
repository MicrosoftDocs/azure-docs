---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/20/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score for each model and [model expiration date](../../../concepts/model-lifecycle.md#expiration-timeline).
You can select the model name for more details about its performance.

4. You can find the *model-level evaluation metrics* under **Overview**, and the *intent-level* evaluation metrics. See [Evaluation metrics](../../concepts/evaluation-metrics.md) for more information.

    :::image type="content" source="../../media/model-details.png" alt-text="A screenshot of the model performance metrics in Language Studio" lightbox="../../media/model-details.png":::
    
5. The [confusion matrix](../../concepts/evaluation-metrics.md#confusion-matrix) for the model is located under **Test set confusion matrix**. You can see the confusion matrix for intents.

     
    > [!NOTE] 
    > If you don't see any of the intents you have in your model displayed here, it is because they weren't in any of the utterances that were used for the test set.
    
