---
title: Use Azure IoT Edge extension for VS Code to deploy Function | Microsoft Docs
description: Develop and deploy a C# Azure Functions with Azure IoT Edge in VS Code
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 12/20/2017
ms.topic: article
ms.service: iot-edge

---
# Use Visual Studio Code to develop and deploy Azure Functions to Azure IoT Edge

This article provides detailed instructions for using [Visual Studio Code](https://code.visualstudio.com/) as the main development tool to develop and deploy Azure Functions on IoT Edge. 

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device could be another physical device or you can simulate your IoT Edge device on your development machine.

Complete the following tutorials before you start this guidance:
- Deploy Azure IoT Edge on a simulated device in [Windows](tutorial-simulate-device-windows.md) or [Linux](tutorial-simulate-device-linux.md)
- [Deploy Azure Functions](tutorial-deploy-function.md)

Once you complete those tutorials, you should have the following prerequisites ready:
- [Visual Studio Code](https://code.visualstudio.com/). 
- [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge). 
- [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). 
- [Docker](https://docs.docker.com/engine/installation/)
- [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
- [Python 2.7](https://www.python.org/downloads/)
- [IoT Edge control script](https://pypi.python.org/pypi/azure-iot-edge-runtime-ctl)
- AzureIoTEdgeFunction template (`dotnet new -i Microsoft.Azure.IoT.Edge.Function`)
- An active IoT hub with at least an IoT Edge device.

It is also suggested to install [Docker support for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) to better manage your module images and containers.

> [!NOTE]
> Currently, Azure Functions on IoT Edge only supports C#.

## Develop Azure IoT Functions in VS Code
In the tutorial [Deploy Azure Functions](tutorial-deploy-function.md), you update, build, and publish your function module images in Visual Studio (VS) Code and then visit Azure portal to deploy Azure Functions. If you want sample code to create a working Function module, follow the steps in that tutorial. This section introduces the features in Visual Studio Code that you can use to deploy and monitor your Azure Functions.

### Start a local docker registry
You can use any Docker-compatible registry for your IoT Edge modules. Two popular Docker registry services available in the cloud are [Azure Container Registry](../container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). 

When you're in the early development stage, it's easier to set up a [local Docker registry](https://docs.docker.com/registry/deploying/) for testing.

1. Open the Visual Studio Code integrated terminal by selecting **View** > **Integrated terminal** or by pressing the keys **Ctrl + `**.
2. Run the following command to start a local registry:

   ```cmd/sh
   docker run -d -p 5000:5000 --name registry registry:2 
   ```

The registry configurations in this example are only appropriate for testing. A production-ready registry must be protected by TLS and should ideally use an access-control mechanism. We recommend [Azure Container Registry](../container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags) for IoT Edge modules in production.

### Create a function project
This section provides the steps to create an IoT Edge module based on .NET core 2.0 using Visual Studio Code and the Azure IoT Edge extension. 

1. In Visual Studio Code, select **View** > **Integrated Terminal** to open the VS Code integrated terminal.
2. Install (or update) the **AzureIoTEdgeFunction** template in dotnet. Run the following command in the integrated terminal:

   ```cmd/sh
   dotnet new -i Microsoft.Azure.IoT.Edge.Function
   ```
3. Create a project for the new module. The following command creates a project folder called **FilterFunction** in the current working folder:

   ```cmd/sh
   dotnet new aziotedgefunction -n FunctionModule
   ```
 
4. Select **File > Open Folder**.
5. Browse to the **FilterModule** folder and click **Select Folder** to open the project in VS Code.

The FunctionModule folder contains the shell for a Functions module that you can customize for your IoT Edge solution. 

## Create a Docker image and publish it to your registry

1. In VS Code explorer, expand the **Docker** folder. Then expand the folder for your container platform, either **linux-x64** or **windows-nano**.
2. Right-click the **Dockerfile** file and click **Build IoT Edge module Docker image**. 

    ![Build docker image](./media/how-to-vscode-develop-csharp-function/build-docker-image.png)

3. Navigate to the **FunctionModule** project folder and click **Select Folder as EXE_DIR**. 
4. In the pop-up text box at the top of the VS Code window, enter the image name. For example: `<your container registry address>/functionmodule:latest`. If you are deploying to local registry, it should be `localhost:5000/functionmodule:latest`.
5. Push the image to your Docker repository. Use the **Edge: Push IoT Edge module Docker image** command and enter the image URL in the pop-up text box at the top of the VS Code window. Use the same image URL you used in above step.
    ![Push docker image](./media/how-to-vscode-develop-csharp-function/push-image.png)

## Deploy your function

You can deploy IoT Edge modules to connected IoT Edge devices from the Azure portal, or you can do it from within Visual Studio Code. 

### Create the deployment manifest

When you deploy modules in the Azure portal the deployment wizard walks through steps to declare modules and set up the routes between them. You can define the deployment manually by editing the deployment manifest in Visual Studio Code. 

The Function projec that you created contains a deployment manifest template, the `deployment.json` file. For details about how to build a deployment manifest, and a sample file, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

### Deploy to an IoT Edge device

1. In the **IoT Hub Devices** section of Visual Studio Code, right-click the device that you want to run the modules.
2. Select **Create deployment for Edge device**.

    ![Create deployment](./media/how-to-vscode-develop-csharp-function/create-deployment.png)

2. Select the `deployment.json` file that you updated. In the output window, you can see corresponding outputs for your deployment.
3. Start your Edge runtime in Command Palette with the command **Edge: Start Edge**
4. You can see your IoT Edge runtime start running in the Docker explorer with the simulated sensor and filter function.

    ![Solution running](./media/how-to-vscode-develop-csharp-function/solution-running.png)

5. Right-click your Edge device ID, and you can monitor D2C messages in VS Code.

    ![Monitor messages](./media/how-to-vscode-develop-csharp-function/monitor-d2c-messages.png)


## Next steps

[Debug Azure Functions in VS Code](how-to-vscode-debug-azure-function.md)
