<properties
	pageTitle="Azure Search Management REST API Version 2015-02-28 | Microsoft Azure | Hosted cloud search service"
	description="Azure Search Management REST API: Version 2015-02-28"
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="paulettm"
	editor=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.date="05/17/2016"
	ms.author="heidist" />

# Management API: Version 2015-02-28

Azure Search is a hosted cloud search service on Microsoft Azure. This document describes the **2015-02-28* version of the Azure Search Management REST API. It has since been replaced by newer versions. For the latest, see [Azure Search Management REST API 2015-08-19](https://msdn.microsoft.com/library/dn832684.aspx) on MSDN.

##Service management operations

The Azure Search Service Management REST API provides programmatic access to much of the functionality available through the portal, allowing administrators to automate the following operations:

- Create or delete an Azure Search service.
- Create, regenerate, or retrieve `api-keys` to automate routine changes to the administrative keys used for authenticating search data operations. 
- Adjust the scale of an Azure Search service in response to changes in query volume or storage requirements.

To fully administer your service programmatically, you will need two APIs: The Management REST API of Azure Search, plus the common [Azure Resource Manager REST API](https://msdn.microsoft.com/library/azure/dn790568.aspx). The Resource Manager API is used for general purpose operations that are not service specific, such as querying subscription data, listing geo-locations, and so forth. To create and manage Azure Search services in your subscription, make sure your HTTP request includes the Resource Manager endpoint, subscription ID, provider (in this case, Azure Search), and the Search service-specific operation.

[Get started with Azure Search Management REST API](http://go.microsoft.com/fwlink/p/?linkID=516968) is a walkthrough of sample code that demonstrates application configuration and service management operations. The sample application issues requests to the Azure Resource Manager API as well as the service management API for Azure Search, giving you an idea of how to piece together a cohesive application that draws on both APIs.

### Endpoint ###

The endpoint for service administration operations is the URL of Azure Resource Manager, `https://management.azure.com`. 

Note that all management API calls must include the subscription ID and an API version.

### Versions ###

The current version of the Azure Search Management REST API is `api-version=2015-02-28`. The previous version, `api-version=2014-07-31-Preview` is deprecated. Although it will continue to work for the next several months, we encourage you to transition to the new version as soon as possible.

### Authentication and Access Control###

The Azure Search Management REST API is an extension of the Azure Resource Manager and shares its dependencies. As such, Active Directory is a prerequisite to service administration of Azure Search. All administrative requests from client code must be authenticated using Azure Active Directory before the request reaches the resource manager.

Note that if your application code handles *service management operations* as well as *data operations* on indexes or documents, you'll be using two authentication approaches for each of the Azure Search APIs:

- Service and key administration, due to the dependency on Resource Manager, relies on Active Directory for authentication.
- Data requests against the Azure Search service endpoint, such as Create Index or Search Documents, use an `api-key` in the request header. See [Azure Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) for information about authenticating a data request.

The sample application documented in [Get started with Azure Search Management REST API](http://go.microsoft.com/fwlink/p/?linkID=516968) demonstrates the authentication techniques for each type of operation. Instructions for configuring a client application to use Active Directory are included in the getting started. 

Access control for Azure Resource Manager uses the built-in Owner, Contributor, and Reader roles. By default, all service administrators are members of the Owner role. For details, see [Role-based access control in the Azure Classic Portal](../active-directory/role-based-access-control-configure.md).


### Summary of APIs ##

Operations include the following APIs.

- <a name="CreateService">Create Search Service</a>

    `PUT	https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28`

- <a name="GetService">Get Search Service</a>

    `GET https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28`

- <a name="ListService">List Search Services</a>

    `GET https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices?api-version=2015-02-28`

- <a name="DeleteService">Delete Search Service</a>

    `DELETE https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28`

- <a name="UpdateService">Update Search Service</a>

    `PATCH https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28`

- <a name="ListAdminKey">List Admin Keys</a>

    `POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/listAdminKeys?api-version=2015-02-28`

- <a name="RegenAdminKey">Regenerate Admin Key</a>

    `POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/regenerateAdminKey/[keyKind]?api-version=2015-02-28`

- <a name="CreateQueryKey">Create Query Key</a>

    `POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/createQueryKey/[name]?api-version=2015-02-28`

- <a name="ListQueryKey">List Query Keys</a>

    `GET	https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/listQueryKeys?api-version=2015-02-28`

- <a name="DeleteQueryKey">Delete Query Keys</a>

    `DELETE https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/deleteQueryKey/[key]?api-version=2015-02-28`

<a name="ServiceOps"></a>
##Service Operations

You can provision or deprovision Azure Search services by issuing HTTP requests against your Azure subscription. Scenarios enabled through these operations include creating custom administration tools or standing up an end-to-end production or development environment (from service creation, all the way to populating an index). Likewise, solution vendors who design and sell cloud solutions might want an automated, repeatable approach for provisioning services for each new customer.

**Operations on a service**

Service-related options include the following APIs: 

- <a name="CreateService">Create Search Service</a>
- <a name="GetService">Get Search Service</a>
- <a name="ListService">List Search Services</a>
- <a name="DeleteService">Delete Search Service</a>
- <a name="UpdateService">Update Search Service</a>


<a name="CreateService"></a>
###Create Search Service

The **Create Search Service** operation provisions a new Search service with the specified parameters. This API can also be used to update an existing service definition.

    PUT	https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28

#### Request URI Parameters

`subscriptionId`: Required. The `subscriptionID` for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`: Required. The name of the search service within the specified resource group. Service names must only contain lowercase letters, digits or dashes, cannot use dash as the first two or last one characters, cannot contain consecutive dashes, and must be between 2 and 15 characters in length. Since all names end up being <name>.search.windows.net, service names must be globally unique. No two services either within or across subscriptions and resource groups can have the same name. You cannot change the service name after it is created.

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.


#### Request Headers

`Content-Type`: Required. Set this header to application/json.  

`x-ms-client-request-id`:  Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.  


#### Request Body

{ 
      "location": "location of search service", 
      "tags": { 
        "key": "value",
        ...
      }, 
	"properties": { 
		"sku": { 
            "name": "free | standard | standard2" 
		}, 
        "replicaCount": 1 | 2 | 3 | 4 | 5 | 6, 
        "partitionCount": 1 | 2 | 3 | 4 | 6 | 12 
	} 
} 

#### Request Body Parameters#

`location`: Required. One of the supported and registered Azure Geo Regions (for example, West US, East US, Southeast Asia, and so on). Note that the location of a resource cannot be changed once it is created.

`tags`: Optional. A list of key value pairs that describe the resource. These tags can be used in viewing and grouping a resource across resource groups. A maximum of 10 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters.   

`sku`: Required. Valid values are `free` and `standard`. `standard2` is also valid, but can only be used when it's enabled for your Azure subscription by Microsoft support. `free` provisions the service in shared clusters. `standard` provisions the service in dedicated clusters. You can only create one Search service at the free pricing tier. Additional services must be created at the standard pricing tier. By default, a service is created with one partition and one replica. Additional partitions and replicas are priced in terms of search units. See [Limits and constraints](search-limits-quotas-capacity.md) for details. You cannot change the `sku` once the service is created.

`replicaCount`: Optional. Default is 1. Valid values include 1 through 6. Valid only when `sku` is `standard`. 

`partitionCount`: Optional. Default is 1. Valid values include 1, 2, 3, 4, 6, or 12. Valid only when `sku` is `standard`. 


### Response

HTTP 200 (OK) is returned when a service definition is updated. HTTP 201 (Created) is returned when a new service is created. 


#### Response Headers

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service.  


#### Response Body 

For HTTP 200 and 201, the response body contains the service definition. 
    
    { 
      "id": "/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]", 
    
      "name": "service name", 
      "location": "location of search service", 
    "type": " Microsoft.Search/searchServices", 
      "tags": {
        "key": "value",
        ...
      },  
    "properties": { 
    	"sku": { 
          "name": "free | standard | standard2" 
       		 }, 
        "replicaCount": 1 | 2 | 3 | 4 | 5 | 6, 
        "partitionCount": 1 | 2 | 3 | 4 | 6 | 12, 
        "status": "running | provisioning | deleting | degraded | disabled | error", 
        "statusDetails": "details of the status", 
        "provisioningState": "succeeded | provisioning | failed" 
      } 
    } 


#### Response Body Elements

`id`: The id is the URL (excluding the hostname/scheme) for this Search service.

`name`: The name of the search service.  

`location`: One of the supported and registered Azure Geo Regions (for example, West US, East US, Southeast Asia, and so forth).

`tags`: A list of key-value pairs that describe the resource, used in viewing and grouping resources across resource groups.  

`sku`: Indicates the pricing tier. Valid values include:

- `free`: shared cluster
- `standard`: dedicated cluster
- `standard2`: use only under the guidance of Microsoft support. 

`replicaCount`: Indicates how many replicas the service has. Valid values include 1 through 6. 

`partitionCount`: Indicates how many partitions the service has. Valid values include 1, 2, 3, 4, 6, or 12. 

`status`: The status of the Search service at the time the operation was called. Valid values include:

- `running`: the Search service is created.
- `provisioning`: the Search service is being provisioned.
- `deleting`: the Search service is being deleted.
- `degraded`: the Search service is degraded. This can occur when the cluster has encountered an error that may or may not prevent the service from working correctly.
- `disabled`: the Search is disabled. In this state, the service will reject all API requests.
- `error`: the Search service is in error state. 

**Note**: If your service is in the `degraded`, `disabled`, or `error` state, it means the Azure Search team is actively investigating the underlying issue. Dedicated services in these states are still chargeable based on the number of search units provisioned.

`statusDetails`: The details of status. 

`provisioningState`: Indicates the current state of the service provisioning. Valid values include:

- `succeeded`: the provision is done successfully.
- `provisioning`: the service is being provisioned.
- `failed`: the service is failed to be provisioned. 

Provisioning is an intermediate state that occurs while service capacity is being established. After capacity is set up, `provisioningState` changes to either "succeeded" or "failed". Client applications can poll provisioning status (recommended polling interval is 30 seconds, up to a minute) by using the **Get Search Service** operation to see when an operation is completed. If you are using the free service, this value tends to come back as "succeeded" directly in the call to create service. This is because the free service uses capacity that is already set up.

<a name="GetService"></a>
### Get Search Service

The **Get Search Service** operation returns the properties for the specified Search service. Note that admin keys are not returned. Use the **Get Admin Keys** operation to retrieve admin keys.

    GET https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28

#### Request URI

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`:	Required. The name of the Search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

#### Request Headers

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.  


#### Request Body

None.


#### Response Status Code

HTTP 200 (OK) if successful. 


#### Response Headers

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

#### Response Body

    {
      "id": "/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]",
    
      "name": "service name",
      "location": "location of search service",
    "type": " Microsoft.Search/searchServices",
      "tags": {
        "key": "value",
        ... 
      }, 
    "properties": {
    	"sku": {
          "name": "free | standard | standard2"
    	},
        "replicaCount": 1 | 2 | 3 | 4 | 5 | 6,
        "partitionCount": 1 | 2 | 3 | 4 | 6 | 12,
        "status": "running | provisioning | deleting | degraded | disabled | error",
        "statusDetails": "details of the status",
        "provisioningState": "succeeded | provisioning | failed"
      }
    }

#### Response Body Elements

`id`:	The id is the URL (excluding the hostname/scheme) for this Search service.

`name`:	The name of the Search service. 

`location`:	The location of the resource. This will be one of the supported and registered Azure Geo Regions (for example, West US, East US, Southeast Asia, and so forth). 

`tags`:	Tags are a list of key value pairs that describe the resource. These tags can be used in viewing and grouping a resource across resource groups. 

`sku`: Indicates the pricing tier. Valid values include:

- `free`: shared cluster
- `standard`: dedicated cluster
- `standard2`: use only under the guidance of Microsoft support.

`replicaCount`:	Indicates how many replicas the service has. Valid values are 1 through 6.

`partitionCount`: Indicates how many partitions the service has. Valid values include 1, 2, 3, 4, 6, or 12.

`status`:	The status of the Search service at the time the operation was called. Valid values include:

- `running`: the Search service is created.
- `provisioning`: the Search service is being provisioned.
- `deleting`: the Search service is being deleted.
- `degraded`: the Search service is degraded. This can occur when the cluster has encountered an error that may or may not prevent the service from working correctly.
- `disabled`: the Search is disabled. In this state, the service will reject all API requests.
- `error`: the Search service is in error state. 
 
**Note**: If your service is in the `degraded`, `disabled`, or `error` state, it means the Azure Search team is actively investigating the underlying issue. Dedicated services in these states are still chargeable based on the number of search units provisioned.
 
`statusDetails`: The details of status.

`provisioningState`: Valid values include. 

- `succeeded`: provisioning was successful.
- `provisioning`: the service is being provisioned.
- `failed`: provisioning failed.


<a name="ListService"></a>
### List Search Services

The **List Services** operation returns a list of all Search services in the subscription of a specific resource group. This operation returns service definitions, minus the admin api-keys. Use the **Get Admin Keys** operation to retrieve admin keys.

    GET https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices?api-version=2015-02-28
    
#### Request URI Parameters

`subscriptionId`: Required. The `subscriptionID` for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

#### Request Headers

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

####Request Body

None.

####Response

Status Code is HTTP 200 (OK) if successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 


####Response Body 

The response body is a list of services, returned as a JSON array, where each service follows the format in **Get Search Service** operation.  

Note that the `nextLink` field is always null because the current version doesn’t support paging. Returning it with an empty value is done to preserve future compatibility. 

    {
      "value": [
     	{
          "id": "id of service 1",
          "name": "service name",
          "location": "location of search service 1",
    	"type": " Microsoft.Search/searchServices",
          "tags": {
            "key": "value",
            ...
          }, 
    	"properties": {
            "sku": {
              "name": "free | standard | standard2"
            },
            "replicaCount": 1 | 2 | 3 | 4 | 5 | 6,
            "partitionCount": 1 | 2 | 3 | 4 | 6 | 12,
            "status": "running | provisioning | deleting | degraded | disabled | error",
            "statusDetails": "details of the status",
            "provisioningState": "succeeded | provisioning | failed"
    	}
      },   
      {
          "id": "id of service 2",
          "name": "service name 2",
          "location": "location of search service 2",
   	 	"type": " Microsoft.Search/searchServices",
          "tags": {
            "key": "value",
            ...
          },
    	"properties": {
            "sku": { 
              "name": "free | standard | standard2"
            },
            "replicaCount": 1 | 2 | 3 | 4 | 5 | 6,
            "partitionCount": 1 | 2 | 3 | 4 | 6 | 12,
            "status": "running | provisioning | deleting | degraded | disabled | error",
            "statusDetails": "details of the status",
            "provisioningState": "succeeded | provisioning | failed"
    	}
      }
    ],
    "nextLink": null
    }


<a name="DeleteService"></a>
### Delete service

The **Delete Service** operation deletes the Search service and search data, including all indexes and documents.
    
    DELETE https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28

**Note:** Administrators and developers are accustomed to backing up application data before deleting it from a production server. In Azure Search, there is no backup operation. If you are using the index as primary storage for your application, you will need to use a Search operation to return all of the data in the index, which you can store externally.

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`:	Required. The name of the search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

###Request Headers###

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

For HTTP 200, the response body will be empty. HTTP 200 (OK) is the correct response if the resource does not exist. 

You can use **Get Search Service API** to poll the status of the deleting service. We recommend polling intervals of 30 seconds to a minute.

###Response Headers###

`x-ms-request-id`: 	A unique identifier for the current operation generated by the service.

###Response Body###

None.

<a name="UpdateService"></a>
### Update Service ##

The **Update Service** operation changes Search service configuration. Valid changes include changing the tags, partition, or replica count, which adds or removes search units to your service as a billable event. If you try to decrease partitions below the amount needed to store the existing search corpus, an error will occur, blocking the operation. Changes to service topology can take a while. It takes time to relocate data, as well as setting up or tearing down clusters in the data center.

Note that you cannot change the name, location, and sku. Changing any of these properties will require that you create a new service. 

    PATCH https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28

Alternatively, you can use PUT.

    PUT https://management.azure.com/subscriptions/[subscriptionId]/resourcegroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]?api-version=2015-02-28

> [AZURE.NOTE] If you use a PUT to update the service, you must use the same request body used in  a [Create Service](#CreateService) request.

###Request URI Parameters###

`subscriptionId`: Required. The `subscriptionID` for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`:	Required. The name of the search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

###Request Headers###

`Content-Type`:	Required. Set this header to application/json.

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

    {
      "tags": {
        "key": "value",
        ...
      }, 
    	"properties": {
        "replicaCount": 1 | 2 | 3 | 4 | 5 | 6,
        "partitionCount": 1 | 2 | 3 | 4 | 6 | 12
     	}
    }

###Request Body Parameters###

`tags`:	Optional. A list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 10 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters.

`replicaCount`: Optional. Default is 1. Valid values include 1 through 6. Valid only when `sku` is `standard`. 

`partitionCount`: Optional. Default is 1. Valid values include 1, 2, 3, 4, 6, or 12. Valid only when `sku` is `standard`. 

###Response###

HTTP 200 (OK) is returned if the operation is successful. You can use **Get Search Service API** to poll the status of the updating service. We recommend polling intervals of 30 seconds to a minute.


### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

### Response Body ###

The response body contains the updated service definition. For an example, see **Get Search Service API**.


<a name="KeyOps"></a>
## Key Operations

Authentication to an Azure Search service requires two pieces of information: a search service URL and an api-key. The api-keys are generated when the service is created, and can be regenerated on demand after the service is provisioned. There are two types of api-key.

- admin key: Grants access to all operations (maximum of 2 per service)
- query key: Authenticates query requests only (maximum of 50 per service)

The ability to programmatically manage the admin and query keys of your Azure Search service gives you the means for building custom tools, rolling over keys periodically as a routine security best practice, rolling over keys when an employee leaves the company, or generating and acquiring keys during service provisioning when a scripted or programmatic approach is used to deploy the solution. 

Query keys can be acquired, created, and deleted. Admin key operations are restricted to acquiring and regenerating existing key values. Deleting an admin key could lock you out of the service permanently, so that the operation is not available. 

Keys are strings composed of a random combination of numbers and upper-case letters. An api-key can only be used with the service for which it was created and could change on a regular basis (if you adopt a key rollover strategy as a security best practice). 

Be sure to treat api-keys, especially the admin keys, as sensitive data. Anyone who acquires your admin key has the ability to delete or read data from your indexes.

**Operations on keys**

Key-related operations include the following APIs:

- <a name="ListAdminKey">List Admin Keys</a>
- <a name="RegenAdminKey">Regenerate Admin Key</a>
- <a name="CreateQueryKey">Create Query Key</a>
- <a name="ListQueryKey">List Query Keys</a>
- <a name="DeleteQueryKey">Delete Query Keys</a>


<a name="ListAdminKey"></a>
## List Admin Keys ##

The **List Admin Keys** operation returns the primary and secondary admin keys for the specified search service. The POST method is used because this action returns read-write keys.

    POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/listAdminKeys?api-version=2015-02-28

Admin keys are created with the service. There are always two keys, primary and secondary. You can regenerate these keys, but you cannot delete them. 

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`:	Required. The name of the search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

`listAdminKeys`: Required. This action retrieves the primary and secondary admin keys for the Search service.

###Request Headers###

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

HTTP 200 (OK) is returned if the operation is successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

###Response Body###

    {
      "primaryKey": "api key",
      "secondaryKey": "api key"
    }
    

<a name="RegenAdminKey"></a>
## Regenerate Admin Keys ##

The **Regenerate Admin Keys** operation deletes and regenerates either the primary or secondary key. You can only regenerate one key at a time. When regenerating keys, consider how you will maintain access to the service. A secondary key exists so that you have a key available when rolling over the primary key. Every service always has both keys. You can regenerate keys, but you cannot delete them or run a service without them.
 
    POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/regenerateAdminKey/[keyKind]?api-version=2015-02-28

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`: Required. The name of the search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.
	
`regenerateKey`: Required. This action specifies that the primary or secondary admin key will be regenerated. 

`keyKind`: Required. Specifies which key to regenerate. Valid values include:

- `primary`
- `secondary`

###Request Headers###

`Content-Type`:	Required. Set this header to application/json.

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

HTTP 200 (OK) is returned if the operation is successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

###Response Body###

    {
      "primaryKey": "api key",
      "secondaryKey": "api key"
    }
    
###Response Body Elements###

`primaryKey`:	The primary admin key, if it was regenerated.

`secondaryKey`:	The secondary admin key, if it was regenerated.



<a name="CreateQueryKey"></a>
## Create Query Key ##

The **Create Query Key** operation generates a new query key for the Search service. You can create up to 50 query keys per service.

    POST https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/createQueryKey/[name]?api-version=2015-02-28

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`: Required. The name of the Search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

`createQueryKey`: Required. This action creates a query key for the search service.

`name`: Required. The name of new key.

###Request Headers###

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

Response Status Code is HTTP 200 (OK) if the operation is successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

###Response Body###

    {
      "name": "name of key",
      "key": "api key"
    }


###Response Body Elements###

`name`:	The name of the query key.

`key`:	The value of the query key.

<a name="ListQueryKey"></a>
## List Query Keys ##


The **List Query Keys** operation returns the query keys for the specified Search service. Query keys are used to send query API (read-only) calls to a Search service. There can be up to 50 query keys per service. 

    GET	https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/listQueryKeys?api-version=2015-02-28

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`: Required. The name of the search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.
	
`listQueryKeys`: Required. This action retrieves the query keys for the Search service.

###Request Headers###

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

Response Status Code is HTTP 200 (OK) is returned if the operation is successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

###Response Body###

    {
      "value": [
    	{
          "name": "name of key 1",
          "key": "key 1"
      	},   
      	{   
          "name": "name of key 2",
          "key": "key 2"
      	}
      ],
    "nextLink": null
    }

###Response Body Elements###

`name`:	The name of the query key.

`key`:	The value of the query key.


<a name="DeleteQueryKey"></a>
## Delete Query Keys ##

The **Delete Query Key** operation deletes the specified query key. Query keys are optional and used for read-only queries.

    DELETE https://management.azure.com/subscriptions/[subscriptionId]/resourceGroups/[resourceGroupName]/providers/Microsoft.Search/searchServices/[serviceName]/deleteQueryKey/[key]?api-version=2015-02-28

Contrasted with admin keys, query keys are not regenerated. The process for regenerating a query key is to delete and then recreate it.  

###Request URI Parameters###

`subscriptionId`: Required. The subscriptionID for the Azure user. You can obtain this value from the Azure Resource Manager API or the portal.

`resourceGroupName`: Required. The name of the resource group within the user’s subscription. You can obtain this value from the Azure Resource Manager API or the portal.

`serviceName`: Required. The name of the Search service within the specified resource group. If you don't know the service name, you can obtain a list using List Search Services (Azure Search API). 

`api-version`: Required. Specifies the version of the protocol used for this request. The current version is `2015-02-28`.

`deleteQueryKey`: Required. This action deletes an existing query key for the Search service.

`key`: Required. The key to be deleted.

###Request Headers###

`x-ms-client-request-id`: Optional. A client-generated GUID value that identifies this request. If specified, this will be included in response information as a way to map the request.

###Request Body###

None.

###Response###

Response Status Code is HTTP 200 (OK) if successful. 

### Response Headers ###

`Content-Type`:	This header is always set to application/json.

`x-ms-request-id`: A unique identifier for the current operation generated by the service. 

###Response Body###

None.


