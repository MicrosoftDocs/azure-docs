---
title: Frequently asked questions (FAQ) about FHIR services in Azure - Microsoft Healthcare APIs
description: This FAQ article answers frequently asked questions about Microsoft Healthcare APIs
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: reference
ms.date: 02/11/2019
ms.author: mihansen
---

# Frequently Asked Questions about Microsoft Healthcare APIs

## Storage location

Are the data behind the FHIR APIs stored in Azure? Yes, the data are stored in managed databases in Azure. The Microsoft Healthcare APIs for FHIR does not provide direct access to the underlying data store.

## Identity providers

We currently support Microsoft Azure Active Directory as the identity provider.

## Supported FHIR version

Currently we support version 3.0.1. See [Supported Features](fhir-features-supported.md) for details.

## Compare OSS FHIR Server and Microsoft Healthcare APIs

What is the difference between the Microsoft FHIR server for Azure and Microsoft Healthcare APIs for FHIR? The Microsoft Healthcare APIs for FHIR is a hosted and managed version of the OSS Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance, updates, etc. When running the OSS FHIR Server for Azure, you have direct access to the underlying services, but you are also responsible for maintaining and updating the server.

## Next steps

In this article, you've read some of the frequently asked questions about Microsoft Healthcare APIs. Read about the supported API features in Microsoft FHIR server for Azure.
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)