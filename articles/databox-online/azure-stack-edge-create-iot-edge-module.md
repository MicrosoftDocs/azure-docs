---
title: C# IoT Edge module for Azure Stack Edge Pro | Microsoft Docs
description: Learn how to develop a C# IoT Edge module that can be deployed on your Azure Stack Edge Pro.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/06/2019
ms.author: alkohli
ms.custom: devx-track-csharp
---

# Develop a C# IoT Edge module to move files with Azure Stack Edge Pro

This article steps you through how to create an IoT Edge module for deployment with your Azure Stack Edge Pro device. Azure Stack Edge Pro is a storage solution that allows you to process data and send it over network to Azure.

You can use Azure IoT Edge modules with your Azure Stack Edge Pro to transform the data as it moved to Azure. The module used in this article implements the logic to copy a file from a local share to a cloud share on your Azure Stack Edge Pro device.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Create a container registry to store and manage your modules (Docker images).
> * Create an IoT Edge module to deploy on your Azure Stack Edge Pro device. 


## About the IoT Edge module

Your Azure Stack Edge Pro device can deploy and run IoT Edge modules. Edge modules are essentially Docker containers that perform a specific task, such as ingest a message from a device, transform a message, or send a message to an IoT Hub. In this article, you will create a module that copies files from a local share to a cloud share on your Azure Stack Edge Pro device.

1. Files are written to the local share on your Azure Stack Edge Pro device.
2. The file event generator creates a file event for each file written to the local share. The file events are also generated when a file is modified. The file events are then sent to IoT Edge Hub (in IoT Edge runtime).
3. The IoT Edge custom module processes the file event to create a file event object that also contains a relative path for the file. The module generates an absolute path using the relative file path and copies the file from the local share to the cloud share. The module then deletes the file from the local share.

![How Azure IoT Edge module works on Azure Stack Edge Pro](./media/azure-stack-edge-create-iot-edge-module/how-module-works-1.png)

Once the file is in the cloud share, it automatically gets uploaded to your Azure Storage account.

## Prerequisites

Before you begin, make sure you have:

