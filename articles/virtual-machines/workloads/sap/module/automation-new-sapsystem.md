---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
---

# New-SAPSystem

## SYNOPSIS
Deploy a new system.

## SYNTAX

```
New-SAPSystem [-Parameterfile] <String> [-Type] <SAP_Types> [[-DeployerStateFileKeyName] <String>]
 [[-LandscapeStateFileKeyName] <String>] [[-StorageAccountName] <String>] [-Force] [-Silent] [-WhatIf]
 [-Confirm] [<CommonParameters>]
```

## DESCRIPTION
Deploy a new system.
The type parameter controls the type of environment.

## EXAMPLES

### EXAMPLE 1
```
Import-Module "SAPDeploymentUtilities.psd1"
```

New-SAPSystem -Parameterfile .\DEV-WEEU-SAP00-X00.tfvars -Type sap_system

### EXAMPLE 2
```
Import-Module "SAPDeploymentUtilities.psd1"
```

New-SAPSystem -Parameterfile .\DEV-WEEU-SAP00-X00.tfvars -Type sap_system -DeployerStateFileKeyName MGMT-WEEU-DEP00-INFRASTRUCTURE.terraform.tfstate -LandscapeStateFileKeyName DEV-WEEU-SAP01-INFRASTRUCTURE.terraform.tfstate

### EXAMPLE 3
```
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPSystem -Parameterfile .\MGMT-WEEU-SAP_LIBRARY.tfvars -Type sap_library
```

## PARAMETERS

### -Parameterfile
This is the parameter file for the system

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

### -Type
This is the type of the system, valid values are sap_deployer, sap_library, sap_landscape, sap_system

```yaml
Type: SAP_Types
Parameter Sets: (All)
Aliases:
Accepted values: sap_deployer, sap_landscape, sap_library, sap_system

Required: True
Position: 2
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -DeployerStateFileKeyName
This is the optional Deployer state file name

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

### -LandscapeStateFileKeyName
This is the optional Landscape state file name

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

### -StorageAccountName
This is the optional terraform state file storage account name

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

### -Force
{{ Fill Force Description }}

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

### -Silent
{{ Fill Silent Description }}

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

### -WhatIf
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

### -Confirm
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

### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](http://go.microsoft.com/fwlink/?LinkID=113216).

## INPUTS

## OUTPUTS

## NOTES
v0.1 - Initial version

.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## RELATED LINKS

[https://github.com/Azure/sap-hana](https://github.com/Azure/sap-hana)

