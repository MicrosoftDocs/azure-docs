---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Work with multiple Azure IoT Edge modules in VS Code | Microsoft Docs 
description: Use the IoT extension for Visual Studio Code to develop multiple modules at once for Azure IoT Edge
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 06/27/2018
ms.topic: conceptual
ms.service: iot-edge

---

# Develop an IoT Edge solution with multiple modules in Visual Studio Code

You can use Visual Studio Code to develop your Azure IoT Edge solution with multiple modules. This article shows you how to create, update, and deploy an IoT Edge solution that pipes sensor data on a simulated IoT Edge device in VS Code. 

## Prerequisites

To complete the steps in this article, have the following prerequisites in place:

- [Visual Studio Code](https://code.visualstudio.com/)
- The [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge)
- The [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)
- [Docker](https://docs.docker.com/engine/installation/)
- The [.NET Core 2.1 SDK](https://www.microsoft.com/net/download)
- An active IoT hub with at least one IoT Edge device

You also need [Docker for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) with Azure IoT Hub Device Explorer integration to manage images and containers.

## Create your IoT Edge solution

1. In Visual Studio code, open the integrated terminal by selecting **View** > **Integrated terminal**. 

1. In the VS Code **Command Palette**, enter and run the command **Azure IoT Edge: New IoT Edge solution**. Select your workspace folder and provide the solution name (default is EdgeSolution). Create a C# module (with the name **PipeModule**) as the first user module in this solution. The default template of C# module is a pipe module, which directly pipes messages from upstream to downstream. You also need to specify the Docker image repository for your first module. The default image repository is based on a local Docker registry (**localhost:5000/<first module name>**). You can change it to Azure Container Registry or Docker Hub. 

2. The VS Code window loads your IoT Edge solution workspace. The root folder contains a **modules** folder, a **.vscode** folder, and a deployment manifest template file. Debug configurations are located in the .vscode folder. All of the user module codes are subfolders of the modules folder. The deployment.template.json file is the deployment manifest template. Some of the parameters in this file are parsed from the module.json file, which exists in every module folder.

3. Add your second module to this solution project. There are several ways to add a new module to current solution. Enter and run the command **Azure IoT Edge: Add IoT Edge module**. Select the deployment template file to update. Or right-click the modules folder or right-click the deployment.template.json file and select **Add IoT Edge Module**. Then there will be a dropdown list to select module type. Select an **Azure Functions - C#** module with the name **PipeFunction** and its Docker image repository. The default template of C# functions module is a pipe module, which directly pipes messages from upstream to downstream.

4. Open the deployment.template.json file. Verify that the file declares three modules and the runtime. The message is generated from the tempSensor module. The message is directly piped via the SampleModule and SampleFunction modules and then sent to your IoT hub. 

5. Update the routes for these modules with the following content:

   ```json
        "routes": {
          "SensorToPipeModule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/PipeModule/inputs/input1\")",
          "PipeModuleToPipeFunction": "FROM /messages/modules/PipeModule/outputs/output1 INTO BrokeredEndpoint(\"/modules/PipeFunction/inputs/input1\")",
          "PipeFunctionToIoTHub": "FROM /messages/modules/PipeFunction/outputs/output1 INTO $upstream"
        },
   ```

5. Save this file.

## Build and deploy your IoT Edge solution

1. In the VS Code **Command Palette**, enter and run the command **Azure IoT Edge: Build IoT Edge solution**. Based on the module.json file in each module folder, the command starts to build, containerize, and push each module Docker image. The command then passes the required value to the deployment.template.json file and generates the deployment.json file with information from the config folder. The integrated terminal in VS Code shows the build progress. 

2. In the Azure IoT Hub **Device Explorer**, right-click an IoT Edge device ID and then select the **Create deployment for Edge device** command. Select the deployment.json file in the config folder. The integrated terminal in VS Code shows the deployment successfully created with a deployment ID.

3. If you're simulating an IoT Edge device on your development machine, you can watch to see that all of the module image containers start within a few minutes.

## View the generated data

1. To monitor the data that arrives at the IoT hub, select **View** > **Command Palette**. Then select the **IoT: Start monitoring D2C message** command. 
2. To stop monitoring the data, use the **IoT: Stop monitoring D2C message** command in the **Command Palette**. 

## Next steps

Learn about other scenarios for developing with Azure IoT Edge in Visual Studio Code:

* Develop modules in VS Code with [C#](how-to-develop-csharp-module.md) or [Node.js](how-to-develop-node-module.md).
* Develop Azure Functions in VS Code with [C#](how-to-develop-csharp-function.md).

To develop modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).