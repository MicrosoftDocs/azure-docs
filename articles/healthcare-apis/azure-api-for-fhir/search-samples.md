---
title: Search examples for Azure API for FHIR
description: How to search using different search parameters, modifiers, and other FHIR search tools
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---

# FHIR search examples for Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

The following are examples of using Fast Healthcare Interoperability Resources (FHIR&reg;) search operations, including search parameters and modifiers, chain and reverse chain search, composite search, viewing the next entry set for search results, and searching with a `POST` request. For more information about search, see [Overview of FHIR Search](overview-of-search.md).
   
## Search result parameters

### _include

`_include` searches across resources for the ones that include the specified parameter of the resource. For example, you can search across `MedicationRequest` resources to find only the ones that include information about the prescriptions for a specific patient, which is the `reference` parameter `patient`. The following example pulls all the `MedicationRequests` and all patients that are referenced from the `MedicationRequests`.

```rest
 GET [your-fhir-server]/MedicationRequest?_include=MedicationRequest:patient

```

> [!NOTE]
> **_include** and **_revinclude** are limited to 100 items.

### _revinclude

`_revinclude` allows you to search the opposite direction as `_include`. For example, you can search for patients and then reverse include all encounters that reference the patients:

```rest
GET [your-fhir-server]/Patient?_revinclude=Encounter:subject

```
### _elements

`_elements` narrows down the search result to a subset of fields to reduce the response size by omitting unnecessary data. The parameter accepts a comma-separated list of base elements.

```rest
GET [your-fhir-server]/Patient?_elements=identifier,active

```

From this request, you get a bundle of patients where each resource only includes the identifiers and the patient's active status. Resources in this response contain a `meta.tag` value of `SUBSETTED` to indicate that they're an incomplete set of results.

## Search modifiers

### :not

`:not` allows you to find resources where an attribute isn't true. For example, you could search for patients where the gender isn't female.

```rest
GET [your-fhir-server]/Patient?gender:not=female

```

As a return value, you would get all patient entries where the gender isn't female, including empty values (entries specified without gender). This is different than searching for Patients where gender is male, since that wouldn't include the entries without a specific gender.

### :missing

`:missing` returns all resources that don't have a value for the specified element when the value is `true`, and returns all the resources that contain the specified element when the value is `false`. For simple data type elements, `:missing=true` matches on all resources where the element is present with extensions but has an empty value. The following example shows how to find all `Patient` resources that are missing information on birth date.

```rest
GET [your-fhir-server]/Patient?birthdate:missing=true

```

### :exact
`:exact` is used for `string` parameters, and returns results that match the parameter precisely, such as in casing and character concatenating.

```rest
GET [your-fhir-server]/Patient?name:exact=Jon

```

This request returns `Patient` resources that have the name exactly the same as `Jon`. If the resource had Patients with names such as `Jonathan` or `joN`, the search would ignore and skip the resource as it doesn't exactly match the specified value.

### :contains
`:contains` is used for `string` parameters and searches for resources with partial matches of the specified value anywhere in the string within the field being searched. `contains` isn't case sensitive and allows character concatenating. For example:

```rest
GET [your-fhir-server]/Patient?address:contains=Meadow

```

This request would return all `Patient` resources with `address` fields that have values that contain the string "Meadow". This means you could have addresses that include values such as "Meadowers" or "59 Meadow ST" returned as search results.

## Chained search 

To perform a series of search operations that cover multiple reference parameters, you can "chain" the series of reference parameters by appending them to the server request one by one using a period `.`. For example, if you want to view all `DiagnosticReport` resources with a `subject` reference to a `Patient` resource that includes a particular `name`:  

```rest
 GET [your-fhir-server]/DiagnosticReport?subject:Patient.name=Sarah

```

This request would return all the `DiagnosticReport` resources with a patient subject named "Sarah". The period `.` after the field `Patient` performs the chained search on the reference parameter of the `subject` parameter.

Another common use of a regular search (not a chained search) is finding all encounters for a specific patient. `Patient`s often have one or more `Encounter`s with a subject. The following searches for all `Encounter` resources for a `Patient` with the provided `id`.

```rest
GET [your-fhir-server]/Encounter?subject=Patient/78a14cbe-8968-49fd-a231-d43e6619399f

```

Using chained search, you can find all the `Encounter` resources that match a particular piece of `Patient` information, such as the `birthdate`.

```rest
GET [your-fhir-server]/Encounter?subject:Patient.birthdate=1987-02-20

```

