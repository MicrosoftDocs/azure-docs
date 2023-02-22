---
online version: https://github.com/Azure/sap-automation
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
title: installer.sh
description: Deploy a new SAP system using a shell script.
---

# Installer.sh

## Synopsis
You can use the command `installer.sh` to deploy a new SAP system. The script can be used to deploy all the different types of deployments.

## Syntax

```bash

installer.sh [--parameterfile] <String> [--type] <String> [[--deployer_tfstate_key] <String>]
 [[ --landscape_tfstate_key] <String>] [[--storageaccountname] <String>] [[ --state_subscription ] <String>] [[ --state_subscription ] <String>] [[ --state_subscription ] [ --force ] [ --auto-approve ]<String>]
s>]
```

## Description
The `installer.sh` script deploys or updates a new SAP system of the specified type.

## Examples

### Example 1

Deploys or updates an SAP System.

```bash

installer.sh --parameterfile DEV-WEEU-SAP00-X00.tfvars --type sap_system
```

### Example 2

Deploys or updates an SAP System.

```bash

installer.sh --parameterfile DEV-WEEU-SAP00-X00.tfvars --type sap_system \ 
--deployer_tfstate_key MGMT-WEEU-DEP00-INFRASTRUCTURE.terraform.tfstate  \
--landscape_tfstate_key DEV-WEEU-SAP01-INFRASTRUCTURE.terraform.tfstate
```

### Example 3

Deploys or updates an SAP Library.

```bash
installer.sh -Parameterfile MGMT-WEEU-SAP_LIBRARY.tfvars --type sap_library
```

## Parameters

### `--parameter_file`
Sets the parameter file for the system. For more information, see [Configuring the SAP system](../configure-system.md).

```yaml
Type: String
Aliases: `-p`

Required: True
```

### `--type`
Sets the type of deployment. Valid values include: `sap_deployer`, `sap_library`, `sap_landscape`, and `sap_system`.

```yaml
Type: String
Accepted values: sap_deployer, sap_landscape, sap_library, sap_system
Aliases: `-t`

Required: True
```

### --deployer_tfstate_key
Sets the name of the state file for the deployer deployment.

```yaml
Type: String
Aliases: `-d`

Required: False
```

### -landscape_tfstate_key
Sets the name of the state file for the workload zone deployment.

```yaml
Type: String
Aliases: `-l`

Required: False
```

### `--state_subscription`
Sets the subscription ID for the Terraform storage account.

```yaml
Type: String
Aliases: `-k`

Required: False
```
### `--storageaccountname`
Sets the name of the storage account that contains the Terraform state files.

```yaml
Type: String
Aliases: `-a`

Required: False
```

### `--keyvault`
Sets the deployment credentials' key vault.

```yaml
Type: String
Aliases: `-v`

Required: False
```

### `--force`
Cleans up your local configuration.

```yaml
Type: SwitchParameter
Aliases: `-f`

Required: False
```

### `--auto-approve`
Enables silent deployment.

```yaml
Type: SwitchParameter
Aliases: `-i`

Required: False
```

### `--help`
Shows help for the script.

```yaml
Type: SwitchParameter
Aliases: `-h`

Required: False
```


## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.

## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
