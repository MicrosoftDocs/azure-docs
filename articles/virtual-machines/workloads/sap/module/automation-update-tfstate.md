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
title: Update-TFState
description: Updates the Terraform state file
---

# Update-TFState

## Synopsis
Updates the Terraform state file

## Syntax

```powershell

Import-Module "SAPDeploymentUtilities.psd1"

Update-TFState [-Parameterfile] <String> [-Type] <SAP_Types> [-TerraformStateFileName] <String>
 [-Subscription] <String> [-StorageAccountName] <String> [-TerraformResourceName] <String>
 [-AzureResourceID] <String> [-WhatIf] [-Confirm] [<CommonParameters>]
```

## Description
This cmdlet can be used to update the Terraform state file to add missing/modified resources

## EXAMPLES

### EXAMPLE 1

```powershell

Import-Module "SAPDeploymentUtilities.psd1"

Update-TFState -Parameterfile .\DEV-WEEU-SAP01-X00.tfvars -Type sap_system
 -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
 -StorageAccountName devweeutfstate### 
 -TerraformStateFileName DEV-WEEU-SAP01-X00.terraform.tfstate 
 -TerraformResourceName module.sap_system.azurerm_resource_group.deployer[0] 
 -AzureResourceID /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/DEV-WEEU-SAP01-X00
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
Type of the system, valid values are sap_deployer, sap_library, sap_landscape, sap_system

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

### -TerraformStateFileName
Terraform State file name

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 3
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Subscription
Subscription containing the terraform state

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 4
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -StorageAccountName
Terraform state file storage account name

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 5
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -TerraformResourceName
Name of the resource in the Terraform state file

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 6
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -AzureResourceID
Resource Identifier for the Azure resource to be imported

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: True
Position: 7
Default value: None
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

[GitHub repository: SAP Deployment Automation Framework](https://github.com/Azure/sap-hana)
