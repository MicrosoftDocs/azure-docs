---
title: Connect ServiceNow to Defender for Cloud
description: Learn how to connect ServiceNow with Microsoft Defender for Cloud to protect Azure, hybrid, and multicloud machines.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/11/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn how to connect my ServiceNow account with Microsoft Defender for Cloud so that I can protect my Azure, hybrid, and multicloud machines.
---

# Connect ServiceNow to Defender for Cloud

Microsoft Defender for Cloud's integration with ServiceNow allows customers to connect their Defender for Cloud accounts to ServiceNow. ServiceNow is a powerful workflow automation and enterprise solution that helps organizations streamline and automate routine tasks, improving operational efficiencies and increasing productivity. By integrating ServiceNow with Defender for Cloud, customers can prioritize the remediation of recommendations that affect their business. This integration allows you to create and view ServiceNow tickets linked to recommendations directly from Defender for Cloud, which facilitates efficient incident management.

## Prerequisites

- Have an [application registry in ServiceNow](https://www.opslogix.com/knowledgebase/servicenow/kb-create-a-servicenow-api-key-and-secret-for-the-scom-servicenow-incident-connector).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- The following roles are required:
  - To create the integration: Security Admin, Contributor, or Owner.

## Connect a ServiceNow account to Defender for Cloud

To connect a ServiceNow account to a Defender for Cloud account:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **ServiceNow**.

   :::image type="content" border="true" source="./media/connect-servicenow/integrations.png" alt-text="Screenshot of environment settings page that shows where to select the ServiceNow option.":::

1. Select **Add integration** > **ServiceNow**.

   :::image type="content" border="true" source="./media/connect-servicenow/add-servicenow.png" alt-text="Screenshot that shows where the add integration button is and the ServiceNow option." lightbox="media/connect-servicenow/add-servicenow.png":::

1. Enter a name and select the scope.

1. In the ServiceNow connection details, enter the instance URL, name, password, client ID, and client secret that you [created for the application registry](https://www.opslogix.com/knowledgebase/servicenow/kb-create-a-servicenow-api-key-and-secret-for-the-scom-servicenow-incident-connector) in the ServiceNow portal.

1. Select **Next**.

1. Select Incident data, Problems data, and Changes table from the drop-down menus.

   :::image type="content" border="true" source="./media/connect-servicenow/customize-fields.png" alt-text="Screenshot that shows the custom option selected and the accompanying fields you can enter information into.":::

1. Select **Save**.

A notice appears after successful creation of integration.

## Next step

> [!div class="nextstepaction"]
> [Create a ticket in Defender for Cloud](create-ticket-servicenow.md)
