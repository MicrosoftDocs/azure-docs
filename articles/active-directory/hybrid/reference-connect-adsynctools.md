---
title: 'Azure AD Connect: ADSyncTools PowerShell Reference | Microsoft Docs'
description: This document provides reference information for the ADSyncTools.psm1 PowerShell module.
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.date: 10/19/2018
ms.subservice: hybrid
ms.author: billmath
ms.topic: reference

ms.collection: M365-identity-device-management
---

# Azure AD Connect:  ADSyncTools PowerShell Reference
The following documentation provides reference information for the ADSyncTools.psm1 PowerShell Module that is included with Azure AD Connect.

## Clear-ADSyncToolsConsistencyGuid

### SYNOPSIS
Clear the mS-Ds-ConsistencyGuid from AD User

### SYNTAX

```
Clear-ADSyncToolsConsistencyGuid [-User] <Object> [<CommonParameters>]
```

### DESCRIPTION
Clear the value in mS-Ds-ConsistencyGuid for the target AD user

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -User
Target User in AD to set

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Confirm-ADSyncToolsADModuleLoaded

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Confirm-ADSyncToolsADModuleLoaded
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

## Connect-AdSyncDatabase

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Connect-AdSyncDatabase [-Server] <String> [[-Instance] <String>] [[-Database] <String>] [[-UserName] <String>]
 [[-Password] <String>] [<CommonParameters>]
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

### PARAMETERS

