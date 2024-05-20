---
title: Create a ticket in Defender for Cloud 
description: Learn how to create a ticket in Defender for Cloud that connects and synchronizes with your ServiceNow account.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/11/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn how to Create a ticket in Defender for Cloud for my ServiceNow account.
---

# Create a ticket in Defender for Cloud

The integration between Defender for Cloud and ServiceNow allows Defender for Cloud customers to create tickets in Defender for Cloud that connects to a ServiceNow account. ServiceNow tickets are linked to recommendations directly from Defender for Cloud, allowing the two platforms to facilitate efficient incident management.

## Prerequisites

- Have an [application registry in ServiceNow](https://docs.servicenow.com/bundle/utah-employee-service-management/page/product/meeting-extensibility/task/create-app-registry-meeting-extensibility.html).

- Enable [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) on your Azure subscription.

- The following roles are required:
  - To create an assignment:  Admin permissions to ServiceNow.

## Create a new ticket based on a recommendation to ServiceNow

Security admins can create and assign tickets directly from the Defender for Cloud portal.

1. Sign in to [the Azure portal](https://aka.ms/integrations).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select any recommendation with unhealthy resources that you want to create a ServiceNow ticket for and assign an owner to.

1. Select the resource from the unhealthy resources and select **Assign owner**.

   :::image type="content" border="true" source="./media/create-ticket-servicenow/create-assignment.png" alt-text="Screenshot of how to create an assignment." lightbox="media/create-ticket-servicenow/create-assignment.png":::

1. In the Type field, select **ServiceNow**

    :::image type="content" source="media/create-ticket-servicenow/type-servicenow.png" alt-text="Screenshot that shows the create assignment window and the type field where you select ServiceNow.":::

1. Select the integration instance.

1. Select the ticket type.

   > [!NOTE]
   > In ServiceNow, there are several types of tickets that can be used to manage and track different types of incidents, requests, and tasks. Only incident, change request, and problem are supported with this integration.

   :::image type="content" border="true" source="./media/create-ticket-servicenow/assignment-type.png" alt-text="Screenshot of how to complete the assignment type.":::

1. Expand the assignment details section.

1. Complete the following fields:

   - **Assigned to**: Choose the owner whom you would like to assign the affected recommendation to.
   - **Caller**: Represents the user defining the assignment.
   - **Description and Short Description**: Enter a description, and short description.
   - **Remediation timeframe**: Select the remediation timeframe.
   - **Apply Grace Period**: (Optional) apply a grace period.
   - **Set Email Notifications**: (Optional) You can send a reminder to the owners or the owner’s direct manager.

      :::image type="content" border="true" source="./media/create-ticket-servicenow/assignment-details.png" alt-text="Screenshot of how to complete the assignment details.":::

1. Select **Create**.

After the assignment is created, the Ticket ID assigned to this affected resource will appear next to the resource in the recommendation. The Ticket ID represents the ticket created in the ServiceNow portal. You can select the Ticket ID to navigate to the newly created incident in the ServiceNow portal.

> [!NOTE]
> When the integration is deleted, all of the assignments will be deleted. Deletion can take up to 24 hrs.

## Next step

> [!div class="nextstepaction"]
> [Assign an owner to a recommendation or severity level](create-governance-rule-servicenow.md)
