---
title: Use the REST API to manage organizations in Azure IoT Central
description: How to use the IoT Central REST API to manage organizations in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 03/08/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage organizations

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage organizations in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

## Organizations REST API

The IoT Central REST API lets you:

* Add a organization to your application
* Get a organization by ID
* Update a organization in your application
* Get a list of the organizations in the application
* Delete a organization in your application

### Create Organizations

The REST API lets you create organizations in your IoT Central application. Use the following request to create a organization in your application:

```http
PUT https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.1-preview
```

* organizationId - Unique Id of the organization

The following example shows a request body that adds a organization to a IoT Central application.  

```json
{
  "displayName": "Seattle",
  "parent": "washington"
}
```

The request body has some required fields:

* `@displayName`: Display name of the organization.

The response to this request looks like the following example: 

```json
{
  "id": "seattle",
  "displayName": "Seattle",
  "parent": "washington"
}
```

### Get a organization

Use the following request to retrieve details of a individual organization from your application:

```http
GET https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.1-preview
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
PATCH https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.1-preview
```

The following example shows a request body that updates a organization.

```json
{
  "id": "seattle",
  "displayName": "Seattle Sales",
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
GET https://{your app subdomain}.azureiotcentral.com/api/organizations?api-version=1.1-preview
```

The response to this request looks like the following example. The role value identifies the role ID the user is associated with:

```json
{
    "value": [
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
            "parent": "Washington"
        },
        {
            "id": "seattle",
            "displayName": "Seattle",
            "parent": "Washington"
        }
    ]
}
```

### Delete a user

Use the following request to delete a organization:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=1.1-preview
```

## Next steps

Now that you've learned how to manage users and roles with the REST API, a suggested next step is to [How to use the IoT Central REST API to manage data exports.](howto-manage-data-export-with-rest-api.md)