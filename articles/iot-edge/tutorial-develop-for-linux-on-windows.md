---
title: 'Tutorial - Develop module for Linux devices using Azure IoT Edge for Linux on Windows'
description: This tutorial walks through setting up your development machine and cloud resources to develop IoT Edge modules using Linux containers for Windows devices using Azure IoT Edge for Linux on Windows
author: fcabrera

ms.author: fcabrera
ms.date: 03/01/2020
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Develop IoT Edge modules with Linux containers using IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

Use Visual Studio 2019 to develop, debug and deploy code to devices running IoT Edge for Linux on Windows.

In the quickstart, you created an IoT Edge device and deployed a module from the Azure Marketplace. This tutorial walks through developing, debugging and deploying your own code to an IoT Edge device using IoT Edge for Linux on Windows. This article is a useful prerequisite for the other tutorials, which go into more detail about specific programming languages or Azure services.

This tutorial uses the example of deploying a **C# module to a Linux device**. This example was chosen because it's the most common developer scenario for IoT Edge solutions. Even if you plan on using a different language or deploying an Azure service, this tutorial is still useful to learn about the development tools and concepts. Complete this introduction to the development process, then choose your preferred language or Azure service to dive into the details.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up your development machine.
> * Use the IoT Edge tools for Visual Studio Code to create a new project.
> * Build your project as a container and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device.

## Prerequisites

This article assumes that you use a machine running Windows as your development machine. On Windows computers, you can develop either Windows or Linux modules. This tutorial will guide you through the development of **Linux containers**, using [IoT Edge for Linux on Windows](./iot-edge-for-linux-on-windows.md) for building and deploying the modules. 

* Install [IoT Edge for Linux on Windows (EFLOW)](./how-to-provision-single-device-linux-on-windows-x509.md)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet/3.1).

Install Visual Studio on your development machine. Make sure you include the **Azure development** and **Desktop development with C#** workloads in your Visual Studio 2019 installation. You can [Modify Visual Studio 2019](/visualstudio/install/modify-visual-studio?view=vs-2019&preserve-view=true) to add the required workloads.

After your Visual Studio 2019 is ready, you also need the following tools and components:

* Download and install [Azure IoT Edge Tools](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools) from the Visual Studio marketplace to create an IoT Edge project in Visual Studio 2019.

  > [!TIP]
  > If you are using Visual Studio 2017, download and install [Azure IoT Edge Tools for VS 2017](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vsiotedgetools) from the Visual Studio marketplace

Cloud resources:

* A free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

### Check your tools version

1. From the **Extensions** menu, select **Manage Extensions**. Expand **Installed > Tools** and you can find **Azure IoT Edge Tools for Visual Studio** and **Cloud Explorer for Visual Studio**.

1. Note the installed version. You can compare this version with the latest version on Visual Studio Marketplace ([Cloud Explorer](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.CloudExplorerForVS2019), [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools))

1. If your version is older than what's available on Visual Studio Marketplace, update your tools in Visual Studio as shown in the following section.

> [!NOTE]
> If you are using Visual Studio 2022, [Cloud Explorer](/visualstudio/azure/vs-azure-tools-resources-managing-with-cloud-explorer?view=vs-2022&preserve-view=true) is retired. To deploy Azure IoT Edge modules, use [Azure CLI](how-to-deploy-modules-cli.md?view=iotedge-2020-11&preserve-view=true) or [Azure portal](how-to-deploy-modules-portal.md?view=iotedge-2020-11&preserve-view=true).

### Update your tools

1. In the **Manage Extensions** window, expand **Updates > Visual Studio Marketplace**, select **Azure IoT Edge Tools** or **Cloud Explorer for Visual Studio** and select **Update**.

1. After the tools update is downloaded, close Visual Studio to trigger the tools update using the VSIX installer.

1. In the installer, select **OK** to start and then **Modify** to update the tools.

1. After the update is complete, select **Close** and restart Visual Studio.


## Key concepts

