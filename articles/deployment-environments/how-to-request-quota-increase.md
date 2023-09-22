---
title:  Request a quota limit increase for Azure Deployment Environments resources
description: Learn how to request a quota increase to expand the number of Deployment Environments resources you can use in your subscription. 
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 08/22/2023
---

# Request a quota limit increase for Azure Deployment Environments resources

This article describes how to submit a support request for increasing the number of resources available to Azure Deployment Environments in your Azure subscription. 

When you reach the limit for a resource in your subscription, you can request a limit increase (sometimes called a capacity increase, or a quota increase) to extend the number of resources available. The request process allows the Azure Deployment Environments team to ensure that your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

The time it takes to increase your quota varies depending on the number of resources requested in which region. You won't go through the process of requesting extra capacity often, but to ensure you have the resources when you need them, you should:

- Request capacity as far in advance as possible.
- If possible, be flexible on the region where you're requesting capacity.
- Recognize that capacity remains assigned for the lifetime of a subscription. When deployment environments resources are deleted, the capacity remains assigned to the subscription. 
- Request extra capacity only if you need more than is already assigned to your subscription. 

Learn more about the general [process for creating Azure support requests](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Prerequisites

- To create a support request, your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Support Request Contributor](/azure/role-based-access-control/built-in-roles#support-request-contributor) role at the subscription level.
- Before you create a support request for a limit increase, you need to gather additional information.

## Gather information for your request

Submitting a support request for additional quota is quicker if you gather the required information before you begin the request process. 

- **Determine your current quota usage**

   For each of your subscriptions, you can check your current usage of each Deployment Environments resource type in each region. Determine your current usage by following these steps: [Determine usage and quota](./how-to-determine-your-quota-usage.md).

- **Determine the region for the additional quota**

   Deployment Environments resources can exist in many regions. You can choose to deploy resources in multiple regions close to your Deployment Environments users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- **Choose the quota type of the additional quota.**

   The following Deployment Environments resources are limited by subscription. You can request increases in the number of resources for each of these types.

   - Runtime limit per month (mins)
   - Runtime limit per deployment (mins)
   - Storage limit per environment (GBs)

## Submit a new support request

Follow these steps to request a limit increase:  

1. On the Azure portal home page, select Support & troubleshooting, and then select  **Help + support**

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
- Check the default quota for each resource type by subscription type: [Azure Deployment Environments limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-deployment-environments-limits)