---
title: "Legacy: Train a model - Custom Translator"
titleSuffix: Azure Cognitive Services
description: How to train and build a custom translation model.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 12/06/2021
ms.author: lajanuar
ms.topic: how-to
ms.custom: cogserv-non-critical-translator
#Customer intent: As a Custom Translator user, I want to understand how to train, so that I can start start building my custom translation model.
---

# Train a model

Training a model is the first and most important step to building a translation model, otherwise, model can't be built. Training happens based on documents you select for the trainings. When you select documents of "Training" document type, be mindful of the 10,000 parallel sentences minimum requirement. As you select documents, we display the total number of training sentences to guide you. This requirement doesn't apply when you only select documents of dictionary document type to train a model.

To train a model:

1. Select the project where you want to build a model.

2. The Data tab for the project will show all the relevant documents for the project language pair. Manually select the documents you want to use to train your model. You can select training, tuning, and testing documents from this screen. Also you just select the training set and have Custom Translator create the tuning and test sets for you.

    - Document name: Name of the document.

    - Pairing: Is this document a parallel or monolingual document? Monolingual documents are currently not supported for training.

    - Document type: Can be training, tuning, testing, or dictionary.

    - Language pair: This show the source and target language for the project.

    - Source sentences: Shows the number of sentences extracted from the source file.

    - Target sentences: Shows the number of sentences extracted from the target file.



3. Select **Create model** button.

4. On the dialog, specify the name for your model. By default, "Train immediately" is selected to start the training pipeline when you select the **Create model** button. You can select **Save as draft** to create the model metadata and put the model in a draft state but model training wouldn't start. At a later time, you've to manually select models in draft state to train.

5. Select the **Create model** button.



6. Custom Translator will submit the training, and show the status of the
    training in the models tab.



>[!Note]
>Custom Translator supports 10 concurrent trainings within a workspace at any point in time.

## Modify a model name

You can modify a model name from the Model Details page.

1. From the projects page, select the project name where the model exists.
2. Select the model tab.
3. Select the model name to view the model details.
4. Select the **pencil icon**.



5. In the dialog, change the model name and give your model a meaningful name.



6. Select **Save**.

## Next steps

- Learn [how to view a model's details](how-to-view-model-details.md).
