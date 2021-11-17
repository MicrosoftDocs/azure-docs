---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: virtual-machines-sap
title: advanced_state_management
description: Updates the Terraform state file using a shell script
---

# advanced_state_management.sh

## Synopsis
Updates the Terraform state file.

## Syntax

```bash

advanced_state_management.sh [--parameterfile] <String> 
[--type] <String> 
[--terraform_keyfile] <String>
[--subscription] <String> 
[--storage_account_name] <String> 
[--tf_resource_name] <String>
[--azure_resource_id] <String> 
[--help]
```

## Description
You can use this cmdlet to add missing or modified resources to the Terraform state file.

## Examples

### Example 1

```bash

advanced_state_management.sh --parameterfile DEV-WEEU-SAP01-X00.tfvars --type sap_system
 --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
 --storage_account_name devweeutfstateABC 
 --terraform_keyfile DEV-WEEU-SAP01-X00.terraform.tfstate 
 --tf_resource_name module.sap_system.azurerm_resource_group.deployer[0] 
 --azure_resource_id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/DEV-WEEU-SAP01-X00
```

## Parameters

### `--parameterfile`
Sets the parameter file for the system.

```yaml
Type: String
Aliases: `-p`

Required: True
```

### `--type`
Sets the type of system. Valid values include: `sap_deployer`, `sap_library`, `sap_landscape`, and `sap_system`.

```yaml
Type: String
Aliases: `-t`
Accepted values: sap_deployer, sap_landscape, sap_library, sap_system

Required: True
```

### `--terraform_keyfile`
Sets the Terraform state file's name.

```yaml
Type: String
Aliases: `-k`

Required: True
```

### `--subscription`
Sets the target Azure subscription.

```yaml
Type: String
Aliases: `-s`

Required: False
```

### `--storageaccountname`
Sets the name of the storage account that contains the Terraform state files.

```yaml
Type: String
Aliases: `-a`

Required: False
```

### `--tf_resource_name`
Sets the resource name in the Terraform state file.

```yaml
Type: String
Aliases: `-n`

Required: False
```

### `--azure_resource_id`
Sets the resource ID of the Azure resource to import.

```yaml
Type: String
Aliases: `-i`

Required: False
```

## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related links

[GitHub repository: SAP deployment automation framework](https://github.com/Azure/sap-hana)
