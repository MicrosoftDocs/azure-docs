---
title: SMS alert behavior in action groups
description: SMS message format and responding to SMS messages to unsubscribe, resubscribe, or request help.
services: monitoring
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: jagummersall
---

# SMS alert behavior in action groups

Action groups enable you to configure a list of actions. These groups are used when you define alerts. They ensure that a particular action group is notified when the alert is triggered. One of the actions supported is SMS. SMS notifications support bidirectional communication. A user can respond to an SMS to:

- **Unsubscribe from alerts:** A user can unsubscribe from all SMS alerts for all action groups or a single action group.
- **Resubscribe to alerts:** A user can resubscribe to all SMS alerts for all action groups or a single action group.
- **Request help:** A user can ask for more information on the SMS. Users are redirected to this article.

This article covers the behavior of SMS alerts and the response actions the user can take based on the locale of the user.

## Receive an SMS alert
An SMS receiver configured as part of an action group receives an SMS when an alert is triggered. The SMS contains the following information:

* Short name of the action group where this alert was sent
* Title of the alert

| REPLY | Description |
| ----- | ----------- |
| DISABLE `<Action Group Short name>` | Disables further SMS from the action group. |
| ENABLE `<Action Group Short name>` | Re-enables SMS from the action group. |
| STOP | Disables further SMS from all action groups. |
| START | Re-enables SMS from all action groups. |
| HELP | A response is sent to the user with a link to this article. |

>[!NOTE]
>If a user has unsubscribed from SMS alerts but is then added to a new action group, they *will* receive SMS alerts for that new action group but remain unsubscribed from all previous action groups.

## Next steps
* Get an [overview of activity log alerts](./alerts-overview.md) and learn how to get alerted.
* Learn more about [SMS rate limiting](alerts-rate-limiting.md).
* Learn more about [action groups](./action-groups.md).