---
title: Create a Docker image for Model Management in Azure Machine Learning | Microsoft Docs
description: This document describes the steps for creating a Docker image for your web service.
services: machine-learning
author: chhavib    
ms.author: chhavib
manager: neerajkh
editor: jasonwhowell
ms.service: machine-learning
ms.workload: data-services
ms.devlang: na
ms.topic: article
ms.date: 09/20/2017
---
# Azure Machine Learning Model Management Account API reference

For deployment environment set up information, see [Model Management Account Setup](model-management-configuration.md).

The Azure Machine Learning Model Management API implements the following operations:

- Model Registration
- Manifest Creation
- Docker Image Creation
- Web service Creation

You can use this image to create a web service either locally or on a remote ACS cluster or another Docker supported environment of your choice.

## Prerequisites
Make sure you have gone through the installation steps in the [Installation quickstart](quickstart-installation.md) document.

The following are required before you proceed:
1. Model Management Account provisioning
2. Environment creation for deploying and managing models
3. A machine learning model

### AAD token
When using the CLI, log in using `az login`. The CLI uses your AAD token from the .azure file. If you wish to use the APIs, you have the following options:

##### Acquiring the AAD token manually
You can do `az login` and get the latest token from the .azure file on your home directory.

##### Acquiring the AAD token programmatically
```
az ad sp create-for-rbac --scopes /subscriptions/<SubscriptionId>/resourcegroups/<ResourceGroupName> --role Contributor --years <length of time> --name <MyservicePrincipalContributor>
```
Once you create service principal, save the output. Now you can use that to get token from AAD:

```cs
 private static async Task<string> AcquireTokenAsync(string clientId, string password, string authority, string resource)
{
        var creds = new ClientCredential(clientId, password);
        var context = new AuthenticationContext(authority);
        var token = await context.AcquireTokenAsync(resource, creds).ConfigureAwait(false);
        return token.AccessToken;
}
```
The token is put in authorization header for API calls. See below for more details.


## Register Model

Model registration step registers your machine learning model with the Azure Model Management Account that you created. This registration enables tracking the models and their versions that are assigned at the time of registration. The user provides the name of the model. Subsequent registration of models under the same name generates a new version and id.

### Request

| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models 
 |
