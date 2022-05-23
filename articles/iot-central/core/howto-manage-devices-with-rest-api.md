---
title: How to use the IoT Central REST API to manage devices
description: How to use the IoT Central REST API to add devices in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 12/18/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage devices

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage devices in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

## Devices REST API

The IoT Central REST API lets you:

* Add a device to your application
* Update a device in your application
* Get a list of the devices in the application
* Get a device by ID
* Get a device credential
* Delete a device in your application

### Add a device

Use the following request to create a new device.

```http
PUT https://{subdomain}.{baseDomain}/api/devices/{deviceId}?api-version=1.0
```

The following example shows a request body that adds a device for a device template. You can get the `template` details from the device templates page in IoT Central application UI. 

```json
{
  "displayName": "CheckoutThermostatccc",
  "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
  "simulated": true,
  "enabled": true
}
```

The request body has some required fields:

* `@displayName`: Display name of the device.
* `@enabled`: declares that this object is an interface.
* `@etag`: ETag used to prevent conflict in device updates.
* `simulated`: Whether the device is simulated.
* `template` : The device template definition for the device.

The response to this request looks like the following example: 

```json
{
    "id": "thermostat1",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYTdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDIwMDAwMFwiIiwiZGF0YSI6IlwiMzMwMDQ1M2EtMDAwMC0wMzAwLTAwMDAtNjFiODFkMjAwMDAwXCIifQ",
    "displayName": "CheckoutThermostatccc",
    "simulated": true,
    "provisioned": false,
    "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
    "enabled": true
}
```

### Get a device

Use the following request to retrieve details of a device from your application:

```http
GET https://{subdomain}.{baseDomain}/api/devices/{deviceId}?api-version=1.0
```

>[!NOTE]
> You can get the `deviceId` from IoT Central Application UI by hovering the mouse over a device.

The response to this request looks like the following example:

```json
{
    "id": "5jcwskdwbm",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
    "displayName": "RS40 Occupancy Sensor - 5jcwskdwbm",
    "simulated": false,
    "provisioned": false,
    "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
    "enabled": true
}
```

### Get device credentials

Use the following request to retrieve credentials of a device from your application:

```http
GET https://{subdomain}.{baseDomain}/api/devices/{deviceId}/credentials?api-version=1.0
```

The response to this request looks like the following example:

```json
{
    "idScope": "0ne003E64EF",
    "symmetricKey": {
        "primaryKey": "XUQvxGl6+Q1R0NKN5kOTmLOWsSKiuqs5N9unrjYCH4k=",
        "secondaryKey": "Qp/MTGHjn5MUTw4NVGhRfG+P+L1zh1gtAhO/KH8kn5c="
    }
}
```


### Update a device

```http
PATCH https://{subdomain}.{baseDomain}/api/devices/{deviceId}?api-version=1.0
```

>[!NOTE]
>`{deviceTemplateId}` should be the same as the `@id` in the payload.

The sample request body looks like the following example which updates the `displayName` to the device:

```json
{
  "displayName": "CheckoutThermostat5",
  "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
  "simulated": true,
  "enabled": true
}

```

The response to this request looks like the following example:

```json
{
    "id": "thermostat1",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYTdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDIwMDAwMFwiIiwiZGF0YSI6IlwiMzMwMDQ1M2EtMDAwMC0wMzAwLTAwMDAtNjFiODFkMjAwMDAwXCIifQ",
    "displayName": "CheckoutThermostat5",
    "simulated": true,
    "provisioned": false,
    "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
    "enabled": true
}
```

### Delete a device

Use the following request to delete a device:

```http
DELETE https://{subdomain}.{baseDomain}/api/devices/{deviceId}?api-version=1.0
```

### List devices

Use the following request to retrieve a list of devices from your application:

```http
GET https://{subdomain}.{baseDomain}/api/devices?api-version=1.0
```

