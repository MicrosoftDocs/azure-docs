---
title: Enable update management center (private preview)
description: This article describes how to enable update management center (private preview) for Windows and Linux machines running on Azure or outside of Azure connected to Azure Arc-enabled servers.
ms.service: update-management-center
author: mgoedtel
ms.author: magoedte
ms.date: 08/25/2021
ms.topic: conceptual
---

# How to enable update management center (private preview)

This article describes how to enable update management center (private preview) in Azure for Windows and Linux machines running on Azure or outside of Azure connected to Azure Arc-enabled servers using one of the following methods:

* From the Azure portal
* Using Azure PowerShell
* Using the Azure CLI
* Using the Azure REST API

Enabling update management center (private preview) functionality requires registering the various feature resource providers in your Azure subscription, as detailed below. After registering for Private Preview features, you need to access Private Preview link: **https://aka.ms/umc-preview**

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your account must be a member of the Azure [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role in the subscription.

* One or more [Azure virtual machines](/azure/virtual-machines), or physical or virtual machines managed by [Arc-enabled servers](/azure/azure-arc/servers/overview).

* Ensure that you meet all [prerequisites for update management center](https://github.com/Azure/update-center-docs/Docs/overview.md#prerequisites)

## From the Azure portal

The following examples describe how to enable various update management center (private preview) features for your subscription using the Azure portal.

### [Azure VM on-demand assessment and on-demand patching](#tab/azure-vm)  

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**. No onboarding is required for Azure VM On-demand assessment and on-demand patching. 

### [Arc-enabled server on-demand assessment and on-demand patching](#tab/arc-enabled-server)

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**
1. On the Azure portal menu, search for **Preview features**. Select it from the available options.
1. On the **Preview features** page, search for **updatecenter**. Select **On-demand Azure Arc for Servers guest patching preview** from the list.
1. On the **On-demand Azure Arc for Servers guest patching preview** pane, select **Register** to register the provider with your subscription.

After the **On-demand Azure Arc for Servers guest patching preview** resource provider is registered for your subscription, you need to complete the process by re-registering the **Microsoft.HybridCompute** provider. 

1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.
1. Select the subscription you want to configure.
1. On the left menu, under **Settings**, select **Resource providers**.
1. Search for the **Microsoft.HybridCompute** provider, select it from the list of available options and then select **Re-register**. 

### [Periodic assessment for Azure VMs](#tab/azurevm)

For Arc-enabled servers, no onboarding is required for using Periodic assessment feature.
For Azure machines, your subscription needs to be allowlisted for Preview feature **InGuestAutoAssessmentVMPreview**. Follow the steps below for registering for Preview feature "InGuestAutoAssessmentVMPreview":

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**
1. On the Azure portal menu, search for **Preview features**. Select it from the available options.
1. On the **Preview features** page, search for **InGuestAutoAssessmentVMPreview**. Select **Virtual Machine Guest Automatic Patch Assessment Preview** from the list.
1. On the **Virtual Machine Guest Automatic Patch Assessment Preview** pane, select **Register** to register the provider with your subscription.

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

After registering for the above mentioned features, go to Update management center Private Preview portal link: **https://aka.ms/umc-preview**. For more details on

### [Scheduled patching for both Azure VMs and Arc-enabled servers](#tab/scheduled-patching)

For using scheduled patching functionality for Azure VMs as well as Arc-enabled servers, your subscriptions for both machine and maintenance configurations must be allowlisted for **InGuestScheduledPatchVMPreview**. Follow the steps below for resgistering for Preview feature **InGuestScheduledPatchVMPreview**:

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**
1. On the Azure portal menu, search for **Preview features**. Select it from the available options.
1. On the **Preview features** page, search for **InGuestScheduledPatchVMPreview**. Select **Allows subscription to enable automatic VM guest patching on schedule** from the list.
1. On the **Allows subscription to enable automatic VM guest patching on schedule** pane, select **Register** to register the provider with your subscription.

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching)

After registering for the above mentioned features, go to Update management center Private Preview portal link: **https://aka.ms/umc-preview**

---

## Using Azure PowerShell

The following examples describe how to enable the update management center (private preview) features for your subscription using Azure PowerShell.

### [Azure VM on-demand assessment and on-demand patching](#tab/azure-vm-assess)
1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**. No onboarding is required for Azure VM On-demand assessment and on-demand patching. 


### [Arc-enabled server on-demand assessment and on-demand patching](#tab/arc-enabled-server)

To register the resource provider, use:

```azurepowershell
Register-AzResourceProvider -FeatureName UpdateCenter -ProviderNamespace Microsoft.HybridCompute
```

Registration can take up to 15 minutes. To verify its status, run the following command:

```azurepowershell
Get-AzProviderFeature -FeatureName UpdateCenter -ProviderNamespace Microsoft.HybridCompute
```

After the feature is registered in your subscription, complete the process by re-registering the **Microsoft.HybridCompute** resource provider.

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
```

### [Scheduled patching for both Azure VMs and Arc-enabled servers](#tab/scheduled-patching)

To register the resource provider, use:

```azurepowershell
Register-AzResourceProvider -FeatureName InGuestScheduledPatchVMPreview -ProviderNamespace Microsoft.Compute
```

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching)

### [Periodic assessment for Azure VMs](#tab/periodic-assessment)

For Arc-enabled servers, no onboarding is required for using Periodic assessment feature. For Azure VMs, to register the resource provider, use:

```azurepowershell
Register-AzResourceProvider -FeatureName InGuestAutoAssessmentVMPreview -ProviderNamespace Microsoft.Compute
```

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

---

## Using the Azure CLI

The following examples describe how to enable the update management center (private preview) features in Azure for your subscription using the Azure CLI [az feature register](/cli/azure/feature#az_feature_register) command.

### [Azure VM on-demand assessment and on-demand patching](#tab/azure-vm-demand)

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**. No onboarding is required for Azure VM On-demand assessment and on-demand patching. 

### [Arc-enabled server on-demand assessment and on-demand patching](#tab/arc-enabled-server)

To register a resource provider, use:

```azurecli
az feature register --namespace Microsoft.HybridCompute --name UpdateCenter
```

Registration can take up to 15 minutes. To verify its status, run the following command:

```azurecli
az feature show --namespace Microsoft.HybridCompute --name UpdateCenter
```

After the feature is registered in your subscription, complete the process by re-registering the **Microsoft.HybridCompute** resource provider.

```azurecli
az provider register --namespace Microsoft.HybridCompute
```

### [Periodic assessment for Azure VMs](#tab/scheduled-patching)
For Arc-enabled servers, no onboarding is required for using Periodic assessment feature. For Azure machines, to register the resource provider, use:

```azurecli
az feature register --namespace Microsoft.Compute --name InGuestAutoAssessmentVMPreview
```

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

### [Scheduled patching for both Azure VMs and Arc-enabled servers](#tab/scheduled-patching)
To register a resource provider, use:

```azurecli
az feature register --namespace Microsoft.Compute --name InGuestScheduledPatchVMPreview
```

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching)


---

## Using the Azure REST API


The following examples describe how to enable the update management center (private preview) features in Azure for your subscription using the [Azure REST API](/rest/api/azure).

**Please note**: Using REST APIs is only applicable for Azure VMs

### [Azure VM on-demand assessment and on-demand patching](#tab/azure-vm-patching)

1. Sign in to the Update management center Private Preview portal link: **https://aka.ms/umc-preview**. No onboarding is required for Azure VM On-demand assessment and on-demand patching.

### [Scheduled patching for Azure VMs](#tab/scheduled-patching)

>[!NOTE]
> This option is only applicable to Azure VMs.

To register a resource provider, use:

```rest
POST on `/subscriptions/subscriptionId/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestScheduledPatchVMPreview/register?api-version=2015-12-01`
```

Replace the value `subscriptionId` with the ID of the target subscription.

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

For detailed steps to start using scheduled patching, refer to [Prerequisites for scheduled patching](scheduled-patching.md#prerequisites-for-scheduled-patching)

### [Periodic Assessment for Azure VMs](#tab/periodic-assessment)

>[!NOTE]
> This option is only applicable to Azure VMs.

To register a resource provider, use:

```rest
POST on `/subscriptions/subscriptionId/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoAssessmentVMPreview/register?api-version=2015-12-01`
```

Replace the value `subscriptionId` with the ID of the target subscription.

**Please note**: This Preview feature is currently not auto-approved. It will be approved within 1-2 business day(s).

## Next steps

* [View updates for single machine](view-updates.md) 
* [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
* [Schedule recurring updates](scheduled-patching.md)
