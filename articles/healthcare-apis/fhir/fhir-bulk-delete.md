---
title: Bulk delete resources from the FHIR service in Azure Health Data Services
description: Learn how to bulk delete resources from the FHIR service in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/01/2025
ms.author: kesheth
---

# Bulk delete in the FHIR service

[!INCLUDE [bulk-delete operation common content](../includes/fhir-bulk-delete-operation.md)]

## End to end example: Utilizing `$bulk-delete` for data retention use cases
The various features of `$bulk-delete` can be used together to satisfy different use cases. Following is an example of utilizing $bulk-delete for data retention. 

Let’s say that you would like to delete Patient data that's older than three years old, along with all data that references to that Patient. However, as multiple Patients can map to a single Practitioner, you’d like to make sure that Practitioners aren't deleted until all their Patients are deleted. This use case can be achieved in a series of calls. 

First, you can delete all Patient resources older than three years old, along with all data that references to that Patient.  


`DELETE [base] /Patient/$bulk-delete?_lastUpdated=lt{date}&_revinclude=*:* `

Next, you can delete all Practitioner resources that aren't referenced by any Patient resources.

`DELETE [base]/Practitioner/$bulk-delete?_not-referenced=Patient:*`

## Related content

[Supported FHIR features](fhir-features-supported.md)

[FHIR REST API capabilities for Azure Health Data Services FHIR service](rest-api-capabilities.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]