---
title: 'Azure AD Connect: ADSyncConfig PowerShell Reference | Microsoft Docs'
description: This document provides reference information for the ADSyncConfig.psm1 PowerShell module.
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.date: 01/24/2019
ms.subservice: hybrid
ms.author: billmath
ms.topic: reference
ms.collection: M365-identity-device-management
---

# Azure AD Connect:  ADSyncConfig PowerShell Reference
The following documentation provides reference information for the ADSyncConfig.psm1 PowerShell Module that is included with Azure AD Connect.


## Get-ADSyncADConnectorAccount

### SYNOPSIS
Gets the account name and domain that is configured in each AD Connector

### SYNTAX

```
Get-ADSyncADConnectorAccount
```

### DESCRIPTION
This function uses the 'Get-ADSyncConnector' cmdlet that is present in AAD Connect to retrieve from Connectivity Parameters a table showing the AD Connector(s) account.

### EXAMPLES

#### EXAMPLE 1
```
Get-ADSyncADConnectorAccount
```

## Get-ADSyncObjectsWithInheritanceDisabled

### SYNOPSIS
Gets AD objects with permission inheritance disabled

### SYNTAX

```
Get-ADSyncObjectsWithInheritanceDisabled [-SearchBase] <String> [[-ObjectClass] <String>] [<CommonParameters>]
```

### DESCRIPTION
Searches in AD starting from the SearchBase parameter and returns all objects, filtered by ObjectClass parameter, that have the ACL Inheritance currently disabled.

### EXAMPLES

#### EXAMPLE 1
```
Find objects with disabled inheritance in 'Contoso' domain (by default returns 'organizationalUnit' objects only)
```

Get-ADSyncObjectsWithInheritanceDisabled -SearchBase 'Contoso'

#### EXAMPLE 2
```
Find 'user' objects with disabled inheritance in 'Contoso' domain
```

Get-ADSyncObjectsWithInheritanceDisabled -SearchBase 'Contoso' -ObjectClass 'user'

#### EXAMPLE 3
```
Find all types of objects with disabled inheritance in a OU
```

Get-ADSyncObjectsWithInheritanceDisabled -SearchBase OU=AzureAD,DC=Contoso,DC=com -ObjectClass '*'

### PARAMETERS

#### -SearchBase
The SearchBase for the LDAP query that can be an AD Domain DistinguishedName or a FQDN

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

