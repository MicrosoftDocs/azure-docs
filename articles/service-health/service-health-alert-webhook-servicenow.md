---
title: Send Azure service health alerts with ServiceNow
description: Get personalized notifications about service health events to your ServiceNow instance.
ms.topic: conceptual
ms.date: 06/10/2019
ms.custom:
---
# Send Azure service health alerts with ServiceNow using webhooks

This article shows you how to integrate Azure service health alerts with ServiceNow using a webhook. After setting up webhook integration with your ServiceNow instance, you get alerts through your existing notification infrastructure when Azure service issues affect you. Every time an Azure Service Health alert fires, it calls a webhook through the ServiceNow Scripted REST API.

## Creating a scripted REST API in ServiceNow

1.  Make sure you have signed up for and are signed into your [ServiceNow](https://www.servicenow.com/) account.

1.  Navigate to the **System Web Services** section in ServiceNow and select **Scripted REST APIs**.

    ![The "Scripted Web Service" section in ServiceNow](./media/webhook-alerts/servicenow-sws-section.png)

1.  Select **New** to create a new Scripted REST service.
 
    ![The "New Scripted REST API" button in ServiceNow](./media/webhook-alerts/servicenow-new-button.png)

1.  Add a **Name** to your REST API and set the **API ID** to `azureservicehealth`.

1.  Select **Submit**.

    ![The "REST API Settings" in ServiceNow](./media/webhook-alerts/servicenow-restapi-settings.png)

1.  Select the REST API you created, and under the **Resources** tab select **New**.

    ![The "Resource Tab" in ServiceNow](./media/webhook-alerts/servicenow-resources-tab.png)

1.  **Name** your new resource `event` and change the **HTTP method** to `POST`.

1.  In the **Script** section, add the following JavaScript code:

    >[!NOTE]
    >You need to update the `<secret>`,`<group>`, and `<email>` value in the script below.
    >* `<secret>` should be a random string, like a GUID
    >* `<group>` should be the ServiceNow group you want to assign the incident to
    >* `<email>` should be the specific person you want to assign the incident to (optional)
    >

    ```javascript
    (function process( /*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
        var apiKey = request.queryParams['apiKey'];
        var secret = '<secret>';
        if (apiKey == secret) {
            var event = request.body.data;
            var responseBody = {};
            if (event.data.context.activityLog.operationName == 'Microsoft.ServiceHealth/incident/action') {
                var inc = new GlideRecord('incident');
                var incidentExists = false;
                inc.addQuery('number', event.data.context.activityLog.properties.trackingId);
                inc.query();
                if (inc.hasNext()) {
                    incidentExists = true;
                    inc.next();
                } else {
                    inc.initialize();
                }
                var short_description = "Azure Service Health";
                if (event.data.context.activityLog.properties.incidentType == "Incident") {
                    short_description += " - Service Issue - ";
                } else if (event.data.context.activityLog.properties.incidentType == "Maintenance") {
                    short_description += " - Planned Maintenance - ";
                } else if (event.data.context.activityLog.properties.incidentType == "Informational" || event.data.context.activityLog.properties.incidentType == "ActionRequired") {
                    short_description += " - Health Advisory - ";
                }
                short_description += event.data.context.activityLog.properties.title;
                inc.short_description = short_description;
                inc.description = event.data.context.activityLog.properties.communication;
                inc.work_notes = "Impacted subscription: " + event.data.context.activityLog.subscriptionId;
                if (incidentExists) {
                    if (event.data.context.activityLog.properties.stage == 'Active') {
                        inc.state = 2;
                    } else if (event.data.context.activityLog.properties.stage == 'Resolved') {
                        inc.state = 6;
                    } else if (event.data.context.activityLog.properties.stage == 'Closed') {
                        inc.state = 7;
                    }
                    inc.update();
                    responseBody.message = "Incident updated.";
                } else {
                    inc.number = event.data.context.activityLog.properties.trackingId;
                    inc.state = 1;
                    inc.impact = 2;
                    inc.urgency = 2;
                    inc.priority = 2;
                    inc.assigned_to = '<email>';
                    inc.assignment_group.setDisplayValue('<group>');
                    var subscriptionId = event.data.context.activityLog.subscriptionId;
                    var comments = "Azure portal Link: https://app.azure.com/h";
                    comments += "/" + event.data.context.activityLog.properties.trackingId;
                    comments += "/" + subscriptionId.substring(0, 3) + subscriptionId.slice(-3);
                    var impactedServices = JSON.parse(event.data.context.activityLog.properties.impactedServices);
                    var impactedServicesFormatted = "";
                    for (var i = 0; i < impactedServices.length; i++) {
                        impactedServicesFormatted += impactedServices[i].ServiceName + ": ";
                        for (var j = 0; j < impactedServices[i].ImpactedRegions.length; j++) {
                            if (j != 0) {
                                impactedServicesFormatted += ", ";
                            }
                            impactedServicesFormatted += impactedServices[i].ImpactedRegions[j].RegionName;
                        }

                        impactedServicesFormatted += "\n";

                    }
                    comments += "\n\nImpacted Services:\n" + impactedServicesFormatted;
                    inc.comments = comments;
                    inc.insert();
                    responseBody.message = "Incident created.";
                }
            } else {
                responseBody.message = "Hello from the other side!";
            }
            response.setBody(responseBody);
        } else {
            var unauthorized = new sn_ws_err.ServiceError();
            unauthorized.setStatus(401);
            unauthorized.setMessage('Invalid apiKey');
            response.setError(unauthorized);
        }
    })(request, response);
    ```

1.  In the security tab, uncheck **Requires authentication** and select **Submit**. The `<secret>` you set protects this API instead.

    ![The "Requires Authentication" checkbox in ServiceNow](./media/webhook-alerts/servicenow-resource-settings.png)

1.  Back at the Scripted REST APIs section, you should find the **Base API Path** for your new REST API:

     ![The "Base API Path" in ServiceNow](./media/webhook-alerts/servicenow-base-api-path.png)

1.  Your full Integration URL looks like:

    ```http
    https://<yourInstanceName>.service-now.com/<baseApiPath>?apiKey=<secret>
    ```

## Create an alert using ServiceNow in the Azure portal
### For a new action group:
1. Follow steps 1 through 8 in [this article](./alerts-activity-log-service-notifications-portal.md) to create an alert with a new action group.

1. Define in the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The ServiceNow **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

1. Select **Save** when done to create the alert.

### For an existing action group:
1. In the [Azure portal](https://portal.azure.com/), select **Monitor**.

1. In the **Settings** section, select **Action groups**.

1. Find and select the action group you want to edit.

1. Add to the list of **Actions**:

    a. **Action Type:** *Webhook*

    b. **Details:** The ServiceNow **Integration URL** you previously saved.

    c. **Name:** Webhook's name, alias, or identifier.

1. Select **Save** when done to update the action group.

## Testing your webhook integration via an HTTP POST request
1. Create the service health payload you want to send. You can find an example service health webhook payload at [Webhooks for Azure activity log alerts](../azure-monitor/alerts/activity-log-alerts-webhook.md).

1. Create an HTTP POST request as follows:

    ```
    POST        https://<yourInstanceName>.service-now.com/<baseApiPath>?apiKey=<secret>

    HEADERS     Content-Type: application/json

    BODY        <service health payload>
    ```
1. You should receive a `200 OK` response with the message "Incident created."

1. Go to [ServiceNow](https://www.servicenow.com/) to confirm that your integration was set up successfully.

## Next steps
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Review the [activity log alert webhook schema](../azure-monitor/alerts/activity-log-alerts-webhook.md). 
- Learn about [service health notifications](./service-notifications.md).
- Learn more about [action groups](../azure-monitor/alerts/action-groups.md).
