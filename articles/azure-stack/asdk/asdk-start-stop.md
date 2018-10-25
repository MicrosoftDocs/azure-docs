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
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Start and stop the Azure Stack Development Kit (ASDK)
It is not recommended to simply restart the ASDK host computer. Instead, you should follow the procedures in this article to properly shut down and restart ASDK services. 

## Stop Azure Stack 
To properly shut down Azure Stack services, and the ASDK host computer, use the following PowerShell commands:

1. Log in as AzureStack\CloudAdmin on the ASDK host computer.
2. Open PowerShell as an administrator (not PowerShell ISE).
3. Run the following commands to establish a privileged endpoint (PEP) session: 

   ```powershell
   Enter-PSSession -ComputerName AzS-ERCS01 -ConfigurationName PrivilegedEndpoint
   ```
4. Next, in the PEP session, use the **Stop-AzureStack** cmdlet to stop Azure Stack services and shut down the ASDK host computer:

   ```powershell
   Stop-AzureStack
   ```
5. Review the PowerShell output to ensure all Azure Stack services are successfully shut down before the ASDK host computer shuts down. The shutdown process takes several minutes.

## Start Azure Stack 
ASDK services should start automatically when the host computer is started. However, ASDK infrastructure services startup time varies based on the performance of the ASDK host computer hardware configuration. It can take several hours for all services to successfully restart in some cases.

Regardless of how the ASDK was shut down, you should use the following steps to verify that all Azure Stack services are started and fully operational after the host computer is powered on: 

1. Power on the ASDK host computer. 
2. Log in as AzureStack\CloudAdmin on the ASDK host computer.
3. Open PowerShell as an administrator (not PowerShell ISE).
4. Run the following commands to establish a privileged endpoint (PEP) session:

   ```powershell
   Enter-PSSession -ComputerName AzS-ERCS01 -ConfigurationName PrivilegedEndpoint
   ```
5. Next, in the PEP session, run the following commands to check the startup status of Azure Stack services:

   ```powershell
   Get-ActionStatus Start-AzureStack
   ```
6. Review the output to ensure that Azure Stack services have restarted successfully.

To learn more about the recommended procedures to properly shut down and restart Azure Stack services, see [Start and stop Azure Stack](.\.\azure-stack-start-and-stop.md). 

## Troubleshoot startup and shutdown 
Perform these steps if Azure Stack services don't successfully start within two hours after you power on your ASDK host computer:

1. Log in as AzureStack\CloudAdmin on the ASDK host computer.
2. Open PowerShell as an administrator (not PowerShell ISE).
3. Run the following commands to establish a privileged endpoint (PEP) session:

   ```powershell
   Enter-PSSession -ComputerName AzS-ERCS01 -ConfigurationName PrivilegedEndpoint
   ```
4. Next, in the PEP session, run the following commands to check the startup status of Azure Stack services:

   ```powershell
   Test-AzureStack
   ```
5. Review the output and resolve any errors. For more information, see [Run a validation test of Azure Stack](.\.\azure-stack-diagnostic-test.md).
6. Restart Azure Stack services from within the PEP session by running the **Start-AzureStack** cmdlet:

   ```powershell
   Start-AzureStack
   ```

If running **Start-AzureStack** results in a failure, visit the [Azure Stack support forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurestack) to get ASDK troubleshooting support. 

## Next steps 
Learn more about Azure Stack diagnostic tool and issue logging, see [Azure Stack diagnostic tools](.\.\azure-stack-diagnostics.md).
