---
title: Get started with Azure Enclave
description: Get started with Azure Enclave by registering the required resource providers and permissions.
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 9/30/2025
---

# Get started with Azure Enclave

Use this quickstart to onboard to Azure Enclave by registering the required resource providers and granting the permissions needed to manage Azure Enclave resources in your subscription.

## Prerequisites

  - You must already have an Azure tenant and subscription.
  - You must be an Owner of an existing Azure subscription.

## Register the `Microsoft.Mission` resource provider and grant permissions

### Option 1: PowerShell

PowerShell is the fastest way to register the required resource providers.

You can run the following code to quickly register all required resource providers to begin using Azure Enclave.

1. Sign in to your Azure tenant and open the subscription.
2. In the Azure portal, select the `Cloud Shell` icon at the top of the window.

![Screenshot showing the location of the Cloud Shell icon in the portal.](./media/portal-cloud-shell-link.png)

3. Set the Azure context for your subscription. For example, run `Set-AzContext -Subscription <subscription-id>`.
4. Copy and paste this code into Cloud Shell, and then press Enter.

```
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
   "Microsoft.insights",
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
   "Microsoft.support",
   "Microsoft.Web",
   "Microsoft.Mission"
)

$resourceProviders | foreach {Register-AzResourceProvider -ProviderNamespace $_ -Verbose}

```

5. (Optional) Enable the `EncryptionAtHost` feature

The [EncryptionAtHost](/azure/virtual-machines/linux/disks-enable-host-based-encryption-cli) feature enables encryption at the compute host level.

```azurecli
# Register the feature
az feature register --namespace Microsoft.Compute --name EncryptionAtHost

# Check registration status (may take 10-15 minutes)
az feature show --namespace Microsoft.Compute --name EncryptionAtHost

# Once registered, refresh the provider
az provider register --namespace Microsoft.Compute
```

6. After the update is complete, proceed to [Azure setup](./best-practices.md#azure-setup) or [next steps](#next-steps).

### Option 2: Azure portal

1. Sign in to your Azure tenant and open the subscription.
1. Under **Settings**, open **Resource providers**.
1. Register the resource providers listed in [Option 1: PowerShell](#option-1-powershell) in the subscription. The PowerShell script is the fastest option and the authoritative source for the required registrations. These images show the expected end state.

:::image type="content" source="./media/onboard-providers-1.png" alt-text="Screenshot showing the first set of resource providers required by Azure Enclave." border="true" lightbox="./media/onboard-providers-1.png":::

:::image type="content" source="./media/onboard-providers-2.png" alt-text="Screenshot showing the second set of resource providers required by Azure Enclave." border="true" lightbox="./media/onboard-providers-2.png":::

4. Search for and select `Microsoft.Mission`, and then select **Register**.

   ![Screenshot showing the Microsoft.Mission resource provider registered successfully.](./media/onboard-mission-registered.png)

5. Proceed to [Azure setup](./best-practices.md#azure-setup) or [next steps](#next-steps).

For reference, you can also review the generic instructions for enabling a [preview feature](/azure/azure-resource-manager/management/preview-features).

## Transition steps for existing preview customers

Existing preview customers must re-register the Azure Enclave resource provider so their subscriptions can use the latest Azure Enclave API and service updates.

Complete these steps to use the latest Azure Enclave API:
1. In the Azure portal, navigate to your subscription.
2. Under **Settings**, open **Resource providers**.
1. Search for and select `Microsoft.Mission`, and then select **Re-register**.
4. Repeat these steps for any additional subscriptions.

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
