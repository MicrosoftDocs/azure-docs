---
online version: https://github.com/Azure/sap-hana
schema: 2.0.0
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/21/2021
ms.topic: reference
ms.service: azure-center-sap-solutions
title: Prepare region
description: Deploys the control plane (deployer, SAP library) using a shell script.
---

# prepare_region.sh

## Synopsis
The `prepare_region.sh` script deploys the control plane, including the deployer VM, Azure Key Vault, and the SAP library.

The deployer VM has installations of Ansible and Terraform. This VM deploys the SAP artifacts.

## Syntax

```bash
prepare_region.sh [ --deployer_parameter_file ] <String> [ --library_parameter_file ] <String>
 [[ --subscription] <String>] [[ --spn_id  ] <String>] [[ --spn_secret ] <String>] [[ --tenant_id ] <String>]
 [[ --storageaccountname] <String>] [ --force ] [ --auto-approve ]
```

## Description
Deploys the control plane, which includes the deployer VM and the SAP library. For more information, see [Configuring the control plane](../configure-control-plane.md) and [Deploying the control plane](../deploy-control-plane.md)

## Examples

### Example 1

This example deploys the control plane, as defined by the parameter files. The process prompts you for the SPN details.

```bash
${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                         \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                      
```

### Example 2

This example deploys the control plane, as defined by the parameter files. The process adds the deployment credentials to the deployment's key vault.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

az logout
az login

export subscriptionId=<subscriptionID>
export appId=<appID>
export spnSecret="<password>"
export tenantId=<tenantID>

${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                         \
        --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                      \
        --subscription $subscriptionId                                                                           \
        --spn_id $appId                                                                                          \
        --spn_secret $spnSecret                                                                                  \
        --tenant_id $tenantId
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
