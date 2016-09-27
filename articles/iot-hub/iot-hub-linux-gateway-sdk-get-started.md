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
     ms.topic="get-started-article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/20/2016"
     ms.author="cstreet"/>


# IoT Gateway SDK (beta) - Get started using Linux

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-selector](../../includes/iot-hub-gateway-sdk-getstarted-selector.md)]

## How to build the sample

Before you get started, you must [set up your development environment][lnk-setupdevbox] for working with the SDK on Linux.

1. Open a shell.
2. Navigate to the root folder in your local copy of the **azure-iot-gateway-sdk** repository.
3. Run the **tools/build.sh** script. This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **azure-iot-gateway-sdk** repository and generate a makefile. The script then builds the solution and runs the tests.

> [AZURE.NOTE]  Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **azure-iot-gateway-sdk** repository.

## How to run the sample

1. The **build.sh** script generates its output in the **build** folder in your local copy of the **azure-iot-gateway-sdk** repository. This includes the two modules used in this sample.

    The build script places **liblogger_hl.so** in the **build/modules/logger/** folder and **libhello_world_hl.so** in  the **build/modules/hello_world/** folder. Use these paths for the **module path** value as shown in the JSON settings file below.

2. The file **hello_world_lin.json** in the **samples/hello_world/src** folder is an example JSON settings file for Linux that you can use to run the sample. The example JSON settings shown below assumes that you will run the sample from the root of your local copy of the **azure-iot-gateway-sdk** repository.

3. For the **logger_hl** module, in the **args** section, set the **filename** value to the name and path of the file that will contain the log data.

    This is an example of a JSON settings file for Linux that will write to the **log.txt** to the folder where you run the sample.

    ```
    {
      "modules" :
      [ 
        {
          "module name" : "logger_hl",
          "module path" : "./build/modules/logger/liblogger_hl.so",
          "args" : 
          {
            "filename":"./log.txt"
          }
        },
        {
          "module name" : "hello_world",
          "module path" : "./build/modules/hello_world/libhello_world_hl.so",
          "args" : null
        }
      ]
    }
    ```

3. In your shell, navigate to **azure-iot-gateway-sdk** folder.
4. Run the following command:
  
  ```
  ./build/samples/hello_world/hello_world_sample ./samples/hello_world/src/hello_world_lin.json
  ``` 

[AZURE.INCLUDE [iot-hub-gateway-sdk-getstarted-code](../../includes/iot-hub-gateway-sdk-getstarted-code.md)]

<!-- Links -->
[lnk-setupdevbox]: https://github.com/Azure/azure-iot-gateway-sdk/blob/master/doc/devbox_setup.md
