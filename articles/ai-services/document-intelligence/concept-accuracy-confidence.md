---
title:  Interpret and improve model accuracy and analysis confidence scores
titleSuffix: Azure AI services
description: Best practices to interpret the accuracy score from the train model operation and the confidence score from analysis operations.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: lajanuar
---




# Custom models: accuracy and confidence scores

[!INCLUDE [applies to v4.0, v3.1, v3.0, and v2.1](includes/applies-to-v40-v31-v30-v21.md)]

> [!NOTE]
>
> * **Custom neural models do not provide accuracy scores during training**.
> * Confidence scores for structured fields such as tables are currently unavailable.

Custom models generate an estimated accuracy score when trained. Documents analyzed with a custom model produce a confidence score for extracted fields. In this article, learn to interpret accuracy and confidence scores and best practices for using those scores to improve accuracy and confidence results.

## Accuracy scores

The output of a `build` (v3.0) or `train` (v2.1) custom model operation includes the estimated accuracy score. This score represents the model's ability to accurately predict the labeled value on a visually similar document.
The accuracy value range is a percentage between 0% (low) and 100% (high). The estimated accuracy is calculated by running a few different combinations of the training data to predict the labeled values.

**Document Intelligence Studio** </br>
**Trained custom model (invoice)**

:::image type="content" source="media/accuracy-confidence/accuracy-studio-results.png" alt-text="Trained custom model accuracy scores":::

## Confidence scores

Document Intelligence analysis results return an estimated confidence for predicted words, key-value pairs, selection marks, regions, and signatures. Currently, not all document fields return a confidence score.

Field confidence indicates an estimated probability between 0 and 1 that the prediction is correct.  For example, a confidence value of 0.95 (95%) indicates that the prediction is likely correct 19 out of 20 times.  For scenarios where accuracy is critical, confidence can be used to determine whether to automatically accept the prediction or flag it for human review.

Confidence scores have two data points: the field level confidence score and the text extraction confidence score. In addition to the field confidence of position and span, the text extraction confidence in the ```pages``` section of the response is the model's confidence in the text extraction (OCR) process. The two confidence scores should be combined to generate one overall confidence score.

**Document Intelligence Studio** </br>
**Analyzed invoice prebuilt-invoice model**

:::image type="content" source="media/accuracy-confidence/confidence-scores.png" alt-text="confidence scores from Document Intelligence Studio":::

## Interpret accuracy and confidence scores

The following table demonstrates how to interpret both the accuracy and confidence scores to measure your custom model's performance.

| Accuracy | Confidence | Result |
|--|--|--|
| High| High | <ul><li>The model is performing well with the labeled keys and document formats. </li><li>You have a balanced training dataset</li></ul> |
| High | Low | <ul><li>The analyzed document appears different from the training dataset.</li><li>The model would benefit from retraining with at least five more labeled documents. </li><li>These results could also indicate a format variation between the training dataset and the analyzed document. </br>Consider adding a new model.</li></ul>  |
| Low | High | <ul><li>This result is most unlikely.</li><li>For low accuracy scores, add more labeled data or split visually distinct documents into multiple models.</li></ul> |
| Low | Low| <ul><li>Add more labeled data.</li><li>Split visually distinct documents into multiple models.</li></ul>|

## Ensure high model accuracy

Variances in the visual structure of your documents affect the accuracy of your model. Reported accuracy scores can be inconsistent when the analyzed documents differ from documents used in training. Keep in mind that a document set can look similar when viewed by humans but appear dissimilar to an AI model. To follow, is a list of the best practices for training models with the highest accuracy. Following these guidelines should produce a model with higher accuracy and confidence scores during analysis and reduce the number of documents flagged for human review.

* Ensure that all variations of a document are included in the training dataset. Variations include different formats, for example, digital versus scanned PDFs.

* If you expect the model to analyze both types of PDF documents, add at least five samples of each type to the training dataset.

* Separate visually distinct document types to train different models.
  * As a general rule, if you remove all user entered values and the documents look similar, you need to add more training data to the existing model.
  * If the documents are dissimilar, split your training data into different folders and train a model for each variation. You can then [compose](how-to-guides/compose-custom-models.md?view=doc-intel-2.1.0&preserve-view=true#create-a-composed-model) the different variations into a single model.

* Make sure that you don't have any extraneous labels.

* For signature and region labeling, don't include the surrounding text.

## Next step

> [!div class="nextstepaction"]
> [Learn to create custom models](quickstarts/try-document-intelligence-studio.md#custom-models)
