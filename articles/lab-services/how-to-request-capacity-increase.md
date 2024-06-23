---
title: Request a core limit increase
titleSuffix: Azure Lab Services
description: Learn how to request a core limit (quota) increase to expand capacity for your labs in Azure Lab Services.
services: lab-services
ms.service: lab-services
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/06/2024
#customer intent: As an administrator and subscription owner, I want to learn how to request an increase in cores available for my subscription in order to meet my lab needs.
---

# Request a core limit increase

This article describes how you can submit a support request to increase the number of cores for Azure Lab Services in your Azure subscription. First, collect the necessary information for the request.

When you reach the cores limit for your subscription, you can request a core limit increase to continue using Azure Lab Services. An increase is sometimes called an *increase in capacity* or a *quota increase*. The request process allows the Azure Lab Services team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments.

## Prerequisites

[!INCLUDE [Create support request](./includes/lab-services-prerequisite-create-support-request.md)]

## Prepare to submit a request

Before you create a support request for a core limit increase, gather necessary information, such as the number and size of cores and the Azure regions. You might also have to do some preparation before you create the request.

## [Lab plan](#tab/Labplans/)

### Create a lab plan

To create a request for Azure Lab Services capacity, you need to have a lab plan. If you don't already have a lab plan, follow these steps to [create a lab plan](./quick-create-lab-plan-portal.md).

### Verify available capacity

Before you calculate the number of extra cores that you need, verify the capacity available in your subscription by [determining the current usage and quota](./how-to-determine-your-quota-usage.md). You can see exactly where your current capacity is used. You might discover extra capacity in an unused lab plan or lab.

### Determine the regions for your labs

Azure Lab Services resources can exist in different regions. You can choose to deploy resources in multiple regions close to the lab users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

### Determine the number of VM cores in your request

In your support request, provide the *total* number of cores. This total includes both your existing cores and the cores you want to add.

Azure Lab Services groups VM sizes together in size groups:

- Small / Medium / Large cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) cores
- Small (GPU Compute) cores
- Small GPU (Visualization) cores
- Medium GPU (Visualization) cores

You request VM cores for a specific Azure region. When you select the region in the support request, you can view your current usage and current limit per size group.

To determine the total number of cores for your request, use this equation: `total VM cores = (current # cores for the size group) + ((# cores for the selected VM size) * (# VMs))`

For example, you need more capacity for 20 *Medium* VMs. You already have the following VMs:

| VM size   | Cores per VM | # VMs | Total cores |
| --------- | -----------: | ----: | ----------: |
| Small     | 2            | 10    | 20          |
| Medium    | 4            | 20    | 80          |
| Small GPU | 6            | 5     | 30          |

The current number of cores for the Small/Medium/Large size group is `20 (Small) + 80 (Medium) = 100 cores`. You don't count the *Small GPU* cores because they're in a different size group.

The total number of VM cores for 20 more Medium VMs is `100 + (4 cores per Medium VM) * 20 = 180 cores`.

## [Lab account](#tab/LabAccounts/)

### Determine the regions for your labs

Azure Lab Services resources can exist in different regions. You can choose to deploy resources in multiple regions close to the lab users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

### Determine the number of VM cores in your request

In your support request, provide the number of *additional* VM cores. Each VM size has a number of VM cores. Azure Lab Services groups VM sizes together in size groups. You request VM cores for a specific size group.

- Small / Medium / Large cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) cores
- Small (GPU Compute) cores
- Small GPU (Visualization) cores
- Medium GPU (Visualization) cores

To determine the total number of cores for your request: `total VM cores = (# cores for the selected VM size) * (# VMs)`

For example, you need more capacity for 20 *Medium* VMs. The number of extra VM cores for 20 Medium VMs is then 80: `(4 cores per VM * 20)`.

---

## Best practices for requesting a core limit increase

[!INCLUDE [lab-services-request-capacity-best-practices](includes/lab-services-request-capacity-best-practices.md)]

## Start a new support request

You can follow these steps to request a core limit increase:  

