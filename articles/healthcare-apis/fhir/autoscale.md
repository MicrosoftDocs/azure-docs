---
title: Autoscale feature for Azure Health Data Services FHIR service
description: Explore how autoscaling in the FHIR service in Azure Health Data Services boosts efficiency and helps ensure optimal performance by scaling resources based on load.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 05/13/2024
ms.author: kesheth
---

# Autoscaling

Azure Health Data Services provides a managed service for persisting FHIR&reg;-compliant healthcare data and interacting with the data securely through the API service endpoint. 

Autoscaling is a capability to dynamically scale FHIR service based on the load reported. The FHIR service in Azure Health Data Services provides the built-in autoscaling capability and the process is automated. This capability provides elasticity and enables provisioning of more instances for FHIR service customers on demand.

The autoscaling feature for FHIR service is available in all regions where the FHIR service is supported.
> [!NOTE]
> Autoscaling feature is subject to the resources availability in Azure regions.

The autoscaling feature adjusts computing resources automatically to optimize service scalability. There's no action required from customers.

## Autoscale at the compute level

### Scaling trigger

Scaling triggers describes when scaling of the service is performed. Conditions defined in the trigger are checked periodically to determine if a service should be scaled or not. All triggers that are currently supported are Average CPU, Max Worker Thread, Average LogWrite, Average data IO.
    
### Scaling mechanism

The scaling mechanism is applied if the trigger check determines that scaling is necessary. Additionally, the scaling trigger isn't evaluated again until the scaling interval expires, which is set to one minute for the FHIR service.

To ensure the best possible outcome, we recommend that you gradually increase your request rate to match the expected push rate, rather than pushing all requests at the same time. 

## FAQ

### What is the cost to enable autoscaling for FHIR service?  

The autoscaling feature incurs no extra costs.

### What should customers do if there's high volume of HTTP 429 errors?

We recommend that you gradually increase the request rate to see if it reduces HTTP 429 errors. For consistent 429 errors, create a support ticket through the Azure portal. The support team engages with you to understand your scaling trigger needs.

## Related content

[Supported FHIR Features](fhir-features-supported.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
