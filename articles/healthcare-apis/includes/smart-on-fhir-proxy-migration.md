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
> **SMART on FHIR proxy is retiring in September 2026**, transition to the SMART on FHIR (Enhanced) by that date. Beginning September 2026, applications relying on SMART on FHIR proxy will report errors in accessing the FHIR service.

SMART on FHIR (Enhanced) provides more capabilities compared to SMART on FHIR proxy. SMART on FHIR(Enhanced) can be considered to meet requirements with [SMART on FHIR Implementation Guide (v 1.0.0)](https://hl7.org/fhir/smart-app-launch/1.0.0/) and [§170.315(g)(10) Standardized API for patient and population services criterion.](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services#ccg)
The following table lists the difference between SMART on FHIR proxy and SMART on FHIR (Enhanced).

|Capability|SMART on FHIR (Enhanced)|SMART on FHIR proxy|
|---|---|---|
|Supports Standalone Launch|Yes|No|
|Supports EHR Launch|Yes|Yes|
|Supports scope restrictions|Yes|No|
|Relies on first party Azure products|Yes, Azure products such as Azure API Management (APIM) need to be integrated|No|
|Microsoft Support|Supported for FHIR service.Open-source sample support needs to be reported and monitored via [GitHub](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/issues)|Supported for FHIR service|

### Migration Steps
* Step 1: Set up FHIR SMART user role 
Follow the steps listed under section [Manage Users: Assign Users to Role](/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal). Any user added to SMART user role is able to access the FHIR Service, if their requests comply with the SMART on FHIR implementation Guide. 
* Step 2: Deploy SMART on FHIR sample under [Azure Health Data and AI OSS samples](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/smartonfhir)
* Step 3: Update endpoint of the FHIR service url to '{{BASEURL_FROM_APIM}}/smart.'
* Step 4: Uncheck the SMART on FHIR proxy setting under Authentication blade for the FHIR service. 

If you have questions, you can get answers from community experts in [Microsoft Q&A](https://aka.ms/SMARTonFHIRproxydeprecation). For technical support, you can also create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).  
