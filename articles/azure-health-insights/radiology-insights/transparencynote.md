---
title: Transparency Note for Radiology Insightse
description: Transparency Note for Radiology Insights
services: azure-health-insights
author: janschietse
ms.service: azure-health-insights
ms.topic: overview
ms.date: 06/12/2023
ms.author: janschietse
---

# Transparency note for Radiology Insights (Preview)

## What is a Transparency Note?

Please do not edit or remove this section.
An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, what its capabilities and limitations are, and how to achieve the best performance. Microsoft’s Transparency Notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system, or share them with the people who will use or be affected by your system.
Microsoft’s Transparency Notes are part of a broader effort at Microsoft to put our AI Principles into practice. To find out more, see the Microsoft AI principles.

## The basics of Radiology Insights

### Introduction

Radiology Insights (RI) is a model that aims to provide quality checks as feedback on errors and inconsistencies (mismatches) and  helps identify and communicate critical findings using the full context of the report. Follow-up recommendations and clinical findings with measurements (sizes) documented by the radiologist are also identified.

•Radiology Insights is a built-in AI software model, delivered within Project Health Insights Azure AI service
•Radiology Insights does not provide external references. As a Health Insights model, Radiology Insights provides inferences to the provided input, to be used as reference for profound understanding of the conclusions of the model.

The Radiology Insights feature of Azure Health Insights uses natural language processing techniques to process unstructured medical radiology documents and add several types of inferences that will help the user to effectively monitor, understand, and improve financial and clinical outcomes in a radiology workflow context.
The types of inferences currently supported by the system are: AgeMismatch, SexMismatch, LateralityDiscrepancy, CompleteOrderDiscrepancy, LimitedOrderDiscrepancy, Finding, CriticalResult, FollowupRecommendation, RadiologyProcedure, Communication.
These inferences can be used both to support clinical analytics or to provide real time assistance during the document creation process.

        •RI enables to slice and dice the radiology workflow data and create insights that matter, leading to actionable information.
        
        •RI enables to analyze the past and improve the future by generating meaningful insights that reveal strengths and pinpoint areas needing intervention.
        
        •RI enables to create quality checks and automated, in‑line alerts for mismatches and possible critical findings.
        
        •RI improve follow‑up recommendation consistency with AI‑driven, automated guidance support and quality checks that drive evidence‑based clinical decisions.

Radiology Insights can receive unstructured text in English as part of its current offering, and leverages TA4H for NER, extraction of relations between identified entities, to surfaces assertions such as negation and conditionality, and to link detected entities to common vocabularies.

### Key terms

|Term | Definition                                                                |
|-----|---------------------------------------------------------------------------|
|Document| The input of the RI model is a Radiology Clinical document, which next to the narrative information also contains meta data containing patient info and procedure order specifications.|
|Inference| The output of the RI model are a list of inferences or annotations added to the document processed.|
|AgeMismatch| Annotation triggered when there is discrepancy between age information in meta-data and narrative text .|
|SexMismatch| Annotation triggered when there is discrepancy between sex information in meta-data and narrative text (includes patient references, sex specific findings and sex specific body parts).|
|LateralityDiscrepancy| Annotation triggered when there is a discrepancy between laterality information in meta-data and narrative text or between findings and impression section in report text.
|CompleteOrderDiscrepancy| Annotation triggered when report text doesn't contain all relevant body parts according to information in the metadata that a complete study is ordered.
|LimitedOrderDiscrepancy| Annotation triggered when limited selection of body parts according to the procedure order present in meta-data should be checked, but report text includes all relevant body parts.
|Finding| Annotation that identifies and highlights an assembly of clinical information pertaining to a, clinically relevant, notion found in the report text.
|CriticalResult| Annotation that identifies and highlights findings in report text that should be communicated within a certain time limit according to regulatory compliance.
|FollowupRecommendation| Annotation that identifies and highlights one or more recommendations in the report text and provides a normalization of each recommendation to a set of structured data fields.
|RadiologyProcedure| Normalization of procedure order information present in meta-data using Loinc/Radlex codes.
|Communication| Annotation that identifies and highlights when noted in report text that the findings are strict or non-strictly communicated with the recipient.

## Capabilities

### System behavior

The Radiology Insight will add several types of inferences/annotations to the original radiology clinical document. A document can trigger one or more annotations. Several instances of the same annotation in one document are possible.

                •AgeMismatch
                
                •SexMismatch
                
                •LateralityDiscrepancy
                
                •CompleteOrderDiscrepancy
                
                •LimitedOrderDiscrepancy
                
                •Finding
                
                •CriticalResult
                
                •FollowupRecommendation
                
                •RadiologyProcedure
                
                •Communication

