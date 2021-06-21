---
title: What are Azure Healthcare APIs?
description: This article is an overview of the Azure Healthcare APIs. 
services: healthcare-apis
author: stevewohl
ms.service: healthcare-apis
ms.topic: overview
ms.date: 06/21/2021
ms.author: ginle
---

# What is Azure Healthcare APIs?

The Azure Healthcare APIs is a fully managed health data platform that enables the rapid exchange and persistence of Protected Health Information (PHI) and health data through interoperable open industry standards like Fast Healthcare Interoperability Resources (FHIR®) and Digital Imaging and Communications in Medicine (DICOM®).

Our health data platform allows you to:

• Transform and ingest data into FHIR. For example, you can transform health data from 
legacy formats, such as HL7v2 or CDA, or from high frequency IoT data in device 
proprietary formats to FHIR.

• Connect your data stored in Healthcare APIs with services across the Azure ecosystem 
and products across Microsoft to derive new insights through analytics and machine 
learning and to enable new workflows.
 
• Manage advanced workloads with enterprise features that offer reliability, scalability, 
and security to ensure that your data is protected, meets privacy and compliance 
certifications required for the healthcare industry.

## What are the key differences between Azure Healthcare APIs and Azure API for FHIR?

**A platform for health data**

Azure Healthcare APIs evolve from a product to a platform that supports multiple health data 
standards for the exchange of structured data. A single collection of Azure Healthcare APIs 
allows you to deploy multiple data service instances of different service types (FHIR Service, 
DICOM Service, and IoT Connector) that seamlessly work with one another.

**Introducing DICOM Service**

Azure Healthcare APIs now includes support for DICOM services. DICOM enables the secure 
exchange of image data and its associated metadata. DICOM is the international standard to 
transmit, store, retrieve, print, process, and display medical imaging information, and is the 
primary medical imaging standard accepted across healthcare.

For more information about the DICOM Service, see "Overview of DICOM".

**Incremental changes to the FHIR Service**

For the secure exchange of FHIR data, Healthcare APIs offers a few incremental capabilities
that available in the Azure API for FHIR. 

• Support for Transactions: In Healthcare APIs, the FHIR service supports transaction 
bundles. For more information about transaction bundles, visit HL7.org and refer to 
batch/transaction interactions.
 
• Chained Search Improvements: Chained Search & Reserve Chained Search are no longer
limited by 100 items per sub query.

It’s worth noting that the Azure IoT Connector for FHIR (formerly known as IoMT) is still 
available and that new managed services and capabilities such as data conversion and 
exporting de-identified data are being added to the Healthcare APIs.


## Next steps

To start working with the Azure Healthcare APIs, follow the 5-minute quick start to deploying a workspace.

>[!div class="nextstepaction"]
>[Deploy workspace in the Azure portal](deploy-workspace-in-portal.md)

>[!div class="nextstepaction"]
>[Workspace overview](workspace-overview.md)