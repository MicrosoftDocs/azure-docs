---
title:  Interpret and improve accuracy and confidence scores
titleSuffix: Azure Applied AI Services
description: Best practices for how to interpret the accuracy score from the train model operation and the confidence score from analysis operations.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 01/31/2022
ms.author: vikurpad
---
> [!NOTE]
> **Custom document models do not provide accuracy scores during training** 
> The accuracy scores in this document only apply to custom form models. 
> Confidence scores for key-value pair fields apply to custom document and custom form models. 
> Confidence scores for structured fields like tables are currently not available.

# Interpret and improve accuracy and confidence scores

Custom models generate an estimated accuracy score when trained. Documents analyzed with a Custom model produce a confidence score for extracted fields. In this document you will learn to  interpret accuracy and confidence scores and the best practices for using these scores to improve accuracy and confidence results.

## Estimated accuracy scores

The output of a model train operation includes the estimated accuracy score. This score represents the model's ability to accurately predict the labeled value on a visually similar form. The estimated accuracy is calculated by running a few different combinations of the training data to predict the labeled values. 

**Form Recognizer Studio** </br>
**Trained custom model (invoice)**

:::image type="content" source="media/accuracy-confidence/accuracy-studio-results.png" alt-text="Trained custom model accuracy scores":::


## Confidence scores

When analyzing a document, Form Recognizer returns an estimated confidence for predicted words, key-value pairs, selection marks, regions, and signatures. Currently, not all document fields return confidence. 

Confidence indicates an estimated probability between 0 and 1 that the prediction is correct.  For example, a confidence value of 0.95 (95%) indicates that the prediction is likely correct 19 out of 20 times.  For scenarios where accuracy is critical, confidence may be used to determine whether to automatically accept the prediction or mark it for human review.

**Form Recognizer Studio** </br>
**Analyzed invoice prebuilt-invoice model**

:::image type="content" source="media/accuracy-confidence/confidence-scores.png" alt-text="confidence scores from Form Recognizer Studio":::

## Interpreting accuracy and confidence scores

| Accuracy | Confidence | Result |
|--|--|--|
| High| High | The model is performing well on the labeled keys and document formats. You have a balanced training dataset |
| High | Low | The analyzed document appears different from the training dataset. A case where the model would benefit from retraining with at least five labeled documents like this. It could also point to a format variation between the training dataset and the analyzed document. In this case consider adding a new model. |
| Low | High | The probability of this happening is extremely low. For low accuracy scores, add additional labeled data or split visually distinct documents into multiple models |
| Low | Low| For low accuracy scores, add additional labeled data or split visually distinct documents into multiple models|


## Best practices for ensuring accuracy for custom form models

Accuracy of the model is affected by changes in the visual structure of documents. As best practices to train a model with the highest accuracy:

* Ensure that all variations of the document are included in the training dataset
* Variations include different formats, for example, digital and scanned PDFs. If you expect the model to analyze both types of documents, add at least five samples of each type to the training dataset
* Split visually distinct document types to train different models. As a general rule, if you remove all user entered values and the documents look similar, you need to add more training data to the existing model. If the documents are dissimilar, split your training data into different folders and train a model for each variation. You can then compose the different variations into a single model
* Ensure you don't have any extraneous labels
* For Signature and region labeling, don't include any of the surrounding texts

Following these guidelines should produce a model with higher accuracy resulting in higher confidence scores during analysis. Resulting in a smaller number of documents flagged for human review.