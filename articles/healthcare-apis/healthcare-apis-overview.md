---
title: What is Azure Health Data Services?
description: This article is an overview of Azure Health Data Services. 
services: healthcare-apis
author: mikaelweave
ms.service: healthcare-apis
ms.topic: overview
ms.date: 06/03/2022
ms.author: mikaelw
---

# What is Azure Health Data Services?

Azure Health Data Services is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions. Using a set of managed API services and frameworks that’s dedicated to the healthcare industry is important and beneficial because health data collected from patients and healthcare consumers can be fragmented from across multiple systems, device types, and data formats. Gaining insights from health data is one of the biggest barriers to sustaining population and personal health and overall wellness understanding. Bringing disparate systems, workflows, and health data together is more important today. A unified and aligned approach to health data access, standardization, and trend capturing would enable the discovery of operational and clinical insights. We can streamline the process of connecting new device applications and enable new research projects. Using Azure Health Data Services as a scalable and secure healthcare solution can enable workflows to improve healthcare through insights discovered by bringing Protected Health Information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. 

Azure Health Data Services provides the following benefits:
* Empower new workloads to leverage PHI by enabling the data to be collected and accessed in one place, in a consistent way.
* Discover new insight by bringing disparate PHI together and connecting it end-to-end with tools for machine learning, analytics, and AI.
* Build on a trusted cloud with confidence in how Protected Health Information is managed, stored, and made available.
The new Microsoft Azure Health Data Services will, in addition to Fast Healthcare Interoperability Resources (FHIR&#174;), support other healthcare industry data standards, like DICOM, extending healthcare data interoperability. The business model and infrastructure platform have been redesigned to accommodate the expansion and introduction of different and future healthcare data standards. Customers can use health data of different types across healthcare standards under the same compliance umbrella. Tools have been built into the managed service that allow customers to transform data from legacy or device proprietary formats, to FHIR. Some of these tools have been previously developed and open-sourced; others will be net new.

Azure Health Data Services enables you to: 
* Quickly connect disparate health data sources and formats such as structured, imaging, and device data and normalize it to be persisted in the cloud.
* Transform and ingest data into FHIR. For example, you can transform health data from legacy formats, such as HL7v2 or CDA, or from high frequency IoT data in device proprietary formats to FHIR.
* Connect your data stored in Azure Health Data Services with services across the Azure ecosystem, like Synapse, and products across Microsoft, like Teams, to derive new insights through analytics and machine learning and to enable new workflows as well as connection to SMART on FHIR applications.
* Manage advanced workloads with enterprise features that offer reliability, scalability, and security to ensure that your data is protected, meets privacy and compliance certifications required for the healthcare industry.


## What are the key differences between Azure Health Data Services and Azure API for FHIR?

**Linked services**

Azure Health Data Services supports multiple health data standards for the exchange of structured data. A single collection of Azure Health Data Services enables you to deploy multiple instances of different service types (FHIR, DICOM, and MedTech) that seamlessly work with one another. Services deployed within a workspace also share a compliance boundary and common configuration settings. The product scales automatically to meet the varying demands of your workloads, so you spend less time managing infrastructure and more time generating insights from health data. 

**DICOM service**

Azure Health Data Services includes support for the DICOM service. DICOM enables the secure exchange of image data and its associated metadata. DICOM is the international standard to transmit, store, retrieve, print, process, and display medical imaging information, and is the primary medical imaging standard accepted across healthcare. For more information about the DICOM service, see [Overview of DICOM](./dicom/dicom-services-overview.md).

**MedTech service**

Azure Health Data Services includes support for the MedTech service. The MedTech service enables you to ingest high-frequency IoT device data into the FHIR Service in a scalable, secure, and compliant manner. For more information about MedTech, see [Overview of MedTech](../healthcare-apis/iot/iot-connector-overview.md).

**FHIR service**

Azure Health Data Services includes support for FHIR service. The FHIR service enables rapid exchange of health data using the Fast Healthcare Interoperability Resources (FHIR®) data standard. For more information about MedTech, see [Overview of FHIR](../healthcare-apis/fhir/overview.md).

For the secure exchange of FHIR data, Azure Health Data Services offers a few incremental capabilities that aren't available in Azure API for FHIR.
 
* **Support for transactions**: In Azure Health Data Services, the FHIR service supports transaction bundles. For more information about transaction bundles, visit [HL7.org](https://www.hl7.org/) and refer to batch/transaction interactions.
* [Chained Search Improvements](./././fhir/overview-of-search.md#chained--reverse-chained-searching): Chained Search & Reserve Chained Search are no longer limited by 100 items per sub query.
* The `$convert-data` operation can now transform JSON objects to FHIR R4.
* Events: Trigger new workflows when resources are created, updated, or deleted in a FHIR service.


## Next steps

To start working with the Azure Health Data Services, follow the 5-minute quick start to deploying a workspace.

> [!div class="nextstepaction"]
> [Deploy workspace in the Azure portal](healthcare-apis-quickstart.md)

> [!div class="nextstepaction"]
> [Workspace overview](workspace-overview.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7. 
