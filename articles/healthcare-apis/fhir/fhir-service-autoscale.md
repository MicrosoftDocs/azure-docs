---
title: Autoscale feature for Azure Health Data Services FHIR service
description: This article describes the Autoscale feature for Azure Health Data Services FHIR service.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/06/2022
ms.author: kesheth
---

# FHIR service autoscale

FHIR service in Azure Health Data Services is a managed service allowing customers to persist FHIR-compliant healthcare data and interact with it securely through the API service endpoint. The FHIR service provides the built-in autoscale capability to meet various workloads.  

## What is FHIR service autoscale?   

The autoscale feature for FHIR service is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all regions where the FHIR service is supported. Keep in mind that the autoscale feature is subject to the resources available in Azure regions.   

## How does FHIR service autoscale work?  

The autoscale feature adjusts computing resources automatically to optimize the overall service scalability. It requires no action from customers. 

When transaction workloads are high, the autoscale feature increases computing resources automatically. When transaction workloads are low, it decreases computing resources accordingly. Whether you're performing read requests that include simple queries like getting patient information using a patient ID, and advanced queries like getting all DiagnosticReport resources for patients whose name is "Sarah", or you're creating or updating FHIR resources, the autoscale feature manages the dynamics and complexity of resource allocation to ensure high scalability.

### What is the cost of the FHIR service autoscale?  

The autoscale feature incurs no extra costs to customers based on the new API billing model.

## Next steps

In this article, you've learned about the FHIR service autoscale feature in Azure Health Data Services, for more information about the FHIR service supported features, see

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
