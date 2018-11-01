---
title: Start and stop Azure Stack | Microsoft Docs
description: Learn how to start and shut down Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 43BF9DCF-F1B7-49B5-ADC5-1DA3AF9668CA
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Start and stop Azure Stack
You should follow the procedures in this article to properly shut down and restart Azure Stack services. Shutdown will physically power off the entire Azure Stack environment. Startup powers on all infrastructure roles and returns tenant resources to the power state they were in prior to shutdown.

## Stop Azure Stack 

Shut down Azure Stack with the following steps:

1. Prepare all workloads running on your Azure Stack environment's tenant resources for the upcoming shutdown. 

2. Open a Privileged Endpoint Session (PEP) from a machine with network access to the Azure Stack ERCS VMs. For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md).

3. From the PEP, run:

    ```powershell
      Stop-AzureStack
    ```

4. Wait for all physical Azure Stack nodes to power off.

> [!Note]  
> You can verify the power status of a physical node by following the instructions from the Original Equipment Manufacturer (OEM) who supplied your Azure Stack hardware. 

## Start Azure Stack 

Start Azure Stack with the following steps. Follow these steps regardless of how Azure Stack stopped.

1. Power on each of the physical nodes in your Azure Stack environment. Verify the power on instructions for the physical nodes by following the instructions from the Original Equipment Manufacturer (OEM) who supplied the hardware for your Azure Stack.

2. Wait until the Azure Stack infrastructure services starts. Azure Stack infrastructure services can require two hours to finishing the start process. You can verify the start status of Azure Stack with the [**Get-ActionStatus** cmdlet](#get-the-startup-status-for-azure-stack).

3. Ensure that all of your tenant resources have returned to the state they were in prior to shutdown. Workloads running on tenant resources may need to be reconfigured after startup by the workload manager.

## Get the startup status for Azure Stack

Get the startup for the Azure Stack startup routine with the following steps:

1. Open a Privileged Endpoint Session from a machine with network access to the Azure Stack ERCS VMs.

2. From the PEP, run:

    ```powershell
      Get-ActionStatus Start-AzureStack
    ```

## Troubleshoot startup and shutdown of Azure Stack

Perform the following steps if the infrastructure and tenant services don't successfully start 2 hours after you power on your Azure Stack environment. 

1. Open a Privileged Endpoint Session from a machine with network access to the Azure Stack ERCS VMs.

2. Run: 

    ```powershell
      Test-AzureStack
      ```

3. Review the output and resolve any health errors. For more information, see [Run a validation test of Azure Stack](azure-stack-diagnostic-test.md).

4. Run:

    ```powershell
      Start-AzureStack
    ```

5. If running **Start-AzureStack** results in a failure, contact Microsoft Customer Services Support. 

## Next steps 

Learn more about [Azure Stack diagnostic tools](azure-stack-diagnostics.md)
