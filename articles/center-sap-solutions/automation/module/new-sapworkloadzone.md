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
ms.service: azure-center-sap-solutions
title: New-SAPWorkloadZone
description: Deploy a new SAP Workload Zone
---

# New-SAPWorkloadZone

## Synopsis
You can use the `New-SAPWorkloadZone` command  to deploy a new SAP workload zone.

## Syntax

```powershell
Import-Module "SAPDeploymentUtilities.psd1"


New-SAPWorkloadZone [-Parameterfile] <String> [[-Deployerstatefile] <String>] [[-Deployerenvironment] <String>]
 [[-State_subscription] <String>] [[-Vault] <String>] [[-StorageAccountName] <String>]
 [[-Subscription] <String>] [[-SPN_id] <String>] [[-SPN_password] <String>] [[-Tenant_id] <String>] [-Force]
 [-Silent] [-WhatIf] [-Confirm] [<CommonParameters>]
```

## Description
The  `New-SAPWorkloadZone` command deploys a new SAP workload zone. The workload zone contains the shared resources for all VMs inside.

## Examples

### Example 1

This example deploys the workload zone, as defined by the parameter files. The process prompts you for the SPN details.

```powershell

Import-Module "SAPDeploymentUtilities.psd1"

New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
```

### Example 2

This example deploys the workload zone, as defined by the parameter files. The process adds the deployment credentials to the deployment's key vault.


```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
 -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
 -SPN_password ************************
 -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
```

## Parameters

### `-Parameterfile`
Sets the parameter file for the workload zone. For more information, see [Configuring the workload zone](../configure-workload-zone.md).

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

### `-Deployerstatefile`
Sets the deployer VM's Terraform state file name.

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

### `-Deployerenvironment`
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

### `-State_subscription`
Sets the subscription ID for the Terraform storage account.

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

### `-Vault`
Sets the deployment credentials' key vault.

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

### `-StorageAccountName`
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

### `-Subscription`
Sets the target subscription.

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

### `-SPN_id`
Sets the service principal's app ID. For more information, see [Prepare the deployment credentials](../deploy-workload-zone.md#preparing-the-workload-zone-deployment-credentials).
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

### `-SPN_password`
Sets the service principal's password. For more information, see [Prepare the deployment credentials](../deploy-workload-zone.md#preparing-the-workload-zone-deployment-credentials).

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

### `-Tenant_id`
Sets the tenant ID. For more information, see [Prepare the deployment credentials](../deploy-workload-zone.md#preparing-the-workload-zone-deployment-credentials).

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

### `-Force`
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

### `-Silent`
Deploys without prompting.

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

### `-WhatIf`
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

### `-Confirm`
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
