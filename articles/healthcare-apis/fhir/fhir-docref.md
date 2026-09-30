---
title: Fetch DocumentReference
description: Overview of $docref in Azure Health Data Services FHIR
author: evachen96
ms.author: evach
ms.service: azure-health-data-services
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 10/10/2025

---
# Fetch DocumentReference using `$docref` operation in FHIR service
The [$docref operation](https://www.hl7.org/fhir/us/core/STU6.1/OperationDefinition-docref.html), as defined as part of US Core 6.1.0, is used to return all the references to documents related to a patient. A `searchset` Bundle containing DocumentReference resources for the patient is returned. 

## `$docref` parameters
|Parameter|Description|
|---|---|
|patient|The ID of the patient resource.|
|start|The start date-time of the date range relates to care dates, not record currency dates. |
|end| The end date-time of the date range relates to care dates, not record currency dates. |
|type| The type relates to document type.|

> [!NOTE]
> On-demand and profile parameters aren't currently supported.

## Example `$docref` requests

**Request the latest CCD for a patient using GET syntax**

```
GET [base]/DocumentReference/$docref?patient=123
```

**Request the latest CCD for a patient using POST syntax**

```
POST [base]/DocumentReference/$docref
```
POST request body:
```json
{
  "resourceType": "Parameters",
  "id": "get-ccd123",
  "parameter": [
    {
      "name": "patient",
      "valueId": "123"
    }
  ]
}
```

**Request Discharge Summaries for 2019 using GET syntax**

```
GET [base]/DocumentReference/$docref?patient=123&start=2019-01-01&end=2019-12-31&type=https://loinc.org|18842-5
```

**Request Discharge Summaries for 2019 using POST syntax**

```
POST [base]/DocumentReference/$docref
```
POST request body:
```json
{
  "resourceType": "Parameters",
  "id": "get-docs",
  "parameter": [
    {
      "name": "patient",
      "valueId": "123"
    },
    {
      "name": "start",
      "valueDateTime": "2019-01-01"
    },
    {
      "name": "end",
      "valueDateTime": "2019-12-31"
    },
    {
      "name": "type",
      "valueCoding": {
        "system": "https://loinc.org",
        "code": "18842-5",
        "display": "Discharge summary"
      }
    }
  ]
}
```
## Related content
[US Core overview in Azure Health Data Services FHIR](./us-core.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]



