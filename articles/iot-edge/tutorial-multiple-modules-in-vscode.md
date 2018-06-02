---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage multiple Azure IoT Edge modules in VS Code | Microsoft Docs 
description: Use Visual Studio Code to develop IoT Edge solutions that use multiple modules.
author: shizn
manager: 
ms.author: xshi
ms.date: 03/18/2018
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Develop an IoT Edge solution with multiple modules in Visual Studio Code - preview
You can use Visual Studio Code to develop your IoT Edge solution with multiple modules. This article walks through creating, updating, and deploying an IoT Edge solution that pipes sensor data on the simulated IoT Edge device in Visual Studio Code. 

## Prerequisites

To complete all the steps in this article, have the following prerequisites in place:

- [Visual Studio Code](https://code.visualstudio.com/) 
- [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
- [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 
- [Docker](https://docs.docker.com/engine/installation/)
- [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd) 
- AzureIoTEdgeModule template (`dotnet new -i Microsoft.Azure.IoT.Edge.Module`)
- An active IoT hub with at least one IoT Edge device


* [Docker for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) with explorer integration for managing Images and Containers.


## Prepare your first IoT Edge solution
1. In VS Code command palette, type and run the command **Edge: New IoT Edge solution**. Then select your workspace folder, provide the solution name (The default name is **EdgeSolution**), and create a C# Module (**SampleModule**) as the first user module in this solution. You also need to specify the Docker image repository for your first module. The default image repository is based on a local Docker registry (`localhost:5000/<first module name>`). You can also change it to Azure container registry or Docker Hub.

   > [!NOTE]
   > If you are using a local Docker registry, make sure the registry is running by typing the command `docker run -d -p 5000:5000 --restart=always --name registry registry:2` in your console window.

2. The VS Code window loads your IoT Edge solution workspace. The root folder contains a `modules` folder, a `.vscode` folder, and a deployment manifest template file. You can see debug configurations in `.vscode` folder. All user module codes will be subfolders under the folder `modules`. The `deployment.template.json` is the deployment manifest template. Some of the parameters in this file will be parsed from the `module.json`, which exists in every module folder.

3. Add your second module into this solution project. This time type and run **Edge: Add IoT Edge module** and select the deployment template file to update. Then select an **Azure Function - C#** with name **SampleFunction** and its Docker image repository.

4. Open the `deployment.template.json` file, and verify that it declares three modules in addition to the runtime. The message will be generated from the `tempSensor` module, and will be directly piped via `SampleModule` and `SampleFunction`, then sent to your IoT hub. 
5. Update the routes for these modules with following content:
   ```json
   "routes": {
      "SensorToPipeModule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/SampleModule/inputs/input1\")",
      "PipeModuleToPipeFunction": "FROM /messages/modules/SampleModule/outputs/output1 INTO BrokeredEndpoint(\"/modules/SampleFunction/inputs/input1\")",
      "PipeFunctionToIoTHub": "FROM /messages/modules/SampleFunction/outputs/output1 INTO $upstream"
   },
   ```

6. Save this file.

## Build and deploy your IoT Edge solution
1. In VS Code command palette, type and run the command **Edge: Build IoT Edge solution**. Based on the `module.json` file in each module folder, this command start to build, containerize, and push each module docker image. Then it passes the required value to `deployment.template.json` and generates the `deployment.json` file with information from the `config` folder. You can see the build progress in VS Code integrated terminal.

2. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for Edge device**. Select the `deployment.json` under `config` folder. Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

3. If you are simulating an IoT Edge device on your development machine, you will see that all the module image containers will be started in a few minutes.

## View generated data

1. To monitor data arriving at the IoT hub, select the **View** > **Command Palette...** and search for **IoT: Start monitoring D2C message**. 
2. To stop monitoring data, use the **IoT: Stop monitoring D2C message** command in the Command Palette. 

## Next steps

Learn about other scenarios for developing Azure IoT Edge in Visual Studio Code:

* [Debug a C# module in VS Code](how-to-vscode-debug-csharp-module.md)
* [Debug a C# Function in VS Code](how-to-vscode-debug-azure-function.md)