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
title: install_workloadzone.sh
description: Deploy a new SAP Workload Zone using a shell script.
---

# install_workloadzone.sh

## Synopsis
You can use the `install_workloadzone.sh` script to deploy a new SAP workload zone.

## Syntax

```bash

install_workloadzone.sh [ -p or --parameterfile ] <String> 
 [[ --deployer_tfstate_key ] <String>] [[ --deployer_environment] <String>] [[ --state_subscription] <String>] [[ --storageaccountname ]
 [[ --subscription] <String>] [[ --spn_id  ] <String>] [[ --spn_secret ] <String>] [[ --tenant_id ] <String>]
 [[ --storageaccountname] <String>] [ force] [-i | --auto-approve]
```

## Description
The  `install_workloadzone.sh` script deploys a new SAP workload zone. The workload zone contains the shared resources for all SAP VMs.

## Examples

### Example 1

This example deploys the workload zone, as defined by the parameter files. The process prompts you for the SPN details.

```bash

install_workloadzone.sh -parameterfile PROD-WEEU-SAP00-infrastructure.tfvars
```

### Example 2

This example deploys the workload zone, as defined by the parameter files. The process adds the deployment credentials to the deployment's key vault.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE

export        subscriptionId=<subscriptionID>
export                 appId=<appID>
export             spnSecret="<password>"
export              tenantId=<tenantID>
export              keyvault=<keyvaultName>
export        storageAccount=<storageaccountName>
export statefileSubscription=<statefile_subscription>

export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-automation

${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh \
        --parameter_file DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars  \
        --keyvault $keyvault                                   \
        --state_subscription $statefileSubscription            \
        --storageaccountname $storageAccount                   \
        --subscription $subscriptionId                         \
        --spn_id $appId                                        \
        --spn_secret $spnSecret                                \ 
        --tenant_id $tenantId
```
## Parameters

### `--parameter_file`
Sets the parameter file for the workload zone. For more information, see [Configuring the workload zone](../configure-workload-zone.md).

```yaml
Type: String
Aliases: `-p`

Required: True
```

### `--deployer_tfstate_key`
Sets the deployer VM's Terraform state file name.

```yaml
Type: String
Aliases: `-d`

Required: False
```

### `deployer_environment`
Deployer environment name

```yaml
Type: String
Aliases: `-e`

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

### `--subscription`
Sets the target Azure subscription.

```yaml
Type: String
Aliases: `-s`

Required: False
```

### `-spn_id`
Sets the service principal's app ID. For more information, see [Prepare the deployment credentials](../deploy-control-plane.md#prepare-the-deployment-credentials).

```yaml
Type: String
Aliases: `-c`

Required: False
```

### `--spn_secret`
Sets the service principal password. For more information, see [Prepare the deployment credentials](../deploy-control-plane.md#prepare-the-deployment-credentials). 

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
