---
title: Deploy the remote monitoring solution locally - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine for testing and development.
author: asdonald
manager: timlt
ms.author: asdonald
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 09/17/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. This approach deploys the microservices to a local Docker container and uses IoT Hub, Cosmos DB, and Azure Time Series Insights services in the cloud.

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Docker compose](https://docs.docker.com/compose/install/)
* [Node.js v8](https://nodejs.org/) - this software is a prerequisite for the PCS CLI that the scripts use to create Azure resources. Do not use Node.js v10.

> [!NOTE]
> These tools are available on many platforms, including Windows, Linux, and iOS.

### Download the source code

The Remote Monitoring source code GitHub repository includes the Docker configuration files you need to download, configure, and run the Docker images that contain the microservices. To clone and create a local version of the repository, use your command-line environment to navigate to a suitable folder on your local machine and then run one of the following commands:

To install the Java implementations of the microservices, run:

```cmd/sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-java.git
```

To install the .Net implementations of the microservices, run:

```cmd\sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet.git
```

> [!NOTE]
> These commands download the source code for all the microservices. Although you don't need the source code to run the microservices in Docker, the source code is useful if you later plan to modify the solution accelerator and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on Azure services running in the cloud. You can deploy these Azure services [manually through the Azure portal](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Manual-steps-to-create-azure-resources-for-local-setup), or use the provided script. The following script examples assume you're using the .NET repository on a Windows machine. If you're working in another environment, adjust the paths, file extensions, and path separators appropriately. To use the provided scripts:

### Create new Azure resources

If you have not yet created the required Azure resources, follow these steps:

1. In your command-line environment, navigate to the **azure-iot-pcs-remote-monitoring-dotnet\services\scripts\local\launch** folder in your cloned copy of the repository.

2. Run the **start.cmd** script and follow the prompts. The script prompts you for the following information:
    * A solution name.
    * The Azure subscription to use.
    * The location of the Azure datacenter to use.

    The script creates resource group in Azure with your solution name. This resource group contains the Azure resources the solution accelerator uses.

3. In your command-line environment, navigate to the **azure-iot-pcs-remote-monitoring-dotnet\services\scripts\local\launch\os\win** folder in your cloned copy of the repository.

4. Run the **set-env-uri.cmd** script.

5. Update your git submodules to make sure you have the latest versions:  `cd <repo-name>` and then run the following command `git submodule foreach git pull origin master`

> [!NOTE]
> If you have cloned azure-iot-pcs-remote-monitoring-dotnet repository, the scripts folder is present under services submodule (folder). This script might require administrative privileges or sudo permission as it tries to install the [pcs-cli](https://github.com/Azure/pcs-cli).

### Use existing Azure resources

If you have already created the required Azure resources and just need to update them, complete only **one** of the following:

* Set the environment variables globally on your machine.
* **VS Code:** Set the environment variables in the launch configuration by editing the **launch.json** file.
* **Visual Studio:** Set the environment variables for WebService project of the microservices by adding it to **Properties > Debug > Environment variables**.

Finally, update your git submodules to make sure you have the latest versions: `cd <repo-name>` and then run the following command `git submodule foreach git pull origin master`.

Although not recommended, environment variables can also be set in appsettings.ini file present under WebService folder for each of the microservices.

## Run the microservices in Docker

To run the solution accelerator, navigate to the **azure-iot-pcs-remote-monitoring-dotnet\services\scripts\local** folder in your command-line environment and run the following command:

```cmd\sh
docker-compose up
```

The first time you run this command, Docker downloads the microservice images from Docker hub to build the containers locally. On subsequent runs, Docker runs the containers immediately.

You can use a separate shell to view the logs from the container. First find the container ID using the `docker ps -a` command. Then use `docker logs {container-id} --tail 1000` to view the last 1000 log entries for the specified container.

To access the Remote Monitoring solution dashboard, navigate to [http://localhost:8080](http://localhost:8080) in your browser.

## Clean up

To avoid unnecessary charges, when you have finished your testing, remove the cloud services from your Azure subscription. The easiest way to remove the services is to navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that was created when you ran the **start.cmd** script.

Use the `docker-compose down --rmi all` command to remove the Docker images and free up space on your local machine. You can also delete the local copy of the Remote Monitoring repository created when you cloned the source code from GitHub.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up a local development environment
> * Configure the solution accelerator
> * Deploy the solution accelerator
> * Sign in to the solution accelerator

Now that you have deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](quickstart-remote-monitoring-deploy.md).

<!-- Next tutorials in the sequence -->
