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
title: New-SAPAutomationRegion
Description: Deploys the control plane (deployer, SAP library)
---

# New-SAPAutomationRegion

## Synopsis
Deploys the control plane, including the deployer VM, Key Vault and SAP library.

The deployer VM has installation of Ansible and Terraform. You use the deployer VM to deploy the SAP artifacts.

## Syntax

```
New-SAPAutomationRegion [-DeployerParameterfile] <String> [-LibraryParameterfile] <String>
 [[-Subscription] <String>] [[-SPN_id] <String>] [[-SPN_password] <String>] [[-Tenant_id] <String>]
 [[-Vault] <String>] [[-StorageAccountName] <String>] [-Force] [-Silent] [<CommonParameters>]
```

## Description
Deploys the control plane (Deployer, Library), see [Configuring the control plane](../automation-configure-control-plane.md) and [Deploying the control plane](../automation-deploy-control-plane.md)

## EXAMPLES

### EXAMPLE 1

This example deploys the control plane defined by the parameter files. Will prompt for the SPN details

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP01-INFRASTRUCTURE\MGMT-WEEU-DEP01-INFRASTRUCTURE.tfvars 
 -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars
```

### EXAMPLE 2

This example deploys the control plane defined by the parameter files and adds the deployment credentials to the deployment Key Vault.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP01-INFRASTRUCTURE\MGMT-WEEU-DEP01-INFRASTRUCTURE.tfvars 
-LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars
-Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
-SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
-SPN_password ************************
-Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz  
```

## Parameters

### -DeployerParameterfile
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

### -LibraryParameterfile
Parameter file for the SAP library, see [Configuring the control plane](../automation-configure-control-plane.md#SAP-Library)

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

### -Subscription
Target subscription

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

### -SPN_id
Service Principal App ID, see [Prepare the deployment credentials](../automation-configure-control-plane.md#Prepare-the-deployment-credentials), 

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

### -SPN_password
Service Principal password, see [Prepare the deployment credentials](../automation-configure-control-plane.md#Prepare-the-deployment-credentials), 

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

### -Tenant_id
Tenant ID for the SPN, see [Prepare the deployment credentials](../automation-configure-control-plane.md#Prepare-the-deployment-credentials), 

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

### -Vault
Name of the deployment key vault

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

### -StorageAccountName
Name of the storage account containing the terraform state files

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
Silent deployment

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
v0.1 - Initial version
.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related Links

+[GitHub repository: SAP Deployment Automation Framework](https://github.com/Azure/sap-hana)
