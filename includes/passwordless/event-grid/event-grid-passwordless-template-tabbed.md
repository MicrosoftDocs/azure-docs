---
title: "include file"
description: "include file"
services: eventgrid
author: sonalika-roy
ms.service: eventgrid
ms.topic: include
ms.date: 05/30/2023
ms.author: sonalikaroy
ms.custom: include file
---

## Authenticate the app to Azure

This quick start shows you two ways of connecting to Azure Event Grid: **connection string**. 

This shows you how to use a connection string to connect to an Event Grid namespace. If you are new to Azure, you may find the connection string option easier to follow. 

## [Connection String](#tab/connection-string)
Creating a new event grid namespace automatically generates an initial primary and secondary keys that each grant full control over all aspects of the namespace or topics. 

A client can use the connection string to connect to the Event Grid namespace. To copy the access keys for your namespace topic, follow these steps: 

1. On the **Event Grid Namespace** page, select **Topics**.
2. Select the topic you need to access.
3. On the **Access keys** page, select the copy button next to **Key 1 or Key 2**, to copy the access keys to your clipboard for later use. Paste this value into Notepad or some other temporary location.