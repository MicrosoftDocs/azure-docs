---
title: FHIR Search Overview in Azure Health Data Services
description: Learn how FHIR search works in Azure Health Data Services. Explore search parameters, modifiers, pagination, and chained searches to query FHIR resources effectively.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: concept-article
ms.date: 06/23/2026
ms.author: kesheth
ai-usage: ai-assisted
---

# FHIR search overview in Azure Health Data Services

The Fast Healthcare Interoperability Resources (FHIR&reg;) specification defines an API for querying resources in a FHIR server database. This article guides you through key aspects of FHIR search in Azure Health Data Services, including search parameters, modifiers, pagination, and chained searches. For complete details about the FHIR search API, refer to the HL7 [FHIR Search](https://www.hl7.org/fhir/search.html) documentation. 

Throughout this article, the `{{FHIR_URL}}` placeholder represents the base URL of the FHIR service in example API calls that demonstrate FHIR search syntax. If the FHIR service is in Azure Health Data Services, this URL is `https://<WORKSPACE-NAME>-<FHIR-SERVICE-NAME>.fhir.azurehealthcareapis.com`.

You can perform FHIR searches against a specific resource type, a specified [compartment](https://www.hl7.org/fhir/compartmentdefinition.html), or all resources in the FHIR server database. The simplest way to execute a search in FHIR is to use a `GET` request. For example, if you want to pull all `Patient` resources in the database, use the following request.

```rest
GET {{FHIR_URL}}/Patient
```

You can also search by using `POST`. To search by using `POST`, include the search parameters in the body of the request. This method makes it easier to send queries with longer, more complex series of parameters.

By using either `POST` or `GET`, if the search request is successful, you receive a FHIR `searchset` bundle containing the resource instances returned from the search. If the search fails, the `OperationOutcome` response contains the error details.

In the following sections, you learn about the various aspects of querying resources in FHIR. When you finish reviewing these topics, see the [FHIR search samples page](search-samples.md), which features examples of different FHIR search methods.

## Search parameters

When you search in FHIR, you search the database for resources that match certain criteria. The FHIR API specifies a rich set of search parameters for fine-tuning search criteria. Each resource in FHIR carries information as a set of elements, and search parameters work to query the information in these elements.

If search parameters positively match resource element values, the FHIR server returns a bundle of the matching resources.

For each search parameter, the FHIR specification defines the [data type](https://www.hl7.org/fhir/search.html#ptypes) that you can use. The following table outlines support in the FHIR service for the various data types.


| **Search parameter type**  | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  number                    | Yes                  | Yes                       | |
|  date                      | Yes                  | Yes                       | |
|  string                    | Yes                  | Yes                       | |
|  token                     | Yes                  | Yes                       | |
|  reference                 | Yes                  | Yes                       | |
|  composite                 | Partial              | Partial                   | The list of supported composite types follows in this article. |
|  quantity                  | Yes                  | Yes                       | |
|  uri                       | Yes                  | Yes                       | |
|  special                   | No                   | No                        | |

### Common search parameters

[Common search parameters](https://www.hl7.org/fhir/search.html#all) apply to all resources in FHIR. The following table lists these parameters, along with their support in the FHIR service.

| **Common search parameter** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| `_id `                        | Yes                  | Yes                       | |
| `_lastUpdated`                | Yes                  | Yes                       | |
| `_tag`                        | Yes                  | Yes                       | |
| `_type`                       | Yes                  | Yes                       | |
| `_security`                   | Yes                  | Yes                       | |
| `_profile`                    | Yes                  | Yes                       | |
| `_has`                        | Yes                  | Yes                       | |
| `_query`                      | No                   | No                        | |
| `_filter`                     | No                   | No                        | |
| `_list`                       | No                   | No                        | |
| `_text`                       | No                   | No                        | |
| `_content`                    | No                   | No                        | |

### Resource-specific parameters

The FHIR service in Azure Health Data Services supports almost all [resource-specific search parameters](https://www.hl7.org/fhir/searchparameter-registry.html) defined in the FHIR specification. The following links list search parameters that aren't supported:

* [STU3 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/Stu3/unsupported-search-parameters.json)

* [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)

You can also see the current support for search parameters in the [FHIR Capability Statement](https://www.hl7.org/fhir/capabilitystatement.html) by using the following request:

```rest
GET {{FHIR_URL}}/metadata
```

To view the supported search parameters in the capability statement, go to `CapabilityStatement.rest.resource.searchParam` for the resource-specific search parameters and `CapabilityStatement.rest.searchParam` for search parameters that apply to all resources.

> [!NOTE]
> The FHIR service in Azure Health Data Services doesn't automatically index search parameters that aren't defined in the base FHIR specification. The FHIR service does support [custom search parameters](how-to-do-custom-search.md).

### Composite search parameters

Composite searches in FHIR treat element pairs as a single unit. For example, when you search for observations where a patient's height is over 60 inches, the height code and the value must come from the same observation. Without composite search, an observation with the height code and an arm length value over 60 inches could also match. Composite search parameters avoid this issue by requiring both values in a predefined element pair to satisfy the criteria.

The FHIR service in Azure Health Data Services supports the following search parameter type pairings for composite searches.

* Reference, Token
* Token, Date
* Token, Number, Number
* Token, Quantity
* Token, String
* Token, Token

For more information, see the HL7 [Composite Search Parameters](https://www.hl7.org/fhir/search.html#composite) documentation. 

> [!NOTE]
> Composite search parameters don't support modifiers, as per the FHIR specification.

 ### Modifiers and prefixes for FHIR search parameters

[Modifiers](https://www.hl7.org/fhir/search.html#modifiers) let you qualify search parameters with extra conditions. The following table shows FHIR modifiers and their support in the FHIR service.

| **Modifiers** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
|  `:missing`     | Yes                  | Yes                       | |
|  `:exact`       | Yes                  | Yes                       | |
|  `:contains`    | Yes                  | Yes                       | |
|  `:text`        | Yes                  | Yes                       | |
|  `:type` (reference) | Yes             | Yes                       | |
|  `:not`         | Yes                  | Yes                       | |
|  `:below` (uri) | Yes                  | Yes                       | |
|  `:above` (uri) | Yes                  | Yes                       | |
|  `:in` (token)  | No                   | No                        | |
|  `:below` (token) | No                 | No                        | |
|  `:above` (token) | No                 | No                        | |
|  `:not-in` (token) | No                | No                        | |
|  `:identifier` |No                     | No                        | |

For search parameters that have a specific order, such as numbers, dates, and quantities, use a [prefix](https://www.hl7.org/fhir/search.html#prefix) before the parameter value to refine the search criteria. For example, `Patient?_lastUpdated=gt2022-08-01` uses the prefix `gt` to mean greater-than. The FHIR service in Azure Health Data Services supports all prefixes defined in the FHIR standard.

[rhia](#fhir-search-result-parameters)

 ### FHIR search result parameters
FHIR specifies a set of search result parameters to help manage the information returned from a search. For details on how to use search result parameters in FHIR, refer to the [HL7](https://www.hl7.org/fhir/search.html#return) website. The following table shows FHIR search result parameters and their support in the FHIR service.

| **Search result parameters** | **FHIR service in Azure Health Data Services** | **Azure API for FHIR** | **Comment**|
| -------------------------  | -------------------- | ------------------------- | ------------|
| `_elements`                     | Yes                  | Yes                       | |
| `_count`                        | Yes                  | Yes                       | `_count` is limited to 1,000 resources. If you set it higher than 1,000, the service returns only 1,000 resources and includes a warning in the bundle. |
| `_include`                      | Yes                  | Yes                       | `_include` on PaaS and OSS on Azure Cosmos DB doesn't support `:iterate` [(#2137)](https://github.com/microsoft/fhir-server/issues/2137). |
| `_revinclude`                   | Yes                  | Yes                       | `_revinclude` on PaaS and OSS on Azure Cosmos DB doesn't support `:iterate` [(#2137)](https://github.com/microsoft/fhir-server/issues/2137). There's also an incorrect status code for a bad request: [#1319](https://github.com/microsoft/fhir-server/issues/1319). |
| `_summary`                      | Yes             | Yes                   | |
| `_total`                        | Partial              | Partial                   | `_total=none` and `_total=accurate` |
| `_sort`                         | Partial              | Partial                   | `sort=_lastUpdated` is supported on the FHIR service. For the FHIR service and the OSS SQL DB FHIR servers, sorting by strings and dateTime fields is supported. For Azure API for FHIR and OSS Azure Cosmos DB databases created after April 20, 2021, sort is supported on first name, last name, birthdate, and clinical date. |
| `_contained`                    | No                   | No                        | |
| `_containedType`                | No                   | No                        | |
| `_score`                        | No                   | No                        | |
| `_not-referenced`			      | Yes                  | No                        | `_not-referenced=*:*` to search for resources that other resources don't reference. For example, `/Patient?_not-referenced=*:*` is used to search for Patient resources that other resources don't reference. `/Patient?_not-referenced=Encounter:subject` is used to search for Patient resources that Encounter resources don't list as a subject. A list can also be used for multiple referenced fields, for example, `/Patient/$bulk-delete?_not-referenced=Encounter:subject&_not-referenced=DiagnosticReport:subject` is used to search for Patient resources that Encounter and DiagnosticReport resources don't reference. |

> [!NOTE]
1. By default, `_sort` arranges records in ascending order. You can also use the prefix `-` to sort in descending order. The FHIR service only allows you to sort on a single field at a time.
1. FHIR service supports wildcard searches with the `_revinclude` parameter. Adding a `.` query parameter in a `_revinclude` query directs the FHIR service to reference all the resources mapped to the source resource.

By default, the FHIR service in Azure Health Data Services is set to lenient handling. This setting means that the server ignores any unknown or unsupported parameters. If you want to use strict handling, include the `Prefer` header and set `handling=strict`.

#### _include and _revinclude searches

The FHIR service supports search queries that use the `_include` and `_revinclude` parameters. These parameters allow you to retrieve reference resources in the search results.  

The `_include` search parameter enables the retrieval of a particular FHIR resource, and any other FHIR resources that it references. When used in a query, the `_include` parameter returns the specified resource and resources *it references*. The `_revinclude` search parameter operates in the reverse, allowing the retrieval of a resource, along with any other resources that *reference it*, providing a way to search for resources based on their relationships with other resources. For detailed information on include and `_revinclude` in search parameters, refer to the [FHIR Search Documentation](https://www.hl7.org/fhir/R4/search.html#revinclude).

##### Request parameters

When you execute a search request with `_include` and `_revinclude` parameters, use the following optional parameters to control the count.

| **Name** | **Value** | **Description** |
| -------------------------  | -------------------- | ------------------------- |
| `_count` | Default value: 10 Max value: 1000 | The value represents the number of targeted resources to retrieve per request. |
| `_includesCount` | Default value: 1000 | The value represents the number of matched resources referenced by target resources to retrieve per request. |

The response from `_include` and `_revinclude` searches includes up to 1,000 items. If there are more than 1,000 matched items, the response provides a link that you can use to navigate the complete result set. 

In the following example, a search request for Observations is made for Patient with Identifier 123.

```rest
GET {{FHIR_URL}}/Observation?subject.identifier=123&_include=Observation:subject&_includesCount=10
```

The response has Observation data for Patient 123. The matched resources are provided 10 per page, with a link provided to navigate the complete result set.

```json
{ 

  	"resourceType": "Bundle", 

 	 "id": "b5491e39-8f8f-4405-a4cf-2a6716755d73", 

  	"meta": { 

    	"lastUpdated": "2025-04-10T21:09:42.6517693+00:00" 

  	}, 

  	"type": "searchset", 

  "	link": [ 

    	{ 

      	"relation": "next", 

      	"url": "{{FHIR_URL}}/Observation?subject.identifier=123&_include=Observation:subject&_includesCount=10&ct=er97f5lRTbShgbGOqaGhgbGlsZGFmaWJiYWBgYGpSSwAAAD%2F%2Fw%3D%3D" 

    	}, 

   	 { 

    	  "relation": "related", 

      	"url": "{{FHIR_URL}}/Observation/$include?subject.identifier=123&_include=Observation:subject&_includesCount=10&includesCt=er97f5lRTbShgbGOqaGhgbGlsZGFmaWJiYWBgYGhAaaYqYmOqQUWYaNYAAAAAP%2F%2F" 

   	 }, 

    	{ 

    	  "relation": "self", 

     	 "url": "{{FHIR_URL}}/Observation?subject.identifier=123&_include=Observation:subject&_includesCount=10” 

    	} 

  	], 

  "entry": [….] 

}
```


 ## Chained and reverse chained searching

A [chained search](https://www.hl7.org/fhir/search.html#chaining) lets you perform targeted queries for resources that reference another resource. For example, if you want to find encounters where the patient’s name is Jane, use:

`GET {{FHIR_URL}}/Encounter?subject:Patient.name=Jane`

The `.` in the preceding request directs the path of the chained search to the target parameter (`name` in this case). 

Similarly, you can do a reverse chained search with the `_has` parameter. This parameter retrieves resource instances by specifying criteria on other resources that reference the resources of interest. For examples of chained and reverse chained search, see the [FHIR search examples](search-samples.md) page. 

## Pagination

As previously mentioned, you can view the results from a FHIR search in paginated form at a link provided in the `searchset` bundle. By default, the FHIR service displays 10 search results per page, but you can change this number by setting the `_count` parameter. If there are more matches than fit on one page, the bundle includes a `next` link. Repeatedly fetching from the `next` link yields the subsequent pages of results. The `_count` parameter value can't exceed 1,000. 

Currently, the FHIR service in Azure Health Data Services only supports the `next` link and doesn't support `first`, `last`, or `previous` links in bundles returned from a search.

## FAQ

### What does "partial support" mean in [R4 Unsupported Search Parameters](https://github.com/microsoft/fhir-server/blob/main/src/Microsoft.Health.Fhir.Core/Data/R4/unsupported-search-parameters.json)?

Some resource-specific search parameters cover more than one data type, and the FHIR service in Azure Health Data Services might only support that search parameter on one of those data types. For example, Condition-abatement-age and Condition-onset-age cover two different data types, Age and Range. However, the FHIR service in Azure Health Data Services supports those two search parameters on Range, but not on Age.

### Is the $lastn operation for Observations supported?

This operation isn't supported. The alternative approach is to use `_count` to restrict resources returned per page and `_sort` to provide results in descending order.

## Next steps

To learn more about FHIR search, see the [search samples](search-samples.md) page. You can find details about how to search by using search parameters, modifiers, and other FHIR search methods.  

>[!div class="nextstepaction"]
>[FHIR search examples](search-samples.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]