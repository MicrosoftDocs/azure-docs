---
title: Azure IoT Edge SQL module | Microsoft Docs 
description: Store data at the edge with Microsoft SQL modules, with Azure Functions to format the data. 
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 01/25/2017
ms.topic: article
ms.service: iot-edge
---

# Store data at the edge with SQL Server databases

Use Azure IoT Edge devices to store the data that is generated at the edge. Devices with intermittent internet connections can maintain their own databases and report changes back to the cloud only when connected. 

Suppose that you have a device that collects temperature telemetry but only sends the temperature data to IoT Hub when it exceeds a threshold. You still want to preserve the temperature data that wasn't sent to IoT Hub, though. This article walks through a solution to that problem. 

This article provides instructions for deploying a SQL Server database to an IoT Edge device. Azure Functions structures the incoming data then sends it to the database. The steps in this article can also be applied databases that work in containers, like mysql. 

## Prerequisites 

Before you start the instructions in this article, you should complete the following tutorials:
* Deploy Azure IoT Edge on a simulated device in [Windows](tutorial-simulate-device-windows.md) or [Linux](tutorial-simulate-device-linux.md)
* [Deploy Azure Function as an IoT Edge module](tutorial-deploy-function.md)

The following articles aren't required to successfully complete this tutorial, but may provide helpful context:
* [Run the SQL Server 2017 container image with Docker](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker)
* [Use Visual Studio Code to develop and deploy Azure Functions to Azure IoT Edge](how-to-vscode-develop-azure-functions.md)

After you complete the required tutorials, you should have all the required prerequisites ready on your machine: 
* An active Azure IoT hub.
* An IoT Edge device with at least 2 GB RAM and a 2 GB disk drive.
* [Visual Studio Code](https://code.visualstudio.com/). 
* [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge). 
* [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). 
* [Docker](https://docs.docker.com/engine/installation/)
* [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
* [Python 2.7](https://www.python.org/downloads/)
* [IoT Edge control script](https://pypi.python.org/pypi/azure-iot-edge-runtime-ctl)
* AzureIoTEdgeFunction template (`dotnet new -i Microsoft.Azure.IoT.Edge.Function`)
* An active IoT hub with at least an IoT Edge device.

Both Windows and Linux containers on x64 processor architectures work for this tutorial. SQL Server does not support ARM processors. 

## Deploy a SQL Server container

In this section, you add an MS-SQL database to your simulated IoT Edge device. Use the SQL Server 2017 docker container image, available on [Windows](https://hub.docker.com/r/microsoft/mssql-server-windows-developer/) and [Linux](https://docs.microsoft.com/sql/linux/quickstart-install-connect-docker). Configure the database to be persistent, so that you don't lose the data if the IoT Edge device restarts. 

### Deploy SQL Server 2017

By default, the code in this section creates a container with the free Developer edition of SQL Server 2017. If you want to run production editions instead, see [Run production container images](https://docs.microsoft.com/sql/linux/sql-server-linux-configure-docker#production) for detailed information. 

1. Open the `deployment.json` file in Visual Studio Code. 
2. Replace the **modules** section of the file with the following code: 

   ```json
   "modules": {
          "storeToSQLFunction": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "localhost:5000/storetosqlfunction:latest",
              "createOptions": "{}"
            }
          },
          "tempSensor": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview",
              "createOptions": "{}"
            }
          },
          "sql": {
            "version": "1.1",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "",
              "createOptions": ""
             }
          }
        }
      }
   ```

3. Depending on the operating system that you're running, update the settings for the SQL module with the following code: 

   * Windows:

      ```json
      "image": "microsoft/mssql-server-windows-developer",
      "createOptions": "{\r\n \"Env\": [\r\n \"ACCEPT_EULA=Y\",\r\n \"MSSQL_SA_PASSWORD=Strong!Passw0rd\"\r\n ],\r\n\"Volumes\": {\r\n\"c:/\SQLData\": { }\r\n},\r\n \"HostConfig\":{\r\n\"Binds\": [\r\n\"sqlvolume:SQLData\"\r\n],\r\n\"PortBindings\":{ \"1433\/tcp\":[ { \"HostPort\":\"1401\" } ] } \r\n\r\n }\r\n}\r\n "
      ```

   * Linux:

      ```json
      "image": "microsoft/mssql-server-linux:2017-latest",
      "createOptions": "{\r\n \"Env\": [\r\n \"ACCEPT_EULA=Y\",\r\n \"MSSQL_SA_PASSWORD=Strong!Passw0rd\"\r\n ],\r\n\"Volumes\": {\r\n\"\/var\/opt\/mssql\": { }\r\n},\r\n \"HostConfig\":{\r\n\"Binds\": [\r\n\"sqlvolume:\/var\/opt\/mssql\"\r\n],\r\n\"PortBindings\":{ \"1433\/tcp\":[ { \"HostPort\":\"1401\" } ] }\r\n }\r\n}\r\n"
      ```

4. Save the file. 
5. In the VS Code Command Palette, select **Edge: Create deployment for Edge device**. 
6. Select your IoT Edge device ID to create a deployment.
7. Select the `deployment.json` file that you updated. In the output window, you can see corresponding outputs for your deployment. 
8. To start your Edge runtime, select **Edge: Start Edge** in the Command Palette.