---
title: Deploy Azure Adaptive Virtual Patching
description: Learn how to create an Adaptive Shield, add eligible Linux virtual machines or a scale set, and verify the Neuron extension in the Azure portal.
author: AlishaJyoti
ms.author: alishajyoti
ms.service: azure
ms.topic: how-to
ms.date: 11/17/2026
ms.custom: template-how-to
---

# Deploy Azure Adaptive Virtual Patching

In this article, you learn how to deploy Azure Adaptive Virtual Patching by using the Azure portal. You create an Adaptive Shield, add eligible resources, and verify the automatically installed Neuron extension so that your resources can report findings and receive mitigations.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Your subscription has the `Microsoft.NetworkSecurity` resource provider and the `Microsoft.NetworkSecurity/AdaptiveVirtualPatchingPreview` preview feature registered. Register the resource provider first, and then register the preview feature. For steps, see [Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) and [Set up preview features in an Azure subscription](/azure/azure-resource-manager/management/preview-features).
- The resource you want to protect is running, has outbound network connectivity, and has a system-assigned managed identity with the required permissions.
- An **Automatic** upgrade policy for any virtual machine scale set you want to protect. Without that policy, Adaptive Shield protection doesn't work.
- An Adaptive Shield and every resource you want to protect with it must be deployed in the same region. For the region list, see [Supported regions](overview.md#supported-regions).

For other preview limitations, see [Preview limitations](overview.md#preview-limitations).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an Adaptive Shield

Create an Adaptive Shield to configure mitigation settings and select the resources to protect.

1. In the Azure portal, search for **Adaptive Virtual Patching**, and then select **Deploy Adaptive Shield**.
1. On the **Basics** tab, enter or select the following information:

   | Setting | Value |
   | --- | --- |
   | Subscription | Select your Azure subscription. |
   | Resource group | Select your resource group. |
   | Name | Enter a name for your Adaptive Shield. |
   | Region | Select a supported region that matches the resources you want to protect. |
   | Severity threshold | Select the minimum finding severity eligible for mitigation. |
   | Response strategy | Select automatic response to prioritize security through faster mitigation, or manual approval to prioritize continuity by reducing operational impact. |

   :::image type="content" source="media/deploy-adaptive-shield-portal/create-adaptive-shield.png" alt-text="Screenshot of the Basics tab for creating an Adaptive Shield." lightbox="media/deploy-adaptive-shield-portal/create-adaptive-shield.png" border="true":::

1. On the **Add resources** tab, select the resources to protect. Select **Next** to run the [resource eligibility checks](#resource-eligibility). After the checks pass, go to the next page and select **Add**.

   :::image type="content" source="media/deploy-adaptive-shield-portal/add-protected-resources.png" alt-text="Screenshot of the Add resources tab for selecting resources to protect." lightbox="media/deploy-adaptive-shield-portal/add-protected-resources.png" border="true":::

1. Optionally, add tags on the **Tags** tab.
1. Select **Review + create**, and then select **Create**.

The portal shows **Creating Adaptive Shield** while the shield is created.

### Resource eligibility

When you add resources, the portal runs four checks:

| Check | What it verifies |
| --- | --- |
| OS Prerequisites | Azure Linux or Ubuntu with kernel version 4.19 or later. |
| Status | The virtual machine is running. |
| Route and outbound configuration | The resource can reach the required service endpoints. |
| NSG and network policy | Network security group rules and network policies don't block the Neuron extension. |

:::image type="content" source="media/deploy-adaptive-shield-portal/check-resource-eligibility.png" alt-text="Screenshot of resource eligibility checks in the Azure portal." lightbox="media/deploy-adaptive-shield-portal/check-resource-eligibility.png" border="true":::

A resource that passes all four checks shows **Eligible to add**. If a check fails, the portal shows the reason next to the resource. If a check shows **Unable to verify**, the portal couldn't complete the check.

## Verify the Neuron extension

After you create the Adaptive Shield, the Azure portal automatically installs the Neuron extension on each protected resource. Installation can take up to five minutes. Verify the extension's provisioning status before you check resource reporting.

1. Open a protected virtual machine in the Azure portal.
1. Select **Extensions + applications**.
1. Confirm that the Neuron extension shows **Provisioning succeeded**.

   :::image type="content" source="media/deploy-adaptive-shield-portal/verify-neuron-extension.png" alt-text="Screenshot of the Neuron extension provisioning status." lightbox="media/deploy-adaptive-shield-portal/verify-neuron-extension.png" border="true":::

## Verify protected resource reporting

Check that the protected resource sends its first inventory report to the Adaptive Shield.

1. Open the Adaptive Shield in the Azure portal.
1. Select **Protected resources**.
1. Check the resource's status. A new resource shows **Awaiting first report** until the Neuron extension finishes installing and sends its first inventory report. After the first report, the resource shows **Reachable**, with the number of open findings.
1. If the resource doesn't leave **Awaiting first report**, select **Check reachability** at the top of the page. For further help, see [Frequently asked questions and troubleshooting](troubleshoot-adaptive-virtual-patching.md).

## Related content

After you deploy an Adaptive Shield, learn how to manage protection or resolve problems:

- [Overview of Azure Adaptive Virtual Patching](overview.md)
- [Manage Azure Adaptive Virtual Patching](manage-adaptive-shield.md)
- [Frequently asked questions and troubleshooting](troubleshoot-adaptive-virtual-patching.md)
