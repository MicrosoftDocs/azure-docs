---
title: FAQs about IoT connector - Azure Healthcare APIs
description: This document provides answers to the frequently asked questions about IoT connector.
services: healthcare-apis
author: msjasteppe
ms.custom: references_regions
ms.service: healthcare-apis
ms.topic: reference
ms.date: 11/05/2021
ms.author: jasteppe
---

# Frequently asked questions about IoT connector

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Here are some of the frequently asked questions about IoT connector.

## IoT connector: The basics

### What are the differences between the Azure API for FHIR IoT connector (preview) and the Azure Healthcare APIs IoT connector?

Azure Healthcare APIs IoT connector is the successor to the Azure API for Fast Healthcare Interoperability Resources (FHIR&#174;) IoT connector (preview). 

Several improvements have been introduced including customer-hosted device message ingestion endpoints (for example: an Azure Event Hub), the use of Managed Identities, and Azure Role-Based Access Control (Azure RBAC).

### Can I use IoT connector with a different FHIR service other than the Azure Healthcare APIs FHIR service?

No. The Azure Healthcare APIs IoT connector currently only supports the Azure Healthcare APIs FHIR service for persistence of data. The open-source version of the IoT connector supports the use of different FHIR services. For more information, see the [Open-source projects](iot-git-projects.md) section.  

### What versions of FHIR does the IoT connector support?

The IoT connector currently only supports the persistence of [HL7 FHIR&#174; R4](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491). 

### What are the subscription quota limits for IoT connector?

* 25 IoT connectors per Subscription (not adjustable)
* 10 IoT connectors per Workspace (not adjustable)
* One FHIR destination* per IoT connector (not adjustable)

(* - FHIR Destination is a child resource of IoT connector)

### Can I use the IoT connector with device messages from Apple&#174;, Google&#174;, or Fitbit&#174; devices?

Yes. IoT connector supports device messages from all these platforms. For more information, see the [Open-source projects](iot-git-projects.md) section.  

## More frequently asked questions
[FAQs about the Azure Healthcare APIs](../healthcare-apis-faqs.md)

[FAQs about Azure Healthcare APIs FHIR service](../fhir/fhir-faq.md)

[FAQs about Azure Healthcare APIs DICOM service](../dicom/dicom-services-faqs.yml)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
