<properties
 pageTitle="Troubleshooting | Microsoft Azure"
 description="Troubleshooting page for Raspberry Pi Node.js experience"
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="10/21/2016"
 ms.author="xshi"/>

# Troubleshooting

## Hardware issues

### The application runs well but the LED is not blinking

This issue is always related to the hardware circuit connectivity. Use the following steps to identify problems.

1. Check if you choose the correct **GPIO** on your board. The two ports in this lesson should be **GPIO GND (Pin 6)** and **GPIO 04 (Pin 7)**.
2. Check if the polarity of your LED is correct. The longer leg should indicate the **positive**, anode pin.
3. Use the **3.3V Pin** and **GND Pin** on your Raspberry Pi 3. Treat your Pi as the DC Power. Check if the LED works fine.

![LED spec](media/iot-hub-raspberry-pi-lessons/troubleshooting/led_spec.png)

### Other hardware issues

For information about solving common problems on the Raspberry Pi 3, refer to the [official troubleshooting page](http://elinux.org/R-Pi_Troubleshooting).

## Node.js package issues

### No response during gulp tasks

If you encounter problems running gulp tasks, you can add the `--verbose` option for debugging. Try to terminate current gulp tasks with `Ctrl + C` and then run the following command in your console window to see debug messages. You might see detailed error messages printed in your console output. 

```bash
gulp --verbose
```

### Device discovery issues

For help troubleshooting common problems with the `devdisco` command, check the [readme](https://github.com/Azure/device-discovery-cli/blob/develop/readme.md).

### Other NPM issues

Try to update your NPM package with the following command:

```bash
npm install -g npm
```

If the problem still exists, leave your comments at the end of this article or create a Github issue in our [Sample Repository](https://github.com/Azure-Samples/iot-hub-node-raspberrypi-getting-started)

## Remote debugging

### Run the sample application in debug mode

```bash
gulp run --debug
```

When the debug engine is ready, you should see ```Debugger listening on port 5858``` in the console output.

### Configure VS Code to connect to the remote device

Open the **Debug** panel on the left-hand side.

Click the green **Start Debugging** (F5) button. VS Code opens a **launch.json** file, which you need to update.

Update the **launch.json** file with the following content. Replace `[device hostname or IP address]` with the actual device IP address or hostname.   

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach",
            "type": "node",
            "request": "attach",
            "port": 5858,
            "address": "[device hostname or IP address]",
            "restart": false,
            "sourceMaps": false,
            "outDir": null,
            "localRoot": "${workspaceRoot}",
            "remoteRoot": null
        }
    ]
}
```

![Remote debugging configuration](media/iot-hub-raspberry-pi-lessons/troubleshooting/remote_debugging_configuration.png)

### Attach to the remote application

Click the green **Start Debugging** (F5) button to start debugging. 

Read [JavaScript in VS Code](https://code.visualstudio.com/docs/languages/javascript#_debugging) to learn more about the debugger.

![Remote debugging interactive](media/iot-hub-raspberry-pi-lessons/troubleshooting/remote_debugging_interactive.png)

## Azure CLI issues

Azure CLI is a preview build. You can refer to [Preview Install Guide](https://github.com/Azure/azure-cli/blob/master/doc/preview_install_guide.md) to seek solutions.

If you encounter any bugs with the tool, file an [issue](https://github.com/Azure/azure-cli/issues) in the **Issues** section of the GitHub repo.

For help troubleshooting common problems, check the [readme](https://github.com/Azure/azure-cli/blob/master/README.rst).

## Python installation issues

### Legacy installation issues (macOS)

When installing **pip**, a permission error is thrown when there are legacy packages that are installed with **su** permissions. This situation occurs because previous install of Python using brew (macOS) is not uninstalled completely. Some **pip** packages from a previous installation were created by root, which causes the permission error. The solution is to remove those packages installed by root. Use the following steps to complete this task:

1. Go to /usr/local/lib/python2.7/site-packages
2. List packages create by root: `ls -l | grep root`
3. Uninstall packages from step2: `sudo rm -rf {package name}`
4. Reinstall Python.

## Azure IoT hub issues

If you've successfully provisioned Azure IoT hub with `azure-cli`, and you need a tool to manage the devices connecting to your IoT hub, try the following tools:

### Device Explorer

[Device Explorer](https://github.com/Azure/azure-iot-sdks/blob/master/tools/DeviceExplorer/doc/how_to_use_device_explorer.md) runs on your Windows local machine and connects to your IoT hub in Azure. It communicates with the following [IoT Hub endpoints](iot-hub-devguide.md):

- *Device identity management* to provision and manage devices registered with your IoT hub.
- *Receive device-to-cloud* to enable you to monitor messages sent from your device to your IoT hub.
- *Send cloud-to-device* to enable you to send messages to your devices from your IoT hub.

Configure your `IoT hub connection string` within this tool to use all its capabilities.

### IoT hub Explorer

[IoT hub Explorer](https://github.com/Azure/azure-iot-sdks/blob/master/tools/iothub-explorer/readme.md) is a sample multiplatform CLI tool to manage device clients. The tool enables you to manage the devices in the identity registry, monitor device-to-cloud messages, and send cloud-to-device commands.

To install the latest (pre-release) version of the iothub-explorer tool, run the following command in your command-line environment:

```
npm install -g iothub-explorer@latest
```

You can use the following command to get additional help about all the iothub-explorer commands and their parameters:

```bash
iothub-explorer help
```

### Use Azure portal to manage your resources

In all these lessons, a full CLI experience is provided to create and manage all your Azure resources. You might also want to use the [Azure portal](../azure-portal-overview.md) to help provision, manage, and debug your Azure resources.

## Azure Storage issues

[Microsoft Azure Storage Explorer (Preview)](http://storageexplorer.com) is a standalone app from Microsoft that allows you to work with Azure Storage data on Windows, macOS, and Linux. This tool allows you to connect to your table and see the data in it. You can use this tool to troubleshoot your Azure Storage issues.