This tutorial walks through the development of an IoT Edge module. An *IoT Edge module*, or sometimes just *module* for short, is a container with executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, cleaning and analyzing data, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

When developing IoT Edge modules, it's important to understand the difference between the development machine and the target IoT Edge device where the module will eventually be deployed. The container that you build to hold your module code must match the operating system (OS) of the *target device*. For example, the most common scenario is someone developing a module on a Windows computer intending to target a Linux device running IoT Edge. In that case, the container operating system would be Linux. As you go through this tutorial, keep in mind the difference between the *development machine OS* and the *container OS*. For this tutorial, you'll be using your Windows host for development and the IoT Edge for Linux on Windows (EFLOW) VM for building and deploying the modules. 

This tutorial targets devices running IoT Edge with Linux containers. You can use your preferred operating system as long as your development machine runs Linux containers. We recommend using Visual Studio to develop with Linux containers, so that's what this tutorial will use. You can use Visual Studio Code as well, although there are differences in support between the two tools. For more information, refer to [Tutorial: Develop IoT Edge modules with Linux containers](./tutorial-develop-for-linux.md).


## Set up docker-cli and Docker engine remote connection

IoT Edge modules are packaged as containers, so you need a container engine on your development machine to build and manage them. The EFLOW virtual machine already contains an instance of Docker engine, so this tutorial will guide on how to remotely connect from the Windows developer machine to the EFLOW VM Docker instance. By using this, we remove the dependency on Docker Desktop for Windows.

The first step is to configure docker-cli on the Windows development machine to be able to connect to the remote docker engine. 

