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
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# Troubleshooting

## Hardware issues
### The application runs well but the LED is not blinking
This issue is always related to the hardware circuit connectivity. Follow the steps below to quickly identify problems.

1. Check if you choose the correct **GPIO** on your board. The two ports in this lesson should be **GPIO GND (Pin 6)** and **GPIO 04 (Pin 7)**.
2. Check if the polarity of your LED is correct. The longer leg should indicate the **positive**, anode pin.
3. Use the **3.3V Pin** and **GND Pin** on your Raspberry Pi 3. Treat your Pi as the DC Power. Check if the LED works fine.

![LED spec](media/iot-hub-raspberry-pi-lessons/troubleshooting/led_spec.png)

### Other hardware issues
For the most common problems on Raspberry Pi 3, you can refer to the [official troubleshooting page](http://elinux.org/R-Pi_Troubleshooting) to seek solutions.

## Node.js package issues
### No response during gulp tasks
If you got some problems during gulp tasks, you can add `--verbose` option for debugging. Try to terminate current gulp taks with `Ctrl + C` and run the below command in your console window to see debug messages. You might see detailed error messages printed in your console output. 

```bash
gulp --verbose
```

### Device discovery issues
For help troubleshooting common problems in `devdisco`, please check the [readme](https://github.com/Azure/device-discovery-cli/blob/develop/readme.md).

### Other NPM issues
Try to update your NPM package with the following command, the 

```bash
npm install -g npm
```

If the problem still exists, leave your comments below or create a Github issue in our [Sample Repository](https://github.com/Azure-Samples/iot-hub-node-raspberrypi-getting-started)

## Remote debugging

### Run the sample application in debug mode

```bash
gulp run --debug
```

Once the debug engine is ready, you should be able to see ```Debugger listening on port 5858``` from the console output.

### Configure VS Code to connect to the remote device

Open the **Debug** (Ctrl+Shift+D) panel from the left side.

Click the green **Start Debugging** (F5) button. VS Code would open a **launch.json**, which you need to update.

Update the **launch.json** file with the following content, replace `[device hostname or IP address]` with the actual device IP address or hostname.   

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

Click the green **Start Debugging** (F5) button and enjoy debugging. 

You can read [JavaScript in VS Code](https://code.visualstudio.com/docs/languages/javascript#_debugging) to learn more about the debugger.

![Remote debugging interactive](media/iot-hub-raspberry-pi-lessons/troubleshooting/remote_debugging_interactive.png)

## Azure-cli issues
Azure-cli is a preview build, you can refer to [Preview Install Guide](https://github.com/Azure/azure-cli/blob/master/doc/preview_install_guide.md) to seek solutions.

If you encounter any bugs with the tool please file an [issue](https://github.com/Azure/azure-cli/issues) in the Issues section of our GitHub repo.

For help troubleshooting common problems, please check the [readme](https://github.com/Azure/azure-cli/blob/master/README.rst).