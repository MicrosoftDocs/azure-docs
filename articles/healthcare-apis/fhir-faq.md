---
title: FAQs about FHIR services in Azure - Azure API for FHIR
description: Get answers to frequently asked questions about the Azure API for FHIR, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/07/2019
ms.author: mihansen
---

# Frequently asked questions about the Azure API for FHIR

## What is FHIR?
The Fast Healthcare Interoperability Resources (FHIR - Pronounced "fire") is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The Azure API for FHIR supports R4 and also supports the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

## Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The Azure API for FHIR does not provide direct access to the underlying data store.

## What identity provider do you support?

We currently support Microsoft Azure Active Directory as the identity provider.

## What FHIR version do you support?

We support versions 4.0.0 and 3.0.1 on both the Azure API for FHIR (PaaS) and FHIR Server for Azure (open source).

For details, see [Supported features](fhir-features-supported.md). Read about what has changed between versions in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

## What's the difference between the open-source Microsoft FHIR Server for Azure and the Azure API for FHIR?

The Azure API for FHIR is a hosted and managed version of the open-source Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance and updates. 

When you're running FHIR Server for Azure, you have direct access to the underlying services. But you're also responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

From a development standpoint, every feature is deployed to the open-source Microsoft FHIR Server for Azure first. Once it has been validated in open-source, it will be released to the PaaS Azure API for FHIR solution. The time between the release in open-source and PaaS depends on the complexity of the feature and other roadmap priorities. 

## What is SMART on FHIR?

SMART (Substitutable Medical Applications and Reusable Technology) on FHIR is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. By creating a SMART on FHIR application, you can ensure that your application can be accessed and leveraged by a plethora of different systems.
Authentication and Azure API for FHIR. To learn more about SMART, visit [SMART Health IT](https://smarthealthit.org/).

# Frequently asked questions about IoMT connector (preview)

## What is IoMT?
IoMT stands for Internet of Medical Things and it's a category of IoT devices that capture and exchange health data with other healthcare IT systems over the internet. Some examples of IoMT devices include fitness and clinical wearables, monitoring sensors, activity trackers, point of care kiosks, or even a smart pill.

## Is there a limit on IoMT connector during public preview?
Yes, you can create only two IoMT connector per subscription while the feature is in public preview. This limit exists to prevent unexpected expense as the feature is free during the preview. On request this limit could be raised up to a maximum of five IoMT connectors.

## What Azure regions IoMT connector feature is available during public preview?
IoMT connector is available only in the following three Azure regions during public preview: West US 2, East US 2, and UK South. More regions will be added when the feature is released for General Availability (GA).

## Can I configure underlying resources used by IoMT connector?
No, during public preview you cannot configure settings for underlying resources like Azure Event Hub Throughput units, Stream Analytics Job Streaming units. Some form of resource allocation capability will be made available in General Availability (GA).   

## Why I cannot see IoMT connector feature under Azure API for FHIR?
You will not see IoMT connector if one of the following is true:
- Your Azure API for FHIR service is not installed on one of the supported regions.
- Your Azure API for FHIR service is running on a FHIR version DSTU3 or below.
- Your Azure API for FHIR service has Private link enabled.

## What's the difference between the open-source IoMT FHIR Connector for Azure and IoMT connector feature of Azure API for FHIR service?
IoMT connector is a hosted and managed version of the open-source IoMT FHIR Connector for Azure. In the managed service, Microsoft provides all maintenance and updates. 

When you're running IoMT FHIR Connector for Azure, you have direct access to the underlying services. But you're also responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

From a development standpoint, every feature is deployed to the open-source IoMT FHIR Connector for Azure first. Once it has been validated in open-source, it will be released to the PaaS IoMT connector feature of Azure API for FHIR service. The time between the release in open-source and PaaS depends on the complexity of the feature and other road-map priorities.

## Is IoMT connector a FDA-regulated medical device and/or whether IoMT connector requires QMS certification?
No IoMT connector is not a FDA-regulated medical device and doesn't require QMS certification.


## Next steps

In this article, you've read some of the frequently asked questions about the Azure API for FHIR. Read about the supported features in FHIR Server for Azure:
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)