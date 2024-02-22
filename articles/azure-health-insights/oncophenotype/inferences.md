---
title: Onco-Phenotype inference information
titleSuffix: Azure AI Health Insights
description: This article provides Onco-Phenotype inference information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# Onco-Phenotype inference information

Azure AI Health Insights Onco-Phenotype model was trained with labels that conform to the following standards.
- Tumor site and histology inferences: **WHO ICD-O-3** representation.
- Clinical and pathologic stage TNM category inferences: **American Joint Committee on Cancer (AJCC)'s 7th edition** of the cancer staging manual.

You can find an overview of the response values here: 

**Inference type** |**Description**                       |**Values**                              
-------------------|--------------------------------------|----------------------------------------
tumorSite          |The tumor site                        |`None, ICD-O-3 tumor site code (e.g. C34.2)`
histology          |The histology code                    |`None, 4-digit ICD-O-3 histology code`    
clinicalStageT     |The T category of the clinical stage  |`None, T0, Tis, T1, T2, T3, T4`           
clinicalStageN     |The N category of the clinical stage  |`None, N0, N+`                            
clinicalStageM     |The M category of the clinical stage  |`None, M0, M1`                            
pathologicStageT   |The T category of the pathologic stage|`None, T0, Tis, T1, T2, T3, T4`           
pathologicStageN   |The N category of the pathologic stage|`None, N0, N+`                            
pathologicStageM   |The M category of the pathologic stage|`None, M0, M1`         


## Confidence score

Each inference has an attribute called ```confidenceScore```  that expresses the confidence level for the inference value, ranging from 0 to 1. The higher the confidence score is, the more certain the model was about the inference value provided. The inference values should **not** be consumed without human review, no matter how high the confidence score is.

## Importance

When you set the ```includeEvidence``` property to ```true```, each evidence property has an ```importance``` attribute that expresses how important that evidence was to predicting the inference value, ranging from 0 to 1. A higher importance value indicates that the model relied more on that specific evidence.

## Next steps

To get better insights into the request and responses, read more on following page:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md) 
