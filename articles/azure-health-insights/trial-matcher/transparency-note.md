---
title: Transparency Note for Trial Matcher
titleSuffix: Project Health Insights
description: Microsoft's Transparency Note for Trial Matcher intended to help understand how our AI technology works
services: azure-health-insights
author: adishachar
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 05/28/2023
ms.author: adishachar
---


# What is a Transparency Note?

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, what its capabilities and limitations are, and how to achieve the best performance. Microsoft’s Transparency Notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system or share them with the people who will use or be affected by your system. 
Microsoft’s Transparency Notes are part of a broader effort at Microsoft to put our AI Principles into practice. To find out more, see the [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai). 


## The basic of Trial Matcher

### Introduction

Trial Matcher is a model that’s offered as part of Azure Health Insights   cognitive service. You can use Trial Matcher to build solutions that help clinicians make decisions about whether further examination of potential eligibility for clinical trials should take place.
Organizations can use the Trial Matcher model to match patients to potentially suitable clinical trials based on trial condition, site location, eligibility criteria, and patient details. Trial Matcher helps researchers and organizations match patients with trials based on the patient’s unique characteristics and find a group of potentially eligible patients to match to a list of clinical trials.


### Key terms
| Term | What is it |  |  | | | 
|----------|--|--|--|--|--| 
| Patient centric | Trial Matcher, when powering a single patient trial search, helps a patient narrow down the list of potentially suitable clinical trials based on the patient’s clinical information. | | 
| Trial centric | Trial Matcher, when powering search for eligible patients to clinical trial, is   provided with list of clinical trials (one or more) and multiple patients’ information. The model is using the matching technology to find which patients could potentially be suitable for each trial. | |
| Evidence | For each trial that the model concludes the patient is not eligible for, the model returns the relevant patient information and the eligibility criteria that the model used to exclude the patient from trial eligibility. | |
| Gradual matching | The model can provide patient information with gradual matching. In this mode, the user can send requests to Trial Matcher gradually, primarily via conversational intelligence or chat-like scenarios. | |



## Capabilities

### System behavior
Trial Matcher analyzes and matches clinical trial eligibility criteria and patients’ clinical information.
Clinical trial eligibility criteria are extracted from clinical trials available on clinicaltrials.gov or provided by the service user as a custom trial. Patient clinical information is provided either as unstructured clinical note, FHIR  bundles or key-value schema.

Trial Matcher uses [Text Analytics for health](/azure/ai-services/language-service/text-analytics-for-health/overview) to identify and extract medical entities in case the information provided is unstructured, either from clinical trial protocols from clinicaltrials.gov, custom trials and patient clinical notes.

When Trial Matcher is in patient centric mode, it returns a list of potentially suitable clinical trials, based on the patient clinical information. When Trial Matcher is in trial centric mode, it     returns a list of patients who are potentially eligible for a clinical trial.   The Trial Matcher results should be reviewed by a human decision maker for a further full qualification.
Trial Matcher results also include an explainability layer. When a patient appears to be ineligible for a trial, Trial Matcher provides evidence of why the patient is not eligible to meet the criteria of the specific trial.

The Trial Matcher algorithm is recall-optimized. It lists a patient as ineligible for a trial only when there is a high probability that a criteria is not met     (one or more criteria). This approach minimizes the number of false negative cases and helps avoid a potential trial from being eliminated as an option for a patient.


### Use cases 

#### Intended uses
Trial Matcher can be used in multiple scenarios. The system’s intended uses include:

##### One patient trial search (patient-centric): 
Assist a single patient or a caregiver find potentially suitable clinical trials based on the patient’s clinical information. 

##### Trial feasibility assessment: 
Assist in a feasibility assessment of a single clinical trial based on patient data repositories. A pharmaceutical company or contract research organization (CRO) uses patient data repositories to identify patients who might be suitable for a single trial they are recruiting for. 
##### Provider-site matching (trial-centric): 
Match a list of clinical trials with multiple patients. Assist a provider or CRO to find patients from a database of multiple patients, who might be suitable for trials.   

##### Eligibility assessment: 
Verify single-patient eligibility for a single trial and show the criteria that renders the patient ineligible  . Assists a trial coordinator to screen and qualify a single patient for a specific trial and to understand the gaps in the match.


#### Considerations when choosing other use cases
We encourage customers to leverage Trial Matcher in their innovative solutions or applications. However, here are some considerations when you choose a use case: 
* Carefully consider the use of free text as input for the trial condition and location. Incorrect spelling of these parameters might reduce effectiveness and lead to   potential matching results that are less focused and/or less accurate.
* Trial Matcher is not suitable for unsupervised decision making to determine whether a patient is eligible to participate   in a clinical trial. To avoid preventing access to possible treatment for eligible patients, Trial Matcher results should always be reviewed and interpreted by a human who makes any decisions related to participation in clinical trials.
* Trial Material should not be used as a medical device, to provide clinical support, or as a diagnostic tool used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions without human intervention. A qualified medical professional should always do due diligence and verify the source data that might influence any decisions related to participation in clinical trials.


## Limitations

### Technical limitations, operational factors, and ranges
* Trial Matcher is available only in English.
* Since Trial Matcher is based on TA4H for analyzing unstructured text, please refer to [Text Analytics for health Transparency Note](/legal/cognitive-services/language-service/transparency-note-health?context=/azure/azure-health-insights/trial-matcher/context/context)
for further information.


## System performance

### Best practices for improving system performance   
* When you use Trial Matcher for a trial-centric use case, we recommend that you use a filtering criterion that is relevant to the clinical trial to narrow the list of patients that are potentially eligible for the trial. For example, initially filter patients by using a relevant medical condition. Then, use Trial Matcher to refine the list of eligible patients, starting from the cohort of patients that meet the baseline criteria.  
* The Trial Matcher model infers a patient as ineligible for a clinical trial based on evidence in the patient's information. To improve the quality of the matching results, we recommend that you provide patient information that is as detailed and up to date as possible.


## Learn more about responsible AI
* [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai).
* [Microsoft responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources).
* [Microsoft Azure Learning courses on responsible AI](/learn/paths/responsible-ai-business-principles/).


## Learn more about Text Analytics For Health
[Text Analytics for Health Transparency Note](/legal/cognitive-services/language-service/transparency-note-health?context=/azure/azure-health-insights/trial-matcher/context/context).


## About this document
© 2023 Microsoft Corporation. All rights reserved. This document is provided "as-is" and for informational purposes only. Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred.
