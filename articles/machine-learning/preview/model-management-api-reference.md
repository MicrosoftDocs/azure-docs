---
title: Model Management API reference | Microsoft Docs
description: The REST API reference for Azure Machine Learning Model Management.
services: machine-learning
author: get2chhavi
ms.author: chhavib
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 08/28/2017
---
# Hosting Account API reference

For environment set up information, see [Hosting Account getting started]().

The Hosting Account API implements the following operations:

- Create or Update Model Management Account
- Patch Model Management Account
- Get Model Management Account
- Delete Model Management Account
- Get Available Operations

## Create or Update Hosting Account

Creates or updates a Hosting Account.

If the hosting account does not exist in current location, it is created. If the hosting account exists in the specified location, it is updated using the supplied request body.

**Note**: When you are creating a Hosting Account, you specify the name of the acount to create by including it request URI.

### Request

| Method | Request URI |
|------------|------------|
| PUT | https://<endpoint>/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{hostingAccountName}?api-version={api_version} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |

### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body

```
{
  "location": "<Location>",
  "tags": {
    "<string>": "<string>",
    ...,
    ...,
    ...
  },
  "sku": {
    "name": "<string>",
    "tier": "Free | Basic | Standard | Premium"
  },
  "properties": {
      "description": <account description>
  }
}

```

| Field | Description |
|-----------|-----------|
| location | **Required** Location of the resource. |
| tags | **Optional** String-string key value pairs. |
| description | **Optional** The description of the hosting account. |
| sku | **Required** Billing plan |
| properties | **Optional**.|

**sku fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Hosting Account.  |
| tier | The SKU tier. Derived from the SKU name. |

**properties fields**
| Field | Description |
|-----------|-----------|
| description | The description of the Hosting Account. |

### Response

### Status Code

- 201 - Created. This will be returned when first time create this hosting account.
- 200 - OK. This will be returned when the user calling this API on an existing hosting account.


### Response Header

| Field Name | Description |
|-----------------|----------------------|
|  |  |


### Response Body

```
{
  "id": "<resourc ID>",
  "name": <Hosting account name>,
  "location": <Location>,
  "tags": {
      <string>: <string>,
      -,
      -,
      -
  },
  "sku": {
    "name": "<string>",
    "tier": "Free | Basic | Standard | Premium"
  },
  "properties": {
      "description": <account description>,
      "createOn": "<datetime>",
      "modifiedOn": "<datetime>",
      "modelManagementSwaggerLocation": "<url of MMS swagger>"
  }
}
```

| Field | Description |
|-----------|-----------|
| id | Azure Resource Mananger resource ID. |
| name | The name of the Hosting Account. |
| location | A URL specifying the location of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Hosting Account. |
| properties | The set of properties specific to the Hosting Account resource.|

**sku fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Hosting Account.  |
| tier | The SKU tier. Derived from the SKU name. |


**properties fields**
| Field | Description |
|-----------|-----------|
| description | The description of the Hosting Account. |
| id | Resource Manager resource ID. |
| createdOn |   The date and time the Hosting Account was created. |
| modifiedOn |  The date and time the Hosting Account was last modificatied. |
| modelManagementSwaggerLocation | The URI of the swagger spec for the Model Management API. |

#-------------------------------------------------
## Patch Hosting Account

Updates the specified Hosting Account.

If a field in the request is set in the Hosting Account, the value is updated. If a field is only in the request, it is added to the existing Hosting Account.

### Request

| Method | Request URI |
|------------|------------|
| PATCH | https://<endpoint>/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{hostingAccountName}?api-version={api_version} |


### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The subscription ID. |
| resourceGroupName | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |


### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body
All fields in the request are optional, but at least one field must be included for the request to be valid.

```
{
  "tags": {
    "<string>": "<string>",
    ...,
    ...,
    ...
  },
  "properties": {
    "description": "<account description>"
  }
}

```

| Field | Description |
|-----------|-----------|
|  |  |

### Response

### Status Code

- 200 - OK, if the patch succeeded or request body is empty.

### Response Header

| Field Name | Description |
|-----------------|----------------------|
|  |  |


### Response Body

```
{
  "id": "/subscriptions/{id}/resourceGroups/{group}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{name}",
  "name": <Hosting account name>,
  "location": <Location>,
  "tags": {
      <string>: <string>,
      -,
      -,
      -
  },
  "sku": {
    "name": "<string>",
    "tier": "Free | Basic | Standard | Premium"
  },
  "properties": {
      "description": <account description>,
      "createOn": "<datetime>",
      "modifiedOn": "<datetime>",
      "modelManagementSwaggerLocation": "<url of MMS swagger>"
  }
}


```
| Field | Description |
|-----------|-----------|
| id | Azure Resource Manager resource ID. |
| name | The name of the Hosting Account. |
| location | A URL specifying the location of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Hosting Account. |
| properties | The set of properties specific to the Hosting Account resource.|

**sku fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Hosting Account.  |
| tier | The SKU tier. Derived from the SKU name. |


