---
title: "FAQ: Migrate from Azure API for FHIR"
description: "Get answers about migrating FHIR data from Azure API for FHIR to Azure Health Data Services FHIR service. Learn migration strategies, timelines, and next steps."
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: evach
author: evachen96
ms.date: 07/14/2026
---

# FAQ about migration from Azure API for FHIR

## When will Azure API for FHIR retire?

Azure API for FHIR&reg; retires on September 30, 2026.

## Are new deployments of Azure API for FHIR allowed?

After April 1, 2025, you can't create new deployments of Azure API for FHIR. Before April 1, 2025, you can create new deployments.

## Why is Microsoft retiring Azure API for FHIR?

Azure API for FHIR is a service that's purpose built for protected health information (PHI), meeting regional compliance requirements. In March 2022, Microsoft announced the general availability of Azure Health Data Services, which enables quick deployment of managed, enterprise-grade FHIR and DICOM services for diverse health data integration. With this new experience, Microsoft is retiring Azure API for FHIR.

## What are the benefits of migrating to Azure Health Data Services FHIR service?

Azure Health Data Service FHIR service offers a rich set of capabilities such as:

- Consumption-based pricing model where you pay only for used storage and throughput.
- Support for transaction bundles.
- Chained search improvements.
- Improved ingress and egress of data by using `$import` and `$export`, including new features such as incremental import.
- Events to trigger new workflows when FHIR resources are created, updated, or deleted.
- Connectors to Azure Synapse Analytics, Power BI, and Azure Machine Learning for enhanced analytics.

## What are the steps to enable SMART on FHIR in Azure Health Data Service FHIR service?

The SMART on FHIR proxy is retiring. Organizations need to transition to the SMART on FHIR, which uses Azure Health Data and AI OSS samples, by **September 21, 2026**. After September 21, 2026, applications relying on SMART on FHIR proxy report errors when accessing the FHIR service.

For information on how to migrate to SMART on FHIR, see [Migrate from SMART on FHIR Proxy to SMART on FHIR](smart-on-fhir.md#migrate-from-smart-on-fhir-proxy-to-smart-on-fhir).

## What happens after the service is retired on September 30, 2026?

After September 30, 2026, customers can't:

- Create or manage Azure API for FHIR accounts.
- Access the data through the Azure portal or APIs/SDKs/client tools.
- Receive service updates to Azure API for FHIR or APIs/SDKs/client tools.
- Access customer support (phone, email, web).

## Where can customers go to learn more about migrating to Azure Health Data Services FHIR service?

Start with [migration strategies](migration-strategies.md) to learn more about Azure API for FHIR to Azure Health Data Services FHIR service migration. The migration from Azure API for FHIR to Azure Health Data Services FHIR service involves data migration and updating the applications to use Azure Health Data Services FHIR service. Find more documentation on the step-by-step approach to migrating your data and applications in the [migration tool](https://github.com/Azure/apiforfhir-migration-tool/tree/main).

## Where can customers go to get answers to their questions?

Check out these resources if you need further assistance:

- Get answers from community experts in [Microsoft Q&A](/answers/questions/1377356/retirement-announcement-azure-api-for-fhir).
- If you have a support plan and require technical support, [contact us](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).


[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
