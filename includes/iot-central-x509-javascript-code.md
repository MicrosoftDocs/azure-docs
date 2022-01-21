---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 12/17/2021
---

To modify the sample code to use the X.509 certificates:

1. Navigate to the _azure-iot-sdk-node/device/samples/javascript_ folder that contains the **pnp_temperature_controller.js** application and run the following command to install the X.509 package:

    ```cmd/sh
    npm install azure-iot-security-x509 --save
    ```

1. Open the **pnp_temperature_controller.js** file in a text editor.

1. Edit the `require` statements to include the following code:

    ```javascript
    const fs = require('fs');
    const X509Security = require('azure-iot-security-x509').X509Security;
    ```

1. Add the following four lines to the "DPS connection information" section to initialize the `deviceCert` variable:

    ```javascript
    const deviceCert = {
      cert: fs.readFileSync(process.env.IOTHUB_DEVICE_X509_CERT).toString(),
      key: fs.readFileSync(process.env.IOTHUB_DEVICE_X509_KEY).toString()
    };
    ```

1. Edit the `provisionDevice` function that creates the client by replacing the first line with the following code:

    ```javascript
    var provSecurityClient = new X509Security(registrationId, deviceCert);
    ```

1. In the same function, modify the line that sets the `deviceConnectionString` variable as follows:

    ```javascript
    deviceConnectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';x509=true';
    ```

1. In the `main` function, add the following line after the line that calls `Client.fromConnectionString`:

    ```javascript
    client.setOptions(deviceCert);
    ```

    Save the changes.
