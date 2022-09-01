---
title: Develop and debug modules for Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to develop, build, and debug a module for Azure IoT Edge using C#, Python, Node.js, Java, or C
services: iot-edge
author: PatAltimore

ms.author: patricka
ms.date: 08/30/2022
ms.topic: conceptual
ms.service: iot-edge
ms.custom: devx-track-js
zone_pivot_groups: iotedge-dev
---

# Use Visual Studio Code to develop and debug modules for Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

This article shows you how to use Visual Studio Code for developing and debugging IoT Edge modules in multiple languages and multiple architectures. On your development computer, you can use Visual Studio Code to attach and debug your module in a local or remote module container.

Visual Studio Code supports writing IoT Edge modules in the following programming languages:

* C# and C# Azure Functions
* C
* Python
* Node.js
* Java

Azure IoT Edge supports the following device architectures:

* X64
* ARM32
* ARM64

For more information about supported operating systems, languages, and architectures, see [Language and architecture support](module-development.md#language-and-architecture-support).

::: zone pivot="iotedge-dev-vscode"

When using the Visual Studio Code IoT Edge extension, you can also launch and debug your module code in the IoT Edge Simulator.

::: zone-end

You can also use a Windows development computer and debug modules in a Linux container using IoT Edge for Linux on Windows (EFLOW). For more information about using EFLOW for developing modules, see [Tutorial: Develop IoT Edge modules with Linux containers using IoT Edge for Linux on Windows](tutorial-develop-for-linux-on-windows.md).

If you aren't familiar with the debugging capabilities of Visual Studio Code, see [Visual Studio Code debugging](https://code.visualstudio.com/Docs/editor/debugging).

## Prerequisites

You can use a computer or a virtual machine running Windows, macOS, or Linux as your development machine. On Windows computers, you can develop either Windows or Linux modules. To develop Linux modules, use a Windows computer that meets the [requirements for Docker Desktop](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

Install [Visual Studio Code](https://code.visualstudio.com/) first and then add the following extensions:

- [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

::: zone pivot="iotedge-dev-vscode"

- [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)

::: zone-end

To build and deploy your module image, you need Docker to build the module image and a container registry to hold the module image:

- Install [Docker Community Edition](https://docs.docker.com/install/) on your development machine.
- Create a [Azure Container Registry](../container-registry/index.yml) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags)

    > [!TIP]
    > You can use a local Docker registry for prototype and testing purposes instead of a cloud registry.

- Install the [Azure CLI](/cli/azure/install-azure-cli)
- Install the Python-based [Azure IoT Edge Dev Tool](https://pypi.org/project/iotedgedev/) in order to set up your local development environment to debug, run, and test your IoT Edge solution. If you haven't already done so, install [Python (3.6/3.7/3.8) and Pip3](https://www.python.org/) and then install the IoT Edge Dev Tool (iotedgedev) by running this command in your terminal.

    ```cmd
    pip3 install iotedgedev
    ```

    > [!NOTE]
    >
    > If you have multiple Python including pre-installed Python 2.7 (for example, on Ubuntu or macOS), make sure you are using `pip3` to install *IoT Edge Dev Tool (iotedgedev)*.
    >
    > For more information setting up your development machine, see [iotedgedev development setup](https://github.com/Azure/iotedgedev/blob/main/docs/environment-setup/manual-dev-machine-setup.md).

Install prerequisites specific to the language you're developing in:

# [C](#tab/c)

- Install [C/C++ VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

# [C\# / Azure Functions](#tab/csharp+azfunctions)

- Install [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet/3.1)
- Install [C# VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

# [Java](#tab/java)

- Install [Java SE Development Kit 10](/azure/developer/java/fundamentals/java-support-on-azure) and [Maven](https://maven.apache.org/). You'll need to [set the `JAVA_HOME` environment variable](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) to point to your JDK installation.
- Install [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

# [Node.js](#tab/node)

- Install [Node.js](https://nodejs.org). You'll also want to install [Yeoman](https://www.npmjs.com/package/yo) and the [Azure IoT Edge Node.js Module Generator](https://www.npmjs.com/package/generator-azure-iot-edge-module).

# [Python](#tab/python)

- Install [Python](https://www.python.org/downloads/) and [Pip](https://pip.pypa.io/en/stable/installing/#installation) for installing Python packages (typically included with your Python installation).
- Install [Python VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

---

To test your module on a device, you'll need:

- An active IoT Hub with at least one IoT Edge device.
- A physical IoT Edge device or a virtual device. To create a virtual device in Azure, follow the steps in the quickstart for [Linux](quickstart-linux.md) or [Windows](quickstart.md).

## Create IoT Edge module

The following steps show you how to create an IoT Edge module in your preferred development language. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules.

::: zone pivot="iotedge-dev-cli"

The [IoT Edge Dev Tool](https://github.com/Azure/iotedgedev) simplifies Azure IoT Edge development to simple commands driven by environment variables. It gets you started with IoT Edge development with the IoT Edge Dev Container and IoT Edge solution scaffolding that contains a default module and all the required configuration files.

1. Create a directory for your solution. 

    ```bash
    mkdir c:\dev\iotedgesolution
    ```

1. Use the **iotedgedev init** command to create a solution and set up your Azure IoT Hub. Use the following command to create an IoT Edge solution for a specified development language.

    # [C](#tab/c)
    
    ```bash
    iotedgedev init --template c
    ```
    
    # [C\#](#tab/csharp)
    
    ```bash
    iotedgedev init --template csharp
    ```
    
    The solution includes a default C# module named *filtermodule*.
    
    # [Azure Functions](#tab/azfunctions)
    
    ```bash
    iotedgedev init --template csharpfunction
    ```
    
    # [Java](#tab/java)
    
    ```bash
    iotedgedev init --template java
    ```

    # [Node.js](#tab/node)

    ```bash
    iotedgedev init --template nodejs
    ```

    # [Python](#tab/python)

    ```bash
    iotedgedev init --template python
    ```

    ---

The *iotedgedev init* script prompts you to complete several steps including:

* Authenticate to Azure
* Choose an Azure subscription
* Choose or create a resource group
* Choose or create an Azure IoT Hub
* Choose or create an Azure IoT Edge device

After solution creation, there are four items within the solution:

- A **.vscode** folder contains configuration file *launch.json*.
- A **modules** folder has subfolders for each module. Within the subfolder for each module, the *module.json* file controls how modules are built and deployed.
- An **.env** file lists your environment variables. The environment variable for the container registry is *localhost* by default. If Azure Container Registry is your registry, you'll need to set an Azure Container Registry username and password. For example,

    ```env
    CONTAINER_REGISTRY_SERVER="myacr.azurecr.io"
    CONTAINER_REGISTRY_USERNAME="myacr"
    CONTAINER_REGISTRY_PASSWORD="<registry_password>"
    ```

   In production scenarios, you should use service principals to provide access to your container registry instead of the *.env* file. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

    > [!NOTE]
    > The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables.

- Two module deployment files named **deployment.template.json** and **deployment.debug.template** list the modules to deploy to your device. By default, the list includes the IoT Edge system modules and two sample modules:
    - **filtermodule** is a sample module that implements a simple filter function.
    - **SimulatedTemperatureSensor** module that simulates data you can use for testing. For more information about how deployment manifests work, see [Learn how to use deployment manifests to deploy modules and establish routes](module-composition.md). For more information on how the simulated temperature module works, see the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

::: zone-end

::: zone pivot="iotedge-dev-vscode"

Use Visual Studio Code and the Azure IoT Tools. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules.

1. Select **View** > **Command Palette**.
1. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge Solution**.

   ![Run New IoT Edge Solution](./media/how-to-develop-csharp-module/new-solution.png)

1. Browse to the folder where you want to create the new solution and then select **Select folder**.
1. Enter a name for your solution.
1. Select a module template for your preferred development language to be the first module in the solution.
1. Enter a name for your module. Choose a name that's unique within your container registry.
1. Provide the name of the module's image repository. Visual Studio Code autopopulates the module name with **localhost:5000/<your module name\>**. Replace it with your own registry information. If you use a local Docker registry for testing, then **localhost** is fine. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **_\<registry name\>_.azurecr.io**. Only replace the **localhost:5000** part of the string so that the final result looks like **\<*registry name*\>.azurecr.io/_\<your module name\>_**.

   ![Provide Docker image repository](./media/how-to-develop-csharp-module/repository.png)

Visual Studio Code takes the information you provided, creates an IoT Edge solution, and then loads it in a new window.

There are four items within the solution:

- A **.vscode** folder contains debug configurations.
- A **modules** folder has subfolders for each module.  Within the folder for each module there's a file, **module.json** that controls how modules are built and deployed.  This file would need to be modified to change the module deployment container registry from localhost to a remote registry. At this point, you only have one module. But you can add more if needed
- An **.env** file lists your environment variables. The environment variable for the container registry is *localhost* by default. If Azure Container Registry is your registry, you'll need to set an Azure Container Registry username and password. For example,

    ```env
    CONTAINER_REGISTRY_SERVER="myacr.azurecr.io"
    CONTAINER_REGISTRY_USERNAME="myacr"
    CONTAINER_REGISTRY_PASSWORD="<your_acr_password>"
    ```

   In production scenarios, you should use service principals to provide access to your container registry instead of the *.env* file. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

    > [!NOTE]
    > The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables.

- Two module deployment files named **deployment.template.json** and **deployment.debug.template** list the modules to deploy to your device. By default, the list includes the IoT Edge system modules and sample modules including the **SimulatedTemperatureSensor** module that simulates data you can use for testing. For more information about how deployment manifests work, see [Learn how to use deployment manifests to deploy modules and establish routes](module-composition.md). For more information on how the simulated temperature module works, see the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

::: zone-end

### Set IoT Edge runtime version

The IoT Edge extension defaults to the latest stable version of the IoT Edge runtime when it creates your deployment assets. Currently, the latest stable version is version 1.4. If you're developing modules for devices running the 1.1 long-term support version or the earlier 1.0 version, update the IoT Edge runtime version in Visual Studio Code to match.

::: zone pivot="iotedge-dev-vscode"

1. Select **View** > **Command Palette**.
1. In the command palette, enter and run the command **Azure IoT Edge: Set default IoT Edge runtime version**.
1. Choose the runtime version that your IoT Edge devices are running from the list.

After you select a new runtime version, your deployment manifest is dynamically updated to reflect the change to the runtime module images.

::: zone-end

::: zone pivot="iotedge-dev-cli"

1. In Visual Studio Code, open *deployment.debug.template.json* deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) is a JSON document that describes the modules to be configured on the targeted IoT Edge device.
1. Change the runtime version for the system runtime module images *edgeAgent* and *edgeHub*. For example, if you want to use the IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

    ```json
    ...
    "systemModules": {
        "edgeAgent": {
        ...
            "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
        ...
        "edgeHub": {
        ...
            "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
        ...
    ```

::: zone-end

## Add additional modules

To add more modules to your solution, change to *module* directory.

```bash
cd modules
```

::: zone pivot="iotedge-dev-vscode"

Run the command **Azure IoT Edge: Add IoT Edge Module** from the command palette. You can also right-click the **modules** folder or the `deployment.debug.template.json` file in the Visual Studio Code Explorer view and then select **Add IoT Edge Module**.

::: zone-end
<!--vscode end-->

::: zone pivot="iotedge-dev-cli"

# [C](#tab/c)

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir cmodule` then `cd cmodule`.
1. Download a ZIP of the contents of the [C sample module](https://github.com/azure/azure-iot-edge-c-module) from GitHub.
1. Extract the contents of the ZIP file into the new module directory.
1. Update *module.json* file with correct repository. For example, if you want to use the repository defined in your environment variables, use `${CONTAINER_REGISTRY_SERVER}/cmodule`.

# [C\#](#tab/csharp)

1. Install the [.NET IoT Edge C# template](https://github.com/azure/dotnet-template-azure-iot-edge-module/).

    ```dotnetcli
    dotnet new -i Microsoft.Azure.IoT.Edge.Module
    ```

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir SampleModule` then `cd SampleModule`.
1. Use the IoT Edge .NET template to add a new C# module. For example, the following command adds a new module named *SampleModule* and configures *module.json* to use *myacr.azurecr.io/samplemodule* as the image repository.

    ```dotnetcli
    dotnet new aziotedgemodule --name SampleModule --repository myacr.azurecr.io/samplemodule
    ```

    The command creates the module in the current directory and configures the *module.json* file with the repository information.

# [Azure Functions](#tab/azfunctions)

1. Install the [.NET IoT Edge Azure Function template](https://github.com/azure/dotnet-template-azure-iot-edge-function/).

    ```dotnetcli
    dotnet new -i Microsoft.Azure.IoT.Edge.Function
    ```

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir SampleFuncModule` then `cd SampleFuncModule`.
1. Use the IoT Edge Azure Function .NET template to add a new Azure Function module. For example, the following command adds a new module named *SampleFuncModule* and configures *module.json* to use the *myacr.azurecr.io/samplefuncmodule* as the image repository.

    ```dotnetcli
    dotnet new aziotedgefunction --name SampleFuncModule --repository myacr.azurecr.io/samplefuncmodule
    ```

    The command creates the module in the current directory and configures the *module.json* file with the repository information.

# [Java](#tab/java)

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir JavaModule` then `cd JavaModule`.
1. Use Maven to add a new Java module. For example, the following command adds a new module named *JavaModule* and configures *module.json to use *myacr.azurecr.io/javamodule* as the image repository.

    ```java
    mvn archetype:generate -DarchetypeGroupId="com.microsoft.azure" -DarchetypeArtifactId="azure-iot-edge-archetype" -DgroupId="com.edgemodule" -DartifactId="JavaModule" -Dversion="1.0.0-SNAPSHOT" -Dpackage="com.edgemodule" -Drepository="myacr.azurecr.io/javamodule" -B
    ```

    The command creates the module in the current directory and configures the *module.json* file with the repository information.

# [Node.js](#tab/node)

1. Install the [Azure IoT Edge Node.js Module Generator](https://github.com/Azure/generator-azure-iot-edge-module) and [Yeoman](https://yeoman.io/).

    ```nodejs
    npm i -g generator-azure-iot-edge-module 
    npm i -g yo
    ```

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir NodeModule` then `cd NodeModule`.
1. Use the Azure IoT Edge Node.js Module Generator to add a new Node.js module. For example, the following command adds a new module named *NodeModule* and configures *module.json* to use the *myacr.azurecr.io/nodemodule* as the image repository.

    ```nodejs
    yo azure-iot-edge-module -n NodeModule -r myacr.azurecr.io/nodemodule
    ```

    The command creates the module in the current directory and configures the *module.json* file with the repository information.

# [Python](#tab/python)

1. Create a new directory folder in the *modules* folder and change directory to the new folder. For example, `mkdir pythonmodule` then `cd pythonmodule`.
1. Download a ZIP of the contents of the [Cookiecutter Template for Azure IoT Edge Python Module](https://github.com/azure/cookiecutter-azure-iot-edge-module) from GitHub.
1. Extract the contents of the `{{cookiecutter.module_name}}` folder in the ZIP file then copy the files into the new module directory.
1. Update *module.json* file with correct repository. For example, if you want to use the repository defined in your environment variables, use `${CONTAINER_REGISTRY_SERVER}/cmodule`.

---

::: zone-end
<!--iotedgedev end-->

## Develop your module

The default module code that comes with the solution is located at the following location:

# [C](#tab/c)

modules/*&lt;your module name&gt;*/**main.c**

# [C\#](#tab/csharp)

modules/*&lt;your module name&gt;*/**Program.cs**

# [Azure Functions](#tab/azfunctions)

modules/*&lt;your module name&gt;*/***&lt;your module name&gt;*.cs**

# [Java](#tab/java)

modules/*&lt;your module name&gt;*/ src/main/java/com/edgemodule/**App.java**

# [Node.js](#tab/node)

modules/*&lt;your module name&gt;*/**app.js**

# [Python](#tab/python)
modules/*&lt;your module name&gt;*/**main.py**

---

The sample modules are designed so that you can build the solution, push it to your container registry, and deploy it to a device to start testing without modifying any code. The sample module takes input from a source (in this case, the *SimulatedTemperatureSensor* module that simulates data) and pipe it to IoT Hub.

When you're ready to customize the template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability.

::: zone pivot="iotedge-dev-vscode"

## Debug without a container using IoT Edge simulator

# [C / Python](#tab/c+python)

Debugging a module without a container isn't available when using *C* or *Python*.

# [C\# / Azure Functions](#tab/csharp+azfunctions)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

In the Visual Studio Code integrated terminal, change the directory to the ***&lt;your module name&gt;*** folder, and then run the following command to build .NET Core application.

```cmd
dotnet build
```

Open the file `Program.cs` and add a breakpoint.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (.NET Core)** from the dropdown.

> [!NOTE]
> If your .NET Core `TargetFramework` is not consistent with your program path in `launch.json`, you'll need to manually update the program path in `launch.json` to match the `TargetFramework` in your .csproj file so that Visual Studio Code can successfully launch this program.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

# [Java](#tab/java)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

Open the file *App.java* and add a breakpoint.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (Java)** from the dropdown.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

# [Node.js](#tab/node)

[!INCLUDE [debug-without-container-setup](includes/debug-without-container-setup.md)]

In the Visual Studio Code integrated terminal, change the directory to the ***&lt;your module name&gt;*** folder, and then run the following command to install Node packages

```cmd
npm install
```

Open the file `app.js` and add a breakpoint.

Navigate to the Visual Studio Code Debug view by selecting the debug icon from the menu on the left or by typing `Ctrl+Shift+D`. Select the debug configuration ***&lt;your module name&gt;* Local Debug (Node.js)** from the dropdown.

[!INCLUDE [debug-without-container-run](includes/debug-without-container-run.md)]

---

## Debug in attach mode using IoT Edge simulator

# [C / Python](#tab/c+python)

Debugging in attach mode isn't supported for C or Python.

# [C\# / Azure Functions / Node.js / Java](#tab/csharp+azfunctions+node+java)

Your default solution contains two modules, one is a simulated temperature sensor module and the other is the pipe module. The simulated temperature sensor sends messages to the pipe module and then the messages are piped to the IoT Hub. In the module folder you created, there are several Docker files for different container types. Use any of the files that end with the extension **.debug** to build your module for testing.

Currently, debugging in attach mode is supported only as follows:

- C# modules, including those for Azure Functions, support debugging in Linux amd64 containers
- Node.js modules support debugging in Linux amd64 and arm32v7 containers, and Windows amd64 containers
- Java modules support debugging in Linux amd64 and arm32v7 containers

> [!TIP]
> You can switch among options for the default platform for your IoT Edge solution by clicking the item in the Visual Studio Code status bar.

### Set up IoT Edge simulator for IoT Edge solution

On your development machine, you can start an IoT Edge simulator instead of installing the IoT Edge security daemon so that you can run your IoT Edge solution.

1. In the **Explorer** tab on the left side, expand the **Azure IoT Hub** section. Right-click on your IoT Edge device ID, and then select **Setup IoT Edge Simulator** to start the simulator with the device connection string.

1. You can see the IoT Edge Simulator has been successfully set up by reading the progress detail in the integrated terminal.

### Build and run container for debugging and debug in attach mode

1. Open your module file (`Program.cs`, `app.js`, `App.java`, or `<your module name>.cs`) and add a breakpoint.

1. In the Visual Studio Code Explorer view, right-click the `deployment.debug.template.json` file for your solution and then select **Build and Run IoT Edge solution in Simulator**. You can watch all the module container logs in the same window. You can also navigate to the Docker view to watch container status.

   ![Watch Variables](media/how-to-vs-code-develop-module/view-log.png)

1. Navigate to the Visual Studio Code Debug view and select the debug configuration file for your module. The debug option name should be similar to ***&lt;your module name&gt;* Remote Debug**

1. Select **Start Debugging** or press **F5**. Select the process to attach to.

1. In Visual Studio Code Debug view, you'll see the variables in the left panel.

1. To stop the debugging session, first select the Stop button or press **Shift + F5**, and then select **Azure IoT Edge: Stop IoT Edge Simulator** from the command palette.

> [!NOTE]
> The preceding example shows how to debug IoT Edge modules on containers. It added exposed ports to your module's container `createOptions` settings. After you finish debugging your modules, we recommend you remove these exposed ports for production-ready IoT Edge modules.
>
> For modules written in C#, including Azure Functions, this example is based on the debug version of `Dockerfile.amd64.debug`, which includes the .NET Core command-line debugger (VSDBG) in your container image while building it. After you debug your C# modules, we recommend that you directly use the Dockerfile without VSDBG for production-ready IoT Edge modules.

---

::: zone-end
<!--vscode end-->

## Debug a module with the IoT Edge runtime

In each module folder, there are several Docker files for different container types. Use any of the files that end with the extension **.debug** to build your module for testing.

When you debug modules using this method, your modules are running on top of the IoT Edge runtime. The IoT Edge device and your Visual Studio Code can be on the same machine, or more typically, Visual Studio Code is on the development machine and the IoT Edge runtime and modules are running on another physical machine. In order to debug from Visual Studio Code, you must:

- Set up your IoT Edge device, build your IoT Edge modules with the **.debug** Dockerfile, and then deploy to the IoT Edge device.
- Update the `launch.json` so that Visual Studio Code can attach to the process in the container on the remote machine. This file is located in the `.vscode` folder in your workspace and updates each time you add a new module that supports debugging.
- Use Remote SSH debugging to attach to the container on the remote machine.

### Build and deploy your module to an IoT Edge device

In Visual Studio Code, open *deployment.debug.template.json* deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) is a JSON document that describes the modules to be configured on the targeted IoT Edge device. Before deployment, you need to update your Azure Container Registry credentials and your module images with the proper `createOptions` values. For more information about createOption values, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

::: zone pivot="iotedge-dev-cli"

1. If you're using an Azure Container Registry to store your module image, you'll need to add your credentials to **deployment.debug.template.json** in the *edgeAgent* settings. For example,

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
    ...
    ```

1. Add or replace the following stringified content to *createOptions* value for each system and custom module listed.

    ```json
    "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    ```
    
    For example, the *filtermodule* configuration should be similar to the following:
    
    ```json
    "filtermodule": {
    "version": "1.0",
    "type": "docker",
    "status": "running",
    "restartPolicy": "always",
    "settings": {
        "image": "patrickaacr.azurecr.io/filtermodule:0.0.1-amd64",
        "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
    }
    ```
    
::: zone-end

::: zone pivot="iotedge-dev-vscode"

1. In the Visual Studio Code command palette, run the command **Azure IoT Edge: Build and Push IoT Edge solution**.
1. Select the `deployment.debug.template.json` file for your solution.
1. In the **Azure IoT Hub Devices** section of the Visual Studio Code Explorer view, right-click the IoT Edge device name for deployment and then choose **Create Deployment for Single Device**.
    > [!TIP]
    > To confirm that the device you've chosen is an IoT Edge device, select it to expand the list of modules and verify the presence of **$edgeHub** and **$edgeAgent**. Every IoT Edge device includes these two modules.
1. Navigate to your solution's **config** folder, select the `deployment.debug.amd64.json` file, and then select **Select Edge Deployment Manifest**.

You can check your container status by running the `docker ps` command in the terminal. If your Visual Studio Code and IoT Edge runtime are running on the same machine, you can also check the status in the Visual Studio Code Docker view.

::: zone-end
<!--vscode end-->

::: zone pivot="iotedge-dev-cli"

#### Build module Docker image

Use the module's Dockerfile to build the module Docker image.

```bash
docker build --rm -f "<DockerFilePath>" -t <ImageNameAndTag> "<ContextPath>" 
```

For example, to build the image for the local registry or an Azure container registry, use the following commands:

```bash
# Build the image for the local registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t localhost:5000/filtermodule:0.0.1-amd64 "./modules/filtermodule"

# Or build the image for an Azure Container Registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t myacr.azurecr.io/filtermodule:0.0.1-amd64 "./modules/filtermodule"
```

#### Push module Docker image

Push your module image to the local registry or a container registry.

`docker push <ImageName>`

For example:

```bash
# Push the Docker image to the local registry

docker push localhost:5000/samplemodule:0.0.1-amd64

# Or push the Docker image to an Azure Container Registry
az acr login --name myacr
docker push myacr.azurecr.io/filtermodule:0.0.1-amd64
```

#### Deploy the module to the IoT Edge device.

Use the [IoT Edge Azure CLI set-modules](/cli/azure/iot/edge#az-iot-edge-set-modules) command to deploy the modules to the Azure IoT Hub. For example, to deploy the modules defined in the *deployment.debug.amd64.json* file to IoT Hub *my-iot-hub* for the IoT Edge device *my-device*, use the following command:

```azurecli
az iot edge set-modules --hub-name my-iot-hub --device-id my-device --content ./deployment.debug.template.json --login "HostName=my-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>"
```

> [!TIP]
> You can find your IoT Hub connection string in the Azure portal under Azure IoT Hub > **Security settings** > **Shared access policies**.
>

::: zone-end
<!--iotedgedev end-->

## Debug your module

Open the module file for your development language and add a breakpoint:

# [C](#tab/c)

Add your breakpoint to the file `main.c`.

# [C\#](#tab/csharp)

Add your breakpoint to the file `Program.cs`.

# [Azure Functions](#tab/azfunctions)

Add your breakpoint to the file `<your module name>.cs`.

# [Java](#tab/java)

Add your breakpoint to the file `App.java`.

# [Node.js](#tab/node)

Add your breakpoint to the file `app.js`.

# [Python](#tab/python)

Add your breakpoint to the file `main.py`in the callback method where you added the `ptvsd.break_into_debugger()` line.

---

To debug modules on a remote device, you can use Remote SSH debugging in VS Code.

To enable VS Code remote debugging, install the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack). For more information about VS Code remote debugging, see [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview).

For details on how to use Remote SSH debugging in VS Code, see [Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)

In the Visual Studio Code Debug view, select the debug configuration file for your module. By default, the **.debug** Dockerfile, module's container `createOptions` settings, and `launch.json` file are configured to use *localhost*.

Select **Start Debugging** or select **F5**. Select the process to attach to. In the Visual Studio Code Debug view, you'll see the variables in the left panel.

## Debug using Docker Remote SSH

The Docker and Moby engines support SSH connections to containers allowing you to debug in VS Code connected to a remote device. You need to meet the following prerequisites before you can use this feature.

### Configure Docker SSH tunneling

1. Follow the steps in [Docker SSH tunneling](https://code.visualstudio.com/docs/containers/ssh#_set-up-ssh-tunneling) to configure SSH tunneling on your development computer. SSH tunneling requires public/private key pair authentication and a Docker context defining the remote device endpoint.
1. Connecting to Docker requires root-level privileges. Follow the steps in [Manage docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall) to allow connection to the Docker daemon on the remote device. When you're finished debugging, you may want to remove your user from the Docker group.
1. In Visual Studio Code, use the Command Palette (Ctrl+Shift+P) to issue the *Docker Context: Use* command to activate the Docker context pointing to the remote machine. This command causes both VS Code and Docker CLI to use the remote machine context.

    > [!TIP]
    > All Docker commands use the current context. Remember to change context back to *default* when you are done debugging. 

1. To verify the remote Docker context is active, list the running containers on the remote device:

    ```bash
    docker ps
    ```
    
    The output should list the containers running on the remote device similar to the following:
    
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

1. In the *.vscode* directory, add a new configuration to **launch.json** by opening the file in VS Code. Select **Add configuration** then choose the matching remote attach template for your module. For example, the following configuration is for .NET Core. Change the value for the *-H* parameter in *PipeArgs* to your device DNS name or IP address.

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

1. In VS Code Debug view, select the debug configuration *Remote Debug IoT Edge Module (.NET Core)*.
1. Select **Start Debugging** or select **F5**. Select the process to attach to
1. In the Visual Studio Code Debug view, you'll see the variables in the left panel.

> [!NOTE]
> The preceding example shows how to debug IoT Edge modules on remote containers. It added a remote Docker context and changes to the Docker privileges on the remote device. After you finish debugging your modules, set your Docker context to *default* and remove privileges from your user account.

See this [IoT Developer blog entry](https://devblogs.microsoft.com/iotdev/easily-build-and-debug-iot-edge-modules-on-your-remote-device-with-azure-iot-edge-for-vs-code-1-9-0/) for an example using a Raspberry Pi device.

## Next steps

After you've built your module, learn how to [deploy Azure IoT Edge modules from Visual Studio Code](how-to-deploy-modules-vscode.md).

To develop modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).
