---
title: Onco-Phenotype frequently asked questions
titleSuffix: Azure Health Insights
description: Onco-Phenotype frequently asked questions
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# Onco-Phenotype frequently asked questions

You’ll find answers to commonly asked questions about Onco-Phenotype, part of Azure Health Insights service, in this article

## What does inference value ```None``` mean?
```None``` implies that the model couldn't find enough relevant information to make a meaningful prediction.

## How is the ```description``` property populated for tumor site inference?
It's populated based on the [ICD-O-3 SEER Site/Histology Validation List](https://seer.cancer.gov/icd-o-3/).

## Do you support behavior code along with histology code?
No, we don't support one-digit behavior code. We support only four-digit histology code.

## What does inference value ```N+``` mean for clinical/pathologic N category? Why don't you have ```N1, N2, N3``` inference values?
N+ means there's involvement of regional lymph nodes without explicitly mentioning the extent of spread. Our models were trained to classify whether or not there's regional lymph node involvement but not the extent of spread. Hence we don't have ```N1, N2, N3``` inference values. We plan to support these values in the long term.

## Do you have plans to support I-IV stage grouping?
No, we don't have any plans to support I-IV stage grouping at this time.

## Do you check if the tumor site and histology inference values area valid combination?
No, we don't check if the tumor site and histology inference values are a valid combination.

## Are these values for each inference type?
Yes, for clinical/pathologic TNM categories. For tumor site and histology, the values are only as the training data set labels. We plan to publish this set of labels soon.


## Is there a workaround for patients whose clinical documents exceed the # characters limit?
Unfortunately, we don't support patients with clinical documents that exceed # characters limit. You might try excluding the progress notes.