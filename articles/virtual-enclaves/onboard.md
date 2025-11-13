---
title: Get started with Azure Virtual Enclaves
description: Get started with Azure Virtual Enclaves
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 9/30/2025
---

# Get started with Azure Virtual Enclaves

This guide provides the steps to onboard to Azure Virtual Enclaves (AVE) by enabling the resource provider and granting permissions over your Azure subscription. If you experience any issues with onboarding your subscription to Azure Virtual Enclaves, submit a bug to the product group using this link:
- [Submit a Bug](https://aka.ms/ave/newbug)

## Prerequisites

  - You must already have an Azure tenant and subscription.
  - You must be an Owner of an existing Azure subscription.

## Register the `Microsoft.Mission` Resource Provider and grant permissions

### Option 1: PowerShell (Fastest)

You can run the following code to quickly register all required resource providers to begin using AVE.
1. Sign-in to your Azure tenant and open the subscription resource
2. In the Azure portal, select the `Cloud Shell` icon at the top of the window here

![Screenshot showing the location of the Cloud Shell icon in the portal.'](./media/portal-cloud-shell-link.png)

3. [Set context](/powershell/azure/context-persistence#create-a-new-azure-context-from-subscription-information) to your subscription.
4. Copy and paste this code into the Cloud Shell and press enter.

```
# Register the Azure Virtual Enclaves Resource Provider and grant permissions to the Resource Provider application

$resourceProviders = @(
   "Microsoft.ADHybridHealthService",
   "Microsoft.Advisor",
   "Microsoft.AlertsManagement",
   "Microsoft.Authorization",
   "Microsoft.Automation",
   "Microsoft.Billing",
   "Microsoft.Capacity",
   "Microsoft.ChangeAnalysis",
   "Microsoft.ClassicSubscription",
   "Microsoft.CognitiveServices",
   "Microsoft.Commerce",
   "Microsoft.Compute",
   "Microsoft.Consumption",
   "Microsoft.CostManagement",
   "Microsoft.DesktopVirtualization",
   "Microsoft.DevTestLab",
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

5. Once the update is complete, proceed to [Azure setup](./best-practices.md#azure-setup) or [next steps](#next-steps).

### Option 2: Azure portal

1. Sign-in to your Azure tenant and open the subscription resource.
2. Open the `Resource Providers` on the left side under `Settings`.
3. The [listed resource providers](#option-1-powershell-fastest) must be registered in the subscription. The [PowerShell](#option-1-powershell-fastest) script to enable these resource providers is the fastest option and includes the authoritative source of resource providers. These images are provided as an example of the view you should see in the end.

   ![Screenshot showing the first set of resource providers required by Azure Virtual Enclaves.](./media/onboard-providers-1.png)
   ![Screenshot showing the second set of resource providers required by Azure Virtual Enclaves.](./media/onboard-providers-2.png)

4. Search for and select `Microsoft.Mission` and select `Register`.

   ![Screenshot showing the Microsoft.Mission resource provider registered successfully.](./media/onboard-mission-registered.png)

5. Proceed to [Azure setup best practices](./best-practices.md#azure-setup) or [next steps](#next-steps).

For reference, you can also review the generic instructions for enabling a [preview feature](/azure/azure-resource-manager/management/preview-features).

## Transition steps for preview customers

Customers who used Azure Virtual Enclaves before November 2025 need to re-register the Azure Virtual Enclaves resource provider so your subscriptions can use the latest API with the latest features and improvements.

Complete these steps to use the latest Virtual Enclaves API:
1. In the Azure portal, navigate to your subscription.
2. Open the `Resource Providers` on the left side under `Settings`.
3. Search for and select `Microsoft.Mission` and select `Re-register`.
4. Repeat these steps for any more subscriptions.

## Next Steps

Now the Azure Virtual Enclaves resource provider can begin deploying Azure Virtual Enclaves resources into your subscription on your behalf.

  - Start building your Virtual Enclaves Community:

    - [Create a community](./create-community-portal.md)
    - [Create an enclave](./create-enclave-portal.md)
    - [Create a workload](./create-workload-portal.md)

  - Establish network connectivity within your Community

    - [Create an Enclave Endpoint](./create-enclave-endpoint-portal.md)
    - [Create an enclave connection](./create-enclave-connection-portal.md)
    - [Create a transit hub](./create-transit-hub-portal.md)
    - [Create a Community Endpoint](./create-community-endpoint-portal.md)

  - Create resources within your workloads to meet your objectives.
    - Create resources from the [Service Catalog](./list-service-catalog-templates.md)
    - Create resources with an [template](/azure/azure-resource-manager/templates/deploy-to-resource-group) or [bicep template](/azure/azure-resource-manager/bicep/deploy-to-resource-group) from [these examples](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts)
