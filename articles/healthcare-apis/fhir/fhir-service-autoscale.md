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

# Autoscaling

FHIR service in Azure Health Data Services is a managed service allowing customers to persist FHIR-compliant healthcare data and interact with it securely through the API service endpoint.

Auto scaling is a capability to dynamically scale your FHIR service based on the load reported. Auto scaling provides elasticity and enables provisioning of additional instances for your FHIR service on demand. FHIR service in Azure Health data services provides the built-in autoscale capability and the process is automated.

The autoscale feature for FHIR service is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all regions where the FHIR service is supported.


> [!NOTE]
>  Autoscale feature is subject to the resources availablitity in Azure regions.   

## Description

The autoscale feature adjusts computing resources automatically to optimize the overall service scalability. It requires no action from customers. 

When transaction workloads are high, the autoscale feature increases computing resources automatically. When transaction workloads are low, it decreases computing resources accordingly. Whether you're performing read requests that include simple queries like getting patient information using a patient ID, and advanced queries like getting all DiagnosticReport resources for patients whose name is "Sarah", or you're creating or updating FHIR resources, the autoscale feature manages the dynamics and complexity of resource allocation to ensure high scalability.

Auto scaling policies defined for FHIR service consists of two parts:

* Scaling Trigger
    
    Scaling Trigger describes when scaling of the service will be performed. Conditions that are defined in the trigger are checked periodically to determine     if a service should be scaled or not. All triggers that are currently supported are Average CPU, Max Worker Thread, Average LogWrite, Average data IO.
     
* Scaling mechanism 
    
    Scaling Mechanism describes how scaling will be performed when it is triggered. Mechanism is only applied when the conditions from the trigger are met.
    There are three factors that determine when the service will be scaled:
    * Lower load threshold is a value that determines when the service will be scaled in. If the average load of all instances is lower than 20% of CPU usage then the service will be scaled in. 
    * Upper load threshold is a value that determines when the service will be scaled out. If the average load of all instances is higher than 70% of CPU usage then the service will be scaled out.
    * Scaling interval is used determines how often the trigger will be checked. Once the trigger is checked, if scaling is needed the mechanism will be applied. If scaling is not needed, then no action will be taken. In both cases, trigger will not be checked again before scaling interval expires again. Scaling interval is set to 1 minute.

## FAQ
### What is the cost of the FHIR service autoscale?  

The autoscale feature incurs no extra costs to customers based on the new API billing model.

## Next steps

In this article, you've learned about the FHIR service autoscale feature in Azure Health Data Services, for more information about the FHIR service supported features, see

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
