---
title: Use the Azure IoT Device Workbench in Visual Studio Code to build IoT Plug and Play devices | Microsoft Docs
description: Use Azure IoT Device Workbench in Visual Studio Code to accelerate authoring device model and implementing the device code.
author: liydu
ms.author: liydu
ms.date: 07/25/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device or solution developer, I want to use the Azure IoT Device Workbench to author my Device Capability Model (DCM) and interface, publish to Model Repository and generate C scaffolding code to implement the device application.
---

# Use Azure IoT Device Workbench extension in Visual Studio Code

The Azure IoT Device Workbench is an extension in Visual Studio Code that provides an integrated environment to author Device Capability Model (DCM) and interface, publish to Model Repository and generate C scaffolding code to implement the device application.

This article shows you how to:

- Generate device code and project.
- Use the generated code in your device project.
- Iterate by re-generating the scaffolding code.

## Prerequisites

Install [Visual Studio Code](https://code.visualstudio.com/).

Use the following steps to install the extension in VS Code.

1. In VS Code, select **Extensions** tab.
1. Search and install **Azure IoT Device Workbench** from marketplace.

## Generate device code and project

In VS Code, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub** to configure the scaffold code and project type. Here are detailed explanation of each step:

- **DCM file to be used for generating the code**. In order to generate the scaffolding device code, you need to open the folder that contains the DCM and interface files it implements. If the code-generator cannot find interface that is required by a DCM, it will download it from the Model Repository as needed.

- **Device code language**. Currently the code generator only supports ANSI C.

- **Project name**. The project name is used as folder name for the generated code and rest of the project files. The folder is by default placed next to the DCM file. It is a recommendation that you put or copy the DCM file in your device project folder and the generated code folder is also in it. It avoids manually copying of the generated code folder each time when you update your DCM and re-generated the device code.

- **Project type**. In addition to the scaffold C code, it also generates the project file so that you can easily integrate it into your own project or in the device SDK project. Currently the project type supports:

    - **CMake Project**: for device project that uses [CMake](https://cmake.org/) as build system. It generates a `CMakeLists.txt` in the same folder with the C code.
    - **Visual Studio Project**: for device project that uses Visual Studio. It generates `vcxproj` so that you can open it in Visual Studio as a VC++ project.
    - **MXChip IoT DevKit project**: for device project that runs on [MXChip IoT DevKit](https://aka.ms/iot-devkit). It generates an Arduino project that you can [use this Workbench](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) or Arduino IDE to build and run on the IoT DevKit.

- **Method to connect to Azure IoT**. The generated files also contain code to configure the device connect to Azure IoT. You can choose to connect to Azure IoT Hub or via Device Provisioning Service.

    - **Via IoT Hub device connection string**: you need to specify the device connection string for the device application to connect to IoT Hub directly.
    - **Via DPS symmetric key**: you need to specify **Scope ID**, **Registration ID** and **SaS Key** for the device application that are required to connect to IoT Hub or IoT Central via DPS.

The code generator respects the DCM and interface files located in the folder. And it pulls the IoT plug and Play standard interfaces from Public Repository or other interface from Company Repository if it cannot find the local copies.

After generation finishes, it opens a new VS Code window with the code. If you open file such as `main.c`, you can find the IntelliSense reports cannot open source file of device C SDK. To include the device C SDK folder to enable the correct IntelliSense and code navigation:

1. In VS Code, use **Ctrl+Shift+P** to open the command palette, type and select **C/C++: Edit Configurations (JSON)** to open the `c_cpp_properties.json` file.

1. Add the path of the device SDK in the `includePath` section.

    ```json
    "includePath": [
        "${workspaceFolder}/**",
        "{path_of_device_c_sdk}/**"
    ]
    ```

1. Save the file.

## Use the generated code in your device project

Here are instructions of how to use the generated code in your own device project on different platforms as development machine.

### Linux

Follow these steps to build the device code together with the device C SDK on Linux (e.g. Ubuntu, Debian) using CMake.

1. Open terminal application.

1. Install **GCC**, **Git**, **CMake** and all dependencies via apt-get:

    ```sh
    sudo apt-get update
    sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
    ```

    Verify that version of **CMake** is above **2.8.12** and **GCC** is above **4.4.7**.

    ```sh
    cmake --version
    gcc --version
    ```

1. Clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c-pnp) repository:

    ```sh
    git clone https://github.com/Azure/azure-iot-sdk-c-pnp --recursive -b public-preview
    ```

    You should expect this operation to take several minutes to complete.

1. Copy the folder that contains the generated code into the device SDK root folder.

1. In VS Code, open `CMakeLists.txt` in the device SDK root folder.

1. Add the following line at the end of the `CMakeLists.txt` file to include the device code stub folder when you compile the SDK:

    ```
    add_subdirectory({generated_code_folder_name})
    ```

1. Create a `cmake` subdirectory in the device SDK root folder, and navigate to that folder.

    ```sh
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to use CMake build the device SDK and the generated code stub:

    ```cmd\sh
    cmake ..
    cmake --build .

1. After the build success, run it by specifying the IoT Hub device connection string as parameter.

    ```cmd\sh
    cd azure-iot-sdk-c-pnp/cmake/{generated_code_folder_name}/
    ./testing_device "[IoT Hub device connection string]"
    ```

### Windows

You can either use CMake and Visual Studio C/C++ compilers to build the device code together with the device C SDK on Windows by following [IoT Plug and Play quickstart](./quickstart-create-pnp-device.md), or follow these steps to include the `.vcxproj` in your Visual Studio solution, if you don't use CMake to build your project.

1. Open your VS solution.

1. In the **Solution Explorer** panel, select the top solution node, from context menu, select **Add > Existing Project**.

1. Select the `vcxproj` file in the generated code folder to include it as part of the solution.

1. From there, you can continue implement your device code and build the solution in VS.

### macOS

Follow these steps to build the device code together with the device C SDK on macOS using CMake.

1. Open terminal application.

1. Use [Homebrew](https://homebrew.sh) to install all the dependencies:

    ```bash
    brew update
    brew install git cmake pkgconfig openssl ossp-uuid
    ```

1. Verify that [CMake](https://cmake.org/) is at least version **2.8.12**:

    ```bash
    cmake --version
    ```

1. [Patch CURL](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#upgrade-curl-on-mac-os) to the latest version available.

1. Clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c-pnp) repository:

    ```sh
    git clone https://github.com/Azure/azure-iot-sdk-c-pnp --recursive -b public-preview
    ```

    You should expect this operation to take several minutes to complete.

1. Copy the folder that contains the generated code into the device SDK root folder.

1. In VS Code, open `CMakeLists.txt` in the device SDK root folder.

1. Add the following line at the end of the `CMakeLists.txt` file to include the device code stub folder when you compile the SDK:

    ```
    add_subdirectory({generated_code_folder_name})
    ```

1. Create a `cmake` subdirectory in the device SDK root folder, and navigate to that folder.

    ```sh
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to use CMake build the device SDK and the generated code stub:

    ```cmd\sh
    cmake -DOPENSSL_ROOT_DIR:PATH=/usr/local/opt/openssl ..
    cmake --build .

1. After the build success, run it by specifying the IoT Hub device connection string as parameter.

    ```cmd\sh
    cd azure-iot-sdk-c-pnp/cmake/{generated_code_folder_name}/
    ./testing_device "[IoT Hub device connection string]"
    ```

## Iterate by re-generating the scaffolding code

The code generator supports re-generation of the code if you update your DCM or interface files. Assuming you already generated device code from a DCM file, to re-generate the code:

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

1. Choose the DCM file you just update.

1. Select **Re-generate code for {project name}**.

1. It will use the previous setting you configured and re-generate the code. But it will not overwrite the files involved with user code such as `main.c` and `{project_name}_impl.c`.

> [!NOTE]
> If you update the URN id in your interface file, it will be treated as a new interface. When re-generating the code, it generates code for interface but not overwrite the original one in `{project_name}_impl.c`.

## Problems and Feedback

Azure IoT Device Workbench extension is an open sourced project on Github. For any issues and feature requests, you can [create issue on Github](https://github.com/microsoft/vscode-iot-workbench/issues).

## Next steps

In this how-to article, you have learned how to use Azure IoT Device Workbench to author DCM and interface and generate C scaffolding code to implement the device application. To learn about IoT Plug and Play, continue to the next article.