- An Azure Stack Edge Pro device that is running.

    - The device also has an associated IoT Hub resource.
    - The device has Edge compute role configured.
    For more information, go to [Configure compute](azure-stack-edge-deploy-configure-compute.md#configure-compute) for your Azure Stack Edge Pro.

- The following development resources:

    - [Visual Studio Code](https://code.visualstudio.com/).
    - [C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp).
    - [Azure IoT Edge extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge).
    - [.NET Core 2.1 SDK](https://dotnet.microsoft.com/download/dotnet/2.1).
    - [Docker CE](https://store.docker.com/editions/community/docker-ce-desktop-windows). You may have to create an account to download and install the software.

## Create a container registry

An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. The two popular Docker registry services available in the cloud are Azure Container Registry and Docker Hub. This article uses the Container Registry.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Select **Create a resource > Containers > Container Registry**. Click **Create**.
3. Provide:

   1. A unique **Registry name** within Azure that contains 5 to 50 alphanumeric characters.
   2. Choose a **Subscription**.
   3. Create new or choose an existing **Resource group**.
   4. Select a **Location**. We recommend that this location be the same as that is associated with the Azure Stack Edge resource.
   5. Toggle **Admin user** to **Enable**.
   6. Set the SKU to **Basic**.

      ![Create container registry](./media/azure-stack-edge-create-iot-edge-module/create-container-registry-1.png)
 
4. Select **Create**.
5. After your container registry is created, browse to it, and select **Access keys**.

    ![Get Access keys](./media/azure-stack-edge-create-iot-edge-module/get-access-keys-1.png)
 
6. Copy the values for **Login server**, **Username**, and **Password**. You use these values later to publish the Docker image to your registry and to add the registry credentials to the Azure IoT Edge runtime.


## Create an IoT Edge module project

The following steps create an IoT Edge module project based on the .NET Core 2.1 SDK. The project uses Visual Studio Code and the Azure IoT Edge extension.

### Create a new solution

Create a C# solution template that you can customize with your own code.

1. In Visual Studio Code, select **View > Command Palette** to open the VS Code command palette.
2. In the command palette, enter and run the command **Azure: Sign in** and follow the instructions to sign in your Azure account. If you're already signed in, you can skip this step.
3. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge solution**. In the command palette, provide the following information to create your solution:

    1. Select the folder where you want to create the solution.
    2. Provide a name for your solution or accept the default **EdgeSolution**.
    
        ![Create new solution 1](./media/azure-stack-edge-create-iot-edge-module/create-new-solution-1.png)

    3. Choose **C# Module** as the module template.
    4. Replace the default module name with the name you want to assign, in this case, it is **FileCopyModule**.
    
        ![Create new solution 2](./media/azure-stack-edge-create-iot-edge-module/create-new-solution-2.png)

    5. Specify the container registry that you created in the previous section as the image repository for your first module. Replace **localhost:5000** with the login server value that you copied.

        The final string looks like `<Login server name>/<Module name>`. In this example, the string is: `mycontreg2.azurecr.io/filecopymodule`.

        ![Create new solution 3](./media/azure-stack-edge-create-iot-edge-module/create-new-solution-3.png)

4. Go to **File > Open Folder**.

    ![Create new solution 4](./media/azure-stack-edge-create-iot-edge-module/create-new-solution-4.png)

5. Browse and point to the **EdgeSolution** folder that you created earlier. The VS Code window loads your IoT Edge solution workspace with its five top-level components. You won't edit the **.vscode** folder, **.gitignore** file, **.env** file, and the **deployment.template.json** in this article.
    
    The only component that you modify is the modules folder. This folder has the C# code for your module and Docker files to build your module as a container image.

    ![Create new solution 5](./media/azure-stack-edge-create-iot-edge-module/create-new-solution-5.png)

### Update the module with custom code

1. In the VS Code explorer, open **modules > FileCopyModule > Program.cs**.
2. At the top of the **FileCopyModule namespace**, add the following using statements for types that are used later. **Microsoft.Azure.Devices.Client.Transport.Mqtt** is a protocol to send messages to IoT Edge Hub.

    ```
    namespace FileCopyModule
    {
        using Microsoft.Azure.Devices.Client.Transport.Mqtt;
        using Newtonsoft.Json;
    ```
3. Add the **InputFolderPath** and **OutputFolderPath** variable to the Program class.

    ```
    class Program
        {
            static int counter;
            private const string InputFolderPath = "/home/input";
            private const string OutputFolderPath = "/home/output";
    ```

4. Immediately after the previous step, add the **FileEvent** class to define the message body.

    ```
    /// <summary>
    /// The FileEvent class defines the body of incoming messages. 
    /// </summary>
    private class FileEvent
    {
        public string ChangeType { get; set; }

        public string ShareRelativeFilePath { get; set; }

        public string ShareName { get; set; }
    }
    ```

5. In the **Init method**, the code creates and configures a **ModuleClient** object. This object allows the module to connect to the local Azure IoT Edge runtime using MQTT protocol to send and receive messages. The connection string that's used in the Init method is supplied to the module by the IoT Edge runtime. The code registers a FileCopy callback to receive messages from an IoT Edge hub via the **input1** endpoint. Replace the **Init method** with the following code.

    ```
    /// <summary>
    /// Initializes the ModuleClient and sets up the callback to receive
    /// messages containing file event information
    /// </summary>
    static async Task Init()
    {
        MqttTransportSettings mqttSetting = new MqttTransportSettings(TransportType.Mqtt_Tcp_Only);
        ITransportSettings[] settings = { mqttSetting };

        // Open a connection to the IoT Edge runtime
        ModuleClient ioTHubModuleClient = await ModuleClient.CreateFromEnvironmentAsync(settings);
        await ioTHubModuleClient.OpenAsync();
        Console.WriteLine("IoT Hub module client initialized.");

        // Register callback to be called when a message is received by the module
        await ioTHubModuleClient.SetInputMessageHandlerAsync("input1", FileCopy, ioTHubModuleClient);
    }
    ```

6. Remove the code for **PipeMessage method** and in its place, insert the code for **FileCopy**.

    ```
        /// <summary>
        /// This method is called whenever the module is sent a message from the IoT Edge Hub.
        /// This method deserializes the file event, extracts the corresponding relative file path, and creates the absolute input file path using the relative file path and the InputFolderPath.
        /// This method also forms the absolute output file path using the relative file path and the OutputFolderPath. It then copies the input file to output file and deletes the input file after the copy is complete.
        /// </summary>
        static async Task<MessageResponse> FileCopy(Message message, object userContext)
        {
            int counterValue = Interlocked.Increment(ref counter);

            try
            {
                byte[] messageBytes = message.GetBytes();
                string messageString = Encoding.UTF8.GetString(messageBytes);
                Console.WriteLine($"Received message: {counterValue}, Body: [{messageString}]");

                if (!string.IsNullOrEmpty(messageString))
                {
                    var fileEvent = JsonConvert.DeserializeObject<FileEvent>(messageString);

                    string relativeFileName = fileEvent.ShareRelativeFilePath.Replace("\\", "/");
                    string inputFilePath = InputFolderPath + relativeFileName;
                    string outputFilePath = OutputFolderPath + relativeFileName;

                    if (File.Exists(inputFilePath))                
                    {
                        Console.WriteLine($"Moving input file: {inputFilePath} to output file: {outputFilePath}");
                        var outputDir = Path.GetDirectoryName(outputFilePath);
                        if (!Directory.Exists(outputDir))
                        {
                            Directory.CreateDirectory(outputDir);
                        }

                        File.Copy(inputFilePath, outputFilePath, true);
                        Console.WriteLine($"Copied input file: {inputFilePath} to output file: {outputFilePath}");
                        File.Delete(inputFilePath);
                        Console.WriteLine($"Deleted input file: {inputFilePath}");
                    } 
                    else
                    {
                        Console.WriteLine($"Skipping this event as input file doesn't exist: {inputFilePath}");   
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Caught exception: {0}", ex.Message);
                Console.WriteLine(ex.StackTrace);
            }

            Console.WriteLine($"Processed event.");
            return MessageResponse.Completed;
        }
    ```

7. Save this file.
8. You can also [download an existing code sample](https://azure.microsoft.com/resources/samples/data-box-edge-csharp-modules/?cdn=disable) for this project. You can then validate the file that you saved against the **program.cs** file in this sample.

## Build your IoT Edge solution

In the previous section, you created an IoT Edge solution and added code to the FileCopyModule to copy files from local share to the cloud share. Now you need to build the solution as a container image and push it to your container registry.

1. In VSCode, go to Terminal > New Terminal to open a new Visual Studio Code integrated terminal.
2. Sign in to Docker by entering the following command in the integrated terminal.

    `docker login <ACR login server> -u <ACR username>`

    Use the login server and username that you copied from your container registry.

    ![Build and push IoT Edge solution](./media/azure-stack-edge-create-iot-edge-module/build-iot-edge-solution-1.png)

2. When prompted for password, supply the password. You can also retrieve the values for login server, username, and password from the **Access Keys** in your container registry in the Azure portal.
 
3. Once the credentials are supplied, you can push your module image to your Azure container registry. In the VS Code Explorer, right-click the **module.json** file and select **Build and Push IoT Edge solution**.

    ![Build and push IoT Edge solution 2](./media/azure-stack-edge-create-iot-edge-module/build-iot-edge-solution-2.png)
 
    When you tell Visual Studio Code to build your solution, it runs two commands in the integrated terminal: docker build and docker push. These two commands build your code, containerize the CSharpModule.dll, and then push the code to the container registry that you specified when you initialized the solution.

    You will be prompted to choose the module platform. Select *amd64* corresponding to Linux.

    ![Select platform](./media/azure-stack-edge-create-iot-edge-module/select-platform.png)

    > [!IMPORTANT] 
    > Only the Linux modules are supported.

    You may see the following warning that you can ignore:

    *Program.cs(77,44): warning CS1998: This async method lacks 'await' operators and will run synchronously. Consider using the 'await' operator to await non-blocking API calls, or 'await Task.Run(...)' to do CPU-bound work on a background thread.*

4. You can see the full container image address with tag in the VS Code integrated terminal. The image address is built from information that's in the module.json file with the format `<repository>:<version>-<platform>`. For this article, it should look like `mycontreg2.azurecr.io/filecopymodule:0.0.1-amd64`.

## Next steps

To deploy and run this module on Azure Stack Edge Pro, see the steps in [Add a module](azure-stack-edge-deploy-configure-compute.md#add-a-module).
