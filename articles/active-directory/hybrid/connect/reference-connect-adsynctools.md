---
title: 'Microsoft Entra Connect: ADSyncTools PowerShell Reference'
description: This document provides reference information for the ADSyncTools.psm1 PowerShell module.
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.topic: reference

ms.collection: M365-identity-device-management 
ms.custom: has-azure-ad-ps-ref
---

# Microsoft Entra Connect:  ADSyncTools PowerShell Reference
The following documentation provides reference information for the `ADSyncTools.psm1` PowerShell module included with Microsoft Entra Connect.

## Install the ADSyncTools PowerShell module

To install the ADSyncTools PowerShell module do the following:

1.  Open Windows PowerShell with administrative privileges
2.  Type or copy and paste the following: 
    ``` powershell
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
        Import-module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\Tools\AdSyncTools"
    ```
3.  Hit enter.
4.  To verify the module was installed, enter or copy and paste the following"
    ```powershell
    Get-module AdSyncTools
    ```
5.  You should now see information about the module.


## Clear-ADSyncToolsMsDsConsistencyGuid
### SYNOPSIS
Clear an Active Directory object mS-DS-ConsistencyGuid
### SYNTAX
```
Clear-ADSyncToolsMsDsConsistencyGuid [-Identity] <Object> [<CommonParameters>]
```
### DESCRIPTION
Clears the value in mS-DS-ConsistencyGuid for the target Active Directory object.
Supports Active Directory objects in multi-domain forests.

### EXAMPLES
#### EXAMPLE 1
```
Clear-ADSyncToolsMsDsConsistencyGuid -Identity 'CN=User1,OU=Sync,DC=Contoso,DC=com'
```
#### EXAMPLE 2
```
Clear-ADSyncToolsMsDsConsistencyGuid -Identity 'User1@Contoso.com'
```
#### EXAMPLE 3
```
'User1@Contoso.com' | Clear-ADSyncToolsMsDsConsistencyGuid
```
### PARAMETERS
#### -Identity
Target object in AD to clear mS-DS-ConsistencyGuid
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Connect-ADSyncToolsSqlDatabase
### SYNOPSIS
Connect to a SQL database for testing purposes
### SYNTAX
```
Connect-ADSyncToolsSqlDatabase [-Server] <String> [[-Instance] <String>] [[-Database] <String>]
 [[-Port] <String>] [[-UserName] <String>] [[-Password] <String>] [<CommonParameters>]
```
### DESCRIPTION
SQL Diagnostics related functions and utilities
### EXAMPLES
#### EXAMPLE 1
```
Connect-ADSyncToolsSqlDatabase -Server 'sqlserver01.contoso.com' -Database 'ADSync'
```
#### EXAMPLE 2
```
Connect-ADSyncToolsSqlDatabase -Server 'sqlserver01.contoso.com' -Instance 'INTANCE01' -Database 'ADSync'
```
### PARAMETERS
#### -Server
SQL Server Name
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
#### -Instance
SQL Server Instance Name
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
#### -Database
SQL Server Database Name
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
#### -Port
SQL Server Port (e.g.
49823)
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
#### -UserName
SQL Server Login Username
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
#### -Password
SQL Server Login Password
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: False
Position: 6
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## ConvertFrom-ADSyncToolsAadDistinguishedName
### SYNOPSIS
Convert Microsoft Entra Connector DistinguishedName to ImmutableId
### SYNTAX
```
ConvertFrom-ADSyncToolsAadDistinguishedName [-DistinguishedName] <String> [<CommonParameters>]
```
### DESCRIPTION
Takes a Microsoft Entra Connector DistinguishedName like CN={514635484D4B376E38307176645973555049486139513D3D}
and converts to the respective base64 ImmutableID value, e.g.
QF5HMK7n80qvdYsUPIHa9Q==
### EXAMPLES
#### EXAMPLE 1
```
ConvertFrom-ADSyncToolsAadDistinguishedName 'CN={514635484D4B376E38307176645973555049486139513D3D}'
```
### PARAMETERS
#### -DistinguishedName
Microsoft Entra Connector Space DistinguishedName
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## ConvertFrom-ADSyncToolsImmutableID
### SYNOPSIS
Convert Base64 ImmutableId (SourceAnchor) to GUID value
### SYNTAX
```
ConvertFrom-ADSyncToolsImmutableID [-Value] <String> [<CommonParameters>]
```
### DESCRIPTION
Converts value of the ImmutableID from Base64 string and returns a GUID value
In case Base64 string cannot be converted to GUID, returns a Byte Array.
### EXAMPLES
#### EXAMPLE 1
```
ConvertFrom-ADSyncToolsImmutableID 'iGhmiAEBERG7uxI0VniQqw=='
```
#### EXAMPLE 2
```
'iGhmiAEBERG7uxI0VniQqw==' | ConvertFrom-ADSyncToolsImmutableID
```
### PARAMETERS
#### -Value
ImmutableId in Base64 format
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## ConvertTo-ADSyncToolsAadDistinguishedName
### SYNOPSIS
Convert ImmutableId to Microsoft Entra Connector DistinguishedName
### SYNTAX
```
ConvertTo-ADSyncToolsAadDistinguishedName [-ImmutableId] <String> [<CommonParameters>]
```
### DESCRIPTION
Takes an ImmutableId (SourceAnchor) like QF5HMK7n80qvdYsUPIHa9Q== and converts to the respective
Microsoft Entra Connector DistinguishedName value, e.g.
CN={514635484D4B376E38307176645973555049486139513D3D}
### EXAMPLES
#### EXAMPLE 1
```
ConvertTo-ADSyncToolsAadDistinguishedName 'QF5HMK7n80qvdYsUPIHa9Q=='
```
### PARAMETERS
#### -ImmutableId
ImmutableId (SourceAnchor)
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## ConvertTo-ADSyncToolsCloudAnchor
### SYNOPSIS
Convert Base64 Anchor to CloudAnchor
### SYNTAX
```
ConvertTo-ADSyncToolsCloudAnchor [-Anchor] <String> [<CommonParameters>]
```
### DESCRIPTION
Takes a Base64 Anchor like VAAAAFUAcwBlAHIAXwBjADcAMgA5ADAAMwBlAGQALQA3ADgAMQA2AC0ANAAxAGMAZAAtADkAMAA2ADYALQBlAGEAYwAzADMAZAAxADcAMQBkADcANwAAAA==
and converts to the respective CloudAnchor value, e.g.
User_abc12345-1234-abcd-9876-ab0123456789
### EXAMPLES
#### EXAMPLE 1
```
ConvertTo-ADSyncToolsCloudAnchor "VAAAAFUAcwBlAHIAXwBjADcAMgA5ADAAMwBlAGQALQA3ADgAMQA2AC0ANAAxAGMAZAAtADkAMAA2ADYALQBlAGEAYwAzADMAZAAxADcAMQBkADcANwAAAA=="
```
#### EXAMPLE 2
```
"VAAAAFUAcwBlAHIAXwBjADcAMgA5ADAAMwBlAGQALQA3ADgAMQA2AC0ANAAxAGMAZAAtADkAMAA2ADYALQBlAGEAYwAzADMAZAAxADcAMQBkADcANwAAAA==" | ConvertTo-ADSyncToolsCloudAnchor
```
### PARAMETERS
#### -Anchor
Base64 Anchor
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## ConvertTo-ADSyncToolsImmutableID
### SYNOPSIS
Convert GUID (ObjectGUID / ms-Ds-Consistency-Guid) to a Base64 string
### SYNTAX
```
ConvertTo-ADSyncToolsImmutableID [-Value] <Object> [<CommonParameters>]
```
### DESCRIPTION
Converts a value in GUID, GUID string or byte array format to a Base64 string
### EXAMPLES
#### EXAMPLE 1
```
ConvertTo-ADSyncToolsImmutableID '88888888-0101-3333-cccc-1234567890cd'
```
#### EXAMPLE 2
```
'88888888-0101-3333-cccc-1234567890cd' | ConvertTo-ADSyncToolsImmutableID
```
### PARAMETERS
#### -Value
GUID, GUID string or byte array
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

