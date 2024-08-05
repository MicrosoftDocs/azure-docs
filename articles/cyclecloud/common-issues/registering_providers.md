---
title: Common Issues - Azure Credentials| Microsoft Docs
description: Azure CycleCloud common issue - Azure Credentials
author: adriankjohnson
ms.date: 06/20/2023
ms.author: adjohnso
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---
# Common Issues: Azure provider registration error

## Possible Error Messages

- `Failed to register Azure providers`

## Resolution
Before you can use your Azure subscription, Azure requires that you register access to the Azure resource providers. CycleCloud, when adding new accounts, will attempt to register the providers for use in your subscription. If the service principal configured for CycleCloud does not have permission to register the providers, this error will occur.

There are two possible resolutions:
1. Grant the CycleCloud service principal the following permissions:
    - `Microsoft.Compute/register/action`
    - `Microsoft.Storage/register/action`
    - `Microsoft.Network/register/action`
    - `Microsoft.Resources/register/action`
    - `Microsoft.Commerce/register/action`

1. Use the Azure CLI to manually register the providers
```azurecli-interactive
az provider register --namespace "Microsoft.Compute"
az provider register --namespace "Microsoft.Storage"
az provider register --namespace "Microsoft.Network"
az provider register --namespace "Microsoft.Resources"
az provider register --namespace "Microsoft.Commerce"
```

## More Information

For more information on specific permissions required for Azure CycleCloud, see [Create a custom role for CycleCloud](/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud)
