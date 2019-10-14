---
title: Deploy the remote monitoring solution locally - Docker - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine using Docker for testing and development.
author: avneet723
manager: hegate
ms.author: avneets
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/25/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally - Docker

[!INCLUDE [iot-accelerators-selector-local](../../includes/iot-accelerators-selector-local.md)]

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. You learn how to deploy the microservices to local Docker containers. A local microservices deployment uses the following cloud services: IoT Hub, Cosmos DB, Azure Streaming Analytics, and Azure Time Series Insights services in the cloud.

If you want to run the Remote Monitoring solution accelerator in an IDE on your local machine, see [Deploy the Remote Monitoring solution accelerator locally - Visual Studio](iot-accelerators-remote-monitoring-deploy-local.md).

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

### Machine setup

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Visual Studio](https://visualstudio.microsoft.com/) - if you plan to make changes to the microservices.
* [Node.js v8](https://nodejs.org/) - this software is a prerequisite for the PCS CLI that the scripts use to create Azure resources. Don't use Node.js v10.

> [!NOTE]
> These tools are available on many platforms, including Windows, Linux, and iOS.

[!INCLUDE [iot-accelerators-local-setup](../../includes/iot-accelerators-local-setup.md)]

## Run the microservices in Docker

Open a new command prompt to be sure to have access to the environment variables set by the **start.cmd** script. On Windows, you can verify the environment variables are set by running the following command:

```cmd
set PCS
```

The command shows all the environment variables set by the **start.cmd** script.

Make sure that Docker is running on your local machine.
> [!NOTE]
> Docker must be running [Linux containers](https://docs.docker.com/docker-for-windows/) if it is running on Windows.

The microservices running in the local Docker containers need to access the Azure cloud services. You can test the internet connectivity of your Docker environment using the following command to ping an internet address from inside a container:

```cmd/sh
docker run --rm -ti library/alpine ping google.com
```

To run the solution accelerator, navigate to the **services\\scripts\\local** folder in your command-line environment and run the following command:

```cmd/sh
docker-compose up
```

> [!NOTE] 
> Make sure you [share a local drive](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/issues/115) with Docker before you run `docker-compose up`.

The first time you run this command, Docker downloads the microservice images from Docker hub to build the containers locally. On following runs, Docker runs the containers immediately.

> [!TIP]
> Microsoft frequently publishes new Docker images with new functionality. You can use the following set of commands to cleanup your local Docker containers and corresponding images before you pull the latest ones:

```cmd/sh
docker list
docker rm <list_of_containers>
docker rmi <list_of_images>
```

You can use a separate shell to view the logs from the container. First find the container ID using the `docker ps` command. Then use `docker logs {container-id} --tail 1000` to view the last 1000 entries for the specified container.

### Start the Stream Analytics job

Follow these steps to start the Stream Analytics job:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Resource group** created for your solution. The name of the resource group is the name you chose for your solution when you ran the **start.cmd** script.
1. Click on the **Stream Analytics job** in the list of resources.
1. On the Stream Analytics job **overview** page, click the **Start** button. Then click **Start** to start the job now.

### Connect to the dashboard

To access the Remote Monitoring solution dashboard, navigate to `http://localhost:8080` in your browser. You can now use the Web UI and the local microservices.

## Clean up

To avoid unnecessary charges, when you've finished your testing remove the cloud services from your Azure subscription. To remove the services, navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that the **start.cmd** script created.

Use the `docker-compose down --rmi all` command to remove the Docker images and free up space on your local machine. You can also delete the local copy of the Remote Monitoring repository created when you cloned the source code from GitHub.

## Next steps

Now that you've deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](quickstart-remote-monitoring-deploy.md).
