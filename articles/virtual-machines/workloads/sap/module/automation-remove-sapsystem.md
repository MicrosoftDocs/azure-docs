---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
---

# Remove-SAPSystem

## SYNOPSIS
Removes a deployment

## SYNTAX

```
Remove-SAPSystem [-Parameterfile] <String> [-Type] <String> [<CommonParameters>]
```

## DESCRIPTION
Removes a deployment

## EXAMPLES

### EXAMPLE 1
```
Import-Module "SAPDeploymentUtilities.psd1"
Remove-System -Parameterfile .\PROD-WEEU-SAP00-X00.tfvars -Type sap_system
```

### EXAMPLE 2
```
Import-Module "SAPDeploymentUtilities.psd1"
Remove-System -Parameterfile .\PROD-WEEU-SAP_LIBRARY.tfvars -Type sap_library
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
This is the type of the system

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

