---
title: Deploy the remote monitoring solution locally (via Visual Studio IDE) - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine for testing and development.
author: avneet723
manager: hegate
ms.author: avneet723
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/25/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally (via Visual Studio IDE)

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. The approach described in this article deploys the microservices to your local machine and uses IoT Hub, Cosmos DB, and Azure Time Series Insights services in the cloud.

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

### Machine Setup

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Visual Studio](https://visualstudio.microsoft.com/)
* [Nginx](http://nginx.org/en/download.html)
* [Node.js v8](https://nodejs.org/) - this software is a prerequisite for the PCS CLI that the scripts use to create Azure resources. Do not use Node.js v10.

> [!NOTE]
> These tools are available on many platforms, including Windows, Linux, and iOS.

### Download the source code

The Remote Monitoring source code consists of several GitHub repositories. In the next step, we will clone the latest top level repository and all of its submodules. Note that the Solution Accelerator code is available in .NET and Java. 

 To clone and create a local version of the repository, use your command-line environment to navigate to a suitable folder on your local machine and then run one of the following commands:

To download the latest version of the .NET microservice implementations, run:

```cmd\sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet.git

# To retrieve the latest submodules, please run the following command: 

git submodule foreach git pull origin master
```

To download the latest version of the Java microservice implementations, run:

```cmd/sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-java.git

# To retrieve the latest submodules, please run the following command: 

git submodule foreach git pull origin master
```

> [!NOTE]
> These commands download the source code for all the microservices in addition to the scripts you use to run the microservices locally. We will use the source code to build the projects locally in your IDE and run the microservices on your local machine. You can also use the source code to modify the solution accelerator and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on Azure services running in the cloud. Use the following script to deploy the Azure services. The following script examples assume you're using the .NET repository on a Windows machine. If you're working in another environment, adjust the paths, file extensions, and path separators appropriately.

### Create new Azure resources

If you've not yet created the required Azure resources, follow these steps:

1. In your command-line environment, navigate to the **\services\scripts\local\launch** folder in your cloned copy of the **\services** submodule.

2. Run the following command to sign in to your Azure account
> pcs login

3. Run the **start.cmd** script and follow the prompts. The script prompts you to sign in to your Azure account and restart the script. The script then prompts you for the following information:
    * A solution name.
    * The Azure subscription to use.
    * The location of the Azure datacenter to use.

    The script creates resource group in Azure with your solution name. This resource group contains the Azure resources the solution accelerator uses. You can delete this resource group once you no longer need the corresponding resources.

4. [Optional Step] When the script completes, it displays a list of environment variables. Follow the instructions in the output from the command to save these variables to the **services\\scripts\\local\\.env** file. You can leverage these environment variables for future solution deployments.

### Use existing Azure resources

If you've already created the required Azure resources, please go ahead and create the corresponding environment variables on your local machine. You may have saved these values in the **services\\scripts\\local\\.env** file as part of your last deployment.

## Run the microservices from within Visual Studio IDE and configure NGINX

Now we will use Visual Studio to run each of the microservices that we need for a local remote monitoring session. We will also spin up a local web application to be able to interact with the various microservices. Please follow the steps in each of the sections below to complete a local deployment of the remote monitoring solution.

### Run the web application (WebUI)

In this step, we will start up the web application (WebUI) to be able to interact with the remote monitoring session. Please navigate to the **webui** submodule on your local machine and run the following set of commands.

```cmd\sh
cd <path_to_cloned_repository>\webui
npm install
npm start
```

### Deploy Device Simulation Service (in Docker)

Please run the following command to launch the docker container for the device simulation service. This service will be utilized to create a set of simulated devices for the local remote monitoring session.

```cmd\sh
<path_to_cloned_repository>\services\device-simulation\scripts\run.cmd
```

### Deploy all other microservices on local machine

Please follow the steps below to launch the microservices under **services** in Visual Studio.

1. Launch Visual Studio 2017
1. Open **remote-monitoring.sln** solution from under the services submodule
1. Right click on the solution and open **Properties**
1. Navigate to **Startup Project** under Common Properties
1. Select the **Multiple startup projects** radio button and set **Action** to ***Start*** for each of the following projects:
    * WebService (asa-manager\WebService)
    * WebService (auth\WebService)
    * WebService (config\WebService)
    * WebService (device-telemetry\WebService)
    * WebService (iothub-manager\WebService)
    * WebService (storage-adapter\WebService)
1. Hit *Apply* and *OK* to close the dialog
1. Hit ***Start*** to build and deploy each of the above web services to the local machine.

> [!NOTE]
> Running the web services above will launch a corresponding command prompt and web browser session to monitor the state of the service. Please ***do not*** close the cmd and browser windows as that will stop the web service.

### Run the Stream Analytics job on Azure Portal 

Please follow these steps to manually start the Azure Stream Analytics job:
1. Navigate to the [Azure Portal](https://portal.azure.com)
1. Click on **Resource groups** from the left navigation pane
1. Select the **Resource group** created for your solution (using the name passed in Start.cmd)
1. From the **Overview** page, please select the *Streaming Analytics job* and hit the **Run** button. 

### Configure and run NGINX

We will now setup a reverse proxy server to link the web application and microservices running on your local machine.

> [!NOTE], before running the NGINX proxy, you will need to move the NGINX configuration file from under the web application to the root of your NGINX **conf** folder.

* Copy the **nginx.conf** file from **webui\scripts\localhost\nginx.conf** to the **nginx\conf** install directory.  

### Connect to the dashboard

> To access the Remote Monitoring solution dashboard, navigate to [http://localhost:9000](http://localhost:9000) in your browser.

## Clean up

To avoid unnecessary charges, when you have finished your testing remove the cloud services from your Azure subscription. The easiest way to remove the services is to navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that was created when you ran the **start.cmd** script.

You can also delete the local copy of the Remote Monitoring repository created when you cloned the source code from GitHub.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up a local development environment
> * Configure the solution accelerator
> * Deploy the solution accelerator
> * Sign in to the solution accelerator

Now that you have deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](quickstart-remote-monitoring-deploy.md).

<!-- Next tutorials in the sequence -->