Example of a Clinical Radiology document with inferences:

![Example](TestImagemd.png)

### Functional description of the inferences in scope and examples

**Age Mismatch**
• Age mismatches are identified based on comparison of available Patient age information within Patient’s demographic meta-data and the report text; i.e. conflicting age information will be tagged in the text.

**Sex Mismatch**
• Gender mismatches identification is based on a comparison of the Patient gender information within Patient’s demographic meta-data on the one hand and on the other hand patient references (female/male, he/she/his/her), gender specific findings and gender-specific body parts in the text.
• Opposite gender terms will be tagged in the report text.

**Laterality Discrepancy**
• A laterality, defined as “Left” (Lt, lft) and “Right” (rt, rght), along with an Anatomy (body parts) in the Procedure Description of the meta-data Procedure Order is used to create Laterality mismatches in the report.
• No Mismatches on past content
• If only Laterality and no Anatomy is available in the Procedure Description, all opposite laterality in the text are tagged. For example: “left views” in Procedure Description will list all “right” words in the report text.

**CompleteOrder Descrepancy**
• Completeness mismatches can be made if the ordered procedure is an ultrasound for the ABDOMEN, RETROPERITONEAL, PELVIS, or US BREAST.
• A completeness mismatch is made if either the order is complete and the text is not, or vice versa.

**LimitedOrder Descrepancy**
• Completeness mismatches can be made if the ordered procedure is an ultrasound for the ABDOMEN, RETROPERITONEAL, PELVIS, or US BREAST.
• A completeness mismatch is made if either the order is complete and the text is not, or vice versa.

**Finding**
• A  Finding is an NLU-based assembly of clinical information pertaining to a, clinically relevant, notion found in medical records. It is created as such that it is application-independent.
• A Finding inference consists out of different fields, all containing pieces to assemble a complete overview of what the Finding is.  
o A Finding can consist out of the following fields:
Clinical Indicator, AnatomyLateralityInfo about Size, Acuity, Severity, Cause, Status, Multiple – check, RegionFeatures, Timing

**Critical Result**
• Identifies and highlights potential critical results dictated in a report.
• Identifies and highlights potential ACR Actionable Findings dictated in a report.
o Only Identifies Critical Result in the report text (not in metadata)
o The terms are based on Mass Coalition for the Prevention of Medical Errors
<http://www.macoalition.org/Initiatives/docs/CTRstarterSet.xls>

**FollowupRecommendation**
• This inference surfaces a potential visit that needs to be scheduled. Each recommendation contains one modality and one body part and can, in addition, contain a time, a laterality, one or multiple findings and an indication that a conditional phrase is present (true or false).

**RadiologyProcedure**
• Radiology Insights extracts information such as modality, body part, laterality, view and contrast from the procedure order. Ordered procedures are normalized using the Loinc codes using the LOINC/RSNA Radiology Playbook that is developed and maintained by the LOINC/RadLex Committee.
<http://playbook.radlex.org/playbook/SearchRadlexAction>

**COMMUNICATION**
• RI captures language in the text, typically a verb indicating communication in combination with a proper name (typical First and Last Name) or a reference to a clinician or nurse. There can be several such recipients.
• Communication to non-medical staff (secretary, clerks, etc.) is not tagged as communication unless the proper name of this person is mentioned, language identified as past communication (for example in history sections) or future communication (for example ‘will be communicated’) is not tagged as communication.

## Examples

![Example RI 1](TestImagemd.png)


## Use cases

To remain competitive and successful, healthcare organizations and radiology teams must have visibility into trends and outcomes specific to radiology operations and performance, with constant attention to quality.
The Radiology Insights model extracts valuable information from radiology documents for a radiologist.

The scope of each of these use cases is always the current document the radiologist is dictating. There is no image analysis nor patient record information involved. The metadata provides administrative context for the current report and is limited to patient age, patient sex, and the procedure that was ordered. (e.g.,: CT of abdomen, MRI of the brain,…)

Microsoft is providing this functionality as an API with the model that allows for the information described below to be identified or extracted.  The customer would incorporate the model into their own or third-party radiology reporting software and would determine the user interface for the information.  Customers could be an ISV or a health system developing or modifying radiology reporting software for use within the health system.  Thus, the specific use cases by customers and how the information would be presented or used by a radiologist may vary slightly from that described below (e.g., in use case 1 below, how a mismatch would be identified to the radiologist may vary), but the descriptions below illustrate the intended purpose of the API functionality.

