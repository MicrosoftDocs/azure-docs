---
title: "include file"
description: "include file"
services: healthcare-apis
ms.service: fhir
ms.topic: "include"
ms.date: 09/11/2023
ms.author: kesheth
ms.custom: "include file"
---
    
> [!IMPORTANT]
> **SMART on FHIR proxy is retiring in September 2026.** Transition to the SMART on FHIR by that date. Beginning September 2026, applications relying on SMART on FHIR proxy report errors in accessing the FHIR service.

SMART on FHIR provides more capabilities compared to SMART on FHIR proxy. Use SMART on FHIR to meet requirements with [SMART on FHIR Implementation Guide (v 1.0.0)](https://hl7.org/fhir/smart-app-launch/1.0.0/), [SMART on FHIR Implementation Guide (v 2.0.0)](https://hl7.org/fhir/smart-app-launch/STU2/), and [§170.315(g)(10) Standardized API for patient and population services criterion.](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg)
The following table lists the differences between SMART on FHIR proxy and SMART on FHIR. SMART on FHIR Implementation Guide (v2.0.0) is only supported in SMART on FHIR sample. 

|Capability|SMART on FHIR|SMART on FHIR proxy|
|---|---|---|
|Supports Standalone Launch|Yes|No|
|Supports EHR Launch|Yes|Yes|
|Supports scope restrictions|Yes|No|
|Relies on first party Azure products|Yes, Azure products such as Azure API Management (APIM) need to be integrated|No|
|Microsoft Support|Supported for FHIR service.Open-source sample support needs to be reported and monitored via [GitHub](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/issues)|Supported for FHIR service|

### Migration steps

1. Assign users to the FHIR SMART user role. FHIR SMART user role allows users to access the FHIR service if their requests comply with the SMART on FHIR implementation guide. Follow the steps listed under section [Manage Users: Assign Users to Role](/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).
1. Deploy SMART on FHIR sample [SMART on FHIR v2 — Native IdP-Agnostic Sample](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/smartonfhir-smartnative-v2).
1. Update endpoint of the FHIR service url to '{{BASEURL_FROM_APIM}}/smart.'
1. Uncheck the SMART on FHIR proxy setting under Authentication blade for the FHIR service. 

If you have questions, you can get answers from community experts in [Microsoft Q&A](https://aka.ms/SMARTonFHIRproxydeprecation). For technical support, you can also create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).  
