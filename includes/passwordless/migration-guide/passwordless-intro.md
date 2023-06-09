---
title: "include file"
description: "include file"
services: event-hubs
author: alexwolfmsft
ms.service: event-hubs
ms.topic: include
ms.date: 6/09/2023
ms.author: alexwolf
ms.custom: include file
---

Application requests to Azure services must be authenticated using configurations such as account access keys or passwordless connections. However, you should prioritize passwordless connections in your applications when possible. Traditional authentication methods that use passwords or secret keys create security risks and complications. Visit the [passwordless connections for Azure services](/azure/developer/intro/passwordless-overview) hub to learn more about the advantages of moving to passwordless connections.

The following tutorial explains how to migrate an existing application to connect using passwordless connections. These same migration steps should apply whether you're using access keys, connection strings, or another secrets-based approach.