---
title: Create a Docker image for Model Management in Azure Machine Learning | Microsoft Docs
description: This article describes the steps for creating a Docker image for your web service.
services: machine-learning
author: chhavib    
ms.author: chhavib
manager: hjerez
editor: jasonwhowell
ms.reviewer: jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.devlang: na
ms.topic: article
ms.date: 09/20/2017

ROBOTS: NOINDEX
---
# Azure Machine Learning Model Management Account API reference

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

For information about setting up the deployment environment, see [Model Management account setup](deployment-setup-configuration.md).

The Azure Machine Learning Model Management Account API implements the following operations:

- Model registration
- Manifest creation
- Docker image creation
- Web service creation

You can use this image to create a web service either locally or on a remote Azure Container Service cluster or another Docker-supported environment of your choice.

## Prerequisites
Make sure you have gone through the installation steps in the [Install and create Quickstart](quickstart-installation.md) document.

The following are required before you proceed:
1. Model Management account provisioning
2. Environment creation for deploying and managing models
3. A Machine Learning model

### Azure AD token
When you're using Azure CLI, log in by using `az login`. The CLI uses your Azure Active Directory (Azure AD) token from the .azure file. If you want to use the APIs, you have the following options.

##### Acquire the Azure AD token manually
You can use `az login` and get the latest token from the .azure file on your home directory.

##### Acquire the Azure AD token programmatically
```
az ad sp create-for-rbac --scopes /subscriptions/<SubscriptionId>/resourcegroups/<ResourceGroupName> --role Contributor --years <length of time> --name <MyservicePrincipalContributor>
```
After you create the service principal, save the output. Now you can use that to get a token from Azure AD:

```cs
 private static async Task<string> AcquireTokenAsync(string clientId, string password, string authority, string resource)
{
        var creds = new ClientCredential(clientId, password);
        var context = new AuthenticationContext(authority);
        var token = await context.AcquireTokenAsync(resource, creds).ConfigureAwait(false);
        return token.AccessToken;
}
```
The token is put in an authorization header for API calls.


## Register a model

The model registration step registers your Machine Learning model with the Azure Model Management account that you created. This registration enables tracking the models and their versions that are assigned at the time of registration. The user provides the name of the model. Subsequent registration of models under the same name generates a new version and ID.

### Request

| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models 
 |
