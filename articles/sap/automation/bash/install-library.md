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
title: install_library.sh
description: Bootstrap a new SAP Library in the control plane using a shell script.
---

# Install_library.sh

## Synopsis
The `install_library.sh` script sets up a new SAP Library.

## Syntax

```bash
install_library.sh [ --parameterfile ] <String> [ --deployer_statefile_foldername ] <String> 
[-i | --auto-approve]
```

## Description
The `install_library.sh` command sets up a new SAP Library in the control plane.
The SAP Library provides the storage for Terraform state files and SAP installation media.

## Examples

### Example 1
```bash

install_library.sh -Parameterfile MGMT-WEEU-SAP_LIBRARY.tfvars -deployer_statefile_foldername ../../DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE
```

## Parameters

### `--parameterfile`
Sets the parameter file for the deployer VM. For more information, see [Configuring the control plane](../configure-control-plane.md#deployer).

```yaml
Type: String
Aliases: `-p`

Required: True
```

### `--deployer_statefile_foldername`
Sets the relative folder path to the folder that contains the deployer VM's parameter file, named `terraform.tfstate`.

```yaml
Type: String
Aliases: `-d`

Required: True
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
