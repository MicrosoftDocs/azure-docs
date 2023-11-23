---
title: Transparency Note for Onco Phenotype
description: Transparency Note for Onco Phenotype
services: azure-health-insights
author: psanapathi
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/11/2023
ms.author: prsanapa
---

# Transparency Note for Onco Phenotype

## What is a Transparency Note?

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, what its capabilities and limitations are, and how to achieve the best performance. Microsoft’s Transparency Notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system, or share them with the people who will use or be affected by your system.

Microsoft’s Transparency Notes are part of a broader effort at Microsoft to put our AI Principles into practice. To find out more, see the [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai).

## The basics of Onco Phenotype

### Introduction

The Onco Phenotype model, available in the Azure AI Health Insights cognitive service as an API, augments traditional clinical natural language processing (NLP) tools by helping healthcare providers rapidly identify key cancer attributes of a cancer within their patient populations with an existing cencer diagnosis. You can use this model to infer tumor site; histology; clinical stage tumor (T), lymph node (N), and metastasis (M) categories; and pathologic stage TNM categories from unstructured clinical documents, along with confidence scores and relevant evidence.

### Key terms

| Term               | Definition |
| ------------------ | ---------- |
| Tumor site         | The location of the primary tumor. |
| Histology          | The cell type of a given tumor.    |
| Clinical stage     | Clinical stage helps users determine the nature and extent of cancer based on the physical examination, imaging tests, and biopsies of affected areas. |
| Pathologic stage   | Pathologic stage can be determined only from individual patients who have had surgery to remove a tumor or otherwise to explore the extent of the cancer. Pathologic stage combines the results of clinical stage (physical exam, imaging test) with surgical results. |
| TNM categories     | TNM categories indicate the extent of the tumor (T), the extent of spread to the lymph nodes (N), and the presence of metastasis (M). |
| ICD-O-3            | _International Classification of Diseases for Oncology, Third Edition_. The worldwide standard coding system for cancer diagnoses. |

## Capabilities

### System behavior

The Onco Phenotype model, available in the Azure AI Health Insights cognitive service as an API, takes in unstructured clinical documents as input and returns inferences for cancer attributes along with confidence scores as output. Through the model configuration as part of the API request, it also allows the user to seek evidence with the inference values and to explicitly check for the existence of a cancer case before generating the inferences for cancer attributes.


Upon receiving a valid API request to process the unstructured clinical documents, a job is created and the request is processed asynchronously. The status of the job and the inferences (upon successful job completion) can be accessed by using the job ID. The job results are available for only 24 hours and are purged thereafter.

### Use cases

#### Intended uses

The Onco Phenotype model can be used in the following  scenario. The system’s intended uses include:

- **Assisted annotation and curation:** To support healthcare systems and cancer registrars identify and extract cancer attributes for regulatory purposes and for downstream tasks such as clinical trials matching, research cohort discovery, and molecular tumor board discussions.

#### Considerations when choosing a use case

We encourage customers to use the Onco Phenotype model in their innovative solutions or applications. However, here are some considerations when choosing a use case:

- **Avoid scenarios that use personal health information for a purpose not permitted by patient consent or applicable law.** Health information has special protections regarding privacy and consent. Make sure that all data you use has patient consent for the way you use the data in your system or you're otherwise compliant with applicable law as it relates to the use of health information.
- **Facilitate human review and inference error corrections.** Given the sensitive nature of health information, it's essential that a human review the source data and correct any inference errors.
- **Avoid scenarios that use this service as a medical device, for clinical support, or as a diagnostic tool or workflow without a human in the loop.** The system wasn't designed for use as a medical device, for clinical support, or as a diagnostic tool for the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions without human intervention. A qualified professional should always verify the inferences and relevant evidence before finalizing or relying on the information.

## Limitations

### Technical limitations, operational factors, and ranges

Specific characteristics and limitations of the Onco Phenotype model include:

- **Multiple cancer cases for a patient:** The model infers only a single set of phenotype values (tumor site, histology, and clinical/pathologic stage TNM categories) per patient. If the model is given an input with multiple primary cancer diagnoses, the behavior is undefined and might mix elements from the separate diagnoses.
- **Inference values for tumor site and histology:** The inference values are only as exhaustive as the training dataset labels. If the model is presented with a cancer case for which the true tumor site or histology wasn't encountered during training (for example, a rare tumor site or histology), the model will be unable to produce a correct inference result.
- **Clinical/pathologic stage (TNM categories):** The model doesn't currently identify the initiation of a patient's definitive treatment. Therefore, it might use clinical stage evidence to infer a pathologic stage value or vice-versa. Manual review should verify that appropriate evidence supports clinical and pathologic stage results. The model doesn't predict subcategories or isolated tumor cell modifiers. For instance, T3a would be predicted as T3, and N0(i+) would be predicted as N0.

## System performance

In many AI systems, performance is often defined in relation to accuracy or by how often the AI system offers a correct prediction or output. Depending on the workflow or scenario, you can leverage the confidence scores that are returned with each inference and choose to set thresholds based on the tolerance for incorrect inferences. The performance of the system can be assessed by computing statistics based on true positive, true negative, false positive, and false negative instances. For example, in the tumor site predictions, one can consider a tumor site (like lung) being the positive class and other sites, including not having one, being the negative class. Using the lung tumor site as an example positive class, the following table illustrates different outcomes.

