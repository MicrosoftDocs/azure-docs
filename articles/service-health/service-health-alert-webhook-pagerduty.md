---
title: Configure Azure service health alerts with PagerDuty | Microsoft Docs
description: Get personalized notifications about service health events to your PagerDuty instance.
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
ms.date: 11/14/2017
ms.author: shtabriz

---
# Configure service health alerts with PagerDuty

This article shows you how to set up Azure service health notifications through PagerDuty using a webhook. By using [PagerDuty](https://www.pagerduty.com/)'s custom Microsoft Azure integration type, you can effortlessly add Service Health alerts to your new or existing PagerDuty services.

## Creating a service health integration URL in PagerDuty
1.  Make sure you have signed up for and are signed into your [PagerDuty](https://www.pagerduty.com/) account.

2.  Navigate to the **Services** section in PagerDuty.

    ![The "Services" section in PagerDuty](./media/webhook-alerts/pagerduty-services-section.png)

3.  Select **Add New Service** or open an existing service you have set up.

4.  In the **Integration Settings**, select the following:

    a. **Integration Type**: Microsoft Azure

    b. **Integration Name**: \<Name\>

    ![The "Integration Settings" in PagerDuty](./media/webhook-alerts/pagerduty-integration-settings.png)

5.  Fill out any other required fields and select **Add**.

6.  Open this new integration and copy and save the **Integration URL**.

    ![The "Integration URL" in PagerDuty](./media/webhook-alerts/pagerduty-integration-url.png)

## Create an alert using PagerDuty in the Azure portal
### For a new action group:
1. Follow steps 1 through 8 in [Create an alert on a service health notification for a new action group by using the Azure portal](../monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications.md).

2. Define in the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The PagerDuty **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

3. Select **Save** when done to create the alert.

### For an existing action group:
1. In the [Azure portal](https://portal.azure.com/), select **Monitor**.

2. In the **Settings** section, select **Action groups**.

3. Find and select the action group you want to edit.

4. Add to the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The PagerDuty **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

5. Select **Save** when done to update the action group.

## Testing your webhook integration via an HTTP POST request
1. Create the Service Health payload you want to send. You can find an example Service Health webhook payload at [Webhooks for Azure activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md).

2. Create an HTTP POST request as follows:

    ```
    POST        https://events.pagerduty.com/integration/<IntegrationKey>/enqueue

    HEADERS     Content-Type: application/json

    BODY        <Service Health payload>
    ```
3. You should receive a `202 Accepted` with a message containing your "event ID."

4. Go to [PagerDuty](https://www.pagerduty.com/) to confirm that your integration was set up successfully.

## Next steps
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Review the [activity log alert webhook schema](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md). 
- Learn about [service health notifications](../monitoring-and-diagnostics/monitoring-service-notifications.md).
- Learn more about [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md).