---
title: Azure Machine Learning Model Management Account API reference | Microsoft Docs
description: The REST API reference for Azure Machine Learning Model Management.
services: machine-learning
author: chhavib
ms.author: chhavib, aashishb
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 08/28/2017
---
# Azure Machine Learning Model Management Account API reference

For environment set up information, see [Model Management Account Setup](model-management-configuration.md).

The Azure Machine Learning Model Management API implements the following operations:

- Create or update a Model Management Account
- Get a Model Management Account
- Patch a Model Management Account
- Delete a Model Management Account
- Get all Model Management Accounts in a Resource Group
- Get all Model Management Account in a Subscription
- Get all available Operations


## Create or update a Model Management Account

Creates or updates a Model Management Account. This call will overwrite an existing Model Management Account. Note that there is no warning or confirmation. This is a nonrecoverable operation. If your intent is to create a new Model Management Account, call the Get operation first to verify that it does not exist.

### Request

| Method | Request URI |
|------------|------------|
| PUT | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningModelManagement/accounts/{modelManagementAccountName} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| resourceGroupName | **Required**. Name of the resource group in which the Model Management Account is located. |
| modelManagementAccountName | **Required**. Name of the Model Management Account. |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

```
{
  "location": "string",
  "tags": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "sku": {
    "name": "S1",
    "capacity": 0
  }
}

```

| Field | Description |
|-----------|-----------|
| location | **Required** Location of the resource. |
| tags | **Optional** String-string key value pairs. |
| sku | **Required** SKU of the Model Management Account account. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | The SKU capacity.|


### Response

### Status code

- 201 - Created. This response is returned for a Create Model Management Account operation.
- 200 - Success. This response is returned for an Update Model Management Account operation. The response payload is identical to the response payload that is returned by the GET operation.
- Default - Error response describing why the operation failed.



### Response body

* For status code 200 and 201
```
{
  "id": "string",
  "name": "string",
  "location": "string",
  "type": "string",
  "tags": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "sku": {
    "name": "S1",
    "capacity": 0
  }
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Model Management Account. |
| location | A URL specifying the location of the resource. |
| type | Specifies the type of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Model Management Account. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | Capacity of the current SKU. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
```

| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |

## Get a Model Management Account

Gets the Model Management Account Definiton as specified by a subscription, resource group, and name.

### Request

| Method | Request URI |
|------------|------------|
| GET | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningModelManagement/accounts/{modelManagementAccountName} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| resourceGroupName | **Required**. Name of the resource group in which the Model Management Account is located. |
| modelManagementAccountName | **Required**. Name of the Model Management Account |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

Empty.

### Response

### Status code

- 200 - Success.
- Default - Error response describing why the operation failed.



### Response body

* For status code 200
```
{
  "id": "string",
  "name": "string",
  "location": "string",
  "type": "string",
  "tags": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "sku": {
    "name": "S1",
    "capacity": 0
  }
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Model Management Account. |
| location | A URL specifying the location of the resource. |
| type | Specifies the type of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Model Management Account. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | Capacity of the current SKU. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}


```
| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |

## Patch a Model Management Account

Modifies an existing Model Management Account resource.

### Request

| Method | Request URI |
|------------|------------|
| PATCH | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningModelManagement/accounts/{modelManagementAccountName} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| resourceGroupName | **Required**. Name of the resource group in which the Model Management Account is located. |
| modelManagementAccountName | **Required**. Name of the Model Management Account. |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|
| payload | **Required**. Payload to use to patch the Model Management Account.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

```
{
  "tags": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "sku": {
    "name": "S1",
    "capacity": 0
  },
  "properties": {
    "description": "string"
  }
}

```

| Field | Description |
|-----------|-----------|
| tags | **Optional** String-string key value pairs. |
| sku | **Required** The SKU of the Model Management Account account. |
| properties | **Required** Properties to be patched. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | The SKU capacity.|


### Response

### Status code

- 200 - Success. The response payload is identical to the response payload that is returned by the GET operation.
- Default - Error response describing why the operation failed.



### Response body

