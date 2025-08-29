---
title: Request Quota Limit Increase for Dev Box Resources
description: Extend the number of dev box resources you can use in your subscription by requesting a quota increase of dev box cores, dev centers, and other types of resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 08/28/2025

#customer intent: As a platform engineer, I want to understand how to request a quota increase for Dev Box resources so that I can expand the number of resources available in my subscriptions.
---

# Manage quota for Microsoft Dev Box resources

This article describes how to determine your quota limits and usage. You can follow the instructions to submit a support request to increase the number of resources for Microsoft Dev Box in your Azure subscription. 

To ensure resources are available for customers, Microsoft Dev Box has a limit or _quota_ on the number of each type of resource that can be used in a subscription. There are different types of quotas related to Dev Box that you might see in the Developer portal and Azure portal. Quota types include quota for Dev Box vCPU for box creation, and resource limits for Dev Centers, network connections, and Dev Box Definitions.

Here are some examples of quota limits you might encounter:

- There are limits on the number of vCPUs available for dev boxes. You might encounter this quota error in the Developer portal during dev box creation. For example, if dev box users encounter a vCPU quota error such as *QuotaExceeded* during dev box creation there might be a need to increase this quota.

- There are default subscription limits for dev centers, network connections, and dev box definitions. For more information, see [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits).

When you reach the limit for a resource in your subscription, you can request an increase to extend the number of resources available. The request process allows the Microsoft Dev Box team to ensure your subscription isn't involved in any cases of fraud or unintentional, sudden large-scale deployments. 

## Prerequisites

To create a support request, your Azure account must have one or more of the following roles with permissions at the subscription level:

