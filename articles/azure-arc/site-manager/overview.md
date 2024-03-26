---
title: "What is Azure Arc site manager (preview)"
description: "Describes how you can use Azure Arc sites and site manager to monitor and manage physical and logical resources, focused on edge scenarios."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
# ms.subservice: site-manager
ms.topic: overview #Don't change
ms.date: 03/06/2024
ms.custom: references_regions



---

# What is Azure Arc site manager (preview)?

Azure Arc site manager (preview) allows you to manage and monitor your on-premises environments within Azure Arc. Arc sites layer on top of Azure resource groups or subscriptions and enable you to track connectivity, alerts, and updates across your estate. The experience is tailored for on-premises scenarios where infrastructure is often managed within a common physical boundary, such as a store, restaurant, or factory. Site manager currently supports Arc-enabled servers, Kubernetes clusters, Azure Stack HCI machines, and more Azure Resource Manager (ARM) resources.
 
## Setting an Arc site scope

Arc sites currently have a 1:1 relationship with resource groups and subscriptions. Any given Arc site can only be associated to one resource group or subscription, and vice versa. You can create a hierarchy of sites by create one site for a subscription and more sites for the resource groups within the subscription.

An example of a hierarchy is shown with **London** and **California** sites within the site **World**.

:::image type="content" source="./media/overview/site-nested-world.png" alt-text="Screenshot that shows Site manager with a nested site.":::

## Supported resource types

Site manager provides alerts and status details for resources in an Arc site. Currently, site manager supports the following Azure resources:

* Azure Stack HCI
* Arc-enabled Servers
* Arc-enabled VMs
* Arc-enabled Kubernetes
* Azure Kubernetes Service (AKS) hybrid
* Assets

The following table describes which details are available through site manager for each resource type:

| Resource | Inventory | Connectivity status | Updates | Alerts |
| -------- | --------- | ------------------- | ------- | ------ |
| Azure Stack HCI | ![Checkmark icon - Inventory status supported for Azure Stack HCI.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Azure Stack HCI.](./media/overview/yes-icon.svg) | ![Checkmark icon - Updates supported for Azure Stack HCI.](./media/overview/yes-icon.svg) (Minimum OS required: HCI 23H2) | ![Checkmark icon - Alerts supported for Azure Stack HCI.](./media/overview/yes-icon.svg) |
| Arc-enabled Servers | ![Checkmark icon - Inventory status supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Updates supported for Arc for Servers.](./media/overview/yes-icon.svg) | ![Checkmark icon - Alerts supported for Arc for Servers.](./media/overview/yes-icon.svg) |
| Arc-enabled VMs | ![Checkmark icon - Inventory status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Update status supported for Arc VMs.](./media/overview/yes-icon.svg) | ![Checkmark icon - Alerts supported for Arc VMs.](./media/overview/yes-icon.svg) |
| Arc-enabled Kubernetes | ![Checkmark icon - Inventory status supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) |  | ![Checkmark icon - Alerts supported for Arc enabled Kubernetes.](./media/overview/yes-icon.svg) |
| Azure Kubernetes Service (AKS) hybrid | ![Checkmark icon - Inventory status supported for AKS.](./media/overview/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for AKS.](./media/overview/yes-icon.svg) | ![Checkmark icon - Update status supported for AKS.](./media/overview/yes-icon.svg) (only provisioned clusters) | ![Checkmark icon - Alerts supported for AKS.](./media/overview/yes-icon.svg) |
| Assets | ![Checkmark icon - Inventory status supported for Assets.](./media/overview/yes-icon.svg) |  |  |  |



Site manager only provides health status aggregation for the supported resource types. Resources of other types that exist in the resource group or subscription aren't managed by site manager, but will continue to function normally otherwise.

## Supported regions

Site manager supports resources that are deployed in any of the Azure regions in Azure Global.

## Arc site suggested state

The suggested state for Azure Arc site manager managed sites is to have the status of the site kept at **green** indicating there are no issues or pending actions. An example of this status is shown.

:::image type="content" source="./media/overview/site-suggested-state.png" alt-text="Screenshot that shows Site manager green and suggested state.":::

## What does it cost to use Azure Arc site manager?
Site manager doesn't have any fee, so feel free to create and use as many sites as desired. However, the Azure services that integrated with sites and site manager might have a fee. Additionally, alerts used with site manager via monitor might have fees as well.