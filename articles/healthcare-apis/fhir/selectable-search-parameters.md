---
title:  Selectable search parameters for the FHIR service in Azure Health Data Services
description: Learn how to use selectable search parameters in the FHIR service of Azure Health Data Services to customize and optimize your searches on FHIR resources. Save storage space and improve performance by enabling only the search parameters you need.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 01/24/2023
ms.author: kesheth
---

# Selectable search parameters

Searching for resources is fundamental to the FHIR&reg; service. Each resource in the FHIR service carries information as a set of elements. Search parameters work to query the information in these elements. When the FHIR service is deployed, [inbuilt search parameters](https://www.hl7.org/fhir/searchparameter-registry.html) are enabled by default. The FHIR service performs efficient searches by extracting and indexing specific properties from FHIR resources during the ingestion of data. 

Selectable search parameters allow you to enable or disable inbuilt search parameters. This capability helps you store more resources in allocated storage space and improve performance by enabling only the search parameters you need.

To perform status updates on search parameters, follow these steps:

1. [Get the status of search parameters](#get-the-status-of-search-parameters).
1. [Update the status of search parameters](#update-the-status-of-search-parameters).
1. [Execute a reindex job](#execute-a-reindex-job).

In this article, we demonstrate FHIR search syntax in example API calls with the {{FHIR_URL}} placeholder to represent the FHIR server URL. 

## Get the status of search parameters
An API endpoint (‘$status’) is provided to view the status of search parameters. There are four statuses for the response: 

| Status | Description |
| --- | --- |
| Supported | The search parameter is supported by the FHIR service, and you submitted requests to enable the search parameter. Execute the reindex operation to run from supported to enabled. |
| Enabled | The search parameter is enabled for searching. This status is the next step after the supported status. |
| PendingDisable | Disabling the search parameter is pending after execution of the reindex operation. |
| Disabled | The search parameter is disabled. |

To get the status across all search parameters, use the following request, which returns a list of all the search parameters and their status. Scroll through the list to find the search parameter you need.

```rest
GET {{FHIR_URL}}/SearchParameter/$status
```

To identify the status of individual or a subset of search parameters, use the following filters.

* **Name**. To identify search parameter status by name, use this request.
```rest
   GET {{FHIR_URL}}/SearchParameter/$status?code=<name of search parameter/ sub string>
```

* **URL**. To identify search parameter status by its canonical identifier, use this request.

```rest
GET {{FHIR_URL}}/SearchParameter/$status?url=<SearchParameter url>
```

* **Resource type**. In FHIR, search parameters are enabled at the individual resource level to allow filtering and retrieving of a specific subset of resources. To identify the status of all the search parameters mapped to a resource, use this request.

```rest
GET {{FHIR_URL}}/SearchParameter/$status?resourcetype=<ResourceType name>
```

In response to the GET request to $status endpoint, the parameters resource type is returned with the status of the search parameter. Here's an example response.

```rest
{
  "resourceType" : "Parameters",
  "parameter" : [
    "name" : "searchParameterStatus",
    "part" : {
        {
        "name" : "url",
        "valueString" : "http://hl7.org/fhir/SearchParameter/Account-identifier"
        },
        {
        "name" : "status",
        "valueString" : "supported"
        }
    }
  ]
}
```

## Update the status of search parameters

After you get the status of search parameters, update the status of search parameters to `Supported` or `Disabled`.

> [!NOTE]
> To update the status of search parameters, you need the **Search Parameter Manager** Azure RBAC role.

Search parameter status can be updated for a single search parameter or in bulk.

#### Update a single search parameter status

To update the status of a single search parameter, use the following API request.

```rest
PUT {{FHIR_URL}}/SearchParameter/$status
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "searchParameterStatus",
            "part": [
                {
                    "name": "url",
                    "valueUrl": "http://hl7.org/fhir/SearchParameter/Resource-test-id"
                },
                {
                    "name": "status",
                    "valueString": "Supported"
                }
            ]
        }
    ]
}
```

Depending on your use case, you can keep the status state value either ‘Supported’ or ’Disabled’ for a search parameter. When you send the state `Disabled` in the request, the response returns as `PendingDisable` because a reindex job must run to fully remove associations.

If you receive a 400 HTTP status code in the response, it means there's no unique match for the identified search Parameter. Check the search parameter ID. 

#### Update search parameter status in bulk
To update the status of search parameters in bulk, the ‘PUT’ request should have the ‘Parameters’ resource list in the request body. The list needs to contain the individual search parameters that need to be updated. 

```rest
PUT {{FHIR_URL}}/SearchParameter/$status
{
  "resourceType" : "Parameters",
  "parameter" : [
    {
     "name" : "searchParameterStatus",
     "part" :{
        "name" : "url",
        "valueString" : "http://hl7.org/fhir/SearchParameter/Endpoint-name"
     },
     "part":{ 
        "name" : "status",
        "valueString" : "supported"
     }
    },
         "name" : "searchParameterStatus",
     "part" :{
        "name" : "url",
        "valueString" : "http://hl7.org/fhir/SearchParameter/HealthcareService-name"
     },
     "part":{ 
        "name" : "status",
        "valueString" : "supported"
     }
    },
    ...
  ]
}
```

## Execute a reindex job

After you update the search parameter status to `Supported` or `Disabled`, the next step is to execute a reindex job. 

Until the search parameter is indexed, the `Enabled` and `Disabled` status of the search parameters aren't activated. Reindex job execution updates the status from `Supported` to `Enabled` or `PendingDisable` to `Disabled`.

A reindex job can be executed against the entire FHIR service database or against specific search parameters. A reindex job can be performance intensive. For more information, see [Run a reindex job](how-to-run-a-reindex.md).

> [!NOTE]
> A capability statement document is a set of behaviors for a FHIR server. `Enabled` search parameters are listed in the capability statement for your FHIR service. A capability statement is available for the /metadata endpoint.

## Frequently Asked Questions

**What is the behavior if the query includes a search parameter with status 'Supported'?**

The search parameter in the 'Supported' state needs to be reindexed. Until then, the search parameter isn't activated. If a query is executed on a non-active search parameter, the FHIR service renders a response without considering that search parameter. In the response, there will be a warning message indicating that the search parameter wasn't indexed and not used in the query. To render an error in such situations, use the 'Prefer: handling' header with the value 'strict'. By setting this header, warnings are reported as errors.

## Next steps

[Define custom search parameters](how-to-do-custom-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
