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
title: New-SAPDeployer
Description: Bootstrap a new deployer in the control plane..
---

# New-SAPDeployer

## SYNOPSIS
Bootstrap a new deployer in the control plane.

## Syntax

```
New-SAPDeployer [-Parameterfile] <String> [-Silent] [-WhatIf] [-Confirm] [<CommonParameters>]
```

## Description
Bootstrap a new deployer in the control plane.

The deployer VM has installation of Ansible and Terraform. You use the deployer VM to deploy the SAP artifacts.


## EXAMPLES

### EXAMPLE 1
```
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPDeployer -Parameterfile .\MGMT-WEEU-MGMT00-INFRASTRUCTURE.tfvars
```

## Parameters

### -Parameter file
Parameter file for the Deployer, see [Configuring the control plane](../automation-configure-control-plane.md#Deployer)

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

### -Silent
Deploy without prompting

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
