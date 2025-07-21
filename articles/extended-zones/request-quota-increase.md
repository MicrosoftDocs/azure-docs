---
title: Request quota increase - Azure portal
description: Learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 03/07/2025
#customer intent: As a user, I want to request a quota increase for my Azure Extended Zone resources so that I can manage my resources effectively.
---

# Request a quota increase in the Azure portal

In this article, you learn how to request a quota increase for your Azure Extended Zone resources using the Azure portal.

## Prerequisites

- An Azure account with an active subscription.

## Request a quota increase

In this section, you request a quota increase in the Azure portal.

1. Select the **?** in the global header. 

    :::image type="content" source="./media/request-quota-increase/support-and-troubleshoot.png" alt-text="Screenshot of reaching support request page.":::

1. In the **Support + troubleshooting** search box, enter **compute quota**, then select **Subscription Management**. Select **Next**.

1. Select your subscription, select **Next**, then select **Compute-VM (cores-vCPUs) subscription limit increases**. Select **Next**.

1. Select **Create a Support Request**.

1. In the New support request pane, enter the following details:

    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | What is your issue related to? | Select **Azure services**.                    |    
    | Issue type     | Select **Service and subscription limits (quotas)**.            |
    | Subscription   | Select your subscription.                                       |
    | Quota type     | Select **Compute-VM (cores-vCPUs) subscription limit increases**. |

1. Select **Next**. 

1. In the **Additional details** tab, select **Enter details**.

    :::image type="content" source="./media/request-quota-increase/select-request-details.png" alt-text="Screenshot that shows where to select to select Enter details.":::
 
1. In the **Request Details** pane, enter the following information:

    :::image type="content" source="./media/request-quota-increase/request-details.png" alt-text="Screenshot that shows how to fill out the Request details form.":::


    | Field          | Value                                                   |
    |----------------|---------------------------------------------------------|
    | Deployment model | Select **Resource Manager**.                           |
    | Choose request types | Select **Extended Zone Access**.                           |
    | Locations       | Select the Extended Zone region.                     |
    | Extended Zones   | Select the location of your extended zone.                          |
    | Quotas        | Select the quota you want to increase.               |
    | Available to increase | Enter the new quota limit in the **New limit** box.              |


    > [!NOTE]
    > You need to select the parent region first, and then choose the paired Extended Zone to select the correct Extended Zone location. For example, if you select West US, you can then choose Los Angeles as the Extended Zone. If there's no Extended Zone paired with the selected region, you won’t be able to select an Extended Zone location.

1. Select **Save and Continue**. 

1. In the **Advanced diagnostic information** section, select **Yes (Recommended)** to allow Azure support to gather advanced diagnostic information from your resources, or **No** if you prefer not to share this information.

1. In the Support Method section, provide your preferred contact method, availability, and support language, and confirm your region. Complete the *Contact info* section to ensure we can reach you.

1. Select **Next**. Review your request and select **Create**. Your request will be processed by the Extended Zones engineering team accordingly.

> [!NOTE]
> The Quota's view will only show the quota from the Extended Zone's parent region, given Extended Zones respect quota from their parent region. Nevertheless, providing the Extended Zone's information is needed when requesting quotas, as that's where the SKU is intended to be deployed. Consequently, there may be situations where the parent region is capacity constrained while the Extended Zone is not. 

## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Frequently asked questions](faq.md)