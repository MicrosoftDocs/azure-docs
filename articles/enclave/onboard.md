---
title: Get started with Azure Enclave
description: Get started with Azure Enclave by registering the required resource providers and permissions.
author: aserfass-msft
ms.author: aserfass
ai-usage: ai-assisted
ms.topic: how-to
ms.service: azure-enclave
ms.date: 08/14/2026
---

# Get started with Azure Enclave

Use this article to onboard to Azure Enclave by registering the required resource providers and preparing the permissions needed to manage Azure Enclave resources in your subscription.

## Prerequisites

- You must already have an Azure tenant and subscription.
- You must be an Owner of an existing Azure subscription.

## Register the required resource providers and configure `NetworkWatcherRG` access

### Option 1: PowerShell

PowerShell is the fastest way to register all required resource providers to begin using Azure Enclave.

1. Sign in to your Azure tenant and open the subscription.
1. In the Azure portal, select the `Cloud Shell` icon at the top of the window.

   :::image type="content" source="./media/portal-cloud-shell-link.png" alt-text="Screenshot showing the location of the Cloud Shell icon in the portal." border="true" lightbox="./media/portal-cloud-shell-link.png":::

1. Set the Azure context for your subscription. For example, run `Set-AzContext -Subscription <subscription-id>`.
1. Copy and paste this code into Cloud Shell, and then press Enter.

   ```powershell
   # Register the Azure Enclave Resource Provider and grant permissions to the Resource Provider application 
   
   $resourceProviders = @(
      "Microsoft.Advisor",
      "Microsoft.AlertsManagement",
      "Microsoft.Authorization",
      "Microsoft.Automation",
      "Microsoft.Billing",
      "Microsoft.Capacity",
      "Microsoft.ChangeAnalysis",
      "Microsoft.ClassicSubscription",
      "Microsoft.CognitiveServices",
      "Microsoft.Compute",
      "Microsoft.Consumption",
      "Microsoft.CostManagement",
      "Microsoft.DesktopVirtualization",
      "Microsoft.Features",
      "Microsoft.GuestConfiguration",
      "Microsoft.Insights",
      "Microsoft.KeyVault",
      "Microsoft.Logic",
      "Microsoft.ManagedIdentity",
      "Microsoft.MarketplaceOrdering",
      "Microsoft.Network",
      "Microsoft.OperationalInsights",
      "Microsoft.OperationsManagement",
      "Microsoft.PolicyInsights",
      "Microsoft.Portal",
      "Microsoft.ResourceGraph",
      "Microsoft.ResourceHealth",
      "Microsoft.ResourceNotifications",
      "Microsoft.Resources",
      "Microsoft.Security",
      "Microsoft.SecurityInsights",
      "Microsoft.SerialConsole",
      "Microsoft.SqlVirtualMachine",
      "Microsoft.Storage",
      "Microsoft.Support",
      "Microsoft.Web",
      "Microsoft.Mission"
   )
   
   $resourceProviders | foreach {Register-AzResourceProvider -ProviderNamespace $_ -Verbose}
   
   ```

1. (Optional) Enable the `EncryptionAtHost` feature.

   The [EncryptionAtHost](/azure/virtual-machines/linux/disks-enable-host-based-encryption-cli) feature enables encryption at the compute host level.

   ```azurecli
   # Register the feature
   az feature register --namespace Microsoft.Compute --name EncryptionAtHost

   # Check registration status (may take 10-15 minutes)
   az feature show --namespace Microsoft.Compute --name EncryptionAtHost

   # Once registered, refresh the provider
   az provider register --namespace Microsoft.Compute
   ```

