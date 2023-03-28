---
title: Configure pre-deployment on Azure Native New Relic Service Preview
description: Learn how to configure New Relic in Azure Marketplace before deployment.
ms.topic: how-to

ms.date: 01/16/2023
---

# Configure pre-deployment for Azure Native New Relic Service Preview

This article describes the prerequisites that you must complete in your Azure subscription before you create your first New Relic resource on Azure.

## Access control

To set up New Relic on Azure, you must have owner access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before you start the setup.

## Resource provider registration

To set up New Relic on Azure, you need to register the `NewRelic.Observability` resource provider in the specific Azure subscription:

- To register the resource provider in the Azure portal, follow the steps in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- To register the resource provider in the Azure CLI, use this command:

  ```azurecli
  az provider register --namespace NewRelic.Observability --subscription <subscription-id>
  ```

## Next steps

- [Quickstart: Get started with New Relic](new-relic-create.md)
- [Troubleshoot Azure Native New Relic Service](new-relic-troubleshoot.md)
