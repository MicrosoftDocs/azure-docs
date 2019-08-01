---
title: Azure Digital Twins common query patterns | Microsoft Docs
description: Learn common patterns of querying the Azure Digital Twins management APIs.
author: kingdomofends
manager: philmea
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: v-adgera
---

# How to query Azure Digital Twins APIs for common tasks

This article shows query patterns to help you execute common scenarios for your Azure Digital Twins instance. This assumes that your Digital Twins instance is already running. You can use any REST client, such as Postman. 

[!INCLUDE [digital-twins-management-api](../../includes/digital-twins-management-api.md)]


## Queries for spaces and types

This section shows sample queries to get more information about your provisioned spaces. Make authenticated GET HTTP requests with the sample queries, replacing the placeholders with values from your setup. 

- Get spaces which are root nodes.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?$filter=ParentSpaceId eq null
    ```

- Get a space by name and include devices, sensors, computed values, and sensor values. 

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?name=Focus Room A1&includes=fullpath,devices,sensors,values,sensorsvalues
    ```

- Get spaces and their device/sensor information, whose parent is the given space ID, and which are at levels two to five [relative to the given space](how-to-navigate-apis.md#api-navigation). 

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?spaceId=YOUR_SPACE_ID&includes=fullpath,devices,sensors,values,sensorsvalues&traverse=Down&minLevel=1&minRelative=true&maxLevel=5&maxRelative=true
    ```

- Get the space with the given ID, and include computed and sensor values.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?ids=YOUR_SPACE_ID&includes=Values,sensors,SensorsValues
    ```

- Get property keys for a particular space.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/propertykeys?spaceId=YOUR_SPACE_ID
    ```

- Get spaces with property key named *AreaInSqMeters* and its value is 30. You can also do string operations, for example, get spaces containing property key with `name = X contains Y`.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?propertyKey=AreaInSqMeters&propertyValue=30
    ```

- Get all names with name *Temperature* and associated dependencies and ontologies.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/types?names=Temperature&includes=space,ontologies,description,fullpath
    ```


## Queries for roles and role assignments

This section shows some queries to get more information on roles and their assignments. 

- Get all roles supported by Azure Digital Twins.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/system/roles
    ```

- Get all role assignments in your Digital Twins instance. 

    ```plaintext
    YOUR_MANAGEMENT_API_URL/roleassignments?path=/&traverse=down
    ```

- Get role assignments on a particular path.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/roleassignments?path=/A_SPATIAL_PATH
    ```

## Queries for devices

This section shows some examples of how you can use the Management APIs to get specific information about your devices. All API calls need to be authenticated GET HTTP requests.

- Get all devices.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices
    ```

- Find all device statuses.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/system/devices/statuses
    ```

- Get a specific device.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices/YOUR_DEVICE_ID
    ```

- Get all devices attached to the root space.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?maxLevel=1
    ```

- Get all devices attached to spaces at levels 2 through 4.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?minLevel=2&maxLevel=4
    ```

- Get all devices directly attached to a particular space ID.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID
    ```

- Get all devices attached to a particular space and its descendants.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Down
    ```

- Get all devices attached to descendants of a space, excluding that space.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Down&minLevel=1&minRelative=true
    ```

- Get all devices attached to direct children of a space.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Down&minLevel=1&minRelative=true&maxLevel=1&maxRelative=true
    ```

- Get all devices attached to one of the ancestors of a space.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Up&maxLevel=-1&maxRelative=true
    ```

- Get all devices attached to descendants of a space that are of level smaller than or equal to 5.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Down&maxLevel=5
    ```

- Get all devices attached to spaces that are at the same level as the space with ID *YOUR_SPACE_ID*.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?spaceId=YOUR_SPACE_ID&traverse=Span&minLevel=0&minRelative=true&maxLevel=0&maxRelative=true
    ```

- Get the IoT Hub device connection string for your device.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices/YOUR_DEVICE_ID?includes=ConnectionString
    ```

- Get device with the given hardware ID, including attached sensors.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/devices?hardwareIds=YOUR_DEVICE_HARDWARE_ID&includes=sensors
    ```

- Get sensors for particular data types, in this case *Motion* and *Temperature*.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/sensors?dataTypes=Motion,Temperature
    ```

## Queries for matchers and user-defined functions 

- Get all provisioned matchers and their IDs.

   ```plaintext
    YOUR_MANAGEMENT_API_URL/matchers
    ```

- Get details about a particular matcher, including the spaces and user-defined function associated with it.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/matchers/YOUR_MATCHER_ID?includes=description, conditions, fullpath, userdefinedfunctions, space
    ```

- Evaluate a matcher against a sensor and enable logging for debugging purposes. The return of this HTTP GET message tells you whether the matcher and the sensor belong to the data type. 

   ```plaintext
    YOUR_MANAGEMENT_API_URL/matchers/YOUR_MATCHER_ID/evaluate/YOUR_SENSOR_ID?enableLogging=true
    ```

- Get the ID of the user-defined functions. 

   ```plaintext
    YOUR_MANAGEMENT_API_URL/userdefinedfunctions
    ```

- Get the contents of a particular user-defined function 

   ```plaintext
    YOUR_MANAGEMENT_API_URL/userdefinedfunctions/YOUR_USER_DEFINED_FUNCTION_ID/contents
    ```


## Queries for users

This section shows some sample API queries for managing users in Azure Digital Twins. Make an HTTP GET request replacing the placeholders with values from your setup. 

- Get all users. 

    ```plaintext
    YOUR_MANAGEMENT_API_URL/users
    ```

- Get a specific user.

    ```plaintext
    YOUR_MANAGEMENT_API_URL/users/ANY_USER_ID
    ```

## Next steps

To learn how to authenticate with your Management API, read [Authenticating with APIs](./security-authenticating-apis.md).

To learn more about your API endpoints, read [How to use Digital Twins Swagger](./how-to-use-swagger.md).
