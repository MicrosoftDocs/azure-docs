---
title: Azure Event Grid - Subscribe to partner events 
description: This article explains how to subscribe to events from a partner using Azure Event Grid.
ms.topic: how-to
ms.date: 10/31/2022
---

# Subscribe to events published by a partner with Azure Event Grid
This article describes steps to subscribe to events that originate in a system owned or managed by a partner (SaaS, ERP, etc.). 

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md) to understand the rationale of the steps in this article.


## High-level steps

Here are the steps that a subscriber needs to perform to receive events from a partner.

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
2. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
3. [Request partner to enable events flow to a partner topic](#request-partner-to-enable-events-flow-to-a-partner-topic).
4. [Activate partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).

[!INCLUDE [register-provider](./includes/register-provider.md)]

[!INCLUDE [authorize-partner-to-create-topic](includes/authorize-partner-to-create-topic.md)]



## Request partner to enable events flow to a partner topic

Here's the list of partners and a link to submit a request to enable events flow to a partner topic.

- [Auth0](auth0-how-to.md)
- [Microsoft Graph API](subscribe-to-graph-api-events.md)
- [SAP](subscribe-to-sap-events.md)
- [Tribal Group](subscribe-to-tribal-group-events.md)


[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

## Next steps 

See the following articles for more details about the Partner Events feature:

- [Partner Events overview for customers](partner-events-overview.md)
- [Partner Events overview for partners](partner-events-overview-for-partners.md)
- [Onboard as a partner](onboard-partner.md)
