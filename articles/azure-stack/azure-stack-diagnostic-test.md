---
title: Run a validation test in Azure Stack  | Microsoft Docs
description: How to collect log files for diagnostics in Azure Stack
services: azure-stack
author: mattbriggs
manager: femila
services: azure-stack
cloud: azure-stack

ms.assetid: D44641CB-BF3C-46FE-BCF1-D7F7E1D01AFA
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2018
ms.author: mabrigg
---
# Run a validation test in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*
 
You can validate the status of your Azure Stack. When you have an issue, contact Microsoft Customer Services Support. Support asks you to run Test-AzureStack from your management node. The validation test isolates the failure. Support can then analyze the detailed logs, focus on the area where the error occurred, and work with you in resolving the issue.

## Run Test-AzureStack

When you have an issue, contact Microsoft Customer Services Support and then run **Run Test-AzureStack**.

1. You have an issue.
2. Contact Microsoft Customer Services Support.
3. Run **Test-AzureStack** from the privileged end point.
    1. Access the privileged endpoint. For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md). 
    2. Log in as **AzureStack\CloudAdmin** on the management host.
    3. Open PowerShell as an administrator.
    4. Run `Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint`.
    4. Run `Test-AzureStack`.
4. If any tests report **Fail**, run `Get-AzureStackLog -FilterByRole SeedRing -OutputPath <Log output path>` to gather logs from Test-AzureStack. For more information about diagnostic logs, see [Azure Stack diagnostics tools](azure-stack-diagnostics.md).
5. Send the SeedRing logs to Microsoft Customer Services Support. Microsoft Customer Services Support works with you to resolve the issue.

## Reference for Test-AzureStack

This section contains an overview for the Test-AzureStack cmdlet and a summary of the validation report.

### Test-AzureStack

Validates the status of Azure Stack. The cmdlet reports the status of your Azure Stack hardware and software. Support staff can use this  report to reduce the time to resolve Azure Stack support cases.

> [!Note]  
> Test-AzureStack may detect failures that are not resulting in cloud outages, such as a single failed disk or a single physical host node failure.

    ```Powershell
    Test-AzureStack -DoNotDeployTenantVm -AdminCredential username:password
    ```

| Parameter               | Value           | Required | Default | Description    |
| ---                     | ---             | ---      | ---     | ---            |
| ServiceAdminCredentials | PSCredential    | No       | FALSE   | Need to write. |
| DoNotDeployTenantVm     | SwitchParameter | No       | FALSE   | Need to write. |
| AdminCredential         | PSCredential    | No       | NA      | Need to write. |
| StorageConnectionString | String          | No       | NA      | Need to write. |
| List                    | SwitchParameter | No       | FALSE   | Need to write. |
| Ignore                  | String          | No       | NA      | Need to write. |
| Include                 | String          | No       | NA      | Need to write. |

The Test-AzureStack cmdlet supports the common parameters: Verbose, Debug, ErrorAction, ErrorVariable, WarningAction, WarningVariable, OutBuffer, PipelineVariable, and OutVariable. For more information, see [About Common Parameters](http://go.microsoft.com/fwlink/?LinkID=113216). 

### Examples of Test-AzureStack

The following examples assume you're signed in as **CloudAdmin** and accessing the privileged endpoint (PEP). For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md). 

#### Run Test-AzureStack interactively

In a PEP session, run:

    ```Powershell
    Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Test-AzureStack
    ```

#### Run Test-AzureStack with cloud scenarios

You can use Test-AzureStack to run cloud scenarios against your Azure Stack. These scenarios include:

 - Creating resource groups
 - Creating plans
 - Creating offers
 - Creating storage accounts
 - Creating a virtual machine
 - Perform blob operations using the storage account created in the test scenario
 - Perform queue operations using the storage account created in the test scenario
 - Perform table operations using the storage account created in the test scenario

The cloud scenarios require cloud administrator credentials. The cloud scenarios cannot be run using Active Directory Federated Services (ADFS) credentials. The Test-AzureStack cmdlet is only accessible via the PEP. But, the PEP doesn't support ADFS credentials.

Type the cloud administrator user name in UPN format serviceadmin@contoso.onmicrosoft.com (AAD). When prompted, type the password to the cloud administrator account.

In a PEP session, run:

    ```Powershell
    Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Test-AzureStack -ServiceAdminCredentials <Cloud administrator user name>
    ```

#### Run Test-AzureStack without cloud scenarios

In a PEP session, run:

    ```Powershell
    $session = New-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Invoke-Command -Session $session -ScriptBlock {Test-AzureStack}
    ```

To list available test scenarios:

    ```Powershell
    Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Test-AzureStack -List
    ```

#### Run a specified test

In a PEP session, run:

    ```Powershell
    Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Test-AzureStack -Include AzsSFRoleSummary,AzsInfraCapacity
    ```

To exclude specific tests:

    ```Powershell
    Enter-PSSession -ComputerName <ERCS VM name> -ConfigurationName PrivilegedEndpoint Test-AzureStack -Ignore AzsInfraPerformance
    ```

### Validation test

The following table summarizes the validation tests run by Test-AzureStack.

| Name                                                                                                                              | Description           |
|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Azure Stack Cloud Hosting Infrastructure Summary                                                                                  | Write the description. |
| Azure Stack Storage Services Summary                                                                                              | Write the description. |
| Azure Stack Infrastructure Role Instance Summary                                                                                  | Write the description. |
| Azure Stack Cloud Hosting Infrastructure Utilization                                                                              | Write the description. |
| Azure Stack Infrastructure Capacity                                                                                               | Write the description. |
| Azure Stack Portal and API Summary                                                                                                | Write the description. |
| Azure Stack Azure Resource Manager Certificate Summary                                                                                               | Write the description. |
| Infrastructure management controller, Network controller, Storage services, and Privileged endpoint Infrastructure Roles          | Write the description. |
| Infrastructure management controller, Network controller, Storage services, and Privileged endpoint Infrastructure Role Instances | Write the description. |
| Azure Stack Infrastructure Role summary                                                                                           | Write the description. |
| Azure Stack Cloud Service Fabric Services                                                                                         | Write the description. |
| Azure Stack Infrastructure Role Instance Performance                                                                              | Write the description. |
| Azure Stack Cloud Host Performance Summary                                                                                        | Write the description. |
| Azure Stack Service Resource Consumption Summary                                                                                  | Write the description. |
| Azure Stack Scale Unit Critical Events (Last 8 hours)                                                                             | Write the description. |
| Azure Stack Storage Services Physical Disks Summary                                                                               | Write the description. |

## Next steps

 - To learn more about Azure Stack diagnostics tools and issue logging, see [ Azure Stack diagnostics tools](azure-stack-diagnostics.md).
 - To learn more about troubleshooting, see [Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md)