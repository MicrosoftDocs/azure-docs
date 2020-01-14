---
title: Build a SCIM endpoint for user provisioning to apps from Azure AD
description: Learn to build a SCIM endpoint, integrate your SCIM API with Azure Active Directory, and start automating provisioning users and groups into your cloud applications. 
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/15/2019
ms.author: mimart
ms.reviewer: arvinh
ms.custom: aaddev;it-pro;seohack1


ms.collection: M365-identity-device-management
---
# Build a SCIM endpoint and configure user provisioning with Azure Active Directory (Azure AD)

As an application developer, you can use the System for Cross-Domain Identity Management (SCIM) user management API to enable automatic provisioning of users and groups between your application and Azure AD. This article describes how to build a SCIM endpoint and integrate with the Azure AD provisioning service. The SCIM specification provides a common user schema for provisioning. When used in conjunction with federation standards like SAML or OpenID Connect, SCIM gives administrators an end-to-end, standards-based solution for access management.

SCIM is a standardized definition of two endpoints: a /Users endpoint and a /Groups endpoint. It uses common REST verbs to create, update, and delete objects, and a pre-defined schema for common attributes like group name, username, first name, last name and email. Apps that offer a SCIM 2.0 REST API can reduce or eliminate the pain of working with a proprietary user management API. For example, any compliant SCIM client knows how to make an HTTP POST of a JSON object to the /Users endpoint to create a new user entry. Instead of needing a slightly different API for the same basic actions, apps that conform to the SCIM standard can instantly take advantage of pre-existing clients, tools, and code. 

![Provisioning from Azure AD to an app with SCIM](media/use-scim-to-provision-users-and-groups/scim-provisioning-overview.png)

