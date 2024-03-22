---
title: "What is Azure Arc site manager (preview)?"
description: "Describes how you can use Azure Arc sites and site manager to monitor and manage physical and logical resources, forcused on edge scenarios."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
# ms.subservice: site-manager
ms.topic: overview #Don't change
ms.date: 03/06/2024
ms.custom: references_regions

#customer intent: As a <role>, I want <what> so that <why>.

---

# What is Azure Arc site manager (preview)?

Azure Arc site manager (preview) is a unified plane that simplifies the tasks of monitoring, governing, and providing extended functionality for all resources grouped to represent a "site" within a resource group.

## Sites

A *site* is an abstract concept that helps you group together resources that are often geographically colocated but can also be logically grouped. Arc sites layer on top of Azure resource groups or subscriptions, creating a unified dashboard for viewing and managing resources with extended site functionality.

Arc sites have a 1:1 relationship with resource groups and subscriptions. Any given site can only have one resource group and one subscription, and any given resource group or subscription can only be in one site. However, resource groups within a subscription can belong to different sites. In this way, you can create a hierarchy of related sites.

## Mapping

Resource Group <- 1:1 -> Arc site

Subscription <- 1:1 -> Arc site

Subscription <- 1:M -> Resource Group

## Supported resource types

Site manager provides alerts and status details for resources in a Arc site. Currently, site manager supports the following Azure resources:

* Azure Stack HCI
* Azure Kubernetes Service (hybrid)
* Assets
* Arc VMs
* Arc for Servers

The following table describes which details are available through site manager for each resource type:

| Resource | Inventory | Connectivity status | Updates | Alerts |
| -------- | --------- | ------------------- | ------- | ------ |
| Azure Stack HCI | ![Checkmark icon - Inventory status supported for Azure Stack HCI.](./media/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Azure Stack HCI.](./media/yes-icon.svg) | ![Checkmark icon - Updates supported for Azure Stack HCI.](./media/yes-icon.svg) (Minimum OS required: HCI 23H2) | ![Checkmark icon - Alerts supported for Azure Stack HCI.](./media/yes-icon.svg) |
| Assets | ![Checkmark icon - Inventory status supported for Assets.](./media/yes-icon.svg) |  |  |  |
| AKS (provisioned clusters) | ![Checkmark icon - Inventory status supported for AKS.](./media/yes-icon.svg) |  |  | ![Checkmark icon - Alerts supported for AKS.](./media/yes-icon.svg) |
| Arc VMs | ![Checkmark icon - Inventory status supported for Arc VMs.](./media/yes-icon.svg) |  |  | ![Checkmark icon - Alerts supported for Arc VMs.](./media/yes-icon.svg) |
| Arc for Servers | ![Checkmark icon - Inventory status supported for Arc for Servers.](./media/yes-icon.svg) | ![Checkmark icon - Connectivity status supported for Arc for Servers.](./media/yes-icon.svg) | ![Checkmark icon - Updates supported for Arc for Servers.](./media/yes-icon.svg) | ![Checkmark icon - Alerts supported for Arc for Servers.](./media/yes-icon.svg) |

Site manager only provides health status aggregation for the supported resource types. Resources of other types that exist in the resource group or subscription aren't managed by site manager, but will continue to function normally otherwise.

## Supported regions

Site manager supports resources that are deployed in any of the Azure regions in Azure Global.
