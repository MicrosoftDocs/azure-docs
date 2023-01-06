---
title: Purge history operation for Azure API for FHIR
description: This article describes the $purge-history operation for Azure API for FHIR.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/03/2022
ms.author: kesheth
---

# Purge history operation for Azure API for FHIR

`$purge-history` is an operation that allows you to delete the history of a single FHIR resource. This operation isn't defined in the FHIR specification.

## Overview of purge history

The `$purge-history` operation was created to help with the management of resource history in Azure API for FHIR. It's uncommon to need to purge resource history. However, it's needed in cases when the system level or resource level versioning policy changes, and you want to clean up existing resource history.

Since `$purge-history` is a resource level operation versus a type level or system level operation, you'll need to run the operation for every resource that you want remove the history from.

## Examples of purge history

To use `$purge-history`, you must add `/$purge-history` to the end of a standard delete request. The template of the request is:

```http
DELETE <FHIR-Service-Url>/<Resource-Type>/<Resource-Id>/$purge-history
```

For example:

```http
DELETE https://workspace-fhir.fhir.azurehealthcareapis.com/Observation/123/$purge-history
```

## Next steps

In this article, you learned how to purge the history for resources in Azure API for FHIR. For more information about Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

>[!div class="nextstepaction"]
>[FHIR REST API capabilities for Azure API for FHIR](fhir-rest-api-capabilities.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.