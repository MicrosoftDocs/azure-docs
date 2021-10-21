---
external help file: SAPDeploymentUtilities-help.xml
Module Name: SAPDeploymentUtilities
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
---

# Update-TFState

## SYNOPSIS
Updates the Terraform state file

## SYNTAX

```
Update-TFState [-Parameterfile] <String> [-Type] <SAP_Types> [-TerraformStateFileName] <String>
 [-Subscription] <String> [-StorageAccountName] <String> [-TerraformResourceName] <String>
 [-AzureResourceID] <String> [-WhatIf] [-Confirm] [<CommonParameters>]
```

## DESCRIPTION
This cmdlet can be used to update the Terraform state file to add missing/modified resources

## EXAMPLES

### EXAMPLE 1
```
Update-TFState -Parameterfile .\DEV-WEEU-SAP01-X00.tfvars -Type sap_system
 -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
 -StorageAccountName devweeutfstate### 
 -TerraformStateFileName DEV-WEEU-SAP01-X00.terraform.tfstate 
 -TerraformResourceName module.sap_system.azurerm_resource_group.deployer[0] 
 -AzureResourceID /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/DEV-WEEU-SAP01-X00
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

### -Type
This is the type of the system, valid values are sap_deployer, sap_library, sap_landscape, sap_system

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
This is the Terraform State file name

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
This is the subscription containing the terraform state

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
This is the terraform state file storage account name

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
This is the name of the resource in the Terraform state file

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
This is the resource Identifier for the Azure resource to be imported

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