## Export-ADSyncToolsAadDisconnectors
### SYNOPSIS
Export Microsoft Entra Disconnector objects
### SYNTAX
```
Export-ADSyncToolsAadDisconnectors [[-SyncObjectType] <Object>] [<CommonParameters>]
```
### DESCRIPTION
Executes CSExport tool to export all Disconnectors to XML and then takes this XML output and converts it to a CSV file
with: UserPrincipalName, Mail, SourceAnchor, DistinguishedName, CsObjectId, ObjectType, ConnectorId, CloudAnchor
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsAadDisconnectors -SyncObjectType 'PublicFolder'
```
Exports to CSV all PublicFolder Disconnector objects
#### EXAMPLE 2
```
Export-ADSyncToolsAadDisconnectors
```
Exports to CSV all Disconnector objects
### PARAMETERS
#### -SyncObjectType
ObjectType to include in output
```yaml
Type: Object
Parameter Sets: (All)
Aliases:
Required: False
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### INPUTS
Use ObjectType argument in case you want to export Disconnectors for a given object type only
### OUTPUTS
Exports a CSV file with Disconnector objects containing: 
UserPrincipalName, Mail, SourceAnchor, DistinguishedName, CsObjectId, ObjectType, ConnectorId and CloudAnchor

## Export-ADSyncToolsAadPublicFolders
### SYNOPSIS
Exports all synchronized Mail-Enabled Public Folder objects from Microsoft Entra ID to a CSV file
### SYNTAX
```
Export-ADSyncToolsAadPublicFolders [-Credential] <PSCredential> [-Path] <Object> [<CommonParameters>]
```
### DESCRIPTION
This function exports to a CSV file all the synchronized Mail-Enabled Public Folders (MEPF) present in Microsoft Entra ID.
It can be used in conjunction with Remove-ADSyncToolsAadPublicFolders to identify and remove orphaned Mail-Enabled Public Folders in Microsoft Entra ID.
This function requires the credentials of a Global Administrator in Microsoft Entra ID and authentication with MFA is not supported.
NOTE: If DirSync has been disabled on the tenant, you will need to temporarily re-enabled DirSync in order to remove orphaned Mail Enabled Public Folders from Microsoft Entra ID.
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsAadPublicFolders -Credential $(Get-Credential) -Path <file_name>
```
### PARAMETERS
#### -Credential
Microsoft Entra Global Admin Credential
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: true
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Path
Path for output file
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: true
Position: 2
Default value: None
Accept pipeline input: false (ByPropertyName)
Accept wildcard characters: false
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### INPUTS

### OUTPUTS
This cmdlet creates the `<filename>` containing all synced Mail-Enabled PublicFolder objects in CSV format.
    
## Export-ADSyncToolsHybridAadJoinReport
### SYNOPSIS
Generates a report of certificates stored in Active Directory Computer objects, specifically, 
certificates issued by the Microsoft Entra hybrid join feature.
### SYNTAX
#### SingleObject
```
Export-ADSyncToolsHybridAadJoinReport [-DN] <String> [[-Filename] <String>] [<CommonParameters>]
```
#### MultipleObjects
```
Export-ADSyncToolsHybridAadJoinReport [-OU] <String> [[-Filename] <String>] [<CommonParameters>]
```
### DESCRIPTION
This tool checks for all certificates present in UserCertificate property of a Computer object in AD and, for each 
non-expired certificate present, validates if the certificate was issued for the Microsoft Entra hybrid join feature 
(that is, Subject Name is CN={ObjectGUID}).
Before version 1.4, Microsoft Entra Connect would synchronize to Microsoft Entra any Computer that contained at least one certificate but 
in Microsoft Entra Connect version 1.4 and later, ADSync engine can identify Microsoft Entra hybrid join certificates and will "cloudfilter" 
(exclude) the computer object from synchronizing to Microsoft Entra ID unless there's a valid Microsoft Entra hybrid join certificate present.
Microsoft Entra Device objects that were already synchronized to AD but do not have a valid Microsoft Entra hybrid join certificate will be 
deleted from Microsoft Entra ID (CloudFiltered=TRUE) by Microsoft Entra Connect.
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsHybridAzureADjoinCertificateReport -DN 'CN=Computer1,OU=SYNC,DC=Fabrikam,DC=com'
```
#### EXAMPLE 2
```
Export-ADSyncToolsHybridAzureADjoinCertificateReport -OU 'OU=SYNC,DC=Fabrikam,DC=com' -Filename "MyHybridAzureADjoinReport.csv" -Verbose
```
### PARAMETERS
#### -DN
Computer DistinguishedName
```yaml
Type: String
Parameter Sets: SingleObject
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -OU
AD OrganizationalUnit
```yaml
Type: String
Parameter Sets: MultipleObjects
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Filename
Output CSV filename (optional)
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### RELATED LINKS
More Information:
[Understand Microsoft Entra Connect 1.4.xx.x and device disappearance](/troubleshoot/azure/active-directory/reference-connect-device-disappearance)

