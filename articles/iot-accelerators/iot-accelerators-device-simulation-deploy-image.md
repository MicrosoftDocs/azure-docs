---
title: Deploy a custom Device Simulation image - Azure| Microsoft Docs
description: In this how-to guide, you learn how to deploy a custom Docker image of the Device Simulation solution to Azure.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.custom: mvc
ms.date: 11/06/2018
ms.author: dobett

# As an IT Pro, I need to deploy a custom Docker image to the cloud to deploy my customized Device Simulation solution.
---

# Deploy a custom Device Simulation docker image

You can modify the Device Simulation solution to add custom features. For example, the [Serialize telemetry using Protocol Buffers](iot-accelerators-device-simulation-protobuf.md) article shows you how to add a custom device to the solution that uses Protocol Buffers (Protobuf) to send telemetry. After you've tested your changes locally, the next step is to deploy your changes to your Device Simulation instance in Azure. To complete this task, you need to create and deploy a Docker image that contains your modified service.

The steps in this how-to-guide show you how to:

1. Prepare a development environment
1. Generate a new Docker image
1. Configure Device Simulation to use your new Docker image
1. Run a simulation using the new image

## Prerequisites

To complete the steps in this how-to guide, you need:

* A deployed [Device Simulation](quickstart-device-simulation-deploy.md) instance.
* Docker. Download the [Docker Community Edition](https://www.docker.com/products/docker-engine#/download) for your platform.
* A [Docker Hub account](https://hub.docker.com/) where you can upload your Docker images. In your Docker Hub account, create a public repository called **device-simulation**.
* A modified and tested [Device Simulation solution](https://github.com/Azure/device-simulation-dotnet/archive/master.zip) on your local machine. For example, you can modify the solution to [Serialize telemetry using Protocol Buffers](iot-accelerators-device-simulation-protobuf.md).
* A shell that can run SSH. If you install Git For Windows, you can use the **bash** shell that's part of th installation. You can also use your [Azure Cloud Shell](https://shell.azure.com/).

The instructions in this article assume you're using Windows. If you're using another operating system, you may need to adjust some of the file paths and commands to suit your environment.

## Create a new Docker image

To deploy your own changes to the Device Simulation service, you need to edit the build and deployment scripts in **scripts\docker** folder to upload the containers to your docker-hub account

### Modify the docker scripts

Modify the Docker **build.cmd**, **publish.cmd**, and **run.cmd** scripts in the **scripts\docker** folder with your Docker Hub repository information. These steps assume you created a public repository called **device-simulation**:

`DOCKER_IMAGE={your-docker-hub-username}/device-simulation`

Update the **docker-compose.yml** file as follows:

`image: {your-docker-hub-username}/device-simulation`

### Configure the solution to include any new files

If you added any new device model files, you need to explicitly include them in the solution. Add an entry to the **services/services.csproj** for each additional file to include. For example, if you completed the [Serialize telemetry using Protocol Buffers](iot-accelerators-device-simulation-protobuf.md) how-to, add the following entries:

```xml
<None Update="data\devicemodels\assettracker-01.json">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
</None>
<None Update="data\devicemodels\scripts\assettracker-01-state.js">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
</None>
```

### Generate new Docker images and push to Docker Hub

Publish the new Docker image to Docker Hub using your docker-hub account:

1. Open a command prompt and navigate to your local copy of the device simulation repository.

1. Navigate to the **docker** folder:

    ```cmd
    cd scripts\docker
    ```

1. Run the following command to build the Docker image:

    ```cmd
    build.cmd
    ```

1. Run the following command to publish the Docker image to your Docker Hub repository. Sign in to Docker with your Docker Hub credentials:

    ```cmd
    docker login
    publish.cmd
    ```

<!-- TODO fix heading levels working include -->

[!INCLUDE [iot-solution-accelerators-access-vm](../../includes/iot-solution-accelerators-access-vm.md)]

## Update the service

To update the Device Simulation container to use your custom image, complete the following steps:

* Use SSH to connect to the virtual machine hosting your Device Simulation instance. Use the IP address and password you made a note of in the previous section:

    ```sh
    ssh azureuser@{your vm ip address}
    ```

* Navigate to the **/app** directory:

    ```sh
    cd /app
    ```

* Edit the **docker-compose.yml** file:

    ```sh
    sudo nano docker-compose.yml
    ```

    Modify the **image** to point the custom **device-simulation** image you uploaded to your Docker Hub repository:

    ```yml
    image: {your-docker-hub-username}/device-simulation
    ```

    Save your changes.

* Run the following command to restart the microservices:

    ```sh
    sudo start.sh
    ```

## Run your Simulation

You can now run a simulation using your customized Device Simulation solution:

1. Launch your Device Simulation web UI from [Microsoft Azure IoT Solution Accelerators](https://www.azureiotsolutions.com/Accelerators#dashboard).

1. Use the web UI to configure and run a simulation. If you previously completed [Serialize telemetry using Protocol Buffers](iot-accelerators-device-simulation-protobuf.md), you can use your custom device model.

## Next steps

Now you've learned how to deploy a custom Device Simulation image, you may want to learn how to [Use an existing IoT hub with the Device Simulation solution accelerator](iot-accelerators-device-simulation-choose-hub.md).