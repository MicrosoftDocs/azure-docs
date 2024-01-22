---
title:  Request a core limit increase
titleSuffix: Azure Lab Services
description: Learn how to request a core limit (quota) increase to expand capacity for your labs in Azure Lab Services.
services: lab-services
ms.service: lab-services
ms.topic: how-to
ms.author: nicktrog
author: ntrogh
ms.date: 03/03/2023
---

<!-- As a lab administrator, I want more VM cores available for my subscription so that I can support more students. -->

# Request a core limit increase

This article describes how to collect the information and how to submit a support request for increasing the number of cores for Azure Lab Services in your Azure subscription.

When you reach the cores limit for your subscription, you can request a core limit increase (sometimes called an increase in capacity, or a quota increase) to continue using Azure Lab Services. The request process allows the Azure Lab Services team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

### Prerequisites

[!INCLUDE [Create support request](./includes/lab-services-prerequisite-create-support-request.md)]

## Prepare to submit a request

Before you create a support request for a core limit increase, you need to gather additional information, such as the number and size of cores and the Azure regions. You might also have to perform some preparation steps before creating the request.

## [Lab plan](#tab/Labplans/)

### Create a lab plan

To create a request for Azure Lab Services capacity, you need to have a lab plan. If you don't already have a lab plan, follow these steps to [create a lab plan](./quick-create-lab-plan-portal.md).

### Verify available capacity

Before you begin calculating the number of extra cores you require, verify the capacity available in your subscription by [determining the current usage and quota](./how-to-determine-your-quota-usage.md). You're able to see exactly where your current capacity is used, and might discover extra capacity in an unused lab plan or lab.

### Determine the regions for your labs

Azure Lab Services resources can exist in many regions. You can choose to deploy resources in multiple regions close to the lab users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

### Determine the number of VM cores in your request

In your support request, you need to provide the *total* number of cores. This total includes both your existing number of cores, and the cores you want to add.

Azure Lab Services groups VM sizes together in size groups:

- Small / Medium / Large cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) cores
- Small (GPU Compute) cores
- Small GPU (Visualization) cores
- Medium GPU (Visualization) cores

You request VM cores for a specific Azure region. When you select the region in the support request, you can view your current usage and current limit per size group.

To determine the total number of cores for your request: `total VM cores = (current # cores for the size group) + ((# cores for the selected VM size) * (# VMs))`

For example, you need more capacity for 20 *Medium* VMs. You already have the following VMs:

| VM size   | Cores per VM | # VMs | Total cores |
| --------- | -----------: | ----: | ----------: |
| Small     | 2            | 10    | 20          |
| Medium    | 4            | 20    | 80          |
| Small GPU | 6            | 5     | 30          |

The current #cores for the Small/Medium/Large size group is 20 (Small) + 80 (Medium) = 100 cores. You don't count the *Small GPU* cores because they're in a different size group.

The total number of VM cores for 20 additional Medium VMs is then 100 + (4 cores per Medium VM) * 20 = 180 cores.

## [Lab account](#tab/LabAccounts/)

### Determine the regions for your labs

Azure Lab Services resources can exist in many regions. You can choose to deploy resources in multiple regions close to the lab users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

### Determine the number of VM cores in your request

In your support request, you need to provide the number of *additional* VM cores. Each VM size has a number of VM cores. Azure Lab Services groups VM sizes together in size groups. You request VM cores for a specific size group.

- Small / Medium / Large cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) cores
- Small (GPU Compute) cores
- Small GPU (Visualization) cores
- Medium GPU (Visualization) cores

To determine the total number of cores for your request: `total VM cores = (# cores for the selected VM size) * (# VMs)`

For example, you need more capacity for 20 *Medium* VMs. The number of additional VM cores for 20 Medium VMs is then 80 (4 cores per VM * 20).

---

## Best practices for requesting a core limit increase

[!INCLUDE [lab-services-request-capacity-best-practices](includes/lab-services-request-capacity-best-practices.md)]

## Start a new support request

