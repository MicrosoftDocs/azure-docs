---
title: Azure FarmBeats APIs
description: Learn about Azure FarmBeats APIs, which provide agricultural businesses with a standardized RESTful interface with JSON-based responses.
author: sunasing
ms.topic: article
ms.date: 11/04/2019
ms.author: sunasing
---

# Azure FarmBeats APIs

This article describes the Azure FarmBeats APIs. The Azure FarmBeats APIs provide agricultural businesses with a standardized RESTful interface with JSON-based responses to help you take advantage of Azure FarmBeats capabilities, such as:

- APIs to get sensor, camera, drone, weather, satellite, and curated ground data.
- Normalization and contextualization of data across common data providers.
- Schematized access and query capabilities on all ingested data.
- Automatic generation of metadata that can be queried, based on agronomic features.
- Automatically generated time sequence aggregates for rapid model building.
- Integrated Azure Data Factory engine to easily build custom data processing pipelines.

## Application development

The FarmBeats APIs contain Swagger technical documentation.

The following table summarizes all the objects and resources in FarmBeats Datahub:

| Objects and resources | Description
--- | ---|
Farm | Farm corresponds to a physical location of interest within the FarmBeats system. Each farm has a farm name and a unique farm ID. |
Device  | Device corresponds to a physical device present on the farm. Each device has a unique device ID. A device is typically provisioned to a farm with a farm ID.
DeviceModel  | DeviceModel corresponds to the metadata of the device, such as the manufacturer and the type of device, which is either gateway or node.
Sensor  | Sensor corresponds to a physical sensor that records values. A sensor is typically connected to a device with a device ID.
SensorModel  | SensorModel corresponds to the metadata of the sensor, such as the manufacturer, the type of sensor, which is either analog or digital, and the sensor measurement, such as ambient temperature and pressure.
Telemetry  | Telemetry provides the ability to read telemetry messages for a particular sensor and time range.
Job  | Job corresponds to any workflow of activities that are executed in the FarmBeats system to get a desired output. Each job is associated with a job ID and job type.
JobType  | JobType corresponds to different job types supported by the system. System-defined and user-defined job types are included.
ExtendedType  | ExtendedType corresponds to the list of system- and user-defined types in the system. ExtendedType helps set up a new sensor, scene, or scene file type in the FarmBeats system.
Partner  | Partner corresponds to the sensor and imagery integration partner for FarmBeats.
Scene  | Scene corresponds to any generated output in the context of a farm. Each scene has a scene ID, scene source, scene type, and farm ID associated with it. Each scene ID can have multiple scene files associated with it.
SceneFile |SceneFile corresponds to all the files that are generated for a single scene. A single scene ID can have multiple SceneFile IDs associated with it.
Rule  |Rule corresponds to a condition for farm-related data to trigger an alert. Each rule is in the context of a farm's data.
Alert  | Alert corresponds to a notification, which gets generated when a rule condition is met. Each alert is in the context of a rule.
RoleDefinition  | RoleDefinition defines allowed and disallowed actions for a role.
RoleAssignment  |RoleAssignment corresponds to the assignment of a role to a user or a service principal.

### Data format