## Export-ADSyncToolsObjects
### SYNOPSIS
Export Microsoft Entra Connect Objects to XML files
### SYNTAX
#### ObjectId
```
Export-ADSyncToolsObjects [-ObjectId] <Object> [-Source] <Object> [-ExportSerialized] [<CommonParameters>]
```
#### DistinguishedName
```
Export-ADSyncToolsObjects [-DistinguishedName] <Object> [-ConnectorName] <Object> [-ExportSerialized]
 [<CommonParameters>]
```
### DESCRIPTION
Exports internal ADSync objects from Metaverse and associated connected objects from Connector Spaces
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsObjects -ObjectId '9D220D58-0700-E911-80C8-000D3A3614C0' -Source Metaverse
```
#### EXAMPLE 2
```
Export-ADSyncToolsObjects -ObjectId '9e220d58-0700-e911-80c8-000d3a3614c0' -Source ConnectorSpace
```
#### EXAMPLE 3
```
Export-ADSyncToolsObjects -DistinguishedName 'CN=User1,OU=ADSync,DC=Contoso,DC=com' -ConnectorName 'Contoso.com'
```
### PARAMETERS
#### -ObjectId
ObjectId is the unique identifier of the object in the respective connector space or metaverse
```yaml
Type: Object
Parameter Sets: ObjectId
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Source
Source is the table where the object resides which can either ConnectorSpace or Metaverse
```yaml
Type: Object
Parameter Sets: ObjectId
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -DistinguishedName
DistinguishedName is the identifier of the object in the respective connector space
```yaml
Type: Object
Parameter Sets: DistinguishedName
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -ConnectorName
ConnectorName is the name of the connector space where the object resides
```yaml
Type: Object
Parameter Sets: DistinguishedName
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -ExportSerialized
ExportSerialized exports additional XML files
```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases:
Required: False
Position: 3
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Export-ADSyncToolsRunHistory
### SYNOPSIS
Export Microsoft Entra Connect Run History
### SYNTAX
```
Export-ADSyncToolsRunHistory [-TargetName] <String> [<CommonParameters>]
```
### DESCRIPTION
Function to export Microsoft Entra Connect Run Profile and Run Step results to CSV and XML format respectively.
The resulting Run Profile CSV file can be imported into a spreadsheet and the Run Step XML file can be imported with Import-Clixml
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsRunHistory -TargetName MyADSyncHistory
```
### PARAMETERS
#### -TargetName
Name of the output file
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Export-ADSyncToolsSourceAnchorReport
### SYNOPSIS
Export ms-ds-Consistency-Guid Report
### SYNTAX
```
Export-ADSyncToolsSourceAnchorReport [-AlternativeLoginId] [-UserPrincipalName] <String>
 [-ImmutableIdGUID] <String> [-Output] <String> [<CommonParameters>]
```
### DESCRIPTION
Generates a ms-ds-Consistency-Guid report based on an import CSV file from Import-ADSyncToolsSourceAnchor
### EXAMPLES
#### EXAMPLE 1
```
Import-Csv .\AllSyncUsers.csv | Export-ADSyncToolsSourceAnchorReport -Output ".\AllSyncUsers-Report"
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Get-ADSyncToolsAadObject
### SYNOPSIS
Get synced objects for a given SyncObjectType
### SYNTAX
```
Get-ADSyncToolsAadObject [-SyncObjectType] <Object> [-Credential] <PSCredential> [<CommonParameters>]
```
### DESCRIPTION
Reads from Microsoft Entra all synced objects for a given object class (SyncObjectType).
### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsAadObject -SyncObjectType 'publicFolder' -Credential $(Get-Credential)
```
### PARAMETERS
#### -SyncObjectType
Object Type
```yaml
Type: Object
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Credential
Microsoft Entra Global Administrator Credential
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

