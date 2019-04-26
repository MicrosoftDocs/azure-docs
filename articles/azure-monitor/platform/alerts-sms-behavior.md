---
title: SMS Alert behavior in Action Groups
description: SMS message format and responding to SMS messages to unsubscribe, resubscribe or request help.
author: dkamstra
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 02/16/2018
ms.author: dukek
ms.subservice: alerts
---
# SMS Alert Behavior in Action Groups
## Overview ##
Action groups enable you to configure a list of actions. These groups are used when defining alerts; ensuring that a particular action group is notified when the alert is triggered. One of the actions supported is SMS; SMS notifications support bi-directional communication. A user may respond to an SMS to:

- **Unsubscribe from alerts:** A user may unsubscribe from all SMS alerts for all action groups, or a single action group.
- **Resubscribe to alerts:** A user may resubscribe to all SMS alerts for all action groups, or a single action group.  
- **Request help:** A user may ask for more information on the SMS. They are redirected to this article.

This article covers the behavior of the SMS alerts and the response actions the user can take based on the locale of the user:

## Receiving an SMS Alert
An SMS receiver configured as part of an action group receives an SMS when an alert is triggered. The SMS contains the following information:
* Shortname of the action group this alert was sent to
* Title of the alert

| REPLY | Description |
| ----- | ----------- |
| DISABLE `<Action Group Short name>` | Disables further SMS from the Action Group |
| ENABLE `<Action Group Short name>` | Re-enables SMS from the Action Group |
| STOP | Disables further SMS from all Action Groups |
| START | Re-enables SMS from ALL Action Groups |
| HELP | A response is sent to the user with a link to this article. |

>[!NOTE]
>If a user has unsubscribed from SMS alerts, but is then added to a new action group; they WILL receive SMS alerts for that new action group, but remain unsubscribed from all previous action groups.

## Next Steps
Get an [overview of activity log alerts](alerts-overview.md) and learn how to get alerted  
Learn more about [SMS rate limiting](alerts-rate-limiting.md)  
Learn more about [action groups](../../azure-monitor/platform/action-groups.md)

