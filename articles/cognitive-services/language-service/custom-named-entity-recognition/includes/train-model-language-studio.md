---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/05/2022
ms.author: aahi
---

Typically after you create a project, you would import your data and begin [tagging the entities](../how-to/tag-data.md) within it to train the classification model. For this quickstart, you’ll use the example tagged data file you downloaded earlier, and stored in your Azure storage account.

A model is the machine learning object that will be trained to classify text. Your model will learn from the example data, and be able to classify loan agreements afterwards.

To start training your model:

1. Select **Train** from the left side menu.

2. Select **Train a new model** and type in the model name in the text box below.

    :::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the model selection page for training" lightbox="../media/train-model.png":::

3. Click on the **Train** button at the bottom of the page.

    > [!NOTE]
    > * While training, the data will be spilt into 2 sets for training and testing the model. See [how to train a model](../how-to/train-model.md) for more information. 
    > * Training can take up to a few hours.