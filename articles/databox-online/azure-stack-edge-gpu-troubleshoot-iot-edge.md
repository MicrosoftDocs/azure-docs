---
title: Troubleshoot IoT Edge issues on your Azure Stack Edge Pro with GPU device| Microsoft Docs 
description: Describes how to troubleshoot errors with IoT Edge on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 04/06/2022
ms.author: alkohli
ms.custom: "contperf-fy21q4"
---
# Troubleshoot IoT Edge issues on your Azure Stack Edge Pro GPU device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot compute-related errors on an Azure Stack Edge Pro GPU device by reviewing runtime responses for the IoT Edge agent and errors for the IoT Edge service that's installed on your device.

## Review IoT Edge runtime responses

[!INCLUDE [Troubleshoot IoT Edge runtime](../../includes/azure-stack-edge-iot-troubleshoot-compute.md)]

## Troubleshoot IoT Edge service errors

The following errors are related to the IoT Edge service on your Azure Stack Edge Pro GPU device.

[!INCLUDE [Troubleshoot IoT Edge errors](../../includes/azure-stack-edge-iot-troubleshoot-compute-error-detail.md)]


## Next steps

- [Debug Kubernetes issues related to IoT Edge](azure-stack-edge-gpu-connect-powershell-interface.md#debug-kubernetes-issues-related-to-iot-edge).
- [Troubleshoot device issues](azure-stack-edge-gpu-troubleshoot.md).