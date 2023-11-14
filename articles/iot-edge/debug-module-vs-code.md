---
title: Debug Azure IoT Edge modules using Visual Studio Code
description: Use Visual Studio Code to debug an Azure IoT Edge custom module written in a supported development language.
services: iot-edge
author: PatAltimore
ms.author: patricka
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: iot-edge
zone_pivot_groups: iotedge-dev
---

# Debug Azure IoT Edge modules using Visual Studio Code

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article shows you how to use Visual Studio Code to debug IoT Edge modules in multiple languages. On your development computer, you can use Visual Studio Code to attach and debug your module in a local or remote module container.

This article includes steps for two IoT Edge development tools.

 * *Azure IoT Edge Dev Tool* command-line tool (CLI). This tool is preferred for development.
 * *Azure IoT Edge tools for Visual Studio Code* extension. The extension is in [maintenance mode](https://github.com/microsoft/vscode-azure-iot-edge/issues/639).

Use the tool selector button at the beginning of this article to select the tool version.

Visual Studio Code supports writing IoT Edge modules in the following programming languages:

* C# and C# Azure Functions
* C
* Python
* Node.js
* Java

Azure IoT Edge supports the following device architectures:

* AMD64
* ARM32v7
* ARM64

For more information about supported operating systems, languages, and architectures, see [Language and architecture support](module-development.md#language-and-architecture-support).

::: zone pivot="iotedge-dev-ext"

When using the Visual Studio Code IoT Edge extension, you can also launch and debug your module code in the IoT Edge Simulator.

::: zone-end

You can also use a Windows development computer and debug modules in a Linux container using IoT Edge for Linux on Windows (EFLOW). For more information about using EFLOW for developing modules, see [Tutorial: Develop IoT Edge modules with Linux containers using IoT Edge for Linux on Windows](tutorial-develop-for-linux-on-windows.md).

If you aren't familiar with the debugging capabilities of Visual Studio Code, see [Visual Studio Code debugging](https://code.visualstudio.com/Docs/editor/debugging).

## Prerequisites

You can use a computer or a virtual machine running Windows, macOS, or Linux as your development machine. On Windows computers, you can develop either Windows or Linux modules. To develop Linux modules, use a Windows computer that meets the [requirements for Docker Desktop](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

To install the required tools for development and debugging, complete the [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md) tutorial.

Install [Visual Studio Code](https://code.visualstudio.com/) 

::: zone pivot="iotedge-dev-ext"

Add the following extensions:

- [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension.
- [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension.

::: zone-end

To debug your module on a device, you need:

- An active IoT Hub with at least one IoT Edge device.
- A physical IoT Edge device or a virtual device. To create a virtual device in Azure, follow the steps in the quickstart for [Linux](quickstart-linux.md).
- A custom IoT Edge module. To create a custom module, follow the steps in the [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md) tutorial.

::: zone pivot="iotedge-dev-ext"

## Debug without a container using IoT Edge simulator

The IoT Edge Simulator is a tool that runs on your development computer and simulates the behavior of a single IoT Edge device. You can use the IoT Edge Simulator to develop and test your IoT Edge modules without a physical device or a full IoT Edge device runtime.

The following debugging steps assume you have already created a custom module. If you haven't created a custom module, follow the steps in the [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md) tutorial.

# [C / Python](#tab/c+python)

Debugging a module without a container isn't available when using *C* or *Python*.

# [C\# / Azure Functions](#tab/csharp+azfunctions)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

In the Visual Studio Code integrated terminal, change the directory to the ***&lt;your module name&gt;*** folder, and then run the following command to build .NET Core application.

```bash
dotnet build
```

If using the tutorial sample module, open the file `ModuleBackgroundService.cs` and add a breakpoint.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (.NET Core)** from the dropdown.

> [!NOTE]
> If your .NET Core `TargetFramework` is not consistent with your program path in `launch.json`, you'll need to manually update the program path in `launch.json` to match the `TargetFramework` in your .csproj file so that Visual Studio Code can successfully launch this program.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

# [Java](#tab/java)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

Add a breakpoint to your Java code.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (Java)** from the dropdown.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

# [Node.js](#tab/node)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

In the Visual Studio Code integrated terminal, change the directory to the ***&lt;your module name&gt;*** folder, and then run the following command to install Node packages

```bash
npm install
```

Add a breakpoint to your Node.js code.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (Node.js)** from the dropdown.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

---

## Debug in attach mode using IoT Edge simulator

# [C / Python](#tab/c+python)

Debugging in attach mode isn't supported for C or Python.

# [C\# / Azure Functions / Node.js / Java](#tab/csharp+azfunctions+node+java)

Currently, debugging in attach mode is supported only as follows:

- C# modules, including modules for Azure Functions, support debugging in Linux amd64 containers
- Node.js modules support debugging in Linux amd64 and arm32v7 containers, and Windows amd64 containers
- Java modules support debugging in Linux amd64 and arm32v7 containers

> [!TIP]
> You can switch among options for the default platform for your IoT Edge solution by clicking the item in the Visual Studio Code status bar.

### Set up IoT Edge simulator for IoT Edge solution

On your development machine, you can start an IoT Edge simulator instead of installing the IoT Edge security daemon so that you can run your IoT Edge solution.

1. In the **Explorer** tab on the left side, expand the **Azure IoT Hub** section. Right-click on your IoT Edge device ID, and then select **Setup IoT Edge Simulator** to start the simulator with the device connection string.

1. You can see the successful set up of the IoT Edge Simulator by reading the progress detail in the integrated terminal.

### Build and run container for debugging and debug in attach mode

1. Open your module file and add a breakpoint.

1. In the Visual Studio Code Explorer view, right-click the `deployment.debug.template.json` file for your solution and then select **Build and Run IoT Edge solution in Simulator**. You can watch all the module container logs in the same window. You can also navigate to the Docker view to watch container status.

   :::image type="content" source="media/debug-module-vs-code/view-log.png" alt-text="Screenshot of the Watch Variables.":::

1. Navigate to the Visual Studio Code Debug view and select the debug configuration file for your module. The debug option name should be similar to ***&lt;your module name&gt;* Remote Debug**

1. Select **Start Debugging** or press **F5**. Select the process to attach to.

1. In Visual Studio Code Debug view, you see the variables in the left panel.

1. To stop the debugging session, first select the Stop button or press **Shift + F5**, and then select **Azure IoT Edge: Stop IoT Edge Simulator** from the command palette.

> [!NOTE]
> The preceding example shows how to debug IoT Edge modules on containers. It added exposed ports to your module's container `createOptions` settings. After you finish debugging your modules, we recommend you remove these exposed ports for production-ready IoT Edge modules.
>
> For modules written in C#, including Azure Functions, this example is based on the debug version of `Dockerfile.amd64.debug`, which includes the .NET Core command-line debugger (VSDBG) in your container image while building it. After you debug your C# modules, we recommend that you directly use the Dockerfile without VSDBG for production-ready IoT Edge modules.

---

::: zone-end

## Debug a module with the IoT Edge runtime

In each module folder, there are several Docker files for different container types. Use any of the files that end with the extension **.debug** to build your module for testing.

When you debug modules using this method, your modules are running on top of the IoT Edge runtime. The IoT Edge device and your Visual Studio Code can be on the same machine, or more typically, Visual Studio Code is on the development machine and the IoT Edge runtime and modules are running on another physical machine. To debug from Visual Studio Code, you must:

- Set up your IoT Edge device, build your IoT Edge modules with the **.debug** Dockerfile, and then deploy to the IoT Edge device.
- Update `launch.json` so that Visual Studio Code can attach to the process in a container on the remote machine. You can find this file in the `.vscode` folder in your workspace, and it updates each time you add a new module that supports debugging.
- Use Remote SSH debugging to attach to the container on the remote machine.

### Build and deploy your module to an IoT Edge device

In Visual Studio Code, open the *deployment.debug.template.json* deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) describes the modules to be configured on the targeted IoT Edge device. Before deployment, you need to update your Azure Container Registry credentials and your module images with the proper `createOptions` values. For more information about createOption values, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

::: zone pivot="iotedge-dev-cli"

1. If you're using an Azure Container Registry to store your module image, add your credentials to the *edgeAgent* > *settings* > *registryCredentials* section in **deployment.debug.template.json**. Replace **myacr** with your own registry name in both places and provide your password and **Login server** address. For example:

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
                "password": "<your_azure_container_registry_password>",
                "address": "myacr.azurecr.io"
              }
            }
          }
        },
    ...
    ```

1. Add or replace the following stringified content to the *createOptions* value for each system (edgeHub and edgeAgent) and custom module (for example, filtermodule) listed. Change the values if necessary.

    ```json
    "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    ```
    
    For example, the *filtermodule* configuration should be similar to:
    
    ```json
    "filtermodule": {
    "version": "1.0",
    "type": "docker",
    "status": "running",
    "restartPolicy": "always",
    "settings": {
        "image": "myacr.azurecr.io/filtermodule:0.0.1-amd64",
        "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    }
    ```
    
::: zone-end

::: zone pivot="iotedge-dev-ext"

1. In the Visual Studio Code command palette, run the command **Azure IoT Edge: Build and Push IoT Edge solution**.
1. Select the `deployment.debug.template.json` file for your solution.
1. In the **Azure IoT Hub** > **Devices** section of the Visual Studio Code Explorer view, right-click the IoT Edge device name for deployment and then choose **Create Deployment for Single Device**.
    > [!TIP]
    > To confirm that the device you've chosen is an IoT Edge device, select it to expand the list of modules and verify the presence of **$edgeHub** and **$edgeAgent**. Every IoT Edge device includes these two modules.
1. Navigate to your solution's **config** folder, select the `deployment.debug.amd64.json` file, and then select **Select Edge Deployment Manifest**.

You can check your container status from your device or virtual machine by running the `docker ps` command in a terminal. You should see your container listed after running the command. If your Visual Studio Code and IoT Edge runtime are running on the same machine, you can also check the status in the Visual Studio Code Docker view. 

> [!IMPORTANT]
> If you're using a private registry like Azure Container Registry for your images, you may need to authenticate to push images. Use `docker login <Azure Container Registry login server>` or `az acr login --name <Azure Container Registry name>` to authenticate.

::: zone-end
<!--vscode end-->

::: zone pivot="iotedge-dev-cli"

#### Sign in to Docker

Provide your container registry credentials to Docker so that it can push your container image to storage in the registry.

1. Sign in to Docker with the Azure Container Registry credentials that you saved after creating the registry.

   ```bash
   docker login -u <Azure Container Registry username> -p <Azure Container Registry password> <Azure Container Registry login server>
   ```

   You may receive a security warning recommending the use of `--password-stdin`. While that's a recommended best practice for production scenarios, it's outside the scope of this tutorial. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/#provide-a-password-using-stdin) reference.

1. Sign in to the Azure Container Registry. You may need to [Install Azure CLI](/cli/azure/install-azure-cli) to use the `az` command. This command asks for your user name and password found in your container registry in **Settings** > **Access keys**.

   ```azurecli
   az acr login -n <Azure Container Registry name>
   ```
>[!TIP]
>If you get logged out at any point in this tutorial, repeat the Docker and Azure Container Registry sign in steps to continue.

#### Build module Docker image

Use the module's Dockerfile to [build](https://docs.docker.com/engine/reference/commandline/build/) the module Docker image.

```bash
docker build --rm -f "<DockerFilePath>" -t <ImageNameAndTag> "<ContextPath>" 
```

For example, to build the image for the local registry or an Azure Container Registry, use the following commands:

```bash
# Build the image for the local registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t localhost:5000/filtermodule:0.0.1-amd64 "./modules/filtermodule"

# Or build the image for an Azure Container Registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t myacr.azurecr.io/filtermodule:0.0.1-amd64 "./modules/filtermodule"
```

#### Push module Docker image

[Push](https://docs.docker.com/engine/reference/commandline/push/) your module image to the local registry or a container registry.

`docker push <ImageName>`

For example:

```bash
# Push the Docker image to the local registry

docker push localhost:5000/filtermodule:0.0.1-amd64

# Or push the Docker image to an Azure Container Registry
az acr login --name myacr
docker push myacr.azurecr.io/filtermodule:0.0.1-amd64
```

#### Deploy the module to the IoT Edge device

Use the [IoT Edge Azure CLI set-modules](/cli/azure/iot/edge#az-iot-edge-set-modules) command to deploy the modules to the Azure IoT Hub. For example, to deploy the modules defined in the *deployment.debug.template.json* file to IoT Hub *my-iot-hub* for the IoT Edge device *my-device*, use the following command:

```azurecli
az iot edge set-modules --hub-name my-iot-hub --device-id my-device --content ./deployment.debug.template.json --login "HostName=my-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>"
```

> [!TIP]
> You can find your IoT Hub shared access key in the Azure portal in your IoT Hub > **Security settings** > **Shared access policies** > **iothubowner**.
>

::: zone-end
<!--iotedgedev end-->

## Debug your module

To debug modules on a remote device, you can use Remote SSH debugging in Visual Studio Code.

To enable Visual Studio Code remote debugging, install the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack). For more information about Visual Studio Code remote debugging, see [Visual Studio Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview).

For details on how to use Remote SSH debugging in Visual Studio Code, see [Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)

In the Visual Studio Code Debug view, select the debug configuration file for your module. By default, the **.debug** Dockerfile, module's container `createOptions` settings, and the `launch.json` file use *localhost*.

Select **Start Debugging** or select **F5**. Select the process to attach to. In the Visual Studio Code Debug view, you see variables in the left panel.

## Debug using Docker Remote SSH

The Docker and Moby engines support SSH connections to containers allowing you to debug in Visual Studio Code connected to a remote device. You need to meet the following prerequisites before you can use this feature.

Remote SSH debugging prerequisites may be different depending on the language you are using. The following sections describe the setup for .NET. For information on other languages, see [Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh) for an overview. Details about how to configure remote debugging are included in debugging sections for each language in the Visual Studio Code documentation.

### Configure Docker SSH tunneling

1. Follow the steps in [Docker SSH tunneling](https://code.visualstudio.com/docs/containers/ssh#_set-up-ssh-tunneling) to configure SSH tunneling on your development computer. SSH tunneling requires public/private key pair authentication and a Docker context defining the remote device endpoint.
1. Connecting to Docker requires root-level privileges. Follow the steps in [Manage docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall) to allow connection to the Docker daemon on the remote device. When you finish debugging, you may want to remove your user from the Docker group.
1. In Visual Studio Code, use the Command Palette (Ctrl+Shift+P) to issue the *Docker Context: Use* command to activate the Docker context pointing to the remote machine. This command causes both Visual Studio Code and Docker CLI to use the remote machine context.

    > [!TIP]
    > All Docker commands use the current context. Remember to change context back to *default* when you are done debugging. 

1. To verify the remote Docker context is active, list the running containers on the remote device:

    ```bash
    docker ps
    ```
    
    The output should list the containers running on the remote device similar:
    
    ```output
    PS C:\> docker ps        
    CONTAINER ID   IMAGE                                                             COMMAND                   CREATED        STATUS         PORTS                                                                                                                                   NAMES
    a317b8058786   myacr.azurecr.io/filtermodule:0.0.1-amd64                         "dotnet filtermodule…"    24 hours ago   Up 6 minutes                                                                                                                                           filtermodule
    d4d949f8dfb9   mcr.microsoft.com/azureiotedge-hub:1.4                            "/bin/sh -c 'echo \"$…"   24 hours ago   Up 6 minutes   0.0.0.0:443->443/tcp, :::443->443/tcp, 0.0.0.0:5671->5671/tcp, :::5671->5671/tcp, 0.0.0.0:8883->8883/tcp, :::8883->8883/tcp, 1883/tcp   edgeHub
    1f0da9cfe8e8   mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0   "/bin/sh -c 'echo \"$…"   24 hours ago   Up 6 minutes                                                                                                    
                                           tempSensor
    66078969d843   mcr.microsoft.com/azureiotedge-agent:1.4                          "/bin/sh -c 'exec /a…"    24 hours ago   Up 6 minutes                                                                                                    
                                           edgeAgent
    ```

1. In the *.vscode* directory, add a new configuration to **launch.json** by opening the file in Visual Studio Code. Select **Add configuration** then choose the matching remote attach template for your module. For example, the following configuration is for .NET Core. Change the value for the *-H* parameter in *PipeArgs* to your device DNS name or IP address.

    ```json
    "configurations": [
    {
      "name": "Remote Debug IoT Edge Module (.NET Core)",
      "type": "coreclr",
      "request": "attach",
      "processId": "${command:pickRemoteProcess}",
      "pipeTransport": {
        "pipeProgram": "docker",
        "pipeArgs": [
          "-H",
          "ssh://user@my-device-vm.eastus.cloudapp.azure.com:22",
          "exec",
          "-i",
          "filtermodule",
          "sh",
          "-c"
        ],
        "debuggerPath": "~/vsdbg/vsdbg",
        "pipeCwd": "${workspaceFolder}",
        "quoteArgs": true
      },
      "sourceFileMap": {
        "/app": "${workspaceFolder}/modules/filtermodule"
      },
      "justMyCode": true
    },
    ```

### Remotely debug your module

1. In Visual Studio Code Debug view, select the debug configuration *Remote Debug IoT Edge Module (.NET Core)*.
1. Select **Start Debugging** or select **F5**. Select the process to attach to.
1. In the Visual Studio Code Debug view, you see the variables in the left panel.
1. In Visual Studio Code, set breakpoints in your custom module.
1. When a breakpoint is hit, you can inspect variables, step through code, and debug your module.

    :::image type="content" source="media/debug-module-vs-code/vs-code-breakpoint.png" alt-text="Screenshot of Visual Studio Code attached to a Docker container on a remote device paused at a breakpoint." lightbox="media/debug-module-vs-code/vs-code-breakpoint.png":::
> [!NOTE]
> The preceding example shows how to debug IoT Edge modules on remote containers. The example adds a remote Docker context and changes to the Docker privileges on the remote device. After you finish debugging your modules, set your Docker context to *default* and remove privileges from your user account.

See this [IoT Developer blog entry](https://devblogs.microsoft.com/iotdev/easily-build-and-debug-iot-edge-modules-on-your-remote-device-with-azure-iot-edge-for-vs-code-1-9-0/) for an example using a Raspberry Pi device.

## Next steps

After you've built your module, learn how to [deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md).

To develop modules for your IoT Edge devices, understand and use [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).
