---
title: Install Azure IoT Edge on Windows | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows devices
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 12/03/2020
ms.author: v-tcassi
---

# Install and provision the Azure IoT Edge for Linux on Windows runtime

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud. To learn more, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

<!-- Expand introduction -->

This article lists the steps to install the Azure IoT Edge for Linux on Windows runtime on Azure IoT Edge devices.

## Prerequisites

* An Azure account with a valid subscription. If you don't have an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/) before you begin.
* A free or standard tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.
* An [Azure IoT Edge device](https://docs.microsoft.com/azure/iot-edge/how-to-manual-provision-symmetric-key#create-an-iot-edge-device-in-the-azure-portal).
* Access to [Windows Admin Center (WAC) with the Azure IoT Edge extension for WAC installed](https://microsoft.sharepoint.com/teams/AzureEFLOW/Wiki/Windows%20Admin%20Center.aspx). <!-- Update with proper links -->

Minimum system requirements:

* Windows 10 Version 1809 or later; build 17763 or later
* Professional, Enterprise, or Server editions
* Minimum RAM: 4 GB
* Minimum Storage: 10 GB

[!NOTE]
> The execution policy on the target device needs to be set to `Bypass` or `RemoteSigned`, because the IoT Edge for Windows module is not properly signed. Any deployment attempt with a different execution policy will fail as the module cannot be loaded.
>
> Signing of the Azure IoT Edge for Windows collaterals is ongoing work.
>
> You can check the current execution policy in an elevated PowerShell prompt using:
>
>    ```azurepowershell-interactive
>    Get-ExecutionPolicy -List
>    ```
>
> If the execution policy of `local machine` is either `AllSigned` or `Restricted`, set the execution policy to `Bypass` or `RemoteSigned`:
>
>    ```azurepowershell-interactive
>    Set-ExecutionPolicy - ExecutionPolicy RemoteSigned -Force
>    ```

## Create a new resource


