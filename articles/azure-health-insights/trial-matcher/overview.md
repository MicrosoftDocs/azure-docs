---
title: What is Trial Matcher (Preview)
titleSuffix: Azure AI Health Insights
description:  Trial Matcher is designed to match patients to potentially suitable clinical trials and find group of potentially eligible patients to a list of clinical trials.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/27/2023
ms.author: behoorne
---

# What is Trial Matcher (Preview)?

The Trial Matcher is an AI model, offered within the context of the broader Azure AI Health Insights. Trial Matcher is designed to match patients to potentially suitable clinical trials or find a group of potentially eligible patients to a list of clinical trials.

- Trial Matcher receives a list of patients, including their relevant health information and trial configuration. Then it returns a list of inferences – whether the patient appears eligible or not eligible for each trial. 
- When a patient appears to be ineligible for a trial, the model provides evidence to support its conclusion. 
- In addition to inferences, the model also indicates if any necessary clinical information required to qualify patients for trials has not yet been provided by the patient. This can be sent back to the model to continue the qualification process for more accurate matching.

## Two different modes 

Trial Matcher provides the user of the services two main modes of operation: **patient centric** and **clinical trial centric**. 

- On **patient centric** mode, the Trial Matcher model bases the patient matching on the clinical condition, location, priorities, eligibility criteria, and other criteria that the patient and/or service users may choose to prioritize. The model helps narrow down and prioritize the set of relevant clinical trials to a smaller set of trials to start with, that the specific patient appears to be qualified for. 
- On **clinical trial centric**, the Trial Matcher is finding a group of patients potentially eligible to a clinical trial. The Trial Matcher narrows down the patients, first filtered on clinical condition and selected clinical observations, and then focuses on those patients who met the baseline criteria, to find the group of patients that appears to be eligible patients to a trial.

## Trial information and eligibility 

The Trial Matcher uses trial information and eligibility criteria from [clinicaltrials.gov](https://clinicaltrials.gov/). Trial information is updated on a periodic basis. In addition, the Trial Matcher can receive custom trial information and eligibility criteria that were provided by the service user, in case a trial isn't yet published in [clinicaltrials.gov](https://clinicaltrials.gov/).


> [!IMPORTANT] 
> Trial Matcher is a capability provided “AS IS” and “WITH ALL FAULTS.” Trial Matcher isn't intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability isn't designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Trial Matcher. 


## Azure Health Bot Integration 

Trial Matcher comes with a template for the [Azure Health Bot](/azure/health-bot/), a service that creates virtual assistants for healthcare. It can communicate with Trial Matcher to help users match to clinical trials using a conversational mechanism. 

- The Azure Health Bot template includes LUIS language model and a resource file that integrates Trial Matcher with Azure Health Bot and demonstrates how to use it.
- The template also includes example scenarios and specific steps to send custom telemetry events to Application Insights. This enables customers to produce analytics and get insights on usage.
- Customers can completely customize the Health Bot scenarios and localize the strings into any language.
Contact the product team to get the Trial Matcher template for the Azure Health Bot.” 

> **Contact the product team above to the contact information.**  



## Language support

Trial Matcher currently supports the English language.

## Limits and quotas
For the public preview, you can select the F0 (free) sku. 
The official prices will be released after public preview.

## Next steps

To get started using the Trial Matcher: 

>[!div class="nextstepaction"]
> [Deploy the service via the portal](../deploy-portal.md) 