• **Use Case 1 – Identifying Mismatches**: A radiologist is provided with possible mismatches that are identified by the model between what the radiologist has documented in the radiology report and the information that was present in the metadata of the report. Mismatches can be identified for sex, age and body site laterality. Mismatches identify potential discrepancies between the dictated text and the provided metadata. They also identify potential inconsistencies within the dictated/written text. Inconsistencies are limited to gender, age, laterality and type of imaging.  This is only to allow the radiologist to rectify any potential inconsistencies during reporting. The system is not aware of the image the radiologist is reporting on. In no way does this model provides any clinical judgement of the radiologist's interpretation of the image. The radiologist is responsible for the diagnosis and treatment of patient and the correct documentation thereof.

• **Use Case 2 – Providing Clinical Findings**: The model extracts as structured data two types of clinical findings: critical findings and actionable findings.  Only clinical findings that are explicitly documented in the report by the radiologist are extracted by the model. Clinical findings produced by the model are not deduced from pieces of information in the report nor from the image. These merely serve as a potential reminder for the radiologist to communicate with the provider.
The model produces two categories of clinical findings, Actionable Finding and Critical Result, and are based on the clinical finding, explicitly stated in the report, and criteria formulated by ACR (American College of Radiology). The model will always extract all findings explicitly documented by the radiologist.  The extracted findings may be used to alert a radiologist of possible clinical findings that need to be clearly communicated and acted on in a timely fashion by a healthcare professional. Customers may also utilize the extracted findings to populate downstream or related systems (such as EHRs or auto-schedule functions).

• **Use Case 3 – Communicating Follow-up Recommendations**: A radiologist uncovers findings for which in some cases a follow-up is recommended. The documented recommendation is extracted and normalized by the model for communication to a healthcare professional (physician).
Follow-up recommendations are not generated, deduced or proposed. The model merely extract follow-up recommendation statements documented explicitly by the radiologist. Follow-up recommendations are normalized by coding to SNOMED.

• **Use Case 4 – Reporting Measurements**: A radiologist documents clinical findings with measurements. The model extracts clinically relevant information pertaining to the finding. The model extracts measurements the radiologist explicitly stated in the report. The model is simply searching for measurements etc. that have already been taken and reviewed by the radiologist, extracting these from the relevant text-based record and structures them.  The extracted and structured measurement data may be used to see trends in measurements for a particular patient over time.  Or a customer could search a set of patients based on the measurement data extracted by the model.

• **Use Case 5 - Reports on Productivity and Key Quality Metrics**: The Radiology Insights model extracted information (information extracted in use cases 1 to 5) can be used to generate reports and support analytics for a team of radiologists.  Based on the extracted information, dashboards and retrospective analyses can provide updates on productivity and key quality metrics to guide improvement efforts, minimize errors, and improve report quality and consistency.
The RI model is not creating dashboards but delivers extracted information, not deduced, that could be aggregated by a user for research and administrative purposes. The model is stateless.

### Considerations when choosing other use cases

Radiology Insights is a valuable tool to extract knowledge from unstructured medical text and support the radiology documentation workflow. However, given the sensitive nature of health-related data, it's important to consider your use cases carefully. In all cases, a human should be making decisions assisted by the information the system returns, and in all cases, you should have a way to review the source data and correct errors. Here are some additional considerations when choosing a use case:

• Avoid scenarios that use this service as a medical device, to provide clinical support, or as a diagnostic tool to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions without human intervention. A qualified medical professional should always do due diligence, verify source data that might influence patient care decisions and make decisions.

• Avoid scenarios related to automatically granting or denying medical services or health insurance without human intervention. Because decisions that affect coverage levels are extremely impactful, source data should always be verified in these scenarios.

• Avoid scenarios that use personal health information for a purpose not permitted by patient consent or applicable law. Health information has special protections regarding privacy and consent. Make sure that all data you use has patient consent for the way you use the data in your system or you are otherwise compliant with applicable law as it relates to the use of health information.

• Carefully consider using detected inferences to update patient records without human intervention. Make sure that there is always a way to report, trace, and correct any errors to avoid propagating incorrect data to other systems. Ensure that any updates to patient records are reviewed and approved by qualified professionals.

• Carefully consider using detected inferences in patient billing without human intervention. Make sure that providers and patients always have a way to report, trace, and correct data that generates incorrect billing.

• Radiology Insights is not intended to be used for administrative functions.

### Limitations

