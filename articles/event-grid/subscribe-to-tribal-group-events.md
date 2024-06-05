---
title: Azure Event Grid - Subscribe to Tribal Group events
description: This article explains how to subscribe to events published by Tribal Group.
ms.topic: how-to
ms.date: 10/25/2022
---

# Subscribe to events published by Tribal Group
This article describes steps to subscribe to events published by [Tribal Group's Edge Education Platform](https://www.tribalgroup.com/solutions/cloud-and-data-services/tribal-cloud-services). 


## Prerequisites

Following are the prerequisites that your system needs to meet before attempting to configure your Tribal Group system to send events to Azure Event Grid.

- Azure subscription to use Azure Event Grid and Microsoft Power Automate.
- Admissions account with permissions to use the Edge Admin application.


## High-level steps

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
1. [Enable Tribal Group events to flow to a partner topic](#enable-events-to-flow-to-your-partner-topic).
4. [Activate partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).

[!INCLUDE [register-provider](./includes/register-provider.md)]

[!INCLUDE [authorize-verified-partner-to-create-topic](includes/authorize-verified-partner-to-create-topic.md)]


## Enable events to flow to your partner topic

Follow instructions from [How to set up event streams to Azure Event Grid](https://help.tribaledge.com/emea/edge/Connectors/PowerAutomate/how-to-setup-azure-events.htm) to set up Tribal Group event streams that are sent to your partner topic. Once you configure your event stream and it's active, you should have a partner topic created. 


[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

## Next steps
See [subscribe to partner events](subscribe-to-partner-events.md).
