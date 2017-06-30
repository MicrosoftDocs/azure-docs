---
title: Creating Azure IoT Edge Module with C# | Microsoft Docs
description: Tutorial on how to build a BLE converter module for Azure IoT Edge with C# and NuGet packages using Visual Studio Code.
services: iot-hub
author: jeffreyCline
manager: sushi
keywords: 'azure, iot, tutorial, module, nuget, vscode, csharp, edge'

ms.service: iot-hub
ms.devlang: csharp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2017
ms.author: jcline
---
# Create an Azure IoT Edge Module with C&#x23;

This tutorial showcases how to create a module for `Azure IoT Edge` using `Visual Studio Code` and `C#`.

In this tutorial, we walk through environment set-up and how to write a [BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) data converter module using the latest `Azure IoT Edge NuGet` packages. 

>[!NOTE]
This tutorial is using the `.NET Core SDK`, which supports cross-platform compatibility. The following tutorial is written using the `Windows 10` operating system. Some of the commands in this tutorial may be different depending on your `development environment`. 

## Prerequisites

In this section, we set-up your environment for `Azure IoT Edge` module development. It applies to both **64-bit Windows** and **64-bit Linux (Ubuntu/Debian 8)** operating systems.

The following software is required:

- [Git Client](https://https://git-scm.com/downloads)
- [.NET Core SDK](https://www.microsoft.com/net/core#windowscmd)
- [Visual Studio Code](https://code.visualstudio.com/)

>[!NOTE]
You do not need to clone the repo for this sample, however all of the sample code discussed in this tutorial is located in the `Azure-Samples` following repository.

- `git clone https://github.com/Azure-Samples/iot-edge-samples.git`.
- `cd iot-edge-samples/dotnetcore/simulated_ble`

## Getting started

1. Install `.NET Core SDK`.
2. Install `Visual Studio Code` and the `C# extension` from the Visual Studio Code Marketplace.

View this [quick video tutorial](https://channel9.msdn.com/Blogs/dotnet/Get-started-VSCode-Csharp-NET-Core-Windows) about how to get started using `Visual Studio Code` and the `.NET Core SDK`.

## Creating the Azure IoT Edge converter module

1. Initialize a new `.NET Core` class library C# project:
	- Open a command prompt (`Windows + R` -> `cmd` -> `enter`).
	- Navigate to the folder where you'd like to create the `C#` project.
	- Type **dotnet new classlib -o IoTEdgeConverterModule -f netstandard1.3**. 
	- This command creates an empty class called `Class1.cs` in your projects directory.
2. Navigate to the folder where we just created the class library project by typing **cd IoTEdgeConverterModule**.
3. Open the project in `Visual Studio Code` by typing **code .**.
4. Once the project is opened in `Visual Studio Code`, click on the **IoTEdgeConverterModule.csproj** to open the file as shown in the following image:

	![Visual Studio Code edit window](media/iot-hub-iot-edge-create-module/vscode-edit-csproj.png)

5. Insert the `XML` blob shown in the following code snippet between the closing `PropertyGroup` tag and the closing `Project` tag; line six in the preceding image and save the file (`Ctrl + S`).

   ```xml
     <ItemGroup>
       <PackageReference Include="Microsoft.Azure.Devices.Gateway.Module.NetStandard" Version="1.0.5" />
       <PackageReference Include="System.Threading.Thread" Version="4.3.0" />
       <PackageReference Include="Newtonsoft.Json" Version="10.0.2" />
     </ItemGroup> 
   ```

6. Once you save the `.csproj` file, `Visual Studio Code` should prompt you with an `unresolved dependencies` dialog as seen in the following image: 

	![Visual Studio Code restore dependencies dialog](media/iot-hub-iot-edge-create-module/vscode-restore.png)

	a) Click `Restore` to restore all of the references in the projects `.csproj` file including the `PackageReferences` we have added. 

	b) You see a new `project.assets.json` file in your projects `obj` folder. This file contains information about your project's dependencies to make subsequent restores quicker.
 
    >[!NOTE]
	`.NET Core Tools` are now MSBuild-based. Which means a `.csproj` project file is created instead of a `project.json`.

	- If `Visual Studio Code` does not prompt you that is ok, we can do it manually. Open the `Visual Studio Code` integrated terminal window by pressing the `Ctrl` + `backtick` keys or using the menus `View` -> `Integrated Terminal`.
	- In the `Integrated Terminal` window type **dotnet restore**.
	
7. Rename the `Class1.cs` file to `BleConverterModule.cs`. 

    a) To rename the file first click on the file then press the `F2` key.
    
    b) Type in the new name **BleConverterModule**, as seen in the following image:

    ![Visual Studio Code renaming a class](media/iot-hub-iot-edge-create-module/vscode-rename.png)

