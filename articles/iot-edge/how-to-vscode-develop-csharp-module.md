---
title: Use Azure IoT Edge extension for VS Code to develop C# module | Microsoft Docs
description: Develop and deploy a C# module with Azure IoT Edge in Visual Studio Code, without context switching.
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 01/11/2018
ms.topic: article
ms.service: iot-edge

---

# Use Visual Studio Code to develop a C# module with Azure IoT Edge
This article provides detailed instructions for using [Visual Studio (VS) Code](https://code.visualstudio.com/) as the main development tool to develop and deploy your Azure IoT Edge modules. 

## Prerequisites
This article assumes that you are using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device can be another physical device, or you can simulate your IoT Edge device on your development machine. To learn how to simulate an IoT Edge device, follow the tutorials for [Windows](tutorial-simulate-device-windows.md) or [Linux](tutorial-simulate-device-linux.md).

To complete all the steps in this article, have the following prerequisites in place:

- [Visual Studio Code](https://code.visualstudio.com/) 
- [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 
- [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 
- [Docker](https://docs.docker.com/engine/installation/)
- [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd) 
- AzureIoTEdgeModule template (`dotnet new -i Microsoft.Azure.IoT.Edge.Module`)
- An active IoT hub with at least one IoT Edge device

It is also helpful to install [Docker support for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) to better manage your module images and containers.

## View your IoT hub devices
There are two ways to list your IoT hub devices in Visual Studio Code. You can either sign in to your Azure account and then see all of the IoT hubs in your subscription, or you can provide the connection string for a particular IoT hub. The following two sections walk through the steps for both methods. 

### Sign in to your Azure account

1. In Visual Studio Code, open the command palette by selecting **View** > **Command palette** or the keys **Ctrl + Shift + P**.
2. Type and select **Azure: Sign in**. 
3. Select **Copy & Open**. 
4. Paste the code in your browser, and select **Continue**. Then sign in with your Azure account. You can see your account info in the VS Code status bar.
5. In the command palette again, type and select **IoT: Select IoT Hub**.
6. First, select the subscription that contains your IoT hub. Then, choose the IoT hub that contains the IoT Edge device.

You can see the device list in IoT Hub Devices Explorer, in the side bar on the left.

![Screenshot of device list](./media/how-to-vscode-develop-csharp-module/device-list.png)

### Set the IoT hub connection string

1. In the Azure portal, navigate to your IoT hub and select **Shared access policies**. 
2. Select **iothubowner** then copy the value of **Connection string-primary key**.
3. In Visual Studio Code, open the command palette by selecting **View** > **Command palette** or the keys **Ctrl + Shift + P**.
4. In the command palette, type and select **IoT: Set IoT Hub Connection String**.
5. Paste the connecting string that you copied. 
 
You can see the device list in IoT Hub Devices Explorer, in the side bar on the left.

![Screenshot of device list](./media/how-to-vscode-develop-csharp-module/device-list.png)

## Start the IoT Edge runtime

Install and start the Azure IoT Edge runtime on your device. 
1. In the Visual Studio Code command palette, select **Edge: Setup Edge** and choose your IoT Edge device ID. Alternatively, right-click the IoT Edge device ID from the device list and select **Setup Edge**.

    ![Screenshot of Setup Edge runtime](./media/how-to-vscode-develop-csharp-module/setup-edge.png)

2. In the command palette, select **Edge: Start Edge** to start your IoT Edge runtime. You can see corresponding outputs in the integrated terminal.

    ![Screenshot of Start Edge runtime](./media/how-to-vscode-develop-csharp-module/start-edge.png)

3. Check the IoT Edge runtime status in the Docker Explorer. Green means it's running, and your IoT Edge runtime started successfully.

    ![Screenshot of Edge runtime status](./media/how-to-vscode-develop-csharp-module/edge-runtime.png)

## Develop a C# module

This section introduces how to use Visual Studio Code to develop an IoT Edge module in C# and publish it to your container registry. For a walkthrough that provides code for a sample module that you can test, see the tutorial [Develop and deploy a C# IoT Edge module to your simulated device](tutorial-csharp-module.md).

### Start a local Docker registry
You can use any Docker-compatible registry for this article. Two popular Docker registry services available in the cloud are [Azure Container Registry](../container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This article uses a [local Docker registry](https://docs.docker.com/registry/deploying/), which is easier for testing during your early development.

Open the Visual Studio Code integrated terminal by selecting **View** > **Integrated Terminal** or with the keys **Ctrl + `**. Then, run the following command to start a local registry:  

```cmd/sh
docker run -d -p 5000:5000 --name registry registry:2 
```

> [!NOTE]
> This example shows registry configurations that are only appropriate for testing. A production-ready registry must be protected by TLS, and should use an access-control mechanism. We recommend you use Azure Container Registry or Docker Hub to deploy production-ready IoT Edge modules.

### Create an IoT Edge module project
Create an IoT Edge module based on .NET Core 2.0, by using Visual Studio Code and the Azure IoT Edge extension.

1. Open the Visual Studio Code integrated terminal by selecting **View** > **Integrated Terminal** or with the keys **Ctrl + `**.
3. In the integrated terminal, enter the following command to install (or update) the AzureIoTEdgeModule template in dotnet:

    ```cmd/sh
    dotnet new -i Microsoft.Azure.IoT.Edge.Module
    ```

2. Create a project for the new module. The following command creates the project folder called **CSharpModule**, in the current working folder:

    ```cmd/sh
    dotnet new aziotedgemodule -n CSharpModule
    ```
 
3. Select  **File** > **Open Folder**.
4. Browse to the **CSharpModule**  folder, and click **Select Folder** to open the project in VS Code.
5. Edit the templates in this folder to create your IoT Edge module, or replace them with your own files. 
6. To build the project, right-click the **CSharpModule.csproj** file in Explorer, and select **Build IoT Edge module**. This process compiles the module, and exports the binary and its dependencies into a folder that is used to create a Docker image. 

    ![Screenshot of VS Code Explorer](./media/how-to-vscode-develop-csharp-module/build-module.png)

### Create a Docker image and publish it to your registry

1. In the VS Code explorer, expand the **Docker** folder. 
2. Expand the folder for your container platform, either **linux-x64** or **windows-nano**.
3. Right-click the **Dockerfile** file, and select **Build IoT Edge module Docker image**. 

    ![Screenshot of VS Code Explorer](./media/how-to-vscode-develop-csharp-module/build-docker-image.png)

4. In the **Select Folder** window, either browse to or enter `./bin/Debug/netcoreapp2.0/publish`. Select **Select Folder as EXE_DIR**.
5. In the pop-up text box at the top of the VS Code window, enter the image name. For example: `<your container registry address>/csharpmodule:latest`. If you are deploying to local registry, it should be `localhost:5000/csharpmodule:latest`.
6. Push the image to your Docker repository. In the command palette, select **Edge: Push IoT Edge module Docker image**.
7. In the text box that pops up, enter the same image URL for your module, like `<your container registry address/csharpmodule:latest`. 
8. Check the console log to make sure the image has been successfully pushed.

    ![Screenshot of pushing the Docker image](./media/how-to-vscode-develop-csharp-module/push-image.png)
    ![Screenshot of console log](./media/how-to-vscode-develop-csharp-module/pushed-image.png)

## Deploy your module

To deploy your module to a device, first create the deployment manifest and then select the IoT Edge device to receive it. 

### Create the deployment manifest

When you deploy modules in the Azure portal the deployment wizard walks through steps to declare modules and set up the routes between them. However, you can define the deployment manually by editing the deployment manifest in Visual Studio Code. 

The projec that you created contains a deployment manifest template, the `deployment.json` file. For details about how to build a deployment manifest, and a sample file, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

### Deploy to an IoT Edge device

1. In the command palette, select **Edge: Create deployment for Edge device** then choose your IoT Edge device ID to create a deployment. Or, right-click the device ID in the device list, and select **Create deployment for Edge device**.

    ![Screenshot of Create deployment option](./media/how-to-vscode-develop-csharp-module/create-deployment.png)

5. Select the `deployment.json` file that you updated. In the output window, you can see corresponding outputs for your deployment.

    ![Screenshot of output window](./media/how-to-vscode-develop-csharp-module/deployment-succeeded.png)

6. Right-click your IoT Edge device ID, and you can monitor D2C messages in VS Code.
7. To stop your IoT Edge runtime and any modules, type and select **Edge: Stop Edge** in the command palette.

## Next steps

[Debug C# module in VS Code](how-to-vscode-debug-csharp-module.md)
