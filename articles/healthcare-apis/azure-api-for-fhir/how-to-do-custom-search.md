---
title:  How to do custom search in Azure API for FHIR 
description: This article describes how you can define your own custom search parameters in Azure API for FHIR to be used in the database. 
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---
# Defining custom search parameters for Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

The Fast Healthcare Interoperability Resources (FHIR&#174;) specification defines a set of search parameters for all resources and search parameters that are specific to a resource(s). However, there are scenarios where you might want to search against an element in a resource that isn’t defined by the FHIR specification as a standard search parameter. This article describes how you can define your own [search parameters](https://www.hl7.org/fhir/searchparameter.html) to be used in the Azure API for FHIR.

> [!NOTE]
> Each time you create, update, or delete a search parameter you’ll need to run a [reindex job](how-to-run-a-reindex.md) to enable the search parameter to be used in production. Below we will outline how you can test search parameters before reindexing the entire FHIR server.

## Create new search parameter

To create a new search parameter, you `POST` the `SearchParameter` resource to the database. The code example below shows how to add the [US Core Race SearchParameter](http://hl7.org/fhir/us/core/STU3.1.1/SearchParameter-us-core-race.html) to the `Patient` resource.

```rest
POST {{FHIR_URL}}/SearchParameter

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

> [!NOTE]
> The new search parameter will appear in the capability statement of the FHIR server after you POST the search parameter to the database **and** reindex your database. Viewing the `SearchParameter` in the capability statement is the only way tell if a search parameter is supported in your FHIR server. If you can find the search parameter by searching for the search parameter but cannot see it in the capability statement, you still need to index the search parameter. You can POST multiple search parameters before triggering a reindex operation.

Important elements of a `SearchParameter`:

* **url**: A unique key to describe the search parameter. Many organizations, such as HL7, use a standard URL format for the search parameters that they define, as shown above in the US Core race search parameter.

* **code**: The value stored in **code** is what you’ll use when searching. For the example above, you would search with `GET {FHIR_URL}/Patient?race=<code>` to get all patients of a specific race. The code must be unique for the resource(s) the search parameter applies to.

* **base**: Describes which resource(s) the search parameter applies to. If the search parameter applies to all resources, you can use `Resource`; otherwise, you can list all the relevant resources.
 
* **type**: Describes the data type for the search parameter. Type is limited by the support for the Azure API for FHIR. This means that you can’t define a search parameter of type Special or define a [composite search parameter](overview-of-search.md) unless it's a supported combination.

* **expression**: Describes how to calculate the value for the search. When describing a search parameter, you must include the expression, even though it isn't required by the specification. This is because you need either the expression or the xpath syntax and the Azure API for FHIR ignores the xpath syntax.

## Test search parameters

While you can’t use the search parameters in production until you run a reindex job, there are a few ways to test your search parameters before reindexing the entire database. 

First, you can test your new search parameter to see what values will be returned. By running the command below against a specific resource instance (by inputting their ID), you'll get back a list of value pairs with the search parameter name and the value stored for the specific patient. This will include all of the search parameters for the resource and you can scroll through to find the search parameter you created. Running this command won't change any behavior in your FHIR server. 

```rest
GET https://{{FHIR_URL}}/{{RESOURCE}}/{{RESOUCE_ID}}/$reindex

```
For example, to find all search parameters for a patient:

```rest
GET https://{{FHIR_URL}}/Patient/{{PATIENT_ID}}/$reindex

```

The result will look like this:

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
    },
...
```
Once you see that your search parameter is displaying as expected, you can reindex a single resource to test searching with the element. First you'll reindex a single resource:

```rest
POST https://{{FHIR_URL}/{{RESOURCE}}/{{RESOURCE_ID}}/$reindex
```

Running this, sets the indices for any search parameters for the specific resource that you defined for that resource type. This does make an update to the FHIR server. Now you can search and set the use partial indices header to true, which means that it will return results where any of the resources has the search parameter indexed, even if not all resources of that type have it indexed. 

Continuing with our example above, you could index one patient to enable the US Core Race `SearchParameter`:

```rest
POST https://{{FHIR_URL}/Patient/{{PATIENT_ID}}/$reindex
```

And then search for patients that have a specific race:

```rest
GET https://{{FHIR_URL}}/Patient?race=2028-9
x-ms-use-partial-indices: true
```

After you have tested and are satisfied that your search parameter is working as expected, run or schedule your reindex job so the search parameters can be used in the FHIR server for production use cases.

## Update a search parameter

To update a search parameter, use `PUT` to create a new version of the search parameter. You must include the `SearchParameter ID` in the `id` element of the body of the `PUT` request and in the `PUT` call.

> [!NOTE]
> If you don't know the ID for your search parameter, you can search for it. Using `GET {{FHIR_URL}}/SearchParameter` will return all custom search parameters, and you can scroll through the search parameter to find the search parameter you need. You could also limit the search by name. With the example below, you could search for name using `USCoreRace: GET {{FHIR_URL}}/SearchParameter?name=USCoreRace`.

```rest
PUT {{FHIR_URL}}/SearchParameter/{SearchParameter ID}

{
  "resourceType" : "SearchParameter",
  "id" : "SearchParameter ID",
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

The result will be an updated `SearchParameter` and the version will increment.

> [!Warning]
> Be careful when updating SearchParameters that have already been indexed in your database. Changing an existing SearchParameter’s behavior could have impacts on the expected behavior. We recommend running a reindex job immediately.

## Delete a search parameter

If you need to delete a search parameter, use the following:

```rest
Delete {{FHIR_URL}}/SearchParameter/{SearchParameter ID}
```

> [!Warning]
> Be careful when deleting SearchParameters that have already been indexed in your database. Changing an existing SearchParameter’s behavior could have impacts on the expected behavior. We recommend running a reindex job immediately.

## Next steps

In this article, you’ve learned how to create a search parameter. Next you can learn how to reindex your FHIR server.

>[!div class="nextstepaction"]
>[How to run a reindex job](how-to-run-a-reindex.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