* For status code 200
```
{
  "id": "string",
  "name": "string",
  "location": "string",
  "type": "string",
  "tags": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "sku": {
    "name": "S1",
    "capacity": 0
  }
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Model Management Account. |
| location | A URL specifying the location of the resource. |
| type | Specifies the type of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Model Management Account. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | Capacity of the current SKU. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
```

| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |


## Delete a Model Management Account

Deletes the specified Model Management Account.

### Request

| Method | Request URI |
|------------|------------|
| DELETE | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningModelManagement/accounts/{modelManagementAccountName} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| resourceGroupName | **Required**. Name of the resource group in which the Model Management Account is located. |
| modelManagementAccountName | **Required**. Name of the Model Management Account. |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

Empty.


### Response

### Status code

- 200 - Success. The object exists and was deleted successfully.
- 204 - No Content. The resource does not exist and the request is well formed
- Default - Error response describing why the operation failed.



### Response body

* For status code 200 and 204

    Empty.
  
* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
```

| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |

## Get all Model Management Accounts in a resource group

Gets the Model Management Accounts in the specified resource group.

### Request

| Method | Request URI |
|------------|------------|
| GET | /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningModelManagement/accounts |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| resourceGroupName | **Required**. Name of the resource group in which the Model Management Account is located. |
| $skiptoken | Continuation token for pagination. |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

Empty.

### Response

### Status code

- 200 - Success. The response includes a paginated array of Model Management Account objects and a URI to the next set of results, if any. For more information on the limit of the number of items in a resource group, see https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/.
- Default - Error response describing why the operation failed.



### Response body

* For status code 200
```
{
  "value": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "type": "string",
      "tags": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "sku": {
        "name": "S1",
        "capacity": 0
      }
    }
  ],
  "nextLink": "string"
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Model Management Account. |
| location | A URL specifying the location of the resource. |
| type | Specifies the type of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Model Management Account. |
| nextLink | A continuation link (absolute URI) to the next page of results in the list. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | Capacity of the current SKU. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}


```
| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |

## Get all Model Management Accounts in a subscription

Gets the Model Management Accounts in the specified subscription.

### Request

| Method | Request URI |
|------------|------------|
| GET | /subscriptions/{subscriptionId}/providers/Microsoft.MachineLearningModelManagement/accounts |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. Azure subscription ID. |
| $skiptoken | Continuation token for pagination. |
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

Empty.

### Response

### Status code

- 200 - Success. The response includes a paginated array of Model Management Account objects and a URI to the next set of results, if any. 
- Default - Error response describing why the operation failed.



### Response body

* For status code 200
```
{
  "value": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "type": "string",
      "tags": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "sku": {
        "name": "S1",
        "capacity": 0
      }
    }
  ],
  "nextLink": "string"
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Model Management Account. |
| location | A URL specifying the location of the resource. |
| type | Specifies the type of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Model Management Account. |
| nextLink | A continuation link (absolute URI) to the next page of results in the list. |

**SKU fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Model Management Account.  |
| capacity | Capacity of the current SKU. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}


```
| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |

## Get all available operations

Gets all available operations.

### Request

| Method | Request URI |
|------------|------------|
| GET | /providers/Microsoft.MachineLearningModelManagement/operations |

### Properties

| Property | Description |
|--------------------|--------------------|
| api-version | **Required**. The version of the Microsoft.MachineLearning resource provider API to use.|

### Request header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request body

Empty.

### Response

### Status code

- 200 - Success.
- Default - Error response describing why the operation failed.



### Response body

* For status code 200
```
{
  "value": [
    {
      "name": "string",
      "display": {
        "provider": "string",
        "resource": "string",
        "operation": "string",
        "description": "string"
      },
      "origin": "string"
    }
  ]
}
```

| Field | Description |
|-----------|-----------|
| name | Name of the operation. |
| display | Description of the operation. |
| origin | The operation origin. |

**Display fields**
| Field | Description |
|-----------|-----------|
| provider | Resource provider name.  |
| resource | Resource name. |
| operation | Operation name. |
| description | Description of the operation. |

* For status code default

```
{
  "code": "string",
  "message": "string",
  "details": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}


```
| Field | Description |
|-----------|-----------|
| code | Error code. |
| message | Error message. |
| details | Error details. |