#### CommonParameters

This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

### OUTPUTS

This cmdlet returns the "Shadow" properties that are synchronized by the sync client, which might be different than the actual value stored in the respective property of Microsoft Entra ID. For instance, a user's UPN that is synchronized with a non-verified domain suffix 'user@nonverified.domain', will have the UPN suffix in Microsoft Entra ID converted to the tenant's default domain, 'user@tenantname.onmicrosoft.com'. In this case, Get-ADSyncToolsAadObject will return the "Shadow" value of 'user@nonverified.domain', and not the actual value in Microsoft Entra ID 'user@tenantname.onmicrosoft.com'.

## Get-ADSyncToolsMsDsConsistencyGuid
### SYNOPSIS
Get an Active Directory object ms-ds-ConsistencyGuid
### SYNTAX
```
Get-ADSyncToolsMsDsConsistencyGuid [-Identity] <Object> [<CommonParameters>]
```
### DESCRIPTION
Returns the value in mS-DS-ConsistencyGuid attribute of the target Active Directory object in GUID format. 
Supports Active Directory objects in multi-domain forests.
### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsMsDsConsistencyGuid -Identity 'CN=User1,OU=Sync,DC=Contoso,DC=com'
```
#### EXAMPLE 2
```
Get-ADSyncToolsMsDsConsistencyGuid -Identity 'User1@Contoso.com'
```
#### EXAMPLE 3
```
'User1@Contoso.com' | Get-ADSyncToolsMsDsConsistencyGuid
```
### PARAMETERS
#### -Identity
Target object in AD to get
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Get-ADSyncToolsRunHistory
### SYNOPSIS
Get Microsoft Entra Connect Run History
### SYNTAX
```
Get-ADSyncToolsRunHistory [[-Days] <Int32>] [<CommonParameters>]
```
### DESCRIPTION
Function that returns the Microsoft Entra Connect Run History in XML format
### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsRunHistory
```
#### EXAMPLE 2
```
Get-ADSyncToolsRunHistory -Days 3
```
### PARAMETERS
#### -Days
Number of days back to collect History (default = 1)
```yaml
Type: Int32
Parameter Sets: (All)
Aliases:
Required: False
Position: 1
Default value: 1
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Get-ADSyncToolsRunHistoryLegacyWmi
### SYNOPSIS
Get Microsoft Entra Connect Run History for older versions of Microsoft Entra Connect (WMI)
### SYNTAX
```
Get-ADSyncToolsRunHistoryLegacyWmi [[-Days] <Int32>] [<CommonParameters>]
```
### DESCRIPTION
Function that returns the Microsoft Entra Connect Run History in XML format
### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsRunHistory
```
#### EXAMPLE 2
```
Get-ADSyncToolsRunHistory -Days 3
```
### PARAMETERS
#### -Days
Number of days back to collect History (default = 1)
```yaml
Type: Int32
Parameter Sets: (All)
Aliases:
Required: False
Position: 1
Default value: 1
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Get-ADSyncToolsSqlBrowserInstances
### SYNOPSIS
Get SQL Server Instances from SQL Browser service
### SYNTAX
```
Get-ADSyncToolsSqlBrowserInstances [[-Server] <String>]
```
### DESCRIPTION
SQL Diagnostics related functions and utilities
### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsSqlBrowserInstances -Server 'sqlserver01'
```
### PARAMETERS
#### -Server
SQL Server Name
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
## Get-ADSyncToolsTenantAzureEnvironment
### SYNOPSIS
Helper function to get which Azure environment the user belongs.
### SYNTAX
```
Get-ADSyncToolsTenantAzureEnvironment [-Credential] <PSCredential> [<CommonParameters>]
```
### DESCRIPTION
This function will call Oauth discovery endpoint to get CloudInstance and 
tenant_region_scope to determine the Azure environment.
https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration

### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsTenantAzureEnvironment -Credential (Get-Credential)
```
### PARAMETERS
#### -Credential
The user's PowerShell Credential object:

```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### INPUTS
The user's PowerShell Credential object

### OUTPUTS
The Azure environment (string)
## Get-ADSyncToolsTls12
### SYNOPSIS
Gets Client\Server TLS 1.2 settings for .NET Framework
### SYNTAX
```
Get-ADSyncToolsTls12 [<CommonParameters>]
```
### DESCRIPTION
Reads information from the Registry regarding TLS 1.2 for .NET Framework:

| Path                                                         | Name                     |
| ------------------------------------------------------------ | ------------------------ |
| HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319 | SystemDefaultTlsVersions |
| HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319 | SchUseStrongCrypto       |
| HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319            | SystemDefaultTlsVersions |
| HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319            | SchUseStrongCrypto       |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server | Enabled                  |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server | DisabledByDefault        |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client | Enabled                  |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client | DisabledByDefault        |

### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsTls12
```
### PARAMETERS
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### RELATED LINKS
More Information:
[TLS 1.2 enforcement for Microsoft Entra Connect](reference-connect-tls-enforcement.md)

## Import-ADSyncToolsObjects
### SYNOPSIS
Import Microsoft Entra Connect Object from XML file
### SYNTAX
```
Import-ADSyncToolsObjects [-Path] <String> [<CommonParameters>]
```
### DESCRIPTION
Imports an internal ADSync object from XML file that was exported using Export-ADSyncToolsObjects
### EXAMPLES
#### EXAMPLE 1
```
Import-ADSyncToolsObjects -Path .\20210224-003104_81275a23-0168-eb11-80de-00155d188c11_MV.xml
```
### PARAMETERS
#### -Path
Path for the XML file to import
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Import-ADSyncToolsRunHistory
### SYNOPSIS
Import Microsoft Entra Connect Run History
### SYNTAX
```
Import-ADSyncToolsRunHistory [-Path] <String> [<CommonParameters>]
```
### DESCRIPTION
Function to Import Microsoft Entra Connect Run Step results from XML created using Export-ADSyncToolsRunHistory
### EXAMPLES
#### EXAMPLE 1
```
Export-ADSyncToolsRunHistory -Path .\RunHistory-RunStep.xml
```
### PARAMETERS
#### -Path
Path for the XML file to import
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Import-ADSyncToolsSourceAnchor
### SYNOPSIS
Import ImmutableID from Microsoft Entra ID
### SYNTAX
```
Import-ADSyncToolsSourceAnchor [-Output] <String> [-IncludeSyncUsersFromRecycleBin] [<CommonParameters>]
```
### DESCRIPTION
Generates a file with all Microsoft Entra ID synchronized users containing the ImmutableID value in GUID format
Requirements: MSOnline PowerShell Module
### EXAMPLES
#### EXAMPLE 1
```
Import-ADSyncToolsSourceAnchor -OutputFile '.\AllSyncUsers.csv'
```
#### EXAMPLE 2
```
Import-ADSyncToolsSourceAnchor -OutputFile '.\AllSyncUsers.csv' -IncludeSyncUsersFromRecycleBin
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
Get Synchronized Users from Microsoft Entra ID Recycle Bin
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Invoke-ADSyncToolsSqlQuery
### SYNOPSIS
Invoke a SQL query against a database for testing purposes
### SYNTAX
```
Invoke-ADSyncToolsSqlQuery [-SqlConnection] <SqlConnection> [[-Query] <String>] [<CommonParameters>]
```
### DESCRIPTION
SQL Diagnostics related functions and utilities
### EXAMPLES
#### EXAMPLE 1
```
New-ADSyncToolsSqlConnection -Server SQLserver01.Contoso.com -Port 49823 | Invoke-ADSyncToolsSqlQuery
```
#### EXAMPLE 2
```
$sqlConn = New-ADSyncToolsSqlConnection -Server SQLserver01.Contoso.com -Port 49823
Invoke-ADSyncToolsSqlQuery -SqlConnection $sqlConn -Query 'SELECT *, database_id FROM sys.databases'
```
### PARAMETERS
#### -SqlConnection
SQL Connection
```yaml
Type: SqlConnection
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```
#### -Query
SQL Query
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: False
Position: 2
Default value: SELECT name, database_id FROM sys.databases
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

