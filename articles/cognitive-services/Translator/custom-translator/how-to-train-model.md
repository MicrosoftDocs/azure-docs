---
title: Train a model - Custom Translator
titleSuffix: Azure Cognitive Services
description: Training a model is an important step when building a translation model. Training happens based on documents you select for that trainings.
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to train, so that I can start start building my custom translation model.
---

# Train a model

Training a model is the first and most important step to building a translation model, otherwise, model can't be built. Training happens based on documents you select for the trainings. When you select documents of "Training" document type, be mindful of the 10,000 parallel sentences minimum requirement. As you select documents, we display the total number of training sentences to guide you. This requirement does not apply when you only select documents of dictionary document type to train a model.

To train a model:

1. Select the project where you want to build a model.

2. The Data tab for the project will show all the relevant documents for the project language pair. Manually select the documents you want to use to train your model. You can select training, tuning, and testing documents from this screen. Also you just select the training set and have Custom Translator create the tuning and test sets for you.

    - Document name: Name of the document.

    - Pairing: If this document is a parallel or monolingual document. Monolingual documents are currently not supported for training.

    - Document type: Can be training, tuning, testing, or dictionary.

    - Language pair: This show the source and target language for the project.

    - Source sentences: Shows the number of sentences extracted from the source file.

    - Target sentences: Shows the number of sentences extracted from the target file.

    ![Train model](media/how-to/how-to-train-model.png)

3. Click "Create model" button.

4. On the dialog, specify the name for your model. By default, "Train immediately" is selected to start the training pipeline when you click "Create model" button. You can select "Save as draft" to create the model metadata and put the model in a draft state but model training would not start. At a later time, you have to manually select models in draft state to train.

5. Click "Create model" button.

    ![Train model dialog](media/how-to/how-to-train-model-2.png)

6. Custom Translator will submit the training, and show the status of the
    training in the models tab.

    ![Train model page](media/how-to/how-to-train-model-3.png)

>[!Note]
>Custom Translator supports 10 concurrent trainings within a workspace at any point in time.

## Modify a model name

You can modify a model name from the Model Details page.

1. From the projects page, click on the project name where the model exists.
2. Click on the model tab.
3. Click on the model name to view the model details.
4. Click on the Pencil icon.

    ![Edit model](media/how-to/how-to-edit-model.png)

5. In the dialog, change the model name and give your model a meaningful name.

    ![Edit more dialog](media/how-to/how-to-edit-model-dialog.png)

6. Click Save.

## Next steps

- Learn [how to view model details](how-to-view-model-details.md).
