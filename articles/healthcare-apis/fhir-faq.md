---
title: FAQs about FHIR services in Azure - Azure API for FHIR
description: Get answers to frequently asked questions about Azure API for FHIR, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/07/2019
ms.author: mihansen
---

# Frequently Asked Questions about Azure API for FHIR

## General

**What is FHIR?**
The Fast Healthcare Interoperability Resources (FHIR- Pronounced Fire) is an interoperability standard intended to facilitate the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The Azure API for FHIR supports R4 and also supports the previous version STU3 (Standard for Trial Use 3. For more information and additional resources about FHIR see [HL7.org](https://hl7.org/fhir/).

**What is SMART?**
SMART (Substitutable Medical Applications and Reusable Technology) on FHIR® is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. One of the main purposes of the specifications is to describe how an application should authenticate itself. By creating a SMART on FHIR application, you are able to ensure that your application can be accessed and leveraged by a plethora of different systems. To learn more about SMART, visit [SMART Health IT](https://smarthealthit.org/) and check out the [SMART on FHIR Proxy Tutorial](use-smart-on-fhir-proxy.md).

## Storage location

**Is the data behind the FHIR&reg; APIs stored in Azure?** Yes, the data is stored in managed databases in Azure. The Azure API for FHIR does not provide direct access to the underlying data store.

## Identity providers

We currently support Microsoft Azure Active Directory as the identity provider.

## Supported FHIR version

We support versions 4.0.0 and 3.0.1 on both Azure API for FHIR (PaaS) and FHIR Server for Azure (OSS)

See [Supported Features](fhir-features-supported.md) for details. Read about what has changed between versions in [HL7 FHIR's Version History](https://hl7.org/fhir/R4/history.html)

## OSS and Azure API for FHIR

What is the difference between the Open Source Microsoft FHIR server for Azure and Azure API for FHIR? The Azure API for FHIR is a hosted and managed version of the OSS Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance, updates, etc. When running the OSS FHIR Server for Azure, you have direct access to the underlying services, but you are also responsible for maintaining, updating the server and all required compliance work if storing PHI data.

When developing new features, we first release features into the Open Source FHIR server for Azure and then work to integrate those features into the Azure API for FHIR.

## Next steps

In this article, you've read some of the frequently asked questions about Azure API for FHIR. Read about the supported API features in Microsoft FHIR server for Azure.
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)