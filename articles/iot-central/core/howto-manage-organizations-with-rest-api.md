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

> [!TIP]
> The [organizations feature](howto-create-organizations.md) is currently available in [preview API](/rest/api/iotcentral/1.2-previewdataplane/users).

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
PUT https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.2-preview
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
GET https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.2-preview
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
PATCH https://{subdomain}.{baseDomain}/api/organizations/{organizationId}?api-version=1.2-preview
```

The following example shows a request body that updates an organization.

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
GET https://{your app subdomain}.azureiotcentral.com/api/organizations?api-version=1.2-preview
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

 The organizations Washington, Redmond, and Bellevue will automatically have the application's default top-level organization as their parent.

### Delete an organization

Use the following request to delete an organization:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/organizations/{organizationId}?api-version=1.2-preview
```

## Next steps

Now that you've learned how to manage organizations with the REST API, a suggested next step is to [How to use the IoT Central REST API to manage data exports.](howto-manage-data-export-with-rest-api.md)