---
title: Autoscale feature for Azure Healthcare APIs FHIR service
description: This article describes the Autoscale feature for Azure Healthcare APIs FHIR service.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 11/16/2021
ms.author: zxue
---

# FHIR service autoscale

The FHIR service in Azure Healthcare APIs is a managed service allowing customers to persist FHIR-compliant healthcare data and interact with it securely through the API service endpoint. The FHIR service provides the built-in autoscale capability to meet various workloads.  

## What is FHIR service autoscale?   

The autoscale feature for the FHIR service is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It is available in all regions where the FHIR service is supported. Keep in mind that the autoscale feature is subject to the resources available in Azure regions.   

## How does FHIR service autoscale work?  

When transaction workloads are high, the autoscale feature increases computing resources automatically. When transaction workloads are low, it decreases computing resources accordingly.  

The autoscale feature adjusts computing resources automatically to optimize the overall service scalability. Whether you are performing read requests that include simple queries like getting patient information using a patient ID, and advanced queries like getting all `DiagnosticReport` resources for patients whose name is "Sarah", or you're creating or updating FHIR resources, the autoscale feature manages the dynamics and complexity of resource allocation to ensure high scalability.

The autoscale feature is part of the managed service and requires no action from customers. However, customers are encouraged to share their feedback to help improve the feature. Customers can also raise a support ticket to address any scalability issue they may have experienced.  

### What is the cost of the FHIR service autoscale?  

The autoscale feature incurs no extra costs to customers based on the new API billing model.

## Next steps

In this article, you've learned about the FHIR service autoscale feature in Azure Healthcare APIs, for more information about the FHIR service supported features, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)
