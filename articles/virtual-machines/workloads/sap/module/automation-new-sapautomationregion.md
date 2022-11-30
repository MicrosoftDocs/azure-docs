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
title: New-SAPAutomationRegion
description: Deploys the control plane (deployer, SAP library)
---

# New-SAPAutomationRegion

## Synopsis
The PowerShell command `New-SAPAutomationRegion` deploys the control plane, including the deployer VM, Azure Key Vault, and the SAP library.

The deployer VM has installations of Ansible and Terraform. This VM deploys the SAP artifacts.

## Syntax

```
New-SAPAutomationRegion [-DeployerParameterfile] <String> [-LibraryParameterfile] <String>
 [[-Subscription] <String>] [[-SPN_id] <String>] [[-SPN_password] <String>] [[-Tenant_id] <String>]
 [[-Vault] <String>] [[-StorageAccountName] <String>] [-Force] [-Silent] [<CommonParameters>]
```

## Description
Deploys the control plane, which includes the deployer VM and the SAP library. For more information, see [Configuring the control plane](../automation-configure-control-plane.md) and [Deploying the control plane](../automation-deploy-control-plane.md)

## Examples

### Example 1

This example deploys the control plane, as defined by the parameter files. The process prompts you for the SPN details.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP01-INFRASTRUCTURE\MGMT-WEEU-DEP01-INFRASTRUCTURE.tfvars 
 -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars
```

### Example 2

This example deploys the control plane, as defined by the parameter files. The process adds the deployment credentials to the deployment's key vault.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

$Subscription=<subscriptionID>
$SPN_id=<appID>
$SPN_password=<password>
$Tenant_id=<tenant>

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP01-INFRASTRUCTURE\MGMT-WEEU-DEP01-INFRASTRUCTURE.tfvars 
-LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars
-Subscription $Subscription
-SPN_id $SPN_id
-SPN_password $SPN_password
-Tenant_id $Tenant_id
```

## Parameters

### `-DeployerParameterfile`
Sets the parameter file for the deployer VM. For more information, see [Configuring the control plane](../automation-configure-control-plane.md#deployer).

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

### `-LibraryParameterfile`
Sets the parameter file for the SAP library. For more information, see [Configuring the control plane](../automation-configure-control-plane.md#sap-library).

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

### `-Subscription`
Sets the target Azure subscription.

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

### `-SPN_id`
Sets the service principal's app ID. For more information, see [Prepare the deployment credentials](../automation-deploy-control-plane.md#prepare-the-deployment-credentials).

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

### `-SPN_password`
Sets the Service Principal password. For more information, see [Prepare the deployment credentials](../automation-deploy-control-plane.md#prepare-the-deployment-credentials). 

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

### `-Tenant_id`
Sets the tenant ID for the service principal. For more information, see [Prepare the deployment credentials](../automation-deploy-control-plane.md#prepare-the-deployment-credentials). 

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

### `-Vault`
Sets the name of the deployment's key vault.

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

### `-StorageAccountName`
Sets the name of the storage account that contains the Terraform state files.

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
Enables silent deployment.

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

## Related Links

+[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
