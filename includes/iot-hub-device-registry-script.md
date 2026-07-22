---
title: Create an IoT Hub with Certificate Management in Azure Device Registry by Using a Script
description: This article explains how to create an IoT hub with Azure Device Registry and certificate management integration by using a script.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: include
ms.date: 12/19/2025
---

## Overview

Use the provided PowerShell script to automate the setup of your IoT hub with Azure Device Registry integration. The script performs all the necessary steps to create the required resources and link them together, including steps to:

1. Create a resource group.
1. Configure the necessary app privileges.
1. Create a user-assigned managed identity.
1. Create a Device Registry namespace with system-assigned managed identity.
1. Create a credential root certificate authority (root CA) and policy (issuing CA) scoped to that namespace.
1. Create an IoT hub (preview) with a linked namespace and managed identity.
1. Create a DPS instance with a linked IoT hub and namespace.
1. Sync your credential and policies (CA certificates) to IoT Hub.
1. Create an enrollment group, and link to your policy to enable certificate provisioning.

> [!IMPORTANT]
> During the preview period, IoT Hub with Device Registry integration and certificate management features enabled on top of IoT Hub are available free of charge. Device provisioning service is billed separately and isn't included in the preview offer. For more information on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Prepare your environment

1. Download [PowerShell 7](/powershell/scripting/install/installing-powershell-on-windows) for Windows.

1. Go to the [GitHub repository](https://github.com/Azure-Samples/iot-hub-adr-cert-mgmt-preview/tree/main/scripts) and download the **Scripts** folder, which contains the script file, `iothub-adr-certs-setup-preview.ps1`.

## Customize the script variables

Open the script file in a text editor and modify the following variables to match the configuration that you want:

- `TenantId`: Your tenant ID. To find this value, run `az account show` in your terminal.
- `SubscriptionId`: Your subscription ID. To find this value, run `az account show` in your terminal.
- `ResourceGroup`: The name of your new resource group.
- `Location`: The Azure region where you want to create your resources. Check out the available locations for preview features in the [Supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions) section.
- `NamespaceName`: Your namespace name can contain only lowercase letters and hyphens (`-`) in the middle of the name, but not at the beginning or end. For example, *msft-namespace* is a valid name.
- `HubName`: Your hub name can contain only lowercase letters and numerals.
- `DpsName`: The name of your new DPS instance.
- `UserIdentity`: The new user-assigned managed identity for your resources.
- `WorkingFolder`: The local folder where your script is located.

[!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

## Run the script interactively

1. Open the script and run in PowerShell 7+ as an administrator. Go to the folder that contains your script and run `.\iothub-adr-certs-setup-preview.ps1`.

1. If you run into an execution policy issue, try running `powershell -ExecutionPolicy Bypass -File .\iothub-adr-certs-setup-preview.ps1`.

1. If you get a message that the namespace `Microsoft.DeviceRegistry` isn't registered, try running `az provider register --namespace Microsoft.DeviceRegistry`.

1. Follow the guided prompts:

    - Select **Enter** to proceed with a step.
    - Select **s** or **S** to skip a step.
    - Select **Ctrl** + **C** to abort.

The creation of your Device Registry namespace, IoT Hub, DPS instance, and other resources might take up to five minutes each.

## Monitor execution and validate the resources

1. The script continues execution when warnings are encountered and only stops if a command returns a nonzero exit code. Monitor the console for red **ERROR** messages, which indicate issues that require attention.

1. After the script finishes, validate the creation of your resources by visiting your new resource group on the [Azure portal](https://portal.azure.com). You should see the following resources created:

    - IoT Hub instance
    - DPS instance
    - Azure Device Registry namespace
    - User-assigned managed identity