### Description
Register a Model

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| model | body | The payload that is used to register a Model | Yes | [Model](#model) |


### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Ok. The Model registration succeeded | [Model](#model) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Query the list of Models in an account
### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models 
 |
### Description
Query the list of Models in an account. The result list can be filtered using tag and name. If no filter is passed, the query lists all the Models in the given account. The returned list is paginated and the count of item in each page is an optional parameter

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| name | query | The object name | No | string |
| tag | query | The Model tag | No | string |
| count | query | The number of items to retrieve in a page | No | string |
| $skipToken | The continuation token to retrieve the naxt page | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success | [PaginatedModelList](#paginatedmodellist) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Get Model Details
### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models/{id}  
 |

### Description
Get Model by id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The object id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success | [Model](#model) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Register a Manifest with the registered model and all dependencies

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests | 

### Description
Register a manifest with the registered model and all its dependencies

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| manifestRequest | body | The payload that is used to register a Manifest | Yes | [Manifest](#manifest) |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | The Manifest registration was successful | [Manifest](#manifest) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Query the list of Manifests in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests | 

### Description
Query the list of Manifests in an account. The result list can be filtered using Model Id and Manifest Name. If no filter is passed, the query lists all the Manifests in the given account. The returned list is paginated and the count of item in each page is an optional parameter

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| modelId | query | The Model Id | No | string |
| manifestName | query | The Manifest name | No | string |
| count | query | The number of items to retrieve in a page | No | string |
| $skipToken | query | The continuation token to retrieve the next page | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [PaginatedManifestList](#paginatedmanifestlist) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Get Manifest details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests/{id} | 

### Description
Gets Manifest by id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The object id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [Manifest](#manifest) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Create an Image

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images | 

### Description
Create an Image as a docker Image in ACR

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| imageRequest | body | The payload that is used to create an Image | Yes | [ImageRequest](#imagerequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | The async operation location URL. A GET call will show you the status of the image creation task. | Operation-Location |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Query the list of images in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images | 

### Description
Query the list of Images in an account. The result list can be filtered using Manifest id and name. If no filter is passed, the query lists all the Images in the given account. The returned list is paginated and the count of item in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| manifestId | query | The Manifest Id | No | string |
| manifestName | query | The Manifest name | No | string |
| count | query | The number of items to retrieve in a page | No | string |
| $skipToken | query | The continuation token to retrieve the next page | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [PaginatedImageList](#paginatedimagelist) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Get Image details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images/{id} | 

### Description
Gets Image by id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The image id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [Image](#image) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |


## Create a Service

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services | 

### Description
Create a Service from an image

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| serviceRequest | body | The payload that is used to create a service | Yes | [ServiceCreateRequest](#servicecreaterequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | The async operation location URL. A GET call will show you the status of the service creation task. | Operation-Location |
| 409 | Service with the specified name already exists |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Query the list of services in an account.

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services | 

### Description
Query the list of Services in an account. The result list can be filtered using Model name/id, Manifest name/id, Image id, Service name, or Machine Learning Compute Resource id. If no filter is passed, the query lists all Services in the account. The returned list is paginated and the count of item in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| serviceName | query | The Service name | No | string |
| modelId | query | The Model Name | No | string |
| modelName | query | The Model Id | No | string |
| manifestId | query | The Manifest Id | No | string |
| manifestName | query | The Manifest Name | No | string |
| imageId | query | The Image Id | No | string |
| computeResourceId | query | The Machine Learning Compute Resource id | No | string |
| count | query | The number of items to retrieve in a page | No | string |
| $skipToken | query | The continuation token to retrieve the next page | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [PaginatedServiceList](#paginatedservicelist) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse) |

## Get Service details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Gets Service by id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The object id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [ServiceResponse](#serviceresponse) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Update a Service

### Request
| Method | Request URI |
|------------|------------|
| PUT |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Update an existing Service

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The object id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| serviceUpdateRequest | body | The payload that is used to update an existing service | Yes |  [ServiceUpdateRequest](#serviceupdaterequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | The async operation location URL. A GET call will show you the status of the update service task. | Operation-Location |
| 404 | The service with the specified id does not exist |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Delete a Service

### Request
| Method | Request URI |
|------------|------------|
| DELETE |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Deletes a Service

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The object id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success |  |
| 204 | The service with the specified id does not exist |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Get Service keys

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id}/keys | 

### Description
Gets Service keys

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The service id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [AuthKeys](#authkeys)
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Regenerate Service keys

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id}/keys | 

### Description
Regenerates Service keys and returns them

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The service id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| regenerateKeyRequest | body | The payload that is used to update an existing service | Yes | [ServiceRegenerateKeyRequest](#serviceregeneratekeyrequest) |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [AuthKeys](#authkeys)
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Query the list of Deployments in an account.

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/deployments | 

### Description
Query the list of Deployments in an account. The result list can be filtered using Service Id, which will return only the deployments that are created for the particular service. If no filter is passed, the query lists all the Deployments in the given account.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |
| serviceId | query | The Service id | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [DeploymentList](#deploymentlist) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Get Deployment Details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/deployments/{id} | 

### Description
Gets Deployment by Id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The deployment id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [Deployment](#deployment) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)

## Get Operation Details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/operations/{id} | 

### Description
Get async operation status by operation id

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | The Azure Subscription id | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | The Name of the Model Management Account | Yes | string |
| id | path | The operation id | Yes | string |
| api-version | query | The version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | The Authorization Token, it should be something like 'Bearer XXXXXX' | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | success | [OperationStatus](#asyncoperationstatus) |
| default | error response describing why the operation failed | [ErrorResponse](#errorresponse)



<a name="definitions"></a>
## Definitions

<a name="asset"></a>
### Asset
Asset object which will be needed during docker Image creation


|Name|Description|Schema|
|---|---|---|
|**id**  <br>*optional*|Asset id|string|
|**mimeType**  <br>*optional*|The MIME type of Model content. For more details about MIME type, please open https://www.iana.org/assignments/media-types/media-types.xhtml|string|
|**unpack**  <br>*optional*|Indicates wher we need to unpack the content during docker Image creation.|boolean|
|**url**  <br>*optional*|The asset location url|string|


<a name="asyncoperationstate"></a>
### AsyncOperationState
The async operation state

*Type* : enum (NotStarted, Running, Cancelled, Succeeded, Failed)


<a name="asyncoperationstatus"></a>
### AsyncOperationStatus
The operation status


|Name|Description|Schema|
|---|---|---|
|**createdTime**  <br>*optional*  <br>*read-only*|The async operation creation time (UTC)|string (date-time)|
|**endTime**  <br>*optional*  <br>*read-only*|The async operation end time (UTC)|string (date-time)|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|
|**id**  <br>*optional*|The async operation id|string|
|**operationType**  <br>*optional*|The async operation type|enum (Image, Service)|
|**resourceLocation**  <br>*optional*|The resource created/updated by the async operation|string|
|**state**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|


<a name="authkeys"></a>
### AuthKeys
The authentication keys for a Service


|Name|Description|Schema|
|---|---|---|
|**primaryKey**  <br>*optional*|The primary key|string|
|**secondaryKey**  <br>*optional*|The secondary key|string|


<a name="autoscaler"></a>
### AutoScaler
Settings for Auto Scaler


|Name|Description|Schema|
|---|---|---|
|**autoscaleEnabled**  <br>*optional*|Enable or disable the Auto Scaler|boolean|
|**maxReplicas**  <br>*optional*|The maximum number of pod replicas to scale up to.  <br>**Minimum value** : `1`|integer|
|**minReplicas**  <br>*optional*|The minimum number of pod replicas to scale down to.  <br>**Minimum value** : `0`|integer|
|**refreshPeriodInSeconds**  <br>*optional*|Refresh time for Auto Scaling trigger.  <br>**Minimum value** : `1`|integer|
|**targetUtilization**  <br>*optional*|Utilization percentage at which Auto Scaling will trigger.  <br>**Minimum value** : `0`  <br>**Maximum value** : `100`|integer|


<a name="computeresource"></a>
### ComputeResource
Machine Learning Compute Resource


|Name|Description|Schema|
|---|---|---|
|**id**  <br>*optional*|Resource id|string|
|**type**  <br>*optional*|Type of resource|enum (Cluster)|


<a name="containerresourcereservation"></a>
### ContainerResourceReservation
Configuration to reserve resources for the Container in Cluster


|Name|Description|Schema|
|---|---|---|
|**cpu**  <br>*optional*|Specifies CPU reservation. Format for Kubernetes: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu|string|
|**memory**  <br>*optional*|Specifies Memory reservation. Format for Kubernetes: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory|string|


<a name="deployment"></a>
### Deployment
Instance of an Azure Machine Learning Deployment


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*  <br>*read-only*|The deployment creation time (UTC)|string (date-time)|
|**expiredAt**  <br>*optional*  <br>*read-only*|The deployment expired time (UTC)|string (date-time)|
|**id**  <br>*optional*|The deployment Id|string|
|**imageId**  <br>*optional*|The Image Id associated to this deployment|string|
|**serviceName**  <br>*optional*|The Service name|string|
|**status**  <br>*optional*|Current Deployment status|string|


<a name="deploymentlist"></a>
### DeploymentList
An array of Deployment objects.

*Type* : < [Deployment](#deployment) > array


<a name="errordetail"></a>
### ErrorDetail
Model Management Service error detail.


|Name|Description|Schema|
|---|---|---|
|**code**  <br>*required*|error code|string|
|**message**  <br>*required*|error message|string|


<a name="errorresponse"></a>
### ErrorResponse
Model Management Service Error object.


|Name|Description|Schema|
|---|---|---|
|**code**  <br>*required*|error code|string|
|**details**  <br>*optional*|An array of error detail objects.|< [ErrorDetail](#errordetail) > array|
|**message**  <br>*required*|Error message|string|
|**statusCode**  <br>*optional*|HTTP status code|integer|


<a name="image"></a>
### Image
The Auzre Machine Learning Image


|Name|Description|Schema|
|---|---|---|
|**computeResourceId**  <br>*optional*|The id of the environment created in the Machine Learning Compute|string|
|**createdTime**  <br>*optional*|The Image creation time (UTC)|string (date-time)|
|**creationState**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|
|**description**  <br>*optional*|The Image description text|string|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|
|**id**  <br>*optional*|The Image id|string|
|**imageBuildLogUri**  <br>*optional*|Uri of the uploaded logs from Image build|string|
|**imageLocation**  <br>*optional*|Azure Container Registry location string for the created Image|string|
|**imageType**  <br>*optional*||[ImageType](#imagetype)|
|**manifest**  <br>*optional*||[Manifest](#manifest)|
|**name**  <br>*optional*|The Image name|string|
|**version**  <br>*optional*|The Image version set by Model Management Service|integer|


<a name="imagerequest"></a>
### ImageRequest
Request to create an Auzre Machine Learning Image


|Name|Description|Schema|
|---|---|---|
|**computeResourceId**  <br>*required*|The id of the environment created in the Machine Learning Compute|string|
|**description**  <br>*optional*|The Image description text|string|
|**imageType**  <br>*required*||[ImageType](#imagetype)|
|**manifestId**  <br>*required*|The id of the Manifest from which the Image will be created|string|
|**name**  <br>*required*|The Image name|string|


<a name="imagetype"></a>
### ImageType
Specifies the type of the Image

*Type* : enum (Docker)


<a name="manifest"></a>
### Manifest
The Azure Machine Learning Manifest


|Name|Description|Schema|
|---|---|---|
|**assets**  <br>*required*|The list of assets|< [Asset](#asset) > array|
|**createdTime**  <br>*optional*  <br>*read-only*|The Manifest creation time (UTC)|string (date-time)|
|**description**  <br>*optional*|The Manifest description text|string|
|**driverProgram**  <br>*required*|The driver program of the Manifest.|string|
|**id**  <br>*optional*|The Manifest id|string|
|**modelIds**  <br>*optional*|List of Model Ids of the registered models. The request will fail if any of the included models is not registered|< string > array|
|**modelType**  <br>*optional*|Specifies that the models are already registered with the Model Management Service|enum (Registered)|
|**name**  <br>*required*|The Manifest name|string|
|**targetRuntime**  <br>*required*||[TargetRuntime](#targetruntime)|
|**version**  <br>*optional*  <br>*read-only*|The Manifest version assigned by Model Management Service|integer|
|**webserviceType**  <br>*optional*|Specifies the desired type of Webservice which will be created from the Manifest|enum (Realtime)|


<a name="model"></a>
### Model
Instance of an Azure Machine Learning Model


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*  <br>*read-only*|The Model creation time (UTC)|string (date-time)|
|**description**  <br>*optional*|The Model description text|string|
|**id**  <br>*optional*  <br>*read-only*|The Model Id|string|
|**mimeType**  <br>*required*|The MIME type of Model content. For more details about MIME type, please open https://www.iana.org/assignments/media-types/media-types.xhtml|string|
|**name**  <br>*required*|The Model name|string|
|**tags**  <br>*optional*|Model tag list|< string > array|
|**unpack**  <br>*optional*|Indicates whether we need to unpack the Model during docker Image creation.|boolean|
|**url**  <br>*required*|The URL of the Model. Usually we put a SAS URL here.|string|
|**version**  <br>*optional*  <br>*read-only*|The Model version assigned by Model Management Service|integer|


<a name="modeldatacollection"></a>
### ModelDataCollection
The Model data collection information


|Name|Description|Schema|
|---|---|---|
|**eventHubEnabled**  <br>*optional*|Enable Event Hub for a Service|boolean|
|**storageEnabled**  <br>*optional*|Enable storage for a Service|boolean|


<a name="paginatedimagelist"></a>
### PaginatedImageList
Paginated list of Images


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|A continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|An array of Model objects|< [Image](#image) > array|


<a name="paginatedmanifestlist"></a>
### PaginatedManifestList
Paginated list of Manifests.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|A continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|An array of Manifest objects.|< [Manifest](#manifest) > array|


<a name="paginatedmodellist"></a>
### PaginatedModelList
Paginated list of Models.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|A continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|An array of Model objects.|< [Model](#model) > array|


<a name="paginatedservicelist"></a>
### PaginatedServiceList
Paginated list of Services.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|A continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|An array of Service objects.|< [ServiceResponse](#serviceresponse) > array|


<a name="servicecreaterequest"></a>
### ServiceCreateRequest
Request to create a Service


|Name|Description|Schema|
|---|---|---|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a Service|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**computeResource**  <br>*required*||[ComputeResource](#computeresource)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**imageId**  <br>*required*|The Image to create the Service|string|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests  <br>**Minimum value** : `1`|integer|
|**name**  <br>*required*|The Service name|string|
|**numReplicas**  <br>*optional*|The number of pod replicas running at any given time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value** : `0`|integer|


<a name="serviceregeneratekeyrequest"></a>
### ServiceRegenerateKeyRequest
Request to regenerate key for a Service


|Name|Description|Schema|
|---|---|---|
|**keyType**  <br>*optional*|Specifies which key to regenerate|enum (Primary, Secondary)|


<a name="serviceresponse"></a>
### ServiceResponse
Detailed status of the Service


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*|The Service creation time (UTC)|string (date-time)|
|**id**  <br>*optional*|The Service id|string|
|**image**  <br>*optional*||[Image](#image)|
|**manifest**  <br>*optional*||[Manifest](#manifest)|
|**models**  <br>*optional*|List of models|< [Model](#model) > array|
|**name**  <br>*optional*|The Service name|string|
|**scoringUri**  <br>*optional*|The Uri for scoring the Service|string|
|**state**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|
|**updatedAt**  <br>*optional*|The last update time (UTC)|string (date-time)|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a Service|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**computeResource**  <br>*required*||[ComputeResource](#computeresource)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests  <br>**Minimum value** : `1`|integer|
|**numReplicas**  <br>*optional*|The number of pod replicas running at any given time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value** : `0`|integer|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|


<a name="serviceupdaterequest"></a>
### ServiceUpdateRequest
Request to update a Service


|Name|Description|Schema|
|---|---|---|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a Service|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**imageId**  <br>*optional*|The Image to create the Service|string|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests  <br>**Minimum value** : `1`|integer|
|**numReplicas**  <br>*optional*|The number of pod replicas running at any given time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value** : `0`|integer|


<a name="targetruntime"></a>
### TargetRuntime
Type of the target runtime.


|Name|Description|Schema|
|---|---|---|
|**properties**  <br>*required*||< string, string > map|
|**runtimeType**  <br>*required*|Specifies the runtime|enum (SparkPython, Python)|

