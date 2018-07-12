---
title: Debug C# modules for Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to develop, build, and debug a C# module for
 Azure IoT Edge
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 06/27/2018
ms.topic: article
ms.service: iot-edge

---

# Use Visual Studio Code to develop and debug C# modules for Azure IoT Edge

You can send your business logic to operate at the edge by turning it into modules for Azure IoT Edge. This article provides detailed instructions for using Visual Studio Code (VS Code) as the main development tool to develop C# modules.

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device can be another physical device, or you can simulate your IoT Edge device on your development machine.

> [!NOTE]
> This debugging tutorial describes how to attach a process in a module container and debug it with VS Code. You can only debug C# functions in linux-amd64 containers. If you aren't familiar with the debugging capabilities of Visual Studio Code, read about [Debugging](https://code.visualstudio.com/Docs/editor/debugging). 

Since this article uses Visual Studio Code as the main development tool, install VS Code and then add the necessary extensions:
* [Visual Studio Code](https://code.visualstudio.com/) 
* [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
* [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 
* [Docker extension](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)

To create a module, you need .NET which builds the project folder, Docker to build the module image, and a container registry to hold the module image:
* [.NET Core 2.1 SDK](https://www.microsoft.com/net/download).
* [Docker CE](https://docs.docker.com/install/) on your development machine. 
* [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags)

   > [!TIP]
   > You can use a local Docker registry for prototype and testing purposes, instead of a cloud registry. 

To test your module on a device, you need an active IoT hub with at least one IoT Edge device. If you want to use your computer as an IoT Edge device, you can do so by following the steps in the tutorials for [Windows](quickstart.md) or [Linux](quickstart-linux.md) 

## Create a new solution template

The following steps show you how to create an IoT Edge module based on .NET Core 2.0 using Visual Studio Code and the Azure IoT Edge extension. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules. 

1. In Visual Studio Code, select **View** > **Integrated Terminal**.
3. Select **View** > **Command Palette**. 
4. In the command palette, type and run the command **Azure IoT Edge: New IoT Edge Solution**.

   ![Run New IoT Edge Solution](./media/how-to-develop-csharp-module/new-solution.png)

5. Browse to the folder where you want to create the new solution, and click **Select folder**. 
6. Provide a name for your solution. 
7. Choose **C# Module** as the template for the first module in the solution.
8. Provide a name for your module. Choose a name that's unique within your container registry. 
9. Provide the image repository for the module. VS Code autopopulates the module name, so you just have to replace **localhost:5000** with your own registry information. If you use a local Docker registry for testing, then localhost is fine. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **\<registry name\>.azurecr.io**.

VS Code takes the information you provided, creates an IoT Edge solution, then loads it in a new window.

   ![View IoT Edge solution](./media/how-to-develop-csharp-module/view-solution.png)

Within the solution you have three items: 
* A **.vscode** folder contains debug configurations.
* A **modules** folder contains subfolders for each module. Right now you only have one, but you could add more in the command palette with the command **Azure IoT Edge: Add IoT Edge Module**. 
* A **.env** file lists your environment variables. If you are using ACR as your registry, right now you have ACR username and password in it. 
* A **deployment.template.json** file lists your new module along with a sample **tempSensor** module that simulates data that you can use for testing. For more information about how deployment manifests work, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

## Build and deploy your module for debugging

In each module folder, there are multiple Docker files for different container types. You can use any of these files that end with the extension **.debug** to build your module for testing. Currently, C# modules only support debugging in linux-amd64 containers.

1. In VS Code, navigate to the `deployment.template.json` file. Update your function image URL by adding **.debug** to the end.

   ![Add .debug to your image name](./media/how-to-develop-csharp-module/image-debug.png)

2. In the VS Code command palette, type and run the command **Edge: Build IoT Edge solution**.
3. Select the `deployment.template.json` file for your solution from the command palette. 
4. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for IoT Edge device**. 
5. Open the **config** folder of your solution, then select the `deployment.json` file. Click **Select Edge Deployment Manifest**. 

Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

You can check your container status in the VS Code Docker explorer or by run the `docker ps` command in the terminal.

## Start debugging C# module in VS Code
VS Code keeps debugging configuration information in a `launch.json` file located in a `.vscode` folder in your workspace. This `launch.json` file was generated when you created a new IoT Edge solution. It updates each time you add a new module that supports debugging. 

1. Navigate to the VS Code debug view and select the debug configuration file for your module. The debug option name should be like **ModuleName Remote Debug (.NET Core)**
    ![Select debug configuration](./media/how-to-develop-csharp-module/debug-config.png)

2. Navigate to `program.cs`. Add a breakpoint in this file.

3. Click the **Start Debugging** button or press **F5**, and select the process to attach to.

4. In VS Code Debug view, you can see the variables in left panel. 

> [!NOTE]
> The preceding example shows how to debug .NET Core IoT Edge modules on containers. It's based on the debug version of the `Dockerfile.debug`, which includes VSDBG (the .NET Core command-line debugger) in your container image while building it. After you finish debugging your C# modules, we recommend you directly use or customize `Dockerfile` without VSDBG for production-ready IoT Edge modules.

## Next steps

Once you have your module built, learn how to [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md)

