---
title: REST API capabilities in the FHIR service in Azure Health Data Services
description: Explore the RESTful capabilities of Azure Health Data Services FHIR API, including conditional operations and resource management. Learn more about efficient healthcare data handling.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 05/14/2024
ms.author: kesheth
---

# REST API capabilities in the FHIR service in Azure Health Data Services

In this article, we cover some of the nuances of the RESTful interactions of the FHIR&reg; service in Azure Health Data Services.

## Conditional create/update

The FHIR service supports create, conditional create, update, and conditional update as defined by the FHIR specification. One useful header in these scenarios is the [If-Match](https://www.hl7.org/fhir/http.html#concurrency) header. The `If-Match` header is used and validates the version being updated before making the update. If the `ETag` doesn’t match the expected `ETag`, it produces the error message *412 Precondition Failed*. 

## Delete and conditional delete

The FHIR service offers two delete types. There's [Delete](https://www.hl7.org/fhir/http.html#delete), which is also know as Hard + Soft Delete, and [Conditional Delete](https://www.hl7.org/fhir/http.html#3.1.0.7.1).

**Delete can be performed for individual resource id or in bulk. To learn more on deleting resources in bulk, visit [$bulk-delete operation](fhir-bulk-delete.md).**

### Delete (hard and soft delete)

Delete defined by the FHIR specification requires that after deleting a resource, subsequent nonversion reads of a resource return a 410 HTTP status code. Therefore, the resource is no longer found through searching. Additionally, the FHIR service enables you to fully delete (including all history) the resource. To fully delete the resource, pass a parameter setting `hardDelete` to true `(DELETE {{FHIR_URL}}/{resource}/{id}?hardDelete=true)`. If you don't pass this parameter or set `hardDelete` to false, the historic versions of the resource are still available.

> [!NOTE]
> If you only want to delete the history, the FHIR service supports a custom operation called `$purge-history`. This operation allows you to delete the history from a resource.

### Conditional delete

 Conditional delete allows you to pass search criteria to delete a resource. By default, the Conditional delete allows you to delete one item at a time. You can also specify the `_count` parameter to delete up to 100 items at a time. Here are some examples of using conditional delete.

To delete a single item, specify search criteria that return a single item.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704`

Or, do the same search but include `hardDelete=true` to also delete all history.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&hardDelete=true`

To delete multiple resources, include the `_count=100` parameter. This parameter deletes up to 100 resources that match the search criteria.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&_count=100`
 
### Recovery of deleted files

If you don't use the hard delete parameter, then the records in the FHIR service still exist. Find the records by doing a history search on the resource and looking for the last version with data.
 
If you don't know the ID of the resource that was deleted, use this URL pattern:

`<FHIR_URL>/<resource-type>/<resource-id>/_history`

For example: `https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/123456789/_history`
 
If you don't know the ID of the resource, do a history search on the entire resource type:

`<FHIR_URL>/<resource-type>/_history`

For example: `https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/_history`

After you find the record to restore, use the `PUT` operation to recreate the resource with the same ID, or use the `POST` operation to make a new resource with the same information.
 
> [!NOTE]
> There is no time-based expiration for history or soft delete data. The only way to remove history or soft-deleted data is with a hard delete or the purge history operation.

[!INCLUDE [Bundle details](../includes/rest-api-bundle-common.md)]

## Patch and conditional patch

Patch is a valuable RESTful operation when you need to update only a portion of the FHIR resource. Using patch allows you to specify the element that you want to update in the resource without having to update the entire record. FHIR defines three ways to patch resources: JSON Patch, XML Patch, and FHIRPath Patch. The FHIR service supports JSON Patch and FHIRPath Patch, along with Conditional JSON Patch and Conditional FHIRPath Patch (which allows you to patch a resource based on a search criteria instead of a resource ID). For some examples, refer to the [FHIRPath Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/FhirPatchRequests.http) and the [JSON Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/JsonPatchRequests.http). For more information, see [HL7 documentation for patch operations with FHIR](https://www.hl7.org/fhir/http.html#patch).

> [!NOTE]
> When using `PATCH` against STU3, and if you are requesting a History bundle, the patched resource's `Bundle.entry.request.method` is mapped to `PUT`. This is because STU3 doesn't contain a definition for the `PATCH` verb in the [HTTPVerb value set](http://hl7.org/fhir/STU3/valueset-http-verb.html).

### Patch with FHIRPath patch

This method of patch is the most powerful as it uses [FHIRPath](https://hl7.org/fhirpath/) for selecting which element to target. One common scenario is using FHIRPath Patch to update an element in a list without knowing the order of the list. For example, if you want to delete a patient’s home telecom information without knowing the index, you can use the example.

PATCH `http://{FHIR-SERVICE-HOST-NAME}/Patient/{PatientID}`<br/>
Content-type: `application/fhir+json`

```
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

Any FHIRPath Patch operations must have the `application/fhir+json` Content-Type header set. FHIRPatch Patch supports add, insert, delete, remove, and move operations. FHIRPatch Patch operations also can be easily integrated into Bundles. For more examples, look at the sample [FHIRPath Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/FhirPatchRequests.http).

### Patch with JSON Patch

JSON Patch in the FHIR Service conforms to the well-used [specification defined by the Internet Engineering Task Force](https://datatracker.ietf.org/doc/html/rfc6902). The payload format doesn't use FHIR resources and instead uses a JSON document using JSON-Pointers for element selection. JSON Patch is more compact and has a test operation that allows you to validate that a condition is true before doing the patch. For example, if you want to set a patient as deceased only if they're not already marked as deceased, you can use the example.

PATCH `http://{FHIR-SERVICE-HOST-NAME}/Patient/{PatientID}`<br/>
Content-type: `application/json-patch+json`

```
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

Any JSON Patch operations must have the `application/json-patch+json` Content-Type header set. JSON Patch supports add, remove, replace, copy, move, and test operations. For more examples, look at the sample [JSON Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/JsonPatchRequests.http).

#### JSON Patch in bundles

By default, JSON Patch isn't supported in bundle resources because a bundle only supports with FHIR resources and the JSON Patch payload isn't a FHIR resource. To work around this constraint, use binary resources with a content type `"application/json-patch+json"` and the base64 encoding of the JSON payload inside of a bundle. For more information, see the [FHIR Chat Zulip](https://chat.fhir.org/#narrow/stream/179166-implementers/topic/Transaction.20with.20PATCH.20request). 

In the example, we change the gender for the patient to female. We take the JSON Patch `[{"op":"replace","path":"/gender","value":"female"}]` and encoded it to base64.

POST `https://{FHIR-SERVICE-HOST-NAME}/`<br/>
Content-Type: `application/json`

```
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

## Related content

[Overview of FHIR search](overview-of-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
