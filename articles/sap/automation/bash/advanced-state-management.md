---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-terraform
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
You can use this script to add missing or modified resources to the Terraform state file. This script is useful if resources have been modified or created without using Terraform.

## Examples

### Example 1

Importing a Virtual Machine

```bash

parameter_file_name="DEV-WEEU-SAP01-X00.tfvars"
deployment_type="sap_system"
subscriptionID="<subscriptionId>"

filepart=$(echo "${parameter_file_name}" | cut -d. -f1)
key_file=${filepart}.terraform.tfstate

#This is the name of the storage account containing the terraform state files
storage_accountname="<storageaccountname>"

#Terraform Resource name of the first
tf_resource_name="module.hdb_node.azurerm_linux_virtual_machine.vm_dbnode[0]"
                 
#Azure Resource id of the Virtual 
azure_resource_id="/subscriptions/<subscriptionId>/resourceGroups/DEV-WEEU-SAP01-X00/providers/Microsoft.Compute/virtualMachines/xxxxx"

$DEPLOYMENT_REPO_PATH/deploy/scripts/advanced_state_management.sh                      \
  --parameterfile "${parameter_file_name}"        \
  --type "${deployment_type}"                     \
  --subscription "${subscriptionID}"              \
  --storage_account_name "${storage_accountname}" \
  --terraform_keyfile "${key_file}"               \
  --tf_resource_name "${tf_resource_name}"        \
 --azure_resource_id "${azure_resource_id}"
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

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
