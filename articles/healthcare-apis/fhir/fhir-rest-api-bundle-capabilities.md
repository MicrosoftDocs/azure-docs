---
title: FHIR Rest API Bundle capabilties
description: This article describes using bundles in FHIR service 
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 07/25/2023
ms.author: kesheth
---

## Bundle Overview 
In FHIR, bundles can be considered as a container that holds multiple resources. Batch and transaction bundles enable to submit a set of actions to be performed on a server in single HTTP request/response.
The actions may be performed independently as a "batch", or as a single atomic "transaction" where the entire set of changes succeed or fail as a single entity. Actions on multiple resources of the same or different types may be submitted, such as create, update, or delete. For more information, visit [FHIR bundles[(http://hl7.org/fhir/R4/http.html#transaction). 

A batch or transaction bundle interaction with FHIR service is performed with HTTP POST command at base URL.  
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

In the case of a batch each entry is treated as an individual interaction or operation, in the case of a transaction all interactions or operations either succeed or fail together. 
For a batch, or a successful transaction, the response contains one entry for each entry in the request. For failed transaction, FHIR service returns single OperationOutcome. 

**Note: For batch bundles there should be no interdependencies between different entries in FHIR bundle. The success or failure of one entry should not impact the success or failure of another entry.**

### Batch bundle parallel processing in public preview 

Currently Batch and transaction bundles are executed serially in FHIR service. To improve performance and throughput, we are enabling parallel processing of batch bundles in public preview.  
To use the capability of parallel batch bundle processing 

* Set header “x-bundle-processing-logic” value to “parallel”. 
* Ensure there is no overlapping resource id that is executing on DELETE, POST, PUT or PATCH operations in the same bundle 

> [!IMPORTANT]
> Bundle parallel processing is currently in public preview. Preview APIs and SDKs are provided without a service-level agreement. We recommend that you don't use them for production workloads. Some features might not be supported, or they might have constrained capabilities. For more information, review Supplemental Terms of Use for Microsoft Azure Previews 
