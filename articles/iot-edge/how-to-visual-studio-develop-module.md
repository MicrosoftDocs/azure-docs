---
title: Develop and debug Azure IoT Edge modules using Visual Studio
description: Use Visual Studio to develop a custom IoT Edge module and deploy to an IoT device.
services: iot-edge
author: PatAltimore
ms.author: patricka
ms.date: 07/13/2023
ms.topic: conceptual
ms.service: iot-edge
zone_pivot_groups: iotedge-dev
---
# Use Visual Studio 2022 to develop and debug modules for Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article shows you how to use Visual Studio 2022 to develop, debug, and deploy custom Azure IoT Edge modules. Visual Studio 2022 provides templates for IoT Edge modules written in C and C#. The supported device architectures are Windows x64, Linux x64, ARM32, and ARM64 (preview). For more information about supported operating systems, languages, and architectures, see [Language and architecture support](module-development.md#language-and-architecture-support).

You can choose either the **Azure IoT Edge Dev Tool** CLI or the **Azure IoT Edge tools for Visual Studio** extension as your IoT Edge development tool. Use the tool selector button at the beginning to choose your tool option for this article. Both tools provide the following benefits:

* Create, edit, build, run, and debug IoT Edge solutions and modules on your local development computer.
* Code your Azure IoT modules in C or C# with the benefits of Visual Studio development.
* Deploy your IoT Edge solution to an IoT Edge device via Azure IoT Hub.

## Prerequisites

This article assumes that you use a machine running Windows as your development machine. 

* Install or modify Visual Studio 2022 on your development machine. Choose the **Azure development** and **Desktop development with C++** workloads options.

<!-- ::: zone pivot="iotedge-dev-ext" -->

* Install the Azure IoT Edge Tools either from the Marketplace or from Visual Studio:

    * Download and install [Azure IoT Edge Tools](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs17iotedgetools) from the Visual Studio Marketplace.
    * Or, in Visual Studio go to **Extensions > Manage Extensions**. The **Manage Extensions** popup opens. In the search box in the upper right, add the text **Azure IoT Edge Tools for VS 2022**, then select **Download**. Close the popup when finished.

    You may have to restart Visual Studio.

   > [!TIP]
   > If you are using Visual Studio 2019, download and install [Azure IoT Edge Tools for VS 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools) from the Visual Studio marketplace

<!-- >::: zone-end

::: zone pivot="iotedge-dev-cli" -->

