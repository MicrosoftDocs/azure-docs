---
title: Create an IoT Hub with Certificate Management in Azure Device Registry using a Script
description: This article explains how to create an IoT Hub with Azure Device Registry and certificate management integration using a script.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: include
ms.date: 12/19/2025
---

## Overview

Use the provided PowerShell script to automate the setup of your IoT Hub with Azure Device Registry integration. The script performs all the necessary steps to create the required resources and link them together, including:

1. Create a resource group
1. Configure the necessary app privileges
1. Create a user-assigned managed identity
1. Create an ADR namespace with system-assigned managed identity
1. Create a credential (root CA) and policy (issuing CA) scoped to that namespace
1. Create an IoT Hub (preview) with linked namespace and managed identity
1. Create a DPS with linked IoT Hub and namespace
1. Sync your credential and policies (CA certificates) to IoT Hub
1. Create an enrollment group and link to your policy to enable certificate provisioning

> [!IMPORTANT]
> During the preview period, IoT Hub with ADR integration and certificate management features enabled on top of IoT Hub are available **free of charge**. Device Provisioning Service (DPS) is billed separately and isn't included in the preview offer. For details on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Prepare your environment

1. Download [PowerShell 7](/powershell/scripting/install/installing-powershell-on-windows) for Windows.
1. Navigate to the [GitHub repository](https://github.com/Azure-Samples/iot-hub-adr-cert-mgmt-preview/tree/main/scripts) and download the **Scripts** folder, which contains the script file, `iothub-adr-certs-setup-preview.ps1`.

## Customize the script variables

Open the script file in a text editor and modify the following variables to match your desired configuration.

- `TenantId`: Your tenant ID. You can find this value by running `az account show` in your terminal.
- `SubscriptionId`: Your subscription ID. You can find this value by running `az account show` in your terminal.
- `ResourceGroup`: The name of your resource group.
- `Location`: The Azure region where you want to create your resources. Check out the available locations for preview features in the [Supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions) section.
- `NamespaceName`: Your namespace name may only contain lowercase letters and hyphens ('-') in the middle of the name, but not at the beginning or end. For example, "msft-namespace" is a valid name.
- `HubName`: Your hub name can only contain lowercase letters and numerals.
- `DpsName`: The name of your Device Provisioning Service instance.
- `UserIdentity`: The user-assigned managed identity for your resources.
- `WorkingFolder`: The local folder where your script is located.

[!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

## Run the script interactively

1. Open the script and run in **PowerShell 7+ as an administrator**. Navigate to the folder containing your script and run `.\iothub-adr-certs-setup-preview.ps1`.
1. If you run into an execution policy issue, try running `powershell -ExecutionPolicy Bypass -File .\iothub-adr-certs-setup-preview.ps1`.
1. Follow the guided prompts:

    - Press `Enter` to proceed with a step
    - Press `s` or `S` to skip a step
    - Press `Ctrl` + `C` to abort

> [!NOTE]
> The creation of your ADR namespace, IoT Hub, DPS, and other resources may take up to 5 minutes each.

## Monitor execution and validate the resources

1. The script continues execution when warnings are encountered and only stops if a command returns a non-zero exit code. Monitor the console for red **ERROR** messages, which indicate issues that require attention.
1. Once the script completes, validate the creation of your resources by visiting your new **Resource Group** on the [Azure portal](https://portal.azure.com). You should see the following resources created:

    - IoT Hub instance
    - Device Provisioning Service (DPS) instance
    - Azure Device Registry (ADR) namespace
    - User-Assigned Managed Identity (UAMI)
    