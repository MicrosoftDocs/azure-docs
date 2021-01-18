---
title: Standalone agent binary installation
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 1/18/2021
ms.topic: quickstart
ms.service: azure
---

# Distro configurations 

The Micro Agent includes an infrastructure which can be used to customize your distribution. To see a list of the available configuration parameters look at the `configs/LINUX_BASE.conf` file.

For a single distribution, modify the base `.conf` file. 

If you require more than one distribution, you can inherit from the base configuration and override its values. 

To override the values:

1. Create a new `.dist` file.
1. Add `CONF_DEFINE_BASE(${g_plat_config_path} LINUX_BASE.conf)` to the top. 
1. Define new values to whatever you require, example: 

    `set(ASC_LOW_PRIORITY_INTERVAL 60*60*24)` 

1. You should then give a reference to that `.dis` file when building. For example, 

    `cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -Ddist_target=UBUNTU1804 ..` 

## Baseline Configuration signing 

The agent verifies the authenticity of configuration files that are placed on the disk to mitigate tampering, by default.

You can stop this process by defining the preprocessor flag `ASC_BASELINE_CONF_SIGN_CHECK_DISABLE`.

We do not recommended turning off the signature check for production environments. 

If you require a different configuration for production scenarios, please contact the Defender for IoT team. 

## Prerequisites 

1. Contact your account manager to ask for access to Defender for IoT source code.
 
1. Clone, or extract the source code to a folder on the disk.
1. Naviagte into that directory.
1. Pull the submodules using the following code:

    ```azurecli
    git submodule update --init
    ```

1. Next, pull the submodules for the Azure IoT SDK with the following code: 

    ```azurecli
    git -C deps/azure-iot-sdk-c/ submodule update –init
    ```
 

1. Add an execution permission, and run the developer environment setup script:

    ```azurecli
    chmod +x scripts/install_development_environment.sh && ./scripts/install_development_environment.sh 
    ```

1. Create a directory for the build outputs: 

    ```azurecli
    mkdir cmake 
    ```

1. (Optional) Download and install [VSCode](https://code.visualstudio.com/download ) 

1. (Optional) Install the [C/C++ extension](https://code.visualstudio.com/docs/languages/cpp ) for vscode.

## Building the Defender IoT Micro Agent 

1. Open the directory with VSCode 

1. Navigate to the `cmake` directory. 

1. Run the following command: 

    ```azurecli
    cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -Ddist_target=<the appropriate distro configuration file name> .. 
    ```

    For example: 

    ```azurecli
    cmake -DCMAKE_BUILD_TYPE=Debug -Dlog_level=DEBUG -Dlog_level_cmdline:BOOL=ON -Ddist_target=UBUNTU1804 ..
    ```
    