---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/21/2023
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-terraform
title: advanced_state_management
description: Updates the Terraform state file using a shell script
# Customer intent: "As a DevOps engineer managing infrastructure, I want to update the Terraform state file using a shell script, so that I can efficiently manage resources that were modified or created outside of Terraform."
---

# advanced_state_management.sh

## Synopsis
Allows for Terraform state file management.

## Syntax

```bash

advanced_state_management.sh [--parameterfile] <String> 
[--type] <String> 
[--operation] <String> 
[--terraform_keyfile] <String>
[--subscription] <String> 
[--storage_account_name] <String> 
[--tf_resource_name] <String>
[--azure_resource_id] <String> 
[--help]
```

## Description
You can use this script to:

- list the resources in the Terraform state file.
- add missing or modified resources to the Terraform state file. 
- remove resources from the Terraform state file.


This script is useful if resources are modified or created without using Terraform.

## Examples

### Example 1

List the contents of the Terraform state file.

```bash

parameter_file_name="DEV-WEEU-SAP01-X00.tfvars"
deployment_type="sap_system"
subscriptionID="<subscriptionId>"

filepart=$(echo "${parameter_file_name}" | cut -d. -f1)
key_file=${filepart}.terraform.tfstate

#This is the name of the storage account containing the terraform state files
storage_accountname="<storageaccountname>"

$DEPLOYMENT_REPO_PATH/deploy/scripts/advanced_state_management.sh                      \
  --parameterfile "${parameter_file_name}"        \
  --type "${deployment_type}"                     \
  --operation list                                \
  --subscription "${subscriptionID}"              \
  --storage_account_name "${storage_accountname}" \
  --terraform_keyfile "${key_file}"
```

### Example 2

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
  --operation import                              \
  --subscription "${subscriptionID}"              \
  --storage_account_name "${storage_accountname}" \
  --terraform_keyfile "${key_file}"               \
  --tf_resource_name "${tf_resource_name}"        \
  --azure_resource_id "${azure_resource_id}"
 ```

### Example 3

Removing a storage account from the state file

```bash

parameter_file_name="DEV-WEEU-SAP01-X00.tfvars"
deployment_type="sap_system"
subscriptionID="<subscriptionId>"

filepart=$(echo "${parameter_file_name}" | cut -d. -f1)
key_file=${filepart}.terraform.tfstate

#This is the name of the storage account containing the terraform state files
storage_accountname="<storageaccountname>"

#Terraform Resource name of the first
tf_resource_name="module.common_infrastructure.azurerm_storage_account.sapmnt[0]"
                 
$DEPLOYMENT_REPO_PATH/deploy/scripts/advanced_state_management.sh                      \
  --parameterfile "${parameter_file_name}"        \
  --type "${deployment_type}"                     \
  --operation remove                              \
  --subscription "${subscriptionID}"              \
  --storage_account_name "${storage_accountname}" \
  --terraform_keyfile "${key_file}"               \
  --tf_resource_name "${tf_resource_name}" 
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

### `--operation`
Sets the operation to perform. Valid values include: `sap_deployer`, `import`, `list`, and `remove`.

```yaml
Type: String
Aliases: `-t`
Accepted values: import, list, remove

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
