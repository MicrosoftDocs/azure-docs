---
title: Manage permissions to the KQL consumption URL for Azure Operator Insights
description: Learn how to add and remove user permissions to the KQL consumption URL for Azure Operator Insights.
author: rcdun
ms.author: rdunstan
ms.reviewer: duncanarcher
ms.service: operator-insights
ms.topic: how-to
ms.date: 1/06/2024
---

# Manage permissions to the KQL consumption URL

Azure Operator Insights enables you to control access to the KQL consumption URL of each Data Product based on email addresses or distribution lists. Use the following steps to configure read-only access to the consumption URL.

Azure Operator Insights supports a single role that gives Read access to all tables and columns on the consumption URL.

## Add user access

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Azure Operator Insights Data Product resource.
1. In the left-hand menu under **Security**, select **Permissions**.
1. Select **Add Reader** to add a new user.
1. Type in the user's email address or distribution list and select **Add Reader(s)**.
1. Wait for about 30 seconds, then refresh the page to view your changes.

## Remove user access

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Azure Operator Insights Data Product resource.
1. In the left-hand menu under **Security**, select **Permissions**.
1. Select the **Delete** symbol next to the user who you want to remove. 
    > [!NOTE]
    > There is no confirmation dialog box, so be careful when deleting users.
1. Wait for about 30 seconds, then refresh the page to view your changes.
