---
title: Onboard to Azure Virtual Enclaves
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Overview

This guide provides the steps to onboard to Azure Virtual Enclaves (AVE) by enabling the resource provider and granting permissions over an Azure subscription.



## Prerequisites

1. You must already have an Azure tenant and subscription
1. You must be in the owner role over the subscription
1. Standard resource providers must be registered on the subscription to include the following:

   ![image.png](/assets/image-76aa8d56-260e-4c47-9fcc-fb8427f2efe0.png)
   ![image.png](/assets/image-3dac39eb-0884-4395-b30f-75cf7709ec69.png)

## Register the Microsoft.Mission Resource Provider and grant permissions

### Azure Portal

1. Login to your Azure tenant and open the subscription resource
2. Open the "**Resource Providers**" blade (under "Settings")
3. Search for and select "**Microsoft.Mission**" and click "**Register**". 
   ![image.png](/assets/image-bc93cf2b-050e-4eff-b61e-8afbb05d4ac2.png)
4. Open the "**Preview Features**" blade (under "Settings")
5. Filter by "**AVE**", select "**Azure Virtual Enclaves Preview**", and click "**Register**" towards the top of the page.
   ![image-2024-05-17_131235](/assets/image-2024-05-17_131235.png)
6. Message your AVE point of contact or the [AVE Product team](vepm@microsoft.com) to get approval
7. Once you get approval, proceed to [next steps](#next-steps).

### Powershell

You can run the following code to quickly register all required resource providers to begin using AVE.
1. In the Azure Portal, select the `Cloud Shell` icon at the top of the window here ![image](/assets/Portal-cloud-shell-link.png)
2. [Set context](https://learn.microsoft.com/en-us/powershell/azure/context-persistence?view=azps-12.3.0#create-a-new-azure-context-from-subscription-information) to the subscription you registered above.
3. Copy and past the code below into the Cloud Shell and press enter.

```
$resourceProviders = @(
   "Microsoft.ADHybridHealthService",
   "Microsoft.Advisor",
   "Microsoft.AlertsManagement",
   "Microsoft.Authorization",
   "Microsoft.Automation"
   "Microsoft.Billing",
   "Microsoft.Capacity",
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
   "Microsoft.MarketplaceNotifications",
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

foreach ($provider in $resourceProviders)
{
    Register-AzResourceProvider -ProviderNamespace $provider
    Write-Host "Registered resource provider: $provider"
}
```

3. Then proceed to [next steps](#next-steps)

### Air-Gapped Users 

Transfer the script above into USSEC/USNAT using [Pastebin](https://eng.ms/docs/cloud-ai-platform/azure-edge-platform-aep/aep-silver/sovereign-foundation-team/cloud-transfer-service/cts-onboarding/cts-portal/pastebinuserguide)** 

# Extra step for Air-Gapped users
You may also need to enable a Feature on the subscription (specifically, the Microsoft.Insights/enableprivatelinkscopes AFEC) on the CX subscription, since AMPLS (deployed as part of enclaves) is hidden behind this feature flag.

First, submit a JIT for: ACIS > AFEC-PlatformServiceOperator. You can ping the lowside Teams channel, Compute Approvals, to ask for JIT approval in either Air-Gapped Cloud.

Once the JIT is approved, go to Jarvis > Actions > Azure Resource Manager > Feature Management > Approve Feature Registration.
- Endpoint: Feature
- Resource Provider Namespace: Microsoft.Insights
- Feature Name: enableprivatelinkscopes
- Subscription: CX Susbcription ID

You will also need to register a second feature flag, AVE-PREVIEW, on the subscription, since Microsoft.Mission resource types are hidden behind this feature flag.
- Endpoint: Feature
- Resource Provider Namespace: Microsoft.Mission
- Feature Name: AVE-PREVIEW
- Subscription: CX Susbcription ID

After these feature flags are registered, you may also need to unregister and re-register the Microsoft.Mission resource provider on your CX subscription.

See the AFEC documentation on how to get access / permission to create or register feature flags (either by JIT or by joining the security group) -https://eng.ms/docs/products/arm/rp_onboarding/afec/afec_jit

Then proceed to [next steps](#next-steps)

# Next Steps

1. Once the above steps have been completed, the Azure Virtual Enclaves Resource provider can begin deploying resources into your subscription on your behalf.

2. Use the following guides and start building your Virtual Enclaves Community:

   1. [Create a community](/docs/How%20To%20Guides/Create%20a%20Community%20in%20the%20Azure%20portal)
   2. [Create an enclave](/docs/How%20To%20Guides/Create%20an%20Enclave%20in%20the%20Azure%20Portal)
   3. [Create a workload](/docs/How%20To%20Guides/Create%20a%20Workload%20in%20the%20Azure%20Portal)

3. Use the following guides to establish network connectivity within your Community

   1. [Create an Enclave Endpoint](/docs/How%20To%20Guides/Create%20a%20Enclave%20Endpoint%20in%20the%20Azure%20Portal)
   1. [Create an Enclave Connection](/docs/How%20To%20Guides/Create%20an%20Enclave%20Connection%20from%20the%20Azure%20Portal)
   1. [Create a Transit Hub](/docs/How%20To%20Guides/Create%20a%20Transit%20Hub%20from%20the%20Azure%20Portal)
   1. [Create a Community Endpoint](/docs/How%20To%20Guides/Create%20a%20Community%20Endpoint%20in%20the%20Azure%20Portal)

4. Create resources within your workload(s) to meet your objectives.
   1. Create resources from the [Service Catalog](/docs/overview/List-of-Service-Catalog-Templates)
   1. Create resources with an [ARM template](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-to-resource-group?tabs=azure-cli) or [bicep template](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-to-resource-group?tabs=azure-cli) from [these examples](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts)
