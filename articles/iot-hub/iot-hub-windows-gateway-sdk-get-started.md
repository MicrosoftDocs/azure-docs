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


# IoT Gateway SDK - Getting Started using Windows

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Windows.

1. Open a **Developer Command Prompt for VS2015** command prompt.
2. Navigate to the folder **azure-iot-gateway-sdk\\tools** in your local copy of the repository.
3. Run the **build.cmd** script. This script creates a Visual Studio solution file, builds the solution, and runs the tests. You can find the Visual Studio solution in the **azure-iot-gateway-sdk\\build** folder in your local copy of the repository.

## How to run the sample

1. The **build.cmd** script creates a folder called **.cmake** in your local copy of the repository. This includes the two modules used in this sample.

    The build script places **logger_hl.dll** in the **modules\logger\** folder and **hello_world_hl.dl** in the **modules\hello_world** folder. Use these paths for the **module path** value as shown in the JSON settings file below.

2. For the **logger_hl** module, in **args** set the **filename** value to the path of the file that will contain the log data.

    This is an example of a JSON settings file for Windows that will write to the **log.txt** file in your current working directory. The Hello World sample already has a JSON settings file and you do not need to change it. Use this example as guidance if you want to change the output location for the log file.

    ```
    {
      "modules" :
      [
        {
          "module name" : "logger_hl",
          "module path" : "..\\..\\..\\modules\\logger\\Debug\\logger_hl.dll",
          "args" : 
          {
            "filename":"log.txt"
          }
        },
        {
          "module name" : "hello_world",
          "module path" : "..\\..\\..\\modules\\hello_world\\Debug\\hello_world_hl.dll",
          "args" : null
        }
      ]
    }
    ```

3. At the command prompt, navigate to the **build\\samples\\hello_world\\Debug** folder.
4. Run the **hello_world_sample.exe** executable.

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-field-gateway-sdk/blob/master/doc/devbox_setup.md