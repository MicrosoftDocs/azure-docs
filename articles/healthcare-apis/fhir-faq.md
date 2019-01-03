---
title: Common Questions
description: Common Questions
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: reference
ms.date: 02/11/2019.
ms.author: mihansen
---

# Frequently Asked Questions for Microsoft Healthcare APIs

## Are the data behind the FHIR APIs stored in Azure?

Yes, the data are stored in managed databases in Azure. The Microsoft Healthcare APIs for FHIR does not provide direct access to the underlying data store.

## What identity providers can I use to secure my FHIR API?

We currently support Microsoft Azure Active Directory as the identity provider.

## What version of FHIR is supported?

Currently we support version 3.0.1. R4 will be supported in the future. See [Supported Features](fhir-features-supported.md) for details.

## What is the difference between the OSS FHIR Server for Azure and Microsoft Healthcare APIs for FHIR?

The Microsoft Healthcare APIs for FHIR is a hosted and managed version of the OSS Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance, updates, etc. When running the OSS FHIR Server for Azure, you have direct access to the underlying services, but you are also responsible for maintaining and updating the server.
