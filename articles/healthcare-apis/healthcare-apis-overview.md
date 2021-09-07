---
title: What is the Azure Healthcare APIs?
description: This article is an overview of the Azure Healthcare APIs. 
services: healthcare-apis
author: stevewohl
ms.service: healthcare-apis
ms.topic: overview
ms.date: 07/09/2021
ms.author: ginle
---

# What is Azure Healthcare APIs (preview)?

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The health data you work with is fragmented across multiple systems and formats. Managing this data is hard enough, trying to gain insight from it seems impossible. You need to find a way to bring all these disparate systems and data together. A unified approach to health data would enable you to discover operational and clinical insights, connect new end-user applications, or enable new research projects. Azure Healthcare APIs is a set of tools and connectors that enable you to improve healthcare through insights discovered by bringing disparate sets of PHI together and connecting it end-to-end with tools for machine learning, analytics, and AI.

Azure Healthcare APIs provides the following benefits:
* Empower new workloads to leverage PHI by enabling the data to be collected and accessed in one place, in a consistent way.
* Discover new insight by bringing disparate PHI together and connecting it end-to-end with tools for machine learning, analytics, and AI.
* Build on a trusted cloud with confidence in how Protected Health Information is managed, stored, and made available.
The new Microsoft Azure Healthcare APIs will, in addition to FHIR, supports other healthcare industry data standards, like DICOM, extending healthcare data interoperability. The business model, and infrastructure platform has been redesigned to accommodate the expansion and introduction of different and future Healthcare data standards. Customers can use health data of different types across healthcare standards under the same compliance umbrella. Tools have been built into the managed service that allow customers to transform data from legacy or device proprietary formats, to FHIR. Some of these tools have been previously developed and open-sourced; Others will be net new.

Azure Healthcare APIs enables you to: 
* Quickly connect disparate health data sources and formats such as structured, imaging, and device data and normalize it to be persisted in the cloud.
* Transform and ingest data into FHIR. For example, you can transform health data from legacy formats, such as HL7v2 or CDA, or from high frequency IoT data in device proprietary formats to FHIR.
* Connect your data stored in Healthcare APIs with services across the Azure ecosystem, like Synapse, and products across Microsoft, like Teams, to derive new insights through analytics and machine learning and to enable new workflows as well as connection to SMART on FHIR applications.
* Manage advanced workloads with enterprise features that offer reliability, scalability, and security to ensure that your data is protected, meets privacy and compliance certifications required for the healthcare industry.


## What are the key differences between Azure Healthcare APIs and Azure API for FHIR?

**Linked Services**

The Azure Healthcare APIs now supports multiple health data standards for the exchange of structured data. A single collection of Azure Healthcare APIs 
enables you to deploy multiple instances of different service types (FHIR Service, DICOM Service, and IoT Connector) that seamlessly work with one another.

**Introducing DICOM Service**

Azure Healthcare APIs now includes support for DICOM services. DICOM enables the secure exchange of image data and its associated metadata. DICOM is the international standard to transmit, store, retrieve, print, process, and display medical imaging information, and is the primary medical imaging standard accepted across healthcare. For more information about the DICOM Service, see [Overview of DICOM](./dicom/dicom-services-overview.md).

**Incremental changes to the FHIR Service**

For the secure exchange of FHIR data, Healthcare APIs offers a few incremental capabilities that available in the Azure API for FHIR. 
* Support for Transactions: In Healthcare APIs, the FHIR service supports transaction bundles. For more information about transaction bundles, visit HL7.org and refer to batch/transaction interactions.
* Chained Search Improvements: Chained Search & Reserve Chained Search are no longer limited by 100 items per sub query.


## Next steps

To start working with the Azure Healthcare APIs, follow the 5-minute quick start to deploying a workspace.

> [!div class="nextstepaction"]
> [Deploy workspace in the Azure portal](healthcare-apis-quickstart.md)

> [!div class="nextstepaction"]
> [Workspace overview](workspace-overview.md)