- [Owner](../role-based-access-control/built-in-roles.md#owner)
- [Contributor](../role-based-access-control/built-in-roles.md#contributor)
- [Support Request Contributor](../role-based-access-control/built-in-roles.md#support-request-contributor) 

## Determine resource usage and quota for Dev Box through QMS  

To help you understand where and how you're using your quota, the Quota Management System (QMS) provides a detailed report of resource usage across resource types in each of your subscriptions on the **My Quotas** page. QMS provides several advantages to the Dev Box service including:

- Improved user experience for an easier requesting process
- Expedited approvals via automation based on thresholds
- Metrics to monitor quota usage in existing subscription

Understanding quota limits that affect your Dev Box resources helps you plan for future use. You can check the [default subscription limit](/azure/azure-resource-manager/management/azure-subscription-service-limits?branch=main#microsoft-dev-box-limits) for each resource, view your current usage, and determine how much quota remains in each region. By monitoring the rate at which your quota is used, you can plan and prepare to request a quota limit increase before you reach the quota limit for the resource. 

## Request quota increase through QMS

Follow these steps to request a quota increase through QMS in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to the subscription you want to examine.

1. In the Azure portal search bar, enter *quota*, and select **Quotas** from the results.

1. On the **Quotas** page, select **Dev Box**:
 
   :::image type="content" source="media/how-to-request-quota-increase/quotas-page.png" alt-text="Screenshot of the Azure portal Quotas page with Microsoft Dev Box highlighted." lightbox="media/how-to-request-quota-increase/quotas-page.png":::

1. On the **My Quotas** page, review your quota usage and limits for each resource type:

   :::image type="content" source="media/how-to-request-quota-increase/my-quotas-page.png" alt-text="Screenshot of the Azure portal Quotas page with Microsoft Dev Box quotas." lightbox="media/how-to-request-quota-increase/my-quotas-page.png":::

1. You can submit a quota request for one or more quotas:

   - To request an update to an existing quota, select the quota in the list, and then select **Request adjustment** (pencil icon) in the **Adjustable** column.

      :::image type="content" source="media/how-to-request-quota-increase/request-quota-adjustment.png" alt-text="Screenshot that shows how to select the Request adjustment option for existing quotas in the Azure portal.":::
   
   - To request updates for multiple quotas, select the quotas (you can select across multiple pages in the list), and then select **New Quota Request** > **Enter a new limit**:

      :::image type="content" source="media/how-to-request-quota-increase/request-multiple-quota-adjustment.png" alt-text="Screenshot that shows how to select multiple existing quotas and then select New Quota Request, Enter a new limit.":::

1. In the **New Quota Request** pane, enter the **New limit** to request for each quota you selected, and then select **Submit**:

   :::image type="content" source="media/how-to-request-quota-increase/new-quota-request.png" alt-text="Screenshot of the New Quota Request pane showing how to request a new limit and select Submit.":::

   While your request is under review, a status indicator displays on the **New Quota Request** pane. A popup displays intermittently to indicate the request is under review:

   :::image type="content" source="media/how-to-request-quota-increase/new-quota-request-review.png" alt-text="Screenshot showing the popup about Microsoft reviewing your quota limit request.":::

   Keep the **New Quota Request** pane open while you wait to see the results of your request. The pane updates after the request review completes:

   :::image type="content" source="media/how-to-request-quota-increase/new-quota-request-result.png" alt-text="Screenshot of the New Quota Request pane showing the results of the quota request and the Create a support request option highlighted.":::
 
   - If the request is approved, the new quota limit is updated in the Azure portal.
   
   - If the request is denied, you can submit a new request with additional information by selecting the **Create support requests** option.

## Create support request from Support + troubleshooting

As an alternative to using the Quota Management System (QMS) in the Azure portal, you can initiate a support request to increase your quota limit by using the **Support + Troubleshooting** feature. This feature provides a guided experience to help you create a support request for quota increases.

1. On the Azure portal home page, select the **Support + Troubleshooting** icon (question mark) on the toolbar:
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-question.png" alt-text="Screenshot showing the How can we help question view for the Support plus troubleshooting feature."::: 

1. In the **How can we help you?** box, enter _quota limit_, and then select **Go**:

   :::image type="content" source="media/how-to-request-quota-increase/help-support-quota-limit.png" alt-text="Screenshot showing how to search for help on the quota limit in the Support plus troubleshooting feature.":::

   The view refreshes to show the **Current selection** section.
 
1. In **Current selection** section, select the **Service and subscription limits (quotas)** option, and then select **Next**:

   :::image type="content" source="media/how-to-request-quota-increase/help-support-service-list.png" alt-text="Screenshot showing how to select the Service and subscription limits (quotas) option.":::

   The page refreshes to include an option to create a support request for quotas.

1. In the **Service and subscription limits (quotas)** section, select **Create a support request**:

   :::image type="content" source="media/how-to-request-quota-increase/help-support-result.png" alt-text="Screenshot showing the Service and subscription limits (quotas) section and the Create a support request option highlighted.":::

   The **New support request** page opens. Continue to the [following section](#describe-the-requested-quota-increase) for instructions about filling out the support request form.

### Describe the requested quota increase

Follow these steps to describe your requested quota increase and fill out the support form.

1. On the **New support request** page, on the **1. Problem description** tab, configure the following settings, and then select **Next**.

   :::image type="content" source="media/how-to-request-quota-increase/help-support-request-problem.png" alt-text="Screenshot showing the Problem description tab for a new support request with the required settings highlighted.":::

   | Setting | Value |
   |---|---|
   | **What is your issue related to?** | Select **Azure services**. |
   | **Issue type**   | Select **Service and subscription limits (quotas)**. |
   | **Subscription** | Select the subscription to which the request applies. |
   | **Quota type**   | Select **Microsoft Dev Box**. |

   After you select **Next**, the tool skips the **2. Recommended solution** tab and opens the **3. Additional details** tab. This tab contains four sections: **Problem details**, **Advanced diagnostic information**, **Support method**, and **Contact info**.

1. On the **3. Additional details** tab, in the **Problem details** section, select **Enter details**:
 
   :::image type="content" source="media/how-to-request-quota-increase/help-support-request-additional-details.png" alt-text="Screenshot showing the Additional details tab for a new support request with the Enter details link highlighted."::: 

   The **Quota details** pane opens.

1. In the **Quota details** pane, configure the following settings: 
 
   | Setting | Value |
   |---|---|
   | **Region** | Select the **Region** in which you want to increase your quota. After you select a region, the pane refreshes to display your current usage and current limit for all quota types. | 
   | **Quota type** | Select the quota you want to increase. | 
   | **New total limit** | Enter the new total limit that you want to request. |
   | **Is it a limit decrease?** | Select **Yes** or **No**. |
   | **Additional information** | Enter any extra information about your request. |

   :::image type="content" source="media/how-to-request-quota-increase/quota-details.png" alt-text="Screenshot of the Quota details pane showing current usage and current limit for all quota types for a specific region.":::

1. Select **Save and Continue**.

### Complete the support request

To complete the support request form, configure the remaining settings. When you're ready, review your information and submit the request.

1. On the **Additional details** tab, in the **Advanced diagnostic information** section, configure the following setting:

   | Setting | Value |
   |---|---|
   | **Allow collection of advanced diagnostic information** | Select **Yes** (Recommended) or **No**. |

   :::image type="content" source="media/how-to-request-quota-increase/request-advanced-diagnostics-info.png" alt-text="Screenshot showing the Advanced diagnostic information section for a new support request."::: 

1. In the **Support method** section, configure the following settings:

   | Setting | Value |
   |---|---|
   | **Support plan** | Select your support plan. |
   | **Severity** | Select the severity of the issue. |
   | **Preferred contact method** | Select **Email** or **Phone**. |
   | **Your availability** | Enter your availability. |
   | **Support language** | Select your language preference. |

   :::image type="content" source="media/how-to-request-quota-increase/request-support-method.png" alt-text="Screenshot showing the Support method section for a new support request."::: 

1. In the **Contact info** section, configure the following settings:

   | Setting | Value |
   |---|---|
   | **First name** | Enter your first name. |
   | **Last name** | Enter your last name or family name. |
   | **Email** | Enter your contact email. |
   | **Additional email for notification** | Enter an email for notifications. |
   | **Phone** | Enter your contact phone number. |
   | **Country/region** | Enter your location. |
   | **Save contact changes for future support requests.** | Select the check box to save the contact changes. |

   :::image type="content" source="media/how-to-request-quota-increase/request-contact-info.png" alt-text="Screenshot showing the Contact info section for a new support request and the Next button."::: 

1. Select **Next**.

1. On the **4. Review + create** tab, review your information. When you're ready to submit the request, select **Create**.

## Related content

- Check the default quota for each resource type by subscription type with [Microsoft Dev Box limits](../azure-resource-manager/management/azure-subscription-service-limits.md#microsoft-dev-box-limits).

- Learn more about the general [process for creating Azure support requests](/azure/azure-portal/supportability/how-to-create-azure-support-request).