JSON is a common language-independent data format that provides a simple text representation of arbitrary data structures. For more information, see the [JSON website](https://www.json.org/).

## Authentication and authorization

HTTP requests to the REST API are protected with Microsoft Entra ID.
To make an authenticated request to the REST APIs, client code requires authentication with valid credentials before you can call the API. Authentication is coordinated between the various actors by Microsoft Entra ID. It provides your client with an access token as proof of the authentication. The token is then sent in the HTTP Authorization header of REST API requests. To learn more about Microsoft Entra authentication, see [Microsoft Entra ID](https://portal.azure.com) for developers.

The access token must be sent in subsequent API requests, in the header section, as:

```http
headers = {"Authorization": "Bearer " + **access_token**}
```

### HTTP request headers

Here are the most common request headers that you must specify when you make an API call to Azure FarmBeats Datahub.


**Header** | **Description and example**
--- | ---
Content-Type  | The request format (Content-Type: application/\<format\>). For Azure FarmBeats Datahub APIs, the format is JSON. Content-Type: application/json
Authorization  | Specifies the access token required to make an API call. Authorization: Bearer \<Access-Token\>
Accept | The response format. For Azure FarmBeats Datahub APIs, the format is JSON. Accept: application/json

### API requests

To make a REST API request, you combine the HTTP (GET, POST, PUT, or DELETE) method, the URL to the API service, the URI to a resource to query, submit data to, update, or delete, and then add one or more HTTP request headers.

The URL to the API service is your Datahub URL, for example, `https://<yourdatahub-website-name>.azurewebsites.net`.

Optionally, you can include query parameters on GET calls to filter, limit the size of, and sort the data in the responses.

The following sample request is used to get the list of devices:

```bash
curl -X GET "https://microsoft-farmbeats.azurewebsites.net/Device" -H "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>”
```

Most GET, POST, and PUT calls require a JSON request body.

The following sample request creates a device. This request has input JSON with the request body.

```bash
curl -X POST "https://microsoft-farmbeats.azurewebsites.net/Device" -H  "accept: application/json" -H  "Content-Type: application/json" -H "Authorization: Bearer <Access-Token>" -d "{  \"deviceModelId\": \"ID123\",  \"hardwareId\": \"MHDN123\",  \"reportingInterval\": 900,  \"name\": \"Device123\",  \"description\": \"Test Device 123\",}"
```

### Query parameters

For REST GET calls, you can filter, limit the size of, and sort the data in an API response by including one or more query parameters on the request URI. For the query parameters, see the API documentation and the individual GET calls.
For example, when you query the list of devices (GET call on /Device), the following query parameters can be specified:

![List of devices](./media/references-for-azure-farmbeats/query-parameters-device-1.png)

### Error handling

Azure FarmBeats Datahub APIs return the standard HTTP errors. The most common error codes are as follows:

 |Error code             | Description |
 |---                    | --- |
 |200                    | Success |
 |201                    | Create (Post) Success |
 |400                    | Bad Request. There is an error in the request. |
 |401                    | Unauthorized. The caller of the API is not authorized to access the resource. |
 |404                    | Resource Not Found |
 |5XX                    | Internal Server error. The error codes starting with 5XX means there is some error on the server. Refer to server logs and the following section for more details. |


In addition to the standard HTTP errors, Azure FarmBeats Datahub APIs also return internal errors in the following format:

```json
    {
      "message": "<More information on the error>",
      "status": "<error code>”,
      "code": "<InternalErrorCode>",
      "moreInfo": "<Details of the error>"
    }
```

In this example, when a farm was created, the mandatory field "Name" wasn't specified in the input payload. The resulting error message would be:

 ```json    
    {
      "message": "Model validation failed",
      "status": 400,
      "code": "ModelValidationFailed",
      "moreInfo": "[\"The Name field is required.\"]"
    }
  ```

<a name='add-users-or-app-registrations-to-azure-active-directory'></a>

## Add users or app registrations to Microsoft Entra ID

Azure FarmBeats APIs can be accessed by a user or an app registration in Microsoft Entra ID. To create an app registration in Microsoft Entra ID, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com), and select **Microsoft Entra ID** > **App registrations** > **New registration**. Alternatively, you can use an existing account.
2. For a new account, do the following:

    - Enter a name.
    - Select **Accounts in this organizational directory only (Single tenant)**.
    - Use the default values in the rest of the fields.
    - Select **Register**.

3. On the new and existing app registration **Overview** pane, do the following:

    - Capture the **Client ID** and **Tenant ID**.
    - Go to **Certificates and Secrets** to generate a new client secret and capture the **Client-Secret**.
    - Go back to **Overview**, and select the link next to **Manage Application in local directory**.
    - Go to **Properties** to capture the **Object ID**.

4. Go to your Datahub Swagger (`https://<yourdatahub>.azurewebsites.net/swagger/index.html`) and do the following:
    - Go to the **RoleAssignment API**.
    - Perform a POST to create a **RoleAssignment** object for the **Object ID** you just created.
 
```json
{
  "roleDefinitionId": "a400a00b-f67c-42b7-ba9a-f73d8c67e433",
  "objectId": "objectId from step 3 above",
  "objectIdType": "ServicePrincipalId",
  "tenantId": "tenant id of your Azure subscription"
}
```

  > [!NOTE]
  > For more information on how to add users and Active Directory registration, see [Microsoft Entra ID](../../active-directory/develop/howto-create-service-principal-portal.md).

After you finish the previous steps, your app registration (client) can call the Azure FarmBeats APIs by using an access token via bearer authentication.

Use the access token to send it in subsequent API requests in the header section as:

```http
headers = {"Authorization": "Bearer " + **access_token**, "Content-Type" : "application/json" }
```
