---
title: Troubleshoot errors when moving Azure resources to new subscription or resource group
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: tomfitz
---

# Troubleshoot moving Azure resources to new resource group or subscription

This article provides suggestions to help resolve problems when moving resources.

## Upgrade a subscription

If you actually want to upgrade your Azure subscription (such as switching from free to pay-as-you-go), you need to convert your subscription.

* To upgrade a free trial, see [Upgrade your Free Trial or Microsoft Imagine Azure subscription to Pay-As-You-Go](../billing/billing-upgrade-azure-subscription.md).
* To change a pay-as-you-go account, see [Change your Azure Pay-As-You-Go subscription to a different offer](../billing/billing-how-to-switch-azure-offer.md).

If you can't convert the subscription, [create an Azure support request](../azure-supportability/how-to-create-azure-support-request.md). Select **Subscription Management** for the issue type.

## Service limitations

Some services require additional considerations when moving resources. If you're moving the following services, make sure you check the guidance and limitations.

* [App Services](./move-limitations/app-service-move-limitations.md)
* [Azure DevOps Services](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json)
* [Classic deployment model](./move-limitations/classic-model-move-limitations.md)
* [Recovery Services](../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json)
* [Virtual Machines](./move-limitations/virtual-machines-move-limitations.md)
* [Virtual Networks](./move-limitations/virtual-network-move-limitations.md)

## Large requests

When possible, break large moves into separate move operations. Resource Manager immediately returns an error when there are more than 800 resources in a single operation. However, moving less than 800 resources may also fail by timing out.

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).
