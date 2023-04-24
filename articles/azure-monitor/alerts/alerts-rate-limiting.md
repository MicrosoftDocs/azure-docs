---
title: Rate limiting for SMS, emails, push notifications
description: Understand how Azure limits the number of possible SMS, email, Azure App Service push, or webhook notifications from an action group.
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: jagummersall
---

# Rate limiting for voice, SMS, emails, Azure App Service push notifications, and webhook posts
Rate limiting is a suspension of notifications that occurs when too many notifications are sent to a particular phone number, email address, or device. Rate limiting ensures that alerts are manageable and actionable.

The rate limit thresholds in **production** are:

- **SMS**: No more than one SMS every 5 minutes.
- **Voice**: No more than one voice call every 5 minutes.
- **Email**: No more than 100 emails in an hour.

  Other actions aren't rate limited.

The rate limit thresholds for **test action group** are:

- **SMS**: No more than one SMS every 1 minute.
- **Voice**: No more than one voice call every 1 minute.
- **Email**: No more than two emails in every 1 minute.

  Other actions aren't rate limited.

## Rate limit rules
- A particular phone number or email is rate limited when it receives more messages than the threshold allows.
- A phone number or email can be part of action groups across many subscriptions. Rate limiting applies across all subscriptions. It applies as soon as the threshold is reached, even if messages are sent from multiple subscriptions.
- When an email address is rate limited, another notification is sent to communicate the rate limiting. The email states when the rate limiting expires.

## Next steps ##
* Learn more about [SMS alert behavior](alerts-sms-behavior.md).
* Get an [overview of activity log alerts](./alerts-overview.md) and learn how to receive alerts.
* Learn how to [configure alerts whenever a service health notification is posted](../../service-health/alerts-activity-log-service-notifications-portal.md).
