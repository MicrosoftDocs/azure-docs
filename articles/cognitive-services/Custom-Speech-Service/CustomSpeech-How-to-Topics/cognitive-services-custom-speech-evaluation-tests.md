---
title: Evaluate a model with Custom Speech Service on Azure| Microsoft Docs
description: Learn how to evaluate the models you create with the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 02/01/2018
ms.author: panosper
---

# Evaluating Models 
Custom Speech Service portal offers users the option to evaluate adapted model, both language and acoustic. In order to create an evaluation test, users need to upload acoustic test data. Test data do not differ from acoustic data sets used for adaptation. In fact, the same [acoustic format guidelines](cognitive-services-custom-speech-create-acoustic-model.md)

## Using Acoustic data sets to evaluate a model

The order of steps to evaluate a model are as follows:

*   Select the option 'Accuracy Tests' on the portal and click 'Create New'
*   Fill in the form presented making sure the locale and subscription key fields are correct
*   Select the baseline model. 
*   Select one of the imported acoustic data sets
*   Press 'Create'

> [!NOTE]
> The baseline model must be the same as the baseline of the adapted model being evaluated. Upon selection, the portal will present the available models for evaluation.
>

## Evaluation Results

The results of each evaluation test are presented in a table along with previously done evaluation results. Each row in that table includes timing information, test name, locale, the word error rate (WER) and a link called 'Details'. WER is provides an overview of the overall accuracy. The 'Details' link shows the difference between the ground truth of the audio utterance and the decoder output 

Users can run as many evaluation tests as they wish

## Next steps
* Learn how to [create a custom speech-to-text endpoint](cognitive-services-custom-speech-create-endpoint.md)
* Learn how to [use a deployed model](cognitive-services-custom-speech-use-endpoint.md)
