---
title: Bulk delete resources from the FHIR service in Azure Health Data Services
description: Learn how to bulk delete resources from the FHIR service in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/05/2026
ms.author: kesheth
---

# Bulk delete in the FHIR service

[!INCLUDE [bulk-delete operation common content](../includes/fhir-bulk-delete-operation.md)]

## Use case example


You can use the various features of `$bulk-delete` together to satisfy different use cases. The following example shows how to use `$bulk-delete` for data retention.  

Suppose you want to delete Patient data that's older than three years, along with all data that references that patient. You also want to delete Practitioner resources that no Patient resources reference. 

You can achieve this use case with these two calls.  

First, delete all Patient resources that are older than three years, along with all data that references that patient.    

```rest
DELETE [base] /Patient/$bulk-delete?_lastUpdated=lt{date}&_revinclude=*:* 
```

Next, delete all Practitioner resources that no Patient resources reference.

```rest
DELETE [base]/Practitioner/$bulk-delete?_not-referenced=Patient:*
```

## Related content

[Supported FHIR features](fhir-features-supported.md)

[FHIR REST API capabilities](rest-api-capabilities.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]