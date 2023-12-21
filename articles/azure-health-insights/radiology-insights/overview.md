---
title: What is Radiology Insights (Preview)
titleSuffix: Azure AI Health Insights
description: Enable healthcare organizations to process radiology documents and add various inferences.
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/6/2023
ms.author: janschietse
---


# What is Radiology Insights (Preview)?

Test Radiology Insights is a model that aims to provide quality checks as feedback on errors and inconsistencies (mismatches) and ensures critical findings are identified and communicated using the full context of the report. Follow-up recommendations and clinical findings with measurements (sizes) documented by the radiologist are also identified.

> [!IMPORTANT]
> The Radiology Insights model is a capability provided “AS IS” and “WITH ALL FAULTS.” The Radiology Insights model isn't intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability isn't designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of the Radiology Insights model. The customer is responsible for ensuring compliance with those license terms, including any geographic or other applicable restrictions.

## Radiology Insights features

To remain competitive and successful, healthcare organizations and radiology teams must have visibility into trends and outcomes specific to radiology operations and performance, with constant attention to quality.
The Radiology Insights model extracts valuable information from radiology documents for a radiologist.

**Identifying Mismatches**: A radiologist is provided with possible mismatches that are identified by the model between what the radiologist has documented in the radiology report and the information that was present in the metadata of the report. Mismatches can be identified for sex, age and body site laterality. Mismatches identify potential discrepancies between the dictated text and the provided metadata. They also identify potential inconsistencies within the dictated/written text. Inconsistencies are limited to gender, age, laterality and type of imaging.  This is only to allow the radiologist to rectify any potential inconsistencies during reporting. The system is not aware of the image the radiologist is reporting on. In no way does this model provides any clinical judgement of the radiologist's interpretation of the image. The radiologist is responsible for the diagnosis and treatment of patient and the correct documentation thereof.

**Providing Clinical Findings**: The model extracts as structured data two types of clinical findings: critical findings and actionable findings.  Only clinical findings that are explicitly documented in the report by the radiologist are extracted by the model. Clinical findings produced by the model are not deduced from pieces of information in the report nor from the image. These merely serve as a potential reminder for the radiologist to communicate with the provider.
The model produces two categories of clinical findings, Actionable Finding and Critical Result, and are based on the clinical finding, explicitly stated in the report, and criteria formulated by ACR (American College of Radiology). The model will always extract all findings explicitly documented by the radiologist.  The extracted findings may be used to alert a radiologist of possible clinical findings that need to be clearly communicated and acted on in a timely fashion by a healthcare professional. Customers may also utilize the extracted findings to populate downstream or related systems (such as EHRs or auto-schedule functions).

**Communicating Follow-up Recommendations**: A radiologist uncovers findings for which in some cases a follow-up is recommended. The documented recommendation is extracted and normalized by the model for communication to a healthcare professional (physician).
Follow-up recommendations are not generated, deduced or proposed. The model merely extract follow-up recommendation statements documented explicitly by the radiologist. Follow-up recommendations are normalized by coding to SNOMED.

**Reporting Measurements**: A radiologist documents clinical findings with measurements. The model extracts clinically relevant information pertaining to the finding. The model extracts measurements the radiologist explicitly stated in the report. The model is simply searching for measurements etc. that have already been taken and reviewed by the radiologist, extracting these from the relevant text-based record and structures them.  The extracted and structured measurement data may be used to see trends in measurements for a particular patient over time.  Or a customer could search a set of patients based on the measurement data extracted by the model.

**Reports on Productivity and Key Quality Metrics**: The Radiology Insights model extracted information can be used to generate reports and support analytics for a team of radiologists.  Based on the extracted information, dashboards and retrospective analyses can provide updates on productivity and key quality metrics to guide improvement efforts, minimize errors, and improve report quality and consistency.
The RI model is not creating dashboards but delivers extracted information, not deduced, that could be aggregated by a user for research and administrative purposes. The model is stateless.

## Language support

The service currently supports the English language.

## Limits and quotas

For the Public Preview, you can select the Free F0 SKU. The official pricing will be released after Public Preview.

## Next steps

Get started using the Radiology Insights model:

>[!div class="nextstepaction"]
> [Deploy the service via the portal](../deploy-portal.md)
