---
title: Perform bulk updates on FHIR data in Azure Health Data Services
description: Learn how to bulk update resources from the FHIR service in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/17/2025
ms.author: kesheth
---

# Perform bulk updates on FHIR data

The $bulk-update operation allows you to update multiple FHIR resources in bulk using asynchronous processing. It supports: 
 - System-level updates across all resource types
 - Updates scoped to individual resource types
 - Multi-resource operations in a single request

> [!NOTE]
> Use the $bulk-update operation with caution. Updated resources can't be rolled back once committed. We recommend that you first run a FHIR search with the same parameters as the bulk update job to verify the data that you want to update.

Bulk update operation uses the supported patch types listed below to perform updates.
 - replace: Replace an existing value. It leverages the FHIR Patch "replace" semantic, ensuring updates remain idempotent
 - upsert: This operation adds a value if it doesn’t exist, or replace if it does

> [!NOTE]
> Other Patch operations (e.g., add, move, delete, insert) are not supported.

## Prerequisites for bulk update operation
### Required roles

To execute a bulk update, the application or user must be assigned one of the following roles:
 - FHIR Data Bulk Operator: Provides access to bulk operations in the FHIR service.
 - FHIR Data Contributor: Administrative access to the FHIR service.

### Required headers

| Header | Value |
| ------ | ------ |
| Accept | application/fhir+json |
| Prefer | respond-async |

## Request

You can use FHIR search parameters in the request. The bulk update operation supports standard search filters, for example: address:contains=Meadow, or Patient.birthdate=1987-02-20. You can also use _include, _revinclude, and _not-referenced to extend search criteria.

### Request examples

1. System level bulk update: Execution of the operation at system-level enables update on FHIR resources across all the resource types on the FHIR server. **PATCH https://{FHIR-SERVICE-HOST}/$bulk-update**
2. Updates scoped to individual resource type: Execution of the operation for individual resource types allows update on FHIR resources that map to the resource type in the URL. **PATCH https://{FHIR-SERVICE-HOST}/[ResourceType]/$bulk-update**
3. Querying resources to update based on search parameters. In this example we will be using `_include` and `_revinclude`
   Update all Patient resources last updated before 2021-12-18 and any resources referencing them:
    - <b>PATCH {FHIR-SERVICE-HOST}/Patient/$bulk-update?_lastUpdated=lt2021-12-18&_revinclude=*</b>
    - **PATCH {FHIR-SERVICE-HOST}/DiagnosticReport/$bulk-update?_lastUpdated=lt2021-12-12&_include=DiagnosticReport:based-on:ServiceRequest&_include:iterate=ServiceRequest:encounter**

When using bulk update with FHIR search parameters, consider using the same query in a FHIR search first, so that you can verify the data that you plan to update.

The following is an example request body.
```
{ 

  "resourceType": "Parameters", 

  "parameter": [ 

    { 

      "name": "operation", 

      "part": [ 

        { 

          "name": "type", 

          "valueCode": "upsert" 

        }, 

        { 

          "name": "path", 

          "valueString": "Resource.meta" 

        }, 

        { 

          "name": "name", 

          "valueString": "security" 

        }, 

        { 

          "name": "value", 

          "valueCoding": { 

            "system": "http://example.org/security-system", 

            "code": "SECURITY_TAG_CODE", 

            "display": "Updated Security Tag Display" 

          } 

        } 

      ] 

    } 

  ] 

}
```

### Key points
