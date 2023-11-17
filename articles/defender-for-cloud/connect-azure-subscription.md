---
title: Connect your Azure subscriptions
description: Learn how to connect your Azure subscriptions to Microsoft Defender for Cloud 
ms.topic: install-set-up-deploy
ms.date: 11/02/2023
ms.custom: mode-other
---

# Connect your Azure subscriptions

In this guide, you'll learn how to enable Microsoft Defender for Cloud on your Azure subscription.

Microsoft Defender for Cloud is a cloud-native application protection platform (CNAPP) with a set of security measures and practices designed to protect your cloud-based applications end-to-end by combining the following capabilities:

- A development security operations (DevSecOps) solution that unifies security management at the code level across multicloud and multiple-pipeline environments
- A cloud security posture management (CSPM) solution that surfaces actions that you can take to prevent breaches
- A cloud workload protection platform (CWPP) with specific protections for servers, containers, storage, databases, and other workloads

Defender for Cloud includes Foundational CSPM capabilities and access to [Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-defender?view=o365-worldwide) for free. You can add additional paid plans to secure all aspects of your cloud resources. To learn more about these plans and their costs, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

Defender for Cloud helps you find and fix security vulnerabilities. Defender for Cloud also applies access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack.

## Prerequisites

- To view information related to a resource in Defender for Cloud, you must be assigned the Owner, Contributor, or Reader role for the subscription or for the resource group that the resource is located in.

## Enable Defender for Cloud on your Azure subscription

> [!TIP]
> To enable Defender for Cloud on all subscriptions within a management group, see [Enable Defender for Cloud on multiple Azure subscriptions](onboard-management-group.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

    :::image type="content" source="media/get-started/defender-for-cloud-search.png" alt-text="Screenshot of the Azure portal with Microsoft Defender for Cloud selected." lightbox="media/get-started/defender-for-cloud-search.png":::

    The Defender for Cloud's overview page opens.

    :::image type="content" source="./media/get-started/overview.png" alt-text="Screenshot of Defender for Cloud's overview dashboard." lightbox="./media/get-started/overview.png":::

Defender for Cloud is now enabled on your subscription and you have access to the basic features provided by Defender for Cloud. These features include:

- The [Foundational Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan.
- [Recommendations](security-policy-concept.md).
- Access to the [Asset inventory](asset-inventory.md).
- [Workbooks](custom-dashboards-azure-workbooks.md).
- [Secure score](secure-score-security-controls.md).
- [Regulatory compliance](update-regulatory-compliance-packages.md) with the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

The Defender for Cloud overview page provides a unified view into the security posture of your hybrid cloud workloads, helping you discover and assess the security of your workloads and to identify and mitigate risks. Learn more in [Microsoft Defender for Cloud's overview page](overview-page.md).

You can view and filter your list of subscriptions from the subscriptions menu to have Defender for Cloud adjust the overview page display to reflect the security posture to the selected subscriptions.

Within minutes of launching Defender for Cloud for the first time, you might see:

- **Recommendations** for ways to improve the security of your connected resources.
- An inventory of your resources that Defender for Cloud assesses along with the security posture of each.

## Enable all paid plans on your subscription

To enable all of Defender for Cloud's protections, you need to enable the plans for the workloads that you want to protect.

> [!NOTE]
>
> - You can enable **Microsoft Defender for Storage accounts** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for SQL** at either the subscription level or resource level.
> - You can enable **Microsoft Defender for open-source relational databases** at the resource level only.
> - The Microsoft Defender plans available at the workspace level are: **Microsoft Defender for Servers**, **Microsoft Defender for SQL servers on machines**.

When you enable Defender plans on an entire Azure subscription, the protections are applied to all other resources in the subscription.

**To enable additional paid plans on a subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

    :::image type="content" source="media/get-started/environmental-settings.png" alt-text="Screenshot that shows where to navigate to, to select environmental settings from.":::

1. Select the subscription or workspace that you want to protect.

1. Select **Enable all** to enable all of the plans for Defender for Cloud.

    :::image type="content" source="media/get-started/enable-all-plans.png" alt-text="Screenshot that shows where the enable button is located on the plans page." lightbox="media/get-started/enable-all-plans.png":::

1. Select **Save**.

All of the plans are turned on and the monitoring components required by each plan are deployed to the protected resources.

If you want to disable any of the plans, toggle the individual plan to **off**. The extensions used by the plan aren't uninstalled but, after a short time, the extensions stop collecting data.

> [!TIP]
> To enable Defender for Cloud on all subscriptions within a management group, see [Enable Defender for Cloud on multiple Azure subscriptions](onboard-management-group.md).

## Integrate with Microsoft 365 Defender

When you enable Defender for Cloud, Defender for Cloud's alerts are automatically integrated into the Microsoft 365 Defender portal. No further steps are needed.

The integration between Microsoft Defender for Cloud and Microsoft 365 Defender brings your cloud environments into Microsoft 365 Defender. With Defender for Cloud's alerts and cloud correlations integrated into Microsoft 365 Defender, SOC teams can now access all security information from a single interface. 

Learn more about Defender for Cloud's [alerts in Microsoft 365 Defender](concept-integration-365.md).

## Next steps

In this guide, you enabled Defender for Cloud on your Azure subscription. The next step is to set up your hybrid and multicloud environments.

> [!div class="nextstepaction"]
> [Quickstart: Connect your non-Azure machines to Microsoft Defender for Cloud with Azure Arc](quickstart-onboard-machines.md)
>
> [Quickstart: Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
>
> [Quickstart: Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
>
> [Quickstart: Connect your non-Azure machines to Microsoft Defender for Cloud with Defender for Endpoint](onboard-machines-with-defender-for-endpoint.md)
