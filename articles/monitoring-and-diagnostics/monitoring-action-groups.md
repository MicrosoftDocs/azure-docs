# Action Groups #
## Overview ##
This article shows you how to create and manage action groups in the Azure portal.

Action groups enable you to configure a list of receivers. These groups can then be leveraged when defining activity log alerts; ensuring that a particular action group is notified when the activity log alert is triggered.

An action group can have up to 10 of each action type. An action is defined by the combination of:

**Name:** A unique identifier within the action group.

**Action Type:** This defines the action that will be performed. Options are send SMS, send Email, or call a Webhook.

**Details:** Based on the action type, the corresponding phone number, email address or webhook URI needs to be provided.

You can configure and get information about service notification alerts using:
* [Azure Portal](monitoring-action-groups.md)
- [Resource Manager templates](monitoring-create-action-group-with-resource-manager-template.md)

## Creating an action group for the Azure portal ##
1.	In the [portal](https://portal.azure.com), navigate to the **Monitor** service

2.	Click the **Monitor** option to open up the Monitor blade. This blade brings together all your monitoring settings and data into one consolidated view. It first opens to the **Activity log** section.

3.	Now click on **Action groups** section

4.	Click on the **Add** action group command and fill in the fields

5.	Provide a **Name** and **Short Name** for the action group; The Short Name will be referenced in notifications sent to this group
6.	The **Subscription** is the one the Action group will be saved in. It will be auto filled to the subscription you are currently operating under.

7.	Choose the **Resource Group** for this action group.

8.	Then, define a list of actions through a combination of:

    a. **Name:** A unique identifier within the action group.

    b. **Action Type:** This defines the action that will be performed. Options are send SMS, send Email, or call a Webhook.

    c. **Details:** Based on the action type, the corresponding phone number, email address or webhook URI needs to be provided.
9.	Select **OK** when done to create the action group.

## Managing your action groups ##
Once you have created an action group, it will be visible in the Action groups section of the Monitor service. Select the action group you wish to manage, you will be able to:
* Add, edit, or remove receivers.
-	Delete the action group.

## Next Steps: ##
Learn more on [SMS alert behavior](monitoring-sms-alert-behavior.md)

Get an [understanding of the activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md)

Learn more about [rate limiting](monitoring-alerts-rate-limiting.md) on alerts

Get an [overview of activity log alerts](monitoring-overview-alerts.md) and learn how to get alerted

How to [configure alerts whenever a service notification is posted](monitoring-activity-log-alerts-on-service-notifications.md)
