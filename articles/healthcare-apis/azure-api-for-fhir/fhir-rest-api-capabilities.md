---
title: FHIR REST API capabilities for Azure API for FHIR
description: This article describes the RESTful interactions and capabilities for Azure API for FHIR.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 9/27/2023
ms.author: kesheth
---

# FHIR REST API capabilities for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this article, we'll cover some of the nuances of the RESTful interactions of Azure API for FHIR.

## Conditional create/update

Azure API for FHIR supports create, conditional create, update, and conditional update as defined by the FHIR specification. One useful header in these scenarios is the [If-Match](https://www.hl7.org/fhir/http.html#concurrency) header. The `If-Match` header is used and will validate the version being updated before making the update. If the `ETag` doesn’t match the expected `ETag`, it will produce the error message *412 Precondition Failed*. 

## Delete and Conditional Delete

Azure API for FHIR offers two delete types. There's [Delete](https://www.hl7.org/fhir/http.html#delete), which is also know as Hard + Soft Delete, and [Conditional Delete](https://www.hl7.org/fhir/http.html#3.1.0.7.1).

**Delete can be performed for individual resource id or in bulk. To learn more on deleting resources in bulk, visit [$bulk-delete operation](bulk-delete-operation.md).**

### Delete (Hard + Soft Delete)

Delete defined by the FHIR specification requires that after deleting a resource, subsequent non-version specific reads of a resource returns a 410 HTTP status code. Therefore, the resource is no longer found through searching. Additionally, Azure API for FHIR enables you to fully delete (including all history) the resource. To fully delete the resource, you can pass a parameter settings `hardDelete` to true `(DELETE {{FHIR_URL}}/{resource}/{id}?hardDelete=true)`. If you don't pass this parameter or set `hardDelete` to false, the historic versions of the resource will still be available.

> [!NOTE]
> If you only want to delete the history, Azure API for FHIR supports a custom operation called `$purge-history`. This operation allows you to delete the history off of a resource.

### Conditional Delete

 Conditional Delete allows you to pass search criteria to delete a resource. By default, the Conditional Delete allows you to delete one item at a time. You can also specify the `_count` parameter to delete up to 100 items at a time. Below are some examples of using Conditional Delete.

To delete a single item using Conditional Delete, you must specify search criteria that returns a single item.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704`

You can do the same search but include `hardDelete=true` to also delete all history.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&hardDelete=true`

To delete multiple resources, include `_count=100` parameter. This parameter will delete up to 100 resources that match the search criteria.

`DELETE https://{{FHIR_URL}}/Patient?identifier=1032704&_count=100`
 
### Recovery of deleted files

If you don't use the hard delete parameter, then the record(s) in Azure API for FHIR should still exist. The record(s) can be found by doing a history search on the resource and looking for the last version with data.
 
If the ID of the resource that was deleted is known, use the following URL pattern:

`<FHIR_URL>/<resource-type>/<resource-id>/_history`

For example: `https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/123456789/_history`
 
If the ID of the resource isn't known, do a history search on the entire resource type:

`<FHIR_URL>/<resource-type>/_history`

For example: `https://myworkspace-myfhirserver.fhir.azurehealthcareapis.com/Patient/_history`

After you've found the record you want to restore, use the `PUT` operation to recreate the resource with the same ID, or use the `POST` operation to make a new resource with the same information.
 
> [!NOTE]
> There is no time-based expiration for history/soft delete data. The only way to remove history/soft deleted data is with a hard delete or the purge history operation.

## Patch and Conditional Patch

Patch is a valuable RESTful operation when you need to update only a portion of the FHIR resource. Using patch allows you to specify the element(s) that you want to update in the resource without having to update the entire record. FHIR defines three ways to Patch resources: JSON Patch, XML Patch, and FHIRPath Patch. The FHIR Service support both JSON Patch and FHIRPath Patch along with Conditional JSON Patch and Conditional FHIRPath Patch (which allows you to Patch a resource based on a search criteria instead of a resource ID). To walk through some examples, refer to the sample [FHIRPath Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/FhirPatchRequests.http) and the [JSON Patch REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/JsonPatchRequests.http) for each approach. For additional details, read the [HL7 documentation for patch operations with FHIR](https://www.hl7.org/fhir/http.html#patch).

> [!NOTE]
> When using `PATCH` against STU3, and if you are requesting a History bundle, the patched resource's `Bundle.entry.request.method` is mapped to `PUT`. This is because STU3 doesn't contain a definition for the `PATCH` verb in the [HTTPVerb value set](http://hl7.org/fhir/STU3/valueset-http-verb.html).

### Patch with FHIRPath Patch

This method of patch is the most powerful as it leverages [FHIRPath](https://hl7.org/fhirpath/) for selecting which element to target. One common scenario is using FHIRPath Patch to update an element in a list without knowing the order of the list. For example, if you want to delete a patient’s home telecom information without knowing the index, you can use the example below.

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

JSON Patch in the FHIR Service conforms to the well-used [specification defined by the Internet Engineering Task Force](https://datatracker.ietf.org/doc/html/rfc6902). The payload format does not use FHIR resources and instead uses a JSON document leveraging JSON-Pointers for element selection. JSON Patch is more compact and has a test operation that allows you to validate that a condition is true before doing the patch. For example, if you want to set a patient as deceased only if they're not already marked as deceased, you can use the example below.

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

#### JSON Patch in Bundles

By default, JSON Patch isn't supported in Bundle resources. This is because a Bundle only supports with FHIR resources and the JSON Patch payload isn't a FHIR resource. To work around this, we'll use Binary resources with a Content-Type of `"application/json-patch+json"` and the base64 encoding of the JSON payload inside of a Bundle. For information about this workaround, view this topic on the [FHIR Chat Zulip](https://chat.fhir.org/#narrow/stream/179166-implementers/topic/Transaction.20with.20PATCH.20request). 

In the example below, we want to change the gender on the patient to female. We've taken the JSON patch `[{"op":"replace","path":"/gender","value":"female"}]` and encoded it to base64.

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

## Next steps

In this article, you learned about some of the REST capabilities of Azure API for FHIR. Next, you can learn more about the key aspects to searching resources in FHIR. 

>[!div class="nextstepaction"]
>[Overview of search in Azure API for FHIR](overview-of-search.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
