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
title: Remove-SAPAutomationRegion
description: Removes the SAP Control Plane (Deployer, Library)
---

# Remove-SAPAutomationRegion

## SYNOPSIS

Removes the control plane (deployer, library)
## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-SAPAutomationRegion [-DeployerParameterfile] <String> [-LibraryParameterfile] <String>
 [<CommonParameters>]
```

## Description
Removes the SAP Control Plane  (Deployer, Library)

## EXAMPLES

### EXAMPLE 1
```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Remove-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-SAP01-INFRASTRUCTURE\MGMT-WEEU-SAP01-INFRASTRUCTURE.tfvars 
 -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars

```

## Parameters

### -DeployerParameterfile
Parameter file for the Deployer, see [Configuring the control plane](../automation-configure-control-plane.md#deployer)

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

### -LibraryParameterfile
Parameter file for the library, see [Configuring the control plane](../automation-configure-control-plane.md#sap-library)

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
v0.1 - Initial version

.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related Links

[GitHub repository: SAP Deployment Automation Framework](https://github.com/Azure/sap-hana)
