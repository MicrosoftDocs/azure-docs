---
title: Run a validation test in Azure Stack  | Microsoft Docs
description: How to collect log files for diagnostics in Azure Stack.
services: azure-stack
author: mattbriggs
manager: femila
services: azure-stack
cloud: azure-stack

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: article
ms.date: 10/15/2018
ms.author: mabrigg
ms.reviewer: hectorl
---

# Run a validation test for Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*
 
You can validate the status of your Azure Stack. When you have an issue, contact Microsoft Customer Services Support. Support asks you to run **Test-AzureStack** from your management node. The validation test isolates the failure. Support can then analyze the detailed logs, focus on the area where the error occurred, and work with you in resolving the issue.

## Run Test-AzureStack

When you have an issue, contact Microsoft Customer Services Support and then run **Run Test-AzureStack**.

1. You have an issue.
2. Contact Microsoft Customer Services Support.
3. Run **Test-AzureStack** from the privileged endpoint.
    1. Access the privileged endpoint. For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md). 
    2. On the ASDK, sign in to the management host as **AzureStack\CloudAdmin**.  
    On an integrated system, you will need to use the IP address for the privileged-end-point for the management provided to you by your OEM hardware vendor.
    3. Open PowerShell as an administrator.
    4. Run: `Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint`
    5. Run: `Test-AzureStack`
4. If any tests report fail, run: `Get-AzureStackLog -FilterByRole SeedRing -OutputPath <Log output path>` The cmdlet gathers the logs from Test-AzureStack. For more information about diagnostic logs, see [Azure Stack diagnostics tools](azure-stack-diagnostics.md).
5. Send the **SeedRing** logs to Microsoft Customer Services Support. Microsoft Customer Services Support works with you to resolve the issue.

## Reference for Test-AzureStack

This section contains an overview for the Test-AzureStack cmdlet and a summary of the validation report.

### Test-AzureStack

Validates the status of Azure Stack. The cmdlet reports the status of your Azure Stack hardware and software. Support staff can use this  report to reduce the time to resolve Azure Stack support cases.

> [!Note]  
> **Test-AzureStack** may detect failures that are not resulting in cloud outages, such as a single failed disk or a single physical host node failure.

#### Syntax

````PowerShell
  Test-AzureStack
````

#### Parameters

| Parameter               | Value           | Required | Default |
| ---                     | ---             | ---      | ---     |
| ServiceAdminCredentials | String    | No       | FALSE   |
| DoNotDeployTenantVm     | SwitchParameter | No       | FALSE   |
| AdminCredential         | PSCredential    | No       | NA      |
| List                    | SwitchParameter | No       | FALSE   |
| Ignore                  | String          | No       | NA      |
| Include                 | String          | No       | NA      |
| BackupSharePath         | String          | No       | NA      |
| BackupShareCredential   | PSCredential    | No       | NA      |


The Test-AzureStack cmdlet supports the common parameters: Verbose, Debug, ErrorAction, ErrorVariable, WarningAction, WarningVariable, OutBuffer, PipelineVariable, and OutVariable. For more information, see [About Common Parameters](http://go.microsoft.com/fwlink/?LinkID=113216). 

### Examples of Test-AzureStack

The following examples assume you're signed in as **CloudAdmin** and accessing the privileged endpoint (PEP). For instructions, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md). 

#### Run Test-AzureStack interactively without cloud scenarios

In a PEP session, run:

````PowerShell
    Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
    Test-AzureStack
````

#### Run Test-AzureStack with cloud scenarios

You can use **Test-AzureStack** to run cloud scenarios against your Azure Stack. These scenarios include:

 - Creating resource groups
 - Creating plans
 - Creating offers
 - Creating storage accounts
 - Creating a virtual machine
 - Perform blob operations using the storage account created in the test scenario
 - Perform queue operations using the storage account created in the test scenario
 - Perform table operations using the storage account created in the test scenario

The cloud scenarios require cloud administrator credentials. 
> [!Note]  
> You cannot run the cloud scenarios using Active Directory Federated Services (AD FS) credentials. The **Test-AzureStack** cmdlet is only accessible via the PEP. But, the PEP doesn't support AD FS credentials.

Type the cloud administrator user name in UPN format serviceadmin@contoso.onmicrosoft.com (Azure AD). When prompted, type the password to the cloud administrator account.

In a PEP session, run:

````PowerShell
  Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
  Test-AzureStack -ServiceAdminCredentials <Cloud administrator user name>
````

#### Run Test-AzureStack without cloud scenarios

In a PEP session, run:

````PowerShell
  $session = New-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
  Invoke-Command -Session $session -ScriptBlock {Test-AzureStack}
````

#### List available test scenarios:

In a PEP session, run:

````PowerShell
  Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
  Test-AzureStack -List
````

#### Run a specified test

In a PEP session, run:

````PowerShell
  Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
  Test-AzureStack -Include AzsSFRoleSummary, AzsInfraCapacity
````

To exclude specific tests:

````PowerShell
    Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint  -Credential $localcred
    Test-AzureStack -Ignore AzsInfraPerformance
````

### Run Test-AzureStack to test infrastructure backup settings

Before configuring infrastructure backup, you can test the backup share path and credential using the **AzsBackupShareAccessibility** test.

In a PEP session, run:

````PowerShell
    Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
    Test-AzureStack -Include AzsBackupShareAccessibility -BackupSharePath "\\<fileserver>\<fileshare>" -BackupShareCredential <PSCredentials-for-backup-share>
````
After configuring backup, you can run AzsBackupShareAccessibility to validate the share is accessible from the ERCS, from a PEP session run:

````PowerShell
    Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint  -Credential $localcred
    Test-AzureStack -Include AzsBackupShareAccessibility
````

To test new credentials with the configured backup share, from a PEP session run:

````PowerShell
    Enter-PSSession -ComputerName <ERCS-VM-name> -ConfigurationName PrivilegedEndpoint -Credential $localcred
    Test-AzureStack -Include AzsBackupShareAccessibility -BackupShareCredential <PSCredential for backup share>
````

### Validation test

The following table summarizes the validation tests run by **Test-AzureStack**.

| Name                                                                                                                              |
|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Azure Stack Cloud Hosting Infrastructure Summary                                                                                  |
| Azure Stack Storage Services Summary                                                                                              |
| Azure Stack Infrastructure Role Instance Summary                                                                                  |
| Azure Stack Cloud Hosting Infrastructure Utilization                                                                              |
| Azure Stack Infrastructure Capacity                                                                                               |
| Azure Stack Portal and API Summary                                                                                                |
| Azure Stack Azure Resource Manager Certificate Summary                                                                                               |
| Infrastructure management controller, Network controller, Storage services, and Privileged endpoint Infrastructure Roles          |
| Infrastructure management controller, Network controller, Storage services, and Privileged endpoint Infrastructure Role Instances |
| Azure Stack Infrastructure Role summary                                                                                           |
| Azure Stack Cloud Service Fabric Services                                                                                         |
| Azure Stack Infrastructure Role Instance Performance                                                                              |
| Azure Stack Cloud Host Performance Summary                                                                                        |
| Azure Stack Service Resource Consumption Summary                                                                                  |
| Azure Stack Scale Unit Critical Events (Last 8 hours)                                                                             |
| Azure Stack Storage Services Physical Disks Summary                                                                               |
|Azure Stack Backup Share Accessibility Summary                                                                                     |

## Next steps

 - To learn more about Azure Stack diagnostics tools and issue logging, see [ Azure Stack diagnostics tools](azure-stack-diagnostics.md).
 - To learn more about troubleshooting, see [Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md)
