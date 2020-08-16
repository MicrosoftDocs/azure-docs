---
title: Connect devices with X.509 certificates in Azure IoT Central Application
description: How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application
author: v-krghan
ms.author: v-krghan
ms.date: 08/12/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application

In this article, learn how to connect devices with both group and individual enrollments using X.509 certificates

## Prerequisites and setup your environment

- Completion of [Create and connect a client application to your Azure IoT Central application (Node.js)](./tutorial-connect-device-nodejs.md).
- [Git](https://git-scm.com/download/).
- Download and Install [OpenSSL](https://www.openssl.org/) from [here](https://sourceforge.net/projects/openssl/). 



## Connect devices using X.509 certificate for group enrollment entry

In this section, you will use a self-signed X.509 certificate to connect devices for enrollment groups, which are used to enroll multiple related devices.

1. Open a command prompt. Clone the GitHub repo for the code samples:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-node.git
    ```

2. Navigate to the certificate generator script and build the project. 

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

3. Create a root certificate and then derive a device certificate by running the script. Be sure to only use lower-case alphanumerics and hyphens for certificate name.

    ```cmd/sh
    node create_test_cert.js root [commonName]
    node create_test_cert.js device <commonName> [parentCommonName]
    ```


4. Now open your IoT Central application and navigate to **Administration**  in the left pane and click on **Device connection**. 

2. Click **Enrollment Groups**, and create a new enrollment group with Attestation type as **Certificates (X.509)** in the list.


3. Open the enrollment group you created and click **Manage Primary**. 

4. Select **file** option and upload the root certificate pem file, which you created above.


    ![Certificate Upload](./media/how-to-connect-devices-x509/certificate-upload.png)



5. To complete the verification, copy the verification code, create an X.509 verification certificate with that code in command prompt.

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    node create_test_cert.js verification --ca {root-certificate}_cert.pem --key {root-certificate}_key.pem --nonce  {verification-code}
    ```

6. Upload the signed verification certificate _verification_cert.pem_ to complete the verification.

    ![Certificate Upload](./media/how-to-connect-devices-x509/verified.png)





## Simulate the device


1. In the Azure IoT Central application, Click **Devices**, and create a new device under **Environmental Sensor** device template that  uses the deviceCommonName of the device cert you created previously. Note down the _ID Scope_ and _Device ID_.

2. Copy your _certificate_ and _key_ to the _environmental sensor_ folder.

    ```cmd/sh
    copy .\{device-certificate-name}_cert.pem ..\environmental-sensor\{device-certificate-name}_cert.pem
    copy .\{device-certificate-name}_key.pem ..\environmental-sensor\{device-certificate-name}_key.pem
    ```


4. Edit the **environmentalSensor.js** file. Save the file after making the following changes.
    - Replace `id scope` with the **_ID Scope_** noted in **Step 1** above. 
    - Replace `registration id` with the **_Device ID_** noted in **Step 1** above.


5. Add the following `require` statements at the start of the **environmentalSensor.js** file:

    ```javascript
    var fs = require('fs');
    var Transport = require('azure-iot-provisioning-device-mqtt').Mqtt;
    ```

6. Add the following variable declarations to the **environmentalSensor.js** file:

    ```javascript
    var transport = new Transport();
    var securityClient = new X509Security(registrationId, deviceCert);
    var deviceClient = ProvisioningDeviceClient.create(provisioningHost, idScope, transport, securityClient);
    var deviceCert = {

      cert: fs.readFileSync('device-certificate-name_cert.pem', 'utf8'),
      key: fs.readFileSync('device-certificate-name_key.pem', 'utf8')
    };

    ```
7. Replace `device-certificate-name_cert.pem` and `device-certificate-name_key.pem` with the files you copied in **Step 2** above.

8. To connect the device with the X.509 certificate you created, add the following code to the file:

   ```javascript

    // Register the device.  Do not force a re-registration.
    deviceClient.register(function(err, result) {
      if (err) {
        console.log("error registering device: " + err);
      } else {
        console.log('registration succeeded');
        console.log('assigned hub=' + result.assignedHub);
        console.log('deviceId=' + result.deviceId);
        var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';x509=true';
        var hubClient = Client.fromConnectionString(connectionString, iotHubTransport);
        hubClient.setOptions(deviceCert);
        hubClient.open(function(err) {
          if (err) {
            console.error('Failure opening iothub connection: ' + err.message);
          } else {
            console.log('Client connected');
            var message = new Message('Hello world');
            hubClient.sendEvent(message, function(err, res) {
              if (err) console.log('send error: ' + err.toString());
              if (res) console.log('send status: ' + res.constructor.name);
              process.exit(1);
            });
          }
        });
      }
    });

    ```

5. Execute the script and verify the device was provisioned successfully.

    ```cmd/sh
    node environmentalSensor.js
    ```   


