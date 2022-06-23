---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/05/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score for each model and [model expiration date](../../../concepts/model-lifecycle.md). You can click on the model name for more details about its performance.

4. You can find the [model-level evaluation metrics](../../concepts/evaluation-metrics.md#model-level-and-class-level-evaluation-metrics) under **Overview**, and the [class-level evaluation metrics](../../concepts/evaluation-metrics.md#interpreting-class-level-evaluation-metrics) under **Class performance metrics**. The confusion matrix for the model is located under **Test set confusion matrix**.

    :::image type="content" source="../../media/model-details-2.png" alt-text="A screenshot of the model performance metrics in Language Studio." lightbox="../../media/model-details-2.png":::

    > [!NOTE]
    > Classes that are neither labeled nor predicted in the test set will not be part of the displayed results.
    
