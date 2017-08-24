---
title: Rate limiting for SMS, emails, and webhooks | Microsoft Docs
description: Understand how Azure limits the number of possible SMS, email, or webhook notifications from an action group.
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
ms.date: 03/31/2017
ms.author: ancav

---

# Rate limiting for SMS messages, emails, and webhook posts
Rate limiting is a suspension of notifications that occurs when too many notifications are sent to a particular phone number or email address. Rate limiting ensures that alerts are manageable and actionable.

The rules for SMS and email are the same. The rate limit threshold is:

 - **SMS**: 10 messages in an hour.
 - **Email**: 100 messages in an hour.

## Rate limit rules
- A particular phone number or email is rate limited when it receives more messages than the threshold allows.
- A phone number or email can be part of action groups across many subscriptions. Rate limiting applies across all subscriptions. It applies as soon as the threshold is reached, even if messages are sent from multiple subscriptions.  
- When a phone number or email is rate limited, an additional notification is sent to communicate the rate limiting. The notification states when the rate limiting expires.

## Rate limit of webhooks ##
There is no rate limiting in place for webhooks.

## Next steps ##
* Learn more about [SMS alert behavior](monitoring-sms-alert-behavior.md).
* Get an [overview of activity log alerts](monitoring-overview-alerts.md), and learn how to receive alerts.  
* Learn how to [configure alerts whenever a service health notification is posted](monitoring-activity-log-alerts-on-service-notifications.md).
