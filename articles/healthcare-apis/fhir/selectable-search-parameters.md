---
title:  Overview of selectable search parameter functionality in Azure Health Data Services
description: This article describes an overview of selectable search parameter that is implemented in Azure Health Data Services
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 07/24/2023
ms.author: kesheth
---


# Selectable search parameter capability 
Searching for resources is fundamental to FHIR. Each resource in FHIR carries information as a set of elements, and search parameters work to query the information in these elements. As the FHIR service in Azure health data services is provisioned, inbuilt search parameters are enabled by default. During the ingestion of data in the FHIR service, specific properties from FHIR resources are extracted and indexed with these search parameters. This is done to perform efficient searches. 

The selectable search parameter functionality allows you to enable or disable inbuilt search parameters.  This functionality helps you to store more resources in allocated storage space and have performance improvements, by enabling only needed search parameters.

> [!IMPORTANT]
> selectable search capability is currently in preview. 
> Preview APIs and SDKs are provided without a service-level agreement. We recommend that you don't use them for production workloads. Some features might not be supported, or they might have constrained capabilities.
> For more information, review [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides a guide to using selectable search parameter functionality. 

## Guide on using selectable search parameter 

To perform status updates on search parameter(s), you need to follow the steps:\
Step 1: Get status of search parameter(s)\
Step 2: Update status of search parameter(s)\
Step 3: Execute a reindex job

Throughout this article, we demonstrate FHIR search syntax in example API calls with the {{FHIR_URL}} placeholder to represent the FHIR server URL. 

### Step 1: Get status of search parameter(s)
An API endpoint (‘$status’) is provided to view the status of search parameters.

There are four different statuses that are seen in the response: 
* **Supported**: This status indicates that the search parameter is supported by the FHIR service, and the user has submitted requests to enable the search parameter. Note: Reindex operation needs to be executed to run from supported to enabled.
* **Enabled**: This status indicates that the search parameter is enabled for searching. This is the next step after the supported status. 
* **PendingDisable**: This status indicates that search parameter will be disabled after execution of the reindex operation. 
* **Disabled**: This status indicates that the search parameter is disabled. 


To get the status across all search parameters, use the following request
```rest
GET {{FHIR_URL}}/SearchParameter/$status
```

This returns a list of all the search parameters with their individual statuses. You can scroll through the list to find the search parameter you need.

To identify status of individual or subset of search parameters you can use the filters listed.
* **Name**: To identify search parameter status by name use request,
```rest
   GET {{FHIR_URL}}/SearchParameter/$status?code=<name of search parameter/ sub string>
```
* **URL**: To identify search parameter status by its canonical identifier use request,
```rest
GET {{FHIR_URL}}/SearchParameter/$status?url=<SearchParameter url>
```
* **Resource type**: In FHIR, search parameters are enabled at individual resource level to enable filtering and retrieving specific subset of resources. To identify status of all the search parameters mapped to resource, use request.
```rest
GET {{FHIR_URL}}/SearchParameter/$status?resourcetype=<ResourceType name>
```

In response to the GET request to $status endpoint, you'll see Parameters resource type returned with the status of the search parameter. See the example response:
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
Now that you're aware on how to get the status of search parameters, lets move to the next step to understand on updating the status of search parameters to 'Supported' or 'Disabled'.

### Step 2: Update status of search parameter(s)
Note: To update the status of search parameters you need to have Azure RBAC role assigned: Search Parameter Manager.

Search Parameter Status can be updated for single search parameter or in bulk.
#### 1. Update Single search parameter status.
To update the status of single search parameter, use the API request. 

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

Depending on your use case, you can choose to keep the status state value to either ‘Supported’ or ’Disabled’ for a search parameter.
Note when sending state 'Disabled' in the request, the response returns in the response as 'PendingDisable', since a reindex job needs to be run to fully remove associations.

If you receive a 400 HTTP status code in the response, it means there is no unique match for identified search Parameter. Check the search parameter ID. 

#### 2. Update search parameter status in bulk
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

After you have updated the search parameter status to 'Supported' or 'Disabled', the next step is to execute reindex job. 

### Step 3: Execute a reindex job. 
Until the search parameter is indexed, the 'Enabled' and 'Disabled' status of the search parameters aren't activated. Reindex job execution helps to update the status from 'Supported' to 'Enabled' or 'PendingDisable' to 'Disabled'.
Reindex job can be executed against entire FHIR service database or against specific search parameters. Reindex job can be performance intensive. [Read guide](how-to-run-a-reindex.md) on reindex job execution in FHIR service.

Note: A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server. Capability statement is available with /metadata endpoint. 'Enabled' search parameters are listed in capability statement of your FHIR service

## Next steps

In this article, you've learned how to update status of built-in search parameters in your FHIR service. To learn how to define custom search parameters, see 

>[!div class="nextstepaction"]
>[Defining custom search parameters](how-to-do-custom-search.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

