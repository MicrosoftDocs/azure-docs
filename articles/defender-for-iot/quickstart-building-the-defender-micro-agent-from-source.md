---
title: 'Quickstart: Build the Defender micro agent from source code (Preview)'
description: In this quickstart, learn about the Micro Agent which includes an infrastructure that can be used to customize your distribution.
ms.date: 05/10/2021
ms.topic: quickstart
---

# Quickstart: Build the Defender micro agent from source code (Preview)

The Micro Agent includes an infrastructure, which can be used to customize your distribution. To see a list of the available configuration parameters look at the `configs/LINUX_BASE.conf` file.

For a single distribution, modify the base `.conf` file. 

If you require more than one distribution, you can inherit from the base configuration and override its values. 

To override the values:

1. Create a new `.dist` file.

1. Add `CONF_DEFINE_BASE(${g_plat_config_path} LINUX_BASE.conf)` to the top.
 
1. Define new values to whatever you require, example: 

    `set(ASC_LOW_PRIORITY_INTERVAL 60*60*24)` 

1. Give the `.dist` file a reference when building. For example, 

    `cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -DIOT_SECURITY_MODULE_DIST_TARGET=UBUNTU1804 ..` 

## Prerequisites

1. Contact your account manager to ask for access to Defender for IoT source code.
 
1. Clone, or extract the source code to a folder on the disk.

1. Navigate into that directory.

1. Pull the submodules using the following code:

    ```bash
    git submodule update --init
    ```
    
1. Next, pull the submodules for the Azure IoT SDK with the following code: 

    ```bash
    git -C deps/azure-iot-sdk-c/ submodule update –init
    ```
 

1. Add an execution permission, and run the developer environment setup script:

    ```bash
    chmod +x scripts/install_development_environment.sh && ./scripts/install_development_environment.sh 
    ```

1. Create a directory for the build outputs: 

    ```bash
    mkdir cmake 
    ```

1. (Optional) Download and install [VSCode](https://code.visualstudio.com/download ) 

1. (Optional) Install the [C/C++ extension](https://code.visualstudio.com/docs/languages/cpp ) for VSCode.- None

## Baseline Configuration signing 

The agent verifies the authenticity of configuration files that are placed on the disk to mitigate tampering, by default.

You can stop this process by defining the preprocessor flag `ASC_BASELINE_CONF_SIGN_CHECK_DISABLE`.

We don't recommend turning off the signature check for production environments. 

If you require a different configuration for production scenarios, contact the Defender for IoT team. 

## Building the Defender IoT Micro Agent 

1. Open the directory with VSCode 

1. Navigate to the `cmake` directory. 

1. Run the following command: 

    ```bash
    cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -DIOT_SECURITY_MODULE_DIST_TARGET<the appropriate distro configuration file name> .. 
    
    cmake --build . -- -j${env:NPROC}
    ```

    For example: 

    ```bash
    cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -DIOT_SECURITY_MODULE_DIST_TARGETUBUNTU1804 ..
    
    cmake --build . -- -j${env:NPROC}
    ```

## Next steps

> [!div class="nextstepaction"]
> [Configure your Azure Defender for IoT solution](quickstart-configure-your-solution.md).
