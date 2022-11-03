---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/10/2021
ms.topic: reference
ms.service: azure-center-sap-solutions
title: Remove_region.sh
description: Removes the SAP Control Plane (Deployer, Library) using a shell script.
---

# Remove_region.sh

## Synopsis

Removes the control plane, including the deployer VM and the SAP library. It is important to remove the terraform deployed artifacts using Terraform to ensure that the removals are done correctly.

## Syntax

```bash

remove_region.sh  [-d or --deployer_parameter_file ] <String> [-l or --library_parameter_file ] <String>
```

## Description
Removes the SAP control plane, including the deployer VM and the SAP library.

## Examples

### Example 1
```bash
${DEPLOYMENT_REPO_PATH}/deploy/scripts/remove_region.sh                                                         \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                      
```

### Example 2
```bash
${DEPLOYMENT_REPO_PATH}/deploy/scripts/remove_region.sh                                                          \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                      \
        --subscription xxxxxxxxxxx
        --storage_account mgmtweeutfstate###
```

## Parameters

### `--deployer_parameter_file`
Sets the parameter file for the deployer VM. For more information, see [Configuring the control plane](../configure-control-plane.md#deployer).

```yaml
Type: String
Aliases: `-d`

Required: True
```

### `--library_parameter_file`
Sets the parameter file for the SAP library. For more information, see [Configuring the control plane](../configure-control-plane.md#sap-library).

```yaml
Type: String
Aliases: `-l`

Required: True
```

### `--subscription`
Sets the subscription that contains the SAP library. For more information, see [Configuring the control plane](../configure-control-plane.md#sap-library).

```yaml
Type: String
Aliases: `-l`
Required: True
```

### `--storage_account`
Sets the storage account name of the `tfstate` storage account in SAP library. For more information, see [Configuring the control plane](../configure-control-plane.md#sap-library).

```yaml
Type: String
Aliases: `-l`
Required: True
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

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation )
