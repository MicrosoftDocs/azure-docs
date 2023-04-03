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
title: update_sas_token.sh
description: Updates the SAP Library SAS token in Azure Key Vault
---

# update_sas_token.sh

## Synopsis
Updates the SAP Library SAS token in Azure Key Vault

## Syntax

```bash

update_sas_token.sh
```

## Description
Updates the SAP Library SAS token in Azure Key Vault. Prompts for the SAP library storage account name and the deployer key vault name.

## EXAMPLES

### EXAMPLE 1

Prompts for the SAP library storage account name and the deployer key vault name.

```bash

update_sas_token.sh
```

### EXAMPLE 2

```bash

export SAP_LIBRARY_TF=mgmtweeusaplibXXX
export SAP_KV_TF=MGMTWEEUDEP00userYYY

update_sas_token.sh
```


## Parameters

None

## Notes
v0.9 - Initial version


Copyright (c) Microsoft Corporation.
Licensed under the MIT license.
## Related links

[GitHub repository: SAP on Azure Deployment Automation Framework](https://github.com/Azure/sap-automation)
