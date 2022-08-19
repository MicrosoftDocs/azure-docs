---
title:  Overview of FHIR search in Azure Health Data Services
description: This article describes an overview of FHIR search that is implemented in Azure Health Data Services
author: mikaelweave
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/18/2022
ms.author: mikaelw
---
# Overview of FHIR search

The Fast Healthcare Interoperability Resources (FHIR&#174;) specification defines the fundamentals of search for resources in a FHIR server database. This article will guide you through some key aspects of querying resources in FHIR. For complete details about the FHIR search API, refer to the [Search](https://www.hl7.org/fhir/search.html) documentation in the HL7 FHIR specification. Throughout this article, we'll demonstrate FHIR search syntax in example API calls with the placeholder `{{FHIR_URL}}` to represent the FHIR server URL. In the case of the FHIR service in Azure Health Data Services, this URL would be `https://<WORKSPACE NAME>-<ACCOUNT-NAME>.fhir.azurehealthcareapis.com`.

FHIR searches can be against a specific resource type, a specified [compartment](https://www.hl7.org/fhir/compartmentdefinition.html), or all resources in the FHIR server database. The simplest way to execute a search in FHIR is to use a `GET` request. For example, if you want to pull all `Patient` resources in the database, you could use the following request: 

```rest
GET {{FHIR_URL}}/Patient
```

You can also search using `POST`. To search using `POST`, the search parameters are delivered in the body of the request in JSON format. This permits searching with longer, more complex series of query parameters.

If the search request is successful, you'll receive a FHIR bundle response with the type `searchset`. If the search fails, you’ll find the error details in an `OperationOutcome` response.

In the following sections, we'll cover the various aspects of querying resources in FHIR. Once you’ve reviewed these details, refer to the [FHIR search samples page](search-samples.md), which features different types of searches that you can run in the FHIR service in Azure Health Data Services.

## Search parameters

When you do a search in FHIR, you are searching the database for resource instances that match certain search criteria. FHIR search API calls use search parameters to define these search criteria. Each resource in FHIR carries information as a set of elements, and search parameters work to query the information in these elements. If any resource instances contain a positive match between their element values and the search parameter values specified in a FHIR search API call, then the FHIR server returns those resource instances in a bundle response.

For each search parameter, FHIR defines the [data type(s)](https://www.hl7.org/fhir/search.html#ptypes) that can be used. The support in FHIR service for the various data types is outlined below.


| **Search parameter type**  | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
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

There are [common search parameters](https://www.hl7.org/fhir/search.html#all) that apply to all resources in FHIR. These are listed below, along with their support in the FHIR service:

| **Common search parameter** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| _id                         | Yes                  | Yes                       
| _lastUpdated                | Yes                  | Yes                       |
| _tag                        | Yes                  | Yes                       |
| _type                       | Yes                  | Yes                       |
| _security                   | Yes                  | Yes                       |
| _profile                    | Yes                  | Yes                       |
| _has                        | Yes                 | Yes                        |
| _query                      | No                   | No                        |
| _filter                     | No                   | No                        |
| _list                       | No                   | No                        |
| _text                       | No                   | No                        |
| _content                    | No                   | No                        |

### Resource-specific parameters

The FHIR service in Azure Health Data Services supports almost all [resource-specific search parameters](https://www.hl7.org/fhir/searchparameter-registry.html) defined by the FHIR specification. The only search parameters not supported are listed in the links below:

* [STU3 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/Stu3/unsupported-search-parameters.json)

* [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)

You can also see the current support for search parameters in the [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement.html) with the following request:

```rest
GET {{FHIR_URL}}/metadata
```

To see the search parameters in the capability statement, navigate to `CapabilityStatement.rest.resource.searchParam` to see the search parameters for each resource and `CapabilityStatement.rest.searchParam` to find the search parameters for all resources.

> [!NOTE]
> FHIR service in Azure Health Data Services does not automatically create or index any search parameters that are not defined by the FHIR specification. However, we do provide support for you to to define your own [search parameters](how-to-do-custom-search.md).

### Composite search parameters
Composite search allows you to search against value pairs. For example, if you were searching for a height observation where the person was 60 inches, you would want to make sure that a single component of the observation contained the code of height **and** the value of 60. You wouldn't want to get an observation where a weight of 60 and height of 48 was stored, even though the observation would have entries that qualified for value of 60 and code of height, just in different component sections. 

With the FHIR service for the Azure Health Data Services, we support the following search parameter type pairings:

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

| **Modifiers** | **Azure API for FHIR** | **FHIR service in Azure Health Data Services** | **Comment**|
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

For search parameters that have a specific order (numbers, dates, and quantities), you can use a [prefix](https://www.hl7.org/fhir/search.html#prefix) on the parameter to help with finding matches. The FHIR service in the Azure Health Data Services supports all prefixes.

 ### Search result parameters
To help manage the returned resources, there are search result parameters that you can use in your search. For details on how to use each of the search result parameters, refer to the [HL7](https://www.hl7.org/fhir/search.html#return) website. 

| **Search result parameters**  | **Azure API for FHIR** | **FHIR service in Azure Health Data Services** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| _elements                     | Yes                  | Yes                       |
| _count                        | Yes                  | Yes                       | _count is limited to 1000 resources. If it's set higher than 1000, only 1000 will be returned and a warning will be returned in the bundle.                               |
| _include                      | Yes                  | Yes                       | Included items are limited to 100. _include on PaaS and OSS on Cosmos DB don't include :iterate support [(#2137)](https://github.com/microsoft/fhir-server/issues/2137).                               |
| _revinclude                   | Yes                  | Yes                       |Included items are limited to 100. _revinclude on PaaS and OSS on Cosmos DB don't include :iterate support [(#2137)](https://github.com/microsoft/fhir-server/issues/2137). There's also an incorrect status code for a bad request [#1319](https://github.com/microsoft/fhir-server/issues/1319)                            |
| _summary                      | Yes             | Yes                   |
| _total                        | Partial              | Partial                   | _total=none and _total=accurate                               |
| _sort                         | Partial              | Partial                   | sort=_lastUpdated is supported on Azure API for FHIR and the FHIR service. For the FHIR service and the OSS SQL DB FHIR servers, sorting by strings and dateTime fields are supported. For Azure API for FHIR and OSS Cosmos DB databases created after April 20, 2021, sort is supported on first name, last name, birthdate, and clinical date.             |
| _contained                    | No                   | No                        |
| _containedType                | No                   | No                        |
| _score                        | No                   | No                        |

> [!NOTE]
> By default `_sort` sorts the record in ascending order. You can use the prefix `'-'` to sort in descending order. In addition, the FHIR service and the Azure API for FHIR only allow you to sort on a single field at a time.

By default, the FHIR service in the Azure Health Data Services is set to lenient handling. This means that the server will ignore any unknown or unsupported parameters. If you want to use strict handling, you can use the **Prefer** header and set `handling=strict`.

 ## Chained & reverse chained searching

A [chained search](https://www.hl7.org/fhir/search.html#chaining) allows you to search using a search parameter on a resource referenced by another resource. For example, if you want to find encounters where the patient’s name is Jane, use:

`GET {{FHIR_URL}}/Encounter?subject:Patient.name=Jane`

Similarly, you can do a reverse chained search. This allows you to get resources where you specify criteria on other resources that refer to them. For more examples of chained and reverse chained search, refer to the [FHIR search examples](search-samples.md) page. 

## Pagination

As mentioned above, the results from a search will be a paged bundle. By default, the search will return 10 results per page, but this can be increased (or decreased) by specifying `_count`. Within the bundle, there will be a self link that contains the current result of the search. If there are more matches, the bundle will contain a next link. You can continue to use the next link to get the subsequent pages of results. `_count` is limited to 1000 items or less. 

Currently, FHIR service in Azure Health Data Services only supports the next link in bundles, and it doesn’t support first, last, or previous links.

## Next steps

Now that you've learned about the basics of search, see the search samples page for details about how to search using different search parameters, modifiers, and other FHIR search scenarios. To read about FHIR search examples, see 

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
