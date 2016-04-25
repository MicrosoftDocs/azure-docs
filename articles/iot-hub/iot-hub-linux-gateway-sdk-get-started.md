<properties
	pageTitle="Get started with the IoT Hub Gateway SDK | Microsoft Azure"
	description="Azure IoT Hub Gateway SDK walkthrough using Linux to illustrate key concepts you should understand when you use the Azure IoT Hub Gateway SDK."
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


# IoT Gateway SDK - Getting Started using Linux

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Linux.

1. Open a shell.
2. Navigate to the **azure-iot-gateway-sdk\tools\** folder in your local copy of the repository.
3. Run the **build.sh** script. This script uses the **cmake** utility to create a folder called **build** in your home directory and generate a makefile. The script then builds the solution and runs the tests.

> [AZURE.NOTE]  Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in your home directory.

## How to run the sample

1. The **build.sh** script generates its output in the **azure-iot-gateway-sdk/build** folder. This includes the two modules used in this sample.

    The build script places **liblogger_hl.so** in the **/modules/logger/** folder and **libhello_world_dl.so** in  the **/modules/hello_world/** folder. Use these paths for the **module path** value as shown in the JSON settings file below.

2. For the **logger_hl** module, in **args** set the **filename** value to the path of the file that will contain the log data.

    This is an example of a JSON settings file for Linux that will write to the **log.txt** file. The Hello World sample already has a JSON settings file and you do not need to change it. Use this example as guidance if you want to change the output location for the log file.

    ```
    {
      "modules" :
      [ 
        {
          "module name" : "logger_hl",
          "module path" : "./modules/logger/liblogger_hl.so",
          "args" : 
          {
            "filename":"log.txt"
          }
        },
        {
          "module name" : "hello_world",
          "module path" : "./modules/hello_world/libhello_world_hl.so",
          "args" : null
        }
      ]
    }
    ```

3. In your shell, navigate to **azure-iot-gateway-sdk/build/samples/hello_world** folder.
4. Run the executable **./hello_world_sample**. 

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-field-gateway-sdk/blob/master/doc/devbox_setup.md
