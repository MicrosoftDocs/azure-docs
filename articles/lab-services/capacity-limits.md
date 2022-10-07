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

To create a support request, see [Request a core limit increase](./how-to-request-capacity-increase.md).

## Subscriptions with default limit of zero cores

Some rare subscription types that are more commonly used for fraud can have a default limit of zero standard cores and zero GPU cores. If you're using one of these subscription types, your admin needs to request a limit increase before you can use Azure Lab Services.

## Per-customer assigned capacity

Azure Lab Services hosts lab resources, including VMs, within special Microsoft-managed Azure subscriptions that aren't visible to customers.  With the [August 2022 Update](lab-services-whats-new.md), VM capacity is dedicated to each customer.  Previous to this update, VM capacity was available from a large pool shared by customers.

Before you set up a large number of VMs across your labs, we recommend that you open a support ticket to pre-request VM capacity. Requests should include VM size, number, and location. Requesting capacity before lab creation helps us to ensure that you create your labs in a region that has a sufficient number of VM cores for the VM size that you need for your labs.

## Next steps

See the following articles:

- As an admin, see [VM sizing](administrator-guide.md#vm-sizing).
- As an admin, see [Request a capacity increase](./how-to-request-capacity-increase.md)
- [Frequently asked questions](classroom-labs-faq.yml).