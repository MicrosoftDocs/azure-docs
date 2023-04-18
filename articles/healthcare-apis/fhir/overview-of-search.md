---
title:  Overview of FHIR search in Azure Health Data Services
description: This article describes an overview of FHIR search that is implemented in Azure Health Data Services
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: ignite-2022
ms.topic: reference
ms.date: 08/18/2022
ms.author: kesheth
---
# Overview of FHIR search

The Fast Healthcare Interoperability Resources (FHIR&#174;) specification defines an API for querying resources in a FHIR server database. This article will guide you through some key aspects of querying data in FHIR. For complete details about the FHIR search API, refer to the HL7 [FHIR Search](https://www.hl7.org/fhir/search.html) documentation. 

Throughout this article, we'll demonstrate FHIR search syntax in example API calls with the `{{FHIR_URL}}` placeholder to represent the FHIR server URL. In the case of the FHIR service in Azure Health Data Services, this URL would be `https://<WORKSPACE-NAME>-<FHIR-SERVICE-NAME>.fhir.azurehealthcareapis.com`.

FHIR searches can be against a specific resource type, a specified [compartment](https://www.hl7.org/fhir/compartmentdefinition.html), or all resources in the FHIR server database. The simplest way to execute a search in FHIR is to use a `GET` request. For example, if you want to pull all `Patient` resources in the database, you could use the following request: 

```rest
GET {{FHIR_URL}}/Patient
```

You can also search using `POST`. To search using `POST`, the search parameters are delivered in the body of the request. This makes it easier to send queries with longer, more complex series of parameters.

With either `POST` or `GET`, if the search request is successful, you'll receive a FHIR `searchset` bundle containing the resource instance(s) returned from the search. If the search fails, you’ll find the error details in an `OperationOutcome` response.

In the following sections, we'll cover the various aspects of querying resources in FHIR. Once you’ve reviewed these topics, refer to the [FHIR search samples page](search-samples.md), which features examples of different FHIR search methods.

## Search parameters

When you do a search in FHIR, you are searching the database for resources that match certain search criteria. The FHIR API specifies a rich set of search parameters for fine-tuning search criteria. Each resource in FHIR carries information as a set of elements, and search parameters work to query the information in these elements. In a FHIR search API call, if a positive match is found between the request's search parameters and the corresponding element values stored in a resource instance, then the FHIR server returns a bundle containing the resource instance(s) whose elements satisfied the search criteria. 

For each search parameter, the FHIR specification defines the [data type(s)](https://www.hl7.org/fhir/search.html#ptypes) that can be used. Support in the FHIR service for the various data types is outlined below.


| **Search parameter type**  | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  number                    | Yes                  | Yes                       |
|  date                      | Yes                  | Yes                       |
|  string                    | Yes                  | Yes                       |
|  token                     | Yes                  | Yes                       |
|  reference                 | Yes                  | Yes                       |
|  composite                 | Partial              | Partial                   | The list of supported composite types is given later in this article. |
|  quantity                  | Yes                  | Yes                       |
|  uri                       | Yes                  | Yes                       |
|  special                   | No                   | No                        |

### Common search parameters

There are [common search parameters](https://www.hl7.org/fhir/search.html#all) that apply to all resources in FHIR. These are listed below, along with their support in the FHIR service:

| **Common search parameter** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| `_id `                        | Yes                  | Yes                       
| `_lastUpdated`                | Yes                  | Yes                       |
| `_tag`                        | Yes                  | Yes                       |
| `_type`                       | Yes                  | Yes                       |
| `_security`                   | Yes                  | Yes                       |
| `_profile`                    | Yes                  | Yes                       |
| `_has`                        | Yes                  | Yes                       |
| `_query`                      | No                   | No                        |
| `_filter`                     | No                   | No                        |
| `_list`                       | No                   | No                        |
| `_text`                       | No                   | No                        |
| `_content`                    | No                   | No                        |

### Resource-specific parameters

The FHIR service in Azure Health Data Services supports almost all [resource-specific search parameters](https://www.hl7.org/fhir/searchparameter-registry.html) defined in the FHIR specification. Search parameters that are not supported are listed in the links below:

* [STU3 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/Stu3/unsupported-search-parameters.json)

* [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)

You can also see the current support for search parameters in the [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement.html) with the following request:

```rest
GET {{FHIR_URL}}/metadata
```

To view the supported search parameters in the capability statement, navigate to `CapabilityStatement.rest.resource.searchParam` for the resource-specific search parameters and `CapabilityStatement.rest.searchParam` for search parameters that apply to all resources.

> [!NOTE]
> The FHIR service in Azure Health Data Services does not automatically index search parameters that are not defined in the base FHIR specification. However, the FHIR service does support [custom search parameters](how-to-do-custom-search.md).

### Composite search parameters
Composite searches in FHIR allow you to search against element pairs as logically connected units. For example, if you were searching for observations where the height of the patient was over 60 inches, you would want to make sure that a single property of the observation contained the height code *and* a value greater than 60 inches (the value should only pertain to height). You wouldn't want to return a positive match on an observation with the height code *and* an arm to arm length over 60 inches, for example. Composite search parameters prevent this problem by searching against pre-specified pairs of elements whose values must both meet the search criteria for a positive match to occur.

The FHIR service in Azure Health Data Services supports the following search parameter type pairings for composite searches:

* Reference, Token
* Token, Date
* Token, Number, Number
* Token, Quantity
* Token, String
* Token, Token

For more information, see the HL7 [Composite Search Parameters](https://www.hl7.org/fhir/search.html#composite) documentation. 

> [!NOTE]
> Composite search parameters do not support modifiers, as per the FHIR specification.

 ### Modifiers & prefixes

[Modifiers](https://www.hl7.org/fhir/search.html#modifiers) allow you to qualify search parameters with additional conditions. Below is a list of FHIR modifiers and their support in the FHIR service: 

| **Modifiers** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  `:missing`     | Yes                  | Yes                       |
|  `:exact`       | Yes                  | Yes                       |
|  `:contains`    | Yes                  | Yes                       |
|  `:text`        | Yes                  | Yes                       |
|  `:type` (reference) | Yes             | Yes                       |
|  `:not`         | Yes                  | Yes                       |
|  `:below` (uri) | Yes                  | Yes                       |
|  `:above` (uri) | Yes                  | Yes                       |
|  `:in` (token)  | No                   | No                        |
|  `:below` (token) | No                 | No                        |
|  `:above` (token) | No                 | No                        |
|  `:not-in` (token) | No                | No                        |

For search parameters that have a specific order (numbers, dates, and quantities), you can use a [prefix](https://www.hl7.org/fhir/search.html#prefix) before the parameter value to refine the search criteria (e.g. `Patient?_lastUpdated=gt2022-08-01` where the prefix `gt` means "greater than"). The FHIR service in Azure Health Data Services supports all prefixes defined in the FHIR standard.

 ### Search result parameters
FHIR specifies a set of search result parameters to help manage the information returned from a search. For detailed information on how to use search result parameters in FHIR, refer to the [HL7](https://www.hl7.org/fhir/search.html#return) website. Below is a list of FHIR search result parameters and their support in the FHIR service.

| **Search result parameters** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| `_elements`                     | Yes                  | Yes                       |
| `_count`                        | Yes                  | Yes                       | `_count` is limited to 1000 resources. If it's set higher than 1000, only 1000 will be returned and a warning will be included in the bundle.                               |
| `_include`                      | Yes                  | Yes                       | Items retrieved with `_include` are limited to 100. `_include` on PaaS and OSS on Azure Cosmos DB doesn't support `:iterate` [(#2137)](https://github.com/microsoft/fhir-server/issues/2137).                               |
| `_revinclude`                   | Yes                  | Yes                       |Items retrieved with `_revinclude` are limited to 100. `_revinclude` on PaaS and OSS on Azure Cosmos DB doesn't support `:iterate` [(#2137)](https://github.com/microsoft/fhir-server/issues/2137). There's also an incorrect status code for a bad request [#1319](https://github.com/microsoft/fhir-server/issues/1319).                            |
| `_summary`                      | Yes             | Yes                   |
| `_total`                        | Partial              | Partial                   | `_total=none` and `_total=accurate`                               |
| `_sort`                         | Partial              | Partial                   | `sort=_lastUpdated` is supported on the FHIR service. For the FHIR service and the OSS SQL DB FHIR servers, sorting by strings and dateTime fields are supported. For Azure API for FHIR and OSS Azure Cosmos DB databases created after April 20, 2021, sort is supported on first name, last name, birthdate, and clinical date.             |
| `_contained`                    | No                   | No                        |
| `_containedType`                | No                   | No                        |
| `_score`                        | No                   | No                        |

> [!NOTE]
> By default, `_sort` arranges records in ascending order. You can also use the prefix `-` to sort in descending order. The FHIR service only allows you to sort on a single field at a time.

By default, the FHIR service in Azure Health Data Services is set to lenient handling. This means that the server will ignore any unknown or unsupported parameters. If you want to use strict handling, you can include the `Prefer` header and set `handling=strict`.

 ## Chained & reverse chained searching

A [chained search](https://www.hl7.org/fhir/search.html#chaining) allows you to perform fine-targeted queries for resources that have a reference to another resource. For example, if you want to find encounters where the patient’s name is Jane, use:

`GET {{FHIR_URL}}/Encounter?subject:Patient.name=Jane`

The `.` in the above request steers the path of the chained search to the target parameter (`name` in this case). 

Similarly, you can do a reverse chained search with the `_has` parameter. This allows you to retrieve resource instances by specifying criteria on other resources that reference the resources of interest. For examples of chained and reverse chained search, refer to the [FHIR search examples](search-samples.md) page. 

## Pagination

As mentioned above, the results from a FHIR search will be available in paginated form at a link provided in the `searchset` bundle. By default, the FHIR service will display 10 search results per page, but this can be increased (or decreased) by setting the `_count` parameter. If there are more matches than fit on one page, the bundle will include a `next` link. Repeatedly fetching from the `next` link will yield the subsequent pages of results. Note that the `_count` parameter value cannot exceed 1000. 

Currently, the FHIR service in Azure Health Data Services only supports the `next` link and doesn’t support `first`, `last`, or `previous` links in bundles returned from a search.

## Next steps

Now that you've learned about the basics of FHIR search, see the search samples page for details about how to search using search parameters, modifiers, and other FHIR search methods.  

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
