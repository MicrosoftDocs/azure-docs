---
title: Air-Gapped Cloud Azure Virtual Enclaves
description: Air-Gapped Cloud Azure Virtual Enclaves
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Air-Gapped Cloud (AGC) Azure Virtual Enclaves

Virtual Enclaves are supported in Azure Commercial USSEC, and USNAT. This guidance provides resources and context specific to users with USSEC/USNAT environments.

## Links to Air-Gapped landing page for Virtual Enclaves
Use the same links that are available for Azure public but update the domain for the air gapped cloud you are working in.


```
**Note** - Azure Virtual Enclaves is currently in Preview and is not meant to support production workloads for customers at this time other than those authorized by the Azure Virtual Enclaves PG.

```

## Onboarding 
Follow the steps below to enable Azure Virtual Enclaves within a USSEC/USNAT Subscription.

1. Transfer the code below into [Pastebin](https://eng.ms/docs/cloud-ai-platform/azure-edge-platform-aep/aep-silver/sovereign-foundation-team/cloud-transfer-service/cts-onboarding/cts-portal/pastebinuserguide)**

1. Log in to a VM with access to USSEC/USNAT, use the bookmarks in edge to navigate to Pastebin and copy the script.

1. Open Powershell ISE/VS Code and paste the script into it.

1. Replace the values for $tenantID and $subscriptionID with your environments information.

1. Run the script and log in using an account with Subscription Owner and Global Admin permissions.

```
<#
   1. Log into Azure Tenant and target subscription 
   2. Register the Microsoft.Mission resource provider and all dependencies
   3. Grant the Microsoft.Mission AppID Owner Permissions over the subscription
#>

$tenantID       = '<Replace With Your Tenant ID>'
$subscriptionID = '<Replace With Your Subsciprion ID>'

$resourceProviders = @(
   Microsoft.MarketplaceNotifications
   Microsoft.SecurityInsights
   Microsoft.Advisor
   Microsoft.Storage
   Microsoft.OperationalInsights
   Microsoft.Logic
   Microsoft.Compute
   Microsoft.ManagedIdentity
   microsoft.insights
   Microsoft.SqlVirtualMachine
   Microsoft.DesktopVirtualization
   Microsoft.Mission
   Microsoft.Network
   Microsoft.KeyVault
   Microsoft.OperationsManagement
   Microsoft.ChangeAnalysis
   Microsoft.Capacity
   Microsoft.Web
   Microsoft.AlertsManagement
   Microsoft.Security
   Microsoft.PolicyInsights
   Microsoft.GuestConfiguration
   Microsoft.ResourceHealth
   Microsoft.CognitiveServices
   Microsoft.ADHybridHealthService
   Microsoft.Authorization
   Microsoft.Billing
   Microsoft.ClassicSubscription
   Microsoft.Commerce
   Microsoft.Consumption
   Microsoft.CostManagement
   Microsoft.Features
   Microsoft.MarketplaceOrdering
   Microsoft.Portal
   Microsoft.ResourceGraph
   Microsoft.ResourceNotifications
   Microsoft.Resources
   Microsoft.SerialConsole
   microsoft.support
)

# Log into Azure Tenant and target subscription 
Connect-AzAccount -TenantID $tenantID -tenantID $subscriptionID

# Register the Microsoft.Mission resource provider and all dependencies
foreach ($provider in $resourceProviders) 
{
    Register-AzResourceProvider -ProviderNamespace $provider
    Write-Host "Registered resource provider: $provider"
}

# Grant the Mission Enclave Service Principal Owner permissions over the subscription
$appId = (Get-AzADServicePrincipal -DisplayName 'Mission Enclave').AppID
New-AzRoleAssignment -ObjectId $appId -RoleDefinitionName "Owner" -Scope "/subscriptions/$subscriptionId"
```

## Contact Us

- [Submit a bug](https://aka.ms/azve/newbug)
- [Request a Feature](https://aka.ms/azve/newfeature)
- [Email for Questions/Feedback](mailto:vepm@microsoft.com)