## Remove-ADSyncToolsAadObject
### SYNOPSIS
Remove orphaned synced object from Microsoft Entra ID
### SYNTAX
#### CsvInput
```
Remove-ADSyncToolsAadObject [-Credential] <PSCredential> [-InputCsvFilename] <Object> [-WhatIf] [-Confirm]
 [<CommonParameters>]
```
#### ObjectInput
```
Remove-ADSyncToolsAadObject [-Credential] <PSCredential> [-SourceAnchor] <Object> [-SyncObjectType] <Object>
 [-WhatIf] [-Confirm] [<CommonParameters>]
```
### DESCRIPTION
Deletes from Microsoft Entra ID a synced object(s) based on SourceAnchor and ObjecType in batches of 10 objects
The CSV file can be generated using Export-ADSyncToolsAadDisconnectors
### EXAMPLES
#### EXAMPLE 1
```
Remove-ADSyncToolsAadObject -InputCsvFilename .\DeleteObjects.csv -Credential (Get-Credential)
```
#### EXAMPLE 2
```
Remove-ADSyncToolsAadObject -SourceAnchor '2epFRNMCPUqhysJL3SWL1A==' -SyncObjectType 'publicFolder' -Credential (Get-Credential)
```
### PARAMETERS
#### -Credential
Microsoft Entra Global Administrator Credential
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -InputCsvFilename
CSV Input filename
```yaml
Type: Object
Parameter Sets: CsvInput
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -SourceAnchor
Object SourceAnchor
```yaml
Type: Object
Parameter Sets: ObjectInput
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -SyncObjectType
Object Type
```yaml
Type: Object
Parameter Sets: ObjectInput
Aliases:
Required: True
Position: 3
Default value: None
Accept pipeline input: True (ByPropertyName)
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### INPUTS
InputCsvFilename must point to a CSV file with at least 2 columns: SourceAnchor, SyncObjectType
### OUTPUTS
Shows results from ExportDeletions operation
DISCLAIMER: Other than User objects that have a Recycle Bin, any other object types DELETED with this function cannot be RECOVERED!

## Remove-ADSyncToolsAadPublicFolders
### SYNOPSIS
Removes synchronized Mail-Enabled Public Folders (MEPF) present from Microsoft Entra ID.
You can specify one SourceAnchor/ImmutableID for the target MEPF object to delete, or provide a CSV list with a batch of objects to delete when used in conjunction with Export-ADSyncToolsAadPublicFolders.
This function requires the credentials of a Global Administrator in Microsoft Entra ID and authentication with MFA is not supported.
NOTE: If DirSync has been disabled on the tenant, you'll need to temporary re-enabled DirSync in order to remove orphaned Mail Enabled Public Folders from Microsoft Entra ID.
### SYNTAX
```
Export-ADSyncToolsAadPublicFolders [-Credential] <PSCredential> [-Path] <Object> [<CommonParameters>]
```
### DESCRIPTION
This function exports to a CSV file all the synchronized Mail-Enabled Public Folders (MEPF) present in Microsoft Entra ID.
It can be used in conjunction with Remove-ADSyncToolsAadPublicFolders to identify and remove orphaned Mail-Enabled Public Folders in Microsoft Entra ID.
This function requires the credentials of a Global Administrator in Microsoft Entra ID and authentication with MFA is not supported.
NOTE: If DirSync has been disabled on the tenant, you will need to temporarily re-enabled DirSync in order to remove orphaned Mail Enabled Public Folders from Microsoft Entra ID.
### EXAMPLES
#### EXAMPLE 1
```
Remove-ADSyncToolsAadPublicFolders [-Credential] <PSCredential> [-InputCsvFilename] <Object> [-WhatIf] [-Confirm] [<CommonParameters>]
```
#### EXAMPLE 2
```
Remove-ADSyncToolsAadPublicFolders [-Credential] <PSCredential> [-SourceAnchor] <Object> [-WhatIf] [-Confirm] [<CommonParameters>]
```
### PARAMETERS
#### -Credential
Microsoft Entra Global Admin Credential
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: true
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -InputCsvFilename
Path for input CSV file
```yaml
Type: String
Parameter Sets: InputCsv
Aliases:
Required: true
Position: 2
Default value: None
Accept pipeline input: true (ByPropertyName)
Accept wildcard characters: false
```
#### -SourceAnchor
Target SourceAnchor/ImmutableID
```yaml
Type: String
Parameter Sets: SourceAnchor
Aliases:
Required: true
Position: 2
Default value: None
Accept pipeline input: true (ByPropertyName)
Accept wildcard characters: false
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### INPUTS
The CSV input file can be generated using Export-ADSyncToolsAadPublicFolders.
Path parameters must point to a CSV file with at least 2 columns: SourceAnchor, SyncObjectType.
### OUTPUTS
Shows results from ExportDeletions operation.

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
If you use -BackupOnly $false then any Expired Certificate present in UserCertificate attribute for these objects will be removed from Active Directory after being copied to file.
Each certificate will be backed up to a separated filename: ObjectClass_ObjectGUID_CertThumprint.cer
The script will also create a log file in CSV format showing all the users with certificates that either are valid or expired including the actual action taken (Skipped/Exported/Deleted).
### EXAMPLES
#### EXAMPLE 1
Check all users in target OU - Expired Certificates will be copied to separated files and no certificates will be removed
```
Remove-ADSyncToolsExpiredCertificates -TargetOU "OU=Users,OU=Corp,DC=Contoso,DC=com" -ObjectClass user
```
#### EXAMPLE 2
Delete Expired Certs from all Computer objects in target OU - Expired Certificates will be copied to files and removed from AD
```
Remove-ADSyncToolsExpiredCertificates -TargetOU "OU=Computers,OU=Corp,DC=Contoso,DC=com" -ObjectClass computer -BackupOnly $false
```
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Repair-ADSyncToolsAutoUpgradeState
### SYNOPSIS
Repair Microsoft Entra Connect AutoUpgrade State
### SYNTAX
```
Repair-ADSyncToolsAutoUpgradeState
```
### DESCRIPTION
Fixes an issue with AutoUpgrade introduced in build 1.1.524 (May 2017) which disables the online checking 
of new versions while AutoUpgrade is enabled.
### EXAMPLES
#### EXAMPLE 1
```
Repair-ADSyncToolsAutoUpgradeState
```
## Resolve-ADSyncToolsSqlHostAddress
### SYNOPSIS
Resolve a SQL server name
### SYNTAX
```
Resolve-ADSyncToolsSqlHostAddress [-Server] <String> [<CommonParameters>]
```
### DESCRIPTION
SQL Diagnostics related functions and utilities
### EXAMPLES
#### EXAMPLE 1
```
Resolve-ADSyncToolsSqlHostAddress -Server 'sqlserver01'
```
### PARAMETERS
#### -Server
SQL Server Name
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
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Search-ADSyncToolsADobject
### SYNOPSIS
Search an Active Directory object in Active Directory Forest by its UserPrincipalName, sAMAccountName or DistinguishedName
### SYNTAX
```
Search-ADSyncToolsADobject [-Identity] <Object> [<CommonParameters>]
```
### DESCRIPTION
Supports multi-domain queries and returns all the required properties including mS-DS-ConsistencyGuid.
### EXAMPLES
#### EXAMPLE 1
```
Search-ADSyncToolsADobject 'CN=user1,OU=Sync,DC=Contoso,DC=com'
```
#### EXAMPLE 2
```
Search-ADSyncToolsADobject -Identity "user1@Contoso.com"
```
#### EXAMPLE 3
```
Get-ADUser 'CN=user1,OU=Sync,DC=Contoso,DC=com' | Search-ADSyncToolsADobject
```
### PARAMETERS
#### -Identity
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Set-ADSyncToolsMsDsConsistencyGuid
### SYNOPSIS
Set an Active Directory object ms-ds-ConsistencyGuid
### SYNTAX
```
Set-ADSyncToolsMsDsConsistencyGuid [-Identity] <Object> [-Value] <Object> [<CommonParameters>]
```
### DESCRIPTION
Sets a value in mS-DS-ConsistencyGuid attribute for the target Active Directory user.
Supports Active Directory objects in multi-domain forests.
### EXAMPLES
#### EXAMPLE 1
```
Set-ADSyncToolsMsDsConsistencyGuid -Identity 'CN=User1,OU=Sync,DC=Contoso,DC=com' -Value '88666888-0101-1111-bbbb-1234567890ab'
```
#### EXAMPLE 2
```
Set-ADSyncToolsMsDsConsistencyGuid -Identity 'CN=User1,OU=Sync,DC=Contoso,DC=com' -Value 'GGhsjYwBEU+buBsE4sqhtg=='
```
#### EXAMPLE 3
```
Set-ADSyncToolsMsDsConsistencyGuid 'User1@Contoso.com' '8d6c6818-018c-4f11-9bb8-1b04e2caa1b6'
```
#### EXAMPLE 4
```
Set-ADSyncToolsMsDsConsistencyGuid 'User1@Contoso.com' 'GGhsjYwBEU+buBsE4sqhtg=='
```
#### EXAMPLE 5
```
'88666888-0101-1111-bbbb-1234567890ab' | Set-ADSyncToolsMsDsConsistencyGuid -Identity User1
```
#### EXAMPLE 6
```
'GGhsjYwBEU+buBsE4sqhtg==' | Set-ADSyncToolsMsDsConsistencyGuid User1
```
### PARAMETERS
#### -Identity
Target object in AD to set mS-DS-ConsistencyGuid
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
Value to set (ImmutableId, Byte array, GUID, GUID string or Base64 string)
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

