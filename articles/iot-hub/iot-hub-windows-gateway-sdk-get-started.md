<properties
	pageTitle="Get started with the IoT Hub Gateway SDK | Microsoft Azure"
	description="Azure IoT Hub Gateway SDK walkthrough using Windows to illustrate key concepts you should understand when you use the Azure IoT Hub Gateway SDK."
	services="iot-hub"
	documentationCenter=""
	authors="chipalost"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="cpp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/20/2016"
     ms.author="cstreet"/>


# IoT Gateway SDK (beta) - Get started using Windows

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Windows.

1. Open a **Developer Command Prompt for VS2015** command prompt.
2. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
3. Run the **tools\\build.cmd** script. This script creates a Visual Studio solution file, builds the solution, and runs the tests. You can find the Visual Studio solution in the **build** folder in your local copy of the **azure-iot-gateway-sdk** repository.

## How to run the sample

1. The **build.cmd** script creates a folder called **build** in your local copy of the repository. This folder contains the two modules used in this sample.

    The build script places **logger_hl.dll** in the **build\\modules\\logger\\Debug** folder and **hello_world_hl.dl** in the **build\\modules\\hello_world\\Debug** folder. Use these paths for the **module path** value as shown in the JSON settings file below.

2. The file **hello_world_win.json** in the **samples\\hello_world\\src** folder is an example JSON settings file for Windows that you can use to run the sample. The example JSON settings shown below assumes that you cloned the Gateway SDK repository to the root of your **C:** drive. If you downloaded it to another location, you need to adjust the **module path** values in the **samples\\hello_world\\src\\hello_world_win.json** file accordingly.

3. For the **logger_hl** module, in the **args** section, set the **filename** value to the name and path of the file that will contain the log data.

    This is an example of a JSON settings file for Windows that will write to the **log.txt** file in the root of your **C:** drive.

    ```
    {
      "modules" :
      [
        {
          "module name" : "logger_hl",
          "module path" : "C:\\azure-iot-gateway-sdk\\build\\modules\\logger\\Debug\\logger_hl.dll",
          "args" : 
          {
            "filename":"C:\\log.txt"
          }
        },
        {
          "module name" : "hello_world",
          "module path" : "C:\\azure-iot-gateway-sdk\\build\\\\modules\\hello_world\\Debug\\hello_world_hl.dll",
          "args" : null
        }
      ]
    }
    ```

3. At a command prompt, navigate to the root folder of your local copy of the **azure-iot-gateway-sdk** repository.
4. Run the following command:
  
  ```
  build\samples\hello_world\Debug\hello_world_sample.exe samples\hello_world\src\hello_world_win.json
  ```

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md