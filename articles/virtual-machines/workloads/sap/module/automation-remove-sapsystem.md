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
Description: Removes a deployment
---

# Remove-SAPSystem

## SYNOPSIS
Removes a deployment

## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-SAPSystem [-Parameterfile] <String> [-Type] <String> [<CommonParameters>]
```

## Description
Removes a deployment

## EXAMPLES

### EXAMPLE 1
```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-System -Parameterfile .\PROD-WEEU-SAP00-X00.tfvars -Type sap_system
```

### EXAMPLE 2
```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-System -Parameterfile .\PROD-WEEU-SAP_LIBRARY.tfvars -Type sap_library
```

## Parameters

### -Parameterfile
Parameter file for the system

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
Type of the system

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
This cmdlet supports the common Parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](https://go.microsoft.com/fwlink/?LinkID=113216).

## Inputs

## Outputs

## Notes
v0.1 - Initial version

.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## RELATED LINKS

[https://github.com/Azure/sap-hana](https://github.com/Azure/sap-hana)

