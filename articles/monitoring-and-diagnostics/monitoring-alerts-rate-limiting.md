---
title: Rate Limiting for SMS, Emails and Webhooks | Microsoft Docs
description: Be notified via SMS, webhook, and email when certain events occur in the Activity log.
author: anirudhcavale
manager: carmonm
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

# Rate Limiting for SMS, Emails and Webhooks
Rate limiting is a suspension of notifications that occurs when too many are sent to a particular phone number or email. Limiting ensures that communication around activity log alerts and service health alerts are manageable and actionable

The rules for SMS and Email are the same. The rate limit threshold for
 - SMS - 10 messages in an hour
 - Email - 100 messages in an hour

## Rate Limit rules
- A particular phone number or email is rate limited when it receives more than the threshold
- A phone number or email can be part of action groups across many subscriptions. Rate limiting applies across all subscriptions, that is, it applies as soon as the threshold is reached even if sent from multiple subscriptions.  
- When a phone number or email is rate limited, an additional message of the same type is sent to communicate the rate limiting. The SMS or email states when the rate limiting expires.

## Rate Limit of Webhooks ##
There is no rate limiting in place for webhooks today.

## Next Steps ##
Learn more on [SMS alert behavior](monitoring-sms-alert-behavior.md)  
Get an [overview of activity log alerts](monitoring-overview-alerts.md) and learn how to get alerted  
How to [configure alerts whenever a service health notification is posted](monitoring-activity-log-alerts-on-service-notifications.md)
