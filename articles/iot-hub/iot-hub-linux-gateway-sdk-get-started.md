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
2. Navigate to the **azure-iot-gateway-sdk\build\** folder in your local copy of the repository.
3. Run the **build.sh** script. This script uses the **cmake** utility to create a folder called **cmake** in your home directory and generate a makefile. The script then builds the solution and runs the tests.

> [AZURE.NOTE]  Every time you run the **build.sh** script, it deletes and then recreates the **cmake** folder in your home directory.

## How to run the sample

1. The **build.sh** script generates its output in the **~/cmake/gateway** folder. This includes the two modules used in this sample.

    The build script places **liblogger_hl.so** in the **/modules/logger/** folder and **libhelloworld_dl.so** in  the **/modules/helloworld/** folder. Use these paths for the **module path** value as shown in the JSON settings file below.

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
          "module name" : "helloworld",
          "module path" : "./modules/helloworld/libhelloworld_hl.so",
          "args" : 
          {
            "notused":"at_all"
          }
        }
      ]
    }
    ```

3. In your shell, navigate to **~/cmake/gateway/samples/helloworld** folder.
4. Run the executable **./helloworld_sample**. 

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-field-gateway-sdk/blob/master/doc/devbox_setup.md