8. Replace the existing code in the `BleConverterModule.cs` file by copying and pasting the following code snippet into your `BleConverterModule.cs` file.

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Globalization;
   using System.Linq;
   using System.Text;
   using System.Threading;
   using System.Threading.Tasks;
   using Microsoft.Azure.Devices.Gateway;
   using Newtonsoft.Json;
   
   namespace IoTEdgeConverterModule
   {
       public class BleConverterModule : IGatewayModule, IGatewayModuleStart
       {
           private Broker broker;
           private string configuration;
           private int messageCount;

           public void Create(Broker broker, byte[] configuration)
           {
               this.broker = broker;
               this.configuration = System.Text.Encoding.UTF8.GetString(configuration);
           }
   
           public void Start()
           {
           }

           public void Destroy()
           {
           }

           public void Receive(Message received_message)
           {
               string recMsg = Encoding.UTF8.GetString(received_message.Content, 0, received_message.Content.Length);
               BleData receivedData = JsonConvert.DeserializeObject<BleData>(recMsg);

               float temperature = float.Parse(receivedData.Temperature, CultureInfo.InvariantCulture.NumberFormat); 
               Dictionary<string, string> receivedProperties = received_message.Properties;
            
               Dictionary<string, string> properties = new Dictionary<string, string>();
               properties.Add("source", receivedProperties["source"]);
               properties.Add("macAddress", receivedProperties["macAddress"]);
               properties.Add("temperatureAlert", temperature > 30 ? "true" : "false");
   
               String content = String.Format("{0} \"deviceId\": \"Intel NUC Gateway\", \"messageId\": {1}, \"temperature\": {2} {3}", "{", ++this.messageCount, temperature, "}");
               Message messageToPublish = new Message(content, properties);
   
               this.broker.Publish(messageToPublish);
           }
       }
   }
   ```

9. Save the file by pressing `Ctrl` + `S`.

10. Create a new file called `Untitled-1` by pressing the `Ctrl` + `N` keys as seen in the following image:

    ![Visual Studio Code new file](media/iot-hub-iot-edge-create-module/vscode-new-file.png)

11. To deserialize the `JSON` object that we receive from the simulated `BLE` device, copy the following code into the `Untitled-1` file code editor window. 

   ```csharp
    System;
   using Newtonsoft.Json;

   namespace IoTEdgeConverterModule
   {
       public class BleData
       {
           [JsonProperty(PropertyName = "temperature")]
           public string Temperature { get; set; }
       }
   }
   ```

12. Save the file as `BleData.cs` by pressing `Ctrl` + `Shift` + `S` keys.
    - On the save as dialog box, in the `Save as Type` dropdown menu, select `C# (*.cs;*.csx)` as seen in the following image:

    ![Visual Studio Code save as dialog](media/iot-hub-iot-edge-create-module/vscode-save-as.png)

13. Create a new file called `Untitled-1` by pressing the `Ctrl` + `N` keys.