1. In the Azure portal, navigate to your lab plan or lab account, and then select **Request core limit increase**.

    :::image type="content" source="./media/how-to-request-capacity-increase/request-from-lab-plan.png" alt-text="Screenshot of the Lab plan overview page in the Azure portal, highlighting the Request core limit increase button." lightbox="./media/how-to-request-capacity-increase/request-from-lab-plan.png":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Azure Lab Services* |

1. On the **Additional details** tab, select **Enter details** in the **Problem details** section.

    :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted." lightbox="./media/how-to-request-capacity-increase/enter-details-link.png":::

## Make core limit increase request

When you request a core limit increase, supply information to help the Azure Lab Services team evaluate and act on your request as quickly as possible. The more information you supply and the earlier you supply it, the quicker the Azure Lab Services team can process your request.

Depending on whether you use lab accounts or lab plans, you need to provide different information on the **Quota details** page.

#### [Lab plan](#tab/Labplans/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-plan-pane.png" alt-text="Screenshot of the Quota details page for Lab Services v2." lightbox="./media/how-to-request-capacity-increase/lab-plan-pane.png":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Plan*|
| **Region** | Select the region in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) where you want the extra cores. |
| **Does your virtual network reside in the same region as above?** | Select *Yes*, *No*, or *N/A*, depending on whether you use [advanced networking](./how-to-connect-peer-virtual-network.md) and have virtual networks in the region you selected. |
| **Virtual machine size** | Select the virtual machine size that you require for the new cores. |
| **Requested total core limit** | Enter the total number of cores you require. This number includes your existing cores and the number of extra cores you're requesting. To learn how to calculate the total number of cores, see [Determine the total number of cores in your request](#prepare-to-submit-a-request). |

#### [Lab account](#tab/LabAccounts/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-account-pane.png" alt-text="Screenshot of the Quota details page for Lab accounts." lightbox="./media/how-to-request-capacity-increase/lab-account-pane.png":::

| Name      | Value     |
| --------- | --------- |
| **Deployment Model** | *Lab Account (Classic)* |
| **Region** | Select one or more regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) where you want the extra cores. |
| **Alternate regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services), in case your preferred regions have no available capacity. |
| **Virtual network regions** | Select one or more alternate regions in the [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=lab-services) where you might host virtual networks for [advanced networking](./how-to-connect-peer-virtual-network.md). |
| **Virtual machine size** | Select the VM size for which you need more capacity. |
| **Requested additional core limit** | Enter the number of extra cores for your subscription. |
| **What is the lab account name?** | Select the lab account name. This option only applies if you're adding cores to an existing lab. |
| **What's the month-by-month usage plan for the requested cores?** | Enter the rate at which you want to add the extra cores, on a monthly basis. |
| **Additional details** | Provide more information to make it easier for the Azure Lab Services team to process your request. For example, you could include your preferred date for the new cores to be available or if you plan to use GPU VM sizes. |

---

After you enter the required information and details, select **Save and continue**.

## Complete the support request

To complete the support request, enter the following information:

1. Complete the remainder of the support request **Additional details** tab:

   ### Advanced diagnostic information

   | Name | Value |
   |:-----|:------|
   | **Allow collection of advanced diagnostic information** | Select yes or no. |

   ### Support method

   | Name | Value |
   |:-----|:------|
   | **Support plan** | Select your support plan. |
   | **Severity** | Select the severity of the issue. |
   | **Preferred contact method** | Select email or phone. |
   | **Your availability** | Enter your availability. |
   | **Support language** | Select your language preference. |

   ### Contact information

   | Name | Value |
   |:-----|:------|
   | **First name** | Enter your first name. |
   | **Last name** | Enter your last name. |
   | **Email** | Enter your contact email. |
   | **Additional email for notification** | Enter an email for notifications. |
   | **Phone** | Enter your contact phone number. |
   | **Country/region** | Enter your location. |
   | **Save contact changes for future support requests.** | Select the check box to save changes. |

1. Select **Next**.

1. On the **Review + create** tab, review the information, and then select **Create**.

## Related content

- For more information about capacity limits, see [Capacity limits in Azure Lab Services](capacity-limits.md).
- Learn more about the different [virtual machine sizes in the administrator's guide](./administrator-guide.md#vm-sizing).
- Learn more about the general [process for creating Azure support requests](../azure-portal/supportability/how-to-create-azure-support-request.md).
