---
title: Get access key to an Event Grid namespace topic
description: Include file with steps to get an access key to an Azure Event Grid namespace topic. 
services: eventgrid
author: sonalika-roy
ms.service: eventgrid
ms.topic: include
ms.date: 06/19/2024
ms.author: sonalikaroy
ms.custom: include file
---

## Authenticate the app to Azure

This quick start shows you ways of connecting to Azure Event Grid: **connection string**. This section shows you how to use a connection string to connect to an Event Grid namespace. If you're new to Azure, the connection string option is easier to follow. Creating a new Event Grid namespace automatically generates an initial primary and secondary key that each grant full control over all aspects of the namespace or topics. A client can use the connection string to connect to the Event Grid namespace. To copy the access keys for your namespace topic, follow these steps: 

1. On the **Event Grid Namespace** page, select **Topics**.
2. Select the topic you need to access.
3. On the **Access keys** page, select the copy button next to **Key 1 or Key 2**, to copy the access keys to your clipboard for later use. Paste this value into Notepad or some other temporary location.

    :::image type="content" source="./media/event-grid-passwordless-template-tabbed/topic-access-key.png" alt-text="Screenshot that shows the access key for an Event Grid topic." lightbox="./media/event-grid-passwordless-template-tabbed/topic-access-key.png":::
