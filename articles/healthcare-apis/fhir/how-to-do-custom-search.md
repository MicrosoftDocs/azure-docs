---
title: Create Custom Search Parameters in FHIR Service
description: Learn how to define custom search parameters in your FHIR service database, test them before reindexing, and start improving query results today.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/24/2026
ms.author: kesheth
ai-usage: ai-assisted
---
# Define custom search parameters

The FHIR&reg; specification defines a set of search parameters that apply to all resources. Additionally, you can define custom search parameters that are specific to certain resources. Custom search parameters enable you to search against an element in a resource that isn't defined by the FHIR specification as a standard search parameter. This article describes how you can define your own custom [search parameters](https://www.hl7.org/fhir/searchparameter.html) for use in the FHIR service in Azure Health Data Services.

> [!NOTE]
> Each time you create, update, or delete a search parameter, you need to run a [reindex job](how-to-run-a-reindex.md) to accept the changes. To view the status of search parameters, the API endpoint `$status` is provided. If the status of a search parameter is `Pending`, it indicates that the search parameter needs to be reindexed.

## Create new search parameter 

To create a new search parameter, `POST` a `SearchParameter` resource to the FHIR service database. 

```rest
POST {{FHIR_URL}}/SearchParameter
```

The following examples demonstrate creating a new custom search parameter.

### Create new search parameter per definition in the Implementation Guide

