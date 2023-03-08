---
title: Develop module for Linux devices using Azure IoT Edge tutorial
description: This tutorial walks through setting up your development machine and cloud resources to develop IoT Edge modules using Linux containers for Linux devices
author: PatAltimore

ms.author: patricka
ms.date: 03/06/2023
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
zone_pivot_groups: iotedge-dev
---

# Tutorial: Develop IoT Edge modules with Linux containers

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This tutorial walks through developing and deploying your own code to an IoT Edge device. In the [Deploy code to a Linux device](quickstart-linux.md) quickstart, you created an IoT Edge device and deployed a module from the Azure Marketplace.

You can choose either the **Azure IoT Edge Dev Tool** command-line tool (CLI) or the **Azure IoT Edge tools for Visual Studio Code** extension as your IoT Edge development tool. Use the tool selector button at the beginning to choose your tool option for this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up your development machine.
> * Use the IoT Edge tools to create a new project.
> * Build your project as a [Docker container](/dotnet/architecture/microservices/container-docker-introduction) and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device.

## Prerequisites

A development machine:

* Use your own computer or a virtual machine.
* Your development machine must support [nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for running a container engine, which you'll install in the next section.
* Most operating systems that can run a container engine can be used to develop IoT Edge modules for Linux devices. This tutorial uses a Windows computer, but points out known differences on macOS or Linux.
* Install [Git](https://git-scm.com/), to pull module template packages later in this tutorial.

* Install [Visual Studio Code](https://code.visualstudio.com/)
* Install the [Azure CLI](/cli/azure/install-azure-cli).

An Azure IoT Edge device:

* We recommend not to run IoT Edge on your development machine, but instead use a separate device. This distinction between development machine and IoT Edge device simulates a true deployment scenario and helps keep the different concepts straight.
* If you don't have a second device available, use the quickstart article [Deploy code to a Linux Device](quickstart-linux.md) to create an IoT Edge device in Azure.

Cloud resources:

* A free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!TIP]
> For guidance on interactive debugging in Visual Studio Code or Visual Studio 2022:
>* [Use Visual Studio Code to develop and debug modules for Azure IoT Edge](how-to-vs-code-develop-module.md)
>* [Use Visual Studio 2022 to develop and debug modules for Azure IoT Edge](how-to-visual-studio-develop-module.md)
>
>This tutorial teaches the development steps for Visual Studio Code.

## Key concepts

This tutorial walks through the development of an IoT Edge module. An *IoT Edge module*, or sometimes just *module* for short, is a container with executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, cleaning and analyzing data, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

When developing IoT Edge modules, it's important to understand the difference between the development machine and the target IoT Edge device where the module deploys. The container that you build to hold your module code must match the operating system (OS) of the *target device*. For example, the most common scenario is someone developing a module on a Windows computer intending to target a Linux device running IoT Edge. In that case, the container operating system would be Linux. As you go through this tutorial, keep in mind the difference between the *development machine OS* and the *container OS*.

>[!TIP]
>If you're using [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md), then the *target device* in your scenario is the Linux virtual machine, not the Windows host.

This tutorial targets devices running IoT Edge with Linux containers. You can use your preferred operating system as long as your development machine runs Linux containers. We recommend using Visual Studio Code to develop with Linux containers, so that's what this tutorial uses. You can use Visual Studio as well, although there are differences in support between the two tools.

The following table lists the supported development scenarios for **Linux containers** in Visual Studio Code and Visual Studio.

|   | Visual Studio Code | Visual Studio 2019/2022 |
| - | ------------------ | ------------------ |
| **Linux device architecture** | Linux AMD64 <br> Linux ARM32v7 <br> Linux ARM64 | Linux AMD64 <br> Linux ARM32 <br> Linux ARM64 |
| **Azure services** | Azure Functions <br> Azure Stream Analytics <br> Azure Machine Learning |   |
| **Languages** | C <br> C# <br> Java <br> Node.js <br> Python | C <br> C# |
| **More information** | [Azure IoT Edge for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) | [Azure IoT Edge Tools for Visual Studio 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools) <br> [Azure IoT Edge Tools for Visual Studio 2022](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs17iotedgetools) |

## Install container engine

IoT Edge modules are packaged as containers, so you need a [Docker compatible container management system](support.md#container-engines) on your development machine to build and manage them. We recommend Docker Desktop for development because of its feature support and popularity. Docker Desktop on Windows lets you switch between Linux containers and Windows containers so that you can develop modules for different types of IoT Edge devices.

Use the Docker documentation to install on your development machine:

* [Install Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)

  * When you install Docker Desktop for Windows, you're asked whether you want to use Linux or Windows containers. You can change this decision at any time. For this tutorial, we use Linux containers because our modules are targeting Linux devices. For more information, see [Switch between Windows and Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

* [Install Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)

* Read [About Docker CE](https://docs.docker.com/install/) for installation information on several Linux platforms.
  * For the Windows Subsystem for Linux (WSL), install Docker Desktop for Windows.

## Set up tools

::: zone pivot="iotedge-dev-cli"

Install the Python-based [Azure IoT Edge Dev Tool](https://pypi.org/project/iotedgedev/) to debug, run, and test your IoT Edge solution.

[Python 3.6 or 3.7](https://www.python.org/downloads/) and [Pip3](https://pip.pypa.io/en/stable/installation/) are required for the *Azure IoT Edge Tool*. Install the prerequisites first if needed.

```bash
pip3 install iotedgedev
```

> [!NOTE]
>
> If you have multiple Python versions, including pre-installed Python 2.7 (for example, on Ubuntu or macOS), make sure you use `pip3` to install *IoT Edge Dev Tool (iotedgedev)*.
>
> For more information setting up your development machine, see [iotedgedev development setup](https://github.com/Azure/iotedgedev/blob/main/docs/environment-setup/manual-dev-machine-setup.md).

To stay current on the testing environment for IoT Edge, see the [test-coverage](https://github.com/Azure/iotedgedev/blob/main/docs/test-coverage.md) list.

::: zone-end

::: zone pivot="iotedge-dev-ext"

Use the IoT extensions for Visual Studio Code to develop IoT Edge modules. These extensions offer project templates, automate the creation of the deployment manifest, and allow you to monitor and manage IoT Edge devices. In this section, you install Visual Studio Code and the IoT extension, then set up your Azure account to manage IoT Hub resources from within Visual Studio Code.

1. Install [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension.

1. Install [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension.

1. After you install extensions, open the command palette by selecting **View** > **Command Palette**.

1. In the command palette again, search for and select **Azure IoT Hub: Select IoT Hub**. Follow the prompts to select your Azure subscription and IoT Hub.

1. Open the explorer section of Visual Studio Code by either selecting the icon in the activity bar on the left, or by selecting **View** > **Explorer**.

1. At the bottom of the explorer section, expand the collapsed **Azure IoT Hub / Devices** menu. You should see the devices and IoT Edge devices associated with the IoT Hub that you selected through the command palette.

   :::image type="content" source="./media/tutorial-develop-for-linux/view-iot-hub-devices.png" alt-text="Screenshot that shows your devices in the Azure I o T Hub section of the Explorer menu.":::

::: zone-end

### Language specific tools

Install tools specific to the language you're developing in:

# [C\# / Azure Functions](#tab/csharp+azfunctions)

- Install [.NET Core SDK](https://dotnet.microsoft.com/download)
- Install [C# Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

# [C](#tab/c)

- Install [C/C++ Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

# [Java](#tab/java)

- Install [Java SE Development Kit 10](/azure/developer/java/fundamentals/java-support-on-azure) and [Maven](https://maven.apache.org/). You need to [set the `JAVA_HOME` environment variable](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) to point to your JDK installation.
- Install [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

# [Node.js](#tab/node)

- Install [Node.js](https://nodejs.org).
- Install [Yeoman](https://www.npmjs.com/package/yo)
- Install [Azure IoT Edge Node.js Module Generator](https://www.npmjs.com/package/generator-azure-iot-edge-module).

# [Python](#tab/python)

- Install [Python](https://www.python.org/downloads/) and [Pip](https://pip.pypa.io/en/stable/installation/).
- Install the [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python).

---

[!INCLUDE [iot-edge-create-container-registry](includes/iot-edge-create-container-registry.md)]

## Create a new module project

The Azure IoT Edge extension offers project templates for all supported IoT Edge module languages in Visual Studio Code. These templates have all the files and code that you need to deploy a working module to test IoT Edge, or give you a starting point to customize the template with your own business logic.

### Create a project template

::: zone pivot="iotedge-dev-cli"

The [IoT Edge Dev Tool](https://github.com/Azure/iotedgedev) simplifies Azure IoT Edge development to simple commands driven by environment variables. It gets you started with IoT Edge development with the IoT Edge Dev Container and IoT Edge solution scaffolding that contains a default module and all the required configuration files.

1. Create a directory for your solution with the filepath of your choice. Change into your `iotedgesolution` directory.

    ```bash
    mkdir c:\dev\iotedgesolution
    ```

1. Use the **iotedgedev solution init** command to create a solution and set up your Azure IoT Hub in the development language of your choice.

    # [C\#](#tab/csharp)
    
    ```bash
    iotedgedev solution init --template csharp
    ```
    
    The solution includes a default C# module named *filtermodule*.
    
    # [Azure Functions](#tab/azfunctions)
    
    ```bash
    iotedgedev solution init --template csharpfunction
    ```

    # [C](#tab/c)
    
    ```bash
    iotedgedev solution init --template c
    ```

    # [Java](#tab/java)
    
    ```bash
    iotedgedev solution init --template java
    ```

    # [Node.js](#tab/node)

    ```bash
    iotedgedev solution init --template nodejs
    ```

    # [Python](#tab/python)

    ```bash
    iotedgedev solution init --template python
    ```

    ---

The *iotedgedev solution init* script prompts you to complete several steps including:

* Authenticate to Azure
* Choose an Azure subscription
* Choose or create a resource group
* Choose or create an Azure IoT Hub
* Choose or create an Azure IoT Edge device

After solution creation, these main files are in the solution:

- A **.vscode** folder contains configuration file launch.json.
- A **modules** folder that has subfolders for each module. Within the subfolder for each module, the module.json file controls how modules are built and deployed.
- An **.env** file lists your environment variables. The environment variable for the container registry is *localhost:5000* by default. If Azure Container Registry is your registry, set an Azure Container Registry username and password. Get these values from your container registry's **Settings** > **Access keys** menu in the Azure portal. The **CONTAINER_REGISTRY_SERVER** is the **Login server** of your registry.

   For example:

    ```env
    CONTAINER_REGISTRY_SERVER="myacr.azurecr.io"
    CONTAINER_REGISTRY_USERNAME="myacr"
    CONTAINER_REGISTRY_PASSWORD="<registry_password>"
    ```

   In production scenarios, you should use service principals to provide access to your container registry instead of the *.env* file. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

    > [!NOTE]
    > The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables.

- Two module deployment files named **deployment.template.json** and **deployment.debug.template.json** list the modules to deploy to your device. By default, the list includes the IoT Edge system modules (edgeAgent and edgeHub) and sample modules such as:
    - **filtermodule** is a sample module that implements a simple filter function.
    - **SimulatedTemperatureSensor** module that simulates data you can use for testing. For more information about how deployment manifests work, see [Learn how to use deployment manifests to deploy modules and establish routes](module-composition.md). For more information on how the simulated temperature module works, see the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).
   
   > [!NOTE]
   > The exact modules installed may depend on your language of choice.

::: zone-end

::: zone pivot="iotedge-dev-ext"

Use Visual Studio Code and the [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules.

1. Select **View** > **Command Palette**.
1. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge Solution**.

   :::image type="content" source="./media/how-to-develop-csharp-module/new-solution.png" alt-text="Screenshot of how to run a new IoT Edge solution." lightbox="./media/how-to-develop-csharp-module/new-solution.png":::

1. Browse to the folder where you want to create the new solution and then select **Select folder**.
1. Enter a name for your solution.
1. Select a module template for your preferred development language to be the first module in the solution.
1. Enter a name for your module. Choose a name that's unique within your container registry.
1. Provide the name of the module's image repository. Visual Studio Code autopopulates the module name with **localhost:5000/<your module name\>**. Replace it with your own registry information. Use **localhost** if you use a local Docker registry for testing. If you use Azure Container Registry, then use **Login server** from your registry's settings. The sign-in server looks like **_\<registry name\>_.azurecr.io**. Only replace the **localhost:5000** part of the string so that the final result looks like **\<*registry name*\>.azurecr.io/_\<your module name\>_**.

   :::image type="content" source="./media/how-to-develop-csharp-module/repository.png" alt-text="Screenshot of how to provide a Docker image repository." lightbox="./media/how-to-develop-csharp-module/repository.png":::

Visual Studio Code takes the information you provided, creates an IoT Edge solution, and then loads it in a new window.

There are four items within the solution:

- A **.vscode** folder contains debug configurations.
- A **modules** folder has subfolders for each module. Within the folder for each module, there's a file called **module.json** that controls how modules are built and deployed. You need to modify this file to change the module deployment container registry from a localhost to a remote registry. At this point, you only have one module. But you can add more if needed.
- An **.env** file lists your environment variables. The environment variable for the container registry is *localhost* by default. If Azure Container Registry is your registry, set an Azure Container Registry username and password. Get these values from your container registry's **Settings** > **Access keys** menu in the Azure portal. The **CONTAINER_REGISTRY_SERVER** is the **Login server** of your registry.

For example:

  ```env
  CONTAINER_REGISTRY_SERVER="myacr.azurecr.io"
  CONTAINER_REGISTRY_USERNAME="myacr"
  CONTAINER_REGISTRY_PASSWORD="<my_acr_password>"
  ```

  In production scenarios, you should use service principals to provide access to your container registry instead of the *.env* file. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

  > [!NOTE]
  > The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables.

- Two module deployment files named **deployment.template.json** and **deployment.debug.template** list the modules to deploy to your device. By default, the list includes the IoT Edge system modules and sample modules including the **SimulatedTemperatureSensor** module that simulates data you can use for testing. 

   For more information about deployment manifests, see [Learn how to use deployment manifests to deploy modules and establish routes](module-composition.md). For more information about the simulated temperature module, see the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

::: zone-end

After solution creation, take a moment to familiarize yourself with the files that it created:

* The **.vscode** folder contains a file called **launch.json**, which you use for debugging modules.
* The **modules** folder contains a folder for each module in your solution. Right now, that should only be **SampleModule**, or whatever name you gave to the module. The SampleModule folder contains the main program code, the module metadata, and several Docker files.
* The **.env** file holds the credentials to your container registry. Your IoT Edge device also has access to these credentials so it can pull the container images.
* The **deployment.debug.template.json** file and **deployment.template.json** file are templates that help you create a deployment manifest. A *deployment manifest* is a file that defines exactly which modules you want deployed on a device. The manifest also determines how you want to configure the modules and how they communicate with each other and the cloud. The template files use pointers for some values. When you transform the template into a true deployment manifest, the pointers replace values taken from other solution files. 
* Open the **deployment.template.json** file and locate two common placeholders:
  * In the `registryCredentials` section, the auto-filled address has information you provided when you created the solution. However, the username and password reference the variables stored in the .env file. This configuration is for security, as the .env file is git ignored, but the deployment template isn't.
  * In the `SampleModule` section, the container image isn't auto-filled even though you provided the image repository when you created the solution. This placeholder points to the **module.json** file inside the SampleModule folder. If you go to that file, you see that the image field does contain the repository, but also a tag value that contains the version and the platform of the container. You can iterate the version manually as part of your development cycle, and you select the container platform using a switcher that we introduce later in this section.

::: zone pivot="iotedge-dev-cli"

### Set IoT Edge runtime version

The latest stable IoT Edge system module version is 1.4. Set your system modules to version 1.4.

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

### Provide your registry credentials to the IoT Edge agent

The environment file stores the credentials for your container registry and shares them with the IoT Edge runtime. The runtime needs these credentials to pull your container images onto the IoT Edge device.

>[!NOTE]
>If you didn't replace the **localhost:5000** value with the login server value from your Azure container registry, in the [**Create a project template**](#create-a-project-template) step, the **.env** file and the `registryCredentials` section of the deployment manifest will be missing. If that section is missing, return to the **Provide Docker image repository for the module** step in the **Create a project template** section to see how to replace the **localhost:5000** value.

The IoT Edge extension tries to pull your container registry credentials from Azure and populate them in the environment file. Check to see if your credentials exist. If not, add them now:

1. Open the **.env** file in your module solution.
2. Add the **username** and **password** values that you copied from your Azure container registry.
3. Save your changes to the .env file.

>[!NOTE]
>This tutorial uses admin login credentials for Azure Container Registry, which are convenient for development and test scenarios. When you're ready for production scenarios, we recommend a least-privilege authentication option like service principals or repository-scoped tokens. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

### Select your target architecture

Currently, Visual Studio Code can develop C# modules for Linux AMD64 and ARM32v7 devices. You need to select which architecture you're targeting with each solution, because that affects how the container is built and runs. The default is Linux AMD64.

1. Open the command palette and search for **Azure IoT Edge: Set Default Target Platform for Edge Solution**, or select the shortcut icon at the bottom of the window.

   :::image type="content" source="./media/tutorial-develop-for-linux/select-architecture.png" alt-text="Screenshot showing the location of the architecture icon at the bottom of the Visual Studio Code window." lightbox="./media/tutorial-develop-for-linux/select-architecture.png":::

2. In the command palette, select the target architecture from the list of options. For this tutorial, we're using an Ubuntu virtual machine as the IoT Edge device, so will keep the default **amd64**.

### Review the sample code

The solution template that you created includes sample code for an IoT Edge module. This sample module simply receives messages and then passes them on. The pipeline functionality demonstrates an important concept in IoT Edge, which is how modules communicate with each other.

Each module can have multiple *input* and *output* queues declared in their code. The IoT Edge hub running on the device routes messages from the output of one module into the input of one or more modules. The specific code for declaring inputs and outputs varies between languages, but the concept is the same across all modules. For more information about routing between modules, see [Declare routes](module-composition.md#declare-routes).

The sample C# code that comes with the project template uses the [ModuleClient Class](/dotnet/api/microsoft.azure.devices.client.moduleclient) from the IoT Hub SDK for .NET.

1. Open the **ModuleBackgroundService.cs** file, which is inside the **modules/SampleModule/** folder.

2. In **ModuleBackgroundService.cs**, find the **SetInputMessageHandlerAsync** method.

   The [SetInputMessageHandlerAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.setinputmessagehandlerasync) method sets up an input queue to receive incoming messages. Review this method and see how it initializes an input queue called **input1**.

   :::image type="content" source="./media/tutorial-develop-for-linux/declare-input-queue.png" alt-text="Screenshot showing where to find the input name in the SetInputMessageCallback constructor." lightbox="./media/tutorial-develop-for-linux/declare-input-queue.png":::

4. Next, find the **SendEventAsync** method.

   The [SendEventAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.sendeventasync) method processes received messages and sets up an output queue to pass them along. Review this method and see that it initializes an output queue called **output1**.

   :::image type="content" source="./media/tutorial-develop-for-linux/declare-output-queue.png" alt-text="Screenshot showing where to find the output name in SendEventAsync method." lightbox="./media/tutorial-develop-for-linux/declare-output-queue.png":::

6. Open the **deployment.template.json** file.

7. Find the **modules** property nested in **$edgeAgent**.

   There should be two modules listed here. One is the **SimulatedTemperatureSensor** module, which is included in all the templates by default to provide simulated temperature data that you can use to test your modules. The other is the **SampleModule** module that you created as part of this solution.

8. At the bottom of the file, find **properties.desired** within the **$edgeHub** module.

   One of the functions of the IoT Edge hub module is to route messages between all the modules in a deployment. Review the values in the **routes** property. One route, **SampleModuleToIoTHub**, uses a wildcard character (**\***) to indicate any messages coming from any output queues in the SampleModule module. These messages go into *$upstream*, which is a reserved name that indicates IoT Hub. The other route, **sensorToSampleModule**, takes messages coming from the SimulatedTemperatureSensor module and routes them to the *input1* input queue that you saw initialized in the SampleModule code.

   :::image type="content" source="./media/tutorial-develop-for-linux/deployment-routes.png" alt-text="Screenshot showing routes in the deployment.template.json file." lightbox="./media/tutorial-develop-for-linux/deployment-routes.png":::

## Build and push your solution

You've reviewed the module code and the deployment template to understand some key deployment concepts. Now, you're ready to build the SampleModule container image and push it to your container registry. With the IoT tools extension for Visual Studio Code, this step also generates the deployment manifest based on the information in the template file and the module information from the solution files.

### Sign in to Docker

Provide your container registry credentials to Docker so that it can push your container image to storage in the registry.

1. Open the Visual Studio Code integrated terminal by selecting **Terminal** > **New Terminal** or `Ctrl` + `Shift` + **`** (backtick).

2. Sign in to Docker with the Azure Container Registry (ACR) credentials that you saved after creating the registry.

   ```cmd/sh
   docker login -u <ACR username> -p <ACR password> <ACR login server>
   ```

   You may receive a security warning recommending the use of `--password-stdin`. While that is a recommended best practice for production scenarios, it's outside the scope of this tutorial. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/#provide-a-password-using-stdin) reference.

3. Sign in to the Azure Container Registry. You may need to [Install Azure CLI](/cli/azure/install-azure-cli) to use the `az` command. This command asks for your user name and password found in your container registry in **Settings** > **Access keys**.

   ```azurecli
   az acr login -n <ACR registry name>
   ```
>[!TIP]
>If you get logged out at any point in this tutorial, repeat the Docker and Azure Container Registry sign in steps to continue.

### Build and push

Visual Studio Code now has access to your container registry, so it's time to turn the solution code into a container image.

1. In the Visual Studio Code explorer, right-click the **deployment.template.json** file and select **Build and Push IoT Edge Solution**.

   :::image type="content" source="./media/tutorial-develop-for-linux/build-and-push-modules.png" alt-text="Screenshot showing the right-click menu option Build and Push I o T Edge Solution." lightbox="./media/tutorial-develop-for-linux/build-and-push-modules.png":::

   The build and push command starts three operations. First, it creates a new folder in the solution called **config** that holds the full deployment manifest, built out of information in the deployment template and other solution files. Second, it runs `docker build` to build the container image based on the appropriate dockerfile for your target architecture. Then, it runs `docker push` to push the image repository to your container registry.

   This process may take several minutes the first time, but is faster the next time that you run the commands.

2. Open the **deployment.amd64.json** file in newly created config folder. The filename reflects the target architecture, so it's different if you chose a different architecture.

3. Notice that the two parameters that had placeholders now contain their proper values. The **registryCredentials** section has your registry username and password pulled from the .env file. The **SampleModule** has the full image repository with the name, version, and architecture tag from the module.json file.

4. Open the **module.json** file in the SampleModule folder.

5. Change the version number for the module image. (The version, not the $schema-version.) For example, increment the patch version number to **0.0.2** just like if you made a small fix in the module code.

   >[!TIP]
   >Module versions enable version control, and allow you to test changes on a small set of devices before deploying updates to production. If you don't increment the module version before building and pushing, then you overwrite the repository in your container registry.

6. Save your changes to the module.json file.

7. Right-click the **deployment.template.json** file again, and again select **Build and Push IoT Edge Solution**.

8. Open the **deployment.amd64.json** file again. Notice the build system doesn't create a new file when you run the build and push command again. Rather, the same file updates to reflect the changes. The SampleModule image now points to the 0.0.2 version of the container.

9. To further verify what the build and push command did, go to the [Azure portal](https://portal.azure.com) and navigate to your container registry.

10. In your container registry, select **Repositories** then **samplemodule**. Verify that both versions of the image push to the registry.

   :::image type="content" source="./media/tutorial-develop-for-linux/view-repository-versions.png" alt-text="Screenshot of where to view both image versions in your container registry." lightbox="./media/tutorial-develop-for-linux/view-repository-versions.png":::

<!--Alternative steps: Use Visual Studio Code Docker tools to view ACR images with tags-->

### Troubleshoot

If you encounter errors when building and pushing your module image, it often has to do with Docker configuration on your development machine. Use the following checks to review your configuration:

* Did you run the `docker login` command using the credentials that you copied from your container registry? These credentials are different than the ones that you use to sign in to Azure.
* Is your container repository correct? Does it have your correct container registry name and your correct module name? Open the **module.json** file in the SampleModule folder to check. The repository value should look like **\<registry name\>.azurecr.io/samplemodule**.
* If you used a different name than **SampleModule** for your module, is that name consistent throughout the solution?
* Is your machine running the same type of containers that you're building? This tutorial is for Linux IoT Edge devices, so Visual Studio Code should say **amd64** or **arm32v7** in the side bar, and Docker Desktop should be running Linux containers.

## Deploy modules to device

You verified that there are built container images stored in your container registry, so it's time to deploy them to a device. Make sure that your IoT Edge device is up and running.

1. In the Visual Studio Code explorer, under the **Azure IoT Hub** section, expand **Devices** to see your list of IoT devices.

2. Right-click the IoT Edge device that you want to deploy to, then select **Create Deployment for Single Device**.

   :::image type="content" source="./media/tutorial-develop-for-linux/create-deployment.png" alt-text="Screenshot showing how to create a deployment for a single device.":::

3. In the file explorer, navigate into the **config** folder then select the **deployment.amd64.json** file.

   Don't use the deployment.template.json file, which doesn't have the container registry credentials or module image values in it. If you target a Linux ARM32 device, the deployment manifest's name is **deployment.arm32v7.json**.

4. Under your device, expand **Modules** to see a list of deployed and running modules. Select the refresh button. You should see the new SimulatedTemperatureSensor and SampleModule modules running on your device.

   It may take a few minutes for the modules to start. The IoT Edge runtime needs to receive its new deployment manifest, pull down the module images from the container runtime, then start each new module.

   :::image type="content" source="./media/tutorial-develop-for-linux/view-running-modules.png" alt-text="Screenshot where to view modules running on your I o T Edge device.":::

## View messages from device

The SampleModule code receives messages through its input queue and passes them along through its output queue. The deployment manifest declared routes that passed messages to SampleModule from SimulatedTemperatureSensor, and then forwarded messages from SampleModule to IoT Hub. The Azure IoT Edge and Azure IoT Hub extensions allow you to see messages as they arrive at IoT Hub from your individual devices.

1. In the Visual Studio Code explorer, right-click the IoT Edge device that you want to monitor, then select **Start Monitoring Built-in Event Endpoint**.

2. Watch the output window in Visual Studio Code to see messages arriving at your IoT hub.

   :::image type="content" source="./media/tutorial-develop-for-linux/view-d2c-messages.png" alt-text="Screenshot showing where to view incoming device to cloud messages.":::

## View changes on device

If you want to see what's happening on your device itself, use the commands in this section to inspect the IoT Edge runtime and modules running on your device.

The commands in this section are for your IoT Edge device, not your development machine. If you're using a virtual machine for your IoT Edge device, connect to it now. In Azure, go to the virtual machine's overview page and select **Connect** to access the secure shell connection.

* View all modules deployed to your device, and check their status:

   ```bash
   iotedge list
   ```

   You should see four modules: the two IoT Edge runtime modules, SimulatedTemperatureSensor, and SampleModule. You should see all four listed as running.

* Inspect the logs for a specific module:

   ```bash
   iotedge logs <module name>
   ```

   IoT Edge modules are case-sensitive.

   The SimulatedTemperatureSensor and SampleModule logs should show the messages they're processing. The edgeAgent module is responsible for starting the other modules, so its logs have information about implementing the deployment manifest. If you find a module is unlisted or not running, the edgeAgent logs likely have the errors. The edgeHub module is responsible for communications between the modules and IoT Hub. If the modules are up and running, but the messages aren't arriving at your IoT hub, the edgeHub logs likely have the errors.

## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, you can delete the local configurations and the Azure resources that you used in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you set up Visual Studio Code on your development machine and deployed your first IoT Edge module from it. Now that you know the basic concepts, try adding functionality to a module so that it can analyze the data passing through it. Choose your preferred language:

> [!div class="nextstepaction"]
> [C](tutorial-c-module.md)
> [C#](tutorial-csharp-module.md)
> [Java](tutorial-java-module.md)
> [Node.js](tutorial-node-module.md)
> [Python](tutorial-python-module.md)
