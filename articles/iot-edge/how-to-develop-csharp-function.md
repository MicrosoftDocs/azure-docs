---
title: Debug Functions modules for Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to debug C# Azure Functions with Azure IoT Edge
author: shizn
manager: 
ms.author: xshi
ms.date: 06/26/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Use Visual Studio Code to develop and debug Azure Functions for Azure IoT Edge

This article provides detailed instructions for using [Visual Studio (VS) Code](https://code.visualstudio.com/) to debug your Azure Functions on IoT Edge.

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device could be another physical device or you can simulate your IoT Edge device on your development machine.

> [!NOTE]
> This debugging tutorial describes how to attach a process in a module container and debug it with VS Code. You can only debug C# modules in linux-amd64 containers. If you aren't familiar with the debugging capabilities of Visual Studio Code, read about [Debugging](https://code.visualstudio.com/Docs/editor/debugging). 

This article uses Visual Studio Code as the main development tool. Install VS Code, then add the necessary extensions: 

* [Visual Studio Code](https://code.visualstudio.com/) 
* [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
* [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 
* [Docker extension](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)

To create a module, you need .NET to build the project folder, Docker to build the module image, and a container registry to hold the module image:
* [.NET Core 2.1 SDK](https://www.microsoft.com/net/download).
* [Docker CE](https://docs.docker.com/install/) on your development machine. 
* [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags)

   > [!TIP]
   > You can use a local Docker registry for prototype and testing purposes, instead of a cloud registry. 

To test your module on a device, you need an active IoT hub with at least one IoT Edge device. If you want to use your computer as an IoT Edge device, you can do so by following the steps in the tutorials for [Windows](quickstart.md) or [Linux](quickstart-linux.md). 

## Create a new solution template

The following steps show you how to create an IoT Edge solution that contains one C# Function module. Each solution can contain multiple modules.

1. In Visual Studio Code, select **View** > **Integrated Terminal**.
3. Select **View** > **Command Palette**.
4. In the command palette, type and run the command **Azure IoT Edge: New IoT Edge Solution**. 

   ![Run New IoT Edge Solution](./media/how-to-develop-csharp-module/new-solution.png)

5. Browse to the folder where you want to create the new solution, and click **Select folder**. 
6. Provide a name for your solution. 
7. Choose **Azure Functions - C#** as the template for the first module in the solution.
8. Provide a name for your module. Choose a name that's unique within your container registry. 
9. Provide the image repository for the module. VS Code autopopulates the module name, so you just have to replace **localhost:5000** with your own registry information. If you use a local Docker registry for testing, then localhost is fine. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **\<registry name\>.azurecr.io**.

VS Code takes the information you provided, creates an IoT Edge solution with a Function project, then loads it in a new window.

Within the solution you have three items: 

* A **.vscode** folder that contains debug configurations.
* A **modules** folder that contains subfolders for each module. Right now you only have one, but you could add more through the command palette with the command **Azure IoT Edge: Add IoT Edge Module**.
* A **.env** file lists your environment variables. If you are ACR as your registry, right now you have ACR username and password in it. 
* A **deployment.template.json** file lists your new module along with a sample **tempSensor** module, which simulates data that you can use for testing. For more information about how deployment manifests work, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

## Build your IoT Edge Function module for debugging purpose
1. To start debugging, you need to use **Dockerfile.amd64.debug** to rebuild your docker image and deploy your Edge solution again. In VS Code explorer, navigate to `deployment.template.json` file. Update your function image URL by adding a `.debug` in the end.

    ![Build Debug image](./media/how-to-debug-csharp-function/build-debug-image.png)

2. Rebuild your solution. In VS Code command palette, type and run the command **Azure IoT Edge: Build IoT Edge solution**.
3. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for Edge device**. Select the `deployment.json` file under the `config` folder. Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

You can check your container status in the VS Code Docker explorer or by running the `docker images` command in the terminal.

## Start debugging C# Function in VS Code
1. VS Code keeps debugging configuration information in a `launch.json` file located in a `.vscode` folder in your workspace. This `launch.json` file was generated when you created a new IoT Edge solution. It updates each time you add a new module that supports debugging. Navigate to the debug view and select the corresponding debug configuration file. The debug option name should be like **ModuleName Remote Debug (.NET Core)**
    ![Select debug configuration](./media/how-to-debug-csharp-function/select-debug-configuration.jpg)

2. Navigate to `run.csx`. Add a breakpoint in the function.
3. Click the **Start Debugging** button or press **F5**, and select the process to attach to.
4. In VS Code Debug view, you can see the variables in left panel. 


> [!NOTE]
> The above example shows how to debugging .Net Core IoT Edge Function on containers. It's based on the debug version of the `Dockerfile.amd64.debug`, which includes VSDBG(the .NET Core command-line debugger) in your container image while building it. We recommend you directly use or customize the `Dockerfile` without VSDBG for production-ready IoT Edge function after you finish debugging your C# function.

## Next steps

Once you have your module built, learn how to [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md)
