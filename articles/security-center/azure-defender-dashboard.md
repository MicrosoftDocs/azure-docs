---
title: Azure Defender's dashboard and its features
description: Learn about the features of the Azure Defender dashboard.
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# The Azure Defender dashboard

The Azure Defender dashboard provides:

- Visibility into your Azure Defender coverage across your different resource types
- Links to configure advanced threat protection capabilities
- The onboarding state and agent installation
- Azure Defender threat detection alerts 

To access the Azure Defender dashboard, select **Azure Defender** from the Cloud Security section of Security Center's menu.

## What's shown on the dashboard?

:::image type="content" source="./media/azure-defender-dashboard/sample-defender-dashboard-numbered.png" alt-text="An example of the Azure Defender dashboard" lightbox="./media/azure-defender-dashboard/sample-defender-dashboard-numbered.png":::

The dashboard includes the following sections:

1. **Azure Defender coverage** - Here you can see the resources types that are in your subscription and eligible for protection by Azure Defender. Wherever relevant, you'll have the option to upgrade too. If you want to upgrade all possible eligible resources, select **Upgrade all**.

2. **Security alerts** - When Azure Defender detects a threat in any area of your environment, it generates an alert. These alerts describe details of the affected resources, suggested remediation steps, and in some cases an option to trigger a logic app in response. Selecting anywhere in this graph opens the **Security alerts page**.

3. **Advanced protection** - Azure Defender includes many advanced threat protection capabilities for virtual machines, SQL databases, containers, web applications, your network, and more. In this advanced protection section, you can see the status of the resources in your selected subscriptions for each of these protections. Select any of them to go directly to the configuration area for that protection type.

4. **Insights** - This rolling pane of news, suggested reading, and high priority alerts gives Security Center's insights into pressing security matters that are relevant to you and your subscription. Whether it's a list of high severity CVEs discovered on your VMs by a vulnerability analysis tool, or a new blog post by a member of the Security Center team, you'll find it here in the Insights pane of your **Azure Defender dashboard**.




## Next steps

In this article, you learned about the Azure Defender dashboard. 

For more on Azure Defender, see [Introduction to Azure Defender](azure-defender.md)

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)