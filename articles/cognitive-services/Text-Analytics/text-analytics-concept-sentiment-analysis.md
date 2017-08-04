---
title: 'Sentiment analysis using Azure Text Analytics API | Microsoft Docs'
description: Guidance, best practices, and tips for implmenting sentiment analysis over text in custom apps using Azure Cognitive Services.
services: cognitive-services
documentationcenter: ''
author: LuisCabrer
manager: jhubbard
editor: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/24/2017
ms.author: luisca

---
# Sentiment analysis (Azure Cognitive Services > Text Analytics API)

Classifies text as predominantly positive or negative, assigning a score in the range of 0 to 1, up to 15 decimal places. 

A solid 0.5 is the functional equivalent of an indeterminate sentiment. The algorithm couldn't read or make sense of the text input.

The response consists of a document ID and a score. There is no built-in drillthrough to document detail. If you want clickthrough from a sentiment score to the original input, or to key phrases extracted for the same document, you will need to write code that collects the outputs for each document ID.

The usage model is as simple as this: JSON input > Analysis > JSON output

Through code, you can control the quality of the input, and you can summarize or further analyze output, but you cannot configure or customize the sentiment analysis model itself. In your solution design, the sentiment resource is a black box.



## Limits



we use machine learning to train the model, matching text with evidence of positive or negative sentiment to come up with patterns that can be applied to any text you provide.

imprecise
hueristics

PREDICT SENTIMENT

The model might fail to correctly interpret slang, sarcasm, irony, or very mixed reviews with similar proportions of positve and negative commentary in the same string.

Over time, even the most challenging

As the service exists today, you can try it out and see if it helps.

Mixed reviews, sarcasm, irony -- nuance.


## Approach

A more robust approach is to train models that detect sentiment. Here is how the training process works – we obtained a large dataset of text records that was already labeled with sentiment for each record. The first step is to tokenize the input text into individual words, then apply stemming. Next we constructed features from these words; these features are used to train a classifier. Upon completion of the training process, the classifier can be used to predict the sentiment of any new piece of text. It is important to construct meaningful features for the classifier, and our list of features includes several from state-of-the-art research: 

N-grams denote all occurrences of n consecutive words in the input text. The precise value of n may vary across scenarios, but it’s common to pick n=2 or n=3. With n=2, for the text “the quick brown fox”, the following n-grams would be generated – [ “the quick”, “quick brown”, “brown fox”]

Part-of-speech tagging is the process of assigning a part-of-speech to each word in the input text. We also compute features based on the presence of emoticons, punctuation and letter case (upper or lower)

Word embeddings are a recent development in natural language processing, where words or phrases that are syntactically similar are mapped closer together, e.g. in such a mapping, the term cat would be mapped closer to the term dog, than to the term car, since both dogs and cats are animals. Neural networks are a popular choice for constructing such a mapping. For sentiment analysis, we employ neural networks that encode the associated sentiment information as well. The layers of the neural network are then used as features for the classifier.

## Recommendations for improving accuracy of sentiment scoring

> [!TIP]
> For sentiment analysis, we recommend spliting text into sentences. This generally leads to higher precision in sentiment predictions.
> 

## Next steps

## See also