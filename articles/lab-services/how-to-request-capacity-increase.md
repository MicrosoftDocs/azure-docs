---
title:  Request capacity increase
description: Learn how to request an increase in capacity for your labs. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/04/2022
---

<!-- As a lab administrator, I want more cores available for my subscription so that I can support more students. -->

# Request a capacity increase

If you reach the cores limit for your subscription, you can request a limit increase to continue using Azure Lab Services. The request process allows the Azure Lab Services team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

To create a support request, you must be assigned to one of the following roles at the subscription level:
 - [Owner](../role-based-access-control/built-in-roles.md)
 - [Contributor](../role-based-access-control/built-in-roles.md)
 - [Support Request Contributor](../role-based-access-control/built-in-roles.md)

For information about creating support requests in general, see how to create a [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

You can follow these steps to request a limit increase:  

1. In the Azure portal, in Support & Troubleshooting, select **Help + support**  
   :::image type="content" source="./media/how-to-request-capacity-increase/support-troubleshooting.png" alt-text="Screenshot of the Azure portal showing Support & troubleshooting with Help + support highlighted.":::
1. On the Help + support page, select **Create support request**.
  :::image type="content" source="./media/how-to-request-capacity-increase/create-support-request.png" alt-text="Screenshot of the Help + support page with Create support request highlighted.":::

1. On the New support request page, use the following information to complete the **Problem description**, and then select **Next**.

   |Name  |Value  |
   |---------|---------|
   |**Summary**|A brief description of the issue.|
   |**Issue type**|Service and subscription limits (quotas)|
   |**Subscription**|The subscription you want to extend.|
   |**Quota type**|Azure Lab Services|

1. The **Recommended solution** tab isn't required for service and subscription limits (quotas) issues, so it is skipped.

1. On the Additional details tab, in the **Problem details** section, select **Enter details**.
   :::image type="content" source="./media/how-to-request-capacity-increase/enter-details-link.png" alt-text="Screenshot of the Additional details page with Enter details highlighted."::: 

1. Use the following information to complete the  **Quota details**, and then select **Save and continue**. 
 
   |Name  |Value  |
   |---------|---------|
   |**Deployment Model**|Lab plan (v2)|
   |**Location**|The location or region where you want the extra cores.|
   |**Virtual Machine Size**|The virtual machine size that you require for the new cores.|
   |**Number of VMs**|The number of new cores you're requesting.|
   |**Additional details**|Answer the questions in the additional details box. The more information you can provide here, the easier it will be for the Azure Lab Services team to process your request. |

1. Complete the remainder of the **Additional details** tab using the following information:

   **Advanced diagnostic information**

   |Name |Value |
   |---------|---------|
   |**Allow collection of advanced diagnostic information**|Select yes or no.|

   **Support method**

   |Name |Value |
   |---------|---------|
   |**Support plan**|Select your support plan.|
   |**Severity**|Select the severity of the issue.|
   |**Preferred contact method**|Select email or phone.|
   |**Your availability**|Enter your availability.|
   |**Support language**|Select your language preference.|

   **Contact information**

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

For more information about capacity limits, see [Capacity limits in Azure Lab Services](how-to-request-capacity-increase.md).