---
title: Capacity limits in Azure Lab Services
description: Learn about capacity limits (virtual machine limits) in Azure Lab Services.
ms.topic: conceptual
ms.date: 01/21/2022
---

# Capacity limits in Azure Lab Services

Azure Lab Services has default capacity limits on Azure subscriptions that adhere to Azure Compute quota limitations and to mitigate fraud. All Azure subscriptions will have an initial capacity limit, which can vary based on subscription type, number of standard compute cores, and GPU cores available inside Azure Lab Services. It restricts how many virtual machines you can create inside your lab before you need to request for a limit increase.  

If you are close to or have reached your subscription’s virtual machine cores limit, you will see messages from Azure Lab Services when you try to perform actions that create additional virtual machines. For example:

- Create a lab
- Publish a lab
- Increase lab capacity

These actions may be disabled if there no more cores that can be enabled for your subscription.

![Core limits - warning message](./media/capacity-limits/warning-message.png)

## Request a limit increase

If you reach the cores limit, you can request a limit increase to continue using Azure Lab Services. The request process is a checkpoint to ensure your subscription is not involved in any cases of fraud or unintentional, sudden large-scale deployments.

To create a support request, you must be an [Owner](/azure/role-based-access-control/built-in-roles), [Contributor](/azure/role-based-access-control/built-in-roles), or be assigned to the [Support Request Contributor](/azure/role-based-access-control/built-in-roles) role at the subscription level. For information about creating support requests in general, see how to create a [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

The admin can follow these steps to request a limit increase:  

1. Open your lab plan or lab account.
2. Click **Request limit increase** button at the top on the **Overview** page of the lab plan,
3. Follow the steps in the form to submit a support request to increase the limit.  The issue type, subscription, and quota type information will be automatically filled out for you.

    ![New support request](./media/capacity-limits/new-support-request.png)

4. Then, you will be prompted to provide more information about the limit increase. In the **Description** field, provide the following details:
    - Virtual machine size you are using for this lab. For size details, see [VM sizing](administrator-guide.md#vm-sizing).
    - Number of virtual machines you need.
    - Geography the lab will be created in.  If using the [January 2022 Update (preview)](lab-services-whats-new.md), specify the region instead.
5. Submit the support request.

Once you submit the support request, we will review the request. If necessary, we will contact you to get additional details.

## Subscriptions with default limit of zero cores

Some rare subscription types that are more commonly used for fraud can have a default limit of zero standard cores and zero GPU cores. If you are using one of these subscription types, the admin who creates your lab plan will need to request a limit increase before you can use Azure Lab Services.

## Per-customer assigned capacity

Azure Lab Services hosts lab resources, including VMs, within special Microsoft-managed Azure subscriptions that are not visible to customers.  With the [January 2022 Update (preview)](lab-services-whats-new.md), VM capacity is dedicated to each customer.  Previous to this update, VM capacity was available from a large pool shared across many customers.

Before you set up a large number of VMs across your labs, we recommend that you open a support ticket to pre-request VM capacity. Requests should include VM size, number, and region. Requesting capacity before lab creation helps us to ensure that you create your labs in a region that has a sufficient number of VM cores for the VM size that you need for your labs.

## Next steps

See the following articles:

- [Administrator Guide - VM sizing](administrator-guide.md#vm-sizing).
- [Frequently asked questions](classroom-labs-faq.yml).