This would allow searching `Encounter` resources across all patients that have the specified birth date value. 

In addition, chained search can be done more than once in one request by using the symbol `&`, which allows you to search for multiple conditions in one request. In such cases, chained search "independently" searches for each parameter, instead of searching for conditions that only satisfy all the conditions at once:

```rest
GET [your-fhir-server]/Patient?general-practitioner:Practitioner.name=Sarah&general-practitioner:Practitioner.address-state=WA

```

This would return all `Patient` resources that have "Sarah" as the `generalPractitioner` and have a `generalPractitioner` that has the address with the state WA. In other words, if a patient had Sarah from the state NY and Bill from the state WA both referenced as the patient's `generalPractitioner`, both are returned.

For scenarios in which the search has to be an `AND` operation that covers all conditions as a group, refer to the example in [**Composite search**](#composite-search).

## Reverse chain search

Chain search lets you search for resources based on the properties of resources they refer to. Using reverse chain search allows you to do it the other way around. You can search for resources based on the properties of resources that refer to them, using `_has` parameter. For example, an `Observation` resource has a search parameter `patient` referring to a Patient resource. Use the following to find all Patient resources referenced by `Observation` with a specific `code`.

```rest
GET [base]/Patient?_has:Observation:patient:code=527

```

This request returns Patient resources referred by `Observation` with the code `527`. 

In addition, reverse chain search can have a recursive structure. For example, the following searches for all patients that have `Observation` where the observation has an audit event from a specific user `janedoe`.

```rest
GET [base]/Patient?_has:Observation:patient:_has:AuditEvent:entity:agent:Practitioner.name=janedoe

``` 

> [!NOTE]
> In the Azure API for FHIR and the open-source FHIR server backed by Azure Cosmos DB, the chained search and reverse chained search is an MVP implementation. To accomplish chained search on Azure Cosmos DB, the implementation walks down the search expression and issues sub-queries to resolve the matched resources. This is done for each level of the expression. If any query returns more than 100 results, an error will be thrown.

## Composite search

To search for resources that meet multiple conditions at once, use a composite search that joins a sequence of single parameter values with a symbol `$`. The result would be the intersection of the resources that match all of the conditions specified by the joined search parameters. Such search parameters are called composite search parameters, and they define a new parameter that combines the multiple parameters in a nested structure. For example, the following search finds all `DiagnosticReport` resources that contain `Observation` with a potassium value less than or equal to 9.2.

```rest
GET [your-fhir-server]/DiagnosticReport?result.code-value-quantity=2823-3$lt9.2

``` 

This request specifies the component containing a code of `2823-3`, which in this case would be potassium. Following the `$` symbol, it specifies the range of the value for the component using `lt` for "less than or equal to" and `9.2` for the potassium value range. 

## Search the next entry set

The maximum number of entries that can be returned per a single search query is 1000. If more than 1,000 entries that match the search query, you can use the following procedure to see entries greater than 1000.<br>
Use the continuation token `url` value in `searchset`, as in the following `Bundle` result.

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
            "url": "[your-fhir-server]/Patient?_sort=_lastUpdated&ct=WzUxMDAxNzc1NzgzODc5MjAwODBd"
        },
        {
            "relation": "self",
            "url": "[your-fhir-server]/Patient?_sort=_lastUpdated"
        }
    ],

```

Then do a GET request for the provided URL under the field `relation: next`.

```rest
GET [your-fhir-server]/Patient?_sort=_lastUpdated&ct=WzUxMDAxNzc1NzgzODc5MjAwODBd

```

This returns the next set of entries for your search result. The `searchset` is the complete set of search result entries, and the continuation token `url` is the link provided by the server for you to retrieve entries that don't show up in the first 1000.

## Search using POST

All of the search examples previously mentioned used `GET` requests. You can also do search operations using `POST` requests using `_search`.

```rest
POST [your-fhir-server]/Patient/_search?_id=45

```

This request returns `Patient` resources with the `id` value of 45. As with GET requests, the server determines which of the set of resources meets the condition, and returns a bundle resource in the HTTP response.

Another example of searching using POST where the query parameters are submitted as a form body is as follows.

```rest
POST [your-fhir-server]/Patient/_search
content-type: application/x-www-form-urlencoded

name=John

```
## Next steps

In this article, you learned about how to search using different search parameters, modifiers, and FHIR search tools. For more information about FHIR Search, see

>[!div class="nextstepaction"]
>[Overview of FHIR Search](overview-of-search.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]