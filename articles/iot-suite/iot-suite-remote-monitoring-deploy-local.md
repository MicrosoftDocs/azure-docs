---
title: Deploy the remote monitoring solution locally - Azure | Microsoft Docs 
description: This tutorial shows you how to deploy the remote monitoring preconfigured solution to your local machine for testing and development.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 02/13/2018
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Deploy the remote monitoring preconfigured solution locally

This tutorial shows you how to deploy the remote monitoring preconfigured solution to your local machine for testing and development. You deploy the solution using the CLI. This approach deploys the microservices to a local Docker container and uses IoT Hub, Cosmos DB, and Azure storage services in the cloud.

## Prerequisites

To deploy the Azure services used by the remote monitoring preconfigured solution, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

To complete the local deployemnt, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Docker compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) - this is a prerequisite for the PCS CLI.
* PCS CLI

### Install the CLI

To install the CLI, run the following command in your command-line environment:

```cmd/sh
npm install iot-solutions -g
```

For more information about the CLI, see [How to use the CLI](https://github.com/Azure/pcs-cli/blob/master/README.md).

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on three Azure services. You can deploy these Azure services manually theough the Azure portal, or use the `pcs` CLI tool. This article shows you how to use the `pcs` tool.

### Sign in to the CLI

Before you can deploy the preconfigured solution, you must sign in to your Azure subscription using the CLI as follows:

```cmd/sh
pcs login
```

Follow the on-screen instructions to complete the sign-in process.

### Run a local deployment

Use the following command to start the local deployment:

```cmd/pcs
pcs -s local
```

The script prompts you for the following information:

* A solution name.
* The Azure subscription to use.
* The location of the Azure datacenter to use.

The script creates an IoT Hub, a Cosmos DB instance, and an Azure storage account in a resource group in your Azure subscription.

The script takes several minutes to run. When it completes, you see a message `Copy the following environment variables to /scripts/local/.env file:`. Copy the environment variables following the message, you use them in a later step.

## Download the source code

The remote monitoring source code repository includes the Docker configuration files you need to download, configure, and run the the Docker images that contain the microservices. To clone the repository, navigate to a suitable folder on your local machine and run one of the following commands. To install the Java implementations of the microservices, run:

```cmd/sh
git clone --recursive https://github.com/Azure/azure-iot-pcs-remote-monitoring-java
```

To install the .Net implementations of the microservices, run:

```cmd\sh
git clone --recursive https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet
```

These commands download the source code for all the microservices. Although you don't need the source code to run the microservices in Docker, the source code is useful if you plan to modify the preconfigured solution and test you changes locally.

### Run the microservices in Docker

To run the microservices in Docker, first edit the **scripts\local\.env** file in your local copy of the repository. Replace the entire contents of the file with the environment variable definitions you made a note of when you ran the `pcs` command in a previous step. These environment variables enable the microservices in the Docker container to connect to the Azure services created by the `pcs` command.

Then navigate to the **scripts\local** folder in your command-line environment and run the following command to run the preconfigured solution:

```cmd\sh
docker-compose up
```

TODO Add instructions for generating the certificate files

The first time you run this command, Docker downloads the microservice images from Docker hub to build the containers. On subsequent runs, Docker can run the container immediately.

You can use a separate shell to view the logs from the container. First find the container Id using `docker ps -a`. Then use `docker logs {container-id} --tail 1000` to view the last 1000 log entries.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure the preconfigured solution
> * Deploy the preconfigured solution
> * Sign in to the preconfigured solution

Now that you have deployed the remote monitoring solution, the next step is to [explore the capabilities of the solution dashboard](./iot-suite-remote-monitoring-deploy.md).

<!-- Next tutorials in the sequence -->