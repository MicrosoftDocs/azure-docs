---
title: 'Create and manage role assignments in Azure Digital Twins | Microsoft Docs'
description: Create and manage role assignments in Azure Digital Twins.
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/26/2018
ms.author: lyhughes
ms.custom: seodec18
---

# Create and manage role assignments in Azure Digital Twins

Azure Digital Twins uses role-based access control ([RBAC](./security-role-based-access-control.md)) to manage access to resources.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Role assignments overview

Each role assignment conforms to the following definition:

```JSON
{
  "roleId": "00e00ad7-00d4-4007-853b-b9968ad000d1",
  "objectId": "be2c6daa-a3a0-0c0a-b0da-c000000fbc5f",
  "objectIdType": "ServicePrincipalId",
  "path": "/",
  "tenantId": "00f000bf-86f1-00aa-91ab-2d7cd000db47"
}
```

The table below describes each attribute:

| Attribute | Name | Required | Type | Description |
| --- | --- | --- | --- | --- |
| roleId | Role definition identifier | Yes | String | The unique ID of the desired role assignment. Find role definitions and their identifier by querying the System API or reviewing table below. |
| objectId | Object identifier | Yes | String | An Azure Active Directory ID, service principal object ID, or domain name. What or whom the role assignment is assigned to. The role assignment must be formatted according to its associated type. For the `DomainName` objectIdType, objectId must begin with the `“@”` character. |
| objectIdType | Object identifier type | Yes | String | The kind of Object Identifier used. See **Supported ObjectIdTypes** below. |
| path | Space path | Yes | String | The full access path to the `Space` object. An example is `/{Guid}/{Guid}`. If an identifier needs the role assignment for the entire graph, specify `"/"`. This character designates the root, but its use is discouraged. Always follow the Principle of Least Privilege. |
| tenantId | Tenant identifier | Varies | String | In most cases, an Azure Active Directory tenant ID. Disallowed for `DeviceId` and `TenantId` ObjectIdTypes. Required for `UserId` and `ServicePrincipalId` ObjectIdTypes. Optional for the DomainName ObjectIdType. |

### Supported role definition identifiers

Each role assignment associates a role definition with an entity in your Azure Digital Twins environment.

[!INCLUDE [digital-twins-roles](../../includes/digital-twins-roles.md)]

### Supported object identifier types

Previously, the **objectIdType** attribute was introduced.

[!INCLUDE [digital-twins-object-types](../../includes/digital-twins-object-id-types.md)]

## Role assignment operations

Azure Digital Twins supports full *CREATE*, *READ*, and *DELETE* operations for role assignments. *UPDATE* operations are handled by adding role assignments, removing role assignments, or modifying the [Spatial Intelligence Graph](./concepts-objectmodel-spatialgraph.md) nodes that role assignments give access to.

![Role assignment endpoints][1]

The supplied Swagger reference documentation contains further information about all available API endpoints, request operations, and definitions.

[!INCLUDE [Digital Twins Swagger](../../includes/digital-twins-swagger.md)]

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

<div id="grant"></div>

### Grant permissions to your service principal

Granting permissions to your service principal is often one of the first steps you'll take when working with Azure Digital Twins. It entails:

1. Logging in to your Azure instance through PowerShell.
1. Acquiring your service principal information.
1. Assigning the desired role to your service principal.

Your application ID is supplied to you in Azure Active Directory. To learn more about configuring and provisioning an Azure Digital Twins in Active Directory, read through the [Quickstart](./quickstart-view-occupancy-dotnet.md).

Once you have the application ID, execute the following PowerShell commands:

```shell
Login-AzAccount
Get-AzADServicePrincipal -ApplicationId  <ApplicationId>
```

A user with the **Admin** role can then assign the Space Administrator role to a user by making an authenticated HTTP POST request to the URL:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments
```

With the following JSON body:

```JSON
{
  "roleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
  "objectId": "YOUR_SERVICE_PRINCIPLE_OBJECT_ID",
  "objectIdType": "ServicePrincipalId",
  "path": "YOUR_PATH",
  "tenantId": "YOUR_TENANT_ID"
}
```

<div id="all"></div>

### Retrieve all roles

![System roles][2]

To list all available roles (role definitions), make an authenticated HTTP GET request to:

```plaintext
YOUR_MANAGEMENT_API_URL/system/roles
```

A successful request will return a JSON array with entries for each role that may be assigned:

```JSON
[
    {
        "id": "3cdfde07-bc16-40d9-bed3-66d49a8f52ae",
        "name": "DeviceAdministrator",
        "permissions": [
            {
                "notActions": [],
                "actions": [
                    "Read",
                    "Create",
                    "Update",
                    "Delete"
                ],
                "condition": "@Resource.Type Any_of {'Device', 'DeviceBlobMetadata', 'DeviceExtendedProperty', 'Sensor', 'SensorBlobMetadata', 'SensorExtendedProperty'} || ( @Resource.Type == 'ExtendedType' && (!Exists @Resource.Category || @Resource.Category Any_of { 'DeviceSubtype', 'DeviceType', 'DeviceBlobType', 'DeviceBlobSubtype', 'SensorBlobSubtype', 'SensorBlobType', 'SensorDataSubtype', 'SensorDataType', 'SensorDataUnitType', 'SensorPortType', 'SensorType' } ) )"
            },
            {
                "notActions": [],
                "actions": [
                    "Read"
                ],
                "condition": "@Resource.Type == 'Space' && @Resource.Category == 'WithoutSpecifiedRbacResourceTypes' || @Resource.Type Any_of {'ExtendedPropertyKey', 'SpaceExtendedProperty', 'SpaceBlobMetadata', 'SpaceResource', 'Matcher'}"
            }
        ],
        "accessControlPath": "/system",
        "friendlyPath": "/system",
        "accessControlType": "System"
    }
]
```

<div id="check"></div>

### Check a specific role assignment

To check a specific role assignment, make an authenticated HTTP GET request to:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments/check?userId=YOUR_USER_ID&path=YOUR_PATH&accessType=YOUR_ACCESS_TYPE&resourceType=YOUR_RESOURCE_TYPE
```

