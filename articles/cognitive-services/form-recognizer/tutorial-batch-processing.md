---
title: "Tutorial: Create a form processing app with AI Builder - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll use AI Builder to create and train a form processing application.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 11/23/2020
ms.author: pafarley
---

# Tutorial: Create a form-processing app with AI Builder

asdf

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a form processing AI model
> * Train your model
> * Publish your model to use in Azure Power Apps or Power Automate

## Prerequisites

* A set of at least five forms of the same type to use for training/testing data. See [Build a training data set](./build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2128080).
* A Power Apps or Power Automate license - see the [Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130). The license must include [Common Data Service](https://powerplatform.microsoft.com/common-data-service/).
* An AI Builder [add-on or trial](https://go.microsoft.com/fwlink/?LinkId=2113956&clcid=0x409).

## asdf
asdf

### Troubleshooting tips

If you're getting bad results or low confidence scores for certain fields, try the following tips:

- Retrain using forms with different values in each field.
- Retrain using a larger set of training documents. The more documents you tag, the more AI Builder will learn how to better recognize the fields.
- You can optimize PDF files by selecting only certain pages to train with. Use the **Print** > **Print to PDF** option to select certain pages within your document.

## Publish your model

asdf

## Next steps

asdf

* [Use the form-processor component in Power Apps](/ai-builder/form-processor-component-in-powerapps)
* [Use a form-processing model in Power Automate](/ai-builder/form-processing-model-in-flow)