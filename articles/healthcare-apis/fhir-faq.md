---
title: Frequently asked questions (FAQ) about FHIR services in Azure - Azure API for FHIR
description: This FAQ article answers frequently asked questions about Azure API for FHIR
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/07/2019
ms.author: mihansen
---

# Frequently Asked Questions about Azure API for FHIR

## Storage location

**Is the data behind the FHIR&reg; APIs stored in Azure?** Yes, the data is stored in managed databases in Azure. The Azure API for FHIR does not provide direct access to the underlying data store.

## Identity providers

We currently support Microsoft Azure Active Directory as the identity provider.

## Supported FHIR version

Azure API for FHIR (PaaS): We support version 3.0.1

FHIR Server for Azure (OSS): We support version 4.0.0, the most recent version of the FHIR specification, in addition to version 3.0.1.

See [Supported Features](fhir-features-supported.md) for details. Read about what has changed between versions in [HL7 FHIR's Version History](http://hl7.org/fhir/R4/history.html)

## OSS and Azure API for FHIR

What is the difference between the Open Source Microsoft FHIR server for Azure and Azure API for FHIR? The Azure API for FHIR is a hosted and managed version of the OSS Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance, updates, etc. When running the OSS FHIR Server for Azure, you have direct access to the underlying services, but you are also responsible for maintaining, updating the server and all required compliance work if storing PHI data.

## Next steps

In this article, you've read some of the frequently asked questions about Azure API for FHIR. Read about the supported API features in Microsoft FHIR server for Azure.
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)