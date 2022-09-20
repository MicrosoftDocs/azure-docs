---
title: Develop and debug modules in Visual Studio - Azure IoT Edge
description: Use Visual Studio with Azure IoT Tools to develop a C or C# IoT Edge module and push it from your IoT Hub to an IoT device, as configured by a deployment manifest.
services: iot-edge
author: PatAltimore
manager: lizross
ms.author: patricka
ms.date: 08/24/2021
ms.topic: conceptual
ms.service: iot-edge
---
# Use Visual Studio 2022 to develop and debug modules for Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

This article shows you how to use Visual Studio 2022 to develop and debug Azure IoT Edge modules.

The **Azure IoT Edge Tools for Visual Studio** extension provides the following benefits:

* Create, edit, build, run, and debug IoT Edge solutions and modules on your local development computer.
* Code your Azure IoT modules in C or C# with the benefits of Visual Studio development.
* Deploy your IoT Edge solution to an IoT Edge device via Azure IoT Hub.
* Manage IoT Edge devices and modules with the UI.

Visual Studio 2022 provides support for modules written in C and C#. The supported device architectures are Windows x64 and Linux x64 or ARM32, while ARM64 is in preview. For more information about supported operating systems, languages, and architectures, see [Language and architecture support](module-development.md#language-and-architecture-support).
  
## Prerequisites

This article assumes that you use a machine running Windows as your development machine. 

* On Windows computers, you can develop either Windows or Linux modules.

    * To develop modules with **Windows containers**, use a Windows computer running version 1809/build 17763 or newer.
    * To develop modules with **Linux containers**, use a Windows computer that meets the [requirements for Docker Desktop](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install).

* Install Visual Studio on your development machine. Make sure you include the **Azure development** and **Desktop development with C++** workloads in your Visual Studio 2022 installation. Alternatively, you can [Modify Visual Studio 2022](/visualstudio/install/modify-visual-studio?view=vs-2022&preserve-view=true) to add the required workloads, if Visual Studio is already installed on your machine.

* Install the Azure IoT Edge Tools either from the Marketplace or from Visual Studio:

    * Download and install [Azure IoT Edge Tools](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs17iotedgetools) from the Visual Studio Marketplace.

      > [!TIP]
      > If you are using Visual Studio 2019, download and install [Azure IoT Edge Tools for VS 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16iotedgetools) from the Visual Studio marketplace

    * Or, in Visual Studio go to **Extensions > Manage Extensions**. The **Manage Extensions** popup will open. In the search box in the upper right, add the text **Azure IoT Edge Tools for VS 2022**, then select **Download**. Close the popup when finished.

      If you only need to update your tools, go to the **Manage Extensions** window, expand **Updates > Visual Studio Marketplace**, select **Azure IoT Edge Tools** then select **Update**. 
    
      After the update is complete, select **Close** and restart Visual Studio.

