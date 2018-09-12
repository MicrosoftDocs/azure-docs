---
title: Monitor updates in Azure Stack using the privileged endpoint | Microsoft Docs
description: Learn how to use the privileged endpoint to monitor update status for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 449ae53e-b951-401a-b2c9-17fee2f491f1
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/17/2018
ms.author: mabrigg

---
# Monitor updates in Azure Stack using the privileged endpoint

*Applies to: Azure Stack integrated systems*

You can use the privileged endpoint to monitor the progress of an Azure Stack update run, and to resume a failed update run from the last successful step should the Azure Stack portal become unavailable.  Using the Azure Stack portal is the recommended method to manage updates in Azure Stack.

The following new PowerShell cmdlets for update management are included in the 1710 update for Azure Stack integrated systems.

| Cmdlet  | Description  |
|---------|---------|
| `Get-AzureStackUpdateStatus` | Returns the status of the currently running, completed, or failed update. Provides the high-level status of the update operation, and an XML document that describes both the current step and the corresponding state. |
| `Resume-AzureStackUpdate` | Resumes a failed update at the point where it failed. In certain scenarios, you may have to complete mitigation steps before you resume the update.         |
| | |

## Verify the cmdlets are available
Because the cmdlets are new in the 1710 update package for Azure Stack, the 1710 update process needs to get to a certain point before the monitoring capability is available. Typically, the cmdlets are available if the status in the administrator portal indicates that the 1710 update is at the **Restart Storage Hosts** step. Specifically, the cmdlet update occurs during **Step: Running step 2.6 - Update PrivilegedEndpoint whitelist**.

You can also determine whether the cmdlets are available  programmatically by querying the command list from the privileged endpoint. To do this, run the following commands from the hardware lifecycle host or from a Privileged Access Workstation. Also, make sure the privileged endpoint is a trusted host. For more information, see step 1 of [Access the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint). 

1. Create a PowerShell session on any of the ERCS virtual machines in your Azure Stack environment (*Prefix*-ERCS01, *Prefix*-ERCS02, or *Prefix*-ERCS03). Replace *Prefix* with the virtual machine prefix string that’s specific to your environment.

   ```powershell
   $cred = Get-Credential

   $pepSession = New-PSSession -ComputerName <Prefix>-ercs01 -Credential $cred -ConfigurationName PrivilegedEndpoint 
   ```
   When prompted for credentials, use the &lt;*Azure Stack domain*&gt;\cloudadmin account, or an account that's a member of the CloudAdmins group. For the CloudAdmin account, enter the same password that was provided during installation for the AzureStackAdmin domain administrator account.

2. Get the full list of commands that are available in the privileged endpoint. 

   ```powershell
   $commands = Invoke-Command -Session $pepSession -ScriptBlock { Get-Command } 
   ```
3. Determine if the privileged endpoint was updated.

   ```powershell
   $updateManagementModuleName = "Microsoft.Azurestack.UpdateManagement"
	if (($commands | ? Source -eq $updateManagementModuleName)) {
   Write-Host "Privileged endpoint was updated to support update monitoring tools."
	} else {
   Write-Host "Privileged endpoint has not been updated yet. Please try again later."
	} 
   ```

4. List the commands specific to the Microsoft.AzureStack.UpdateManagement module.

   ```powershell
   $commands | ? Source -eq $updateManagementModuleName 
   ```
   For example:
   ```powershell
   $commands | ? Source -eq $updateManagementModuleName
   
   CommandType     Name                                               Version    Source                                                  PSComputerName
	-----------     ----                                               -------    ------                                                  --------------
   Function        Get-AzureStackUpdateStatus                         0.0        Microsoft.Azurestack.UpdateManagement                   Contoso-ercs01
   Function        Resume-AzureStackUpdate                            0.0        Microsoft.Azurestack.UpdateManagement                   Contoso-ercs01
   ``` 

## Use the update management cmdlets

> [!NOTE]
> Run the following commands from the hardware lifecycle host or from a Privileged Access Workstation. Also, make sure the privileged endpoint is a trusted host. For more information, see step 1 of [Access the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint).

### Connect to the privileged endpoint and assign session variable

Run the following commands to create a PowerShell session on any of the ERCS virtual machines in your Azure Stack environment (*Prefix*-ERCS01, *Prefix*-ERCS02, or *Prefix*-ERCS03), and to assign a session variable.

```powershell
$cred = Get-Credential

$pepSession = New-PSSession -ComputerName <Prefix>-ercs01 -Credential $cred -ConfigurationName PrivilegedEndpoint 
```
 When prompted for credentials, use the &lt;*Azure Stack domain*&gt;\cloudadmin account, or an account that's a member of the CloudAdmins group. For the CloudAdmin account, enter the same password that was provided during installation for the AzureStackAdmin domain administrator account.

### Get high-level status of the current update run 

To get a high-level status of the current update run, run the following commands: 

```powershell
$statusString = Invoke-Command -Session $pepSession -ScriptBlock { Get-AzureStackUpdateStatus -StatusOnly }

$statusString.Value 
```

Possible values include:

- Running
- Completed
- Failed 
- Canceled

You can run these commands  repeatedly to see the most up-to-date status. You don't have to re-establish a connection to check again.

### Get the full update run status with details 

You can get the full update run summary as an XML string. You can write the string to a file for examination, or convert it to an XML document and use PowerShell to parse it. The following command parses the XML to get a hierarchical list of the currently running steps.

```powershell
[xml]$updateStatus = Invoke-Command -Session $pepSession -ScriptBlock { Get-AzureStackUpdateStatus }

$updateStatus.SelectNodes("//Step[@Status='InProgress']")
```

In the following example, the top-level step (Cloud Update) has a child plan to update and restart the storage hosts. It shows that the Restart Storage Hosts plan is updating the Blob Storage service on one of the hosts.

```powershell
[xml]$updateStatus = Invoke-Command -Session $pepSession -ScriptBlock { Get-AzureStackUpdateStatus }

$updateStatus.SelectNodes("//Step[@Status='InProgress']") 

	FullStepIndex : 2
	Index         : 2
	Name          : Cloud Update
	Description   : Perform cloud update.
	StartTimeUtc  : 2017-10-13T12:50:39.9020351Z
	Status        : InProgress
	Task          : Task
	
	FullStepIndex  : 2.9
	Index          : 9
	Name           : Restart Storage Hosts
	Description    : Restart Storage Hosts.
	EceErrorAction : Stop
	StartTimeUtc   : 2017-10-13T15:44:06.7431447Z
	Status         : InProgress
	Task           : Task
	
	FullStepIndex : 2.9.2
	Index         : 2
	Name          : PreUpdate ACS Blob Service
	Description   : Check function level, update deployment artifacts, configure Blob service settings
	StartTimeUtc  : 2017-10-13T15:44:26.0708525Z
	Status        : InProgress
	Task          : Task
```

### Resume a failed update operation

If the update fails, you can resume the update run where it left off.

```powershell
Invoke-Command -Session $pepSession -ScriptBlock { Resume-AzureStackUpdate } 
```

## Troubleshoot

The privileged endpoint is available on all ERCS virtual machines in the Azure Stack environment. Because the connection is not made to a highly available endpoint, you may experience occasional interruptions, warning, or error messages. These messages may indicate that the session was disconnected or that there was an error communicating with the ECE Service. This behavior is expected. You can retry the operation in a few minutes or create a new privileged endpoint session on one of the other ERCS virtual machines. 

## Next steps

- [Managing updates in Azure Stack](azure-stack-updates.md) 


