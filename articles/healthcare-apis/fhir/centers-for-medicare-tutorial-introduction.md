---
title: Tutorial - Centers for Medicare and Medicaid Services (CMS) introduction - FHIR service
description: Introduces a series of tutorials that pertains to the Center for Medicare and Medicaid Services (CMS) Interoperability and Patient Access rule.  
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 06/06/2022
---

# Introduction: Centers for Medicare and Medicaid Services (CMS) Interoperability and Patient Access rule

This series of tutorials covers a high-level summary of the Center for Medicare and Medicaid Services (CMS) Interoperability and Patient Access rule, and the technical requirements outlined in this rule. We walk through various implementation guides referenced for this rule. We also provide details on how to configure FHIR&reg; service in Azure Health Data Services to support these implementation guides.


## Rule overview

The CMS released the [Interoperability and Patient Access rule](https://www.cms.gov/Regulations-and-Guidance/Guidance/Interoperability/index) on May 1, 2020. This rule requires free and secure data flow between all parties involved in patient care (patients, providers, and payers) to allow patients to access their health information. Interoperability has plagued the healthcare industry for decades, resulting in siloed data that causes negative health outcomes with higher and unpredictable costs for care. CMS is using their authority to regulate Medicare Advantage (MA), Medicaid, Children's Health Insurance Program (CHIP), and Qualified Health Plan (QHP) issuers on the Federally Facilitated Exchanges (FFEs) to enforce this rule. 

In August 2020, CMS detailed how organizations can meet the mandate. To ensure that data can be exchanged securely and in a standardized manner, CMS identified FHIR version release 4 (R4) as the foundational standard required for the data exchange. 

There are three main pieces to the Interoperability and Patient Access ruling:

* **Patient Access API (Required July 1, 2021)** – CMS-regulated payers (as previously defined) are required to implement and maintain a secure, standards-based API that allows patients to easily access their claims and encounter information, including cost, as well as a defined subset of their clinical information through third-party applications of their choice.  

* **Provider Directory API (Required July 1, 2021)** – CMS-regulated payers are required by this portion of the rule to make provider directory information publicly available via a standards-based API. Through making this information available, third-party application developers will be able to create services that help patients find providers for specific care needs, and clinicians find other providers for care coordination.  

* **Payer-to-Payer Data Exchange (Originally required Jan 1, 2022 - [Currently Delayed](https://www.cms.gov/Regulations-and-Guidance/Guidance/Interoperability/index))** – CMS-regulated payers are, at the patient’s request, required to exchange certain patient clinical data with other payers. While there's no requirement to follow any kind of standard, applying FHIR to exchange this data is encouraged. 

## Key FHIR concepts

As mentioned previously, FHIR R4 is required to meet this mandate. In addition, there are several implementation guides developed that provide guidance for the rule. [Implementation guides](https://www.hl7.org/fhir/implementationguide.html) provide extra context on top of the base FHIR specification. This includes defining additional search parameters, profiles, extensions, operations, value sets, and code systems.

The FHIR service has the following capabilities to help you configure your database for the various implementation guides.

* [Support for RESTful interactions](fhir-features-supported.md)
* [Storing and validating profiles](validation-against-profiles.md)
* [Defining and indexing custom search parameters](how-to-do-custom-search.md)
* [Converting data](convert-data-overview.md)

## Patient Access API Implementation Guides

The Patient Access API describes adherence to four FHIR implementation guides:

* [CARIN IG for Blue Button®](http://hl7.org/fhir/us/carin-bb/STU1/index.html): Payers are required to make patients' claims and encounters data available according to the CARIN IG for Blue Button Implementation Guide (C4BB IG). The C4BB IG provides a set of resources that payers can display to consumers via a FHIR API and includes the details required for claims data in the Interoperability and Patient Access API. This implementation guide uses the ExplanationOfBenefit (EOB) Resource as the main resource, pulling in other resources as they're referenced.
* [HL7 FHIR Da Vinci PDex IG](http://hl7.org/fhir/us/davinci-pdex/STU1/index.html): The Payer Data Exchange Implementation Guide (PDex IG) is focused on ensuring that payers provide all relevant patient clinical data to meet the requirements for the Patient Access API. This uses the US Core profiles on R4 Resources, and includes (at a minimum) encounters, providers, organizations, locations, dates of service, diagnoses, procedures, and observations. While this data may be available in FHIR format, it may also come from other systems in the format of claims data, HL7 V2 messages, and C-CDA documents.
* [HL7 US Core IG](https://www.hl7.org/fhir/us/core/toc.html): The HL7 US Core Implementation Guide (US Core IG) is the backbone for the PDex IG previously described. While the PDex IG limits some resources even further than the US Core IG, many resources just follow the standards in the US Core IG.
* [HL7 FHIR Da Vinci - PDex US Drug Formulary IG](http://hl7.org/fhir/us/Davinci-drug-formulary/index.html): Part D Medicare Advantage plans have to make formulary information available via the Patient API. They do this using the PDex US Drug Formulary Implementation Guide (USDF IG). The USDF IG defines a FHIR interface to a health insurer’s drug formulary information, which is a list of brand-name and generic prescription drugs that a health insurer agrees to pay for. The main use case is so patients can determine if there is a drug available alternative to one that has been prescribed to them, and to compare drug costs.

## Provider Directory API Implementation Guide

The Provider Directory API describes adherence to one implementation guide:

* [HL7 Da Vinci PDex Plan Network IG](https://build.fhir.org/ig/HL7/davinci-pdex-plan-net/): This implementation guide defines a FHIR interface to a health insurer’s insurance plans, their associated networks, and the organizations and providers that participate in these networks.

## Touchstone

[Touchstone](https://touchstone.aegis.net/touchstone/) is a great resource for testing adherence to the various implementation guides. Throughout the upcoming tutorials, we focus on ensuring that the FHIR service is configured to successfully pass various Touchstone tests. The Touchstone site has a lot of great documentation to help you get up and running.

## Next steps

Now that you have a basic understanding of the Interoperability and Patient Access rule, implementation guides, and available testing tool (Touchstone), we next walk through setting up FHIR service for the CARIN IG for Blue Button. 

>[!div class="nextstepaction"]
>[CARIN Implementation Guide for Blue Button](carin-implementation-guide-blue-button-tutorial.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]