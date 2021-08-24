---
title: Move an Azure disk pool (preview) to a different subscription
description: Learn how to move an Azure disk pool to a different subscription.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/19/2021
ms.author: rogarana
ms.subservice: disks
---

# Move a disk pool (preview) to a different subscription

Moving an Azure disk pool (preview) involves moving the disk pool itself, the disks contained in the disk pool, the disk pool's managed resource group, and all the resources contained in the managed resource group. Currently, Azure doesn't support moving multiple resource groups to another subscription at once. 

- Export the template of your existing disk pool.
- Delete the old disk pool.
- Move the Azure resources necessary to create a disk pool.
- Redeploy the disk pool.

## Export your existing disk pool template

To make the redeployment process simpler, export the template from your existing disk pool. You can use this template to redeploy the disk pool in a subscription of your choice, with the same configuration. See [this article](../azure-resource-manager/templates/export-template-portal.md#export-template-from-a-resource) to learn how to export a template from a resource.

## Delete the old disk pool

Now that you've exported the template, delete the old disk pool. Deleting the disk pool removes the disk pool resource and its managed resource group. See [this article](disks-pools-deprovision.md) for guidance on how to delete a disk pool.

## Move your disks and virtual network

Now that the disk pool is deleted, you can move the virtual network and your disks, and potentially your clients, to the subscription you want to change to. See [this article](../azure-resource-manager/management/move-resource-group-and-subscription.md) to learn how to move Azure resources to another subscription.

## Redeploy your disk pool

Once you've moved your other resources into the subscription, update the template of your old disk pool so that all the references to your disks, virtual network, subnet, and clients, all now point to their new resource URIs. Once you've done that, redeploy the template to the new subscription. To learn how to edit and deploy a template, see [this article](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template).

## Next steps

To learn how to manage your disk pool, see [Manage a disk pool](disks-pools-manage.md).