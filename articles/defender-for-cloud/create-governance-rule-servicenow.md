---
title: Assign an owner to a recommendation or severity level
description: Learn how to create a governance rule in Defender for Cloud that connects recommendations or severity levels to a specific owner.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 02/28/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn how to conncreate a governance rule in Defender for Cloud that automatically assigns an owner to specific recommendation or a recommendation with a severity level in Defender for Cloud to my my ServiceNow account.
---

# Assign an owner to a recommendation or severity level

With the integration between Defender for Cloud and ServiceNow, you can automatically assign ownership of a specific recommendation or severity level to a specific user in ServiceNow. This integration allows for the creation and viewing of ServiceNow tickets linked to recommendations directly from Defender for Cloud, enabling seamless collaboration between the two platforms and facilitating efficient incident management.

## Prerequisites

- Have an [application registry in ServiceNow](https://docs.servicenow.com/bundle/utah-employee-service-management/page/product/meeting-extensibility/task/create-app-registry-meeting-extensibility.html). 

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- The following roles are required:
    - To create an assignment:  Admin permissions to ServiceNow.

## Create a governance rule to assign an owner

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
