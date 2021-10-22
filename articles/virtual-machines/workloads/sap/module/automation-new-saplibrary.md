---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: virtual-machines-sap
title: New-SAPLibrary
Description: Bootstrap a new deployer in the control plane. The deployer VM has Ansible and Terraform installed and is used to deploy the SAP artifacts.
---

# New-SAPLibrary

## Synopsis
Bootstrap a new SAP Library.

## Syntax

```powershell
New-SAPLibrary [-Parameterfile] <String> [[-DeployerFolderRelativePath] <String>] [-Silent] [-WhatIf]
 [-Confirm] [<CommonParameters>]
```

## Description
Bootstrap a new deployer in the control plane.
The deployer VM has Ansible and Terraform installed and is used to deploy the SAP artifacts.

## EXAMPLES

### EXAMPLE 1
```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPLibrary -Parameterfile .\MGMT-WEEU-SAP_LIBRARY.tfvars -DeployerFolderRelativePath ..\..\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\
```

## Parameters

### -Parameterfile
Parameter file for the SAP library, see [Configuring the control plane](../automation-configure-control-plane.md#SAP-Library)

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
TRelative folder path to the folder containing the deployer parameter terraform.tfstate file

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
Silent deployment

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
This cmdlet supports the common Parameters: `-Debug`, `-ErrorAction`, `-ErrorVariable`, `-InformationAction`, `-InformationVariable`, `-OutVariable`, `-OutBuffer`, `-PipelineVariable`, `-Verbose`, `-WarningAction`, and `-WarningVariable`. For more information, see [about_CommonParameters](https://go.microsoft.com/fwlink/?LinkID=113216).


## Notes
v0.1 - Initial version

.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related Links

+[GitHub repository: SAP Deployment Automation Framework](https://github.com/Azure/sap-hana)