#### -Database
{{Fill Database Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Instance
{{Fill Instance Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Password
{{Fill Password Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 4
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Server
{{Fill Server Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -UserName
{{Fill UserName Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 3
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Export-ADSyncToolsConsistencyGuidMigration

### SYNOPSIS
Export ConsistencyGuid Report

### SYNTAX

```
Export-ADSyncToolsConsistencyGuidMigration [-AlternativeLoginId] [-UserPrincipalName] <String>
 [-ImmutableIdGUID] <String> [-Output] <String> [<CommonParameters>]
```

### DESCRIPTION
Generates a ConsistencyGuid report based on an import CSV file from Import-ADSyncToolsImmutableIdMigration

### EXAMPLES

#### EXAMPLE 1
```
Import-Csv .\AllSyncUsers.csv | Export-ADSyncToolsConsistencyGuidMigration -Output ".\AllSyncUsers-Report"
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -AlternativeLoginId
Use Alternative Login ID (mail)

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

#### -UserPrincipalName
UserPrincipalName

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -ImmutableIdGUID
ImmutableIdGUID

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -Output
Output filename for CSV and LOG files

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 3
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Get-ADSyncSQLBrowserInstances

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Get-ADSyncSQLBrowserInstances [[-hostName] <String>]
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

### PARAMETERS

#### -hostName
{{Fill hostName Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

## Get-ADSyncToolsADuser

### SYNOPSIS
Get user from AD

### SYNTAX

```
Get-ADSyncToolsADuser [-User] <Object> [<CommonParameters>]
```

### DESCRIPTION
Returns an AD object 
TO DO: Multi forest support

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -User
Target User in AD to set ConsistencyGuid

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Get-ADSyncToolsConsistencyGuid

### SYNOPSIS
Get the mS-Ds-ConsistencyGuid from AD User

### SYNTAX

```
Get-ADSyncToolsConsistencyGuid [-User] <Object> [<CommonParameters>]
```

### DESCRIPTION
Returns the value in mS-Ds-ConsistencyGuid attribute of the target AD user in GUID format

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -User
Target User in AD to set

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Get-ADSyncToolsObjectGuid

### SYNOPSIS
Get the ObjectGuid from AD User

### SYNTAX

```
Get-ADSyncToolsObjectGuid [-User] <Object> [<CommonParameters>]
```

### DESCRIPTION
Returns the value in ObjectGUID attribute of the target AD user in GUID format

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -User
Target User in AD to set

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Get-ADSyncToolsRunHistory

### SYNOPSIS
Get AAD Connect Run History

### SYNTAX

```
Get-ADSyncToolsRunHistory [[-Days] <Int32>] [<CommonParameters>]
```

### DESCRIPTION
Function that returns the AAD Connect Run History in XML format

### EXAMPLES

#### EXAMPLE 1
```
Get-ADSyncToolsRunHistory
```

#### EXAMPLE 2
```
Get-ADSyncToolsRunHistory -Days 1
```

### PARAMETERS

#### -Days
{{Fill Days Description}}

```yaml
Type: Int32
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: 3
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Get-ADSyncToolsSourceAnchorChanged

### SYNOPSIS
Get users with SourceAnchor changed errors

### SYNTAX

```
Get-ADSyncToolsSourceAnchorChanged [-sourcePath] <Object> [-outputPath] <Object> [<CommonParameters>]
```

### DESCRIPTION
Function queries AAD Connect Run History and exports all the users reporting the Error: 
 "SourceAnchor attribute has changed."

### EXAMPLES

#### EXAMPLE 1
```
#Required Parameters
```

$sourcePath = Read-Host -Prompt "Enter your log file path with file name" #"\<Source_Path\>"
 $outputPath = Read-Host -Prompt "Enter your out file path with file name" #"\<Out_Path\>"
 
 Get-ADSyncToolsUsersSourceAnchorChanged -sourcePath $sourcePath -outputPath $outputPath

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -sourcePath
{{Fill sourcePath Description}}

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -outputPath
{{Fill outputPath Description}}

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Import-ADSyncToolsImmutableIdMigration

### SYNOPSIS
Import ImmutableID from AAD

### SYNTAX

```
Import-ADSyncToolsImmutableIdMigration [-Output] <String> [-IncludeSyncUsersFromRecycleBin]
 [<CommonParameters>]
```

### DESCRIPTION
Generates a file with all Azure AD Synchronized users containing the ImmutableID value in GUID format
Requirements: MSOnline PowerShell Module

### EXAMPLES

#### EXAMPLE 1
```
Import-ADSyncToolsImmutableIdMigration -OutputFile '.\AllSyncUsers.csv'
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -Output
Output CSV file

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -IncludeSyncUsersFromRecycleBin
Get Synchronized Users from Azure AD Recycle Bin

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).


## Invoke-AdSyncDatabaseQuery

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Invoke-AdSyncDatabaseQuery [-SqlConnection] <SqlConnection> [[-Query] <String>] [<CommonParameters>]
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

### PARAMETERS

#### -Query
{{Fill Query Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SqlConnection
{{Fill SqlConnection Description}}

```yaml
Type: SqlConnection
Parameter Sets: (All)
Aliases:

Required: True
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Remove-ADSyncToolsExpiredCertificates

### SYNOPSIS
Script to Remove Expired Certificates from UserCertificate Attribute

### SYNTAX

```
Remove-ADSyncToolsExpiredCertificates [-TargetOU] <String> [[-BackupOnly] <Boolean>] [-ObjectClass] <String>
 [<CommonParameters>]
```

### DESCRIPTION
This script takes all the objects from a target Organizational Unit in your Active Directory domain - filtered by Object Class (User/Computer) 
and deletes all expired certificates present in the UserCertificate attribute.
By default (BackupOnly mode) it will only backup expired certificates to a file and not do any changes in AD.
If you use -BackupOnly $false then any Expired Certificate present in UserCertificate attribute for these objects will be removed from AD after being copied to file.
Each certificate will be backed up to a separated filename: ObjectClass_ObjectGUID_CertThumprint.cer
The script will also create a log file in CSV format showing all the users with certificates that either are valid or expired including the actual action taken (Skipped/Exported/Deleted).

### EXAMPLES

#### EXAMPLE 1
```
Check all users in target OU - Expired Certificates will be copied to separated files and no certificates will be removed
```

Remove-ADSyncToolsExpiredCertificates -TargetOU "OU=Users,OU=Corp,DC=Contoso,DC=com" -ObjectClass user

#### EXAMPLE 2
```
Delete Expired Certs from all Computer objects in target OU - Expired Certificates will be copied to files and removed from AD
```

Remove-ADSyncToolsExpiredCertificates -TargetOU "OU=Computers,OU=Corp,DC=Contoso,DC=com" -ObjectClass computer -BackupOnly $false

### PARAMETERS

#### -TargetOU
Target OU to lookup for AD objects

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -BackupOnly
BackupOnly will not delete any certificates from AD

```yaml
Type: Boolean
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: True
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ObjectClass
Object Class filter

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 3
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Repair-ADSyncToolsAutoUpgradeState

### SYNOPSIS
Short description

### SYNTAX

```
Repair-ADSyncToolsAutoUpgradeState
```

### DESCRIPTION
Long description

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

## Resolve-ADSyncHostAddress

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Resolve-ADSyncHostAddress [[-hostName] <String>]
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

### PARAMETERS

#### -hostName
{{Fill hostName Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

## Restore-ADSyncToolsExpiredCertificates

### SYNOPSIS
(TO DO) Restores AD UserCertificate attribute from a certificate file

### SYNTAX

```
Restore-ADSyncToolsExpiredCertificates
```

### DESCRIPTION
Long description

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

## Set-ADSyncToolsConsistencyGuid

### SYNOPSIS
Set mS-Ds-ConsistencyGuid on AD User

### SYNTAX

```
Set-ADSyncToolsConsistencyGuid [-User] <Object> [-Value] <Object> [<CommonParameters>]
```

### DESCRIPTION
Set a value in mS-Ds-ConsistencyGuid attribute for the target AD user

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -User
Target User in AD to set ConsistencyGuid

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -Value
ImmutableId (Byte array, GUID, GUID string or Base64 string)

```yaml
Type: Object
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Test-ADSyncNetworkPort

### SYNOPSIS
{{Fill in the Synopsis}}

### SYNTAX

```
Test-ADSyncNetworkPort [[-hostName] <String>] [[-port] <String>]
```

### DESCRIPTION
{{Fill in the Description}}

### EXAMPLES

#### Example 1
```powershell
PS C:\> {{ Add example code here }}
```

{{ Add example description here }}

### PARAMETERS

#### -hostName
{{Fill hostName Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 0
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -port
{{Fill port Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

## Trace-ADSyncToolsADImport

### SYNOPSIS
Creates a trace file from and AD Import Step

### SYNTAX

```
Trace-ADSyncToolsADImport [[-ADConnectorXML] <String>] [[-dc] <String>] [[-rootDN] <String>]
 [[-filter] <String>] [-SkipCredentials] [[-ADwatermark] <String>] [<CommonParameters>]
```

### DESCRIPTION
Traces all ldap queries of an AAD Connect AD Import run from a given AD watermark checkpoint (partition cookie). 
Creates a trace file '.\ADimportTrace_yyyyMMddHHmmss.log' on the current folder.

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -ADConnectorXML
{{Fill ADConnectorXML Description}}

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -dc
XML file of AD Connector Export

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: DC1.domain.contoso.com
Accept pipeline input: False
Accept wildcard characters: False
```

#### -rootDN
Target Domain Controller

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 3
Default value: DC=Domain,DC=Contoso,DC=com
Accept pipeline input: False
Accept wildcard characters: False
```

#### -filter
Forest Root DN

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 4
Default value: (&(objectClass=*))
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipCredentials
Types of AD objects to trace \> * = all object types

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADwatermark
If already running as Domain Administrator there's no need to provide AD credentials.
Manual input of watermark, instead of XML file e.g.
$ADwatermark = "TVNEUwMAAAAXyK9ir1zSAQAAAAAAAAAA(...)"

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 5
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Trace-ADSyncToolsLdapQuery

### SYNOPSIS
Short description

### SYNTAX

```
Trace-ADSyncToolsLdapQuery [-Context] <String> [-Server] <String> [-Port] <Int32> [-Filter] <String>
 [<CommonParameters>]
```

### DESCRIPTION
Long description

### EXAMPLES

#### EXAMPLE 1
```
Example of how to use this cmdlet
```

#### EXAMPLE 2
```
Another example of how to use this cmdlet
```

### PARAMETERS

#### -Context
Param1 help description

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Server
Param2 help description

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: Localhost
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Port
Param2 help description

```yaml
Type: Int32
Parameter Sets: (All)
Aliases:

Required: True
Position: 3
Default value: 389
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Filter
Param2 help description

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 4
Default value: (objectClass=*)
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Update-ADSyncToolsConsistencyGuidMigration

### SYNOPSIS
Updates users with the new ConsistencyGuid (ImmutableId)

### SYNTAX

```
Update-ADSyncToolsConsistencyGuidMigration [[-DistinguishedName] <String>] [-ImmutableIdGUID] <String>
 [-Action] <String> [-Output] <String> [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
Updates users with the new ConsistencyGuid (ImmutableId) value taken from the ConsistencyGuid Report 
This function supports the WhatIf switch
Note: ConsistencyGuid Report must be imported with Tab Demiliter

### EXAMPLES

#### EXAMPLE 1
```
Import-Csv .\AllSyncUsersTEST-Report.csv -Delimiter "`t"| Update-ADSyncToolsConsistencyGuidMigration -Output .\AllSyncUsersTEST-Result2 -WhatIf
```

#### EXAMPLE 2
```
Import-Csv .\AllSyncUsersTEST-Report.csv -Delimiter "`t"| Update-ADSyncToolsConsistencyGuidMigration -Output .\AllSyncUsersTEST-Result2
```

### PARAMETERS

#### -DistinguishedName
DistinguishedName

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 1
Default value: False
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -ImmutableIdGUID
ImmutableIdGUID

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -Action
Action

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 3
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```

#### -Output
Output filename for LOG files

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 4
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -WhatIf
Shows what would happen if the cmdlet runs.
The cmdlet is not run.

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases: wi

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -Confirm
Prompts you for confirmation before running the cmdlet.

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases: cf

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).
