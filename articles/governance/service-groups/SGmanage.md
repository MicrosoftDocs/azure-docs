---
title: Manage Azure Service Groups 
description: "Learn how to create, update, read and delete Azure Service Groups and it's members"
author: rthorn17
ms.author: rithorn
ms.service: Service Groups
ms.topic: overview #Don't change
ms.date: 05/19/2025
---

# How to manage Azure Service Groups?

Service groups in Azure are a low-privilege-based grouping of resources across subscriptions. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. This article will help you learn how to manage Service Groups and its members.  

For more information on service groups, see [Getting started with Service Groups](overview.md).

> ![IMPORTANT]
> Service Groups are currently in a Limited Preview state and require Tenant onboarding before trial. To request for onboarding please see [TBD Link](). 
>
> This documentation will show how to manage service groups and its members using the Azure portal and REST APIs in the Preview.  CLI/ PowerShell/ Terraform support will be announced in a later release.   



## Service Group Actions

Service groups has full create, read, update, and delete support in the Azure portal and using Azure REST APIs.  This section will break out each function and show how to perform them.  

### Create Service Group

- HTTP method: **PUT** 
- Resource Provider: **Microsoft.Management**
- API Version: **2024-04-01-preview**
- URL: https://management.azure.com/providers/Microsoft.Management/serviceGroups/[groupID]?api-version=2024-04-01-preview

Request Body: 
```json
{
    "kind":[kind],
    "properties": {
        "displayName": [displayName],
        "parent": {
            "resourceId": [resourceID]
        }
    } 
}
```
API Response:
```json
{
	"id": "/providers/Microsoft.Management/serviceGroups/[groupID]",
	"type": "Microsoft.Management/serviceGroups",
	"name": [groupID],
	"kind": [kindValue],
	"properties": {
		"displayName": [displayNameValue],
		"parent": {
			"resourceId": "/providers/microsoft.management/servicegroups/[parentSGID]"
		},
		"provisioningState": "NotStarted"
	}
}
```

* **GroupID**:  Required field in the URL that uniquely identifies the Service Group. This ID is immutable once created
  * Service Groups must have a Global Unique Name. This means it is not specific to Tenant it is being created in, but all tenants in that cloud. Ex. Public Cloud across all tenants.  
* **Kind**: Optional string property that can be leveraged by Resource Providers for scenarios.  
* **Display Name**: Optional String Property to display a different name rather than the Group ID
* **Parent.ResourceID**: Required property that must have the full ARM ID of the parent Service Group.  If there are no other groups available, 
    * The Default Root Service Group ID is always the TenantID. "providers/microsoft.management/servicegroups/[tenantID]"
* **id**: The ID is in the response only and is the ID created in the URL of the request. 
* **provisioningState**: The HTTP PUT Action is an Asynchronous call where a successful call will response a 201.  This response states the API request was successful and the operation is still happening in the backend.  A GET call on the the URL returned in the **azure-asyncoperation** header will provide the operation status.  For more details on this visit [Checking for Service Group Operation Status]().

### Update Service Group
To update a service group, a PUT or PATCH API method can be used which have the same request body.  The PUT will do a full replace of all properties.  

- HTTP method: **PUT** or **PATCH**
- Resource Provider: **Microsoft.Management**
- API Version: **2024-04-01-preview**
- URL: https://management.azure.com/providers/Microsoft.Management/serviceGroups/[groupID]?api-version=2024-04-01-preview


Request Body: 
```json
{
    "kind":[kind],
    "properties": {
        "displayName": [displayName],
        "parent": {
            "resourceId": [resourceID]
        }
    } 
}
```
API Response:
```json
{
	"id": "/providers/Microsoft.Management/serviceGroups/[groupID]",
	"type": "Microsoft.Management/serviceGroups",
	"name": [groupID],
	"kind": [kindValue],
	"properties": {
		"displayName": [displayNameValue],
		"parent": {
			"resourceId": "/providers/microsoft.management/servicegroups/[parentSGID]"
		},
		"provisioningState": "NotStarted"
	}
}
```
For descriptions of the properties see [Create Service Group](#create-service-group). 

### Delete Service Group

- HTTP method: **DELETE** 
- Resource Provider: **Microsoft.Management**
- API Version: **2024-04-01-preview**
- URL: https://management.azure.com/providers/Microsoft.Management/serviceGroups/[groupID]?api-version=2024-04-01-preview
- No Request Body

API Response: 
The DELETE response will return a the HTTP Status Code. The HTTP DELETE Action is an asynchronous call where a successful call will response a 201.  This response states the API request was successful and the operation is still happening in the backend.  A GET call on the the URL returned in the **locations** header will provide the operation status.  For more details on this visit [Checking for Service Group Operation Status]().

### Read Service Group

- HTTP method: **GET** 
- Resource Provider: **Microsoft.Management**
- API Version: **2024-04-01-preview**
- URL: https://management.azure.com/providers/Microsoft.Management/serviceGroups/[groupID]?api-version=2024-04-01-preview
- No Request Body

API Response: 
```json
{
	"id": "/providers/Microsoft.Management/serviceGroups/[groupID]",
	"type": "Microsoft.Management/serviceGroups",
	"name": [groupID],
	"kind": [kindValue],
	"properties": {
		"displayName": [displayNameValue],
		"parent": {
			"resourceId": "/providers/microsoft.management/servicegroups/[parentSGID]"
		},
		"provisioningState": "NotStarted"
	}
}
```
For descriptions of the properties see [Create Service Group](#create-service-group). 

### List Ancestors 
Service Groups has an API 

## Related content

- [Related article title](link.md)
- [Related article title](link.md)
- [Related article title](link.md)

<!-- Optional: Related content - H2

Consider including a "Related content" H2 section that 
lists links to 1 to 3 articles the user might find helpful.

-->

<!--

Remove all comments except the customer intent
before you sign off or merge to the main branch.

-->