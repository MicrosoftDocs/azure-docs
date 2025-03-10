---
title: Request quota increase - Azure portal
description: Learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.
author: svaldes
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/26/2025
#customer intent: As a user, I want to request a quota increase for my Azure Extended Zone resources so that I can manage my resources effectively.
---

# Request a quota increase in the Azure portal

In this article, you learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.

## Prerequisites

- An Azure account with an active subscription.

## Request a quota increase

In this section, you request a quota increase in the Azure portal.

1. In the search box at the top of the portal, enter ***Help + Support***. Select **Help + Support** from the search results.

1. On the Overview page, select **Create a Support Request**.

1. The **Support AI Assistant** pane appears. In *Support AI Assistant* pane, select **Support + troubleshooting**.

    :::image type="content" source="./media/request-quota-increase/select-support-and-troubleshooting.png" alt-text="Screenshot that shows where to click for selecting Support + troubleshooting." lightbox="./media/request-quota-increase/select-support-and-troubleshooting.png":::
 

1. In the **Support + troubleshooting** search box, enter **compute quota**, then select **Subscription Management**. Select **Next**.

1. Enter your subscription information, then select **Compute-VM (cores-vCPUs) subscription limit increases**. Select Next.

1. Select **Create a Support Request**.

1. In the New support request pane, enter the following details:

    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | Issue type     | Select **Service and subscription limits (quotas)**.            |
    | Subscription   | Select your subscription.                                       |
    | Quota type     | Select **Compute-VM (cores-vCPUs) subscription limit increases**. |

1. Select **Next**. In the **Recommended solutions** tab, select **Enter details** under **Problem details**.

    :::image type="content" source="./media/request-quota-increase/select-request-details.png" alt-text="Screenshot that shows where to click to select Enter details." lightbox="./media/request-quota-increase/select-request-details.png":::
 
1. In the **Request Details** pane, enter the following information:

    :::image type="content" source="./media/request-quota-increase/request-details.png" alt-text="Screenshot that shows how to fill out the Request details form." lightbox="./media/request-quota-increase/request-details.png":::

    > [!NOTE]
    > You need to select the parent region first, and then choose the paired Extended Zone to select the correct Extended Zone location. For example, if you select West US, you can then choose Los Angeles as the Extended Zone. If there's no Extended Zone paired with the selected region, you won’t be able to select an Extended Zone location.

1. Select **Save and Continue**. In the **Additional details** tab, enter the following information:

    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | Allow collection of advanced diagnostic information  | Select **Yes(Recommended)**.                                  |
    | Support Plan | The support plan for your organization.                                     |
    | Severity | The severity of the support request. Enter **C - Minimal impact**.                  |
    | Preferred contact method   | Select your preferred method of contact for this support request.                  |
    | Support language   | Select your preferred support language.                  |

1. Select **Next**. Review your request and select **Create**. Your request will be processed by the Extended Zones engineering team accordingly.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)