The response to this request looks like the following example: 

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "RS40 Occupancy Sensor - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        },
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "CheckoutThermostatccc",
            "simulated": true,
            "provisioned": true,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        }
    ]
}
```

### Use ODATA filters

You can use ODATA filters to filter the results returned by the list devices API.

> [!NOTE]
> Currently, ODATA support is only available for `api-version=1.2-preview`

### $top

Use the **$top** to set the result size, the maximum returned result size is 100, the default size is 25.

Use the following request to retrieve a top 10 device from your application:

```http
GET https://{subdomain}.{baseDomain}/api/devices?api-version=1.2-preview&$top=10
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "RS40 Occupancy Sensor - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        },
        {
            "id": "5jcwskdgdwbm",
            "etag": "eyJoZWdhhZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "RS40 Occupancy Sensor - 5jcwskdgdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulfku:tz5rut2pvx",
            "enabled": true
        },
        ...
    ],
    "nextLink": "https://custom-12qmyn6sm0x.azureiotcentral.com/api/devices?api-version=1.2-preview&%24top=1&%24skiptoken=%257B%2522token%2522%253A%2522%252BRID%253A%7EJWYqAOis7THQbBQAAAAAAg%253D%253D%2523RT%253A1%2523TRC%253A1%2523ISV%253A2%2523IEO%253A65551%2523QCF%253A4%2522%252C%2522range%2522%253A%257B%2522min%2522%253A%2522%2522%252C%2522max%2522%253A%252205C1D7F7591D44%2522%257D%257D"
}
```

The response includes a **nextLink** value that you can use to retrieve the next page of results.

### $filter

Use **$filter** to create expressions that filter the list of devices. The following table shows the comparison operators you can use:


| Comparison Operator | Symbol | Example                                 |
| -------------------- | ------ | --------------------------------------- |
| Equals               | eq     | id eq 'device1' and scopes eq 'redmond' |
| Not Equals           | ne     | Enabled ne true                         |
| Less than or equals       | le     | indexof(displayName, 'device1') le -1   |
| Less than            | lt     | indexof(displayName, 'device1') lt 0    |
| Greater than or equals      | ge     | indexof(displayName, 'device1') ge 0    |
| Greater than           | gt     | indexof(displayName, 'device1') gt 0    |

The following table shows the logic operators you can use in *$filter* expressions:

| Logic Operator | Symbol | Example                               |
| -------------- | ------ | ------------------------------------- |
| AND            | and    | id eq 'device1' and enabled eq true   |
| OR             | or     | id eq 'device1' or simulated eq false |

Currently, *$filter* works with the following device fields:

| FieldName   | Type    | Description               |
| ----------- | ------- | ------------------------- |
| id          | string  | Device ID                 |
| displayName | string  | Device display name       |
| enabled     | boolean | Device enabled status     |
| provisioned | boolean | Device provisioned status |
| simulated   | boolean | Device simulated status   |
| template    | string  | Device template ID        |
| scopes      | string  | organization ID           |

**$filter supported functions:**

Currently, the only supported filter function for device lists is the `indexof` function:

```
$filter=indexof(displayName, 'device1') ge 0
```

The following example shows how to retrieve all the devices where the display name has index the string `thermostat`:

```http
GET https://{subdomain}.{baseDomain}/api/deviceTemplates?api-version=1.2-preview&$filter=index(displayName, 'thermostat')
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "thermostat1",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        },
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "thermostat2",
            "simulated": true,
            "provisioned": true,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        }
    ]
}
```

### $orderby

Use **$orderby** to sort the results. Currently, **$orderby** only lets you sort on **displayName**. By default, **$orderby** sorts in ascending order. Use **desc** to sort in descending order, for example:

```
$orderby=displayName
$orderby=displayName desc
```

The following example shows how to retrieve all the device templates where the result is sorted by `displayName` :

```http
GET https://{subdomain}.{baseDomain}/api/devices?api-version=1.2-preview&$orderby=displayName
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "CheckoutThermostatccc",
            "simulated": true,
            "provisioned": true,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        },
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "RS40 Occupancy Sensor - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        }
    ]
}
```

You can also combine two or more filters.

The following example shows how to retrieve the top 2 device where the display name contains the string `thermostat`.

```http
GET https://{subdomain}.{baseDomain}/api/deviceTemplates?api-version=1.2-preview&$filter=contains(displayName, 'thermostat')&$top=2
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "thermostat1",
            "simulated": false,
            "provisioned": false,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        },
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "thermostat2",
            "simulated": true,
            "provisioned": true,
            "template": "urn:modelDefinition:aqlyr1ulu:tz5rut2pvx",
            "enabled": true
        }
    ]
}
```

## Device groups

### Add a device group

Use the following request to create a new device group.

```http
PUT https://{subdomain}.{baseDomain}/api/deviceGroups/{deviceGroupId}?api-version=1.2-preview
```

When you create a device group, you define a `filter` that selects the devices to add to the group. A `filter` identifies a device template and any properties to match. The following example creates device group that contains all devices associated with the "dtmi:modelDefinition:dtdlv2" template where the `provisioned` property is true

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
* `@etag`: ETag used to prevent conflict in device updates.
* `description`: Short summary of device group.

The organizations field is only used when an application has an organization hierarchy defined. To learn more about organizations, see [Manage IoT Central organizations](howto-edit-device-template.md)

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

### Get a device group

Use the following request to retrieve details of a device group from your application:

```http
GET https://{subdomain}.{baseDomain}/api/deviceGroups/{deviceGroupId}?api-version=1.2-preview
```

* deviceGroupId - Unique ID for the device group.

The response to this request looks like the following example:

```json
{
  "id": "475cad48-b7ff-4a09-b51e-1a9021385453",
  "displayName": "DeviceGroupEntry1",
  "description": "This is a default device group containing all the devices for this particular Device Template.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true",
  "organizations": [
    "seattle"
  ]
}
```

### Update a device group

```http
PATCH https://{subdomain}.{baseDomain}/api/deviceGroups/{deviceGroupId}?api-version=1.2-preview
```

The sample request body looks like the following example which updates the `displayName` of the device group:

```json
{
  "displayName": "New group name"
}

