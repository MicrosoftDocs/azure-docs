---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Work with multiple IoT Edge modules in Visual Studio Code | Microsoft Docs 
description: Deploy Azure Machine Learning as a module to an edge device
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 03/18/2018
ms.topic: article
ms.service: iot-edge

---

# Develop an IoT Edge solution with multiple modules in Visual Studio Code - preview
You can use Visual Studio Code to develop your IoT Edge solution with multiple modules. This article walks through creating, updating, and deploying an IoT Edge solution that pipes sensor data on the simulated IoT Edge device in Visual Studio Code. In this article, you learn how to:

* Use Visual Studio Code to create an IoT Edge solution
* Use VS Code to add a new module to your working IoT Edge solution. 
* Deploy the IoT Edge solution (multiple modules) to your IoT Edge device
* View generated data

## Prerequisites
* Complete below tutorials
  * [Deploy C# module](tutorial-csharp-module.md)
  * [Deploy C# Function](tutorial-deploy-function.md)
  * [Deploy Python module](tutorial-python-module.md)
* [Docker for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) with explorer integration for managing Images and Containers.


## Prepare your first IoT Edge solution
1. In VS Code command palette, type and run the command **Edge: New IoT Edge solution**. Then select your workspace folder, provide the solution name (The default name is **EdgeSolution**), and create a C# Module (**SampleModule**) as the first user module in this solution. You also need to specify the Docker image repository for your first module. The default image repository is based on a local Docker registry (`localhost:5000/<first module name>`). You can also change it to Azure container registry or Docker Hub.

> [!NOTE]
> If you are using a local Docker registry, please make sure the registry is running by typing the command `docker run -d -p 5000:5000 --restart=always --name registry registry:2` in your console window.

2. The VS Code window will load your IoT Edge solution workspace. There is a `modules` folder, a `.vscode` folder and a deployment manifest template file in the root folder. You can see debug configurations in `.vscode` folder. All user module codes will be subfolders under the folder `modules`. The `deployment.template.json` is the deployment manifest template. Some of the parameters in this file will be parsed from the `module.json`, which exists in every module folder.

3. Add your second module into this solution project. This time type and run **Edge: Add IoT Edge module** and select the deployment template file to update. Then select an **Azure Function - C#** with name **SampleFunction** and its Docker image repository to add.

4. Now your first IoT Edge solution with two basic modules is ready. The default C# module acts as a pipe message module while the C# Funtion acts as a pipe message function. In the `deployment.template.json`, you will see this solution contains three modules. The message will be generated from the `tempSensor` module, and will be directly piped via `SampleModule` and `SampleFunction`, then sent to your IoT hub. Update the routes for these modules with below content. 
   ```json
        "routes": {
          "SensorToPipeModule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/SampleModule/inputs/input1\")",
          "PipeModuleToPipeFunction": "FROM /messages/modules/SampleModule/outputs/output1 INTO BrokeredEndpoint(\"/modules/SampleFunction/inputs/input1\")",
          "PipeFunctionToIoTHub": "FROM /messages/modules/SampleFunction/outputs/output1 INTO $upstream"
        },
   ```

5. Save this file.

## Build and deploy your IoT Edge solution
1. In VS Code command palette, type and run the command **Edge: Build IoT Edge solution**. Based on the `module.json` file in each module folder, this command will check and start to build, containerize and push each module docker image. Then it will parse the required value to `deployment.template.json`, generate the `deployment.json` with actual value under `config` folder. You can see the build progress in VS Code integrated terminal.

2. In Azure IoT Hub Devices explorer, right-click an IoT Edge device ID, then select **Create deployment for Edge device**. Select the `deployment.json` under `config` folder. Then you can see the deployment is successfully created with a deployment ID in VS Code integrated terminal.

3. If you are [simulating an IoT Edge device](tutorial-simulate-device-linux.md) on your development machine. You will see that all the module image containers will be started in a few minutes.

## View generated data

1. To monitor data arriving at the IoT hub, select the **View** > **Command Palette...** and search for **IoT: Start monitoring D2C message**. 
2. To stop monitoring data, use the **IoT: Stop monitoring D2C message** command in the Command Palette. 

## Next steps

You can continue on to either of the following articles to learn about other scenarios when developing Azure IoT Edge in Visual Studio Code:

* [Debug a C# module in VS Code](how-to-vscode-debug-csharp-module.md)
* [Debug a C# Function in VS Code](how-to-vscode-debug-azure-function.md)