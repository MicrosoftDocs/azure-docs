---
title: Azure API for FHIR monthly releases 2025
description: This article provides details about the Azure API for FHIR monthly features and enhancements in 2025.
services: healthcare-apis
author: KendalBond007
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 01/22/2025
ms.custom: references_regions
ms.author: kesheth
---

# Release notes 2025: Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR&reg; provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

## January 2025

### Enhancement: Improved error handling and validation

HTTP Method Validation for Transaction Bundle Requests:
Added validation to ensure the HTTP method in the Request component of the transaction bundle is a valid HTTPVerb enum value. If the HTTP method is invalid or null, a `RequestNotValidException` is thrown with a `400 Bad Request` status, providing a clearer error message to users.

Partition Size Error Handling: When a partition exceeds 20GB, a `PreconditionFailedException` is raised, replacing the previous HTTP 500 errors with HTTP 400 errors. This indicates to customers that the failure is due to an issue on their end (partition size).

Transaction Failure Exception: A new FHIR-specific exception type has been introduced to handle Cosmos DB transaction failures, replacing the generic `InvalidOperationExceptions`.

CMK Error Handling: Improved error handling for operations dependent on customer-managed keys. Users will now see a more specific error message and a link to [Microsoft's troubleshooting guide](../fhir/configure-customer-managed-keys.md) if issues occur related to CMK.

## Related content

[Release notes pre-2025](release-notes.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]