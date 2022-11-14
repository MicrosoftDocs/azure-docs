---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-automation
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: virtual-machines-sap
title: New-SAPSystem
description: Deploy a new SAP system
---

# New-SAPSystem

## Synopsis
You can use the command `New-SAPSystem` to deploy a new SAP system.

## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPSystem [-Parameterfile] <String> [-Type] <SAP_Types> [[-DeployerStateFileKeyName] <String>]
 [[-LandscapeStateFileKeyName] <String>] [[-StorageAccountName] <String>] [-Force] [-Silent] [-WhatIf]
 [-Confirm] [<CommonParameters>]
```

## Description
The command `New-SAPSystem` deploys a new SAP system.

## Examples

### Example 1

Deploys or updates an SAP System.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPSystem -Parameterfile .\DEV-WEEU-SAP00-X00.tfvars -Type sap_system
```

### Example 2

Deploys or updates an SAP System.


```powershell
Import-Module "SAPDeploymentUtilities.psd1"


New-SAPSystem -Parameterfile .\DEV-WEEU-SAP00-X00.tfvars -Type sap_system -DeployerStateFileKeyName MGMT-WEEU-DEP00-INFRASTRUCTURE.terraform.tfstate -LandscapeStateFileKeyName DEV-WEEU-SAP01-INFRASTRUCTURE.terraform.tfstate
```

### Example 3
```powershell
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPSystem -Parameterfile .\MGMT-WEEU-SAP_LIBRARY.tfvars -Type sap_library
```

## Parameters

### `-Parameterfile`
Sets the parameter file for the SAP system.

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

### `-Type`
Sets the type of SAPsystem to be deployed. Valid values include: `sap_deployer`, `sap_library`, `sap_landscape`, and `sap_system`.

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
Sets the name of the state file for the deployer deployment.

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
Sets the name of the state file for the workload zone deployment.


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
Sets the optional Terraform state file's storage account name.

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
Cleans up your local configuration.

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
Shows what happens if the cmdlet runs. However, the cmdlet doesn't make any changes.

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
v0.9 - Initial version

Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
