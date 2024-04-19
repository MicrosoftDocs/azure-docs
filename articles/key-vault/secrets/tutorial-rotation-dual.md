---
title: Rotation tutorial for resources with two sets of credentials
description: Use this tutorial to learn how to automate the rotation of a secret for resources that use two sets of authentication credentials.
services: key-vault
author: msmbaldwin
tags: 'rotation'
ms.service: key-vault
ms.subservice: secrets
ms.topic: tutorial
ms.date: 01/30/2024
ms.author: mbaldwin
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# Automate the rotation of a secret for resources that have two sets of authentication credentials

The best way to authenticate to Azure services is by using a [managed identity](../general/authentication.md), but there are some scenarios where that isn't an option. In those cases, access keys or passwords are used. You should rotate access keys and passwords frequently.

## Key Vault rotation functions for two sets of credentials

Rotation functions template for two sets of credentials and several ready to use functions:

- [Project template](https://serverlesslibrary.net/sample/bc72c6c3-bd8f-4b08-89fb-c5720c1f997f)
- [Redis Cache](https://serverlesslibrary.net/sample/0d42ac45-3db2-4383-86d7-3b92d09bc978)
- [Storage Account](https://serverlesslibrary.net/sample/0e4e6618-a96e-4026-9e3a-74b8412213a4)
- [Azure Cosmos DB](https://serverlesslibrary.net/sample/bcfaee79-4ced-4a5c-969b-0cc3997f47cc)

> [!NOTE]
> These rotation functions are created by a member of the community and not by Microsoft. Community functions are not supported under any Microsoft support program or service, and are made available AS IS without warranty of any kind.

## Next steps

- Tutorial: [Secrets rotation for one set of credentials](./tutorial-rotation.md)
- Overview: [Monitoring Key Vault with Azure Event Grid](../general/event-grid-overview.md)
- How to: [Create your first function in the Azure portal](../../azure-functions/functions-get-started.md)
- How to: [Receive email when a Key Vault secret changes](../general/event-grid-logicapps.md)
- Reference: [Azure Event Grid event schema for Azure Key Vault](../../event-grid/event-schema-key-vault.md)
