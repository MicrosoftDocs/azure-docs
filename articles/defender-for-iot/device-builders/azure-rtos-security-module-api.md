---
title: Defender-IoT-micro-agent for Azure RTOS API
description: Reference API for the Defender-IoT-micro-agent for Azure RTOS.
ms.topic: reference
ms.date: 11/09/2021
---


# Defender-IoT-micro-agent for Azure RTOS API (preview)

Defender for IoT APIs are governed by [Microsoft API License and Terms of use](/legal/microsoft-apis/terms-of-use).

This API is intended for use with the Defender-IoT-micro-agent for Azure RTOS only. For additional resources, see the [Defender-IoT-micro-agent for Azure RTOS GitHub resource](https://github.com/azure-rtos/azure-iot-preview/releases).

## Enable Defender-IoT-micro-agent for Azure RTOS

**nx_azure_iot_security_module_enable**

### Prototype

```c
UINT nx_azure_iot_security_module_enable(NX_AZURE_IOT *nx_azure_iot_ptr);
```

### Description

This routine enables the Azure IoT Defender-IoT-micro-agent subsystem. An internal state machine manages collection of security events and sends them to Azure IoT Hub. Only one NX_AZURE_IOT_SECURITY_MODULE instance is required and needed to manage data collection.

### Parameters

| Name | Description |
|---------|---------|
| nx_azure_iot_ptr  [in]    | A pointer to a `NX_AZURE_IOT`.  |

### Return values

|Return values  |Description |
|---------|---------|
|NX_AZURE_IOT_SUCCESS|   Successfully enabled Azure IoT Security Module.     |
|NX_AZURE_IOT_FAILURE   |  Failed to enable the Azure IoT Security Module due to an internal error.    |
|NX_AZURE_IOT_INVALID_PARAMETER   |  Security module requires a valid #NX_AZURE_IOT instance.      |

### Allowed from

Threads

## Disable Azure IoT Defender-IoT-micro-agent

**nx_azure_iot_security_module_disable**

### Prototype

```c
UINT nx_azure_iot_security_module_disable(NX_AZURE_IOT *nx_azure_iot_ptr);
```

### Description

This routine disables the Azure IoT Defender-IoT-micro-agent subsystem.

### Parameters

| Name | Description |
|---------|---------|
| nx_azure_iot_ptr  [in]    | A pointer to `NX_AZURE_IOT`. If NULL the singleton instance is disabled. |

### Return values

|Return values  |Description |
|---------|---------|
|NX_AZURE_IOT_SUCCESS     |   Successful when the Azure IoT Security Module is successfully disabled.      |
|NX_AZURE_IOT_INVALID_PARAMETER   |  Azure IoT Hub instance is different than the singleton composite instance.       |
|NX_AZURE_IOT_FAILURE    |  Failed to disable the Azure IoT Security Module due to an internal error.       |

### Allowed from

Threads

## Next steps

To learn more about how to get started with Azure RTOS Defender-IoT-micro-agent, see the following articles:

- Review the Defender for IoT RTOS Defender-IoT-micro-agent [overview](iot-security-azure-rtos.md).
