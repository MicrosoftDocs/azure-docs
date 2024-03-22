---
title:  Request a quota limit increase for Azure Deployment Environments resources
description: Learn how to request a quota increase to extend the number of Deployment Environments resources you can use in your subscription. 
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 12/07/2023
---

# Request a quota limit increase for Azure Deployment Environments resources

This guide explains how to submit a support request to increase the number of resources available to Azure Deployment Environments in your Azure subscription.

If your organization uses Deployment Environments extensively, you might encounter a quota limit during deployment. When you reach the limit for a resource in your subscription, you can request a limit increase (sometimes called a capacity increase or a quota increase) to extend the number of resources available. The request process allows the Azure Deployment Environments team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

To learn more about the general process for creating Azure support requests, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Prerequisites

- To create a support request, your Azure account needs the [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), or [Support Request Contributor](../role-based-access-control/built-in-roles.md#support-request-contributor) role at the subscription level.
- Before you create a support request for a limit increase, you need to gather additional information.

## Gather information for your request

Submitting a support request to increase your quota is quicker if you gather the required information before you begin the request process. 

- **Identify the quota type**

   If you reach the quota limit for a Deployment Environments resource, you see a notification indicating which quota type is affected during deployment. Take note of it and submit a request for that quota type.

   The following resources are limited by subscription: 
   - Runtime limit per month (mins)
   - Runtime limit per deployment (mins)
   - Storage limit per environment (GBs)

- **Determine the region for the quota increase**

   Deployment Environments resources can exist in many regions. For best performance, you should choose the region where your Deployment Environments project exists.

   For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

## Submit a new support request

Follow these steps to request a limit increase:  

1. Sign in to the [Azure portal](https://portal.azure.com), select Support & troubleshooting from the menu bar, and then choose **Help + support**. If this option doesn't appear, enter *Help + support* in the search bar.

    :::image type="content" source="./media/how-to-request-capacity-increase/submit-new-request.png" alt-text="Screenshot of the Azure portal home page, highlighting the Request core limit increase button." lightbox="./media/how-to-request-capacity-increase/submit-new-request.png":::

1. On the **Help + support** page, select **Create a support request**.

    :::image type="content" source="./media/how-to-request-capacity-increase/create-support-request.png" alt-text="Screenshot of the Help + support page, highlighting Create a support request." lightbox="./media/how-to-request-capacity-increase/create-support-request.png":::

1. On the **New support request** page, enter the following information, and then select **Next**.

    | Name              | Value   |
    | ----------------- | ------- |
    | **Issue type**    | *Service and subscription limits (quotas)* |
    | **Subscription**  | Select the subscription to which the request applies. |
    | **Quota type**    | *Azure Deployment Environments* |

1. On the **Additional details** tab, in the **Problem details** section, select **Enter details**.
 
    :::image type="content" source="media/how-to-request-capacity-increase/enter-details.png" alt-text="Screenshot of the New support request page, highlighting Enter details." lightbox="media/how-to-request-capacity-increase/enter-details.png"::: 

1. In **Quota details**, enter the following information, and then select **Next**.
 
    | Name              | Value   |
    | ----------------- | ------- |
    | **Quota type**    | Select the **Quota type** that you want to increase. | 
    | **Region**        | Select the **Region** in which you want to increase your quota. | 
    | **Additional quota** | Enter the additional number of minutes that you need, or GBs per environment for Storage limit increases. |
    | **Additional info** | Enter any extra information about your request. |

    :::image type="content" source="media/how-to-request-capacity-increase/quota-details.png" alt-text="Screenshot of the Quota details pane." lightbox="media/how-to-request-capacity-increase/quota-details.png":::

1. Select **Save and continue**.

## Complete the support request

To complete the support request, enter the following information:

1. Complete the remainder of the **Additional details** tab by using the following information:

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

- Check the default quota for each resource type by subscription type: [Azure Deployment Environments limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-deployment-environments-limits)