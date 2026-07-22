---
title: FHIR Service Search Examples for Common Queries
description: Learn FHIR service search examples for parameters, modifiers, chained queries, and POST requests so you can find healthcare data faster. Explore the examples.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: concept-article
ms.date: 06/24/2026
ms.author: kesheth
ai-uasage: ai-assisted
---

# FHIR service search examples

FHIR service search examples show how to search Fast Healthcare Interoperability Resources (FHIR&#174;) service data by using search parameters, modifiers, chained and reverse chained searches, composite searches, and `POST` requests to find data more efficiently. For a general introduction to FHIR search concepts, see [Overview of FHIR Search](overview-of-search.md).
   
## Search result parameters

### `_include`

Use `_include` to search for resource instances and include in the results other resources that the target resource instances reference. For example, use `_include` to query for `MedicationRequest` resources and limit the search to prescriptions for a specific patient. The FHIR service returns the `MedicationRequest` resources and the referenced `Patient` resource. In the following example, the request pulls all `MedicationRequest` resource instances in the database and all patients that the `MedicationRequest` instances reference.

```rest
 GET {{FHIR_URL}}/MedicationRequest?_include=MedicationRequest:patient

```

### `_revinclude`

Use `_revinclude` to search for resource instances and include in the results other resources that reference the target resource instances. For example, you can search for patients and then reverse include all encounters that reference the patients.

```rest
GET {{FHIR_URL}}/Patient?_revinclude=Encounter:subject

```
### `_elements`

Use `_elements` to narrow the information in the search results to a subset of the elements defined for a resource type. The `_elements` parameter accepts a comma-separated list of base elements.

```rest
GET {{FHIR_URL}}/Patient?_elements=identifier,active

```

The preceding request returns a bundle of patients. Each entry only includes the identifiers and the patient's active status. The entries in the response contain a `meta.tag` value of `SUBSETTED` to indicate that not all elements defined for the resource are included.

## Search modifiers

Use these search modifiers to refine your search results. For more information about search modifiers, see [Search modifiers](overview-of-search.md#modifiers-and-prefixes-for-fhir-search-parameters).

### `:not`

Use `:not` to find resources with an element that doesn't have a given value. For example, you could search for patients who aren't female.

```rest
GET {{FHIR_URL}}/Patient?gender:not=female
```

In return, you get all `Patient` resources whose `gender` element value isn't `female`, including any patients with no gender value specified. This result is different from searching for `Patient` resources with the `male` gender value since that search ignores patients with no specified gender.

### `:missing`

When you use `:missing=true`, `:missing` returns all resources that don't have a value for the specified element. When you use `:missing=false`, `:missing` returns all resources that contain the specified element. For simple data type elements, `:missing=true` matches on all resources where an element is present but has an empty value. For example, if you want to find all `Patient` resources that are missing information on `birthdate`, you can make the following call.

```rest
GET {{FHIR_URL}}/Patient?birthdate:missing=true

```

### `:exact`
Use `:exact` to search for elements with `string` data types. It returns positive if the parameter value precisely matches the case and full character sequence of the element value.

```rest
GET {{FHIR_URL}}/Patient?name:exact=Jon

```

This request returns `Patient` resources that have the `given` or `family` name of `Jon`. If there were patients with names such as `Jonathan` or `JON`, the search ignores those resources as their names don't match the specified value exactly.

### `:contains`
Use `:contains` to query for `string` type elements. It allows for matches with the specified value anywhere within the field. `:contains` isn't case sensitive, and recognizes matching strings concatenated with other characters. For example:

```rest
GET {{FHIR_URL}}/Patient?address:contains=Meadow

```

This request returns all `Patient` resources with `address` element fields that contain the string "Meadow" (case insensitive). This result means you could have addresses with values such as "Meadows Lane", "Pinemeadow Place", or "Meadowlark St" that return positive matches.

## Chained search 

To perform search operations that cover elements contained within a referenced resource, chain a series of parameters together by using `.`. For example, if you want to view all `DiagnosticReport` resources with a `subject` reference to a patient specified by `name`, use the following query.

```rest
 GET {{FHIR_URL}}/DiagnosticReport?subject:Patient.name=Sarah

```

This request returns all `DiagnosticReport` resources with a patient subject named "Sarah". The `.` points the chained search to the `name` element within the referenced `Patient` resource.

Another common use of FHIR search is finding all encounters for a specific patient. To do a regular unchained search for `Encounter` resources that reference a `Patient` with a given `id`, use the following query.

```rest
GET {{FHIR_URL}}/Encounter?subject=Patient/78a14cbe-8968-49fd-a231-d43e6619399f

```

By using chained search, you can find all `Encounter` resources that reference patients whose details match a search parameter. The following example demonstrates how to search for encounters referencing patients narrowed by `birthdate`.

```rest
GET {{FHIR_URL}}/Encounter?subject:Patient.birthdate=1987-02-20

```

This query returns all `Encounter` instances that reference patients with the specified `birthdate` value. 

In addition, you can initiate multiple chained searches by using the `&` operator, which allows searching against multiple references in one request. In cases with `&`, chained search "independently" scans for each element value.

```rest
GET {{FHIR_URL}}/Patient?general-practitioner:Practitioner.name=Sarah&general-practitioner:Practitioner.address-state=WA

```

This query returns all `Patient` resources that have a reference to "Sarah" as a `generalPractitioner` plus a reference to a `generalPractitioner` that has an address in the state of Washington. In other words, if a patient had a `generalPractitioner` named Sarah from New York state and another `generalPractitioner` named Bill from Washington state, both meet the conditions for a positive match when doing this search.

For scenarios in which the search requires a logical AND condition that strictly checks for paired element values, refer to the following **composite search** examples.

## Reverse chained search

When you use reverse chained search in FHIR, you can search for target resource instances that other resources reference. In other words, you can search for resources based on the properties of resources that refer to them. You use the `_has` parameter to accomplish this task. For example, the `Observation` resource has a search parameter `patient` that checks for a reference to a `Patient` resource. To find all `Patient` resources that an `Observation` references with a specific `code`, use the following code.

```rest
GET {{FHIR_URL}}/Patient?_has:Observation:patient:code=527

```

This request returns `Patient` resources that `Observation` resources with the code `527` reference. 

Reverse chained search can also be recursive. For example, to find all patients referenced by an `Observation` that is itself referenced by an `AuditEvent` from a practitioner named `janedoe`, use:

```rest
GET {{FHIR_URL}}/Patient?_has:Observation:patient:_has:AuditEvent:entity:agent:Practitioner.name=janedoe

``` 

## Composite search

To search for resources that contain elements grouped together as logically connected pairs, FHIR defines composite search. Composite search joins single parameter values together by using the ` operator, forming a connected pair of parameters. In a composite search, a positive match occurs when the intersection of element values satisfies all conditions set in the paired search parameters. The following example queries for all `DiagnosticReport` resources that contain a potassium value less than `9.2`:

```rest
GET {{FHIR_URL}}/DiagnosticReport?result.code-value-quantity=2823-3$lt9.2

``` 

The paired elements in this case are the `code` element (from an `Observation` resource referenced as the `result`) and the `value` element connected with the `code`. Following the code with the ` operator sets the `value` condition as `lt` (for "less than") `9.2` (for the potassium mmol/L value). 

You can also use composite search parameters to filter multiple component code value quantities with a logical OR. For example, to query for observations with diastolic blood pressure greater than 90 OR systolic blood pressure greater than 140:

```rest
GET {{FHIR_URL}}/Observation?component-code-value-quantity=http://loinc.org|8462-4$gt90,http://loinc.org|8480-6$gt140
``` 

Note how `,` functions as the logical OR operator between the two conditions.

## View the next entry set

A search query can return up to 1,000 resources at once. However, you might have more than 1,000 resource instances that match the search query, and you want to retrieve the next set of results after the first 1,000 entries. In this case, use the continuation (that is, `"next"`) token `url` value in the `searchset` bundle returned from the search as follows.

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

Make a `GET` request for the provided URL:

```rest
GET {{FHIR_URL}}/Patient?_sort=_lastUpdated&ct=WzUxMDAxNzc1NzgzODc5MjAwODBd

```

This request returns the next set of entries for your search results. The `searchset` bundle is the complete set of search result entries, and the continuation token `url` is the link provided by the FHIR service to retrieve the entries that don't fit in the first subset (due to the restriction on the maximum number of entries returned for one page).

## Search using `POST`

All of the search examples mentioned here use `GET` requests. However, you can also make FHIR search API calls by using `POST` with the `_search` parameter as follows.

```rest
POST {{FHIR_URL}}/Patient/_search?_id=45

```

This request returns the `Patient` resource instance with the given `id` value. As with `GET` requests, the server determines which resource instances satisfy the conditions and returns a bundle in the HTTP response.

Another feature of searching by using `POST` is that it lets you submit the query parameters as a form body.

```rest
POST {{FHIR_URL}}/Patient/_search
content-type: application/x-www-form-urlencoded

name=John

```

## Next steps

In this article, you learned about searching in FHIR by using search parameters, modifiers, and other methods. For more information about FHIR search, see:

>[!div class="nextstepaction"]
>[Overview of FHIR Search](overview-of-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
