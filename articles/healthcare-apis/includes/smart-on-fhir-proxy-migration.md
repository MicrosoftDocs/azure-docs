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
> **SMART on FHIR proxy retires in September 2026.** Transition to the SMART on FHIR by that date. Beginning September 2026, applications that rely on SMART on FHIR proxy report errors when they try to access the FHIR service.

SMART on FHIR provides more capabilities compared to SMART on FHIR proxy. Use SMART on FHIR to meet requirements with [SMART on FHIR Implementation Guide (v 1.0.0)](https://hl7.org/fhir/smart-app-launch/1.0.0/), [SMART on FHIR Implementation Guide (v 2.0.0)](https://hl7.org/fhir/smart-app-launch/STU2/), and [§170.315(g)(10) Standardized API for patient and population services criterion.](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg)
The following table lists the differences between SMART on FHIR proxy and SMART on FHIR. SMART on FHIR Implementation Guide (v2.0.0) is only supported in the SMART on FHIR sample. 

|Capability|SMART on FHIR|SMART on FHIR proxy|
|---|---|---|
|Supports standalone launch|Yes|No|
|Supports EHR launch|Yes|Yes|
|Supports scope restrictions|Yes|No|
|Relies on first-party Azure products|Yes, Azure products such as Azure API Management (APIM) need to be integrated|No|
|Microsoft support|Supported for FHIR service. Open-source sample support needs to be reported and monitored via [GitHub](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/issues)|Supported for FHIR service|

### Migration steps

1. **Configure native SMART on FHIR** — Set up their identity provider (Microsoft Entra ID) to support SMART on FHIR capabilities natively, including registering SMART client applications and configuring the appropriate FHIR SMART user roles. See [SMART on FHIR](../fhir/smart-on-fhir.md) for more information.
1. **Update client applications** — Modify any client applications currently using the proxy endpoint to point to the native FHIR service endpoint and use the native SMART authorization flow.
1. **Disable the SMART on FHIR proxy** — Uncheck the SMART on FHIR proxy setting under the Authentication blade for the FHIR service and save the changes.

If you have questions, community experts can answer them in [Microsoft Q&A](https://aka.ms/SMARTonFHIRproxydeprecation). For technical support, you can also create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).  
