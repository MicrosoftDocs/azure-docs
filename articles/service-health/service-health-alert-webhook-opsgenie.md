---
title: Send Azure service health alerts with OpsGenie using webhooks
description: Get personalized notifications about service health events to your OpsGenie instance.
ms.topic: conceptual
ms.date: 06/10/2019
---
   
# Send Azure service health alerts with OpsGenie using webhooks

This article shows you how to set up Azure service health alerts with OpsGenie using a webhook. By using [OpsGenie](https://www.opsgenie.com/)'s Azure Service Health Integration, you can forward Azure Service Health alerts to OpsGenie. OpsGenie can determine the right people to notify based on on-call schedules, using email, text messages (SMS), phone calls, iOS & Android push notifications, and escalating alerts until the alert is acknowledged or closed.

## Creating a service health integration URL in OpsGenie
1.  Make sure you have signed up for and are signed into your [OpsGenie](https://www.opsgenie.com/) account.

1.  Navigate to the **Integrations** section in OpsGenie.

    ![The "Integrations" section in OpsGenie](./media/webhook-alerts/opsgenie-integrations-section.png)

1.  Select the **Azure Service Health** integration button.

    ![The "Azure Service Health button" in OpsGenie](./media/webhook-alerts/opsgenie-azureservicehealth-button.png)

1.  **Name** your alert and specify the **Assigned to Team** field.

1.  Fill out the other fields like **Recipients**, **Enabled**, and **Suppress Notifications**.

1.  Copy and save the **Integration URL**, which should already contain your `apiKey` appended to the end.

    ![The "Integration URL" in OpsGenie](./media/webhook-alerts/opsgenie-integration-url.png)

1.  Select **Save Integration**

## Create an alert using OpsGenie in the Azure portal
### For a new action group:
1. Follow steps 1 through 8 in [Create an alert on a service health notification for a new action group by using the Azure portal](../azure-monitor/platform/alerts-activity-log-service-notifications.md).

1. Define in the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The OpsGenie **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

1. Select **Save** when done to create the alert.

### For an existing action group:
1. In the [Azure portal](https://portal.azure.com/), select **Monitor**.

1. In the **Settings** section, select **Action groups**.

1. Find and select the action group you want to edit.

1. Add to the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The OpsGenie **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

1. Select **Save** when done to update the action group.

## Testing your webhook integration via an HTTP POST request
1. Create the service health payload you want to send. You can find an example service health webhook payload at [Webhooks for Azure activity log alerts](../azure-monitor/platform/activity-log-alerts-webhook.md).

1. Create an HTTP POST request as follows:

    ```
    POST        https://api.opsgenie.com/v1/json/azureservicehealth?apiKey=<APIKEY>

    HEADERS     Content-Type: application/json

    BODY        <service health payload>
    ```
1. You should receive a `200 OK` response with the message of status "successful."

1. Go to [OpsGenie](https://www.opsgenie.com/) to confirm that your integration was set up successfully.

## Next steps
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Review the [activity log alert webhook schema](../azure-monitor/platform/activity-log-alerts-webhook.md). 
- Learn about [service health notifications](../azure-monitor/platform/service-notifications.md).
- Learn more about [action groups](../azure-monitor/platform/action-groups.md).