---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
---

# New-SAPWorkloadZone

## SYNOPSIS
Deploy a new SAP Workload Zone

## SYNTAX

```
New-SAPWorkloadZone [-Parameterfile] <String> [[-Deployerstatefile] <String>] [[-Deployerenvironment] <String>]
 [[-State_subscription] <String>] [[-Vault] <String>] [[-StorageAccountName] <String>]
 [[-Subscription] <String>] [[-SPN_id] <String>] [[-SPN_password] <String>] [[-Tenant_id] <String>] [-Force]
 [-Silent] [-WhatIf] [-Confirm] [<CommonParameters>]
```

## DESCRIPTION
Deploy a new SAP Workload Zone.
The Workload Zone contains the shared resources for all the Virtual machines in the workload zone.

## EXAMPLES

### EXAMPLE 1
```
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
```

### EXAMPLE 2
```
Import-Module "SAPDeploymentUtilities.psd1"
New-SAPWorkloadZone -Parameterfile .\PROD-WEEU-SAP00-infrastructure.tfvars
 -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
 -SPN_password ************************
 -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz
```

## PARAMETERS

### -Parameterfile
This is the parameter file for the system

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
This is the deployer terraform state file name

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
This is the deployer environment name

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
{{ Fill State_subscription Description }}

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
{{ Fill StorageAccountName Description }}

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
{{ Fill Subscription Description }}

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
This is the Service Principal App ID

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
This is the Service Principal password

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
{{ Fill Tenant_id Description }}

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
This is the parameter that forces the script to delete the local terrafrom state file artifacts

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
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see [about_CommonParameters](http://go.microsoft.com/fwlink/?LinkID=113216).

## INPUTS

## OUTPUTS

## NOTES
v0.1 - Initial version

.



Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## RELATED LINKS

[https://github.com/Azure/sap-hana](https://github.com/Azure/sap-hana)

