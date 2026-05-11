---
title: Autoscale feature for Azure Health Data Services FHIR service
description: Learn how autoscaling in the FHIR service for Azure Health Data Services improves performance and efficiency under varying load, and start optimizing today.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: article
ms.date: 05/04/2026
ms.author: kesheth
---

# Autoscaling for the FHIR service

Azure Health Data Services provides a managed environment for persisting FHIR&reg;-compliant healthcare data and interacting with that data securely through the FHIR API endpoint. 

The built-in autoscaling capability in this environment automatically ensures that compute resources for the FHIR service can dynamically adjust based on the load, helping maintain performance and efficiency under varying workloads. You don't need to take any action to configure or enable this feature.

The autoscaling feature for FHIR service is available in all regions where the FHIR service is supported.

> [!NOTE]
> The autoscaling feature depends on resource availability in Azure regions.

## Autoscale at the compute level

### Scale triggers

Scaling triggers determine when scaling of the service is performed. The system checks conditions defined in the trigger at one-minute intervals to determine if a service should be scaled. The service currently supports only the following triggers:  

- Average CPU
- Max Worker Thread
- Average LogWrite
- Average data IO
    
### Scaling mechanism

The scaling mechanism is applied if the trigger check determines that scaling is necessary. The system doesn't evaluate the scaling trigger again until the scaling interval expires.

To ensure the best possible outcome, we recommend that you gradually increase your request rate to match the expected push rate, rather than pushing all requests at the same time. 

## FAQ

### What is the cost to enable autoscaling for FHIR service?  

The autoscaling feature incurs no extra costs.

### What should customers do if there's high volume of HTTP 429 errors?

Gradually increase the request rate to see if it reduces HTTP 429 errors. For consistent 429 errors, create a support ticket through the Azure portal. The support team works with you to understand your scaling trigger needs.

## Related content

[Supported FHIR Features](fhir-features-supported.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
