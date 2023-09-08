---
title: How to use the IoT Central REST API to manage devices
description: Learn how to use the IoT Central REST API to add, modify, delete, and manage devices in an application
author: dominicbetts
ms.author: dobett
ms.date: 03/23/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage devices

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage devices in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to manage devices by using the IoT Central UI, see [Manage individual devices in your Azure IoT Central application.](../core/howto-manage-devices-individually.md)

## Devices REST API

The IoT Central REST API lets you:

* Add a device to your application
* Update a device in your application
* Get a list of the devices in the application
* Get a device by ID
* Get a device credential
* Delete a device in your application
* Filter the list of devices in the application

### Add a device

Use the following request to create a new device.

```http
PUT https://{your app subdomain}/api/devices/{deviceId}?api-version=2022-07-31
```

The following example shows a request body that adds a device for a device template. You can get the `template` details from the device templates page in IoT Central application UI.

```json
{
  "displayName": "CheckoutThermostat",
  "template": "dtmi:contoso:Thermostat;1",
  "simulated": true,
  "enabled": true
}
```

The request body has some required fields:

* `@displayName`: Display name of the device.
* `@enabled`: Declares that this object is an interface.
* `@etag`: ETag used to prevent conflict in device updates.
* `simulated`: Is the device simulated?
* `template` : The device template definition for the device.

The response to this request looks like the following example:

```json
{
    "id": "thermostat1",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYTdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDIwMDAwMFwiIiwiZGF0YSI6IlwiMzMwMDQ1M2EtMDAwMC0wMzAwLTAwMDAtNjFiODFkMjAwMDAwXCIifQ",
    "displayName": "CheckoutThermostat",
    "simulated": true,
    "provisioned": false,
    "template": "dtmi:contoso:Thermostat;1",
    "enabled": true
}
```

### Get a device

Use the following request to retrieve details of a device from your application:

```http
GET https://{your app subdomain}/api/devices/{deviceId}?api-version=2022-07-31
```

>[!NOTE]
> You can get the `deviceId` from IoT Central Application UI by hovering the mouse over a device.

The response to this request looks like the following example:

```json
{
    "id": "5jcwskdwbm",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
    "displayName": "Thermostat - 5jcwskdwbm",
    "simulated": false,
    "provisioned": false,
    "template": "dtmi:contoso:Thermostat;1",
    "enabled": true
}
```

### Get device credentials

Use the following request to retrieve credentials of a device from your application:

```http
GET https://{your app subdomain}/api/devices/{deviceId}/credentials?api-version=2022-07-31
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
PATCH https://{your app subdomain}/api/devices/{deviceId}?api-version=2022-07-31
```

The following sample request body changes the `enabled` field to `false`:

```json
{
  "enabled": false
}

```

The response to this request looks like the following example:

```json
{
    "id": "thermostat1",
    "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYTdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDIwMDAwMFwiIiwiZGF0YSI6IlwiMzMwMDQ1M2EtMDAwMC0wMzAwLTAwMDAtNjFiODFkMjAwMDAwXCIifQ",
    "displayName": "CheckoutThermostat",
    "simulated": true,
    "provisioned": false,
    "template": "dtmi:contoso:Thermostat;1",
    "enabled": false
}
```

### Delete a device

Use the following request to delete a device:

```http
DELETE https://{your app subdomain}/api/devices/{deviceId}?api-version=2022-07-31
```

### List devices

Use the following request to retrieve a list of devices from your application:

```http
GET https://{your app subdomain}/api/devices?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "Thermostat - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        },
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "CheckoutThermostat",
            "simulated": true,
            "provisioned": true,
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        }
    ]
}
```

### Assign a deployment manifest

If you're adding an IoT Edge device, you can use the API to assign an IoT Edge deployment manifest to the device. To learn more, see [Assign a deployment manifest to a device](howto-manage-deployment-manifests-with-rest-api.md#assign-a-deployment-manifest-to-a-device).

### Use ODATA filters

In the preview version of the API (`api-version=2022-10-31-preview`), you can use ODATA filters to filter and sort the results returned by the list devices API.

### maxpagesize

Use the **maxpagesize** to set the result size, the maximum returned result size is 100, the default size is 25.

Use the following request to retrieve a top 10 device from your application:

```http
GET https://{your app subdomain}/api/devices?api-version=2022-10-31-preview&maxpagesize=10
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "Thermostat - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "dtmi:contoso:Thermostat;1",
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
    "nextLink": "https://{your app subdomain}.azureiotcentral.com/api/devices?api-version=2022-07-31&%24top=1&%24skiptoken=%257B%2522token%2522%253A%2522%252BRID%253A%7EJWYqAOis7THQbBQAAAAAAg%253D%253D%2523RT%253A1%2523TRC%253A1%2523ISV%253A2%2523IEO%253A65551%2523QCF%253A4%2522%252C%2522range%2522%253A%257B%2522min%2522%253A%2522%2522%252C%2522max%2522%253A%252205C1D7F7591D44%2522%257D%257D"
}
```

The response includes a **nextLink** value that you can use to retrieve the next page of results.

### filter

Use **filter** to create expressions that filter the list of devices. The following table shows the comparison operators you can use:

| Comparison Operator    | Symbol | Example                                   |
|------------------------|--------|-------------------------------------------|
| Equals                 | eq     | `id eq 'device1' and scopes eq 'redmond'` |
| Not Equals             | ne     | `Enabled ne true`                         |
| Less than or equals    | le     | `id le '26whl7mure6'`                     |
| Less than              | lt     | `id lt '26whl7mure6'`                     |
| Greater than or equals | ge     | `id ge '26whl7mure6'`                     |
| Greater than           | gt     | `id gt '26whl7mure6'`                     |

The following table shows the logic operators you can use in *filter* expressions:

| Logic Operator | Symbol | Example                               |
| -------------- | ------ | ------------------------------------- |
| AND            | and    | `id eq 'device1' and enabled eq true`   |
| OR             | or     | `id eq 'device1' or simulated eq false` |

Currently, *filter* works with the following device fields:

| FieldName   | Type    | Description               |
| ----------- | ------- | ------------------------- |
| `id`          | string  | Device ID                 |
| `displayName` | string  | Device display name       |
| `enabled`     | boolean | Device enabled status     |
| `provisioned` | boolean | Device provisioned status |
| `simulated`   | boolean | Device simulated status   |
| `template`    | string  | Device template ID        |
| `scopes`      | string  | organization ID           |

**filter supported functions:**

Currently, the only supported filter function for device lists is the `contains` function:

```http
filter=contains(displayName, 'device1')
```

