---
title: Use Visual Studio and Visual Studio Code to build IoT Plug and Play Preview devices | Microsoft Docs
description: Use Visual Studio and Visual Studio Code to accelerate authoring IoT Plug and Play device models and implementing the device code.
author: liydu
ms.author: liydu
ms.date: 12/26/2019
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device or solution developer, I want to use Visual Studio and Visual Studio Code to author my device capability model (DCM) and interface, publish to model repository and generate skeleton C code to implement the device application.
---

# Use Visual Studio and Visual Studio Code to build IoT Plug and Play devices

The Azure IoT Tools for Visual Studio Code provides an integrated environment to author device capability models (DCM) and interfaces, publish to model repositories, and generate skeleton C code to implement the device application.

This article shows you how to:

- Generate device code and application project.
- Use the generated code in your device project.
- Iterate by regenerating the skeleton code.

To learn more about using the VS Code to develop IoT devices, see [https://github.com/microsoft/vscode-iot-workbench](https://github.com/microsoft/vscode-iot-workbench).

## Prerequisites

Install [Visual Studio Code](https://code.visualstudio.com/).

Use the following steps to install the extension pack in VS Code.

1. In VS Code, select **Extensions** tab.
1. Search for and install **Azure IoT Tools** from the marketplace.

## Generate device code and project

In VS Code, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub** to configure the skeleton code and project type. The following list describes each step in detail:

- **DCM file to be used for generating the code**. To generate the skeleton device code, open the folder that contains the DCM and interface files it implements. If the code generator can't find an interface that a DCM requires, it downloads it from the model repository as needed.

- **Device code language**. Currently, the code generator only supports ANSI C.

- **Project name**. The project name is used as the folder name for the generated code and other project files. The folder is, by default, placed next to the DCM file. To avoid having to manually copy the generated code folder whenever you update your DCM and regenerate the device code, keep your DCM file in the same folder as the project folder.

- **Method to connect to Azure IoT**. The generated files also contain code to configure the device to connect to Azure IoT Hub. You can choose to connect directly to [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub) or use the [Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps).

    - **Via IoT Hub device connection string**: specify the device connection string for the device application to connect to IoT Hub directly.
    - **Via DPS symmetric key**: specify the **ID Scope**, **Symmetric Key** and **Device ID** for the device application that are required to connect to IoT Hub or IoT Central using DPS.

- **Project type**. The code generator also generates a CMake or Arduino project. Currently, the supported project types are:

    - **CMake Project on Windows**: for a device project that uses [CMake](https://cmake.org/) as build system on Windows. This option generates `CMakeLists.txt` with device SDK configurations in the same folder as the C code.
    - **CMake Project on Linux**: for a device project that uses [CMake](https://cmake.org/) as build system on Linux. This option generates `CMakeLists.txt` with device SDK configurations in the same folder as the C code.
    - **MXChip IoT DevKit project**: for a device project that runs on an [MXChip IoT DevKit](https://aka.ms/iot-devkit) device. This option generates an Arduino project that you can [use in VS Code](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started) or in the Arduino IDE to build and run on an IoT DevKit device.

- **Device SDK type**. If you select CMake as project type, this is the step to configure how generated code will include Azure IoT C device SDK in the `CMakeLists.txt`:

    - **Via Source Code**: the generated code relies on the [device SDK source code](https://github.com/Azure/azure-iot-sdk-c) to include in and build together with it. This is recommended when you have customized the device SDK source code.
    - **Via Vcpkg**: the generated code relies on the [device SDK Vcpkg](https://github.com/microsoft/vcpkg/tree/master/ports/azure-iot-sdk-c) to include in and build together with it. This is the recommended way for devices running Windows, Linux or macOS.

    > [!NOTE]
    > macOS support for Azure IoT C device SDK Vcpkg is working in progress.

The code generator tries to use DCM and interface files located in the local folder. If the interface files aren't in the local folder, the code generator looks for them in the public model repository or company model repository. [Common interface files](./concepts-common-interfaces.md) are stored in the public model repository.

After code generation finishes, the extension opens a new VS Code window with the code. If you open a generated file such as **main.c**, you may find that IntelliSense reports that it can't open the C SDK source files. To enable the correct IntelliSense and code navigation, use the following steps to include the C SDK source:

1. In VS Code, use **Ctrl+Shift+P** to open the command palette, type and select **C/C++: Edit Configurations (JSON)** to open the **c_cpp_properties.json** file.

1. Add the path of the device SDK in the `includePath` section:

    ```json
    "includePath": [
        "${workspaceFolder}/**",
        "{path_of_device_c_sdk}/**"
    ]
    ```

1. Save the file.

## Use the generated code

The following instructions describe how to use the generated code in your own device project on different development machine platforms. The instructions assume you're using an IoT Hub device connection string with the generated code:

### Linux

To build the device code together with the device C SDK Vcpkg using CMake in a Linux environment such as Ubuntu or Debian:

1. Open a terminal application.

1. Install **GCC**, **Git**, `cmake`, and all dependencies using the `apt-get` command:

    ```bash
    sudo apt-get update
    sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
    ```

    Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

    ```bash
    cmake --version
    gcc --version
    ```

1. Install Vcpkg:

    ```bash
    git clone https://github.com/Microsoft/vcpkg.git
    cd vcpkg

    ./bootstrap-vcpkg.sh
    ```

    Then, to hook up user-wide [integration](https://github.com/microsoft/vcpkg/blob/master/docs/users/integration.md), run:

    ```bash
    ./vcpkg integrate install
    ```

1. Install Azure IoT C device SDK Vcpkg:

    ```bash
    ./vcpkg install azure-iot-sdk-c[public-preview,use_prov_client]
    ```

1. Create a `cmake` subdirectory in the folder contains the generated code stub, and navigate to that folder:

    ```bash
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to use CMake to build the device SDK and the generated code stub:

    ```bash
    cmake .. -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -DCMAKE_TOOLCHAIN_FILE="{directory of your Vcpkg repo}/scripts/buildsystems/vcpkg.cmake"

    cmake --build .
    ```

1. After the build succeeds, run the application specifying the IoT Hub device connection string as parameter.

    ```bash
    ./{generated_code_project_name} "[IoT Hub device connection string]"
    ```

### Windows

To build the device code together with the device C SDK on Windows using CMake and the Visual Studio C/C++ compilers at the command line, see the [IoT Plug and Play quickstart](./quickstart-create-pnp-device-windows.md). The following steps show you how to build the device code together with the device C SDK Vcpkg as CMake project in Visual Studio.

1. Follow the steps in the [quickstart](https://docs.microsoft.com/azure/iot-pnp/quickstart-create-pnp-device-windows#prepare-the-development-environment) to install the Azure IoT device SDK for C via Vcpkg.

1. Install [Visual Studio 2019 (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure that you include the **NuGet package manager** component and the **Desktop Development with C++** workload.

1. Open Visual Studio, choose **File > Open > CMake...** to open the `CMakeLists.txt` in the folder contains generated code.

1. In the **General** toolbar, find the **Configurations** dropdown. Select **Manage Configuration** to add the CMake setting for your project.

    ![Manage configuration](media/howto-develop-with-vs-vscode/vs-manage-config.png)

1. In the **CMake Settings**, add a new configuration and select **x86-Debug** as target.

1. In **CMake Command Arguments**, add following line:

    ```txt
    -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON
    ```

1. Save the file.

1. Switch to **x86-Debug** in the **Configurations** dropdown. It needs a few seconds for the CMake to generate the cache for it. View the Output window to see the progress.

    ![CMake Output](media/howto-develop-with-vs-vscode/vs-cmake-output.png)

1. In the **Solution Explorer**, right-click on the `CMakeLists.txt` in the root folder, and select **Build** from the context menu to build the generated code stub with the device SDK.

1. After the build succeeds, at the command prompt, run the application specifying the IoT Hub device connection string as a parameter.

    ```cmd
    .\out\build\x86-Debug\{generated_code_project_name}.exe "[IoT Hub device connection string]"
    ```

> [!TIP]
> To learn more about using CMake in Visual Studio, see [Build CMake project](https://docs.microsoft.com/cpp/build/cmake-projects-in-visual-studio?view=vs-2019#building-cmake-projects) .

### macOS

The following steps show you how to build the device code together with the device C SDK source code on macOS using CMake:

1. Open terminal application.

1. Use [Homebrew](https://brew.sh) to install all the dependencies:

    ```bash
    brew update
    brew install git cmake pkgconfig openssl ossp-uuid
    ```

1. Verify that [CMake](https://cmake.org/) is at least version **2.8.12**:

    ```bash
    cmake --version
    ```

1. [Patch CURL](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#upgrade-curl-on-mac-os) to the latest version available.

1. In the folder that contains the generated code, clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) repository:

    ```bash
    git clone https://github.com/Azure/azure-iot-sdk-c --recursive -b public-preview
    ```

    You should expect this operation to take several minutes to complete.

1. Create a folder called `cmake` under the folder that contains the generated code, and navigate to that folder.

    ```bash
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to use CMake to build the device SDK and the generated code stub:

    ```bash
    cmake -Duse_prov_client=ON -Dhsm_type_symm_key:BOOL=ON -DOPENSSL_ROOT_DIR:PATH=/usr/local/opt/openssl ..
    cmake --build .
    ```

1. After the build succeeds, run the application specifying the IoT Hub device connection string as parameter.

    ```bash
    cd {generated_code_folder_name}/cmake/
    ./{generated_code_project_name} "[IoT Hub device connection string]"
    ```

## Iterate by regenerating the skeleton code

The code generator can regenerate the code if you update your DCM or interface files. Assuming you already generated your device code from a DCM file, to regenerate the code:

1. With the folder with DCM files open, use **Ctrl+Shift+P** to open the command palette, enter **IoT Plug and Play**, and select **Generate Device Code Stub**.

1. Choose the DCM file you updated.

1. Select **Re-generate code for {project name}**.

1. The code generator uses the previous setting you configured and regenerates the code. However, it doesn't overwrite the files that may contain user code such as `main.c` and `{project_name}_impl.c`.

> [!NOTE]
> If you update the URN id in your interface file, it's treated as a new interface. When you re-generate the code, the code generator generates code for interface but doesn't overwrite the original one in the `{project_name}_impl.c` file.

## Problems and Feedback

Azure IoT Tools is an open-sourced project on GitHub. For any issues and feature requests, you can [create an issue on GitHub](https://github.com/microsoft/vscode-azure-iot-tools/issues/new).

## Next steps

In this how-to article, you've learned how to use the Visual Studio and Visual Studio Code to generate skeleton C code to implement the device application. A suggested next step is to learn how to [Install and use Azure IoT explorer](./howto-install-iot-explorer.md) tool.
