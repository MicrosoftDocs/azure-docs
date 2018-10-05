---
title: Train your model in Custom Translator
titlesuffix: Azure Cognitive Services
description: Train your model in Custom Translator
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: how to train a model
Customer intent: As a custom translator user, I want to understand how to train a model, so that I can start using the feature.
---

# Train a model

To train a model,

1.  Select the project in which you want to build the model.

2.  The “Data” tab for the project will show all the relevant documents for the project language pair. Manually select the documents you want to use to train your model. You can select training, tuning, and testing documents from this screen. Also you just select the training set and have Custom Translator create the tuning and test sets for you.

    -  Document name: Name of the documents.

    -  Pairing: If this document is a parallel or monolingual document.
    - Monolingual documents are currently not supported for training.

    -  Document type: Can be training, tuning, testing, or dictionary.

    -  Language pair: This show the source and target language for the project.

    -  Source sentences: Shows the number of sentences extracted from the
    - source file.

    -  Target sentences: Shows the number of sentences extracted from the
    - target file.

    ![Train model](media/how-to/ct-how-to-train-model.png)

3.  Tap on the “Train” button.

4.  On the dialog, specify a name for your model.

5.  Tap “Train model”.

    ![Train model dialog](media/how-to/ct-how-to-train-model-2.png)

6.  Custom Translator will submit the training, and show the status of the
    training in the models tab.

    ![Train model page](media/how-to/ct-how-to-train-model-3.png)


## Next steps

- Read about [model details](how-to-train-model.md).
