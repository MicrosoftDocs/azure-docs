---
title:  Interpret and improve model accuracy and analysis confidence scores
titleSuffix: Azure AI services
description: Best practices to interpret the accuracy score from the train model operation and the confidence score from analysis operations.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
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

> [!NOTE]
>
> * **Table cell confidence scores are now included with the 2024-02-29-preview API version**.
> * Confidence scores for table cells from custom models is added to the API starting with the 2024-02-29-preview API.

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

## Table, row and cell confidence

With the addition of table, row and cell confidence with the ```2024-02-29-preview``` API, here are some common questions that should help with interpreting the scores

* Would I ever expect to see a high confidence score for cells, but a low confidence score for the row?
Yes. The different levels of table confidence (cell, row, and table) are meant to capture the correctness of a prediction at that specific level. A correctly predicted cell that belongs to a row with other possible misses would have high cell confidence, but the row's confidence should be low. Similarly, a correct row in a table with challenges with other rows would have high row confidence whereas the table's overall confidence would be low.

* What is the expected confidence score when cells are merged? This will cause the number of columns identified to change, how will scores be affected?
Regardless of the type of table, the expectation for merged cells is that they should have lower confidence values. Furthermore, the cell that is missing (because it got amerged with an adjacent cell) should have NULL value with lower confidence as well. How much lower these values might be will depend on the training dataset, the general trend of both merged and missing cell having lower scores should hold.

* What is the confidence score when a value is optional? Should you expect a cell with NULL value and high confidence if the value is missing?
If your training dataset is representative of the optionality of cells, it helps the model know how often a value tends to appear in the training set, and thus what to expect during inference. This feature is used when computing the confidence of either a prediction or of making no prediction at all (NULL). You should expect an empty field with high confidence for missing values that are mostly empty in the training set too.

* How do you determine if a field is optional and not present or missed? Is the expectation that the confidence score will answer that question?
When a value is missing from a row, the cell will have NULL value and confidence assigned. A high confidence score here should mean that the model prediction (of there not being a value) is more likely to be correct. In contrast, a low score should signal more uncertainty from the model (and thus the possibility of an error, like the value being missed).

* When extracting a multi-page table with a row split across pages, what should be the expectation for cell confidence and row confidence?
Expect the Cell confidence to be high. Row confidence to be potentially lower than that of other non-split rows. This may be affected by how common split rows are in the training data set, but in general, a split row will look different than the other rows in the table (thus, the model will be less certain that it is correct).

* For cross-page tables with rows that cleanly end and start at the page boundaries, is it correct to assume that confidence scores will be consistent across pages?
Yes. Since rows will look similar in shape and contents, regardless of where they are in the document (or in which page), their respective confidence scores should be consistent.

* What is the best way to leverage these new confidence scores?
look at all levels of table confidence starting in a top-to-bottom approach: begin by checking a table's confidence as a whole, then drill down to the row level to look at individual rows, and finally look at cell-level confidences. Depending on the type of table, there are a couple of things of note:

For **fixed tables**, cell-level confidence already captures quite a bit of information on the correctness of things. This means that simply going over each cell and looking at its confidence may be enough to help determine the quality of the prediction.
For **dynamic tables**, the levels are meant to build on top of each other, so the top-to-bottom approach is more important. 


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
