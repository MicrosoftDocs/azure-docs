---
title: History Management in Azure API for FHIR
description: This article describes the $purge-history operation for Azure API for FHIR.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: kesheth
---

# History management for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

History in FHIR&reg; gives you the ability to see all previous versions of a resource. History in FHIR can be queried at the resource, type, or system level. The HL7 FHIR documentation has more information about the [history interaction](https://www.hl7.org/fhir/http.html#history). History is useful in scenarios where you want to see the evolution of a resource in FHIR, or if you want to see the information of a resource at a specific point in time.

All past versions of a resource are considered obsolete and the current version of a resource should be used for normal business workflow operations. However, it can be useful to see the state of a resource as a point in time when a past decision was made.

The query parameter `_summary=count` and `_count=0` can be added to a `_history` endpoint to get a count of all versioned resources. This count includes soft deleted resources. 


Azure API for FHIR allows you to manage history in the following ways.
1. **Disabling history**: To disable history, a one time support ticket needs to be created. After a disable history configuration is set, history isn't created for resources on the FHIR server and Resource version is incremented. Disabling history doesn't remove the existing history for any resources in your FHIR service. If you're looking to delete the existing history data in your FHIR service, you must use the `$purge-history` operation.

1. **Purge History**: The `$purge-history` operation allows you to delete the history of a single FHIR resource. This operation isn't defined in the FHIR specification.

## Overview of purge history

The `$purge-history` operation was created to help with the management of resource history in Azure API for FHIR. It's uncommon to purge resource history. However, it's needed in cases when the system or resource level versioning policy changes, and you want to clean up existing resource history.

Since `$purge-history` is a resource level operation versus a type level or system level operation, you need to run the operation for every resource from which you want to remove the history.

By default, the purge history operation waits for successful completion before deleting resources. However, if any errors occur during the execution of the purge history operation, the deletion of resources is rolled back. To prevent this rollback behavior, use the optional query parameter `allowPartialSuccess` and set it to true during the purge-history call. This ensures that the transaction isn't rolled back if there's an error.

## Examples of purge history

To use `$purge-history`, you must add `/$purge-history` to the end of a standard delete request. The following is a template for the request.

```http
DELETE <FHIR-Service-Url>/<Resource-Type>/<Resource-Id>/$purge-history
```

For example:

```http
DELETE https://workspace-fhir.fhir.azurehealthcareapis.com/Observation/123/$purge-history
```

To use the `allowPartialSuccess` parameter, you need to set it to true. The following template of the request.

```http
DELETE <FHIR-Service-Url>/<Resource-Type>/<Resource-Id>/$purge-history?allowPartialSuccess=true
```

## Next steps

In this article, you learned how to purge the history for resources in Azure API for FHIR. For more information about Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

>[!div class="nextstepaction"]
>[FHIR REST API capabilities for Azure API for FHIR](fhir-rest-api-capabilities.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]