```

The response to this request looks like the following example:

```json
{
  "id": "group1",
  "displayName": "New group name",
  "description": "Custom device group.",
  "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true",
  "organizations": [
    "seattle"
  ]
}
```

### Delete a device group

Use the following request to delete a device group:

```http
DELETE https://{subdomain}.{baseDomain}/api/deviceGroups/{deviceGroupId}?api-version=1.2-preview
```

### List device groups

Use the following request to retrieve a list of device groups from your application:

```http
GET https://{subdomain}.{baseDomain}/api/deviceGroups?api-version=1.2-preview
```

The response to this request looks like the following example: 

```json
{
  "value": [
    {
      "id": "475cad48-b7ff-4a09-b51e-1a9021385453",
      "displayName": "DeviceGroupEntry1",
      "description": "This is a default device group containing all the devices for this particular Device Template.",
      "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:dtdlv2\" AND $provisioned = true",
      "organizations": [
        "seattle"
      ]
    },
    {
      "id": "c2d5ae1d-2cb7-4f58-bf44-5e816aba0a0e",
      "displayName": "DeviceGroupEntry2",
      "description": "This is a default device group containing all the devices for this particular Device Template.",
      "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:model1\"",
      "organizations": [
        "redmond"
      ]
    },
    {
      "id": "241ad72b-32aa-4216-aabe-91b240582c8d",
      "displayName": "DeviceGroupEntry3",
      "description": "This is a default device group containing all the devices for this particular Device Template.",
      "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:model2\" AND $simulated = true"
    },
    {
      "id": "group4",
      "displayName": "DeviceGroupEntry4",
      "description": "This is a default device group containing all the devices for this particular Device Template.",
      "filter": "SELECT * FROM devices WHERE $template = \"dtmi:modelDefinition:model3\""
    }
  ]
}
```


## Next steps

Now that you've learned how to manage devices with the REST API, a suggested next step is to [How to control devices with rest api.](howto-control-devices-with-rest-api.md)
