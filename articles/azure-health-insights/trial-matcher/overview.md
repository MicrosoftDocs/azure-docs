---
title: Overview of the Trial Matcher
titleSuffix: Azure Health Insights
description:  Trial Matcher is designed to match patients to potentially suitable clinical trials and find group of potentially eligible patients to a list of clinical trials.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/27/2023
ms.author: behoorne
---

# Overview of the Trial Matcher

The Trial Matcher is a decision support model, offered within the context of the broader Azure Health Insights. Trial Matcher is designed to match patients to potentially suitable clinical trials and find group of potentially eligible patients to a list of clinical trials. 

Trial Matcher provides the user of the services two main modes of operation: **patients centric** and **clinical trial centric**. 
- On **patient centric** mode the Trial Matcher model bases the patient matching on the clinical condition, location, priorities, eligibility criteria, and other criteria that the patient and/or service users may choose to prioritize. The model helps narrow down and prioritize the set of relevant clinical trials to a smaller set of trials to start with, that the specific patient appears to be qualified for. 
- On **clinical trial centric**, the Trial Matcher is finding a group of patients potentially eligible to a clinical trial. The Trial Matcher narrows down the patients, first filtered on clinical condition and selected clinical observations, and then focuses on those patients who met the baseline criteria, to find the group of patients that appears to be eligible patients to a trial.

The Trial Matcher receives a list of patients, with their relevant health information, and trial configuration, and returns a list of inferences – whether the patient appears eligible or not for each trial. When a patient appears to be ineligible for a trial, the model provides evidence to support its conclusion. In addition to inferences, the model also indicates needed clinical information that is required to qualify patients to trials, which is not yet provided for the patient. This can be sent back to the model, to continue the qualification process for more accurate matching.


The Trial Matcher uses trial information and eligibility criteria from [clinicaltrials.gov](https://clinicaltrials.gov/). Trial information is updated on a periodic basis. In addition, the Trial Matcher can receive custom trial information and eligibility criteria that is provided by the service user, in case a trial is not yet published in [clinicaltrials.gov](https://clinicaltrials.gov/).


> [!IMPORTANT] 
> Trial Matcher is a capability provided “AS IS” and “WITH ALL FAULTS.” Trial Matcher is not intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability is not designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Trial Matcher. 


## Reference documentation and code samples
As you use this feature in your applications, see the following reference documentation and samples:

**Development option/language** | **Reference documentation**  | **Samples** 
------------------------|---------------------------|-------------------------
 C#                     |               |           


## Language support

The service currently supports the English language.


## Next steps

To get started using the OncoPhenotype model, you can 

>[!div class="nextstepaction"]
> [deploy the service via the portal](../deploy-portal.md) 