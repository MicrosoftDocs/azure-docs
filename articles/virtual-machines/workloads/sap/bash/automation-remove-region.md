---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: virtual-machines-sap
title: Remove_region.sh
description: Removes the SAP Control Plane (Deployer, Library) using a shell script.
---

# Remove_region.sh

## Synopsis

Removes the control plane, including the deployer VM and the SAP library.
## Syntax

```bash

Remove_region.sh  [-d or --deployer_parameter_file ] <String> [-l or --library_parameter_file ] <String>
```

## Description
Removes the SAP control plane, including the deployer VM and the SAP library.

## Examples

### Example 1
```bash
${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                         \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                      
```

## Parameters

### `--deployer_parameter_file`
Sets the parameter file for the deployer VM. For more information, see [Configuring the control plane](../automation-configure-control-plane.md#deployer).

```yaml
Type: String
Aliases: `-d`

Required: True
```

### `--library_parameter_file`
Sets the parameter file for the SAP library. For more information, see [Configuring the control plane](../automation-configure-control-plane.md#sap-library).

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

[GitHub repository: SAP deployment automation framework](https://github.com/Azure/sap-automation )
