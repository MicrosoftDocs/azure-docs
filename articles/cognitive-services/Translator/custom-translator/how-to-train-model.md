---
title: Train a model - Custom Translator
titleSuffix: Azure Cognitive Services
description: Training a model is an important step when building a translation model. Training happens based on documents you select for that trainings.
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 05/26/2020
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to train, so that I can start start building my custom translation model.
---

# Train a model

Training a model is the important step to building a translation model, because without a training, model can't be built. Training happens based on documents you select for the trainings.

To train a model:

1.  Select the project where you want to build a model.

2.  The Data tab for the project will show all the relevant documents for the project language pair. Manually select the documents you want to use to train your model. You can select training, tuning, and testing documents from this screen. Also you just select the training set and have Custom Translator create the tuning and test sets for you.

    -  Document name: Name of the document.

    -  Pairing: If this document is a parallel or monolingual document. Monolingual documents are currently not supported for training.

    -  Document type: Can be training, tuning, testing, or dictionary.

    -  Language pair: This show the source and target language for the project.

    -  Source sentences: Shows the number of sentences extracted from the source file.

    -  Target sentences: Shows the number of sentences extracted from the target file.

    ![Train model](media/how-to/how-to-train-model.png)

3.  Click Train button.

4.  On the dialog, specify a name for your model.

5.  Click Train model.

    ![Train model dialog](media/how-to/how-to-train-model-2.png)

6.  Custom Translator will submit the training, and show the status of the
    training in the models tab.

    ![Train model page](media/how-to/how-to-train-model-3.png)

>[!Note]
>Custom Translator supports 10 concurrent trainings within a workspace at any point in time.


## Edit a model

You can edit a model using the Edit link on the Model Details page.

1.  Click on the Pencil icon.

    ![Edit model](media/how-to/how-to-edit-model.png)

2.  In the dialog change,

    1.  Model Name (required): Give your model a meaningful name.

        ![Edit more dialog](media/how-to/how-to-edit-model-dialog.png)

3.  Click Save.


## Next steps

- Learn [how to view model details](how-to-view-model-details.md).
