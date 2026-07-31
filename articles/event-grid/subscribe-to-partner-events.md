---
title: Azure Event Grid - Subscribe to partner events 
description: Subscribe to events from partner systems like SaaS and ERP platforms by using Azure Event Grid partner topics.
ms.topic: how-to
ms.date: 06/11/2026
ai-usage: ai-assisted
# Customer intent: As a developer or an architect, I want to know how to subscribe to SAP events or events from other partners. 
---

# Subscribe to events published by a partner with Azure Event Grid
This article describes how to subscribe to events from a system owned or managed by a partner, such as SaaS or Enterprise Resource Planning (ERP) platforms.

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md) to understand the rationale of the steps in this article.


## High-level steps

Follow these steps to receive events from a partner.

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
1. [Request partner to enable events flow to a partner topic](#request-partner-to-enable-events-flow-to-a-partner-topic).
1. [Activate partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
1. [Subscribe to events](#subscribe-to-events).

[!INCLUDE [register-provider](./includes/register-provider.md)]

[!INCLUDE [authorize-partner-to-create-topic](includes/authorize-partner-to-create-topic.md)]



## Request partner to enable events flow to a partner topic

The following partners support events flow to a partner topic. Select a partner to submit a request.

- [Auth0](auth0-how-to.md)
- [Microsoft Graph API](subscribe-to-graph-api-events.md)
- [Tribal Group](subscribe-to-tribal-group-events.md)


[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

## Related content
For more information about the Partner Events feature, see the following articles:

- [Partner Events overview for customers](partner-events-overview.md)
- [Partner Events overview for partners](partner-events-overview-for-partners.md)
- [Onboard as a partner](onboard-partner.md)