The following example shows how to retrieve all the devices where the display name contains the string `thermostat`:

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&filter=contains(displayName, 'thermostat')
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
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        },
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "thermostat2",
            "simulated": true,
            "provisioned": true,
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        }
    ]
}
```

### orderby

Use **orderby** to sort the results. Currently, **orderby** only lets you sort on **displayName**. By default, **orderby** sorts in ascending order. Use **desc** to sort in descending order, for example:

```http
orderby=displayName
orderby=displayName desc
```

The following example shows how to retrieve all the device templates where the result is sorted by `displayName` :

```http
GET https://{your app subdomain}/api/devices?api-version=2022-10-31-preview&orderby=displayName
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "ccc",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDAwYjdkLTAwMDAtMDMwMC0wMDAwLTYxYjgxZDJjMDAwMFwiIn0",
            "displayName": "CheckoutThermostat",
            "simulated": true,
            "provisioned": true,
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        },
        {
            "id": "5jcwskdwbm",
            "etag": "eyJoZWFkZXIiOiJcIjI0MDBlMDdjLTAwMDAtMDMwMC0wMDAwLTYxYjgxYmVlMDAwMFwiIn0",
            "displayName": "Thermostat - 5jcwskdwbm",
            "simulated": false,
            "provisioned": false,
            "template": "dtmi:contoso:Thermostat;1",
            "enabled": true
        }
    ]
}
```

You can also combine two or more filters.

The following example shows how to retrieve the top three devices where the display name contains the string `Thermostat`.

```http
GET https://{your app subdomain}/api/deviceTemplates?api-version=2022-10-31-preview&filter=contains(displayName, 'Thermostat')&maxpagesize=3
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "id": "1fpwlahp0zp",
      "displayName": "Thermostat - 1fpwlahp0zp",
      "simulated": false,
      "provisioned": false,
      "etag": "eyJwZ0luc3RhbmNlIjoiYTRjZGQyMjQtZjIxMi00MTI4LTkyMTMtZjcwMTBlZDhkOWQ0In0=",
      "template": "dtmi:contoso:mythermostattemplate;1",
      "enabled": true
    },
    {
      "id": "1yg0zvpz9un",
      "displayName": "Thermostat - 1yg0zvpz9un",
      "simulated": false,
      "provisioned": false,
      "etag": "eyJwZ0luc3RhbmNlIjoiZGQ1YTY4MDUtYzQxNS00ZTMxLTgxM2ItNTRiYjdiYWQ1MWQ2In0=",
      "template": "dtmi:contoso:mythermostattemplate;1",
      "enabled": true
    },
    {
      "id": "20cp9l96znn",
      "displayName": "Thermostat - 20cp9l96znn",
      "simulated": false,
      "provisioned": false,
      "etag": "eyJwZ0luc3RhbmNlIjoiNGUzNWM4OTItNDBmZi00OTcyLWExYjUtM2I4ZjU5NGZkODBmIn0=",
      "template": "dtmi:contoso:mythermostattemplate;1",
      "enabled": true
    }
  ],
  "nextLink": "https://{your app subdomain}.azureiotcentral.com/api/devices?api-version=2022-10-31-preview&filter=contains%28displayName%2C+%27Thermostat%27%29&maxpagesize=3&$skiptoken=aHR0cHM6Ly9pb3RjLXByb2QtbG4taW5ma3YteWRtLnZhdWx0LmF6dXJlLm5ldC9zZWNyZXRzL2FwaS1lbmMta2V5LzY0MzZkOTY2ZWRjMjRmMDQ5YWM1NmYzMzFhYzIyZjZi%3AgWMDkfdpzBF0eYiYCGRdGQ%3D%3D%3ATVTgi5YVv%2FBfCd7Oos6ayrCIy9CaSUVu2ULktGQoHZDlaN7uPUa1OIuW0MCqT3spVXlSRQ9wgNFXsvb6mXMT3WWapcDB4QPynkI%2FE1Z8k7s3OWiBW3EQpdtit3JTCbj8qRNFkA%3D%3D%3Aq63Js0HL7OCq%2BkTQ19veqA%3D%3D"
}
```

## Device groups

You can create device groups in an IoT Central application to monitor aggregate data, to use with jobs, and to manage access. Device groups are defined by a filter that selects the devices to add to the group. You can create device groups in the IoT Central portal or by using the API.

### Add a device group

Use the following request to create a new device group.

```http
PUT https://{your app subdomain}/api/deviceGroups/{deviceGroupId}?api-version=2022-07-31
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
GET https://{your app subdomain}/api/deviceGroups/{deviceGroupId}?api-version=2022-07-31
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
PATCH https://{your app subdomain}/api/deviceGroups/{deviceGroupId}?api-version=2022-07-31
```

The sample request body looks like the following example that updates the `displayName` of the device group:

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
DELETE https://{your app subdomain}/api/deviceGroups/{deviceGroupId}?api-version=2022-07-31
```

### List device groups

Use the following request to retrieve a list of device groups from your application:

```http
GET https://{your app subdomain}/api/deviceGroups?api-version=2022-07-31
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

## Enrollment groups

Enrollment groups are used to manage the device authentication options in your IoT Central application. To learn more, see [Device authentication concepts in IoT Central](concepts-device-authentication.md).

To learn how to create and manage enrollment groups in the UI, see [How to connect devices with X.509 certificates to IoT Central Application](how-to-connect-devices-x509.md).

## Create an enrollment group

### [X509](#tab/X509)

When you create an enrollment group for devices that use X.509 certificates, you first need to upload the root or intermediate certificate to your IoT Central application.

### Generate root and device certificates

In this section, you generate the X.509 certificates you need to connect a device to IoT Central.

> [!WARNING]
> This way of generating X.509 certs is for testing only. For a production environment you should use your official, secure mechanism for certificate generation.

1. Navigate to the certificate generator script in the Microsoft Azure IoT SDK for Node.js you downloaded. Install the required packages:

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

1. Create a root certificate and then derive a device certificate by running the script:

    ```cmd/sh
    node create_test_cert.js root mytestrootcert
    node create_test_cert.js device sample-device-01 mytestrootcert
    ```

    > [!TIP]
    > A device ID can contain letters, numbers, and the `-` character.

These commands produce the following root and the device certificate

| filename | contents |
| -------- | -------- |
| mytestrootcert_cert.pem | The public portion of the root X.509 certificate |
| mytestrootcert_key.pem | The private key for the root X.509 certificate |
| mytestrootcert_fullchain.pem | The entire keychain for the root X.509 certificate. |
| mytestrootcert.pfx | The PFX file for the root X.509 certificate. |
| sampleDevice01_cert.pem | The public portion of the device X.509 certificate |
| sampleDevice01_key.pem | The private key for the device X.509 certificate |
| sampleDevice01_fullchain.pem | The entire keychain for the device X.509 certificate. |
| sampleDevice01.pfx | The PFX file for the device X.509 certificate. |

Make a note of the location of these files. You need it later.

### Generate the base-64 encoded version of the root certificate

In the folder on your local machine that contains the certificates you generated, create a file called convert.js and add the following JavaScript content:

```javascript
const fs = require('fs')
const fileContents = fs.readFileSync(process.argv[2]).toString('base64');
console.log(fileContents);
```

Run the following command to generate a base-64 encode version of the certificate:

```cmd/sh
node convert.js mytestrootcert_cert.pem
```

Make a note of the base-64 encoded version of the certificate. You need it later.

### Add an X.509 enrollment group

Use the following request to create a new enrollment group with `myx509eg` as the ID:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg?api-version=2022-07-31
```

