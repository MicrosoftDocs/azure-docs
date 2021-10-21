---
title: FHIR Rest API capabilities for Azure Healthcare APIs FHIR service
description: This article describes the RESTful interactions and capabilities for Azure Healthcare APIs FHIR service.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/06/2021
ms.author: cavoeg
---

# FHIR Rest API capabilities for Azure Healthcare APIs FHIR service

In this article, we'll cover some of the nuances of the RESTful interactions of Azure Healthcare APIs FHIR service (hereby called the FHIR service).


## Conditional create/update

The FHIR service supports create, conditional create, update, and conditional update as defined by the FHIR specification. One useful header in these scenarios is the [If-Match](https://www.hl7.org/fhir/http.html#concurrency) header. The `If-Match` header is used and will validate the version being updated before making the update. If the `ETag` doesn’t match the expected `ETag`, it will produce the error message *412 Precondition Failed*. 

## Delete

[Delete](https://www.hl7.org/fhir/http.html#delete) defined by the FHIR specification requires that after deleting, subsequent non-version specific reads of a resource returns a 410 HTTP status code, and the resource is no longer found through searching. Additionally, the FHIR service enables you to fully delete (including all history) the resource. To fully delete the resource, you can pass a parameter settings `hardDelete` to true (`DELETE {server}/{resource}/{id}?hardDelete=true`). If you don't pass this parameter or set `hardDelete` to false, the historic versions of the resource will still be available.

> [!NOTE]
> If you want to delete only the history, the FHIR service supports a custom operations, `$purge-history`, which allows you to delete the history off of a resource. 

## Conditional delete

In addition to delete, the FHIR service supports conditional delete, which allows you to pass a search criteria to delete a resource. By default, the conditional delete allows you to delete one item at a time. You can also specify the `_count` parameter to delete up to 100 items at a time. Below are some examples of using conditional delete.

To delete a single item using conditional delete, you must specify search criteria that returns a single item.

DELETE `https://{{hostname}}/Patient?identifier=1032704`

You can do the same search but include hardDelete=true to also delete all history.

DELETE `https://{{hostname}}/Patient?identifier=1032704&hardDelete=true`

If you want to delete multiple resources, you can include `_count=100`, which will delete up to 100 resources that match the search criteria.

DELETE `https://{{hostname}}/Patient?identifier=1032704&_count=100`

## Patch and Conditional Patch

Patch is a valuable RESTful operation when you need to update only a portion of the FHIR resource. Using Patch allows you to specify the element(s) that you want to update in the resource without having to update the entire record. FHIR defines three types of ways to Patch resources in FHIR: JSON Patch, XML Patch, and FHIR Path Patch. The FHIR service support JSON Patch and Conditional JSON Patch (which allows you to Patch a resource based on a search criteria instead of an ID). To walk through some examples of using JSON Patch, refer to the sample [REST file](https://github.com/microsoft/fhir-server/blob/main/docs/rest/PatchRequests.http).

> [!NOTE]
> When using `PATCH` against STU3, and if you are requesting a History bundle, the patched resource's `Bundle.entry.request.method` is mapped to `PUT`. This is because STU3 doesn't contain a definition for the `PATCH` verb in the [HTTPVerb value set](http://hl7.org/fhir/STU3/valueset-http-verb.html).

### Testing Patch

Within Patch, there is a test operation that allows you to validate that a condition is true before doing the patch. For example, if you want to set a patient as deceased (only if they're not already marked as deceased) you can use the example below: 

PATCH `http://{FHIR-SERVICE-NAME}/Patient/{PatientID}`
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

### Patch in Bundles

By default, JSON Patch is not supported in Bundle resources. This is because a Bundle only supports with FHIR resources and JSON Patch is not a FHIR resource. To work around this, we'll treat Binary resources with a content-type of `"application/json-patch+json"`as base64 encoding of JSON string when a Bundle is executed. For information about this workaround, log in to [Zulip](https://chat.fhir.org/#narrow/stream/179166-implementers/topic/Transaction.20with.20PATCH.20request). 

In the example below, we want to change the gender on the patient to female. We've taken the JSON patch `[{"op":"replace","path":"/gender","value":"female"}]` and encoded it to base64.

POST `https://{FHIR-SERVICE-NAME}/`
content-type: `application/json`

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

In this article, you learned about some of the REST capabilities of the FHIR service. Next, you can learn more about the key aspects to searching resources in the FHIR service. 

>[!div class="nextstepaction"]
>[Overview of FHIR search](overview-of-search.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.