1. After the update is complete, proceed to [Azure setup](./best-practices.md#azure-setup) or [next steps](#next-steps).

### Option 2: Azure portal

1. Sign in to your Azure tenant and open the subscription.
1. Under `Settings`, select `Resource providers`.
1. Register the resource providers listed in [Option 1: PowerShell](#option-1-powershell) in the subscription. The PowerShell script is the fastest option and the authoritative source for the required registrations. These images show the expected end state.

   :::image type="content" source="./media/onboard-providers-1.png" alt-text="Screenshot showing the first set of resource providers required by Azure Enclave." border="true" lightbox="./media/onboard-providers-1.png":::

   :::image type="content" source="./media/onboard-providers-2.png" alt-text="Screenshot showing the second set of resource providers required by Azure Enclave." border="true" lightbox="./media/onboard-providers-2.png":::

1. Search for and select `Microsoft.Mission`, and then select `Register`.

   :::image type="content" source="./media/onboard-mission-registered.png" alt-text="Screenshot showing the Microsoft.Mission resource provider registered successfully." border="true" lightbox="./media/onboard-mission-registered.png":::

1. Proceed to [Azure setup](./best-practices.md#azure-setup) or [next steps](#next-steps).

For reference, you can also review the generic instructions for enabling a [preview feature](/azure/azure-resource-manager/management/preview-features).

### Configure `NetworkWatcherRG` access

To avoid potential problems with [virtual network flow log](/azure/network-watcher/vnet-flow-logs-overview) creation, ensure the `NetworkWatcherRG` resource group exists in each subscription and that the `Mission Enclave` app has the `Network Contributor` role on that group before you create your first enclave. If the network watcher instance is automatically created (for example, through an existing Azure resource deployment in that region), review the role assignment on your [list of network watcher instances](/azure/network-watcher/network-watcher-create?tabs=portal#list-network-watcher-instances). Learn more about [Network Watcher](/azure/network-watcher/network-watcher-overview).

> [!IMPORTANT]
> If `NetworkWatcherRG` doesn't exist or the `Mission Enclave` app doesn't have the `Network Contributor` role on it, enclave deployments might fail when attempting to create virtual network flow logs. The `Owner` or `Contributor` roles also work but grant more permissions than required.

1. Select the `NetworkWatcherRG` resource group, select `Access control (IAM)`, then select `Add` and `Add role assignment`.

   :::image type="content" source="./media/onboard-network-watcher-add-role.png" alt-text="Screenshot showing role assignment selection in the NetworkWatcherRG resource group." border="true" lightbox="./media/onboard-network-watcher-add-role.png":::

1. Type `Network Contributor`, select `Network Contributor`, and then select `Next`.

   :::image type="content" source="./media/onboard-add-role-select-network-contributor.png" alt-text="Screenshot showing Network Contributor role selection in the role assignment wizard." border="true" lightbox="./media/onboard-add-role-select-network-contributor.png":::

1. Select `Select members`, type `Mission Enclave` in the search box, select the `Mission Enclave` app, and then select `Select` and `Next`, then `Review + assign`.

   :::image type="content" source="./media/onboard-select-mission-enclave-app.png" alt-text="Screenshot showing Mission Enclave app selection in the members picker." border="true" lightbox="./media/onboard-select-mission-enclave-app.png":::

1. Once the update is complete, you can start deploying Azure Enclave resources.

When a community or enclave is created, Azure Enclave attempts the following steps:
1. Check if the `NetworkWatcherRG` resource group exists. If not, attempt to create that resource group in the same location as the community.
1. Check if the `Mission Enclave` app already has an `Owner`, `Contributor`, or `Network Contributor` role assignment on `NetworkWatcherRG`. If any of these roles is already present — including a pre-existing `Owner` assignment — Azure Enclave leaves it in place rather than creating an additional assignment. If none of these roles is present, Azure Enclave attempts to assign the `Mission Enclave` app the `Contributor` role on `NetworkWatcherRG`. This elevation is delegated on behalf of the signed-in caller, so it requires the deploying identity to hold sufficient permission (for example, User Access Administrator) to grant the role.
1. If any step fails, enclave deployments might fail when attempting to create virtual network flow logs.

## Transition steps for existing preview customers

Existing preview customers must re-register the Azure Enclave resource provider so their subscriptions can use the latest Azure Enclave API and service updates.

Complete these steps to use the latest Azure Enclave API:

1. In the Azure portal, navigate to your subscription.
1. Under `Settings`, select `Resource providers`.
1. Search for and select `Microsoft.Mission`, and then select `Re-register`.
1. Repeat these steps for any additional subscriptions.

## Next steps

After registering the Azure Enclave resource provider, you can start deploying Azure Enclave resources into your subscription.

- Start building your Azure Enclave community:

  - [Create a community](./create-community-portal.md)
  - [Create an enclave](./create-enclave-portal.md)
  - [Create a workload](./create-workload-portal.md)

- Establish network connectivity within your community:

  - [Create an enclave endpoint](./create-enclave-endpoint-portal.md)
  - [Create an enclave connection](./create-enclave-connection-portal.md)
  - [Create a transit hub](./create-transit-hub-portal.md)
  - [Create a community endpoint](./create-community-endpoint-portal.md)

  - Create resources within your workloads to meet your objectives:
    - Create resources from the [service catalog](./list-service-catalog-templates.md)
    - Create resources with a [template](/azure/azure-resource-manager/templates/deploy-to-resource-group) or [bicep template](/azure/azure-resource-manager/bicep/deploy-to-resource-group) from [these examples](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts)
