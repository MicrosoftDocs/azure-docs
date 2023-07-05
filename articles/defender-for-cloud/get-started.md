---
title: Enable Microsoft Defender for Cloud on your Azure subscription
description: Learn how to enable Microsoft Defender for Cloud's enhanced security features.
ms.topic: install-set-up-deploy
ms.date: 06/22/2023
ms.custom: mode-other
---

# Enable Microsoft Defender for Cloud

In this quickstart guide, you learn how to enable Microsoft Defender for Cloud on your Azure subscription. 

Defender for Cloud provides unified security management and threat protection across your hybrid and multicloud workloads. While the free features offer limited security for your Azure resources only, you can also enable other paid plans that add extra protection for your resources that exist on your on-premises and other clouds. To learn more about these plans and their costs, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

Defender for Cloud helps you find and fix security vulnerabilities. Defender for Cloud also applies access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack. 

## Prerequisites

- To get started with Defender for Cloud, you must have a subscription to Microsoft Azure. If you don't have a subscription, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

 - To view information related to a resource in Defender for Cloud, you must be assigned the Owner, Contributor, or Reader role for the subscription or for the resource group that the resource is located in.

## Enable Defender for Cloud on your Azure subscription

> [!TIP]
> To enable Defender for Cloud on all subscriptions within a management group, see [Enable Defender for Cloud on multiple Azure subscriptions](onboard-management-group.md).

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

1. Search for and select **Microsoft Defender for Cloud**.

    :::image type="content" source="media/get-started/defender-for-cloud-search.png" alt-text="Screenshot of the Azure portal with Microsoft Defender for Cloud entered in the search bar and highlighted in the drop down menu." lightbox="media/get-started/defender-for-cloud-search.png":::

    The Defender for Cloud's overview page opens.

    :::image type="content" source="./media/get-started/overview.png" alt-text="Defender for Cloud's overview dashboard" lightbox="./media/get-started/overview.png":::

Defender for Cloud is now enabled on your subscription and you have access to the basic features provided by Defender for Cloud. These features include:

- The [Foundational Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan.
- [Recommendations](security-policy-concept.md#what-is-a-security-recommendation).
- Access to the [Asset inventory](asset-inventory.md).
- [Workbooks](custom-dashboards-azure-workbooks.md).
- [Secure score](secure-score-security-controls.md).
- [Regulatory compliance](update-regulatory-compliance-packages.md) with the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

The Defender for Cloud overview page provides a unified view into the security posture of your hybrid cloud workloads, helping you discover and assess the security of your workloads and to identify and mitigate risks. Learn more in [Microsoft Defender for Cloud's overview page](overview-page.md).

You can view and filter your list of subscriptions from the subscriptions menu to have Defender for Cloud adjust the overview page display to reflect the security posture to the selected subscriptions.

Within minutes of launching Defender for Cloud for the first time, you might see:

- **Recommendations** for ways to improve the security of your connected resources.
- An inventory of your resources that Defender for Cloud assesses along with the security posture of each.

## Next steps

In this quickstart, you enabled Defender for Cloud on your Azure subscription. The next step is to set up your hybrid and multicloud environments.

> [!div class="nextstepaction"]
> [Quickstart: Connect your non-Azure machines to Microsoft Defender for Cloud with Azure Arc](quickstart-onboard-machines.md)
>
> [Quickstart: Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
>
> [Quickstart: Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
>
> [Quickstart: Connect your non-Azure machines to Microsoft Defender for Cloud with Defender for Endpoint](onboard-machines-with-defender-for-endpoint.md)
