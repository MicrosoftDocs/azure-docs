---
title: Request a quota limit increase for Dev Box resources
description: Learn how to request a quota increase to expand the number of dev box resources you can use in your subscription. Request an increase for dev box cores and other resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 01/11/2024
---

# Request a quota limit increase for Microsoft Dev Box resources

This article describes how to submit a support request to increase the number of resources for Microsoft Dev Box in your Azure subscription. 

To ensure that resources are available for customers, Microsoft Dev Box has a limit on the number of each type of resource that can be used in a subscription. This limit is called a _quota_.  

There are different types of quota limits that you might encounter, depending on the resource type. Here are some examples:

- There are limits on the number of vCPUs available for dev boxes. You might encounter this quota error in the Microsoft **[developer portal](https://aka.ms/devbox-portal)** during dev box creation.
- There are limits for dev centers, network connections, and dev box definitions. You can find information about these limits through the **Azure portal**.

When you reach the limit for a resource in your subscription, you can request a limit increase (sometimes called a capacity increase, or a quota increase) to extend the number of resources available. The request process allows the Microsoft Dev Box team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

The time it takes to increase your quota varies depending on the virtual machine size, region, and number of resources requested. You don't have to go through the process of requesting extra capacity often. To ensure you have the resources you require when you need them, you should:

- Request capacity as far in advance as possible.
- If possible, be flexible on the region where you're requesting capacity.
- Recognize that capacity remains assigned for the lifetime of a subscription. When dev box resources are deleted, the capacity remains assigned to the subscription. 
- Request extra capacity only if you need more than is already assigned to your subscription. 
- Make incremental requests for virtual machine cores rather than making large, bulk requests. Break requests for large numbers of cores into smaller requests for extra flexibility in how those requests are fulfilled.

Learn more about the general [process for creating Azure support requests](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Prerequisites

- To create a support request, your Azure account needs the [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), or [Support Request Contributor](../role-based-access-control/built-in-roles.md#support-request-contributor) role at the subscription level.
- Before you create a support request for a limit increase, you need to gather additional information.

## Gather information for your request

Submitting a support request for an increase in quota is quicker if you gather the required information before you begin the request process. 

- **Determine your current quota usage**

   For each of your subscriptions, you can check your current usage of each Deployment Environments resource type in each region. Determine your current usage by following the steps in [Determine usage and quota](./how-to-determine-your-quota-usage.md).

- **Determine the region for the additional quota**

   Dev Box resources can exist in many regions. You can choose to deploy resources in multiple regions located near to your dev box users. For more information about Azure regions, how they relate to global geographies, and which services are available in each region, see [Azure global infrastructure](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- **Choose the quota type of the additional quota**

   The following Dev Box resources are limited by subscription. You can request an increase in the number of resources for each of these types.

   - Dev box definitions
   - Dev centers
   - Network settings
   - Network connections
   - Dev Box general cores
   - Other
 
   When you want to increase the number of dev boxes available to your developers, you should request an increase in the number of Dev Box general cores. 

## Initiate a support request

Azure presents two ways to get you the right help and assist you with submitting a request for support:

- The **Support + troubleshooting** feature available on the toolbar
- The **Help + support** page available on the Azure portal menu

The **Support + troubleshooting** feature uses questions like **How can we help you?** to guide you through the process.

Both the **Support + troubleshooting** feature and the **Help + support** page help you fill out and submit a classic style support request form.

To begin the process, choose the tab that offers the input style that's appropriate for your experience, then follow the steps to request a quota limit increase. 

# [**Support + troubleshooting** (questions)](#tab/Questions/)

1. On the Azure portal home page, select the **Support + Troubleshooting** icon (question mark) on the toolbar.
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-question.png" alt-text="Screenshot showing the How can we help question view for the Support plus troubleshooting feature." lightbox="media/how-to-request-quota-increase/help-support-question.png"::: 

1. In the **How can we help you?** box, enter **quota limit**, and then select **Go**. The view updates to show the **Current selection** section.
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-quota-limit.png" alt-text="Screenshot showing the How can we help question and quota limit answer with the Current selection section." lightbox="media/how-to-request-quota-increase/help-support-quota-limit.png":::

1. In the **Which service are you having an issue with?** dropdown list, select **Service and subscription limits (quotas)**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-service-list.png" alt-text="Screenshot showing the open dropdown list for the Which service are you having an issue with field." lightbox="media/how-to-request-quota-increase/help-support-service-list.png":::

1. Confirm your choice for the **Current selection** and then select **Next**. The view updates to include an option to create a support request for quotas.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-service-list-next.png" alt-text="Screenshot showing the Service and subscription limits (quotas) item selected and the Next button highlighted." lightbox="media/how-to-request-quota-increase/help-support-service-list-next.png":::

1. In the **Service and subscription limits (quotas)** section, select **Create a support request**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-result.png" alt-text="Screenshot showing the Service and subscription limits (quotas) section and the Create a support request button highlighted." lightbox="media/how-to-request-quota-increase/help-support-result.png":::

The **New support request** page opens. Continue to the [following section](#describe-the-requested-quota-increase) to fill out the support request form.

# [**Help + support**](#tab/AzureADJoin/)

1. On the Azure portal home page, expand the Azure portal menu, and select **Help + support**.

   :::image type="content" source="./media/how-to-request-quota-increase/help-plus-support-portal.png" alt-text="Screenshot of the Azure portal menu on the home page and the Help plus support option selected." lightbox="./media/how-to-request-quota-increase/help-plus-support-portal.png":::

1. On the **Help + support** page, select **Create a support request**.

   :::image type="content" source="./media/how-to-request-quota-increase/create-support-request.png" alt-text="Screenshot of the Help plus support page and the Create a support request highlighted." lightbox="./media/how-to-request-quota-increase/create-support-request.png":::

The **New support request** page opens. Continue to the [following section](#describe-the-requested-quota-increase) to fill out the support request form.

---

## Describe the requested quota increase

Follow these steps to describe your requested quota increase and fill out the support form.

1. On the **New support request** page, on the **1. Problem description** tab, configure the following settings, and then select **Next**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-request-problem.png" alt-text="Screenshot showing the problem description tab for a new support request with the required fields highlighted." lightbox="media/how-to-request-quota-increase/help-support-request-problem.png":::

   | Setting | Value |
   |---|---|
   | **Issue type** | Select **Service and subscription limits (quotas)**. |
   | **Subscription** | Select the subscription to which the request applies. |
   | **Quota type** | Select **Microsoft Dev Box**. |

   After you select **Next**, the tool skips the **2. Recommended solution** tab and opens the **3. Additional details** tab. This tab contains four sections: **Problem details**, **Advanced diagnostic information**, **Support method**, and **Contact information**.

1. On the **3. Additional details** tab, in the **Problem details** section, select **Enter details**. The **Quota details** pane opens.
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-request-additional-details.png" alt-text="Screenshot showing the additional details tab for a new support request with the Enter details link highlighted." lightbox="media/how-to-request-quota-increase/help-support-request-enter-details.png"::: 

1. In the **Quota details** pane, configure the following settings: 
 
   | Setting | Value |
   |---|---|
   | **Region** | Select the **Region** in which you want to increase your quota. | 
   | **Quota type** | When you select a **Region**, Azure updates the view to display your current usage and current limit for all quota types. After the view updates, set the **Quota type** field to the quota that you want to increase. | 
   | **New total limit** | Enter the new total limit that you want to request. |
   | **Is it a limit decrease?** | Select **Yes** or **No**. |
   | **Additional information** | Enter any extra information about your request. |

   :::image type="content" source="media/how-to-request-quota-increase/quota-details.png" alt-text="Screenshot of the Quota details pane showing current usage and current limit for all quota types for a specific region." lightbox="media/how-to-request-quota-increase/quota-details.png":::

1. Select **Save and Continue**.

## Complete the support request

To complete the support request form, configure the remaining settings. When you're ready, review your information and submit the request.

1. On the **Additional details** tab, in the **Advanced diagnostic information** section, configure the following setting:

   | Setting | Value |
   |---|---|
   | **Allow collection of advanced diagnostic information** | Select **Yes** (Recommended) or **No**. |

    :::image type="content" source="media/how-to-request-quota-increase/request-advanced-diagnostics-info.png" alt-text="Screenshot showing the Advanced diagnostic information section for a new support request." lightbox="media/how-to-request-quota-increase/request-advanced-diagnostics-info.png"::: 

1. In the **Support method** section, configure the following settings:

   | Setting | Value |
   |---|---|
   | **Support plan** | Select your support plan. |
   | **Severity** | Select the severity of the issue. |
   | **Preferred contact method** | Select **Email** or **Phone**. |
   | **Your availability** | Enter your availability. |
   | **Support language** | Select your language preference. |

    :::image type="content" source="media/how-to-request-quota-increase/request-support-method.png" alt-text="Screenshot showing the Support method section for a new support request." lightbox="media/how-to-request-quota-increase/request-support-method.png"::: 

1. In the **Contact info** section, configure the following settings:

   | Setting | Value |
   |---|---|
   | **First name** | Enter your first name. |
   | **Last name** | Enter your last name. |
   | **Email** | Enter your contact email. |
   | **Additional email for notification** | Enter an email for notifications. |
   | **Phone** | Enter your contact phone number. |
   | **Country/region** | Enter your location. |
   | **Save contact changes for future support requests.** | Select the check box to save changes. |

    :::image type="content" source="media/how-to-request-quota-increase/request-contact-info.png" alt-text="Screenshot showing the Contact info section for a new support request and the Next button." lightbox="media/how-to-request-quota-increase/request-contact-info.png"::: 

1. Select **Next**.

1. On the **4. Review + create** tab, review your information. When you're ready to submit the request, select **Create**.

## Related content

- Check your quota usage by [determining usage and quota](./how-to-determine-your-quota-usage.md)
- Check the default quota for each resource type by subscription type with [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits)
