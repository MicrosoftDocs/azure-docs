---
title: Configure pre-deployment on Azure Native New Relic Service 
description: Learn how to configure New Relic in the Azure Marketplace before deployment.
ms.topic: how-to


ms.date: 12/31/2022
---


# Configure pre-deployment for Azure Native New Relic Service

This article describes the prerequisites that must be completed in your Azure subscription before you create your first New Relic resource in Azure.

## Access control

To set up New Relic on Azure, you must have Owner access on the Azure subscription. First, [confirm that you have the appropriate access](/azure/role-based-access-control/check-access) before starting the setup.

## Resource provider registration

To set up New Relic on Azure, you need to register the `NewRelic.Observability` resource provider in the specific Azure subscription.

### Using Azure portal

Follow the steps outlined [here](/azure/azure-resource-manager/management/resource-providers-and-types), to register the `NewRelic.Observability` resource provider in your subscription.

### Using Azure CLI (command-line interfaces)

```azurecli
az provider register \--namespace NewRelic.Observability \--subscription \<subscription-id\>
```

## Next steps

- [QuickStart: Get started with New Relic](new-relic-create.md)
- [Troubleshoot Azure Native New Relic Service](new-relic-troubleshoot.md)

