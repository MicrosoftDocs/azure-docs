---
title: REST API capabilities in the FHIR service in Azure Health Data Services
description: Learn about the REST API capabilities of the FHIR service in Azure Health Data Services, including create, update, delete, history, and patch interactions to manage healthcare data efficiently.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 05/08/2026
ms.author: kesheth
---

# REST API capabilities in the FHIR service in Azure Health Data Services

This article describes FHIR service REST API capabilities in Azure Health Data Services, including create, update, delete, history, and patch interactions. Use these capabilities to manage healthcare data more efficiently.

## Create and update

The FHIR service supports the following create and update interactions as defined by the FHIR specification:

- [create](https://www.hl7.org/fhir/r4/http.html#create)
- [conditional create](https://www.hl7.org/fhir/r4/http.html#ccreate)
- [update](https://www.hl7.org/fhir/r4/http.html#update)
- [conditional update](https://www.hl7.org/fhir/r4/http.html#cond-update) 

 A useful header in these scenarios is the [If-Match](https://www.hl7.org/fhir/r4/http.html#concurrency) header. Use the `If-Match` header to validate the version you're updating before making the update. If the `ETag` doesn't match the expected `ETag`, the interaction returns the error message *412 Precondition Failed*. 

## Delete and conditional delete

The FHIR service offers two delete types. There's [Delete](https://www.hl7.org/fhir/r4/http.html#delete), which is also known as hard and soft delete, and [Conditional Delete](https://www.hl7.org/fhir/r4/http.html#3.1.0.7.1).

Use delete interactions to remove individual resources by ID or to remove resources in bulk by using search criteria with conditional delete. You can also remove larger sets of resources in bulk by using the `$bulk-delete` operation. To learn more about deleting resources in bulk, see [$bulk-delete operation](fhir-bulk-delete.md).

### Delete (hard and soft delete)

Use the `DELETE` interaction to delete a resource. The FHIR service supports both hard and soft delete. By default, the FHIR service performs a soft delete, which means that the resource is marked as deleted but still exists in the system. You can still access the resource's history and recover it if needed. By setting the `hardDelete` parameter to `true`, you can perform a hard delete, which permanently removes the resource and its history from the system.

```rest
DELETE {{FHIR_URL}}/{resource}/{id}?hardDelete=true
```

If you don't pass this parameter or set `hardDelete` to false, the historic versions of the resource are still available.

> [!NOTE]
> If you only want to delete the history, the FHIR service supports a custom operation called [$purge-history](purge-history.md). This operation deletes the history from a resource.

### Conditional delete

 Conditional delete enables you to pass search criteria to delete a resource. By default, conditional delete removes one item at a time. You can also specify the `_count` parameter to delete up to 100 items at a time. The following examples show how to use conditional delete.

To delete a single item, specify search criteria that return a single item.

```rest
DELETE https://{{FHIR_URL}}/Patient?identifier=1032704
```

Or, use the same search but include `hardDelete=true` to delete all history.

```rest
DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&hardDelete=true
```

To delete multiple resources, include the `_count=100` parameter. This parameter deletes up to 100 resources that match the search criteria.

```rest
DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&_count=100
```
 
### Recovery of deleted files

If you don't use the hard delete parameter, the records in the FHIR service still exist. You can find the records by doing a history search on the resource and looking for the last version with data.
 
If you don't know the ID of the deleted resource, use this URL pattern:

`<FHIR_URL>/<resource-type>/<resource-id>/_history`

For example: 

`https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/123456789/_history`
 
If you don't know the ID of the resource, do a history search on the entire resource type:

`<FHIR_URL>/<resource-type>/_history`

For example: 

`https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/_history`

After you find the record to restore, use the `PUT` operation to recreate the resource with the same ID, or use the `POST` operation to make a new resource with the same information.
 
> [!NOTE]
> There's no time-based expiration for history or soft delete data. The only way to remove history or soft-deleted data is with a hard delete or the purge history operation.

## Batch and transaction bundles 

In the FHIR service, [bundles](http://hl7.org/fhir/R4/bundle.html) are containers that hold multiple resources. By using batch and transaction bundles, you can submit a set of actions for a server to perform in a single HTTP request and response.

The server can perform the actions independently as a batch, or as a single atomic transaction where the entire set of changes succeeds or fails as a single entity. You can submit actions on multiple resources of the same or different types, such as create, update, or delete. For more information, see [FHIR bundles](http://hl7.org/fhir/R4/http.html#transaction).

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
> For batch bundles, different entries in a FHIR bundle don't have interdependencies. The success or failure of one entry doesn't affect the success or failure of another entry.

For a transaction bundle, all interactions or operations either succeed or fail together. When a transaction bundle fails, the FHIR service returns a single `OperationOutcome`. 

Transaction bundles don't support:

- Conditional delete
- Hard delete
- Search operations that use _search

### Bundle parallel processing 

The FHIR service executes batch and transaction bundles serially. To improve performance and throughput, the service supports parallel processing of bundles.

To use parallel batch bundle processing:

- Set the header `x-bundle-processing-logic` value to `parallel`.
- Ensure the same bundle doesn't contain overlapping resource IDs that execute on DELETE, POST, PUT, or PATCH operations.


## History

The [history](https://www.hl7.org/fhir/r4/http.html#history) interaction retrieves the history of either a particular resource, all resources of a given type, or all resources supported by the system. The HTTP GET command performs history interactions.

For example: 

```http
  GET https://{{FHIR_URL}}/{resource type}/{resource id}/_history
  GET https://{{FHIR_URL}}/{resource type}/_history
  GET https://{{FHIR_URL}}/_history
```

The response is a bundle with type set to the specified version history, sorted with oldest versions last, and including deleted resources. 

To search with history, use the following interactions.

* `_count` : defines the number of resources returned on single page.
* `_since` : includes resource versions created at or after the given instant in time.
* `_before` : includes resource versions that were created before the given instant in time.

For more information on history and version management, see [FHIR versioning policy and history management](fhir-versioning-policy-and-history-management.md).

## Patch and conditional patch

[Patch](https://www.hl7.org/fhir/r4/http.html#patch) is a valuable RESTful interaction when you need to update only a portion of the FHIR resource. By using patch, you can specify the element that you want to update in the resource without updating the entire record. FHIR defines three ways to patch resources: JSON Patch, XML Patch, and FHIRPath Patch. 

The FHIR service supports JSON Patch and FHIRPath Patch, including conditional versions that patch resources by search criteria instead of resource IDs.

For examples, refer to the [FHIRPath Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/FhirPatchRequests.http) and the [JSON Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/JsonPatchRequests.http). 


> [!NOTE]
> When you use `PATCH` against STU3 and request a History bundle, the patched resource's `Bundle.entry.request.method` maps to `PUT`. This mapping exists because STU3 doesn't contain a definition for the `PATCH` verb in the [HTTPVerb value set](http://hl7.org/fhir/STU3/valueset-http-verb.html).

The FHIR service supports the [$bulk-update](fhir-bulk-update.md) operation to perform multi-resource updates at system-level and type-level across all resources in bulk. This operation allows you to apply updates to a large set of resources that match specified search criteria, rather than updating resources individually.

### Patch with FHIRPath patch

This patch method is the most powerful because it uses [FHIRPath](https://hl7.org/fhirpath/) to select the element to target. A common scenario is using FHIRPath Patch to update an element in a list without knowing the order of the list. 

For example, if you want to delete a patient’s home telecom information without knowing the index, use the following FHIRPath Patch example.

```rest
PATCH `http://{FHIR-SERVICE-HOST-NAME}/Patient/{PatientID}`<br/>
Content-type: `application/fhir+json`

{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "operation",
            "part": [
                {
                    "name": "type",
                    "valueCode": "delete"
                },
                {
                    "name": "path",
                    "valueString": "Patient.telecom.where(use = 'home')"
                }
            ]
        }
    ]
}
```

Set the `application/fhir+json` Content-Type header for any FHIRPath Patch operations. FHIRPatch Patch supports add, insert, delete, remove, and move operations. You can also easily integrate FHIRPatch Patch operations into Bundles. 

For more examples, see the sample [FHIRPath Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/FhirPatchRequests.http).

### Patch with JSON Patch

JSON Patch in the FHIR service conforms to the well-used [specification defined by the Internet Engineering Task Force](https://datatracker.ietf.org/doc/html/rfc6902). The payload format doesn't use FHIR resources and instead uses a JSON document that uses JSON-Pointers for element selection. JSON Patch is more compact and has a test operation that you can use to validate that a condition is true before doing the patch. 

For example, if you want to set a patient as deceased only if they're not already marked as deceased, use the following JSON Patch example.

```rest
PATCH `http://{FHIR-SERVICE-HOST-NAME}/Patient/{PatientID}`<br/>
Content-type: `application/json-patch+json`

[
	{
		"op": "test",
		"path": "/deceasedBoolean",
		"value": false
	},
	{
		"op": "replace",
		"path": "/deceasedBoolean",
		"value": true
	}
]
```

Set the `application/json-patch+json` Content-Type header for any JSON Patch operations. JSON Patch supports add, remove, replace, copy, move, and test operations. For more examples, see the sample [JSON Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/JsonPatchRequests.http).

#### JSON Patch in bundles

By default, bundle resources don't support JSON Patch because a bundle only supports FHIR resources, and the JSON Patch payload isn't a FHIR resource. To work around this constraint, use binary resources with a content type of `"application/json-patch+json"` and the base64 encoding of the JSON payload inside of a bundle. For more information, see the [FHIR Chat Zulip](https://chat.fhir.org/#narrow/stream/179166-implementers/topic/Transaction.20with.20PATCH.20request). 

In the following example, you change the gender for the patient to female. You take the JSON Patch `[{"op":"replace","path":"/gender","value":"female"}]` and encode it to base64.

```http
POST `https://{FHIR-SERVICE-HOST-NAME}/`<br/>
Content-Type: `application/json`

{
	"resourceType": "Bundle",
	"id": "bundle-batch",
	"type": "batch",
	"entry": [
		{
			"fullUrl": "Patient/{PatientID}",
			"resource": {
				"resourceType": "Binary",
				"contentType": "application/json-patch+json",
				"data": "W3sib3AiOiJyZXBsYWNlIiwicGF0aCI6Ii9nZW5kZXIiLCJ2YWx1ZSI6ImZlbWFsZSJ9XQ=="
			},
			"request": { 
				"method": "PATCH",
				"url": "Patient/{PatientID}"
			}
		}
	]
}
```

#### Patch with `_meta-history` parameter

The FHIR service supports the `_meta-history` query parameter with both `PUT` and `PATCH` operations. When you set the FHIR server versioning policy to either `versioned` or `version-update`, the `_meta-history` parameter allows you to control whether metadata-only changes to a resource create a new historical version of the resource or not. 

By default, any change to a resource, including metadata-only changes, creates a new version and saves the previous version as a historical record. When you set the `_meta-history` parameter to `false`, metadata-only changes don't create a new version, and the previous version isn't saved as a historical record. This feature prevents metadata-only changes from cluttering the resource history with unnecessary versions. For more information and examples, see [FHIR versioning policy and history management](fhir-versioning-policy-and-history-management.md#metadata-only-updates-and-versioning).

```rest
PATCH <fhir server>/Patient/test-patient?_meta-history=false
```

## Related content

[Overview of FHIR search](overview-of-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
