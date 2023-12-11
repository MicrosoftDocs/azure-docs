---
title: What is Azure AI Health Insights (Preview)
titleSuffix: Azure AI Health Insights
description: Improved quality of health care and Improved efficiency and cost-benefit, by reducing the time spent by healthcare professional
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---

# What is Azure AI Health Insights (Preview)?

Azure AI Health Insights is a Cognitive Service providing an API that serves insight models, which perform analysis and provide inferences to be used by a human. The models can receive input in different modalities, and return insight inferences including evidence as a result, for key high value scenarios in the health domain

> [!IMPORTANT] 
> Azure AI Health Insights is a capability provided “AS IS” and “WITH ALL FAULTS.” Azure AI Health Insights isn't intended or made available for use as a medical device, clinical support, diagnostic tool, or other technology intended to be used in the diagnosis, cure, mitigation, treatment, or prevention of disease or other conditions, and no license or right is granted by Microsoft to use this capability for such purposes. This capability isn't designed or intended to be implemented or deployed as a substitute for professional medical advice or healthcare opinion, diagnosis, treatment, or the clinical judgment of a healthcare professional, and should not be used as such. The customer is solely responsible for any use of Azure AI Health Insights. 

## Why use Azure AI Health Insights?

Health and Life Sciences organizations have multiple high-value business problems that require clinical insights inferences that are based on clinical data. 
Azure AI Health Insights is a Cognitive Service that provides prebuilt models that assist with solving those business problems.

## Available models

There are currently two models available in Azure AI Health Insights: 

The [Trial Matcher](./trial-matcher/overview.md) model receives patients' data and clinical trials protocols, and provides relevant clinical trials based on eligibility criteria.

The [Onco-Phenotype](./oncophenotype/overview.md) receives clinical records of oncology patients and outputs cancer staging, such as  **clinical stage TNM** categories and **pathologic stage TNM categories** as well as **tumor site** and **histology**.


## Architecture

![Diagram that shows Azure AI Health Insights architecture.](media/architecture.png) 

Azure AI Health Insights service receives patient data through multiple input channels. This can be unstructured healthcare data, FHIR resources or specific JSON format data. This in combination with the correct model configuration, such as ```includeEvidence```. 
With these input channels and configuration, the service can run the data through several health insights AI models, such as Trial Matcher or Onco-Phenotype.  

## Next steps

Review the following information to learn how to deploy Azure AI Health Insights and to learn additional information about each of the models:

>[!div class="nextstepaction"]
> [Deploy Azure AI Health Insights](deploy-portal.md) 

>[!div class="nextstepaction"]
> [Onco-Phenotype](oncophenotype/overview.md) 

>[!div class="nextstepaction"]
> [Trial Matcher](trial-matcher//overview.md) 
