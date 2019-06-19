---
title: "How to build a training data set for a custom model - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to ensure your training data set is optimized for training a Form Recognizer model.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: pafarley
#Customer intent: As a user of the Form Recognizer custom model service, I want to ensure I'm training my model in the best way.
---

# Build a training data set for a custom model

When you use the Form Recognizer custom model, you provide your own training data so the model can train to your industry-specific forms. It's important to use a data set that's optimized for training. Use the following tips to ensure you get the best results from the [Train Model](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api/operations/TrainCustomModel) operation.

1.  Use text PDF documents (if they're available) to train your model.
1.	Use an empty txt PDF document and 2 filled-in forms if possible.??
1.	Use form documents that are fully filled in.
1.	Use forms with different values in each field, if possible.
1.	If your form images are of lower quality, use a larger set (10-15 images, for example).

## Next steps

Now that you've learned how to build a training data set, follow a quickstart to train a custom Form Recognizer model and use it on your forms.

* Quickstart
* Quickstart

