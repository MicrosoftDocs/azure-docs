---
title: "Include file"
description: "Include file"
services: healthcare-apis
ms.service: fhir
ms.topic: "Include"
ms.date: 05/14/2024
ms.author: kesheth
ms.custom: "include file"
---

## Batch and transaction bundles 
In the FHIR service, bundles are considered a container that holds multiple resources. Batch and transaction bundles enable users to submit a set of actions to be performed on a server in single HTTP request/response.
The actions can be performed independently as a batch, or as a single atomic transaction where the entire set of changes succeed or fail as a single entity. Actions on multiple resources of the same or different types can be submitted, such as create, update, or delete. For more information, see [FHIR bundles](http://hl7.org/fhir/R4/http.html#transaction). 

A batch or transaction bundle interaction with the FHIR service is performed with HTTP POST command at base URL.  
```rest
POST {{fhir_url}} 
{ 
  "resourceType": "Bundle", 
  "type": "batch", 
  "entry": [ 
    { 
      "resource": { 
        "resourceType": "Patient", 
        "id": "patient-1", 
        "name": [ 
          { 
            "given": ["Alice"], 
            "family": "Smith" 
          } 
        ], 
        "gender": "female", 
        "birthDate": "1990-05-15" 
      }, 
      "request": { 
        "method": "POST", 
        "url": "Patient" 
      } 
    }, 
    { 
      "resource": { 
        "resourceType": "Patient", 
        "id": "patient-2", 
        "name": [ 
          { 
            "given": ["Bob"], 
            "family": "Johnson" 
          } 
        ], 
        "gender": "male", 
        "birthDate": "1985-08-23" 
      }, 
      "request": { 
        "method": "POST", 
        "url": "Patient" 
      } 
    } 
   } 
  ] 
} 
```

For a batch, each entry is treated as an individual interaction or operation. 
> [!NOTE]
> For batch bundles there are no interdependencies between different entries in a FHIR bundle. The success or failure of one entry doesn't impact the success or failure of another entry.

For a transaction bundle, all interactions or operations either succeed or fail together. When a transaction bundle fails, the FHIR service returns a single `OperationOutcome`. 

Transaction bundles don't support:
- Conditional delete
- Search operations using _search 

### Bundle parallel processing 

Batch and transaction bundles are executed serially in the FHIR service. To improve performance and throughput, we enabled parallel processing of bundles.

To use parallel batch bundle processing:
- Set header `x-bundle-processing-logic` value to 1parallel`.
- Ensure there's no overlapping resource ID that executes on DELETE, POST, PUT, or PATCH operations in the same bundle.