The following example shows a request body that adds a new X.509 enrollment group:

```json
{
  "displayName": "My group",
  "enabled": true,
  "type": "iot",
  "attestation": {
    "type": "x509"
  }
}

```

The request body has some required fields:

* `@displayName`: Display name of the enrollment group.
* `@enabled`: Whether the devices using the group are allowed to connect to IoT Central.
* `@type`: Type of devices that connect through the group, either `iot` or `iotEdge`.
* `attestation`: The attestation mechanism for the enrollment group, either `symmetricKey` or `x509`.

The response to this request looks like the following example:

```json
{
    "id": "myEnrollmentGroupId",
    "displayName": "My group",
    "enabled": true,
    "type": "iot",
    "attestation": {
        "type": "x509",
        "x509": {
            "signingCertificates": {}
        }
    },
    "etag": "IjdiMDcxZWQ5LTAwMDAtMDcwMC0wMDAwLTYzMWI3MWQ4MDAwMCI="
}
```

### Add an X.509 certificate to an enrollment group

Use the following request to set the primary X.509 certificate of the myx509eg enrollment group:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg/certificates/primary?api-version=2022-07-31
```

entry - Entry of certificate, either `primary` or `secondary`

Use this request to add either a primary or secondary X.509 certificate to the enrollment group.

The following example shows a request body that adds an X.509 certificate to an enrollment group:

```json
{
  "verified": false,
  "certificate": "<base64-certificate>"
}
```

* certificate - The base-64 version of the certificate you made a note of previously.
* verified - `true` if you attest that the certificate is valid, `false` if you need to prove the validity of the certificate.

The response to this request looks like the following example:

```json
{
  "verified": false,
  "info": {
    "sha1Thumbprint": "644543467786B60C14DFE6B7C968A1990CF63EAC"
  },
  "etag": "IjE3MDAwODNhLTAwMDAtMDcwMC0wMDAwLTYyNjFmNzk0MDAwMCI="
}
```

### Generate verification code for an X.509 certificate

Use the following request to generate a verification code for the primary or secondary X.509 certificate of an enrollment group.

If you set `verified` to `false` in the previous request, use the following request to generate a verification code for the primary X.509 certificate in the `myx509eg` enrollment group:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg/certificates/primary/generateVerificationCode?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "verificationCode": "<certificate-verification-code>"
}
```

Make a note of the verification code, you need it in the next step.

### Generate the verification certificate

Use the following command to generate a verification certificate from the verification code in the previous step:

  ```cmd/sh
  node create_test_cert.js verification --ca mytestrootcert_cert.pem --key mytestrootcert_key.pem --nonce  {verification-code}
  ```

Run the following command to generate a base-64 encoded version of the certificate:

```cmd/sh
node convert.js verification_cert.pem
```

Make a note of the base-64 encoded version of the certificate. You need it later.

### Verify X.509 certificate of an enrollment group

Use the following request to verify the primary X.509 certificate of the `myx509eg` enrollment group by providing the certificate with the signed verification code:

```http
POST PUT https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg/certificates/primary/verify?api-version=2022-07-31
```

The following example shows a request body that verifies an X.509 certificate:

