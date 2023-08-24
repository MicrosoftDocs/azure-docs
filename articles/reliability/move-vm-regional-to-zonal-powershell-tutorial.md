---
title: Move Azure Single Instance Virtual Machines from regional to zonal availability zones using PowerShell
description: Learn how to move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region using PowerShell.
author: ankitaduttaMSFT
ms.service: reliability
ms.subservice: availability-zones
ms.topic: tutorial
ms.date: 08/10/2023
ms.author: ankitadutta
---

# Move Azure virtual single instance machines from regional to zonal availability zones using PowerShell

This article explains how to move Azure resources to a different Azure region, using PowerShell in [Azure Resource Mover](overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Move Azure resources to a different Azure region

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options.

## Prerequisites

Verify the following requirements:

| Requirement | Description |
| --- | --- |
| **Subscription permissions** | Check you have *Owner* access on the subscription containing the resources that you want to move<br/><br/> **Why do I need Owner access?** The first time you add a resource for a  specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles. |
| **Resource Mover support** | [Review](common-questions.md) supported regions and other common questions.|
| **VM support** |  Check that any VMs you want to move are supported.<br/><br/> - [Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.<br/><br/> - [Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.<br/><br/> - Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.|
| **SQL support** | If you want to move SQL resources, review the [SQL requirements list](tutorial-move-region-sql.md#check-sql-requirements).|
| **Destination subscription** | The subscription in the destination region needs enough quota to create the resources you're moving in the target region. If it doesn't have a quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).|
| **Destination region charges** | Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you. |

## Next steps