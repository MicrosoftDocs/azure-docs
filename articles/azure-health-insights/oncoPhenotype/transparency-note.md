---
title: Transparency Note for OncoPhenotype
titleSuffix: Azure Health Insights
description: Microsoft's Transparency Notes for OncoPhenoType are intended to help you understand how our AI technology works.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---

# Transparency Note for OncoPhenotype

## What is a Transparency Note?

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, its capabilities and limitations, and how to achieve the best performance. Microsoft's Transparency Notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system, or share them with the people who will use or be affected by your system.

Microsoft's Transparency Notes are part of a broader effort at Microsoft to put our AI principles into practice. To find out more, see [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai). 

## Example use cases for the OncoPhenotype
**USE CASE** | **DESCRIPTION** 
-------------|----------------
Assisted annotation and curation | Support solutions for clinical data annotation and curation. For example: to support clinical coding, digitization of data that was manually created, automation of registry reporting.
Decision support | Enable solutions that provide information that can assist a human in their work or support a decision made by a human.        

## Considerations when choosing a use case

Given the sensitive nature of health-related data, it is important to consider your use cases carefully. In all cases, a human should be making decisions, assisted by the information the system returns and there should be a way to review the source data and correct errors.

Do not use
  - **Do not use for scenarios that use this service as a medical device, clinical support, or diagnostic tools to be used in the diagnosis, cure, mitigation, treatment or prevention of disease or other conditions without a human intervention.** A qualified medical professional should always do due diligence and verify the source data regarding patient care decisions.
 - **Do not use for scenarios that use personal health information without appropriate consent.** Health information has special protections that may require explicit consent for certain use. Make sure you have appropriate consent to use health data.


## Characteristics and limitations

#### Inference values for tumor site and histology
Inference values for tumor site and histology are only as exhaustive as the training data set labels. We plan to publish this set of labels in the near future. If the model is presented with a cancer case for which the true tumor site or histology was not encountered during training (e.g. very rare tumor sites/histologies), the model will be unable to produce a correct inference result.

### Multiple cancer cases for a patient
The API infers only a single set of phenotype values (tumor site, histology, and clinical/pathologic TNM staging) per patient. If given an input with multiple primary cancer diagnoses, the behavior is undefined and may mix elements from the separate diagnoses.

### Pathologic and clinical staging
The models do not currently identify the initiation of a patient's definitive treatment, and therefore may use clinical staging evidence to infer a pathologic staging value, or vice-versa. Manual review should verify that appropriate evidence supports clinical and pathologic staging results.