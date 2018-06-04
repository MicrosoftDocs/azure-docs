---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage multiple Azure IoT Edge modules in VS Code | Microsoft Docs 
description: Use Visual Studio Code to develop Azure IoT Edge solutions that use multiple modules.
author: shizn
manager: 
ms.author: xshi
ms.date: 03/18/2018
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Develop an IoT Edge solution with multiple modules in Visual Studio Code (preview)

You can use Visual Studio Code to develop your Azure IoT Edge solution with multiple modules. This article shows you how to create, update, and deploy an IoT Edge solution that pipes sensor data on a simulated IoT Edge device in VS Code. 

## Prerequisites

To complete the steps in this article, have the following prerequisites in place:

- [Visual Studio Code](https://code.visualstudio.com/)
- The [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge)
- The [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)
- [Docker](https://docs.docker.com/engine/installation/)
- The [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd)
- The AzureIoTEdgeModule template (`dotnet new -i Microsoft.Azure.IoT.Edge.Module`)
- An active IoT hub with at least one IoT Edge device

You also need [Docker for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) with Azure IoT Hub Device Explorer integration to manage images and containers.

## Prepare your first IoT Edge solution

1. In the VS Code **Command Palette**, enter and run the command **Edge: New IoT Edge solution**. Select your workspace folder and provide the solution name (default is EdgeSolution). Create a C# module (with the name **SampleModule**) as the first user module in this solution. You also need to specify the Docker image repository for your first module. The default image repository is based on a local Docker registry (**localhost:5000/<first module name>**). You can change it to Azure Container Registry or Docker Hub.

   > [!NOTE]
   > If you're using a local Docker registry, make sure that the registry is running. Enter the following command in your console window:
   > 
   > `docker run -d -p 5000:5000 --restart=always --name registry registry:2`

2. The VS Code window loads your IoT Edge solution workspace. The root folder contains a **modules** folder, a **.vscode** folder, and a deployment manifest template file. Debug configurations are located in the .vscode folder. All of the user module codes are subfolders of the modules folder. The deployment.template.json file is the deployment manifest template. Some of the parameters in this file are parsed from the module.json file, which exists in every module folder.

3. Add your second module to this solution project. Enter and run the command **Edge: Add IoT Edge module**. Select the deployment template file to update. Select an **Azure Function - C#** module with the name **SampleFunction** and its Docker image repository.

4. Open the deployment.template.json file. Verify that the file declares three modules and the runtime. The message is generated from the tempSensor module. The message is directly piped via the SampleModule and SampleFunction modules and then sent to your IoT hub. 

5. Update the routes for these modules with the following content:

   ```json
   "routes": {
      "SensorToPipeModule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/SampleModule/inputs/input1\")",
      "PipeModuleToPipeFunction": "FROM /messages/modules/SampleModule/outputs/output1 INTO BrokeredEndpoint(\"/modules/SampleFunction/inputs/input1\")",
      "PipeFunctionToIoTHub": "FROM /messages/modules/SampleFunction/outputs/output1 INTO $upstream"
   },
   ```

6. Save this file.

## Build and deploy your IoT Edge solution

1. In the VS Code **Command Palette**, enter and run the command **Edge: Build IoT Edge solution**. Based on the module.json file in each module folder, the command starts to build, containerize, and push each module Docker image. The command then passes the required value to the deployment.template.json file and generates the deployment.json file with information from the config folder. The integrated terminal in VS Code shows the build progress.

2. In the Azure IoT Hub **Device Explorer**, right-click an IoT Edge device ID and then select the **Create deployment for Edge device** command. Select the deployment.json file in the config folder. The integrated terminal in VS Code shows the deployment successfully created with a deployment ID.

3. If you're simulating an IoT Edge device on your development machine, notice that all of the module image containers start within a few minutes.

## View the generated data

1. To monitor the data that arrives at the IoT hub, select **View** > **Command Palette**. Then select the **IoT: Start monitoring D2C message** command. 
2. To stop monitoring the data, use the **IoT: Stop monitoring D2C message** command in the **Command Palette**. 

## Next steps

Learn about other scenarios for developing with Azure IoT Edge in Visual Studio Code:

* [Debug a C# module in VS Code](how-to-vscode-debug-csharp-module.md)
* [Debug a C# function in VS Code](how-to-vscode-debug-azure-function.md)
