---
title: OncoPhenotype Inference information
description: This article provides OncoPhenotype Inference information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# OncoPhenotype Inference information

Our models were trained with labels that conform to the following standards.
- Tumor site and histology inferences: **WHO ICD-O-3** representation.
- Clinical and pathologic stage TNM category inferences: **American Joint Committee on Cancer (AJCC)'s 7th edition** of the cancer staging manual.


**INFERENCE TYPE** |**DESCRIPTION**                       |**VALUES**                              
-------------------|--------------------------------------|----------------------------------------
tumorSite          |The tumor site                        |None, ICD-O-3 tumor site code (C__. \_ )
histology          |The histology code                    |None, 4-digit ICD-O-3 histology code    
clinicalStageT     |The T category of the clinical stage  |None, T0, Tis, T1, T2, T3, T4           
clinicalStageN     |The N category of the clinical stage  |None, N0, N+                            
clinicalStageM     |The M category of the clinical stage  |None, M0, M1                            
pathologicStageT   |The T category of the pathologic stage|None, T0, Tis, T1, T2, T3, T4           
pathologicStageN   |The N category of the pathologic stage|None, N0, N+                            
pathologicStageM   |The M category of the pathologic stage|None, M0, M1          


## Confidence score
Each inference has an attribute called ```confidenceScore```  that expresses the confidence level for the inference value, ranging from 0 to 1. The higher the confidence score is, the more certain the model was about the inference value provided. The inference values should **not** be consumed without additional human review, no matter how high the confidence score is.

## Importance

Each evidence entity has an ```importance``` attribute called  that expresses how important that evidence was to predicting the inference value, ranging from 0 to 1. A higher importance value indicates that the model relied more on that specific evidence.

## Next steps

To get better insights into the request and responses, you can read more on following pages:

>[!div class="nextstepaction"]
> [Model Configuration](model-configuration.md) 
