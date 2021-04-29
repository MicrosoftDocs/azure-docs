---
title:  Overview of search in Azure API for FHIR
description: This article describes an overview of FHIR search that is implemented in Azure API for FHIR
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 4/21/2021
ms.author: cavoeg
---
# Overview of FHIR search

The FHIR specification defines the fundamentals of search for FHIR resources. This article will guide you through some key aspects to searching resources in FHIR. For complete details about searching FHIR resources, refer to [Search](https://www.hl7.org/fhir/search.html) in the HL7 FHIR Specification.

FHIR searches can be against a specific resource type, a specified [compartment](https://www.hl7.org/fhir/compartmentdefinition.html), or all resources. The simplest way to execute a search in FHIR is to use a `GET` request. For example, if you want to pull all patients in the database, you could use the following request: 

`GET {{FHIR URL}}/Patient`

You can also search using `POST`, which is useful if the query string is too long. To search using `POST`, the search parameters can be submitted as a form body. This allows for longer, more complex series of query parameters that might be difficult to see and understand in a query string.

If the search request is successful, you’ll receive a FHIR bundle response with the type `searchset`. If the search fails, you’ll find these details in the `OperationOutcome` to help you understand why the search failed.

In the following sections, we’ll cover the various aspects involved in searching. Once you’ve reviewed these details, refer to our **Samples page** that has examples of searches that you can make in the Azure API for FHIR.

## Search parameters

When you do a search, consider searching based on various attributes of the resource.  These attributes are called search parameters. Each resource has a set of defined search parameters. The search parameter must be defined and indexed in the database for you to successfully search against it.

Each search parameter has a defined data type. The Azure API for FHIR supports all [data types](https://www.hl7.org/fhir/search.html#ptypes) except the type **special**:


| **Search parameter type**  | **Supported - PaaS** | **Supported - OSS (SQL)** | **Supported - OSS (Cosmos DB)** |
| -------------------------  | -------------------- | ------------------------- | ------------------------------- |
|  number                    | Yes                  | Yes                       | Yes                             |
|  date                      | Yes                  | Yes                       | Yes                             |
|  string                    | Yes                  | Yes                       | Yes                             |
|  token                     | Yes                  | Yes                       | Yes                             |
|  reference                 | Yes                  | Yes                       | Yes                             |
|  composite                 | Yes                  | Yes                       | Yes                             |
|  quantity                  | Yes                  | Yes                       | Yes                             |
|  uri                       | Yes                  | Yes                       | Yes                             |
|  special                   | No                   | No                        | No                              |

### Common search parameters

There are [common search parameters](https://www.hl7.org/fhir/search.html#all) that apply to all resources. These are listed below, along with their support within the Azure API for FHIR:

| **Common search parameter** | **Supported - PaaS** | **Supported - OSS (SQL)** | **Supported - OSS (Cosmos DB)** | **Comment**                    |
| --------------------------  | -------------------- | ------------------------- | ------------------------------- | ------------------------------ |
| _id                         | Yes                  | Yes                       | Yes                             |                                |
| _lastUpdated                | Yes                  | Yes                       | Yes                             |                                |
| _tag                        | Yes                  | Yes                       | Yes                             |                                | 
| _type                       | Yes                  | Yes                       | Yes                             |                                |
| _security                   | Yes                  | Yes                       | Yes                             |                                |
| _profile                    | Yes                  | Yes                       | Yes                             | **Note**: If you created your R4 database before February 20, 2021, you’ll need to run a reindexing job to enable **_profile**.                                                      |
| _text                       | No                   | No                        | No                              |                                |
| _content                    | No                   | No                        | No                              |                                |
| _has                        | Partial                   | Partial                        | Yes                              |                                |
| _query                      | No                   | No                        | No                              |                                |
| _filter                     | No                   | No                        | No                              |                                |
| _list                       | No                   | No                        | No                              |                                |

### Resource specific parameters

With the Azure API for FHIR, we support almost all resource specific search parameters defined by the FHIR specification. The only search parameters we don’t support are available in the links below:

* [STU3 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/Stu3/unsupported-search-parameters.json)

* [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)

You can also see the current support for search parameters in the [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement.html) with the following request:

`GET {{FHIR URL}}/metadata`

To see the search parameters in the capability statement, navigate to `CapabilityStatement.rest.resource.searchParam` to see the search parameters for each resource and `CapabilityStatement.rest.searchParam` to find the search parameters for all resources.

> [!NOTE]
> The Azure API for FHIR does not automatically create or index any support search parameters that are not defined by the FHIR specification. However, we do provide support for you to to define your own search parameters.

### Composite search parameters

With the Azure API for FHIR, we support the following search parameter type pairings:

* Reference, Token
* Token, Date
* Token, Number, Number
* Token, Quantity
* Token, String
* Token, Token

For more information, see the HL7 [Composite Search Parameters](https://www.hl7.org/fhir/search.html#composite). 

> [!NOTE]
> Composite search parameters do not support modifiers per the FHIR specification.

 ### Modifiers & prefixes

[Modifiers](https://www.hl7.org/fhir/search.html#modifiers) allow you to modify the search parameter. Below is an overview of all the FHIR modifiers and the support in the Azure API for FHIR. 

| **Modifiers** | **Supported - PaaS** | **Supported - OSS (SQL)** | **Supported - OSS (Cosmos DB)** |
| ------------- | -------------------- | ------------------------- | ------------------------------- |
|  :missing     | Yes                  | Yes                       | Yes                             |
|  :exact       | Yes                  | Yes                       | Yes                             | 
|  :contains    | Yes                  | Yes                       | Yes                             | 
|  :text        | Yes                  | Yes                       | Yes                             | 
|  :type (reference) | Yes             | Yes                       | Yes                             | 
|  :not         | Yes                  | Yes                       | Yes                             | 
|  :below (uri) | Yes                  | Yes                       | Yes                             |  
|  :above (uri) | No                   | NO                        | No                              | 
|  :in (token)  | No                   | NO                        | No                              | 
|  :below (token) | No                 | NO                        | No                              | 
|  :above (token) | No                 | NO                        | No                              | 
|  :not-in (token) | No                | NO                        | No                              | 

For search parameters that have a specific order (numbers, dates, and quantities), you can use a [prefix](https://www.hl7.org/fhir/search.html#prefix) on the parameter to help with finding matches. The Azure API for FHIR supports all prefixes.

 ### Search result parameters



To help manage the returned resources, there are other search result parameters that you can use in your search. For details on how to use each of the search result parameters, refer to the [HL7](https://www.hl7.org/fhir/search.html#return) website. 

| **Search result parameters**  | **Supported - PaaS** | **Supported - OSS (SQL)** | **Supported - OSS (Cosmos DB)** | **Comments**                 |
| ----------------------------  | -------------------- | ------------------------- | ------------------------------- | -----------------------------|
| _elements                     | Yes                  | Yes                       | Yes                             |  Issue [1256](https://github.com/microsoft/fhir-server/issues/1256)                              |
| _count                        | Yes                  | Yes                       | Yes                             | _count is limited to 1000 resources. If it's set higher than 1000, only 1000 will be returned and a warning will be returned in the bundle.                               |
| _include                      | Yes                  | Yes                       | Yes                             | Included items are limited to 100. _include on PaaS and OSS on Cosmos DB does not include :iterate support [(#1313)](https://github.com/microsoft/fhir-server/issues/1313).                               |
| _revinclude                   | Yes                  | Yes                       | Yes                             |  Included items are limited to 100. _revinclude on PaaS and OSS on Cosmos DB does not include :iterate support [(#1313)](https://github.com/microsoft/fhir-server/issues/1313).  Issue [#1319](https://github.com/microsoft/fhir-server/issues/1319)                            |
| _summary                      | Yes             | Yes                   | Yes                        |                               |
| _total                        | Partial              | Partial                   | Partial                         | _total=none and _total=accurate                               |
| _sort                         | Partial              | Partial                   | Partial                         | sort=_lastUpdated is supported                               |
| _contained                    | No                   | No                        | No                              |                                |
| _containedType                | No                   | No                        | No                              |                                |
| _score                        | No                   | No                        | No                              |                                |

By default, the Azure API for FHIR is set to lenient handling. This means that the server will ignore any unknown or unsupported parameters. If you want to use strict handling, you can use the **Prefer** header and set `handling=strict`.


 ## Chained & reverse chained searching

A [chained search](https://www.hl7.org/fhir/search.html#chaining) allows you to search using a search parameter on a resource referenced by another resource. For example, if you want to find encounters where the patient’s name is Jane, use:

`GET {{FHIR URL}}/Encounter?subject:Patient.name=Jane`

Similarly, you can do a reverse chained search. This allows you to get resources where you specify criteria on other resources that refer to them. For more examples of chained and reverse chaining, refer to the [FHIR search examples](search-samples.md) page. 

**Note**: In the Azure API for FHIR and the open source backed by Cosmos DB, there's a limitation where each subquery required for the chained and reverse chained searches will only return 100 items. If there are more than 100 items found, you’ll receive the following error message:

“Subqueries in a chained expression can't return more than 100 results, please use a more selective criteria.” 

To get a successful query, you’ll need to be more specific in what you are looking for.

## Pagination

As mentioned above, the results from a search will be a paged bundle. By default, the search will return 10 results per page, but this can be increased (or decreased) by specifying `_count`. Within the bundle, there will be a self link that contains the current result of the search. If there are additional matches, the bundle will contain a next link. You can continue to use the next link to get the subsequent pages of results. 

Currently, the Azure API for FHIR only supports the next link in bundles, and it doesn’t support first, last, or previous links.

## Next steps

Now that you've learned about the basics of search, see the search samples page for details about how to search using different search parameters, modifiers, and other FHIR search tools.

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)