| **Parameter value** | **Required** |	**Type** |	**Description** |
| --- | --- | --- | --- |
| YOUR_USER_ID |  True | String |	The objectId for the UserId objectIdType. |
| YOUR_PATH | True | String |	The chosen path to check access for. |
| YOUR_ACCESS_TYPE |  True | String |	The access type to check for. |
| YOUR_RESOURCE_TYPE | True | String |	The resource to check. |

A successful request will return a boolean `true` or `false` to indicate whether the access type has been assigned to the user for the given path and resource.

### Get role assignments by path

To get all role assignments for a path, make an authenticated HTTP GET request to:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments?path=YOUR_PATH
```

| Value | Replace with |
| --- | --- |
| YOUR_PATH | The full path to the space |

A successful request will return a JSON array with each role assignment associated with the selected **path** parameter:

```JSON
[
    {
        "id": "0000c484-698e-46fd-a3fd-c12aa11e53a1",
        "roleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
        "objectId": "0de38846-1aa5-000c-a46d-ea3d8ca8ee5e",
        "objectIdType": "UserId",
        "path": "/"
    }
]
```

### Revoke a permission

To revoke a permissions from a recipient, delete the role assignment by making an authenticated HTTP DELETE request:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments/YOUR_ROLE_ASSIGNMENT_ID
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_ROLE_ASSIGNMENT_ID* | The **id** of the role assignment to remove |

A successful DELETE request will return a 204 response status. Verify the removal of the role assignment by [checking](#check) whether the role assignment still holds.

### Create a role assignment

To create a role assignment, make an authenticated HTTP POST request to the URL:

```plaintext
YOUR_MANAGEMENT_API_URL/roleassignments
```

Verify that the JSON body conforms to the following schema:

```JSON
{
  "roleId": "YOUR_ROLE_ID",
  "objectId": "YOUR_OBJECT_ID",
  "objectIdType": "YOUR_OBJECT_ID_TYPE",
  "path": "YOUR_PATH",
  "tenantId": "YOUR_TENANT_ID"
}
```

A successful request will return a 201 response status along with the **id** of the newly created role assignment:

```JSON
"d92c7823-6e65-41d4-aaaa-f5b32e3f01b9"
```

## Configuration examples

The following examples demonstrate how to configure your JSON body in several commonly encountered role-assignment scenarios.

* **Example**: A user needs administrative access to a floor of a tenant space.

   ```JSON
   {
    "roleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
    "objectId" : " 0fc863aa-eb51-4704-a312-7d635d70e000",
    "objectIdType" : "UserId",
    "tenantId": " a0c20ae6-e830-4c60-993d-a00ce6032724",
    "path": "/ 000e349c-c0ea-43d4-93cf-6b00abd23a44/ d84e82e6-84d5-45a4-bd9d-006a000e3bab"
   }
   ```

* **Example**: An application runs test scenarios mocking devices and sensors.

   ```JSON
   {
    "roleId": "98e44ad7-28d4-0007-853b-b9968ad132d1",
    "objectId" : "cabf7aaa-af0b-41c5-000a-ce2f4c20000b",
    "objectIdType" : "ServicePrincipalId",
    "tenantId": " a0c20ae6-e000-4c60-993d-a91ce6000724",
    "path": "/"
   }
    ```

* **Example**: All users who are part of a domain receive read access for spaces, sensors, and users. This access includes their corresponding related objects.

   ```JSON
   {
    "roleId": " b1ffdb77-c635-4e7e-ad25-948237d85b30",
    "objectId" : "@microsoft.com",
    "objectIdType" : "DomainName",
    "path": "/000e349c-c0ea-43d4-93cf-6b00abd23a00"
   }
   ```

## Next steps

- To review Azure Digital Twins role-based-access-control, read [Role-base-access-control](./security-authenticating-apis.md).

- To learn about Azure Digital Twins API authentication, read [API authentication](./security-authenticating-apis.md).

<!-- Images -->
[1]: media/security-roles/roleassignments.png
[2]: media/security-roles/system.png