| **Outcome**    | **Correct/Incorrect** | **Definition** | **Example** |
| -------------- | --------------------- | -------------- | ----------- |
| True Positive  | Correct   | The system returns the tumor site as lung and that would be expected from a human judge. | The system correctly infers the tumor site as lung on the clinical documents of a lung cancer patient. |
| True Negative  | Correct   | The system doesn't return the tumor site as lung, and this aligns with what would be expected from a human judge. | The system returns the tumor site as breast on the clinical documents of a breast cancer patient. |
| False Positive | Incorrect | The system returns the tumor site as lung where a human judge wouldn't. | The system returns the tumor site as lung on the clinical documents of a breast cancer patient. |
| False Negative | Incorrect | The system doesn't return the tumor site as lung where a human judge would identify it as lung. | The system returns the tumor site as breast on the clinical documents of a lung cancer patient. |

### Best practices for improving system performance

For each inference, the Onco Phenotype model returns a confidence score that expresses how confident the model is with the response. Confidence scores range from 0 to 1. The higher the confidence score, the more certain the model is about the inference value it provided. However, the system isn't designed for workflows or scenarios without a human in the loop. Also, inference values can't be consumed without human review, irrespective of the confidence score. You can choose to completely discard an inference value if its confidence score is below a confidence score threshold that best suits the scenario.

## Evaluation of Onco Phenotype

### Evaluation methods

The Onco Phenotype model was evaluated on a held-out dataset that shares the same characteristics as the training dataset. The training and held-out datasets consist of patients located only in the United States. The patient races include White or Caucasian, Black or African American, Asian, Native Hawaiian or Pacific Islander, American Indian or Alaska native, and Other. During model development and training, a separate development dataset was used for error analysis and model improvement.

### Evaluation results

Although the Onco Phenotype model makes mistakes on the held-out dataset, it was observed that the inferences, and the evidence spans identified by the model are helpful in speeding up manual curation effort.

Microsoft has also tested the generalizability of the model by evaluating the trained model on a secondary dataset that was collected from a different hospital system, and which was unavailable during training. A limited performance decrease was observed on the secondary dataset.

#### Fairness considerations

At Microsoft, we strive to empower every person on the planet to achieve more. An essential part of this goal is working to create technologies and products that are fair and inclusive. Fairness is a multi-dimensional, sociotechnical topic and impacts many different aspects of our product development. You can learn more about Microsoft’s approach to fairness [here](https://www.microsoft.com/ai/responsible-ai?rtc=1&activetab=pivot1:primaryr6).

One dimension we need to consider is how well the system performs for different groups of people. This might include looking at the accuracy of the model and measuring the performance of the complete system. Research has shown that without conscious effort focused on improving performance for all groups, it's often possible for the performance of an AI system to vary across groups based on factors such as race, ethnicity, language, gender, and age.

The evaluation performance of the Onco Phenotype model was stratified by race to ensure minimal performance discrepancy between different patient racial groups. The lowest performance by racial group is well within 80% of the highest performance by racial group. When the evaluation performance was stratified by gender, there was no significant difference.

However, each use case is different, and our testing might not perfectly match your context or cover all scenarios that are required for your use case. We encourage you to thoroughly evaluate error rates for the service by using real-world data that reflects your use case, including testing with users from different demographic groups.

## Evaluating and integrating Onco Phenotype for your use

As Microsoft works to help customers safely develop and deploy solutions that use the Onco Phenotype model, we offer guidance for considering the AI systems' fairness, reliability & safety, privacy &security, inclusiveness, transparency, and human accountability. These considerations are in line with our commitment to developing responsible AI.

When getting ready to integrate and use AI-powered products or features, the following activities help set you up for success:

- **Understand what it can do:** Fully vet and review the capabilities of Onco Phenotype to understand its capabilities and limitations.
- **Test with real, diverse data:** Understand how Onco Phenotype will perform in your scenario by thoroughly testing it by using real-life conditions and data that reflects the diversity in your users, geography, and deployment contexts. Small datasets, synthetic data, and tests that don't reflect your end-to-end scenario are unlikely to sufficiently represent your production performance.
- **Respect an individual's right to privacy:** Collect data and information from individuals only for lawful and justifiable purposes. Use data and information that you have consent to use only for this purpose.
- **Legal review:** Obtain appropriate legal advice to review your solution, particularly if you'll use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and your responsibility to resolve any issues that might come up in the future.
- **System review:** If you're planning to integrate and responsibly use an AI-powered product or feature in an existing system of software or in customer and organizational processes, take the time to understand how each part of your system will be affected. Consider how your AI solution aligns with Microsoft's Responsible AI principles.
- **Human in the loop:** Keep a human in the loop. This means ensuring constant human oversight of the AI-powered product or feature and maintaining the role of humans in decision-making. Ensure that you can have real-time human intervention in the solution to prevent harm. This enables you to manage where the AI model doesn't perform as expected.
- **Security:** Ensure that your solution is secure and that it has adequate controls to preserve the integrity of your content and prevent unauthorized access.
- **Customer feedback loop:** Provide a feedback channel that allows users and individuals to report issues with the service after it's deployed. After you've deployed an AI-powered product or feature, it requires ongoing monitoring and improvement. Be ready to implement any feedback and suggestions for improvement.

## Learn more about responsible AI

[Microsoft AI Principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6)

[Microsoft responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)

[Microsoft Azure Learning courses on responsible AI](/training/paths/responsible-ai-business-principles/)

## Learn more about Onco Phenotype

[Overview of Onco Phenotype](overview.md)

## Contact us

[Give us feedback on this document](mailto:health-ai-feedback@microsoft.com).

## About this document

© 2023 Microsoft Corporation. All rights reserved. This document is provided "as-is" and for informational purposes only. Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred.
