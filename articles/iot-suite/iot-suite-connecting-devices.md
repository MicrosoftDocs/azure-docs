---
title: Connect a device using C on Windows | Microsoft Docs
description: Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on Windows.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 34e39a58-2434-482c-b3fa-29438a0c05e8
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: dobett

---
# Connect your device to the remote monitoring preconfigured solution (Windows)
[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Create a C sample solution on Windows
The following steps show you how to create a client application that communicates with the remote monitoring preconfigured solution. This application is written in C and built and run on Windows.

Create a starter project in Visual Studio 2015 or Visual Studio 2017 and add the IoT Hub device client NuGet packages:

1. In Visual Studio, create a C console application using the Visual C++ **Win32 Console Application** template. Name the project **RMDevice**.
2. On the **Application Settings** page in the **Win32 Application Wizard**, ensure that **Console application** is selected, and uncheck **Precompiled header** and **Security Development Lifecycle (SDL) checks**.
3. In **Solution Explorer**, delete the files stdafx.h, targetver.h, and stdafx.cpp.
4. In **Solution Explorer**, rename the file RMDevice.cpp to RMDevice.c.
5. In **Solution Explorer**, right-click on the **RMDevice** project and then click **Manage NuGet packages**. Click **Browse**, then search for and install the following NuGet packages:
   
   * Microsoft.Azure.IoTHub.Serializer
   * Microsoft.Azure.IoTHub.IoTHubClient
   * Microsoft.Azure.IoTHub.MqttTransport
6. In **Solution Explorer**, right-click on the **RMDevice** project and then click **Properties** to open the project's **Property Pages** dialog box. For details, see [Setting Visual C++ Project Properties][lnk-c-project-properties]. 
7. Click the **Linker** folder, then click the **Input** property page.
8. Add **crypt32.lib** to the **Additional Dependencies** property. Click **OK** and then **OK** again to save the project property values.

Add the Parson JSON library to the **RMDevice** project and add the required `#include` statements:

1. In a suitable folder on your computer, clone the Parson GitHub repository using the following command:

    ```
    git clone https://github.com/kgabis/parson.git
    ```

1. Copy the parson.h and parson.c files from the local copy of the Parson repository to your **RMDevice** project folder.

1. In Visual Studio, right-click the **RMDevice** project, click **Add**, and then click **Existing Item**.

1. In the **Add Existing Item** dialog, select the parson.h and parson.c files in the **RMDevice** project folder. Then click **Add** to add these two files to your project.

1. In Visual Studio, open the RMDevice.c file. Replace the existing `#include` statements with the following code:
   
    ```c
    #include "iothubtransportmqtt.h"
    #include "schemalib.h"
    #include "iothub_client.h"
    #include "serializer_devicetwin.h"
    #include "schemaserializer.h"
    #include "azure_c_shared_utility/threadapi.h"
    #include "azure_c_shared_utility/platform.h"
    #include "parson.h"
    ```

    > [!NOTE]
    > Now you can verify that your project has the correct dependencies set up by building it.

[!INCLUDE [iot-suite-connecting-code](../../includes/iot-suite-connecting-code.md)]

## Build and run the sample

Add code to invoke the **remote\_monitoring\_run** function and then build and run the device application.

1. Replace the **main** function with following code to invoke the **remote\_monitoring\_run** function:
   
    ```c
    int main()
    {
      remote_monitoring_run();
      return 0;
    }
    ```

1. Click **Build** and then **Build Solution** to build the device application.

1. In **Solution Explorer**, right-click the **RMDevice** project, click **Debug**, and then click **Start new instance** to run the sample. The console displays messages as the application sends sample telemetry to the preconfigured solution, receives desired property values set in the solution dashboard, and responds to methods invoked from the solution dashboard.

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-c-project-properties]: https://msdn.microsoft.com/library/669zx6zc.aspx
