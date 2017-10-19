---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy a custom module for Azure IoT Edge | Microsoft Docs 
description: Create a custom module and deploy it to an edge device
services: iot-edge
keywords: 
author: JimacoMS2
manager: timlt

ms.author: v-jamebr
ms.date: 10/18/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy a custom IoT Edge module to your simulated device

Custom modules blah blah. 

In this tutorial, you will create a custom module that blah blah, install it on the device you created in the [Azure Install IoT Edge tutorial](./tutorial-install-iot-edge.md), and observe blah blah. This tutorial assumes that you have completed the [Azure Install IoT Edge tutorial](./tutorial-install-iot-edge.md) to create an IoT edge device to install your module on. 

## Prerequisites

* The devbox or VM with the Azure IoT Edge runtime installed that you created in the [Azure Install IoT Edge tutorial](./tutorial-install-iot-edge.md). (You can use any VM or devbox with the IoT Edge runtime installed, but you may have to modify steps in this tutorial to do so.)  
* [Visual Studio Code](https://code.visualstudio.com/). 
* The following Visual Studio Code extensions: 
  * [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). (You can install the extension from the extensions panel in Visual Studio Code.) 
  * [Azure IoT Edge extension](TBD). **NOTE**: The [Azure iot Toolkit extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a dependency of this extension and will be will be installed automatically. Temporary instructions: download [vsix](https://iotedge.blob.core.windows.net/vscode/azure-iot-edge-2017-09-08.vsix) and install using **Install from VSIX** in the menu that appears when clicking on the **…** button in the extensions panel in Visual Studio Code. 
* [Docker](https://docs.docker.com/engine/installation/). The Community Edition (CE) for your platform is sufficient for this tutorial. 
* [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
* [Nuget CLI](https://docs.microsoft.com/en-us/nuget/guides/install-nuget#nuget-cli). 

 
## Create a container registry
Add steps to create a container registry using [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal). Add a note that you can use any Docker-compatible container registry; for example, [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags).


## Configure the  IoT Edge Visual Studio Code extension with your IoT hub connection string 
1. Open Visual Studio Code.
2. Use the **View | Explorer** menu command to open the VS Code explorer. 
3. In the explorer, click **IOT HUB DEVICES**, and then click **...**. Click **Set IoT Hub Connection String** and enter the connection string for the IoT Hub that your IoT Edge device is connected to.  

## Create a custom module project

1. Use the **View | Integrated Terminal** menu command to open the Visual Studio Code integrated terminal.
2. In the integrated terminal, create a project for the new module. At the terminal prompt, enter `dotnet new aziotedgemodule -n FilterModule`.
3. Use the  **File | Open Folder** menu command, browse to the **FilterModule**  folder, and click **Select Folder** to open the project in VS Code.
4. Use the **View | Command Palette... | Edge: Init Edge project** menu command to add assets to debug the app (app or module?).
5. Add steps to copy and paste filter code.
6. Build the project. Use the **View | Explorer** menu command to open the VS Code explorer. In the explorer, right-click the **FilterModule.csproj** file and click **Build&Publish dotnet module**.

## Create Docker image and publish to registry

1. In VS Code explorer, right-click the **Dockerfile** and click **Build Docker** Image.  
2. In integrated terminal **run docker login**.
3. In explorer, right-click the **Dockerfile** and click **Push Docker Image**.
4. In the pop-up textbox, **EXE_DIR** is a required parameter, enter `./bin/Debug/netcoreapp2.0/publish` and press **Enter**.
5. In the pop-up textbox, specify the image URL. For example, `<docker registry address>/filgermodule:latest`

## Run the solution

1. On the [Azure portal](https://portal.azure.com), go to the device detail blade, click **deploy modules**. 
2. Select **custom module**, copy snippet 
{snippet} 
3. Click **start**. 
4. In the device detail blade, click **refresh**, see things working. 