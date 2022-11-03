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
title: Remove-SAPSystem
description: Removes an SAP deployment
---

# Remove-SAPSystem

## Synopsis
Removes an SAP deployment

## Syntax

Removes an SAP deployment defined by the parameter file.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-SAPSystem [-Parameterfile] <String> [-Type] <String> [<CommonParameters>]
```

## Description
Removes an SAP deployment defined by the parameter file.

## Examples

### Example 1

Removes an SAP system.

```powershell

Import-Module "SAPDeploymentUtilities.psd1"

Remove-System -Parameterfile .\PROD-WEEU-SAP00-X00.tfvars -Type sap_system
```

### Example 2

Removes an SAP library.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-System -Parameterfile .\PROD-WEEU-SAP_LIBRARY.tfvars -Type sap_library
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
Sets the type of SAP system.

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
This cmdlet supports the common Parameters: `-Debug`, `-ErrorAction`, `-ErrorVariable`, `-InformationAction`, `-InformationVariable`, `-OutVariable`, `-OutBuffer`, `-PipelineVariable`, `-Verbose`, `-WarningAction`, and `-WarningVariable`. For more information, see [about_CommonParameters](https://go.microsoft.com/fwlink/?LinkID=113216).

## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-hana)
