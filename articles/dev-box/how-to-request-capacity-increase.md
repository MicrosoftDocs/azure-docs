---
title:  Request a core limit increase
description: Learn how to request a core limit (quota) increase to expand capacity for your labs in Azure Lab Services.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 08/22/2023
---

# Request a core limit increase

This article describes how to submit a support request for increasing the number of resources for Microsoft Dev Box in your Azure subscription. 

When you reach the limit for a resource in your subscription, you can request a limit increase (sometimes called a capacity increase, or a quota increase) to extend the number of resources available. The request process allows the Microsoft Dev Box team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

Learn more about the general [process for creating Azure support requests](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Prerequisites

- To create a support request, your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Support Request Contributor](/azure/role-based-access-control/built-in-roles#support-request-contributor) role at the subscription level.
- Before you create a support request for a limit increase, you need to gather additional information.

## Gather information for your request

You'll find submitting a support request for additional quota is quicker if you gather the required information before you begin the request process. 

- **Determine your current quota usage**

   For each of your subscriptions, you can check your current usage of each Deployment Environments resource type in each region. Determine your current usage by following these steps: [Determine usage and quota](./how-to-determine-your-quota-usage.md).

- **Determine the region for the additional quota**

   Dev Box resources can exist in many regions. You can choose to deploy resources in multiple regions close to your dev box users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

## Submit a new support request

Follow these steps to request a limit increase:  

1. On the Azure portal home page, select Support & troubleshooting, and then select  **Help + support**

    :::image type="content" source="./media/how-to-request-capacity-increase/submit-new-request.png" alt-text="Screenshot of the Azure portal home page, highlighting the Request core limit increase button.":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Azure Lab Services* |

1. On the **Additional details** tab, select **Enter details** in the **Problem details** section.





As you complete the **Quota details**, Azure 

### Select the quota type

The following Dev Box resources are limited by subscription. You can request an increase in the number of resources for each of these types.

- Dev box definitions
- Dev centers
- Network settings
- Pools
- Projects
- Network connections
- Dev Box general cores
- Other


 

### limit decrease


Additional info

Maybe for price decrease


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

