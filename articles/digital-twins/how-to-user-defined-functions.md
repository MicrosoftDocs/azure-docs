---
title: 'How to create user-defined functions in Azure Digital Twins | Microsoft Docs'
description: How to create user-defined functions, matchers, and role assignments in Azure Digital Twins.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 06/06/2019
ms.author: alinast
ms.custom: seodec18
---

# How to create user-defined functions in Azure Digital Twins

[User-defined functions](./concepts-user-defined-functions.md) enable users to configure custom logic to be executed from incoming telemetry messages and spatial graph metadata. Users can also send events to predefined [endpoints](./how-to-egress-endpoints.md).

This guide walks through an example demonstrating how to detect and alert on any reading that exceeds a certain temperature from received temperature events.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

## Client library reference

Functions available as helper methods in the user-defined functions runtime are listed in the [client library reference](./reference-user-defined-functions-client-library.md) document.

## Create a matcher

Matchers are graph objects that determine what user-defined functions run for a given telemetry message.

- Valid matcher condition comparisons:

  - `Equals`
  - `NotEquals`
  - `Contains`

- Valid matcher condition targets:

  - `Sensor`
  - `SensorDevice`
  - `SensorSpace`

The following example matcher evaluates to true on any sensor telemetry event with `"Temperature"` as its data type value. You can create multiple matchers on a user-defined function by making an authenticated HTTP POST request to:

```plaintext
YOUR_MANAGEMENT_API_URL/matchers
```

With JSON body:

```JSON
{
  "Name": "Temperature Matcher",
  "Conditions": [
    {
      "target": "Sensor",
      "path": "$.dataType",
      "value": "\"Temperature\"",
      "comparison": "Equals"
    }
  ],
  "SpaceId": "YOUR_SPACE_IDENTIFIER"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_SPACE_IDENTIFIER | Which server region your instance is hosted on |

## Create a user-defined function

Creating a user-defined function involves making a multipart HTTP request to the Azure Digital Twins Management APIs.

[!INCLUDE [Digital Twins multipart requests](../../includes/digital-twins-multipart.md)]

After the matchers are created, upload the function snippet with the following authenticated multipart HTTP POST request to:

```plaintext
YOUR_MANAGEMENT_API_URL/userdefinedfunctions
```

Use the following body:

```plaintext
--USER_DEFINED_BOUNDARY
Content-Type: application/json; charset=utf-8
Content-Disposition: form-data; name="metadata"

{
  "spaceId": "YOUR_SPACE_IDENTIFIER",
  "name": "User Defined Function",
  "description": "The contents of this udf will be executed when matched against incoming telemetry.",
  "matchers": ["YOUR_MATCHER_IDENTIFIER"]
}
--USER_DEFINED_BOUNDARY
Content-Disposition: form-data; name="contents"; filename="userDefinedFunction.js"
Content-Type: text/javascript

function process(telemetry, executionContext) {
  // Code goes here.
}

