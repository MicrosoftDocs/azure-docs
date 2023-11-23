---
title: Onco-Phenotype frequently asked questions
titleSuffix: Azure AI Health Insights
description: Onco-Phenotype frequently asked questions
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# Onco-Phenotype Frequently Asked Questions

- What does inference value `None` mean?

  `None` implies that the model couldn't find enough relevant information to make a meaningful prediction.

- How is the `description` property populated for tumor site inference?

  It is populated on ICD-O-3 SEER Site/Histology Validation List [here](https://seer.cancer.gov/icd-o-3/).

- Do you support behavior code along with histology code?

  No, only four digit histology code is supported.

- What does inference value `N+` mean for clinical/pathologic N category? Why don't you have `N1, N2, N3` inference values?

  `N+` means there's involvement of regional lymph nodes without explicitly mentioning the extent of spread. Microsoft trained the models to classify whether or not there's regional lymph node involvement but not the extent of spread and hence `N1, N2, N3` inference values aren't supported.

- Do you support subcategories for clinical/pathologic TNM categories?

  No, subcategories or isolated tumor cell modifiers aren't supported. For instance, 'T3a' would be predicted as T3, and N0(i+) would be predicted as N0.

- Do you have plans to support I-IV stage grouping?

  No, Microsoft doesn't have any plans to support I-IV stage grouping at this time.

- Do you check if the tumor site and histology inference values are a valid combination?

  No, the OncoPhenotype API doesn't validate if the tumor site and histology inference values are a valid combination.

- Are the inference values exhaustive for tumor site and histology?

  No, the inference values are only as exhaustive as the training data set labels.