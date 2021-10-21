---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
---

# New-SAPLibrary

## SYNOPSIS
Bootstrap a new SAP Library.

## SYNTAX

```
New-SAPLibrary [-Parameterfile] <String> [[-DeployerFolderRelativePath] <String>] [-Silent] [-WhatIf]
 [-Confirm] [<CommonParameters>]
```

## DESCRIPTION
Bootstrap a new deployer in the control plane.
The deployer VM has Ansible and Terraform installed and is used to deploy the SAP artifacts.

## EXAMPLES

### EXAMPLE 1
```
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPLibrary -Parameterfile .\MGMT-WEEU-SAP_LIBRARY.tfvars -DeployerFolderRelativePath ..\..\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\
```

## PARAMETERS

### -Parameterfile
This is the parameter file for the library

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

### -DeployerFolderRelativePath
This is the relative folder path to the folder containing the deployerparameter terraform.tfstate file

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

