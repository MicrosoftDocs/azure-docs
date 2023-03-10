---
title: OncoPhenotype frequently asked questions
description: OncoPhenotype frequently qsked questions
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# OncoPhenotype frequently asked questions

## What does inference value ```None``` mean?
```None``` implies that the model could not find enough relevant information to make a meaningful prediction.

## How is the ```description``` property populated for tumor site inference?
It is populated based on ICD-O-3 SEER Site/Histology Validation List [here](https://seer.cancer.gov/icd-o-3/).

## Do you support behavior code along with histology code?
No, we do not support 1-digit behavior code. We support only 4-digit histology code.

## What does inference value ```N+``` mean for clinical/pathologic N category? Why don't you have ```N1, N2, N3``` inference values?
N+ means there is involvement of regional lymph nodes without explicitly mentioning the extent of spread. Our models were trained to classify whether or not there is regional lymph node involvement but not the extent of spread and hence we do not have ```N1, N2, N3``` inference values.We plan to support these values in the long term.

## Do you have plans to support I-IV stage grouping?
No, we do not have any plans to support I-IV stage grouping at this time.

## Do you check if the tumor site and histology inference values area valid combination?
No, we do not check if the tumor site and histology inference values are a valid combination.

## Are these values exhaustive for each inference type?
Yes, for clinical/pathologic TNM categories. For tumor site and histology, the values are only as exhaustive as the training data set labels. We plan to publish this set of labels in the near future.


## Is there a workaround for patients whose clinical documents exceed the # characters limit?

Unfortunately, we do not support patients with clinical documents that exceed # characters limit. You might try excluding the progress notes.