The standard user object schema and rest APIs for management defined in SCIM 2.0 (RFC [7642](https://tools.ietf.org/html/rfc7642), [7643](https://tools.ietf.org/html/rfc7643), [7644](https://tools.ietf.org/html/rfc7644)) allow identity providers and apps to more easily integrate with each other. Application developers that build a SCIM endpoint can integrate with any SCIM-compliant client without having to do custom work.

Automating provisioning to an application requires building and integrating a SCIM endpoint with the Azure AD SCIM compliant. Perform the following steps to start provisioning users and groups into your application. 
    
  * **[Step 1: Design your user and group schema.](#step-1-design-your-user-and-group-schema)** Identify the objects and attributes your application needs, and determine how they map to the user and group schema supported by the Azure AD SCIM implementation.

  * **[Step 2: Understand the Azure AD SCIM implementation.](#step-2-understand-the-azure-ad-scim-implementation)** Understand how the Azure AD SCIM client is implemented, and model your SCIM protocol request handling and responses.

  * **[Step 3: Build a SCIM endpoint.](#step-3-build-a-scim-endpoint)** An endpoint must be SCIM 2.0-compatible to integrate with the Azure AD provisioning service. As an option, you can use Microsoft Common Language Infrastructure (CLI) libraries and code samples to build your endpoint. These samples are for reference and testing only; we recommend against coding your production app to take a dependency on them.

  * **[Step 4: Integrate your SCIM endpoint with the Azure AD SCIM client.](#step-4-integrate-your-scim-endpoint-with-the-azure-ad-scim-client)** If your organization is using a third-party application that implements the profile of SCIM 2.0 that Azure AD supports, you can start automating both provisioning and deprovisioning of users and groups right away.

  * **[Step 5: Publish your application to the Azure AD application gallery.](#step-5-publish-your-application-to-the-azure-ad-application-gallery)** Make it easy for customers to discover your application and easily configure provisioning. 

![Steps for integrating a SCIM endpoint with Azure AD](media/use-scim-to-provision-users-and-groups/process.png)

## Step 1: Design your user and group schema

Every application requires different attributes to create a user or group. Start your integration by identifying the objects (users, groups) and attributes (name, manager, job title, etc.) that your application requires. You can then use the table below to understand how the attributes your application requires could map to an attribute in Azure AD and the SCIM RFC. Note that you can [customize](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) how attributes are mapped between Azure AD and your SCIM endpoint. 

User resources are identified by the schema identifier, `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User`, which is included in this protocol specification: https://tools.ietf.org/html/rfc7643.  The default mapping of the attributes of users in Azure AD to the attributes of user resources is provided in Table 1.  

Group resources are identified by the schema identifier, `urn:ietf:params:scim:schemas:core:2.0:Group`. Table 2 shows the default mapping of the attributes of groups in Azure AD to the attributes of group resources.

Note that you don't need to support both users and groups or all the attributes shown below. They are a reference for how attributes in Azure AD are often mapped to properties in the SCIM protocol.  

### Table 1: Default user attribute mapping

| Azure Active Directory user | "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" |
| --- | --- |
| IsSoftDeleted |active |
|department|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|
| displayName |displayName |
|employeeId|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|
| Facsimile-TelephoneNumber |phoneNumbers[type eq "fax"].value |
| givenName |name.givenName |
| jobTitle |title |
| mail |emails[type eq "work"].value |
| mailNickname |externalId |
| manager |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager |
| mobile |phoneNumbers[type eq "mobile"].value |
| postalCode |addresses[type eq "work"].postalCode |
| proxy-Addresses |emails[type eq "other"].Value |
| physical-Delivery-OfficeName |addresses[type eq "other"].Formatted |
| streetAddress |addresses[type eq "work"].streetAddress |
| surname |name.familyName |
| telephone-Number |phoneNumbers[type eq "work"].value |
| user-PrincipalName |userName |


### Table 2: Default group attribute mapping

| Azure Active Directory group | urn:ietf:params:scim:schemas:core:2.0:Group |
| --- | --- |
| displayName |displayName |
| mail |emails[type eq "work"].value |
| mailNickname |displayName |
| members |members |
| objectId |externalId |
| proxyAddresses |emails[type eq "other"].Value |

## Step 2: Understand the Azure AD SCIM implementation
> [!IMPORTANT]
> The behavior of the Azure AD SCIM implementation was last updated on December 18, 2018. For information on what changed, see [SCIM 2.0 protocol compliance of the Azure AD User Provisioning service](application-provisioning-config-problem-scim-compatibility.md).

If you're building an application that supports a SCIM 2.0 user management API, this section describes in detail how the Azure AD SCIM client is implemented. It also shows how to model your SCIM protocol request handling and responses. Once you've implemented your SCIM endpoint, you can test it by following the procedure described in the previous section.

Within the [SCIM 2.0 protocol specification](http://www.simplecloud.info/#Specification), your application must meet these requirements:

* Supports creating users, and optionally also groups, as per section [3.3 of the SCIM protocol](https://tools.ietf.org/html/rfc7644#section-3.3).  
* Supports modifying users or groups with PATCH requests, as per [section 3.5.2 of the SCIM protocol](https://tools.ietf.org/html/rfc7644#section-3.5.2).  
* Supports retrieving a known resource for a user or group created earlier, as per [section 3.4.1 of the SCIM protocol](https://tools.ietf.org/html/rfc7644#section-3.4.1).  
* Supports querying users or groups, as per section [3.4.2 of the SCIM protocol](https://tools.ietf.org/html/rfc7644#section-3.4.2).  By default, users are retrieved by their `id` and queried by their `username` and `externalid`, and groups are queried by `displayName`.  
* Supports querying user by ID and by manager, as per section 3.4.2 of the SCIM protocol.  
* Supports querying groups by ID and by member, as per section 3.4.2 of the SCIM protocol.  
* Accepts a single bearer token for authentication and authorization of Azure AD to your application.

Follow these general guidelines when implementing a SCIM endpoint to ensure compatibility with Azure AD:

* `id` is a required property for all the resources. Every response that returns a resource should ensure each resource has this property, except for `ListResponse` with zero members.
* Response to a query/filter request should always be a `ListResponse`.
* Groups are optional, but only supported if the SCIM implementation supports PATCH requests.
* It isn't necessary to include the entire resource in the PATCH response.
* Microsoft Azure AD only uses the following operators:  
    - `eq`
    - `and`
* Don't require a case-sensitive match on structural elements in SCIM, in particular PATCH `op` operation values, as defined in https://tools.ietf.org/html/rfc7644#section-3.5.2. Azure AD emits the values of 'op' as `Add`, `Replace`, and `Remove`.
* Microsoft Azure AD makes requests to fetch a random user and group to ensure that the endpoint and the credentials are valid. It's also done as a part of **Test Connection** flow in the [Azure portal](https://portal.azure.com). 
* The attribute that the resources can be queried on should be set as a matching attribute on the application in the [Azure portal](https://portal.azure.com). For more information, see [Customizing User Provisioning Attribute Mappings](https://docs.microsoft.com/azure/active-directory/active-directory-saas-customizing-attribute-mappings)

### User provisioning and deprovisioning

The following illustration shows the messages that Azure Active Directory sends to a SCIM service to manage the lifecycle of a user in your application's identity store.  

![Shows the user provisioning and deprovisioning sequence][4]<br/>
*Figure 4: User provisioning and deprovisioning sequence*

### Group provisioning and deprovisioning

Group provisioning and deprovisioning are optional. When implemented and enabled, the following illustration shows the messages that Azure AD sends to a SCIM service to manage the lifecycle of a group in your application's identity store.  Those messages differ from the messages about users in two ways:

* Requests to retrieve groups specify that the members attribute is to be excluded from any resource provided in response to the request.  
* Requests to determine whether a reference attribute has a certain value are requests about the members attribute.  

![Shows the group provisioning and deprovisioning sequence][5]<br/>
*Figure 5: Group provisioning and deprovisioning sequence*

### SCIM protocol requests and responses
This section provides example SCIM requests emitted by the Azure AD SCIM client and example expected responses. For best results, you should code your app to handle these requests in this format and emit the expected responses.

> [!IMPORTANT]
> To understand how and when the Azure AD user provisioning service emits the operations described below, see the section [Provisioning cycles: Initial and incremental](how-provisioning-works.md#provisioning-cycles-initial-and-incremental) in [How provisioning works](how-provisioning-works.md).

[User Operations](#user-operations)
  - [Create User](#create-user) ([Request](#request) / [Response](#response))
  - [Get User](#get-user) ([Request](#request-1) / [Response](#response-1))
  - [Get User by query](#get-user-by-query) ([Request](#request-2) / [Response](#response-2))
  - [Get User by query - Zero results](#get-user-by-query---zero-results) ([Request](#request-3)
/ [Response](#response-3))
  - [Update User [Multi-valued properties]](#update-user-multi-valued-properties) ([Request](#request-4) /  [Response](#response-4))
  - [Update User [Single-valued properties]](#update-user-single-valued-properties) ([Request](#request-5)
/ [Response](#response-5)) 
  - [Disable User](#disable-user) ([Request](#request-14) / 
[Response](#response-14))
  - [Delete User](#delete-user) ([Request](#request-6) / 
[Response](#response-6))


[Group Operations](#group-operations)
  - [Create Group](#create-group) (
[Request](#request-7) / [Response](#response-7))
  - [Get Group](#get-group) (
[Request](#request-8) / [Response](#response-8))
  - [Get Group by displayName](#get-group-by-displayname) ([Request](#request-9) / [Response](#response-9))
  - [Update Group [Non-member attributes]](#update-group-non-member-attributes) ([Request](#request-10) /
 [Response](#response-10))
  - [Update Group [Add Members]](#update-group-add-members) (
[Request](#request-11) /
[Response](#response-11))
  - [Update Group [Remove Members]](#update-group-remove-members) (
[Request](#request-12) /
[Response](#response-12)) (
  - [Delete Group](#delete-group) ([Request](#request-13) /
[Response](#response-13))

### User Operations

* Users can be queried by `userName` or `email[type eq "work"]` attributes.  

#### Create User

###### Request

*POST /Users*
```json
{
	"schemas": [
	    "urn:ietf:params:scim:schemas:core:2.0:User",
	    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"],
	"externalId": "0a21f0f2-8d2a-4f8e-bf98-7363c4aed4ef",
	"userName": "Test_User_ab6490ee-1e48-479e-a20b-2d77186b5dd1",
	"active": true,
	"emails": [{
		"primary": true,
		"type": "work",
		"value": "Test_User_fd0ea19b-0777-472c-9f96-4f70d2226f2e@testuser.com"
	}],
	"meta": {
		"resourceType": "User"
	},
	"name": {
		"formatted": "givenName familyName",
		"familyName": "familyName",
		"givenName": "givenName"
	},
	"roles": []
}
```

##### Response

*HTTP/1.1 201 Created*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
	"id": "48af03ac28ad4fb88478",
	"externalId": "0a21f0f2-8d2a-4f8e-bf98-7363c4aed4ef",
	"meta": {
		"resourceType": "User",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
	},
	"userName": "Test_User_ab6490ee-1e48-479e-a20b-2d77186b5dd1",
	"name": {
		"formatted": "givenName familyName",
		"familyName": "familyName",
		"givenName": "givenName",
	},
	"active": true,
	"emails": [{
		"value": "Test_User_fd0ea19b-0777-472c-9f96-4f70d2226f2e@testuser.com",
		"type": "work",
		"primary": true
	}]
}
```

#### Get User

###### <a name="request-1"></a>Request
*GET /Users/5d48a0a8e9f04aa38008* 

###### <a name="response-1"></a>Response (User found)
*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
	"id": "5d48a0a8e9f04aa38008",
	"externalId": "58342554-38d6-4ec8-948c-50044d0a33fd",
	"meta": {
		"resourceType": "User",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
	},
	"userName": "Test_User_feed3ace-693c-4e5a-82e2-694be1b39934",
	"name": {
		"formatted": "givenName familyName",
		"familyName": "familyName",
		"givenName": "givenName",
	},
	"active": true,
	"emails": [{
		"value": "Test_User_22370c1a-9012-42b2-bf64-86099c2a1c22@testuser.com",
		"type": "work",
		"primary": true
	}]
}
```

###### Request
*GET /Users/5171a35d82074e068ce2* 

###### Response (User not found. Note that the detail is not required, only status.)

```json
{
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:Error"
    ],
    "status": "404",
    "detail": "Resource 23B51B0E5D7AE9110A49411D@7cca31655d49f3640a494224 not found"
}
```

#### Get User by query

##### <a name="request-2"></a>Request

*GET /Users?filter=userName eq "Test_User_dfeef4c5-5681-4387-b016-bdf221e82081"*

##### <a name="response-2"></a>Response

*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
	"totalResults": 1,
	"Resources": [{
		"schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
		"id": "2441309d85324e7793ae",
		"externalId": "7fce0092-d52e-4f76-b727-3955bd72c939",
		"meta": {
			"resourceType": "User",
			"created": "2018-03-27T19:59:26.000Z",
			"lastModified": "2018-03-27T19:59:26.000Z"
			
		},
		"userName": "Test_User_dfeef4c5-5681-4387-b016-bdf221e82081",
		"name": {
			"familyName": "familyName",
			"givenName": "givenName"
		},
		"active": true,
		"emails": [{
			"value": "Test_User_91b67701-697b-46de-b864-bd0bbe4f99c1@testuser.com",
			"type": "work",
			"primary": true
		}]
	}],
	"startIndex": 1,
	"itemsPerPage": 20
}

```

#### Get User by query - Zero results

##### <a name="request-3"></a>Request

*GET /Users?filter=userName eq "non-existent user"*

##### <a name="response-3"></a>Response

*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
	"totalResults": 0,
	"Resources": [],
	"startIndex": 1,
	"itemsPerPage": 20
}

```

#### Update User [Multi-valued properties]

##### <a name="request-4"></a>Request

*PATCH /Users/6764549bef60420686bc HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
	"Operations": [
            {
    		"op": "Replace",
    		"path": "emails[type eq \"work\"].value",
    		"value": "updatedEmail@microsoft.com"
    	    },
    	    {
    		"op": "Replace",
    		"path": "name.familyName",
    		"value": "updatedFamilyName"
    	    }
	]
}
```

##### <a name="response-4"></a>Response

*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
	"id": "6764549bef60420686bc",
	"externalId": "6c75de36-30fa-4d2d-a196-6bdcdb6b6539",
	"meta": {
		"resourceType": "User",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
	},
	"userName": "Test_User_fbb9dda4-fcde-4f98-a68b-6c5599e17c27",
	"name": {
		"formatted": "givenName updatedFamilyName",
		"familyName": "updatedFamilyName",
		"givenName": "givenName"
	},
	"active": true,
	"emails": [{
		"value": "updatedEmail@microsoft.com",
		"type": "work",
		"primary": true
	}]
}
```

#### Update User [Single-valued properties]

##### <a name="request-5"></a>Request

*PATCH /Users/5171a35d82074e068ce2 HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
	"Operations": [{
		"op": "Replace",
		"path": "userName",
		"value": "5b50642d-79fc-4410-9e90-4c077cdd1a59@testuser.com"
	}]
}
```

##### <a name="response-5"></a>Response

*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
	"id": "5171a35d82074e068ce2",
	"externalId": "aa1eca08-7179-4eeb-a0be-a519f7e5cd1a",
	"meta": {
		"resourceType": "User",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
		
	},
	"userName": "5b50642d-79fc-4410-9e90-4c077cdd1a59@testuser.com",
	"name": {
		"formatted": "givenName familyName",
		"familyName": "familyName",
		"givenName": "givenName",
	},
	"active": true,
	"emails": [{
		"value": "Test_User_49dc1090-aada-4657-8434-4995c25a00f7@testuser.com",
		"type": "work",
		"primary": true
	}]
}
```

### Disable User

##### <a name="request-14"></a>Request

*PATCH /Users/5171a35d82074e068ce2 HTTP/1.1*
```json
{
    "Operations": [
        {
            "op": "Replace",
            "path": "active",
            "value": false
        }
    ],
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ]
}
```

##### <a name="response-14"></a>Response

```json
{
    "schemas": [
        "urn:ietf:params:scim:schemas:core:2.0:User"
    ],
    "id": "CEC50F275D83C4530A495FCF@834d0e1e5d8235f90a495fda",
    "userName": "deanruiz@testuser.com",
    "name": {
        "familyName": "Harris",
        "givenName": "Larry"
    },
    "active": false,
    "emails": [
        {
            "value": "gloversuzanne@testuser.com",
            "type": "work",
            "primary": true
        }
    ],
    "addresses": [
        {
            "country": "ML",
            "type": "work",
            "primary": true
        }
    ],
    "meta": {
        "resourceType": "Users",
        "location": "/scim/5171a35d82074e068ce2/Users/CEC50F265D83B4530B495FCF@5171a35d82074e068ce2"
    }
}
```
#### Delete User

##### <a name="request-6"></a>Request

*DELETE /Users/5171a35d82074e068ce2 HTTP/1.1*

##### <a name="response-6"></a>Response

*HTTP/1.1 204 No Content*

### Group Operations

* Groups shall always be created with an empty members list.
* Groups can be queried by the `displayName` attribute.
* Update to the group PATCH request should yield an *HTTP 204 No Content* in the response. Returning a body with a list of all the members isn't advisable.
* It isn't necessary to support returning all the members of the group.

#### Create Group

##### <a name="request-7"></a>Request

*POST /Groups HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group", "http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/2.0/Group"],
	"externalId": "8aa1a0c0-c4c3-4bc0-b4a5-2ef676900159",
	"displayName": "displayName",
	"meta": {
		"resourceType": "Group"
	}
}
```

##### <a name="response-7"></a>Response

*HTTP/1.1 201 Created*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
	"id": "927fa2c08dcb4a7fae9e",
	"externalId": "8aa1a0c0-c4c3-4bc0-b4a5-2ef676900159",
	"meta": {
		"resourceType": "Group",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
		
	},
	"displayName": "displayName",
	"members": []
}
```

#### Get Group

##### <a name="request-8"></a>Request

*GET /Groups/40734ae655284ad3abcc?excludedAttributes=members HTTP/1.1*

##### <a name="response-8"></a>Response
*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
	"id": "40734ae655284ad3abcc",
	"externalId": "60f1bb27-2e1e-402d-bcc4-ec999564a194",
	"meta": {
		"resourceType": "Group",
		"created": "2018-03-27T19:59:26.000Z",
		"lastModified": "2018-03-27T19:59:26.000Z"
	},
	"displayName": "displayName",
}
```

#### Get Group by displayName

##### <a name="request-9"></a>Request
*GET /Groups?excludedAttributes=members&filter=displayName eq "displayName" HTTP/1.1*

##### <a name="response-9"></a>Response

*HTTP/1.1 200 OK*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
	"totalResults": 1,
	"Resources": [{
		"schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
		"id": "8c601452cc934a9ebef9",
		"externalId": "0db508eb-91e2-46e4-809c-30dcbda0c685",
		"meta": {
			"resourceType": "Group",
			"created": "2018-03-27T22:02:32.000Z",
			"lastModified": "2018-03-27T22:02:32.000Z",
			
		},
		"displayName": "displayName",
	}],
	"startIndex": 1,
	"itemsPerPage": 20
}
```

#### Update Group [Non-member attributes]

##### <a name="request-10"></a>Request

*PATCH /Groups/fa2ce26709934589afc5 HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
	"Operations": [{
		"op": "Replace",
		"path": "displayName",
		"value": "1879db59-3bdf-4490-ad68-ab880a269474updatedDisplayName"
	}]
}
```

##### <a name="response-10"></a>Response

*HTTP/1.1 204 No Content*

### Update Group [Add Members]

##### <a name="request-11"></a>Request

*PATCH /Groups/a99962b9f99d4c4fac67 HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
	"Operations": [{
		"op": "Add",
		"path": "members",
		"value": [{
			"$ref": null,
			"value": "f648f8d5ea4e4cd38e9c"
		}]
	}]
}
```

##### <a name="response-11"></a>Response

*HTTP/1.1 204 No Content*

#### Update Group [Remove Members]

##### <a name="request-12"></a>Request

*PATCH /Groups/a99962b9f99d4c4fac67 HTTP/1.1*
```json
{
	"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
	"Operations": [{
		"op": "Remove",
		"path": "members",
		"value": [{
			"$ref": null,
			"value": "f648f8d5ea4e4cd38e9c"
		}]
	}]
}
```

##### <a name="response-12"></a>Response

*HTTP/1.1 204 No Content*

#### Delete Group

##### <a name="request-13"></a>Request

*DELETE /Groups/cdb1ce18f65944079d37 HTTP/1.1*

##### <a name="response-13"></a>Response

*HTTP/1.1 204 No Content*

## Step 3: Build a SCIM endpoint

By creating a SCIM web service that interfaces with Azure Active Directory, you can enable automatic user provisioning for virtually any application or identity store.

Here’s how it works:

1. Azure AD provides a common language infrastructure (CLI) library named Microsoft.SystemForCrossDomainIdentityManagement, included with the code samples describe below. System integrators and developers can use this library to create and deploy a SCIM-based web service endpoint that can connect Azure AD to any application’s identity store.
2. Mappings are implemented in the web service to map the standardized user schema to the user schema and protocol required by the application. 
3. The endpoint URL is registered in Azure AD as part of a custom application in the application gallery.
4. Users and groups are assigned to this application in Azure AD. Upon assignment, they're put into a queue to be synchronized to the target application. The synchronization process handling the queue runs every 40 minutes.

### Code samples

To make this process easier, [code samples](https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master) are provided, which create a SCIM web service endpoint and demonstrate automatic provisioning. The sample is of a provider that maintains a file with rows of comma-separated values representing users and groups.

**Prerequisites**

* Visual Studio 2013 or later
* [Azure SDK for .NET](https://azure.microsoft.com/downloads/)
* Windows machine that supports the ASP.NET framework 4.5 to be used as the SCIM endpoint. This machine must be accessible from the cloud.
* [An Azure subscription with a trial or licensed version of Azure AD Premium](https://azure.microsoft.com/services/active-directory/)

### Getting started

The easiest way to implement a SCIM endpoint that can accept provisioning requests from Azure AD is to build and deploy the code sample that outputs the provisioned users to a comma-separated value (CSV) file.

#### To create a sample SCIM endpoint

1. Download the code sample package at [https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master](https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master)
1. Unzip the package and place it on your Windows machine at a location such as C:\AzureAD-BYOA-Provisioning-Samples\.
1. In this folder, launch the FileProvisioning\Host\FileProvisioningService.csproj project in Visual Studio.
1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**, and execute the following commands for the FileProvisioningService project to resolve the solution references:

   ```powershell
    Update-Package -Reinstall
   ```

1. Build the FileProvisioningService project.
1. Launch the Command Prompt application in Windows (as an Administrator), and use the **cd** command to change the directory to your **\AzureAD-BYOA-Provisioning-Samples\FileProvisioning\Host\bin\Debug** folder.
1. Run the following command, replacing `<ip-address>` with the IP address or domain name of the Windows machine:

   ```
    FileSvc.exe http://<ip-address>:9000 TargetFile.csv
   ```

1. In Windows under **Windows Settings** > **Network & Internet Settings**, select the **Windows Firewall** > **Advanced Settings**, and create an **Inbound Rule** that allows inbound access to port 9000.
1. If the Windows machine is behind a router, the router needs to be configured to run Network Access Translation between its port 9000 that is exposed to the internet, and port 9000 on the Windows machine. This configuration is required for Azure AD to access this endpoint in the cloud.

#### To register the sample SCIM endpoint in Azure AD

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com). 
1. Select **Enterprise applications** from the left pane. A list of all configured apps is shown, including apps that were added from the gallery.
1. Select **+ New application** > **All** > **Non-gallery application**.
1. Enter a name for your application, and select **Add** to create an app object. The application object created is intended to represent the target app you would be provisioning to and implementing single sign-on for, and not just the SCIM endpoint.
1. In the app management screen, select **Provisioning** in the left panel.
1. In the **Provisioning Mode** menu, select **Automatic**.    
1. In the **Tenant URL** field, enter the URL of the application's SCIM endpoint. Example: https://api.contoso.com/scim/

1. If the SCIM endpoint requires an OAuth bearer token from an issuer other than Azure AD, then copy the required OAuth bearer token into the optional **Secret Token** field. If this field is left blank, Azure AD includes an OAuth bearer token issued from Azure AD with each request. Apps that use Azure AD as an identity provider can validate this Azure AD-issued token.
1. Select **Test Connection** to have Azure Active Directory attempt to connect to the SCIM endpoint. If the attempt fails, error information is displayed.  

    > [!NOTE]
    > **Test Connection** queries the SCIM endpoint for a user that doesn't exist, using a random GUID as the matching property selected in the Azure AD configuration. The expected correct response is HTTP 200 OK with an empty SCIM ListResponse message

1. If the attempts to connect to the application succeed, then select **Save** to save the admin credentials.
1. In the **Mappings** section, there are two selectable sets of attribute mappings: one for user objects and one for group objects. Select each one to review the attributes that are synchronized from Azure Active Directory to your app. The attributes selected as **Matching** properties are used to match the users and groups in your app for update operations. Select **Save** to commit any changes.
1. Under **Settings**, the **Scope** field defines which users and or groups are synchronized. Select **"Sync only assigned users and groups** (recommended) to only sync users and groups assigned in the **Users and groups** tab.
1. Once your configuration is complete, set the **Provisioning Status** to **On**.
1. Select **Save** to start the Azure AD provisioning service.
1. If syncing only assigned users and groups (recommended), be sure to select the **Users and groups** tab and assign the users or groups you want to sync.

Once the initial cycle has started, you can select **Audit logs** in the left panel to monitor progress, which shows all actions done by the provisioning service on your app. For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](check-status-user-account-provisioning.md).

The final step in verifying the sample is to open the TargetFile.csv file in the \AzureAD-BYOA-Provisioning-Samples\ProvisioningAgent\bin\Debug folder on your Windows machine. Once the provisioning process is run, this file shows the details of all assigned and provisioned users and groups.

### Development libraries

To develop your own web service that conforms to the SCIM specification, first familiarize yourself with the following libraries provided by Microsoft to help accelerate the development process:

* Common Language Infrastructure (CLI) libraries are offered for use with languages based on that infrastructure, such as C#. One of those libraries, Microsoft.SystemForCrossDomainIdentityManagement.Service, declares an interface, Microsoft.SystemForCrossDomainIdentityManagement.IProvider, shown in the following illustration. A developer using the libraries would implement that interface with a class that may be referred to, generically, as a provider. The libraries let the developer deploy a web service that conforms to the SCIM specification. The web service can be either hosted within Internet Information Services, or any executable CLI assembly. Request is translated into calls to the provider’s methods, which would be programmed by the developer to operate on some identity store.
  
   ![Breakdown: A request translated into calls to the provider's methods][3]
  
* [Express route handlers](https://expressjs.com/guide/routing.html) are available for parsing node.js request objects representing calls (as defined by the SCIM specification), made to a node.js web service.

### Building a custom SCIM endpoint

Developers using the CLI libraries can host their services within any executable CLI assembly, or within Internet Information Services. Here is sample code for hosting a service within an executable assembly, at the address http://localhost:9000: 

```csharp
 private static void Main(string[] arguments)
 {
 // Microsoft.SystemForCrossDomainIdentityManagement.IMonitor, 
 // Microsoft.SystemForCrossDomainIdentityManagement.IProvider and 
 // Microsoft.SystemForCrossDomainIdentityManagement.Service are all defined in 
 // Microsoft.SystemForCrossDomainIdentityManagement.Service.dll.  

 Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor = 
   new DevelopersMonitor();
 Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider = 
   new DevelopersProvider(arguments[1]);
 Microsoft.SystemForCrossDomainIdentityManagement.Service webService = null;
 try
 {
     webService = new WebService(monitor, provider);
     webService.Start("http://localhost:9000");

     Console.ReadKey(true);
 }
 finally
 {
     if (webService != null)
     {
         webService.Dispose();
         webService = null;
     }
 }
 }

 public class WebService : Microsoft.SystemForCrossDomainIdentityManagement.Service
 {
 private Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor;
 private Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider;

 public WebService(
   Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitoringBehavior, 
   Microsoft.SystemForCrossDomainIdentityManagement.IProvider providerBehavior)
 {
     this.monitor = monitoringBehavior;
     this.provider = providerBehavior;
 }

 public override IMonitor MonitoringBehavior
 {
     get
     {
         return this.monitor;
     }

     set
     {
         this.monitor = value;
     }
 }

 public override IProvider ProviderBehavior
 {
     get
     {
         return this.provider;
     }

     set
     {
         this.provider = value;
     }
 }
 }
```

This service must have an HTTP address and server authentication certificate of which the root certification authority is one of the following names: 

* CNNIC
* Comodo
* CyberTrust
* DigiCert
* GeoTrust
* GlobalSign
* Go Daddy
* VeriSign
* WoSign

A server authentication certificate can be bound to a port on a Windows host using the network shell utility:

```
netsh http add sslcert ipport=0.0.0.0:443 certhash=0000000000003ed9cd0c315bbb6dc1c08da5e6 appid={00112233-4455-6677-8899-AABBCCDDEEFF}
```

Here, the value provided for the certhash argument is the thumbprint of the certificate, while the value provided for the appid argument is an arbitrary globally unique identifier.  

To host the service within Internet Information Services, a developer would build a CLI code library assembly with a class named Startup in the default namespace of the assembly.  Here is a sample of such a class: 

```csharp
 public class Startup
 {
 // Microsoft.SystemForCrossDomainIdentityManagement.IWebApplicationStarter, 
 // Microsoft.SystemForCrossDomainIdentityManagement.IMonitor and  
 // Microsoft.SystemForCrossDomainIdentityManagement.Service are all defined in 
 // Microsoft.SystemForCrossDomainIdentityManagement.Service.dll.  

 Microsoft.SystemForCrossDomainIdentityManagement.IWebApplicationStarter starter;

 public Startup()
 {
     Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor = 
       new DevelopersMonitor();
     Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider = 
       new DevelopersProvider();
     this.starter = 
       new Microsoft.SystemForCrossDomainIdentityManagement.WebApplicationStarter(
         provider, 
         monitor);
 }

 public void Configuration(
   Owin.IAppBuilder builder) // Defined in Owin.dll.  
 {
     this.starter.ConfigureApplication(builder);
 }
 }
```

### Handling endpoint authentication

Requests from Azure Active Directory include an OAuth 2.0 bearer token.   Any service receiving the request should authenticate the issuer as being Azure Active Directory for the expected Azure Active Directory tenant, for access to the Azure Active Directory Graph web service.  In the token, the issuer is identified by an iss claim, like "iss":"https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/".  In this example, the base address of the claim value, https://sts.windows.net, identifies Azure Active Directory as the issuer, while the relative address segment, cbb1a5ac-f33b-45fa-9bf5-f37db0fed422, is a unique identifier of the Azure Active Directory tenant for which the token was issued. The audience for the token will be the application template ID for the app in the gallery. The application template ID for all custom apps is 8adf8e6e-67b2-4cf2-a259-e3dc5476c621. The application template ID for each app in the gallery varies. Please contact ProvisioningFeedback@microsoft.com for questions on the application template ID for a gallery application. Each of the applications registered in a single tenant may receive the same `iss` claim with SCIM requests.

Developers using the CLI libraries provided by Microsoft for building a SCIM service can authenticate requests from Azure Active Directory using the Microsoft.Owin.Security.ActiveDirectory package by following these steps: 

First, in a provider, implement the Microsoft.SystemForCrossDomainIdentityManagement.IProvider.StartupBehavior property by having it return a method to be called whenever the service is started: 

```csharp
  public override Action<Owin.IAppBuilder, System.Web.Http.HttpConfiguration.HttpConfiguration> StartupBehavior
  {
    get
    {
      return this.OnServiceStartup;
    }
  }

  private void OnServiceStartup(
    Owin.IAppBuilder applicationBuilder,  // Defined in Owin.dll.  
    System.Web.Http.HttpConfiguration configuration)  // Defined in System.Web.Http.dll.  
  {
  }
```

Next, add the following code to that method to have any request to any of the service’s endpoints authenticated as bearing a token issued by Azure Active Directory for a specified tenant, for access to the Azure AD Graph web service: 

```csharp
  private void OnServiceStartup(
    Owin.IAppBuilder applicationBuilder IAppBuilder applicationBuilder, 
    System.Web.Http.HttpConfiguration HttpConfiguration configuration)
  {
    // IFilter is defined in System.Web.Http.dll.  
    System.Web.Http.Filters.IFilter authorizationFilter = 
      new System.Web.Http.AuthorizeAttribute(); // Defined in System.Web.Http.dll.configuration.Filters.Add(authorizationFilter);

    // SystemIdentityModel.Tokens.TokenValidationParameters is defined in    
    // System.IdentityModel.Token.Jwt.dll.
    SystemIdentityModel.Tokens.TokenValidationParameters tokenValidationParameters =     
      new TokenValidationParameters()
      {
        ValidAudience = "8adf8e6e-67b2-4cf2-a259-e3dc5476c621"
      };

    // WindowsAzureActiveDirectoryBearerAuthenticationOptions is defined in 
    // Microsoft.Owin.Security.ActiveDirectory.dll
    Microsoft.Owin.Security.ActiveDirectory.
    WindowsAzureActiveDirectoryBearerAuthenticationOptions authenticationOptions =
      new WindowsAzureActiveDirectoryBearerAuthenticationOptions()    {
      TokenValidationParameters = tokenValidationParameters,
      Tenant = "03F9FCBC-EA7B-46C2-8466-F81917F3C15E" // Substitute the appropriate tenant’s 
                                                    // identifier for this one.  
    };

    applicationBuilder.UseWindowsAzureActiveDirectoryBearerAuthentication(authenticationOptions);
  }
```

### Handling provisioning and deprovisioning of users

***Example 1. Query the service for a matching user***

Azure Active Directory queries the service for a user with an externalId attribute value matching the mailNickname attribute value of a user in Azure AD. The query is expressed as a Hypertext Transfer Protocol (HTTP) request such as this example, wherein jyoung is a sample of a mailNickname of a user in Azure Active Directory.

>[!NOTE]
> This is an example only. Not all users will have a mailNickname attribute, and the value a user has may not be unique in the directory. Also, the attribute used for matching (which in this case is externalId) is configurable in the [Azure AD attribute mappings](customize-application-attributes.md).

```
GET https://.../scim/Users?filter=externalId eq jyoung HTTP/1.1
 Authorization: Bearer ...
```

If the service was built using the CLI libraries provided by Microsoft for implementing SCIM services, then the request is translated into a call to the Query method of the service’s provider.  Here is the signature of that method: 

```csharp
 // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
 // Microsoft.SystemForCrossDomainIdentityManagement.Resource is defined in 
 // Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  
 // Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters is defined in 
 // Microsoft.SystemForCrossDomainIdentityManagement.Protocol.  

 System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource[]> Query(
   Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters parameters, 
   string correlationIdentifier);
```

Here is the definition of the Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters interface: 

```csharp
 public interface IQueryParameters: 
   Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
 {
     System.Collections.Generic.IReadOnlyCollection <Microsoft.SystemForCrossDomainIdentityManagement.IFilter> AlternateFilters 
     { get; }
 }

 public interface Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
 {
   system.Collections.Generic.IReadOnlyCollection<string> ExcludedAttributePaths 
   { get; }
   System.Collections.Generic.IReadOnlyCollection<string> RequestedAttributePaths 
   { get; }
   string SchemaIdentifier 
   { get; }
 }
```

```
    GET https://.../scim/Users?filter=externalId eq jyoung HTTP/1.1
    Authorization: Bearer ...
```

If the service was built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, then the request is translated into a call to the Query method of the service’s provider.  Here is the signature of that method: 

```csharp
  // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
  // Microsoft.SystemForCrossDomainIdentityManagement.Resource is defined in 
  // Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  
  // Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters is defined in 
  // Microsoft.SystemForCrossDomainIdentityManagement.Protocol.  

  System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource[]>  Query(
    Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters parameters, 
    string correlationIdentifier);
```

Here is the definition of the Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters interface: 

```csharp
  public interface IQueryParameters: 
    Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
  {
      System.Collections.Generic.IReadOnlyCollection  <Microsoft.SystemForCrossDomainIdentityManagement.IFilter> AlternateFilters 
      { get; }
  }

  public interface Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
  {
    system.Collections.Generic.IReadOnlyCollection<string> ExcludedAttributePaths 
    { get; }
    System.Collections.Generic.IReadOnlyCollection<string> RequestedAttributePaths 
    { get; }
    string SchemaIdentifier 
    { get; }
  }

  public interface Microsoft.SystemForCrossDomainIdentityManagement.IFilter
  {
      Microsoft.SystemForCrossDomainIdentityManagement.IFilter AdditionalFilter 
        { get; set; }
      string AttributePath 
        { get; } 
      Microsoft.SystemForCrossDomainIdentityManagement.ComparisonOperator FilterOperator 
        { get; }
      string ComparisonValue 
        { get; }
  }

  public enum Microsoft.SystemForCrossDomainIdentityManagement.ComparisonOperator
  {
      Equals
  }
```

In the following sample of a query for a user with a given value for the externalId attribute, values of the arguments passed to the Query method are: 
* parameters.AlternateFilters.Count: 1
* parameters.AlternateFilters.ElementAt(0).AttributePath: "externalId"
* parameters.AlternateFilters.ElementAt(0).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(0).ComparisonValue: "jyoung"
* correlationIdentifier: System.Net.Http.HttpRequestMessage.GetOwinEnvironment["owin.RequestId"] 

***Example 2. Provision a user***

If the response to a query to the web service for a user with an externalId attribute value that matches the mailNickname attribute value of a user doesn't return any users, then Azure Active Directory requests that the service provision a user corresponding to the one in Azure Active Directory.  Here is an example of such a request: 

```
 POST https://.../scim/Users HTTP/1.1
 Authorization: Bearer ...
 Content-type: application/scim+json
 {
   "schemas":
   [
     "urn:ietf:params:scim:schemas:core:2.0:User",
     "urn:ietf:params:scim:schemas:extension:enterprise:2.0User"],
   "externalId":"jyoung",
   "userName":"jyoung",
   "active":true,
   "addresses":null,
   "displayName":"Joy Young",
   "emails": [
     {
       "type":"work",
       "value":"jyoung@Contoso.com",
       "primary":true}],
   "meta": {
     "resourceType":"User"},
    "name":{
     "familyName":"Young",
     "givenName":"Joy"},
   "phoneNumbers":null,
   "preferredLanguage":null,
   "title":null,
   "department":null,
   "manager":null}
```

The CLI libraries provided by Microsoft for implementing SCIM services would translate that request into a call to the Create method of the service’s provider.  The Create method has this signature:

```csharp
 // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
 // Microsoft.SystemForCrossDomainIdentityManagement.Resource is defined in 
 // Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  

 System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource> Create(
   Microsoft.SystemForCrossDomainIdentityManagement.Resource resource, 
   string correlationIdentifier);
```

In a request to provision a user, the value of the resource argument is an instance of the Microsoft.SystemForCrossDomainIdentityManagement. Core2EnterpriseUser class, defined in the Microsoft.SystemForCrossDomainIdentityManagement.Schemas library.  If the request to provision the user succeeds, then the implementation of the method is expected to return an instance of the Microsoft.SystemForCrossDomainIdentityManagement. Core2EnterpriseUser class, with the value of the Identifier property set to the unique identifier of the newly provisioned user.  

***Example 3. Query the current state of a user*** 

To update a user known to exist in an identity store fronted by an SCIM, Azure Active Directory proceeds by requesting the current state of that user from the service with a request such as: 

```
 GET ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
 Authorization: Bearer ...
```

In a service built using the CLI libraries provided by Microsoft for implementing SCIM services, the request is translated into a call to the Retrieve method of the service’s provider.  Here is the signature of the Retrieve method:

```csharp
 // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
 // Microsoft.SystemForCrossDomainIdentityManagement.Resource and 
 // Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters 
 // are defined in Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  
 System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource> 
    Retrieve(
      Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters 
        parameters, 
        string correlationIdentifier);

 public interface 
   Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters:   
     IRetrievalParameters
     {
       Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier 
         ResourceIdentifier 
           { get; }
 }
 public interface Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier
 {
     string Identifier 
       { get; set; }
     string Microsoft.SystemForCrossDomainIdentityManagement.SchemaIdentifier 
       { get; set; }
 }
```

In the example of a request to retrieve the current state of a user, the values of the properties of the object provided as the value of the parameters argument are as follows: 
  
* Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

***Example 4. Query the value of a reference attribute to be updated*** 

If a reference attribute is to be updated, then Azure Active Directory queries the service to determine whether the current value of the reference attribute in the identity store fronted by the service already matches the value of that attribute in Azure Active Directory. For users, the only attribute of which the current value is queried in this way is the manager attribute. Here is an example of a request to determine whether the manager attribute of a particular user object currently has a certain value: 

If the service was built using the CLI libraries provided by Microsoft for implementing SCIM services, then the request is translated into a call to the Query method of the service’s provider. The value of the properties of the object provided as the value of the parameters argument are as follows: 
  
* parameters.AlternateFilters.Count: 2
* parameters.AlternateFilters.ElementAt(x).AttributePath: "ID"
* parameters.AlternateFilters.ElementAt(x).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(x).ComparisonValue: "54D382A4-2050-4C03-94D1-E769F1D15682"
* parameters.AlternateFilters.ElementAt(y).AttributePath: "manager"
* parameters.AlternateFilters.ElementAt(y).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(y).ComparisonValue: "2819c223-7f76-453a-919d-413861904646"
* parameters.RequestedAttributePaths.ElementAt(0): "ID"
* parameters.SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

Here, the value of the index x can be 0 and the value of the index y can be 1, or the value of x can be 1 and the value of y can be 0, depending on the order of the expressions of the filter query parameter.   

***Example 5. Request from Azure AD to an SCIM service to update a user*** 

Here is an example of a request from Azure Active Directory to an SCIM service to update a user: 

```
  PATCH ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
  Authorization: Bearer ...
  Content-type: application/scim+json
  {
    "schemas": 
    [
      "urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    "Operations":
    [
      {
        "op":"Add",
        "path":"manager",
        "value":
          [
            {
              "$ref":"http://.../scim/Users/2819c223-7f76-453a-919d-413861904646",
              "value":"2819c223-7f76-453a-919d-413861904646"}]}]}
```

The Microsoft Common Language Infrastructure libraries for implementing SCIM services would translate the request into a call to the Update method of the service’s provider. Here is the signature of the Update method: 

```csharp
  // System.Threading.Tasks.Tasks and 
  // System.Collections.Generic.IReadOnlyCollection<T>
  // are defined in mscorlib.dll.  
  // Microsoft.SystemForCrossDomainIdentityManagement.IPatch, 
  // Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase, 
  // Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier, 
  // Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation, 
  // Microsoft.SystemForCrossDomainIdentityManagement.OperationName, 
  // Microsoft.SystemForCrossDomainIdentityManagement.IPath and 
  // Microsoft.SystemForCrossDomainIdentityManagement.OperationValue 
  // are all defined in Microsoft.SystemForCrossDomainIdentityManagement.Protocol. 

  System.Threading.Tasks.Task Update(
    Microsoft.SystemForCrossDomainIdentityManagement.IPatch patch, 
    string correlationIdentifier);

  public interface Microsoft.SystemForCrossDomainIdentityManagement.IPatch
  {
  Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase 
    PatchRequest 
      { get; set; }
  Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier 
    ResourceIdentifier 
      { get; set; }        
  }

  public class PatchRequest2: 
    Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase
  {
  public System.Collections.Generic.IReadOnlyCollection
    <Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation> 
      Operations
      { get;}

  public void AddOperation(
    Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation operation);
  }

  public class PatchOperation
  {
  public Microsoft.SystemForCrossDomainIdentityManagement.OperationName 
    Name
    { get; set; }

  public Microsoft.SystemForCrossDomainIdentityManagement.IPath 
    Path
    { get; set; }

  public System.Collections.Generic.IReadOnlyCollection
    <Microsoft.SystemForCrossDomainIdentityManagement.OperationValue> Value
    { get; }

  public void AddValue(
    Microsoft.SystemForCrossDomainIdentityManagement.OperationValue value);
  }

  public enum OperationName
  {
    Add,
    Remove,
    Replace
  }

  public interface IPath
  {
    string AttributePath { get; }
    System.Collections.Generic.IReadOnlyCollection<IFilter> SubAttributes { get; }
    Microsoft.SystemForCrossDomainIdentityManagement.IPath ValuePath { get; }
  }

  public class OperationValue
  {
    public string Reference
    { get; set; }

    public string Value
    { get; set; }
  }
```

In the example of a request to update a user, the object provided as the value of the patch argument has these property values: 
  
* ResourceIdentifier.Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* ResourceIdentifier.SchemaIdentifier:  "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
* (PatchRequest as PatchRequest2).Operations.Count: 1
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).OperationName: OperationName.Add
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Path.AttributePath: "manager"
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.Count: 1
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.ElementAt(0).Reference: http://.../scim/Users/2819c223-7f76-453a-919d-413861904646
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.ElementAt(0).Value: 2819c223-7f76-453a-919d-413861904646

***Example 6. Deprovision a user***

To deprovision a user from an identity store fronted by an SCIM service, Azure AD sends a request such as:

```
  DELETE ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
  Authorization: Bearer ...
```

If the service was built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, then the request is translated into a call to the Delete method of the service’s provider.   That method has this signature: 

```csharp
  // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
  // Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier, 
  // is defined in Microsoft.SystemForCrossDomainIdentityManagement.Protocol. 
  System.Threading.Tasks.Task Delete(
    Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier  
      resourceIdentifier, 
    string correlationIdentifier);
```

The object provided as the value of the resourceIdentifier argument has these property values in the example of a request to deprovision a user: 

* ResourceIdentifier.Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* ResourceIdentifier.SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

## Step 4: Integrate your SCIM endpoint with the Azure AD SCIM client

Azure AD can be configured to automatically provision assigned users and groups to applications that implement a specific profile of the [SCIM 2.0 protocol](https://tools.ietf.org/html/rfc7644). The specifics of the profile are documented in [Step 2: Understand the Azure AD SCIM implementation](#step-2-understand-the-azure-ad-scim-implementation).

Check with your application provider, or your application provider's documentation for statements of compatibility with these requirements.

> [!IMPORTANT]
> The Azure AD SCIM implementation is built on top of the Azure AD user provisioning service, which is designed to constantly keep users in sync between Azure AD and the target application, and implements a very specific set of standard operations. It's important to understand these behaviors to understand the behavior of the Azure AD SCIM client. For more information, see the section [Provisioning cycles: Initial and incremental](how-provisioning-works.md#provisioning-cycles-initial-and-incremental) in [How provisioning works](how-provisioning-works.md).

### Getting started

Applications that support the SCIM profile described in this article can be connected to Azure Active Directory using the "non-gallery application" feature in the Azure AD application gallery. Once connected, Azure AD runs a synchronization process every 40 minutes where it queries the application's SCIM endpoint for assigned users and groups, and creates or modifies them according to the assignment details.

**To connect an application that supports SCIM:**

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com). Note that you can get access a free trial for Azure Active Directory with P2 licenses by signing up for the [developer program](https://developer.microsoft.com/office/dev-program)
2. Select **Enterprise applications** from the left pane. A list of all configured apps is shown, including apps that were added from the gallery.
3. Select **+ New application** > **All** > **Non-gallery application**.
4. Enter a name for your application, and select **Add** to create an app object. The new app is added to the list of enterprise applications and opens to its app management screen.

   ![Screenshot shows the Azure AD application gallery][1]<br/>
   *Figure 2: Azure AD application gallery*

5. In the app management screen, select **Provisioning** in the left panel.
6. In the **Provisioning Mode** menu, select **Automatic**.

   ![Example: An app's Provisioning page in the Azure portal][2]<br/>
   *Figure 3: Configuring provisioning in the Azure portal*

7. In the **Tenant URL** field, enter the URL of the application's SCIM endpoint. Example: https://api.contoso.com/scim/
8. If the SCIM endpoint requires an OAuth bearer token from an issuer other than Azure AD, then copy the required OAuth bearer token into the optional **Secret Token** field. If this field is left blank, Azure AD includes an OAuth bearer token issued from Azure AD with each request. Apps that use Azure AD as an identity provider can validate this Azure AD-issued token. 
   > [!NOTE]
   > It's ***not*** recommended to leave this field blank and rely on a token generated by Azure AD. This option is primarily available for testing purposes.
9. Select **Test Connection** to have Azure Active Directory attempt to connect to the SCIM endpoint. If the attempt fails, error information is displayed.  

    > [!NOTE]
    > **Test Connection** queries the SCIM endpoint for a user that doesn't exist, using a random GUID as the matching property selected in the Azure AD configuration. The expected correct response is HTTP 200 OK with an empty SCIM ListResponse message.

10. If the attempts to connect to the application succeed, then select **Save** to save the admin credentials.
11. In the **Mappings** section, there are two selectable sets of [attribute mappings](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes): one for user objects and one for group objects. Select each one to review the attributes that are synchronized from Azure Active Directory to your app. The attributes selected as **Matching** properties are used to match the users and groups in your app for update operations. Select **Save** to commit any changes.

    > [!NOTE]
    > You can optionally disable syncing of group objects by disabling the "groups" mapping.

12. Under **Settings**, the **Scope** field defines which users and groups are synchronized. Select **Sync only assigned users and groups** (recommended) to only sync users and groups assigned in the **Users and groups** tab.
13. Once your configuration is complete, set the **Provisioning Status** to **On**.
14. Select **Save** to start the Azure AD provisioning service.
15. If syncing only assigned users and groups (recommended), be sure to select the **Users and groups** tab and assign the users or groups you want to sync.

Once the initial cycle has started, you can select **Provisioning logs** in the left panel to monitor progress, which shows all actions done by the provisioning service on your app. For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](check-status-user-account-provisioning.md).

> [!NOTE]
> The initial cycle takes longer to perform than later syncs, which occur approximately every 40 minutes as long as the service is running.

## Step 5: Publish your application to the Azure AD application gallery

If you're building an application that will be used by more than one tenant, you can make it available in the Azure AD application gallery. This will make it easy for organizations to discover the application and configure provisioning. Publishing your app in the Azure AD gallery and making provisioning available to others is easy. Check out the steps [here](https://docs.microsoft.com/azure/active-directory/develop/howto-app-gallery-listing). Microsoft will work with you to integrate your application into our gallery, test your endpoint, and release onboarding [documentation](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list) for customers to use. 


### Authorization for provisioning connectors in the application gallery
The SCIM spec does not define a SCIM-specific scheme for authentication and authorization. It relies on the use of existing industry standards. The Azure AD provisioning client supports two authorization methods for applications in the gallery. 

**OAuth authorization code grant flow:** The provisioning service supports the [authorization code grant](https://tools.ietf.org/html/rfc6749#page-24). After submitting your request for publishing your app in the gallery, our team will work with you to collect the following information:
*  Authorization URL: A URL by the client to obtain authorization from the resource owner via user-agent redirection. The user is redirected to this URL to authorize access. 
*  Token exchange URL: A URL by the client to exchange an authorization grant for an access token, typically with client authentication.
*  Client ID: The authorization server issues the registered client a client identifier, which is a unique string representing the registration information provided by the client.  The client identifier is not a secret; it is exposed to the resource owner and **must not** be used alone for client authentication.  
*  Client secret: The client secret is a secret generated by the authorization server. It should be a unique value known only to the authorization server. 

Best practices (recommended but not required):
* Support multiple redirect URLs. Administrators can configure provisioning from both "portal.azure.com" and "aad.portal.azure.com". Supporting multiple redirect URLs will ensure that users can authorize access from either portal.
* Support multiple secrets to ensure smooth secret renewal, without downtime. 

**Long lived OAuth bearer tokens:** If your application does not support the OAuth authorization code grant flow, you can also generate a long lived OAuth bearer token than that an administrator can use to setup the provisioning integration. The token should be perpetual, or else the provisioning job will be [quarantined](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status) when the token expires. This token must be below 1KB in size.  

For additional authentication and authorization methods, let us know on [UserVoice](https://aka.ms/appprovisioningfeaturerequest).

### Allow IP addresses used by the Azure AD provisioning service to make SCIM requests

Certain apps allow inbound traffic to their app. In order for the Azure AD provisioning service to function as expected, the IP addresses used must be allowed. For a list of IP addresses for each service tag/region, see the JSON file - [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519). You can download and program these IPs into your firewall as needed. The reserved IP ranges for Azure AD provisioning can be found under "AzureActiveDirectoryDomainServices."

## Related articles

* [Automate user provisioning and deprovisioning to SaaS apps](user-provisioning.md)
* [Customize attribute mappings for user provisioning](customize-application-attributes.md)
* [Writing expressions for attribute mappings](functions-for-customizing-application-data.md)
* [Scoping filters for user provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
* [Account provisioning notifications](user-provisioning.md)
* [List of tutorials on how to integrate SaaS apps](../saas-apps/tutorial-list.md)

<!--Image references-->
[0]: ./media/use-scim-to-provision-users-and-groups/scim-figure-1.png
[1]: ./media/use-scim-to-provision-users-and-groups/scim-figure-2a.png
[2]: ./media/use-scim-to-provision-users-and-groups/scim-figure-2b.png
[3]: ./media/use-scim-to-provision-users-and-groups/scim-figure-3.png
[4]: ./media/use-scim-to-provision-users-and-groups/scim-figure-4.png
[5]: ./media/use-scim-to-provision-users-and-groups/scim-figure-5.png
