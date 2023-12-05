---
title:  Request a quota limit increase for Dev Box resources
description: Learn how to request a quota increase to expand the number of dev box resources you can use in your subscription. Request an increase for dev box cores and other resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 08/22/2023
---

# Request a quota limit increase for Microsoft Dev Box resources

This article describes how to submit a support request for increasing the number of resources for Microsoft Dev Box in your Azure subscription. 

To ensure that resources are available for customers, Microsoft Dev Box has a limit on the number of each type of resource that can be used in a subscription. This limit is called a quota.  

There are different types of quota limits that you might encounter, depending on the resource type. For example:

**Developer portal** 

Dev Box vCPU - you might encounter this quota error in the [developer portal](https://aka.ms/devbox-portal) during dev box creation.

**Azure portal**  

- Dev Centers
- Network connections 
- Projects 
- Pools 
- Dev Box Definitions 

When you reach the limit for a resource in your subscription, you can request a limit increase (sometimes called a capacity increase, or a quota increase) to extend the number of resources available. The request process allows the Microsoft Dev Box team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

The time it takes to increase your quota varies depending on the VM size, region, and number of resources requested.  You won't have to go through the process of requesting extra capacity often. To ensure you have the resources you require when you need them, you should:

- Request capacity as far in advance as possible.
- If possible, be flexible on the region where you're requesting capacity.
- Recognize that capacity remains assigned for the lifetime of a subscription. When dev box resources are deleted, the capacity remains assigned to the subscription. 
- Request extra capacity only if you need more than is already assigned to your subscription. 
- Make incremental requests for VM cores rather than making large, bulk requests. Break requests for large numbers of cores into smaller requests for extra flexibility in how those requests are fulfilled.

Learn more about the general [process for creating Azure support requests](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Prerequisites

- To create a support request, your Azure account needs the [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), or [Support Request Contributor](../role-based-access-control/built-in-roles.md#support-request-contributor) role at the subscription level.
- Before you create a support request for a limit increase, you need to gather additional information.

## Gather information for your request

Submitting a support request for an increase in quota is quicker if you gather the required information before you begin the request process. 

- **Determine your current quota usage**

   For each of your subscriptions, you can check your current usage of each Deployment Environments resource type in each region. Determine your current usage by following these steps: [Determine usage and quota](./how-to-determine-your-quota-usage.md).

- **Determine the region for the additional quota**

   Dev Box resources can exist in many regions. You can choose to deploy resources in multiple regions close to your dev box users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- **Choose the quota type of the additional quota.**

   The following Dev Box resources are limited by subscription. You can request an increase in the number of resources for each of these types.

   - Dev box definitions
   - Dev centers
   - Network settings
   - Pools
   - Projects
   - Network connections
   - Dev Box general cores
   - Other
 
   When you want to increase the number of dev boxes available to your developers, you should request an increase in the number of Dev Box general cores. 

## Submit a new support request

Start the process of requesting a limit increase by opening **Support + troubleshooting** from the right of the toolbar.

:::image type="content" source="media/how-to-request-quota-increase/help-support-toolbar.png" alt-text="Screenshot of the Azure portal showing the Support and troubleshoot button.":::

Azure presents two different ways to get you the right help and support. When **Support + troubleshooting** opens, you see either:
- A question asking **How can we help you?**
- A classic style support request form

From the following tabs, select the style appropriate for your experience and use the steps to request a limit increase:  

#### [Question style](#tab/Questions/)

1. On the Azure portal home page, select Support & troubleshooting from the top right.
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-question.png" alt-text="Screenshot showing the How can we help you question." lightbox="media/how-to-request-quota-increase/help-support-question.png"::: 
 
1. In the **How can we help you?** box, enter *quota limit*, and then select **Go**.
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-quota-limit.png" alt-text="Screenshot showing the How can we help you question and quota limit answer." lightbox="media/how-to-request-quota-increase/help-support-quota-limit.png":::

1. From the **Which service are you having an issue with?** list, select **Service and subscription limits (quotas)**, and then select **Next**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-service-list.png" alt-text="Screenshot showing the Service and subscription limits (quotas) item." lightbox="media/how-to-request-quota-increase/help-support-service-list.png":::

1. In the Service and subscription limits (quotas) section, select **Create a support request**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-result.png" alt-text="Screenshot showing the Create a support request button." lightbox="media/how-to-request-quota-increase/help-support-result.png":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Microsoft Dev Box* |

1. On the **Additional details** tab, in the **Problem details** section, select **Enter details**.
 
    :::image type="content" source="media/how-to-request-quota-increase/enter-details.png" alt-text="Screenshot of the New support request page, highlighting Enter details." lightbox="media/how-to-request-quota-increase/enter-details.png"::: 

1. In **Quota details**, enter the following information, and then select **Next**.
 
    | Name              | Value   |
    | ----------------- | ------- |
    | **Region**        | Select the **Region** in which you want to increase your quota. | 
    | **Quota type**    | When you select a Region, Azure displays your current usage and your current for all quota types. </br> Select the **Quota type** that you want to increase. | 
    | **New total limit** | Enter the new total limit that you want to request. |
    | **Is it a limit decrease?** | Select **Yes** or **No**. |
    | **Additional information** | Enter any extra information about your request. |

    :::image type="content" source="media/how-to-request-quota-increase/quota-details.png" alt-text="Screenshot of the Quota details pane." lightbox="media/how-to-request-quota-increase/quota-details.png":::

1. Select **Save and continue**.

#### [Classic style](#tab/AzureADJoin/)

1. On the Azure portal home page, select Support & troubleshooting from the top right, and then select  **Help + support**.

    :::image type="content" source="./media/how-to-request-quota-increase/submit-new-request.png" alt-text="Screenshot of the Azure portal home page, highlighting the Request core limit increase button." lightbox="./media/how-to-request-quota-increase/submit-new-request.png":::

1. On the **Help + support** page, select **Create a support request**.

    :::image type="content" source="./media/how-to-request-quota-increase/create-support-request.png" alt-text="Screenshot of the Help + support page, highlighting Create a support request." lightbox="./media/how-to-request-quota-increase/create-support-request.png":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Microsoft Dev Box* |

1. On the **Additional details** tab, in the **Problem details** section, select **Enter details**.
 
    :::image type="content" source="media/how-to-request-quota-increase/enter-details.png" alt-text="Screenshot of the New support request page, highlighting Enter details." lightbox="media/how-to-request-quota-increase/enter-details.png"::: 

1. In **Quota details**, enter the following information, and then select **Next**.
 
    | Name              | Value   |
    | ----------------- | ------- |
    | **Region**        | Select the **Region** in which you want to increase your quota. | 
    | **Quota type**    | When you select a Region, Azure displays your current usage and your current for all quota types. </br> Select the **Quota type** that you want to increase. | 
    | **New total limit** | Enter the new total limit that you want to request. |
    | **Is it a limit decrease?** | Select **Yes** or **No**. |
    | **Additional information** | Enter any extra information about your request. |

    :::image type="content" source="media/how-to-request-quota-increase/quota-details.png" alt-text="Screenshot of the Quota details pane." lightbox="media/how-to-request-quota-increase/quota-details.png":::

1. Select **Save and continue**.

---

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

## Related content

- To learn how to check your quota usage, see [Determine usage and quota](./how-to-determine-your-quota-usage.md).
- Check the default quota for each resource type by subscription type: [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits)
