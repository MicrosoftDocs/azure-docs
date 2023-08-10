---
title: Workload protection dashboard and its features
description: Learn about the features of Microsoft Defender for Cloud's workload protection dashboard
ms.topic: how-to
ms.date: 01/09/2023
---

# The workload protections dashboard

This dashboard provides:

- Visibility into your Microsoft Defender for Cloud coverage across your different resource types.

- Links to configure advanced threat protection capabilities.

- The onboarding state and agent installation.

- Threat detection alerts.

To access the workload protections dashboard, select **Workload protections** from the Cloud Security section of Defender for Cloud's menu.

## What's shown on the dashboard?

:::image type="content" source="./media/workload-protections-dashboard/sample-defender-dashboard-numbered.png" alt-text="An example of Defender for Cloud's workload protections dashboard." lightbox="./media/workload-protections-dashboard/sample-defender-dashboard-numbered.png":::

The dashboard includes the following sections:

1. **Microsoft Defender for Cloud coverage** - Here you can see the resources types that's in your subscription and eligible for protection by Defender for Cloud. Wherever relevant, you can upgrade here as well. If you want to upgrade all possible eligible resources, select **Upgrade all**.

2. **Security alerts** - When Defender for Cloud detects a threat in any area of your environment, it generates an alert. These alerts describe details of the affected resources, suggested remediation steps, and in some cases an option to trigger a logic app in response. Selecting anywhere in this graph opens the **Security alerts page**.

3. **Advanced protection** - Defender for Cloud includes many advanced threat protection capabilities for virtual machines, SQL databases, containers, web applications, your network, and more. In this advanced protection section, you can see the status of the resources in your selected subscriptions for each of these protections. Select any of them to go directly to the configuration area for that protection type.

4. **Insights** - This rolling pane of news, suggested reading, and high priority alerts gives Defender for Cloud's insights into pressing security matters that are relevant to you and your subscription. Whether it's a list of high severity CVEs discovered on your VMs by a vulnerability analysis tool, or a new blog post by a member of the Defender for Cloud team, you'll find it here in the Insights panel.

## Next steps

In this article, you learned about the workload protections dashboard.

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)

Learn more about the [advanced protections provided by the Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