## Set-ADSyncToolsTls12
### SYNOPSIS
Sets Client\Server TLS 1.2 settings for .NET Framework
### SYNTAX
```
Set-ADSyncToolsTls12 [[-Enabled] <Boolean>] [<CommonParameters>]
```
### DESCRIPTION
Sets the registry entries to enable/disable TLS 1.2 for .NET Framework:

| Path                                                         | Name                     |
| ------------------------------------------------------------ | ------------------------ |
| HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319 | SystemDefaultTlsVersions |
| HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319 | SchUseStrongCrypto       |
| HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319            | SystemDefaultTlsVersions |
| HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319            | SchUseStrongCrypto       |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server | Enabled                  |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server | DisabledByDefault        |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client | Enabled                  |
| HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client | DisabledByDefault        |

Running the cmdlet without any parameters will enable TLS 1.2 for .NET Framework

### EXAMPLES
#### EXAMPLE 1
```
Set-ADSyncToolsTls12
```
#### EXAMPLE 2
```
Set-ADSyncToolsTls12 -Enabled $true
```
### PARAMETERS
#### -Enabled
TLS 1.2 Enabled
```yaml
Type: Boolean
Parameter Sets: (All)
Aliases:
Required: False
Position: 1
Default value: True
Accept pipeline input: True (ByPropertyName, ByValue)
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
### RELATED LINKS
More Information:
[TLS 1.2 enforcement for Microsoft Entra Connect](reference-connect-tls-enforcement.md)

## Test-ADSyncToolsSqlNetworkPort
### SYNOPSIS
Test the SQL Server network port
### SYNTAX
```
Test-ADSyncToolsSqlNetworkPort [[-Server] <String>] [[-Port] <String>]
```
### DESCRIPTION
SQL Diagnostics related functions and utilities
### EXAMPLES
#### EXAMPLE 1
```
Test-ADSyncToolsSqlNetworkPort -Server 'sqlserver01'
```
#### EXAMPLE 2
```
Test-ADSyncToolsSqlNetworkPort -Server 'sqlserver01' -Port 1433
```
### PARAMETERS
#### -Server
SQL Server Name
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
#### -Port
SQL Server Port
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
## Trace-ADSyncToolsADImport
### SYNOPSIS
Creates a trace file from an Active Directory Import Step
### SYNTAX
#### ADConnectorXML
```
Trace-ADSyncToolsADImport [-DC] <String> [-RootDN] <String> [[-Filter] <String>] [[-Credential] <PSCredential>]
 [-SSL] [-ADConnectorXML] <String> [<CommonParameters>]
```
#### ADwatermarkInput
```
Trace-ADSyncToolsADImport [-DC] <String> [-RootDN] <String> [[-Filter] <String>] [[-Credential] <PSCredential>]
 [-SSL] [-ADwatermark] <String> [<CommonParameters>]
```
### DESCRIPTION
Traces all LDAP queries of an Active Directory Import run from a given Active Directory watermark checkpoint (also called a partition cookie). 
Creates a trace file '.\ADimportTrace_yyyyMMddHHmmss.log' on the current folder.
To use -ADConnectorXML, go to the Synchronization Service Manager, right-click your AD Connector and select "Export Connector..."
### EXAMPLES
#### EXAMPLE 1
Trace Active Directory Import for user objects by providing an AD Connector XML file
```
Trace-ADSyncToolsADImport -DC 'DC1.contoso.com' -RootDN 'DC=Contoso,DC=com' -Filter '(&(objectClass=user))' -ADConnectorXML .\ADConnector.xml
```
#### EXAMPLE 2
Trace Active Directory Import for all objects by providing the Active Directory watermark (cookie) and AD Connector credential
```
$creds = Get-Credential
Trace-ADSyncToolsADImport -DC 'DC1.contoso.com' -RootDN 'DC=Contoso,DC=com' -Credential $creds -ADwatermark "TVNEUwMAAAAXyK9ir1zSAQAAAAAAAAAA(...)"
```
### PARAMETERS
#### -DC
Target Domain Controller
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
#### -RootDN
Forest Root DN
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```
#### -Filter
AD objects type to trace.
Use '(&(objectClass=*))' for all object types
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: False
Position: 3
Default value: (&(objectClass=*))
Accept pipeline input: False
Accept wildcard characters: False
```
#### -Credential
Provide the credential to run LDAP query against AD
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: False
Position: 4
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```
#### -SSL
SSL Connection
```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases:
Required: False
Position: 5
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```
#### -ADConnectorXML
AD Connector Export XML file - Right-click AD Connector and select "Export Connector..."
```yaml
Type: String
Parameter Sets: ADConnectorXML
Aliases:
Required: True
Position: 6
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```
#### -ADwatermark
Manual input of watermark, instead of XML file e.g.
$ADwatermark = "TVNEUwMAAAAXyK9ir1zSAQAAAAAAAAAA(...)"
```yaml
Type: String
Parameter Sets: ADwatermarkInput
Aliases:
Required: True
Position: 6
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Trace-ADSyncToolsLdapQuery
### SYNOPSIS
Trace LDAP queries
### SYNTAX
```
Trace-ADSyncToolsLdapQuery [-RootDN] <String> [-Credential] <PSCredential> [[-Server] <String>]
 [[-Port] <Int32>] [-Filter <String>] [<CommonParameters>]