The following code example shows how to add the [US Core Race search parameter](http://hl7.org/fhir/us/core/STU3.1.1/SearchParameter-us-core-race.html) to the `Patient` resource type in your FHIR service database.


```rest
{
  "resourceType" : "SearchParameter",
  "id" : "us-core-race",
  "url" : "http://hl7.org/fhir/us/core/SearchParameter/us-core-race",
  "version" : "3.1.1",
  "name" : "USCoreRace",
  "status" : "active",
  "date" : "2019-05-21",
  "publisher" : "US Realm Steering Committee",
  "contact" : [
    {
      "telecom" : [
        {
          "system" : "other",
          "value" : "http://www.healthit.gov/"
        }
      ]
    }
  ],
  "description" : "Returns patients with a race extension matching the specified code.",
  "jurisdiction" : [
    {
      "coding" : [
        {
          "system" : "urn:iso:std:iso:3166",
          "code" : "US",
          "display" : "United States of America"
        }
      ]
    }
  ],
  "code" : "race",
  "base" : [
    "Patient"
  ],
  "type" : "token",
  "expression" : "Patient.extension.where(url = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension.value.code"
}

``` 
### Create new search parameter for resource attributes with reference type

The following code example shows how to create a custom search parameter to search MedicationDispense resources based on the location where they were dispensed. This example shows how to add a custom search parameter for a Reference type.

```rest
{
 "resourceType": "SearchParameter",
  "id": "a3c28d46-fd06-49ca-aea7-5f9314ef0497",
  "url": "{{An absolute URI that is used to identify this search parameter}}",
  "version": "1.0",
  "name": "MedicationDispenseLocationSearchParameter",
  "status": "active",
  "description": "Search parameter for MedicationDispense by location",
  "code": "location",
  "base": ["MedicationDispense"],
  "target": ["Location"],
  "type": "reference",
  "expression": "MedicationDispense.location"
}
```
> [!NOTE]
> The new search parameter appears in the capability statement of the FHIR service after you `POST` the search parameter to the database **and** reindex your database. Viewing the `SearchParameter` in the capability statement is the only way to tell if a search parameter is supported in your FHIR service. If you can't find the `SearchParameter` in the capability statement, you still need to reindex your database to activate the search parameter. You can `POST` multiple search parameters before triggering a reindex operation.

Important elements of a `SearchParameter` resource are:

* `url`: A unique key to describe the search parameter. Organizations such as HL7 use a standard URL format for the search parameters that they define, as shown earlier in the US Core Race search parameter.

* `code`: The value stored in the **code** element is the name used for the search parameter when it's included in an API call. For the preceding example with the "US Core Race" extension, you search with `GET {{FHIR_URL}}/Patient?race=<code>` where `<code>` is in the value set from the specified coding system. This call retrieves all patients of a certain race. 

* `base`: Describes which resource types the search parameter applies to. If the search parameter applies to all resources, use `Resource`; otherwise, list all the relevant resource types.

* `target`: Describes which resource types the search parameter matches to. 
 
* `type`: Describes the data type for the search parameter. Type is limited by the support for data types in the FHIR service. This limitation means that you can't define a search parameter of type Special or define a [composite search parameter](overview-of-search.md) unless it's a supported combination.

* `expression`: Describes how to calculate the value for the search. When describing a search parameter, you must include the expression, even though the specification doesn't require it. This requirement exists because you need either the expression or the xpath syntax and the FHIR service ignores the xpath syntax.

## Test new search parameters

While you can't use the new search parameters in production until you run a reindex job, you can test your custom search parameters before reindexing the entire database. 

First, test a new search parameter to see what values it returns. By running the following command against a specific resource instance (by supplying the resource ID), you get back a list of value pairs with the search parameter name and the value stored in the corresponding element. This list includes all of the search parameters for the resource. You can scroll through to find the search parameter you created. Running this command doesn't change any behavior in your FHIR service. 

> [!NOTE]
> > Each time you create, update, or delete a search parameter, you need to run a [reindex job](how-to-run-a-reindex.md) to accept the changes. To view the status of search parameters, an API endpoint (`$status`) is provided. If the status of search parameter is in Pending state, it's a good indication it needs to be reindexed.

```rest
GET https://{{FHIR_URL}}/{{RESOURCE}}/{{RESOURCE_ID}}/$reindex

```
For example, to find all search parameters for a patient:

```rest
GET https://{{FHIR_URL}}/Patient/{{PATIENT_ID}}/$reindex

```

The result looks like this:

```json
{
  "resourceType": "Parameters",
  "id": "8be24e78-b333-49da-a861-523491c3437a",
  "meta": {
    "versionId": "1"
  },
  "parameter": [
    {
      "name": "deceased",
      "valueString": "http://hl7.org/fhir/special-values|false"
    },
    {
      "name": "language",
      "valueString": "urn:ietf:bcp:47|en-US"
    },
    {
      "name": "race",
      "valueString": "2028-9"
    }
    ]
    ...}
```

Once you see that your search parameter is displaying as expected, you can reindex a single resource to test searching with your new search parameter. To reindex a single resource, use the following command.

```rest
POST https://{{FHIR_URL}/{{RESOURCE}}/{{RESOURCE_ID}}/$reindex
```

Running this `POST` call sets the indices for any search parameters defined for the resource instance specified in the request. This call makes a change to the FHIR service database. Now you can search and set the `x-ms-use-partial-indices` header to `true`. This setting causes the FHIR service to return results for any of the resources that have the search parameter indexed, even if not all resource instances of that type have it indexed. 

Continuing with the example, you could index one patient to enable `SearchParameter`:

```rest
POST {{FHIR_URL}}/Patient/{{PATIENT_ID}}/$reindex
```

And then do test searches:

1. For the patient by race:

```rest
GET {{FHIR_URL}}/Patient?race=2028-9
x-ms-use-partial-indices: true
```
2. For Location (reference type)

```rest
{{fhirurl}}/MedicationDispense?location=<locationid referenced in MedicationDispense Resource>
x-ms-use-partial-indices: true
```

After you test your new search parameter and confirm that it's working as expected, run or schedule your reindex job so the new search parameters can be used in live production.

For information on how to reindex your FHIR service database, see [Running a reindex job](../fhir/how-to-run-a-reindex.md).

## Update a search parameter

To update a search parameter, use `PUT` to create a new version of the search parameter. You must include the search parameter ID in the `id` field in the body of the `PUT` request and the `PUT` request string.

> [!NOTE]
> If you don't know the ID for your search parameter, you can search for it by using `GET {{FHIR_URL}}/SearchParameter`. This request returns all custom and standard search parameters. You can scroll through the list to find the search parameter you need. You can also limit the search by name. As shown in the following example request, the name of the custom `SearchParameter` resource instance is `USCoreRace`. You can search for this `SearchParameter` resource by name by using `GET {{FHIR_URL}}/SearchParameter?name=USCoreRace`.

```rest
PUT {{FHIR_URL}}/SearchParameter/{{SearchParameter_ID}}

{
  "resourceType" : "SearchParameter",
  "id" : "{{SearchParameter_ID}}",
  "url" : "http://hl7.org/fhir/us/core/SearchParameter/us-core-race",
  "version" : "3.1.1",
  "name" : "USCoreRace",
  "status" : "active",
  "date" : "2019-05-21",
  "publisher" : "US Realm Steering Committee",
  "contact" : [
    {
      "telecom" : [
        {
          "system" : "other",
          "value" : "http://www.healthit.gov/"
        }
      ]
    }
  ],
  "description" : "New Description!",
  "jurisdiction" : [
    {
      "coding" : [
        {
          "system" : "urn:iso:std:iso:3166",
          "code" : "US",
          "display" : "United States of America"
        }
      ]
    }
  ],
  "code" : "race",
  "base" : [
    "Patient"
  ],
  "type" : "token",
  "expression" : "Patient.extension.where(url = 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension.value.code"
}

```

The result of the preceding request is an updated `SearchParameter` resource. 

To avoid disruption with reindexing of an existing custom search parameter, consider creating a new custom search parameter instead. Ensure the base, code, and url values associated with the new search parameter are unique. Duplicating these fields might lead to indeterminate behavior during reindexing.

> [!Warning]
> Be careful when updating search parameters. Changing an existing search parameter can impact expected behavior. Run a reindex job immediately.
> **Note**: Frequent changes to custom search parameters in production instances can disrupt queries. Plan such changes carefully to avoid potential issues.

## Delete a search parameter

To delete a search parameter, use the following request.

> [!NOTE]
> Each time you delete a search parameter, you need to run a [reindex job](how-to-run-a-reindex.md) to accept the changes. To view the status of search parameters, an API endpoint (`$status`) is provided. If the status of the search parameter is in `PendingDelete` or `PendingHardDelete` state, make sure you run the reindex. 

```rest
DELETE {{FHIR_URL}}/SearchParameter/{{SearchParameter_ID}}
```

## Next steps

In this article, you learned how to create a custom search parameter. Next, you can learn how to reindex your FHIR service database. 

>[!div class="nextstepaction"]
>[How to run a reindex job](how-to-run-a-reindex.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
