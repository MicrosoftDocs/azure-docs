---
title: Get Started with ADR and Certificate Management in IoT Hub (Preview)
titleSuffix: Azure IoT Hub
description: This article explains how to create an IoT Hub with ADR integration and Microsoft-backed X.509 certificate management.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/07/2025
zone_pivot_groups: service-azcli-script
#Customer intent: As a developer new to IoT, I want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Get started with ADR integration and Microsoft-backed X.509 certificate management in IoT Hub (preview)

This article explains how to create a new IoT Hub with [Azure Device Registry (ADR)](iot-hub-device-registry-overview.md) integration and [Microsoft-backed X.509 certificate management](iot-hub-certificate-management-overview.md). 

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- If you don't have the Azure CLI installed, follow the steps to [install the Azure CLI](/cli/azure/install-azure-cli). 
- Install the **Azure IoT CLI extension with previews enabled** to access the ADR integration and certificate management functionalities for IoT Hub:

    1. Check for existing Azure CLI extension installations.
    
        ```azurecli-interactive
        az extension list
        ```
    
    1. Remove any existing azure-iot installations.
    
        ```azurecli-interactive
        az extension remove --name azure-iot
        ```
        
    1. Install the azure-iot extension from the index with previews enabled, 
    
        ```azurecli-interactive
        az extension add --name azure-iot --allow-preview
        ```

        or download the .whl file from the GitHub releases page to install the extension manually.

        ```azurecli-interactive
        az extension add --upgrade --source https://github.com/Azure/azure-iot-cli-extension/releases/download/v0.30.0b1/azure_iot-0.30.0b1-py3-none-any.whl
        ```
    
    1. After the install, validate your azure-iot extension version is greater than **0.30.0b1**.
    
        ```azurecli-interactive
        az extension list
        ``` 

- Ensure that you have the privilege to perform role assignments within your target scope. Performing role assignments in Azure requires a [privileged role](../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope. 

## Choose a deployment method

To use certificate management, you must also set up IoT Hub, ADR, and the [Device Provisioning Service (DPS)](../iot-dps/index.yml). If you prefer, you can choose not to enable certificate management and configure only IoT Hub with ADR.

To set up your IoT Hub with ADR integration and certificate management, you can use Azure CLI or a script that automates the setup process.

| Deployment method | Description |
|-------------------|-------------|
| Select **Azure CLI** at the top of the page | Use the Azure CLI to create a new IoT Hub, DPS instance, and ADR namespace and configure all necessary settings. |
| Select **PowerShell script** at the top of the page | Use a PowerShell script (Windows only) to automate the creation of a new IoT Hub, DPS instance, and ADR namespace and configure all necessary settings. |


:::zone pivot="azure-cli"

[!INCLUDE [iot-hub-device-registry-azurecli](../../includes/iot-hub-device-registry-azure-cli.md)]

:::zone-end

:::zone pivot="script"

[!INCLUDE [iot-hub-device-registry-script](../../includes/iot-hub-device-registry-script.md)]

:::zone-end

## Next steps

At this point, your IoT Hub with ADR integration and certificate management is set up and ready to use. You can now start onboarding your IoT devices to the hub using the Device Provisioning Service (DPS) instance and manage your IoT devices securely using the policies and enrollments you have set up.

**New**: Certificate management is supported across select [DPS Device SDKs](../iot-dps/libraries-sdks.md#device-sdks). You can now onboard devices using Microsoft-backed X.509 certificate management with the following SDK samples:

- Embedded C:
    - Bare metal: [Sample](Https://github.com/Azure/azure-sdk-for-c/blob/feature/dps-csr-preview/sdk/samples/iot/paho_iot_provisioning_csr_sample.c)
    - Free RTOS: [Sample](https://github.com/Azure-Samples/iot-middleware-freertos-samples/tree/feature/dps-csr-preview/demos/projects/PC/linux)
- C: [Sample](https://github.com/Azure/azure-iot-sdk-c/tree/feature/dps-csr-preview/provisioning_client/samples/prov_dev_client_ll_x509_csr_sample)
- Python: [Sample](https://github.com/Azure/azure-iot-sdk-python/blob/feature/dps-csr-preview/azure-iot-device/samples/dps-cert-mgmt/provisioning_client_certificate_issuance.py)