**properties fields**
| Field | Description |
|-----------|-----------|
| description | The description of the Hosting Account. |
| id | Resource Manager resource ID. |
| createdOn |   The date and time the Hosting Account was created. |
| modifiedOn |  The date and time the Hosting Account was last modificatied. |
| modelManagementSwaggerLocation | The URI of the swagger spec for the Model Management API. |


#-------------------------------------------------
## Get Hosting Account

Gets information for the specified Hosting Account.

**Note**: The access keys are not returned as part of the response.

### Request

| Method | Request URI |
|------------|------------|
| GET | https://<endpoint>/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{hostingAccountName}?api-version={api_version} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The subscription ID. |
| resourceGroupName | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |


### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body

Empty.

### Response

### Status Code

-  200 - OK.

### Response Body

```
{
  "id": "/subscriptions/{id}/resourceGroups/{group}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{name}",
  "name": <Hosting account name>,
  "location": <Location>,
  "tags": {
      <string>: <string>,
      -,
      -,
      -
  },
  "sku": {
    "name": "<string>",
    "tier": "Free | Basic | Standard | Premium"
  },
  "properties": {
      "description": <account description>,
      "createOn": "<datetime>",
      "modifiedOn": "<datetime>",
      "modelManagementSwaggerLocation": "<url of MMS swagger>"
  }
}
```

| Field | Description |
|-----------|-----------|
| id | Resource Manager resource ID. |
| name | The name of the Hosting Account. |
| location | A URL specifying the location of the resource. |
| tags |  Contains resource tags defined as key/value pairs. |
| sku | Contains details about the billing SKU associated with the Hosting Account. |
| properties | The set of properties specific to the Hosting Account resource.|

**sku fields**
| Field | Description |
|-----------|-----------|
| name | The name of the billing SKU selected for the Hosting Account.  |
| tier | The SKU tier. Derived from the SKU name. |


**properties fields**
| Field | Description |
|-----------|-----------|
| description | The description of the Hosting Account. |
| id | Resource Manager resource ID. |
| createdOn |   The date and time the Hosting Account was created. |
| modifiedOn |  The date and time the Hosting Account was last modificatied. |
| modelManagementSwaggerLocation | The URI of the swagger spec for the Model Management API. |

#-------------------------------------------------
## Get Hosting Account In a Resource group and Subscription

Gets the Hosting Account information under the same resource group or subscription.

**Note**: The access keys are not returned as part of the response.

### Request

Get in resource group
| Method | Request URI |
|------------|------------|
| GET | https://<endpoint>/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts?api-version={api_version} |

get in subsription
| Method | Request URI |
|------------|------------|
| GET | https://<endpoint>/subscriptions/{subscriptionId}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts?api-version={api_version} |


### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The subscription ID. |
| resourceGroupName | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |


### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body

Empty.

### Response

### Status Code

- 200 - OK.

### Response Body
```
{

  {
    "value": [
      {
        <one GET-HostingAccont result>
      },
      {
        <one GET-HostingAccont, result>
      },
      -,
      -,
      -
    ],
    "nextLink": "<originalRequestUrl>?$skipToken=<opaqueString>"
  }
}
```

| Field | Description |
|-----------|-----------|
| value | An array of Hosting Account objects. If the return collection is empty, an empty value array is returned. For the object defintion, see the reponse body for Get Hosting Account |
| nextLink | A continuation link (absolute URI) to the next page of results in the list. |

#-------------------------------------------------
## Delete Hosting Account

Deletes the specified hosting account. Models, packages, and deployments are not deleted.

### Request

| Method | Request URI |
|------------|------------|
| DELETE | https://<endpoint>/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MachineLearningOperationalization/hostingAccounts/{hostingAccountName}?api-version={api_version} |

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The subscription ID. |
| resourceGroupName | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |


### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body

Empty

### Response

### Status Code

- 200 - OK, when the deletion succeeds.
- 204 - NoContent, when the hosting account does not exist and the request is well formed.

### Response Body

Empty.


#-------------------------------------------------
## Get Available Operations

### Request

| Method | Request URI |
|------------|------------|
|  |  |
GET   https://<endpoint>/providers/Microsoft.MachineLearningOperationalization/operations?api-version={api_version}

### Properties

| Property | Description |
|--------------------|--------------------|
| subscriptionId | **Required**. The subscription ID. |
| resourceGroupName | **Required**. The name of the resource group. |
| hostingAccountName | **Required**. The name of the hosting account. Follow Resource Manager resource name pattern. Unique per resource group. |
| api-version | **Required**. Version of the API to be used with the request. The current version is ``. |


### Request Header

[Common Resource Manager header fields](https://docs.microsoft.com/en-us/rest/api/#request-header)

### Request Body

Empty

### Response

### Status Code

- 200 - OK

### Response Body

```
{
  "value": [
    {
      "name": "Microsoft.MachineLearning/hostingAccount/{read|write|delete}",
      "display": {
        "provider": "Machine Learning",
        "resource": "Hosting Account",
        "operation": "Create Hosting Account",
        "description": ""
      },
      "origin": "-user|system|user",
      "properties": {}
    }
  ]
}
```
