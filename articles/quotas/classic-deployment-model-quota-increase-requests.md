---
title: Increase a VM-family vCPU quota for the Classic deployment model
description: The Classic deployment model, now superseded by the Resource Manager model, enforces a global vCPU quota limit for VMs and virtual machine scale sets.
ms.date: 12/02/2021
ms.topic: how-to
---

# Increase a VM-family vCPU quota for the Classic deployment model

The Classic deployment model is the older generation Azure deployment model. It enforces a global vCPU quota limit for virtual machines and virtual machine scale sets. The Classic deployment model is no longer recommended, and is now superseded by the Resource Manager model.

To learn more about these two deployment models and the advantages of using Resource Manager, see [Resource Manager and classic deployment](../azure-resource-manager/management/deployment-models.md).

When a new subscription is created, a default quota of vCPUs is assigned to it. Any time a new virtual machine is deployed using the Classic deployment model, the sum of new and existing vCPU usage across all regions must not exceed the vCPU quota approved for the Classic deployment model.

You can request vCPU quota increases for the Classic deployment model in the Azure portal by using **Help + support** or **Usage + quotas**.

## Request quota increase for the Classic deployment model using Help + support

Follow the instructions below to create a vCPU quota increase request for the Classic deployment model by using **Help + support** in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), and [open a new support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

1. For **Issue type**, choose **Service and subscription limits (quotas)**.

1. Select the subscription that needs an increased quota.

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**. Then select **Next**.

   :::image type="content" source="media/resource-manager-core-quotas-request/new-per-vm-quota-request.png" alt-text="Screenshot showing a support request to increase a VM-family vCPU quota in the Azure portal.":::

1. In the **Problem details** section, select **Enter details**. For deployment model, select **Classic**, then select a location.

1. For **SKU family**, select one or more SKU families to increase.

1. Enter the new limits you would like on the subscription. When you're finished, select **Save and continue** to continue creating your support request.

1. Complete the rest of the **Additional information** screen, and then select **Next**.

1. On the **Review + create** screen, review the details that you'll send to support, and then select **Create**.

## Request quota increase for the Classic deployment model from Usage + quotas

Follow the instructions below to create a vCPU quota increase request for the Classic deployment model from **Usage + quotas** in the Azure portal.

1. From https://portal.azure.com, search for and select **Subscriptions**.

1. Select the subscription that needs an increased quota.

1. Select **Usage + quotas**.

1. In the upper right corner, select **Request increase**.

1. Follow the steps above (starting at step 4) to complete your request.

## Next steps

- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Learn about the advantages of using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md).
