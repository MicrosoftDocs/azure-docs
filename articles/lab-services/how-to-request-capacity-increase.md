---
title:  Request a core limit increase
description: Learn how to request a core limit (quota) increase to expand capacity for your labs. 
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 10/06/2022
---

<!-- As a lab administrator, I want more VM cores available for my subscription so that I can support more students. -->

# Request a core limit increase
If you reach the cores limit for your subscription, you can request a core limit increase (sometimes called an increase in capacity, or a quota increase) to continue using Azure Lab Services. The request process allows the Azure Lab Services team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

For information about creating support requests in general, see how to create a [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
## Prepare to submit a request
Before you begin your request for a core limit increase, you should make sure that you have all the information you need available and verify that you have the appropriate permissions. Gather information like the number and size of cores you want to add, the regions you can use, and the location of resources like your existing labs and virtual networks.  

### Permissions
To create a support request, you must be assigned to one of the following roles at the subscription level:
 - [Owner](../role-based-access-control/built-in-roles.md)
 - [Contributor](../role-based-access-control/built-in-roles.md)
 - [Support Request Contributor](../role-based-access-control/built-in-roles.md)


### Verify available capacity
Before you begin calculating the number of extra cores you require, verify the capacity available in your subscription by [determining the current usage and quota](./how-to-determine-your-quota-usage.md). You'll be able to see exactly where your current capacity is used, and may discover extra capacity in an unused lab plan or lab.
### Determine the regions for your labs
Azure Lab Services resources can exist in many regions. You can choose to deploy resources in multiple regions close to your students. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

### Determine the total number of cores in your request

Your cores can be divided amongst virtual machines (VMs) of different sizes. You must calculate the total number of cores for each size. You must include the number of cores you already have, and the number of cores you want to add to determine the total number of cores. You must then map the total number of cores you want to the SKU size groups listed below.

**Size groups**

Azure Lab Services groups SKU sizes as follows:
- Small / Medium / Large Cores
- Medium (Nested Virtualization) / Large (Nested Virtualization) Cores
- Small (GPU Compute) Cores
- Small GPU (Visualization) Cores
- Medium GPU (Visualization) Cores

To determine the total number of cores for your request, you must:
1. Select the VM sizes you want
2. Calculate the total cores needed for each VM size
3. Map to SKU group and sum all cores under each group
4. Enter the resulting total number of cores for each group in your request

As an example, suppose you have existing VMs, and want to request more as shown in the following table:

| Size |	Existing VMs |	Additional VMs required	| Total VMs |
|-----|-----|-----|-----|
|Small|15|25|40|
|Large|1|2|3|
|Large Virtualization|0|1|1|

1. **Select the VM sizes you want.** In the virtual machine size list, select each of the VM sizes you want to use:
 
    :::image type="content" source="./media/how-to-request-capacity-increase/multiple-sku.png" alt-text="Screenshot showing the core increase request with multiple virtual machine sizes selected.":::
 
2. **Next calculate the total cores needed for each VM size.**
Using the figures in the table above and the number of cores for each size in the dropdown, you can calculate the total number of cores as shown:
    - *Small:* 40 small VMs x 2 cores = 80 cores
    - *Large:* 3 large VMs x 8 cores = 24 cores
    - *Large (Nested Virtualization):* 1 large nested virtualization VM x 8 cores = 8 cores 

3. **Map your cores to the SKU group and sum all the cores under each group.**
Calculate the total number of cores for each size group.  

    The 40 small VMs and 3 large VMs are grouped together:
    Requested total core limit for Small / Medium / Large =  80 + 24 = 104 cores

    The large nested virtualization VM is grouped separately:
    Requested total core limit for Medium (Nested Virtualization) / Large (Nested Virtualization) = 8 cores

4. **Enter the resulting total number of cores for each group in your request.**
 
     :::image type="content" source="./media/how-to-request-capacity-increase/total-cores-grouped.png" alt-text="Screenshot showing the total number of cores in each group.":::
 
Remember that the total number of cores is the existing cores and the new cores you're requesting.

## Best practices for requesting a core limit increase

[!INCLUDE [lab-services-request-capacity-best-practices](includes/lab-services-request-capacity-best-practices.md)]


## Start a new support request
You can follow these steps to request a core limit increase:  

1. In the Azure portal, navigate to your lab plan or lab account, and then select **Create support request**.
  :::image type="content" source="./media/how-to-request-capacity-increase/request-from-lab-plan.png" alt-text="Screenshot of the Help + support page with Create support request highlighted.":::

1. On the New support request page, use the following information to complete the **Problem description**, and then select **Next**.

   |Name  |Value  |
   |---------|---------|
   |**Issue type**|Service and subscription limits (quotas)|
   |**Subscription**|The subscription you want to extend.|
   |**Quota type**|Azure Lab Services|

1. The **Recommended solution** tab isn't required for service and subscription limits (quotas) issues, so it is skipped.

1. On the Additional details tab, in the **Problem details** section, select **Enter details**.
   :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted."::: 

## Make core limit increase request
When you request core limit increase, you must supply some information to help the Azure Lab Services team evaluate and action your request as quickly as possible. The more information you can supply and the earlier you supply it, the more quickly the Azure Lab Services team will be able to process your request. 

You need to specify different information depending on the version of Azure Lab Services you're using. The information required for the lab accounts used in original version of Lab Services (May 2019) and the lab plans used in the updated version of Lab Services (August 2022) is detailed on the tabs below. Use the appropriate tab to guide you as you complete the **Quota details** for your lab account or lab plan. 
#### [**Lab Account (Classic) - May 2019 version**](#tab/LabAccounts/)

:::image type="content" source="./media/how-to-request-capacity-increase/lab-account-pane.png" alt-text="Screenshot of the Quota details page for Lab accounts.":::

   |Name  |Value  |
   |---------|---------|
   |**Deployment Model**|Select **Lab Account (Classic)**|
   |**Requested total core limit**|Enter the total number of cores for your subscription. Add the number of existing cores to the number of cores you're requesting.|
   |**Region**|Select the regions that you would like to use. |
   |**Is this for an existing lab or to create a new lab?**|Select **Existing lab** or **New lab**.|
   |**What is the lab account name?**|Only applies if you're adding cores to an existing lab. Select the lab account name.|
   |**What's the month-by-month usage plan for the requested cores?**|Enter the rate at which you want to add the extra cores, on a monthly basis.|
   |**Additional details**|Answer the questions in the additional details box. The more information you can provide here, the easier it will be for the Azure Lab Services team to process your request. For example, you could include your preferred date for the new cores to be available.   |

#### [**Lab Plans - August 2022 version**](#tab/Labplans/)


:::image type="content" source="./media/how-to-request-capacity-increase/lab-plan-pane.png" alt-text="Screenshot of the Quota details page for Lab Services v2.":::

   |Name  |Value  |
   |---------|---------|
   |**Deployment Model**|Select **Lab Plan**|
   |**What is the ideal date to have this by?**|It's best to request a core limit increase well before you need the new cores. Use this option to specify when the new cores are required.|
   |**Region**|Enter the preferred location or region where you want the extra cores.|
   |**Alternate regions**|If you're flexible with the location of your cores, you can select alternate regions.|
   |**If you plan to use the new capacity with advanced networking, what region does your virtual network reside in?**|If your lab plan uses advanced networking, you must specify the region your virtual network resides in.|
   |**Virtual machine size**|Select the virtual machine size(s) that you require for the new cores.|
   |**Requested total core limit**|Enter the total number of cores you require; your existing cores + the number you're requesting. See [Determine the total number of cores in your request](#determine-the-total-number-of-cores-in-your-request) to learn how to calculate the total number of cores for each size group.|
   |**Is this for an existing lab or to create a new lab?**|Select **Existing lab** or **New lab**.|
   |**What is the lab account name?**|Only applies if you're adding cores to an existing lab. Select the lab account name.|
   |**What is the month-by-month usage plan for the requested cores?**|Enter the rate at which you want to add the extra cores, on a monthly basis.|
   |**Additional details**|Answer the questions in the additional details box. The more information you can provide here, the easier it will be for the Azure Lab Services team to process your request. |

---

When you've entered the required information and any additional details, select **Save and continue**.

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
