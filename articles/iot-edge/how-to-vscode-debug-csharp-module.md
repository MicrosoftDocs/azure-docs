---
title: Use Visual Studio Code to debug a C# module with Azure IoT Edge | Microsoft Docs
description: Debug a C# module with Azure IoT Edge in Visual Studio Code.
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 03/18/2018
ms.topic: article
ms.service: iot-edge

---

# Use Visual Studio Code to debug a C# module with Azure IoT Edge
This article provides detailed instructions for using [Visual Studio Code](https://code.visualstudio.com/) as the main development tool to debug your Azure IoT Edge modules.

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device can be another physical device, or you can simulate your IoT Edge device on your development machine.

Before following the guidance in this article, complete the steps in  [Develop an IoT Edge solution with multiple modules in Visual Studio Code](tutorial-multiple-modules-in-vscode.md). After that, you should have the following items ready:
- A local Docker registry running on your development machine. It is suggested to use a local Docker registry for prototype and testing purpose. You can update the container registry in the `module.json` file in each module folder.
- An IoT Edge solution project workspace with a C# module subfolder in it.
- The `Program.cs` file, with the latest module code.
- An Edge runtime running on your development machine.

## Build your IoT Edge C# module for debugging
1. To start debugging, you need to use the **Dockerfile.amd64.debug** to rebuild your docker image and deploy your Edge solution again. In VS Code explorer, navigate to `deployment.template.json` file. Update your function image URL by adding a `.debug` in the end.

2. Rebuild your solution. In VS Code command palette, type and run the command **Edge: Build IoT Edge solution**.

3. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for Edge device**. Select the `deployment.json` under `config` folder. Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

> [!NOTE]
> You can check your container status in the VS Code Docker explorer or by run the `docker images` command in the terminal.

## Start debugging C# module in VS Code
1. VS Code keeps debugging configuration information in a `launch.json` file located in a `.vscode` folder in your workspace. This `launch.json` file has been generated when creating a new IoT Edge solution. And it will be updated each time you add a new module that support debugging. Navigate to the debug view and select the corresponding debug configuration file.
    ![Select debug configuration](./media/how-to-debug-csharp-function/select-debug-configuration.jpg)

2. Navigate to `program.cs`. Add a breakpoint in this file.

3. Click Start Debugging button or press **F5**, and select the process to attach to.

4. In VS Code Debug view, you can see the variables in left panel. 

> [!NOTE]
> The preceding example shows how to debug .NET Core IoT Edge modules on containers. It's based on the debug version of the `Dockerfile.debug`, which includes VSDBG (the .NET Core command-line debugger) in your container image while building it. After you finish debugging your C# modules, we recommend you directly use or customize `Dockerfile` without VSDBG for production-ready IoT Edge modules.

## Next steps

[Use Visual Studio Code to debug Azure Functions with Azure IoT Edge](how-to-vscode-debug-azure-function.md)

