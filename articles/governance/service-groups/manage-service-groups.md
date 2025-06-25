---
title: "Manage resources across subscriptions and resource groups with Azure Service Groups - Azure Governance" 
description: "Learn how to create, update, read, and delete Azure Service Groups and members"
author: rthorn17
ms.author: rithorn
ms.service: azure-policy 
ms.topic: how-to
ms.date: 05/19/2025
ms.custom:
  - build-2025
---

# How to use Azure Service Groups to manage resources

You can group resources, across subscriptions, by creating Azure Service Groups. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. This article helps you learn how to manage Service Groups and its members.  

For more information on service groups, see [Getting started with Service Groups](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in PREVIEW. 
> For more information about participating in the preview, see [Azure Service Groups Preview](https://aka.ms/ServiceGroups/PreviewSignup).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Service Group Actions

This section shows you how to manage service group's actions create, read, update, and delete in the Azure portal and using Azure REST APIs. 

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
  * Service groups must have a Global Unique Name. This means it isn't specific to Tenant it's being created in, but all tenants in that cloud. Ex. Public Cloud across all tenants.  
* **Kind**: Optional string property that is used by Resource Providers for scenarios. Kind value is immutable after creation.  
* **Display Name**: Optional String Property to display a different name rather than the Group ID
* **Parent.ResourceID**: Required property that must have the full Azure Resource Manager ID of the parent service group.   
    * The Default Root Service Group ID is always the TenantID. "providers/microsoft.management/servicegroups/[tenantID]"
* **id**: The ID is in the response only and is the ID created in the URL of the request. 
* **provisioningState**: The HTTP PUT Action is an Asynchronous call where a successful call has a response of accepted notifying the API request was successful and the operation is still processing. A GET call on the URL returned in the **azure-asyncoperation** header can provide the operation status and visit [Checking for Service Group Operation Status](#checking-for-service-group-operation-status) for more details.

### Update Service Group
To update a service group, a PUT or PATCH API method can be used which have the same request body. The PUT does a full replace of all properties.  

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
The DELETE response returns an HTTP Status Code. The HTTP DELETE Action is an Asynchronous call where a successful call has a response of accepted notifying the API request was successful and the operation is still processing. A GET call on the URL returned in the **azure-asyncoperation** header can provide the operation status and visit [Checking for Service Group Operation Status](#checking-for-service-group-operation-status) for more details.

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
Service Groups has an API that allows you to get all the Service Group Parents and their parents up to the Root Service Group.  

- HTTP method: **POST** 
- Resource Provider: **Microsoft.Management**
- API Version: **2024-04-01-preview**
- URL: https://management.azure.com/providers/Microsoft.Management/serviceGroups/[groupID]/listAncestors?api-version=2024-04-01-preview

- No Request Body

API Response: 
```json
{
    "value": [
        {
            "id": "/providers/Microsoft.Management/serviceGroups/[groupID]",
            "type": "Microsoft.Management/serviceGroups",
            "name": "[groupId]]",
            "properties": {
              "displayName": "ServiceGroup Ancestor1"
            }
        },
        {
            "id": "/providers/Microsoft.Management/serviceGroups/[groupID]]",
            "type": "Microsoft.Management/serviceGroups",
            "name": "[groupID]",
            "properties": {
              "displayName": "ServiceGroup Ancestor2"
            }
        }
    ],
     "nextLink": [url]
}
```
Each parent object is returned showing all the ancestors in the path to the Root Service Group. This API is paginated and the next link will be provided in the response. 

## Service Group Members

Service group members are resources, resource groups, or subscriptions that are connected to a service group with a service group member Relationship. Creating a service group member resource is different than identifying the Parent of a Service Group. 

### Comparison 

|Aspect|Child/Parent Relationship|ServiceGroupMember Relationship|
|------|-------------------------|--------------------------------|
|Description|The child/parent relationship is established by setting the "parent" property on a service group.|The "ServiceGroupMember" relationship is used to link individual resources, resource groups, and subscriptions to a service group|
| Main Scenario| Used to create strict hierarchical organization of service groups | Used to create flexible and dynamic groupings of resources across different scopes for the aggregation of date.| 
|Benefits| **Clear Hierarchy**: Provides a clear and structured hierarchy, making it easier to manage and govern resources. <br> **Service Group Inheritance**: Access controls applied to the parent service group get inherited to the child service group. The inheritance is limited to Service Group Resource Types and not to any members.  <br>| **Cross-Subscription Linking**: Supports linking resources across different subscriptions, providing a unified view and management capabilities.<br>**Dynamic Grouping**: Enables the creation of dynamic groupings of resources, making it easier to manage and monitor them collectively.| 
|Limitations| **Rigid Structure** : The hierarchical structure can be rigid and not be suitable for all scenarios, especially those requiring more flexible relationships.<br> **Limited Scope** : The child/parent relationship is limited to service groups and doesn't extend to individual resources, resource groups, or subscription| **No Inheritance** : Unlike the child/parent relationship, the "ServiceGroupMember" relationship doesn't support inheritance.|
|Structure| Hierarchical|Flexible and dynamic|
|Inheritance|Yes|No|
|Scope|Service Group property| Extends resources, resource groups, and subscriptions as its own resource|
|Use Case| Governance management | Aggregating resources across different scopes |
|Flexibility| Rigid/Strict (One Parent, Many Children) | Flexible (Many Parents, Many Children)|

<br>


### Create a Service Group Member
Resources, resource groups, and subscriptions can all be made members of a service group. The Service Group Member relationship is created as an extension off the member that is being connected to the group.  

- HTTP method: **PUT** 
- Resource Provider: **Microsoft.Relationships**
- API Version: **2023-09-01-preview**
- URL: `https://management.azure.com/[scope]/providers/Microsoft.relationships/serviceGroupMember/[RelationshipID]?api-version=2023-09-01-preview`

Request body
```json
{
    "properties": {
        "targetId": "/providers/Microsoft.Management/serviceGroups/[groupID]"
    }
}
```

* **Relationship ID**: Unique identifier that is used for tracking the relationship. 
* **targetID**: The targetID is the service group this resource is a member of. 

### GET a Service Group Member
Resources, resource groups, and subscriptions can all be made members of a service Group. The service Group Member relationship is created as an extension off the member that is being connected to the group.  

- HTTP method: **GET** 
- Resource Provider: **Microsoft.Relationships**
- API Version: **2023-09-01-preview**
- URL: `https://management.azure.com/[scope]/providers/Microsoft.relationships/serviceGroupMember/[RelationshipID]?api-version=2023-09-01-preview`
- No Request Body

API Response

```json
{
	"properties": {
		"targetId": [targetId],
		"sourceId": [sourceId],
		"targetTenant": [tenantId],
		"metadata": {
			"sourceType": "Microsoft.Resources/subscriptions",
			"targetType": "Microsoft.Management/serviceGroups"
		},
		"originInformation": {
			"relationshipOriginType": "UserExplicitlyCreated"
		},
		"provisioningState": [state]
	},
	"id": [fullResourceID],
	"name": [RelationshipID],
	"type": "Microsoft.Relationships/serviceGroupMember"
}
```

* **Relationship ID**: Unique identifier that is used for tracking the relationship. Created and used within the URL. 
* **Properties** 
   * **Target ID**: The targetID is the resourceID of the service group the resource is a member of.  
   * **Source ID**: The sourceID is the resourceID of the scope the relationship is extending and connecting to the target.  
   * **Target Tenant**: The Tenant ID of the resource that is the Target. 
   * **Metadata**
        * **Source Type**: The resource type of the Source resource the relationship is connecting from. 
        * **Target Type**: The resource type of the Target resource the relationship is connecting to. 
   * **Origin Information** 
        * **Relationship Origin Type**: Customer immutable property identifies how the relationship was created. For more information about the origin information property, see [Origin Information](#origin-information). 
   * **Provisioning State**:  The [Create Service Group Member API Endpoint](#create-a-service-group-member) is an asynchronous call meaning the response from the create only says if the request was successful, not the state of the operation. A GET call on the relationship resource itself is successful if the Service Group Member Relationship is created. For more information about checking operation status, see [Checking for Service Group Operation Status](#checking-for-service-group-operation-status)
* **ID**: Full ID of the service group member resource including its scope resource. 
* **Type**: Resource type of the service group member resource. 


### Delete a Service Group Member
Resources, resource groups, and subscriptions can all be made members of a service group. The Service Group Member relationship is deleted to break the connection from the member to the Service Group.  

- HTTP method: **DELETE** 
- Resource Provider: **Microsoft.Relationships**
- API Version: **2023-09-01-preview**
- URL: `https://management.azure.com/[scope]/providers/Microsoft.relationships/serviceGroupMember/[RelationshipID]?api-version=2023-09-01-preview`
- No Request body

API Response
The DELETE response returns an HTTP Status Code. The HTTP DELETE Action is an asynchronous call where a successful calls response is accepted. This response states the API request was successful and the operation is still happening in the backend. A GET call on the URL returned in the **locations** header provides the operation status. For more information on checking operation status, see [Checking for Service Group Operation Status](#checking-for-service-group-operation-status).


## Checking for Service Group Operation Status
All **PUT**, **PATCH**, and **DELETE** API calls to Service Groups and Service Groups Members are asynchronous http calls which means that the API call made to Azure gets a response if the call was successful, instead of waiting for the whole operation to return a state. This practice allows for improved performance as the caller and the service don't need to stay connected for the whole time.  

For example, if the customer created a REST API call to [Create a Service Group](#create-service-group). The API Request comes to Azure and the Service Groups Resource Provider to be processed. The response to the customer is that the request was received or it failed. 

:::image type="content" source="./media/request-received.png" alt-text="Diagram that shows request received process." Lightbox="./media/request-received.png":::

To get the status of the operation to see if the service group was created or not, the customer makes a separate call. The status returned is for the entire operation.

:::image type="content" source="./media/operation-status.png" alt-text="Image showing the operation status as succeeded or failed.":::

### How to get the operation status
The URL used to get the operation status is returned as a header of the initial request's response. 

For Create or Update on Service Groups and Service Group Members, the **Azure-AsyncOperation** header is returned. By placing a GET call on that URL returns the status. 

GET Response on **Azure-AsyncOperation** 
```json
{
	"status": [status]
}
```
For Delete operations on Service Groups or Service Group Members, the **location** header is returned with the URL. Place a GET call on that URL to get the status.  

It's important to note that when checking status using **location** header, there's no body in the response. The Status code reflects the overall status.  

### Using Get to check status

 A GET operation on the Service Group or Service Group Member to check the status can be done but if the object isn't created yet an error is returned. The initial request kicks off the operation to start creating, updating, or deleting the Service Group or Service Group Member. While this operation is running, any GET calls on that object return a **403 Forbidden** , **404 Not Found**, **401 Not Authorized** or the current information until the operation is completed.  

The best practice is to use the URL provided int the **Azure-AsyncOperation** or **location** headers for checking status of operations.  

## Origin Information
Service Group Member relationships have a property set called "Origin Information" within the response of a GET call. The information provided identifies how the relationship is created. 

The valid values are: 
* ServiceExplicitlyCreated: A service created the relationship.
* UserExplicitlyCreated: A user created the relationship.


## Related content
* [What are Azure Service Groups?](overview.md)
* [Quickstart: Create a service group (preview) with REST API](create-service-group-rest-api.md)
* [Quickstart: Connect resources or resource containers to service groups with Service Group Member Relationships](create-service-group-member-rest-api.md)
* [Connect service group members with REST API](create-service-group-member-rest-api.md)
