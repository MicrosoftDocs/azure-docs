---
title: Start and stop the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: Learn how to start and shut down the Azure Stack Development Kit (ASDK).
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/09/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Start and stop the Azure Stack Development Kit (ASDK)
It is not recommended to simply restart the ASDK host computer. Instead, you should follow the procedures in this article to properly shut down and restart ASDK services. 

## Stop Azure Stack 
To properly shut down ASDK services, run the following PowerShell command on the ASDK host computer:

    ```powershell
      Stop-AzureStack
    ```

Wait for the ASDK host computer to power off.

## Start Azure Stack 
ASDK services should start automatically when the host computer is started. However, regardless of how the ASDK was shut down, you should start Azure Stack with the following steps: 

1. Power on the ASDK host computer.

2. Wait until the Azure Stack infrastructure services start. ASDK infrastructure services startup time varies based on the performance of the ASDK host computer hardware configuration, but can take several hours in some cases.
3. To get startup status for ASDK services, run the following PowerShell on the ASDK host computer:

    ```powershell
      Get-ActionStatus Start-AzureStack
    ```

## Troubleshoot startup and shutdown of Azure Stack
Perform these steps if ASDK services don't successfully start within two hours after you power on your Azure Stack environment:

1. Run the following PowerShell on the ASDK host computer:

    ```powershell
      Test-AzureStack
      ```

2. Review the output and resolve any errors. For more information, see [Run a validation test of Azure Stack](azure-stack-diagnostic-test.md).

4. Restart ASDK services by running **Start-AzureStack** cmdlet again:

    ```powershell
      Start-AzureStack
    ```

5. If running **Start-AzureStack** results in a failure, visit the [Azure Stack support forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurestack) to get ASDK troubleshooting support. 

## Next steps 
Learn more about Azure Stack diagnostic tool and issue logging, see [Azure Stack diagnostic tools](.\.\azure-stack-diagnostics.md).
