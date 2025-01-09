---
title: Develop modules for Linux devices using Azure IoT Edge for Linux on Windows
description: This tutorial walks through setting up your development machine and cloud resources to develop IoT Edge modules running in Linux containers for Windows devices, by using Azure IoT Edge for Linux on Windows.
author: PatAltimore

ms.author: fcabrera
ms.date: 01/04/2024
ms.topic: tutorial
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
zone_pivot_groups: iotedge-dev
---

# Tutorial: Develop IoT Edge modules with Linux containers by using IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This tutorial walks you through developing, debugging, and deploying your own code to an Azure IoT Edge device by using IoT Edge for Linux on Windows and Visual Studio 2022. You'll learn the most common developer scenario for IoT Edge solutions by deploying a C# module to a Linux device. You'll deploy and debug a custom IoT Edge module running in a Linux container on Windows. Even if you plan to use a different language or deploy an Azure service, this tutorial is still useful for learning about the development tools and concepts.

This tutorial includes steps for two IoT Edge development tools:

* The Azure IoT Edge Dev Tool CLI command-line interface (CLI), which is the preferred tool for development
* The Azure IoT Edge Tools extension for Visual Studio, which is in [maintenance mode](https://github.com/microsoft/vscode-azure-iot-edge/issues/639)

Use the selector button at the beginning of this tutorial to select the tool version.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up your development machine.
> * Use IoT Edge development tools to create a new project.
> * Build your project as a container and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device.

## Prerequisites

This tutorial assumes that you use a machine running Windows as your development machine. On Windows computers, you can develop either Windows or Linux modules. This tutorial guides you through the development of Linux containers, by using [IoT Edge for Linux on Windows](./iot-edge-for-linux-on-windows.md) for building and deploying the modules.

Before you begin:

* Install [IoT Edge for Linux on Windows](./how-to-provision-single-device-linux-on-windows-x509.md).
* Read the quickstart [Deploy your first IoT Edge module to a Windows device](./quickstart.md).
* Download the [.NET Core SDK](https://dotnet.microsoft.com/download).
* Install or modify Visual Studio 2022 on your development machine. Choose the **Azure development** and **Desktop development with C++** workload options.
* After your Visual Studio 2022 installation is ready, download and install [Azure IoT Edge Tools](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs17iotedgetools) from Visual Studio Marketplace.

  You can use the Azure IoT Edge Tools extension to create and build your IoT Edge solution. The preferred development tool is the Azure IoT Edge Dev Tool CLI. The extension includes the Azure IoT Edge project templates that you use to create the Visual Studio project. Currently, you need to install the extension regardless of the development tool that you use.

  > [!TIP]
  > If you're using Visual Studio 2019, download and install [Azure IoT Edge Tools for Visual Studio 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools) from Visual Studio Marketplace.

::: zone pivot="iotedge-dev-cli"

* Install the [Azure CLI](/cli/azure/install-azure-cli).

::: zone-end

* Create a free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure as a cloud resource.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Key concepts

This tutorial walks through the development of an *IoT Edge module*. An IoT Edge module is a container that has executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, cleaning and analyzing data, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

When you're developing IoT Edge modules, it's important to understand the difference between the development machine and the target IoT Edge device where the module will eventually be deployed. The container that you build to hold your module code must match the operating system (OS) of the *target device*.

For example, the most common scenario is someone developing a module on a Windows computer who intends to target a Linux device running IoT Edge. In that case, the container OS is Linux.

As you go through this tutorial, keep in mind the difference between the development machine OS and the container OS. For this tutorial, you'll use your Windows host for development and the IoT Edge for Linux on Windows virtual machine (VM) for building and deploying the modules.

This tutorial targets devices that are running IoT Edge with Linux containers. You can use your preferred operating system as long as your development machine runs Linux containers. We recommend using Visual Studio to develop with Linux containers, so that's what this tutorial uses. You can also use Visual Studio Code, although there are differences in support between the two tools. For more information, see [Develop Azure IoT Edge modules using Visual Studio Code](./tutorial-develop-for-linux.md).

## Set up the Docker CLI and Docker engine for remote connection

IoT Edge modules are packaged as containers, so you need a container engine on your development machine to build and manage them.

The IoT Edge for Linux on Windows VM already contains an instance of the Docker engine. This tutorial shows you how to remotely connect from the Windows developer machine to the IoT Edge for Linux on Windows VM Docker instance. By using this remote connection, you remove the dependency on Docker Desktop for Windows.

### Configure the Docker CLI

The first step is to configure the Docker CLI on the Windows development machine to be able to connect to the remote Docker engine:

1. Download the precompiled `docker.exe` version of the Docker CLI from [Chocolatey](https://download.docker.com/win/static/stable/x86_64/docker-20.10.12.zip). You can also download the official **cli** project from [GitHub](https://github.com/docker/cli) and compile it by following the repo instructions.
2. Extract `docker.exe` to a directory in your development machine; for example, `C:\Docker\bin`.
3. Open **About your PC** > **System Info** > **Advanced system settings**.
4. Select **Advanced** > **Environment variables**. Under **User variables**, select **Path**.
5. Edit the **Path** variable and add the location of `docker.exe`.
6. Open an elevated PowerShell session.
7. Check that the Docker CLI is accessible by using this command:

   ```powershell
   docker --version
   ```

   If you successfully configured everything, the output of the command should show the Docker version. It should look something like `Docker version 20.10.12, build e91ed57`.

### Configure the Docker engine

The second step is to configure the IoT Edge for Linux on Windows VM Docker engine to accept external connections, and add the appropriate firewall rules.

> [!WARNING]
> Exposing the Docker engine to external connections might increase security risks. You should use this configuration only for development purposes. Make sure to revert the configuration to default settings after development is finished.

1. Open an elevated PowerShell session and run the following commands:

    ```powershell
   # Configure the IoT Edge for Linux on Windows VM Docker engine to accept external connections, and add the appropriate firewall rules.
   Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 2375 -j ACCEPT"

   # Create a copy of the IoT Edge for Linux on Windows VM _docker.service_ in the system folder.
   Invoke-EflowVmCommand "sudo cp /lib/systemd/system/docker.service /etc/systemd/system/docker.service"

   # Replace the service execution line to listen for external connections.
   Invoke-EflowVmCommand "sudo sed -i 's/-H fd:\/\// -H fd:\/\/ -H tcp:\/\/0.0.0.0:2375/g'  /etc/systemd/system/docker.service"

   # Reload the IoT Edge for Linux on Windows VM services configurations.
   Invoke-EflowVmCommand "sudo systemctl daemon-reload"

   # Reload the Docker engine service.
   Invoke-EflowVmCommand "sudo systemctl restart docker.service"

   # Check that the Docker engine is listening to external connections.
   Invoke-EflowVmCommand "sudo netstat -lntp | grep dockerd"
    ```

   Here's example output:

   ```output
   PS C:\> # Configure the IoT Edge for Linux on Windows virtual machine Docker engine to accept external connections, and add the appropriate firewall rules.
   PS C:\> Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 2375 -j ACCEPT"
   PS C:\>
   PS C:\> # Create a copy of the IoT Edge for Linux on Windows VM docker.service in the system folder.
   PS C:\> Invoke-EflowVmCommand "sudo cp /lib/systemd/system/docker.service /etc/systemd/system/docker.service"
   PS C:\>
   PS C:\> # Replace the service execution line to listen for external connections.
   PS C:\> Invoke-EflowVmCommand "sudo sed -i 's/-H fd:\/\// -H fd:\/\/ -H tcp:\/\/0.0.0.0:2375/g' /etc/systemd/system/docker.service"
   PS C:\>
   PS C:\> # Reload the IoT Edge for Linux on Windows VM services configurations.
   PS C:\> Invoke-EflowVmCommand "sudo systemctl daemon-reload"
   PS C:\>
   PS C:\> # Reload the Docker engine service.
   PS C:\> Invoke-EflowVmCommand "sudo systemctl restart docker.service"
   PS C:\>
   PS C:\> # Check that the Docker engine is listening to external connections.
   PS C:\> Invoke-EflowVmCommand "sudo netstat -lntp | grep dockerd"
   tcp6       0      0 :::2375                 :::*                    LISTEN      2790/dockerd
   ```

### Test the connection

The final setup step is to test the Docker connection to the IoT Edge for Linux on Windows VM Docker engine:

1. Get the IP address of the IoT Edge for Linux on Windows VM:

   ```powershell
   Get-EflowVmAddr
   ```

   > [!TIP]
   > If the IoT Edge for Linux on Windows VM was deployed without a static IP, the IP address might change across Windows host OS restarts or network changes. Make sure you're using the correct IP address for the IoT Edge for Linux on Windows VM every time you want to establish a remote connection to the Docker engine.

   Here's example output:

   ```output
   PS C:\> Get-EflowVmAddr
   [03/15/2022 15:22:30] Querying IP and MAC addresses from virtual machine (DESKTOP-J1842A1-EFLOW)
    - Virtual machine MAC: 00:15:5d:6f:da:78
    - Virtual machine IP : 172.31.24.105 retrieved directly from virtual machine
   00:15:5d:6f:da:78
   172.31.24.105 
   ```

1. Connect to the IoT Edge for Linux on Windows VM Docker engine and run the `hello-world` sample container. Replace `<EFLOW-VM-IP>` with the IoT Edge for Linux on Windows VM IP address that you obtained in the previous step.

   ```powershell
   docker -H tcp://<EFLOW-VM-IP>:2375 run --rm hello-world
   ```

   When the download of the container finishes, the container runs and produces this output:

    ```output
    PS C:\> docker -H tcp://172.31.24.105:2375 run --rm hello-world
    Unable to find image 'hello-world:latest' locally
    latest: Pulling from library/hello-world
    2db29710123e: Pull complete
    Digest: sha256:4c5f3db4f8a54eb1e017c385f683a2de6e06f75be442dc32698c9bbe6c861edd
    Status: Downloaded newer image for hello-world:latest
    
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
    
    To generate this message, Docker took the following steps:
     1. The Docker client contacted the Docker daemon.
     2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
     3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you're currently reading.
     4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.
    
    To try something more ambitious, you can run an Ubuntu container with:
     $ docker run -it ubuntu bash
    
    Share images, automate workflows, and more with a free Docker ID:
     https://hub.docker.com/
    
    For more examples and ideas, visit:
     https://docs.docker.com/get-started/
    ```

## Create an Azure IoT Edge project

The IoT Edge project template in Visual Studio creates a solution that you can deploy to IoT Edge devices. Use the following steps to create an Azure IoT Edge solution and then generate the first module in that solution. Each IoT Edge solution can contain more than one module.

> [!IMPORTANT]
> The IoT Edge project structure that Visual Studio creates isn't the same as the one in Visual Studio Code.
>
> Currently, the Azure IoT Edge Dev Tool CLI doesn't support creating the Visual Studio project type. You need to use the Azure IoT Edge Tools extension to create the Visual Studio project.

1. In Visual Studio, create a new project by selecting **Create a new project** on the start page or by selecting the **New Project** button on the toolbar.

1. On the **Create a new project** page, search for **Azure IoT Edge**. Select the project that matches the platform (Linux IoT Edge module) and architecture for your IoT Edge device, and then select **Next**.

1. On the **Configure your new project** page, enter a name for your project and specify the location, and then select **Create**.

1. In the **Add Module** dialog, select the type of module that you want to develop. You can also select **Existing module** to add an existing IoT Edge module to your deployment.

1. In **Module Name**, specify your module name.

1. In **Repository Url**, provide the name of the module's image repository. Visual Studio automatically populates the module name with **localhost:5000/<your module name\>**. Replace it with your own registry information.

   Use **localhost** if you use a local Docker registry for testing. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **\<registry name\>.azurecr.io**. Replace only the **localhost:5000** part of the string, so that the final result looks like **\<registry name\>.azurecr.io/\<your module name\>**.

1. Select **Add** to add your module to the project.

   ![Screenshot of selections for adding an application and module to a Visual Studio solution.](./media/how-to-visual-studio-develop-csharp-module/add-module.png)

   > [!NOTE]
   > If you have an existing IoT Edge project, you can change the repository URL by opening the `module.json` file. The repository URL is located in the `repository` property of the JSON file.

Now, you have an IoT Edge project and an IoT Edge module in your Visual Studio solution.

### Project structure

Your solution has two project-level folders: a main project folder and a module folder. For example, you might have a main project folder named `AzureIotEdgeApp1` and a module folder named `IotEdgeModule1`.

The main project folder contains your [deployment manifest](module-deployment-monitoring.md#deployment-manifest). The deployment manifest is a JSON document that describes the modules to be configured on the targeted IoT Edge device.

The module folder contains a file for your module code. It's named either `Program.cs` or `main.c`, depending on the language that you chose. This folder also contains a file named `module.json` that describes the metadata of your module. Various Docker files provide the necessary information to build your module as a Windows or Linux container.

### Deployment manifest of your project

The deployment manifest that you edit is named `deployment.debug.template.json`. This file is a template of an IoT Edge deployment manifest that defines all the modules that run on a device. The file also defines how the modules communicate with each other. For more information about deployment manifests, see [Learn how to deploy modules and establish routes](module-composition.md).

The deployment template includes:

* The two runtime modules, `edgeAgent` and `edgeHub`.
* The custom module that you created in this Visual Studio project.
* A module named `SimulatedTemperatureSensor`. This default module generates simulated data that you can use to test your modules (or delete if it's not necessary). To see how the simulated temperature sensor works, view the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

### Set the IoT Edge runtime version

Currently, the latest stable runtime version is 1.4. Update the IoT Edge runtime version to the latest stable release or the version that you want to target for your devices:

::: zone pivot="iotedge-dev-ext"

1. In **Solution Explorer**, right-click the name of your main project and select **Set IoT Edge runtime version**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/set-iot-edge-runtime-version.png" alt-text="Screenshot of selections for setting an IoT Edge runtime version.":::

1. Use the dropdown menu to choose the runtime version that your IoT Edge devices are running. Then select **OK** to save your changes. If you didn't make any changes, select **Cancel**.

    Currently, the extension doesn't include a selection for the latest runtime versions. If you want to set the runtime version higher than 1.2, open the `deployment.debug.template.json` deployment manifest file. Change the runtime version for the system runtime module images `edgeAgent` and `edgeHub`. For example, if you want to use the IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

    ```json
    "systemModules": {
       "edgeAgent": {
        //...
          "image": "mcr.microsoft.com/azureiotedge-agent:1.4"
        //...
       "edgeHub": {
       //...
          "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
       //...
    ```

1. If you changed the version, regenerate your deployment manifest by right-clicking the name of your project and selecting **Generate deployment for IoT Edge**. This step generates a deployment manifest based on your deployment template. The manifest appears in the `config` folder of your Visual Studio project.

::: zone-end

::: zone pivot="iotedge-dev-cli"

1. Open the `deployment.debug.template.json` deployment manifest file.
1. Change the runtime version for the system runtime module images `edgeAgent` and `edgeHub`. For example, if you want to use IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

    ```json
    "systemModules": {
        "edgeAgent": {
        //...
            "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
        //...
        "edgeHub": {
        //...
            "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
        //...
    ```

::: zone-end

::: zone pivot="iotedge-dev-ext"

### Set up the Visual Studio 2022 remote Docker engine instance

Configure the Azure IoT Edge Tools extension to use the remote Docker engine that runs inside the IoT Edge for Linux on Windows VM:

1. Select **Tools** > **Azure IoT Edge tools** > **IoT Edge tools settings**.

1. Replace the **DOCKER\_HOST** localhost value with the IP address for the IoT Edge for Linux on Windows VM. If you don't remember the IP address, use the IoT Edge for Linux on Windows PowerShell cmdlet `Get-EflowVmAddr` to obtain it. For example, if the IoT Edge for Linux on Windows VM IP address is 172.20.1.100, the new value should be **tcp://172.20.1.100:2375**.

   ![Screenshot of IoT Edge Tools settings](./media/tutorial-develop-for-linux-on-windows/iot-edge-tools-settings.png)

1. Select **OK**.

::: zone-end

## Develop your module

When you add a new module, it comes with default code that's ready to be built and deployed to a device so that you can start testing without touching any code. The module code is located within the module folder in a file named `Program.cs` (for C#) or `main.c` (for C).

In the default solution, the simulated data from the `SimulatedTemperatureSensor` module is routed to your module. The module takes the input and then sends it to Azure IoT Hub.

When you're ready to customize the module template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build other modules that address the key needs for IoT solutions. These needs can include security, device management, and reliability.

## Build and push a single module

Typically, you want to test and debug each module before running it within an entire solution with multiple modules. Because the solution will build or debug by using the Docker engine running inside the IoT Edge for Linux on Windows VM, the first step is building and publishing the module to enable remote debugging:

1. In **Solution Explorer**, select the module project folder (for example, `myIotEdgeModule`).

1. Set the custom module as the startup project. On the menu, select **Project** > **Set as StartUp Project**.

1. To debug the C# Linux module, you need to update the `Dockerfile.amd64.debug` file to enable the SSH service. Update the `Dockerfile.amd64.debug` file to use the following template: [Dockerfile for Azure IoT Edge AMD64 C# Module with Remote Debug Support](https://raw.githubusercontent.com/Azure/iotedge-eflow/main/debugging/Dockerfile.amd64.debug).

   > [!NOTE]
   > When you select **Debug**, Visual Studio uses `Dockerfile.(amd64|windows-amd64).debug` to build Docker images. This file includes the .NET Core command-line debugger VSDBG in your container image while building it. For production-ready IoT Edge modules, we recommend that you use the **Release** configuration, which uses `Dockerfile.(amd64|windows-amd64)` without VSDBG.

   Make sure that in the last line of the template, `ENTRYPOINT ["dotnet", "IotEdgeModule1.dll"]`, the name of the DLL matches the name of your IoT Edge module project.

1. To establish an SSH connection with the Linux module, you need to create an RSA key. Open an elevated PowerShell session and run the following commands to create a new RSA key. Save the RSA key under the same IoT Edge module folder, and make sure that the name of the key is `id_rsa`.

   ```cmd
   ssh-keygen -t RSA -b 4096 -m PEM
   ```

   ![Screenshot of the PowerShell command to create an SSH key.](./media/tutorial-develop-for-linux-on-windows/ssh-keygen.png)

1. If you're using a private registry like Azure Container Registry, use the following Docker command to sign in to it. You can get the username and password from the **Access keys** page of your registry in the Azure portal. If you're using a local registry, you can [run a local registry](https://docs.docker.com/registry/deploying/#run-a-local-registry).

   ```cmd
   docker -H tcp://<EFLOW-VM-IP>:2375 login -u <Container Registry username> -p <Container Registry password> <Container Registry login server>
   ```

::: zone pivot="iotedge-dev-ext"

1. In **Solution Explorer**, right-click the project folder and select **Build and Push IoT Edge Modules**. This command builds and pushes the Docker image for each module.

1. If you're using a private registry like Azure Container Registry, you need to add your registry login information to the runtime settings found in the file `deployment.template.json`. Replace the placeholders with your actual Container Registry admin username, password, and registry name.

    ```json
          "settings": {
            "minDockerVersion": "v1.25",
            "loggingOptions": "",
            "registryCredentials": {
              "registry1": {
                "username": "<username>",
                "password": "<password>",
                "address": "<registry name>.azurecr.io"
              }
            }
          }
    ```

   > [!NOTE]
   > This article uses admin sign-in credentials for Azure Container Registry, which are convenient for development and test scenarios. When you're ready for production scenarios, we recommend a least-privilege authentication option like service principals. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

1. It's necessary to expose port 22 to access the module's SSH service. This tutorial uses 10022 as the host port, but you can specify a different port. The port that you specify will be used as an SSH port to connect into the Linux C# module. You need to add the SSH port information to `createOptions` for this Linux module setting in the file `deployment.debug.template.json`:

    ```json
         "createOptions": {
            "HostConfig": {
               "Privileged": true,
               "PortBindings": {
                     "22/tcp": [
                        {
                           "HostPort": "10022"
                        }
                     ]
               }
            }
         }
    ```

1. In **Solution Explorer**, right-click the project folder and select **Generate Deployment for IoT Edge** to build the new IoT Edge deployment JSON.

1. Select **View** > **Cloud Explorer**. Make sure you're signed in to Visual Studio 2019.

1. In **Cloud Explorer**, expand your subscription, and then find Azure IoT Hub and the Azure IoT Edge device that you want to deploy.

1. Right-click the IoT Edge device and select **Create deployment**. Go to the debug deployment manifest that's configured for your platform. It's in the `config` folder in your Visual Studio solution, such as `deployment.amd64.json`.

::: zone-end

::: zone pivot="iotedge-dev-cli"

### Build the module's Docker image

After you develop your module, you can build the module image to store in a container registry for deployment to your IoT Edge device.

Use the module's Dockerfile to build the module's Docker image:

```bash
docker build --rm -f "<DockerFilePath>" -t <ImageNameAndTag> "<ContextPath>" 
```

For example, assume that your command shell is in your project directory and your module name is `IotEdgeModule1`. To build the image for the local registry or an Azure container registry, use the following commands:

```bash
# Build the image for the local registry

docker build --rm -f "./IotEdgeModule1/Dockerfile.amd64.debug" -t localhost:5000/iotedgemodule1:0.0.1-amd64 "./IotEdgeModule1"

# Or build the image for an Azure container registry

docker build --rm -f "./IotEdgeModule1/Dockerfile.amd64.debug" -t myacr.azurecr.io/iotedgemodule1:0.0.1-amd64 "./IotEdgeModule1"
```

### Push the module's Docker image

Push your module image to the local registry or a container registry:

`docker push <ImageName>`

For example:

```bash
# Push the Docker image to the local registry

docker push localhost:5000/iotedgemodule1:0.0.1-amd64

# Or push the Docker image to an Azure container registry
az acr login --name myacr
docker push myacr.azurecr.io/iotedgemodule1:0.0.1-amd64
```

### Deploy the module to the IoT Edge device

In Visual Studio, open the `deployment.debug.template.json` deployment manifest file in the main project.

Before deployment, you need to update your Azure Container Registry credentials, your module images, and the proper `createOptions` values. For more information about `createOption` values, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

1. If you're using an Azure container registry to store your module image, add your credentials to `deployment.debug.template.json` in the `edgeAgent` settings. For example:

    ```json
    "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.1",
        "runtime": {
          "type": "docker",
          "settings": {
            "minDockerVersion": "v1.25",
            "loggingOptions": "",
            "registryCredentials": {
              "myacr": {
                "username": "myacr",
                "password": "<your_acr_password>",
                "address": "myacr.azurecr.io"
              }
            }
          }
        },
    //...
    ```

1. Replace the `image` property value with the module image name that you pushed to the registry. For example, if you pushed an image tagged `myacr.azurecr.io/iotedgemodule1:0.0.1-amd64` for custom module `IotEdgeModule1`, replace the image property value with the tag value.

1. Add or replace the `createOptions` value with stringified content *for each system and custom module in the deployment template*.

    For example, the `image` and `createOptions` settings for `IotEdgeModule1` would be similar to the following example:

    ```json
    "IotEdgeModule1": {
    "version": "1.0.0",
    "type": "docker",
    "status": "running",
    "restartPolicy": "always",
    "settings": {
        "image": "myacr.azurecr.io/iotedgemodule1:0.0.1-amd64",
        "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    }
    ```

1. Use the [IoT Edge Azure CLI set-modules](/cli/azure/iot/edge#az-iot-edge-set-modules) command to deploy the modules to the Azure IoT hub. For example, to deploy the modules defined in the `deployment.debug.amd64.json` file to the IoT hub `my-iot-hub` for the IoT Edge device `my-device`, use the following command:

   ```azurecli
   az iot edge set-modules --hub-name my-iot-hub --device-id my-device --content ./deployment.debug.template.json --login "HostName=my-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>"
   ```

   > [!TIP]
   > You can find your IoT Hub connection string in the Azure portal under **Azure IoT Hub** > **Security settings** > **Shared access policies**.

1. In **Cloud Explorer**, right-click your edge device and refresh to confirm that the new module is running, along with the `$edgeAgent` and `$edgeHub` modules.

::: zone-end

## Debug the solution

1. In an elevated PowerShell session, run the following commands:

   1. Get the `moduleId` value, based on the name for the Linux C# module. Replace the `<iot-edge-module-name>` placeholder with your module's name.

      ```powershell
      $moduleId = Invoke-EflowVmCommand "sudo docker ps -aqf name=<iot-edge-module-name>"
      ```

   1. Check that `$moduleId` is correct. If the variable is empty, make sure you're using the correct module name.

   1. Start the SSH service inside the Linux container:

      ```powershell
      Invoke-EflowVmCommand "sudo docker exec -it -d $moduleId service ssh start"
      ```

   1. Open the module's SSH port on the IoT Edge for Linux on Windows VM. (This tutorial uses port 10022.)

      ```powershell
      Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 10022 -j ACCEPT"
      ```

   > [!WARNING]
   > For security reasons, every time the IoT Edge for Linux on Windows VM restarts, the IP table rule is deleted and goes back to the original settings. Also, you have to start the module's SSH service again manually.

1. After you successfully start the SSH service, select **Debug** > **Attach to Process**, set **Connection Type** to **SSH**, and set **Connection target** to the IP address of your IoT Edge for Linux on Windows VM. If you don't know the IP address of your IoT Edge for Linux on Windows VM, you can use the `Get-EflowVmAddr` PowerShell cmdlet.

   Type the IP and then select the Enter key. In the pop-up window, enter the following configurations:

   | Field               | Value                                                             |
   |---------------------|-------------------------------------------------------------------|
   | **Hostname**            | IP address for the IoT Edge for Linux on Windows VM                                           |
   | **Port**                | **10022** (or the one that you used in your deployment configuration)  |
   | **Username**            | **root**                                                          |
   | **Authentication type** | **Private Key**                                                   |
   | **Private Key File**    | Full path to the `id_rsa` value that you created in a previous step       |
   | **Passphrase**          | Passphrase used for the key that you created in a previous step        |

1. After you successfully connect to the module by using SSH, you can choose the process and select **Attach**. For the C# module, you need to choose process **dotnet** and **Attach** to **Managed (CoreCLR)**. It might take 10 to 20 seconds the first time.

1. Set a breakpoint to inspect the module:

   * If you're developing in C#, set a breakpoint in the `PipeMessage()` function in `ModuleBackgroundService.cs`.
   * If you're using C, set a breakpoint in the `InputQueue1Callback()` function in `main.c`.

1. The output of `SimulatedTemperatureSensor` should be redirected to `input1` of the custom Linux C# module. The breakpoint should be triggered. You can watch variables in the Visual Studio **Locals** window.

   ![Screenshot of how to debug a single module.](./media/tutorial-develop-for-linux-on-windows/debug-single-module.png)

1. To stop debugging, select Ctrl+F5 or select the **Stop** button.

## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, delete the local configurations and the Azure resources that you used in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](includes/iot-edge-clean-up-cloud-resources.md)]

## Next step

In this tutorial, you set up Visual Studio on your development machine, and you deployed and debugged your first IoT Edge module from it. Now that you know the basic concepts, try adding functionality to a module so that it can analyze the data passing through it:

> [!div class="nextstepaction"]
> [Tutorial: Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md)
