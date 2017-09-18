-,--
title: Create and manage action groups in the Azure portal | Microsoft Docs
description: Learn how to create and manage action groups in the Azure portal.
author: anirudhcavale
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid:
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: ancav

---
# Create and manage action groups in the Azure portal
## Overview ##
This article shows you how to create and manage action groups in the Azure portal.

You can configure a list of actions with action groups. These groups then can be used when you define activity log alerts. These groups can then be reused by each activity log alert you define, ensuring that the same actions are taken each time the activity log alert is triggered.

An action group can have up to 10 of each action type. Each action is made up of the following properties:

* **Name**: A unique identifier within the action group.  
* **Action type**: Send an SMS, send an email, call a webhook, or send data to an ITSM tool.
* **Details**: The corresponding phone number, email address, webhook URI, or ITSM Connection Details.

For information on how to use Azure Resource Manager templates to configure action groups, see [Action group Resource Manager templates](monitoring-create-action-group-with-resource-manager-template.md).

## Create an action group by using the Azure portal ##
1. In the [portal](https://portal.azure.com), select **Monitor**. The **Monitor** blade consolidates all your monitoring settings and data in one view.

    ![The "Monitor" service](./media/monitoring-action-groups/home-monitor.png)
2. In the **Activity log** section, select **Action groups**.

    ![The "Action groups" tab](./media/monitoring-action-groups/action-groups-blade.png)
3. Select **Add action group**, and fill in the fields.

    ![The "Add action group" command](./media/monitoring-action-groups/add-action-group.png)
4. Enter a name in the **Action group name** box, and enter a name in the **Short name** box. The short name is used in place of a full action group name when notifications are sent using this group.

      ![The Add action group" dialog box](./media/monitoring-action-groups/action-group-define.png)

5. The **Subscription** box autofills with your current subscription. This subscription is the one in which the action group is saved.

6. Select the **Resource group** in which the action group is saved.

7. Define a list of actions by providing each action's:

    a. **Name**: Enter a unique identifier for this action.

    b. **Action Type**: Select SMS, email, webhook, or ITSM.

    c. **Details**: Based on the action type, enter a phone number, email address, webhook URI, or ITSM Connection details. For ITSM Action, additionally specify **Work Item** and other fields your ITSM tool requires. 

> [!NOTE]
> ITSM Action requires an ITSM Connection. Learn how to create an [ITSM Connection](../log-analytics/log-analytics-itsmc-overview.md). ITSM Action currently works only for Activity Log Alerts. For other alert types, this action currently is a no-op.
>
>

8. Select **OK** to create the action group.

## Manage your action groups ##
After you create an action group, it's visible in the **Action groups** section of the **Monitor** blade. Select the action group you want to manage to:

* Add, edit, or remove actions.
* Delete the action group.

## Next steps ##
* Learn more about [SMS alert behavior](monitoring-sms-alert-behavior.md).  
* Gain an [understanding of the activity log alert webhook schema](monitoring-activity-log-alerts-webhook.md).  
* Learn more about [ITSM Connector](../log-analytics/log-analytics-itsmc-overview.md)
* Learn more about [rate limiting](monitoring-alerts-rate-limiting.md) on alerts. 
* Get an [overview of activity log alerts](monitoring-overview-alerts.md), and learn how to receive alerts.  
* Learn how to [configure alerts whenever a service health notification is posted](monitoring-activity-log-alerts-on-service-notifications.md).