```json
{
  "certificate": "base64-verification-certificate"
}
```

### Get X.509 certificate of an enrollment group

Use the following request to retrieve details of X.509 certificate of an enrollment group from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg/certificates/primary?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "verified": true,
  "info": {
    "sha1Thumbprint": "644543467786B60C14DFE6B7C968A1990CF63EAC"
  },
  "etag": "IjE3MDAwODNhLTAwMDAtMDcwMC0wMDAwLTYyNjFmNzk0MDAwMCI="
}
```

### Delete an X.509 certificate from an enrollment group

Use the following request to delete the primary X.509 certificate from an enrollment group with ID `myx509eg`:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg/certificates/primary?api-version=2022-07-31
```

### [Symmetric key](#tab/symmetric-key)

### Add a symmetric key enrollment group

Use the following request to create a new enrollment group with `mysymmetric` as the ID:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/mysymmetric?api-version=2022-07-31
```

The following example shows a request body that adds a new enrollment group:

```json
{
  "displayName": "My group",
  "enabled": true,
  "type": "iot",
  "attestation": {
    "type": "symmetricKey"
  }
}
```

The response to this request looks like the following example:

```json
{
  "id": "mysymmetric",
  "displayName": "My group",
  "enabled": true,
  "type": "iot",
  "attestation": {
    "type": "symmetricKey",
    "symmetricKey": {
      "primaryKey": "<primary-symmetric-key>",
      "secondaryKey": "<secondary-symmetric-key>"
    }
  },
  "etag": "IjA4MDUwMTJiLTAwMDAtMDcwMC0wMDAwLTYyODJhOWVjMDAwMCI="
}
```

IoT Central generates the primary and secondary symmetric keys when you make this API call.

---

### Get an enrollment group

Use the following request to retrieve details of an enrollment group with `mysymmetric` as the ID:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/mysymmetric?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "id": "mysymmetric",
  "displayName": "My group",
  "enabled": true,
  "type": "iot",
  "attestation": {
    "type": "symmetricKey",
    "symmetricKey": {
      "primaryKey": "<primary-symmetric-key>",
      "secondaryKey": "<secondary-symmetric-key>"
    }
  },
  "etag": "IjA4MDUwMTJiLTAwMDAtMDcwMC0wMDAwLTYyODJhOWVjMDAwMCI="
}
```

### Update an enrollment group

Use the following request to update an enrollment group.

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg?api-version=2022-07-31
```

The following example shows a request body that updates the display name of an enrollment group:

```json
{
  "displayName": "My new group name",
}
```

The response to this request looks like the following example:

```json
{
  "id": "myEnrollmentGroupId",
  "displayName": "My new group name",
  "enabled": true,
  "type": "iot",
  "attestation": {
    "type": "symmetricKey",
    "symmetricKey": {
      "primaryKey": "<primary-symmetric-key>",
      "secondaryKey": "<secondary-symmetric-key>"
    }
  },
  "etag": "IjA4MDUwMTJiLTAwMDAtMDcwMC0wMDAwLTYyODJhOWVjMDAwMCI="
}
```

### Delete an enrollment group

Use the following request to delete an enrollment group with ID `myx509eg`:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups/myx509eg?api-version=2022-07-31
```

### List enrollment groups

Use the following request to retrieve a list of enrollment groups from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/enrollmentGroups?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "myEnrollmentGroupId",
            "displayName": "My group",
            "enabled": true,
            "type": "iot",
            "attestation": {
                "type": "symmetricKey",
                "symmetricKey": {
                    "primaryKey": "primaryKey",
                    "secondaryKey": "secondarykey"
                }
            },
            "etag": "IjZkMDc1YTgzLTAwMDAtMDcwMC0wMDAwLTYzMTc5ZjA4MDAwMCI="
        },
        {
            "id": "enrollmentGroupId2",
            "displayName": "My group",
            "enabled": true,
            "type": "iot",
            "attestation": {
                "type": "x509",
                "x509": {
                    "signingCertificates": {}
                }
            },
            "etag": "IjZkMDdjNjkyLTAwMDAtMDcwMC0wMDAwLTYzMTdhMDY1MDAwMCI="
        }
    ]
}
```

## Next steps

Now that you've learned how to manage devices with the REST API, a suggested next step is to [How to control devices with rest api.](howto-control-devices-with-rest-api.md)
