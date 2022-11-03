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
ms.service: azure-center-sap-solutions
title: Set-SAPSecrets
description: Sets the SPN Secrets in Azure Key vault
---

# Set-SAPSecrets

## Synopsis
Sets the service principal secrets in Azure Key Vault.

## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Set-SAPSecrets [-Region] <String> [-Environment] <String> [-VaultName] <String> [-SPN_id] <String>
 [-SPN_password] <String> [-Tenant_id] <String> [-Workload] [<CommonParameters>]
```

## Description
Sets the secrets in Key Vault that the deployment automation requires.

## EXAMPLES

### EXAMPLE 1

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

Set-SAPSecrets -Environment PROD -VaultName <vaultname> -SPN_id <appId> -SPN_password <clientsecret> -Tenant_id <Tenant_idID>
```

## Parameters

### `-Region`
Sets the name of the Azure region for deployment.

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

### `-Environment`
Sets the name of the deployment environment.

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

### `-VaultName`
Sets the name of the key vault.

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

### `-SPN_id`
Sets the service principal application ID.

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

### `-SPN_password`
Sets the service principal's password.

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

### `-Tenant_id`
Sets the tenant ID.

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

### `-Workload`
Sets the workload.

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

### CommonParameters
This cmdlet supports the common Parameters: `-Debug`, `-ErrorAction`, `-ErrorVariable`, `-InformationAction`, `-InformationVariable`, `-OutVariable`, `-OutBuffer`, `-PipelineVariable`, `-Verbose`, `-WarningAction`, and `-WarningVariable`. For more information, see [about_CommonParameters](https://go.microsoft.com/fwlink/?LinkID=113216).

## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.
## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-hana)
