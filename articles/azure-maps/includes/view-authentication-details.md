---
title: View authentication details of Azure Maps
description: Use the Azure portal to view authentication details of Azure Maps.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/17/2020
ms.topic: include
ms.service: azure-maps
services: azure-maps
manager: timlt
---

You can view the Azure Maps account authentication details in the Azure portal. There, in your account, on the **Settings** menu, select **Authentication**.

![Authentication details](../media/how-to-manage-authentication/how-to-view-auth.png)

Once an Azure Maps account is created, the Azure Maps `x-ms-client-id` value is present in the Azure portal authentication details page. This value represents the account which will be used for REST API requests. This value should be stored in application configuration and retrieved prior to making http requests when using Azure AD authentication with Azure Maps.
