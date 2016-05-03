## Create a simulated device app

In this section, you'll create a Node.js console app that simulates a device that sends device-to-cloud messages to an IoT hub.

1. Create a new empty folder called **simulateddevice**. In the **simulateddevice** folder, create a new package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **simulateddevice** folder, run the following command to install the **azure-iot-device-amqp** package:

    ```
    npm install azure-iot-device-amqp --save
    ```

3. Using a text editor, create a new **SimulatedDevice.js** file in the **simulateddevice** folder.

4. Add the following `require` statements at the start of the **SimulatedDevice.js** file:

    ```
    'use strict';

    var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
    var Message = require('azure-iot-device').Message;
    ```

5. Add a **connectionString** variable and use it to create a device client. Replace **{youriothubname}** with your IoT hub name, and **{yourdeviceid}** and **{yourdevicekey}** with the device values you generated in the *Create a device identity* section:

    ```
    var connectionString = 'HostName={youriothubname}.azure-devices.net;DeviceId={yourdeviceid};SharedAccessKey={yourdevicekey}';
    
    var client = clientFromConnectionString(connectionString);
    ```

6. Add the following function to display output from the application:

    ```
    function printResultFor(op) {
      return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
      };
    }
    ```

7. Create a callback and use the **setInterval** function to send a new message to your IoT hub every second:

    ```
    var connectCallback = function (err) {
      if (err) {
        console.log('Could not connect: ' + err);
      } else {
        console.log('Client connected');

        // Create a message and send it to the IoT Hub every second
        setInterval(function(){
            var windSpeed = 10 + (Math.random() * 4);
            var data = JSON.stringify({ deviceId: 'mydevice', windSpeed: windSpeed });
            var message = new Message(data);
            console.log("Sending message: " + message.getData());
            client.sendEvent(message, printResultFor('send'));
        }, 2000);
      }
    };
    ```

8. Open the connection to your IoT Hub and start sending messages:

    ```
    client.open(connectCallback);
    ```

9. Save and close the **SimulatedDevice.js** file.

> [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
