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

If you reach the cores limit for your subscription, you can request a core limit increase (sometimes called an increase in capacity, or a quota increase) to continue using Azure Lab Services. The request process allows the Azure Lab Services team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

For information about creating support requests in general, see how to create a [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

### Prerequisites

To create a support request, your Azure account must have one of the following roles at the Azure subscription level:

 - [Owner](../role-based-access-control/built-in-roles.md)
 - [Contributor](../role-based-access-control/built-in-roles.md)
 - [Support Request Contributor](../role-based-access-control/built-in-roles.md)

## Prepare to submit a request

Before you begin your request for a core limit increase, you should make sure that you have all the information you need available and verify that you have the appropriate permissions. Gather information like the number and size of cores you want to add, the regions you can use, and the location of resources like your existing labs and virtual networks.  

## [Lab Account (Classic) - May 2019 version](#tab/LabAccounts/)

### Determine the regions for your labs

Azure Lab Services resources can exist in many regions. You can choose to deploy resources in multiple regions close to the lab users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

## Determine the number of VM cores in your request

In your support request, you need to provide the number of additional VM cores. Each VM size has a number of VM cores. Azure Lab Services groups VM sizes together in size groups. You request VM cores for a specific size group.

- Small / Medium / Large cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) cores
- Small (GPU Compute) cores
- Small GPU (Visualization) cores
- Medium GPU (Visualization) cores

To determine the total number of cores for your request: `total VM cores = (# cores for the selected VM size) * (# VMs)`

For example, you need more capacity for 20 *Medium* VMs. The total number of VM cores for 20 Medium VMs is 80 (4 cores per VM * 20).

## [Lab Plans - August 2022 version](#tab/Labplans/)

### Create a lab plan

To create a request for Azure Lab Services capacity, you need to have a lab plan. If you don't already have a lab plan, follow these steps to [create a lab plan](./quick-create-lab-plan-portal.md).

### Verify available capacity

Before you begin calculating the number of extra cores you require, verify the capacity available in your subscription by [determining the current usage and quota](./how-to-determine-your-quota-usage.md). You're able to see exactly where your current capacity is used, and may discover extra capacity in an unused lab plan or lab.

### Determine the number of VM cores in your request

In your support request, you need to provide the total number of cores. This total includes both your existing number of cores, and the cores you want to add.

Azure Lab Services groups VM sizes together in size groups:

- Small / Medium / Large Cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) Cores
- Small (GPU Compute) Cores
- Small GPU (Visualization) Cores
- Medium GPU (Visualization) Cores

You request VM cores for a specific Azure region. When you select the region in the support request, you can view your current usage and limit per size group.

To determine the total number of cores for your request: `total VM cores = (current # cores for the size group) + ((# cores for the selected VM size) * (# VMs))`

For example, you need more capacity for 20 *Medium* VMs. You already have the following VMs:

| VM size   | Cores per VM | # VMs | Total cores |
| --------- | -----------: | ----: | ----------: |
| Small     | 2            | 10    | 20          |
| Medium    | 4            | 20    | 80          |
| Small GPU | 6            | 5     | 30          |

The current #cores for the Small/Medium/Large size group is 20 (Small) + 80 (Medium) = 100 cores. You don't count the *Small GPU* cores because they're in a different size group.

The total number of VMs for 20 additional Medium VMs is then 100 + (4 cores per Medium VM) * 20 = 180 cores.

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

1. On the **Additional details** tab, select **Problem details** > **Enter details**.

   :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted."::: 

## Make core limit increase request

When you request core limit increase, you must supply some information to help the Azure Lab Services team evaluate and action your request as quickly as possible. The more information you can supply and the earlier you supply it, the more quickly the Azure Lab Services team is able to process your request. 

Depending on whether you use lab accounts or lab plans, you need to provide different information on the **Quota details** page.

#### [Lab Account (Classic) - May 2019 version](#tab/LabAccounts/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-account-pane.png" alt-text="Screenshot of the Quota details page for Lab accounts.":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Account (Classic)* |
| **Region** | Select one or more regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies) you would like to increase. |
| **Alternate regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies), in case your preferred regions have no available capacity. |
| **Virtual network regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies) where you might host virtual networks for [advanced networking](./how-to-connect-peer-virtual-network.md). |
| **Virtual machine size** | Select the VM size for which you need additional capacity. |
| **Requested additional core limit** | Enter the number of additional cores for your subscription. |
| **What is the lab account name?** | Only applies if you're adding cores to an existing lab. Select the lab account name. |
| **What's the month-by-month usage plan for the requested cores?** | Enter the rate at which you want to add the extra cores, on a monthly basis. |
| **Additional details** | Provide more information to make it easier for the Azure Lab Services team to process your request. For example, you could include your preferred date for the new cores to be available or if you plan to use GPU VM sizes. |

#### [Lab Plans - August 2022 version](#tab/Labplans/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-plan-pane.png" alt-text="Screenshot of the Quota details page for Lab Services v2.":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Plan*|
| **Region** | Select the region in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies) where you want the extra cores. |
| **Does your virtual network reside in the same region as above?** | Select *Yes*, *No*, or *N/A*, depending on whether you use [advanced networking](./how-to-connect-peer-virtual-network.md) and have virtual networks in the region you selected. |
| **Virtual machine size** | Select the virtual machine size that you require for the new cores. |
| **Requested total core limit** | Enter the total number of cores you require. This number includes your existing cores + the number of additional cores you're requesting. See [Determine the total number of cores in your request](#prepare-to-submit-a-request) to learn how to calculate the total number of cores. |

---

When you've entered the required information and any extra details, select **Save and continue**.

## Complete the support request

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

For more information about capacity limits, see [Capacity limits in Azure Lab Services](capacity-limits.md).
