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

## Next steps

In this article, you've read some of the frequently asked questions about the Azure API for FHIR. Read about the supported features in FHIR Server for Azure:
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)