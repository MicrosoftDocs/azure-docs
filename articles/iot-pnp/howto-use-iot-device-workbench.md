---
title: Use the Azure IoT Device Workbench in Visual Studio Code to build IoT Plug and Play devices | Microsoft Docs
description: Use Azure IoT Device Workbench in Visual Studio Code to accelerate authoring device model, publishing to model repository and implementing the device code.
author: Liya Du
ms.author: liydu
ms.date: 07/25/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device or solution developer, I want to use the Azure IoT Device Workbench to author my device capability model and interface, publish to Model Repository and generate C scaffolding code to implement the device application.
---

This article shows you how to:

- Use Intellisense and auto-complete when authoring device capability model and interface.
- Generate ANSI C scaffolding code and project.
- Use the generated code in your own device project.
- Iterate by re-generating the scaffolding code.

## Prerequisites

Install [Visual Studio Code](https://code.visualstudio.com/).

Use the following steps to install the extension in VS Code.

1. In VS Code, select **Extensions** tab.
1. Search and install **Azure IoT Device Workbench** from marketplace.

## Use Intellisense and auto-complete when authoring device capability model and interface

## Generate ANSI C scaffolding code and project

In VS Code, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub** to configure the scaffold code and project type. Here are detailed explanation of each step:

- DCM file to be used for generating the code. In order to generate the scaffolding device code, you need to open the folder that contains the device capability model file and the interface files it implements.

- Device language. Currently the code generator only supports ANSI C language.

- Project name. The project name is used as folder name for the generated code and rest of the project files. The folder is by default placed next to the DCM file. It is a recommendation that you put or copy the DCM file in your device project folder and the generated code folder is also in it. It avoids manually copying of the generated code folder each time when you update your DCM and re-generated the device code.

- Project type. In addition to the scaffold C code, it also generates the project file so that you can easily integrate it into your own project or in the device SDK project. Currently the project type supports:

    - **CMake Project**: for device project that uses [CMake](https://cmake.org/) as build system. It generates a `CMakeLists.txt` in the same folder with the C code.
    - **Visual Studio Project**: for device project that uses Visual Studio. It generates `vcxproj` so that you can open it in Visual Studio as a VC++ project.
    - **MXChip IoT DevKit project**: for device project that runs on [MXChip IoT DevKit](https://aka.ms/iot-devkit). It generates an Arduino project that you can [use this Workbench](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) or Arduino IDE to build and run on the IoT DevKit.

- Method to connect to Azure IoT. The generated files also contain code to configure the device connect to Azure IoT. You can choose to connect to Azure IoT Hub or via Device Provisioning Service.

    - **Via IoT Hub device connection string**: you need to specify the device connection string for the device application to connect to IoT Hub directly.
    - **Via DPS symmetric key**: you need to specify **Scope ID**, **Registration ID** and **SaS Key** for the device application that are required to connect to IoT Hub or IoT Central via DPS.

The code generator respects the DCM and interface files located in the folder. And it pulls the IoT plug and Play standard interfaces from Public Repository if it cannot find the local copies.

After generation finishes, it opens a new VS Code window with the code. If you open file such as `main.c`, you can find the intellisense reports cannot open source file of device C SDK. To include the device C SDK folder to enable the correct intellisense and code navigation:

1. In VS Code, use **Ctrl+Shift+P** to open the command palette, type and select **C/C++: Edit Configurations (JSON)** to open the `c_cpp_properties.json` file.

1. Add the path of the device SDK in the `includePath` section.

    ```json
    "includePath": [
        "${workspaceFolder}/**",
        "{path_of_device_c_sdk}/**"
    ]
    ```

1. Save the file.

## Use the generated code in your own device project

Here are some examples about how to use the generated code in your own device project.

### Linux using CMake

*[TBD Cmake with device SDK]*

### Windows using MSBuild

*[TBD .vcxproj]*

### mbedOS using XXX

*[TBD]*

### Arduino

*[TBD]*

## Iterate by re-generating the scaffolding code

The code generator supports re-generation of the code if you update your DCM or interface files. Assuming you already generated device code from a DCM file, to re-generate the code:

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

1. Choose the DCM file you just update.

1. Select **Re-generate code for {project name}**.

1. It will use the previous setting you configured and re-generate the code. But it will not overwrite the files involved with user code such as `main.c` and `{project_name}_impl.c`.

