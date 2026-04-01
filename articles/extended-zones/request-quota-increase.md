---
title: Request Quota Increase - Azure Portal
description: Learn how to request a quota increase for your Azure Extended Zones resources by using the Azure portal.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 03/07/2025
#customer intent: As a user, I want to request a quota increase for my Azure Extended Zones resources so that I can manage my resources effectively.
---

# Request a quota increase in the Azure portal

In this article, you learn how to request a quota increase for your Azure Extended Zones resources by using the Azure portal.

## Prerequisites

You need an Azure account with an active subscription.

## Request a quota increase

In this section, you request a quota increase in the Azure portal.

1. Select the question mark on the toolbar.

    :::image type="content" source="./media/request-quota-increase/support-and-troubleshoot.png" alt-text="Screenshot that shows the support request page.":::

1. In the **Support + troubleshooting** search box, enter **compute quota**. Select **Subscription Management**, and then select **Next**.

1. Select your subscription, and then select **Next**. Select **Compute-VM (cores-vCPUs) subscription limit increases**, and then select **Next**.

1. Select **Create a Support Request**.

1. On the **New support request** pane, enter the following information.

    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | **What is your issue related to?** | Select **Azure services**.                    |    
    | **Issue type**     | Select **Service and subscription limits (quotas)**.            |
    | **Subscription**   | Select your subscription.                                       |
    | **Quota type**     | Select **Compute-VM (cores-vCPUs) subscription limit increases**. |

1. Select **Next**.

1. On the **Additional details** tab, select **Enter details**.

    :::image type="content" source="./media/request-quota-increase/select-request-details.png" alt-text="Screenshot that shows selecting Enter details.":::

1. On the **Request details** pane, enter the following information.

    :::image type="content" source="./media/request-quota-increase/request-details.png" alt-text="Screenshot that shows how to fill out the Request details form.":::

    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | **Deployment model** | Select **Resource Manager**.                           |
    | **Choose request types** | Select **Extended Zone Access**.                           |
    | **Locations**       | Select the extended zone region.                     |
    | **Extended Zones**   | Select the location of your extended zone.                          |
    | **Quotas**        | Select the quota that you want to increase.               |
    | **Available to increase** | Enter the new quota limit in the **New limit** box.              |

    > [!NOTE]
    > You need to select the parent region first, and then choose the paired extended zone to select the correct extended zone location. For example, if you select West US, you can then choose Los Angeles as the extended zone. If no extended zone is paired with the selected region, you can't select an extended zone location.

1. Select **Save and Continue**.

1. In the **Advanced diagnostic information** section, select **Yes (Recommended)** to allow Azure support to gather advanced diagnostic information from your resources. Select **No** if you prefer not to share this information.

1. In the **Support Method** section, provide your preferred contact method, availability, and support language. Confirm your region. Complete the **Contact info** section to ensure that we can reach you.

1. Select **Next**. Review your request and select **Create**. The extended zone engineering team processes your request.

> [!NOTE]
> The **Quotas** view shows only the quota from the extended zone's parent region. You need to provide the extended zone information when you request quotas because that's where the product is intended to be deployed. There might be situations where the parent region is capacity constrained while the extended zone isn't constrained.

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)
