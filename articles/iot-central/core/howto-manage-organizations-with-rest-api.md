---
title: Manage organizations with the REST API in Azure IoT Central
description: How to use the IoT Central REST API to manage organizations in an application. Oganizations let you manage access to application resources.
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage organizations

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage organizations in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

To learn more about organizations in IoT Central Application, see [Manage IoT Central organizations](howto-create-organizations.md).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

## Organizations REST API

The IoT Central REST API lets you:

* Add an organization to your application
* Get an organization by ID
* Update an organization in your application
* Get a list of the organizations in the application
* Delete an organization in your application

### Create organizations

The REST API lets you create organizations in your IoT Central application. Use the following request to create an organization in your application:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=2022-07-31
```

* organizationId - Unique ID of the organization

The following example shows a request body that adds an organization to a IoT Central application.  

```json
{
  "displayName": "Seattle",
}
```

The request body has some required fields:

* `@displayName`: Display name of the organization.

The request body has some optional fields:

* `@parent`:  ID of the parent of the organization.

 If you don't specify a parent, then the organization gets the default top-level organization as its parent.

The response to this request looks like the following example:

```json
{
  "id": "seattle",
  "displayName": "Seattle"
}
```

You can create an organization with hierarchy, for example you can create a sales organization with a parent organization.

The following example shows a request body that adds an organization to a IoT Central application.  

```json
{
  "displayName": "Sales",
  "parent":"seattle"
}
```

The response to this request looks like the following example:

```json
{
  "id": "sales",
  "displayName": "Sales",
  "parent":"Seattle"
}
```

### Get an organization

Use the following request to retrieve details of an individual organization from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "id": "seattle",
  "displayName": "Seattle",
  "parent": "washington"
}
```

### Update an organization

Use the following request to update details of an organization in your application:

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=2022-07-31
```

The following example shows a request body that updates the parent of the organization:

```json
{
  "parent": "washington"
}
```

The response to this request looks like the following example:

```json
{
  "id": "seattle",
  "displayName": "Seattle Sales",
  "parent": "washington"
}
```

### List organizations

Use the following request to retrieve a list of organizations from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/organizations?api-version=2022-07-31
```

The response to this request looks like the following example.

```json
{
    "value": [
        {
            "id": "washington",
            "displayName": "Washington"
        },
        {
            "id": "redmond",
            "displayName": "Redmond"
        },
        {
            "id": "bellevue",
            "displayName": "Bellevue"
        },
        {
            "id": "spokane",
            "displayName": "Spokane",
            "parent": "washington"
        },
        {
            "id": "seattle",
            "displayName": "Seattle",
            "parent": "washington"
        }
    ]
}
```

 The organizations Washington, Redmond, and Bellevue automatically have the application's default top-level organization as their parent.

### Delete an organization

Use the following request to delete an organization:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=2022-07-31
```

## Use organizations

Use organizations to manage access to resources in your application.

### Manage roles

The REST API lets you list the roles defined in your IoT Central application. Use the following request to retrieve a list of application role and organization role IDs from your application. To learn more, see [How to manage IoT Central organizations](howto-create-organizations.md):

```http
GET https://{your app subdomain}.azureiotcentral.com/api/roles?api-version=2022-07-31
```

The response to this request looks like the following example that includes the application role and organization role IDs.

```json
{
    "value": [
        {
            "id": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4",
            "displayName": "Administrator"
        },
        {
            "id": "ae2c9854-393b-4f97-8c42-479d70ce626e",
            "displayName": "Operator"
        },
        {
            "id": "344138e9-8de4-4497-8c54-5237e96d6aaf",
            "displayName": "Builder"
        },
        {
            "id": "c495eb57-eb18-489e-9802-62c474e5645c",
            "displayName": "Org Admin"
        },
        {
            "id": "b4935647-30e4-4ed3-9074-dcac66c2f8ef",
            "displayName": "Org Operator"
        },
        {
            "id": "84cc62c1-dabe-49d3-b16e-8b291232b285",
            "displayName": "Org Viewer"
        }
    ]
}
```

### Create an API token attached to a node in an organization hierarchy

Use the following request to create Create an API token attached to a node in an organization hierarchy in your application:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/apiTokens/{tokenId}?api-version=2022-07-31
```

* tokenId - Unique ID of the token

