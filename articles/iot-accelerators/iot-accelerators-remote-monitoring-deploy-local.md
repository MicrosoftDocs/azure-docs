---
title: Deploy the remote monitoring solution locally - Azure | Microsoft Docs 
description: This tutorial shows you how to deploy the remote monitoring solution accelerator to your local machine for testing and development.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 03/07/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. This approach deploys the microservices to a local Docker container and uses IoT Hub, Cosmos DB, and Azure storage services in the cloud. You use the solution accelerators (PCS) CLI to deploy the Azure cloud services.

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Docker compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) - this software is a prerequisite for the PCS CLI.
* PCS CLI
* Local repository of the source code

> [!NOTE]
> These tools are available on many platforms, including Windows, Linux, and iOS.

### Install the PCS CLI

To install the PCS CLI via npm, run the following command in your command-line environment:

```cmd/sh
npm install iot-solutions -g
```

For more information about the CLI, see [How to use the CLI](https://github.com/Azure/pcs-cli/blob/master/README.md).

### Download the source code

 The Remote Monitoring source code repository includes the Docker configuration files you need to download, configure, and run the Docker images that contain the microservices. To clone and create a local version of the repository, navigate to a suitable folder on your local machine through your favorite command line or terminal and run one of the following commands:

To install the Java implementations of the microservices, run:

```cmd/sh
git clone --recursive https://github.com/Azure/azure-iot-pcs-remote-monitoring-java
```

To install the .Net implementations of the microservices, run:

```cmd\sh
git clone --recursive https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet
```

Remote Monioring Preconfigured Solution repo & submodules
[ [Java](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java) | [.Net](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet) ]

> [!NOTE]
> These commands download the source code for all the microservices. Although you don't need the source code to run the microservices in Docker, the source code is useful if you later plan to modify the preconfigured solution and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on three Azure services running in the cloud. You can deploy these Azure services [manually through the Azure portal](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Manual-steps-to-create-azure-resources-for-local-setup), or use the PCS CLI. This article shows you how to use the `pcs` tool.

### Sign in to the CLI

Before you can deploy the solution accelerator, you must sign in to your Azure subscription using the CLI as follows:

```cmd/sh
pcs login
```

Follow the on-screen instructions to complete the sign-in process. Make sure that you don't click anywhere in the inside the CLI or the login can fail. You will see a successful login message in the CLI if you have completed login. 

### Run a local deployment

Use the following command to start the local deployment. This will create the required azure resources and print out environment variables to the console. 

```cmd/pcs
pcs -s local
```

The script prompts you for the following information:

* A solution name.
* The Azure subscription to use.
* The location of the Azure datacenter to use.

> [!NOTE]
> The script creates an IoT Hub instance, a Cosmos DB instance, and an Azure storage account in a resource group in your Azure subscription. The name of the resource group is the name of the solution you chose when you ran the `pcs` tool above. 

> [!IMPORTANT]
> The script takes several minutes to run. When it completes, you see a message `Copy the following environment variables to /scripts/local/.env file:`. Copy down the environment variable definitions following the message, you will use them in a later step.

## Run the microservices in Docker

To run the microservices in Docker, first edit the **scripts\\local\\.env** file in your local copy of the repository you cloned in an earlier step above. Replace the entire contents of the file with the environment variable definitions you made a note of when you ran the `pcs` command in the last step. These environment variables enable the microservices in the Docker container to connect to the Azure services created by the `pcs` tool.

To run the solution accelerator, navigate to the **scripts\local** folder in your command-line environment and run the following command:

```cmd\sh
docker-compose up
```

The first time you run this command, Docker downloads the microservice images from Docker hub to build the containers locally. On subsequent runs, Docker runs the containers immediately.

You can use a separate shell to view the logs from the container. First find the container ID using the `docker ps -a` command. Then use `docker logs {container-id} --tail 1000` to view the last 1000 log entries for the specified container.

To access the Remote Monitoring solution dashboard, navigate to [http://localhost:8080](http://localhost:8080) in your browser.

## Clean up

To avoid unnecessary charges, when you have finished your testing, remove the cloud services from your Azure subscription. The easiest way to remove the services is to navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group you created via the `pcs` tool.

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