#### -ObjectClass
The class of the objects to search that can be '*' (for any object class), 'user', 'group', 'container', etc.
By default, this function will search for 'organizationalUnit' object class.

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 2
Default value: OrganizationalUnit
Accept pipeline input: False
Accept wildcard characters: False
```

#### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).

## Set-ADSyncBasicReadPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for basic read permissions.

### SYNTAX

#### UserDomain
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>] [-SkipAdminSdHolders]
 [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncBasicReadPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Read Property access on all attributes for all descendant computer objects
2.
Read Property access on all attributes for all descendant device objects
3.
Read Property access on all attributes for all descendant foreignsecurityprincipal objects
5.
Read Property access on all attributes for all descendant user objects
6.
Read Property access on all attributes for all descendant inetorgperson objects
7.
Read Property access on all attributes for all descendant group objects
8.
Read Property access on all attributes for all descendant contact objects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncBasicReadPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Set-ADSyncExchangeHybridPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for Exchange Hybrid feature.

### SYNTAX

#### UserDomain
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>] [-SkipAdminSdHolders]
 [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncExchangeHybridPermissions Function will give required permissions to the 
AD synchronization account, which include the following:
1.
Read/Write Property access on all attributes for all descendant user objects
2.
Read/Write Property access on all attributes for all descendant inetorgperson objects
3.
Read/Write Property access on all attributes for all descendant group objects
4.
Read/Write Property access on all attributes for all descendant contact objects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncExchangeHybridPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Set-ADSyncExchangeMailPublicFolderPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for Exchange Mail Public Folder feature.

### SYNTAX

#### UserDomain
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountName <String>
 -ADConnectorAccountDomain <String> [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm]
 [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>]
 [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncExchangeMailPublicFolderPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Read Property access on all attributes for all descendant publicfolder objects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncExchangeMailPublicFolderPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Set-ADSyncMsDsConsistencyGuidPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for mS-DS-ConsistencyGuid feature.

### SYNTAX

#### UserDomain
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>]
 [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncMsDsConsistencyGuidPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Read/Write Property access on mS-DS-ConsistencyGuid attribute for all descendant user objects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncMsDsConsistencyGuidPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Set-ADSyncPasswordHashSyncPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for password hash synchronization.

### SYNTAX

#### UserDomain
```
Set-ADSyncPasswordHashSyncPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncPasswordHashSyncPermissions -ADConnectorAccountDN <String> [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncPasswordHashSyncPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Replicating Directory Changes
2.
Replicating Directory Changes All

These permissions are given to all domains in the forest.

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncPasswordHashSyncPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncPasswordHashSyncPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
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

## Set-ADSyncPasswordWritebackPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for password write-back from Azure AD.

### SYNTAX

#### UserDomain
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>]
 [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncPasswordWritebackPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Reset Password on descendant user objects
2.
Write Property access on lockoutTime attribute for all descendant user objects
3.
Write Property access on pwdLastSet attribute for all descendant user objects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncPasswordWritebackPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Set-ADSyncRestrictedPermissions

### SYNOPSIS
Tighten permissions on an AD object that is not otherwise included in any AD protected security group.
A typical example is the AD Connect account (MSOL) created by AAD Connect automatically.
This account
has replicate permissions on all domains, however can be easily compromised as it is not protected.

### SYNTAX

```
Set-ADSyncRestrictedPermissions [-ADConnectorAccountDN] <String> [-Credential] <PSCredential>
 [-DisableCredentialValidation] [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncRestrictedPermissions Function will tighten permissions oo the 
account provided.
Tightening permissions involves the following steps:
1.
Disable inheritance on the specified object
2.
Remove all ACEs on the specific object, except ACEs specific to SELF.
We want to keep
   the default permissions intact when it comes to SELF.
3.
Assign these specific permissions:

        Type	Name										Access				Applies To
        =============================================================================================
        Allow	SYSTEM										Full Control		This object
        Allow	Enterprise Admins							Full Control		This object
        Allow	Domain Admins								Full Control		This object
        Allow	Administrators								Full Control		This object

        Allow	Enterprise Domain Controllers				List Contents
                                                            Read All Properties
                                                            Read Permissions	This object

        Allow	Authenticated Users							List Contents
                                                            Read All Properties
                                                            Read Permissions	This object

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncRestrictedPermissions -ADConnectorAccountDN "CN=TestAccount1,CN=Users,DC=Contoso,DC=com" -Credential $(Get-Credential)
```

### PARAMETERS

#### -ADConnectorAccountDN
DistinguishedName of the Active Directory account whose permissions need to be tightened.
This is typically the MSOL_nnnnnnnnnn 
account or a custom domain account that is configured in your AD Connector.

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

#### -Credential
Administrator credential that has the necessary privileges to restrict the permissions on the ADConnectorAccountDN account. 
This is typically the Enterprise or Domain administrator. 
Use the fully qualified domain name of the administrator account to avoid account lookup failures.
Example: CONTOSO\admin

```yaml
Type: PSCredential
Parameter Sets: (All)
Aliases:

Required: True
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -DisableCredentialValidation
When DisableCredentialValidation is used, the function will not check if the credentials provided in -Credential are valid in AD 
and if the account provided has the necessary privileges to restrict the permissions on the ADConnectorAccountDN account.

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

## Set-ADSyncUnifiedGroupWritebackPermissions

### SYNOPSIS
Initialize your Active Directory forest and domain for Group writeback from Azure AD.

### SYNTAX

#### UserDomain
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountName <String> -ADConnectorAccountDomain <String>
 [-ADobjectDN <String>] [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### DistinguishedName
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN <String> [-ADobjectDN <String>]
 [-SkipAdminSdHolders] [-WhatIf] [-Confirm] [<CommonParameters>]
```

### DESCRIPTION
The Set-ADSyncUnifiedGroupWritebackPermissions Function will give required permissions to the AD synchronization account, which include the following:
1.
Generic Read/Write, Delete, Delete Tree and Create\Delete Child for all  group Object types and SubObjects

These permissions are applied to all domains in the forest.
Optionally you can provide a DistinguishedName in ADobjectDN parameter to set these permissions on that AD Object only (including inheritance to sub objects).
In this case, ADobjectDN will be the Distinguished Name of the Container that you desire to link with the GroupWriteback feature.

### EXAMPLES

#### EXAMPLE 1
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com'
```

#### EXAMPLE 2
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com'
```

#### EXAMPLE 3
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN 'CN=ADConnector,OU=AzureAD,DC=Contoso,DC=com' -SkipAdminSdHolders
```

#### EXAMPLE 4
```
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountName 'ADConnector' -ADConnectorAccountDomain 'Contoso.com' -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADConnectorAccountName
The Name of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDomain
The Domain of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: UserDomain
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADConnectorAccountDN
The DistinguishedName of the Active Directory account that is or will be used by Azure AD Connect Sync to manage objects in the directory.

```yaml
Type: String
Parameter Sets: DistinguishedName
Aliases:

Required: True
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -ADobjectDN
DistinguishedName of the target AD object to set permissions (optional)

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

#### -SkipAdminSdHolders
Optional parameter to indicate if AdminSDHolder container should not be updated with these permissions

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

## Show-ADSyncADObjectPermissions

### SYNOPSIS
Shows permissions of a specified AD object.

### SYNTAX

```
Show-ADSyncADObjectPermissions [-ADobjectDN] <String> [<CommonParameters>]
```

### DESCRIPTION
This function returns all the AD permissions currently set for a given AD object provided in the parameter -ADobjectDN.
The ADobjectDN must be provided in a DistinguishedName format.

### EXAMPLES

#### EXAMPLE 1
```
Show-ADSyncADObjectPermissions -ADobjectDN 'OU=AzureAD,DC=Contoso,DC=com'
```

### PARAMETERS

#### -ADobjectDN
{{Fill ADobjectDN Description}}

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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable.
For more information, see about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).
