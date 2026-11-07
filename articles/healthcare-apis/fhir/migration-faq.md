---
title: "FAQ: Migrate from Azure API for FHIR"
description: "Get answers about migrating FHIR data from Azure API for FHIR to Azure Health Data Services FHIR service. Learn migration strategies, timelines, and next steps."
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 10/04/2026
---

# FAQ about migration from Azure API for FHIR

<a id="when-will-azure-api-for-fhir-retire"></a>

## When was Azure API for FHIR deprecated?

Microsoft deprecated Azure API for FHIR on **September 30, 2026**. For questions or assistance, create an Azure support request by using **Azure API for FHIR Extension Request**.

## Are new deployments of Azure API for FHIR allowed?

After April 1, 2025, you can't create new deployments of Azure API for FHIR. Before April 1, 2025, you can create new deployments.

## What are the benefits of migrating to Azure Health Data Services FHIR service?

Azure Health Data Service FHIR service offers a rich set of capabilities such as:

- Consumption-based pricing model where you pay only for used storage and throughput.
- Support for transaction bundles.
- Chained search improvements.
- Improved ingress and egress of data by using `$import` and `$export`, including new features such as incremental import.
- Events to trigger new workflows when FHIR resources are created, updated, or deleted.
- Connectors to Azure Synapse Analytics, Power BI, and Azure Machine Learning for enhanced analytics.

## What are the steps to enable SMART on FHIR in Azure Health Data Service FHIR service?

For information on how to configure identity providers, assign the FHIR SMART user role, and enable SMART on FHIR applications, see [SMART on FHIR](smart-on-fhir.md).

## Where can customers go to learn more about migrating to Azure Health Data Services FHIR service?

Start with [migration strategies](migration-strategies.md) to learn more about Azure API for FHIR to Azure Health Data Services FHIR service migration. The migration from Azure API for FHIR to Azure Health Data Services FHIR service involves data migration and updating the applications to use Azure Health Data Services FHIR service. Find more documentation on the step-by-step approach to migrating your data and applications in the [migration tool](https://github.com/Azure/apiforfhir-migration-tool/tree/main).

## Where can customers go to get answers to their questions?

Check out these resources if you need further assistance:

- Get answers from community experts in [Microsoft Q&A](/answers/questions/1377356/retirement-announcement-azure-api-for-fhir).
- For questions or assistance, create an [Azure support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) by using **Azure API for FHIR Extension Request**.


[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
