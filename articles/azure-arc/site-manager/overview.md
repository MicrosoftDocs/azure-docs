---
title: "What is Azure Arc site manager?"
description: "Describes how you can use Azure Arc sites and site manager to monitor and manage physical resources in edge scenarios."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
# ms.subservice: site-manager
ms.topic: overview #Don't change
ms.date: 02/27/2024

#customer intent: As a <role>, I want <what> so that <why>.

---

# What is Azure Arc site manager?

Azure Arc site manager is a unified dashboard that simplifies the tasks of securing, monitoring, and governing all resources associated with your edge operations.

## Sites

A *site* is an abstract concept that helps you group together resources that are geographically colocated. Sites layer on top of Azure subscriptions and resource groups, creating a unified dashboard for viewing and managing resources.

Sites have a 1:1 relationship with resource groups and subscription. Any given site can only have one resource group or subscription, and any given resource group or subscription can only be in one site. However, resource groups within a subscription can belong to different sites. In this way, you can create a hierarchy of related sites.

## Supported resource types

Site manager provides alerts and status details for resources in a site. Currently, site manager supports the following Azure resources:

* Azure Stack HCI
* Azure Kubernetes Service (hybrid)
* Assets
* Arc VMs
* Arc for Servers

The following table describes which details are available through site manager for each resource type:

| Resource | Inventory | Connectivity status | Updates | Alerts |
| -------- | --------- | ------------------- | ------- | ------ |
| Azure Stack HCI | ![Checkmark icon - Inventory status supported for Azure Stack HCI.](./media/checkmark-green-circle.png) | ![Checkmark icon - Connectivity status supported for Azure Stack HCI.](./media/checkmark-green-circle.png) | ![Checkmark icon - Updates supported for Azure Stack HCI.](./media/checkmark-green-circle.png) (Minimum OS required: HCI 23H2) | ![Checkmark icon - Alerts supported for Azure Stack HCI.](./media/checkmark-green-circle.png) |
| Assets | ![Checkmark icon - Inventory status supported for Assets.](./media/checkmark-green-circle.png) |  |  |  |
| AKS (provisioned clusters) | ![Checkmark icon - Inventory status supported for AKS.](./media/checkmark-green-circle.png) |  |  | ![Checkmark icon - Alerts supported for AKS.](./media/checkmark-green-circle.png) |
| Arc VMs | ![Checkmark icon - Inventory status supported for Arc VMs.](./media/checkmark-green-circle.png) |  |  | ![Checkmark icon - Alerts supported for Arc VMs.](./media/checkmark-green-circle.png) |
| Arc for Servers | ![Checkmark icon - Inventory status supported for Arc for Servers.](./media/checkmark-green-circle.png) | ![Checkmark icon - Connectivity status supported for Arc for Servers.](./media/checkmark-green-circle.png) | ![Checkmark icon - Updates supported for Arc for Servers.](./media/checkmark-green-circle.png) | ![Checkmark icon - Alerts supported for Arc for Servers.](./media/checkmark-green-circle.png) |

Site manager only provides health status aggregation for the supported resource types. Resources of other types that exist in the resource group or subscription aren't managed by site manager, but will continue to function normally otherwise.

## Supported regions

Site manager supports resources that are deployed in any of the Azure regions in the United States (US), Australia (AUS), and Europe (EU).
