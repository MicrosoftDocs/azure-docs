---
title: Using custom headers
description: This article describes how to use custom HTTP headers in Azure API for FHIR.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/01/2019
---

## Using custom HTTP headers in calling the APIs

A caller of the Azure FHIR API may want to include additional information in the logs which comes from the calling system.  An example would be when the user of the API is authenticated by an external system which then forwards the call to the FHIR API.  Once at the FHIR API layer, the information about the original user has been lost due to the call being forwarded.  It may be necessary to log and retain this user information for auditing or management purposes.  The calling system can provide user identify, caller location or other necessary information in the HTTP headers, which will be carried along as the call is forwarded.

You can see a diagram of the data flow below.

:::image type="content" source="media/custom-headers/custom-headers-diagram.png" alt-text="custom-header-diagram":::

There are several ways to use custom headers when calling APIs. For example:

* Identity or authorization information
* Origin of the caller
* Originating organization
* Client system details (EHR, patient portal)

**Note:** Be aware, that the information sent in custom headers will be stored in Microsoft internal logging system for 30 days after being available in Azure Log Monitoring. We recommend encrypting any sensitive information (PHI/PII information) before adding them to custom headers.  