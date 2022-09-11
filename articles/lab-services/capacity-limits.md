---
title: Capacity limits in Azure Lab Services
description: Learn about VM capacity limits in Azure Lab Services.
ms.topic: conceptual
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# Capacity limits in Azure Lab Services

Azure Lab Services has default capacity limits on Azure subscriptions that adhere to Azure Compute quota limitations and to mitigate fraud. All Azure subscriptions will have an initial capacity limit, which can vary based on subscription type, number of standard compute cores, and GPU cores available inside Azure Lab Services. It restricts how many virtual machines you can create inside your lab before you need to request for a limit increase.  

If you're close to or have reached your subscription's core limit, you'll see messages from Azure Lab Services.  Actions that are affected by core limits include:

- Create a lab
- Publish a lab
- Increase lab capacity

These actions may be disabled if there no more cores that can be enabled for your subscription.

:::image type="content" source="./media/capacity-limits/warning-message.png" alt-text="Screenshot of core limit warning in Azure Lab Services.":::

> [!NOTE]
> Azure Lab Services capacity limits are set per subscription.


## Request a limit increase

If you reach the cores limit, you can request a limit increase to continue using Azure Lab Services. The request process is a checkpoint to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments.

To create a support request, you must be an [Owner](../role-based-access-control/built-in-roles.md), [Contributor](../role-based-access-control/built-in-roles.md), or be assigned to the [Support Request Contributor](../role-based-access-control/built-in-roles.md) role at the subscription level. For information about creating support requests in general, see how to create a [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

The admin can follow these steps to request a limit increase:  

1. Open your [lab plan](how-to-manage-lab-plans.md) or [lab account](how-to-manage-lab-accounts.md).
1. On the **Overview** page of the lab plan, select the **Request core limit increase** button from the menu bar at the top.
1. On the **Basics** page of **New support request** wizard, enter a short summary that will help you remember the support request in the **Summary** textbox.  The issue type, subscription, and quota type information are automatically filled out for you.  Select **Next: Solutions**.

    :::image type="content" source="./media/capacity-limits/new-support-request.png" alt-text="Screenshot of new support request to request more core capacity.":::

1. The **New support request** wizard will automatically advance from the **Solutions** page to the **Details** page.
1. One the **Details** page, enter the following information in the **Description** page.
    - VM size. For size details, see [VM sizing](administrator-guide.md#vm-sizing).
    - Number of VMs.
    - Location.  Location will be a [geography](https://azure.microsoft.com/global-infrastructure/geographies/#geographies) or region, if using the [August 2022 Update](lab-services-whats-new.md).
1. Under **Advanced diagnostic information**, select **No**.
1. Under **Support method** section, select your preferred contact method. Verify contact information is correct.
1. Select **Next: Review + create**
1. On the **Review + create** page, select **Create** to submit the support request.

Once you submit the support request, we'll review the request. If necessary, we'll contact you to get more details.

## Subscriptions with default limit of zero cores

Some rare subscription types that are more commonly used for fraud can have a default limit of zero standard cores and zero GPU cores. If you're using one of these subscription types, your admin needs to request a limit increase before you can use Azure Lab Services.

## Per-customer assigned capacity

Azure Lab Services hosts lab resources, including VMs, within special Microsoft-managed Azure subscriptions that aren't visible to customers.  With the [August 2022 Update](lab-services-whats-new.md), VM capacity is dedicated to each customer.  Previous to this update, VM capacity was available from a large pool shared by customers.

Before you set up a large number of VMs across your labs, we recommend that you open a support ticket to pre-request VM capacity. Requests should include VM size, number, and location. Requesting capacity before lab creation helps us to ensure that you create your labs in a region that has a sufficient number of VM cores for the VM size that you need for your labs.

## Next steps

See the following articles:

- [As an admin, see VM sizing](administrator-guide.md#vm-sizing).
- [Frequently asked questions](classroom-labs-faq.yml).