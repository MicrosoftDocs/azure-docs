---
title: Configure AAD applicaiton permissions
titleSuffix: An Azure Communication Services quickstart
description: In this quick start we will learn how to setup the application permissions for being able to get access tokens for Teams users.
services: azure-communication-services
author: gistefan
ms.service: azure-communication-services
ms.subservice: identity

ms.topic: quickstart
ms.date: 10/08/2021
ms.author: gistefan
ms.reviewer: soricos
---

In this quick start we will learn how to setup the application permissions for being able to get access tokens for Teams users.

## Prerequisites

- A valid teams license. [How to get a teams license](https://support.microsoft.com/office/how-do-i-get-microsoft-teams-fc7f1634-abd3-4f26-a597-9df16e4ca65b)
- An AAD application that is part of the tenant with Teams license. [Create an AAD applicaiton](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal)

## Setting up

1. Navigate to your AAD app in the Azure portal and select "API permissions"
:::image type="content" source="./media/AadPermissions.png" alt-text="Screenshot of an AAD app API permissions section.":::

1. Select "Add Permissions"
:::image type="content" source="./media/AadPermissions2.png" alt-text="Screenshot of an AAD app API permissions section.":::

1. In the "Add Permissions" menu select "Azure Communication Services"
:::image type="content" source="./media/AadPermissions2.png" alt-text="Screenshot of an AAD app API permissions section.":::

1. Select the desired permissions "Voip" and/or "Teams.ManageCalls" and click "Add permissions"
:::image type="content" source="./media/AadPermissions2.png" alt-text="Screenshot of an AAD app API permissions section.":::