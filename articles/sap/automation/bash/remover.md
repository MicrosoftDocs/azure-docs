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
title: remover.sh
description: Remove a new SAP system using a shell script.
---

# Remover.sh

## Synopsis
You can use the command `remover.sh` to remove a new SAP system. The script can be used to remove workload zones and SAP systems.

## Syntax

```bash

remover.sh [--parameterfile] <String> [--type] <String> [ --help ]<String>]
s>]
```

## Description
The `remover.sh` script deploys or updates a new deployment of the specified type.

## Examples

### Example 1

Removes an SAP System deployment.

```bash

remover.sh --parameterfile DEV-WEEU-SAP00-X00.tfvars --type sap_system
```

### Example 2

Removes a workload deployment.

```bash
remover.sh --parameterfile DEV-WEEU-SAP00-INFRASTRUCTURE.tfvars --type sap_landscape
```

## Parameters

### `--parameter_file`
Sets the parameter file for the system

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
