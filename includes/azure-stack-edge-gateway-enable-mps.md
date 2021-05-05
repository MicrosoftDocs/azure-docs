---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 02/11/2021
ms.author: alkohli
---

1. Before you begin, make sure that:

    1. You've configured and [Activated your Azure Stack Edge Pro device](../articles/databox-online/azure-stack-edge-gpu-deploy-activate.md) with an Azure Stack Edge resource in Azure.
    1. You've [Configured compute on this device in the Azure portal](../articles/databox-online/azure-stack-edge-deploy-configure-compute.md#configure-compute).
    
1. [Connect to the PowerShell interface](../articles/databox-online/azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
1. Use the following command to enable MPS on your device.

    ```powershell
    Start-HcsGpuMPS
    ```