---
title: Enroll in per-user access pricing for Azure Virtual Desktop
description: Learn how to enroll your Azure subscription for per-user access pricing for Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 01/08/2024
---

# Enroll in per-user access pricing for Azure Virtual Desktop

Per-user access pricing lets you pay for Azure Virtual Desktop access rights on behalf of external users. External users aren't members of your organization, such as customers of a business. To learn more about licensing options, see [Licensing Azure Virtual Desktop](licensing.md).

Before external users can connect to your deployment, you need to enroll your Azure subscriptions that you use for Azure Virtual Desktop in per-user access pricing. Your enrolled subscription is charged each month based on the number of distinct users that connect to Azure Virtual Desktop resources. All Azure subscriptions are applicable, such as those from an [Enterprise Agreement (EA)](/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-enterprise-agreement), [Cloud Solution Provider (CSP)](/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-cloud-solution-provider), or [Microsoft Customer Agreement](/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-billing-microsoft-customer-agreement). 

> [!IMPORTANT]
> Per-user access pricing with Azure Virtual Desktop doesn't currently support Citrix DaaS and VMware Horizon Cloud.

## How to enroll an Azure subscription

To enroll your Azure subscription into per-user access pricing:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type **Azure Virtual Desktop** and select the matching service entry.

1. In the **Azure Virtual Desktop** overview page, select **Per-user access pricing**.

1. In the list of subscriptions, check the box for the subscription where you deploy Azure Virtual Desktop resources for external users.

1. Select **Enroll**.

1. Review the Product Terms, then select **Enroll** to begin enrollment. It might take up to an hour for the enrollment process to finish. The **Per-user access pricing** column of the subscriptions list shows **Enrolling** while the enrollment process is running.

1. After enrollment completes, check the value in the **Per-user access pricing** column of the subscriptions list changes to **Enrolled**.

## How to unenroll an Azure subscription 

To enroll your Azure subscription from per-user access pricing:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type **Azure Virtual Desktop** and select the matching service entry.

1. In the **Azure Virtual Desktop** overview page, select **Per-user access pricing**.

1. In the list of subscriptions, check the box for the subscription you want to unenroll from per-user access pricing.

1. Select **Unenroll**.

1. Review the unenrollment message, then select **Unenroll** to begin unenrollment. It might take up to an hour for the unenrollment process to finish. The **Per-user access pricing** column of the subscriptions list shows **Unenrolling** while the unenrollment process is running.

1. After unenrollment completes, check the value in the **Per-user access pricing** column of the subscriptions list changes to **Not enrolled**.

## Next steps

- To learn more about per-user access pricing, see [Licensing Azure Virtual Desktop](licensing.md).
- For estimating total deployment costs, see [Understand and estimate costs for Azure Virtual Desktop](understand-estimate-costs.md).
