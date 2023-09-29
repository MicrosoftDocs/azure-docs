---
title: FAQ about migrations from Azure API for FHIR
description: Find answers to your questions about migrating FHIR data from Azure API for FHIR to the Azure Health Data Services FHIR service.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: evach
author: evachen96
ms.date: 9/27/2023
---

# FAQ about migration from Azure API for FHIR

## When will Azure API for FHIR be retired?

Azure API for FHIR will be retired on September 30, 2026.

## Are new deployments of Azure API for FHIR allowed?

Due to the retirement of Azure API for FHIR after April 1, 2025 customers will not be able to create new deployments of Azure API of FHIR. Until April 1, 2025 new deployments are allowed.

## Why is Microsoft retiring Azure API for FHIR?

Azure API for FHIR is a service that was purpose built for protected health information (PHI), meeting regional compliance requirements. In March 2022, we announced the general availability of Azure Health Data Services, which enables quick deployment of managed, enterprise-grade FHIR, DICOM, and MedTech services for diverse health data integration. With this new experience, we’re retiring Azure API for FHIR.

## What are the benefits of migrating to Azure Health Data Services FHIR service?

AHDS FHIR service offers a rich set of capabilities such as:

- Consumption-based pricing model where customers pay only for used storage and throughput
- Support for transaction bundles
- Chained search improvements
- Improved ingress and egress of data with \$import, \$export including new features such as incremental import
- Events to trigger new workflows when FHIR resources are created, updated or deleted
- Connectors to Azure Synapse Analytics, Power BI and Azure Machine Learning for enhanced analytics

## What are the steps to enable SMART on FHIR in Azure Health Data Service FHIR service?

SMART on FHIR proxy is retiring. Organizations need to transition to the SMART on FHIR (Enhanced), which uses Azure Health Data and AI OSS samples by **September 21, 2026**. After September 21, 2026, applications relying on SMART on FHIR proxy will report errors when accessing the FHIR service.

SMART on FHIR (Enhanced) provides more capabilities than SMART on FHIR proxy, and meets requirements in the SMART on FHIR Implementation Guide (v 1.0.0) and §170.315(g)(10) Standardized API for patient and population services criterion.

## What will happen after the service is retired on September 30, 2026?

After September 30, 2026 customers won't be able to:

- Create or manage Azure API for FHIR accounts
- Access the data through the Azure portal or APIs/SDKs/client tools
- Receive service updates to Azure API for FHIR or APIs/SDKs/client tools
- Access customer support (phone, email, web)
- Where can customers go to learn more about migrating to Azure Health Data Services FHIR service?

Start with [migration strategies](migration-strategies.md) to learn more about Azure API for FHIR to Azure Health Data Services FHIR service migration. The migration from Azure API for FHIR to Azure Health Data Services FHIR service involves data migration and updating the applications to use Azure Health Data Services FHIR service. Find more documentation on the step-by-step approach to migrating your data and applications in the [migration tool](https://github.com/Azure/apiforfhir-migration-tool/blob/main/lift-and-shift-resources/Liftandshiftresources_README.md).

## Where can customers go to get answers to their questions?

Check out these resources if you need further assistance:

- Get answers from community experts in [Microsoft Q&A](/answers/questions/1377356/retirement-announcement-azure-api-for-fhir).
- If you have a support plan and require technical support, [contact us](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
