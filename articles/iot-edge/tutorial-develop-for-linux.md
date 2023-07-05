---
title: Develop Azure IoT Edge modules using Visual Studio Code tutorial
description: This tutorial walks through setting up your development machine and cloud resources to develop IoT Edge modules
author: PatAltimore

ms.author: patricka
ms.date: 05/02/2023
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
zone_pivot_groups: iotedge-dev
content_well_notification: 
  - AI-contribution
---

# Tutorial: Develop IoT Edge modules using Visual Studio Code

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This tutorial walks through developing and deploying your own code to an IoT Edge device. You can use Azure IoT Edge modules to deploy code that implements your business logic directly to your IoT Edge devices. In the [Deploy code to a Linux device](quickstart-linux.md) quickstart, you created an IoT Edge device and deployed a module from the Azure Marketplace.

This article includes steps for two IoT Edge development tools.

 * *Azure IoT Edge Dev Tool* command-line tool (CLI). This tool is preferred for development.
 * *Azure IoT Edge tools for Visual Studio Code* extension. The extension is in [maintenance mode](https://github.com/microsoft/vscode-azure-iot-edge/issues/639).

Use the tool selector button at the beginning of this article to select the tool version.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Set up your development machine.
> * Use the IoT Edge tools to create a new project.
> * Build your project as a [Docker container](/dotnet/architecture/microservices/container-docker-introduction) and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device.

The IoT Edge module that you create in this tutorial filters the temperature data that your device generates. It only sends messages upstream if the temperature is above a specified threshold. This type of analysis at the edge is useful for reducing the amount of data that's communicated to and stored in the cloud.

## Prerequisites

A development machine:

* Use your own computer or a virtual machine.
* Your development machine must support [nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) for running a container engine.
* Most operating systems that can run a container engine can be used to develop IoT Edge modules for Linux devices. This tutorial uses a Windows computer, but points out known differences on macOS or Linux.
* Install [Visual Studio Code](https://code.visualstudio.com/)
* Install the [Azure CLI](/cli/azure/install-azure-cli).

An Azure IoT Edge device:

* You should run IoT Edge on a separate device. This distinction between development machine and IoT Edge device simulates a true deployment scenario and helps keep the different concepts separate.
Use the quickstart article [Deploy code to a Linux Device](quickstart-linux.md) to create an IoT Edge device in Azure or the [Azure Resource Template to deploy an IoT Edge enabled VM](https://github.com/Azure/iotedge-vm-deploy).

Cloud resources:

* A free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!TIP]
> For guidance on interactive debugging in Visual Studio Code or Visual Studio 2022:
>* [Debug Azure IoT Edge modules using Visual Studio Code](debug-module-vs-code.md)
>* [Use Visual Studio 2022 to develop and debug modules for Azure IoT Edge](how-to-visual-studio-develop-module.md)
>
>This tutorial teaches the development steps for Visual Studio Code.

## Key concepts

This tutorial walks through the development of an IoT Edge module. An *IoT Edge module* is a container with executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, cleaning and analyzing data, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

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

Install the Python-based [Azure IoT Edge Dev Tool](https://pypi.org/project/iotedgedev/) to create your IoT Edge solution. There are two options:

* Use the prebuilt [IoT Edge Dev Container](https://github.com/Azure/iotedgedev/blob/main/docs/environment-setup/run-devcontainer-docker.md)
* Install the tool using the [iotedgedev development setup](https://github.com/Azure/iotedgedev/blob/main/docs/environment-setup/manual-dev-machine-setup.md)

::: zone-end

::: zone pivot="iotedge-dev-ext"

Use the IoT extensions for Visual Studio Code to develop IoT Edge modules. These extensions offer project templates, automate the creation of the deployment manifest, and allow you to monitor and manage IoT Edge devices. In this section, you install Visual Studio Code and the IoT extension, then set up your Azure account to manage IoT Hub resources from within Visual Studio Code.

1. Install [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension.

1. Install [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension.

1. After you install extensions, open the command palette by selecting **View** > **Command Palette**.

1. In the command palette again, search for and select **Azure IoT Hub: Select IoT Hub**. Follow the prompts to select your Azure subscription and IoT Hub.

1. Open the explorer section of Visual Studio Code by either selecting the icon in the activity bar on the left, or by selecting **View** > **Explorer**.

1. At the bottom of the explorer section, expand the collapsed **Azure IoT Hub / Devices** menu. You should see the devices and IoT Edge devices associated with the IoT Hub that you selected through the command palette.

::: zone-end

### Install language specific tools

Install tools specific to the language you're developing in:

# [C\#](#tab/csharp)

* [.NET Core SDK](https://dotnet.microsoft.com/download)
* [C# Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

# [C](#tab/c)

* [C/C++ Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
* Installing the Azure IoT C SDK isn't required for this tutorial, but can provide helpful functionality like IntelliSense and reading program definitions. For installation information, see [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c).

# [Java](#tab/java)

* [Java SE Development Kit 11](/azure/developer/java/fundamentals/java-support-on-azure) and [Maven](https://maven.apache.org/). You need to [set the `JAVA_HOME` environment variable](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) to point to your JDK installation.
* [Maven](https://maven.apache.org/)
* [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

>[!TIP]
>The Java and Maven installation processes add environment variables to your system. Restart any open Visual Studio Code terminal, PowerShell, or command prompt instances after completing installation. This step ensures that these utilities can recognize the Java and Maven commands going forward.

# [Node.js](#tab/node)

* [Node.js](https://nodejs.org).
* [Yeoman](https://www.npmjs.com/package/yo)
* [Azure IoT Edge Node.js Module Generator](https://www.npmjs.com/package/generator-azure-iot-edge-module).

# [Python](#tab/python)

To develop an IoT Edge module in Python, install the following extra prerequisites on your development machine:

* [Python](https://www.python.org/downloads/) and [Pip](https://pip.pypa.io/en/stable/installation/).
* [Cookiecutter](https://github.com/audreyr/cookiecutter).
* [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python).

>[!Note]
>Ensure that your `bin` folder is on your path for your platform. Typically `~/.local/` for UNIX and macOS, or `%APPDATA%\Python` on Windows.

---

[!INCLUDE [iot-edge-create-container-registry](includes/iot-edge-create-container-registry.md)]

## Create a new module project

The Azure IoT Edge extension offers project templates for all supported IoT Edge module languages in Visual Studio Code. These templates have all the files and code that you need to deploy a working module to test IoT Edge, or give you a starting point to customize the template with your own business logic.

### Create a project template

::: zone pivot="iotedge-dev-cli"

The [IoT Edge Dev Tool](https://github.com/Azure/iotedgedev) simplifies Azure IoT Edge development to commands driven by environment variables. It gets you started with IoT Edge development with the IoT Edge Dev Container and IoT Edge solution scaffolding that has a default module and all the required configuration files.

1. Create a directory for your solution with the path of your choice. Change into your `iotedgesolution` directory.

    ```bash
    mkdir c:\dev\iotedgesolution
    ```

1. Use the **iotedgedev solution init** command to create a solution and set up your Azure IoT Hub in the development language of your choice.

    # [C\#](#tab/csharp)
    
    ```bash
    iotedgedev solution init --template csharp
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

::: zone-end

::: zone pivot="iotedge-dev-ext"

Use Visual Studio Code and the [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension. You start by creating a solution, and then generating the first module in that solution. Each solution can contain multiple modules.

1. Select **View** > **Command Palette**.
1. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge Solution**.
1. Browse to the folder where you want to create the new solution and then select **Select folder**.
1. Enter a name for your solution.
1. Select a module template for your preferred development language to be the first module in the solution.
1. Enter a name for your module. Choose a name that's unique within your container registry.
1. Provide the name of the module's image repository. Visual Studio Code autopopulates the module name with **localhost:5000/<your module name\>**. Replace it with your own registry information. Use **localhost** if you use a local Docker registry for testing. If you use Azure Container Registry, then use **Login server** from your registry's settings. The sign-in server looks like **_\<registry name\>_.azurecr.io**. Only replace the **localhost:5000** part of the string so that the final result looks like **\<*registry name*\>.azurecr.io/_\<your module name\>_**.

Visual Studio Code takes the information you provided, creates an IoT Edge solution, and then loads it in a new window.

::: zone-end

After solution creation, these main files are in the solution:

- A **.vscode** folder contains configuration file *launch.json*.
- A **modules** folder that has subfolders for each module. Within the subfolder for each module, the module.json file controls how modules are built and deployed.
- An **.env** file lists your environment variables. The environment variable for the container registry is *localhost:5000* by default. 

- Two module deployment files named **deployment.template.json** and **deployment.debug.template.json** list the modules to deploy to your device. By default, the list includes the IoT Edge system modules (edgeAgent and edgeHub) and sample modules such as:
    - **filtermodule** is a sample module that implements a simple filter function.
    - **SimulatedTemperatureSensor** module that simulates data you can use for testing. For more information about how deployment manifests work, see [Learn how to use deployment manifests to deploy modules and establish routes](module-composition.md). For more information on how the simulated temperature module works, see the [SimulatedTemperatureSensor.csproj source code](https://github.com/Azure/iotedge/tree/master/edge-modules/SimulatedTemperatureSensor).
   
   > [!NOTE]
   > The exact modules installed may depend on your language of choice.

::: zone pivot="iotedge-dev-cli"

### Set IoT Edge runtime version

The latest stable IoT Edge system module version is 1.4. Set your system modules to version 1.4.

1. In Visual Studio Code, open **deployment.template.json** deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) is a JSON document that describes the modules to be configured on the targeted IoT Edge device.
1. Change the runtime version for the system runtime module images **edgeAgent** and **edgeHub**. For example, if you want to use the IoT Edge runtime version 1.4, change the following lines in the deployment manifest file:

    ```json
    "systemModules": {
        "edgeAgent": {

            "image": "mcr.microsoft.com/azureiotedge-agent:1.4",

        "edgeHub": {

            "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
    ```

::: zone-end

### Provide your registry credentials to the IoT Edge agent

The environment file stores the credentials for your container registry and shares them with the IoT Edge runtime. The runtime needs these credentials to pull your container images onto the IoT Edge device.

The IoT Edge extension tries to pull your container registry credentials from Azure and populate them in the environment file.

> [!NOTE]
> The environment file is only created if you provide an image repository for the module. If you accepted the localhost defaults to test and debug locally, then you don't need to declare environment variables.

Check to see if your credentials exist. If not, add them now:

1. If Azure Container Registry is your registry, set an Azure Container Registry username and password. Get these values from your container registry's **Settings** > **Access keys** menu in the Azure portal.
1. Open the **.env** file in your module solution.
1. Add the **username** and **password** values that you copied from your Azure container registry.
   For example:

    ```env
    CONTAINER_REGISTRY_SERVER="myacr.azurecr.io"
    CONTAINER_REGISTRY_USERNAME="myacr"
    CONTAINER_REGISTRY_PASSWORD="<registry_password>"
    ```
1. Save your changes to the *.env* file.

> [!NOTE]
> This tutorial uses administrator login credentials for Azure Container Registry that are convenient for development and test scenarios. When you're ready for production scenarios, we recommend a least-privilege authentication option like service principals or repository-scoped tokens. For more information, see [Manage access to your container registry](production-checklist.md#manage-access-to-your-container-registry).

### Target architecture

You need to select the architecture you're targeting with each solution, because that affects how the container is built and runs. The default is Linux AMD64. For this tutorial, we're using an Ubuntu virtual machine as the IoT Edge device and keep the default **amd64**.

If you need to change the target architecture for your solution, use the following steps.

::: zone pivot="iotedge-dev-ext"

1. Open the command palette and search for **Azure IoT Edge: Set Default Target Platform for Edge Solution**, or select the shortcut icon in the side bar at the bottom of the window.

1. In the command palette, select the target architecture from the list of options.

::: zone-end

::: zone pivot="iotedge-dev-cli"

1. Open or create **settings.json** in the **.vscode** directory of your solution.

1. Change the *platform* value to `amd64`, `arm32v7`, `arm64v8`, or `windows-amd64`. For example:

    ```json
    {
        "azure-iot-edge.defaultPlatform": {
            "platform": "amd64",
            "alias": null
        }
    }
    ```

::: zone-end

### Update module with custom code

Each template includes sample code that takes simulated sensor data from the **SimulatedTemperatureSensor** module and routes it to the IoT hub. The sample module receives messages and then passes them on. The pipeline functionality demonstrates an important concept in IoT Edge, which is how modules communicate with each other.

Each module can have multiple *input* and *output* queues declared in their code. The IoT Edge hub running on the device routes messages from the output of one module into the input of one or more modules. The specific code for declaring inputs and outputs varies between languages, but the concept is the same across all modules. For more information about routing between modules, see [Declare routes](module-composition.md#declare-routes).

# [C\#](#tab/csharp)

The sample C# code that comes with the project template uses the [ModuleClient Class](/dotnet/api/microsoft.azure.devices.client.moduleclient) from the IoT Hub SDK for .NET.

1. In the Visual Studio Code explorer, open **modules** > **filtermodule** > **ModuleBackgroundService.cs**.

1. Before the **filtermodule** namespace, add three **using** statements for types that are used later:

    ```csharp
    using System.Collections.Generic;     // For KeyValuePair<>
    using Microsoft.Azure.Devices.Shared; // For TwinCollection
    using Newtonsoft.Json;                // For JsonConvert
    ```

1. Add the **temperatureThreshold** variable to the **ModuleBackgroundService** class. This variable sets the value that the measured temperature must exceed for the data to be sent to the IoT hub.

    ```csharp
    static int temperatureThreshold { get; set; } = 25;
    ```

1. Add the **MessageBody**, **Machine**, and **Ambient** classes. These classes define the expected schema for the body of incoming messages.

    ```csharp
    class MessageBody
    {
        public Machine machine {get;set;}
        public Ambient ambient {get; set;}
        public string timeCreated {get; set;}
    }
    class Machine
    {
        public double temperature {get; set;}
        public double pressure {get; set;}
    }
    class Ambient
    {
        public double temperature {get; set;}
        public int humidity {get; set;}
    }
    ```

1. Find the **ExecuteAsync** function. This function creates and configures a **ModuleClient** object that allows the module to connect to the local Azure IoT Edge runtime to send and receive messages. After creating the **ModuleClient**, the code reads the **temperatureThreshold** value from the module twin's desired properties. The code registers a callback to receive messages from an IoT Edge hub via an endpoint called **input1**.

   Replace the call to the **ProcessMessageAsync** method with a new one that updates the name of the endpoint and the method that's called when input arrives. Also, add a **SetDesiredPropertyUpdateCallbackAsync** method for updates to the desired properties. To make this change, **replace the last line** of the **ExecuteAsync** method with the following code:

   ```csharp
   // Register a callback for messages that are received by the module.
   // await _moduleClient.SetInputMessageHandlerAsync("input1", PipeMessage, cancellationToken);

   // Read the TemperatureThreshold value from the module twin's desired properties
   var moduleTwin = await _moduleClient.GetTwinAsync();
   await OnDesiredPropertiesUpdate(moduleTwin.Properties.Desired, _moduleClient);

   // Attach a callback for updates to the module twin's desired properties.
   await _moduleClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertiesUpdate, null);

   // Register a callback for messages that are received by the module. Messages received on the inputFromSensor endpoint are sent to the FilterMessages method.
   await _moduleClient.SetInputMessageHandlerAsync("inputFromSensor", FilterMessages, _moduleClient);
   ```

1. Add the **onDesiredPropertiesUpdate** method to the **ModuleBackgroundService** class. This method receives updates on the desired properties from the module twin, and updates the **temperatureThreshold** variable to match. All modules have their own module twin, which lets you configure the code that's running inside a module directly from the cloud.

    ```csharp
    static Task OnDesiredPropertiesUpdate(TwinCollection desiredProperties, object userContext)
    {
        try
        {
            Console.WriteLine("Desired property change:");
            Console.WriteLine(JsonConvert.SerializeObject(desiredProperties));

            if (desiredProperties["TemperatureThreshold"]!=null)
                temperatureThreshold = desiredProperties["TemperatureThreshold"];

        }
        catch (AggregateException ex)
        {
            foreach (Exception exception in ex.InnerExceptions)
            {
                Console.WriteLine();
                Console.WriteLine("Error when receiving desired property: {0}", exception);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("Error when receiving desired property: {0}", ex.Message);
        }
        return Task.CompletedTask;
    }
    ```

1. Add the **FilterMessages** method. This method is called whenever the module receives a message from the IoT Edge hub. It filters out messages that report temperatures below the temperature threshold set via the module twin. It also adds the **MessageType** property to the message with the value set to **Alert**.

    ```csharp
    async Task<MessageResponse> FilterMessages(Message message, object userContext)
    {
        var counterValue = Interlocked.Increment(ref _counter);
        try
        {
            ModuleClient moduleClient = (ModuleClient)userContext;
            var messageBytes = message.GetBytes();
            var messageString = Encoding.UTF8.GetString(messageBytes);
            Console.WriteLine($"Received message {counterValue}: [{messageString}]");

            // Get the message body.
            var messageBody = JsonConvert.DeserializeObject<MessageBody>(messageString);

            if (messageBody != null && messageBody.machine.temperature > temperatureThreshold)
            {
                Console.WriteLine($"Machine temperature {messageBody.machine.temperature} " +
                    $"exceeds threshold {temperatureThreshold}");
                using (var filteredMessage = new Message(messageBytes))
                {
                    foreach (KeyValuePair<string, string> prop in message.Properties)
                    {
                        filteredMessage.Properties.Add(prop.Key, prop.Value);
                    }

                    filteredMessage.Properties.Add("MessageType", "Alert");
                    await moduleClient.SendEventAsync("output1", filteredMessage);
                }
            }

            // Indicate that the message treatment is completed.
            return MessageResponse.Completed;
        }
        catch (AggregateException ex)
        {
            foreach (Exception exception in ex.InnerExceptions)
            {
                Console.WriteLine();
                Console.WriteLine("Error in sample: {0}", exception);
            }
            // Indicate that the message treatment is not completed.
            var moduleClient = (ModuleClient)userContext;
            return MessageResponse.Abandoned;
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("Error in sample: {0}", ex.Message);
            // Indicate that the message treatment is not completed.
            ModuleClient moduleClient = (ModuleClient)userContext;
            return MessageResponse.Abandoned;
        }
    }
    ```

1. Save the **ModuleBackgroundService.cs** file.

1. In the Visual Studio Code explorer, open the **deployment.template.json** file in your IoT Edge solution workspace.

1. Since we changed the name of the endpoint that the module listens on, we also need to update the routes in the deployment manifest so that the *edgeHub* sends messages to the new endpoint.

    Find the **routes** section in the **$edgeHub** module twin. Update the **sensorTofiltermodule** route to replace `input1` with `inputFromSensor`:

    ```json
    "sensorTofiltermodule": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/filtermodule/inputs/inputFromSensor\")"
    ```

1. Add the **filtermodule** module twin to the deployment manifest. Insert the following JSON content at the bottom of the **modulesContent** section, after the **$edgeHub** module twin:

    ```json
       "filtermodule": {
           "properties.desired":{
               "TemperatureThreshold":25
           }
       }
    ```

1. Save the **deployment.template.json** file.

# [C](#tab/c)

1. The data from the sensor in this scenario comes in JSON format. To filter messages in JSON format, import a JSON library for C. This tutorial uses Parson.

   1. Download the [Parson GitHub repository](https://github.com/kgabis/parson). Copy the **parson.c** and **parson.h** files into the **filtermodule** folder.

   1. Open **modules** > **filtermodule** > **CMakeLists.txt**. At the top of the file, import the Parson files as a library called **my_parson**.

      ```txt
      add_library(my_parson
          parson.c
          parson.h
      )
      ```

   1. Add `my_parson` to the list of libraries in the **target_link_libraries** function of CMakeLists.txt.

   1. Save the **CMakeLists.txt** file.

   1. Open **modules** > **filtermodule** > **main.c**. At the bottom of the list of include statements, add a new one to include `parson.h` for JSON support:

      ```c
      #include "parson.h"
      ```

1. In the **main.c** file, add a global variable called `temperatureThreshold` after the include section. This variable sets the value that the measured temperature must exceed in order for the data to be sent to IoT Hub.

    ```c
    static double temperatureThreshold = 25;
    ```

1. Find the `CreateMessageInstance` function in main.c. Replace the inner if-else statement with the following code that adds a few lines of functionality:

   ```c
       if ((messageInstance->messageHandle = IoTHubMessage_Clone(message)) == NULL)
       {
           free(messageInstance);
           messageInstance = NULL;
       }
       else
       {
           messageInstance->messageTrackingId = messagesReceivedByInput1Queue;
           MAP_HANDLE propMap = IoTHubMessage_Properties(messageInstance->messageHandle);
           if (Map_AddOrUpdate(propMap, "MessageType", "Alert") != MAP_OK)
           {
              printf("ERROR: Map_AddOrUpdate Failed!\r\n");
           }
       }
   ```

   The new lines of code in the else statement add a new property to the message, which labels the message as an alert. This code labels all messages as alerts, because we'll add functionality that only sends messages to IoT Hub if they report high temperatures.

1. Replace the entire `InputQueue1Callback` function with the following code. This function implements the actual messaging filter. When a message is received, it checks whether the reported temperature exceeds the threshold. If yes, then it forwards the message through its output queue. If not, then it ignores the message.

    ```c
    static unsigned char *bytearray_to_str(const unsigned char *buffer, size_t len)
    {
        unsigned char *ret = (unsigned char *)malloc(len + 1);
        memcpy(ret, buffer, len);
        ret[len] = '\0';
        return ret;
    }

    static IOTHUBMESSAGE_DISPOSITION_RESULT InputQueue1Callback(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
    {
        IOTHUBMESSAGE_DISPOSITION_RESULT result;
        IOTHUB_CLIENT_RESULT clientResult;
        IOTHUB_MODULE_CLIENT_LL_HANDLE iotHubModuleClientHandle = (IOTHUB_MODULE_CLIENT_LL_HANDLE)userContextCallback;

        unsigned const char* messageBody;
        size_t contentSize;

        if (IoTHubMessage_GetByteArray(message, &messageBody, &contentSize) == IOTHUB_MESSAGE_OK)
        {
            messageBody = bytearray_to_str(messageBody, contentSize);
        } else
        {
            messageBody = "<null>";
        }

        printf("Received Message [%zu]\r\n Data: [%s]\r\n",
                messagesReceivedByInput1Queue, messageBody);

        // Check if the message reports temperatures higher than the threshold
        JSON_Value *root_value = json_parse_string(messageBody);
        JSON_Object *root_object = json_value_get_object(root_value);
        double temperature;
        if (json_object_dotget_value(root_object, "machine.temperature") != NULL && (temperature = json_object_dotget_number(root_object, "machine.temperature")) > temperatureThreshold)
        {
            printf("Machine temperature %f exceeds threshold %f\r\n", temperature, temperatureThreshold);
            // This message should be sent to next stop in the pipeline, namely "output1".  What happens at "outpu1" is determined
            // by the configuration of the Edge routing table setup.
            MESSAGE_INSTANCE *messageInstance = CreateMessageInstance(message);
            if (NULL == messageInstance)
            {
                result = IOTHUBMESSAGE_ABANDONED;
            }
            else
            {
                printf("Sending message (%zu) to the next stage in pipeline\n", messagesReceivedByInput1Queue);

                clientResult = IoTHubModuleClient_LL_SendEventToOutputAsync(iotHubModuleClientHandle, messageInstance->messageHandle, "output1", SendConfirmationCallback, (void *)messageInstance);
                if (clientResult != IOTHUB_CLIENT_OK)
                {
                    IoTHubMessage_Destroy(messageInstance->messageHandle);
                    free(messageInstance);
                    printf("IoTHubModuleClient_LL_SendEventToOutputAsync failed on sending msg#=%zu, err=%d\n", messagesReceivedByInput1Queue, clientResult);
                    result = IOTHUBMESSAGE_ABANDONED;
                }
                else
                {
                    result = IOTHUBMESSAGE_ACCEPTED;
                }
            }
        }
        else
        {
            printf("Not sending message (%zu) to the next stage in pipeline.\r\n", messagesReceivedByInput1Queue);
            result = IOTHUBMESSAGE_ACCEPTED;
        }

        messagesReceivedByInput1Queue++;
        return result;
    }
    ```

1. Add a `moduleTwinCallback` function. This method receives updates on the desired properties from the module twin, and updates the **temperatureThreshold** variable to match. All modules have their own module twin, which lets you configure the code running inside a module directly from the cloud.

    ```c
    static void moduleTwinCallback(DEVICE_TWIN_UPDATE_STATE update_state, const unsigned char* payLoad, size_t size, void* userContextCallback)
    {
        printf("\r\nTwin callback called with (state=%s, size=%zu):\r\n%s\r\n",
            MU_ENUM_TO_STRING(DEVICE_TWIN_UPDATE_STATE, update_state), size, payLoad);
        JSON_Value *root_value = json_parse_string(payLoad);
        JSON_Object *root_object = json_value_get_object(root_value);
        if (json_object_dotget_value(root_object, "desired.TemperatureThreshold") != NULL) {
            temperatureThreshold = json_object_dotget_number(root_object, "desired.TemperatureThreshold");
        }
        if (json_object_get_value(root_object, "TemperatureThreshold") != NULL) {
            temperatureThreshold = json_object_get_number(root_object, "TemperatureThreshold");
        }
    }
    ```

1. Find the `SetupCallbacksForModule` function. Replace the function with the following code that adds an **else if** statement to check if the module twin has been updated.

   ```c
   static int SetupCallbacksForModule(IOTHUB_MODULE_CLIENT_LL_HANDLE iotHubModuleClientHandle)
   {
       int ret;

       if (IoTHubModuleClient_LL_SetInputMessageCallback(iotHubModuleClientHandle, "input1", InputQueue1Callback, (void*)iotHubModuleClientHandle) != IOTHUB_CLIENT_OK)
       {
           printf("ERROR: IoTHubModuleClient_LL_SetInputMessageCallback(\"input1\")..........FAILED!\r\n");
           ret = MU_FAILURE;
       }
       else if (IoTHubModuleClient_LL_SetModuleTwinCallback(iotHubModuleClientHandle, moduleTwinCallback, (void*)iotHubModuleClientHandle) != IOTHUB_CLIENT_OK)
       {
           printf("ERROR: IoTHubModuleClient_LL_SetModuleTwinCallback(default)..........FAILED!\r\n");
           ret = MU_FAILURE;
       }
       else
       {
           ret = 0;
       }

       return ret;
   }
   ```

1. Save the **main.c** file.

1. In the Visual Studio Code explorer, open the **deployment.template.json** file in your IoT Edge solution workspace.

1. Add the filtermodule module twin to the deployment manifest. Insert the following JSON content at the bottom of the `moduleContent` section, after the `$edgeHub` module twin:

   ```json
   "filtermodule": {
       "properties.desired":{
           "TemperatureThreshold":25
       }
   }
   ```

1. Save the **deployment.template.json** file.

# [Java](#tab/java)

1. In the Visual Studio Code explorer, open **modules** > **filtermodule** > **src** > **main** > **java** > **com** > **edgemodule** > **App.java**.

1. Add the following code at the top of the file to import new referenced classes.

    ```java
    import java.io.StringReader;
    import java.util.concurrent.atomic.AtomicLong;
    import java.util.HashMap;
    import java.util.Map;

    import javax.json.Json;
    import javax.json.JsonObject;
    import javax.json.JsonReader;

    import com.microsoft.azure.sdk.iot.device.DeviceTwin.Pair;
    import com.microsoft.azure.sdk.iot.device.DeviceTwin.Property;
    import com.microsoft.azure.sdk.iot.device.DeviceTwin.TwinPropertyCallBack;
    ```

1. Add the following definition into class **App**. This variable sets a temperature threshold. The measured machine temperature won't be reported to IoT Hub until it goes over this value.

    ```java
    private static final String TEMP_THRESHOLD = "TemperatureThreshold";
    private static AtomicLong tempThreshold = new AtomicLong(25);
    ```

1. Replace the execute method of **MessageCallbackMqtt** with the following code. This method is called whenever the module receives an MQTT message from the IoT Edge hub. It filters out messages that report temperatures below the temperature threshold set via the module twin.

    ```java
    protected static class MessageCallbackMqtt implements MessageCallback {
        private int counter = 0;
        @Override
        public IotHubMessageResult execute(Message msg, Object context) {
            this.counter += 1;

            String msgString = new String(msg.getBytes(), Message.DEFAULT_IOTHUB_MESSAGE_CHARSET);
            System.out.println(
                   String.format("Received message %d: %s",
                            this.counter, msgString));
            if (context instanceof ModuleClient) {
                try (JsonReader jsonReader = Json.createReader(new StringReader(msgString))) {
                    final JsonObject msgObject = jsonReader.readObject();
                    double temperature = msgObject.getJsonObject("machine").getJsonNumber("temperature").doubleValue();
                    long threshold = App.tempThreshold.get();
                    if (temperature >= threshold) {
                        ModuleClient client = (ModuleClient) context;
                        System.out.println(
                            String.format("Temperature above threshold %d. Sending message: %s",
                            threshold, msgString));
                        client.sendEventAsync(msg, eventCallback, msg, App.OUTPUT_NAME);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return IotHubMessageResult.COMPLETE;
        }
    }
    ```

1. Add the following two static inner classes into class **App**. These classes update the tempThreshold variable when the module twin's desired property changes. All modules have their own module twin, which lets you configure the code that's running inside a module directly from the cloud.

    ```java
    protected static class DeviceTwinStatusCallBack implements IotHubEventCallback {
        @Override
        public void execute(IotHubStatusCode status, Object context) {
            System.out.println("IoT Hub responded to device twin operation with status " + status.name());
        }
    }

    protected static class OnProperty implements TwinPropertyCallBack {
        @Override
        public void TwinPropertyCallBack(Property property, Object context) {
            if (!property.getIsReported()) {
                if (property.getKey().equals(App.TEMP_THRESHOLD)) {
                    try {
                        long threshold = Math.round((double) property.getValue());
                        App.tempThreshold.set(threshold);
                    } catch (Exception e) {
                        System.out.println("Faile to set TemperatureThread with exception");
                        e.printStackTrace();
                    }
                }
            }
        }
    }
    ```

1. Add the following lines in to **main** method after **client.open()** to subscribe the module twin updates.

    ```java
    client.startTwin(new DeviceTwinStatusCallBack(), null, new OnProperty(), null);
    Map<Property, Pair<TwinPropertyCallBack, Object>> onDesiredPropertyChange = new HashMap<Property, Pair<TwinPropertyCallBack, Object>>() {
        {
            put(new Property(App.TEMP_THRESHOLD, null), new Pair<TwinPropertyCallBack, Object>(new OnProperty(), null));
        }
    };
    client.subscribeToTwinDesiredProperties(onDesiredPropertyChange);
    client.getTwin();
    ```

1. Save the **App.java** file.

1. In the Visual Studio Code explorer, open the **deployment.template.json** file in your IoT Edge solution workspace.

1. Add the **filtermodule** module twin to the deployment manifest. Insert the following JSON content at the bottom of the **moduleContent** section, after the **$edgeHub** module twin:

   ```json
     "filtermodule": {
         "properties.desired":{
             "TemperatureThreshold":25
         }
     }
   ```

1. Save the **deployment.template.json** file.


# [Node.js](#tab/node)

1. In the Visual Studio Code explorer, open **modules** > **filtermodule** > **app.js**.

1. Add a temperature threshold variable to the beginning of *app.js*. The temperature threshold sets the value that the measured temperature must exceed in order for the data to be sent to IoT Hub.

    ```javascript
    var temperatureThreshold = 25;
    ```

1. Replace the entire **PipeMessage** function with the **FilterMessage** function.

    ```javascript
    // This function filters out messages that report temperatures below the temperature threshold.
    // It also adds the MessageType property to the message with the value set to Alert.
    function filterMessage(client, inputName, msg) {
        client.complete(msg, printResultFor('Receiving message'));
        if (inputName === 'input1') {
            var message = msg.getBytes().toString('utf8');
            var messageBody = JSON.parse(message);
            if (messageBody && messageBody.machine && messageBody.machine.temperature && messageBody.machine.temperature > temperatureThreshold) {
                console.log(`Machine temperature ${messageBody.machine.temperature} exceeds threshold ${temperatureThreshold}`);
                var outputMsg = new Message(message);
                outputMsg.properties.add('MessageType', 'Alert');
                client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
            }
        }
    }

    ```

1. Replace the function name `pipeMessage` with `filterMessage` in the `client.on()` call.

    ```javascript
    client.on('inputMessage', function (inputName, msg) {
        filterMessage(client, inputName, msg);
        });
    ```

1. Copy the following code snippet into the `client.open()` function callback, after `client.on()` inside the `else` statement. This function is invoked when the desired properties are updated.

    ```javascript
    client.getTwin(function (err, twin) {
        if (err) {
            console.error('Error getting twin: ' + err.message);
        } else {
            twin.on('properties.desired', function(delta) {
                if (delta.TemperatureThreshold) {
                    temperatureThreshold = delta.TemperatureThreshold;
                }
            });
        }
    });
    ```

1. Save the **app.js** file.

1. In the Visual Studio Code explorer, open the **deployment.template.json** file in your IoT Edge solution workspace.

1. Add the filtermodule module twin to the deployment manifest. Insert the following JSON content at the bottom of the `moduleContent` section, after the `$edgeHub` module twin:

   ```json
     "filtermodule": {
         "properties.desired":{
             "TemperatureThreshold":25
         }
     }
   ```

1. Save the **deployment.template.json** file.

# [Python](#tab/python)

In this section, add the code that expands the *filtermodule* to analyze the messages before sending them. You'll add code that filters messages where the reported machine temperature is within the acceptable limits.

1. In the Visual Studio Code explorer, open **modules** > **filtermodule** > **main.py**.

1. At the top of the **main.py** file, import the **json** library:

    ```python
    import json
    ```

1. Add global definitions for **TEMPERATURE_THRESHOLD**, **RECEIVED_MESSAGES** and **TWIN_CALLBACKS** variables. The temperature threshold sets the value that the measured machine temperature must exceed for the data to be sent to the IoT hub.

    ```python
    # global counters
    TEMPERATURE_THRESHOLD = 25
    TWIN_CALLBACKS = 0
    RECEIVED_MESSAGES = 0
    ```

1. Replace the **create_client** function with the following code:

    ```python
    def create_client():
        client = IoTHubModuleClient.create_from_edge_environment()

        # Define function for handling received messages
        async def receive_message_handler(message):
            global RECEIVED_MESSAGES
            print("Message received")
            size = len(message.data)
            message_text = message.data.decode('utf-8')
            print("    Data: <<<{data}>>> & Size={size}".format(data=message.data, size=size))
            print("    Properties: {}".format(message.custom_properties))
            RECEIVED_MESSAGES += 1
            print("Total messages received: {}".format(RECEIVED_MESSAGES))

            if message.input_name == "input1":
                message_json = json.loads(message_text)
                if "machine" in message_json and "temperature" in message_json["machine"] and message_json["machine"]["temperature"] > TEMPERATURE_THRESHOLD:
                    message.custom_properties["MessageType"] = "Alert"
                    print("ALERT: Machine temperature {temp} exceeds threshold {threshold}".format(
                        temp=message_json["machine"]["temperature"], threshold=TEMPERATURE_THRESHOLD
                    ))
                    await client.send_message_to_output(message, "output1")

        # Define function for handling received twin patches
        async def receive_twin_patch_handler(twin_patch):
            global TEMPERATURE_THRESHOLD
            global TWIN_CALLBACKS
            print("Twin Patch received")
            print("     {}".format(twin_patch))
            if "TemperatureThreshold" in twin_patch:
                TEMPERATURE_THRESHOLD = twin_patch["TemperatureThreshold"]
            TWIN_CALLBACKS += 1
            print("Total calls confirmed: {}".format(TWIN_CALLBACKS))

        try:
            # Set handler on the client
            client.on_message_received = receive_message_handler
            client.on_twin_desired_properties_patch_received = receive_twin_patch_handler
        except:
            # Cleanup if failure occurs
            client.shutdown()
            raise

        return client
    ```

1. Save the **main.py** file.

1. In the Visual Studio Code explorer, open the **deployment.template.json** file in your IoT Edge solution workspace.

1. Add the **filtermodule** module twin to the deployment manifest. Insert the following JSON content at the bottom of the **modulesContent** section, after the **$edgeHub** module twin:

   ```json
       "filtermodule": {
           "properties.desired":{
               "TemperatureThreshold":25
           }
       }
   ```

1. Save the **deployment.template.json** file.

---

## Build and push your solution

You've updated the module code and the deployment template to help understand some key deployment concepts. Now, you're ready to build your module container image and push it to your container registry.

### Sign in to Docker

Provide your container registry credentials to Docker so that it can push your container image to storage in the registry.

1. Open the Visual Studio Code integrated terminal by selecting **Terminal** > **New Terminal**.

1. Sign in to Docker with the Azure Container Registry (ACR) credentials that you saved after creating the registry.

   ```bash
   docker login -u <ACR username> -p <ACR password> <ACR login server>
   ```

   You may receive a security warning recommending the use of `--password-stdin`. While that's a recommended best practice for production scenarios, it's outside the scope of this tutorial. For more information, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/#provide-a-password-using-stdin) reference.

3. Sign in to the Azure Container Registry. You may need to [Install Azure CLI](/cli/azure/install-azure-cli) to use the `az` command. This command asks for your user name and password found in your container registry in **Settings** > **Access keys**.

   ```azurecli
   az acr login -n <ACR registry name>
   ```
>[!TIP]
>If you get logged out at any point in this tutorial, repeat the Docker and Azure Container Registry sign in steps to continue.

### Build and push

Visual Studio Code now has access to your container registry, so it's time to turn the solution code into a container image.

In Visual Studio Code, open the **deployment.template.json** deployment manifest file. The [deployment manifest](module-deployment-monitoring.md#deployment-manifest) describes the modules to be configured on the targeted IoT Edge device. Before deployment, you need to update your Azure Container Registry credentials and your module images with the proper `createOptions` values. For more information about createOption values, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

::: zone pivot="iotedge-dev-cli"

If you're using an Azure Container Registry to store your module image, add your credentials to the **modulesContent** > **edgeAgent** > **settings** > **registryCredentials** section in **deployment.template.json**. Replace **myacr** with your own registry name and provide your password and **Login server** address. For example:

```json
"registryCredentials": {
    "myacr": {
        "username": "myacr",
        "password": "<your_acr_password>",
        "address": "myacr.azurecr.io"
    }
}
```

Add or replace the following stringified content to the *createOptions* value for each system (edgeHub and edgeAgent) and custom module (filtermodule and tempSensor) listed. Change the values if necessary.

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

#### Build module Docker image

Use the module's Dockerfile to [build](https://docs.docker.com/engine/reference/commandline/build/) the module Docker image.

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

[Push](https://docs.docker.com/engine/reference/commandline/push/) your module image to the local registry or a container registry.

```bash
docker push <ImageName>
```

For example:

```bash
# Push the Docker image to the local registry

docker push localhost:5000/filtermodule:0.0.1-amd64

# Or push the Docker image to an Azure Container Registry
az acr login --name myacr
docker push myacr.azurecr.io/filtermodule:0.0.1-amd64
```

#### Update the deployment template

Update the deployment template *deployment.template.json* with the container registry image location. For example, if you're using an Azure Container Registry *myacr.azurecr.io* and your image is *filtermodule:0.0.1-amd64*, update the *filtermodule* configuration to:

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
}
```

::: zone-end

::: zone pivot="iotedge-dev-ext"

In the Visual Studio Code explorer, right-click the **deployment.template.json** file and select **Build and Push IoT Edge Solution**.

The build and push command starts three operations. First, it creates a new folder in the solution called **config** that holds the full deployment manifest, built out of information in the deployment template and other solution files. Second, it runs `docker build` to build the container image based on the appropriate dockerfile for your target architecture. Then, it runs `docker push` to push the image repository to your container registry.

This process may take several minutes the first time, but is faster the next time that you run the commands.

::: zone-end

#### Update the build and image

If you make changes to your module code, you need to rebuild and push the module image to your container registry. Use the steps in this section to update the build and image. You can skip this section if you didn't make any changes to your module code.

::: zone pivot="iotedge-dev-ext"

Open the **deployment.amd64.json** file in newly created config folder. The filename reflects the target architecture, so it's different if you chose a different architecture.

Notice that the two parameters that had placeholders now contain their proper values. The **registryCredentials** section has your registry username and password pulled from the *.env* file. The **filtermodule** has the full image repository with the name, version, and architecture tag from the *module.json* file.

::: zone-end

1. Open the **module.json** file in the *filtermodule* folder.

1. Change the version number for the module image. For example, increment the patch version number to `"version": "0.0.2"` as if you made a small fix in the module code.

   >[!TIP]
   >Module versions enable version control, and allow you to test changes on a small set of devices before deploying updates to production. If you don't increment the module version before building and pushing, then you overwrite the repository in your container registry.

1. Save your changes to the **module.json** file.

::: zone pivot="iotedge-dev-cli"

Build and push the updated image with a *0.0.2* version tag.

For example, to build and push the image for the local registry or an Azure container registry, use the following commands:

```bash
# Build and push the 0.0.2 image for the local registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t localhost:5000/filtermodule:0.0.2-amd64 "./modules/filtermodule"

docker push localhost:5000/filtermodule:0.0.2-amd64

# Or build and push the 0.0.2 image for an Azure Container Registry

docker build --rm -f "./modules/filtermodule/Dockerfile.amd64.debug" -t myacr.azurecr.io/filtermodule:0.0.2-amd64 "./modules/filtermodule"

docker push myacr.azurecr.io/filtermodule:0.0.2-amd64
```

::: zone-end

::: zone pivot="iotedge-dev-ext"

Right-click the **deployment.template.json** file again, and again select **Build and Push IoT Edge Solution**.

::: zone-end

Open the **deployment.amd64.json** file again. Notice the build system doesn't create a new file when you run the build and push command again. Rather, the same file updates to reflect the changes. The *filtermodule* image now points to the 0.0.2 version of the container.

To further verify what the build and push command did, go to the [Azure portal](https://portal.azure.com) and navigate to your container registry.

In your container registry, select **Repositories** then **filtermodule**. Verify that both versions of the image push to the registry.

:::image type="content" source="./media/tutorial-develop-for-linux/view-repository-versions.png" alt-text="Screenshot of where to view both image versions in your container registry." lightbox="./media/tutorial-develop-for-linux/view-repository-versions.png":::

<!--Alternative steps: Use Visual Studio Code Docker tools to view ACR images with tags-->

### Troubleshoot

If you encounter errors when building and pushing your module image, it often has to do with Docker configuration on your development machine. Use the following checks to review your configuration:

* Did you run the `docker login` command using the credentials that you copied from your container registry? These credentials are different than the ones that you use to sign in to Azure.
* Is your container repository correct? Does it have your correct container registry name and your correct module name? Open the **module.json** file in the *filtermodule* folder to check. The repository value should look like **\<registry name\>.azurecr.io/filtermodule**.
* If you used a different name than **filtermodule** for your module, is that name consistent throughout the solution?
* Is your machine running the same type of containers that you're building? This tutorial is for Linux IoT Edge devices, so Visual Studio Code should say **amd64** or **arm32v7** in the side bar, and Docker Desktop should be running Linux containers.

## Deploy modules to device

You verified that there are built container images stored in your container registry, so it's time to deploy them to a device. Make sure that your IoT Edge device is up and running.

::: zone pivot="iotedge-dev-cli"

Use the [IoT Edge Azure CLI set-modules](/cli/azure/iot/edge#az-iot-edge-set-modules) command to deploy the modules to the Azure IoT Hub. For example, to deploy the modules defined in the *deployment.template.json* file to IoT Hub *my-iot-hub* for the IoT Edge device *my-device*, use the following command. Replace the values for **hub-name**, **device-id**, and **login** IoT Hub connection string with your own.

```azurecli
az iot edge set-modules --hub-name my-iot-hub --device-id my-device --content ./deployment.template.json --login "HostName=my-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>"
```

> [!TIP]
> You can find your IoT Hub connection string including the shared access key in the Azure portal. Go to your IoT Hub > **Security settings** > **Shared access policies** > **iothubowner**.
>

::: zone-end

::: zone pivot="iotedge-dev-ext"

1. In the Visual Studio Code explorer, under the **Azure IoT Hub** section, expand **Devices** to see your list of IoT devices.

1. Right-click the IoT Edge device that you want to deploy to, then select **Create Deployment for Single Device**.

1. In the file explorer, navigate into the **config** folder then select the **deployment.amd64.json** file.

   Don't use the deployment.template.json file, which doesn't have the container registry credentials or module image values in it. If you target a Linux ARM32 device, the deployment manifest's name is **deployment.arm32v7.json**.

1. Under your device, expand **Modules** to see a list of deployed and running modules. Select the refresh button. You should see the new *tempSensor* and *filtermodule* modules running on your device.

   It may take a few minutes for the modules to start. The IoT Edge runtime needs to receive its new deployment manifest, pull down the module images from the container runtime, then start each new module.

## View messages from device

The sample module code receives messages through its input queue and passes them along through its output queue. The deployment manifest declared routes that passed messages to *filtermodule* from *tempSensor*, and then forwarded messages from *filtermodule* to IoT Hub. The Azure IoT Edge and Azure IoT Hub extensions allow you to see messages as they arrive at IoT Hub from your individual devices.

1. In the Visual Studio Code explorer, right-click the IoT Edge device that you want to monitor, then select **Start Monitoring Built-in Event Endpoint**.

1. Watch the output window in Visual Studio Code to see messages arriving at your IoT hub.

   :::image type="content" source="./media/tutorial-develop-for-linux/view-d2c-messages.png" alt-text="Screenshot showing where to view incoming device to cloud messages.":::

::: zone-end

## View changes on device

If you want to see what's happening on your device itself, use the commands in this section to inspect the IoT Edge runtime and modules running on your device.

The commands in this section are for your IoT Edge device, not your development machine. If you're using a virtual machine for your IoT Edge device, connect to it now. In Azure, go to the virtual machine's overview page and select **Connect** to access the secure shell connection.

* View all modules deployed to your device, and check their status:

   ```bash
   iotedge list
   ```

   You should see four modules: the two IoT Edge runtime modules, *tempSensor*, and *filtermodule*. You should see all four listed as running.

* Inspect the logs for a specific module:

   ```bash
   iotedge logs <module name>
   ```

   IoT Edge modules are case-sensitive.

   The *tempSensor* and *filtermodule* logs should show the messages they're processing. The edgeAgent module is responsible for starting the other modules, so its logs have information about implementing the deployment manifest. If you find a module is unlisted or not running, the edgeAgent logs likely have the errors. The edgeHub module is responsible for communications between the modules and IoT Hub. If the modules are up and running, but the messages aren't arriving at your IoT hub, the edgeHub logs likely have the errors.

## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, you can delete the local configurations and the Azure resources that you used in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you set up Visual Studio Code on your development machine and deployed your first IoT Edge module that contains code to filter raw data generated by your IoT Edge device.

You can continue on to the next tutorials to learn how Azure IoT Edge can help you deploy Azure cloud services to process and analyze data at the edge.

> [!div class="nextstepaction"]
> [Debug Azure IoT Edge modules](debug-module-vs-code.md)
> [Functions](tutorial-deploy-function.md)
> [Stream Analytics](tutorial-deploy-stream-analytics.md)
> [Custom Vision Service](tutorial-deploy-custom-vision.md)
