---
title: 'Microsoft Entra Connect Single Object Sync '
description: Learn how to synchronize one object from Active Directory to Microsoft Entra ID for troubleshooting.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra Connect Single Object Sync 

The Microsoft Entra Connect Single Object Sync tool is a PowerShell cmdlet that can be used to synchronize an individual object from Active Directory to Microsoft Entra ID. The report generated can be used to investigate and troubleshoot per object synchronization issues. 

> [!NOTE]
> The tool supports synchronization from Active Directory to Microsoft Entra ID. It does not support synchronization from Microsoft Entra ID to Active Directory. 
>
> The tool supports synchronizing an Object Modification Add and Update. It does not support synchronizing an Object Modification Delete. 

## How it works
The Single Object Sync tool requires an Active Directory distinguished name as input to find the source connector and partition for import. It exports the changes to Microsoft Entra ID. The tool generates a JSON output similar to the **provisioningObjectSummary** resource type. 

The Single Object Sync tool performs the following steps: 

 1. Determine if Object's (source) Domain (Active Directory Connector and Partition) in sync scope. 
 2. Determine if Object's (target) Domain (Microsoft Entra Connector and Partition) in sync scope. 
 3. Determine if Object's Organizational Unit in sync scope. 
 4. Determine if Object is accessible using connector account credentials. 
 5. Determine if Object's Type in sync scope. 
 6. Determine if Object is in sync scope if Group Filtering enabled. 
 7. Import Object from Active Directory to Active Directory Connector Space. 
 8. Import Object from Microsoft Entra ID to Microsoft Entra Connector Space. 
 9. Sync Object from Active Directory Connector Space. 
 10. Export Object from Microsoft Entra Connector Space to Microsoft Entra ID. 

In addition to the JSON output, the tool generates an HTML report that has all the details of the synchronization operation. The HTML report is located in **C:\ProgramData\AADConnect\ADSyncObjectDiagnostics\ ADSyncSingleObjectSyncResult-\<date\>.htm**. This HTML report can be shared with the support team to do further troubleshooting, if needed. 

The HTML report has the following: 

|Tab|Description|
|-----|-----|
|Steps|Outlines the steps taken to synchronize an object. Each step contains details for troubleshooting. The Import, Sync and Export steps contains additional attribute info such as name, is multi-valued, type, value, value add, value delete, operation, sync rule, mapping type and data source.| 
|Troubleshooting & Recommendation|Provides the error code and reason. The error information is available only if a failure happens.| 
|Modified Properties|Shows the old value and the new value. If there is no old value or if the new value is deleted, that cell is blank. For multivalued attributes it shows the count. The attribute name is a link to Steps tab: Export Object from Microsoft Entra Connector Space to Microsoft Entra ID: Attribute Info that contains additional details of the attribute such as name, is multi-valued, type, value, value add, value delete, operation, sync rule, mapping type and data source.| 
|Summary|Provides an overview of what happened and identifiers for the object in the source and target systems.| 

## Prerequisites 

In order to use the Single Object Sync tool, you will need to use the following:  
 - 2021 March release ([1.6.4.0](reference-connect-version-history.md#1640)) of Microsoft Entra Connect or later.
 -  [PowerShell 5.0](/powershell/scripting/windows-powershell/whats-new/what-s-new-in-windows-powershell-50)

### Run the Single Object Sync tool 

To run the Single Object Sync tool, perform the following steps: 

 1. Open a new Windows PowerShell session on your Microsoft Entra Connect server with the Run as Administrator option. 

 2. Set the [execution policy](/powershell/module/microsoft.powershell.security/set-executionpolicy) to RemoteSigned or Unrestricted. 

 3. Disable the sync scheduler after verifying that no synchronization operations are running. 

     `Set-ADSyncScheduler -SyncCycleEnabled $false` 

 4. Import the AdSync Diagnostics module 

     `Import-module -Name "C:\Program Files\Microsoft Azure AD Sync\Bin\ADSyncDiagnostics\ADSyncDiagnostics.psm1"` 

 5. Invoke the Single Object Sync cmdlet. 

     `Invoke-ADSyncSingleObjectSync -DistinguishedName "CN=testobject,OU=corp,DC=contoso,DC=com" | Out-File -FilePath ".\output.json"` 

 6. Re-enable the Sync Scheduler. 

     `Set-ADSyncScheduler -SyncCycleEnabled $true`

|Single Object Sync Input Parameters|Description| 
|-----|----|
|DistinguishedName|This is a required string parameter. </br></br>This is the Active Directory object’s distinguished name that needs synchronization and troubleshooting.| 
|StagingMode|This is an optional switch parameter.</br></br>This parameter can be used to prevent exporting the changes to Microsoft Entra ID.</br></br>**Note**: The cmdlet will commit the sync operation. </br></br>**Note**: Microsoft Entra Connect Staging server will not export the changes to Microsoft Entra ID.|
|NoHtmlReport|This is an optional switch parameter.</br></br>This parameter can be used to prevent generating the HTML report. 

## Single Object Sync throttling 

The Single Object Sync tool **is** intended for investigating and troubleshooting per object synchronization issues. It is **not** intended to replace the synchronization cycle run by the Scheduler. The import from Microsoft Entra ID and export to Microsoft Entra ID are subject to throttling limits. Please retry after 5 minutes, if you reach the throttling limit. 

## Next steps
- [Troubleshooting object synchronization](tshoot-connect-objectsync.md)
- [Troubleshoot object not synchronizing](tshoot-connect-object-not-syncing.md)
- [End-to-end troubleshooting of Microsoft Entra Connect objects and attributes](/troubleshoot/azure/active-directory/troubleshoot-aad-connect-objects-attributes)
