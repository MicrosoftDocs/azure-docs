---
title: 'Tutorial - Modify the IoT Edge live video analytics modules'
description: This tutorial shows you how to modify and build the live video analytics gateway modules that the video analytics - object and motion detection application template uses.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---

# Tutorial: Modify and build the live video analytics gateway modules

This tutorial shows you how to modify the IoT Edge module code for the live video analytics (LVA) modules.

The previous tutorials use pre-built images of the modules.

## Prerequisites

To complete the steps in this tutorial, you need:

* [Node.js](https://nodejs.org/en/download/) v10 or later
* [Visual Studio Code](https://code.visualstudio.com/Download) with [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) extension installed
* [Docker](https://www.docker.com/products/docker-desktop) engine
* An [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) to host your versions of the modules.
* An [Azure Media Services](https://docs.microsoft.com/azure/media-services/) account. If you completed the previous tutorials, you can reuse the one you created previously.

## Clone the repository

If you haven't already cloned the repository, use the following command to clone it to a suitable location on your local machine:

```cmd
git clone https://github.com/Azure/live-video-analytics
```

Open the local *live-video-analytics* repository folder with VS Code.

## Edit the deployment.amd64.json file

1. If you haven't already done so, create a folder called *ref-apps/lva-edge-iot-central-gateway/storage* in the local copy of the **lva-gateway** repository. This folder is ignored by Git so as to prevent you accidentally checking in any confidential information.
1. Copy the file *deployment.amd64.json* from the *setup* folder to the *storage* folder.
1. In VS Code, open the the *storage/deployment.amd64.json* file.
1. Edit the `registryCredentials` section to add your Azure Container Registry credentials.
1. Edit the `LvaEdgeGatewayModule` module section to add the name of your image and your AMS account name in the `env:amsAccountName:value`.
1. Edit the `lvaYolov3` module section and add the name of your image.
1. Edit the `lvaEdge` module section and add the name of your image.
1. See the [Create a video analytics application in Azure IoT Central](tutorial-video-analytics-create-app.md) for more information about how to complete the configuration.

## Build the code

1. Before you try to build the code for the first time, use the VS Code terminal to run the `npm install` command. This command installs the required packages and runs the setup scripts.

    > [!TIP]
    > If you pull a newer version of the repository GitHub repo, delete the *node_modules* folder and run `npm install` again.

1. Edit the *./setup/imageConfig.json* file to update the image named based on your container registry name:

    ```json
    {
        "arch": "amd64",
        "imageName": "[Server].azurecr.io/lva-edge-gateway"
    }
    ```

1. Use the VS Code terminal to run the `docker login [your server].azurecr.io` command. Use the same credentials that you provided in the deployment manifest for the modules.

1. Use the VS Code terminal to run the **npm version patch** command. This build script deploys the images to your container registry. The output in the VS Code terminal window shows you if the build is successful.

1. The version of the **LvaEdgeGatewayModule** image increments every time the build completes. You need to use this version in the deployment manifest file.

## Next steps

Now that you've learned about the video analytics - object and motion detection application template and the LVA IoT Edge modules, the suggested next step is to learn more about:

> [!div class="nextstepaction"]
> [Building retail solutions with Azure IoT Central](overview-iot-central-retail.md)
