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

## March 2025

**Improved Error Handling for $export**: Added retry logic for certain export queries that previously would not be retried.

**Billing for API for FHIR**: An issue was discovered that may have caused subscriptions to be underbilled in several regions, including North Europe, East US 2, Australia East, West Europe, Central India, Southeast Asia, and UK South. We corrected the billing error on March 1, 2025. If you were affected by this error, you won't be responsible for any missed charges prior to your March bill.

**Preview capability for the bulk delete operation**: Added support for _include and _revinclude to conditional and bulk delete requests. Users can now use _include and _revinclude in the search criteria for conditional and bulk delete. Please note that this does not affect current behavior of singular deletes, which does not support extra parameters. Learn more [here](./bulk-delete-operation.md).

**ValueSet size bug fix**: The maximum ValueSet size was reduced to 500 codes, preventing large valuesets from loading. This has been fixed, and the limit is now increased to 20,000 codes.


## February 2025

**Date Search Logic Update**: When searching for a date, the logic now ensures that any date range containing the searched date is included in the results. Previously, it only matched a date if the entire range was inside the searched date.

**Health Checks for Improved Resiliency**: Added health checks to enhance the resilience of the service such as retriable exceptions, enhanced diagnostic logging, and catching time out exceptions.

## January 2025

### Enhancement: Improved error handling and validation

**HTTP Method Validation for Transaction Bundle Requests**: Added validation to ensure the HTTP method in the Request component of the transaction bundle is a valid HTTPVerb enum value. If the HTTP method is invalid or null, a `RequestNotValidException` is thrown with a `400 Bad Request` status, providing a clearer error message to users.

**Partition Size Error Handling**: When a partition exceeds 20GB, a `PreconditionFailedException` is raised, replacing the previous HTTP 500 errors with HTTP 400 errors. This indicates to customers that the failure is due to an issue on their end (partition size).

**Transaction Failure Exception**: A new FHIR-specific exception type has been introduced to handle Cosmos DB transaction failures, replacing the generic `InvalidOperationExceptions`.

**CMK Error Handling**: Improved error handling for operations dependent on customer-managed keys. Users now see a more specific error message and a link to [Microsoft's troubleshooting guide](../fhir/configure-customer-managed-keys.md) if issues occur related to CMK.

## Related content

[Release notes pre-2025](release-notes.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
