---
title: Configure pre-deployment on Azure Native New Relic Service
description: Learn how to configure New Relic in Azure Marketplace before deployment.

ms.topic: how-to
ms.date: 06/23/2023

---

# Configure pre-deployment for Azure Native New Relic Service

This article describes the prerequisites that you must complete in your Azure subscription before you create your first New Relic resource on Azure.

## Access control

To set up Azure Native New Relic Service, you must have owner access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before you start the setup.

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
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
