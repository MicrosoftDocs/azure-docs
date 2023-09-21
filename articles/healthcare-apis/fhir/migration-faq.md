---
title: Migration strategies
description: Learn how to migrate FHIR data from Azure API for FHIR to the Azure Health Data Services FHIR service. This article provides steps and tools for a smooth transition.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: evach
author: evachen96
ms.date: 9/27/2023
---

# Migration from Azure API for FHIR FAQ

**1. When will Azure API for FHIR be retired?**

Azure API for FHIR will be retired on September 30, 2026.

**1. Why is Microsoft retiring Azure API for FHIR?**

Azure API for FHIR is a service that was purpose built for protected health information (PHI), meeting regional compliance requirements. In March 2022, we announced the general availability of [Azure Health Data Services](https://learn.microsoft.com/azure/healthcare-apis/healthcare-apis-overview), that enables quick deployment of managed, enterprise-grade FHIR, DICOM, and MedTech services for diverse health data integration. See below for detailed benefits of migrating to Azure Health Data Services FHIR service. With this new experience, we’re retiring Azure API for FHIR.

**1. What are the benefits of migrating to Azure Health Data Services FHIR service?**

AHDS FHIR service offers a rich set of capabilities such as:

- Consumption-based pricing model where customers pay only for used storage & throughput
- Support for transaction bundles
- Chained search improvements
- Improved ingress & egress of data with \$import, \$export including new features such as incremental import (preview)
- Events to trigger new workflows when FHIR resources are created, updated or deleted
- Connectors to Azure Synapse Analytics, Power BI and Azure Machine Learning for enhanced analytics

**1. SMART on FHIR Proxy is planned for deprecation in Gen2. When we migrate from Gen1, what are the steps for enabling SMART on FHIR in Gen2?**

SMART on FHIR proxy will be retiring. Organizations need to transition to the SMART on FHIR (Enhanced), which uses Azure Health Data and AI OSS samples by **September 21, 2026**. After September 21, 2026, applications relying on SMART on FHIR proxy will report errors in accessing the FHIR service.

SMART on FHIR (Enhanced) provides added capabilities than SMART on FHIR proxy and can be considered to meet requirements with SMART on FHIR Implementation Guide (v 1.0.0) and §170.315(g)(10) Standardized API for patient and population services criterion.

**1. What will happen after the service is retired on September 30, 2026?**

Customers won't be able to do the following:

- Create or manage Azure API for FHIR accounts
- Access the data through the Azure portal or APIs/SDKs/client tools
- Receive service updates to Azure API for FHIR or APIs/SDKs/client tools
- Access customer support (phone, email, web)
- Where can customers go to learn more about migrating to Azure Health Data Services FHIR service?

Start with \<Link to Azure Docs migration guidance \> to learn more about Azure API for FHIR to Azure Health Data Services FHIR service migration. Please be advised that the migration from Azure API for FHIR to Azure Health Data Services FHIR service involves data migration as well updating the applications to use Azure Health Data Services FHIR service. You can find more documentation on the step-by-step approach to migrating your data and applications in this migration tool \<Link to github repo\>.

**1.Where can customers go to get answers to their questions?**

There are multiple ways to get answers to questions.

- Get answers from community experts in Microsoft Q&A \<Link to Microsoft Q&A Page\>

- If you have a support plan and require technical support, [contact us.](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

1. For Issue type, select **Technical**.

1. For **Subscription**, select your subscription.

1. For **Service**, select **My services**, then **Azure API for FHIR**

1. For **Summary**, type a description of your issue.

1. For **Problem type**, select **Troubleshoot configuration issue**.

1. For **Problem** subtype, my issue is not listed.
