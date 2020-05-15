---
title: Troubleshoot move errors
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
ms.topic: conceptual
ms.date: 08/27/2019
---

# Troubleshoot moving Azure resources to new resource group or subscription

This article provides suggestions to help resolve problems when moving resources.

## Upgrade a subscription

If you actually want to upgrade your Azure subscription (such as switching from free to pay-as-you-go), you need to convert your subscription.

* To upgrade a free trial, see [Upgrade your Free Trial or Microsoft Imagine Azure subscription to Pay-As-You-Go](../../billing/billing-upgrade-azure-subscription.md).
* To change a pay-as-you-go account, see [Change your Azure Pay-As-You-Go subscription to a different offer](../../billing/billing-how-to-switch-azure-offer.md).

If you can't convert the subscription, [create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Select **Subscription Management** for the issue type.

## Service limitations

Some services require additional considerations when moving resources. If you're moving the following services, make sure you check the guidance and limitations.

* [App Services](./move-limitations/app-service-move-limitations.md)
* [Azure DevOps Services](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json)
* [Classic deployment model](./move-limitations/classic-model-move-limitations.md)
* [Networking](./move-limitations/networking-move-limitations.md)
* [Recovery Services](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json)
* [Virtual Machines](./move-limitations/virtual-machines-move-limitations.md)

## Large requests

When possible, break large moves into separate move operations. Resource Manager immediately returns an error when there are more than 800 resources in a single operation. However, moving less than 800 resources may also fail by timing out.

## Resource not in succeeded state

When you get an error message that indicates a resource can't be moved because it isn't in a succeeded state, it may actually be a dependent resource that is blocking the move. Typically, the error code is **MoveCannotProceedWithResourcesNotInSucceededState**.

If the source or target resource group contains a virtual network, the states of all dependent resources for the virtual network are checked during the move. The check includes those resources directly and indirectly dependent on the virtual network. If any of those resources are in a failed state, the move is blocked. For example, if a virtual machine that uses the virtual network has failed, the move is blocked. The move is blocked even when the virtual machine isn't one of the resources being moved and isn't in one of the resource groups for the move.

When you receive this error, you have two options. Either move your resources to a resource group that doesn't have a virtual network, or [contact support](../../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).
