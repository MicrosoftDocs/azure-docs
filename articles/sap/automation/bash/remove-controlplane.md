---
online version: https://github.com/Azure/SAP-automation
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 09/19/2023
ms.topic: reference
ms.service: sap-on-azure
ms.subservice: sap-automation
title: remove_controlplane.sh
description: Removes the SAP Control Plane (Deployer, Library) using a shell script.
---

# remove_controlplane.sh

## Synopsis

Removes the control plane, including the deployer VM and the SAP library. It's important to remove the terraform deployed artifacts using Terraform to ensure that the removals are done correctly.

## Syntax

```bash

remove_controlplane.sh  [-d or --deployer_parameter_file ] <String> [-l or --library_parameter_file ] <String>
```

## Description
Removes the SAP control plane, including the deployer VM and the SAP library.

## Examples

### Example 1
```bash
export      ARM_SUBSCRIPTION_ID="<subscriptionId>"
export            ARM_CLIENT_ID="<appId>"
export        ARM_CLIENT_SECRET="<password>"
export            ARM_TENANT_ID="<tenantId>"
export                 env_code="MGMT"
export              region_code="WEEU"
export                vnet_code="DEP01"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"

az logout
az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"

sudo ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/remove_controlplane.sh.sh                                                                                                            \
    --deployer_parameter_file "${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars" \
    --library_parameter_file "${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"
              
```

### Example 2
```bash
export      ARM_SUBSCRIPTION_ID="<subscriptionId>"
export            ARM_CLIENT_ID="<appId>"
export        ARM_CLIENT_SECRET="<password>"
export            ARM_TENANT_ID="<tenantId>"
export                 env_code="MGMT"
export              region_code="WEEU"
export                vnet_code="DEP01"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"

az logout
az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"

sudo ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/remove_controlplane.sh.sh                                                                                                            \
    --deployer_parameter_file "${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars" \
    --library_parameter_file "${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"
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

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
