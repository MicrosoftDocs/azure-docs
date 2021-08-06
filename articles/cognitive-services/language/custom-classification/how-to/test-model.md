---
title: How to test your custom classification model - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about how to test your model for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Test your model

After deploying your model, it's available to use through the Analyze API, and you can test it and visualize its output within the Language studio. The test page within your project enables you to either enter your own text, or upload a `.txt` file to visualize the output of the model.

## Prerequisites

* Successfully created a [Custom text classification project](create-project.md)

* Completed [deploying your model](deploy-model.md) successfully.

## Test your model in Language studio

>[!NOTE]
> You can only test the deployed model.

1. Go to your project in [Language Studio](https://language.azure.com/customTextNext/projects/classification).
2. Select **Test model** from the menu on the left side of the screen.
3. Select the model you want to test.
4. Insert your text in the top textbox or you can upload a `.txt` file. You can enter text or an upload file with a maximum of 125k characters.
5. Click on **Run the test**.

    :::image type="content" source="../media/test-model-1.png" alt-text="Run the model test" lightbox="../media/test-model-1.png":::

6. In the text box at the bottom, you can see the class given to your text highlighted. You can view the JSON response under the **JSON** tab.

    :::image type="content" source="../media/test-model-2.png" alt-text="Model test output" lightbox="../media/test-model-2.png":::

## Next Steps

* [Improve model](improve-model.md)
* [Run custom text classification task](run-inference.md)
* [View recommended practices](../concepts/recommended-practices.md)
