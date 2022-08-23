---
title: Search examples for FHIR service
description: How to search using different search parameters, modifiers, and other search tools for FHIR
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/22/2022
ms.author: mikaelw
---

# FHIR search examples

Below are some examples of Fast Healthcare Interoperability Resources (FHIR&#174;) search API calls featuring various search parameters, modifiers, chained and reverse chained searches, composite searches, `POST` search requests, and more. For a general introduction to FHIR search concepts, see [Overview of FHIR Search](overview-of-search.md).
   
## Search result parameters

### `_include`

`_include` lets you search for resource instances and include in the results other resources referenced by the target resource instances. For example, you can use `_include` to query for `MedicationRequest` resources and limit the search to prescriptions for a specific patient. The FHIR service would then return the `MedicationRequest` resources as well as the referenced `Patient` resource. In the example below, the request will pull all `MedicationRequest` resource instances in the database and all patients that are referenced by the `MedicationRequest` instances:

```rest
 GET {{FHIR_URL}}/MedicationRequest?_include=MedicationRequest:patient

```

> [!NOTE]
> The FHIR service in Azure Health Data Services limits searches with `_include` and `_revinclude` to return 100 items.

### `_revinclude`

`_revinclude` allows you to search for resource instances and include in the results other resources that reference the target resource instances. For example, you can search for patients and then reverse include all encounters that reference the patients:

```rest
GET {{FHIR_URL}}/Patient?_revinclude=Encounter:subject

```
### `_elements`

`_elements` narrows down the information in the search results to a subset of the elements defined for a resource type. The `_elements` parameter accepts a comma-separated list of base elements:

```rest
GET {{FHIR_URL}}/Patient?_elements=identifier,active

```

In the above request, you'll get back a bundle of patients, but each resource instance will only include the identifier(s) and the patient's active status. Resources in the response will contain a `meta.tag` value of `SUBSETTED` to indicate that they do not include all elements defined for the resource type.

## Search modifiers

### `:not`

`:not` allows you to find resources with an element that does not have a given value. For example, you could search for patients who are not female:

```rest
GET {{FHIR_URL}}/Patient?gender:not=female

```

In return, you would get all `Patient` resources whose `gender` element value is not `female`, including any patients with no gender value specified. This is different from searching for `Patient` resources with `male` gender, since that search wouldn't return any patients that don't have a gender specified.

### `:missing`

`:missing` returns all resources that don't have a value for the specified element when `:missing=true` and returns all resources that contain the specified element when `:missing=false`. For simple data type elements, `:missing=true` will match on all resources where an element is present but has an empty value. For example, if you want to find all `Patient` resources that are missing information on `birthdate`, you can call:

```rest
GET {{FHIR_URL}}/Patient?birthdate:missing=true

```

### `:exact`
`:exact` is used to search for elements with `string` data types and returns positive if the parameter value precisely matches the case and character sequence of the element value.

```rest
GET {{FHIR_URL}}/Patient?name:exact=Jon

```

This request returns `Patient` resources that have the `given` or `family` name of `Jon`. If there were patients with names such as `Jonathan` or `JON`, the search would ignore those resources as their names do not match the specified value exactly.

### `:contains`
`:contains` is used to query for `string` type elements and allows for matches with the specified value anywhere within the field being searched. `contains` is case insensitive and recognizes strings concatenated with non-matching character sequences. For example:

```rest
GET {{FHIR_URL}}/Patient?address:contains=Meadow

```

This request would return all `Patient` resources with `address` element fields that contain the string "Meadow" (case insensitive). This means you could have addresses with values such as "Meadows Lane", "Pinemeadow Place", or "Meadowlark St" returned as search results.

## Chained search 

To perform a series of search operations that cover multiple reference parameters, you can "chain" the series of reference parameters together one by one with `.`. For example, if you want to view all `DiagnosticReport` resources with a `subject` reference to a patient with a particular `name`:  

```rest
 GET {{FHIR_URL}}/DiagnosticReport?subject:Patient.name=Sarah

```

This request would return all the `DiagnosticReport` resources with a patient subject named "Sarah". The `.` after `Patient` performs the chained search on the `subject` reference parameter.

Another common use of FHIR search is finding all encounters for a specific patient. `Patient` resources will often be referenced by one or more `Encounter` resources. To do a regular (non-chained) search for all `Encounter` resources that reference a `Patient` with the provided `id`:

```rest
GET {{FHIR_URL}}/Encounter?subject=Patient/78a14cbe-8968-49fd-a231-d43e6619399f

```

Using chained search, you can find all `Encounter` resources that reference a patient with a particular piece of information. The example below demonstrates how to search for encounters referencing patients with a specific `birthdate`:

```rest
GET {{FHIR_URL}}/Encounter?subject:Patient.birthdate=1987-02-20

```

This would allow not just searching `Encounter` resources for a single patient, but across all patients that have the specified `birthdate` value. 

In addition, chained search can occur more than once in a single request by using the symbol `&`, which allows searching for multiple conditions in one request. In such cases, chained search "independently" searches for each parameter instead of searching for conditions that only satisfy all the conditions at once:

```rest
GET {{FHIR_URL}}/Patient?general-practitioner:Practitioner.name=Sarah&general-practitioner:Practitioner.address-state=WA

```

This would return all `Patient` resources that have a reference to "Sarah" as a `generalPractitioner` plus a reference to a `generalPractitioner` that has an address in the state of Washington. In other words, if a patient had a `generalPractitioner` named Sarah from New York state and another `generalPractitioner` named Bill from Washington state, they would both be returned in this search.

For scenarios in which the search has to be an AND operation that satisfies all conditions for a pair of elements, refer to the **composite search** example below.

## Reverse chained search

Using reverse chain search in FHIR allows you to search for target resource instances referred to by other resources. In other words, you can search for resources based on the properties of resources that refer to them. This is accomplished with the `_has` parameter. For example, the `Observation` resource has a search parameter `patient` that refers to a `Patient` resource. To find all `Patient` resources that are referenced by an `Observation` with a specific `code`:

```rest
GET {{FHIR_URL}}/Patient?_has:Observation:patient:code=527

```

This request returns `Patient` resources that are referred to by `Observation` resources with the code `527`. 

In addition, reverse chained search can have a recursive structure. For example, if you want to search for all patients referenced by an `Observation` where the observation is referenced by an `AuditEvent` from a specific practitioner named `janedoe`:

```rest
GET {{FHIR_URL}}/Patient?_has:Observation:patient:_has:AuditEvent:entity:agent:Practitioner.name=janedoe

``` 

## Composite search

To search for resources that contain elements as mutually inclusive pairs, FHIR defines composite search, which joins single parameter values together with the `$` symbol. The returned result would be the intersection of the resources that match all of the conditions specified by the joined search parameters. Such search parameters are called composite search parameters, and they search for elements that combine multiple values within a nested structure. For example, if you want to find all `DiagnosticReport` resources that contain a potassium value less than `9.2`:

```rest
GET {{FHIR_URL}}/DiagnosticReport?result.code-value-quantity=2823-3$lt9.2

``` 

This request searches for an element containing a code of `2823-3`, which in this case would be potassium. Following the code with the `$` symbol specifies the element value using `lt` for "less than" and `9.2` for the potassium value limit. 

Composite search parameters can also be used to filter multiple component code value quantities with a logical OR. For example, to express a query to find diastolic blood pressure greater than 90 OR systolic blood pressure greater than 140:

```rest
GET {{FHIR_URL}}/Observation?component-code-value-quantity=http://loinc.org|8462-4$gt90,http://loinc.org|8480-6$gt140
``` 

Note how `,` functions as the logical OR operator between the two conditions.

## View the next entry set

The maximum number of resources that can be returned per a single search query is 1000. However, you might have more than 1000 resource instances that match the search query, and you might want to see the next set of entries after the first 1000 entries that were returned. In such a case, you would use the continuation token `url` value in `searchset`, as shown in the `Bundle` result below:

```json
    "resourceType": "Bundle",
    "id": "98731cb7-3a39-46f3-8a72-afe945741bd9",
    "meta": {
        "lastUpdated": "2021-04-22T09:58:16.7823171+00:00"
    },
    "type": "searchset",
    "link": [
        {
            "relation": "next",
            "url": "{{FHIR_URL}}/Patient?_sort=_lastUpdated&ct=WzUxMDAxNzc1NzgzODc5MjAwODBd"
        },
        {
            "relation": "self",
            "url": "{{FHIR_URL}}/Patient?_sort=_lastUpdated"
        }
    ],

```

And you would do a GET request for the provided URL under the `next` field:

```rest
GET {{FHIR_URL}}/Patient?_sort=_lastUpdated&ct=WzUxMDAxNzc1NzgzODc5MjAwODBd

```

This will return the next set of entries for your search results. The `searchset` bundle is the complete set of search result entries, and the continuation token `url` is the link provided by the FHIR service to retrieve the entries that don't fit in the first set because of the restriction on the maximum number of entries returned for one page.

## Search using POST

All of the search examples mentioned above use `GET` requests. However, you can also make FHIR search API calls using `POST` requests with `_search`:

```rest
POST {{FHIR_URL}}/Patient/_search?_id=45

```

This request would return the `Patient` resource instance with the `id` value of 45. Just as with GET requests, the server determines which set of resources meets the condition(s) and returns a bundle in the HTTP response.

Another example of searching using POST where the query parameters are submitted as a form body is:

```rest
POST {{FHIR_URL}}/Patient/_search
content-type: application/x-www-form-urlencoded

name=John

```

## Next steps

In this article, you learned about how to search using different search parameters, modifiers, and other search methods for FHIR. For more information about FHIR search, see

>[!div class="nextstepaction"]
>[Overview of FHIR Search](overview-of-search.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