### Description
Registers a model.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| model | body | Payload that is used to register a model. | Yes | [Model](#model) |


### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | OK. The model registration succeeded. | [Model](#model) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Query the list of models in an account
### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models 
 |
### Description
Queries the list of models in an account. You can filter the result list by tag and name. If no filter is passed, the query lists all the models in the account. The returned list is paginated, and the count of items in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| name | query | Object name. | No | string |
| tag | query | Model tag. | No | string |
| count | query | Number of items to retrieve in a page. | No | string |
| $skipToken | query | Continuation token to retrieve the next page. | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [PaginatedModelList](#paginatedmodellist) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Get model details
### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/models/{id}  
 |

### Description
Gets a model by ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Object ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [Model](#model) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Register a manifest with the registered model and all dependencies

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests | 

### Description
Registers a manifest with the registered model and all its dependencies.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| manifestRequest | body | Payload that is used to register a manifest. | Yes | [Manifest](#manifest) |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Manifest registration was successful. | [Manifest](#manifest) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Query the list of manifests in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests | 

### Description
Queries the list of manifests in an account. You can filter the result list by model ID and manifest name. If no filter is passed, the query lists all the manifests in the account. The returned list is paginated, and the count of items in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| modelId | query | Model ID. | No | string |
| manifestName | query | Manifest name. | No | string |
| count | query | Number of items to retrieve in a page. | No | string |
| $skipToken | query | Continuation token to retrieve the next page. | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [PaginatedManifestList](#paginatedmanifestlist) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Get manifest details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/manifests/{id} | 

### Description
Gets the manifest by ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Object ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [Manifest](#manifest) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Create an image

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images | 

### Description
Creates an image as a Docker image in Azure Container Registry.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| imageRequest | body | Payload that is used to create an image. | Yes | [ImageRequest](#imagerequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | Async operation location URL. A GET call will show you the status of the image creation task. | Operation-Location |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Query the list of images in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images | 

### Description
Queries the list of images in an account. You can filter the result list by manifest ID and name. If no filter is passed, the query lists all the images in the account. The returned list is paginated, and the count of items in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| manifestId | query | Manifest ID. | No | string |
| manifestName | query | Manifest name. | No | string |
| count | query | Number of items to retrieve in a page. | No | string |
| $skipToken | query | Continuation token to retrieve the next page. | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [PaginatedImageList](#paginatedimagelist) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Get image details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/images/{id} | 

### Description
Gets an image by ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Image ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [Image](#image) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |


## Create a service

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services | 

### Description
Creates a service from an image.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| serviceRequest | body | Payload that is used to create a service. | Yes | [ServiceCreateRequest](#servicecreaterequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | Async operation location URL. A GET call will show you the status of the service creation task. | Operation-Location |
| 409 | A service with the specified name already exists. |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Query the list of services in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services | 

### Description
Queries the list of services in an account. You can filter the result list by model name/ID, manifest name/ID, image ID, service name, or Machine Learning compute resource ID. If no filter is passed, the query lists all services in the account. The returned list is paginated, and the count of items in each page is an optional parameter.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| serviceName | query | Service name. | No | string |
| modelId | query | Model name. | No | string |
| modelName | query | Model ID. | No | string |
| manifestId | query | Manifest ID. | No | string |
| manifestName | query | Manifest name. | No | string |
| imageId | query | Image ID. | No | string |
| computeResourceId | query | Machine Learning compute resource ID. | No | string |
| count | query | Number of items to retrieve in a page. | No | string |
| $skipToken | query | Continuation token to retrieve the next page. | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [PaginatedServiceList](#paginatedservicelist) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse) |

## Get service details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Gets a service by ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Object ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [ServiceResponse](#serviceresponse) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Update a service

### Request
| Method | Request URI |
|------------|------------|
| PUT |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Updates an existing service.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Object ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| serviceUpdateRequest | body | Payload that is used to update an existing service. | Yes |  [ServiceUpdateRequest](#serviceupdaterequest) |

### Responses
| Code | Description | Headers | Schema |
|--------------------|--------------------|--------------------|--------------------|
| 202 | Async operation location URL. A GET call will show you the status of the update service task. | Operation-Location |
| 404 | The service with the specified ID does not exist. |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Delete a service

### Request
| Method | Request URI |
|------------|------------|
| DELETE |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id} | 

### Description
Deletes a service.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Object ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. |  |
| 204 | The service with the specified ID does not exist. |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Get service keys

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id}/keys | 

### Description
Gets service keys.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Service ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [AuthKeys](#authkeys)
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Regenerate service keys

### Request
| Method | Request URI |
|------------|------------|
| POST |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/services/{id}/regenerateKeys | 

### Description
Regenerates service keys and returns them.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Service ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| regenerateKeyRequest | body | Payload that is used to update an existing service. | Yes | [ServiceRegenerateKeyRequest](#serviceregeneratekeyrequest) |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [AuthKeys](#authkeys)
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Query the list of deployments in an account

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/deployments | 

### Description
Queries the list of deployments in an account. You can filter the result list by service ID, which will return only the deployments that are created for the particular service. If no filter is passed, the query lists all the deployments in the account.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |
| serviceId | query | Service ID. | No | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [DeploymentList](#deploymentlist) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Get deployment details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/deployments/{id} | 

### Description
Gets the deployment by ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Deployment ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [Deployment](#deployment) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)

## Get operation details

### Request
| Method | Request URI |
|------------|------------|
| GET |  /api/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/accounts/{accountName}/operations/{id} | 

### Description
Gets the async operation status by operation ID.

### Parameters
| Name | Located in | Description | Required | Schema
|--------------------|--------------------|--------------------|--------------------|--------------------|
| subscriptionId | path | Azure subscription ID. | Yes | string |
| resourceGroupName | path | Name of the resource group in which the Model Management account is located. | Yes | string |
| accountName | path | Name of the Model Management account. | Yes | string |
| id | path | Operation ID. | Yes | string |
| api-version | query | Version of the Microsoft.Machine.Learning resource provider API to use. | Yes | string |
| Authorization | header | Authorization token. It should be something like "Bearer XXXXXX." | Yes | string |

### Responses
| Code | Description | Schema |
|--------------------|--------------------|--------------------|
| 200 | Success. | [OperationStatus](#asyncoperationstatus) |
| default | Error response that describes why the operation failed. | [ErrorResponse](#errorresponse)



<a name="definitions"></a>
## Definitions

<a name="asset"></a>
### Asset
The asset object that will be needed during Docker image creation.


|Name|Description|Schema|
|---|---|---|
|**id**  <br>*optional*|Asset ID.|string|
|**mimeType**  <br>*optional*|MIME type of model content. For more information about MIME type, see the [list of IANA media types](https://www.iana.org/assignments/media-types/media-types.xhtml).|string|
|**unpack**  <br>*optional*|Indicates where we need to unpack the content during Docker image creation.|boolean|
|**url**  <br>*optional*|Asset location URL.|string|


<a name="asyncoperationstate"></a>
### AsyncOperationState
The async operation state.

*Type*: enum (NotStarted, Running, Cancelled, Succeeded, Failed)


<a name="asyncoperationstatus"></a>
### AsyncOperationStatus
The operation status.


|Name|Description|Schema|
|---|---|---|
|**createdTime**  <br>*optional*  <br>*read-only*|Async operation creation time (UTC).|string (date-time)|
|**endTime**  <br>*optional*  <br>*read-only*|Async operation end time (UTC).|string (date-time)|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|
|**id**  <br>*optional*|Async operation ID.|string|
|**operationType**  <br>*optional*|Async operation type.|enum (Image, Service)|
|**resourceLocation**  <br>*optional*|Resource created or updated by the async operation.|string|
|**state**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|


<a name="authkeys"></a>
### AuthKeys
The authentication keys for a service.


|Name|Description|Schema|
|---|---|---|
|**primaryKey**  <br>*optional*|Primary key.|string|
|**secondaryKey**  <br>*optional*|Secondary key.|string|


<a name="autoscaler"></a>
### AutoScaler
Settings for the autoscaler.


|Name|Description|Schema|
|---|---|---|
|**autoscaleEnabled**  <br>*optional*|Enable or disable the autoscaler.|boolean|
|**maxReplicas**  <br>*optional*|Maximum number of pod replicas to scale up to.  <br>**Minimum value**: `1`|integer|
|**minReplicas**  <br>*optional*|Minimum number of pod replicas to scale down to.  <br>**Minimum value**: `0`|integer|
|**refreshPeriodInSeconds**  <br>*optional*|Refresh time for autoscaling trigger.  <br>**Minimum value**: `1`|integer|
|**targetUtilization**  <br>*optional*|Utilization percentage that triggers autoscaling.  <br>**Minimum value**: `0`  <br>**Maximum value**: `100`|integer|


<a name="computeresource"></a>
### ComputeResource
The Machine Learning compute resource.


|Name|Description|Schema|
|---|---|---|
|**id**  <br>*optional*|Resource ID.|string|
|**type**  <br>*optional*|Type of resource.|enum (Cluster)|


<a name="containerresourcereservation"></a>
### ContainerResourceReservation
Configuration to reserve resources for a container in the cluster.


|Name|Description|Schema|
|---|---|---|
|**cpu**  <br>*optional*|Specifies CPU reservation. Format for Kubernetes: see [Meaning of CPU](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu).|string|
|**memory**  <br>*optional*|Specifies memory reservation. Format for Kubernetes: see [Meaning of memory](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-memory).|string|


<a name="deployment"></a>
### Deployment
An instance of an Azure Machine Learning deployment.


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*  <br>*read-only*|Deployment creation time (UTC).|string (date-time)|
|**expiredAt**  <br>*optional*  <br>*read-only*|Deployment expired time (UTC).|string (date-time)|
|**id**  <br>*optional*|Deployment ID.|string|
|**imageId**  <br>*optional*|Image ID associated with this deployment.|string|
|**serviceName**  <br>*optional*|Service name.|string|
|**status**  <br>*optional*|Current deployment status.|string|


<a name="deploymentlist"></a>
### DeploymentList
An array of deployment objects.

*Type*: <[Deployment](#deployment)> array


<a name="errordetail"></a>
### ErrorDetail
Model Management service error detail.


|Name|Description|Schema|
|---|---|---|
|**code**  <br>*required*|Error code.|string|
|**message**  <br>*required*|Error message.|string|


<a name="errorresponse"></a>
### ErrorResponse
A Model Management service error object.


|Name|Description|Schema|
|---|---|---|
|**code**  <br>*required*|Error code.|string|
|**details**  <br>*optional*|Array of error detail objects.|<[ErrorDetail](#errordetail)> array|
|**message**  <br>*required*|Error message.|string|
|**statusCode**  <br>*optional*|HTTP status code.|integer|


<a name="image"></a>
### Image
The Azure Machine Learning image.


|Name|Description|Schema|
|---|---|---|
|**computeResourceId**  <br>*optional*|ID of the environment created in the Machine Learning compute resource.|string|
|**createdTime**  <br>*optional*|Image creation time (UTC).|string (date-time)|
|**creationState**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|
|**description**  <br>*optional*|Image description text.|string|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|
|**id**  <br>*optional*|Image ID.|string|
|**imageBuildLogUri**  <br>*optional*|URI of the uploaded logs from the image build.|string|
|**imageLocation**  <br>*optional*|Azure Container Registry location string for the created image.|string|
|**imageType**  <br>*optional*||[ImageType](#imagetype)|
|**manifest**  <br>*optional*||[Manifest](#manifest)|
|**name**  <br>*optional*|Image name.|string|
|**version**  <br>*optional*|Image version set by the Model Management service.|integer|


<a name="imagerequest"></a>
### ImageRequest
A request to create an Azure Machine Learning image.


|Name|Description|Schema|
|---|---|---|
|**computeResourceId**  <br>*required*|ID of the environment created in the Machine Learning compute resource.|string|
|**description**  <br>*optional*|Image description text.|string|
|**imageType**  <br>*required*||[ImageType](#imagetype)|
|**manifestId**  <br>*required*|ID of the manifest from which the image will be created.|string|
|**name**  <br>*required*|Image name.|string|


<a name="imagetype"></a>
### ImageType
Specifies the type of the image.

*Type*: enum (Docker)


<a name="manifest"></a>
### Manifest
The Azure Machine Learning manifest.


|Name|Description|Schema|
|---|---|---|
|**assets**  <br>*required*|List of assets.|<[Asset](#asset)> array|
|**createdTime**  <br>*optional*  <br>*read-only*|Manifest creation time (UTC).|string (date-time)|
|**description**  <br>*optional*|Manifest description text.|string|
|**driverProgram**  <br>*required*|Driver program of the manifest.|string|
|**id**  <br>*optional*|Manifest ID.|string|
|**modelIds**  <br>*optional*|List of model IDs of the registered models. The request will fail if any of the included models are not registered.|<string> array|
|**modelType**  <br>*optional*|Specifies that the models are already registered with the Model Management service.|enum (Registered)|
|**name**  <br>*required*|Manifest name.|string|
|**targetRuntime**  <br>*required*||[TargetRuntime](#targetruntime)|
|**version**  <br>*optional*  <br>*read-only*|Manifest version assigned by the Model Management service.|integer|
|**webserviceType**  <br>*optional*|Specifies the desired type of web service that will be created from the manifest.|enum (Realtime)|


<a name="model"></a>
### Model
An instance of an Azure Machine Learning model.


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*  <br>*read-only*|Model creation time (UTC).|string (date-time)|
|**description**  <br>*optional*|Model description text.|string|
|**id**  <br>*optional*  <br>*read-only*|Model ID.|string|
|**mimeType**  <br>*required*|MIME type of the model content. For more information about MIME type, see the [list of IANA media types](https://www.iana.org/assignments/media-types/media-types.xhtml).|string|
|**name**  <br>*required*|Model name.|string|
|**tags**  <br>*optional*|Model tag list.|<string> array|
|**unpack**  <br>*optional*|Indicates whether we need to unpack the model during Docker image creation.|boolean|
|**url**  <br>*required*|URL of the model. Usually we put a shared access signature URL here.|string|
|**version**  <br>*optional*  <br>*read-only*|Model version assigned by the Model Management service.|integer|


<a name="modeldatacollection"></a>
### ModelDataCollection
The model data collection information.


|Name|Description|Schema|
|---|---|---|
|**eventHubEnabled**  <br>*optional*|Enable an event hub for a service.|boolean|
|**storageEnabled**  <br>*optional*|Enable storage for a service.|boolean|


<a name="paginatedimagelist"></a>
### PaginatedImageList
A paginated list of images.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|Continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|Array of model objects.|<[Image](#image)> array|


<a name="paginatedmanifestlist"></a>
### PaginatedManifestList
A paginated list of manifests.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|Continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|Array of manifest objects.|<[Manifest](#manifest)> array|


<a name="paginatedmodellist"></a>
### PaginatedModelList
A paginated list of models.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|Continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|Array of model objects.|<[Model](#model)> array|


<a name="paginatedservicelist"></a>
### PaginatedServiceList
A paginated list of services.


|Name|Description|Schema|
|---|---|---|
|**nextLink**  <br>*optional*|Continuation link (absolute URI) to the next page of results in the list.|string|
|**value**  <br>*optional*|Array of service objects.|<[ServiceResponse](#serviceresponse)> array|


<a name="servicecreaterequest"></a>
### ServiceCreateRequest
A request to create a service.


|Name|Description|Schema|
|---|---|---|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a service.|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**computeResource**  <br>*required*||[ComputeResource](#computeresource)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**imageId**  <br>*required*|Image to create the service.|string|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests.  <br>**Minimum value**: `1`|integer|
|**name**  <br>*required*|Service name.|string|
|**numReplicas**  <br>*optional*|Number of pod replicas running at any time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value**: `0`|integer|


<a name="serviceregeneratekeyrequest"></a>
### ServiceRegenerateKeyRequest
A request to regenerate a key for a service.


|Name|Description|Schema|
|---|---|---|
|**keyType**  <br>*optional*|Specifies which key to regenerate.|enum (Primary, Secondary)|


<a name="serviceresponse"></a>
### ServiceResponse
The detailed status of the service.


|Name|Description|Schema|
|---|---|---|
|**createdAt**  <br>*optional*|Service creation time (UTC).|string (date-time)|
|**ID**  <br>*optional*|Service ID.|string|
|**image**  <br>*optional*||[Image](#image)|
|**manifest**  <br>*optional*||[Manifest](#manifest)|
|**models**  <br>*optional*|List of models.|<[Model](#model)> array|
|**name**  <br>*optional*|Service name.|string|
|**scoringUri**  <br>*optional*|URI for scoring the service.|string|
|**state**  <br>*optional*||[AsyncOperationState](#asyncoperationstate)|
|**updatedAt**  <br>*optional*|Last update time (UTC).|string (date-time)|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a service.|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**computeResource**  <br>*required*||[ComputeResource](#computeresource)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests.  <br>**Minimum value**: `1`|integer|
|**numReplicas**  <br>*optional*|Number of pod replicas running at any time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value**: `0`|integer|
|**error**  <br>*optional*||[ErrorResponse](#errorresponse)|


<a name="serviceupdaterequest"></a>
### ServiceUpdateRequest
A request to update a service.


|Name|Description|Schema|
|---|---|---|
|**appInsightsEnabled**  <br>*optional*|Enable application insights for a service.|boolean|
|**autoScaler**  <br>*optional*||[AutoScaler](#autoscaler)|
|**containerResourceReservation**  <br>*optional*||[ContainerResourceReservation](#containerresourcereservation)|
|**dataCollection**  <br>*optional*||[ModelDataCollection](#modeldatacollection)|
|**imageId**  <br>*optional*|Image to create the service.|string|
|**maxConcurrentRequestsPerContainer**  <br>*optional*|Maximum number of concurrent requests.  <br>**Minimum value**: `1`|integer|
|**numReplicas**  <br>*optional*|Number of pod replicas running at any time. Cannot be specified if Autoscaler is enabled.  <br>**Minimum value**: `0`|integer|


<a name="targetruntime"></a>
### TargetRuntime
The type of the target runtime.


|Name|Description|Schema|
|---|---|---|
|**properties**  <br>*required*||<string, string> map|
|**runtimeType**  <br>*required*|Specifies the runtime.|enum (SparkPython, Python)|

