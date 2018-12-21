---
title: 'Create and manage role assignments in Azure Digital Twins | Microsoft Docs'
description: Create and manage role assignments in Azure Digital Twins.
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/20/2018
ms.author: lyrana
---

# Create and manage role assignments in Azure Digital Twins

Azure Digital Twins uses role-based access control ([RBAC](./security-role-based-access-control.md)) to manage access to resources.

## Role assignments: an overview

Each role assignment conforms to the following definition:

```JSON
{
  "RoleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
  "objectId": "be2c6dfe-c3e5-4c7a-b2da-c941715fbc5f",
  "objectIdType": "ServicePrincipalId",
  "Path": "/",
  "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
}
```

The table below describes each attribute:

| Attribute | Name | Required | Type | Description |
| --- | --- | --- | --- | --- |
| RoleId | Role definition identifier | Yes | String | The unique ID of the desired role assignment. Find role definitions and their identifier by querying the System API or reviewing table below. |
| objectId | Object identifier | Yes | String | An Azure Active Directory ID, service principal object ID, or domain name. What or whom the role assignment is assigned to. The role assignment must be formatted according to its associated type. For the `DomainName` objectIdType, objectId must begin with the `“@”` character. |
| objectIdType | Object identifier type | Yes | String | The kind of Object Identifier used. See **Supported ObjectIdTypes** below. |
| Path | Space path | Yes | String | The full access path to the `Space` object. An example is `/{Guid}/{Guid}`. If an identifier needs the role assignment for the entire graph, specify `"/"`. This character designates the root, but its use is discouraged. Always follow the Principle of Least Privilege. |
| tenantId | Tenant identifier | Varies | String | In most cases, an Azure Active Directory tenant ID. Disallowed for `DeviceId` and `TenantId` ObjectIdTypes. Required for `UserId` and `ServicePrincipalId` ObjectIdTypes. Optional for the DomainName ObjectIdType. |

### Supported role definition identifiers

Each role assignment associates a role definition with an entity in your Azure Digital Twins environment.

[!INCLUDE [digital-twins-roles](../../includes/digital-twins-roles.md)]

### Supported object identifier types

Previously, the **objectIdType** attribute was introduced.

[!INCLUDE [digital-twins-object-types](../../includes/digital-twins-object-id-types.md)]

## Role assignment operations

Azure Digital Twins supports full *CREATE*, *READ*, *UPDATE*, and *DELETE* operations for roles and role assignments.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

The supplies Swagger reference documentation contains further information about all available API endpoints, request operations, and definitions.

[!INCLUDE [Digital Twins Swagger](../../includes/digital-twins-swagger.md)]

<div id="grant"></div>

### Grant permissions to your service principal

Granting permissions to your service principal is often one of the first steps you'll take when working with Azure Digital Twins. It entails:

1. Logging in to your Azure instance through PowerShell.
1. Acquiring your service principal information.
1. Assigning the desired role to your service principal.

Your application ID is supplied to you in Azure Active Directory. To learn more about configuring and provisioning an Azure Digital Twins in Active Directory, read through the [Quickstart](./quickstart-view-occupancy-dotnet.md).

Once you have the application ID, execute the following PowerShell commands:

```shell
Login-AzureRmAccount
Get-AzureRmADServicePrincipal -ApplicationId  <ApplicationId>
```

A user with the **Admin** role can then assign the Space Administrator role to a user by making an authenticated HTTP POST request to the URL:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments
```

With the following JSON body:

```JSON
{
  "RoleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
  "objectId": "YOUR_SERVICE_PRINCIPLE_OBJECT_ID",
  "objectIdType": "ServicePrincipalId",
  "Path": "/",
  "tenantId": "YOUR_TENANT_ID"
}
```

<div id="all"></div>

### Retrieve all role assignments

To list all available role assignments, make an authenticated HTTP GET request to:

```plaintext
YOUR_MANAGEMENT_API_URL/system/roles
```

### Get a specific role assignment

To get a specific role assignment, make an authenticated HTTP GET request to:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments?path=YOUR_PATH
```

| **Name** | **In** | **Required** |	**Type** |	**Description** |
| --- | --- | --- | --- | --- |
| YOUR_PATH | Path | True | String |	The full path to the space |

### Revoke a permission

To revoke a permissions from a recipient, delete the role assignment by making an authenticated HTTP DELETE request:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments/YOUR_ROLE_ID
```

| **Name** | **In** | **Required** | **Type** | **Description** |
| --- | --- | --- | --- | --- |
| YOUR_ROLE_ID | Path | True | String |	Role Assignment ID |

### Create a role assignment

To create a role assignment, make an authenticated HTTP POST request to the URL:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments
```

Verify that the JSON body conforms to the following schema:

```JSON
{
  "RoleId": "YOUR_ROLE_ID",
  "objectId": "YOUR_SERVICE_PRINCIPLE_OBJECT_ID",
  "objectIdType": "YOUR_OBJECT_ID_TYPE",
  "Path": "/",
  "tenantId": "YOUR_TENANT_ID"
}
```

## Examples with configuration

In this example, a user needs administrative access to a floor of a tenant space.

  ```JSON
    {
      "RoleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
      "ObjectId" : " 0fc863bb-eb51-4704-a312-7d635d70e599",
      "ObjectIdType" : "UserId",
      "TenantId": " a0c20ae6-e830-4c60-993d-a91ce6032724",
      "Path": "/ 091e349c-c0ea-43d4-93cf-6b57abd23a44/ d84e82e6-84d5-45a4-bd9d-006a118e3bab"
    }
  ```

In this example, an application runs test scenarios mocking devices and sensors.

  ```JSON
    {
      "RoleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
      "ObjectId" : "cabf7acd-af0b-41c5-959a-ce2f4c26565b",
      "ObjectIdType" : "ServicePrincipalId",
      "TenantId": " a0c20ae6-e830-4c60-993d-a91ce6032724",
      "Path": "/"
    }
  ```

All users who are part of a domain receive read access for spaces, sensors, and users. This access includes their corresponding related objects.

  ```JSON
    {
      "RoleId": " b1ffdb77-c635-4e7e-ad25-948237d85b30",
      "ObjectId" : "@microsoft.com",
      "ObjectIdType" : "DomainName",
      "Path": "/091e349c-c0ea-43d4-93cf-6b57abd23a44"
    }
  ```

## Next steps

To review Azure Digital Twins role-based-access-control, read [Role-base-access-control](./security-authenticating-apis.md).

To learn about Azure Digital Twins API authentication, read [API authentication](./security-authenticating-apis.md).
