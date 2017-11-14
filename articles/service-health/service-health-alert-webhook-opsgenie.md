---
title: Configure health alerts with OpsGenie | Microsoft Docs
description: Learn how to get personalized notifications about service health events to your OpsGenie instance.
author: shawntabrizi
manager: scotthit
editor: ''
services: service-health
documentationcenter: service-health

ms.assetid:
ms.service: service-health
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/13/2017
ms.author: shawntabrizi

---
# Configure health alerts with OpsGenie

By using [OpsGenie](https://www.opsgenie.com/)’s Azure Service Health Integration: you can forward Azure Service Health alerts to OpsGenie. OpsGenie can determine the right people to notify based on on-call schedules, using email, text messages (SMS), phone calls, iOS & Android push notifications, and escalating alerts until the alert is acknowledged or closed.

## Creating a service health integration URL in OpsGenie
1.  Make sure you have signed up for and are signed into your [OpsGenie](https://www.opsgenie.com/) account.
2.  Navigate to the **Integrations** section in OpsGenie.

    ![The "Integrations" section in OpsGenie](./media/webhook-alerts/opsgenie-integrations-section.png)
3.  Click the **Azure Service Health** integration button.

    ![The "Azure Service Health button" in OpsGenie](./media/webhook-alerts/opsgenie-azureservicehealth-button.png)
4.  **Name** your alert and specify the **Assigned to Team** field.
5.  Fill out the other fields like **Recipients**, **Enabled**, and **Suppress Notifications**.
6.  Copy and save the **Integration URL**, which should already contain your `apiKey` appended to the end.

    ![The "Integration URL" in OpsGenie](./media/webhook-alerts/opsgenie-integration-url.png)
7.  Click **Save Integration**

## Create a health alert using OpsGenie's integration URL in the Azure portal
### For a new action group:
1. Follow steps 1 through 8 in [Create an alert on a service health notification for a new action group by using the Azure portal](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md).
2. Define in the list of **Actions**:

    a. **Action Type:** *Webhook*
    b. **Details:** The OpsGenie **Integration URL** you previously saved.
    c. **Name:** Webhook’s name, alias, or identifier.

3. Select **Save** when done to create the alert.

### For an existing action group:
1. In the [Azure portal](https://portal.azure.com/), select **Monitor**.
2. In the **Settings** section, select **Action groups**.
3. Find and select the action group you want to edit.
4. Add to the list of **Actions**:

    a. **Action Type:** *Webhook*
    b. **Details:** The OpsGenie **Integration URL** you previously saved.
    c. **Name:** Webhook’s name, alias, or identifier.

5. Select **Save** when done to update the action group.

## Testing your webhook integration via an HTTP POST request

1. Create the Service Health payload you want to send. You can find an example Service Health webhook payload at [Webhooks for Azure activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md).
2. Create an HTTP POST request as follows:

    ```
    POST        https://api.opsgenie.com/v1/json/azureservicehealth?apiKey=<APIKEY>

    HEADERS     Content-Type: application/json

    BODY        <Service Health payload>
    ```
3. You should receive a `200 OK` response with the message of status "successful."
4. Go to [OpsGenie](https://www.opsgenie.com/) to confirm that your integration was set up successfully.