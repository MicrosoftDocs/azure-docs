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
title: New-SAPWorkloadZone
Description: Deploy a new SAP Workload Zone
---

# New-SAPWorkloadZone

## Synopsis
Deploy a new SAP Workload Zone

## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"


New-SAPWorkloadZone [-Parameterfile] <String> [[-Deployerstatefile] <String>] [[-Deployerenvironment] <String>]
 [[-State_subscription] <String>] [[-Vault] <String>] [[-StorageAccountName] <String>]
 [[-Subscription] <String>] [[-SPN_id] <String>] [[-SPN_password] <String>] [[-Tenant_id] <String>] [-Force]
 [-Silent] [-WhatIf] [-Confirm] [<CommonParameters>]
```

## Description
Deploy a new SAP Workload Zone.
The Workload Zone contains the shared resources for all the Virtual machines in the workload zone.

## EXAMPLES

### EXAMPLE 1
```powershell

Import-Module "SAPDeploymentUtilities.psd1"

New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
```

### EXAMPLE 2
```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
 -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
 -SPN_password ************************
 -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
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

### -Deployerstatefile
Deployer terraform state file name

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

### -Deployerenvironment
Deployer environment name

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

### -State_subscription
Subscription ID for Terraform storage account

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

### -Vault
{{ Fill Vault Description }}

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

### -StorageAccountName
Storage account name

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 6
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Subscription
Target subscriptopm

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 7
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -SPN_id
Service Principal App ID

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 8
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -SPN_password
Service Principal password

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 9
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Tenant_id
Tenant ID

```yaml
Type: String
Parameter Sets: (All)
Aliases:

Required: False
Position: 10
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -Force
Cleans up local configuration

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

