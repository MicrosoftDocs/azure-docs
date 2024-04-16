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
title: set_secrets.sh
description: Sets the SPN Secrets in Azure Key vault using a shell script.
---

# set_secrets.sh

## Synopsis
Sets the service principal secrets in Azure Key Vault.

## Syntax

```bash

set_secrets.sh [--region] <String> [--environment] <String> [--vault] <String> [--subscription] <String> [--spn_id] <String>
 [--spn_secret] <String> [--tenant_id] <String>
```

## Description
Sets the secrets in Key Vault that the deployment automation requires.

## EXAMPLES

### EXAMPLE 1

```bash

set_secrets.sh --environment DEV                        \
    --region weeu                                       \
    --vault MGMTWEEUDEP00userABC                        \
    --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy       \
    --spn_secret ************************               \
    --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz     
```

## Parameters

### `--region`
Sets the name of the Azure region for deployment.

```yaml
Type: String
Aliases: `-r`

Required: True
```

### `--environment`
Sets the name of the deployment environment.

```yaml
Type: String
```yaml
Type: String
Aliases: `-e`

Required: True
```

### `--vault`
Sets the name of the key vault.

```yaml
Type: String
Aliases: `-v`

Required: True
```

### `-spn_id`
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

## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.
## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-hana)
