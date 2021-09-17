---
title: FAQs about Azure Healthcare APIs
description: This document provides answers to the frequently asked questions about the Azure Healthcare APIs.
services: healthcare-apis
author: ginalee-dotcom
ms.custom: references_regions
ms.service: healthcare-apis
ms.topic: reference
ms.date: 07/16/2021
ms.author: ginle
---


# Frequently asked questions about Azure Healthcare APIs (preview)

These are some of the frequently asked questions for the Azure Healthcare APIs.

## Azure Healthcare APIs: The basics

### What is the Azure Healthcare APIs?
The Azure Healthcare APIs is a fully managed health data platform that enables the rapid exchange and persistence of Protected Health Information (PHI) and health data through interoperable open industry standards like Fast Healthcare Interoperability Resources (FHIR®) and Digital Imaging and Communications in Medicine (DICOM®).

### What do the Azure Healthcare APIs enable you to do?
Azure Healthcare APIs enables you to: 

* Quickly connect disparate health data sources and formats such as structured, imaging, and device data and normalize it to be persisted in the cloud.

* Transform and ingest data into FHIR. For example, you can transform health data from legacy formats, such as HL7v2 or CDA, or from high frequency IoT data in device proprietary formats to FHIR.

* Connect your data stored in Healthcare APIs with services across the Azure ecosystem, like Synapse, and products across Microsoft, like Teams, to derive new insights through analytics and machine learning and to enable new workflows as well as connection to SMART on FHIR applications.

* Manage advanced workloads with enterprise features that offer reliability, scalability, and security to ensure that your data is protected, meets privacy and compliance certifications required for the healthcare industry.

### Can I migrate my existing production workload from Azure API for FHIR to Healthcare APIs?
No, unfortunately we do not offer migration capabilities at this time. 

### What is the pricing of Azure Healthcare APIs?
During the public preview phase, Azure Healthcare APIs is available for you to use at no charge

### What regions are Healthcare APIs available?
Please refer to the [Products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-api-for-fhir) page for the most current information. 
          
### What are the subscription quota limits for the Azure Healthcare APIs?

#### Workspace (logical container):
* 200 instances per Subscription (not adjustable)

#### DICOM Server:
* 800 instances per Subscription (not adjustable)
* 10 DICOM instances per Workspace (not adjustable)

#### FHIR Server:
* 25 instances per Subscription (not adjustable)
* 10 FHIR instances per Workspace (not adjustable)

#### IoT Connector:
* 25 IoT Connectors per Subscription (not adjustable)
* 10 IoT Connectors per Workspace (not adjustable)
* 1 FHIR Destination* per IoT Connector (not adjustable)

## More frequently asked questions
[FAQs about Azure Healthcare APIs FHIR service](./fhir/fhir-faq.md)

[FAQs about Azure Healthcare APIs DICOM service](./dicom/dicom-services-faqs.yml)