1. Download the precompiled **docker.exe** version of the docker-cli from [docker-cli Chocolatey](https://download.docker.com/win/static/stable/x86_64/docker-20.10.12.zip). You can also download the official **cli** project from [docker/cli GitHub](https://github.com/docker/cli) and compile it following the repo instructions.
2. Extract the **docker.exe** to a directory in your development machine. For example, _C:\Docker\bin_
3. Open **About your PC** -> **System Info** -> **Advanced system settings**
4. Select **Advanced** -> **Environment variables** -> **Path**
5. Edit the **Path** variable and add the location of the **docker.exe**
6. Open an elevated PowerShell session
7. Check that Docker CLI is accessible using the command
   ```powerhsell
   docker --version
   ```
If everything was successfully configurated, the previous command should output the docker version, something like _Docker version 20.10.12, build e91ed57_. 

The second step is to configure the EFLOW virtual machine Docker engine to accept external connections, and add the appropriate firewall rules. 

>[!WARNING]
>Exposing Docker engine to external connections may increase security risks. This configuration should only be used for development purposes. Make sure to revert the configuration to default settings after development is finished.

1. Open an elevated PowerShell session.
2. Add the appropriate firewall to open Docker 2375 port inside the EFLOW VM.
   ```powershell
   Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 2375 -j ACCEPT"
   ```
3. Create a copy of the EFLOW VM _docker.service_ in the system folder.
   ```powershell
   Invoke-EflowVmCommand "sudo cp /lib/systemd/system/docker.service /etc/systemd/system/docker.service"
   ```
4. Replace the service execution line to listen for external connections.
   ```powershell
   Invoke-EflowVmCommand "sudo sed -i 's/-H fd:\/\// -H fd:\/\/ -H tcp:\/\/0.0.0.0:2375/g'  /etc/systemd/system/docker.service"
   ```
5. Reload the EFLOW VM services configurations.
   ```powershell
   Invoke-EflowVmCommand "sudo systemctl daemon-reload"
   ```
6. Reload the Docker engine service.
    ```powershell
   Invoke-EflowVmCommand "sudo systemctl restart docker.service"
   ```
7. Check that the Docker engine is listening to external connections.
   ```powershell
   Invoke-EflowVmCommand "sudo netstat -lntp | grep dockerd"
   ```

If everything was successfully configurated, the previous command should output the dockerd service network status. Should be something like:  `tcp6       0      0 :::2375                 :::*                    LISTEN      3752/dockerd`.

The final step is to test the Docker connection to the EFLOW VM Docker engine. 

1. Open an elevated PowerShell session.
2. Get the EFLOW VM IP address.
   ```powershell
   Get-EflowVmAddr
   ```
   >[!TIP]
   >If the EFLOW VM was deployed without Static IP, the IP address may change across Windows host OS reboots or networking changes. Make sure you are using the correct EFLOW VM IP address every time you want to establish a remote Docker engine connection. 


3. Using the obtained IP address, connect to the EFLOW VM Docker engine, and run the Hello-World sample container.
   ```powershell
   docker -H tcp://eflow-vm-ip:2375 run --rm hello-world
   ```
You should see that the container is being downloaded, and after will run and output: _"Hello from Docker!"_.

## Create an Azure IoT Edge project

The IoT Edge project template in Visual Studio creates a solution that can be deployed to IoT Edge devices. First you create an Azure IoT Edge solution, and then you generate the first module in that solution. Each IoT Edge solution can contain more than one module.

> [!TIP]
> The IoT Edge project structure created by Visual Studio is not the same as in Visual Studio Code.

1. In Visual Studio, create a new project.

1. On the **Create a new project** page, search for **Azure IoT Edge**. Select the project that matches the platform and architecture for your IoT Edge device, and click **Next**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/create-new-project.png" alt-text="Create New Project":::

1. On the **Configure your new project** page, enter a name for your project and specify the location, then select **Create**.

1. On the **Add Module** window, select the type of module you want to develop. You can also select **Existing module** to add an existing IoT Edge module to your deployment. Specify your module name and module image repository.

   Visual Studio autopopulates the repository URL with **localhost:5000/<module name\>**. If you use a local Docker registry for testing, then **localhost** is fine. If you use Azure Container Registry, then replace **localhost:5000** with the login server from your registry's settings. The login server looks like **_\<registry name\>_.azurecr.io**.The final result should look like **\<*registry name*\>.azurecr.io/_\<module name\>_**.

   Select **Add** to add your module to the project.

   ![Add Application and Module](./media/how-to-visual-studio-develop-csharp-module/add-module.png)

Now you have an IoT Edge project and an IoT Edge module in your Visual Studio solution.

The module folder contains a file for your module code, named either `program.cs` or `main.c` depending on the language you chose. This folder also contains a file named `module.json` that describes the metadata of your module. Various Docker files provide the information needed to build your module as a Windows or Linux container.

The project folder contains a list of all the modules included in that project. Right now it should show only one module, but you can add more.

The project folder also contains a file named `deployment.template.json`. This file is a template of an IoT Edge deployment manifest, which defines all the modules that will run on a device along with how they will communicate with each other. For more information about deployment manifests, see [Learn how to deploy modules and establish routes](module-composition.md). If you open this deployment template, you see that the two runtime modules, **edgeAgent** and **edgeHub** are included, along with the custom module that you created in this Visual Studio project. A fourth module named **SimulatedTemperatureSensor** is also included. This default module generates simulated data that you can use to test your modules, or delete if it's not necessary. To see how the simulated temperature sensor works, view the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

### Set IoT Edge runtime version

The IoT Edge extension defaults to the latest stable version of the IoT Edge runtime when it creates your deployment assets. Currently, the latest stable version is version 1.2. If you're developing modules for devices running the 1.1 long-term support version or the earlier 1.0 version, update the IoT Edge runtime version in Visual Studio to match.

1. In the Solution Explorer, right-click the name of your project and select **Set IoT Edge runtime version**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/set-iot-edge-runtime-version.png" alt-text="Right-click your project name and select set IoT Edge runtime version.":::

1. Use the drop-down menu to choose the runtime version that your IoT Edge devices are running, then select **OK** to save your changes.

1. Re-generate your deployment manifest with the new runtime version. Right-click the name of your project and select **Generate deployment for IoT Edge**.


### Set up Visual Studio 2019 remote Docker engine instance

Use the Azure IoT Edge tools extensions for Visual Studio Code to IoT Edge modules and configurate to use the remote Docker engine running inside the EFLOW virtual machine. 

1. Select **Tools** -> **Azure IoT Edge tools** -> **IoT Edge tools settings...**

1. Replace the _DOCKER\_HOST_ localhost value with the EFLOW VM IP address. If you don't remember the IP address, use the EFLOW PowerShell cmdlet `Get-EflowVmAddr` to obtain it. For exmaple, if the EFLOW VM IP address is _172.20.1.100_, then the new value should be _tcp://172.20.1.100:2375_.

   ![IoT Edge Tools settings](./media/tutorial-develop-for-linux-on-windows/iot-edge-tools-settings.png)

1. Select **OK**

## Develop your module

When you add a new module, it comes with default code that is ready to be built and deployed to a device so that you can start testing without touching any code. The module code is located within the module folder in a file named `Program.cs` (for C#) or `main.c` (for C).

The default solution is built so that the simulated data from the **SimulatedTemperatureSensor** module is routed to your module, which takes the input and then sends it to IoT Hub.

When you're ready to customize the module template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability.


## Build and push a single module

Typically, you'll want to test and debug each module before running it within an entire solution with multiple modules. Because the solution will be build and debug using the Docker engine running insde the EFLOW VM, the first step will be building and publishing the module to enable remote debugging. 

1. In **Solution Explorer**, right-click the module folder and select **Set as StartUp Project** from the menu.

   ![Set Start-up Project](./media/how-to-visual-studio-develop-csharp-module/module-start-up-project.png)

1. To debug the C# Linux module, we need to update Dockerfile.amd64.debug to enable SSH service. Update the Dockerfile.amd64.debug file to use the following template: [Dockerfile for Azure IoT Edge AMD64 C# Module with Remote Debug Support](https://github.com/fcabrera23/iotedge-eflow/blob/remote-debugging/debugging/Dockerfile.amd64.debug).

   > [!NOTE]
   > When choosing **Debug**, Visual Studio uses `Dockerfile.(amd64|windows-amd64).debug` to build Docker images. This includes the .NET Core command-line debugger VSDBG in your container image while building it. For production-ready IoT Edge modules, we recommend that you use the **Release** configuration, which uses `Dockerfile.(amd64|windows-amd64)` without VSDBG.

   ![Set Dockerfile template](./media/tutorial-develop-for-linux-on-windows/vs-solution.png)

1. To establish an SSH connection with the Linux module, we need to create an RSA key. Open an elevated PowerShell session and run the following commands to create a new RSA key.
   
   ```cmd
   ssh-keygen -t RSA -b 4096 -m PEM`
   ```

   ![Create SSH key](./media/tutorial-develop-for-linux-on-windows/ssh-keygen.png)

1. If you're using a private registry like Azure Container Registry (ACR), use the following Docker command to sign in to it.  You can get the username and password from the **Access keys** page of your registry in the Azure portal. If you're using local registry, you can [run a local registry](https://docs.docker.com/registry/deploying/#run-a-local-registry).

   ```cmd
   docker login -H tcp:\\<eflow-ip>:2375 -u <ACR username> -p <ACR password> <ACR login server>
   ```
1. In **Solution Explorer**, right-click the project folder and select **Build and Push IoT Edge Modules** to build and push the Docker image for each module.


## Deploy and debug the solution

1. If you're using a private registry like Azure Container Registry, you need to add your registry login information to the runtime settings found in the file `deployment.template.json`. Replace the placeholders with your actual ACR admin username, password, and registry name.

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

   >[!NOTE]
   >This article uses admin login credentials for Azure Container Registry, which are convenient for development and test scenarios. When you're ready for production scenarios, we recommend a least-privilege authentication option like service principals. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

1. It's necessary to expose port 22 to access the module SSH service. This tutorial uses 10022 as the host port, but you may specify a different port, which will be used as an SSH port to connect into the Linux C# module. You need to add the SSH port information to the "createOptions" of this Linux module settings found in the file `deployment.template.json`. 

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

In the quickstart article that you used to set up your IoT Edge device, you deployed a module by using the Azure portal. You can also deploy modules using the Cloud Explorer for Visual Studio. You already have a deployment manifest prepared for your scenario, the `deployment.json` file and all you need to do is select a device to receive the deployment.

1. Open **Cloud Explorer** by clicking **View** > **Cloud Explorer**. Make sure you've logged in to Visual Studio 2019.

1. In **Cloud Explorer**, expand your subscription, find your Azure IoT Hub and the Azure IoT Edge device you want to deploy.

1. Right-click on the IoT Edge device to create a deployment for it. Navigate to the debug deployment manifest configured for your platform located in the **config** folder in your Visual Studio solution, such as `deployment.arm32v7.json`.

1. Click the refresh button to see the new module running along wit **$edgeAgent** and **$edgeHub** modules.

1. Using and elevated PowerShell session rung the following commands

   1. Get the moduleId based on the name used for the Linux C# 
   
      ```powershell
      $moduleId = Invoke-EflowVmCommand “sudo docker ps -aqf name=<iot-edge-module-name>”
      ```

   1. Check that the $moduleId is correct – If the variable is empty, make sure you’re using the correct module name

   1. Start the SSH service inside the Linux container
      
      ```powershell
      $moduleId = Invoke-EflowVmCommand “sudo docker ps -aqf name=<iot-edge-module-name>”
      ```
   1. Open the module SSH port on the EFLOW VM (this tutorial uses port 10022)

      ```powershell
      Invoke-EflowVmCommand “sudo iptables -A INPUT -p tcp --dport 10022 -j ACCEPT”
      ```
   >[!WARNING]
   >For security reasons, every time the EFLOW VM reboots, the IP table rule will delete and go back to the original settings. Also, the module SSH service will have to be started again manually

1. After successfully starting SSH service, click **Debug** -> **Attach to Process**, set Connection Type to SSH, and Connection target to the IP address of your EFLOW VM. If you don’t know the EFLOW VM IP, you can use the `Get-EflowVmAddr` PowerShell cmdlet. First, type the IP and then press enter. In the pop-up window, input the following configurations:

   | Field               | Value                                                             |
   |---------------------|-------------------------------------------------------------------|
   | **Hostname**            | Use the EFLOW VM IP                                           |
   | **Port**                | 10022 (Or the one you used in your deployment configuration)  |
   | **Username**            | root                                                          |
   | **Authentication type** | Private Key                                                   |
   | **Private Key File**    | Full path to the id_rsa that was previously created in Step 5 |
   | **Passphrase**          | The one used for the key created in Step 5                    |


   ![Connect to Remote System](./media/tutorial-develop-for-linux-on-windows/connect-remote-system.png)

1. After successfully connecting to the module using SSH, then you can choose the process and click Attach. For the C# module you need to choose process dotnet and “Attach to” to Managed (CoreCLR). It may take 10&ndash;20 seconds the first time you do so.

   ![Attach process](./media/tutorial-develop-for-linux-on-windows/attach-process.png)

1. Set a breakpoint to inspect the module.

   * If developing in C#, set a breakpoint in the `PipeMessage()` function in **Program.cs**.
   * If using C, set a breakpoint in the `InputQueue1Callback()` function in **main.c**.

1. Test the module by sending a message by running the following command in a **Git Bash** or **WSL Bash** shell. (You cannot run the `curl` command from a PowerShell or command prompt.)

    ```bash
    curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
    ```

   ![Debug Single Module](./media/how-to-visual-studio-develop-csharp-module/debug-single-module.png)

   The breakpoint should be triggered. You can watch variables in the Visual Studio **Locals** window.

   > [!TIP]
   > You can also use [PostMan](https://www.getpostman.com/) or other API tools to send messages instead of `curl`.

1. Press **Ctrl + F5** or click the stop button to stop debugging.


