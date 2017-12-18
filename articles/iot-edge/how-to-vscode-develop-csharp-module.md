---
title: Use Visual Studio Code to develop C# module with Azure IoT Edge | Microsoft Docs
description: Use Visual Studio Code to debug C# module with Azure IoT Edge
services: iot-edge
keywords: 
author: shizn
manager: timlt

ms.author: xshi
ms.date: 12/06/2017
ms.topic: article
ms.service: iot-edge

---

# Use Visual Studio Code to develop C# module with Azure IoT Edge
This article provides detailed instructions for using [Visual Studio Code](https://code.visualstudio.com/) as the main development tool to develop and deploy your IoT Edge modules. 

## Prerequisites
This tutorial assumes that your're using a computer or virtual machine running Windows or Linux as your development machine. Your IoT Edge device could be another physical device or you can simulate your IoT Edge device on your development machine.

Make sure you have completed below tutorials before you start this guidence.
- Deploy Azure IoT Edge on a simulated device in [Windows](https://docs.microsoft.com/azure/iot-edge/tutorial-simulate-device-windows) or [Linux](https://docs.microsoft.com/azure/iot-edge/tutorial-simulate-device-linux)
- [Develop and deploy a C# IoT Edge module to your simulated device](https://docs.microsoft.com/azure/iot-edge/tutorial-csharp-module)

Here is a checklist which shows the items you should have after you finish above tutorials.

- [Visual Studio Code](https://code.visualstudio.com/). 
- [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge). 
- [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp). 
- [Docker](https://docs.docker.com/engine/installation/)
- [.NET Core 2.0 SDK](https://www.microsoft.com/net/core#windowscmd). 
- [Python 2.7](https://www.python.org/downloads/)
- [IoT Edge control script](https://pypi.python.org/pypi/azure-iot-edge-runtime-ctl)
- AzureIoTEdgeModule template (`dotnet new -i Microsoft.Azure.IoT.Edge.Module`)
- An active IoT hub with at least an IoT Edge device.

It is also suggested to install [Docker support for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) to better manage your module images and containers.

## Deploy an Azure IoT Edge module in VS Code

### List your IoT hub devices
There are two ways to list your IoT hub devices in your VS Code. You can choose either way to continue.

#### Sign-in your Azure account in VSCode and choose your IoT hub
1. In Command Palette (F1 or Ctrl + Shift + P), type and select **Azure: Sign in**. Then click **Copy* & Open** in the pop-up. Paste (Ctrl + V) the code in your broswer and click Continue button. Then login with your Azure account. You can see your account info in VS Code status bar.
2. In Command Palette (F1 or Ctrl + Shift + P), type and select **IoT: Select IoT Hub**. You will first select the subscription where you created your IoT hub in previous tutorial. Then choose the IoT hub which contains the IoT Edge device.


#### Set IoT hub connection string
1. In Command Palette (F1 or Ctrl + Shift + P), type and select **IoT: Set IoT Hub Connection String**. Make sure you paste the connecting string under policy **iothubowner** (You can find it in Shared access policies of your IoT hub in Azure Portal).
 

You can see the device list in IoT Hub Devices Explorer in left Side Bar.

### Start your IoT Edge runtime and deploy a module
Install and start the Azure IoT Edge runtime on your device. And deploy an simulated sensor module which will send telemetry data to IoT Hub.
1. In Command Palette, select **Edge: Setup Edge** and and choose your IoT Edge device ID. Or right-click the Edge device ID in Device List and select **Setup Edge**.
2. In Command Palette, select **Edge: Start Edge** to start your Edge runtime. You will see below outputs in integrated terminal.
3. Check the Edge runtime status in the Docker explorer. Green means it's running. Your IoT Edge runtime is successfuly started.
4. Now your Edge runtime is running, which means your PC now simulate an Edge device. Next step is to simulate a sensorthing that keeps sending messages to your Edge device. In Command Palette, Type and select **Edge: Generate Edge configuration file**. And select a folder to create this file. In the generated deployment.json file please replace the line "<registry>/<image>:<tag>" with `microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview`.
5. Select **Edge: Create deployment for Edge device** and choose the Edge device ID to create a new deployment. Or you can right-click the Edge device ID in the device list and select **Create deployment for Edge device**. 
6. You will see your IoT Edge start running in the Docker explorer with the simulated sensor. Right-click the container in Docker explorer. You can watch docker logs for each module.
7. Right click your Edge device ID, and you can monitor D2C messages in VS Code.
8. To stop your IoT Edge runtime and the sensor module, you can type and select **Edge: Stop Edge** in Command Palette.

## Develop and deploy a C# module
In tutorial [Develop a C# module](https://docs.microsoft.com/azure/iot-edge/tutorial-csharp-module), you update, build and publish your module image in VS Code and then visit Azure Portal to deploy your C# module. This section will introduce how to use VS Code to deploy and monitor your C# module.

### Start a local docker registry
You can use any Docker-compatible registry for this tutorial. Two popular Docker registry services available in the cloud are [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This section uses an [local Docker registry](https://docs.docker.com/registry/deploying/), which is easier for testing purpose during your early development.
In VS Code **integrated terminal**(Ctrl + `), Run below commands to start a local registry.  

```cmd/sh
docker run -d -p 5000:5000 --name registry registry:2 
```

> [!NOTE]
> Above example shows registry configurations that are only appropriate for testing. A production-ready registry must be protected by TLS and should ideally use an access-control mechanism. We recommend you use [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) or [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags) to deploy production-ready IoT Edge modules.

### Create an IoT Edge module project
The following steps show you how to create an IoT Edge module based on .NET core 2.0 using Visual Studio Code and the Azure IoT Edge extension. If you have completed this section in previous tutorial, you can safely skip this section.
1. In Visual Studio Code, select **View** > **Integrated Terminal** to open the VS Code integrated terminal.
3. In the integrated terminal, enter the following command to install (or update) the **AzureIoTEdgeModule** template in dotnet:

    ```cmd/sh
    dotnet new -i Microsoft.Azure.IoT.Edge.Module
    ```

2. Create a project for the new module. The following command creates the project folder, **FilterModule**, in the current working folder:

    ```cmd/sh
    dotnet new aziotedgemodule -n FilterModule
    ```
 
3. Select  **File** > **Open Folder**.
4. Browse to the **FilterModule**  folder and click **Select Folder** to open the project in VS Code.
5. In VS Code explorer, click **Program.cs** to open it.

   ![Open Program.cs][1]

6. Add the `temperatureThreshold` variable to the **Program** class. This variable sets the value that the measured temperature must exceed in order for the data to be sent to IoT Hub. 

    ```csharp
    static int temperatureThreshold { get; set; } = 25;
    ```

7. Add the `MessageBody`, `Machine`, and `Ambient` classes to the **Program** class. These classes define the expected schema for the body of incoming messages.

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

8. In the **Init** method, the code creates and configures a **DeviceClient** object. This object allows the module to  connect to the local Azure IoT Edge runtime to send and receive messages. The connection string used in the **Init** method is supplied to the module by IoT Edge runtime. After creating the **DeviceClient**, the code registers a callback for receiving messages from the IoT Edge hub via the **input1** endpoint. Replace the `SetInputMessageHandlerAsync` method with a new one, and add a `SetDesiredPropertyUpdateCallbackAsync` method for desired properties updates. To make this change, replace the last line of the **Init** method with the following code:

    ```csharp
    // Register callback to be called when a message is received by the module
    // await ioTHubModuleClient.SetImputMessageHandlerAsync("input1", PipeMessage, iotHubModuleClient);

    // Attach callback for Twin desired properties updates
    await ioTHubModuleClient.SetDesiredPropertyUpdateCallbackAsync(onDesiredPropertiesUpdate, null);

    // Register callback to be called when a message is received by the module
    await ioTHubModuleClient.SetInputMessageHandlerAsync("input1", FilterMessages, ioTHubModuleClient);
    ```

9. Add the `onDesiredPropertiesUpdate` method to the **Program** class. This method receives updates on the desired properties from the module twin, and updates the **temperatureThreshold** variable to match. All modules have their own module twin, which lets you configure the code running inside a module directly from the cloud.

    ```csharp
    static Task onDesiredPropertiesUpdate(TwinCollection desiredProperties, object userContext)
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

10. Replace the `PipeMessage` method with the `FilterMessages` method. This method is called whenever the module receives a message from the IoT Edge hub. It filters out messages that report temperatures below the temperature threshold set via the module twin. It also adds the **MessageType** property to the message with the value set to **Alert**. 

    ```csharp
    static async Task<MessageResponse> FilterMessages(Message message, object userContext)
    {
        int counterValue = Interlocked.Increment(ref counter);

        try {
            DeviceClient deviceClient = (DeviceClient)userContext;

            byte[] messageBytes = message.GetBytes();
            string messageString = Encoding.UTF8.GetString(messageBytes);
            Console.WriteLine($"Received message {counterValue}: [{messageString}]");

            // Get message body
            var messageBody = JsonConvert.DeserializeObject<MessageBody>(messageString);

            if (messageBody != null && messageBody.machine.temperature > temperatureThreshold)
            {
                Console.WriteLine($"Machine temperature {messageBody.machine.temperature} " +
                    $"exceeds threshold {temperatureThreshold}");
                var filteredMessage = new Message(messageBytes);
                foreach (KeyValuePair<string, string> prop in message.Properties)
                {
                    filteredMessage.Properties.Add(prop.Key, prop.Value);
                }

                filteredMessage.Properties.Add("MessageType", "Alert");
                await deviceClient.SendEventAsync("output1", filteredMessage);
            }

            // Indicate that the message treatment is completed
            return MessageResponse.Completed;
        }
        catch (AggregateException ex)
        {
            foreach (Exception exception in ex.InnerExceptions)
            {
                Console.WriteLine();
                Console.WriteLine("Error in sample: {0}", exception);
            }
            // Indicate that the message treatment is not completed
            DeviceClient deviceClient = (DeviceClient)userContext;
            return MessageResponse.Abandoned;
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("Error in sample: {0}", ex.Message);
            // Indicate that the message treatment is not completed
            DeviceClient deviceClient = (DeviceClient)userContext;
            return MessageResponse.Abandoned;
        }
    }
    ```

11. To build the project, right-click the **FilterModule.csproj** file in the Explorer and click **Build IoT Edge module**. This process compiles the module and exports the binary and its dependencies into a folder that is used to create a Docker image.


### Create a Docker image and publish it to your registry

1. In VS Code explorer, expand the **Docker** folder. Then expand the folder for your container platform, either **linux-x64** or **windows-nano**.
2. Right-click the **Dockerfile** file and click **Build IoT Edge module Docker image**. 
3. In the **Select Folder** window, either browse to or enter `./bin/Debug/netcoreapp2.0/publish`. Click **Select Folder as EXE_DIR**.
4. In the pop-up text box at the top of the VS Code window, enter the image name. For example: `<your container registry address>/filtermodule:latest`. If you are deploying to local registry, it should be `localhost:5000/filtermodule:latest`.
5. Push the image to your Docker repository. Use the **Edge: Push IoT Edge module Docker image** command and enter the image URL in the pop-up text box at the top of the VS Code window. Use the same image URL you used in above step.

### Deploy your IoT Edge modules

1. Open the `deployment.json` file, replace **modules** section with below content:
    ```json
    "tempSensor": {
        "version": "1.0",
        "type": "docker",
        "status": "running",
        "restartPolicy": "always",
        "settings": {
            "image": "microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview",
            "createOptions": ""
        }
    },
    "filtermodule": {
        "version": "1.0",
        "type": "docker",
        "status": "running",
        "restartPolicy": "always",
        "settings": {
            "image": "localhost:5000/filtermodule:latest",
            "createOptions": ""
        }
    }
    ```

2. Replace the **routes** section with below content:
    ```json
    {
        "routes": {
            "sensorToFilter": "FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/filtermodule/inputs/input1\")",
            "filterToIoTHub": "FROM /messages/modules/filtermodule/outputs/output1 INTO $upstream"
        }
    }
    ```
   > [!NOTE]
   > Declarative rules in the runtime define where those messages flow. In this tutorial you need two routes. The first route transports messages from the temperature sensor to the filter module via the "input1" endpoint, which is the endpoint that you configured with the FilterMessages handler. The second route transports messages from the filter module to IoT Hub. In this route, upstream is a special destination that tells Edge Hub to send messages to IoT Hub.

3. Save this file.
4. In Command Palette, select **Edge: Create deployment for Edge device**. Then select your IoT Edge device ID to create a deployment. Or right-click the device ID in the device list and select **Create deployment for Edge device**.
5. Select the `deployment.json` you just updated. In the output window, you can see corresponding outputs for your deployment.
6. Start your Edge runtime in Command Palette. **Edge: Start Edge**
7. You will see your IoT Edge runtime start running in the Docker explorer with the simulated sensor and filter module.
8. Right click your Edge device ID, and you can monitor D2C messages in VS Code.