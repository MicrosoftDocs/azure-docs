---
title: $expand
description: Overview of $expand in Azure Health Data Services FHIR
author: evachen96
ms.author: evach
ms.service: azure-health-data-services
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 10/10/2025

---

# `$expand` operation in FHIR service
The [$expand operation](https://hl7.org/fhir/R4/valueset-operation-expand.html), as defined as part of US Core 6.1.0, is used to determine the values in a ValueSet.  

## `$expand` parameters
|Parameter|Description|
|---|---|
|url|Canonical reference of the value set.|
| valueSet| Provide the value set directly as part of the request.|
|context| The context of the value set. For more information see [$expand](https://hl7.org/fhir/R4/valueset-operation-expand.html).|

> [!NOTE]
> Other $expand parameters beyond this list aren't currently supported.

## Example `$expand` requests

**Expanding a value set by its canonical URL using GET syntax**

```
GET [base]/ValueSet/$expand?url=http://acme.com/fhir/ValueSet/23
```

**Expanding a value set by its canonical URL using POST syntax**

```
POST [base]/ValueSet/$expand
```
POST request body:
```json
{
  "resourceType": "Parameters",
  "id": "expand",
  "parameter": [
    {
      "name": "url",
      "value": "http://acme.com/fhir/ValueSet/23"
    }
  ]
}
```

**Expanding a value set already registered on the server using GET syntax**

```
GET [base]/ValueSet/23/$expand
```

**Expanding a value set in the parameters using POST syntax**

```
POST [base]/ValueSet/$expand
```
POST request body:
```json
{
  "resourceType": "Parameters",
  "id": "expand",
  "parameter": [
    {
      "name": "valueSet",
      "resource": {
        "resourceType": "ValueSet",
        <value set details>
      }
    }
  ]
}
```

**Expanding a value set for a particular element, for what a client is allowed to PUT/POST**
```
GET [base]/ValueSet/$expand? context=http://fhir.org/guides/argonaut-clinicalnotes/StructureDefinition/argo-diagnosticreport#DiagnosticReport.category
```
## Related content
[US Core overview in Azure Health Data Services FHIR](./us-core.md)


[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]

