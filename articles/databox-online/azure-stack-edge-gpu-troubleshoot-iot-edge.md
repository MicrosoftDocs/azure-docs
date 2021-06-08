---
title: Troubleshoot IoT Edge issues on your Azure Stack Edge Pro with GPU device| Microsoft Docs 
description: Describes how to troubleshoot errors with IoT Edge on your Azure Stack Edge GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 06/08/2021
ms.author: alkohli
---
# Troubleshoot IoT Edge issues on your Azure Stack Edge Pro GPU device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot compute-related errors on an Azure Stack Edge GPU device by reviewing IoT Edge agent runtime responses.<!--Will update intro when I know the source of the second set of error messages.-->  

## IoT Edge errors

[!INCLUDE [Troubleshoot IoT Edge runtime](../../includes/azure-stack-edge-iot-troubleshoot-compute.md)]

<!--Include file has been added to since it was written. Transition from "IoT Edge errors" to miscellaneous errors related to the IoT Edge service is a little fuzzy. In particular, there's a reference to "The following error"; 5 errors follow. These errors are surfaced through some mechanism other than IoT Edge agent runtime responses? Second H2 needed for these?-->


## Next steps

- [Debug Kubernetes issues related to IoT Edge]azure-stack-edge-gpu-connect-powershell.md-interface#debug-kubernetes-issues-related-to-iot-edge).
- [Troubleshoot device issues](azure-stack-edge-gpu-troubleshoot.md).