* Download and install a [Docker compatible container management system](support.md#container-engines) on your development machine to build and run your module images. Set the container engine to run in either Linux container mode or Windows container mode, depending on the type of modules you are developing.

* Set up your local development environment to debug, run, and test your IoT Edge solution by installing the [Azure IoT EdgeHub Dev Tool](https://pypi.org/project/iotedgehubdev/). Install [Python (3.5/3.6/3.7/3.8) and Pip](https://www.python.org/) and then install the **iotedgehubdev** package by running the following command in your terminal.

   ```cmd
   pip install --upgrade iotedgehubdev
   ```
    
    > [!TIP]
    >Make sure your Azure IoT EdgeHub Dev Tool version is greater than 0.3.0. You'll need to have a pre-existing IoT Edge device in the Azure portal and have your connection string ready during setup.

   You may need to restart Visual Studio to complete the installation.

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

* Create an instance of [Azure Container Registry](../container-registry/index.yml) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags) to store your module images.

  > [!TIP]
  > You can use a local Docker registry for prototype and testing purposes instead of a cloud registry.

* To test your module on a device, you'll need an active IoT Hub with at least one IoT Edge device. To create an IoT Edge device for testing you can create one in the Azure portal or with the CLI:

    * Creating one in the [Azure portal](https://portal.azure.com/) is the quickest. From the Azure portal, go to your IoT Hub resource. Select **IoT Edge** from the menu on the left and then select **Add IoT Edge Device**.

        :::image type="content" source="./media/how-to-visual-studio-develop-module/create-new-iot-edge-device.png" alt-text="Screenshot of how to add a new I o T Edge device":::
    
       A new popup called **Create a device** will appear. Add a name to your device (known as the Device ID), then select **Save** in the lower left. 
    
        Finally, confirm that your new device exists in your IoT Hub, from the **Device management > IoT Edge** menu. For more information on creating an IoT Edge device through the Azure portal, read [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md).

    * To create an IoT Edge device with the CLI follow the steps in the quickstart for [Linux](quickstart-linux.md#register-an-iot-edge-device) or [Windows](quickstart.md#register-an-iot-edge-device). In the process of registering an IoT Edge device, you create an IoT Edge device.

   If you are running the IoT Edge daemon on your development machine, you might need to stop EdgeHub and EdgeAgent before you start development in Visual Studio.

## Create an Azure IoT Edge project

The IoT Edge project template in Visual Studio creates a solution that can be deployed to IoT Edge devices. In summary, first you'll create an Azure IoT Edge solution, and then you'll generate the first module in that solution. Each IoT Edge solution can contain more than one module.

In all, we're going to build three projects in our solution. The main module that contains EdgeAgent and EdgeHub, in addition to the temperature sensor module, then you'll add two more IoT Edge modules.

> [!TIP]
> The IoT Edge project structure created by Visual Studio is not the same as the one in Visual Studio Code.

1. In Visual Studio, create a new project.

1. In the **Create a new project** window, search for **Azure IoT Edge**. Select the project that matches the platform and architecture for your IoT Edge device, and click **Next**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/create-new-project.png" alt-text="Create New Project":::

1. In the **Configure your new project** window, enter a name for your project and specify the location, then select **Create**.

1. In the **Add Module** window, select the type of module you want to develop. You can also select **Existing module** to add an existing IoT Edge module to your deployment. Specify your module name and module image repository.

   Visual Studio autopopulates the repository URL with **localhost:5000/<module name\>**. If you use a local Docker registry for testing, then **localhost** is fine. If you use Azure Container Registry, then replace **localhost:5000** with the login server from your registry's settings. 
   
   The login server looks like **_\<registry name\>_.azurecr.io**.The final result should look like **\<*registry name*\>.azurecr.io/_\<module name\>_**, for example **my-registry-name.azurecr.io/my-module-name**.

   Select **Add** to add your module to the project.

   ![Add Application and Module](./media/how-to-visual-studio-develop-csharp-module/add-module.png)

   > [!NOTE]
   >If you have an existing IoT Edge project, you can still change the repository URL by opening the **module.json** file. The repository URL is located in the 'repository' property of the JSON file.

Now you have an IoT Edge project and an IoT Edge module in your Visual Studio solution.

#### Project structure

In your solution is a main project folder and a single module folder. Both are on the project level. The main project folder contains your deployment manifest.

The module project folder contains a file for your module code named either `program.cs` or `main.c` depending on the language you chose. This folder also contains a file named `module.json` that describes the metadata of your module. Various Docker files included here provide the information needed to build your module as a Windows or Linux container.
#### Deployment manifest of your project

The deployment manifest you'll edit is called `deployment.debug.template.json`. This file is a template of an IoT Edge deployment manifest, which defines all the modules that run on a device along with how they communicate with each other. For more information about deployment manifests, see [Learn how to deploy modules and establish routes](module-composition.md). 

If you open this deployment template, you see that the two runtime modules, **edgeAgent** and **edgeHub** are included, along with the custom module that you created in this Visual Studio project. A fourth module named **SimulatedTemperatureSensor** is also included. This default module generates simulated data that you can use to test your modules, or delete if it's not necessary. To see how the simulated temperature sensor works, view the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).

### Set IoT Edge runtime version

The IoT Edge extension defaults to the latest stable version of the IoT Edge runtime when it creates your deployment assets. Currently, the latest stable version is version 1.2. If you're developing modules for devices running the 1.1 long-term support version or the earlier 1.0 version, update the IoT Edge runtime version in Visual Studio to match.

1. In the Solution Explorer, right-click the name of your main project and select **Set IoT Edge runtime version**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/set-iot-edge-runtime-version.png" alt-text="Screenshot of how to find and select the menu item named 'Set I o T Edge Runtime version'.":::

1. Use the drop-down menu to choose the runtime version that your IoT Edge devices are running, then select **OK** to save your changes. If no change was made, select **Cancel** to exit.

1. If you changed the version, re-generate your deployment manifest by right-clicking the name of your project and select **Generate deployment for IoT Edge**. This will generate a deployment manifest based on your deployment template and will appear in the **config** folder of your Visual Studio project.

## Module infrastructure & development options

When you add a new module, it comes with default code that is ready to be built and deployed to a device so that you can start testing without touching any code. The module code is located within the module folder in a file named `Program.cs` (for C#) or `main.c` (for C).

The default solution is built so that the simulated data from the **SimulatedTemperatureSensor** module is routed to your module, which takes the input and then sends it to IoT Hub.

When you're ready to customize the module template with your own code, use the [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md) to build modules that address the key needs for IoT solutions such as security, device management, and reliability.

## Set up the iotedgehubdev testing tool

The Azure IoT EdgeHub Dev Tool provides a local development and debug experience. The tool helps start IoT Edge modules without the IoT Edge runtime so that you can create, develop, test, run, and debug IoT Edge modules and solutions locally. You don't have to push images to a container registry and deploy them to a device for testing.

For more information, see [Azure IoT EdgeHub Dev Tool](https://pypi.org/project/iotedgehubdev/).

To initialize the tool in Visual Studio:

1. Retrieve the connection string of your IoT Edge device (found in your IoT Hub) from the [Azure portal](https://portal.azure.com/) or from the Azure CLI. 

    If using the CLI to retrieve your connection string, use this command, replacing "**[device_id]**" and "**[hub_name]**" with your own values:

    ```Azure CLI
    az iot hub device-identity connection-string show --device-id [device_id] --hub-name [hub_name]
    ```

1. From the **Tools** menu in Visual Studio, select **Azure IoT Edge Tools** > **Setup IoT Edge Simulator**.

1. Paste the connection string and click **OK**.

> [!NOTE]
> You need to follow these steps only once on your development computer as the results are automatically applied to all subsequent Azure IoT Edge solutions. This procedure can be followed again if you need to change to a different connection string.

## Build and debug a single module

Typically, you'll want to test and debug each module before running it within an entire solution with multiple modules.

>[!TIP]
>Depending on the type of IoT Edge module you are developing, you may need to enable the correct Docker container mode: either Linux or Windows. From the Docker Desktop menu, you can toggle between the two types of modes. Select **Switch to Windows containers** or select **Switch to Linux containers**. For this tutorial, we use Linux.
>
>:::image type="content" source="./media/how-to-visual-studio-develop-module/system-tray.png" alt-text="Screenshot of how to find and select the menu item named 'Switch to Windows containers'.":::

1. In **Solution Explorer**, right-click the module project folder and select **Set as StartUp Project** from the menu.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/module-start-up-project.png" alt-text="Screenshot of how to set project as startup project.":::

1. Press **F5** or click the run button in the toolbar to run the module. It may take 10&ndash;20 seconds the first time you do so. Be sure you don't have other Docker containers running that might bind the port you need for this project.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/run-module.png" alt-text="Screenshot of how to run a module.":::

1. You should see a .NET Core console app window appear if the module has been initialized successfully.

1. Set a breakpoint to inspect the module.

   * If developing in C#, set a breakpoint in the `PipeMessage()` function in **Program.cs**.
   * If using C, set a breakpoint in the `InputQueue1Callback()` function in **main.c**.

1. Test the module by sending a message by running the following command in a **Git Bash** or **WSL Bash** shell. You cannot run the `curl` command from a PowerShell or command prompt.

   ```bash
   curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
   ```
   If you get the error *unmatched close brace/bracket in URL*, try the following command instead:
   
   ```bash
   curl --header "Content-Type: application/json" --request POST --data "{\"inputName\": \"input1\", \"data\", \"hello world\"}"  http://localhost:53000/api/v1/messages
   ```
  
   :::image type="content" source="./media/how-to-visual-studio-develop-csharp-module/debug-single-module.png" alt-text="Screenshot of the output console, Visual Studio project, and Bash window." lightbox="./media/how-to-visual-studio-develop-csharp-module/debug-single-module.png":::

   The breakpoint should be triggered. You can watch variables in the Visual Studio **Locals** window, found when the debugger is running. Go to Debug > Windows > Locals. 

   In your Bash or shell, you should see a `{"message":"accepted"}` confirmation.

      In your .NET console you should see:
    
      ```dotnetcli
      IoT Hub module client initialized.
      Received message: 1, Body: [hello world]
      ```

   > [!TIP]
   > You can also use [PostMan](https://www.getpostman.com/) or other API tools to send messages instead of `curl`.

1. Press **Ctrl + F5** or click the stop button to stop debugging.

## Build and debug multiple modules

After you're done developing a single module, you might want to run and debug an entire solution with multiple modules.

1. In **Solution Explorer**, add a second module to the solution by right-clicking the main project folder. On the menu, select **Add** > **New IoT Edge Module**.

   :::image type="content" source="./media/how-to-visual-studio-develop-module/add-new-module.png" alt-text="Screenshot of how to add a 'New I o T Edge Module' from the menu." lightbox="./media/how-to-visual-studio-develop-module/add-new-module.png":::

1. In the `Add module` window give your new module a name and replace the `localhost:5000` portion of the repository URL with your Azure Container Registry login server, like you did before.

1. Open the file `deployment.debug.template.json` to see that the new module has been added in the **modules** section. A new route was also added to the **routes** section in `EdgeHub` to send messages from the new module to IoT Hub. To send data from the simulated temperature sensor to the new module, add another route with the following line of `JSON`. Replace `<NewModuleName>` (in two places) with your own module name.

    ```json
   "sensorTo<NewModuleName>": "FROM /messages/modules/SimulatedTemperatureSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/<NewModuleName>/inputs/input1\")"
    ```

1. Right-click the main project (for example, `IoTEdgeProject`) and select **Set as StartUp Project**. 

1. Create breakpoints in each module and then press **F5** to run and debug multiple modules simultaneously. You should see multiple .NET Core console app windows, with each window representing a different module.

   :::image type="content" source="./media/how-to-visual-studio-develop-csharp-module/debug-multiple-modules.png" alt-text="Screenshot of Visual Studio with two output consoles.":::

1. Press **Ctrl + F5** or select the stop button to stop debugging.

## Build and push images

1. Make sure the main IoT Edge project is the start-up project, not one of the individual modules. Select either **Debug** or **Release** as the configuration to build for your module images.

    > [!NOTE]
    > When choosing **Debug**, Visual Studio uses `Dockerfile.(amd64|windows-amd64).debug` to build Docker images. This includes the .NET Core command-line debugger VSDBG in your container image while building it. For production-ready IoT Edge modules, we recommend that you use the **Release** configuration, which uses `Dockerfile.(amd64|windows-amd64)` without VSDBG.

1. If you're using a private registry like Azure Container Registry (ACR), use the following Docker command to sign in to it.  You can get the username and password from the **Access keys** page of your registry in the Azure portal. 

    ```cmd
    docker login -u <ACR username> -p <ACR password> <ACR login server>
    ```

1. Let's add the Azure Container Registry login information to the runtime settings found in the file `deployment.debug.template.json`. There are two ways to do this. You can either add your registry credentials to your `.env` file (most secure) or add them directly to your `deployment.debug.template.json` file.

   **Add credentials to your `.env` file:**

   In the Solution Explorer, click the button that will **Show All Files**. The `.env` file will appear. Add your Azure Container Registry username and password to your `.env` file. These credentials can be found on the **Access Keys** page of your Azure Container Registry in the Azure portal.
      
   :::image type="content" source="./media/how-to-visual-studio-develop-module/show-env-file.png" alt-text="Screenshot of button that will show all files in the Solution Explorer.":::

   ```env
       DEFAULT_RT_IMAGE=1.2
       CONTAINER_REGISTRY_USERNAME_myregistry=<my-registry-name>
       CONTAINER_REGISTRY_PASSWORD_myregistry=<my-registry-password>
   ```

   **Add credentials directly to `deployment.debug.template.json`:**

   If you'd rather add your credentials directly to your deployment template, replace the placeholders with your actual ACR admin username, password, and registry name.

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

1. Finally, in the **Solution Explorer**, right-click the main project folder and select **Build and Push IoT Edge Modules** to build and push the Docker image for each module. This might take a minute. When you see `Finished Build and Push IoT Edge Modules.` in your Output console of Visual Studio, you are done.

## Deploy the solution

In the quickstart article that you used to set up your IoT Edge device, you deployed a module by using the Azure portal. You can also deploy modules using the CLI in Visual Studio. You already have a deployment manifest template you've been observing throughout this tutorial. Let's generate a deployment manifest from that, then use an Azure CLI command to deploy your modules to your IoT Edge device in Azure.

1. Right-click on your main project in Visual Studio Solution Explorer and choose **Generate Deployment for IoT Edge**. 

   :::image type="content" source="./media/how-to-visual-studio-develop-module/generate-deployment.png" alt-text="Screenshot of location of the 'generate deployment' menu item.":::

1. Go to your local Visual Studio main project folder and look in the `config` folder. The file path might look like this: `C:\Users\<YOUR-USER-NAME>\source\repos\<YOUR-IOT-EDGE-PROJECT-NAME>\config`. Here you'll find the generated deployment manifest such as `deployment.amd64.debug.json`.

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
   >:::image type="content" source="./media/how-to-publish-subscribe/unsupported-1.2-schema.png" alt-text="Screenshot of Azure portal error on the I o T Edge device page.":::

1. Now let's deploy our manifest with an Azure CLI command. Open the Visual Studio **Developer Command Prompt** and change to the **config** directory.

    ```cmd
        cd config
    ```

1. Deploy the manifest for your IoT Edge device to IoT Hub. The command configures the device to use modules developed in your solution. The deployment manifest was created in the previous step and stored in the **config** folder. From your **config** folder, execute the following deployment command. Replace the `[device id]`, `[hub name]`, and `[file path]` with your values. If the IoT Edge device ID does not exist in the IoT Hub, it must be created.

    ```cmd
        az iot edge set-modules --device-id [device id] --hub-name [hub name] --content [file path]
    ```

    For example, your command might look like this: 
    
    ```cmd
    az iot edge set-modules --device-id my-device-name --hub-name my-iot-hub-name --content deployment.amd64.debug.json
    ```

1. After running the command, you'll see a confirmation of deployment printed in `JSON` in your command prompt.

### Confirm the deployment to your device

To check that your IoT Edge modules were deployed to Azure, sign in to your device (or virtual machine), for example through SSH or Azure Bastion, and run the IoT Edge list command. 

```azurecli
   iotedge list
```

You should see a list of your modules running on your device or virtual machine.

```azurecli
   NAME                        STATUS           DESCRIPTION      CONFIG
   SimulatedTemperatureSensor  running          Up a day         mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0
   edgeAgent                   running          Up a day         mcr.microsoft.com/azureiotedge-agent:1.2
   edgeHub                     running          Up a day         mcr.microsoft.com/azureiotedge-hub:1.2
   myIotEdgeModule             running          Up 2 hours       myregistry.azurecr.io/myiotedgemodule:0.0.1-amd64.debug
   myIotEdgeModule2            running          Up 2 hours       myregistry.azurecr.io/myiotedgemodule2:0.0.1-amd64.debug
```

## View generated data

To monitor the device-to-cloud (D2C) messages for a specific IoT Edge device, review the [Tutorial: Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md) to get started.

## Next steps

To develop custom modules for your IoT Edge devices, [Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).
