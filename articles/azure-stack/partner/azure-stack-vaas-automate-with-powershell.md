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
ms.date: 11/26/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Automate Azure Stack Validation with PowerShell

Validation as a Service (VaaS) provides the ability to automate the launching of tests using the **LaunchVaaSTests.ps1** script.

You can use PowerShell for the following workflow:

- Test Pass

In this tutorial, you learn how to create a script that:

> [!div class="checklist"]
> * Installs prerequisites
> * Installs and starts the local agent
> * Launches a category of tests, like integration, functional, reliability
> * Reports test results

## Launch the Test Pass workflow

1. Open an elevated PowerShell prompt.

2. Run the following script to download the automation script:

    ```PowerShell
    New-Item -ItemType Directory -Path <VaaSLaunchDirectory>
    Set-Location <VaaSLaunchDirectory>
    Invoke-WebRequest -Uri https://storage.azurestackvalidation.com/packages/Microsoft.VaaS.Scripts.latest.nupkg -OutFile "LaunchVaaS.zip"
    Expand-Archive -Path ".\LaunchVaaS.zip" -DestinationPath .\ -Force
    ```

3. Run the following script with the appropriate parameter values:

    ```PowerShell
    $VaaSAccountCreds = New-Object System.Management.Automation.PSCredential "<VaaSUserId>", (ConvertTo-SecureString "<VaaSUserPassword>" -AsPlainText -Force)
    .\LaunchVaaSTests.ps1 -VaaSAccountCreds $VaaSAccountCreds `
                          -VaaSAccountTenantId <VaaSAccountTenantId> `
                          -VaaSSolutionName <VaaSSolutionName> `
                          -VaaSTestPassName <VaaSTestPassName> `
                          -VaaSTestCategories Integration,Functional `
                          -MaxScriptWaitTimeInHours 12 `
                          -ServiceAdminUserName <AzSServiceAdminUser> `
                          -ServiceAdminUserPassword <AzSServiceAdminPassword> `
                          -TenantAdminUserName <AzSTenantAdminUser> `
                          -TenantAdminUserPassword <AzSTenantAdminPassword> `
                          -CloudAdminUserName <AzSCloudAdminUser> `
                          -CloudAdminUserPassword <AzSCloudAdminPassword>
    ```

    **Parameters**

    | Parameter | Description |
    | --- | --- |
    | VaaSUserld | Your VaaS user ID. |
    | VaaSUserPassword | Your VaaS password. |
    | VaaSAccountTenantId | Your VaaS tenant GUID. |
    | VaaSSolutionName | The name of the VaaS solution under which the test pass will run. |
    | VaaSTestPassName | The name of the VaaS test pass workflow to create. |
    | VaaSTestCategories | `Integration`, `Functional`, or. `Reliability`. If you use multiple values, separate each value by a comma.  |
    | ServiceAdminUserName | Your Azure Stack service admin account.  |
    | ServiceAdminPassword | Your Azure Stack service password.  |
    | TenantAdminUserName | The administrator for the primary tenant.  |
    | TenantAdminPassword | The password for the primary tenant.  |
    | CloudAdminUserName | The cloud administrator username.  |
    | CloudAdminPassword | The password for the cloud administrator.  |

4. Review the results of your test. For other options, see [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md).

## Next steps

To learn more about PowerShell on Azure Stack, review the lastest modules.

> [!div class="nextstepaction"]
> [Azure Stack Module](https://docs.microsoft.com/powershell/azure/azure-stack/overview?view=azurestackps-1.5.0)
