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
3. Run Test-AzureStack.
    1. Log in as **AzureStack\CloudAdmin** on the host.
    2. Open a PowerShell window as an administrator.
    3. Run the **Test-AzureStack** PowerShell cmdlet.
4. Review the report.
5. Run Get-AzureStackLog. For more information about diagnostic logs, see [Azure Stack diagnostics tools](azure-stack-diagnostics.md).
6. Microsoft Customer Services Support works with you to resolve the issue.

## Reference for Test-AzureStack

This section contains an overview for the Test-AzureStack cmdlet and a summary of the validation report.

### Test-AzureStack

Validates the status of Azure Stack.

    ```powershell  
    Test-AzureStack -DoNotDeployTenantVm -AdminCredential username:password
    ```

| Parameter               | Value           | Required | Position | Default | Accept pipeline input | Accept wildcard characters | Description    |
|-------------------------|-----------------|----------|----------|---------|-----------------------|----------------------------|----------------|
| ServiceAdminCredentials | PSCredential    | No       | Named    | NA      | FALSE                 | FALSE                      | Need to write. |
| DoNotDeployTenantVm     | SwitchParameter | No       | Named    | FALSE   | FALSE                 | FALSE                      | Need to write. |
| AdminCredential         | PSCredential    | No       | Named    | NA      | FALSE                 | FALSE                      | Need to write. |
| StorageConnectionString | String          | No       | Named    | NA      | FALSE                 | FALSE                      | Need to write. |
| List                    | SwitchParameter | No       | Named    | FALSE   | FALSE                 | FALSE                      | Need to write. |
| Ignore                  | String          | No       | Named    | NA      | FALSE                 | FALSE                      | Need to write. |
| Include                 | String          | No       | Named    | NA      | FALSE                 | FALSE                      | Need to write. |

The Test-AzureStack cmdlet supports the common parameters: Verbose, Debug, ErrorAction, ErrorVariable, WarningAction, WarningVariable, OutBuffer, PipelineVariable, and OutVariable. For more information, see [About Common Parameters](http://go.microsoft.com/fwlink/?LinkID=113216). 

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