* Install the Python-based [Azure IoT Edge Dev Tool](https://pypi.org/project/iotedgedev/) in order to set up your local development environment to debug, run, and test your IoT Edge solution. If you haven't already done so, install [Python (3.6/3.7/3.8) and Pip3](https://www.python.org/) and then install the IoT Edge Dev Tool (iotedgedev) by running this command in your terminal.

    ```cmd
    pip3 install iotedgedev
    ```

    > [!NOTE]
    >
    > If you have multiple Python including pre-installed Python 2.7 (for example, on Ubuntu or macOS), make sure you are using `pip3` to install *IoT Edge Dev Tool (iotedgedev)*.
    >
    > For more information setting up your development machine, see [iotedgedev development setup](https://github.com/Azure/iotedgedev/blob/main/docs/environment-setup/manual-dev-machine-setup.md).

<!-- ::: zone-end -->

* Install the **Vcpkg** library manager

  ```cmd
  git clone https://github.com/Microsoft/vcpkg
  cd vcpkg
  bootstrap-vcpkg.bat
  ```

  Install the **azure-iot-sdk-c** package for Windows
  ```cmd
  vcpkg.exe install azure-iot-sdk-c:x64-windows
  vcpkg.exe --triplet x64-windows integrate install
  ```

* Download and install a [Docker compatible container management system](support.md#container-engines) on your development machine to build and run your module images. For example, install [Docker Community Edition](https://docs.docker.com/install/).
* To develop modules with **Linux containers**, use a Windows computer that meets the [requirements for Docker Desktop](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

* Create an [Azure Container Registry](../container-registry/index.yml) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags) to store your module images.

  > [!TIP]
  > You can use a local Docker registry for prototype and testing purposes instead of a cloud registry.

* Install the [Azure CLI](/cli/azure/install-azure-cli).

* To test your module on a device, you need an active IoT Hub with at least one IoT Edge device. To create an IoT Edge device for testing, you can create one in the Azure portal or with the CLI:

    * Creating one in the [Azure portal](https://portal.azure.com/) is the quickest. From the Azure portal, go to your IoT Hub resource. Select **Devices** under the **Device management** menu and then select **Add Device**.

       In **Create a device**,name your device using **Device ID**, check **IoT Edge Device**, then select **Save** in the lower left. 
    
        Finally, confirm that your new device exists in your IoT Hub, from the **Device management > Devices** menu. For more information on creating an IoT Edge device through the Azure portal, read [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md).

    * To create an IoT Edge device with the CLI, follow the steps in the quickstart for [Linux](quickstart-linux.md#register-an-iot-edge-device) or [Windows](quickstart.md#register-an-iot-edge-device). In the process of registering an IoT Edge device, you create an IoT Edge device.

   If you're running the IoT Edge daemon on your development machine, you might need to stop EdgeHub and EdgeAgent before you start development in Visual Studio.

## Create an Azure IoT Edge project

The IoT Edge project template in Visual Studio creates a solution to deploy to IoT Edge devices. First, you create an Azure IoT Edge solution. Then, you create a module in that solution. Each IoT Edge solution can contain more than one module.

In our solution, we're going to build three projects. The main module that contains *EdgeAgent* and *EdgeHub*, in addition to the temperature sensor module. Next, you add two more IoT Edge modules.

> [!IMPORTANT]
> The IoT Edge project structure created by Visual Studio isn't the same as the one in Visual Studio Code.
>
> Currently, the Azure IoT Edge Dev Tool CLI doesn't support creating the Visual Studio project type. You need to use the Visual Studio IoT Edge extension to create the Visual Studio project.

1. In Visual Studio, create a new project.

1. In **Create a new project**, search for **Azure IoT Edge**. Select the project that matches the platform and architecture for your IoT Edge device, and select **Next**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/create-new-project.png" alt-text="Create New Project":::

1. In **Configure your new project**, enter a name for your project, specify the location, and select **Create**.

1. In **Add Module**, select the type of module you want to develop. If you have an existing module you want to add to your deployment, select **Existing module**.
1. In **Module Name**, enter a name for your module. Choose a name that's unique within your container registry.
1. In **Repository Url**, provide the name of the module's image repository. Visual Studio autopopulates the module name with **localhost:5000/<your module name\>**. Replace it with your own registry information. Use **localhost** if you use a local Docker registry for testing. If you use Azure Container Registry, then use the login server from your registry's settings. The login server looks like **_\<registry name\>_.azurecr.io**. Only replace the **localhost:5000** part of the string so that the final result looks like **\<*registry name*\>.azurecr.io/_\<your module name\>_**.

1. Select **Add** to add your module to the project.

   :::image type="content" source="./media/how-to-visual-studio-develop-csharp-module/add-module.png" alt-text="Screenshot of how to add Application and Module.":::

   > [!NOTE]
   >If you have an existing IoT Edge project, you can change the repository URL by opening the **module.json** file. The repository URL is located in the *repository* property of the JSON file.

Now, you have an IoT Edge project and an IoT Edge module in your Visual Studio solution.

### Project structure

In your solution, there are two project level folders including a main project folder and a single module folder. For example, you may have a main project folder named *AzureIotEdgeApp1* and a module folder named *IotEdgeModule1*. The main project folder contains your deployment manifest.

The module project folder contains a file for your module code named either `Program.cs` or `main.c` depending on the language you chose. This folder also contains a file named `module.json` that describes the metadata of your module. Various Docker files included here provide the information needed to build your module as a Windows or Linux container.

### Deployment manifest of your project

The deployment manifest you edit is named `deployment.debug.template.json`. This file is a template of an IoT Edge deployment manifest that defines all the modules that run on a device along with how they communicate with each other. For more information about deployment manifests, see [Learn how to deploy modules and establish routes](module-composition.md). 

If you open this deployment template, you see that the two runtime modules, **edgeAgent** and **edgeHub** are included, along with the custom module that you created in this Visual Studio project. A fourth module named **SimulatedTemperatureSensor** is also included. This default module generates simulated data that you can use to test your modules, or delete if it's not necessary. To see how the simulated temperature sensor works, view the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

### Set IoT Edge runtime version

Currently, the latest stable runtime version is 1.4. You should update the IoT Edge runtime version to the latest stable release or the version you want to target for your devices.

::: zone pivot="iotedge-dev-ext"

1. In the Solution Explorer, right-click the name of your main project and select **Set IoT Edge runtime version**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/set-iot-edge-runtime-version.png" alt-text="Screenshot of how to find and select the menu item named 'Set IoT Edge Runtime version'.":::

1. Use the drop-down menu to choose the runtime version that your IoT Edge devices are running, then select **OK** to save your changes. If no change was made, select **Cancel** to exit.

    Currently, the extension doesn't include a selection for the latest runtime versions. If you want to set the runtime version higher than 1.2, open *deployment.debug.template.json* deployment manifest file. Change the runtime version for the system runtime module images *edgeAgent* and *edgeHub*. For example, if you want to use the IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

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
    
1. If you changed the version, regenerate your deployment manifest by right-clicking the name of your project and select **Generate deployment for IoT Edge**. This generates a deployment manifest based on your deployment template and appears in the **config** folder of your Visual Studio project.

::: zone-end

::: zone pivot="iotedge-dev-cli"

1. In Visual Studio Code, open *deployment.debug.template.json* deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) is a JSON document that describes the modules to be configured on the targeted IoT Edge device.
1. Change the runtime version for the system runtime module images *edgeAgent* and *edgeHub*. For example, if you want to use the IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

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

## Module infrastructure & development options

When you add a new module, it comes with default code that is ready to be built and deployed to a device so that you can start testing without touching any code. The module code is located within the module folder in a file named `Program.cs` (for C#) or `main.c` (for C).

The default solution is built so that the simulated data from the **SimulatedTemperatureSensor** module is routed to your module, which takes the input and then sends it to IoT Hub.

When you're ready to customize the module template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability.

::: zone pivot="iotedge-dev-ext"

## Debug using the simulator

The Azure IoT EdgeHub Dev Tool provides a local development and debug experience. The tool helps start IoT Edge modules without the IoT Edge runtime so that you can create, develop, test, run, and debug IoT Edge modules and solutions locally. You don't have to push images to a container registry and deploy them to a device for testing.

For more information, see [Azure IoT EdgeHub Dev Tool](https://pypi.org/project/iotedgehubdev/).

To initialize the tool in Visual Studio:

1. Retrieve the connection string of your IoT Edge device (found in your IoT Hub) from the [Azure portal](https://portal.azure.com/) or from the Azure CLI. 

    If using the CLI to retrieve your connection string, use this command, replacing "**[device_id]**" and "**[hub_name]**" with your own values:

    ```Azure CLI
    az iot hub device-identity connection-string show --device-id [device_id] --hub-name [hub_name]
    ```

1. From the **Tools** menu in Visual Studio, select **Azure IoT Edge Tools** > **Setup IoT Edge Simulator**.

1. Paste the connection string and select **OK**.

> [!NOTE]
> You need to follow these steps only once on your development computer as the results are automatically applied to all subsequent Azure IoT Edge solutions. This procedure can be followed again if you need to change to a different connection string.

### Build and debug a single module

Typically, you want to test and debug each module before running it within an entire solution with multiple modules. The IoT Edge simulator tool allows you to run a single module in isolation a send messages over port 53000.

1. In **Solution Explorer**, select and highlight the module project folder (for example, *IotEdgeModule1*). Set the custom module as the startup project. Select **Project** > **Set as StartUp Project** from the menu.

1. Press **F5** or select the run toolbar button to start the IoT Edge simulator for a single module. It may take 10 to 20 seconds the initially.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/run-module.png" alt-text="Screenshot of how to run a module.":::

1. You should see a .NET Core console app window appear if the module has been initialized successfully.

1. Set a breakpoint to inspect the module.

   * If developing in C#, set a breakpoint in the `PipeMessage()` function in **ModuleBackgroundService.cs**.
   * If using C, set a breakpoint in the `InputQueue1Callback()` function in **main.c**.

1. Test the module by sending a message. When debugging a single module, the simulator listens on the default port 53000 for messages. To send a message to your module, run the following curl command from a command shell like **Git Bash** or **WSL Bash**.

   ```bash
   curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
   ```
   If you get the error *unmatched close brace/bracket in URL*, try the following command instead:
   
   ```bash
   curl --header "Content-Type: application/json" --request POST --data "{\"inputName\": \"input1\", \"data\", \"hello world\"}"  http://localhost:53000/api/v1/messages
   ```
  
   :::image type="content" source="./media/how-to-visual-studio-develop-csharp-module/debug-single-module.png" alt-text="Screenshot of the output console, Visual Studio project, and Bash window." lightbox="./media/how-to-visual-studio-develop-csharp-module/debug-single-module.png":::

   The breakpoint should be triggered. You can watch variables in the Visual Studio **Locals** window, found when the debugger is running. Go to **Debug** > **Windows** > **Locals**.

   In your Bash or shell, you should see a `{"message":"accepted"}` confirmation.

      In your .NET console you should see:
    
      ```dotnetcli
      IoT Hub module client initialized.
      Received message: 1, Body: [hello world]
      ```

   > [!TIP]
   > You can also use [PostMan](https://www.getpostman.com/) or other API tools to send messages instead of `curl`.

1. Press **Ctrl + F5** or select the stop button to stop debugging.

### Build and debug multiple modules

After you're done developing a single module, you might want to run and debug an entire solution with multiple modules. The IoT Edge simulator tool allows you to run all modules defined in the deployment manifest including a simulated edgeHub for message routing. In this example, you run two custom modules and the simulated temperature sensor module. Messages from the simulated temperature sensor module are routed to each custom module.

1. In **Solution Explorer**, add a second module to the solution by right-clicking the main project folder. On the menu, select **Add** > **New IoT Edge Module**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/add-new-module.png" alt-text="Screenshot of how to add a 'New IoT Edge Module' from the menu." lightbox="./media/how-to-visual-studio-develop-module/add-new-module.png":::

1. In the `Add module` window give your new module a name and replace the `localhost:5000` portion of the repository URL with your Azure Container Registry login server, like you did before.

1. Open the file `deployment.debug.template.json` to see that the new module has been added in the **modules** section. A new route was also added to the **routes** section in `EdgeHub` to send messages from the new module to IoT Hub. To send data from the simulated temperature sensor to the new module, add another route with the following line of `JSON`. Replace `<NewModuleName>` (in two places) with your own module name.

    ```json
   "sensorTo<NewModuleName>": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/<NewModuleName>/inputs/input1\")"
    ```

1. Right-click the main project (for example, *AzureIotEdgeApp1*) and select **Set as StartUp Project**. By setting the main project as the startup project, all modules in the solution run. This includes both modules you added to the solution, the simulated temperature sensor module, and the simulated Edge hub.

1. Press **F5** or select the run toolbar button to run the solution. It may take 10 to 20 seconds initially. Be sure you don't have other Docker containers running that might bind the port you need for this project.

1. You should see two .NET Core console app windows appear one for each module.

1. Set a breakpoint to inspect the modules.

   * If developing in C#, set a breakpoint in the `PipeMessage()` function in **ModuleBackgroundService.cs**.
   * If using C, set a breakpoint in the `InputQueue1Callback()` function in **main.c**.

1. Create breakpoints in each module and then press **F5** to run and debug multiple modules simultaneously. You should see multiple .NET Core console app windows, with each window representing a different module.

   :::image type="content" source="./media/how-to-visual-studio-develop-csharp-module/debug-multiple-modules.png" alt-text="Screenshot of Visual Studio with two output consoles.":::

1. Press **Ctrl + F5** or select the stop button to stop debugging.

## Build and push images to registry

Once you've developed and debugged your module, you can build and push the module image to your Azure Container Registry. You can then deploy the module to your IoT Edge device.

1. Set the main IoT Edge project as the start-up project, not one of the individual modules.
1. Select either **Debug** or **Release** as the configuration to build for your module images.

    > [!NOTE]
    > When choosing **Debug**, Visual Studio uses `Dockerfile.(amd64|windows-amd64).debug` to build Docker images. This includes the .NET Core command-line debugger VSDBG in your container image while building it. For production-ready IoT Edge modules, we recommend that you use the **Release** configuration, which uses `Dockerfile.(amd64|windows-amd64)` without VSDBG.

1. If you're using a private registry like Azure Container Registry (ACR), use the following Docker command to sign in to it.  You can get the username and password from the **Access keys** page of your registry in the Azure portal. 

    ```cmd
    docker login <ACR login server>
    ```

1. Let's add the Azure Container Registry login information to the runtime settings found in the file `deployment.debug.template.json`. There are two ways to do this. You can either add your registry credentials to your `.env` file (most secure) or add them directly to your `deployment.debug.template.json` file.

   **Add credentials to your `.env` file:**

   In **Solution Explorer**, select the **Show All Files** toolbar button. The `.env` file appears. Add your Azure Container Registry username and password to your `.env` file. These credentials can be found on the **Access Keys** page of your Azure Container Registry in the Azure portal.
      
   :::image type="content" source="./media/how-to-visual-studio-develop-module/show-env-file.png" alt-text="Screenshot of button that shows all files in the Solution Explorer.":::

   ```env
       DEFAULT_RT_IMAGE=1.2
       CONTAINER_REGISTRY_USERNAME_myregistry=<my-registry-name>
       CONTAINER_REGISTRY_PASSWORD_myregistry=<my-registry-password>
   ```

   **Add credentials directly to deployment.debug.template.json**

   If you'd rather add your credentials directly to your deployment template, replace the placeholders with your ACR admin username, password, and registry name.

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

1. If you're using a local registry, you can [run a local registry](https://docs.docker.com/registry/deploying/#run-a-local-registry).

1. Finally, in the **Solution Explorer**, right-click the main project folder and select **Build and Push IoT Edge Modules** to build and push the Docker image for each module. This might take a minute. When you see `Finished Build and Push IoT Edge Modules.` in your Output console of Visual Studio, you're done.

## Deploy the solution

Now that you've built and pushed your module images to your Azure Container Registry, you can deploy the solution to your IoT Edge device. You already have a deployment manifest template you've been observing throughout this tutorial. Let's generate a deployment manifest from that, then use an Azure CLI command to deploy your modules to your IoT Edge device in Azure.

1. Right-click on your main project in Visual Studio Solution Explorer and choose **Generate Deployment for IoT Edge**. 

   :::image type="content" source="./media/how-to-visual-studio-develop-module/generate-deployment.png" alt-text="Screenshot of location of the 'generate deployment' menu item.":::

1. Go to your local Visual Studio main project folder and look in the `config` folder. The file path might look like this: `C:\Users\<YOUR-USER-NAME>\source\repos\<YOUR-IOT-EDGE-PROJECT-NAME>\config`. Here you find the generated deployment manifest such as `deployment.amd64.debug.json`.

1. Check your `deployment.amd64.debug.json` file to confirm the `edgeHub` schema version is set to 1.2.

     ```json
      "$edgeHub": {
          "properties.desired": {
            "schemaVersion": "1.2",
            "routes": {
              "IotEdgeModule2022ToIoTHub": "FROM /messages/modules/IotEdgeModule2022/outputs/* INTO $upstream",
              "sensorToIotEdgeModule2022": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/IotEdgeModule2022/inputs/input1\")",
              "IotEdgeModule2022bToIoTHub": "FROM /messages/modules/IotEdgeModule2022b/outputs/* INTO $upstream"
            },
            "storeAndForwardConfiguration": {
              "timeToLiveSecs": 7200
            }
          }
        }
     ```
   > [!TIP]
   > The deployment template for Visual Studio 2022 requires the 1.2 schema version. If you need it to be 1.1 or 1.0, wait until after the deployment is generated (do not change it in `deployment.debug.template.json`). Generating a deployment will create a 1.2 schema by default. However, you can manually change `deployment.amd64.debug.json`, the generated manifest, if needed before deploying it to Azure.

   > [!IMPORTANT]
   > Once your IoT Edge device is deployed, it currently won't display correctly in the Azure portal with schema version 1.2 (version 1.1 will be fine). This is a known bug and will be fixed soon. However, this won't affect your device, as it's still connected in IoT Hub and can be communicated with at any time using the Azure CLI.
   >
   >:::image type="content" source="./media/how-to-publish-subscribe/unsupported-1.2-schema.png" alt-text="Screenshot of Azure portal error on the IoT Edge device page.":::

1. Now let's deploy our manifest with an Azure CLI command. Open the Visual Studio **Developer Command Prompt** and change to the **config** directory.

    ```cmd
        cd config
    ```

1. Deploy the manifest for your IoT Edge device to IoT Hub. The command configures the device to use modules developed in your solution. The deployment manifest was created in the previous step and stored in the **config** folder. From your **config** folder, execute the following deployment command. Replace the `[device id]`, `[hub name]`, and `[file path]` with your values. If the IoT Edge device ID doesn't exist in the IoT Hub, it must be created.

    ```cmd
        az iot edge set-modules --device-id [device id] --hub-name [hub name] --content [file path]
    ```

    For example, your command might look like this: 
    
    ```cmd
    az iot edge set-modules --device-id my-device-name --hub-name my-iot-hub-name --content deployment.amd64.debug.json
    ```

1. After running the command, you'll see a confirmation of deployment printed in `JSON` in your command prompt.
::: zone-end
<!--iotedgedev end-->

::: zone pivot="iotedge-dev-cli"

## Build module Docker image

Once you've developed your module, you can build the module image to store in a container registry for deployment to your IoT Edge device.

Use the module's Dockerfile to build the module Docker image.

```bash
docker build --rm -f "<DockerFilePath>" -t <ImageNameAndTag> "<ContextPath>" 
```

For example, let's assume your command shell is in your project directory and your module name is *IotEdgeModule1*. To build the image for the local registry or an Azure container registry, use the following commands:

```bash
# Build the image for the local registry

docker build --rm -f "./IotEdgeModule1/Dockerfile.amd64.debug" -t localhost:5000/iotedgemodule1:0.0.1-amd64 "./IotEdgeModule1"

# Or build the image for an Azure Container Registry

docker build --rm -f "./IotEdgeModule1/Dockerfile.amd64.debug" -t myacr.azurecr.io/iotedgemodule1:0.0.1-amd64 "./IotEdgeModule1"
```

## Push module Docker image

Push your module image to the local registry or a container registry.

`docker push <ImageName>`

For example:

```bash
# Push the Docker image to the local registry

docker push localhost:5000/iotedgemodule1:0.0.1-amd64

# Or push the Docker image to an Azure Container Registry
az acr login --name myacr
docker push myacr.azurecr.io/iotedgemodule1:0.0.1-amd64
```

## Deploy the module to the IoT Edge device.

In Visual Studio, open *deployment.debug.template.json* deployment manifest file in the main project. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) is a JSON document that describes the modules to be configured on the targeted IoT Edge device. Before deployment, you need to update your Azure Container Registry credentials, your module images, and the proper `createOptions` values. For more information about createOption values, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

1. If you're using an Azure Container Registry to store your module image, you need to add your credentials to **deployment.debug.template.json** in the *edgeAgent* settings. For example,

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

1. Replace the *image* property value with the module image name you pushed to the registry. For example, if you pushed an image tagged `myacr.azurecr.io/iotedgemodule1:0.0.1-amd64` for custom module *IotEdgeModule1*, replace the image property value with the tag value.

1. Add or replace the *createOptions* value with stringified content for each system and custom module in the deployment template.

    For example, the IotEdgeModule1's *image* and *createOptions* settings would be similar to the following:
    
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

Use the [IoT Edge Azure CLI set-modules](/cli/azure/iot/edge#az-iot-edge-set-modules) command to deploy the modules to the Azure IoT Hub. For example, to deploy the modules defined in the *deployment.debug.amd64.json* file to IoT Hub *my-iot-hub* for the IoT Edge device *my-device*, use the following command:

```azurecli
az iot edge set-modules --hub-name my-iot-hub --device-id my-device --content ./deployment.debug.template.json --login "HostName=my-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>"
```

> [!TIP]
> You can find your IoT Hub connection string in the Azure portal under Azure IoT Hub > **Security settings** > **Shared access policies**.
>

::: zone-end
<!--iotedgedev end-->

### Confirm the deployment to your device

To check that your IoT Edge modules were deployed to Azure, sign in to your device (or virtual machine), for example through SSH or Azure Bastion, and run the IoT Edge list command. 

```azurecli
   iotedge list
```

You should see a list of your modules running on your device or virtual machine.

```azurecli
   NAME                        STATUS           DESCRIPTION      CONFIG
   SimulatedTemperatureSensor  running          Up a minute      mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0
   edgeAgent                   running          Up a minute      mcr.microsoft.com/azureiotedge-agent:1.2
   edgeHub                     running          Up a minute      mcr.microsoft.com/azureiotedge-hub:1.2
   IotEdgeModule1              running          Up a minute      myacr.azurecr.io/iotedgemodule1:0.0.1-amd64.debug
   myIotEdgeModule2            running          Up a minute      myacr.azurecr.io/myiotedgemodule2:0.0.1-amd64.debug
```

## Debug using Docker Remote SSH

The Docker and Moby engines support SSH connections to containers allowing you to attach and debug code on a remote device using Visual Studio.

1. Connecting remotely to Docker requires root-level privileges. Follow the steps in [Manage docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall) to allow connection to the Docker daemon on the remote device. When you're finished debugging, you may want to remove your user from the Docker group.
1. Follow the steps to use Visual Studio to [Attach to a process running on a Docker container](/visualstudio/debugger/attach-to-process-running-in-docker-container) on your remote device.
1. In Visual Studio, set breakpoints in your custom module.
1. When a breakpoint is hit, you can inspect variables, step through code, and debug your module.

    :::image type="content" source="media/how-to-visual-studio-develop-module/vs-breakpoint.png" alt-text="Screenshot of Visual Studio attached to remote docker container on a device paused on a breakpoint.":::

## Next steps

* To develop custom modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

* To monitor the device-to-cloud (D2C) messages for a specific IoT Edge device, review the [Tutorial: Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md) to get started.
