---
title: Deploy remote monitoring solution locally - VS IDE - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine using Visual Studio for testing and development.
author: avneet723
manager: hegate
ms.author: avneets
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 01/17/2019
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally - Visual Studio

[!INCLUDE [iot-accelerators-selector-local](../../includes/iot-accelerators-selector-local.md)]

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. You learn how to run the microservices in Visual Studio. A local microservices deployment uses the following cloud services: IoT Hub, Cosmos DB, Azure Streaming Analytics, and Azure Time Series Insights services in the cloud.

If you want to run the Remote Monitoring solution accelerator in Docker on your local machine, see [Deploy the Remote Monitoring solution accelerator locally - Docker](iot-accelerators-remote-monitoring-deploy-local-docker.md).

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

### Machine setup

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Visual Studio](https://visualstudio.microsoft.com/)
* [Nginx](https://nginx.org/en/download.html)
* [Node.js v8](https://nodejs.org/) - this software is a prerequisite for the PCS CLI that the scripts use to create Azure resources. Don't use Node.js v10.

> [!NOTE]
> Visual Studio is available for Windows and Mac.

[!INCLUDE [iot-accelerators-local-setup](../../includes/iot-accelerators-local-setup.md)]

## Run the microservices

In this section, you run the Remote Monitoring microservices. You run the web UI natively, the Device Simulation service in Docker, and the microservices in Visual Studio.

### Run the device simulation service

Open a new command prompt window to be sure that you have access to the environment variables set by the **start.cmd** script in the previous section.

Run the following command to launch the Docker container for the device simulation service. The service simulates devices for the remote monitoring solution.

```cmd
<path_to_cloned_repository>\services\device-simulation\scripts\docker\run.cmd
```

### Deploy all other microservices on local machine

The following steps show you how to run the Remote Monitoring microservices in Visual Studio:

1. Launch Visual Studio.
1. Open the **remote-monitoring.sln** solution in the **services** folder in your local copy of the repository.
1. In **Solution Explorer**, right-click the solution and the click **Properties**.
1. Select **Common Properties > Startup Project**.
1. Select **Multiple startup projects** and set **Action** to **Start** for the following projects:
    * WebService (asa-manager\WebService)
    * WebService (auth\WebService)
    * WebService (config\WebService)
    * WebService (device-telemetry\WebService)
    * WebService (iothub-manager\WebService)
    * WebService (storage-adapter\WebService)
1. Click **OK** to save your choices.
1. Click **Debug > Start Debugging** to build and run the web services on the local machine.

Each web service opens a command prompt and web browser window. At the command prompt, you see output from the running service, and the browser window lets you monitor the status. Don't close the command prompts or web pages, this action stops the web service.

### Start the Stream Analytics job

Follow these steps to start the Stream Analytics job:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Resource group** created for your solution. The name of the resource group is the name you chose for your solution when you ran the **start.cmd** script.
1. Click the **Stream Analytics job** in the list of resources.
1. On the Stream Analytics job **overview** page, click the **Start** button. Then click **Start** to start the job now.

### Run the web UI

In this step, you start the web UI. Open a new command prompt window to be sure that you have access to the environment variables set by the **start.cmd** script. Navigate to the **webui** folder in your local copy of the repository and run the following commands:

```cmd
npm install
npm start
```

When the start is complete, your browser displays the page **http:\//localhost:3000/dashboard**. The errors on this page are expected. To view the application without errors, complete the following step.

### Configure and run NGINX

Set up a reverse proxy server to link the web application and microservices running on your local machine:

* Copy the **nginx.conf** file from the **webui\scripts\localhost** folder in your local copy of the repository to the **nginx\conf** install directory.
* Run **nginx**.

For more information about running **nginx**, see [nginx for Windows](https://nginx.org/en/docs/windows.html).

### Connect to the dashboard

To access the Remote Monitoring solution dashboard, navigate to http:\//localhost:9000 in your browser.

## Clean up

To avoid unnecessary charges, when you've finished your testing remove the cloud services from your Azure subscription. To remove the services, navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that the **start.cmd** script created.

You can also delete the local copy of the Remote Monitoring repository created when you cloned the source code from GitHub.

## Next steps

Now that you've deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](quickstart-remote-monitoring-deploy.md).