The following example shows a request body that creates an API token for the *seattle* organization in an IoT Central application.  

```json
{
    "roles": [
        {
            "role": "84cc62c1-dabe-49d3-b16e-8b291232b285",
            "organization": "seattle"
        }
    ]
}
```

The request body has some required fields:

|Name|Description|
|----|-----------|
|role |ID of one of the organization roles|
|organization| ID of the organization|

The response to this request looks like the following example:

```json
{
    "id": "token1",
    "roles": [
        {
            "role": "84cc62c1-dabe-49d3-b16e-8b291232b285",
            "organization": "seattle"
        }
    ],
    "expiry": "2023-07-07T17:05:08.407Z",
    "token": "SharedAccessSignature sr=8a0617**********************4c0d71c&sig=3RyX69G4%2FBZZnG0LXOjQv*************e8s%3D&skn=token1&se=1688749508407"
}
```

### Associate a user with a node in an organization hierarchy

Use the following request to create and associate a user with a node in an organization hierarchy in your application. The ID and email must be unique in the application:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/users/user-001?api-version=2022-07-31
```

In the following request body, the `role` is the ID of one of the organization roles and `organization` is the ID of the organization

```json
{
  "id": "user-001",
  "type": "email",
    "roles": [
        {
            "role": "84cc62c1-dabe-49d3-b16e-8b291232b285",
            "organization": "seattle"
        }
    ],
    "email": "user5@contoso.com"

}
```

The response to this request looks like the following example. The role value identifies which role the user is associated with:

```json
{
    "id": "user-001",
    "type": "email",
    "roles": [
        {
            "role": "84cc62c1-dabe-49d3-b16e-8b291232b285",
            "organization": "seattle"
        }
    ],
    "email": "user5@contoso.com"
}
```

### Add and associate a device to an organization

Use the following request to associate a new device with an organization

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/devices/{deviceId}?api-version=2022-07-31
```

The following example shows a request body that adds a device for a device template. You can get the `template` details from the device templates page in IoT Central application UI.

```json
{
    "displayName": "CheckoutThermostat",
    "template": "dtmi:contoso:Thermostat;1",
    "simulated": true,
    "enabled": true,
    "organizations": [
        "seattle"
    ]
}
```

The request body has some required fields:

* `@displayName`: Display name of the device.
* `@enabled`: declares that this object is an interface.
* `@etag`: ETag used to prevent conflict in device updates.
* `simulated`: Is the device simulated?
* `template` : The device template definition for the device.
* `organizations` : List of organization IDs that the device is a part of. Currently, you can only associate a device with a single organization.

The response to this request looks like the following example:

```json
{
    "id": "thermostat1",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYTdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDIwMDAwMFwiIiwiZGF0YSI6IlwiMzMwMDQ1M2EtMDAwMC0wMzAwLTAwMDAtNjFiODFkMjAwMDAwXCIifQ",
    "displayName": "CheckoutThermostat",
    "simulated": true,
    "provisioned": false,
    "template": "dtmi:contoso:Thermostat;1",
    "enabled": true,
   "organizations": [
    "seattle"
  ]

}
```

### Add and associate a device group to an organization

Use the following request to create and associate a new device group with an organization.

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/deviceGroups/{deviceGroupId}?api-version=2022-07-31
```

When you create a device group, you define a `filter` that selects the devices to add to the group. A `filter` identifies a device template and any properties to match. The following example creates device group that contains all devices associated with the `dtmi:modelDefinition:dtdlv2` template where the `provisioned` property is true.

```json
{
  "displayName": "Device group 1",
  "description": "Custom device group.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true",
  "organizations": [
    "seattle"
  ]
}
```

The request body has some required fields:

* `@displayName`: Display name of the device group.
* `@filter`: Query defining which devices should be in this group.
* `description`: Short summary of device group.
* `organizations` : List of organization IDs that the device is a part of. Currently, you can only associate a device with a single organization.

The response to this request looks like the following example:

```json
{
  "id": "group1",
  "displayName": "Device group 1",
  "description": "Custom device group.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true",
  "organizations": [
    "seattle"
  ]
}
```

## Next steps

Now that you've learned how to manage organizations with the REST API, a suggested next step is to [How to use the IoT Central REST API to manage data exports.](howto-manage-data-export-with-rest-api.md)
