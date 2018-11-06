---
title: Debug Node.js modules for Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to develop and debug Node.js modules for Azure IoT Edge
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 09/21/2018
ms.topic: article
ms.service: iot-edge

---

# Use Visual Studio Code to develop and debug Node.js modules for Azure IoT Edge

You can send your business logic to operate at the edge by turning it into modules for Azure IoT Edge. This article provides detailed instructions for using Visual Studio Code (VS Code) as the main development tool to develop Node.js modules.

## Prerequisites
This article assumes that you use a computer or virtual machine running Windows, macOS or Linux as your development machine. Your IoT Edge device can be another physical device.

> [!NOTE]
> This debugging article demonstrates two typical ways to debug your Node.js module in VS Code. One way is to attach a process in a module container, while the other is to lanuch the module code in debug mode. If you aren't familiar with the debugging capabilities of Visual Studio Code, read about [Debugging](https://code.visualstudio.com/Docs/editor/debugging).

Since this article uses Visual Studio Code as the main development tool, install VS Code and then add the necessary extensions:
* [Visual Studio Code](https://code.visualstudio.com/) 
* [Azure IoT Edge extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
* [Docker extension](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)

To create a module, you need Node.js which includes npm to build the project folder, Docker to build the module image, and a container registry to hold the module image:
* [Node.js](https://nodejs.org)
* [Docker](https://docs.docker.com/engine/installation/)
* [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags)
   * You can use a local Docker registry for prototype and testing purposes, instead of a cloud registry. 

To setup local development environment to debug, run and test your IoT Edge solution, you need [Azure IoT EdgeHub Dev Tool](https://pypi.org/project/iotedgehubdev/). Install [Python (2.7/3.6) and Pip](https://www.python.org/). Pip is included with the Python installer. Then install **iotedgehubdev** by running below command in your terminal.

   ```cmd
   pip install --upgrade iotedgehubdev
   ```

To test your module on a device, you need an active IoT hub with at least one IoT Edge device ID created. If you are running IoT Edge daemon on development machine, you might need to stop EdgeHub and EdgeAgent before you move to next step. 

## Create a new solution template

The following steps show you how to create an IoT Edge module based on Node.js using Visual Studio Code and the Azure IoT Edge extension. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules. 

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
9. Provide the image repository for the module. VS Code autopopulates the module name, so you just have to replace **localhost:5000** with your own registry information. If you use a local Docker registry for testing, then localhost is fine. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **\<registry name\>.azurecr.io**. Only replace the localhost part of the string, don't delete your module name.

   ![Provide Docker image repository](./media/how-to-develop-node-module/repository.png)

VS Code takes the information you provided, creates an IoT Edge solution, then loads it in a new window.

Within the solution you have three items: 
* A **.vscode** folder contains debug configurations.
* A **modules** folder contains subfolders for each module. Right now you only have one, but you could add more in the command palette with the command **Azure IoT Edge: Add IoT Edge Module**. 
* A **.env** file lists your environment variables. If Azure Container Registry is your registry, you'll have an Azure Container Registry username and password in it.

   >[!NOTE]
   >The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables. 

* A **deployment.template.json** file lists your new module along with a sample **tempSensor** module that simulates data that you can use for testing. For more information about how deployment manifests work, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

## Develop your module

The default Node.js code that comes with the solution is located at **modules** > [your module name] > **app.js**. The module and the deployment.template.json file are set up so that you can build the solution, push it to your container registry, and deploy it to a device to start testing without touching any code. The module is built to simply take input from a source (in this case, the tempSensor module that simulates data) and pipe it to IoT Hub. 

When you're ready to customize the Node.js template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability. 

Visual Studio Code has support for Node.js. Learn more about [how to work with Node.js in VS Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial).

## Launch and debug module code without container

The IoT Edge Node.js module depends on Azure IoT Node.js Device SDK. In the default module code, you initialize a **ModuleClient** with environment settings and input name, which means the IoT Edge Node.js module requires the environment settings to start and run, and you also need to send or route messages to the input channels. Your default Node.js module only contains one input channel and the name is **input1**.

### Setup IoT Edge simulator for single module app

1. To setup and start the simulator, in VS Code command palette, type and select **Azure IoT Edge: Start IoT Edge Hub Simulator for Single Module**. You also need to specify the input names for your single module application, type **input1** and press Enter. The command will trigger **iotedgehubdev** CLI and start IoT Edge simulator and a testing utility module container. You can see the outputs below in the integrated terminal if the simulator has been started in single module mode successfully. You can also see a `curl` command to help send message through. You will use it later.

   ![Setup IoT Edge simulator for single module app](media/how-to-develop-csharp-module/start-simulator-for-single-module.png)

   You can move to Docker Explorer and see the module running status.

   ![Simulator module status](media/how-to-develop-csharp-module/simulator-status.png)

   The **edgeHubDev** container is the core of the local IoT Edge simulator. It can run on your development machine without IoT Edge security daemon and provide environment settings for your native module app or module containers. The **input** container exposed restAPIs to help bridge messages to target input channel on your module.

2. In VS Code command palette, type and select **Azure IoT Edge: Set Module Credentials to User Settings** to set the module environment settings into `azure-iot-edge.EdgeHubConnectionString` and `azure-iot-edge.EdgeModuleCACertificateFile` in user settings. You can find these environment settings are referenced in **.vscode** > **launch.json** and [VS Code user settings](https://code.visualstudio.com/docs/getstarted/settings).

### Debug Node.js module in launch mode

1. In integrated terminal, change directory to **NodeModule** folder, run the following command to install Node packages

   ```cmd
   npm install
   ```

2. Navigate to `app.js`. Add a breakpoint in this file.

3. Navigate to VS Code debug view. Select the debug configuration **ModuleName Local Debug (Node.js)**. 

4. Click **Start Debugging** or press **F5**. You will start the debug session.

5. In VS Code integrated terminal, run the following command to send a **Hello World** message to your module. This is the command showed in previous steps when setup IoT Edge simulator successfully. You might need to create or switch to another integrated terminal if current one is blocked.

    ```cmd
    curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
    ```

   > [!NOTE]
   > If you are using Windows, making sure the shell of your VS Code integrated terminal is **Git Bash** or **WSL Bash**. You cannot run `curl` command in PowerShell or Command Prompt. 
   
   > [!TIP]
   > You can also use [PostMan](https://www.getpostman.com/) or other API tools to send messages through instead of `curl`.

6. In VS Code Debug view, you'll see the variables in the left panel. 

7. To stop debugging session, click the Stop button or press **Shift + F5**. And in VS Code command palette, type and select **Azure IoT Edge: Stop IoT Edge Simulator** to stop and clean the simulator.


## Build module container for debugging and debug in attach mode

Your default solution contains two modules, one is a simulated temperature sensor module and the other is the Node.js pipe module. The simulated temperature sensor keeps sending messages to Node.js pipe module, and then the messages are piped to IoT Hub. In the module folder you created, there are several Docker files for different container types. Use any of these files that end with the extension **.debug** to build your module for testing. Currently, Node.js modules only support debugging in linux-amd64, windows-amd64 and linux-arm32v7 containers.

### Setup IoT Edge simulator for IoT Edge solution

In your development machine, you can start IoT Edge simulator instead of installing the IoT Edge security daemon to run your IoT Edge solution. 

1. In device explorer on the left side, right-click on your IoT Edge device ID, select **Setup IoT Edge Simulator** to start the simulator with the device connection string.

2. You can see the IoT Edge Simulator has been successfully setup in integrated terminal.

### Build and run container for debugging and debug in attach mode

1. In VS Code, navigate to the `deployment.template.json` file. Update your module image URL by adding **.debug** to the end.

2. Replace the Node.js module createOptions in **deployment.template.json** with below content and save this file: 
    ```json
    "createOptions": "{\"ExposedPorts\":{\"9229/tcp\":{}},\"HostConfig\":{\"PortBindings\":{\"9229/tcp\":[{\"HostPort\":\"9229\"}]}}}"
    ```

3. Navigate to the VS Code debug view. Select the debug configuration file for your module. The debug option name should be similar to **ModuleName Remote Debug (Node.js)** or **ModuleName Remote Debug (Node.js in Windows Container)**, which depends on your container type on development machine.

4. Select **Start Debugging** or select **F5**. Select the process to attach to.

5. In VS Code Debug view, you'll see the variables in the left panel.

6. To stop debugging session, click the Stop button or press **Shift + F5**. And in VS Code command palette, type and select **Azure IoT Edge: Stop IoT Edge Simulator**.

> [!NOTE]
> The preceding example shows how to debug Node.js IoT Edge modules on containers. It added exposed ports in your module container createOptions. After you finish debugging your Node.js modules, we recommend you remove these exposed ports for production-ready IoT Edge modules.

## Next steps

Once you have your module built, learn how to [Deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md)

To develop modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).
