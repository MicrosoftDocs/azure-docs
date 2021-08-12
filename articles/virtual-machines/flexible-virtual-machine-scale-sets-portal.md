---
title: Create virtual machines in a Flexible scale set using Azure portal
description: Learn how to create a virtual machine scale set in Flexible orchestration mode in the Azure portal.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Create virtual machines in a Flexible scale set using Azure portal

**Applies to:** :heavy_check_mark: Flexible scale sets

This article steps through using Azure portal to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Sign in to Azure 

Sign in to the Azure portal at https://portal.azure.com.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first register your subscription for the preview feature. Feature registration can take up to 15 minutes.

1. Log into the Azure portal at https://portal.azure.com.
1. Go to your **Subscriptions**.
1. Navigate to the details page for the subscription you would like to create a scale set in Flexible orchestration mode by selecting the name of the subscription.
1. In the menu under **Settings**, select **Preview features**.
1. Select the four orchestrator features to enable: *VMOrchestratorSingleFD*, *VMOrchestratorMultiFD*, *VMScaleSetFlexPreview*, and *SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview*.
1. Select **Register**.

Once the features have been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

1. In the menu under **Settings**, select **Resource providers**.
1. Select `Microsoft.compute`.
1. Select **Re-register**.


## Get started with Flexible orchestration mode

### Create a virtual machine scale set in Flexible orchestration mode through the Azure portal.

1. Log into the Azure portal at https://portal.azure.com.
1. In the search bar, search for and select **Virtual machine scale sets**.
1. Select **Create** on the **Virtual machine scale sets** page.
1. On the **Create a virtual machine scale set** page, view the **Orchestration** section.
1. For the **Orchestration mode**, select the **Flexible** option.
1. Set the **Fault domain count**.
1. Finish creating your scale set. See [create a scale set in the Azure portal](../virtual-machine-scale-sets/quick-create-portal.md#create-virtual-machine-scale-set) for more information on how to create a scale set.


### Next, add a virtual machine to the scale set in Flexible orchestration mode.

1. In the search bar, search for and select **Virtual machines**.
1. Select **Add** on the **Virtual machines** page.
1. In the **Basics** tab, view the **Instance details** section.
1. Add your VM to the scale set in Flexible orchestration mode by selecting the scale set in the **Availability options**. You can add the virtual machine to a scale set in the same region, zone, and resource group.
1. Go to the **Networking** tab and explicitly define your outbound connectivity.

    > [!IMPORTANT]
    > Explicitly defined outbound connectivity is required for virtual machine scale sets with flexible orchestration. Refer to [explicit outbound network connectivity](flexible-virtual-machine-scale-sets.md#explicit-network-outbound-connectivity-required) for more information.

1. Finish creating your virtual machine.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale with Azure CLI.](flexible-virtual-machine-scale-sets-cli.md)