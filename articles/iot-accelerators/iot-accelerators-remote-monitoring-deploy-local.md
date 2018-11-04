---
title: Deploy the remote monitoring solution locally - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine for testing and development.
author: asdonald
manager: timlt
ms.author: asdonald
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 09/26/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. The approach described in this article deploys the microservices to a local Docker container and uses IoT Hub, Cosmos DB, and Azure Time Series Insights services in the cloud. To learn how to run the Remote Monitoring solution accelerator in an IDE on your local machine, see [Starting Microservices on local environment](https://github.com/Azure/remote-monitoring-services-java/blob/master/docs/LOCAL_DEPLOYMENT.md) on GitHub.

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

To download the latest version of the Java microservice implementations, run:

```cmd/sh
git clone https://github.com/Azure/remote-monitoring-services-java.git
```

To download the latest version of the .NET microservice implementations, run:

```cmd\sh
git clone https://github.com/Azure/remote-monitoring-services-dotnet.git
```

> [!NOTE]
> These commands download the source code for all the microservices in addition to the scripts you use to run the microservices locally. Although you don't need the source code to run the microservices in Docker, the source code is useful if you later plan to modify the solution accelerator and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on Azure services running in the cloud. You can deploy these Azure services [manually through the Azure portal](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Manual-steps-to-create-azure-resources-for-local-setup), or use the provided script. The following script examples assume you're using the .NET repository on a Windows machine. If you're working in another environment, adjust the paths, file extensions, and path separators appropriately. To use the provided scripts to:

### Create new Azure resources

If you've not yet created the required Azure resources, follow these steps:

1. In your command-line environment, navigate to the **remote-monitoring-services-dotnet\scripts\local\launch** folder in your cloned copy of the repository.

2. Run the **start.cmd** script and follow the prompts. The script prompts you to sign in to your Azure account and restart the script. The script then prompts you for the following information:
    * A solution name.
    * The Azure subscription to use.
    * The location of the Azure datacenter to use.

    The script creates resource group in Azure with your solution name. This resource group contains the Azure resources the solution accelerator uses.

3. When the script completes, it displays a list of environment variables. Follow the instructions in the output from the command to save these variables to the **remote-monitoring-services-dotnet\\scripts\\local\\.env** file.

### Use existing Azure resources

If you've already created the required Azure resources edit the environment variable definitions in the **remote-monitoring-services-dotnet\\scripts\\local\\.env** file with the required values. The **.env** file contains detailed information about where to find the required values.

## Run the microservices in Docker

The microservices running in the local Docker containers need to access the services running in Azure. You can test the internet connectivity of your Docker environment using the following command that starts a small container and tries to ping an internet address:

```cmd/sh
docker run --rm -ti library/alpine ping google.com
```

To run the solution accelerator, navigate to the **remote-monitoring-services-dotnet\\scripts\\local** folder in your command-line environment and run the following command:

```cmd\sh
docker-compose up
```

The first time you run this command, Docker downloads the microservice images from Docker hub to build the containers locally. On subsequent runs, Docker runs the containers immediately.

You can use a separate shell to view the logs from the container. First find the container ID using the `docker ps -a` command. Then use `docker logs {container-id} --tail 1000` to view the last 1000 log entries for the specified container.

To access the Remote Monitoring solution dashboard, navigate to [http://localhost:8080](http://localhost:8080) in your browser.

## Clean up

To avoid unnecessary charges, when you have finished your testing remove the cloud services from your Azure subscription. The easiest way to remove the services is to navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that was created when you ran the **start.cmd** script.

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
