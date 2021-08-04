---
title:  Overview of FHIR search in Azure Healthcare APIs
description: This article describes an overview of FHIR search that is implemented in Azure Healthcare APIs
author: CaitlinV39
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/03/2021
ms.author: cavoeg
---
# Overview of FHIR search

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The FHIR specification defines the fundamentals of search for FHIR resources. This article will guide you through some key aspects to searching resources in FHIR. For complete details about searching FHIR resources, refer to [Search](https://www.hl7.org/fhir/search.html) in the HL7 FHIR Specification. Throughout this article, we will give examples of search syntax. Each search will be against your FHIR server, which typically has a URL of `https://<WORKSPACE NAME>-<ACCOUNT-NAME>.fhir.azurehealthcareapis.com`. In the examples, we will use the placeholder {{FHIR_URL}} for this URL. 

FHIR searches can be against a specific resource type, a specified [compartment](https://www.hl7.org/fhir/compartmentdefinition.html), or all resources. The simplest way to execute a search in FHIR is to use a `GET` request. For example, if you want to pull all patients in the database, you could use the following request: 

```rest
GET {{FHIR_URL}}/Patient
```

You can also search using `POST`, which is useful if the query string is too long. To search using `POST`, the search parameters can be submitted as a form body. This allows for longer, more complex series of query parameters that might be difficult to see and understand in a query string.

If the search request is successful, you’ll receive a FHIR bundle response with the type `searchset`. If the search fails, you’ll find the error details in the `OperationOutcome` to help you understand why the search failed.

In the following sections, we’ll cover the various aspects involved in searching. Once you’ve reviewed these details, refer to our [samples page](search-samples.md) that has examples of searches that you can make in the FHIR service.

## Search parameters

When you do a search, you'll search based on various attributes of the resource. These attributes are called search parameters. Each resource has a set of defined search parameters. The search parameter must be defined and indexed in the database for you to successfully search against it.

Each search parameter has a defined [data types](https://www.hl7.org/fhir/search.html#ptypes). The support for the various data types is outlined below:


| **Search parameter type**  | **Azure API for FHIR** | **FHIR service in Azure Healthcare APIs** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  number                    | Yes                  | Yes                       |
|  date                      | Yes                  | Yes                       |
|  string                    | Yes                  | Yes                       |
|  token                     | Yes                  | Yes                       |
|  reference                 | Yes                  | Yes                       |
|  composite                 | Partial              | Partial                   | The list of supported composite types is described later in this article |
|  quantity                  | Yes                  | Yes                       |
|  uri                       | Yes                  | Yes                       |
|  special                   | No                   | No                        |

### Common search parameters

There are [common search parameters](https://www.hl7.org/fhir/search.html#all) that apply to all resources. These are listed below, along with their support:

| **Common search parameter** | **Azure API for FHIR** | **FHIR service in Azure Healthcare APIs** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| _id                         | Yes                  | Yes                       
| _lastUpdated                | Yes                  | Yes                       |
| _tag                        | Yes                  | Yes                       |
| _type                       | Yes                  | Yes                       |
| _security                   | Yes                  | Yes                       |
| _profile                    | Yes                  | Yes                       |
| _has                        | Yes.                 | Yes                       |  |
| _query                      | No                   | No                        |
| _filter                     | No                   | No                        |
| _list                       | No                   | No                        |
| _text                       | No                   | No                        |
| _content                    | No                   | No                        |

### Resource-specific parameters

With the FHIR service in the Azure Healthcare APIs, we support almost all [resource-specific search parameters](https://www.hl7.org/fhir/searchparameter-registry.html) defined by the FHIR specification. The only search parameters we don’t support are available in the links below:

* [STU3 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/Stu3/unsupported-search-parameters.json)

* [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)

You can also see the current support for search parameters in the [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement.html) with the following request:

```rest
GET {{FHIR_URL}}/metadata
```

To see the search parameters in the capability statement, navigate to `CapabilityStatement.rest.resource.searchParam` to see the search parameters for each resource and `CapabilityStatement.rest.searchParam` to find the search parameters for all resources.

> [!NOTE]
> The FHIR service in the Azure Healthcare APIs does not automatically create or index any search parameters that are not defined by the FHIR specification. However, we do provide support for you to to define your own [search parameters](how-to-do-custom-search.md).

### Composite search parameters
Composite search allows you to search against value pairs. For example, if you were searching for a height observation where the person was 60 inches, you would want to make sure that a single component of the observation contained the code of height **and** the value of 60. You wouldn't want to get an observation where a weight of 60 and height of 48 was stored, even though the observation would have entries that qualified for value of 60 and code of height, just in different component sections. 

With the FHIR service for the Azure Healthcare APIs, we support the following search parameter type pairings:

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

[Modifiers](https://www.hl7.org/fhir/search.html#modifiers) allow you to modify the search parameter. Below is an overview of all the FHIR modifiers and the support: 

| **Modifiers** | **Azure API for FHIR** | **FHIR service in Azure Healthcare APIs** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  :missing     | Yes                  | Yes                       |
|  :exact       | Yes                  | Yes                       |
|  :contains    | Yes                  | Yes                       |
|  :text        | Yes                  | Yes                       |
|  :type (reference) | Yes             | Yes                       |
|  :not         | Yes                  | Yes                       |
|  :below (uri) | Yes                  | Yes                       |
|  :above (uri) | Yes                  | Yes                       |
|  :in (token)  | No                   | No                        |
|  :below (token) | No                 | No                        |
|  :above (token) | No                 | No                        |
|  :not-in (token) | No                | No                        |

For search parameters that have a specific order (numbers, dates, and quantities), you can use a [prefix](https://www.hl7.org/fhir/search.html#prefix) on the parameter to help with finding matches. The FHIR service in the Azure Healthcare APIs supports all prefixes.

 ### Search result parameters
To help manage the returned resources, there are search result parameters that you can use in your search. For details on how to use each of the search result parameters, refer to the [HL7](https://www.hl7.org/fhir/search.html#return) website. 

| **Search result parameters**  | **Azure API for FHIR** | **FHIR service in Azure Healthcare APIs** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| _elements                     | Yes                  | Yes                       |
| _count                        | Yes                  | Yes                       | _count is limited to 1000 resources. If it's set higher than 1000, only 1000 will be returned and a warning will be returned in the bundle.                               |
| _include                      | Yes                  | Yes                       | Included items are limited to 100. _include on PaaS and OSS on Cosmos DB do not include :iterate support [(#2137)](https://github.com/microsoft/fhir-server/issues/2137).                               |
| _revinclude                   | Yes                  | Yes                       |Included items are limited to 100. _revinclude on PaaS and OSS on Cosmos DB do not include :iterate support [(#2137)](https://github.com/microsoft/fhir-server/issues/2137). There is also an incorrect status code for a bad request [#1319](https://github.com/microsoft/fhir-server/issues/1319)                            |
| _summary                      | Yes             | Yes                   |
| _total                        | Partial              | Partial                   | _total=none and _total=accurate                               |
| _sort                         | Partial              | Partial                   | sort=_lastUpdated is supported. For Azure API for FHIR and OSS Cosmos DB databases created after April 20, 2021 sort is also supported  on first name, last name, and clinical date. The FHIR service and the OSS SQL DB database support sorting by strings and dates.                              |
| _contained                    | No                   | No                        |
| _containedType                | No                   | No                        |
| _score                        | No                   | No                        |

By default, the FHIR service in the Azure Healthcare APIs is set to lenient handling. This means that the server will ignore any unknown or unsupported parameters. If you want to use strict handling, you can use the **Prefer** header and set `handling=strict`.

 ## Chained & reverse chained searching

A [chained search](https://www.hl7.org/fhir/search.html#chaining) allows you to search using a search parameter on a resource referenced by another resource. For example, if you want to find encounters where the patient’s name is Jane, use:

`GET {{FHIR_URL}}/Encounter?subject:Patient.name=Jane`

Similarly, you can do a reverse chained search. This allows you to get resources where you specify criteria on other resources that refer to them. For more examples of chained and reverse chained search, refer to the [FHIR search examples](search-samples.md) page. 


## Pagination

As mentioned above, the results from a search will be a paged bundle. By default, the search will return 10 results per page, but this can be increased (or decreased) by specifying `_count`. Within the bundle, there will be a self link that contains the current result of the search. If there are additional matches, the bundle will contain a next link. You can continue to use the next link to get the subsequent pages of results. `_count` is limited to 1000 items or less. 

Currently, the FHIR service in the Azure Healthcare APIs only supports the next link in bundles, and it doesn’t support first, last, or previous links.

## Next steps

Now that you've learned about the basics of search, see the search samples page for details about how to search using different search parameters, modifiers, and other FHIR search scenarios.

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)
