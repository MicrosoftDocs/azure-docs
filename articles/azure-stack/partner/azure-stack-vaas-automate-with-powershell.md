---
title: Automate Azure Stack Validation with PowerShell | Microsoft Docs
description: You can automate Azure Stack Validation with PowerShell.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Automate Azure Stack Validation with PowerShell

Validation as a Service (VaaS) provides the ability to automate the launching of tests using the **LaunchVaaSTests.ps1** script.

You can use PowerShell for the following workflow:

- Test Pass

This script encompasses the four elements of a workflow:

- Installs prerequisites.
- Installs and starts the local agent.
- Launches a category of tests, such as integration, functional, reliability.
- Reports test results.

## Launch the Test Pass workflow

1. Open an elevated PowerShell prompt.

2. Run the following script to download the automation script:

    ````PowerShell  
    New-Item -ItemType Directory -Path <VaaSLaunchDirectory>
    Set-Location <VaaSLaunchDirectory>
    Invoke-WebRequest -Uri https://vaastestpacksprodeastus.blob.core.windows.net/packages/Microsoft.VaaS.Scripts.latest.nupkg -OutFile "LaunchVaaS.zip"
    Expand-Archive -Path ".\LaunchVaaS.zip" -DestinationPath .\ -Force
    ````

3. Run the following script with the appropriate parameter values:

    ````PowerShell  
    $VaaSAccountCreds = New-Object System.Management.Automation.PSCredential "<VaaSUserId>", (ConvertTo-SecureString "<VaaSUserPassword>"  -AsPlainText -Force)
    $ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<ServiceAdminUser>", (ConvertTo-SecureString "<ServiceAdminPassword>" -AsPlainText -Force)
    $TenantAdminCreds = New-Object System.Management.Automation.PSCredential "<TenantAdminUser>", (ConvertTo-SecureString "<TenantAdminPassword>" -AsPlainText -Force)
    .\LaunchVaaSTests.ps1 -VaaSAccountCreds $VaaSAccountCreds `
        -VaaSAccountTenantId <VaaSAccountTenantId> `
        -VaaSSolutionName <VaaSSolutionName> `
        -VaaSTestPassName <VaaSTestPassName> `
        -VaaSTestCategories Integration,Functional `
        -MaxScriptWaitTimeInHours 12 `
        -ServiceAdminCreds $ServiceAdminCreds `
    ````

    **Parameters**

    | Parameter | Description |
    | --- | --- |
    | VaaSUserld | Your VaaS user ID. |
    | VaaSUserPassword | Your VaaS password. |
    | ServiceAdminUser | Your Azure Stack service admin account.  |
    | ServiceAdminPassword | Your Azure Stack service password.  |
    | TenantAdminUser | The administrator for the primary tenant.  |
    | TenantAdminPassword | The password for the primary tenant.  |
    | FunctionalCategory| Integration, Functional, or. Reliability. If you use multiple values, separate each value by a comma.  |

4. Review the results of your test. For other options, see [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md).

## Next steps

- To learn more about PowerShell on Azure Stack, see the latest [Azure Stack Module](https://docs.microsoft.com/powershell/azure/azure-stack/overview?view=azurestackps-1.3.0) Reference.