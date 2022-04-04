---
title: Azure Event Grid - deliver events to partner destinations
description: This article explains how to use a partner destination as a handler for events. 
ms.topic: how-to
ms.date: 03/31/2022
---

# Deliver events to a partner destination (Azure Event Grid)
In the Azure portal, when creating an event subscription for a topic (system topic, custom topic, domain topic, or partner topic) or a domain, you can specify a partner destination as an endpoint. This article shows you how to create an event subscription using a partner destination so that events are delivered to a partner system.

## Overview
As an end user, you give your partner the authorization to create a partner destination in a resource group within your Azure subscription. For details, see [Authorize partner to create a partner destination](subscribe-to-partner-events.md#authorize-partner-to-create-a-partner-topic). 

A partner creates a channel that in turn creates a partner destination in the Azure subscription and a resource group you provided to the partner. Prior to using it, you must activate the partner destination. Once activated, you can select the partner destination as a delivery endpoint when creating or updating event subscriptions.

## Activate a partner destination
Before you can use a partner destination as an endpoint for an event subscription, you need to activate the partner destination. 

1. In the search bar of the Azure portal, search for and select **Event Grid Partner Destinations**.
1. On the **Event Grid Partner Destinations** page, select the partner destination in the list. 
1. Review the activate message, and select **Activate** on the page or on the command bar to activate the partner topic before the expiration time mentioned on the page. 
1. Confirm that the activation status is set to **Activated**.


## Create an event subscription using partner destination

In the Azure portal, when creating an [event subscription](subscribe-through-portal.md), follow these steps:

1. In the **Endpoint details** section, select **Partner Destination** for **Endpoint Type**. 
1. Click **Select an endpoint**.

    :::image type="content" source="./media/deliver-events-to-partner-destinations/select-endpoint-link.png" alt-text="Screenshot showing the Create Event Subscription page with Select an endpoint link selected.":::
1. On the **Select Partner Destination** page, select the **Azure subscription** and **resource group** that contains the partner destination. 
1. For **Partner Destination**, select a partner destination. 
1. Select **Confirm selection**. 

    :::image type="content" source="./media/deliver-events-to-partner-destinations/subscription-partner-destination.png" alt-text="Screenshot showing the Select Partner Destination page.":::
1. On the **Create Event Subscription** page, confirm that you see **Endpoint Type** is set to **Partner Destination**, and the endpoint is set to a partner destination, and then select **Create**. 

    :::image type="content" source="./media/deliver-events-to-partner-destinations/partner-destination-configure.png" alt-text="Screenshot showing the Create Event Subscription page with a partner destination configured.":::

## Next steps
See the following articles: 

- [Authorize partner to create a partner destination](subscribe-to-partner-events.md#authorize-partner-to-create-a-partner-topic)
- [Create a channel](onboard-partner.md#create-a-channel) - see the steps to create a channel with partner destination as the channel type. 