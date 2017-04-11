## Configure the Node.js simulated device
1. On the remote monitoring dashboard, click **+ Add a device** and then add a *custom device*. Make a note of the IoT Hub hostname, device id, and device key. You need them later in this tutorial when you prepare the remote_monitoring.js device client application.
2. Ensure that Node.js version 0.12.x or later is installed on your development machine. Run `node --version` at a command prompt or in a shell to check the version. For information about using a package manager to install Node.js on Linux, see [Installing Node.js via package manager][node-linux].
3. When you have installed Node.js, clone the latest version of the [azure-iot-sdk-node][lnk-github-repo] repository to your development machine. Always use the **master** branch for the latest version of the libraries and samples.
4. From your local copy of the [azure-iot-sdk-node][lnk-github-repo] repository, copy the following two files from the node/device/samples folder to an empty folder on your development machine:
   
   * packages.json
   * remote_monitoring.js
5. Open the remote_monitoring.js file and look for the following variable definition:
   
    ```
    var connectionString = "[IoT Hub device connection string]";
    ```
6. Replace **[IoT Hub device connection string]** with your device connection string. Use the values for your IoT Hub hostname, device id, and device key that you made a note of in step 1. A device connection string has the following format:
   
    ```
    HostName={your IoT Hub hostname};DeviceId={your device id};SharedAccessKey={your device key}
    ```
   
    If your IoT Hub hostname is **contoso** and your device id is **mydevice**, your connection string looks like the following snippet:
   
    ```
    var connectionString = "HostName=contoso.azure-devices.net;DeviceId=mydevice;SharedAccessKey=2s ... =="
    ```
7. Save the file. Run the following commands in a shell or command prompt in the folder that contains these files to install the necessary packages and then run the sample application:
   
    ```
    npm install
    node remote_monitoring.js
    ```

## Observe dynamic telemetry in action
The dashboard shows the temperature and humidity telemetry from the existing simulated devices:

![The default dashboard][image1]

If you select the Node.js simulated device you ran in the previous section, you see temperature, humidity, and external temperature telemetry:

![Add external temperature to the dashboard][image2]

The remote monitoring solution automatically detects the additional external temperature telemetry type and adds it to the chart on the dashboard.

[node-linux]: https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager
[lnk-github-repo]: https://github.com/Azure/azure-iot-sdk-node
[image1]: media/iot-suite-send-external-temperature/image1.png
[image2]: media/iot-suite-send-external-temperature/image2.png