---
title: FAQs about the MedTech service - Azure Health Data Services
description: This document provides answers to the frequently asked questions about the MedTech service.
services: healthcare-apis
author: msjasteppe
ms.custom: references_regions
ms.service: healthcare-apis
ms.topic: reference
ms.date: 07/19/2022
ms.author: jasteppe
---

# Frequently asked questions about the MedTech service

Here are some of the frequently asked questions about the MedTech service.

## MedTech service: The basics

### What are the differences between the Azure IoT Connector for FHIR and the Azure Health Data Services MedTech service?

Azure Health Data Services MedTech service is the successor to the Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;). 

Several improvements have been introduced including customer-hosted device message ingestion endpoints (for example: an Azure Event Hubs), the use of a system-assigned managed identity, and Azure role-based access control (Azure RBAC).

> [!IMPORTANT]
>
> As of September 2022, the IoT Connector feature within the Azure API for FHIR will be retired and replaced with the [MedTech service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md) for enhanced service quality and functionality.
> 
> All new users are directed to deploy and use the MedTech service feature within the Azure Health Data Services. 
> For more information about the MedTech service, see [What is the MedTech service?](../../healthcare-apis/iot/iot-connector-overview.md).

### Can I use the MedTech service with a different FHIR service other than the Azure Health Data Services FHIR service?

No. The Azure Health Data Services MedTech service currently only supports the Azure Health Data Services FHIR service for persistence of data. The open-source version of the MedTech service supports the use of different FHIR services. 

For more information, see the [Open-source projects](iot-git-projects.md) section of our documentation.  

### What versions of FHIR does the MedTech service support?

The MedTech service currently only supports the persistence of [HL7 FHIR&#174; R4](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491). 

### What are the subscription quota limits for the MedTech service?

* 25 MedTech services per Subscription (not adjustable)
* 10 MedTech services per workspace (not adjustable)
* One FHIR destination* per MedTech service (not adjustable)

(* - FHIR Destination is a child resource of the MedTech service)

### Can I use the MedTech service with device messages from Apple&#174;, Google&#174;, or Fitbit&#174; devices?

Yes. The MedTech service supports device messages from all these vendors. 

For more information, see the [Open-source projects](iot-git-projects.md) section of our documentation.  

## More frequently asked questions
[FAQs about the Azure Health Data Services](../healthcare-apis-faqs.md)

[FAQs about Azure Health Data Services FHIR service](../fhir/fhir-faq.md)

[FAQs about Azure Health Data Services DICOM service](../dicom/dicom-services-faqs.yml)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