The specific characteristics of the input radiology document is crucial to get actionable, accurate output from the RI model. Some of the items playing an important role in this are:

• Languages: Currently RI capabilities are enabled for English text only.
• Unknown words: radiology documents sometimes contain unknown abbreviations/words or out of context homonyms or spelling mistakes
• Input Metadata: RI expects for certain types of inferences that input information is available in the document or in the meta data of the document.
• Templates and formatting: RI has been developed using a real world, representative set of documents, but it is possible that specific use cases and/or document templates can cause challenges for the RI logic to be accurate. As an example, nested tables or complicated structures can cause suboptimal parsing.
• Vocabulary & descriptions: RI is developed and tested on real world documents. However, natural language is very rich and description of certain clinical facts can vary over time possibly impacting the output of the logic.

### System performance

The performance of the system can be assessed by computing statistics based on true positive, true negative, false positive, and false negative instances. In order to do so, a representative set of documents have to build, eventually annotated with the expected outcomes. Output of RI can be compared with the desired output to determine the accuracy numbers.

The main reasons for Radiology Insights to trigger False Positive / False Negative output are:

        • Input document not containing all necessary meta information
        • Input document format and formatting
                o Section headings
                o Punctuation
        •Non English docs
        •Unknown words (abbreviations, misspellings, …)
        •Issues with parsing complex formatting (nested tables, …)

## Evaluation of Radiology Insights

### Evaluation methods

Radiology insight logic has been developed and evaluated using a large set of real world clinical radiology documents. A trainset of 5000+ docs has been annotated by human experts and is used to implement and refine the logic triggering the RI inferences. Part of this set is randomly sampled from a corpus provided by a US medical centre and focused mostly on adult patients.

The set used provides almost equal representation of US based male and female patients, and adequate representation of every age group.   It should be noted that no further analysis of the training data representativeness (for example, geographic, demographic, or ethnographic representation) has been performed since the data does not includes that type of meta data. The trainset and other evaluation sets used have been constructed making sure that all types of inferences are present for different types of patient characteristics (Age, Sex).
Accuracy or regression of the logic is tracked by unit and functional tests covering the complete logic scope. Generalization of RI models is assessed by using left-out sets of documents sharing the same characteristics of the trainset.

Targeted minimum performance levels for each across the complete population of evaluation documents have been evaluated, tracked and reviewed together with Subject matter experts.
All underlying core NLP & NLU components are separately checked and reviewed using specific testsets.

### Evaluation results

Evaluation metrics used are precision, recall and f1 scoring when manual golden truth annotations are present.
Regression testing is done via discrepancy analysis and human expert feedback cycles.
Although the Radiology Insight model makes mistakes, it was observed that the inferences, and the medical info surfaced do add value in the intended use usecases targeted, and have positive effect on the radiology workflow.

Evaluating and integrating Radiology Insights for your use
When you're getting ready to deploy Radiology Insights, the following activities help set you up for success:

• Understand what it can do: Fully assess the capabilities of RI to understand its capabilities and limitations. Understand how it will perform in your scenario and context.

• Test with real, diverse data: Understand RI how will perform in your scenario by thoroughly testing it by using real-life conditions and data that reflect the diversity in your users, geography, and deployment contexts. Small datasets, synthetic data, and tests that don't reflect your end-to-end scenario are unlikely to sufficiently represent your production performance.

• Respect an individual's right to privacy: Only collect or use data and information from individuals for lawful and justifiable purposes. Use only the data and information that you have consent to use or are legally permitted to use.

• Legal review: Obtain appropriate legal review of your solution, particularly if you will use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and any risks that need to be mitigated prior to use. It is your responsibility to mitigate such risks and resolve any issues that might come up.

• System review: If you plan to integrate and responsibly use an AI-powered product or feature into an existing system for software or customer or organizational processes, take time to understand how each part of your system will be affected. Consider how your AI solution aligns with Microsoft Responsible AI principles.

• Human in the loop: Keep a human in the loop and include human oversight as a consistent pattern area to explore. This means constant human oversight of the AI-powered product or feature and ensuring humans making any decisions that are based on the model’s output. To prevent harm and to manage how the AI model performs, ensure that humans have a way to intervene in the solution in real time.

• Security: Ensure that your solution is secure and that it has adequate controls to preserve the integrity of your content and prevent unauthorized access.

• Customer feedback loop: Provide a feedback channel that users and individuals can use to report issues with the service after it's deployed. After you deploy an AI-powered product or feature, it requires ongoing monitoring and improvement. Have a plan and be ready to implement feedback and suggestions for improvement.
