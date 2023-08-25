---
title:  How to do custom search in FHIR service 
description: This article describes how you can define your own custom search parameters to be used in the database. 
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/22/2022
ms.author: kesheth
---
# Defining custom search parameters

The FHIR specification defines a set of search parameters that apply to all resources. Additionally, FHIR defines many search parameters that are specific to certain resources. There are scenarios, however, where you might want to search against an element in a resource that isn’t defined by the FHIR specification as a standard search parameter. This article describes how you can define your own custom [search parameters](https://www.hl7.org/fhir/searchparameter.html) for use in the FHIR service in Azure Health Data Services.

> [!NOTE]
> Each time you create, update, or delete a search parameter, you’ll need to run a [reindex job](how-to-run-a-reindex.md) to enable the search parameter for live production. Below we will outline how you can test search parameters before reindexing the entire FHIR service database.

## Create new search parameter 

To create a new search parameter, you need to `POST` a `SearchParameter` resource to the FHIR service database. 

```rest
POST {{FHIR_URL}}/SearchParameter
```

The examples below demonstrate creating new custom search parameter 

### Create new search parameter per definition in Implementation Guide

The code example below shows how to add the [US Core Race search parameter](http://hl7.org/fhir/us/core/STU3.1.1/SearchParameter-us-core-race.html) to the `Patient` resource type in your FHIR service database.


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

The code example shows how to create a custom search parameter to search MedicationDispense resources based on the location where they were dispensed. This is an example of adding custom search parameter for a Reference type.

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
> The new search parameter will appear in the capability statement of the FHIR service after you `POST` the search parameter to the database **and** reindex your database. Viewing the `SearchParameter` in the capability statement is the only way to tell if a search parameter is supported in your FHIR service. If you cannot find the `SearchParameter` in the capability statement, then you still need to reindex your database to activate the search parameter. You can `POST` multiple search parameters before triggering a reindex operation.

Important elements of a `SearchParameter` resource:

* `url`: A unique key to describe the search parameter. Organizations such as HL7 use a standard URL format for the search parameters that they define, as shown above in the US Core Race search parameter.

* `code`: The value stored in the **code** element is the name used for the search parameter when it's included in an API call. For the example above with the "US Core Race" extension, you would search with `GET {{FHIR_URL}}/Patient?race=<code>` where `<code>` is in the value set from the specified coding system. This call would retrieve all patients of a certain race. 

* `base`: Describes which resource type(s) the search parameter applies to. If the search parameter applies to all resources, you can use `Resource`; otherwise, you can list all the relevant resource types.

* `target`: Describes which resource type(s) the search parameter matches to. 
 
* `type`: Describes the data type for the search parameter. Type is limited by the support for data types in the FHIR service. This means that you can’t define a search parameter of type Special or define a [composite search parameter](overview-of-search.md) unless it's a supported combination.

* `expression`: Describes how to calculate the value for the search. When describing a search parameter, you must include the expression, even though it isn't required by the specification. This is because you need either the expression or the xpath syntax and the FHIR service ignores the xpath syntax.

## Test new search parameters

While you can’t use the new search parameters in production until you run a reindex job, there are a few ways to test your custom search parameters before reindexing the entire database. 

First, you can test a new search parameter to see what values will be returned. By running the command below against a specific resource instance (by supplying the resource ID), you get back a list of value pairs with the search parameter name and the value stored in the corresponding element. This list includes all of the search parameters for the resource. You can scroll through to find the search parameter you created. Running this command won't change any behavior in your FHIR service. 

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

Once you see that your search parameter is displaying as expected, you can reindex a single resource to test searching with your new search parameter. To reindex a single resource:

```rest
POST https://{{FHIR_URL}/{{RESOURCE}}/{{RESOURCE_ID}}/$reindex
```

Running this `POST` call sets the indices for any search parameters defined for the resource instance specified in the request. This call does make a change to the FHIR service database. Now you can search and set the `x-ms-use-partial-indices` header to `true`, which causes the FHIR service to return results for any of the resources that have the search parameter indexed, even if not all resource instances of that type have it indexed. 

Continuing with our example, you could index one patient to enable `SearchParameter`:

```rest
POST {{FHIR_URL}}/Patient/{{PATIENT_ID}}/$reindex
```

And then do a test search
1. For the patient by race:

```rest
GET {{FHIR_URL}}/Patient?race=2028-9
x-ms-use-partial-indices: true
```
1. For Location (reference type):
```rest
{{fhirurl}}/MedicationDispense?location=<locationid referenced in MedicationDispense Resource>
x-ms-use-partial-indices: true
```
After you've tested your new search parameter and confirmed that it's working as expected, run or schedule your reindex job so the new search parameter(s) can be used in live production.

See [Running a reindex job](../fhir/how-to-run-a-reindex.md) for information on how to reindex your FHIR service database.

## Update a search parameter

To update a search parameter, use `PUT` to create a new version of the search parameter. You must include the search parameter ID in the `id` field in the body of the `PUT` request as well as the `PUT` request string.

> [!NOTE]
> If you don't know the ID for your search parameter, you can search for it using `GET {{FHIR_URL}}/SearchParameter`. This will return all custom as well as standard search parameters, and you can scroll through the list to find the search parameter you need. You could also limit the search by name. As shown in the example request below, the name of the custom `SearchParameter` resource instance is `USCoreRace`. You could search for this `SearchParameter` resource by name using `GET {{FHIR_URL}}/SearchParameter?name=USCoreRace`.

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

The result of the above request will be an updated `SearchParameter` resource. 

> [!Warning]
> Be careful when updating search parameters. Changing an existing search parameter could have impacts on the expected behavior. We recommend running a reindex job immediately.



## Delete a search parameter

If you need to delete a search parameter, use the following:

```rest
DELETE {{FHIR_URL}}/SearchParameter/{{SearchParameter_ID}}
```

> [!Warning]
> Be careful when deleting search parameters. Deleting an existing search parameter could have impacts on the expected behavior. We recommend running a reindex job immediately.



## Next steps

In this article, you’ve learned how to create a custom search parameter. Next you can learn how to reindex your FHIR service database. 
For more information, see

>[!div class="nextstepaction"]
>[How to run a reindex job](how-to-run-a-reindex.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
