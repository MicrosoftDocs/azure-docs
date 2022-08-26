---
title:  Request a capacity increase
description: Learn how to request an increase in capacity (quota) for your labs. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/26/2022
---

<!-- As a lab administrator, I want more cores available for my subscription so that I can support more students. -->

# Request a capacity increase

If you reach the cores limit for your subscription, you can request a limit increase to continue using Azure Lab Services. The request process allows the Azure Lab Services team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

To create a support request, you must be assigned to one of the following roles at the subscription level:
 - [Owner](../role-based-access-control/built-in-roles.md)
 - [Contributor](../role-based-access-control/built-in-roles.md)
 - [Support Request Contributor](../role-based-access-control/built-in-roles.md)

For information about creating support requests in general, see how to create a [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Start a new support request

You can follow these steps to request a limit increase:  

1. In the Azure portal, in Support & Troubleshooting, select **Help + support**  
   :::image type="content" source="./media/how-to-request-capacity-increase/support-troubleshooting.png" alt-text="Screenshot of the Azure portal showing Support & troubleshooting with Help + support highlighted.":::
1. On the Help + support page, select **Create support request**.
  :::image type="content" source="./media/how-to-request-capacity-increase/create-support-request.png" alt-text="Screenshot of the Help + support page with Create support request highlighted.":::

1. On the New support request page, use the following information to complete the **Problem description**, and then select **Next**.

   |Name  |Value  |
   |---------|---------|
   |**Issue type**|Service and subscription limits (quotas)|
   |**Subscription**|The subscription you want to extend.|
   |**Quota type**|Azure Lab Services|

1. The **Recommended solution** tab isn't required for service and subscription limits (quotas) issues, so it is skipped.

1. On the Additional details tab, in the **Problem details** section, select **Enter details**.
   :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted."::: 

## Make capacity increase request

When you request an increase in capacity (sometimes called quota), you must supply some information to help the Azure Lab Services team evaluate and action your request as quickly as possible. The more information you can supply and the earlier you supply it, the more quickly the Azure Lab Services team will be able to process your request. 

The information required for Lab Services v1 and Lab Services v2 is different. Use the appropriate tab below to guide you as you complete the **Quota details**. 
#### [Lab Services v1](#tab/LabServicesV1/)

:::image type="content" source="./media/how-to-request-capacity-increase/quota-details-v1.png" alt-text="Screenshot of the Quota details page for Lab Services v1.":::

   |Name  |Value  |
   |---------|---------|
   |**Deployment Model**|Select **Lab Account (V1)**|
   |**What's the ramp-up plan (month by month usage)?**|Enter the rate at which you want to add the extra cores.|
   |**Is this for an existing lab or to create a new lab?**|Select **Existing lab** or **New lab**.|
   |**Number of VMs**|The number of new cores you're requesting.|
   |**What is the lab account name**|Enter the name of the lab where you want the extra cores.|
   |**Additional details**|Answer the questions in the additional details box. The more information you can provide here, the easier it will be for the Azure Lab Services team to process your request. For example, you could include your preferred date for the new cores to be available.   |

#### [Lab Services v2](#tab/LabServicesV2/)


:::image type="content" source="./media/how-to-request-capacity-increase/quota-details-v2.png" alt-text="Screenshot of the Quota details page for Lab Services v2.":::

   |Name  |Value  |
   |---------|---------|
   |**Deployment Model**|Select **Lab plan (v2)**|
   |**Location**|Enter the preferred location or region where you want the extra cores.|
   |**Virtual Machine Size**|Select the virtual machine size that you require for the new cores.|
   |**New total core limit**|Enter the total number of cores you require, your existing cores + the number you're requesting.|
   |**Are you flexible with other regions?**|Select the regions that you would use cores in as an alternative to your preferred location.|
   |**What is the minimum number of cores you can start with?**|Your new cores may be made available gradually. Enter the minimum number of cores you require.|
   |**What's the ramp-up plan (month by month usage)?**|Enter the rate at which you want to add the extra cores.|
   |**Is this for an existing lab or to create a new lab?**|Select **Existing lab** or **New lab**.|
   |**If you plan to use the new capacity within a custom Virtual Network, what region does your VNET reside in?**| Select the region where your VNET exists.|
   |**Can you specify the expected deployment time?**|Enter the expected deployment time.|
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
 
Your request is processed automatically and the Azure Lab Services team will contact you if they require any clarification or any more information.  

## Next steps

For more information about capacity limits, see [Capacity limits in Azure Lab Services](capacity-limits.md).