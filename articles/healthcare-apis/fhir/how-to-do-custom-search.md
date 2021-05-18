---
title:  How to do custom search in Azure API for FHIR 
description: This article describes how you can define your own custom search parameters to be used in the database. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 4/23/2021
ms.author: cavoeg
---
# Defining custom search parameters

The FHIR specification defines a set of search parameters for all resources and search parameters that are specific to a resource(s). However, there are scenarios where you might want to search against a field in a resource that isn’t defined by the specification as a standard search parameter. This article describes how you can define your own [search parameters](https://www.hl7.org/fhir/searchparameter.html) to be used in the FHIR server.

> [!NOTE]
> Each time you create, update, or delete a search parameter you’ll need to run a [reindex job](how-to-run-a-reindex.md) to enable the change in your database.

> [!Warning]
> If you update or delete a search parameter ensure that you immediately run a [reindex job](how-to-run-a-reindex.md). There is the potential for your database to be in a abnormal state with updated or delete search parameters that still appear active due to needing to be indexed for the changes. 

## Create new search parameter

To create a new search parameter, you `POST` a new search parameter to the database. The code example below shows how to add the [US Core Race search parameter](http://hl7.org/fhir/us/core/STU3.1.1/SearchParameter-us-core-race.html) to the Patient resource.

```json
POST {fhirurl}/SearchParameter
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
> The new search parameter will appear in your capability statement after you POST it to the FHIR server and reindex your database. It won’t be useable until you run a [reindex job](how-to-run-a-reindex.md). This is the only way right now to tell if a search parameter is supported or not within your database. If you can find the search parameter by searching for the search parameter but cannot see it in the capability statement, run a reindex job. You are able to POST multiple search parameters before triggering a reindex operation.

Important field descriptions:

* **url**: This is a unique key to describe the search parameter. Many organizations, such as HL7, use a standard format for the URLs that they define, as shown above in the US Core race search parameter.

* **code**: The value here is what you’ll use when searching. For the example above, you would search with `GET {FHIR URL}/Patient?race=2028-9` to get all Asian patients. This value must be unique for the resource(s) it applies to.

* **base**: This describes which resource(s) the search parameter applies to. If it applies to all resources, you can just use Resource; otherwise, you can list all the relevant resources.
 
* **type**: Describes the data type for the search parameter.

* **expression**: When describing a search parameter, you must include the expression, even though it is technically not required by the specification. This is because you need either the expression or the xpath syntax and the Azure API for FHIR ignores the xpath syntax right now. This describes how to find the value for the search. 

> [!NOTE]
> “Type” is limited by the support for the Azure API for FHIR. This means that you cannot define a search parameter of type Special or define a [composite search parameter](overview-of-search.md) unless it is of a type that we support.

Once you’ve added your search parameters, run or schedule your reindex job so the search parameters can be used in the FHIR server.

## Update a search parameter

To update a search parameter, use `PUT` to create a new version of the search parameter.

`PUT {fhirurl}/SearchParameter/{SearchParameter ID}`

You must include the `SearchParameter ID` in the ID field of the body of the `PUT` request and in the `PUT` call.

> [!NOTE]
> If you don't know the ID for your search parameter, you can search for it. Using `GET {fhirurl}/SearchParameter` will return all custom search parameters, and you can scroll through the search parameter to find the search parameter you need. You could also limit the search by name. With the example below, you could search for name using `USCoreRace: GET {fhirurl}/SearchParameter?name=USCoreRace`.

```json
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
> Be careful when updating SearchParameters that have already been indexed in your database. Changing an existing SearchParameter’s behavior could have impacts on the expected behavior. 

## Delete a search parameter

If you need to delete a search parameter, use the following:

`Delete {fhirurl}/SearchParameter/{SearchParameter ID}`

> [!Warning]
> Be careful when deleting SearchParameters that have already been indexed in your database. Changing an existing SearchParameter’s behavior could have impacts on the expected behavior.

## Next steps

In this article, you’ve learned how to create a search parameter. To learn how to how to reindex a job, see

>[!div class="nextstepaction"]
>[How to run a reindex job](how-to-run-a-reindex.md)