14. Copy and paste the following code snippet into the `Untitled-1` file. This class is a `Azure IoT Edge` module, which we use to output the data received from our `BleConverterModule`.

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Linq;
   using System.Text;
   using System.Threading.Tasks;
   using Microsoft.Azure.Devices.Gateway;
   using Newtonsoft.Json;
   
   namespace PrinterModule
   {
       public class DotNetPrinterModule : IGatewayModule
       {
           private string configuration;
           public void Create(Broker broker, byte[] configuration)
           {
               this.configuration = System.Text.Encoding.UTF8.GetString(configuration);
           }
   
           public void Destroy()
           {
           }
   
           public void Receive(Message received_message)
           {
               string recMsg = System.Text.Encoding.UTF8.GetString(received_message.Content, 0, received_message.Content.Length);
               Dictionary<string, string> receivedProperties = received_message.Properties;
               
               BleConverterData receivedData = JsonConvert.DeserializeObject<BleConverterData>(recMsg);
   
               Console.WriteLine();
               Console.WriteLine("Module           : [DotNetPrinterModule]");
               Console.WriteLine("received_message : {0}", recMsg);
   
               if(received_message.Properties["source"] == "bleTelemetry")
               {
                   Console.WriteLine("Source           : {0}", receivedProperties["source"]);
                   Console.WriteLine("MAC address      : {0}", receivedProperties["macAddress"]);
                   Console.WriteLine("Temperature Alert: {0}", receivedProperties["temperatureAlert"]);
                   Console.WriteLine("Deserialized Obj : [BleConverterData]");
                   Console.WriteLine("  DeviceId       : {0}", receivedData.DeviceId);
                   Console.WriteLine("  MessageId      : {0}", receivedData.MessageId);
                   Console.WriteLine("  Temperature    : {0}", receivedData.Temperature);
               }
   
               Console.WriteLine();
           }
       }
   }
   ```

15. Save the file as `DotNetPrinterModule.cs` by pressing `Ctrl` + `Shift` + `S`.
    - On the save as dialog box, in the `Save as Type` dropdown menu, select `C# (*.cs;*.csx)`.

16. Create a new file called `Untitled-1` by pressing the `Ctrl` + `N` keys.

17. To deserialize the `JSON` object that we receive from the `BleConverterModule`, Copy and paste the following code snippet into the `Untitled-1` file. 

   ```csharp
   using System;
   using Newtonsoft.Json;

   namespace PrinterModule
   {
       public class BleConverterData
       {
           [JsonProperty(PropertyName = "deviceId")]
           public string DeviceId { get; set; }
   
           [JsonProperty(PropertyName = "messageId")]
           public string MessageId { get; set; }
   
           [JsonProperty(PropertyName = "temperature")]
           public string Temperature { get; set; }
       }
   }
   ```

18. Save the file as `BleConverterData.cs` by pressing `Ctrl` + `Shift` + `S`.
    - On the save as dialog box, in the `Save as Type` dropdown menu, select `C# (*.cs;*.csx)`.

19. Create a new file called `Untitled-1` by pressing the `Ctrl` + `N` keys.

20. Copy and paste the following code snippet into the `Untitled-1` file.

   ```json
   {
       "loaders": [
           {
               "type": "dotnetcore",
               "name": "dotnetcore",
               "configuration": {
                   "binding.path": "dotnetcore.dll",
                   "binding.coreclrpath": "C:\\Program Files\\dotnet\\shared\\Microsoft.NETCore.App\\1.1.1\\coreclr.dll",
                   "binding.trustedplatformassemblieslocation": "C:\\Program Files\\dotnet\\shared\\Microsoft.NETCore.App\\1.1.1\\"
               }
           }
       ],
          "modules": [
           {
               "name": "simulated_device",
               "loader": {
                   "name": "native",
                   "entrypoint": {
                       "module.path": "simulated_device.dll"
                   }
               },
               "args": {
                   "macAddress": "01:02:03:03:02:01",
                   "messagePeriod": 500
               }
           },
           {
               "name": "ble_converter_module",
               "loader": {
                   "name": "dotnetcore",
                   "entrypoint": {
                       "assembly.name": "IoTEdgeConverterModule",
                       "entry.type": "IoTEdgeConverterModule.BleConverterModule"
                   }
               },
               "args": ""
           },
           {
               "name": "printer_module",
               "loader": {
                   "name": "dotnetcore",
                   "entrypoint": {
                       "assembly.name": "IoTEdgeConverterModule",
                       "entry.type": "PrinterModule.DotNetPrinterModule"
                   }
               },
               "args": ""
           }
       ],
       "links": [
           {
               "source": "simulated_device", "sink": "ble_converter_module"
           },
           {
               "source": "ble_converter_module", "sink": "printer_module"
           }
   ]
   }
   ```

