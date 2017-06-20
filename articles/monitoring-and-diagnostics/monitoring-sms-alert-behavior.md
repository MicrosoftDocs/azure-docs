---
title: SMS Alert behavior in Action Groups | Microsoft Docs
description: SMS message format and responding to SMS messages to unsubscribe, resubscribe or request help.
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
# SMS Alert Behavior in Action Groups
## Overview ##
Action groups enable you to configure a list of receivers. These groups can then be leveraged when defining activity log alerts; ensuring that a particular action group is notified when the activity log alert is triggered. One of the alerting mechanisms supported is SMS; the alerts support bi-directional communication. A user can respond to an alert to:

- **Unsubscribe from alerts:** A user can unsubscribe from all SMS alerts for all action groups, or a singular action group.  
- **Resubscribe to alerts:** A user can resubscribe to all SMS alerts for all action groups, or a singular action group.  
- **Request help:** A user can ask for more information on the SMS. They will be redirected to this article

This article covers the behavior of the SMS alerts and the response actions the user can take based on the locale of the user:

## USA/Canada SMS behavior
### Receiving an SMS Alert
An SMS receiver, who is configured as part of an action group, will receive an SMS when an alert fires. The SMS will carry the following information:
* Shortname of the action group this alert was sent to
- Title of the alert

### Unsubscribing from SMS alerts for one action group
A user can unsubscribe from SMS for alerts for one action group by responding to the shortcode 20873 with the keywords: “DISABLE &lt;Shortname of action group&gt;”.

Ex. A user wishing to unsubscribe from alerts for an action group with the shortname “Azure”, would send an SMS to the shortcode 20873 that says “DISABLE Azure”

### Unsubscribing from SMS alerts for all action groups
A user can unsubscribe from all SMS alerts for all action groups by responding to the shortcode 20873 with any of the following keywords:
* STOP

Ex. A user wishing to unsubscribe from all SMS alerts for all action groups, would send an SMS to the shortcode 20873 that says “STOP”

>[!NOTE]
>If a user has unsubscribed from SMS alerts, but is then added to a new action group; they WILL receive SMS alerts for that new action group, but remain unsubscribed from all previous action groups.
>
>

### Resubscribing to SMS alerts for one action group
A user can resubscribe to SMS for alerts for one action group by responding to the shortcode 20873 with the keywords: “ENABLE &lt;Shortname of action group&gt;”.

Ex. A user wishing to resubscribe to alerts for an action group with the shortname “Azure”, would send an SMS to the shortcode 20873 that says “ENABLE Azure”

### Resubscribing to SMS alerts for all action groups
A user can resubscribe to all SMS for alerts for all action groups by responding to the shortcode 20873 with any of the following keywords:

* START

Ex. A user wishing to unsubscribe from all SMS alerts for all action groups, would send an SMS to the shortcode 20873 that says “START”

### Requesting help via SMS
A user can ask for more information about the SMS they have received by responding to the shortcode 20873 with any of the following keywords:
* HELP

A response will be sent to the user with a link to this article.

## Next Steps
Get an [overview of activity log alerts](monitoring-overview-alerts.md) and learn how to get alerted  
Learn more about [SMS rate limiting](monitoring-alerts-rate-limiting.md)  
Learn more about [action groups](monitoring-action-groups.md)