```
### DESCRIPTION
{{ Fill in the Description }}
### EXAMPLES
#### EXAMPLE 1
```
Trace-ADSyncToolsLdapQuery -RootDN "DC=Contoso,DC=com" -Credential $Credential
```
### PARAMETERS
#### -RootDN
Forest/Domain DistinguishedName
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Credential
AD Credential
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Server
Domain Controller Name (optional)
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: False
Position: 3
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Port
Domain Controller port (default: 389)
```yaml
Type: Int32
Parameter Sets: (All)
Aliases:
Required: False
Position: 3
Default value: 389
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### -Filter
LDAP filter (default: objectClass=*)
```yaml
Type: String
Parameter Sets: (All)
Aliases:
Required: False
Position: Named
Default value: (objectClass=*)
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
## Update-ADSyncToolsSourceAnchor
### SYNOPSIS
Updates users with the new ConsistencyGuid (ImmutableId)
### SYNTAX
```
Update-ADSyncToolsSourceAnchor [[-DistinguishedName] <String>] [-ImmutableIdGUID] <String> [-Action] <String>
 [-Output] <String> [-WhatIf] [-Confirm] [<CommonParameters>]
```
### DESCRIPTION
Updates users with the new ConsistencyGuid (ImmutableId) value taken from the ConsistencyGuid Report 
This function supports the WhatIf switch
Note: ConsistencyGuid Report must be imported with Tab delimiter
### EXAMPLES
#### EXAMPLE 1
```
Import-Csv .\AllSyncUsers-Report.csv -Delimiter "`t"| Update-ADSyncToolsSourceAnchor -Output .\AllSyncUsersTEST-Result2 -WhatIf
```
#### EXAMPLE 2
```
Import-Csv .\AllSyncUsers-Report.csv -Delimiter "`t"| Update-ADSyncToolsSourceAnchor -Output .\AllSyncUsersTEST-Result2
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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

## Get-ADSyncToolsDuplicateUsersSourceAnchor
### SYNOPSIS
Gets a list of all the objects with "Source anchor has changed" error.
### SYNTAX
```
Get-ADSyncToolsDuplicateUsersSourceAnchor [-ADConnectorName] <Object> [<CommonParameters>]
```
### DESCRIPTION
There are certain scenarios like M&A where Customers add a new forest to Microsoft Entra Connect with duplicate user objects. 
This causes multiple sync errors if the new connector precedence is higher for the newly joined users. This cmdlet will provide a list of all the objects with "Source anchor has changed" errors.

### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsDuplicateUsersSourceAnchor -ADConnectorName Contoso.com
```
### PARAMETERS
#### -ADConnectorName
AD connector name for which user source anchors needs to be repaired
```yaml
Type: Object
Parameter Sets: (All)
Aliases:
Required: true
Position: 1
Default value: 
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

## Set-ADSyncToolsDuplicateUsersSourceAnchor
### SYNOPSIS
Fixes all the objects with "Source Anchor has changed" error.
### SYNTAX
```
et-ADSyncToolsDuplicateUsersSourceAnchor [-DuplicateUserSourceAnchorInfo] <DuplicateUserSourceAnchorInfo> [-ActiveDirectoryCredential <PSCredential>] [-OverridePrompt <Boolean>] [<CommonParameters>]
```
### DESCRIPTION
This cmdlet takes in the list of objects from Get-ADSyncToolsDuplicateUsersSourceAnchor as pipeline input. It then fixes the sync errors by updating the msDS-ConsistencyGuid attribute with the sourceAnchor/immutableID of the original object. 
The cmdlet has an optional parameter - "Override prompt", which is False by default. If it is set to True, then the user will not be prompted when updating the msDS-ConsistencyGuid attribute.

### EXAMPLES
#### EXAMPLE 1
```
Get-ADSyncToolsDuplicateUsersSourceAnchor -ADConnectorName Contoso.lab | Set-ADSyncToolsDuplicateUsersSourceAnchor
```
#### EXAMPLE 2
```
Get-ADSyncToolsDuplicateUsersSourceAnchor -ADConnectorName Contoso.lab | Set-ADSyncToolsDuplicateUsersSourceAnchor -OverridePrompt $true
```
### PARAMETERS
#### -DuplicateUserSourceAnchorInfo
User list for which the source anchor needs to be fixed
```yaml
Type: DuplicateUserSourceAnchorInfo
Parameter Sets: (All)
Aliases:
Required: True
Position: 1
Default value: 
Accept pipeline input: True (ByValue, ByPropertyName)
Accept wildcard characters: False
```
#### -ActiveDirectoryCredential
AD EA/DA Admin Credentials, If not provided default credentials will be used
```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:
Required: False
Position: Named
Default value: 
Accept pipeline input: False
Accept wildcard characters: False
```
#### -OverridePrompt
```yaml
Type: Boolean
Parameter Sets: (All)
Aliases:
Required: False
Position: Named
Default value: False
Accept pipeline input: False
Accept wildcard characters: False
```
#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).
