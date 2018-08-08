---
title: Debug Node.js modules for Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to develop and debug Node.js modules for
 Azure IoT Edge
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 06/26/2018
ms.topic: article
ms.service: iot-edge

---

# Develop and debug Node.js modules with Azure IoT Edge for Visual Studio Code

You can send your business logic to operate at the edge by turning it into modules for Azure IoT Edge. This article provides detailed instructions for using Visual Studio Code (VS Code) as the main development tool to develop C# modules.

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device can be another physical device, or you can simulate your IoT Edge device on your development machine.

> [!NOTE]
> This debugging tutorial describes how to attach a process in a module container and debug it with VS Code. You can debug Node.js modules in linux-amd64, windows and arm32 containers. If you aren't familiar with the debugging capabilities of Visual Studio Code, read about [Debugging](https://code.visualstudio.com/Docs/editor/debugging). 

Since this article uses Visual Studio Code as the main development tool, install VS Code and then add the necessary extensions:
* [Visual Studio Code](https://code.visualstudio.com/) 
* [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
* [Docker extension](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)

To create a module, you need Node.js which includes npm to build the project folder, Docker to build the module image, and a container registry to hold the module image:
* [Node.js](https://nodejs.org)
* [Docker](https://docs.docker.com/engine/installation/)
* [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags)

   >[!TIP]
   >You can use a local Docker registry for prototype and testing purposes, instead of a cloud registry. 

To test your module on a device, you need an active IoT hub with at least one IoT Edge device. If you want to use your computer as an IoT Edge device, you can do so by following the steps in the tutorials for [Windows](quickstart.md) or [Linux](quickstart-linux.md). 

## Create a new solution template

The following steps show you how to create an IoT Edge module based on .NET Core 2.0 using Visual Studio Code and the Azure IoT Edge extension. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules. 

1. In Visual Studio Code, select **View** > **Integrated Terminal**.
2. In the integrated terminal, enter the following command to install (or update) the latest version of the Azure IoT Edge module template for Node.js:

   ```cmd/sh
   npm install -g yo generator-azure-iot-edge-module
   ```
3. In Visual Studio Code, select **View** > **Command Palette**. 
4. In the command palette, type and run the command **Azure IoT Edge: New IoT Edge Solution**.

   ![Run New IoT Edge Solution](./media/how-to-develop-csharp-module/new-solution.png)

5. Browse to the folder where you want to create the new solution, and click **Select folder**. 
6. Provide a name for your solution. 
7. Choose **Node.js Module** as the template for the first module in the solution.
8. Provide a name for your module. Choose a name that's unique within your container registry. 
9. Provide the image repository for the module. VS Code autopopulates the module name, so you just have to replace **localhost:5000** with your own registry information. If you use a local Docker registry for testing, then localhost is fine. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **\<registry name\>.azurecr.io**.

VS Code takes the information you provided, creates an IoT Edge solution, then loads it in a new window.

Within the solution you have three items: 
* A **.vscode** folder contains debug configurations.
* A **modules** folder contains subfolders for each module. Right now you only have one, but you could add more in the command palette with the command **Azure IoT Edge: Add IoT Edge Module**. 
* A **.env** file lists your environment variables. If you are ACR as your registry, right now you have ACR username and password in it. 

   >[!NOTE]
   >The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables. 

* A **deployment.template.json** file lists your new module along with a sample **tempSensor** module that simulates data that you can use for testing. For more information about how deployment manifests work, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

## Devlop your module

The default Azure Function code that comes with the solution is located at **modules** > **\<your module name\>** > **app.js**. The module and the deployment.template.json file are set up so that you can build the solution, push it to your container registry, and deploy it to a device to start testing without touching any code. The module is built to simply take input from a source (in this case, the tempSensor module that simulates data) and pipe it to IoT Hub. 

When you're ready to customize the Node.js template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability. 

## Build and deploy your module for debugging

In each module folder, there are multiple Docker files for different container types. You can use any of these files that end with the extension **.debug** to build your module for testing. Currently, C# modules only support debugging in linux-amd64 containers.

1. In VS Code, navigate to the `deployment.template.json` file. Update your module image URL by adding **.debug** to the end.
2. Replace the Node.js module createOptions in **deployment.template.json** with below content and save this file: 
    ```json
    "createOptions": "{\"ExposedPorts\":{\"9229/tcp\":{}},\"HostConfig\":{\"PortBindings\":{\"9229/tcp\":[{\"HostPort\":\"9229\"}]}}}"
    ```

2. In the VS Code command palette, type and run the command **Azure IoT Edge: Build IoT Edge solution**.
3. Select the `deployment.template.json` file for your solution from the command palette. 
4. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for IoT Edge device**. 
5. Open the **config** folder of your solution, then select the `deployment.json` file. Click **Select Edge Deployment Manifest**. 

Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

You can check your container status in the VS Code Docker explorer or by run the `docker ps` command in the terminal.

## Start debugging Node.Js module in VS Code

VS Code keeps debugging configuration information in a `launch.json` file located in a `.vscode` folder in your workspace. This `launch.json` file was generated when you created a new IoT Edge solution. It updates each time you add a new module that supports debugging. 

1. Navigate to the VS Code debug view and select the debug configuration file for your module.

2. Navigate to `app.js`. Add a breakpoint in this file.

3. Click the **Start Debugging** button or press **F5**, and select the process to attach to.

4. In VS Code Debug view, you can see the variables in left panel. 

The preceding example shows how to debug Node.js IoT Edge modules on containers. It added exposed ports in your module container createOptions. After you finish debugging your Node.js modules, we recommend you remove these exposed ports for production-ready IoT Edge modules.

## Next steps

Once you have your module built, learn how to [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md)

To develop modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).
