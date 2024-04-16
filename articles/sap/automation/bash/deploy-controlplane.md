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
title: Deploy Control Plane
description: Deploys the control plane (deployer, SAP library) using a shell script.
---

# deploy_controlplane.sh

## Synopsis
The `deploy_controlplane.sh` script deploys the control plane, including the deployer VMs, Azure Key Vault, and the SAP library.

The deployer VM has installations of Ansible and Terraform. This VM is used to deploy the SAP systems.

## Syntax

```bash

deploy_controlplane.sh [ --deployer_parameter_file ] <String> [ --library_parameter_file ] <String>
 [[ --subscription] <String>] [[ --spn_id  ] <String>] [[ --spn_secret ] <String>] [[ --tenant_id ] <String>]
 [[ --storageaccountname] <String>] [ --force ] [ --auto-approve ]
```

## Description
Deploys the control plane, which includes the deployer VM and the SAP library. For more information, see [Configuring the control plane](../configure-control-plane.md) and [Deploying the control plane](../deploy-control-plane.md)

## Examples

### Example 1

This example deploys the control plane, as defined by the parameter files. The process prompts you for the SPN details.

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

sudo ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh                                                                                                            \
    --deployer_parameter_file "${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars" \
    --library_parameter_file "${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"
```

### Example 2

This example deploys the control plane, as defined by the parameter files. The process adds the deployment credentials to the deployment's key vault.

```bash

export ARM_SUBSCRIPTION_ID="<subscriptionId>"
export       ARM_CLIENT_ID="<appId>"
export   ARM_CLIENT_SECRET="<password>"
export       ARM_TENANT_ID="<tenantId>"
export            env_code="MGMT"
export         region_code="WEEU"
export           vnet_code="DEP01"

export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

az logout
az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"


cd ~/Azure_SAP_Automated_Deployment/WORKSPACES


sudo ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh                                                                                                            \
    --deployer_parameter_file "${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars" \
    --library_parameter_file "${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"                                   \
    --subscription "${ARM_SUBSCRIPTION_ID}"                                                                                                                                       \
    --spn_id "${ARM_CLIENT_ID}"                                                                                                                                                   \
    --spn_secret "${ARM_CLIENT_SECRET}"                                                                                                                                           \
    --tenant_id "${ARM_TENANT_ID}"
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
Sets the target Azure subscription.

```yaml
Type: String
Aliases: `-s`

Required: False
```

### `--spn_id`
Sets the service principal's app ID. For more information, see [Prepare the deployment credentials](../deploy-control-plane.md#prepare-the-deployment-credentials).

```yaml
Type: String
Aliases: `-c`

Required: False
```

### `--spn_secret`
Sets the Service Principal password. For more information, see [Prepare the deployment credentials](../deploy-control-plane.md#prepare-the-deployment-credentials). 

```yaml
Type: String
Aliases: `-p`

Required: False
```

### `--tenant_id`
Sets the tenant ID for the service principal. For more information, see [Prepare the deployment credentials](../deploy-control-plane.md#prepare-the-deployment-credentials). 

```yaml
Type: String
Aliases: `-t`

Required: False
```


### `--storageaccountname`
Sets the name of the storage account that contains the Terraform state files.  

```yaml
Type: String
Aliases: `-a`

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

### `--recover`
Recreates the local configuration files.

```yaml
Type: SwitchParameter
Aliases: `-h`

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

## Related Links

+[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
