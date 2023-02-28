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

Azure Health Data Services provides a managed service for persisting FHIR-compliant healthcare data and interacting with it securely through the API service endpoint. 

Autoscaling is a capability to dynamically scale your FHIR service based on the load reported. The FHIR service in Azure Health Data Services provides the built-in autoscale capability and the process is automated. The capability provides elasticity and enables provisioning of additional instances for customers FHIR service on demand.

The autoscaling feature adjusts computing resources automatically to optimize service scalability. There's no action required from customers.

The autoscaling feature for FHIR service is available in all regions where the FHIR service is supported.
> [!NOTE]
> Autoscaling feature is subject to the resources availability in Azure regions.

## Autoscaling Policies at Compute level

* Scaling Trigger

Scaling Trigger describes when scaling of the service will be performed. Conditions that are defined in the trigger are checked periodically to determine     if a service should be scaled or not. All triggers that are currently supported are Average CPU, Max Worker Thread, Average LogWrite, Average data IO.
    
* Scaling mechanism

Scaling Mechanism describes how scaling will be performed when it's triggered. Mechanism is only applied when the conditions from the trigger are met.
There are three factors that determine when the service will be scaled:

** Lower load threshold is a value that determines when the service will be scaled in. If the average load of all instances is lower than 20% of CPU usage then the service will be scaled in.

** Upper load threshold is a value that determines when the service will be scaled out. If the average load of all instances is higher than 70% of CPU usage then the service will be scaled out.
  
** Scaling Interval is used to determine how often the trigger will be checked. Once the trigger is checked, if scaling is needed the mechanism will be applied. Scaling trigger will not be checked before scaling interval expires, which is to set to 1 minute for FHIR service.

To ensure the best possible outcome, we recommend customers to gradually increase their request rate to match the expected push rate, rather than pushing all requests at once. 

## FAQ

### What is the cost to enable autoscaling for FHIR service?  

The autoscaling feature incurs no extra costs to customers.

## Next steps

In this article, you've learned about the FHIR service autoscaling feature in Azure Health Data Services, for more information about the FHIR service supported features, see

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
