---
title: Azure Event Grid - deliver events to partner destinations
description: This article explains how to use a partner destination as a handler for events. 
ms.topic: how-to
ms.date: 03/31/2022
---

# Deliver events to a partner destination (Azure Event Grid)
In the Azure portal, when creating an event subscription for a topic (system topic, custom topic, domain, domain topic, or partner topic) or a domain, you can specify a partner destination as an endpoint. This article shows you how to create an event subscription using a partner destination so that events are delivered to a partner destination.

## Overview
As a end user, you give your partner the authorization to create a partner destination in a resource group within your Azure subscription. For details, see [Authorize partner to create a partner destination](subscribe-to-partner-events.md#authorize-partner-to-create-a-partner-topic). 

A partner creates a channel that in turn creates a partner destination in a resource group in end user's subscription. 

Then, you as an end user, can create event subscriptions to topics or domains using the partner destination as an endpoint. 

## Create an event subscription using partner destination

In the Azure portal, when creating an event subscription, follow these steps: 

1. In the **Endpoint details** section, select **Partner Destination** for **Endpoint Type**. 
1. Click **Select an endpoint**.
1. On the **Select Partner Destination** page, select the **Azure subscription** and **resource group** that contains the partner destination. 
1. For **Partner Destination**, select a partner destination. 
1. Select **Confirm selection**. 


## Next steps
See the following articles: 

- [Authorize partner to create a partner destination](subscribe-to-partner-events.md#authorize-partner-to-create-a-partner-topic)
- [Create a channel](onboard-partner.md#create-a-channel) - see the steps to create a channel with partner destination as the channel type. 