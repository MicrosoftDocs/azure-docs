---
title: "What is Azure Arc site manager (preview)"
description: "Describes how you can use Azure Arc sites and site manager to monitor and manage physical and logical resources, focused on edge scenarios."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
# ms.subservice: site-manager
ms.topic: overview #Don't change
ms.date: 04/18/2024
ms.custom: references_regions

---

# What is Azure Arc site manager (preview)?

Azure Arc site manager allows you to manage and monitor your on-premises environments within Azure Arc. Arc sites are scoped to an Azure resource group or subscription and enable you to track connectivity, alerts, and updates across your environment. The experience is tailored for on-premises scenarios where infrastructure is often managed within a common physical boundary, such as a store, restaurant, or factory.

> [!IMPORTANT]
> Azure Arc site manager is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported resource types

Currently, site manager supports the following Azure resources with the following capabilities:

| Resource | Inventory | Connectivity status | Updates | Alerts |
| -------- | --------- | ------------------- | ------- | ------ |
| Azure Stack HCI | ![Checkmark icon - Inventory status supported for Azure Stack HCI.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Azure Stack HCI.](./media/overview/yes-icon.svg) | ![Checkmark icon - Updates supported for Azure Stack HCI.](./media/overview/yes-icon.svg) (Minimum OS required: HCI 23H2) | ![Checkmark icon - Alerts supported for Azure Stack HCI.](./media/overview/yes-icon.svg) |
| Arc-enabled Servers | ![Checkmark icon - Inventory status supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Updates supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Alerts supported for Arc for Servers.](./media/overview/yes-icon.svg) |
| Arc-enabled VMs | ![Checkmark icon - Inventory status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Update status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Alerts supported for Arc VMs.](./media/overview/yes-icon.svg) |
| Arc-enabled Kubernetes | ![Checkmark icon - Inventory status supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) |  | ![Checkmark icon - Alerts supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) |
| Azure Kubernetes Service (AKS) hybrid | ![Checkmark icon - Inventory status supported for AKS.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for AKS.](./media/overview/yes-icon.svg) | ![Checkmark icon - Update status supported for AKS.](./media/overview/yes-icon.svg) (only provisioned clusters) | ![Checkmark icon - Alerts supported for AKS.](./media/overview/yes-icon.svg) |
| Assets | ![Checkmark icon - Inventory status supported for Assets.](./media/overview/yes-icon.svg) |  |  |  |

Site manager only provides status aggregation for the supported resource types. Site manager doesn't manage resources of other types that exist in the resource group or subscription, but those resources continue to function normally otherwise.

Site manager supports resources that exist in [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all), with a few exceptions. For the following regions, connectivity and update status aren't supported for Arc-enabled machines or Arc-enabled Kubernetes clusters:

* Brazil South
* UAE North
* South Africa North

## Set an Arc site scope

Arc sites currently have a 1:1 relationship with resource groups and subscriptions. Any given Arc site can only be associated to one resource group or subscription, and vice versa. You can create a hierarchy of sites by creating one site for a subscription and more sites for the resource groups within the subscription.

An example of a hierarchy is shown with **London** and **California** sites within the site **World**.

:::image type="content" source="./media/overview/site-nested-world.png" alt-text="Screenshot that shows Site manager with a nested site.":::

## Azure Arc site manager pricing

Site manager is free to use. For the Azure services that integrate with sites and site manager, including Azure Monitor alerts, refer to the individual service's pricing page.

## Next steps

[Quickstart: Create a site in Azure Arc site manager (preview)](./quickstart.md)
