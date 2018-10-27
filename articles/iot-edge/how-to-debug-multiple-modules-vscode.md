---
title: Debug multiple modules for Azure IoT Edge in VS Code | Microsoft Docs
description: Use Visual Studio Code to debug multiple modules with Azure IoT Edge
author: shizn
manager: 
ms.author: xshi
ms.date: 06/27/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Use Visual Studio Code to debug multiple modules with Azure IoT Edge
This article provides detailed instructions for using [Visual Studio (VS) Code](https://code.visualstudio.com/) to debug multiple modules on IoT Edge.

## Prerequisites
Complete the tutorial [Develop an IoT Edge solution with multiple modules in Visual Studio Code](tutorial-multiple-modules-in-vscode.md) and make sure you have at least two modules running on your IoT Edge device.

## Multi-target and remote debugging in VS Code
With VS Code and Azure IoT Edge extension, you can attach the module process in a container, whether the container is running on your development machine or in a remote physical IoT Edge device. Debug mutiple modules running in containers is actually attaching more than one process in separate containers. VS Code [multi-target debugging](https://code.visualstudio.com/docs/editor/debugging#_multitarget-debugging) can be used when debugging mutiple modules.

   > [!TIP]
   > If your module container is running in a remote physical IoT Edge device, you might need to setup [Docker Machine](https://docs.docker.com/machine/overview/) so that the Docker engine on your development machine can talk to the remote Docker hosts.

### Build your IoT Edge modules for debugging purpose
1. To start multi-module debugging, you need to use **Dockerfile.amd64.debug** to rebuild your docker images and deploy your Edge solution again. In VS Code explorer, navigate to `deployment.template.json` file. Update your image URLs by adding a `.debug` in the end. You need two module images with `.debug` at least. If you are working on the solution from previous tutorial, you should have a C# functions module and a C# module. Update these two image URLs by adding a `.debug` in the end and save this file. 
2. Rebuild your solution. In VS Code command palette, type and run the command **Azure IoT Edge: Build IoT Edge solution**.
3. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for Edge device**. Select the `deployment.json` file under the `config` folder. Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

You can check your container status in the VS Code Docker explorer or by running the `docker ps` command in the terminal.

### Start debugging C# Function in VS Code
1. VS Code keeps debugging configuration information in a `launch.json` file located in a `.vscode` folder in your workspace. This `launch.json` file was generated when you created a new IoT Edge solution. It updates each time you add a new module that supports debugging. Navigate to the debug view and select the corresponding debug configuration file for C# functions module remote debugging.
2. Navigate to `run.csx`. Add a breakpoint in the function.
3. Click the **Start Debugging** button or press **F5**, and select the process to attach to.
4. In VS Code Debug view, you can see the variables in left panel. 

### Start debugging C# module at the same time in VS Code
1. In VS Code command palette, type and run the command "Workspace: Duplicate Workspace in New Window". A new VS Code window starts with the same workspace.
2. Navigate to the debug view and select the corresponding debug configuration file for C# module remote debugging.
3. Navigate to `program.cs`. Add a breakpoint in the C# module.
4. Click the **Start Debugging** button or press **F5**, and select the process to attach to.
5. In VS Code Debug view, you can see the variables in left panel. 

### See variables in multiple debugging windows
1. Now you have at least two debugging session running in two VS Code window. One of the breakpoint should be hit.
2. Press `F10` or click the Step Over button in the **Debug toolbar**.
3. The breakpoint in another VS Code window should be hit. 
4. Continue above two steps, you can see variables from mutilple modules in multiple VS Code debugging windows.

> [!NOTE]
> Above example shows how to debugging multiple modules with Azure IoT Edge. It's based on the debug version of the `Dockerfile.amd64.debug`, which includes VSDBG(the .NET Core command-line debugger) in your container image while building it. We recommend you directly use or customize the `Dockerfile` without VSDBG for production-ready IoT Edge function after you finish debugging your C# function.

## Next steps

Once you have your module built, learn how to [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md)
0