--USER_DEFINED_BOUNDARY--
```

| Value | Replace with |
| --- | --- |
| USER_DEFINED_BOUNDARY | A multipart content boundary name |
| YOUR_SPACE_IDENTIFIER | The space identifier  |
| YOUR_MATCHER_IDENTIFIER | The ID of the matcher you want to use |

1. Verify that the headers include: `Content-Type: multipart/form-data; boundary="USER_DEFINED_BOUNDARY"`.
1. Verify that the body is multipart:

   - The first part contains the required user-defined function metadata.
   - The second part contains the JavaScript compute logic.

1. In the **USER_DEFINED_BOUNDARY** section, replace the **spaceId** (`YOUR_SPACE_IDENTIFIER`) and **matchers** (`YOUR_MATCHER_IDENTIFIER`)  values.
1. Verify that the JavaScript user-defined function is supplied as `Content-Type: text/javascript`.

### Example functions

Set the sensor telemetry reading directly for the sensor with data type **Temperature**, which is `sensor.DataType`:

```JavaScript
function process(telemetry, executionContext) {

  // Get sensor metadata
  var sensor = getSensorMetadata(telemetry.SensorId);

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Set the sensor reading as the current value for the sensor.
  setSensorValue(telemetry.SensorId, sensor.DataType, parseReading.SensorValue);
}
```

The **telemetry** parameter exposes the **SensorId** and **Message** attributes, corresponding to a message sent by a sensor. The **executionContext** parameter exposes the following attributes:

```csharp
var executionContext = new UdfExecutionContext
{
    EnqueuedTime = request.HubEnqueuedTime,
    ProcessorReceivedTime = request.ProcessorReceivedTime,
    UserDefinedFunctionId = request.UserDefinedFunctionId,
    CorrelationId = correlationId.ToString(),
};
```

In the next example, we log a message if the sensor telemetry reading surpasses a predefined threshold. If your diagnostic settings are enabled on the Azure Digital Twins instance, logs from user-defined functions are also forwarded:

```JavaScript
function process(telemetry, executionContext) {

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Example sensor telemetry reading range is greater than 0.5
  if(parseFloat(parseReading.SensorValue) > 0.5) {
    log(`Alert: Sensor with ID: ${telemetry.SensorId} detected an anomaly!`);
  }
}
```

The following code triggers a notification if the temperature level rises above the predefined constant:

```JavaScript
function process(telemetry, executionContext) {

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Define threshold
  var threshold = 70;

  // Trigger notification 
  if(parseInt(parseReading) > threshold) {
    var alert = {
      message: 'Temperature reading has surpassed threshold',
      sensorId: telemetry.SensorId,
      reading: parseReading
    };

    sendNotification(telemetry.SensorId, "Sensor", JSON.stringify(alert));
  }
}
```

For a more complex user-defined function code sample, see the [Occupancy quickstart](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/availability.js).

## Create a role assignment

Create a role assignment for the user-defined function to run under. If no role assignment exists for the user-defined function, it won't have the proper permissions to interact with the Management API or have access to perform actions on graph objects. Actions that a user-defined function may perform are specified and defined via role-based access control within the Azure Digital Twins Management APIs. For example, user-defined functions can be limited in scope by specifying certain roles or certain access control paths. For more information, see the [Role-based access control](./security-role-based-access-control.md) documentation.

1. [Query the System API](./security-create-manage-role-assignments.md#all) for all roles to get the role ID you want to assign to your user-defined function. Do so by making an authenticated HTTP GET request to:

    ```plaintext
    YOUR_MANAGEMENT_API_URL/system/roles
    ```
   Keep the desired role ID. It will be passed as the JSON body attribute **roleId** (`YOUR_DESIRED_ROLE_IDENTIFIER`) below.

1. **objectId** (`YOUR_USER_DEFINED_FUNCTION_ID`) will be the user-defined function ID that was created earlier.
1. Find the value of **path** (`YOUR_ACCESS_CONTROL_PATH`) by querying your spaces with `fullpath`.
1. Copy the returned `spacePaths` value. You'll use that below. Make an authenticated HTTP GET request to:

    ```plaintext
    YOUR_MANAGEMENT_API_URL/spaces?name=YOUR_SPACE_NAME&includes=fullpath
    ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_SPACE_NAME | The name of the space you wish to use |

1. Paste the returned `spacePaths` value into **path** to create a user-defined function role assignment by making an authenticated HTTP POST request to:

    ```plaintext
    YOUR_MANAGEMENT_API_URL/roleassignments
    ```
    With JSON body:

    ```JSON
    {
      "roleId": "YOUR_DESIRED_ROLE_IDENTIFIER",
      "objectId": "YOUR_USER_DEFINED_FUNCTION_ID",
      "objectIdType": "YOUR_USER_DEFINED_FUNCTION_TYPE_ID",
      "path": "YOUR_ACCESS_CONTROL_PATH"
    }
    ```

    | Value | Replace with |
    | --- | --- |
    | YOUR_DESIRED_ROLE_IDENTIFIER | The identifier for the desired role |
    | YOUR_USER_DEFINED_FUNCTION_ID | The ID for the user-defined function you want to use |
    | YOUR_USER_DEFINED_FUNCTION_TYPE_ID | The ID specifying the user-defined function type |
    | YOUR_ACCESS_CONTROL_PATH | The access control path |

>[!TIP]
> Read the article [How to create and manage role assignments](./security-create-manage-role-assignments.md) for more information about user-defined function Management API operations and endpoints.

## Send telemetry to be processed

The sensor defined in the spatial intelligence graph sends telemetry. In turn, the telemetry triggers the execution of the user-defined function that was uploaded. The data processor picks up the telemetry. Then an execution plan is created for the invocation of the user-defined function.

1. Retrieve the matchers for the sensor the reading was generated from.
1. Depending on what matchers were evaluated successfully, retrieve the associated user-defined functions.
1. Execute each user-defined function.

## Next steps

- Learn how to [create Azure Digital Twins endpoints](./how-to-egress-endpoints.md) to send events to.

- For more details about routing in Azure Digital Twins, read [Routing events and messages](./concepts-events-routing.md).

- Review the [client library reference documentation](./reference-user-defined-functions-client-library.md).