You can follow these steps to request a core limit increase:  

1. In the Azure portal, navigate to your lab plan or lab account, and then select **Request core limit increase**.

    :::image type="content" source="./media/how-to-request-capacity-increase/request-from-lab-plan.png" alt-text="Screenshot of the Lab plan overview page in the Azure portal, highlighting the Request core limit increase button.":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Azure Lab Services* |

1. On the **Additional details** tab, select **Enter details** in the **Problem details** section.

    :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted."::: 

## Make core limit increase request

When you request core limit increase, you must supply some information to help the Azure Lab Services team evaluate and action your request as quickly as possible. The more information you can supply and the earlier you supply it, the more quickly the Azure Lab Services team is able to process your request. 

Depending on whether you use lab accounts or lab plans, you need to provide different information on the **Quota details** page.

#### [Lab plan](#tab/Labplans/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-plan-pane.png" alt-text="Screenshot of the Quota details page for Lab Services v2.":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Plan*|
| **Region** | Select the region in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) where you want the extra cores. |
| **Does your virtual network reside in the same region as above?** | Select *Yes*, *No*, or *N/A*, depending on whether you use [advanced networking](./how-to-connect-peer-virtual-network.md) and have virtual networks in the region you selected. |
| **Virtual machine size** | Select the virtual machine size that you require for the new cores. |
| **Requested total core limit** | Enter the total number of cores you require. This number includes your existing cores + the number of extra cores you're requesting. See [Determine the total number of cores in your request](#prepare-to-submit-a-request) to learn how to calculate the total number of cores. |

## [Lab account](#tab/LabAccounts/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-account-pane.png" alt-text="Screenshot of the Quota details page for Lab accounts.":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Account (Classic)* |
| **Region** | Select one or more regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) you would like to increase. |
| **Alternate regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services), in case your preferred regions have no available capacity. |
| **Virtual network regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) where you might host virtual networks for [advanced networking](./how-to-connect-peer-virtual-network.md). |
| **Virtual machine size** | Select the VM size for which you need additional capacity. |
| **Requested additional core limit** | Enter the number of additional cores for your subscription. |
| **What is the lab account name?** | Only applies if you're adding cores to an existing lab. Select the lab account name. |
| **What's the month-by-month usage plan for the requested cores?** | Enter the rate at which you want to add the extra cores, on a monthly basis. |
| **Additional details** | Provide more information to make it easier for the Azure Lab Services team to process your request. For example, you could include your preferred date for the new cores to be available or if you plan to use GPU VM sizes. |

---

When you've entered the required information and any extra details, select **Save and continue**.

## Complete the support request

To complete the support request, enter the following information:

1. Complete the remainder of the support request **Additional details** tab using the following information:

   ### Advanced diagnostic information

   |Name |Value |
   |---------|---------|
   |**Allow collection of advanced diagnostic information**|Select yes or no.|

   ### Support method

   |Name |Value |
   |---------|---------|
   |**Support plan**|Select your support plan.|
   |**Severity**|Select the severity of the issue.|
   |**Preferred contact method**|Select email or phone.|
   |**Your availability**|Enter your availability.|
   |**Support language**|Select your language preference.|

   ### Contact information

   |Name |Value |
   |---------|---------|
   |**First name**|Enter your first name.|
   |**Last name**|Enter your last name.|
   |**Email**|Enter your contact email.|
   |**Additional email for notification**|Enter an email for notifications.|
   |**Phone**|Enter your contact phone number.|
   |**Country/region**|Enter your location.|
   |**Save contact changes for future support requests.**|Select the check box to save changes.|

1. Select **Next**.

1. On the **Review + create** tab, review the information, and then select **Create**.
 
## Next steps

- For more information about capacity limits, see [Capacity limits in Azure Lab Services](capacity-limits.md).

- Learn more about the different [virtual machine sizes in the administrator's guide](./administrator-guide.md#vm-sizing).

- Learn more about the general [process for creating Azure support requests](/azure/azure-portal/supportability/how-to-create-azure-support-request).
