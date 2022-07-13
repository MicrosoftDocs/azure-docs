---
title: Enable update management center (preview) for periodic assessment and scheduled patching
description: This article describes how to enable the periodic assessment and scheduled patching features using update management center (preview) for Windows and Linux machines running on Azure or outside of Azure connected to Azure Arc-enabled servers.
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 04/21/2022
ms.topic: conceptual
---

# How to enable update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to enable update management center (preview) for periodic assessment and scheduled patching using one of the following methods:

- From the Azure portal
- Using Azure PowerShell
- Using the Azure CLI
- Using the Azure REST API

Register the periodic assessment and scheduled patching feature resource providers in your Azure subscription, as detailed below, to enable update management center (preview) functionality. After your register for the features, access the preview link: **https://aka.ms/umc-preview**.

## Prerequisites

- Azure subscription - if you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Your account must be a member of the Azure [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role in the subscription.

- One or more [Azure virtual machines](/azure/virtual-machines), or physical or virtual machines managed by [Arc-enabled servers](/azure/azure-arc/servers/overview).

- Ensure that you meet all [prerequisites for update management center](overview.md#prerequisites)

## From the Azure portal

### [Periodic assessment](#tab/portal-periodic)

**For Arc-enabled servers**, no onboarding is required for using periodic assessment feature.

**For Azure machines**, your subscription needs to be allowlisted for preview feature **InGuestAutoAssessmentVMPreview**.

Follow the steps below to register for the *InGuestAutoAssessmentVMPreview* feature:

1. Sign in to the Update management center (preview) portal link: **https://aka.ms/umc-preview**.

1. In the Azure portal menu, search for **Preview features** and select it from the available options.

1. In the **Preview features** page, search for **InGuestAutoAssessmentVMPreview**.

1. Select **Virtual Machine Guest Automatic Patch Assessment Preview** from the list.

1. In the **Virtual Machine Guest Automatic Patch Assessment Preview** pane, select **Register** to register the provider with your subscription.


### [Scheduled patching](#tab/portal-scheduled-patching)

To use scheduled patching functionality for Azure VMs as well as Arc-enabled servers, your subscriptions for both machine and maintenance configurations must be allowlisted for **InGuestScheduledPatchVMPreview**.

Follow the steps below to register for preview *InGuestScheduledPatchVMPreview* feature:

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**.

1. In the Azure portal menu, search for **Preview features** and select it from the available options.

1. In the **Preview features** page, search for **InGuestScheduledPatchVMPreview** and select **Allows subscription to enable automatic VM guest patching on schedule** from the list.

1. In the **Allows subscription to enable automatic VM guest patching on schedule** pane, select **Register** to register the provider with your subscription.

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching).

---

>[!NOTE]
> This preview feature will be auto-approved.

After your register for the above feature, go to update management center (preview) portal link: **https://aka.ms/umc-preview**.


 
## Using the Azure PowerShell

The following section describes how to enable periodic assessment and scheduled patching features for your subscription using Azure PowerShell:

### [Periodic assessment](#tab/ps-periodic-assessment)

**Arc-enabled servers** - No onboarding is required to use periodic assessment feature.

**Azure VMs**
For Azure VMs, to register the resource provider, use:

```azurepowershell
Register-AzResourceProvider -FeatureName InGuestAutoAssessmentVMPreview -ProviderNamespace Microsoft.Compute
```
 
### [Scheduled patching](#tab/ps-scheduled-patching)


To register the resource provider for both Azure VMs and Arc-enabled servers, use:

```azurepowershell
Register-AzResourceProvider -FeatureName InGuestScheduledPatchVMPreview -ProviderNamespace Microsoft.Compute
```

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching).

---

>[!NOTE]
> This preview feature will be auto-approved.


 ## Using the Azure CLI

The following section describes how to enable periodic assessment and scheduled patching features in Azure for your subscription using the Azure CLI [az feature register](/cli/azure/feature#az_feature_register) command.

### [Periodic assessment](#tab/cli-periodic-assessment)

**Arc-enabled servers** - No onboarding is required for using Periodic assessment feature.
**Azure machines** - To register the resource provider, use:

```azurecli
az feature register --namespace Microsoft.Compute --name InGuestAutoAssessmentVMPreview
```

### [Scheduled patching](#tab/cli-scheduled-patching)

**Azure VMs and Arc-enabled servers** - To register a resource provider, use:

```azurecli
az feature register --namespace Microsoft.Compute --name InGuestScheduledPatchVMPreview
```
For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching).

---

>[!NOTE]
> This preview feature will be auto-approved.



## Using the Azure REST API

The following section describes how to enable periodic assessment and scheduled patching features in Azure for your subscription using the [Azure REST API](/rest/api/azure).

### [Periodic Assessment](#tab/rest-periodic-assessment)

>[!NOTE]
> This option is only applicable to Azure VMs.

To register a resource provider, use:

```rest
POST on `/subscriptions/subscriptionId/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoAssessmentVMPreview/register?api-version=2015-12-01`
```

Replace the value `subscriptionId` with the ID of the target subscription.


### [Scheduled patching](#tab/rest-scheduled-patching)

>[!NOTE]
> This option is only applicable to Azure VMs.

To register a resource provider, use:

```rest
POST on `/subscriptions/subscriptionId/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestScheduledPatchVMPreview/register?api-version=2015-12-01`
```

Replace the value `subscriptionId` with the ID of the target subscription.

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching).

---

>[!NOTE]
> This preview feature will be auto-approved.

## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update management center](manage-multiple-machines.md)
