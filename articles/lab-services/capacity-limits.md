---
title: Capacity limits
description: Learn about VM capacity limits in Azure Lab Services.
ms.topic: conceptual
ms.date: 08/28/2023
ms.custom: devdivchpfy22
---

# Capacity limits in Azure Lab Services

Azure Lab Services has default capacity limits on Azure subscriptions that adhere to Azure Compute quota limitations and to mitigate fraud. All Azure subscriptions have an initial capacity limit, which can vary based on subscription type, number of standard compute cores, and GPU cores available inside Azure Lab Services. The capacity limit restricts how many virtual machines you can create inside your lab before you need to request a limit increase.  

If you're close to, or have reached your subscription's core limit, you see warning messages from Azure Lab Services in the portal.  The core limits affect the following actions:

- Create a lab
- Publish a lab
- Increase lab capacity

These actions may be disabled if there are no more cores available for your subscription.

:::image type="content" source="./media/capacity-limits/warning-message.png" alt-text="Screenshot of core limit warning in Azure Lab Services.":::

> [!NOTE]
> Azure Lab Services capacity limits are set per subscription.

### Prerequisites

[!INCLUDE [Create support request](./includes/lab-services-prerequisite-create-support-request.md)]

## Request a limit increase

If you reach the cores limit, you can request a limit increase to continue using Azure Lab Services. The request process is a checkpoint to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments.

To create a support request, see [Request a core limit increase](./how-to-request-capacity-increase.md).

## Subscriptions with default limit of zero cores

Some rare subscription types that are more commonly used for fraud can have a default limit of zero standard cores and zero GPU cores. If you're using one of these subscription types, your admin needs to request a limit increase before you can use Azure Lab Services.

## Per-customer assigned capacity

Azure Lab Services hosts lab resources, including VMs, within special Microsoft-managed Azure subscriptions that aren't visible to customers.  With the [August 2022 Update](lab-services-whats-new.md), VM capacity is dedicated to each customer.  Previous to this update, VM capacity was available from a large pool shared by customers.

Before you set up a large number of VMs across your labs, we recommend that you open a support ticket to pre-request VM capacity. Requests should include VM size, number, and location. Requesting capacity before lab creation helps us to ensure that you create your labs in a region that has a sufficient number of VM cores for the VM size that you need for your labs.

## Azure region restrictions

Azure Lab Services enables you to create labs in different Azure regions. The default limit for the total number of regions you can use for creating labs varies by offer category type. For example, the default for Pay-As-You-Go subscriptions is two regions.

If you have reached the Azure regions limit for your subscription, you can only create labs in regions that you're already using. When you create a new lab in another region, the lab creation fails with an error message.

To overcome the Azure region restriction, you have the following options:

- [Delete all labs](./how-to-manage-labs.md#delete-a-lab) in one of the other regions to reduce the total number of regions in which you have labs.

- Contact Azure support to [request the removal of the region restriction](#request-removal-of-region-restriction) for your subscription.

- Contact Azure support to [request a limit increase](./how-to-request-capacity-increase.md). When a limit increase is granted, the region restriction is lifted for your subscription. We recommend that you request a small limit increase for any SKU to lift the restriction for your subscription.

### Request removal of region restriction

You can contact Azure support and create a support ticket to lift the region restriction from your subscription.

1. In the [Azure portal](https://portal.azure.com), go to your lab plan.
1. In the left navigation menu, select **New Support Request**.
1. On the **Problem description** tab, enter the following information, and then select **Next**.

    | Field  | Value  |
    | ------ | ------ |
    | **Summary** | Enter *Remove region restriction*. |
    | **Issue type** | *Technical* |
    | **Subscription** | Select your Azure subscription. |
    | **Service** | Select *My Services*. |
    | **Service type** | Select *Lab Services with lab plan*. |
    | **Resource** | *Select your lab plan*. |
    | **Problem type** | Select *Labs Portal (labs.azure.com)*. |
    | **Problem subtype** | Select *Problem creating a new lab*. |

    :::image type="content" source="./media/capacity-limits/support-request-region-restriction.png" alt-text="Screenshot that shows how to create an Azure support request in the Azure portal to remove the region restriction." lightbox="./media/capacity-limits/support-request-region-restriction.png":::

1. On the **Additional details** page, enter *Requesting lift of regional restrictions* in the **Description** field, and then select **Next**.

1. On the **Review + create** page, select **Create** to create the support request.

## Best practices for requesting a limit increase
[!INCLUDE [lab-services-request-capacity-best-practices](includes/lab-services-request-capacity-best-practices.md)]

## Related content

- As an admin, see [VM sizing](administrator-guide.md#vm-sizing).
- As an admin, see [Request a capacity increase](./how-to-request-capacity-increase.md)
