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

You can use IoT Edge modules to deploy code that implements your business logic directly to your IoT Edge devices. This tutorial walks you through creating and deploying a custom module that filters sensor data on the simulated IoT Edge device that you created in the [Azure Install IoT Edge tutorial](./tutorial-install-iot-edge.md). You learn how to:    

> [!div class="checklist"]
> * Create an Azure container registry
> * Use Visual Studio Code to create a custom module
> * Use VS Code and Docker to create a docker image and publish it to your registry 
> * Deploy the module to your IoT Edge device
> * View generated data


The custom module that you create in this tutorial ... (Not quite sure what we are doing with the filtered data) 

## Prerequisites

* The Azure IoT Edge device that you created in the [Azure Install IoT Edge tutorial](./tutorial-install-iot-edge.md). 
* [Visual Studio Code](https://code.visualstudio.com/). 
* The following Visual Studio Code extensions: 
  * [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). (You can install the extension from the extensions panel in Visual Studio Code.) 
  * [Azure IoT Edge extension](TBD). <br/>**Temporary Work-around**: The [Azure iot Toolkit extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) is a dependency of this extension and will be will be installed automatically. Temporary instructions: download [vsix](https://iotedge.blob.core.windows.net/vscode/azure-iot-edge-2017-09-08.vsix) and install using **Install from VSIX** in the menu that appears when clicking on the **…** button in the extensions panel in Visual Studio Code. 
* [Docker](https://docs.docker.com/engine/installation/). The Community Edition (CE) for your platform is sufficient for this tutorial. 
* [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
* [Nuget CLI](https://docs.microsoft.com/en-us/nuget/guides/install-nuget#nuget-cli). 

## Create an Azure container registry
An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. We'll use an Azure container registry to store our IoT Edge module. 

Add steps to create a container registry using [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal). Not sure whether we should use CLI, portal, or PS -- thoughts? 

Add a note that you can use any Docker-compatible container registry; for example, [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags).


## Configure the IoT Edge Visual Studio Code extension with your IoT hub connection string 
1. Open Visual Studio Code.
2. Use the **View | Explorer** menu command to open the VS Code explorer. 
3. In the explorer, click **IOT HUB DEVICES** and then click **...**. Click **Set IoT Hub Connection String** and enter the connection string for the IoT hub that your IoT Edge device is connected to.  

## Create a custom IoT Edge module project
The following steps show you how to create a IoT Edge module using Visual Studio Code and the IoT Edge extension.
1. Use the **View | Integrated Terminal** menu command to open the Visual Studio Code integrated terminal.
2. In the integrated terminal, enter the following command to create a project for the new module:
    ```cmd/sh
    dotnet new aziotedgemodule -n FilterModule
    ```
3. Use the  **File | Open Folder** menu command, browse to the **FilterModule**  folder, and click **Select Folder** to open the project in VS Code.
4. Use the **View | Command Palette... | Edge: Init Edge project** menu command to add assets to debug the app (Should this be "app" or "module"?).
5. Add steps here to copy and paste filter code.
6. Build the project. Use the **View | Explorer** menu command to open the VS Code explorer. In the explorer, right-click the **FilterModule.csproj** file and click **Build&Publish dotnet module**.

## Create a Docker image and publish it to your registry

1. In VS Code explorer, right-click the **Dockerfile** and click **Build Docker** Image.  
2. In integrated terminal, enter the following command:
    ```csh/sh
    run docker login
    ```
3. In explorer, right-click the **Dockerfile** and click **Push Docker Image**.
4. In the pop-up text box, **EXE_DIR** is a required parameter, enter `./bin/Debug/netcoreapp2.0/publish` and press **Enter**.
5. In the pop-up text box, specify the image URL. For example, `<docker registry address>/filgermodule:latest`

## Run the solution

1. On the [Azure portal](https://portal.azure.com), go to the device detail blade, click **deploy modules**. 
2. Select **custom module**, copy snippet 
{snippet} 
3. Click **start**. 
4. In the device detail blade, click **refresh** to see things working. 

## View generated data

You can use the hub explorer to view the filtered telemetry data from your IoT Edge device and monitor its status. 

## Next steps

In this tutorial, you created a custom module that contains code to filter raw data generated by your IoT Edge device. You can continue on to either of the following tutorials to learn about other ways that Azure IoT Edge can help you turn data into business insights at the edge.

> [!div class="nextstepaction"]
> [Deploy Azure Function as a module](tutorial-deploy-function.md)
> [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)
