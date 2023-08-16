---
title: What is Onco Phenotype (Preview)
titleSuffix: Project Health Insights
description: Enable healthcare organizations to rapidly identify key cancer attributes within their patient populations.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# What is Onco Phenotype (Preview)?

Onco Phenotype is an AI model that’s offered within the context of the broader Project Health Insights. It augments traditional clinical natural language processing tools by enabling healthcare organizations to rapidly identify key cancer attributes within their patient populations.


> [!IMPORTANT] 
> The Onco Phenotype model is a capability provided “AS IS” and “WITH ALL FAULTS.” The Onco Phenotype model isn't intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability isn't designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of the Onco Phenotype model. The customer is responsible for ensuring compliance with those license terms, including any geographic or other applicable restrictions.


## Onco Phenotype features
The Onco Phenotype model, available in the Project Health Insights cognitive service as an API, augments traditional clinical natural language processing (NLP) tools by helping healthcare providers rapidly identify key attributes of a cancer within their patient populations with an existing cancer diagnosis. You can use this model to infer tumor site; histology; clinical stage tumor (T), node (N), and metastasis (M) categories; and pathologic stage TNM categories from unstructured clinical documents, along with confidence scores and relevant evidence.

- **Tumor site** refers to the primary tumor location. 

- **Histology** refers to the cell type of a given tumor.

The following paragraph is adapted from  [American Joint Committee on Cancer (AJCC)'s Cancer Staging System](https://www.facs.org/quality-programs/cancer/ajcc/cancer-staging).

Cancer staging describes the severity of an individual's cancer based on the magnitude of the original tumor, as well as on the extent cancer has spread in the body. The Onco Phenotype model supports inferring two types of staging from the clinical documents - clinical staging and pathologic staging. They’re both expressed in the form of TNM categories, where TNM indicates the extent of the tumor (T), the extent of spread to the lymph nodes (N), and the presence of metastasis (M).

- **Clinical staging** determines the nature and extent of cancer based on the physical examination, imaging tests, and biopsies of affected areas. 

- **Pathologic staging** can only be determined from individual patients who have had surgery to remove a tumor or otherwise explore the extent of the cancer. Pathologic staging combines the results of clinical staging (physical exam, imaging test) with surgical results. 

The Onco Phenotype model enables cancer registrars to efficiently abstract cancer patients as it infers the above-mentioned key cancer attributes from unstructured clinical documents along with evidence that are relevant to those attributes. Leveraging this API can reduce the manual time spent combing through large amounts of patient documentation by focusing on the most relevant content in support of a clinician.


## Language support

The service currently supports the English language.

## Limits and quotas

For the Public Preview, you can select the Free F0 SKU. The official pricing will be released after Public Preview. 

## Next steps

Get started using the Onco Phenotype model:

>[!div class="nextstepaction"]
> [Deploy the service via the portal](../deploy-portal.md) 