21. Save the file as `gw-config.json` by pressing `Ctrl` + `Shift` + `S`.
    - On the save as dialog box, in the `Save as Type` dropdown menu, select `JSON (*.json;*.bowerrc;*.jshintrc;*.jscsrc;*.eslintrc;*.babelrc;*webmanifest)`.

22. To enable copying of the configuration file to the output directory, update the `IoTEdgeConverterModule.csproj` with the following XML blob:

   ```xml
     <ItemGroup>
       <None Update="gw-config.json" CopyToOutputDirectory="PreserveNewest" />
     </ItemGroup>
   ```
    
- The updated `IoTEdgeConverterModule.csproj` should look like the following image:

    ![Visual Studio Code updated .csproj file](media/iot-hub-iot-edge-create-module/vscode-update-csproj.png)

23. Create a new file called `Untitled-1` by pressing the `Ctrl` + `N` keys.

24. Copy and paste the following code snippet into the `Untitled-1` file.

   ```powershell
   Copy-Item -Path $env:userprofile\.nuget\packages\microsoft.azure.devices.gateway.native.windows.x64\1.1.3\runtimes\win-x64\native\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\system.runtime.serialization.formatters\4.3.0\lib\netstandard1.4\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\system.runtime.serialization.primitives\4.3.0\lib\netstandard1.3\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\newtonsoft.json\10.0.2\lib\netstandard1.3\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\system.componentmodel.typeconverter\4.3.0\lib\netstandard1.5\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\system.collections.nongeneric\4.3.0\lib\netstandard1.3\* -Destination .\bin\Debug\netstandard1.3
   Copy-Item -Path $env:userprofile\.nuget\packages\system.collections.specialized\4.3.0\lib\netstandard1.3\* -Destination .\bin\Debug\netstandard1.3
   ```

25. Save the file as `binplace.ps1` by pressing `Ctrl` + `Shift` + `S`.
    - On the save as dialog box, in the `Save as Type` dropdown menu, select `PowerShell (*.ps1;*.psm1;*.psd1;*.pssc;*.psrc)`.

26. Build the project by pressing the `Ctrl` + `Shift` + `B` keys. When you build the project for the first time, `Visual Studio Code` prompts you with the `No build task defined.` dialog as seen in the following image:

	![Visual Studio Code build task dialog](media/iot-hub-iot-edge-create-module/vscode-build-task.png)

    a) Click the `Configure Build Task` button.

    b) In the `Select a Task Runner` dialog dropdown menu. Select `.NET Core` as seen in the following image: 

	![Visual Studio Code select a task dialog](media/iot-hub-iot-edge-create-module/vscode-build-task-runner.png)

    c) Clicking the `.NET Core` item creates the `tasks.json` file in your `.vscode` directory and opens the file in the `code editor` window. There is no need to modify this file, close the tab.

27.  Open the `Visual Studio Code` integrated terminal window by pressing the `Ctrl` + `backtick` keys or using the menus `View` -> `Integrated Terminal` and type **.\binplace.ps1** into the `PowerShell` command prompt. This command copies all our dependencies to the output directory.

28. Navigate to the projects output directory in the `Integrated Terminal` window by typing **cd .\bin\Debug\netstandard1.3**.

29. Run the sample project by typing **.\gw.exe gw-config.json** into the `Integrated Terminal` window prompt. 
    - If you have followed the steps in this tutorial closely, you should now be running the `Azure IoT Edge BLE Data Converter Module` sample project as seen in the following image:
    
        ![Simulated device example running in Visual Studio Code](media/iot-hub-iot-edge-create-module/vscode-run.png)
    
    - If you want to terminate the application, press the `<Enter>` key.

        >[!IMPORTANT]
         It is not recommended to use `Ctrl` + `C` to terminate the `IoT Edge` gateway application (that is, **gw.exe**). As this action may cause the process to terminate abnormally.
