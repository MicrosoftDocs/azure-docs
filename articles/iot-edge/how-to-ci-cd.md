---
title: IoT Edge continuous integration and continuous deployment | Microsoft Docs
description: Overview of the continuous integration and continuous deployment for IoT Edge
services: iot-Edge
documentationcenter: ''
author: shizn
manager: timlt

ms.author: xshi
ms.date: 4/24/2018
ms.topic: article
ms.service: iot-edge
---

# Continuous integration and continuous deployment to Azure IoT Edge - preview
This tutorial demonstrates how you can use the continuous integration and continuous deployment features of Visual Studio Team Services (VSTS) and Microsoft Team Foundation Server (TFS) to build, test, and deploy applications quickly and efficiently to your Azure IoT Edge. 

In this tutorial, you will learn how to:
> [!div class="checklist"]
> * Create and check in a sample IoT Edge solution containing unit tests.
> * Install Azure IoT Edge extension for your VSTS.
> * Configure continuous integration (CI) to build the solution and run the unit tests.
> * Configure continuous deployment (CD) to deploy the solution and view responses.

It will take 30 minutes to complete this tutorial.

## Create a sample Azure IoT Edge solution using Visual Studio Code

In this section, you will create a simple IoT Edge solution containing unit tests that you can execute as part of the build process. Before following the guidance in this section, complete the steps in [Develop an IoT Edge solution with multiple modules in Visual Studio Code](tutorial-multiple-modules-in-vscode.md).

1. In VS Code command palette, type and run the command **Edge: New IoT Edge solution**. Then select your workspace folder, provide the solution name (The default name is **EdgeSolution**), and create a C# Module (**pipemodule**) as the first user module in this solution. You also need to specify the Docker image repository for your first module. The default image repository is based on a local Docker registry (`localhost:5000/pipemodule`). You need to change it to Azure Container Registry(`<your container registry address>/pipemodule`) or Docker Hub for furthur continuous integration.

2. The VS Code window will load your IoT Edge solution workspace. You can optionally type and run **Edge: Add IoT Edge module** to add more modules. There is a `modules` folder, a `.vscode` folder and a deployment manifest template file in the root folder. All user module codes will be subfolders under the folder `modules`. The `deployment.template.json` is the deployment manifest template. Some of the parameters in this file will be parsed from the `module.json`, which exists in every module folder.

3. Now your sample IoT Edge solution with single basic modules is ready. The default C# module acts as a pipe message module. In the `deployment.template.json`, you will see this solution contains two modules. The message will be generated from the `tempSensor` module, and will be directly piped via `SampleModule`, then sent to your IoT hub.



