---
title: Create automatic tickets with governance rules
description: Learn how to create a governance rule in Defender for Cloud that connects recommendations or severity levels to a specific owner.
author: Elazark
ms.author: elkrieger
ms.topic: how-to
ms.date: 03/11/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn how to create automatic tickets using governance rules in Defender for Cloud that automatically assigns an owner to specific recommendation or a recommendation with a severity level in Defender for Cloud to my my ServiceNow account.
---

# Create automatic tickets with governance rules

The integration of ServiceNow and Defender for Cloud allow you to create governance rules that automatically open tickets in ServiceNow for specific recommendations or severity levels. ServiceNow tickets can be created, viewed, and linked to recommendations directly from Defender for Cloud, enabling seamless collaboration between the two platforms and facilitating efficient incident management.

## Prerequisites

- Have an [application registry in ServiceNow](https://docs.servicenow.com/bundle/utah-employee-service-management/page/product/meeting-extensibility/task/create-app-registry-meeting-extensibility.html).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- The following roles are required:
  - To create an assignment:  Admin permissions to ServiceNow.

## Assign an owner with a governance rule

You can create a rule to automatically assign an owner to a recommendation in Defender for Cloud. This rule is based on the recommendation's severity or recommendation.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Governance rules**.

   :::image type="content" border="true" source="./media/integration-servicenow/governance-rules.png" alt-text="Screenshot of the environment settings page that shows where the governance rules button is located.":::

1. Select **Create governance rule**.

1. Enter a rule name and select a scope.

1. Select **ServiceNow** In the Type field.

1. Enter a priority.

1. Select and integration instance.

1. Select a ServiceNow ticket type.

1. Select **Next**.

1. Select either:
    - **By Severity** and the severity level.
    - **By recommendation** and the recommendation.

1. Select an owner.

1. Select a remediation timeframe.

1. (Optional) Toggle the switch to apply a grace period.

1. (Optional) Set email notifications.

1. Select **Create**.

## Next step

> [!div class="nextstepaction"]
> [Common questions about cloud security posture management (CSPM)](faq-cspm.yml).
