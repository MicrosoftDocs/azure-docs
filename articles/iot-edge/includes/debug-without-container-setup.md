---
ms.topic: include
ms.date: 07/08/2022
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

Your module requires use of a **ModuleClient** object in the default module code so that it can start, run, and route messages. You'll also use the default input channel **input1** to take action when the module receives messages.

### Set up IoT Edge simulator

IoT Edge modules need an IoT Edge environment to run and debug. You can use an IoT Edge simulator on your development machine instead of running the full IoT Edge security subsystem and runtime. You can either simulate a device to debug solutions with multiple modules, or simulate a single module application.

#### Option 1: Simulate an IoT Edge solution:

1. In the **Explorer** tab on the left side, expand the **Azure IoT Hub** section. Right-click on your IoT Edge device ID, and then select **Setup IoT Edge Simulator** to start the simulator with the device connection string.
1. You can see the IoT Edge Simulator has been successfully set up by reading the progress detail in the integrated terminal.

#### Option 2: Simulate a single IoT Edge module:

1. In the Visual Studio Code command palette, run the command **Azure IoT Edge: Start IoT Edge Hub Simulator for Single Module**.
1. Provide the names of any inputs that you want to test with your module. If you're using the default sample code, use the value **input1**.
1. The command triggers the **iotedgehubdev** CLI and then starts the IoT Edge simulator and a testing utility module container. You can see the output similar to the following in the integrated terminal if the simulator has been started in single module mode successfully. The output includes an example `curl` command to send a message to the simulator. You'll use the `curl` command later.

    ```output
    D:\Workspaces\EdgeSolution>iotedgehubdev start -i "input1"
    ...
    ```

   You can use the Docker Explorer view in Visual Studio Code to see the module's running status.

    :::image type="content" source="media/simulator-status.png" alt-text="Screenshot showing simulator module status in the Docker Explorer pane of Visual Studio Code.":::

   The **edgeHubDev** container is the core of the local IoT Edge simulator. It can run on your development machine without the IoT Edge security daemon and provides environment settings for your native module app or module containers. The **input** container exposes REST APIs to help bridge messages to the target input channel on your module.

### Debug module in launch mode

After the simulator has been started successfully, you can debug your module code.

Prepare your environment for debugging, set a breakpoint in your module, and select the debug configuration to use.
